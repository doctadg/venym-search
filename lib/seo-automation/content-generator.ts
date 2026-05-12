import { prisma } from '../prisma'
import { KeywordResearchService } from './keyword-research'
import { backendAPI } from '../backend-api'

interface ContentGenerationOptions {
  keyword: string
  targetLength?: number
  tone?: 'professional' | 'casual' | 'technical' | 'friendly'
  includeImages?: boolean
  includeCodeExamples?: boolean
  targetAudience?: string
}

interface GeneratedContent {
  title: string
  slug: string
  content: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  targetKeywords: string[]
  wordCount: number
  readingTime: number
  seoScore: number
}

export class ContentGeneratorService {
  private openaiApiKey: string
  private searchApiKey: string
  private keywordService: KeywordResearchService

  constructor(openaiApiKey: string, searchApiKey: string) {
    this.openaiApiKey = openaiApiKey
    this.searchApiKey = searchApiKey
    this.keywordService = new KeywordResearchService(searchApiKey)
  }

  async generateBlogPost(options: ContentGenerationOptions): Promise<GeneratedContent> {
    // Research the keyword first
    const keywordData = await this.keywordService.researchKeyword(options.keyword)
    
    // Get competitive analysis
    const competitiveContent = await this.analyzeCompetitors(options.keyword)
    
    // Generate the content
    const content = await this.generateContent(options, keywordData, competitiveContent)
    
    // Optimize for SEO
    const optimizedContent = await this.optimizeForSEO(content, options.keyword, keywordData)
    
    return optimizedContent
  }

