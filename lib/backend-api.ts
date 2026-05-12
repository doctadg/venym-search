import { searchRouter } from './search-router'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'
const USE_SEARCH_ROUTER = process.env.USE_SEARCH_ROUTER !== 'false' // enabled by default

// Types based on your backend API
export interface SearchRequest {
  query: string
  num_results?: number
  search_type?: string
}

export interface SearchResult {
  title: string
  link: string
  snippet: string
  position: number
  date?: string | null
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  total_results: number
  search_metadata: any
}

export interface ScrapeRequest {
  url: string
  extract?: ('title' | 'text' | 'links' | 'images' | 'metadata' | 'all')[]
  wait_for?: string
  timeout?: number
  use_browser?: boolean
}

export interface ScrapeResponse {
  url: string
  title?: string | null
  text?: string | null
  links?: Array<{ [key: string]: string }> | null
  images?: string[] | null
  metadata?: any | null
  error?: string | null
  word_count?: number | null
  reading_time?: number | null
}

export interface ResearchRequest {
  query: string
  max_pages?: number
  extract_content?: boolean
  include_domains?: string[]
  exclude_domains?: string[]
}

export interface ResearchResult {
  search_results: SearchResult[]
  scraped_content: ScrapeResponse[]
  summary?: string | null
}

// Clean scraped content for LLM consumption
export function cleanScrapedContent(text: string | null | undefined): string {
  if (!text) return ''

  let cleaned = text

  // Remove excessive whitespace (multiple spaces, tabs, etc.)
  cleaned = cleaned.replace(/[ \t]+/g, ' ')

  // Remove more than 2 consecutive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  // Strip common boilerplate patterns
  const boilerplatePatterns = [
    // Privacy notices
    /privacy policy\s*[:\-]?\s*(?:this\s+)?(?:site|we|our|the\s+company)\s+(?:uses|collects|may|will)\s+(?:cookies|data|information)\s*(?:\.|,|;|$)/gi,
    /cookie\s+policy\s*[:\-]?\s*(?:we\s+)?(?:use|collect)\s+(?:cookies|data)\s*(?:\.|,|;|$)/gi,
    /all\s+rights\s+reserved\s*(?:\.|$)/gi,
    /copyright\s+(?:©|\\u00a9)?\s*\d{4}/gi,
    // Navigation/footer elements
    /^(?:home|about|contact|news|blog|services|products|login|sign\s+up|register|subscribe|donate)$/gim,
    /(?:click\s+(?:here|for\s+more)|read\s+more|learn\s+more|view\s+more|continue\s+reading)\s*>>?/gi,
    // Script and style tag remnants
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<style[^>]*>[\s\S]*?<\/style>/gi,
    // HTML entities
    /&nbsp;/gi, /&amp;/gi, /&lt;/gi, /&gt;/gi, /&quot;/gi, /&#39;/gi,
    // Social media share buttons text
    /(?:share\s+(?:on|via))?\s*(?:twitter|facebook|linkedin|pinterest|reddit|whatsapp|email)\s*\*/gi,
    // Cookie consent
    /(accept|reject)\s*(?:cookies|all)/gi,
    // Generic footer text
    /site\s+map\s*$/gim,
    /terms\s+of\s+(?:use|service)\s*$/gim,
    // Phone number patterns that look like boilerplate
    /^\s*call\s+(?:us|now)?\s*:\s*\+?[\d\s\-\(\)]+\s*$/gim,
    // Email patterns in footer
    /^\s*(?:contact|email)\s*(?:us)?\s*:\s*[\w\.\-]+@[\w\.\-]+\.\w+\s*$/gim,
  ]

  boilerplatePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '')
  })

  // Clean up lines that are just punctuation or very short meaningless words
  cleaned = cleaned.split('\n')
    .map(line => line.trim())
    .filter(line => {
      if (line.length === 0) return true // Keep empty lines for paragraph spacing
      if (/^[\/\-|_=\*\s]+$/.test(line)) return false // Horizontal rules made of chars
      if (/^[<>\[\](){}]+$/.test(line)) return false // Just brackets
      if (/^\s*[×✓●■▲▼]\s*$/.test(line)) return false // Bullet points without text
      return line.length > 2 || /^[a-zA-Z]$/.test(line)
    })
    .join('\n')

  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n')

  // Trim leading/trailing whitespace
  cleaned = cleaned.trim()

  return cleaned
}

// Calculate word count for text
export function calculateWordCount(text: string | null | undefined): number {
  if (!text) return 0
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  return words.length
}

// Calculate estimated reading time (average 200 words per minute)
export function calculateReadingTime(text: string | null | undefined): number {
  const wordCount = calculateWordCount(text)
  return Math.ceil(wordCount / 200)
}

