import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createBlogPost } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const authToken=(request.headers.get('Authorization') || '').split('Bearer ').at(1)
    if (!authToken || authToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, category, tags } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    }

    // Generate slug the same way blog-service.ts does
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)

    // Check for existing slug — prevent duplicate content
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({
        success: false,
        error: `Duplicate slug: ${slug}`,
        existing_id: existing.id,
        title
      }, { status: 409 })
    }

    const post = await createBlogPost({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      meta_title: title,
      meta_description: excerpt || content.substring(0, 160),
      keywords: tags || [],
      category: category || 'API Development',
      tags: tags || [],
      status: 'PUBLISHED',
      generated_by_ai: true,
      source_keywords: tags || [],
      target_keywords: tags || []
    })

    if (!post) {
      return NextResponse.json({ error: 'Failed to create post', title, contentLength: content.length }, { status: 500 })
    }

    // Purge ISR caches so sitemap and blog pages reflect the new post immediately
    try {
      revalidatePath('/sitemap.xml')
      revalidatePath('/blog')
      revalidatePath(`/blog/${post.slug}`)
    } catch (revalErr) {
      // Non-fatal — caches will eventually refresh via revalidate interval
      logger.warn('Revalidation failed after publish', revalErr as Error)
    }

    return NextResponse.json({ success: true, id: post.id, slug: post.slug })
  } catch (error) {
    logger.error('Publish endpoint error', error as Error)
    return NextResponse.json({ error: 'Publish failed' }, { status: 500 })
  }
}
