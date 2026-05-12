import { NextResponse } from 'next/server'
import { getTrendingTopics } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const topics = await getTrendingTopics({
      limit: 10,
      isActive: true,
      minTrendScore: 0.5,
      orderBy: 'trend_score'
    })

    return NextResponse.json({
      topics: topics.map(topic => ({
        id: topic.id,
        keyword: topic.keyword,
        topic_category: topic.topic_category,
        trend_score: topic.trend_score,
        last_analyzed: topic.last_analyzed
      }))
    })

  } catch (error) {
    logger.error('Trending topics API error', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    )
  }
}