// Backend API client
export class BackendAPI {
  private baseUrl: string

  constructor(baseUrl = BACKEND_URL) {
    this.baseUrl = baseUrl
  }

  async search(params: SearchRequest): Promise<SearchResponse> {
    // Try the built-in search router first (Vercel IPs — free, diverse)
    if (USE_SEARCH_ROUTER) {
      try {
        const { results, stats } = await searchRouter(params.query, params.num_results || 10)
        if (results.length > 0) {
          console.log(`[SearchRouter] ${results.length} results from ${stats.engines_used.join(', ')} in ${stats.latency_ms}ms`)
          return {
            query: params.query,
            results: results.map(r => ({
              title: r.title,
              link: r.link,
              snippet: r.snippet,
              position: r.position,
              date: r.date,
            })),
            total_results: results.length,
            search_metadata: {
              source: 'search-router',
              engines: stats.engines_used,
              from_cache: stats.from_cache,
              latency_ms: stats.latency_ms,
            },
          }
        }
        console.warn('[SearchRouter] 0 results, falling back to backend')
      } catch (error) {
        console.error('[SearchRouter] Failed, falling back to backend:', error)
      }
    }

    // Fallback: Python backend (SearXNG)
    const response = await fetch(`${this.baseUrl}/api/v1/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  async scrape(params: ScrapeRequest): Promise<ScrapeResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Scrape failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  async research(params: ResearchRequest): Promise<ResearchResult> {
    const response = await fetch(`${this.baseUrl}/api/v1/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Research failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }
}

// Enhanced API functions for our wrapper
export const backendAPI = new BackendAPI()

// Enhanced search with auto-scraping
export async function enhancedSearch(params: {
  query: string
  auto_scrape_top?: number
  max_results?: number
  include_contacts?: boolean
  include_social?: boolean
}): Promise<{
  search_results: SearchResult[]
  scraped_content: ScrapeResponse[]
  contacts?: any[]
  social_profiles?: any[]
  total_credits_used: number
}> {
  const startTime = Date.now()

  // Step 1: Perform search
  const searchResults = await backendAPI.search({
    query: params.query,
    num_results: params.max_results || 10
  })

  let scraped_content: ScrapeResponse[] = []
  let contacts: any[] = []
  let social_profiles: any[] = []
  let credits_used = 1 // Base search cost

  // Step 2: Auto-scrape top results if requested
  if (params.auto_scrape_top && params.auto_scrape_top > 0) {
    const urlsToScrape = searchResults.results
      .slice(0, params.auto_scrape_top)
      .map(result => result.link)

    for (const url of urlsToScrape) {
      try {
        const scrapeResult = await backendAPI.scrape({
          url,
          extract: ['title', 'text', 'links', 'metadata']
        })

        // Clean the scraped content
        const cleanedText = cleanScrapedContent(scrapeResult.text)

        // Add cleaned result with metadata
        const enhancedResult: ScrapeResponse = {
          ...scrapeResult,
          text: cleanedText,
          word_count: calculateWordCount(cleanedText),
          reading_time: calculateReadingTime(cleanedText)
        }

        scraped_content.push(enhancedResult)
        credits_used += 3

        // Extract contacts if requested (use cleaned text)
        if (params.include_contacts && cleanedText) {
          const extractedContacts = extractContacts(cleanedText)
          if (extractedContacts.length > 0) {
            contacts.push(...extractedContacts.map(contact => ({
              ...contact,
              source_url: url,
              source_title: scrapeResult.title
            })))
          }
        }

        // Extract social profiles if requested
        if (params.include_social && scrapeResult.links) {
          const socialLinks = extractSocialProfiles(scrapeResult.links)
          if (socialLinks.length > 0) {
            social_profiles.push(...socialLinks.map(profile => ({
              ...profile,
              source_url: url,
              source_title: scrapeResult.title
            })))
          }
        }
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error)
        // Add empty result to maintain consistency
        scraped_content.push({
          url,
          text: null,
          word_count: 0,
          reading_time: 0,
          error: `Failed to scrape: ${error}`
        })
      }
    }
  }

  return {
    search_results: searchResults.results,
    scraped_content,
    ...(params.include_contacts && { contacts }),
    ...(params.include_social && { social_profiles }),
    total_credits_used: credits_used
  }
}

