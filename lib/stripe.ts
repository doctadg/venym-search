// Lazy Stripe client — avoids build-time crash when STRIPE_SECRET_KEY is missing
import type { Stripe as StripeTypes } from 'stripe'

let _stripe: any = null

function getStripeInstance() {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key === '***') return null
  try {
    const S = require('stripe').default || require('stripe')
    _stripe = new S(key, { apiVersion: '2024-12-18.acacia' })
  } catch { return null }
  return _stripe
}

export const stripe = new Proxy({} as any, {
  get(_, prop) {
    const s = getStripeInstance()
    if (!s) return () => { throw new Error('Stripe not configured') }
    return (s as any)[prop]
  }
})

// Subscription plans configurations
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0, // $0.00 in cents
    credits: 500,
    description: 'Perfect for testing the waters',
    stripePriceId: undefined,
    features: [
      'Search API access',
      'Scrape web scraping',
      'Basic support',
      'Dashboard access'
    ]
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 900, // $9.00 in cents
    credits: 5000,
    description: 'Great for side projects and small tools',
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      'Search API access',
      'Scrape web scraping',
      'Basic support',
      'Dashboard access'
    ]
  },
  builder: {
    id: 'builder',
    name: 'Builder',
    price: 4900, // $49.00 in cents
    credits: 100000,
    description: 'Perfect for scaling with less effort',
    stripePriceId: process.env.STRIPE_BUILDER_PRICE_ID,
    popular: true,
    features: [
      'Everything in Starter',
      'Priority support',
      'Advanced analytics',
      'Custom webhooks',
      'Higher rate limits'
    ]
  },
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn',
    price: 19900, // $199.00 in cents
    credits: 500000,
    description: 'Built for high volume and speed',
    stripePriceId: process.env.STRIPE_UNICORN_PRICE_ID,
    features: [
      'Everything in Builder',
      'Dedicated support engineer',
      'Custom integrations',
      'SLA guarantees',
      'Advanced security'
    ]
  }
}

export type SubscriptionPlanType = keyof typeof SUBSCRIPTION_PLANS

// Create subscription checkout session
export async function createSubscriptionCheckoutSession(
  planType: SubscriptionPlanType,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const plan = SUBSCRIPTION_PLANS[planType]
  
  if (!plan || !plan.stripePriceId) {
    throw new Error('Invalid subscription plan type or missing Stripe price ID')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      user_id: userId,
      plan_type: planType,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    subscription_data: {
      metadata: {
        user_id: userId,
        plan_type: planType,
      },
    },
  })

  return session
}

// Create payment intent for custom amounts
export async function createPaymentIntent(
  amount: number,
  userId: string,
  description: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      user_id: userId,
    },
    description,
  })

  return paymentIntent
}

// Retrieve payment intent
export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

// Create customer
export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    ...(name && { name }),
  })
}

// Get customer
export async function getStripeCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId)
}

// List customer payment methods
export async function listCustomerPaymentMethods(customerId: string) {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  })
}

// Create billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Webhooks helper
export function constructWebhookEvent(
  payload: string,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

// Validate webhook signature
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    stripe.webhooks.constructEvent(payload, signature, secret)
    return true
  } catch (error) {
    return false
  }
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100)
}

// Calculate credits for custom amount
export function calculateCreditsFromAmount(amount: number): number {
  // Base rate: $0.0001 per credit (as mentioned in landing page)
  // So $1 = 10,000 credits
  return Math.floor(amount * 100) // amount in cents -> credits
}

// Calculate amount for credits
export function calculateAmountFromCredits(credits: number): number {
  // $0.0001 per credit
  return Math.ceil(credits / 100) // credits -> amount in cents
}

// Get discount for bulk purchases
export function getBulkDiscount(credits: number): number {
  if (credits >= 10000000) return 0.3 // 30% off for 10M+
  if (credits >= 5000000) return 0.2   // 20% off for 5M+
  if (credits >= 1000000) return 0.1   // 10% off for 1M+
  return 0
}

// Usage analytics helpers
export async function getCustomerUsage(customerId: string, startDate: Date, endDate: Date) {
  // This would typically involve querying your database for usage data
  // For now, return placeholder structure
  return {
    totalApiCalls: 0,
    totalCreditsUsed: 0,
    totalSpent: 0,
    averageCreditsPerCall: 0,
    periodStart: startDate,
    periodEnd: endDate
  }
}