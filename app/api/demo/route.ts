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
  api_type: z.enum(['swiftsearch', 'scrapeforge', 'deepdive']),
  query: z.string().min(1, 'Query is required').max(200, 'Query too long'),
})

// Real API functions for demo responses
const getDemoSwiftSearchResponse = async (query: string) => {
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
    logger.error('Demo SwiftSearch error', error as Error)
    throw new Error(`Search API unavailable: ${error instanceof Error ? error.message : 'Service temporarily unavailable'}`)
  }
}

const getDemoScrapeForgeResponse = async (query: string) => {
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
    logger.error('Demo ScrapeForge error', error as Error)
    throw new Error(`Scraping API unavailable: ${error instanceof Error ? error.message : 'Service temporarily unavailable'}`)
  }
}

const getDemoDeepDiveResponse = async (query: string) => {
  try {
    // For DeepDive demo, we'll do a search + scrape multiple results
    const searchResults = await Promise.race([
      backendAPI.search({
        query: query,
        num_results: 5
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search timeout')), 20000)
      )
    ]) as any

    // Scrape top 3 results for research content
    const sources = []
    const scraped_content = []
    
    for (const [index, result] of searchResults.results.slice(0, 3).entries()) {
      try {
        const scrapeResult = await Promise.race([
          backendAPI.scrape({
            url: result.link,
            extract: ['title', 'text'],
            timeout: 6000
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Scrape timeout')), 10000)
          )
        ]) as any
        
        sources.push({
          title: scrapeResult.title || result.title,
          url: result.link,
          credibility_score: Math.round((8.0 + (Math.random() * 1.5)) * 10) / 10, // Mock credibility score
          summary: result.snippet || 'Content successfully extracted from source'
        })
        
        scraped_content.push(scrapeResult)
      } catch (err) {
        sources.push({
          title: result.title,
          url: result.link,
          credibility_score: 7.0,
          summary: result.snippet || `Source available but content extraction limited: ${err instanceof Error ? err.message : 'Unknown error'}`
        })
      }
    }

    const successfulScrapes = sources.filter(s => s.credibility_score > 7.5).length

    return {
      topic: query,
      research_summary: `Deep research analysis of "${query}" compiled from ${sources.length} authoritative web sources. This live demo showcases DeepDive's capability to automatically gather, analyze, and synthesize information from multiple sources in real-time.`,
      key_findings: [
        `Comprehensive analysis of "${query}" based on real-time web data`,
        `Successfully processed ${sources.length} sources with ${successfulScrapes} high-quality extractions`,
        `Content aggregated from diverse, authoritative sources across the web`,
        `Real-time search and scraping ensures current, relevant information`
      ],
      sources: sources,
      research_depth: "comprehensive",
      confidence_score: Math.round((7.5 + (successfulScrapes / sources.length) * 1.5) * 10) / 10,
      credits_used: 1 + (sources.length * 3), // 1 for search + 3 per scrape attempt
      remaining_credits: 4985,
      sources_analyzed: sources.length
    }
  } catch (error) {
    logger.error('Demo DeepDive error', error as Error)
    throw new Error(`Research API unavailable: ${error instanceof Error ? error.message : 'Service temporarily unavailable'}`)
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
      case 'swiftsearch':
        apiResponse = await getDemoSwiftSearchResponse(validatedData.query)
        break
      case 'scrapeforge':
        apiResponse = await getDemoScrapeForgeResponse(validatedData.query)
        break
      case 'deepdive':
        apiResponse = await getDemoDeepDiveResponse(validatedData.query)
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
      api_types: ["swiftsearch", "scrapeforge", "deepdive"],
      rate_limit: `${DEMO_RATE_LIMIT} requests per minute`,
      note: "This is a demonstration endpoint with mock data. Sign up for real API access."
    },
    { status: 200 }
  )
}