// Enhanced scraping with link following
export async function enhancedScrape(params: {
  url: string
  follow_internal_links?: boolean
  max_depth?: number
  max_pages?: number
  include_contacts?: boolean
  extract_options?: string[]
}): Promise<{
  primary_content: ScrapeResponse
  discovered_links?: ScrapeResponse[]
  contacts?: any[]
  total_credits_used: number
}> {
  let credits_used = 3 // Base scrape cost

  // Step 1: Scrape primary URL
  const primaryContent = await backendAPI.scrape({
    url: params.url,
    extract: params.extract_options as any || ['title', 'text', 'links', 'metadata']
  })

  // Clean and enhance primary content
  const cleanedPrimaryText = cleanScrapedContent(primaryContent.text)
  const enhancedPrimary: ScrapeResponse = {
    ...primaryContent,
    text: cleanedPrimaryText,
    word_count: calculateWordCount(cleanedPrimaryText),
    reading_time: calculateReadingTime(cleanedPrimaryText)
  }

  let discovered_links: ScrapeResponse[] = []
  let contacts: any[] = []

  // Step 2: Follow internal links if requested
  if (params.follow_internal_links && primaryContent.links && !primaryContent.error) {
    const internalLinks = filterInternalLinks(params.url, primaryContent.links)
    const linksToScrape = internalLinks.slice(0, params.max_pages || 10)

    for (const linkObj of linksToScrape) {
      try {
        const linkContent = await backendAPI.scrape({
          url: linkObj.href || linkObj.url || linkObj.link,
          extract: ['title', 'text', 'metadata']
        })

        // Clean and enhance discovered link content
        const cleanedLinkText = cleanScrapedContent(linkContent.text)
        const enhancedLink: ScrapeResponse = {
          ...linkContent,
          text: cleanedLinkText,
          word_count: calculateWordCount(cleanedLinkText),
          reading_time: calculateReadingTime(cleanedLinkText)
        }

        discovered_links.push(enhancedLink)
        credits_used += 2
      } catch (error) {
        console.error(`Failed to scrape internal link:`, error)
      }
    }
  }

  // Extract contacts if requested (use cleaned text)
  if (params.include_contacts) {
    const allContent = [enhancedPrimary, ...discovered_links]
    for (const content of allContent) {
      if (content.text) {
        const extractedContacts = extractContacts(content.text)
        contacts.push(...extractedContacts.map(contact => ({
          ...contact,
          source_url: content.url,
          source_title: content.title
        })))
      }
    }
  }

  return {
    primary_content: enhancedPrimary,
    ...(params.follow_internal_links && { discovered_links }),
    ...(params.include_contacts && { contacts }),
    total_credits_used: credits_used
  }
}

// Enhanced research
export async function enhancedResearch(params: {
  topic: string
  max_sources?: number
  generate_summary?: boolean
  include_social_mentions?: boolean
}): Promise<{
  research_data: ResearchResult
  ai_summary?: string
  social_mentions?: any[]
  total_credits_used: number
}> {
  let credits_used = 10 // Base research cost
  
  // Perform research using your backend
  const researchData = await backendAPI.research({
    query: params.topic,
    max_pages: params.max_sources || 5,
    extract_content: true
  })

  credits_used += (params.max_sources || 5) * 2

  let ai_summary: string | undefined
  let social_mentions: any[] | undefined

  // Generate AI summary if requested
  if (params.generate_summary) {
    ai_summary = await generateAISummary(researchData)
    credits_used += 15
  }

  // Search for social mentions if requested
  if (params.include_social_mentions) {
    social_mentions = await searchSocialMentions(params.topic)
    credits_used += 10
  }

  return {
    research_data: researchData,
    ...(params.generate_summary && { ai_summary }),
    ...(params.include_social_mentions && { social_mentions }),
    total_credits_used: credits_used
  }
}

// Utility functions for data extraction
export function extractContacts(text: string): Array<{type: string, value: string}> {
  const contacts: Array<{type: string, value: string}> = []
  
  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = text.match(emailRegex) || []
  emails.forEach(email => contacts.push({ type: 'email', value: email }))
  
  // Phone regex (basic US/international)
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g
  const phones = text.match(phoneRegex) || []
  phones.forEach(phone => contacts.push({ type: 'phone', value: phone.trim() }))
  
  return contacts
}

export function extractSocialProfiles(links: Array<{[key: string]: string}>): Array<{platform: string, url: string, username?: string}> {
  const socialProfiles: Array<{platform: string, url: string, username?: string}> = []
  
  const socialPlatforms = {
    'linkedin.com': 'LinkedIn',
    'twitter.com': 'Twitter',
    'x.com': 'Twitter',
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'youtube.com': 'YouTube',
    'github.com': 'GitHub'
  }
  
  for (const link of links) {
    const url = link.href || link.url || link.link || ''
    for (const [domain, platform] of Object.entries(socialPlatforms)) {
      if (url.includes(domain)) {
        const username = extractUsernameFromUrl(url, domain)
        socialProfiles.push({
          platform,
          url,
          ...(username && { username })
        })
        break
      }
    }
  }
  
  return socialProfiles
}

