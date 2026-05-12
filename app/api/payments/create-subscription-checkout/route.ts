import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { stripe, SUBSCRIPTION_PLANS, SubscriptionPlanType } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const subscriptionCheckoutSchema = z.object({
  plan_type: z.enum(['starter', 'builder', 'unicorn']),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  console.log('=== SUBSCRIPTION CHECKOUT ROUTE HIT ===')
  try {
    logger.info('Starting subscription checkout creation')
    
    let authUser: { id: string; email: string; role?: string; plan: string; credits: number; full_name?: string; company?: string }

    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      // User might exist in Clerk but not synced to DB yet — retry after sync
      logger.warn('No auth user found, attempting Clerk sync retry')
      const { currentUser } = await import('@clerk/nextjs/server')
      const clerkUser = await currentUser()
      if (!clerkUser) {
        logger.error('No Clerk user found at all')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const email = clerkUser.emailAddresses[0]?.emailAddress
      if (!email) {
        logger.error('No email on Clerk user')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      // Sync user to DB
      const { syncClerkUser } = await import('@/lib/clerk-auth')
      const syncedUser = await syncClerkUser(clerkUser)
      if (!syncedUser) {
        logger.error('Failed to sync Clerk user for checkout')
        return NextResponse.json({ error: 'Account setup failed, please try again' }, { status: 500 })
      }
      // Re-fetch auth user after sync
      const retryResult = await getAuthUser()
      if (!retryResult?.user) {
        logger.error('Still no auth user after sync retry')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      authUser = retryResult.user
      logger.info('Auth user found after sync retry', { email: authUser.email, id: authUser.id })
    } else {
      authUser = authResult.user
      logger.info('Auth user found', { email: authUser.email, id: authUser.id })
    }

    const body = await request.json()
    const validatedData = subscriptionCheckoutSchema.parse(body)

    // Verify the subscription plan exists
    const plan = SUBSCRIPTION_PLANS[validatedData.plan_type as SubscriptionPlanType]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid subscription plan type' },
        { status: 400 }
      )
    }

    // Use the authUser directly since getAuthUser() already handles sync
    const user = authUser

    // Create default URLs if not provided
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://search.venym.io'
    const successUrl = validatedData.success_url || `${appUrl}/onboarding?payment=success&plan=${validatedData.plan_type}`
    const cancelUrl = validatedData.cancel_url || `${appUrl}/signup?payment=cancelled&step=2`

    // Get the Stripe price ID for this plan
    const stripePriceId = plan.stripePriceId
    if (!stripePriceId) {
      logger.error('Missing Stripe price ID for plan', { planType: validatedData.plan_type })
      return NextResponse.json(
        { error: `Stripe price ID not configured for ${validatedData.plan_type} plan` },
        { status: 500 }
      )
    }

    // Get user from database to check for existing Stripe customer ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    let customerId = dbUser?.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name || undefined,
        metadata: {
          user_id: user.id
        }
      })
      customerId = customer.id

      // Update user with customer ID
      await prisma.user.update({
        where: { email: user.email },
        data: { stripe_customer_id: customerId }
      })

      logger.info('Created Stripe customer', { userId: user.id, customerId })
    }

    // Create Stripe checkout session directly using Stripe SDK
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        plan_type: validatedData.plan_type,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_type: validatedData.plan_type,
        }
      }
    })

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
      plan_details: {
        id: plan.id,
        name: plan.name,
        price: plan.price / 100, // Convert cents to dollars
        credits: plan.credits,
        description: plan.description,
        features: plan.features,
      },
    })

  } catch (error) {
    console.error('=== SUBSCRIPTION CHECKOUT ERROR ===', error)
    console.error('=== ERROR TYPE ===', typeof error)
    console.error('=== ERROR MESSAGE ===', error instanceof Error ? error.message : String(error))
    console.error('=== ERROR STACK ===', error instanceof Error ? error.stack : 'no stack')
    if (error && typeof error === 'object' && 'type' in error) console.error('=== STRIPE ERROR TYPE ===', (error as any).type)
    if (error && typeof error === 'object' && 'detail' in error) console.error('=== STRIPE ERROR DETAIL ===', (error as any).detail)
    if (error && typeof error === 'object' && 'raw' in error) console.error('=== STRIPE ERROR RAW ===', JSON.stringify((error as any).raw))
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Unexpected error in subscription checkout:', error)
    logger.error('Create subscription checkout error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to create subscription checkout session', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}