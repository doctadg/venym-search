import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof NextResponse) {
      return adminCheck
    }

    const params = await context.params
    const userId = params.id

    // Get user details with related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        api_keys: {
          select: {
            id: true,
            key_name: true,
            is_active: true,
            created_at: true,
            last_used_at: true
          }
        },
        api_requests: {
          take: 10,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            endpoint: true,
            method: true,
            status_code: true,
            credits_used: true,
            created_at: true
          }
        },
        payments: {
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            amount: true,
            credits_purchased: true,
            plan_name: true,
            status: true,
            created_at: true
          }
        },
        _count: {
          select: {
            api_requests: true,
            api_keys: true,
            payments: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate usage stats
    const usageStats = await prisma.apiRequest.aggregate({
      where: { user_id: userId },
      _sum: { credits_used: true },
      _count: true,
      _avg: { latency_ms: true }
    })

    return NextResponse.json({
      user,
      stats: {
        totalRequests: usageStats._count,
        totalCreditsUsed: usageStats._sum.credits_used || 0,
        avgLatency: Math.round(usageStats._avg.latency_ms || 0)
      }
    })

  } catch (error) {
    const params = await context.params
    logger.error('Admin user detail error', { userId: params.id }, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof NextResponse) {
      return adminCheck
    }

    const params = await context.params
    const userId = params.id
    const body = await request.json()

    // Validate update fields
    const allowedFields = [
      'full_name',
      'company',
      'role',
      'plan',
      'plan_type',
      'credits_remaining',
      'subscription_status'
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    logger.info('Admin updated user', {
      adminId: adminCheck.user.id,
      userId,
      updates: Object.keys(updateData)
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    const params = await context.params
    logger.error('Admin user update error', { userId: params.id }, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}