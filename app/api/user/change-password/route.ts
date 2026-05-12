import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth-prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters long'),
  confirm_password: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

export async function POST(request: NextRequest) {
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
    const validatedData = changePasswordSchema.parse(body)

    // Get current user with password hash
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        password_hash: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.current_password,
      user.password_hash
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(validatedData.new_password)

    // Update password
    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        password_hash: newPasswordHash,
        updated_at: new Date(),
      }
    })

    return NextResponse.json({
      message: 'Password changed successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Change password error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}