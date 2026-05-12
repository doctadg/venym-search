/**
 * AI Content Generation System
 * 
 * Autonomous blog content generation using Venym Search APIs
 */

import { backendAPI } from './backend-api'
import { 
  createTrendingTopic, 
  getTrendingTopics, 
  updateTrendingTopic,
  createContentJob,
  updateContentJob,
  createBlogPost,
  createSeoData
} from './blog-service'
import { logger } from './logger'

interface TrendDiscoveryResult {
  keyword: string
  trendScore: number
  searchVolume: number
  sentiment: 'positive' | 'negative' | 'neutral'
  category: string
  sourceUrls: string[]
  priority: number
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
}

export class AIContentGenerator {
  private readonly TREND_KEYWORDS = [
    'artificial intelligence trends',
    'web scraping tools 2025',
    'API development best practices',
    'data extraction techniques',
    'automation tools',
    'developer productivity',
    'tech industry news',
    'machine learning applications',
    'startup tools',
    'SaaS trends',
    'no-code automation',
    'data mining techniques',
    'Python web scraping',
    'JavaScript automation',
    'cloud computing trends'
  ]

  private readonly CATEGORIES = [
    'Web Scraping',
    'API Development', 
    'Automation',
    'Data Science',
    'Developer Tools',
    'Tech Trends',
    'Industry News',
    'Tutorials'
  ]

  /**
   * Discover trending topics using Search
   */
  async discoverTrends(): Promise<TrendDiscoveryResult[]> {
    logger.info('Starting trend discovery process')
    const trends: TrendDiscoveryResult[] = []
    
    for (const keyword of this.TREND_KEYWORDS.slice(0, 5)) { // Limit to 5 for demo
      try {
        logger.info(`Analyzing trend: ${keyword}`)
        
        // Use Search to find current trends
        const searchResults = await backendAPI.search({
          query: keyword,
          num_results: 10
        })

        if (searchResults.results.length === 0) continue

        // Analyze results for trend signals
        const trendScore = this.calculateTrendScore(searchResults.results, keyword)
        const sentiment = this.analyzeSentiment(searchResults.results)
        const category = this.categorizeKeyword(keyword)
        
        if (trendScore > 0.6) {
          try {
            const researchData = await backendAPI.research({
              query: keyword,
              max_pages: 3,
              extract_content: true
            })

            trends.push({
              keyword,
              trendScore: trendScore,
              searchVolume: this.estimateSearchVolume(trendScore),
              sentiment,
              category,
              sourceUrls: researchData.search_results.map(r => r.link).slice(0, 5),
              priority: this.calculatePriority(trendScore, sentiment, category)
            })
            
            logger.info(`High-scoring trend found: ${keyword} (score: ${trendScore})`)
          } catch (researchError) {
            logger.warn(`Research failed for ${keyword}`, researchError as Error)
            
            // Fallback without research
            trends.push({
              keyword,
              trendScore,
              searchVolume: this.estimateSearchVolume(trendScore),
              sentiment,
              category,
              sourceUrls: searchResults.results.map(r => r.link).slice(0, 3),
              priority: this.calculatePriority(trendScore, sentiment, category)
            })
          }
        }

        // Small delay to avoid overwhelming the API
        await this.delay(1000)
        
      } catch (error) {
        logger.error(`Error analyzing trend: ${keyword}`, error as Error)
        continue
      }
    }

    // Sort by priority and return top trends
    trends.sort((a, b) => b.priority - a.priority)
    logger.info(`Discovered ${trends.length} trending topics`)
    
    return trends.slice(0, 3) // Return top 3 trends
  }

  /**
   * Generate comprehensive content for a trending topic
   */
  async generateContent(trend: TrendDiscoveryResult): Promise<ContentGenerationResult | null> {
    logger.info(`Generating content for: ${trend.keyword}`)
    
    try {
      // Research phase: gather comprehensive information
      const researchData = await this.conductResearch(trend.keyword, trend.sourceUrls)
      
      if (!researchData || researchData.length === 0) {
        logger.warn(`No research data found for: ${trend.keyword}`)
        return null
      }

      // Content generation phase
      const title = this.generateTitle(trend.keyword, trend.category)
      const content = this.generateArticleContent(trend.keyword, researchData, trend.sentiment)
      const excerpt = this.generateExcerpt(content)
      const keywords = this.extractKeywords(trend.keyword, content)
      const tags = this.generateTags(trend.keyword, trend.category)
      
      // SEO optimization
      const metaTitle = this.generateMetaTitle(title, trend.keyword)
      const metaDescription = this.generateMetaDescription(excerpt, trend.keyword)

      const result: ContentGenerationResult = {
        title,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        keywords,
        tags,
        category: trend.category,
        sources: researchData.map(r => r.url),
        wordCount: content.split(/\s+/).length
      }

      logger.info(`Generated ${result.wordCount} word article: "${title}"`)
      return result

    } catch (error) {
      logger.error(`Content generation failed for: ${trend.keyword}`, error as Error)
      return null
    }
  }

