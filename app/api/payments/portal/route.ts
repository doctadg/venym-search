import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { createBillingPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authUser = authResult.user

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        stripe_customer_id: true,
      }
    })

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing account found. Please make a purchase first.' },
        { status: 400 }
      )
    }

    // Create billing portal session
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?tab=billing`
    const session = await createBillingPortalSession(
      user.stripe_customer_id,
      returnUrl
    )

    return NextResponse.json({
      portal_url: session.url
    })

  } catch (error) {
    logger.error('Create billing portal error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}