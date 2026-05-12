import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, getBlogStats } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') as 'created_at' | 'published_at' | 'views' || 'published_at'

    const offset = (page - 1) * limit

    const posts = await getBlogPosts({
      limit,
      offset,
      status: 'PUBLISHED',
      category: category || undefined,
      search: search || undefined,
      orderBy,
      orderDirection: 'desc'
    })

    return NextResponse.json({
      posts,
      page,
      limit,
      hasMore: posts.length === limit
    })

  } catch (error) {
    logger.error('Blog posts API error', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}