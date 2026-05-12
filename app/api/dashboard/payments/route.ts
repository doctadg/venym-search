import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { getUserPayments } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'
import { formatCurrency } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authUser = authResult.user

    const payments = await getUserPayments(authUser.id)

    // Format payments for the frontend
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      date: new Date(payment.created_at).toLocaleDateString(),
      amount: formatCurrency(payment.amount),
      credits: payment.credits_purchased.toLocaleString(),
      status: payment.status,
      plan: payment.plan_name
    }))

    return NextResponse.json({
      payments: formattedPayments
    })

  } catch (error) {
    logger.error('Dashboard payments error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}