  private async generateContent(
    options: ContentGenerationOptions,
    keywordData: any,
    competitiveAnalysis: any
  ): Promise<Partial<GeneratedContent>> {
    const prompt = this.buildContentPrompt(options, keywordData, competitiveAnalysis)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert SEO content writer who creates high-quality, engaging blog posts that rank well in search engines.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.targetLength ? Math.floor(options.targetLength * 1.5) : 4000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.choices[0].message.content

      return this.parseGeneratedContent(generatedText, options.keyword)
    } catch (error) {
      console.error('Content generation error:', error)
      throw new Error('Failed to generate content')
    }
  }

  private buildContentPrompt(
    options: ContentGenerationOptions,
    keywordData: any,
    competitiveAnalysis: any
  ): string {
    const relatedKeywords = keywordData.relatedKeywords.slice(0, 10).join(', ')
    const contentIdeas = keywordData.contentIdeas.slice(0, 5).join('\n- ')
    
    return `
Create a comprehensive, SEO-optimized blog post about "${options.keyword}" with the following requirements:

TARGET SPECIFICATIONS:
- Primary keyword: ${options.keyword}
- Target word count: ${options.targetLength || 2000} words
- Tone: ${options.tone || 'professional'}
- Target audience: ${options.targetAudience || 'professionals and enthusiasts'}
- Search intent: ${keywordData.searchIntent}

KEYWORD INTEGRATION:
- Primary keyword: Use naturally 3-5 times throughout the content
- Related keywords to include: ${relatedKeywords}
- Target keyword density: 1-2% for primary keyword

CONTENT STRUCTURE:
Please format your response as JSON with these fields:
{
  "title": "Compelling, SEO-optimized title (50-60 characters)",
  "content": "Full blog post content in markdown format",
  "excerpt": "Engaging 150-word excerpt",
  "outline": ["Section 1", "Section 2", "etc."]
}

CONTENT REQUIREMENTS:
- Start with a compelling hook that addresses the search intent
- Include actionable insights and practical tips
- Use data, statistics, and examples where relevant
- Include internal linking opportunities (mention related topics)
- End with a strong call-to-action
- Use proper heading structure (H1, H2, H3)
- Include bullet points and numbered lists for readability

CONTENT IDEAS TO CONSIDER:
- ${contentIdeas}

COMPETITIVE INSIGHTS:
${competitiveAnalysis?.insights || 'Focus on providing unique value and fresh perspectives.'}

${options.includeCodeExamples ? 'Include relevant code examples with explanations.' : ''}
${options.includeImages ? 'Suggest places for images, infographics, or visual content.' : ''}

Make the content comprehensive, authoritative, and genuinely helpful to readers while being optimized for search engines.
`
  }

  private async analyzeCompetitors(keyword: string): Promise<any> {
    try {
      // Use backend API directly for server-side calls
      const researchData = await backendAPI.research({
        query: keyword,
        max_pages: 5,
        extract_content: true
      })
      
      if (!researchData.search_results || researchData.search_results.length === 0) {
        return { insights: 'No competitive analysis available.' }
      }
      
      // Analyze top results for content gaps and opportunities
      const topResults = researchData.search_results.slice(0, 5)
      const insights = this.extractCompetitiveInsights(
        topResults.map(r => ({
          title: r.title,
          url: r.link,
          snippet: r.snippet
        })),
        keyword
      )
      
      return { insights, topResults }
    } catch (error) {
      console.error('Competitive analysis error:', error)
      return { insights: 'Focus on providing comprehensive, authoritative content.' }
    }
  }

  private extractCompetitiveInsights(results: any[], keyword: string): string {
    if (!results.length) return 'No competitive insights available.'
    
    const insights = []
    
    // Analyze content lengths
    const avgLength = results.reduce((sum, r) => sum + (r.content?.length || 0), 0) / results.length
    insights.push(`Competitive content averages ${Math.round(avgLength)} characters.`)
    
    // Analyze common topics
    const commonTopics = new Set()
    results.forEach(result => {
      if (result.title) {
        const words = result.title.toLowerCase().split(' ')
        words.forEach((word: string) => {
          if (word.length > 4 && !word.includes(keyword.toLowerCase())) {
            commonTopics.add(word)
          }
        })
      }
    })
    
    if (commonTopics.size > 0) {
      insights.push(`Common topics in top results: ${Array.from(commonTopics).slice(0, 5).join(', ')}.`)
    }
    
    insights.push('Focus on providing more comprehensive coverage and unique insights.')
    
    return insights.join(' ')
  }

  private parseGeneratedContent(generatedText: string, keyword: string): Partial<GeneratedContent> {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(generatedText)
      
      return {
        title: parsed.title,
        content: parsed.content,
        excerpt: parsed.excerpt,
        wordCount: this.countWords(parsed.content),
        readingTime: this.calculateReadingTime(parsed.content)
      }
    } catch (error) {
      // Fallback: parse plain text format
      const lines = generatedText.split('\n').filter(line => line.trim())
      
      let title = lines.find(line => line.toLowerCase().includes('title'))?.replace(/title:?\s*/i, '') || 
                  `Complete Guide to ${keyword}`
      
      // Remove any quotes from title
      title = title.replace(/['"]/g, '')
      
      const content = generatedText
      const excerpt = content.substring(0, 150) + '...'
      
      return {
        title,
        content,
        excerpt,
        wordCount: this.countWords(content),
        readingTime: this.calculateReadingTime(content)
      }
    }
  }

  private async optimizeForSEO(
    content: Partial<GeneratedContent>,
    keyword: string,
    keywordData: any
  ): Promise<GeneratedContent> {
    const slug = this.generateSlug(content.title || keyword)
    const metaTitle = this.generateMetaTitle(content.title || keyword)
    const metaDescription = this.generateMetaDescription(content.excerpt || '', keyword)
    const keywords = this.extractKeywords(content.content || '', keywordData)
    const seoScore = this.calculateSEOScore(content, keyword, keywordData)
    
    return {
      title: content.title || `Complete Guide to ${keyword}`,
      slug,
      content: content.content || '',
      excerpt: content.excerpt || '',
      metaTitle,
      metaDescription,
      keywords,
      targetKeywords: [keyword, ...keywordData.relatedKeywords.slice(0, 4)],
      wordCount: content.wordCount || 0,
      readingTime: content.readingTime || 0,
      seoScore
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }

  private generateMetaTitle(title: string): string {
    if (title.length <= 60) return title
    return title.substring(0, 57) + '...'
  }

  private generateMetaDescription(excerpt: string, keyword: string): string {
    let description = excerpt.replace(/['"]/g, '').trim()
    
    if (!description.toLowerCase().includes(keyword.toLowerCase())) {
      description = `Learn about ${keyword}. ${description}`
    }
    
    if (description.length > 160) {
      description = description.substring(0, 157) + '...'
    }
    
    return description
  }

  private extractKeywords(content: string, keywordData: any): string[] {
    const keywords = new Set<string>()
    
    // Add primary keyword
    keywords.add(keywordData.keyword)
    
    // Add related keywords that appear in content
    keywordData.relatedKeywords.forEach((keyword: string) => {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        keywords.add(keyword)
      }
    })
    
    // Extract additional keywords from content
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || []
    const wordFreq = new Map<string, number>()
    
    words.forEach(word => {
      if (!this.isStopWord(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
      }
    })
    
    // Add frequent words as keywords
    Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([word]) => keywords.add(word))
    
    return Array.from(keywords).slice(0, 15)
  }

  private calculateSEOScore(
    content: Partial<GeneratedContent>,
    keyword: string,
    keywordData: any
  ): number {
    let score = 0
    const text = content.content?.toLowerCase() || ''
    const keywordLower = keyword.toLowerCase()
    
    // Title optimization (20 points)
    if (content.title?.toLowerCase().includes(keywordLower)) score += 20
    
    // Content length (20 points)
    const wordCount = content.wordCount || 0
    if (wordCount >= 1500) score += 20
    else if (wordCount >= 1000) score += 15
    else if (wordCount >= 500) score += 10
    
    // Keyword density (20 points)
    const keywordOccurrences = (text.match(new RegExp(keywordLower, 'g')) || []).length
    const density = wordCount > 0 ? (keywordOccurrences / wordCount) * 100 : 0
    if (density >= 1 && density <= 3) score += 20
    else if (density >= 0.5 && density <= 5) score += 15
    
    // Related keywords usage (20 points)
    const relatedUsed = keywordData.relatedKeywords.filter((kw: string) => 
      text.includes(kw.toLowerCase())
    ).length
    score += Math.min(relatedUsed * 4, 20)
    
    // Content structure (20 points)
    const hasHeadings = text.includes('#') || text.includes('<h')
    const hasLists = text.includes('-') || text.includes('*') || text.includes('<li')
    const hasStructure = hasHeadings && hasLists
    if (hasStructure) score += 20
    else if (hasHeadings || hasLists) score += 10
    
    return Math.min(score, 100)
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length
  }

  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200
    const wordCount = this.countWords(text)
    return Math.ceil(wordCount / wordsPerMinute)
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

  async saveBlogPost(content: GeneratedContent, authorId?: string): Promise<string> {
    const blogPost = await prisma.blogPost.create({
      data: {
        title: content.title,
        slug: content.slug,
        content: content.content,
        excerpt: content.excerpt,
        meta_title: content.metaTitle,
        meta_description: content.metaDescription,
        keywords: content.keywords,
        target_keywords: content.targetKeywords,
        word_count: content.wordCount,
        reading_time: content.readingTime,
        seo_score: content.seoScore,
        author_id: authorId,
        status: 'DRAFT'
      }
    })

    return blogPost.id
  }
}