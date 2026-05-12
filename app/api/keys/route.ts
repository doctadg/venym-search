import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { generateApiKey } from '@/lib/auth-prisma'
import { getUserApiKeys, createApiKey } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const createKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(100, 'Key name too long'),
})

// GET /api/keys - List user's API keys
export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authUser = authResult.user

    const apiKeys = await getUserApiKeys(authUser.id)

    return NextResponse.json({
      api_keys: apiKeys.map(key => ({
        id: key.id,
        key_name: key.key_name,
        api_key: key.api_key,
        is_active: key.is_active,
        last_used_at: key.last_used_at,
        created_at: key.created_at,
      })),
    })

  } catch (error) {
    logger.error('Get API keys error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authUser = authResult.user

    const body = await request.json()
    const validatedData = createKeySchema.parse(body)
    
    // Generate new API key
    const apiKey = generateApiKey()
    
    // Create in database
    const newKey = await createApiKey({
      user_id: authUser.id,
      key_name: validatedData.name,
      api_key: apiKey,
    })

    if (!newKey) {
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      api_key: {
        id: newKey.id,
        key_name: newKey.key_name,
        api_key: newKey.api_key,
        is_active: newKey.is_active,
        created_at: newKey.created_at,
      },
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Create API key error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}