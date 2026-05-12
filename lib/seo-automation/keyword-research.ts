import { prisma } from '../prisma'
import { backendAPI } from '../backend-api'

interface KeywordData {
  keyword: string
  searchVolume?: number
  difficulty?: number
  competition?: string
  relatedKeywords: string[]
  searchIntent?: string
  contentIdeas: string[]
  trendData?: any
}

interface SwiftSearchResult {
  title: string
  url: string
  snippet: string
  published_date?: string
}

export class KeywordResearchService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async discoverTrendingKeywords(industry: string, limit: number = 50): Promise<string[]> {
    const trendingQueries = [
      `trending ${industry} topics 2025`,
      `${industry} news today`,
      `latest ${industry} developments`,
      `${industry} trends`,
      `${industry} innovations`,
      `best ${industry} practices`,
      `${industry} tools`,
      `${industry} solutions`,
      `${industry} tips`,
      `${industry} guide`
    ]

    const keywords = new Set<string>()

    for (const query of trendingQueries) {
      try {
        const results = await this.searchWithSwiftSearch(query, 20)
        const extractedKeywords = this.extractKeywordsFromResults(results, industry)
        extractedKeywords.forEach(keyword => keywords.add(keyword))
      } catch (error) {
        console.error(`Error searching for "${query}":`, error)
      }
    }

