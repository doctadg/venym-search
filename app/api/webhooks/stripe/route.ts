import { NextRequest, NextResponse } from 'next/server'
import { stripe, constructWebhookEvent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { addUserCredits } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = constructWebhookEvent(body, signature, WEBHOOK_SECRET)
  } catch (error) {
    logger.error('Webhook signature verification failed', {}, error as Error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      default:
        logger.info('Unhandled webhook event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook handler error', {}, error as Error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  logger.info('Checkout session completed', { sessionId: session.id })
  
  // Handle subscription checkouts
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription, {
      expand: ['items.data.price']
    })
    
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripe_customer_id: session.customer }
    })
    
    if (user) {
      // Determine plan and credits based on subscription price ID
      let plan = 'free'
      let credits = 500
      const priceId = subscription.items.data[0]?.price?.id

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

      // Update user subscription info
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan,
          credits_remaining: credits,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000),
          plan_type: 'subscription'
        }
      })

      logger.info('Updated subscription for user', { userId: user.id, plan, credits })
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  logger.info('Invoice payment succeeded', { invoiceId: invoice.id })
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripe_customer_id: invoice.customer }
    })
    
    if (user) {
      // Determine plan and credits based on price ID
      let plan = 'free'
      let creditsToAdd = 0
      const priceId = invoice.lines.data[0]?.price?.id

      if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
        plan = 'starter'
        creditsToAdd = 5000
      } else if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
        plan = 'builder'
        creditsToAdd = 100000
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        plan = 'unicorn'
        creditsToAdd = 500000
      }

      if (creditsToAdd > 0) {
        // Reset credits for monthly billing
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            credits_remaining: creditsToAdd,
            subscription_status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000)
          }
        })

        logger.info('Reset credits for user', { userId: user.id, plan, credits: creditsToAdd })
      }
    }
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  logger.warn('Invoice payment failed', { invoiceId: invoice.id })
  
  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { stripe_customer_id: invoice.customer }
  })
  
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription_status: 'past_due'
      }
    })
    
    logger.warn('Marked subscription as past_due', { userId: user.id })
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  logger.info('Subscription updated', { subscriptionId: subscription.id })
  
  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { stripe_customer_id: subscription.customer }
  })
  
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000)
      }
    })
    
    logger.info('Updated subscription status', { userId: user.id, status: subscription.status })
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  logger.info('Subscription deleted', { subscriptionId: subscription.id })
  
  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { stripe_customer_id: subscription.customer }
  })
  
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription_status: 'canceled',
        plan: 'free',
        plan_type: 'free',
        credits_remaining: 500 // Reset to free tier credits
      }
    })
    
    logger.info('Downgraded user to free tier', { userId: user.id })
  }
}