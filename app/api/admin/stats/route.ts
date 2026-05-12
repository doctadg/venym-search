import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof NextResponse) {
      return adminCheck
    }

    // Get date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    // Get overall statistics
    const [
      totalUsers,
      activeUsers,
      totalRequests,
      totalRevenue,
      todayStats,
      yesterdayStats,
      planDistribution,
      topUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (made request in last 30 days)
      prisma.user.count({
        where: {
          api_requests: {
            some: {
              created_at: { gte: lastMonth }
            }
          }
        }
      }),
      
      // Total API requests
      prisma.apiRequest.count(),
      
      // Total revenue
      prisma.payment.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true }
      }),
      
      // Today's stats
      Promise.all([
        prisma.user.count({
          where: { created_at: { gte: today } }
        }),
        prisma.apiRequest.count({
          where: { created_at: { gte: today } }
        }),
        prisma.apiRequest.aggregate({
          where: { created_at: { gte: today } },
          _sum: { credits_used: true }
        })
      ]),
      
      // Yesterday's stats
      Promise.all([
        prisma.user.count({
          where: {
            created_at: {
              gte: yesterday,
              lt: today
            }
          }
        }),
        prisma.apiRequest.count({
          where: {
            created_at: {
              gte: yesterday,
              lt: today
            }
          }
        }),
        prisma.apiRequest.aggregate({
          where: {
            created_at: {
              gte: yesterday,
              lt: today
            }
          },
          _sum: { credits_used: true }
        })
      ]),
      
      // Plan distribution
      prisma.user.groupBy({
        by: ['plan'],
        _count: true
      }),
      
      // Top users by API usage
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          full_name: true,
          plan: true,
          _count: {
            select: { api_requests: true }
          }
        },
        orderBy: {
          api_requests: { _count: 'desc' }
        },
        take: 10
      })
    ])

    // Calculate growth percentages
    const userGrowth = yesterdayStats[0] > 0 
      ? ((todayStats[0] - yesterdayStats[0]) / yesterdayStats[0]) * 100 
      : 0
    
    const requestGrowth = yesterdayStats[1] > 0 
      ? ((todayStats[1] - yesterdayStats[1]) / yesterdayStats[1]) * 100 
      : 0

    // Get recent activity
    const recentActivity = await prisma.apiRequest.findMany({
      take: 20,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        endpoint: true,
        method: true,
        status_code: true,
        credits_used: true,
        created_at: true,
        user: {
          select: {
            email: true,
            full_name: true
          }
        }
      }
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalRequests,
        totalRevenue: totalRevenue._sum.amount || 0,
        userGrowth: Math.round(userGrowth * 10) / 10,
        requestGrowth: Math.round(requestGrowth * 10) / 10
      },
      today: {
        newUsers: todayStats[0],
        requests: todayStats[1],
        creditsUsed: todayStats[2]._sum.credits_used || 0
      },
      yesterday: {
        newUsers: yesterdayStats[0],
        requests: yesterdayStats[1],
        creditsUsed: yesterdayStats[2]._sum.credits_used || 0
      },
      planDistribution: planDistribution.map(p => ({
        plan: p.plan,
        count: p._count
      })),
      topUsers,
      recentActivity
    })

  } catch (error) {
    logger.error('Admin stats error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}