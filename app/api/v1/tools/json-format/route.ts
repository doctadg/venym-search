import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const jsonFormatSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  indent: z.number().min(1).max(8).optional().default(2),
  sort_keys: z.boolean().optional().default(false),
})

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0
  if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countKeys(item), 0)
  return Object.values(obj as Record<string, unknown>).reduce(
    (sum, val) => sum + 1 + countKeys(val),
    0
  )
}

function getDepth(obj: unknown, depth = 0): number {
  if (typeof obj !== 'object' || obj === null) return depth
  if (Array.isArray(obj)) {
    return obj.length > 0 ? Math.max(...obj.map((item) => getDepth(item, depth + 1))) : depth
  }
  const vals = Object.values(obj as Record<string, unknown>)
  return vals.length > 0 ? Math.max(...vals.map((val) => getDepth(val, depth + 1))) : depth
}

function sortObjectKeys(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(sortObjectKeys)
  const sorted = Object.keys(obj as Record<string, unknown>)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
      return acc
    }, {})
  return sorted
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function tryFixJson(input: string): { fixed: string; fixes: string[] } {
  let fixed = input
  const fixes: string[] = []

  // Replace single quotes with double quotes
  if (/'/.test(fixed)) {
    fixed = fixed.replace(/'/g, '"')
    fixes.push('Replaced single quotes with double quotes')
  }

  // Remove trailing commas before } or ]
  if (/(,\s*[\]}])/g.test(fixed)) {
    fixed = fixed.replace(/,\s*([\]}])/g, '$1')
    fixes.push('Removed trailing commas')
  }

  // Add quotes around unquoted keys
  fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
  if (fixed !== input.replace(/'/g, '"').replace(/,\s*([\]}])/g, '$1')) {
    fixes.push('Added quotes around unquoted keys')
  }

  return { fixed, fixes }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, indent, sort_keys } = jsonFormatSchema.parse(body)

    // Try parsing directly first
    let parsed: unknown
    let isValid = false
    let error: string | undefined

    try {
      parsed = JSON.parse(input)
      isValid = true
    } catch {
      // Try fixing common JSON issues
      const { fixed, fixes } = tryFixJson(input)
      try {
        parsed = JSON.parse(fixed)
        isValid = true
        error = `Auto-fixed: ${fixes.join(', ')}`
      } catch (parseError) {
        isValid = false
        error = `Invalid JSON: ${(parseError as Error).message}`
      }
    }

    let output = ''
    if (isValid && parsed !== undefined) {
      let processed = sort_keys ? sortObjectKeys(parsed) : parsed
      output = JSON.stringify(processed, null, indent)
    }

    const stats = isValid
      ? {
          keys: countKeys(parsed),
          depth: getDepth(parsed),
          size: formatBytes(new TextEncoder().encode(output || input).length),
        }
      : { keys: 0, depth: 0, size: formatBytes(new TextEncoder().encode(input).length) }

    return successResponse({
      input,
      output,
      valid: isValid,
      error,
      stats,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
