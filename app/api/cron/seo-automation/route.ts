import { NextRequest, NextResponse } from 'next/server'
import { AutomationSchedulerService } from '@/lib/seo-automation/automation-scheduler'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authToken = (request.headers.get('authorization') || '')
      .split('Bearer ')
      .at(1)
    
    if (!authToken || authToken !== process.env.CRON_SECRET) {
      console.warn('Unauthorized cron request', { 
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for'),
        hasAuthHeader: !!request.headers.get('authorization')
      })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    const searchApiKey = process.env.VENYM_SEARCH_API_KEY || 'internal'

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const scheduler = new AutomationSchedulerService(openaiApiKey, searchApiKey)
    
    console.log('Starting scheduled SEO automation jobs...')
    await scheduler.processScheduledJobs()
    
    return NextResponse.json({
      success: true,
      message: 'SEO automation jobs processed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: 'Failed to process cron job' },
      { status: 500 }
    )
  }
}