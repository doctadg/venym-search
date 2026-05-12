import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const urlEncodeSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  encode: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, encode } = urlEncodeSchema.parse(body)

    let output: string

    if (encode) {
      output = encodeURIComponent(input)
    } else {
      try {
        output = decodeURIComponent(input)
      } catch {
        try {
          output = decodeURI(input)
        } catch {
          return badRequestResponse('Invalid URL-encoded input')
        }
      }
    }

    // Build component breakdown
    const components: { original: string; encoded: string; type: string }[] = []
    if (encode) {
      // Break input into segments showing what gets encoded
      const chars = Array.from(input)
      for (const char of chars) {
        const encoded = encodeURIComponent(char)
        if (encoded !== char) {
          components.push({ original: char, encoded, type: 'special' })
        } else {
          components.push({ original: char, encoded, type: 'safe' })
        }
      }
    } else {
      // Break encoded input into %XX sequences and safe chars
      const regex = /(%[0-9A-Fa-f]{2})|([^%]+)/g
      let match
      while ((match = regex.exec(input)) !== null) {
        const segment = match[0]
        if (segment.startsWith('%')) {
          try {
            components.push({
              original: segment,
              encoded: decodeURIComponent(segment),
              type: 'encoded',
            })
          } catch {
            components.push({ original: segment, encoded: segment, type: 'literal' })
          }
        } else {
          components.push({ original: segment, encoded: segment, type: 'safe' })
        }
      }
    }

    return successResponse({
      input,
      output,
      operation: encode ? ('encode' as const) : ('decode' as const),
      components,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
