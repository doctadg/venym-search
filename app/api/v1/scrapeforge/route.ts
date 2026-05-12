import { NextRequest, NextResponse } from 'next/server'
import { getApiKeyAuth, hasFeatureAccess, calculateCredits, insufficientCreditsResponse, badRequestResponse, unauthorizedResponse, successResponse, internalErrorResponse } from '@/lib/auth-prisma'
import { deductCredits, logApiRequest } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'
import { enhancedScrape } from '@/lib/backend-api'
import { z } from 'zod'

// ScrapeForge can escalate through browser tiers — allow extra time
export const maxDuration = 60

const scrapeForgeSchema = z.object({
  url: z.string().url('Invalid URL'),
  follow_internal_links: z.boolean().optional().default(false),
  max_depth: z.number().min(1).max(3).optional().default(1),
  max_pages: z.number().min(1).max(50).optional().default(10),
  include_contacts: z.boolean().optional().default(false),
  extract_options: z.array(z.enum(['title', 'text', 'links', 'images', 'metadata', 'all'])).optional().default(['title', 'text']),
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
    const validatedData = scrapeForgeSchema.parse(requestData)

    // Check feature access based on plan
    if (validatedData.follow_internal_links && !hasFeatureAccess(authData.user_plan, 'bulk_operations')) {
      return badRequestResponse('Link following requires Unicorn plan')
    }

    if (validatedData.include_contacts && !hasFeatureAccess(authData.user_plan, 'contact_extraction')) {
      return badRequestResponse('Contact extraction requires Starter plan or higher')
    }

    // Calculate credits required
    const creditsRequired = calculateCredits('scrapeforge', validatedData, authData.user_plan)

    // Check if user has enough credits
    if (authData.user_credits < creditsRequired) {
      await logApiRequest({
        user_id: authData.user_id,
        api_key_id: authData.key_id,
        endpoint: '/api/v1/scrapeforge',
        method: 'POST',
        status_code: 402,
        credits_used: 0,
        request_data: requestData,
        response_data: { error: 'Insufficient credits' },
        latency_ms: Date.now() - startTime,
      })

      return insufficientCreditsResponse(creditsRequired, authData.user_credits)
    }

    // Perform enhanced scraping
    const backendStartTime = Date.now()
    const result = await enhancedScrape({
      url: validatedData.url,
      follow_internal_links: validatedData.follow_internal_links,
      max_depth: validatedData.max_depth,
      max_pages: validatedData.max_pages,
      include_contacts: validatedData.include_contacts,
      extract_options: validatedData.extract_options,
    })
    const backendLatencyMs = Date.now() - backendStartTime

    // Use actual credits from the operation
    const actualCreditsUsed = result.total_credits_used

    // Deduct credits
    const deductSuccess = await deductCredits(authData.user_id, actualCreditsUsed)
    if (!deductSuccess) {
      logger.error('Failed to deduct credits', { 
        userId: authData.user_id, 
        creditsRequired: actualCreditsUsed,
        userCredits: authData.user_credits 
      })
      return insufficientCreditsResponse(actualCreditsUsed, authData.user_credits)
    }

    // Prepare response
    const response = {
      url: validatedData.url,
      primary_content: result.primary_content,
      ...(validatedData.follow_internal_links && result.discovered_links && { 
        discovered_links: result.discovered_links,
        links_scraped: result.discovered_links.length 
      }),
      ...(validatedData.include_contacts && result.contacts && { contacts: result.contacts }),
      credits_used: actualCreditsUsed,
      remaining_credits: authData.user_credits - actualCreditsUsed,
      success: !result.primary_content.error,
    }

    // Log the request
    await logApiRequest({
      user_id: authData.user_id,
      api_key_id: authData.key_id,
      endpoint: '/api/v1/scrapeforge',
      method: 'POST',
      status_code: 200,
      credits_used: actualCreditsUsed,
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
        endpoint: '/api/v1/scrapeforge',
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

    logger.error('ScrapeForge error', { 
      userId: authData?.user_id,
      url: requestData?.url 
    }, error as Error)
    
    return internalErrorResponse()
  }
}