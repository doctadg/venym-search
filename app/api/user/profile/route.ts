import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  use_case: z.string().max(500).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authUser = authResult.user

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        full_name: true,
        plan: true,
        credits_remaining: true,
        company: true,
        use_case: true,
        created_at: true,
        updated_at: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    logger.error('Get profile error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authUser = authResult.user

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Check if email is being changed and if it's already taken
    if (validatedData.email !== authUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (existingUser && existingUser.id !== authUser.id) {
        return NextResponse.json(
          { error: 'Email address is already in use' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        full_name: validatedData.full_name,
        email: validatedData.email,
        company: validatedData.company,
        use_case: validatedData.use_case,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        plan: true,
        credits_remaining: true,
        company: true,
        use_case: true,
        created_at: true,
        updated_at: true,
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Update profile error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}