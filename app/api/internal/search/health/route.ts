import { NextResponse } from 'next/server'
import { searchHealthCheck, searchCache } from '@/lib/search-router'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const health = await searchHealthCheck()
    
    return NextResponse.json({
      status: health.ok ? 'healthy' : 'degraded',
      cache_size: searchCache.size,
      engines: health.engines,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: String(error),
    }, { status: 500 })
  }
}
