import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const uuidSchema = z.object({
  count: z.number().int().min(1).max(100).default(1),
  version: z.enum(['v4', 'v7']).default('v4'),
  uppercase: z.boolean().default(false),
  no_dashes: z.boolean().default(false),
})

function generateUUIDv4(): string {
  return crypto.randomUUID()
}

function generateUUIDv7(): string {
  const now = Date.now()
  const timestamp = BigInt(now)

  // 48 bits timestamp
  const ts = timestamp & 0xFFFFFFFFFFFFn

  // 74 bits random
  const randUpper = BigInt(crypto.getRandomValues(new Uint32Array(1))[0]) & 0xFFFFn // 16 bits
  const randMid = BigInt(crypto.getRandomValues(new Uint32Array(1))[0]) & 0xFFFFn   // 16 bits
  const randLower = BigInt(crypto.getRandomValues(new Uint32Array(1))[0]) & 0xFFFFFFFFn // 32 bits
  // We only need 74 - 16 - 16 = 42 bits from the lower, but 32 is fine
  // Total: 48 (ts) + 4 (version) + 12 (rand_upper with version nibble) + 2 (variant) + 14 + 32 = 112 bits
  // Actually let's be precise:

  // UUIDv7 layout:
  // time_high (12 hex = 48 bits) | time_mid (4 hex = 16 bits, but we embed version)
  // Actually standard UUIDv7: 48-bit timestamp | 4-bit version | 12-bit rand | 2-bit variant | 62-bit rand

  const timeHigh = Number((ts >> 16n) & 0xFFFFFFFFn)
  const timeMid = Number(ts & 0xFFFFn)

  // version nibble = 7
  const randA = Number(randUpper) & 0x0FFF | 0x7000 // 12 bits with version 7

  // variant bits = 10xx
  const randB = Number(randMid) & 0x3FFF | 0x8000 // 14 bits with variant

  const randC = Number(randLower)

  const hex = [
    timeHigh.toString(16).padStart(8, '0'),
    timeMid.toString(16).padStart(4, '0'),
    randA.toString(16).padStart(4, '0'),
    randB.toString(16).padStart(4, '0'),
    randC.toString(16).padStart(12, '0'),
  ].join('')

  return hex
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { count, version, uppercase, no_dashes } = uuidSchema.parse(body)

    const uuids: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv7()
      if (no_dashes) {
        uuid = uuid.replace(/-/g, '')
      }
      if (uppercase) {
        uuid = uuid.toUpperCase()
      }
      uuids.push(uuid)
    }

    return successResponse({
      uuids,
      version,
      count,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
