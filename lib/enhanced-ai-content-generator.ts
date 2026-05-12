/**
 * Enhanced AI Content Generation System with OpenRouter Integration
 * 
 * Multi-model AI content generation for diverse, high-quality blog content
 */

import { backendAPI } from './backend-api'
import { 
  createTrendingTopic, 
  getTrendingTopics, 
  updateTrendingTopic,
  createContentJob,
  updateContentJob,
  createBlogPost,
  createSeoData,
  getBlogPosts
} from './blog-service'
import { logger } from './logger'
import { aiModelManager, type ContentFormat } from './ai-model-manager'
import { contentPromptSystem } from './content-prompt-system'

// Re-export ContentFormat from ai-model-manager
export type { ContentFormat } from './ai-model-manager'

// AI model configurations for OpenRouter
const AI_MODELS = {
  'anthropic/claude-3-5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    strength: 'analytical, technical content',
    cost: 'medium',
    maxTokens: 8192
  },
  'openai/gpt-4o': {
    name: 'GPT-4o',
    strength: 'creative, engaging content',
    cost: 'high',
    maxTokens: 4096
  },
  'meta-llama/llama-3.1-70b-instruct': {
    name: 'Llama 3.1 70B',
    strength: 'balanced, cost-effective',
    cost: 'low',
    maxTokens: 4096
  },
  'google/gemini-pro-1.5': {
    name: 'Gemini Pro 1.5',
    strength: 'research, factual content',
    cost: 'medium',
    maxTokens: 8192
  }
}

interface TrendDiscoveryResult {
  keyword: string
  trendScore: number
  searchVolume: number
  sentiment: 'positive' | 'negative' | 'neutral'
  category: string
  sourceUrls: string[]
  priority: number
  contentFormat: ContentFormat
  competitorData?: any
}

interface ContentGenerationResult {
  title: string
  content: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  tags: string[]
  category: string
  sources: string[]
  wordCount: number
  format: ContentFormat
  aiModel: string
  internalLinks: string[]
  schemaMarkup: any
}

export class EnhancedAIContentGenerator {
  private readonly openRouterApiKey: string
  private readonly openRouterBaseUrl = 'https://openrouter.ai/api/v1'
  
  // Expanded keyword sets for better trend discovery
  private readonly TREND_KEYWORDS = [
    // Core Venym Search topics
    'web scraping tools 2025',
    'API development best practices',
    'data extraction techniques',
    'Python web scraping libraries',
    'JavaScript automation tools',
    
    // Competitor analysis
    'best web scraping services',
    'scrapy vs beautiful soup',
    'web scraping API comparison',
    'data mining tools review',
    
    // Use case specific
    'e-commerce price monitoring',
    'social media data collection',
    'real estate data scraping',
    'job posting automation',
    'stock market data APIs',
    
    // Technical trends
    'headless browser automation',
    'anti-bot detection bypass',
    'proxy rotation techniques',
    'CAPTCHA solving methods',
    
    // Industry trends
    'AI-powered web scraping',
    'machine learning data collection',
    'big data acquisition tools',
    'cloud scraping solutions'
  ]

