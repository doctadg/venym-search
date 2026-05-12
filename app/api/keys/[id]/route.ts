import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { deleteApiKey } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'

// DELETE /api/keys/[id] - Delete/deactivate API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authUser = authResult.user

    const resolvedParams = await params
    const keyId = resolvedParams.id
    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      )
    }

    const success = await deleteApiKey(keyId, authUser.id)
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete API key or key not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'API key deleted successfully',
    })

  } catch (error) {
    logger.error('Delete API key error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}