/**
 * Clerk Authentication Utilities
 * 
 * Replaces Supabase Auth with Clerk
 */

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { User } from '@prisma/client'
import { prisma } from './prisma'
import { logger } from './logger'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  role?: string
  plan: string
  credits: number
  full_name?: string
  company?: string
}

/**
 * Get authenticated user from Clerk session
 */
export async function getAuthUser(): Promise<{ user: AuthUser } | null> {
  try {
    const user = await currentUser()
    
    if (!user || !user.emailAddresses[0]) {
      return null
    }

    const email = user.emailAddresses[0].emailAddress

    // Get additional user data from our users table
    const userData = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!userData) {
      logger.warn('Clerk user exists but no user data found, auto-syncing', { userId: user.id, email })
      
      // Auto-sync the Clerk user to our database
      const syncedUser = await syncClerkUser(user)
      if (!syncedUser) {
        logger.error('Failed to auto-sync Clerk user', { userId: user.id, email })
        return null
      }
      
      return {
        user: {
          id: syncedUser.id,
          email: syncedUser.email,
          role: syncedUser.role,
          plan: syncedUser.plan,
          credits: syncedUser.credits_remaining,
          full_name: syncedUser.full_name || undefined,
          company: syncedUser.company || undefined
        }
      }
    }

    return {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        plan: userData.plan,
        credits: userData.credits_remaining,
        full_name: userData.full_name || undefined,
        company: userData.company || undefined
      }
    }
  } catch (error) {
    logger.error('Error getting authenticated user', {}, error as Error)
    return null
  }
}

/**
 * Register a new user with Clerk Auth
 */
export async function registerUserWithClerk(
  email: string,
  password: string,
  userData: {
    full_name?: string
    company?: string
    plan?: string
  }
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      }
    }

    // Create user in Clerk
    const client = await clerkClient()
    const clerkUser = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName: userData.full_name?.split(' ')[0],
      lastName: userData.full_name?.split(' ').slice(1).join(' ') || undefined,
    })

    if (!clerkUser) {
      return {
        success: false,
        error: 'Failed to create user account'
      }
    }

    // Create user record in our users table
    const userRecord = await prisma.user.create({
      data: {
        id: clerkUser.id,
        email,
        password_hash: '', // Not needed with Clerk
        full_name: userData.full_name || null,
        company: userData.company || null,
        plan: userData.plan || 'free',
        credits_remaining: 500,
        plan_type: 'free'
      }
    })

    logger.auth('registration', true, {
      userId: clerkUser.id,
      email,
      plan: userData.plan || 'free'
    })

    return {
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        role: userRecord.role,
        plan: userRecord.plan,
        credits: userRecord.credits_remaining,
        full_name: userRecord.full_name || undefined,
        company: userRecord.company || undefined
      }
    }
  } catch (error) {
    logger.error('Registration error', { email }, error as Error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

/**
 * Sync Clerk user with our database (for webhook or first login)
 */
export async function syncClerkUser(clerkUser: any): Promise<User | null> {
  try {
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) return null

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Get metadata from Clerk if available
      const metadata = clerkUser.unsafeMetadata || {}
      
      // Create user in our database - let DB generate UUID
      try {
        user = await prisma.user.create({
          data: {
            email,
            password_hash: '', // Not needed with Clerk
            full_name: (metadata.full_name as string) || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            company: (metadata.company as string) || null,
            use_case: (metadata.use_case as string) || null,
            plan: (metadata.plan as string) || 'free',
            credits_remaining: 500,
            plan_type: (metadata.plan as string) || 'free'
          }
        })
      } catch (error: any) {
        // Handle race condition - user might have been created by another request
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          // Try to find the user again
          user = await prisma.user.findUnique({
            where: { email }
          })
          if (!user) {
            throw error // If still not found, throw the original error
          }
        } else {
          throw error
        }
      }
    }

    return user
  } catch (error) {
    logger.error('Error syncing Clerk user', { clerkUserId: clerkUser.id }, error as Error)
    return null
  }
}

/**
 * Validate API request authentication using Clerk
 */
export async function validateApiAuth(): Promise<{
  authenticated: boolean
  user?: AuthUser
  error?: string
}> {
  try {
    const authResult = await getAuthUser()
    
    if (!authResult) {
      return {
        authenticated: false,
        error: 'Not authenticated'
      }
    }

    return {
      authenticated: true,
      user: authResult.user
    }
  } catch (error) {
    logger.error('API auth validation error', {}, error as Error)
    return {
      authenticated: false,
      error: 'Authentication validation failed'
    }
  }
}

/**
 * Get authenticated user from request (compatibility function)
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  success: boolean
  user?: AuthUser
  error?: string
}> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        success: false,
        error: 'Not authenticated'
      }
    }

    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    const email = clerkUser.emailAddresses[0]?.emailAddress

    if (!email) {
      return {
        success: false,
        error: 'No email found'
      }
    }

    // Get user profile from database
    const userRecord = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!userRecord) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    return {
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        role: userRecord.role,
        plan: userRecord.plan,
        credits: userRecord.credits_remaining,
        full_name: userRecord.full_name || undefined,
        company: userRecord.company || undefined
      }
    }
  } catch (error) {
    logger.error('Authentication error', {}, error as Error)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}