import { NextRequest, NextResponse } from 'next/server'
import { monitoring } from '@/lib/monitoring'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Check if this is a cron request from Vercel
    const userAgent = request.headers.get('user-agent')
    const isCronRequest = userAgent?.includes('vercel-cron')
    
    // For cron requests, verify the authorization header
    if (isCronRequest) {
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
    }

    const health = await monitoring.healthCheck()
    
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 206 : 500

    logger.info('Health check requested', {
      status: health.status,
      database: health.checks.database,
      memory: health.checks.memory,
      source: isCronRequest ? 'cron' : 'manual'
    })

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    logger.error('Health check failed', {}, error as Error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: 'Health check failed',
      checks: {
        database: false,
        memory: false
      }
    }, { status: 500 })
  }
}

// Also support HEAD requests for simple health checks
export async function HEAD(request: NextRequest) {
  try {
    // Check if this is a cron request from Vercel
    const userAgent = request.headers.get('user-agent')
    const isCronRequest = userAgent?.includes('vercel-cron')
    
    // For cron requests, verify the authorization header
    if (isCronRequest) {
      const authToken = (request.headers.get('authorization') || '')
        .split('Bearer ')
        .at(1)
      
      if (!authToken || authToken !== process.env.CRON_SECRET) {
        return new NextResponse(null, { status: 401 })
      }
    }

    const health = await monitoring.healthCheck()
    const statusCode = health.status === 'healthy' ? 200 : 503
    
    return new NextResponse(null, { status: statusCode })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}