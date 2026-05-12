import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { getUserAnalytics, getUserApiRequests } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get analytics using the optimized function
    const analytics = await getUserAnalytics(authResult.user.id)
    
    // Get recent requests for additional calculations
    const recentRequests = await getUserApiRequests(authResult.user.id, 1000)
    
    // Calculate success rate and average latency
    const successfulRequests = recentRequests.filter(req => req.status_code < 400).length
    const successRate = analytics.totalRequests > 0 ? (successfulRequests / analytics.totalRequests) * 100 : 0
    const avgLatency = analytics.totalRequests > 0 ? 
      recentRequests.reduce((sum, req) => sum + (req.latency_ms || 0), 0) / analytics.totalRequests : 0

    // Calculate changes (last 30 days vs previous 30 days)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const previous30Days = recentRequests.filter(req => {
      const date = new Date(req.created_at)
      return date >= sixtyDaysAgo && date < thirtyDaysAgo
    })

    const requestsChange = previous30Days.length > 0 ? 
      ((analytics.requestsLast30Days - previous30Days.length) / previous30Days.length) * 100 : 0

    const previousCredits = previous30Days.reduce((sum, req) => sum + req.credits_used, 0)
    const creditsChangePercent = previousCredits > 0 ? 
      ((analytics.creditsUsedLast30Days - previousCredits) / previousCredits) * 100 : 0

    return NextResponse.json({
      stats: {
        total_requests: analytics.totalRequests,
        credits_used: analytics.totalCreditsUsed,
        success_rate: Math.round(successRate * 10) / 10,
        avg_latency: Math.round(avgLatency),
        requests_change: Math.round(requestsChange * 10) / 10,
        credits_change: Math.round(creditsChangePercent * 10) / 10,
        success_rate_change: 0.2, // TODO: Calculate actual success rate change
        latency_change: -15, // TODO: Calculate actual latency change
      }
    })

  } catch (error) {
    logger.error('Dashboard stats error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}