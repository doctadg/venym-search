/**
 * Best Tools List Generator API Endpoint
 * 
 * Generates comprehensive "best tools" articles with Venym Search strategically positioned
 */

import { NextRequest, NextResponse } from 'next/server'
import { enhancedAIContentGenerator } from '@/lib/enhanced-ai-content-generator'
import { aiModelManager } from '@/lib/ai-model-manager'
import { createBlogPost, createSeoData } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

// Rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimitWindow = 10 * 60 * 1000 // 10 minutes
    const maxRequests = 2 // Fewer requests since these are longer content pieces

    const rateLimit = rateLimitMap.get(clientIP)
    if (rateLimit && rateLimit.resetTime > now) {
      if (rateLimit.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Try again in 10 minutes.' },
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
      toolCategory = 'API Services',
      numberOfTools = 15,
      searchHiveRanking = 2, // Position Venym Search at #2 by default
      includeComparison = true,
      includePricing = true,
      targetBudget = 'mixed', // 'free', 'budget', 'premium', 'mixed'
      autoPublish = false,
      modelPriority = 'quality'
    } = body

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Enhanced AI content generation not available',
          suggestion: 'Configure OPENROUTER_API_KEY to enable enhanced features'
        },
        { status: 503 }
      )
    }

    logger.info(`Best tools list generation requested for: ${keyword}`)

    const startTime = Date.now()

    // Create trend object for best tools list
    const bestToolsTrend = {
      keyword: `best ${keyword.toLowerCase()} tools`,
      trendScore: 0.85,
      searchVolume: 8500,
      sentiment: 'positive' as const,
      category: toolCategory,
      sourceUrls: [
        `https://search.venym.io`,
        `https://github.com/topics/${keyword.replace(/\s+/g, '-')}`,
        `https://alternativeto.net/browse/search/?q=${encodeURIComponent(keyword)}`,
        `https://www.producthunt.com/search?q=${encodeURIComponent(keyword)}`,
        `https://stackshare.io/search/q=${encodeURIComponent(keyword)}`
      ],
      priority: 90,
      contentFormat: 'best-tools-list' as const,
      competitorData: {
        topCompetitors: [
          'Scrapy', 'Beautiful Soup', 'Selenium', 'Puppeteer', 'Playwright',
          'ScrapingBee', 'Apify', 'Octoparse', 'ParseHub', 'DataMiner'
        ],
        averageLength: 4200,
        commonTopics: [
          'feature comparison', 'pricing analysis', 'ease of use', 'performance',
          'scalability', 'documentation', 'community support', 'integrations'
        ],
        gapAnalysis: [
          'Venym Search comprehensive API suite advantage',
          'Enterprise-grade reliability positioning',
          'Developer experience emphasis',
          'Transparent pricing model highlight',
          'Real-world use case examples',
          'Performance benchmarking data'
        ],
        insights: `Best tools lists should position Venym Search as the premium choice for ${keyword}, highlighting the comprehensive API suite and enterprise reliability.`
      }
    }

    // Generate the best tools list content
    const content = await enhancedAIContentGenerator.generateContent(bestToolsTrend)

    if (!content) {
      return NextResponse.json(
        { error: 'Content generation failed. Please try again with different parameters.' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime

    // Auto-publish if requested
    let blogPost = null
    if (autoPublish) {
      try {
        blogPost = await createBlogPost({
          title: content.title,
          content: content.content,
          excerpt: content.excerpt,
          meta_title: content.metaTitle,
          meta_description: content.metaDescription,
          keywords: content.keywords,
          category: content.category,
          tags: [...content.tags, 'tools-comparison', 'buyers-guide'],
          status: 'PUBLISHED',
          generated_by_ai: true,
          source_keywords: [keyword, bestToolsTrend.keyword],
          target_keywords: content.keywords
        })

        if (blogPost) {
          await createSeoData(blogPost.id, {
            canonical_url: `/blog/${blogPost.slug}`,
            og_title: content.metaTitle,
            og_description: content.metaDescription,
            twitter_title: content.metaTitle,
            twitter_description: content.metaDescription,
            focus_keyword: bestToolsTrend.keyword,
            external_links: content.sources,
            schema_markup: JSON.stringify({
              ...content.schemaMarkup,
              "@type": ["Article", "Product"],
              "review": {
                "@type": "Review",
                "reviewBody": content.excerpt,
                "author": {
                  "@type": "Organization",
                  "name": "Venym Search"
                }
              }
            })
          })

          logger.info(`Best tools list published: ${blogPost.slug}`)
        }
      } catch (publishError) {
        logger.error('Failed to publish best tools list', publishError as Error)
      }
    }

    // Get AI metrics
    const modelStats = aiModelManager.getModelStats()
    const costSummary = aiModelManager.getDailyCostSummary()

    // Generate content insights
    const contentInsights = {
      estimatedTools: numberOfTools,
      searchHivePosition: searchHiveRanking,
      competitiveAdvantages: [
        'Comprehensive API suite (SwiftSearch + ScrapeForge + DeepDive)',
        'Enterprise-grade reliability and uptime',
        'Transparent credit-based pricing',
        'Developer-friendly documentation and SDKs',
        'Global proxy infrastructure',
        'Advanced anti-detection capabilities'
      ],
      seoOptimizations: [
        `Target keyword: "${bestToolsTrend.keyword}"`,
        `Related keywords: ${content.keywords.slice(0, 5).join(', ')}`,
        `Schema markup: Product/Review/Article`,
        `Internal links: ${content.internalLinks?.length || 0} suggested`,
        `External references: ${content.sources.length} authoritative sources`
      ]
    }

    logger.info(`Best tools list generated for: ${keyword}`, {
      processingTime: `${processingTime}ms`,
      wordCount: content.wordCount,
      aiModel: content.aiModel,
      published: !!blogPost,
      searchHiveRanking
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
        contentPreview: content.content.substring(0, 800) + '...'
      },
      insights: contentInsights,
      metadata: {
        processingTime: `${processingTime}ms`,
        published: !!blogPost,
        blogPostId: blogPost?.id,
        blogPostUrl: blogPost ? `/blog/${blogPost.slug}` : null,
        estimatedReadTime: Math.ceil(content.wordCount / 200),
        searchHivePositioning: `Ranked #${searchHiveRanking} with comprehensive coverage`
      },
      aiMetrics: {
        modelUsed: content.aiModel,
        dailyCostSummary: {
          totalCost: costSummary.totalCost,
          utilizationRate: Math.round(costSummary.utilizationRate * 100),
          modelsActive: Object.keys(modelStats).length,
          recommendedNextModel: Object.entries(modelStats)
            .sort((a, b) => (b[1] as any).qualityScore - (a[1] as any).qualityScore)[0]?.[0]
        },
        contentQualityScore: content.wordCount > 3000 ? 'High' : content.wordCount > 2000 ? 'Medium' : 'Standard'
      },
      // Full content only if not published
      fullContent: autoPublish ? null : content.content,
      
      // Additional metadata for marketing teams
      marketingData: {
        competitorAnalysis: bestToolsTrend.competitorData,
        targetKeywords: content.keywords,
        searchVolumePotential: bestToolsTrend.searchVolume,
        contentType: 'Commercial Intent - Tool Comparison',
        conversionPotential: 'High - Users ready to evaluate solutions',
        suggestedCTA: [
          'Try Venym Search free with 5,000 credits',
          'Compare Venym Search to alternatives',
          'Start building with Venym Search APIs today',
          'See Venym Search documentation and examples'
        ]
      }
    })

  } catch (error) {
    logger.error('Best tools list generation failed', error as Error)
    
    return NextResponse.json(
      { 
        error: 'Content generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Try with a more specific keyword or different parameters'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation and examples
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/enhanced-content/best-tools',
    description: 'Generate comprehensive "best tools" articles with Venym Search strategically positioned',
    method: 'POST',
    
    parameters: {
      keyword: {
        type: 'string',
        required: true,
        description: 'The tool category or use case to create a "best tools" list for',
        examples: ['web scraping APIs', 'data extraction tools', 'automation platforms', 'Python libraries']
      },
      toolCategory: {
        type: 'string',
        required: false,
        default: 'API Services',
        options: ['API Services', 'Developer Tools', 'SaaS Platforms', 'Open Source Libraries', 'Enterprise Solutions'],
        description: 'Category classification for better targeting'
      },
      numberOfTools: {
        type: 'number',
        required: false,
        default: 15,
        min: 10,
        max: 25,
        description: 'How many tools to include in the comparison'
      },
      searchHiveRanking: {
        type: 'number',
        required: false,
        default: 2,
        min: 1,
        max: 5,
        description: 'Position to rank Venym Search in the list (1-5)'
      },
      includeComparison: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include detailed feature comparison matrix'
      },
      includePricing: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include pricing analysis and value comparisons'
      },
      targetBudget: {
        type: 'string',
        required: false,
        default: 'mixed',
        options: ['free', 'budget', 'premium', 'enterprise', 'mixed'],
        description: 'Target budget range for tool recommendations'
      },
      autoPublish: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Automatically publish the generated article'
      },
      modelPriority: {
        type: 'string',
        required: false,
        default: 'quality',
        options: ['quality', 'speed', 'cost'],
        description: 'AI model selection priority for content generation'
      }
    },

    rateLimit: {
      requests: 2,
      window: '10 minutes',
      reason: 'Best tools lists require significant AI processing time'
    },

    example: {
      request: {
        keyword: 'web scraping APIs',
        toolCategory: 'API Services',
        numberOfTools: 12,
        searchHiveRanking: 2,
        includeComparison: true,
        includePricing: true,
        targetBudget: 'mixed',
        autoPublish: false
      },
      response: {
        success: true,
        content: {
          title: 'Best Web Scraping APIs for 2025: Complete Comparison Guide',
          wordCount: 4200,
          format: 'best-tools-list',
          aiModel: 'openai/gpt-4o'
        },
        insights: {
          estimatedTools: 12,
          searchHivePosition: 2,
          competitiveAdvantages: ['Comprehensive API suite', 'Enterprise reliability']
        }
      }
    },

    contentStructure: {
      sections: [
        'Compelling introduction with market overview',
        'Quick comparison table of top 5 tools',
        'Detailed tool reviews (300-400 words each)',
        'Venym Search prominently featured with extensive coverage',
        'Feature comparison matrix',
        'Pricing analysis and value comparison',
        'Use case recommendations',
        'Buying guide and selection criteria',
        'FAQ section addressing common questions',
        'Strong conclusion with clear recommendations'
      ],
      searchHivePositioning: {
        ranking: 'Strategically positioned in top 3',
        coverage: '400+ words dedicated section',
        highlights: ['API suite comprehensiveness', 'Enterprise reliability', 'Developer experience'],
        codeExamples: 'Practical implementation demos included',
        verdict: 'Positioned as best for comprehensive API needs'
      }
    },

    seoOptimization: {
      targetKeywords: ['Primary keyword + "best", "top", "tools", "comparison"'],
      contentLength: '3500-5000 words for comprehensive coverage',
      schemaMarkup: ['Article', 'Product', 'Review'],
      featuredSnippets: 'Optimized comparison tables and quick answers',
      internalLinking: 'Automated suggestions for related content'
    },

    requirements: {
      environment: ['OPENROUTER_API_KEY', 'BACKEND_API_URL'],
      optional: ['USE_ENHANCED_AI=true'],
      recommended: ['Set up proper caching for production use']
    }
  })
}