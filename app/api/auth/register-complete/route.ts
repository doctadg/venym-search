import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Retry logic for Clerk session timing
    let user = await currentUser()
    let retries = 5
    
    while ((!user || !user.emailAddresses[0]) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1000ms
      user = await currentUser()
      retries--
    }

    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { full_name, company, plan, use_case } = await request.json()
    const email = user.emailAddresses[0].emailAddress

    // Check if user already exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!dbUser) {
      // Create user in our database - let DB generate UUID
      dbUser = await prisma.user.create({
        data: {
          email,
          password_hash: '', // Not needed with Clerk
          full_name: full_name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
          company: company || null,
          plan: plan || 'free',
          credits_remaining: 500,
          plan_type: plan || 'free',
          use_case: use_case || null
        }
      })

      logger.auth('registration', true, {
        userId: user.id,
        email,
        plan: plan || 'free'
      })
    } else {
      // Update existing user with new plan info
      dbUser = await prisma.user.update({
        where: { email },
        data: {
          full_name: full_name || dbUser.full_name,
          company: company || dbUser.company,
          plan: plan || dbUser.plan,
          plan_type: plan || dbUser.plan_type,
          use_case: use_case || dbUser.use_case
        }
      })
    }

    return NextResponse.json({
      message: 'User registration completed',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        full_name: dbUser.full_name,
        company: dbUser.company,
        plan: dbUser.plan,
        credits_remaining: dbUser.credits_remaining,
      }
    })

  } catch (error) {
    logger.error('Error completing registration', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}