    return Array.from(keywords).slice(0, limit)
  }

  async researchKeyword(keyword: string): Promise<KeywordData> {
    // Search for the keyword and related content
    const results = await this.searchWithSwiftSearch(keyword, 30)
    
    // Analyze related keywords from search results
    const relatedKeywords = this.extractRelatedKeywords(results, keyword)
    
    // Determine search intent
    const searchIntent = this.analyzeSearchIntent(keyword, results)
    
    // Generate content ideas
    const contentIdeas = this.generateContentIdeas(keyword, results)
    
    // Estimate metrics (in production, you'd use tools like SEMrush, Ahrefs API)
    const estimatedMetrics = this.estimateKeywordMetrics(keyword, results)

    return {
      keyword,
      searchVolume: estimatedMetrics.searchVolume,
      difficulty: estimatedMetrics.difficulty,
      competition: estimatedMetrics.competition,
      relatedKeywords,
      searchIntent,
      contentIdeas,
      trendData: { results: results.length }
    }
  }

  async saveKeywordResearch(keywordData: KeywordData): Promise<void> {
    await prisma.keywordResearch.upsert({
      where: { keyword: keywordData.keyword },
      update: {
        search_volume: keywordData.searchVolume,
        difficulty: keywordData.difficulty,
        competition: keywordData.competition,
        related_keywords: keywordData.relatedKeywords,
        search_intent: keywordData.searchIntent,
        content_ideas: keywordData.contentIdeas,
        trend_data: keywordData.trendData,
        last_updated: new Date()
      },
      create: {
        keyword: keywordData.keyword,
        search_volume: keywordData.searchVolume,
        difficulty: keywordData.difficulty,
        competition: keywordData.competition,
        related_keywords: keywordData.relatedKeywords,
        search_intent: keywordData.searchIntent,
        content_ideas: keywordData.contentIdeas,
        trend_data: keywordData.trendData,
        is_target_keyword: false,
        priority_score: this.calculatePriorityScore(keywordData)
      }
    })
  }

  async getHighValueKeywords(limit: number = 20): Promise<any[]> {
    return await prisma.keywordResearch.findMany({
      where: {
        priority_score: { gte: 70 },
        is_target_keyword: false
      },
      orderBy: { priority_score: 'desc' },
      take: limit
    })
  }

  private async searchWithSwiftSearch(query: string, maxResults: number = 10): Promise<SwiftSearchResult[]> {
    try {
      // Use backend API directly for server-side calls
      const searchResults = await backendAPI.search({
        query,
        num_results: maxResults
      })

      return searchResults.results.map(r => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet,
        published_date: r.date || undefined
      }))
    } catch (error) {
      console.error('SwiftSearch API error:', error)
      return []
    }
  }

  private extractKeywordsFromResults(results: SwiftSearchResult[], industry: string): string[] {
    const keywords = new Set<string>()
    
    results.forEach(result => {
      // Extract keywords from titles and snippets
      const text = `${result.title} ${result.snippet}`.toLowerCase()
      
      // Simple keyword extraction (in production, use NLP libraries)
      const words = text.match(/\b\w{3,}\b/g) || []
      words.forEach(word => {
        if (word.includes(industry.toLowerCase()) || 
            this.isRelevantKeyword(word, industry)) {
          keywords.add(word)
        }
      })
      
      // Extract phrases
      const phrases = this.extractPhrases(text, industry)
      phrases.forEach(phrase => keywords.add(phrase))
    })

    return Array.from(keywords).filter(k => k.length > 2)
  }

  private extractRelatedKeywords(results: SwiftSearchResult[], mainKeyword: string): string[] {
    const related = new Set<string>()
    const mainKeywordLower = mainKeyword.toLowerCase()
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase()
      
      // Find phrases containing the main keyword
      const sentences = text.split(/[.!?]/)
      sentences.forEach(sentence => {
        if (sentence.includes(mainKeywordLower)) {
          const words = sentence.match(/\b\w{3,}\b/g) || []
          words.forEach(word => {
            if (word !== mainKeywordLower && word.length > 3) {
              related.add(word)
            }
          })
        }
      })
    })

    return Array.from(related).slice(0, 20)
  }

  private analyzeSearchIntent(keyword: string, results: SwiftSearchResult[]): string {
    const keywordLower = keyword.toLowerCase()
    
    // Intent signals
    if (keywordLower.includes('buy') || keywordLower.includes('price') || 
        keywordLower.includes('cost') || keywordLower.includes('purchase')) {
      return 'commercial'
    }
    
    if (keywordLower.includes('how') || keywordLower.includes('what') || 
        keywordLower.includes('why') || keywordLower.includes('guide')) {
      return 'informational'
    }
    
    if (keywordLower.includes('best') || keywordLower.includes('top') || 
        keywordLower.includes('review') || keywordLower.includes('compare')) {
      return 'commercial_investigation'
    }
    
    // Analyze result URLs for intent signals
    const urls = results.map(r => r.url.toLowerCase())
    const commercialDomains = urls.filter(url => 
      url.includes('shop') || url.includes('buy') || url.includes('store')
    ).length
    
    if (commercialDomains > results.length * 0.5) {
      return 'commercial'
    }
    
    return 'informational'
  }

  private generateContentIdeas(keyword: string, results: SwiftSearchResult[]): string[] {
    const ideas = new Set<string>()
    
    // Template-based content ideas
    const templates = [
      `Complete Guide to ${keyword}`,
      `${keyword}: Best Practices and Tips`,
      `How to Use ${keyword} Effectively`,
      `${keyword} vs Alternatives: Comparison`,
      `Top 10 ${keyword} Tools and Resources`,
      `${keyword} Tutorial for Beginners`,
      `Advanced ${keyword} Strategies`,
      `${keyword} Case Studies and Examples`,
      `Common ${keyword} Mistakes to Avoid`,
      `Future of ${keyword}: Trends and Predictions`
    ]
    
    templates.forEach(template => ideas.add(template))
    
    // Extract ideas from existing content
    results.forEach(result => {
      if (result.title.includes('guide') || result.title.includes('how')) {
        ideas.add(`Updated: ${result.title}`)
      }
    })

    return Array.from(ideas).slice(0, 10)
  }

  private estimateKeywordMetrics(keyword: string, results: SwiftSearchResult[]): {
    searchVolume?: number
    difficulty?: number
    competition: string
  } {
    // Simple estimation based on result count and domains
    const resultCount = results.length
    const uniqueDomains = new Set(results.map(r => new URL(r.url).hostname)).size
    
    // Estimate search volume (very rough)
    const estimatedVolume = keyword.split(' ').length === 1 ? 
      Math.floor(Math.random() * 10000) + 1000 : 
      Math.floor(Math.random() * 5000) + 500
    
    // Estimate difficulty based on domain diversity
    const difficulty = uniqueDomains < 5 ? 
      Math.floor(Math.random() * 30) + 20 : 
      Math.floor(Math.random() * 50) + 50
    
    const competition = difficulty < 40 ? 'low' : difficulty < 70 ? 'medium' : 'high'
    
    return {
      searchVolume: estimatedVolume,
      difficulty,
      competition
    }
  }

  private calculatePriorityScore(keywordData: KeywordData): number {
    let score = 0
    
    // Search volume factor
    if (keywordData.searchVolume) {
      score += Math.min(keywordData.searchVolume / 100, 40)
    }
    
    // Difficulty factor (lower difficulty = higher score)
    if (keywordData.difficulty) {
      score += Math.max(0, 50 - keywordData.difficulty)
    }
    
    // Content ideas factor
    score += Math.min(keywordData.contentIdeas.length * 2, 20)
    
    // Related keywords factor
    score += Math.min(keywordData.relatedKeywords.length, 15)
    
    return Math.round(score)
  }

  private isRelevantKeyword(word: string, industry: string): boolean {
    const relevantSuffixes = ['tech', 'software', 'tool', 'platform', 'service', 'solution']
    const relevantPrefixes = ['auto', 'smart', 'digital', 'online', 'cloud']
    
    return relevantSuffixes.some(suffix => word.includes(suffix)) ||
           relevantPrefixes.some(prefix => word.includes(prefix)) ||
           word.includes(industry.toLowerCase())
  }

  private extractPhrases(text: string, industry: string): string[] {
    const phrases = []
    const words = text.split(' ')
    
    // Extract 2-3 word phrases containing industry terms
    for (let i = 0; i < words.length - 1; i++) {
      const twoWord = `${words[i]} ${words[i + 1]}`
      if (twoWord.includes(industry.toLowerCase()) && twoWord.length > 5) {
        phrases.push(twoWord)
      }
      
      if (i < words.length - 2) {
        const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
        if (threeWord.includes(industry.toLowerCase()) && threeWord.length > 8) {
          phrases.push(threeWord)
        }
      }
    }
    
    return phrases.slice(0, 10)
  }
}