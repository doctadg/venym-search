/**
 * Venym Search Search Scraper
 * 
 * Scrapes DuckDuckGo, Bing, and Google directly from Vercel serverless IPs.
 * No external dependencies — pure fetch + regex parsing.
 * 
 * Each Vercel function invocation hits from a different cloud IP,
 * distributing requests across AWS/Cloudflare's global network.
 */

export interface ScrapedResult {
  title: string
  url: string
  snippet: string
  engine: 'duckduckgo' | 'bing' | 'google' | 'brave' | 'mojeek' | 'yandex' | 'dogpile' | 'ecosia'
  position: number
  date?: string | null
}

// ─── User-Agent Rotation ─────────────────────────────────────────────────────

const USER_AGENTS = [
  // Chrome on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  // Chrome on Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  // Firefox
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
  // Safari
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  // Edge
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
]

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'User-Agent': randomUA(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    ...extra,
  }
}

// ─── CAPTCHA Detection ───────────────────────────────────────────────────────

export function isCaptchaResponse(html: string, engine: string): boolean {
  const lower = html.toLowerCase()
  if (engine === 'google') {
    return (
      lower.includes('captcha') ||
      lower.includes('unusual traffic') ||
      lower.includes('before you continue') ||
      lower.includes('/sorry/index') ||
      lower.includes('our systems have detected')
    )
  }
  if (engine === 'bing') {
    return (
      lower.includes('captcha') ||
      lower.includes('robot check') ||
      lower.includes('blocked')
    )
  }
  return lower.includes('captcha')
}

// ─── DuckDuckGo Scraper ─────────────────────────────────────────────────────
// Most reliable — stable HTML endpoint, rarely blocks cloud IPs.

