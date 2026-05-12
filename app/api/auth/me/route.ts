import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        full_name: authResult.user.full_name,
        role: authResult.user.role,
        plan: authResult.user.plan,
        credits_remaining: authResult.user.credits,
        company: authResult.user.company
      }
    })
  } catch (error) {
    logger.error('Error in /api/auth/me', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}