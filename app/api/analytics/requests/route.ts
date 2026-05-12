import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const requestsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  search: z.string().optional(),
  status: z.string().optional(),
  endpoint: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authUser = authResult.user

    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedQuery = requestsQuerySchema.parse(queryParams)

    // Build where clause
    const where: any = {
      user_id: authUser.id,
    }

    // Add search filter
    if (validatedQuery.search) {
      where.OR = [
        {
          id: {
            contains: validatedQuery.search,
            mode: 'insensitive',
          }
        },
        {
          endpoint: {
            contains: validatedQuery.search,
            mode: 'insensitive',
          }
        },
        {
          request_data: {
            path: ['query'],
            string_contains: validatedQuery.search,
          }
        },
        {
          request_data: {
            path: ['url'],
            string_contains: validatedQuery.search,
          }
        }
      ]
    }

    // Add status filter
    if (validatedQuery.status && validatedQuery.status !== 'all') {
      if (validatedQuery.status === '200') {
        where.status_code = {
          gte: 200,
          lt: 300,
        }
      } else if (validatedQuery.status === '400') {
        where.status_code = {
          gte: 400,
          lt: 500,
        }
      } else if (validatedQuery.status === '500') {
        where.status_code = {
          gte: 500,
        }
      } else {
        where.status_code = parseInt(validatedQuery.status)
      }
    }

    // Add endpoint filter
    if (validatedQuery.endpoint) {
      where.endpoint = validatedQuery.endpoint
    }

    // Add date range filter
    if (validatedQuery.date_from || validatedQuery.date_to) {
      where.created_at = {}
      if (validatedQuery.date_from) {
        where.created_at.gte = new Date(validatedQuery.date_from)
      }
      if (validatedQuery.date_to) {
        where.created_at.lte = new Date(validatedQuery.date_to)
      }
    }

    // Calculate pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit
    const take = Math.min(validatedQuery.limit, 100) // Cap at 100

    // Get total count for pagination
    const totalCount = await prisma.apiRequest.count({ where })

    // Get requests
    const requests = await prisma.apiRequest.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take,
      select: {
        id: true,
        endpoint: true,
        method: true,
        status_code: true,
        created_at: true,
        credits_used: true,
        latency_ms: true,
        request_data: true,
        response_data: true,
      }
    })

    // Format response
    const formattedRequests = requests.map(request => ({
      id: request.id,
      endpoint: request.endpoint,
      method: request.method,
      status: request.status_code,
      timestamp: request.created_at.toISOString(),
      credits: request.credits_used,
      latency: request.latency_ms ? `${request.latency_ms}ms` : 'N/A',
      query: (request.request_data as any)?.query || (request.request_data as any)?.url || 'N/A',
      request_data: request.request_data,
      response_data: request.response_data,
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / validatedQuery.limit)
    const hasNextPage = validatedQuery.page < totalPages
    const hasPrevPage = validatedQuery.page > 1

    return NextResponse.json({
      requests: formattedRequests,
      pagination: {
        current_page: validatedQuery.page,
        total_pages: totalPages,
        total_count: totalCount,
        per_page: validatedQuery.limit,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Get requests error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to get requests' },
      { status: 500 }
    )
  }
}