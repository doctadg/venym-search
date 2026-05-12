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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const plan = searchParams.get('plan') || 'all'
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { full_name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (plan !== 'all') {
      where.plan = plan
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          full_name: true,
          company: true,
          role: true,
          plan: true,
          credits_remaining: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              api_requests: true,
              api_keys: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages
      }
    })

  } catch (error) {
    logger.error('Admin users list error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}