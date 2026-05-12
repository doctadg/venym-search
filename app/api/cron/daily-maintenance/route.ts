import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, updateBlogMetrics, getTrendingTopics, updateTrendingTopic } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

// Daily maintenance tasks
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authToken = (request.headers.get('authorization') || '')
    .split('Bearer ')
    .at(1)
  
  if (!authToken || authToken !== process.env.CRON_SECRET) {
    logger.warn('Unauthorized cron request', { 
      userAgent: request.headers.get('user-agent') ?? undefined,
      ip: request.headers.get('x-forwarded-for') ?? undefined,
      hasAuthHeader: !!request.headers.get('authorization'),
      authHeaderStart: request.headers.get('authorization')?.substring(0, 20) + '...'
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  
  try {
    logger.info('Starting daily maintenance cron job')

    const tasks = {
      postsUpdated: 0,
      metricsUpdated: 0,
      topicsAnalyzed: 0,
      inactiveTopicsArchived: 0
    }

    // Task 1: Update blog post metrics and engagement scores
    const recentPosts = await getBlogPosts({
      limit: 50,
      status: 'PUBLISHED',
      orderBy: 'published_at',
      orderDirection: 'desc'
    })

    for (const post of recentPosts) {
      if (post.metrics) {
        // Calculate engagement score based on views, time, and other factors
        const daysSincePublished = post.published_at ? 
          Math.floor((Date.now() - new Date(post.published_at).getTime()) / (1000 * 60 * 60 * 24)) : 1
        
        const engagementScore = Math.min(
          (post.metrics.views / Math.max(daysSincePublished, 1)) * 0.1 + 
          (post.metrics.social_shares * 2) + 
          (post.reading_time && post.reading_time > 0 ? Math.min(post.reading_time / 5, 2) : 0),
          10
        )

        await updateBlogMetrics(post.id, {
          engagement_score: Math.round(engagementScore * 10) / 10
        })
        
        tasks.metricsUpdated++
      }
    }

    // Task 2: Analyze and update trending topics
    const activeTopics = await getTrendingTopics({
      limit: 100,
      isActive: true
    })

    for (const topic of activeTopics) {
      const daysSinceAnalyzed = Math.floor(
        (Date.now() - new Date(topic.last_analyzed).getTime()) / (1000 * 60 * 60 * 24)
      )

      // Decay trend score over time
      if (daysSinceAnalyzed > 0) {
        const decayFactor = Math.max(0.1, 1 - (daysSinceAnalyzed * 0.1))
        const newTrendScore = topic.trend_score * decayFactor

        await updateTrendingTopic(topic.id, {
          trend_score: newTrendScore,
          is_active: newTrendScore > 0.2, // Deactivate low-scoring topics
          last_analyzed: new Date()
        })

        if (newTrendScore <= 0.2) {
          tasks.inactiveTopicsArchived++
        } else {
          tasks.topicsAnalyzed++
        }
      }
    }

    // Task 3: Cleanup old jobs (older than 30 days)
    // This would be implemented with a direct Prisma query if needed

    const processingTime = Date.now() - startTime

    logger.info('Daily maintenance completed successfully', { 
      ...tasks,
      processingTime: `${processingTime}ms`
    })

    return NextResponse.json({
      success: true,
      message: 'Daily maintenance completed',
      timestamp: new Date().toISOString(),
      tasks,
      processingTime: `${processingTime}ms`
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    
    logger.error('Daily maintenance failed', {
      processingTime: `${processingTime}ms`
    }, error as Error)

    return NextResponse.json({
      success: false,
      error: 'Daily maintenance failed',
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}ms`
    }, { status: 500 })
  }
}