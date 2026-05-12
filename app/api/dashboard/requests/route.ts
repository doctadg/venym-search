import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { getUserApiRequests } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authUser = authResult.user

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const requests = await getUserApiRequests(authUser.id, limit)

    // Format requests for the frontend
    const formattedRequests = requests.map(req => ({
      id: req.id,
      endpoint: req.endpoint,
      method: req.method,
      status: req.status_code,
      timestamp: new Date(req.created_at).toLocaleString(),
      credits: req.credits_used,
      latency: req.latency_ms ? `${req.latency_ms}ms` : 'N/A',
      query: (req.request_data as any)?.query || (req.request_data as any)?.url || (req.request_data as any)?.topic || 'N/A'
    }))

    return NextResponse.json({
      requests: formattedRequests
    })

  } catch (error) {
    logger.error('Dashboard requests error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}