export async function scrapeDuckDuckGo(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  
  const response = await fetch(url, {
    headers: buildHeaders({ 'Referer': 'https://duckduckgo.com/' }),
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) return []

  const html = await response.text()
  if (isCaptchaResponse(html, 'duckduckgo')) return []
  if (html.length < 1000) return [] // empty/broken page

  const results: ScrapedResult[] = []

  // DDG HTML results are in <div class="result ..."> blocks
  // Title: <a class="result__a" href="...">Title</a>
  // Snippet: <a class="result__snippet" href="...">Snippet</a> or <div class="result__snippet">
  // URL: encoded in the redirect link's uddg parameter

  const resultRegex = /<div class="result[^"]*">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi
  let match: RegExpExecArray | null
  let pos = 0

  while ((match = resultRegex.exec(html)) !== null && results.length < numResults) {
    const block = match[0]
    pos++

    // Extract title
    const titleMatch = block.match(/<a[^>]+class="result__a"[^>]*>([\s\S]*?)<\/a>/)
    if (!titleMatch) continue
    const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
    if (!title || title.length < 2) continue

    // Extract URL — DDG uses redirect URLs, extract uddg param
    const urlMatch = block.match(/uddg=([^&"']+)/) || block.match(/href="([^"]+)"/)
    if (!urlMatch) continue
    const rawUrl = urlMatch[1]
    const finalUrl = decodeURIComponent(rawUrl).replace(/^\/\//, 'https://')
    if (!finalUrl.startsWith('http')) continue

    // Extract snippet
    const snippetMatch = block.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/) ||
                         block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\//)
    let snippet = snippetMatch ? decodeHTMLEntities(stripTags(snippetMatch[1]).trim()) : ''
    
    // Fallback: try to get snippet from any text content in the block
    if (!snippet || snippet.length < 20) {
      const textMatch = block.match(/<td[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/td>/)
      if (textMatch) snippet = decodeHTMLEntities(stripTags(textMatch[1]).trim())
    }

    results.push({
      title,
      url: finalUrl,
      snippet: snippet.substring(0, 500),
      engine: 'duckduckgo',
      position: pos,
    })
  }

  return results
}

// ─── Bing Scraper ────────────────────────────────────────────────────────────
// Reasonably stable HTML structure, good coverage.

export async function scrapeBing(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=${numResults}&setlang=en`
  
  const response = await fetch(url, {
    headers: buildHeaders({ 'Referer': 'https://www.bing.com/' }),
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) return []

  const html = await response.text()
  if (isCaptchaResponse(html, 'bing')) return []
  if (html.length < 1000) return []

  const results: ScrapedResult[] = []

  // Bing results are in <li class="b_algo"> blocks
  // Title: <h2><a href="URL">Title</a></h2>
  // Snippet: <div class="b_caption"><p>...</p></div> or <div class="b_caption"><div class="b_lineclamp...">...</div></div>

  const blocks = html.split(/<li class="b_algo"/i)
  
  for (let i = 1; i < blocks.length && results.length < numResults; i++) {
    const block = blocks[i]
    const pos = i

    // Extract URL — first <a href="..."> in h2
    const urlMatch = block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>/i)
    if (!urlMatch) continue
    let resultUrl = decodeHTMLEntities(urlMatch[1])
    if (resultUrl.startsWith('http') && resultUrl.includes('bing.com') && resultUrl.includes('search?q=')) continue
    if (!resultUrl.startsWith('http')) continue

    // Extract title
    const titleMatch = block.match(/<h2[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/i)
    if (!titleMatch) continue
    const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
    if (!title || title.length < 2) continue

    // Extract snippet — from <p> or <div> within b_caption
    let snippet = ''
    const captionMatch = block.match(/<div class="b_caption"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i) ||
                        block.match(/class="b_caption"[^>]*>([\s\S]*?)(?:<\/div>\s*){1,2}/i)
    if (captionMatch) {
      const snippetText = captionMatch[1]
      const pMatch = snippetText.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
      if (pMatch) snippet = decodeHTMLEntities(stripTags(pMatch[1]).trim())
    }
    
    // Fallback: look for any paragraph-like content
    if (!snippet || snippet.length < 20) {
      const pFallback = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
      if (pFallback) snippet = decodeHTMLEntities(stripTags(pFallback[1]).trim())
    }

    // Extract date if present
    const dateMatch = block.match(/class="news_dt"[^>]*>([^<]+)<\/span>/i) ||
                      block.match(/<span[^>]+class="[^"]*date[^"]*"[^>]*>([^<]+)<\/span>/i)
    const date = dateMatch ? dateMatch[1].trim() : null

    results.push({
      title,
      url: resultUrl,
      snippet: snippet.substring(0, 500),
      engine: 'bing',
      position: pos,
      date,
    })
  }

  return results
}

// ─── Google Scraper ──────────────────────────────────────────────────────────
// Best results but most fragile — Google actively changes HTML to prevent scraping.
// Will get CAPTCHA from some cloud IPs. Used as tertiary fallback.

export async function scrapeGoogle(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${numResults}&hl=en&gl=us`
  
  const response = await fetch(url, {
    headers: buildHeaders({
      'Referer': 'https://www.google.com/',
      'Cookie': 'CONSENT=YES+1', // Accept consent cookie
    }),
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) return []

  const html = await response.text()
  if (isCaptchaResponse(html, 'google')) return []
  if (html.length < 1000) return []

  const results: ScrapedResult[] = []

  // Google's HTML structure changes frequently. We try multiple patterns:
  // Modern (2024-2025): <div class="g Ww4FFb" ...> or <div class="g">
  // Inside: <div data-hveid="..."><div class="tF2Cxc">
  //   Title: <h3 class="LC20lb MBeuO DKV0Md">...</h3>
  //   URL: <a href="/url?q=ACTUAL_URL&..."> 
  //   Snippet: <div class="VwiC3b yXK7lf MUxGbd yDYNvb lyLwlc lEBKkf"><span>...</span></div>

  // Strategy: find all <a> tags with /url?q= or /search?q= redirects,
  // then look for associated h3 titles and snippet divs

  // Pattern 1: Modern Google — extract from the main result divs
  const divBlocks = html.split(/<div[^>]*class="[^"]*(?:tF2Cxc|g Ww4FFb)[^"]*"[^>]*>/i)
  
  for (let i = 0; i < divBlocks.length && results.length < numResults; i++) {
    const block = divBlocks[i]

    // Extract URL from href with /url?q= redirect
    const hrefMatch = block.match(/href="(\/url\?q=([^"&]+)[^"]*|https?:\/\/[^"&]+)"/i)
    if (!hrefMatch) continue
    const rawUrl = hrefMatch[2] || hrefMatch[1]
    const resultUrl = decodeURIComponent(decodeHTMLEntities(rawUrl))
    // Skip Google internal URLs
    if (resultUrl.includes('google.com/search') || 
        resultUrl.includes('google.com/url') ||
        resultUrl.includes('youtube.com/results') ||
        resultUrl.includes('support.google.com') ||
        resultUrl.includes('accounts.google.com')) continue
    if (!resultUrl.startsWith('http')) continue

    // Extract title from h3
    const h3Match = block.match(/<h3[^>]*class="[^"]*LC20lb[^"]*"[^>]*>([\s\S]*?)<\/h3>/i) ||
                    block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
    if (!h3Match) continue
    const title = decodeHTMLEntities(stripTags(h3Match[1]).trim())
    if (!title || title.length < 2) continue

    // Extract snippet
    let snippet = ''
    const snippetPatterns = [
      /<div[^>]*class="[^"]*(?:VwiC3b|st|IsZvec)[^"]*"[^>]*><span[^>]*>([\s\S]*?)<\/span><\/div>/i,
      /<div[^>]*class="[^"]*(?:VwiC3b|Gx5Zad)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*data-sncf[^>]*>([\s\S]*?)<\/div>/i,
    ]
    for (const pattern of snippetPatterns) {
      const sMatch = block.match(pattern)
      if (sMatch && sMatch[1].length > 30) {
        snippet = decodeHTMLEntities(stripTags(sMatch[1]).trim())
        break
      }
    }

    results.push({
      title,
      url: resultUrl,
      snippet: snippet.substring(0, 500),
      engine: 'google',
      position: results.length + 1,
    })
  }

  // Pattern 2: If no results found with modern parser, try legacy parsing
  if (results.length === 0) {
    const legacyBlocks = html.split(/<div class="g"[^>]*>/i)
    for (let i = 1; i < legacyBlocks.length && results.length < numResults; i++) {
      const block = legacyBlocks[i]
      
      const urlMatch = block.match(/href="(\/url\?q=([^"&]+)[^"]*)"/)
      if (!urlMatch) continue
      const resultUrl = decodeURIComponent(urlMatch[2])
      if (resultUrl.includes('google.com')) continue
      if (!resultUrl.startsWith('http')) continue

      const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)
      if (!titleMatch) continue
      const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
      if (!title || title.length < 2) continue

      const snippetMatch = block.match(/<span[^>]*class="[^"]*(?:st|aCOpRe)[^"]*"[^>]*>([\s\S]*?)<\/span>/)
      const snippet = snippetMatch ? decodeHTMLEntities(stripTags(snippetMatch[1]).trim()).substring(0, 500) : ''

      results.push({
        title,
        url: resultUrl,
        snippet,
        engine: 'google',
        position: results.length + 1,
      })
    }
  }

  return results
}

// ─── Brave Search API ──────────────────────────────────────────────────────
// Uses Brave's JSON API. Free tier: 2,000 queries/month.
// Set BRAVE_API_KEY in Vercel env vars.
// If no key, falls back to scraping brave.com/search.

export async function scrapeBrave(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  const apiKey = process.env.BRAVE_API_KEY
  
  // If we have an API key, use the proper API
  if (apiKey) {
    try {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${numResults}&freshness=-auto`
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
        signal: AbortSignal.timeout(8000),
      })

      if (!response.ok) return []

      const data = await response.json() as any
      const webResults = data.web?.results || []
      
      return webResults.slice(0, numResults).map((r: any, i: number) => ({
        title: r.title || '',
        url: r.url || '',
        snippet: (r.description || r.extra_snippets?.join(' ') || '').substring(0, 500),
        engine: 'brave' as const,
        position: i + 1,
        date: r.age || null,
      })).filter((r: ScrapedResult) => r.title && r.url)
    } catch {
      // API failed, fall through to HTML scraping
    }
  }

  // HTML scraping fallback — scrape brave.com/search
  try {
    const url = `https://search.brave.com/search?q=${encodeURIComponent(query)}&source=web`
    const response = await fetch(url, {
      headers: buildHeaders({ 'Referer': 'https://search.brave.com/' }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return []

    const html = await response.text()
    if (html.length < 1000) return []
    if (isCaptchaResponse(html, 'brave')) return []

    const results: ScrapedResult[] = []

    // Brave results: <div class="snippet"> blocks
    // Title: <div class="title"><a href="..."><span>...</span></a></div>
    // Snippet: <div class="description"> or <p class="description">
    // URL: in the <a href> inside snippet-title

    const snippetBlocks = html.split(/<div[^>]*class="[^"]*snippet[^"]*"[^>]*>/i)
    
    for (let i = 1; i < snippetBlocks.length && results.length < numResults; i++) {
      const block = snippetBlocks[i]

      // Extract URL
      const hrefMatch = block.match(/href="(https?:\/\/[^"]+)"/i)
      if (!hrefMatch) continue
      const resultUrl = hrefMatch[1]
      if (resultUrl.includes('search.brave.com')) continue

      // Extract title
      const titleMatch = block.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i) ||
                         block.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)
      if (!titleMatch) continue
      const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
      if (!title || title.length < 2) continue

      // Extract snippet
      let snippet = ''
      const descMatch = block.match(/<div[^>]*class="[^"]*(?:description|snippet-description)[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                        block.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
      if (descMatch) snippet = decodeHTMLEntities(stripTags(descMatch[1]).trim())

      results.push({
        title,
        url: resultUrl,
        snippet: snippet.substring(0, 500),
        engine: 'brave',
        position: results.length + 1,
      })
    }

    return results
  } catch {
    return []
  }
}

// ─── Mojeek Scraper ────────────────────────────────────────────────────────
// Independent UK-based search engine. Very scraper-friendly, no CAPTCHAs.
// Has an official API (free, 1,000/day) and a clean HTML interface.

export async function scrapeMojeek(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  const apiKey = process.env.MOJEAK_API_KEY // Optional

  // Try the API first if available
  if (apiKey) {
    try {
      const url = `https://api.mojeek.com/search?q=${encodeURIComponent(query)}&fmt=json&cnt=${numResults}&api_key=${apiKey}`
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (response.ok) {
        const data = await response.json() as any
        return (data.results || []).slice(0, numResults).map((r: any, i: number) => ({
          title: r.title || '',
          url: r.url || '',
          snippet: (r.desc || '').substring(0, 500),
          engine: 'mojeek' as const,
          position: i + 1,
          date: r.date || null,
        })).filter((r: ScrapedResult) => r.title && r.url)
      }
    } catch { /* fall through */ }
  }

  // HTML scraping
  try {
    const url = `https://www.mojeek.com/search?q=${encodeURIComponent(query)}&s=${numResults}&fmt=html`
    const response = await fetch(url, {
      headers: buildHeaders({ 'Referer': 'https://www.mojeek.com/' }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return []

    const html = await response.text()
    if (html.length < 1000) return []
    if (isCaptchaResponse(html, 'mojeek')) return []

    const results: ScrapedResult[] = []

    // Mojeek results: <div class="result"> blocks
    // Title: <h2><a class="ob" href="URL">Title</a></h2>
    // Snippet: <p class="s">Snippet</p>
    // URL: in href of the title link

    const resultBlocks = html.split(/<div[^>]*class="[^"]*result[^"]*"[^>]*>/i)

    for (let i = 1; i < resultBlocks.length && results.length < numResults; i++) {
      const block = resultBlocks[i]

      // Extract URL
      const urlMatch = block.match(/<a[^>]+class="ob"[^>]+href="(https?:\/\/[^"]+)"/i) ||
                        block.match(/<h2[^>]*>\s*<a[^>]+href="(https?:\/\/[^"]+)"/i)
      if (!urlMatch) continue
      const resultUrl = urlMatch[1]
      if (resultUrl.includes('mojeek.com/search')) continue

      // Extract title
      const titleMatch = block.match(/<h2[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)
      if (!titleMatch) continue
      const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
      if (!title || title.length < 2) continue

      // Extract snippet
      let snippet = ''
      const snippetMatch = block.match(/<p[^>]*class="[^"]*s[^"]*"[^>]*>([\s\S]*?)<\/p>/i) ||
                           block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
      if (snippetMatch) snippet = decodeHTMLEntities(stripTags(snippetMatch[1]).trim())

      results.push({
        title,
        url: resultUrl,
        snippet: snippet.substring(0, 500),
        engine: 'mojeek',
        position: results.length + 1,
      })
    }

    return results
  } catch {
    return []
  }
}

// ─── Yandex Scraper ────────────────────────────────────────────────────────
// Russian search engine. Very tolerant of scraping from cloud IPs.
// Good for non-Russian queries too (web-wide index).

export async function scrapeYandex(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  try {
    const url = `https://yandex.com/search/?text=${encodeURIComponent(query)}&numdoc=${numResults}&lr=21419` // lr=21419 = all regions
    const response = await fetch(url, {
      headers: buildHeaders({
        'Referer': 'https://yandex.com/',
        'Accept-Language': 'en-US,en;q=0.9',
      }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return []

    const html = await response.text()
    if (html.length < 1000) return []
    if (isCaptchaResponse(html, 'yandex')) return []

    const results: ScrapedResult[] = []

    // Yandex results: <div class="serp-item"> or <li class="serp-item">
    // Title: <a class="link link_theme_outer" href="URL" data-*><b>Title</b></a>
    // Snippet: <div class="text-container"><span>...</span></div>

    const itemBlocks = html.split(/<[^>]+class="[^"]*serp-item[^"]*"[^>]*>/i)

    for (let i = 1; i < itemBlocks.length && results.length < numResults; i++) {
      const block = itemBlocks[i]

      // Extract URL from the main link
      const urlMatch = block.match(/href="(https?:\/\/[^"]+)"/i)
      if (!urlMatch) continue
      const resultUrl = urlMatch[1]
      if (resultUrl.includes('yandex.com/search') || resultUrl.includes('yandex.ru/search')) continue
      if (!resultUrl.startsWith('http')) continue

      // Extract title — Yandex uses <b> or <span> inside the link
      const titleMatch = block.match(/<a[^>]+class="[^"]*link[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)
      if (!titleMatch) continue
      const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
      if (!title || title.length < 2) continue

      // Extract snippet
      let snippet = ''
      const snippetMatch = block.match(/class="text-container[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                           block.match(/<div[^>]*class="[^"]*(?:ExtendedText|text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      if (snippetMatch) snippet = decodeHTMLEntities(stripTags(snippetMatch[1]).trim())

      results.push({
        title,
        url: resultUrl,
        snippet: snippet.substring(0, 500),
        engine: 'yandex',
        position: results.length + 1,
      })
    }

    return results
  } catch {
    return []
  }
}

// ─── Dogpile Scraper ───────────────────────────────────────────────────────
// Meta-search engine that aggregates Google, Yahoo, Bing, Yandex results.
// Often works from cloud IPs since it's less protected.

export async function scrapeDogpile(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  try {
    const url = `https://www.dogpile.com/serp?q=${encodeURIComponent(query)}&qo=serp`
    const response = await fetch(url, {
      headers: buildHeaders({ 'Referer': 'https://www.dogpile.com/' }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return []

    const html = await response.text()
    if (html.length < 1000) return []
    if (isCaptchaResponse(html, 'dogpile')) return []

    const results: ScrapedResult[] = []

    // Dogpile results: <div class="webResult"> blocks
    // Title: <a class="result-link" href="URL">Title</a>
    // Snippet: <span class="result-description">...</span>

    const webResults = html.split(/<div[^>]*class="[^"]*webResult[^"]*"[^>]*>/i)

    for (let i = 1; i < webResults.length && results.length < numResults; i++) {
      const block = webResults[i]

      // Extract URL
      const urlMatch = block.match(/href="(https?:\/\/[^"]+dogpile[^"]*\/serp\/[^"]+redirect[^"]*url=([^&"]+)[^"]*)"/i) ||
                        block.match(/class="result-link"[^>]+href="https?:\/\/[^"]*\/serp\/[^"]*url=([^&"]+)/i)
      let resultUrl = ''
      if (urlMatch) {
        resultUrl = decodeURIComponent(urlMatch[2] || urlMatch[1])
      } else {
        const directUrl = block.match(/class="result-link"[^>]+href="(https?:\/\/[^"]+)"/i)
        if (directUrl) resultUrl = directUrl[1]
      }
      if (!resultUrl || !resultUrl.startsWith('http')) continue
      if (resultUrl.includes('dogpile.com/serp')) {
        // Try to extract the actual URL from redirect
        const redirectUrl = resultUrl.match(/url=([^&]+)/)
        if (redirectUrl) resultUrl = decodeURIComponent(redirectUrl[1])
        else continue
      }

      // Extract title
      const titleMatch = block.match(/class="result-link"[^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/<a[^>]+class="[^"]*result-title[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      if (!titleMatch) continue
      const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
      if (!title || title.length < 2) continue

      // Extract snippet
      let snippet = ''
      const snippetMatch = block.match(/class="result-description"[^>]*>([\s\S]*?)<\/span>/i) ||
                           block.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
      if (snippetMatch) snippet = decodeHTMLEntities(stripTags(snippetMatch[1]).trim())

      results.push({
        title,
        url: resultUrl,
        snippet: snippet.substring(0, 500),
        engine: 'dogpile',
        position: results.length + 1,
      })
    }

    return results
  } catch {
    return []
  }
}

// ─── Ecosia Scraper ────────────────────────────────────────────────────────
// Bing-powered search engine. Sometimes works when Bing direct doesn't.

export async function scrapeEcosia(
  query: string,
  numResults: number = 10
): Promise<ScrapedResult[]> {
  try {
    const url = `https://www.ecosia.org/search?q=${encodeURIComponent(query)}&p=1`
    const response = await fetch(url, {
      headers: buildHeaders({ 'Referer': 'https://www.ecosia.org/' }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return []

    const html = await response.text()
    if (html.length < 1000) return []
    if (isCaptchaResponse(html, 'ecosia')) return []

    const results: ScrapedResult[] = []

    // Ecosia uses a React-like structure with data attributes
    // Results: <div class="result-first"> or <div class="result"> or <article class="result">
    // Title: <a class="result-link" href="URL"><span>Title</span></a>  
    // Snippet: <p class="result-description">...</p>
    // URL: often in data-url attribute

    const resultBlocks = html.split(/<[^>]+class="[^"]*result[^"]*"[^>]*>/i)

    for (let i = 1; i < resultBlocks.length && results.length < numResults; i++) {
      const block = resultBlocks[i]

      // Extract URL — try data-url attribute first, then href
      const dataUrlMatch = block.match(/data-url="(https?:\/\/[^"]+)"/i)
      const hrefMatch = block.match(/href="(https?:\/\/[^"]+)"/i)
      const resultUrl = dataUrlMatch ? dataUrlMatch[1] : (hrefMatch ? hrefMatch[1] : '')
      if (!resultUrl || !resultUrl.startsWith('http')) continue
      if (resultUrl.includes('ecosia.org/search') || resultUrl.includes('ecosia.org/')) continue

      // Extract title
      const titleMatch = block.match(/<a[^>]+class="[^"]*result-title[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/<a[^>]+class="[^"]*result-link[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/<h\d[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)
      if (!titleMatch) continue
      const title = decodeHTMLEntities(stripTags(titleMatch[1]).trim())
      if (!title || title.length < 2) continue

      // Extract snippet
      let snippet = ''
      const snippetMatch = block.match(/class="result-description[^"]*"[^>]*>([\s\S]*?)<\/p>/i) ||
                           block.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
      if (snippetMatch) snippet = decodeHTMLEntities(stripTags(snippetMatch[1]).trim())

      results.push({
        title,
        url: resultUrl,
        snippet: snippet.substring(0, 500),
        engine: 'ecosia',
        position: results.length + 1,
      })
    }

    return results
  } catch {
    return []
  }
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/** Strip all HTML tags from a string */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim()
}

/** Decode common HTML entities */
function decodeHTMLEntities(text: string): string {
  return stripTags(text) // stripTags handles entities inline
}
