import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { getUserApiKeys, createApiKey, deleteApiKey } from '@/lib/database-prisma'
import { z } from 'zod'
import crypto from 'crypto'

const createKeySchema = z.object({
  key_name: z.string().min(1, 'Key name is required').max(100),
})

const deleteKeySchema = z.object({
  key_id: z.string().min(1, 'Key ID is required'),
})

// Generate a secure API key
function generateApiKey(): string {
  const prefix = 'sk_live_YOUR_API_KEY'
  const randomBytes = crypto.randomBytes(32).toString('hex')
  return prefix + randomBytes
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeys = await getUserApiKeys(authResult.user.id)
    
    // Hide the actual key values, only show partial
    const safeApiKeys = apiKeys.map(key => ({
      ...key,
      api_key: key.api_key.substring(0, 12) + '...' + key.api_key.slice(-4)
    }))

    return NextResponse.json({ api_keys: safeApiKeys })

  } catch (error) {
    console.error('Get API keys error:', error)
    return NextResponse.json(
      { error: 'Failed to get API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createKeySchema.parse(body)

    // Check if user already has too many API keys (limit to 10)
    const existingKeys = await getUserApiKeys(authResult.user.id)
    if (existingKeys.length >= 10) {
      return NextResponse.json(
        { error: 'Maximum number of API keys (10) reached' },
        { status: 400 }
      )
    }

    // Generate new API key
    const newApiKey = generateApiKey()

    const apiKey = await createApiKey({
      user_id: authResult.user.id,
      key_name: validatedData.key_name,
      api_key: newApiKey,
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'API key created successfully',
      api_key: {
        id: apiKey.id,
        key_name: apiKey.key_name,
        api_key: newApiKey, // Return full key only on creation
        created_at: apiKey.created_at,
        is_active: apiKey.is_active,
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create API key error:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await getAuthUser()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = deleteKeySchema.parse(body)

    const success = await deleteApiKey(validatedData.key_id, authResult.user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete API key or key not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'API key deleted successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Delete API key error:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}