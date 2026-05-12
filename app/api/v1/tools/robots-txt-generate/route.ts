import { NextRequest, NextResponse } from 'next/server'

interface GenerateRequest {
  mode: 'generate'
  rules: Array<{
    user_agent: string
    allow: string[]
    disallow: string[]
    crawl_delay?: number
  }>
  sitemaps: string[]
  host?: string
}

interface TestRequest {
  mode: 'test'
  robots_txt: string
  url: string
  user_agent?: string
}

function generateRobotsTxt(data: Omit<GenerateRequest, 'mode'>): string {
  const lines: string[] = []

  for (const rule of data.rules) {
    lines.push(`User-agent: ${rule.user_agent}`)
    for (const path of rule.allow) {
      if (path.trim()) lines.push(`Allow: ${path.trim()}`)
    }
    for (const path of rule.disallow) {
      if (path.trim()) lines.push(`Disallow: ${path.trim()}`)
    }
    if (rule.crawl_delay) {
      lines.push(`Crawl-delay: ${rule.crawl_delay}`)
    }
    lines.push('')
  }

  if (data.sitemaps?.length) {
    for (const sitemap of data.sitemaps) {
      if (sitemap.trim()) lines.push(`Sitemap: ${sitemap.trim()}`)
    }
    lines.push('')
  }

  if (data.host?.trim()) {
    lines.push(`Host: ${data.host.trim()}`)
    lines.push('')
  }

  return lines.join('\n').trim() + '\n'
}

function testUrlAgainstRobots(robotsTxt: string, url: string, userAgent: string): {
  url: string
  allowed: boolean
  matching_rule: string
  user_agent: string
} {
  const ua = userAgent || '*'

  // Parse robots.txt into rule groups
  interface RuleGroup {
    userAgent: string
    rules: Array<{ type: 'allow' | 'disallow'; pattern: string }>
    crawlDelay?: number
  }

  const groups: RuleGroup[] = []
  let currentGroup: RuleGroup | null = null

  for (const line of robotsTxt.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const directive = trimmed.slice(0, colonIdx).trim().toLowerCase()
    const value = trimmed.slice(colonIdx + 1).trim()

    if (directive === 'user-agent') {
      currentGroup = { userAgent: value, rules: [], crawlDelay: undefined }
      groups.push(currentGroup)
    } else if (currentGroup) {
      if (directive === 'allow') {
        currentGroup.rules.push({ type: 'allow', pattern: value })
      } else if (directive === 'disallow') {
        currentGroup.rules.push({ type: 'disallow', pattern: value })
      } else if (directive === 'crawl-delay') {
        currentGroup.crawlDelay = parseInt(value, 10)
      }
    }
  }

  // Normalize URL — extract path
  let urlPath: string
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    urlPath = parsed.pathname
  } catch {
    urlPath = url.startsWith('/') ? url : `/${url}`
  }

  // Find matching groups (specific UA first, then wildcard)
  let matchingGroup: RuleGroup | null = null
  for (const group of groups) {
    if (group.userAgent === ua || (ua === '*' && group.userAgent === '*')) {
      matchingGroup = group
    } else if (ua !== '*' && group.userAgent !== '*' && ua.toLowerCase().includes(group.userAgent.toLowerCase())) {
      matchingGroup = group
    }
  }

  // If no specific group, use wildcard
  if (!matchingGroup) {
    for (const group of groups) {
      if (group.userAgent === '*') {
        matchingGroup = group
        break
      }
    }
  }

  // If no matching group at all — allow
  if (!matchingGroup) {
    return { url, allowed: true, matching_rule: 'No matching User-agent group — allowed by default', user_agent: ua }
  }

  // If no rules — allow
  if (matchingGroup.rules.length === 0) {
    return { url, allowed: true, matching_rule: `User-agent: ${matchingGroup.userAgent} has no rules — allowed by default`, user_agent: ua }
  }

  // Find the most specific matching rule
  let bestMatch: { type: 'allow' | 'disallow'; pattern: string; length: number } | null = null

  for (const rule of matchingGroup.rules) {
    if (matchPath(rule.pattern, urlPath)) {
      if (!bestMatch || rule.pattern.length > bestMatch.length) {
        bestMatch = { type: rule.type, pattern: rule.pattern, length: rule.pattern.length }
      }
    }
  }

  if (!bestMatch) {
    return { url, allowed: true, matching_rule: 'No matching rule found — allowed by default', user_agent: ua }
  }

  const directive = bestMatch.type === 'allow' ? 'Allow' : 'Disallow'
  return {
    url,
    allowed: bestMatch.type === 'allow',
    matching_rule: `${directive}: ${bestMatch.pattern}`,
    user_agent: ua,
  }
}

function matchPath(pattern: string, path: string): boolean {
  if (pattern === '') return true
  if (pattern === '/') return path === '/'

  // Convert robots.txt pattern to regex
  // * matches anything, $ matches end of string
  const regexStr = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\$$/, '$')

  try {
    const re = new RegExp(`^${regexStr}`)
    return re.test(path)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.mode || (body.mode !== 'generate' && body.mode !== 'test')) {
      return NextResponse.json({ error: 'mode must be "generate" or "test"' }, { status: 400 })
    }

    if (body.mode === 'generate') {
      const { rules, sitemaps = [], host } = body

      if (!Array.isArray(rules) || rules.length === 0) {
        return NextResponse.json({ error: 'At least one rule is required' }, { status: 400 })
      }

      for (const rule of rules) {
        if (!rule.user_agent || typeof rule.user_agent !== 'string') {
          return NextResponse.json({ error: 'Each rule must have a user_agent string' }, { status: 400 })
        }
      }

      const robotsTxt = generateRobotsTxt({ rules, sitemaps, host })
      const rulesCount = rules.length

      return NextResponse.json({ robots_txt: robotsTxt, rules_count: rulesCount })
    }

    if (body.mode === 'test') {
      const { robots_txt, url, user_agent = '*' } = body

      if (!robots_txt || typeof robots_txt !== 'string') {
        return NextResponse.json({ error: 'robots_txt string is required' }, { status: 400 })
      }
      if (!url || typeof url !== 'string') {
        return NextResponse.json({ error: 'url string is required' }, { status: 400 })
      }

      const result = testUrlAgainstRobots(robots_txt, url, user_agent)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
