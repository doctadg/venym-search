/**
 * Rate Limiting Utility
 * 
 * Implements memory-based rate limiting for API endpoints.
 * In production, you might want to use Redis or a similar external store.
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

interface RateLimitEntry {
  count: number
  windowStart: number
  lastRequestTime: number
}

// In-memory store for rate limiting (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries older than 1 hour
    if (now - entry.lastRequestTime > 60 * 60 * 1000) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes

/**
 * Create a rate limiter with the given configuration
 */
export function createRateLimit(config: RateLimitConfig) {
  return function rateLimit(identifier: string): {
    success: boolean
    limit: number
    remaining: number
    reset: number
    message?: string
  } {
    const now = Date.now()
    const key = `${identifier}:${Math.floor(now / config.windowMs)}`
    
    let entry = rateLimitStore.get(key)
    
    if (!entry) {
      entry = {
        count: 0,
        windowStart: now,
        lastRequestTime: now
      }
      rateLimitStore.set(key, entry)
    }
    
    entry.count++
    entry.lastRequestTime = now
    
    const remaining = Math.max(0, config.maxRequests - entry.count)
    const reset = entry.windowStart + config.windowMs
    
    return {
      success: entry.count <= config.maxRequests,
      limit: config.maxRequests,
      remaining,
      reset,
      ...(entry.count > config.maxRequests && { message: config.message })
    }
  }
}

/**
 * Pre-configured rate limiters for different endpoints
 */

// General API rate limiter
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later'
})

// Authentication rate limiter (stricter)
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later'
})

// Registration rate limiter (very strict)
export const registerRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 registration attempts per hour
  message: 'Too many registration attempts, please try again later'
})

// Password reset rate limiter
export const passwordResetRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 password reset attempts per hour
  message: 'Too many password reset attempts, please try again later'
})

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('cf-connecting-ip') // Cloudflare
  
  // Use the first available IP, fallback to 'unknown'
  const ip = forwarded?.split(',')[0] || realIp || clientIp || 'unknown'
  
  return ip.trim()
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export function withRateLimit(
  rateLimiter: ReturnType<typeof createRateLimit>,
  getIdentifier?: (request: Request) => string
) {
  return function (request: Request): {
    allowed: boolean
    headers: Record<string, string>
    error?: { message: string; status: number }
  } {
    const identifier = getIdentifier ? getIdentifier(request) : getClientIdentifier(request)
    const result = rateLimiter(identifier)
    
    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    }
    
    if (!result.success) {
      return {
        allowed: false,
        headers,
        error: {
          message: result.message || 'Rate limit exceeded',
          status: 429
        }
      }
    }
    
    return {
      allowed: true,
      headers
    }
  }
}

/**
 * User-specific rate limiting (requires authentication)
 */
export function createUserRateLimit(config: RateLimitConfig) {
  const limiter = createRateLimit(config)
  
  return function userRateLimit(userId: string) {
    return limiter(`user:${userId}`)
  }
}

/**
 * Plan-based rate limiting
 */
export function getPlanRateLimit(plan: string): RateLimitConfig {
  switch (plan) {
    case 'free':
      return {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 10,
        message: 'Free plan rate limit exceeded. Upgrade for higher limits.'
      }
    case 'hobby':
      return {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 1000,
        message: 'Hobby plan rate limit exceeded.'
      }
    case 'pro':
      return {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 5000,
        message: 'Pro plan rate limit exceeded.'
      }
    case 'enterprise':
      return {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 20000,
        message: 'Enterprise plan rate limit exceeded.'
      }
    default:
      return getPlanRateLimit('free')
  }
}

/**
 * Endpoint-specific rate limiting
 */
export const endpointRateLimits = {
  // Search endpoints
  search: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Search rate limit exceeded'
  }),
  
  // Scraping endpoints (more expensive)
  scrape: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message: 'Scraping rate limit exceeded'
  }),
  
  // Data enrichment endpoints
  enrich: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    message: 'Data enrichment rate limit exceeded'
  })
}

/**
 * Brute force protection for login attempts
 */
export class BruteForceProtection {
  private attempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>()
  
  constructor(
    private maxAttempts: number = 5,
    private blockDurationMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  recordAttempt(identifier: string, success: boolean): {
    allowed: boolean
    remainingAttempts?: number
    blockedUntil?: Date
  } {
    const now = Date.now()
    let entry = this.attempts.get(identifier)
    
    if (!entry) {
      entry = { count: 0, lastAttempt: now }
      this.attempts.set(identifier, entry)
    }
    
    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        blockedUntil: new Date(entry.blockedUntil)
      }
    }
    
    // Reset if block period has expired
    if (entry.blockedUntil && now >= entry.blockedUntil) {
      entry.count = 0
      entry.blockedUntil = undefined
    }
    
    if (success) {
      // Reset on successful login
      entry.count = 0
      entry.blockedUntil = undefined
      return { allowed: true }
    } else {
      // Increment failed attempts
      entry.count++
      entry.lastAttempt = now
      
      if (entry.count >= this.maxAttempts) {
        entry.blockedUntil = now + this.blockDurationMs
        return {
          allowed: false,
          blockedUntil: new Date(entry.blockedUntil)
        }
      }
      
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts - entry.count
      }
    }
  }
  
  isBlocked(identifier: string): boolean {
    const entry = this.attempts.get(identifier)
    if (!entry?.blockedUntil) return false
    
    return Date.now() < entry.blockedUntil
  }
}

// Global brute force protection instance
export const bruteForceProtection = new BruteForceProtection()