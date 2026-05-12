import { NextRequest, NextResponse } from 'next/server'
import { getApiKeyAuth, hasFeatureAccess, calculateCredits, insufficientCreditsResponse, badRequestResponse, unauthorizedResponse, successResponse, internalErrorResponse } from '@/lib/auth-prisma'
import { deductCredits, logApiRequest } from '@/lib/database-prisma'
import { enhancedSearch } from '@/lib/backend-api'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// SwiftSearch is fast but give it a bit of runway
export const maxDuration = 30

const swiftSearchSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  auto_scrape_top: z.number().min(0).max(10).optional(),
  max_results: z.number().min(1).max(50).optional().default(10),
  include_contacts: z.boolean().optional().default(false),
  include_social: z.boolean().optional().default(false),
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
    const validatedData = swiftSearchSchema.parse(requestData)

    // Check feature access based on plan
    if (validatedData.include_contacts && !hasFeatureAccess(authData.user_plan, 'contact_extraction')) {
      return badRequestResponse('Contact extraction requires Starter plan or higher')
    }

    if (validatedData.include_social && !hasFeatureAccess(authData.user_plan, 'social_discovery')) {
      return badRequestResponse('Social discovery requires Builder plan or higher')
    }

    // Calculate credits required
    const creditsRequired = calculateCredits('swiftsearch', validatedData, authData.user_plan)

    // Check if user has enough credits
    if (authData.user_credits < creditsRequired) {
      await logApiRequest({
        user_id: authData.user_id,
        api_key_id: authData.key_id,
        endpoint: '/api/v1/swiftsearch',
        method: 'POST',
        status_code: 402,
        credits_used: 0,
        request_data: requestData,
        response_data: { error: 'Insufficient credits' },
        latency_ms: Date.now() - startTime,
      })

      return insufficientCreditsResponse(creditsRequired, authData.user_credits)
    }

    // Perform enhanced search
    const backendStartTime = Date.now()
    const result = await enhancedSearch({
      query: validatedData.query,
      auto_scrape_top: validatedData.auto_scrape_top,
      max_results: validatedData.max_results,
      include_contacts: validatedData.include_contacts,
      include_social: validatedData.include_social,
    })
    const backendLatencyMs = Date.now() - backendStartTime

    // Use actual credits from the operation (may be different due to failures)
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
      query: validatedData.query,
      search_results: result.search_results,
      scraped_content: result.scraped_content,
      ...(validatedData.include_contacts && result.contacts && { contacts: result.contacts }),
      ...(validatedData.include_social && result.social_profiles && { social_profiles: result.social_profiles }),
      credits_used: actualCreditsUsed,
      remaining_credits: authData.user_credits - actualCreditsUsed,
      results_count: result.search_results.length,
      scraped_count: result.scraped_content.length,
    }

    // Log the request
    await logApiRequest({
      user_id: authData.user_id,
      api_key_id: authData.key_id,
      endpoint: '/api/v1/swiftsearch',
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
        endpoint: '/api/v1/swiftsearch',
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

    logger.error('SwiftSearch error', { 
      userId: authData?.user_id,
      query: requestData?.query 
    }, error as Error)
    
    return internalErrorResponse()
  }
}