/**
 * Database Service Layer using Prisma
 * 
 * Replaces all Supabase SDK operations with Prisma client calls
 */

import { prisma } from './prisma'
import { logger } from './logger'
import type { 
  User, 
  ApiKey, 
  ApiRequest, 
  Payment,
  BlogPost,
  TrendingTopic,
  ContentGenerationJob,
  BlogMetrics,
  BlogCategory,
  SeoData,
  PostStatus,
  JobStatus
} from '@prisma/client'

// Re-export types for convenience
export type { 
  User, 
  ApiKey, 
  ApiRequest, 
  Payment, 
  BlogPost,
  TrendingTopic,
  ContentGenerationJob,
  BlogMetrics,
  BlogCategory,
  SeoData,
  PostStatus,
  JobStatus
} from '@prisma/client'

/**
 * User Operations
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user
  } catch (error) {
    logger.error('Error getting user by email', { email }, error as Error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user
  } catch (error) {
    logger.error('Error getting user by ID', { userId: id }, error as Error)
    return null
  }
}

export async function createUser(userData: {
  id?: string
  email: string
  password_hash: string
  full_name?: string | null
  company?: string | null
  plan?: string
  credits_remaining?: number
  stripe_customer_id?: string | null
  subscription_id?: string | null
  subscription_status?: string | null
  plan_type?: string
  current_period_end?: Date | null
}): Promise<User | null> {
  try {
    const user = await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        password_hash: userData.password_hash,
        full_name: userData.full_name || null,
        company: userData.company || null,
        plan: userData.plan || 'free',
        credits_remaining: userData.credits_remaining || 500,
        stripe_customer_id: userData.stripe_customer_id || null,
        subscription_id: userData.subscription_id || null,
        subscription_status: userData.subscription_status || null,
        plan_type: userData.plan_type || 'free',
        current_period_end: userData.current_period_end || null
      }
    })
    return user
  } catch (error) {
    logger.error('Error creating user', { email: userData.email }, error as Error)
    return null
  }
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates
    })
    return user
  } catch (error) {
    logger.error('Error updating user', { userId: id }, error as Error)
    return null
  }
}

export async function updateUserCredits(userId: string, credits: number): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { credits_remaining: credits }
    })
    return user
  } catch (error) {
    logger.error('Error updating user credits', { userId, credits }, error as Error)
    return null
  }
}

export async function addUserCredits(userId: string, creditsToAdd: number): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        credits_remaining: {
          increment: creditsToAdd
        }
      }
    })
    return user
  } catch (error) {
    logger.error('Error adding user credits', { userId, creditsToAdd }, error as Error)
    return null
  }
}

export async function deductCredits(userId: string, creditsToDeduct: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits_remaining: true }
    })

    if (!user || user.credits_remaining < creditsToDeduct) {
      return false
    }

    await prisma.user.update({
      where: { id: userId },
      data: { credits_remaining: user.credits_remaining - creditsToDeduct }
    })

    return true
  } catch (error) {
    logger.error('Error deducting credits', { userId, creditsToDeduct }, error as Error)
    return false
  }
}

/**
 * API Keys Operations
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
    return apiKeys
  } catch (error) {
    logger.error('Error getting user API keys', { userId }, error as Error)
    return []
  }
}

export async function getApiKeyByKey(apiKey: string): Promise<(ApiKey & { user: User }) | null> {
  try {
    const key = await prisma.apiKey.findUnique({
      where: { api_key: apiKey },
      include: { user: true }
    })
    return key
  } catch (error) {
    logger.error('Error getting API key', { apiKey: apiKey.substring(0, 10) + '...' }, error as Error)
    return null
  }
}

export async function createApiKey(data: {
  user_id: string
  key_name: string
  api_key: string
}): Promise<ApiKey | null> {
  try {
    const apiKey = await prisma.apiKey.create({
      data
    })
    return apiKey
  } catch (error) {
    logger.error('Error creating API key', { userId: data.user_id, keyName: data.key_name }, error as Error)
    return null
  }
}

export async function updateApiKeyLastUsed(apiKeyId: string): Promise<void> {
  try {
    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { last_used_at: new Date() }
    })
  } catch (error) {
    logger.error('Error updating API key last used', { apiKeyId }, error as Error)
  }
}

export async function deleteApiKey(apiKeyId: string, userId: string): Promise<boolean> {
  try {
    await prisma.apiKey.delete({
      where: { 
        id: apiKeyId,
        user_id: userId 
      }
    })
    return true
  } catch (error) {
    logger.error('Error deleting API key', { apiKeyId, userId }, error as Error)
    return false
  }
}

/**
 * API Requests Operations
 */
