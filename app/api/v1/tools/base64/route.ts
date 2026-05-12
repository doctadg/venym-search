import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const base64Schema = z.object({
  input: z.string().min(1, 'Input is required'),
  encode: z.boolean().optional(),
  mode: z.enum(['encode', 'decode']).optional(),
  url_safe: z.boolean().optional().default(false),
}).transform((data) => {
  // Support both `encode: false` and `mode: "decode"` for decode
  if (data.encode === undefined && data.mode === undefined) {
    data.encode = true
  } else if (data.mode) {
    data.encode = data.mode === 'encode'
  }
  return data
})

function toUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromUrlSafe(urlSafe: string): string {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  if (pad) {
    base64 += '='.repeat(4 - pad)
  }
  return base64
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, encode, url_safe } = base64Schema.parse(body)

    let output: string

    if (encode) {
      // Base64 encode
      const base64 = Buffer.from(input, 'utf-8').toString('base64')
      output = url_safe ? toUrlSafe(base64) : base64
    } else {
      // Base64 decode
      let base64 = url_safe ? fromUrlSafe(input) : input
      try {
        output = Buffer.from(base64, 'base64').toString('utf-8')
      } catch {
        return badRequestResponse('Invalid Base64 input')
      }

      // Validate decode was successful
      if (output === '' && input !== '') {
        // Check if the original input was actually valid
        const reEncoded = url_safe
          ? toUrlSafe(Buffer.from(output, 'utf-8').toString('base64'))
          : Buffer.from(output, 'utf-8').toString('base64')
        if (reEncoded !== input.replace(/=+$/, '').replace(/=+$/, '')) {
          return badRequestResponse('Invalid Base64 input — could not decode')
        }
      }
    }

    return successResponse({
      input,
      output,
      operation: encode ? ('encode' as const) : ('decode' as const),
      encoding: url_safe ? ('url_safe' as const) : ('standard' as const),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