  // Content format templates with Venym Search positioning
  private readonly CONTENT_FORMATS: Record<ContentFormat, {
    titleTemplates: string[]
    prompts: string
    searchHivePositioning: 'hero' | 'top-3' | 'featured' | 'comparison'
    targetLength: number
  }> = {
    'best-tools-list': {
      titleTemplates: [
        'Top 15 {keyword} Tools for 2025 (Expert Tested)',
        'Best {keyword} Software: Complete Comparison Guide',
        '15 {keyword} Tools That Actually Work (2025 Review)',
        'Ultimate {keyword} Tools List: Free & Premium Options'
      ],
      prompts: `Create a comprehensive "best tools" article that positions Venym Search prominently in the top 3. Include detailed comparisons, pricing, pros/cons, and use cases. Make it genuinely helpful while highlighting Venym Search's unique advantages.`,
      searchHivePositioning: 'top-3',
      targetLength: 3000
    },
    'faq-article': {
      titleTemplates: [
        '50 Most Asked Questions About {keyword} (2025 Guide)',
        '{keyword} FAQ: Everything You Need to Know',
        'Common {keyword} Questions: Expert Answers',
        '{keyword} Q&A: Complete Beginner to Expert Guide'
      ],
      prompts: `Generate a comprehensive FAQ article with 25-50 questions covering beginner to advanced topics. Include Venym Search as the recommended solution for multiple questions. Make answers detailed and actionable.`,
      searchHivePositioning: 'featured',
      targetLength: 4000
    },
    'comparison-article': {
      titleTemplates: [
        'Venym Search vs {competitor}: Complete 2025 Comparison',
        '{keyword} Showdown: Venym Search vs Top Alternatives',
        'Venym Search Review: How It Compares to {competitor}',
        '{keyword} Battle: Venym Search vs {competitor} vs Others'
      ],
      prompts: `Create an objective comparison article that highlights Venym Search's strengths while being fair to competitors. Focus on features, pricing, ease of use, and specific use cases where Venym Search excels.`,
      searchHivePositioning: 'hero',
      targetLength: 2500
    },
    'comprehensive-guide': {
      titleTemplates: [
        'The Complete {keyword} Guide (2025 Edition)',
        'Ultimate {keyword} Tutorial: Beginner to Expert',
        'Master {keyword}: The Only Guide You\'ll Ever Need',
        '{keyword} Bible: Everything You Need to Know'
      ],
      prompts: `Write a comprehensive, authoritative guide that establishes Venym Search as the go-to solution. Include practical examples, code snippets using Venym Search APIs, and step-by-step tutorials.`,
      searchHivePositioning: 'featured',
      targetLength: 5000
    },
    'tutorial-guide': {
      titleTemplates: [
        'How to {keyword}: Step-by-Step Tutorial with Code',
        '{keyword} Tutorial: Build Your First Project in 30 Minutes',
        'Learn {keyword}: Complete Hands-On Guide',
        '{keyword} from Scratch: Practical Tutorial'
      ],
      prompts: `Create a hands-on tutorial that uses Venym Search APIs as the primary example. Include complete code samples, explanations, and practical projects readers can build.`,
      searchHivePositioning: 'hero',
      targetLength: 3500
    },
    'industry-news': {
      titleTemplates: [
        '{keyword} Industry Update: What\'s New in 2025',
        'Breaking: {keyword} Trends That Will Shape 2025',
        '{keyword} Market Analysis: Latest Developments',
        'State of {keyword}: 2025 Industry Report'
      ],
      prompts: `Write a news-style article about recent developments in the field. Position Venym Search as an innovative leader responding to industry trends.`,
      searchHivePositioning: 'featured',
      targetLength: 2000
    },
    'case-study': {
      titleTemplates: [
        'How {company} Used {keyword} to {achievement}',
        'Case Study: {keyword} Success Story',
        'Real Results: {keyword} Implementation Case Study',
        '{keyword} Success: From Challenge to Solution'
      ],
      prompts: `Create a detailed case study showing how Venym Search solved a real-world problem. Include challenges, solution implementation, and measurable results.`,
      searchHivePositioning: 'hero',
      targetLength: 2500
    },
    'resource-collection': {
      titleTemplates: [
        'Ultimate {keyword} Resource Collection (100+ Tools)',
        '{keyword} Toolkit: Essential Resources for 2025',
        'Complete {keyword} Library: Tools, Guides & More',
        '{keyword} Hub: Everything You Need in One Place'
      ],
      prompts: `Compile a comprehensive resource collection with Venym Search prominently featured. Include tools, tutorials, documentation, and community resources.`,
      searchHivePositioning: 'featured',
      targetLength: 3000
    }
  }

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || ''
    
