import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      const isConnectionError = error?.message?.includes('Engine is not yet connected') || 
                               error?.code === 'P2034' || 
                               error?.message?.includes('prepared statement') || 
                               error?.message?.includes('s0')
      
      if (isConnectionError && attempt < maxRetries) {
        logger.warn('Retrying database operation', { attempt: attempt + 1, maxRetries, error: error.message })
        await new Promise(resolve => setTimeout(resolve, 200 * attempt))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authUser = authResult.user

    // Get user details with retry logic
    const user = await executeWithRetry(() => 
      prisma.user.findUnique({
        where: { id: authUser.id },
        select: {
          plan: true,
          credits_remaining: true,
        }
      })
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate date ranges
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))

    // Get total requests (all time)
    const totalRequests = await executeWithRetry(() => 
      prisma.apiRequest.count({
        where: { user_id: authUser.id }
      })
    )

    // Get requests from last 30 days for comparison
    const requestsLast30Days = await executeWithRetry(() => 
      prisma.apiRequest.count({
        where: {
          user_id: authUser.id,
          created_at: {
            gte: thirtyDaysAgo
          }
        }
      })
    )

    // Get requests from last 7 days for comparison
    const requestsLast7Days = await executeWithRetry(() => 
      prisma.apiRequest.count({
        where: {
          user_id: authUser.id,
          created_at: {
            gte: sevenDaysAgo
          }
        }
      })
    )

    // Calculate total credits used
    const creditsUsedResult = await executeWithRetry(() => 
      prisma.apiRequest.aggregate({
        where: { user_id: authUser.id },
        _sum: {
          credits_used: true,
        }
      })
    )

    const totalCreditsUsed = creditsUsedResult._sum.credits_used || 0

    // Calculate credits used in last 30 days
    const creditsUsedLast30DaysResult = await executeWithRetry(() => 
      prisma.apiRequest.aggregate({
        where: {
          user_id: authUser.id,
          created_at: {
            gte: thirtyDaysAgo
          }
        },
        _sum: {
          credits_used: true,
        }
      })
    )

    const creditsUsedLast30Days = creditsUsedLast30DaysResult._sum.credits_used || 0

    // Calculate success rate
    const successfulRequests = await executeWithRetry(() => 
      prisma.apiRequest.count({
        where: {
          user_id: authUser.id,
          status_code: {
            gte: 200,
            lt: 400
          }
        }
      })
    )

    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100

    // Calculate success rate for last 30 days
    const successfulRequestsLast30Days = await executeWithRetry(() => 
      prisma.apiRequest.count({
        where: {
          user_id: authUser.id,
          status_code: {
            gte: 200,
            lt: 400
          },
          created_at: {
            gte: thirtyDaysAgo
          }
        }
      })
    )

    const successRateLast30Days = requestsLast30Days > 0 ? (successfulRequestsLast30Days / requestsLast30Days) * 100 : 100

    // Calculate average latency (total - includes all overhead)
    const avgLatencyResult = await executeWithRetry(() => 
      prisma.apiRequest.aggregate({
        where: {
          user_id: authUser.id,
          latency_ms: {
            not: null
          }
        },
        _avg: {
          latency_ms: true,
        }
      })
    )

    const avgLatency = avgLatencyResult._avg.latency_ms || 0

    // Calculate average backend latency (just the backend API call time)
    const avgBackendLatencyResult = await executeWithRetry(() => 
      prisma.apiRequest.aggregate({
        where: {
          user_id: authUser.id,
          backend_latency_ms: {
            not: null
          }
        },
        _avg: {
          backend_latency_ms: true,
        }
      })
    )

    const avgBackendLatency = avgBackendLatencyResult._avg.backend_latency_ms || 0

    // Use backend latency as the primary metric; fall back to total latency
    // if no backend latency data exists yet (for historical records)
    const primaryLatency = avgBackendLatency > 0 ? avgBackendLatency : avgLatency

    // Calculate average latency for last 30 days
    const avgLatencyLast30DaysResult = await executeWithRetry(() => 
      prisma.apiRequest.aggregate({
        where: {
          user_id: authUser.id,
          latency_ms: {
            not: null
          },
          created_at: {
            gte: thirtyDaysAgo
          }
        },
        _avg: {
          latency_ms: true,
        }
      })
    )

    const avgLatencyLast30Days = avgLatencyLast30DaysResult._avg.latency_ms || 0

    // Calculate average backend latency for last 30 days
    const avgBackendLatencyLast30DaysResult = await executeWithRetry(() => 
      prisma.apiRequest.aggregate({
        where: {
          user_id: authUser.id,
          backend_latency_ms: {
            not: null
          },
          created_at: {
            gte: thirtyDaysAgo
          }
        },
        _avg: {
          backend_latency_ms: true,
        }
      })
    )

    const avgBackendLatencyLast30Days = avgBackendLatencyLast30DaysResult._avg.backend_latency_ms || 0
    const primaryLatencyLast30Days = avgBackendLatencyLast30Days > 0 ? avgBackendLatencyLast30Days : avgLatencyLast30Days

    // Calculate percentage changes
    const requestsChange = requestsLast7Days > 0 ? ((requestsLast7Days / (requestsLast30Days - requestsLast7Days || 1)) * 100).toFixed(1) : '0'
    const creditsChange = creditsUsedLast30Days > 0 ? ((creditsUsedLast30Days / (totalCreditsUsed - creditsUsedLast30Days || 1)) * 100).toFixed(1) : '0'
    const successRateChange = (successRateLast30Days - successRate).toFixed(1)
    const latencyChange = primaryLatencyLast30Days > 0 ? (primaryLatency - primaryLatencyLast30Days).toFixed(0) : '0'

    // Get recent activity (last 10 requests)
    const recentActivity = await executeWithRetry(() => 
      prisma.apiRequest.findMany({
        where: { user_id: authUser.id },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          endpoint: true,
          method: true,
          status_code: true,
          created_at: true,
          credits_used: true,
          latency_ms: true,
          backend_latency_ms: true,
          request_data: true,
        }
      })
    )

    // Helper: format latency string showing backend as primary, total in parens if significantly different
    const formatLatency = (backendMs: number | null, totalMs: number | null): string => {
      if (!backendMs && !totalMs) return 'N/A'
      if (!backendMs) return `${totalMs}ms`
      if (!totalMs) return `${backendMs}ms`
      // Show total in parentheses if it's more than 2s higher than backend
      const diff = totalMs - backendMs
      if (diff > 2000) {
        return `${backendMs}ms (total: ${totalMs}ms)`
      }
      return `${backendMs}ms`
    }

    return NextResponse.json({
      stats: {
        total_requests: {
          value: totalRequests,
          change: `+${requestsChange}%`,
        },
        credits_used: {
          value: totalCreditsUsed,
          change: `+${creditsChange}%`,
        },
        success_rate: {
          value: successRate.toFixed(1),
          change: `${parseFloat(successRateChange) >= 0 ? '+' : ''}${successRateChange}%`,
        },
        avg_latency: {
          value: Math.round(primaryLatency),
          change: `${parseFloat(latencyChange) >= 0 ? '+' : ''}${latencyChange}ms`,
        },
      },
      user: {
        plan: user.plan,
        credits_remaining: user.credits_remaining,
      },
      recent_activity: recentActivity.map(request => ({
        id: request.id,
        endpoint: request.endpoint,
        method: request.method,
        status: request.status_code,
        timestamp: request.created_at.toISOString(),
        credits: request.credits_used,
        latency: formatLatency(request.backend_latency_ms, request.latency_ms),
        query: (request.request_data as any)?.query || (request.request_data as any)?.url || (request.request_data as any)?.topic || 'N/A',
      }))
    })

  } catch (error) {
    logger.error('Dashboard analytics error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to get dashboard analytics' },
      { status: 500 }
    )
  }
}