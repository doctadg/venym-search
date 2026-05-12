import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContentGeneratorService } from '@/lib/seo-automation/content-generator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status.toUpperCase()
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              full_name: true,
              email: true
            }
          },
          seo_data: true
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      keyword, 
      targetLength, 
      tone, 
      includeImages, 
      includeCodeExamples, 
      targetAudience,
      authorId,
      autoPublish = false
    } = body

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    // Get API keys from environment or user settings
    const openaiApiKey = process.env.OPENAI_API_KEY
    const searchApiKey = process.env.VENYM_SEARCH_API_KEY || 'internal'

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const contentGenerator = new ContentGeneratorService(openaiApiKey, searchApiKey)

    // Generate the blog post
    const generatedContent = await contentGenerator.generateBlogPost({
      keyword,
      targetLength,
      tone,
      includeImages,
      includeCodeExamples,
      targetAudience
    })

    // Save to database
    const blogPostId = await contentGenerator.saveBlogPost(generatedContent, authorId)

    // Auto-publish if requested
    if (autoPublish) {
      await prisma.blogPost.update({
        where: { id: blogPostId },
        data: { 
          status: 'PUBLISHED',
          published_at: new Date()
        }
      })
    }

    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      blogPost,
      message: autoPublish ? 'Blog post generated and published' : 'Blog post generated successfully'
    })
  } catch (error) {
    console.error('Error generating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    )
  }
}