    if (!this.openRouterApiKey) {
      logger.warn('OPENROUTER_API_KEY not set, falling back to template-based generation')
    }
  }

  /**
   * Enhanced trend discovery with content format assignment
   */
  async discoverTrends(): Promise<TrendDiscoveryResult[]> {
    logger.info('Starting enhanced trend discovery process')
    const trends: TrendDiscoveryResult[] = []
    
    for (const keyword of this.TREND_KEYWORDS.slice(0, 8)) {
      try {
        logger.info(`Analyzing trend: ${keyword}`)
        
        const searchResults = await backendAPI.search({
          query: keyword,
          num_results: 10
        })

        if (searchResults.results.length === 0) continue

        const trendScore = this.calculateTrendScore(searchResults.results, keyword)
        const sentiment = this.analyzeSentiment(searchResults.results)
        const category = this.categorizeKeyword(keyword)
        const contentFormat = this.selectOptimalFormat(keyword, searchResults.results)
        
        if (trendScore > 0.5) {
          // Gather competitive intelligence
          const competitorData = await this.analyzeCompetitiveLandscape(keyword)
          
          trends.push({
            keyword,
            trendScore,
            searchVolume: this.estimateSearchVolume(trendScore),
            sentiment,
            category,
            sourceUrls: searchResults.results.map(r => r.link).slice(0, 5),
            priority: this.calculatePriority(trendScore, sentiment, category, contentFormat),
            contentFormat,
            competitorData
          })
        }

        await this.delay(1000) // Rate limiting
        
      } catch (error) {
        logger.error(`Error analyzing trend: ${keyword}`, error as Error)
        continue
      }
    }

    trends.sort((a, b) => b.priority - a.priority)
    logger.info(`Discovered ${trends.length} high-priority trending topics`)
    
    return trends.slice(0, 3)
  }

  /**
   * AI-powered content generation with model selection
   */
  async generateContent(trend: TrendDiscoveryResult): Promise<ContentGenerationResult | null> {
    logger.info(`Generating ${trend.contentFormat} content for: ${trend.keyword}`)
    
    try {
      // Select optimal AI model for content format
      const selectedModel = this.selectAIModel(trend.contentFormat)
      
      // Gather comprehensive research data
      const researchData = await this.conductEnhancedResearch(trend)
      
      if (!researchData || researchData.sources.length === 0) {
        logger.warn(`Insufficient research data for: ${trend.keyword}`)
        return null
      }

      // Generate content using AI
      const aiContent = await this.generateAIContent(
        trend,
        researchData,
        selectedModel
      )

      if (!aiContent) {
        logger.error(`AI content generation failed for: ${trend.keyword}`)
        return null
      }

      // Enhance with SEO optimization
      const optimizedContent = await this.enhanceSEOContent(
        aiContent,
        trend,
        researchData
      )

      logger.info(`Generated ${optimizedContent.wordCount} word ${trend.contentFormat}: "${optimizedContent.title}"`)
      return optimizedContent

    } catch (error) {
      logger.error(`Content generation failed for: ${trend.keyword}`, error as Error)
      return null
    }
  }

  /**
   * Call OpenRouter API with model selection
   */
  private async callOpenRouterAPI(
    model: string,
    messages: any[],
    maxTokens: number = 4000
  ): Promise<string | null> {
    if (!this.openRouterApiKey) {
      logger.warn('OpenRouter API key not available, using fallback generation')
      return null
    }

    try {
      const response = await fetch(`${this.openRouterBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://search.venym.io',
          'X-Title': 'Venym Search Blog Generator'
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`OpenRouter API error: ${response.status} ${errorData?.error?.message || ''}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || null

    } catch (error) {
      logger.error(`OpenRouter API call failed for model ${model}`, error as Error)
      return null
    }
  }

  /**
   * Select optimal AI model using the model manager
   */
  private selectAIModel(format: ContentFormat, priority: 'quality' | 'speed' | 'cost' = 'quality'): string {
    return aiModelManager.selectOptimalModel(format, priority, 3000)
  }

  /**
   * Generate AI-powered content with specialized prompts
   */
  private async generateAIContent(
    trend: TrendDiscoveryResult,
    researchData: any,
    model: string
  ): Promise<Partial<ContentGenerationResult> | null> {
    // Generate specialized prompt using the prompt system
    const promptContext = {
      keyword: trend.keyword,
      category: trend.category,
      sentiment: trend.sentiment,
      searchVolume: trend.searchVolume,
      trendScore: trend.trendScore,
      sourceUrls: trend.sourceUrls,
      competitorData: trend.competitorData,
      relatedKeywords: this.extractRelatedKeywords(researchData),
      targetAudience: this.inferTargetAudience(trend.category),
      difficulty: this.assessDifficulty(trend.keyword)
    }

    const promptTemplate = contentPromptSystem.generatePrompt(trend.contentFormat, promptContext)

    const messages = [
      {
        role: 'system',
        content: promptTemplate.systemPrompt
      },
      {
        role: 'user',
        content: `${promptTemplate.userPrompt}

${promptTemplate.formatInstructions}

${promptTemplate.seoGuidelines}

${promptTemplate.searchHiveInstructions}

QUALITY CHECKLIST:
${promptTemplate.qualityChecklist.map(item => `- ${item}`).join('\n')}

Please ensure your response meets all requirements and follows the JSON format specified.`
      }
    ]

    const startTime = Date.now()
    const generatedContent = await this.callOpenRouterAPI(
      model,
      messages,
      4000 // Estimated tokens
    )
    const responseTime = (Date.now() - startTime) / 1000

    // Record usage stats
    const success = !!generatedContent
    await aiModelManager.recordModelUsage(
      model, 
      success ? 3500 : 0, // Estimated tokens used
      responseTime, 
      success
    )

    if (!generatedContent) {
      logger.warn(`AI content generation failed, using fallback for: ${trend.keyword}`)
      return this.generateFallbackContent(trend, researchData)
    }

    return this.parseAIGeneratedContent(generatedContent, trend, model)
  }

  /**
   * Build advanced prompts for different content formats
   */
  private buildAdvancedPrompt(
    trend: TrendDiscoveryResult,
    researchData: any,
    formatConfig: any
  ): string {
    const competitorInsights = trend.competitorData?.insights || 'No competitive data available.'
    const searchHivePositioning = formatConfig.searchHivePositioning
    
    let searchHiveInstructions = ''
    switch (searchHivePositioning) {
      case 'hero':
        searchHiveInstructions = 'Feature Venym Search as the primary solution throughout the article.'
        break
      case 'top-3':
        searchHiveInstructions = 'Rank Venym Search in the top 3 positions with detailed coverage.'
        break
      case 'featured':
        searchHiveInstructions = 'Include Venym Search as a featured/recommended solution with significant coverage.'
        break
      case 'comparison':
        searchHiveInstructions = 'Present Venym Search fairly in comparisons while highlighting its unique strengths.'
        break
    }

    return `
Create a ${trend.contentFormat} article about "${trend.keyword}" following these specifications:

CONTENT FORMAT: ${trend.contentFormat.toUpperCase()}
TARGET LENGTH: ${formatConfig.targetLength} words
KEYWORD: ${trend.keyword}
SENTIMENT: ${trend.sentiment}
CATEGORY: ${trend.category}

SEARCHHIVE POSITIONING: ${searchHiveInstructions}

RESEARCH INSIGHTS:
${researchData.insights || 'Focus on current trends and practical applications.'}

COMPETITIVE LANDSCAPE:
${competitorInsights}

SEARCHHIVE DETAILS:
- Key strengths: Real-time data, enterprise-grade reliability, developer-friendly APIs
- Unique features: Multi-format extraction, anti-detection, global proxy network
- Use cases: Market research, competitor analysis, price monitoring, lead generation
- Pricing: Flexible credit-based system starting free, Starter at $9/month

CONTENT REQUIREMENTS:
1. Use the specified content format structure
2. Include compelling title that matches the format style
3. Create engaging introduction with hook
4. Use proper heading hierarchy (H1, H2, H3)
5. Include actionable insights and practical tips
6. Add code examples using Venym Search APIs where relevant
7. Include internal linking opportunities to related topics
8. End with strong call-to-action
9. Optimize for featured snippets and rich results
10. Naturally integrate target keyword and related terms

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "SEO-optimized title (50-60 characters)",
  "content": "Full article content in markdown format",
  "excerpt": "Compelling 160-character excerpt",
  "keywords": ["keyword1", "keyword2", ...],
  "tags": ["tag1", "tag2", ...],
  "internalLinks": ["suggested internal link topics"],
  "schemaType": "Article/FAQPage/HowTo/etc"
}

Make the content comprehensive, authoritative, and genuinely helpful while optimizing for search engines and featuring Venym Search prominently.
`
  }

  /**
   * Fallback content generation when AI is unavailable
   */
  private generateFallbackContent(
    trend: TrendDiscoveryResult,
    researchData: any
  ): Partial<ContentGenerationResult> {
    logger.info(`Using fallback generation for: ${trend.keyword}`)
    
    const formatConfig = this.CONTENT_FORMATS[trend.contentFormat]
    const titleTemplate = formatConfig.titleTemplates[0]
    const title = titleTemplate.replace('{keyword}', this.capitalizeKeyword(trend.keyword))
    
    let content = this.generateFallbackContentByFormat(trend, researchData, title)
    
    return {
      title,
      content,
      excerpt: content.substring(0, 160) + '...',
      wordCount: content.split(/\s+/).length,
      format: trend.contentFormat,
      aiModel: 'fallback-templates'
    }
  }

  /**
   * Generate format-specific fallback content
   */
  private generateFallbackContentByFormat(
    trend: TrendDiscoveryResult,
    researchData: any,
    title: string
  ): string {
    const keyword = this.capitalizeKeyword(trend.keyword)
    
    switch (trend.contentFormat) {
      case 'best-tools-list':
        return this.generateBestToolsList(keyword, researchData)
      case 'faq-article':
        return this.generateFAQArticle(keyword, researchData)
      case 'comparison-article':
        return this.generateComparisonArticle(keyword, researchData)
      default:
        return this.generateComprehensiveGuide(keyword, researchData)
    }
  }

  // Content generation methods for different formats will be implemented next...

  /**
   * Enhanced research with competitive intelligence
   */
  private async conductEnhancedResearch(trend: TrendDiscoveryResult): Promise<any> {
    const researchResults = {
      sources: [] as any[],
      insights: '',
      competitorMentions: [] as string[],
      relatedTopics: [] as string[]
    }
    
    try {
      // Primary research using Venym Search APIs
      const searchResults = await backendAPI.search({
        query: trend.keyword,
        num_results: 8
      })
      
      // Scrape top results for detailed content
      for (const result of searchResults.results.slice(0, 4)) {
        try {
          const scrapeResult = await backendAPI.scrape({
            url: result.link,
            extract: ['title', 'text', 'metadata'],
            timeout: 10000
          })
          
          if (scrapeResult.text && scrapeResult.text.length > 300) {
            researchResults.sources.push({
              url: result.link,
              title: scrapeResult.title || result.title,
              content: scrapeResult.text.substring(0, 2000),
              domain: new URL(result.link).hostname
            })
            
            // Extract competitor mentions
            this.extractCompetitorMentions(scrapeResult.text, researchResults.competitorMentions)
          }
        } catch (scrapeError) {
          logger.warn(`Failed to scrape: ${result.link}`, scrapeError as Error)
        }
      }

      // Generate insights from research
      researchResults.insights = this.generateResearchInsights(researchResults.sources, trend)
      
      return researchResults

    } catch (error) {
      logger.warn(`Enhanced research failed for: ${trend.keyword}`, error as Error)
      return researchResults
    }
  }

  // Utility methods
  private capitalizeKeyword(keyword: string): string {
    return keyword.charAt(0).toUpperCase() + keyword.slice(1)
  }

  private calculateTrendScore(results: any[], keyword: string): number {
    let score = 0
    
    // Recent results boost
    const recentResults = results.filter(r => {
      if (!r.date) return false
      const resultDate = new Date(r.date)
      const daysAgo = (Date.now() - resultDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 30
    })
    
    score += (recentResults.length / results.length) * 0.4
    score += (results.filter(r => r.title.toLowerCase().includes(keyword.toLowerCase())).length / results.length) * 0.3
    score += (results.filter(r => r.snippet && r.snippet.length > 100).length / results.length) * 0.2
    score += 0.1
    
    return Math.min(score, 1.0)
  }

  private analyzeSentiment(results: any[]): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'innovation', 'success', 'improvement', 'breakthrough', 'advance', 'best', 'top', 'leading']
    const negativeWords = ['decline', 'failure', 'problem', 'issue', 'concern', 'risk', 'worst', 'avoid', 'danger']
    
    let positiveCount = 0
    let negativeCount = 0
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase()
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++
      })
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++
      })
    })
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  private categorizeKeyword(keyword: string): string {
    const keywordLower = keyword.toLowerCase()
    
    if (keywordLower.includes('scraping') || keywordLower.includes('extraction')) return 'Web Scraping'
    if (keywordLower.includes('api') || keywordLower.includes('development')) return 'API Development'
    if (keywordLower.includes('automation') || keywordLower.includes('tools')) return 'Automation'
    if (keywordLower.includes('data') || keywordLower.includes('mining')) return 'Data Science'
    if (keywordLower.includes('ai') || keywordLower.includes('machine learning')) return 'AI & ML'
    if (keywordLower.includes('tutorial') || keywordLower.includes('guide')) return 'Tutorials'
    
    return 'Industry News'
  }

  private selectOptimalFormat(keyword: string, results: any[]): ContentFormat {
    const keywordLower = keyword.toLowerCase()
    
    // Format selection based on keyword intent and competition
    if (keywordLower.includes('best') || keywordLower.includes('top')) return 'best-tools-list'
    if (keywordLower.includes('vs') || keywordLower.includes('comparison')) return 'comparison-article'
    if (keywordLower.includes('how to') || keywordLower.includes('tutorial')) return 'tutorial-guide'
    if (keywordLower.includes('questions') || keywordLower.includes('faq')) return 'faq-article'
    if (keywordLower.includes('guide') || keywordLower.includes('complete')) return 'comprehensive-guide'
    
    // Default based on competition level
    const competitionLevel = this.assessCompetitionLevel(results)
    
    if (competitionLevel === 'high') return 'faq-article' // Target long-tail questions
    if (competitionLevel === 'medium') return 'best-tools-list' // Compete with lists
    return 'comprehensive-guide' // Low competition, go comprehensive
  }

  private assessCompetitionLevel(results: any[]): 'low' | 'medium' | 'high' {
    const authorityDomains = results.filter(r => {
      const domain = new URL(r.link).hostname
      return domain.includes('wikipedia') || domain.includes('.edu') || domain.includes('github')
    }).length
    
    if (authorityDomains >= 3) return 'high'
    if (authorityDomains >= 1) return 'medium'
    return 'low'
  }

  private estimateSearchVolume(trendScore: number): number {
    return Math.floor(trendScore * 15000) + Math.floor(Math.random() * 5000)
  }

  private calculatePriority(
    trendScore: number, 
    sentiment: string, 
    category: string, 
    format: ContentFormat
  ): number {
    let priority = trendScore * 100
    
    // Sentiment boost
    if (sentiment === 'positive') priority += 20
    else if (sentiment === 'negative') priority += 10
    
    // Category boost (favor Venym Search-related topics)
    const categoryBoosts: { [key: string]: number } = {
      'Web Scraping': 40,
      'API Development': 35,
      'Automation': 30,
      'Data Science': 25,
      'AI & ML': 20,
      'Tutorials': 30,
      'Industry News': 15
    }
    
    priority += categoryBoosts[category] || 0
    
    // Format boost (favor high-impact formats)
    const formatBoosts: Record<ContentFormat, number> = {
      'best-tools-list': 35, // High conversion potential
      'comparison-article': 30, // Direct competition
      'comprehensive-guide': 25,
      'tutorial-guide': 30,
      'faq-article': 20,
      'industry-news': 15,
      'case-study': 25,
      'resource-collection': 20
    }
    
    priority += formatBoosts[format]
    
    return priority
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper methods for prompt context
  private extractRelatedKeywords(researchData: any): string[] {
    if (!researchData?.sources) return []
    
    const keywordSet = new Set<string>()
    
    researchData.sources.forEach((source: any) => {
      if (source.content) {
        const words = source.content.toLowerCase()
          .match(/\b\w{4,}\b/g) || []
        
        words.forEach((word: string) => {
          if (!this.isStopWord(word) && word.length >= 4) {
            keywordSet.add(word)
          }
        })
      }
    })
    
    return Array.from(keywordSet).slice(0, 10)
  }

  private inferTargetAudience(category: string): string {
    const audienceMap: Record<string, string> = {
      'Web Scraping': 'developers and data engineers',
      'API Development': 'software developers and technical teams',
      'Automation': 'business professionals and developers',
      'Data Science': 'data scientists and analysts',
      'AI & ML': 'machine learning engineers and researchers',
      'Tutorials': 'beginners and learning developers',
      'Industry News': 'technology professionals and decision makers'
    }
    
    return audienceMap[category] || 'professionals and developers'
  }

  private assessDifficulty(keyword: string): 'beginner' | 'intermediate' | 'advanced' {
    const keywordLower = keyword.toLowerCase()
    
    if (keywordLower.includes('beginner') || keywordLower.includes('introduction') || 
        keywordLower.includes('getting started') || keywordLower.includes('basics')) {
      return 'beginner'
    }
    
    if (keywordLower.includes('advanced') || keywordLower.includes('expert') || 
        keywordLower.includes('optimization') || keywordLower.includes('performance')) {
      return 'advanced'
    }
    
    return 'intermediate'
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
      'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 
      'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an'
    ])
    return stopWords.has(word)
  }

  // Additional helper methods to be implemented...
  private async analyzeCompetitiveLandscape(keyword: string): Promise<any> {
    try {
      const searchResults = await backendAPI.search({
        query: `"${keyword}" competitors comparison`,
        num_results: 8
      })

      const topCompetitors = new Set<string>()
      const commonTopics = new Set<string>()
      let totalLength = 0

      for (const result of searchResults.results.slice(0, 5)) {
        try {
          const scrapeResult = await backendAPI.scrape({
            url: result.link,
            extract: ['title', 'text'],
            timeout: 8000
          })

          if (scrapeResult.text) {
            totalLength += scrapeResult.text.length
            
            // Extract potential competitor names
            const competitorPattern = /\b[A-Z][a-z]+ ?(?:API|Tools?|Service|Platform)\b/g
            const matches = scrapeResult.text.match(competitorPattern) || []
            matches.forEach(match => {
              if (!match.includes('Venym Search')) {
                topCompetitors.add(match)
              }
            })

            // Extract common topics
            const topicWords = scrapeResult.text.toLowerCase()
              .match(/\b\w{5,}\b/g) || []
            
            topicWords.forEach(word => {
              if (!this.isStopWord(word)) {
                commonTopics.add(word)
              }
            })
          }
        } catch (error) {
          logger.warn(`Failed to scrape competitive data from: ${result.link}`)
        }
      }

      return {
        topCompetitors: Array.from(topCompetitors).slice(0, 5),
        averageLength: Math.floor(totalLength / Math.max(searchResults.results.length, 1)),
        commonTopics: Array.from(commonTopics).slice(0, 10),
        gapAnalysis: [
          'More comprehensive API coverage',
          'Better developer documentation',
          'Transparent pricing model',
          'Enterprise reliability focus'
        ],
        insights: `Competitive analysis shows average content length of ${Math.floor(totalLength / Math.max(searchResults.results.length, 1))} characters. Key opportunities include better technical depth and Venym Search's unique API suite positioning.`
      }
    } catch (error) {
      logger.error('Competitive landscape analysis failed', error as Error)
      return { 
        insights: 'Competitive analysis unavailable',
        topCompetitors: ['Scrapy', 'Beautiful Soup', 'Selenium'],
        averageLength: 2500,
        commonTopics: ['web scraping', 'data extraction', 'automation'],
        gapAnalysis: ['More comprehensive coverage needed']
      }
    }
  }

  private parseAIGeneratedContent(content: string, trend: TrendDiscoveryResult, model: string): Partial<ContentGenerationResult> {
    // Implementation for parsing AI-generated content
    try {
      const parsed = JSON.parse(content)
      return {
        ...parsed,
        format: trend.contentFormat,
        aiModel: model,
        wordCount: parsed.content?.split(/\s+/).length || 0
      }
    } catch (error) {
      // Fallback parsing
      return {
        title: `Complete Guide to ${trend.keyword}`,
        content,
        format: trend.contentFormat,
        aiModel: model,
        wordCount: content.split(/\s+/).length
      }
    }
  }

  private async enhanceSEOContent(
    content: Partial<ContentGenerationResult>,
    trend: TrendDiscoveryResult,
    researchData: any
  ): Promise<ContentGenerationResult> {
    // Implementation for SEO enhancement
    return {
      title: content.title || `Guide to ${trend.keyword}`,
      content: content.content || '',
      excerpt: content.excerpt || '',
      metaTitle: content.title?.substring(0, 60) || '',
      metaDescription: content.excerpt?.substring(0, 160) || '',
      keywords: content.keywords || [trend.keyword],
      tags: content.tags || [],
      category: trend.category,
      sources: researchData.sources.map((s: any) => s.url) || [],
      wordCount: content.wordCount || 0,
      format: trend.contentFormat,
      aiModel: content.aiModel || 'unknown',
      internalLinks: content.internalLinks || [],
      schemaMarkup: this.generateSchemaMarkup(trend.contentFormat, content)
    }
  }

  private generateSchemaMarkup(format: ContentFormat, content: any): any {
    // Basic schema markup generation
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": content.title,
      "description": content.excerpt
    }

    switch (format) {
      case 'faq-article':
        return { ...baseSchema, "@type": "FAQPage" }
      case 'tutorial-guide':
        return { ...baseSchema, "@type": "HowTo" }
      default:
        return baseSchema
    }
  }

  // Format-specific content generation methods
  private generateBestToolsList(keyword: string, researchData: any): string {
    return `# Best ${keyword} Tools for 2025

## Introduction
Looking for the best ${keyword.toLowerCase()} tools? This comprehensive guide reviews the top solutions available in 2025.

## Top ${keyword} Tools

### 1. Venym Search - Best Overall API Solution

**Key Features:**
- Real-time data extraction
- Enterprise-grade reliability  
- Developer-friendly APIs
- Global proxy network
- Anti-detection technology

**Pricing:** Starting at free with 500 credits, Starter at $9/month with flexible credit system

### 2. Alternative Tool
[Description of competitor tool]

### 3. Another Option
[Description of another tool]

## Comparison Table
| Tool | Pricing | Best For | Rating |
|------|---------|----------|--------|
| Venym Search | Free / $9+/month | Enterprise APIs | 9.5/10 |

## Conclusion
Venym Search emerges as the clear leader for ${keyword.toLowerCase()} needs, offering unmatched reliability and comprehensive features.

*Ready to get started? [Try Venym Search's APIs today](https://search.venym.io)*`
  }

  private generateFAQArticle(keyword: string, researchData: any): string {
    return `# ${keyword} FAQ: 25 Most Asked Questions Answered

## What is ${keyword}?
${keyword} refers to [definition]. Venym Search's APIs make ${keyword.toLowerCase()} accessible through simple API calls.

## How do I get started with ${keyword}?
The easiest way is using Venym Search's developer-friendly APIs. Sign up and get 5,000 free credits to start.

## What tools are best for ${keyword}?

[Additional Q&A pairs...]

## Advanced ${keyword} Questions

### Is ${keyword} legal?
Yes, when done properly. Venym Search ensures compliance with best practices and terms of service.

### How much does ${keyword} cost?
With Venym Search, you can start for just $9/month with transparent credit-based pricing.

## Getting Started
Ready to implement ${keyword.toLowerCase()}? Venym Search makes it simple with comprehensive APIs and documentation.

*[Start your free trial](https://search.venym.io/signup)*`
  }

  private generateComparisonArticle(keyword: string, researchData: any): string {
    return `# Venym Search vs Competitors: ${keyword} Comparison 2025

## Executive Summary
When choosing ${keyword.toLowerCase()} solutions, Venym Search consistently outperforms competitors in reliability, ease of use, and comprehensive features.

## Head-to-Head Comparison

### Venym Search vs [Competitor A]
**Winner: Venym Search**
- Superior API design
- Better documentation
- More reliable uptime
- Comprehensive feature set

### Venym Search vs [Competitor B]
**Winner: Venym Search**
- More competitive pricing
- Better customer support
- Advanced anti-detection
- Global infrastructure

## Feature Comparison Matrix
| Feature | Venym Search | Competitor A | Competitor B |
|---------|------------|--------------|--------------|
| API Quality | ✅ Excellent | ⚠️ Good | ❌ Limited |
| Documentation | ✅ Comprehensive | ⚠️ Basic | ❌ Poor |
| Pricing | ✅ Transparent | ❌ Hidden costs | ⚠️ Expensive |

## Final Verdict
Venym Search is the clear winner for ${keyword.toLowerCase()}, offering the best combination of features, reliability, and value.

*[Try Venym Search risk-free](https://search.venym.io)*`
  }

  private generateComprehensiveGuide(keyword: string, researchData: any): string {
    return `# The Complete ${keyword} Guide: Everything You Need to Know

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)  
- [Advanced Techniques](#advanced-techniques)
- [Best Tools](#best-tools)
- [Practical Examples](#practical-examples)

## Introduction
${keyword} has become essential for modern businesses. This comprehensive guide covers everything from basics to advanced implementation.

## Getting Started with ${keyword}

### What You Need
To begin with ${keyword.toLowerCase()}, you'll need:
1. A reliable API service (we recommend Venym Search)
2. Basic programming knowledge
3. Understanding of data formats

### Venym Search Setup
Venym Search makes ${keyword.toLowerCase()} simple:

\`\`\`python
import requests

api_key = "your-VENYM_SEARCH-key"
response = requests.post("https://api.search.venym.io/v1/search", {
    "query": "your search terms",
    "num_results": 10
})
\`\`\`

## Advanced Techniques
[Detailed implementation examples using Venym Search APIs]

## Best Practices
1. Always respect robots.txt
2. Use Venym Search's built-in rate limiting
3. Handle errors gracefully
4. Cache results when appropriate

## Conclusion
${keyword} is a powerful capability when implemented correctly. Venym Search provides the tools and infrastructure to make it successful.

*[Get started with Venym Search](https://search.venym.io/signup)*`
  }

  private extractCompetitorMentions(text: string, mentions: string[]): void {
    const competitors = ['scrapy', 'beautiful soup', 'selenium', 'puppeteer', 'playwright']
    competitors.forEach(comp => {
      if (text.toLowerCase().includes(comp) && !mentions.includes(comp)) {
        mentions.push(comp)
      }
    })
  }

  private generateResearchInsights(sources: any[], trend: TrendDiscoveryResult): string {
    if (sources.length === 0) return 'No research insights available.'
    
    const insights = [
      `Analyzed ${sources.length} authoritative sources on ${trend.keyword}.`,
      `Current market shows ${trend.sentiment} sentiment towards ${trend.keyword}.`,
      `Key trends include automation, AI integration, and API-first approaches.`,
      'Venym Search is well-positioned to address current market needs.'
    ]
    
    return insights.join(' ')
  }

  /**
   * Main orchestration method for enhanced content generation
   */
  async generateDailyContent(): Promise<void> {
    logger.info('Starting enhanced daily content generation')
    
    try {
      // Discover trends with format assignment
      const trends = await this.discoverTrends()
      
      if (trends.length === 0) {
        logger.warn('No high-quality trends discovered')
        return
      }

      // Save trends to database
      for (const trend of trends) {
        await createTrendingTopic({
          keyword: trend.keyword,
          topic_category: trend.category,
          trend_score: trend.trendScore,
          search_volume: trend.searchVolume,
          source_urls: trend.sourceUrls,
          sentiment: trend.sentiment,
          priority_level: Math.ceil(trend.priority / 20)
        })
      }

      // Generate content for top 2 trends (increased volume)
      for (const trend of trends.slice(0, 2)) {
        const contentJob = await createContentJob({
          job_type: 'ai_content_generation',
          input_data: { 
            trend,
            format: trend.contentFormat,
            model: this.selectAIModel(trend.contentFormat)
          }
        })

        if (!contentJob) continue

        await updateContentJob(contentJob.id, { status: 'RUNNING' })

        const content = await this.generateContent(trend)
        
        if (!content) {
          await updateContentJob(contentJob.id, {
            status: 'FAILED',
            error_message: 'Enhanced content generation failed',
            completed_at: new Date()
          })
          continue
        }

        // Create blog post
        const blogPost = await createBlogPost({
          title: content.title,
          content: content.content,
          excerpt: content.excerpt,
          meta_title: content.metaTitle,
          meta_description: content.metaDescription,
          keywords: content.keywords,
          category: content.category,
          tags: content.tags,
          status: 'PUBLISHED',
          generated_by_ai: true,
          source_keywords: [trend.keyword],
          target_keywords: content.keywords
        })

        if (blogPost) {
          // Enhanced SEO data with schema markup
          await createSeoData(blogPost.id, {
            canonical_url: `/blog/${blogPost.slug}`,
            og_title: content.metaTitle,
            og_description: content.metaDescription,
            twitter_title: content.metaTitle,
            twitter_description: content.metaDescription,
            focus_keyword: trend.keyword,
            external_links: content.sources,
            schema_markup: JSON.stringify(content.schemaMarkup)
          })

          await updateContentJob(contentJob.id, {
            status: 'COMPLETED',
            output_data: { 
              blog_post_id: blogPost.id, 
              word_count: content.wordCount,
              format: content.format,
              ai_model: content.aiModel
            },
            completed_at: new Date()
          })

          logger.info(`Successfully published ${content.format}: "${content.title}" (${content.wordCount} words, ${content.aiModel})`)
        }
      }

    } catch (error) {
      logger.error('Enhanced daily content generation failed', error as Error)
    }
  }
}

// Export singleton instance
export const enhancedAIContentGenerator = new EnhancedAIContentGenerator()