  /**
   * Conduct comprehensive research using multiple sources
   */
  private async conductResearch(keyword: string, sourceUrls: string[]): Promise<Array<{url: string, title: string, content: string}>> {
    const researchResults = []
    
    // First, get fresh search results
    try {
      const searchResults = await backendAPI.search({
        query: keyword,
        num_results: 5
      })
      
      // Scrape top results for content
      for (const result of searchResults.results.slice(0, 3)) {
        try {
          const scrapeResult = await backendAPI.scrape({
            url: result.link,
            extract: ['title', 'text'],
            timeout: 10000
          })
          
          if (scrapeResult.text && scrapeResult.text.length > 200) {
            researchResults.push({
              url: result.link,
              title: scrapeResult.title || result.title,
              content: scrapeResult.text.substring(0, 1000) // Limit for processing
            })
          }
        } catch (scrapeError) {
          logger.warn(`Failed to scrape: ${result.link}`, scrapeError as Error)
          continue
        }
      }
    } catch (error) {
      logger.warn(`Research search failed for: ${keyword}`, error as Error)
    }

    return researchResults
  }

  /**
   * Generate article title based on trend and category
   */
  private generateTitle(keyword: string, category: string): string {
    const titleTemplates = [
      `The Ultimate Guide to ${keyword} in 2025`,
      `${keyword}: Everything You Need to Know`,
      `How ${keyword} is Revolutionizing ${category}`,
      `${keyword} Trends That Will Shape 2025`,
      `Mastering ${keyword}: A Developer's Guide`,
      `The Future of ${keyword}: Insights and Predictions`,
      `${keyword} Best Practices for Modern Developers`,
      `Understanding ${keyword}: A Complete Overview`
    ]

    const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
    
    // Capitalize first letter of keyword
    const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1)
    
