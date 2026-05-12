import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { KeywordResearchService } from '@/lib/seo-automation/keyword-research'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const highValue = searchParams.get('high_value') === 'true'

    const where: any = {}
    if (highValue) {
      where.priority_score = { gte: 70 }
    }

    const [keywords, total] = await Promise.all([
      prisma.keywordResearch.findMany({
        where,
        orderBy: { priority_score: 'desc' },
        skip,
        take: limit
      }),
      prisma.keywordResearch.count({ where })
    ])

    return NextResponse.json({
      keywords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching keywords:', error)
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { industry, limit = 50 } = body

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry is required' },
        { status: 400 }
      )
    }

    const searchApiKey = process.env.VENYM_SEARCH_API_KEY || 'internal'
    const keywordService = new KeywordResearchService(searchApiKey)

    // Discover trending keywords
    const trendingKeywords = await keywordService.discoverTrendingKeywords(industry, limit)

    // Research each keyword and save to database
    const results = []
    for (const keyword of trendingKeywords.slice(0, 10)) { // Limit to avoid rate limits
      try {
        const keywordData = await keywordService.researchKeyword(keyword)
        await keywordService.saveKeywordResearch(keywordData)
        results.push(keywordData)
      } catch (error) {
        console.error(`Error researching keyword "${keyword}":`, error)
      }
    }

    return NextResponse.json({
      success: true,
      keywords: results,
      message: `Discovered and researched ${results.length} keywords for ${industry}`
    })
  } catch (error) {
    console.error('Error discovering keywords:', error)
    return NextResponse.json(
      { error: 'Failed to discover keywords' },
      { status: 500 }
    )
  }
}