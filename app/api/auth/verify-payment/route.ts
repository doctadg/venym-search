import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { hashPassword, generateToken } from '@/lib/auth-prisma'
import { createUser, getUserByEmail } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const verifyPaymentSchema = z.object({
  session_id: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id } = verifyPaymentSchema.parse(body)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'line_items']
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Check if this is a registration session
    if (!session.metadata?.registration || !session.metadata?.user_data) {
      return NextResponse.json(
        { error: 'Invalid session metadata' },
        { status: 400 }
      )
    }

    // Decode user data
    const userData = JSON.parse(
      Buffer.from(session.metadata.user_data, 'base64').toString()
    )

    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const password_hash = await hashPassword(userData.password)

    // Determine plan and credits based on subscription
    let plan = 'free'
    let credits = 500

    if (session.subscription && session.line_items?.data[0]) {
      const lineItem = session.line_items.data[0]
      const subscription = session.subscription as any

      // Map Stripe price IDs to plans
      const priceId = lineItem.price?.id
      if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
        plan = 'starter'
        credits = 5000
      } else if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
        plan = 'builder'
        credits = 100000
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        plan = 'unicorn'
        credits = 500000
      }
    }

    // Create user
    const newUser = await createUser({
      email: userData.email,
      password_hash,
      full_name: userData.full_name || null,
      company: null,
      plan,
      credits_remaining: credits,
      stripe_customer_id: session.customer as string,
      subscription_id: session.subscription as string,
      subscription_status: 'active',
      plan_type: 'subscription',
      current_period_end: session.subscription ? new Date((session.subscription as any).current_period_end * 1000) : null
    })

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Generate simple token for legacy compatibility
    const token = generateToken()

    // Return success response
    return NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        plan: newUser.plan,
        credits_remaining: newUser.credits_remaining,
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Payment verification error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}