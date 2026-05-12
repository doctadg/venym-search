import { NextRequest, NextResponse } from 'next/server'
import { successResponse, badRequestResponse } from '@/lib/auth-prisma'
import { z } from 'zod'

const cronInputSchema = z.object({
  expression: z.string().optional(),
  minute: z.string().optional(),
  hour: z.string().optional(),
  day: z.string().optional(),
  month: z.string().optional(),
  weekday: z.string().optional(),
})

function cronToExpression(fields: { minute: string; hour: string; day: string; month: string; weekday: string }): string {
  return `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.weekday}`
}

function parseField(field: string, min: number, max: number): number[] {
  const values = new Set<number>()

  if (field === '*') {
    for (let i = min; i <= max; i++) values.add(i)
    return Array.from(values).sort((a, b) => a - b)
  }

  const parts = field.split(',')
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, stepStr] = part.split('/')
      const step = parseInt(stepStr, 10)
      let start = min
      let end = max
      if (range !== '*') {
        if (range.includes('-')) {
          const [s, e] = range.split('-').map(Number)
          start = s
          end = e
        } else {
          start = parseInt(range, 10)
        }
      }
      for (let i = start; i <= end; i += step) {
        if (i >= min && i <= max) values.add(i)
      }
    } else if (part.includes('-')) {
      const [s, e] = part.split('-').map(Number)
      for (let i = s; i <= e; i++) {
        if (i >= min && i <= max) values.add(i)
      }
    } else {
      const val = parseInt(part, 10)
      if (!isNaN(val) && val >= min && val <= max) values.add(val)
    }
  }

  return Array.from(values).sort((a, b) => a - b)
}

function parseCron(expression: string) {
  const fields = expression.trim().split(/\s+/)
  if (fields.length < 5) {
    return null
  }
  return {
    minute: parseField(fields[0], 0, 59),
    hour: parseField(fields[1], 0, 23),
    day: parseField(fields[2], 1, 31),
    month: parseField(fields[3], 1, 12),
    weekday: parseField(fields[4], 0, 6),
  }
}

function getNextRuns(expression: string, count: number = 10): string[] {
  const cron = parseCron(expression)
  if (!cron) return []

  const runs: string[] = []
  const now = new Date()
  // Start from the next minute to avoid including current moment
  let current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0)
  const maxIterations = 525600 // ~1 year of minutes
  let iterations = 0

  while (runs.length < count && iterations < maxIterations) {
    iterations++
    const month = current.getMonth() + 1
    const day = current.getDate()
    const weekday = current.getDay()
    const hour = current.getHours()
    const minute = current.getMinutes()

    if (
      cron.month.includes(month) &&
      cron.day.includes(day) &&
      cron.weekday.includes(weekday) &&
      cron.hour.includes(hour) &&
      cron.minute.includes(minute)
    ) {
      runs.push(current.toISOString())
    }

    current = new Date(current.getTime() + 60000)
  }

  return runs
}

function explainField(field: string, type: string): string {
  if (field === '*') {
    switch (type) {
      case 'minute': return 'every minute'
      case 'hour': return 'every hour'
      case 'day': return 'every day'
      case 'month': return 'every month'
      case 'weekday': return 'every day of the week'
    }
  }

  const numNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  if (field.includes('/')) {
    const [range, step] = field.split('/')
    const stepNum = parseInt(step)
    if (type === 'weekday') {
      const days = numNames
      return `every ${stepNum} day(s) of the week`
    }
    return `every ${stepNum} ${type === 'minute' ? 'minute(s)' : type === 'hour' ? 'hour(s)' : type === 'month' ? 'month(s)' : 'day(s)'}`
  }

  if (field.includes(',')) {
    const parts = field.split(',')
    if (type === 'weekday') {
      return parts.map(p => numNames[parseInt(p)] || p).join(', ')
    }
    if (type === 'month') {
      return parts.map(p => monthNames[parseInt(p) - 1] || p).join(', ')
    }
    return `at ${field} ${type === 'minute' ? 'minute(s)' : type === 'hour' ? 'hour(s)' : type === 'day' ? 'day(s)' : ''}`
  }

  if (type === 'weekday') {
    return `on ${numNames[parseInt(field)] || `day ${field}`}`
  }
  if (type === 'month') {
    return `in ${monthNames[parseInt(field) - 1] || `month ${field}`}`
  }

  return `at ${type} ${field}`
}

function explainExpression(expression: string): string {
  const fields = expression.trim().split(/\s+/)
  if (fields.length < 5) return 'Invalid cron expression'

  const [, minute, hour, day, month, weekday] = ['', ...fields]

  const parts: string[] = []

  if (minute !== '*' || hour !== '*') {
    parts.push(`Runs at ${hour === '*' ? '00' : hour.padStart(2, '0')}:${minute === '*' ? '00' : minute.padStart(2, '0')}`)
  }

  if (day !== '*') {
    parts.push(`on day ${day} of the month`)
  }

  if (weekday !== '*') {
    const numNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    if (weekday.includes(',')) {
      const days = weekday.split(',').map(d => numNames[parseInt(d)] || d).join(', ')
      parts.push(`on ${days}`)
    } else {
      parts.push(`on ${numNames[parseInt(weekday)] || `day ${weekday}`}`)
    }
  }

  if (month !== '*') {
    parts.push(`in ${explainField(month, 'month')}`)
  }

  if (parts.length === 0) return 'Runs every minute'

  return parts.join(', ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = cronInputSchema.parse(body)

    let expression: string

    if (parsed.expression) {
      expression = parsed.expression.trim()
    } else {
      expression = cronToExpression({
        minute: parsed.minute || '*',
        hour: parsed.hour || '*',
        day: parsed.day || '*',
        month: parsed.month || '*',
        weekday: parsed.weekday || '*',
      })
    }

    // Validate by parsing
    const cron = parseCron(expression)
    if (!cron) {
      return badRequestResponse('Invalid cron expression. Expected 5 fields: minute hour day month weekday')
    }

    const explanation = explainExpression(expression)
    const nextRuns = getNextRuns(expression, 10)

    return successResponse({
      expression,
      explanation,
      human_readable: explanation,
      next_runs: nextRuns,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return badRequestResponse(err.errors.map((e) => e.message).join(', '))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
