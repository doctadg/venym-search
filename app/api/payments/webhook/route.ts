import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { addUserCredits, createPayment, updatePaymentStatus } from '@/lib/database-prisma'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature, endpointSecret)
    } catch (error) {
      logger.error('Webhook signature verification failed', {}, error as Error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        try {
          if (session.mode === 'subscription') {
            // Handle subscription signup
            await handleSubscriptionCheckout(session)
          } else {
            // One-time credit packs are deprecated — log and ignore
            logger.warn('Received one-time payment checkout (deprecated credit packs)', { sessionId: session.id })
          }
        } catch (error) {
          logger.error('Error processing checkout session', {}, error as Error)
          if (session.payment_intent) {
            await updatePaymentStatus(session.payment_intent as string, 'failed')
          }
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(subscription)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await handleSubscriptionRenewal(invoice)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await handleSubscriptionPaymentFailed(invoice)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        try {
          // Update payment status to failed
          await updatePaymentStatus(paymentIntent.id, 'failed')
          logger.warn('Payment failed', { paymentIntentId: paymentIntent.id })
        } catch (error) {
          logger.error('Error updating failed payment status', {}, error as Error)
        }
        break
      }

      default:
        logger.info('Unhandled webhook event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    logger.error('Webhook error', {}, error as Error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Subscription event handlers
async function handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
  const { user_id, plan_type } = session.metadata!
  
  if (!user_id || !plan_type) {
    throw new Error('Missing metadata in subscription checkout session')
  }

  logger.info('Subscription checkout completed', { userId: user_id, planType: plan_type })
  
  // The actual subscription will be handled in customer.subscription.created event
  // This just logs the completion of checkout
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    const planId = subscription.metadata?.plan_type || 'builder'
    
    // Find user by Stripe customer ID
    const user = await prisma.user.findFirst({
      where: { stripe_customer_id: customerId }
    })
    
    if (!user) {
      logger.error('User not found for Stripe customer', { customerId })
      return
    }

    // Update user subscription information
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription_id: subscription.id,
        stripe_customer_id: customerId, 
        plan: planId,
        plan_type: planId,
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
      }
    })

    logger.info('Subscription created', { userId: user.id, subscriptionId: subscription.id })
    
  } catch (error) {
    logger.error('Error handling subscription created', {}, error as Error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Update user subscription information directly
    const user = await prisma.user.findFirst({
      where: { subscription_id: subscription.id }
    })

    if (!user) {
      logger.error('User not found for subscription update', { subscriptionId: subscription.id })
      return
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
      }
    })

    // User has been updated directly above

    logger.info('Subscription updated', { subscriptionId: subscription.id })
    
  } catch (error) {
    logger.error('Error handling subscription updated', {}, error as Error)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    // Find user with this subscription and update directly
    const user = await prisma.user.findFirst({
      where: { subscription_id: subscription.id }
    })

    if (!user) {
      logger.error('User not found for subscription cancellation', { subscriptionId: subscription.id })
      return
    }

    // Update user record - revert to free plan at period end
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription_status: 'canceled',
        // Keep current plan active until period ends
      }
    })

    logger.info('Subscription canceled', { subscriptionId: subscription.id })
    
  } catch (error) {
    logger.error('Error handling subscription canceled', {}, error as Error)
  }
}

async function handleSubscriptionRenewal(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string
    
    // Find user with this subscription
    const user = await prisma.user.findFirst({
      where: { subscription_id: subscriptionId }
    })

    if (user) {
      // Reset monthly credits based on plan
      const planCredits = getPlanCredits(user.plan)
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits_remaining: planCredits,
          current_period_end: new Date((invoice.period_end || 0) * 1000),
        }
      })

      logger.info('Subscription renewed', { userId: user.id, credits: planCredits })
    }
    
  } catch (error) {
    logger.error('Error handling subscription renewal', {}, error as Error)
  }
}

async function handleSubscriptionPaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string
    
    logger.warn('Subscription payment failed', { subscriptionId })
    
    // The subscription status will be updated via subscription.updated event
    // Here we could send notification emails, etc.
    
  } catch (error) {
    logger.error('Error handling subscription payment failed', {}, error as Error)
  }
}

function getPlanCredits(planId: string): number {
  switch (planId) {
    case 'starter':
      return 5000
    case 'builder':
      return 100000
    case 'unicorn':
      return 500000
    default:
      return 500 // free tier
  }
}