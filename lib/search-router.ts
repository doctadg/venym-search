/**
 * Venym Search Search Router
 * 
 * Smart multi-engine router with parallel fetching, deduplication,
 * and in-memory caching. Replaces SearXNG dependency entirely.
 * 
 * Strategy: Fetch from 8 engines in parallel, merge & rank.
 * Engine priority: Brave (API) > Google > Bing > Yandex > Mojeek > DDG > Dogpile > Ecosia
 * 
 * Cost: $0 for HTML scraping. Brave API free tier = 2,000 queries/month.
 */

import { 
  scrapeDuckDuckGo, 
  scrapeBing, 
  scrapeGoogle,
  scrapeBrave,
  scrapeMojeek,
  scrapeYandex,
  scrapeDogpile,
  scrapeEcosia,
  type ScrapedResult 
} from './search-scraper'

export interface SearchResult {
  title: string
  link: string
  snippet: string
  position: number
  date?: string | null
  engine?: string
  score?: number
}

// ─── Simple TTL Cache ────────────────────────────────────────────────────────
// Per-instance cache. Survives warm invocations, cleared on cold start.
// Good enough — 40-60% of search queries are repeats or near-repeats.

interface CacheEntry {
  results: SearchResult[]
  timestamp: number
  query: string
}

class SearchCache {
  private cache = new Map<string, CacheEntry>()
  private maxAge: number // ms
  private maxSize: number

  constructor(maxAgeMs = 5 * 60 * 1000, maxSize = 1000) {
    this.maxAge = maxAgeMs
    this.maxSize = maxSize
  }

  private normalizeKey(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, ' ')
  }

  get(query: string): SearchResult[] | null {
    const key = this.normalizeKey(query)
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }
    
    return entry.results
  }

  set(query: string, results: SearchResult[]): void {
    const key = this.normalizeKey(query)
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      let oldestKey: string | null = null
      let oldestTime = Infinity
      this.cache.forEach((v, k) => {
        if (v.timestamp < oldestTime) {
          oldestTime = v.timestamp
          oldestKey = k
        }
      })
      if (oldestKey) this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      results,
      timestamp: Date.now(),
      query: key,
    })
  }

  get size(): number {
    return this.cache.size
  }

  clear(): void {
    this.cache.clear()
  }
}

// Global singleton
const searchCache = new SearchCache(
  5 * 60 * 1000, // 5 minutes TTL
  1000           // max 1000 cached queries
)

// ─── Result Deduplication ────────────────────────────────────────────────────
// Same content often appears across engines. Dedup by URL domain+path.

function extractDomainKey(url: string): string {
  try {
    const u = new URL(url)
    // Use domain + path stem for dedup (ignore query params)
    const path = u.pathname.replace(/\/+$/, '').toLowerCase()
    return `${u.hostname}${path}` || u.hostname
  } catch {
    return url.toLowerCase()
  }
}

function deduplicateResults(results: ScrapedResult[]): ScrapedResult[] {
  const seen = new Map<string, ScrapedResult>()
  
  for (const result of results) {
    const key = extractDomainKey(result.url)
    const existing = seen.get(key)
    
    if (!existing) {
      seen.set(key, result)
    } else {
      // Keep the one with better snippet or from preferred engine
      if (result.snippet.length > existing.snippet.length) {
        seen.set(key, result)
      }
    }
  }
  
  return Array.from(seen.values())
}

// ─── Result Scoring & Ranking ────────────────────────────────────────────────

function scoreResult(result: ScrapedResult, query: string): ScrapedResult & { score: number } {
  const queryLower = query.toLowerCase()
  const queryTerms = queryLower.split(/\s+/).filter(w => w.length > 2)
  const titleLower = result.title.toLowerCase()
  const snippetLower = result.snippet.toLowerCase()
  
  let score = 100 // base score
  
  // Title relevance (highest weight)
  const titleTermMatches = queryTerms.filter(t => titleLower.includes(t)).length
  score += titleTermMatches * 30
  
  // Exact phrase match in title
  if (titleLower.includes(queryLower)) score += 50
  
  // Snippet relevance
  const snippetTermMatches = queryTerms.filter(t => snippetLower.includes(t)).length
  score += snippetTermMatches * 15
  
  // Snippet length (longer = more informative, but diminishing returns)
  score += Math.min(result.snippet.length / 10, 30)
  
  // Engine preference: Brave (API) > Google > Bing > Yandex > Mojeek > DDG > Dogpile > Ecosia
  if (result.engine === 'brave') score += 25
  else if (result.engine === 'google') score += 20
  else if (result.engine === 'bing') score += 15
  else if (result.engine === 'yandex') score += 12
  else if (result.engine === 'mojeek') score += 10
  else if (result.engine === 'duckduckgo') score += 8
  else if (result.engine === 'dogpile') score += 5
  else if (result.engine === 'ecosia') score += 3
  
  // Position bonus (earlier = likely more relevant)
  score += Math.max(0, 20 - result.position * 2)
  
  // Penalize results with no snippet
  if (!result.snippet || result.snippet.length < 30) score -= 40
  
  // Penalize common spam domains
  const spamPatterns = ['porn', 'xxx', 'casino', 'gambling', 'torrent', 'warez']
  const urlLower = result.url.toLowerCase()
  if (spamPatterns.some(p => urlLower.includes(p))) score -= 200
  
  // Penalize non-HTTPS
  if (!result.url.startsWith('https://')) score -= 15

  return { ...result, score }
}