export async function logApiRequest(data: {
  user_id: string
  api_key_id?: string
  endpoint: string
  method: string
  status_code: number
  credits_used: number
  request_data?: any
  response_data?: any
  latency_ms?: number
  backend_latency_ms?: number
}): Promise<ApiRequest | null> {
  try {
    const request = await prisma.apiRequest.create({
      data: {
        user_id: data.user_id,
        api_key_id: data.api_key_id || null,
        endpoint: data.endpoint,
        method: data.method,
        status_code: data.status_code,
        credits_used: data.credits_used,
        request_data: data.request_data || null,
        response_data: data.response_data || null,
        latency_ms: data.latency_ms || null,
        backend_latency_ms: data.backend_latency_ms || null
      }
    })
    return request
  } catch (error) {
    logger.error('Error logging API request', { userId: data.user_id }, error as Error)
    return null
  }
}

export async function getUserApiRequests(
  userId: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<ApiRequest[]> {
  try {
    const requests = await prisma.apiRequest.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    })
    return requests
  } catch (error) {
    logger.error('Error getting user API requests', { userId }, error as Error)
    return []
  }
}

export async function getUserApiRequestsCount(userId: string): Promise<number> {
  try {
    const count = await prisma.apiRequest.count({
      where: { user_id: userId }
    })
    return count
  } catch (error) {
    logger.error('Error getting user API requests count', { userId }, error as Error)
    return 0
  }
}

/**
 * Analytics Operations
 */
export async function getUserAnalytics(userId: string): Promise<{
  totalRequests: number
  totalCreditsUsed: number
  requestsLast30Days: number
  creditsUsedLast30Days: number
}> {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [totalRequests, totalCreditsUsed, recentRequests] = await Promise.all([
      prisma.apiRequest.count({
        where: { user_id: userId }
      }),
      prisma.apiRequest.aggregate({
        where: { user_id: userId },
        _sum: { credits_used: true }
      }),
      prisma.apiRequest.findMany({
        where: { 
          user_id: userId,
          created_at: { gte: thirtyDaysAgo }
        },
        select: { credits_used: true }
      })
    ])

    const requestsLast30Days = recentRequests.length
    const creditsUsedLast30Days = recentRequests.reduce((sum, req) => sum + req.credits_used, 0)

    return {
      totalRequests,
      totalCreditsUsed: totalCreditsUsed._sum.credits_used || 0,
      requestsLast30Days,
      creditsUsedLast30Days
    }
  } catch (error) {
    logger.error('Error getting user analytics', { userId }, error as Error)
    return {
      totalRequests: 0,
      totalCreditsUsed: 0,
      requestsLast30Days: 0,
      creditsUsedLast30Days: 0
    }
  }
}

/**
 * Payment Operations
 */
export async function createPayment(data: {
  user_id: string
  stripe_payment_intent_id: string
  amount: number
  credits_purchased: number
  plan_name: string
  status?: string
}): Promise<Payment | null> {
  try {
    const payment = await prisma.payment.create({
      data: {
        user_id: data.user_id,
        stripe_payment_intent_id: data.stripe_payment_intent_id,
        amount: data.amount,
        credits_purchased: data.credits_purchased,
        plan_name: data.plan_name,
        status: data.status || 'pending'
      }
    })
    return payment
  } catch (error) {
    logger.error('Error creating payment', { userId: data.user_id }, error as Error)
    return null
  }
}

export async function updatePaymentStatus(
  stripePaymentIntentId: string, 
  status: string
): Promise<Payment | null> {
  try {
    const payment = await prisma.payment.update({
      where: { stripe_payment_intent_id: stripePaymentIntentId },
      data: { status }
    })
    return payment
  } catch (error) {
    logger.error('Error updating payment status', { stripePaymentIntentId, status }, error as Error)
    return null
  }
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  try {
    const payments = await prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
    return payments
  } catch (error) {
    logger.error('Error getting user payments', { userId }, error as Error)
    return []
  }
}

/**
 * Health Check
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  latencyMs?: number
  error?: string
}> {
  try {
    const start = Date.now()
    
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`
    
    const latencyMs = Date.now() - start
    
    return {
      healthy: true,
      latencyMs
    }
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}