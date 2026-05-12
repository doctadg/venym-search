import { NextRequest, NextResponse } from 'next/server'
import { AutomationSchedulerService } from '@/lib/seo-automation/automation-scheduler'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const openaiApiKey = process.env.OPENAI_API_KEY
    const searchApiKey = process.env.VENYM_SEARCH_API_KEY || 'internal'

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const scheduler = new AutomationSchedulerService(openaiApiKey, searchApiKey)

    switch (action) {
      case 'stats':
        const stats = await scheduler.getJobStats()
        return NextResponse.json({ stats })

      case 'schedules':
        const schedules = await scheduler.getActiveSchedules()
        return NextResponse.json({ schedules })

      default:
        const allSchedules = await prisma.automationSchedule.findMany({
          include: {
            template: true
          },
          orderBy: { created_at: 'desc' }
        })
        return NextResponse.json({ schedules: allSchedules })
    }
  } catch (error) {
    console.error('Error in automation API:', error)
    return NextResponse.json(
      { error: 'Failed to process automation request' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    const openaiApiKey = process.env.OPENAI_API_KEY
    const searchApiKey = process.env.VENYM_SEARCH_API_KEY || 'internal'

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const scheduler = new AutomationSchedulerService(openaiApiKey, searchApiKey)

    switch (action) {
      case 'create_schedule':
        const {
          name,
          description,
          schedule_pattern,
          content_type,
          target_keywords,
          template_id,
          publication_settings
        } = body

        if (!name || !schedule_pattern || !content_type) {
          return NextResponse.json(
            { error: 'Missing required fields: name, schedule_pattern, content_type' },
            { status: 400 }
          )
        }

        const scheduleId = await scheduler.createAutomationSchedule({
          name,
          description,
          schedule_pattern,
          content_type,
          target_keywords: target_keywords || [],
          template_id,
          publication_settings
        })

        return NextResponse.json({
          success: true,
          schedule_id: scheduleId,
          message: 'Automation schedule created successfully'
        })

      case 'run_jobs':
        await scheduler.processScheduledJobs()
        return NextResponse.json({
          success: true,
          message: 'Scheduled jobs processed successfully'
        })

      case 'pause_schedule':
        const { schedule_id: pauseId } = body
        if (!pauseId) {
          return NextResponse.json(
            { error: 'schedule_id is required' },
            { status: 400 }
          )
        }
        
        await scheduler.pauseSchedule(pauseId)
        return NextResponse.json({
          success: true,
          message: 'Schedule paused successfully'
        })

      case 'resume_schedule':
        const { schedule_id: resumeId } = body
        if (!resumeId) {
          return NextResponse.json(
            { error: 'schedule_id is required' },
            { status: 400 }
          )
        }
        
        await scheduler.resumeSchedule(resumeId)
        return NextResponse.json({
          success: true,
          message: 'Schedule resumed successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in automation API:', error)
    return NextResponse.json(
      { error: 'Failed to process automation request' },
      { status: 500 }
    )
  }
}