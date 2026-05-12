import { NextRequest, NextResponse } from 'next/server'
import { SeoOptimizerService } from '@/lib/seo-automation/seo-optimizer'

export async function GET(request: NextRequest) {
  try {
    const seoOptimizer = new SeoOptimizerService()
    const sitemap = await seoOptimizer.generateSitemap()
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    )
  }
}