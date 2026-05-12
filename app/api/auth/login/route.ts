import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { syncClerkUser } from '@/lib/clerk-auth'
import { logger, generateRequestId, extractRequestContext, PerformanceTimer } from '@/lib/logger'
import { withRateLimit, authRateLimit, getClientIdentifier, bruteForceProtection } from '@/lib/rate-limit'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const requestContext = extractRequestContext(request)
  const context = { ...requestContext, requestId }
  const clientId = getClientIdentifier(request)
  
  logger.info('Login attempt started', context)

  // Apply rate limiting
  const rateLimitCheck = withRateLimit(authRateLimit)(request)
  if (!rateLimitCheck.allowed) {
    logger.warn('Login rate limit exceeded', { ...context, clientId })
    
    return NextResponse.json(
      { error: rateLimitCheck.error!.message },
      { 
        status: rateLimitCheck.error!.status,
        headers: rateLimitCheck.headers
      }
    )
  }

  // Check brute force protection
  if (bruteForceProtection.isBlocked(clientId)) {
    logger.warn('Login blocked due to brute force protection', { ...context, clientId })
    
    return NextResponse.json(
      { error: 'Too many failed login attempts. Please try again later.' },
      { status: 429 }
    )
  }
  
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    logger.debug('Login data validated', { ...context, email })

    // With Clerk, authentication is handled client-side
    // This endpoint shouldn't be used for actual login
    logger.auth('login', false, { ...context, email, reason: 'Custom login not supported with Clerk' })
    
    return NextResponse.json(
      { 
        error: 'Please use the Clerk sign-in component to login',
        useClerkFlow: true
      },
      { status: 400 }
    )

  } catch (error) {
    const duration = Date.now() - startTime
    
    if (error instanceof z.ZodError) {
      logger.warn('Login validation failed', { ...context, errors: error.errors })
      logger.request(request.method, new URL(request.url).pathname, 400, duration, context)
      
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Login error', context, error as Error)
    logger.request(request.method, new URL(request.url).pathname, 500, duration, context)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}