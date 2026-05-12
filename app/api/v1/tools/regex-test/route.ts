import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const regexSchema = z.object({
  pattern: z.string().min(1, 'Pattern is required'),
  flags: z.string().default('g'),
  test_string: z.string().default(''),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pattern, flags, test_string } = regexSchema.parse(body)

    let regex: RegExp
    try {
      regex = new RegExp(pattern, flags)
    } catch (e: any) {
      return successResponse({
        pattern,
        flags,
        matches: [],
        match_count: 0,
        is_valid: false,
        error: e.message || 'Invalid regular expression',
      })
    }

    const matches: Array<{ match: string; index: number; groups: Record<string, string> }> = []

    if (flags.includes('g')) {
      let m: RegExpExecArray | null
      const safeLimit = 1000
      let count = 0
      while ((m = regex.exec(test_string)) !== null && count < safeLimit) {
        const groups: Record<string, string> = {}
        if (m.groups) {
          for (const key of Object.keys(m.groups)) {
            groups[key] = m.groups[key]
          }
        }
        // Also include numbered groups
        for (let i = 1; i < m.length; i++) {
          if (m[i] !== undefined) {
            groups[`$${i}`] = m[i]
          }
        }
        matches.push({
          match: m[0],
          index: m.index,
          groups,
        })
        if (m[0].length === 0) {
          regex.lastIndex++
        }
        count++
      }
    } else {
      const m = regex.exec(test_string)
      if (m) {
        const groups: Record<string, string> = {}
        if (m.groups) {
          for (const key of Object.keys(m.groups)) {
            groups[key] = m.groups[key]
          }
        }
        for (let i = 1; i < m.length; i++) {
          if (m[i] !== undefined) {
            groups[`$${i}`] = m[i]
          }
        }
        matches.push({
          match: m[0],
          index: m.index,
          groups,
        })
      }
    }

    return successResponse({
      pattern,
      flags,
      matches,
      match_count: matches.length,
      is_valid: true,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