// ─── Main Search Router ──────────────────────────────────────────────────────

export interface RouterStats {
  engines_used: string[]
  engines_failed: string[]
  total_raw: number
  after_dedup: number
  from_cache: boolean
  latency_ms: number
}

/**
 * Search using multiple engines in parallel, merge, deduplicate, and rank.
 * 
 * @param query - Search query string
 * @param numResults - Maximum results to return (default: 10)
 * @returns Object with results and metadata
 */
export async function searchRouter(
  query: string,
  numResults: number = 10
): Promise<{ results: SearchResult[]; stats: RouterStats }> {
  const startTime = Date.now()
  
  // Check cache first
  const cached = searchCache.get(query)
  if (cached) {
    return {
      results: cached.slice(0, numResults),
      stats: {
        engines_used: ['cache'],
        engines_failed: [],
        total_raw: cached.length,
        after_dedup: cached.length,
        from_cache: true,
        latency_ms: Date.now() - startTime,
      },
    }
  }

  // Fetch from all engines in parallel — 8 engines for maximum coverage
  const fetchPer = Math.ceil(numResults * 1.2) // each engine fetches slightly more
  const enginePromises = [
    { name: 'brave', fn: () => scrapeBrave(query, fetchPer) },
    { name: 'bing', fn: () => scrapeBing(query, fetchPer) },
    { name: 'google', fn: () => scrapeGoogle(query, fetchPer) },
    { name: 'duckduckgo', fn: () => scrapeDuckDuckGo(query, fetchPer) },
    { name: 'yandex', fn: () => scrapeYandex(query, fetchPer) },
    { name: 'mojeek', fn: () => scrapeMojeek(query, fetchPer) },
    { name: 'dogpile', fn: () => scrapeDogpile(query, fetchPer) },
    { name: 'ecosia', fn: () => scrapeEcosia(query, fetchPer) },
  ]

  const settled = await Promise.allSettled(
    enginePromises.map(async (engine) => {
      try {
        const results = await engine.fn()
        return { ...engine, results, success: results.length > 0 }
      } catch (error) {
        return { ...engine, results: [], success: false, error: String(error) }
      }
    })
  )

  // Collect all results
  const enginesUsed: string[] = []
  const enginesFailed: string[] = []
  let allResults: ScrapedResult[] = []

  for (const result of settled) {
    if (result.status === 'fulfilled') {
      if (result.value.success) {
        enginesUsed.push(result.value.name)
        allResults.push(...result.value.results)
      } else {
        enginesFailed.push(result.value.name)
      }
    } else {
      enginesFailed.push('unknown')
    }
  }

  // Deduplicate
  const deduped = deduplicateResults(allResults)

  // Score and rank
  const scored = deduped.map(r => scoreResult(r, query))
  scored.sort((a, b) => b.score - a.score)

  // Convert to SearchResult format
  const finalResults: SearchResult[] = scored.slice(0, numResults).map((r, i) => ({
    title: r.title,
    link: r.url,
    snippet: r.snippet,
    position: i + 1,
    date: r.date,
    engine: r.engine,
    score: r.score,
  }))

  // Cache the results
  if (finalResults.length > 0) {
    searchCache.set(query, finalResults)
  }

  return {
    results: finalResults,
    stats: {
      engines_used: enginesUsed,
      engines_failed: enginesFailed,
      total_raw: allResults.length,
      after_dedup: deduped.length,
      from_cache: false,
      latency_ms: Date.now() - startTime,
    },
  }
}

/**
 * Quick health check — tries all engines, returns status of each.
 */
export async function searchHealthCheck(): Promise<{
  ok: boolean
  engines: Record<string, { working: boolean; results: number; error?: string }>
}> {
  const testQuery = 'test query'
  
  const engines = await Promise.allSettled([
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeBrave(testQuery, 3)
        return { name: 'brave', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'brave', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeBing(testQuery, 3)
        return { name: 'bing', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'bing', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeGoogle(testQuery, 3)
        return { name: 'google', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'google', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeDuckDuckGo(testQuery, 3)
        return { name: 'duckduckgo', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'duckduckgo', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeYandex(testQuery, 3)
        return { name: 'yandex', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'yandex', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeMojeek(testQuery, 3)
        return { name: 'mojeek', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'mojeek', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeDogpile(testQuery, 3)
        return { name: 'dogpile', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'dogpile', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
    (async () => {
      const start = Date.now()
      try {
        const results = await scrapeEcosia(testQuery, 3)
        return { name: 'ecosia', working: results.length > 0, results: results.length, ms: Date.now() - start }
      } catch (e) {
        return { name: 'ecosia', working: false, results: 0, error: String(e), ms: Date.now() - start }
      }
    })(),
  ])

  const engineStatus: Record<string, { working: boolean; results: number; error?: string }> = {}
  let anyWorking = false

  for (const result of engines) {
    if (result.status === 'fulfilled') {
      engineStatus[result.value.name] = {
        working: result.value.working,
        results: result.value.results,
        error: result.value.error,
      }
      if (result.value.working) anyWorking = true
    }
  }

  return { ok: anyWorking, engines: engineStatus }
}

// Export cache for admin endpoints
export { searchCache }
