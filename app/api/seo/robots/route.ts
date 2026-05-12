import { NextRequest, NextResponse } from 'next/server'
import { SeoOptimizerService } from '@/lib/seo-automation/seo-optimizer'

export async function GET(request: NextRequest) {
  try {
    const seoOptimizer = new SeoOptimizerService()
    const robotsTxt = await seoOptimizer.generateRobotsTxt()
    
    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    return NextResponse.json(
      { error: 'Failed to generate robots.txt' },
      { status: 500 }
    )
  }
}