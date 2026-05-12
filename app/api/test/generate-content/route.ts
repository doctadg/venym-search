import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator } from '@/lib/ai-content-generator'
import { logger } from '@/lib/logger'

// Test endpoint for manual content generation
export async function POST(request: NextRequest) {
  // Only allow in development or with admin key
  if (process.env.NODE_ENV === 'production') {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    logger.info('Manual content generation triggered')

    // Run content generation
    await aiContentGenerator.generateDailyContent()

    return NextResponse.json({
      success: true,
      message: 'Content generation completed successfully'
    })

  } catch (error) {
    logger.error('Manual content generation failed', error as Error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also handle GET for easy testing
export async function GET(request: NextRequest) {
  return POST(request)
}