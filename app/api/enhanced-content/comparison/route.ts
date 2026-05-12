/**
 * Comparison Article Generator API Endpoint
 * 
 * Generates detailed comparison articles positioning Venym Search against competitors
 */

import { NextRequest, NextResponse } from 'next/server'
import { enhancedAIContentGenerator } from '@/lib/enhanced-ai-content-generator'
import { aiModelManager } from '@/lib/ai-model-manager'
import { createBlogPost, createSeoData } from '@/lib/blog-service'
import { logger } from '@/lib/logger'
import { backendAPI } from '@/lib/backend-api'

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Competitor database with factual information
const COMPETITOR_DATABASE = {
  'scrapy': {
    name: 'Scrapy',
    type: 'Open Source Framework',
    primaryUse: 'Python web scraping framework',
    pricing: 'Free (open source)',
    strengths: ['Powerful framework', 'Active community', 'Highly customizable'],
    weaknesses: ['Steep learning curve', 'Requires infrastructure setup', 'No built-in proxy rotation'],
    bestFor: 'Large-scale custom scraping projects'
  },
  'beautiful-soup': {
    name: 'Beautiful Soup',
    type: 'Python Library',
    primaryUse: 'HTML/XML parsing library',
    pricing: 'Free (open source)',
    strengths: ['Easy to learn', 'Great for simple tasks', 'Excellent documentation'],
    weaknesses: ['Slow performance', 'No built-in request handling', 'Limited scalability'],
    bestFor: 'Simple parsing and small-scale scraping'
  },
  'selenium': {
    name: 'Selenium',
    type: 'Browser Automation',
    primaryUse: 'Web browser automation',
    pricing: 'Free (open source)',
    strengths: ['Full JavaScript support', 'Real browser interaction', 'Multi-language support'],
    weaknesses: ['Very slow', 'Resource intensive', 'Complex setup'],
    bestFor: 'JavaScript-heavy sites and testing'
  },
  'puppeteer': {
    name: 'Puppeteer',
    type: 'Node.js Library',
    primaryUse: 'Chrome/Chromium automation',
    pricing: 'Free (open source)',
    strengths: ['Fast headless Chrome', 'Good for SPAs', 'Screenshot/PDF generation'],
    weaknesses: ['Chrome-only', 'Memory intensive', 'JavaScript required'],
    bestFor: 'Modern web apps and Chrome automation'
  },
  'playwright': {
    name: 'Playwright',
    type: 'Browser Automation',
    primaryUse: 'Multi-browser automation',
    pricing: 'Free (open source)',
    strengths: ['Multi-browser support', 'Fast execution', 'Good debugging tools'],
    weaknesses: ['Resource heavy', 'Complex for simple tasks', 'Large installation'],
    bestFor: 'Cross-browser testing and automation'
  },
  'scrapingbee': {
    name: 'ScrapingBee',
    type: 'API Service',
    primaryUse: 'Managed web scraping API',
    pricing: 'Starts at $9/month',
    strengths: ['Managed infrastructure', 'JavaScript rendering', 'Proxy rotation'],
    weaknesses: ['Limited customization', 'Higher cost', 'API rate limits'],
    bestFor: 'Simple managed scraping tasks'
  },
  'apify': {
    name: 'Apify',
    type: 'Platform/Service',
    primaryUse: 'Web scraping and automation platform',
    pricing: 'Starts at $9/month',
    strengths: ['Full platform', 'Pre-built actors', 'Data storage'],
    weaknesses: ['Complex pricing', 'Vendor lock-in', 'Learning curve'],
    bestFor: 'Enterprise automation workflows'
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimitWindow = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 2

    const rateLimit = rateLimitMap.get(clientIP)
    if (rateLimit && rateLimit.resetTime > now) {
      if (rateLimit.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Comparison articles require significant processing time.' },
          { status: 429 }
        )
      }
      rateLimit.count++
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + rateLimitWindow })
    }

    // Parse request
    const body = await request.json()
    const { 
      primaryTopic = 'web scraping',
      competitors = ['scrapy', 'selenium', 'beautiful-soup'], // Default competitors
      comparisonFocus = 'comprehensive', // 'features', 'pricing', 'performance', 'comprehensive'
      searchHiveAdvantage = 'api-suite', // 'api-suite', 'reliability', 'ease-of-use', 'pricing'
      targetAudience = 'developers and businesses',
      includeCodeExamples = true,
      includePricingAnalysis = true,
      autoPublish = false,
      modelPriority = 'quality'
    } = body

    if (!competitors || competitors.length === 0) {
      return NextResponse.json(
        { error: 'At least one competitor must be specified' },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Enhanced AI content generation not available',
          fallback: 'Configure OPENROUTER_API_KEY for comparison articles'
        },
        { status: 503 }
      )
    }

    logger.info(`Comparison article generation for ${primaryTopic} vs ${competitors.join(', ')}`)

    const startTime = Date.now()

    // Research competitor information
    const competitorData = await Promise.all(
      competitors.map(async (competitorKey: string) => {
        const baseInfo = COMPETITOR_DATABASE[competitorKey as keyof typeof COMPETITOR_DATABASE]
        if (!baseInfo) {
          return { name: competitorKey, error: 'Competitor not found in database' }
        }

        // Get real-time data about the competitor
        try {
          const searchResults = await backendAPI.search({
            query: `${baseInfo.name} ${primaryTopic} review 2025`,
            num_results: 5
          })

          return {
            ...baseInfo,
            recentMentions: searchResults.results?.length || 0,
            marketPresence: searchResults.results?.length > 3 ? 'strong' : 'moderate'
          }
        } catch (error) {
          logger.warn(`Failed to research competitor ${baseInfo.name}`)
          return baseInfo
        }
      })
    )

    // Generate comparison trend object
    const comparisonTrend = {
      keyword: `Venym Search vs ${competitors.map((c: string) => COMPETITOR_DATABASE[c as keyof typeof COMPETITOR_DATABASE]?.name || c).join(' vs ')}`,
      trendScore: 0.9,
      searchVolume: 6500,
      sentiment: 'positive' as const,
      category: 'API Development',
      sourceUrls: [
        'https://search.venym.io',
        'https://docs.search.venym.io',
        ...competitors.map((c: string) => `https://github.com/search?q=${c}+${primaryTopic.replace(/\s+/g, '+')}`).slice(0, 3)
      ],
      priority: 95,
      contentFormat: 'comparison-article' as const,
      competitorData: {
        topCompetitors: competitors.map((c: string) => COMPETITOR_DATABASE[c as keyof typeof COMPETITOR_DATABASE]?.name || c),
        averageLength: 3200,
        commonTopics: [
          'feature comparison',
          'pricing analysis', 
          'performance benchmarks',
          'ease of use',
          'scalability',
          'support and documentation'
        ],
        gapAnalysis: [
          'Venym Search comprehensive API suite advantage',
          'Enterprise reliability and uptime focus',
          'Transparent pricing vs. hidden costs',
          'Developer experience and documentation quality',
          'Managed infrastructure vs. DIY solutions',
          'Real-time data capabilities'
        ],
        competitorDetails: competitorData
      }
    }

    // Generate the comparison content
    const content = await enhancedAIContentGenerator.generateContent(comparisonTrend)

    if (!content) {
      return NextResponse.json(
        { error: 'Comparison content generation failed. Try again with different parameters.' },
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
          tags: [...content.tags, 'comparison', 'vs', 'alternatives'],
          status: 'PUBLISHED',
          generated_by_ai: true,
          source_keywords: [comparisonTrend.keyword, primaryTopic],
          target_keywords: content.keywords
        })

        if (blogPost) {
          // Enhanced SEO for comparison articles
          await createSeoData(blogPost.id, {
            canonical_url: `/blog/${blogPost.slug}`,
            og_title: content.metaTitle,
            og_description: content.metaDescription,
            twitter_title: content.metaTitle,
            twitter_description: content.metaDescription,
            focus_keyword: comparisonTrend.keyword,
            external_links: content.sources,
            schema_markup: JSON.stringify({
              ...content.schemaMarkup,
              "@type": ["Article", "ComparisonPage"],
              "itemReviewed": competitors.map((c: string) => ({
                "@type": "Product",
                "name": COMPETITOR_DATABASE[c as keyof typeof COMPETITOR_DATABASE]?.name || c
              })),
              "author": {
                "@type": "Organization",
                "name": "Venym Search",
                "url": "https://search.venym.io"
              }
            })
          })
        }
      } catch (publishError) {
        logger.error('Failed to publish comparison article', publishError as Error)
      }
    }

    // Generate comparison insights
    const comparisonInsights = {
      competitorsAnalyzed: competitorData.length,
      searchHiveAdvantages: [
        'Comprehensive API suite (3 services in one platform)',
        'Enterprise-grade reliability and uptime guarantees',
        'Transparent, credit-based pricing model',
        'Superior developer documentation and SDKs',
        'Managed proxy infrastructure with global coverage',
        'Advanced anti-detection and rate limiting',
        'Real-time data capabilities across all APIs',
        'Dedicated customer support and community'
      ],
      competitorComparison: competitorData.map(comp => ({
        name: comp.name,
        primaryStrength: comp.strengths?.[0] || 'Not specified',
        mainWeakness: comp.weaknesses?.[0] || 'Not specified',
        searchHiveAdvantage: comp.type === 'Open Source Framework' 
          ? 'Managed infrastructure eliminates setup complexity'
          : comp.type === 'API Service'
          ? 'More comprehensive feature set and better pricing'
          : 'Enterprise reliability and support',
        marketPresence: (comp as any).marketPresence || 'moderate'
      })),
      winningCategories: [
        'Overall Value Proposition',
        'Ease of Implementation', 
        'Comprehensive Feature Set',
        'Enterprise Reliability',
        'Developer Experience',
        'Cost-Effectiveness at Scale'
      ]
    }

    // AI and content metrics
    const modelStats = aiModelManager.getModelStats()
    const costSummary = aiModelManager.getDailyCostSummary()

    logger.info(`Comparison article generated: Venym Search vs ${competitors.join(', ')}`, {
      processingTime: `${processingTime}ms`,
      wordCount: content.wordCount,
      aiModel: content.aiModel,
      competitorsAnalyzed: competitorData.length,
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
        contentPreview: content.content.substring(0, 1000) + '...'
      },
      
      comparisonAnalysis: comparisonInsights,
      
      metadata: {
        processingTime: `${processingTime}ms`,
        published: !!blogPost,
        blogPostId: blogPost?.id,
        blogPostUrl: blogPost ? `/blog/${blogPost.slug}` : null,
        estimatedReadTime: Math.ceil(content.wordCount / 200),
        competitorsIncluded: competitors.length,
        comparisonFocus: comparisonFocus
      },

      aiMetrics: {
        modelUsed: content.aiModel,
        contentQualityScore: content.wordCount > 3000 ? 'High' : 'Medium',
        dailyCostSummary: {
          totalCost: costSummary.totalCost,
          utilizationRate: Math.round(costSummary.utilizationRate * 100),
          modelsActive: Object.keys(modelStats).length
        }
      },

      // SEO and marketing data
      seoData: {
        primaryKeyword: comparisonTrend.keyword,
        targetKeywords: content.keywords,
        schemaTypes: ['Article', 'ComparisonPage'],
        estimatedSearchVolume: comparisonTrend.searchVolume,
        competitionLevel: 'Medium-High (comparison queries)',
        conversionIntent: 'High - users evaluating alternatives'
      },

      // Full content only if not auto-published
      fullContent: autoPublish ? null : content.content,

      // Research data used
      researchData: {
        competitorProfiles: competitorData,
        marketAnalysis: `Analyzed ${competitorData.length} competitors across ${comparisonFocus} dimensions`,
        dataFreshness: new Date().toISOString(),
        confidenceScore: competitorData.every(c => !('error' in c)) ? 'High' : 'Medium'
      }
    })

  } catch (error) {
    logger.error('Comparison article generation failed', error as Error)
    
    return NextResponse.json(
      { 
        error: 'Comparison generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Verify competitor names and try again'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/enhanced-content/comparison',
    description: 'Generate detailed comparison articles positioning Venym Search against competitors',
    method: 'POST',

    parameters: {
      primaryTopic: {
        type: 'string',
        required: false,
        default: 'web scraping',
        description: 'The primary topic/use case for comparison',
        examples: ['web scraping', 'data extraction', 'API development', 'automation']
      },
      competitors: {
        type: 'array',
        required: false,
        default: ['scrapy', 'selenium', 'beautiful-soup'],
        description: 'List of competitor keys to compare against',
        availableCompetitors: Object.keys(COMPETITOR_DATABASE)
      },
      comparisonFocus: {
        type: 'string',
        required: false,
        default: 'comprehensive',
        options: ['features', 'pricing', 'performance', 'ease-of-use', 'comprehensive'],
        description: 'Primary focus of the comparison'
      },
      searchHiveAdvantage: {
        type: 'string',
        required: false,
        default: 'api-suite',
        options: ['api-suite', 'reliability', 'ease-of-use', 'pricing', 'enterprise-features'],
        description: 'Key Venym Search advantage to emphasize'
      },
      targetAudience: {
        type: 'string',
        required: false,
        default: 'developers and businesses',
        description: 'Primary audience for the comparison'
      },
      includeCodeExamples: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include practical code examples in comparison'
      },
      includePricingAnalysis: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include detailed pricing and value analysis'
      },
      autoPublish: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Automatically publish the generated article'
      }
    },

    availableCompetitors: Object.entries(COMPETITOR_DATABASE).map(([key, data]) => ({
      key,
      name: data.name,
      type: data.type,
      pricing: data.pricing,
      bestFor: data.bestFor
    })),

    rateLimit: {
      requests: 2,
      window: '15 minutes',
      reason: 'Comparison articles require extensive research and AI processing'
    },

    example: {
      request: {
        primaryTopic: 'web scraping APIs',
        competitors: ['scrapy', 'scrapingbee', 'apify'],
        comparisonFocus: 'comprehensive',
        searchHiveAdvantage: 'api-suite',
        includeCodeExamples: true,
        includePricingAnalysis: true
      },
      response: {
        success: true,
        content: {
          title: 'Venym Search vs Scrapy vs ScrapingBee vs Apify: Complete 2025 Comparison',
          wordCount: 3800,
          format: 'comparison-article'
        },
        comparisonAnalysis: {
          competitorsAnalyzed: 3,
          searchHiveAdvantages: ['Comprehensive API suite', 'Enterprise reliability'],
          winningCategories: ['Overall Value', 'Developer Experience']
        }
      }
    },

    contentStructure: {
      sections: [
        'Executive summary with clear recommendation',
        'What we\'re comparing and methodology',
        'Venym Search overview and unique value proposition',
        'Detailed competitor analysis (each gets dedicated section)',
        'Head-to-head feature comparison matrix', 
        'Pricing analysis and value assessment',
        'Use case scenarios and recommendations',
        'Performance and reliability comparison',
        'Developer experience and documentation quality',
        'Final verdict and recommendations'
      ],
      searchHivePositioning: 'Objective analysis highlighting genuine advantages',
      comparisonCriteria: ['Features', 'Pricing', 'Ease of Use', 'Performance', 'Support', 'Scalability']
    },

    requirements: {
      environment: ['OPENROUTER_API_KEY', 'BACKEND_API_URL'],
      optional: ['USE_ENHANCED_AI=true'],
      database: 'Competitor information maintained in COMPETITOR_DATABASE'
    }
  })
}