/**
 * FAQ Article Generator API Endpoint
 * 
 * Demonstrates the enhanced AI content generation system with specialized FAQ format
 */

import { NextRequest, NextResponse } from 'next/server'
import { enhancedAIContentGenerator } from '@/lib/enhanced-ai-content-generator'
import { aiModelManager } from '@/lib/ai-model-manager'
import { createBlogPost, createSeoData } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimitWindow = 5 * 60 * 1000 // 5 minutes
    const maxRequests = 3

    const rateLimit = rateLimitMap.get(clientIP)
    if (rateLimit && rateLimit.resetTime > now) {
      if (rateLimit.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Try again in 5 minutes.' },
          { status: 429 }
        )
      }
      rateLimit.count++
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + rateLimitWindow })
    }

    // Parse request body
    const body = await request.json()
    const { 
      keyword, 
      category = 'Web Scraping',
      difficulty = 'intermediate',
      targetAudience = 'developers and businesses',
      autoPublish = false,
      modelPriority = 'quality'
    } = body

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    logger.info(`FAQ generation requested for keyword: ${keyword}`)

    // Check if enhanced AI is available
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Enhanced AI content generation not configured. Please set OPENROUTER_API_KEY environment variable.',
          fallback: 'Use template-based generation instead'
        },
        { status: 503 }
      )
    }

    const startTime = Date.now()

    // Create a trend object for FAQ generation
    const faqTrend = {
      keyword,
      trendScore: 0.8, // High score for manual generation
      searchVolume: 5000,
      sentiment: 'positive' as const,
      category,
      sourceUrls: [
        `https://search.venym.io/docs`,
        `https://developer.mozilla.org/en-US/docs/`,
        `https://stackoverflow.com/questions/tagged/${keyword.replace(/\s+/g, '+')}`
      ],
      priority: 85,
      contentFormat: 'faq-article' as const,
      competitorData: {
        topCompetitors: ['Scrapy', 'Beautiful Soup', 'Selenium', 'Puppeteer'],
        averageLength: 3500,
        commonTopics: ['implementation', 'best practices', 'troubleshooting', 'comparison'],
        gapAnalysis: [
          'Comprehensive FAQ coverage',
          'Venym Search API integration examples',
          'Real-world use case scenarios',
          'Performance optimization tips'
        ],
        insights: `FAQ content should cover ${keyword} comprehensively with practical examples using Venym Search APIs.`
      }
    }

    // Generate the FAQ content
    const content = await enhancedAIContentGenerator.generateContent(faqTrend)

    if (!content) {
      return NextResponse.json(
        { error: 'Content generation failed. Please try again.' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime

    // Auto-publish if requested
    let blogPost = null
    if (autoPublish) {
      blogPost = await createBlogPost({
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
        source_keywords: [keyword],
        target_keywords: content.keywords
      })

      if (blogPost) {
        // Create enhanced SEO data
        await createSeoData(blogPost.id, {
          canonical_url: `/blog/${blogPost.slug}`,
          og_title: content.metaTitle,
          og_description: content.metaDescription,
          twitter_title: content.metaTitle,
          twitter_description: content.metaDescription,
          focus_keyword: keyword,
          external_links: content.sources,
          schema_markup: JSON.stringify(content.schemaMarkup)
        })
      }
    }

    // Get model statistics
    const modelStats = aiModelManager.getModelStats()
    const costSummary = aiModelManager.getDailyCostSummary()

    logger.info(`FAQ generation completed for: ${keyword}`, {
      processingTime: `${processingTime}ms`,
      wordCount: content.wordCount,
      aiModel: content.aiModel,
      published: !!blogPost
    })

    return NextResponse.json({
      success: true,
      content: {
        title: content.title,
        excerpt: content.excerpt,
        wordCount: content.wordCount,
        format: content.format,
        aiModel: content.aiModel,
        keywords: content.keywords,
        tags: content.tags,
        internalLinks: content.internalLinks,
        schemaMarkup: content.schemaMarkup,
        // Include first 500 chars of content for preview
        contentPreview: content.content.substring(0, 500) + '...'
      },
      metadata: {
        processingTime: `${processingTime}ms`,
        published: !!blogPost,
        blogPostId: blogPost?.id,
        blogPostUrl: blogPost ? `/blog/${blogPost.slug}` : null
      },
      aiMetrics: {
        modelUsed: content.aiModel,
        dailyCostSummary: {
          totalCost: costSummary.totalCost,
          utilizationRate: Math.round(costSummary.utilizationRate * 100),
          modelsActive: Object.keys(modelStats).length
        }
      },
      // Full content only if not auto-published
      fullContent: autoPublish ? null : content.content
    })

  } catch (error) {
    logger.error('FAQ generation API error', error as Error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error during content generation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/enhanced-content/faq',
    description: 'Generate comprehensive FAQ articles using enhanced AI models',
    method: 'POST',
    parameters: {
      keyword: {
        type: 'string',
        required: true,
        description: 'The main topic/keyword for the FAQ article',
        example: 'web scraping best practices'
      },
      category: {
        type: 'string',
        required: false,
        default: 'Web Scraping',
        options: ['Web Scraping', 'API Development', 'Automation', 'Data Science', 'AI & ML', 'Tutorials', 'Industry News'],
        description: 'Content category for better targeting'
      },
      difficulty: {
        type: 'string',
        required: false,
        default: 'intermediate',
        options: ['beginner', 'intermediate', 'advanced'],
        description: 'Target difficulty level for the FAQ'
      },
      targetAudience: {
        type: 'string',
        required: false,
        default: 'developers and businesses',
        description: 'Primary audience for the content'
      },
      autoPublish: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether to automatically publish the generated content'
      },
      modelPriority: {
        type: 'string',
        required: false,
        default: 'quality',
        options: ['quality', 'speed', 'cost'],
        description: 'AI model selection priority'
      }
    },
    rateLimit: {
      requests: 3,
      window: '5 minutes'
    },
    example: {
      request: {
        keyword: 'Python web scraping tutorial',
        category: 'Tutorials',
        difficulty: 'beginner',
        targetAudience: 'Python developers',
        autoPublish: false,
        modelPriority: 'quality'
      },
      response: {
        success: true,
        content: {
          title: 'Python Web Scraping Tutorial: 50 Most Asked Questions Answered',
          excerpt: 'Comprehensive FAQ covering everything from basic concepts to advanced techniques...',
          wordCount: 4200,
          format: 'faq-article',
          aiModel: 'anthropic/claude-3-5-sonnet',
          keywords: ['python web scraping', 'beautifulsoup', 'requests', 'selenium'],
          tags: ['python', 'web-scraping', 'tutorial', 'faq']
        }
      }
    },
    requirements: {
      environment: ['OPENROUTER_API_KEY', 'BACKEND_API_URL'],
      optional: ['USE_ENHANCED_AI=true']
    }
  })
}