function extractUsernameFromUrl(url: string, domain: string): string | undefined {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    return pathParts[0] || undefined
  } catch {
    return undefined
  }
}

function filterInternalLinks(baseUrl: string, links: Array<{[key: string]: string}>): Array<{[key: string]: string}> {
  try {
    const baseDomain = new URL(baseUrl).hostname
    return links.filter(link => {
      const linkUrl = link.href || link.url || link.link || ''
      try {
        const linkDomain = new URL(linkUrl).hostname
        return linkDomain === baseDomain
      } catch {
        return false
      }
    })
  } catch {
    return []
  }
}

async function generateAISummary(researchData: ResearchResult): Promise<string> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  
  // Collect content from scraped pages (limit to avoid token limits)
  const contentPieces = researchData.scraped_content
    .filter(c => c.text && c.text.length > 100)
    .slice(0, 5)
    .map(c => `### ${c.title || 'Untitled'}\n${c.text?.substring(0, 1500) || ''}`)
    .join('\n\n---\n\n')

  const searchTitles = researchData.search_results
    .slice(0, 10)
    .map(r => r.title)
    .join(', ')

  const prompt = `You are a research analyst. Based on the following research data, provide a comprehensive summary (3-4 paragraphs) covering:
1. Key findings and insights
2. Important trends or patterns
3. Notable quotes or data points
4. Conclusions and recommendations

## Search Results Found:
${searchTitles}

## Scraped Content:
${contentPieces}

Provide a well-structured summary in markdown format.`

  // If no OpenRouter key, return basic summary
  if (!OPENROUTER_API_KEY) {
    const totalSources = researchData.scraped_content.length
    const totalCharacters = researchData.scraped_content
      .map(content => content.text?.length || 0)
      .reduce((sum, length) => sum + length, 0)
    return `Research Summary: Analyzed ${totalSources} sources with ${totalCharacters} characters of content. Key findings include insights from ${searchTitles}.`
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://search.venym.io',
        'X-Title': 'Venym Search DeepDive'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status)
      // Fallback to basic summary
      return `Research analyzed ${researchData.scraped_content.length} sources. Key sources: ${searchTitles}.`
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Summary generation failed.'
  } catch (error) {
    console.error('AI summary generation failed:', error)
    return `Research analyzed ${researchData.scraped_content.length} sources. Key sources: ${searchTitles}.`
  }
}

async function searchSocialMentions(topic: string): Promise<any[]> {
  // Use Venym Search backend to search for social mentions
  const socialPlatforms = ['twitter.com', 'x.com', 'linkedin.com', 'reddit.com']
  const mentions: any[] = []

  for (const platform of socialPlatforms.slice(0, 2)) { // Limit to 2 platforms
    try {
      const searchResults = await backendAPI.search({
        query: `${topic} site:${platform}`,
        num_results: 5
      })

      if (searchResults.results.length > 0) {
        const platformName = platform.includes('twitter') || platform.includes('x.com') ? 'Twitter/X' :
                            platform.includes('linkedin') ? 'LinkedIn' :
                            platform.includes('reddit') ? 'Reddit' : platform

        mentions.push({
          platform: platformName,
          mentions: searchResults.results.length,
          sentiment: analyzeMentionSentiment(searchResults.results),
          recent_posts: searchResults.results.slice(0, 3).map(r => ({
            title: r.title,
            url: r.link,
            snippet: r.snippet?.substring(0, 200)
          }))
        })
      }
    } catch (error) {
      console.error(`Failed to search ${platform}:`, error)
    }
  }

  // If no mentions found, return empty array (not placeholder)
  return mentions
}

function analyzeMentionSentiment(results: SearchResult[]): string {
  const positiveWords = ['great', 'amazing', 'excellent', 'love', 'best', 'awesome', 'fantastic', 'innovative']
  const negativeWords = ['bad', 'terrible', 'worst', 'hate', 'awful', 'poor', 'scam', 'broken']
  
  let positiveCount = 0
  let negativeCount = 0
  
  results.forEach(r => {
    const text = `${r.title} ${r.snippet}`.toLowerCase()
    positiveWords.forEach(w => { if (text.includes(w)) positiveCount++ })
    negativeWords.forEach(w => { if (text.includes(w)) negativeCount++ })
  })
  
  if (positiveCount > negativeCount * 2) return 'positive'
  if (negativeCount > positiveCount * 2) return 'negative'
  return 'neutral'
}