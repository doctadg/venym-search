import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { backendAPI } from '@/lib/backend-api'

// Simple in-memory rate limiting for demo
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const DEMO_RATE_LIMIT = 5 // requests per window
const RATE_LIMIT_WINDOW = 60000 // 1 minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `demo_${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(key)
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (limit.count >= DEMO_RATE_LIMIT) {
    return false
  }
  
  limit.count++
  return true
}

const demoSchema = z.object({
  api_type: z.enum(['search', 'scrape']),
  query: z.string().min(1, 'Query is required').max(200, 'Query too long'),
})

// Real API functions for demo responses
const getDemoSearchResponse = async (query: string) => {
  try {
    // Call real search API with timeout
    const searchResults = await Promise.race([
      backendAPI.search({
        query: query,
        num_results: 5 // Limit for demo
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search timeout')), 20000)
      )
    ]) as any

    // Auto-scrape top 2 results for demo
    const topUrls = searchResults.results.slice(0, 2).map((r: any) => r.link)
    const scraped_content = []
    
    for (const url of topUrls) {
      try {
        const scrapeResult = await Promise.race([
          backendAPI.scrape({
            url: url,
            extract: ['title', 'text'],
            timeout: 8000
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Scrape timeout')), 12000)
          )
        ]) as any
        
        scraped_content.push({
          url: url,
          title: scrapeResult.title,
          text: scrapeResult.text ? 
            (scrapeResult.text.length > 300 ? scrapeResult.text.substring(0, 300) + '...' : scrapeResult.text) 
            : 'No text content extracted',
          error: scrapeResult.error
        })
      } catch (err) {
        scraped_content.push({
          url: url,
          title: `Content from ${url}`,
          text: null,
          error: `Scraping failed: ${err instanceof Error ? err.message : 'Unknown error'}`
        })
      }
    }

    return {
      query: query,
      search_results: searchResults.results.slice(0, 5), // Limit results for demo
      scraped_content: scraped_content,
      credits_used: 1 + (scraped_content.filter(c => !c.error).length * 3),
      remaining_credits: 4990,
      results_count: Math.min(searchResults.results.length, 5),
      scraped_count: scraped_content.filter(c => !c.error).length
    }
  } catch (error) {
    logger.error('Demo Search error', error as Error)
    throw new Error(`Search API unavailable: ${error instanceof Error ? error.message : 'Service temporarily unavailable'}`)
  }
}

const getDemoScrapeResponse = async (query: string) => {
  try {
    const isUrl = query.match(/^https?:\/\//)
    let url: string
    
    if (isUrl) {
      url = query
    } else {
      // For non-URLs, search for the topic and scrape the first result
      const searchResults = await backendAPI.search({
        query: query,
        num_results: 3
      })
      url = searchResults.results[0]?.link || `https://example.com/search?q=${encodeURIComponent(query)}`
    }
    
    const scrapeResult = await Promise.race([
      backendAPI.scrape({
        url: url,
        extract: ['title', 'text', 'links', 'images'],
        timeout: 12000
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Scrape timeout')), 15000)
      )
    ]) as any

    return {
      url: url,
      primary_content: {
        title: scrapeResult.title || `Content from ${new URL(url).hostname}`,
        text: scrapeResult.text ? 
          (scrapeResult.text.length > 500 ? scrapeResult.text.substring(0, 500) + '...' : scrapeResult.text)
          : 'Content extraction in progress...',
        links: (scrapeResult.links || []).slice(0, 5), // Limit links for demo
        images: (scrapeResult.images || []).slice(0, 3), // Limit images for demo
        metadata: scrapeResult.metadata || {},
        error: scrapeResult.error
      },
      credits_used: 5,
      remaining_credits: 4995,
      success: !scrapeResult.error
    }
  } catch (error) {
    logger.error('Demo Scrape error', error as Error)
    throw new Error(`Scraping API unavailable: ${error instanceof Error ? error.message : 'Service temporarily unavailable'}`)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          error: 'Demo rate limit exceeded', 
          message: 'Please wait before trying another demo request. Limit: 5 requests per minute.',
          retry_after: 60 
        },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = demoSchema.parse(body)

    // Call real APIs
    let apiResponse
    switch (validatedData.api_type) {
      case 'search':
        apiResponse = await getDemoSearchResponse(validatedData.query)
        break
      case 'scrape':
        apiResponse = await getDemoScrapeResponse(validatedData.query)
        break
    }

    // Add demo metadata
    const response = {
      ...apiResponse,
      demo: true,
      processing_time_ms: Date.now() - startTime,
      message: "This is a live demo using real Venym Search APIs! Sign up to get your own API key and remove rate limits."
    }

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Demo-Request': 'true'
      }
    })

  } catch (error) {
    logger.error('Demo API error', error as Error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          message: `Invalid input: ${error.errors.map(e => e.message).join(', ')}` 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Demo API error', 
        message: 'Something went wrong with the demo. Please try again.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Venym Search Demo API",
      available_endpoints: ["POST /api/demo"],
      rate_limit: `${DEMO_RATE_LIMIT} requests per minute`,
      note: "This is a demonstration endpoint with mock data. Sign up for real API access."
    },
    { status: 200 }
  )
}