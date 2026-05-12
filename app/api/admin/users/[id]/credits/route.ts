import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof NextResponse) {
      return adminCheck
    }

    const params = await context.params
    const userId = params.id
    const body = await request.json()
    const { action, amount, reason } = body

    // Validate input
    if (!action || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid action or amount' },
        { status: 400 }
      )
    }

    if (!['add', 'set', 'subtract'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be add, set, or subtract' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits_remaining: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate new credits
    let newCredits = 0
    switch (action) {
      case 'add':
        newCredits = user.credits_remaining + amount
        break
      case 'set':
        newCredits = amount
        break
      case 'subtract':
        newCredits = Math.max(0, user.credits_remaining - amount)
        break
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits_remaining: newCredits }
    })

    // Log the credit adjustment
    logger.info('Admin adjusted user credits', {
      adminId: adminCheck.user.id,
      userId,
      action,
      amount,
      oldCredits: user.credits_remaining,
      newCredits,
      reason
    })

    return NextResponse.json({
      user: updatedUser,
      adjustment: {
        action,
        amount,
        oldCredits: user.credits_remaining,
        newCredits,
        reason
      }
    })

  } catch (error) {
    const params = await context.params
    logger.error('Admin credit adjustment error', { userId: params.id }, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}