    return template.replace(keyword, capitalizedKeyword)
  }

  /**
   * Generate comprehensive article content
   */
  private generateArticleContent(keyword: string, researchData: Array<{url: string, title: string, content: string}>, sentiment: string): string {
    const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1)
    
    let content = `# ${capitalizedKeyword}: A Comprehensive Analysis\n\n`
    
    // Introduction
    content += `## Introduction\n\n`
    content += `${capitalizedKeyword} has become increasingly important in today's rapidly evolving technological landscape. `
    content += `This comprehensive analysis explores the current state, emerging trends, and future implications of ${keyword}.\n\n`
    
    // Current State Analysis
    content += `## Current State of ${capitalizedKeyword}\n\n`
    if (researchData.length > 0) {
      content += `Based on our analysis of recent developments, ${keyword} is experiencing significant growth and innovation. `
      content += `Industry experts and leading organizations are increasingly recognizing its potential impact.\n\n`
      
      // Add insights from research
      researchData.slice(0, 2).forEach((research, index) => {
        content += `According to recent findings from ${new URL(research.url).hostname}, `
        content += `${research.content.substring(0, 200)}...\n\n`
      })
    }

    // Key Trends and Developments
    content += `## Key Trends and Developments\n\n`
    content += `Several important trends are shaping the future of ${keyword}:\n\n`
    content += `### 1. Technological Advancement\n`
    content += `The rapid pace of technological innovation continues to drive improvements in ${keyword} capabilities.\n\n`
    content += `### 2. Market Adoption\n`
    content += `Organizations across various industries are increasingly adopting ${keyword} solutions to enhance their operations.\n\n`
    content += `### 3. Regulatory Considerations\n`
    content += `As ${keyword} becomes more prevalent, regulatory frameworks are evolving to address new challenges and opportunities.\n\n`

    // Practical Applications
    content += `## Practical Applications\n\n`
    content += `${capitalizedKeyword} offers numerous practical applications across different sectors:\n\n`
    content += `- **Enterprise Solutions**: Large organizations are leveraging ${keyword} to streamline operations and improve efficiency.\n`
    content += `- **Developer Tools**: The developer community has embraced ${keyword} as an essential tool for modern application development.\n`
    content += `- **Automation**: ${capitalizedKeyword} plays a crucial role in automating complex processes and workflows.\n`
    content += `- **Data Processing**: Organizations use ${keyword} to extract valuable insights from large datasets.\n\n`

    // Best Practices
    content += `## Best Practices for ${capitalizedKeyword}\n\n`
    content += `To effectively leverage ${keyword}, consider the following best practices:\n\n`
    content += `1. **Start with Clear Objectives**: Define specific goals before implementing ${keyword} solutions.\n`
    content += `2. **Choose the Right Tools**: Select tools and platforms that align with your technical requirements.\n`
    content += `3. **Monitor Performance**: Regularly assess the performance and effectiveness of your ${keyword} implementations.\n`
    content += `4. **Stay Updated**: Keep up with the latest developments and emerging trends in ${keyword}.\n`
    content += `5. **Consider Scalability**: Design solutions that can grow with your organization's needs.\n\n`

    // Future Outlook
    content += `## Future Outlook\n\n`
    const outlookSentiment = sentiment === 'positive' ? 'promising' : sentiment === 'negative' ? 'challenging' : 'evolving'
    content += `The future of ${keyword} appears ${outlookSentiment}, with continued innovation and adoption expected across various industries. `
    content += `As technology continues to advance, we can expect to see new applications and use cases emerge.\n\n`

    // Conclusion
    content += `## Conclusion\n\n`
    content += `${capitalizedKeyword} represents a significant opportunity for organizations and developers looking to enhance their capabilities. `
    content += `By understanding current trends, following best practices, and staying informed about future developments, `
    content += `you can effectively leverage ${keyword} to achieve your goals.\n\n`

    // Add source attribution
    if (researchData.length > 0) {
      content += `## Sources\n\n`
      content += `This analysis is based on research from multiple authoritative sources:\n\n`
      researchData.forEach((research, index) => {
        content += `${index + 1}. [${research.title}](${research.url})\n`
      })
      content += `\n`
    }

    content += `---\n\n`
    content += `*This article was generated using Venym Search's AI content system, powered by real-time web research and data analysis.*`

    return content
  }

  /**
   * Generate article excerpt
   */
  private generateExcerpt(content: string): string {
    // Extract first paragraph after the title
    const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'))
    const firstParagraph = paragraphs[0] || ''
    
    return firstParagraph.length > 200 ? 
      firstParagraph.substring(0, 200) + '...' : 
      firstParagraph
  }

  /**
   * Extract relevant keywords from content
   */
  private extractKeywords(mainKeyword: string, content: string): string[] {
    const keywords = [mainKeyword]
    
    // Add related keywords based on content
    const commonTerms = [
      'automation', 'development', 'API', 'data', 'technology',
      'trends', 'tools', 'software', 'applications', 'solutions'
    ]
    
    const contentLower = content.toLowerCase()
    commonTerms.forEach(term => {
      if (contentLower.includes(term) && !keywords.includes(term)) {
        keywords.push(term)
      }
    })

    return keywords.slice(0, 8) // Limit to 8 keywords
  }

  /**
   * Generate relevant tags
   */
  private generateTags(keyword: string, category: string): string[] {
    const baseTags = [category.toLowerCase().replace(' ', '-')]
    const keywordParts = keyword.toLowerCase().split(' ')
    
    baseTags.push(...keywordParts.slice(0, 3))
    baseTags.push('ai-generated', 'VENYM_SEARCH', 'trends')
    
    return [...new Set(baseTags)] // Remove duplicates
  }

  /**
   * Generate SEO-optimized meta title
   */
  private generateMetaTitle(title: string, keyword: string): string {
    if (title.length <= 60) return title
    
    // Truncate while keeping the keyword
    const truncated = title.substring(0, 57) + '...'
    return truncated.includes(keyword) ? truncated : `${keyword} - ${truncated}`
  }

  /**
   * Generate meta description
   */
  private generateMetaDescription(excerpt: string, keyword: string): string {
    let description = excerpt
    if (!description.toLowerCase().includes(keyword.toLowerCase())) {
      description = `Learn about ${keyword}. ${description}`
    }
    
    return description.length > 160 ? 
      description.substring(0, 157) + '...' : 
      description
  }

  /**
   * Calculate trend score based on search results
   */
  private calculateTrendScore(results: any[], keyword: string): number {
    let score = 0
    
    // Recent results boost score
    const recentResults = results.filter(r => {
      if (!r.date) return false
      const resultDate = new Date(r.date)
      const daysAgo = (Date.now() - resultDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 7
    })
    
    score += (recentResults.length / results.length) * 0.4
    
    // Title relevance
    const relevantTitles = results.filter(r => 
      r.title.toLowerCase().includes(keyword.toLowerCase())
    )
    score += (relevantTitles.length / results.length) * 0.3
    
    // Snippet quality
    const qualitySnippets = results.filter(r => 
      r.snippet && r.snippet.length > 100
    )
    score += (qualitySnippets.length / results.length) * 0.2
    
    // Base score
    score += 0.1
    
    return Math.min(score, 1.0)
  }

  /**
   * Analyze sentiment of search results
   */
  private analyzeSentiment(results: any[]): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'innovation', 'success', 'improvement', 'breakthrough', 'advance']
    const negativeWords = ['decline', 'failure', 'problem', 'issue', 'concern', 'risk']
    
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

  /**
   * Categorize keyword into appropriate category
   */
  private categorizeKeyword(keyword: string): string {
    const keywordLower = keyword.toLowerCase()
    
    if (keywordLower.includes('scraping') || keywordLower.includes('extraction')) return 'Web Scraping'
    if (keywordLower.includes('api') || keywordLower.includes('development')) return 'API Development'
    if (keywordLower.includes('automation') || keywordLower.includes('tools')) return 'Automation'
    if (keywordLower.includes('data') || keywordLower.includes('mining')) return 'Data Science'
    if (keywordLower.includes('ai') || keywordLower.includes('machine learning')) return 'Tech Trends'
    if (keywordLower.includes('tutorial') || keywordLower.includes('guide')) return 'Tutorials'
    
    return 'Industry News'
  }

  /**
   * Estimate search volume based on trend score
   */
  private estimateSearchVolume(trendScore: number): number {
    return Math.floor(trendScore * 10000) + Math.floor(Math.random() * 5000)
  }

  /**
   * Calculate priority score for topic selection
   */
  private calculatePriority(trendScore: number, sentiment: string, category: string): number {
    let priority = trendScore * 100
    
    // Sentiment boost
    if (sentiment === 'positive') priority += 20
    else if (sentiment === 'negative') priority += 10
    
    // Category boost (favor Venym Search-related topics)
    const categoryBoosts: { [key: string]: number } = {
      'Web Scraping': 30,
      'API Development': 25,
      'Automation': 20,
      'Data Science': 15,
      'Developer Tools': 15,
      'Tech Trends': 10,
      'Industry News': 5,
      'Tutorials': 25
    }
    
    priority += categoryBoosts[category] || 0
    
    return priority
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Main orchestration method - discover trends and generate content
   */
  async generateDailyContent(): Promise<void> {
    logger.info('Starting daily content generation')
    
    try {
      // Phase 1: Discover trends
      const trends = await this.discoverTrends()
      
      if (trends.length === 0) {
        logger.warn('No trends discovered, skipping content generation')
        return
      }

      // Phase 2: Save trends to database
      for (const trend of trends) {
        await createTrendingTopic({
          keyword: trend.keyword,
          topic_category: trend.category,
          trend_score: trend.trendScore,
          search_volume: trend.searchVolume,
          source_urls: trend.sourceUrls,
          sentiment: trend.sentiment,
          priority_level: Math.ceil(trend.priority / 20) // Convert to 1-5 scale
        })
      }

      // Phase 3: Generate content for top trend
      const topTrend = trends[0]
      const contentJob = await createContentJob({
        job_type: 'content_generation',
        input_data: { trend: topTrend }
      })

      if (!contentJob) {
        logger.error('Failed to create content generation job')
        return
      }

      await updateContentJob(contentJob.id, { status: 'RUNNING' })

      const content = await this.generateContent(topTrend)
      
      if (!content) {
        await updateContentJob(contentJob.id, {
          status: 'FAILED',
          error_message: 'Content generation failed',
          completed_at: new Date()
        })
        return
      }

      // Phase 4: Create blog post
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
        source_keywords: [topTrend.keyword],
        target_keywords: content.keywords
      })

      if (blogPost) {
        // Create SEO data
        await createSeoData(blogPost.id, {
          canonical_url: `/blog/${blogPost.slug}`,
          og_title: content.metaTitle,
          og_description: content.metaDescription,
          twitter_title: content.metaTitle,
          twitter_description: content.metaDescription,
          focus_keyword: topTrend.keyword,
          external_links: content.sources
        })

        // Mark trend as processed
        const trendingTopic = await getTrendingTopics({
          limit: 1,
          // Add filter to find the trend by keyword
        })

        if (trendingTopic.length > 0) {
          await updateTrendingTopic(trendingTopic[0].id, {
            content_generated: true
          })
        }

        await updateContentJob(contentJob.id, {
          status: 'COMPLETED',
          output_data: { blog_post_id: blogPost.id, word_count: content.wordCount },
          completed_at: new Date(),
          processing_time_ms: Date.now() - (contentJob.started_at?.getTime() || Date.now())
        })

        logger.info(`Successfully generated and published blog post: "${content.title}"`)
      } else {
        await updateContentJob(contentJob.id, {
          status: 'FAILED',
          error_message: 'Failed to create blog post',
          completed_at: new Date()
        })
      }

    } catch (error) {
      logger.error('Daily content generation failed', error as Error)
    }
  }
}

// Export singleton instance
export const aiContentGenerator = new AIContentGenerator()