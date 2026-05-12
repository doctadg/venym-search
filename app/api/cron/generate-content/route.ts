import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator } from '@/lib/ai-content-generator'
import { enhancedAIContentGenerator } from '@/lib/enhanced-ai-content-generator'
import { aiModelManager } from '@/lib/ai-model-manager'
import { logger } from '@/lib/logger'

// This endpoint will be called by Vercel's cron job system
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
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

  const startTime = Date.now()
  
  try {
    logger.info('Starting autonomous content generation cron job')

    // Content generation runs 24/7 — no business hours restriction
    // (Vercel cron controls the schedule via vercel.json)

    // Use enhanced AI content generation with multiple formats
    const useEnhancedMode = process.env.USE_ENHANCED_AI === 'true'
    
    if (useEnhancedMode && process.env.OPENROUTER_API_KEY) {
      logger.info('Using enhanced AI content generation with multiple models')
      await enhancedAIContentGenerator.generateDailyContent()
    } else {
      logger.info('Using template-based content generation (fallback mode)')
      await aiContentGenerator.generateDailyContent()
    }

    const processingTime = Date.now() - startTime
    const modelStats = useEnhancedMode ? aiModelManager.getModelStats() : null

    logger.info('Content generation cron job completed successfully', { 
      processingTime: `${processingTime}ms`,
      mode: useEnhancedMode ? 'enhanced-ai' : 'template-based',
      modelStats: modelStats ? Object.keys(modelStats).length : 0
    })

    return NextResponse.json({
      success: true,
      message: 'Content generation completed successfully',
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}ms`,
      mode: useEnhancedMode ? 'enhanced-ai' : 'template-based',
      modelStats: modelStats ? {
        totalModels: Object.keys(modelStats).length,
        costSummary: aiModelManager.getDailyCostSummary()
      } : null
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    
    logger.error('Content generation cron job failed', {
      processingTime: `${processingTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, error as Error)

    return NextResponse.json({
      success: false,
      error: 'Content generation failed',
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}ms`
    }, { status: 500 })
  }
}

// Also allow POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request)
}