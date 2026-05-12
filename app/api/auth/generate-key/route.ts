import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/clerk-auth'
import { generateApiKey } from '@/lib/auth-prisma'
import { createApiKey } from '@/lib/database-prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthUser()
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const user = authResult.user

    let body: any = {}
    let key_name = 'Default API Key'

    try {
      const requestText = await request.text()
      if (requestText && requestText.trim()) {
        body = JSON.parse(requestText)
        key_name = body.key_name || 'Default API Key'
      }
    } catch (parseError) {
      // If JSON parsing fails, use default key name
      logger.debug('Using default key name due to empty/invalid request body')
    }

    if (typeof key_name !== 'string' || key_name.trim().length === 0) {
      key_name = 'Default API Key'
    }

    // Generate new API key
    const apiKey = generateApiKey()
    
    // Save to database
    const newApiKey = await createApiKey({
      user_id: user.id,
      key_name: key_name.trim(),
      api_key: apiKey
    })

    if (!newApiKey) {
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'API key created successfully',
      api_key: {
        id: newApiKey.id,
        key_name: newApiKey.key_name,
        api_key: newApiKey.api_key,
        created_at: newApiKey.created_at,
        last_used_at: newApiKey.last_used_at
      }
    })

  } catch (error) {
    logger.error('API key generation error', {}, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}