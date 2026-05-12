import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { syncClerkUser } from '@/lib/clerk-auth'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Sync the Clerk user with our database
    const syncedUser = await syncClerkUser(user)

    if (!syncedUser) {
      logger.error('Failed to sync user with database', { clerkUserId: user.id })
      return NextResponse.json(
        { error: 'Failed to sync user data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User synced successfully',
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        full_name: syncedUser.full_name,
        plan: syncedUser.plan,
        credits_remaining: syncedUser.credits_remaining,
      }
    })

  } catch (error) {
    logger.error('Error syncing user', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}