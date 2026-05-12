import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const jwtSchema = z.object({
  token: z.string().optional(),
  jwt: z.string().optional(),
}).transform(data => ({
  token: data.token || data.jwt || '',
})).refine(data => data.token.length > 0, { message: 'Token is required' })

function decodeBase64Url(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding
  const pad = base64.length % 4
  if (pad) {
    base64 += '='.repeat(4 - pad)
  }
  return Buffer.from(base64, 'base64').toString('utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = jwtSchema.parse(body)

    // Remove "Bearer " prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim()

    // Split JWT into parts
    const parts = cleanToken.split('.')
    if (parts.length !== 3) {
      return badRequestResponse('Invalid JWT format — expected 3 parts separated by dots (header.payload.signature)')
    }

    const [headerB64, payloadB64, signature] = parts

    // Decode header and payload
    let header: Record<string, unknown>
    let payload: Record<string, unknown>

    try {
      header = JSON.parse(decodeBase64Url(headerB64))
    } catch {
      return badRequestResponse('Failed to decode JWT header — invalid Base64')
    }

    try {
      payload = JSON.parse(decodeBase64Url(payloadB64))
    } catch {
      return badRequestResponse('Failed to decode JWT payload — invalid Base64')
    }

    // Check expiration
    let isExpired = false
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp) {
      isExpired = payload.exp < now
    }

    // Extract common claims
    const result: {
      header: Record<string, unknown>
      payload: Record<string, unknown>
      signature: string
      is_expired: boolean
      issued_at?: string
      expires_at?: string
      issuer?: string
    } = {
      header,
      payload,
      signature,
      is_expired: isExpired,
    }

    if (payload.iat) {
      result.issued_at = new Date((payload.iat as number) * 1000).toISOString()
    }
    if (payload.exp) {
      result.expires_at = new Date((payload.exp as number) * 1000).toISOString()
    }
    if (payload.iss) {
      result.issuer = payload.iss as string
    }

    return successResponse(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
