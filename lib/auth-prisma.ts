/**
 * Authentication utilities for Prisma database
 * 
 * Provides API key authentication and authorization functions
 */

import { NextRequest, NextResponse } from 'next/server'
import { getApiKeyByKey, updateApiKeyLastUsed } from './database-prisma'
import { logger } from './logger'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export interface ApiKeyAuthData {
  user_id: string
  user_email: string
  user_plan: string
  user_credits: number
  key_id: string
  key_active: boolean
}

/**
 * Authenticate request using API key
 */
export async function getApiKeyAuth(request: NextRequest): Promise<ApiKeyAuthData | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Get API key with user data
    const keyData = await getApiKeyByKey(apiKey)
    
    if (!keyData || !keyData.is_active) {
      return null
    }

    // Update last used timestamp
    await updateApiKeyLastUsed(keyData.id)

    return {
      user_id: keyData.user.id,
      user_email: keyData.user.email,
      user_plan: keyData.user.plan,
      user_credits: keyData.user.credits_remaining,
      key_id: keyData.id,
      key_active: keyData.is_active
    }
  } catch (error) {
    logger.error('API key authentication error', {}, error as Error)
    return null
  }
}

/**
 * Check if user has access to a specific feature based on their plan
 */
export function hasFeatureAccess(plan: string, feature: string): boolean {
  const planHierarchy = ['free', 'starter', 'builder', 'unicorn']
  const featureRequirements: Record<string, string> = {
    'contact_extraction': 'starter',
    'social_discovery': 'builder',
    'ai_summary': 'builder',
    'advanced_scraping': 'unicorn',
    'priority_support': 'starter',
    'custom_endpoints': 'unicorn'
  }

  const userPlanLevel = planHierarchy.indexOf(plan)
  const requiredPlanLevel = planHierarchy.indexOf(featureRequirements[feature] || 'free')
  
  return userPlanLevel >= requiredPlanLevel
}

/**
 * Calculate credits required for an operation
 */
export function calculateCredits(endpoint: string, params: any, userPlan: string): number {
  const baseCosts: Record<string, number> = {
    'search': 10,
    'scrape': 15,
  }

  let credits = baseCosts[endpoint] || 10

  // Apply multipliers based on parameters
  if (endpoint === 'search') {
    credits += (params.max_results || 10) * 1
    if (params.include_contacts) credits += 5
    if (params.include_social) credits += 5
    if (params.auto_scrape_top) credits += params.auto_scrape_top * 3
  }

  if (endpoint === 'scrape') {
    credits += Math.ceil((params.urls?.length || 1) * 8)
    if (params.extract_contacts) credits += 5
    if (params.ai_summary) credits += 10
  }

  // Apply plan discounts
  const discounts: Record<string, number> = {
    'free': 0,
    'starter': 0.1,
    'builder': 0.2,
    'unicorn': 0.3
  }

  const discount = discounts[userPlan] || 0
  return Math.ceil(credits * (1 - discount))
}

/**
 * Standard response helpers
 */
export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

export function badRequestResponse(message: string): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  )
}

export function insufficientCreditsResponse(required: number, available: number): NextResponse {
  return NextResponse.json(
    { 
      error: 'Insufficient credits',
      credits_required: required,
      credits_available: available
    },
    { status: 402 }
  )
}

export function internalErrorResponse(message = 'Internal server error'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}

export function successResponse(data: any, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}