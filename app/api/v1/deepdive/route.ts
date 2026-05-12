import { NextRequest, NextResponse } from 'next/server'
import { getApiKeyAuth, hasFeatureAccess, calculateCredits, insufficientCreditsResponse, badRequestResponse, unauthorizedResponse, successResponse, internalErrorResponse } from '@/lib/auth-prisma'
import { deductCredits, logApiRequest } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'
import { backendAPI, cleanScrapedContent, calculateWordCount, calculateReadingTime } from '@/lib/backend-api'
import { z } from 'zod'

// DeepDive can take up to 60s — needs extended Vercel function timeout
export const maxDuration = 60

const deepDiveSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  max_sources: z.number().min(1).max(50).optional().default(5),
  generate_summary: z.boolean().optional().default(false),
  include_social_mentions: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let authData: any = null
  let requestData: any = null

  try {
    // Authenticate user via API key
    authData = await getApiKeyAuth(request)
    if (!authData) {
      return unauthorizedResponse('Invalid or missing API key')
    }

    // Parse and validate request body
    requestData = await request.json()
    const validatedData = deepDiveSchema.parse(requestData)

    // Check feature access based on plan
    if (validatedData.generate_summary && !hasFeatureAccess(authData.user_plan, 'ai_summary')) {
      return badRequestResponse('AI summary generation requires Builder plan or higher')
    }

    if (validatedData.include_social_mentions && !hasFeatureAccess(authData.user_plan, 'social_discovery')) {
      return badRequestResponse('Social mentions requires Builder plan or higher')
    }

    // Limit max sources for free users
    if (authData.user_plan === 'free' && validatedData.max_sources > 3) {
      return badRequestResponse('Free plan limited to 3 sources maximum')
    }

    // Calculate credits required: 1 search + 3 per source scraped + optional extras
    let creditsRequired = 1 + (validatedData.max_sources * 3)
    if (validatedData.generate_summary) creditsRequired += 5
    if (validatedData.include_social_mentions) creditsRequired += 5

    // Check if user has enough credits
    if (authData.user_credits < creditsRequired) {
      await logApiRequest({
        user_id: authData.user_id,
        api_key_id: authData.key_id,
        endpoint: '/api/v1/deepdive',
        method: 'POST',
        status_code: 402,
        credits_used: 0,
        request_data: requestData,
        response_data: { error: 'Insufficient credits' },
        latency_ms: Date.now() - startTime,
      })

      return insufficientCreditsResponse(creditsRequired, authData.user_credits)
    }

    // ---- DEEPDIVE: Search → Scrape top results ----

    // Step 1: Search for the topic
    const backendStartTime = Date.now()
    logger.info('DeepDive: searching', { topic: validatedData.topic, userId: authData.user_id })
    const searchResponse = await backendAPI.search({
      query: validatedData.topic,
      num_results: validatedData.max_sources * 2, // Over-fetch to have room after filtering
    })

    const searchResults = searchResponse.results || []

    if (searchResults.length === 0) {
      return successResponse({
        topic: validatedData.topic,
        search_results: [],
        scraped_content: [],
        sources_analyzed: 0,
        credits_used: 1,
        remaining_credits: authData.user_credits - 1,
      })
    }

    // Step 2: Scrape top results (up to max_sources)
    const urlsToScrape = searchResults
      .slice(0, validatedData.max_sources)
      .map(r => r.link)
      .filter(url => url && url.startsWith('http'))

    logger.info('DeepDive: scraping', { urls: urlsToScrape.length, userId: authData.user_id })

    const scrapedContent: any[] = []
    let creditsUsed = 1 // base search credit

    // Scrape in parallel (max 5 concurrent)
    const batchSize = 5
    for (let i = 0; i < urlsToScrape.length; i += batchSize) {
      const batch = urlsToScrape.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map(async (url) => {
          try {
            const scrapeResult = await backendAPI.scrape({ url, extract: ['title', 'text', 'links', 'metadata'] })
            const cleanedText = cleanScrapedContent(scrapeResult.text)
            return {
              url,
              title: scrapeResult.title || null,
              text: cleanedText || null,
              full_text: cleanedText || null,
              links: scrapeResult.links || null,
              images: scrapeResult.images || null,
              metadata: scrapeResult.metadata || null,
              error: scrapeResult.error || null,
              word_count: calculateWordCount(cleanedText),
              reading_time: calculateReadingTime(cleanedText),
            }
          } catch (err) {
            logger.warn('DeepDive: scrape failed', { url, error: err instanceof Error ? err.message : 'Unknown' })
            return {
              url,
              title: null,
              text: null,
              full_text: null,
              links: null,
              images: null,
              metadata: null,
              error: err instanceof Error ? err.message : 'Scrape failed',
              word_count: 0,
              reading_time: 0,
            }
          }
        })
      )

      for (const result of results) {
        if (result.status === 'fulfilled') {
          scrapedContent.push(result.value)
          if (!result.value.error) creditsUsed += 3
        }
      }
    }

    // Step 3: Generate AI summary if requested
    let aiSummary: string | undefined
    if (validatedData.generate_summary) {
      creditsUsed += 5
      try {
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
        if (OPENROUTER_API_KEY) {
          const contentPieces = scrapedContent
            .filter(c => c.text && c.word_count && c.word_count > 50)
            .slice(0, 5)
            .map(c => `### ${c.title || 'Untitled'} (${c.word_count} words)\n${c.text?.substring(0, 1500) || ''}`)
            .join('\n\n---\n\n')

          if (contentPieces) {
            const summaryResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://search.venym.io',
                'X-Title': 'Venym Search DeepDive',
              },
              body: JSON.stringify({
                model: 'anthropic/claude-3-haiku',
                messages: [
                  { role: 'system', content: 'You are a research analyst. Provide a comprehensive summary of the following research data in 3-4 paragraphs with key findings, trends, and conclusions in markdown format.' },
                  { role: 'user', content: `Topic: ${validatedData.topic}\n\n${contentPieces}` },
                ],
                max_tokens: 1000,
                temperature: 0.3,
              }),
            })

            if (summaryResponse.ok) {
              const summaryData = await summaryResponse.json()
              aiSummary = summaryData.choices?.[0]?.message?.content || undefined
            }
          }
        }
      } catch (err) {
        logger.warn('DeepDive: AI summary failed', { error: err instanceof Error ? err.message : 'Unknown' })
      }
    }

    // Step 4: Social mentions if requested
    let socialMentions: any[] | undefined
    if (validatedData.include_social_mentions) {
      creditsUsed += 5
      try {
        const platforms = ['twitter.com', 'reddit.com']
        socialMentions = []
        for (const platform of platforms) {
          const socialSearch = await backendAPI.search({
            query: `${validatedData.topic} site:${platform}`,
            num_results: 3,
          })
          if (socialSearch.results.length > 0) {
            socialMentions.push({
              platform: platform.includes('twitter') ? 'Twitter/X' : 'Reddit',
              mentions: socialSearch.results.length,
              recent_posts: socialSearch.results.slice(0, 3).map(r => ({
                title: r.title,
                url: r.link,
                snippet: r.snippet?.substring(0, 200),
              })),
            })
          }
        }
      } catch (err) {
        logger.warn('DeepDive: social mentions failed', { error: err instanceof Error ? err.message : 'Unknown' })
      }
    }

    // Deduct credits
    const backendLatencyMs = Date.now() - backendStartTime
    const deductSuccess = await deductCredits(authData.user_id, creditsUsed)
    if (!deductSuccess) {
      logger.error('Failed to deduct credits', {
        userId: authData.user_id,
        creditsRequired: creditsUsed,
        userCredits: authData.user_credits,
      })
      return insufficientCreditsResponse(creditsUsed, authData.user_credits)
    }

    // Prepare response
    const response = {
      topic: validatedData.topic,
      search_results: searchResults.slice(0, validatedData.max_sources).map(r => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
        position: r.position,
        date: r.date,
      })),
      scraped_content: scrapedContent,
      sources_analyzed: scrapedContent.filter(c => !c.error).length,
      ...(aiSummary && { ai_summary: aiSummary }),
      ...(socialMentions && socialMentions.length > 0 && { social_mentions: socialMentions }),
      credits_used: creditsUsed,
      remaining_credits: authData.user_credits - creditsUsed,
      research_depth: authData.user_plan === 'free' ? 'basic' :
                     authData.user_plan === 'starter' ? 'medium' :
                     authData.user_plan === 'builder' ? 'detailed' : 'comprehensive',
    }

    // Log the request
    await logApiRequest({
      user_id: authData.user_id,
      api_key_id: authData.key_id,
      endpoint: '/api/v1/deepdive',
      method: 'POST',
      status_code: 200,
      credits_used: creditsUsed,
      request_data: requestData,
      response_data: response,
      latency_ms: Date.now() - startTime,
      backend_latency_ms: backendLatencyMs,
    })

    return successResponse(response)

  } catch (error) {
    const latency = Date.now() - startTime

    // Log failed request
    if (authData) {
      await logApiRequest({
        user_id: authData.user_id,
        api_key_id: authData.key_id,
        endpoint: '/api/v1/deepdive',
        method: 'POST',
        status_code: 500,
        credits_used: 0,
        request_data: requestData,
        response_data: { error: error instanceof Error ? error.message : 'Unknown error' },
        latency_ms: latency,
      })
    }

    if (error instanceof z.ZodError) {
      return badRequestResponse(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }

    logger.error('DeepDive error', {
      userId: authData?.user_id,
      topic: requestData?.topic,
    }, error as Error)

    return internalErrorResponse()
  }
}
