import { NextResponse } from 'next/server'
import { getBlogStats } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const stats = await getBlogStats()

    return NextResponse.json(stats)

  } catch (error) {
    logger.error('Blog stats API error', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch blog stats' },
      { status: 500 }
    )
  }
}