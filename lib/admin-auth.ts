/**
 * Admin authentication middleware and utilities
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from './clerk-auth'
import { getUserById } from './database-prisma'
import { logger } from './logger'

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const user = await getUserById(userId)
    return user?.role === 'admin'
  } catch (error) {
    logger.error('Error checking admin status', { userId }, error as Error)
    return false
  }
}

export async function requireAdmin(request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await getAuthUser()
    
    if (!authResult || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    const isAdmin = await isUserAdmin(authResult.user.id)
    
    if (!isAdmin) {
      logger.warn('Non-admin user attempted to access admin route', {
        userId: authResult.user.id,
        email: authResult.user.email,
        path: request.nextUrl.pathname
      })
      
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
    
    // Return user data if admin
    return { user: authResult.user, isAdmin: true }
  } catch (error) {
    logger.error('Admin auth check failed', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function getAdminUser() {
  try {
    const authResult = await getAuthUser()
    
    if (!authResult || !authResult.user) {
      return null
    }
    
    const isAdmin = await isUserAdmin(authResult.user.id)
    
    if (!isAdmin) {
      return null
    }
    
    return authResult.user
  } catch (error) {
    logger.error('Failed to get admin user', {}, error as Error)
    return null
  }
}