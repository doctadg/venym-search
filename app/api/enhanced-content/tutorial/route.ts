/**
 * Tutorial Guide Generator API Endpoint
 * 
 * Creates hands-on tutorials with Venym Search APIs as primary implementation examples
 */

import { NextRequest, NextResponse } from 'next/server'
import { enhancedAIContentGenerator } from '@/lib/enhanced-ai-content-generator'
import { aiModelManager } from '@/lib/ai-model-manager'
import { createBlogPost, createSeoData } from '@/lib/blog-service'
import { logger } from '@/lib/logger'

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Tutorial project templates
const TUTORIAL_TEMPLATES = {
  'web-scraping-basics': {
    title: 'Build Your First Web Scraper',
    description: 'Learn web scraping fundamentals by building a working scraper',
    estimatedTime: '45 minutes',
    difficulty: 'beginner',
    apis: ['Search', 'Scrape'],
    finalProject: 'A working web scraper that extracts product data'
  },
  'data-extraction-pipeline': {
    title: 'Create an Automated Data Extraction Pipeline', 
    description: 'Build an end-to-end data pipeline using Venym Search APIs',
    estimatedTime: '90 minutes',
    difficulty: 'intermediate',
    finalProject: 'Automated pipeline that monitors and extracts data'
  },
  'competitor-monitoring': {
    title: 'Build a Competitor Monitoring System',
    description: 'Monitor competitor prices and content automatically',
    estimatedTime: '60 minutes',
    difficulty: 'intermediate',
    apis: ['Search', 'Scrape'],
    finalProject: 'Automated competitor monitoring dashboard'
  },
  'research-automation': {
    title: 'Automate Market Research with APIs',
    description: 'Build a tool that automates market research and analysis',
    estimatedTime: '75 minutes',
    difficulty: 'advanced',
    finalProject: 'Market research automation tool with reporting'
  },
  'real-estate-scraper': {
    title: 'Build a Real Estate Data Scraper',
    description: 'Create a specialized scraper for real estate listings',
    estimatedTime: '50 minutes',
    difficulty: 'intermediate',
    apis: ['Scrape', 'Search'],
    finalProject: 'Real estate listing aggregator and analyzer'
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimitWindow = 12 * 60 * 1000 // 12 minutes
    const maxRequests = 2

    const rateLimit = rateLimitMap.get(clientIP)
    if (rateLimit && rateLimit.resetTime > now) {
      if (rateLimit.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Tutorial generation requires significant processing time.' },
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
      topic, // Main tutorial topic
      templateKey, // Optional: use predefined template
      difficulty = 'intermediate',
      programmingLanguage = 'Python',
      estimatedTime = '60 minutes',
      includeVideoScript = false,
      includeDeploymentGuide = true,
      targetAudience = 'developers',
      projectComplexity = 'medium', // 'simple', 'medium', 'complex'
      autoPublish = false,
      modelPriority = 'quality'
    } = body

    if (!topic && !templateKey) {
      return NextResponse.json(
        { error: 'Either topic or templateKey must be provided' },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Enhanced AI tutorial generation requires OpenRouter API key',
          documentation: 'Set OPENROUTER_API_KEY environment variable'
        },
        { status: 503 }
      )
    }

    logger.info(`Tutorial generation requested: ${topic || templateKey}`)

    const startTime = Date.now()

    // Use template or create custom tutorial
    let tutorialSpec
    if (templateKey && TUTORIAL_TEMPLATES[templateKey as keyof typeof TUTORIAL_TEMPLATES]) {
      tutorialSpec = TUTORIAL_TEMPLATES[templateKey as keyof typeof TUTORIAL_TEMPLATES]
      logger.info(`Using tutorial template: ${templateKey}`)
    } else {
      tutorialSpec = {
        title: `Build a ${topic} with Venym Search APIs`,
        description: `Learn how to implement ${topic} using Venym Search's comprehensive API suite`,
        estimatedTime,
        difficulty,
        apis: ['Search', 'Scrape'], // Default APIs
        finalProject: `Working ${topic} implementation`
      }
    }

    // Create tutorial trend object
    const tutorialTrend = {
      keyword: `how to ${topic || tutorialSpec.title.toLowerCase()}`,
      trendScore: 0.85,
      searchVolume: 7200,
      sentiment: 'positive' as const,
      category: 'Tutorials',
      sourceUrls: [
        'https://docs.search.venym.io',
        'https://github.com/VENYM_SEARCH/examples',
        `https://stackoverflow.com/questions/tagged/${(topic || 'web-scraping').replace(/\s+/g, '+')}`,
        'https://developer.mozilla.org/en-US/docs/',
        `https://docs.python.org/3/tutorial/` // Assuming Python for most tutorials
      ],
      priority: 88,
      contentFormat: 'tutorial-guide' as const,
      competitorData: {
        topCompetitors: ['Real Python', 'FreeCodeCamp', 'Towards Data Science', 'Dev.to'],
        averageLength: 4500,
        commonTopics: [
          'step-by-step instructions',
          'code examples',
          'error handling',
          'best practices',
          'project setup',
          'deployment guide'
        ],
        gapAnalysis: [
          'More comprehensive Venym Search API integration',
          'Complete working project with all code',
          'Production-ready implementation patterns',
          'Real-world error handling examples',
          'Performance optimization techniques',
          'Deployment and scaling considerations'
        ],
        insights: `Tutorial should provide complete hands-on learning experience using Venym Search APIs as the primary implementation tool, with downloadable code and practical exercises.`
      }
    }

    // Generate tutorial content
    const content = await enhancedAIContentGenerator.generateContent(tutorialTrend)

    if (!content) {
      return NextResponse.json(
        { error: 'Tutorial content generation failed. Please try different parameters.' },
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
          category: 'Tutorials',
          tags: [...content.tags, 'tutorial', 'hands-on', 'project', programmingLanguage.toLowerCase()],
          status: 'PUBLISHED',
          generated_by_ai: true,
          source_keywords: [tutorialTrend.keyword, topic || templateKey || 'tutorial'],
          target_keywords: content.keywords
        })

        if (blogPost) {
          await createSeoData(blogPost.id, {
            canonical_url: `/blog/${blogPost.slug}`,
            og_title: content.metaTitle,
            og_description: content.metaDescription,
            twitter_title: content.metaTitle,
            twitter_description: content.metaDescription,
            focus_keyword: tutorialTrend.keyword,
            external_links: content.sources,
            schema_markup: JSON.stringify({
              ...content.schemaMarkup,
              "@type": ["Article", "HowTo"],
              "totalTime": tutorialSpec.estimatedTime,
              "skill": tutorialSpec.difficulty,
              "supply": [
                "Venym Search API account",
                `${programmingLanguage} development environment`,
                "Text editor or IDE"
              ],
              "tool": tutorialSpec.apis.map(api => ({
                "@type": "HowToTool",
                "name": `Venym Search ${api} API`
              }))
            })
          })
        }
      } catch (publishError) {
        logger.error('Failed to publish tutorial', publishError as Error)
      }
    }

    // Generate tutorial insights
    const tutorialInsights = {
      projectSpecs: {
        title: tutorialSpec.title,
        difficulty: tutorialSpec.difficulty,
        estimatedTime: tutorialSpec.estimatedTime,
        programmingLanguage,
        apisUsed: tutorialSpec.apis,
        finalDeliverable: tutorialSpec.finalProject
      },
      learningObjectives: [
        `Understand ${topic || tutorialSpec.title.toLowerCase()} fundamentals`,
        'Implement Venym Search API authentication and setup',
        `Build a complete ${tutorialSpec.finalProject.toLowerCase()}`,
        'Handle errors and edge cases professionally',
        'Apply best practices for production code',
        'Deploy and scale the solution'
      ],
      codeFeatures: [
        'Complete working code examples',
        'Error handling and validation',
        'API rate limiting and optimization',
        'Configuration management',
        'Logging and debugging',
        'Production deployment ready'
      ],
      searchHiveIntegration: {
        apisHighlighted: tutorialSpec.apis,
        implementationApproach: 'Primary development tool throughout tutorial',
        codeExamples: 'Comprehensive examples for each API endpoint',
        bestPractices: 'Production-ready patterns and error handling',
        documentation: 'Links to relevant Venym Search documentation sections'
      }
    }

    // AI and performance metrics
    const modelStats = aiModelManager.getModelStats()
    const costSummary = aiModelManager.getDailyCostSummary()

    logger.info(`Tutorial generated: ${content.title}`, {
      processingTime: `${processingTime}ms`,
      wordCount: content.wordCount,
      aiModel: content.aiModel,
      difficulty: tutorialSpec.difficulty,
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
        estimatedReadTime: Math.ceil(content.wordCount / 200),
        contentPreview: content.content.substring(0, 1200) + '...'
      },

      tutorialDetails: tutorialInsights,

      metadata: {
        processingTime: `${processingTime}ms`,
        published: !!blogPost,
        blogPostId: blogPost?.id,
        blogPostUrl: blogPost ? `/blog/${blogPost.slug}` : null,
        template: templateKey || 'custom',
        programmingLanguage,
        projectComplexity
      },

      aiMetrics: {
        modelUsed: content.aiModel,
        contentQualityScore: content.wordCount > 4000 ? 'High' : content.wordCount > 3000 ? 'Medium' : 'Standard',
        dailyCostSummary: {
          totalCost: costSummary.totalCost,
          utilizationRate: Math.round(costSummary.utilizationRate * 100)
        }
      },

      // SEO and educational value
      educationalMetrics: {
        learningOutcome: tutorialSpec.finalProject,
        skillLevel: tutorialSpec.difficulty,
        practicalApplication: 'High - complete working project',
        codeQuality: 'Production-ready with error handling',
        searchHiveShowcase: 'Comprehensive API demonstration'
      },

      // Repository and resources
      resources: {
        suggestedRepo: `VENYM_SEARCH-${(topic || templateKey || 'tutorial').replace(/\s+/g, '-')}-tutorial`,
        starterFiles: [
          'main.py (or main.js)',
          'requirements.txt (or package.json)', 
          'config.py',
          'README.md',
          '.env.example'
        ],
        additionalResources: [
          'Venym Search API documentation links',
          'Related tutorial series',
          'Community discussion forum links',
          'Video walkthrough (if requested)'
        ]
      },

      // Full content only if not auto-published
      fullContent: autoPublish ? null : content.content,

      // Generated project structure
      projectStructure: {
        files: [
          {
            name: `main.${programmingLanguage === 'Python' ? 'py' : 'js'}`,
            description: 'Main application file with Venym Search API integration'
          },
          {
            name: programmingLanguage === 'Python' ? 'requirements.txt' : 'package.json',
            description: 'Project dependencies'
          },
          {
            name: 'config.py' || 'config.js',
            description: 'Configuration and API key management'
          },
          {
            name: 'README.md',
            description: 'Complete setup and usage instructions'
          }
        ],
        architecture: `Simple ${programmingLanguage} application using Venym Search APIs with modular structure for easy extension`
      }
    })

  } catch (error) {
    logger.error('Tutorial generation failed', error as Error)
    
    return NextResponse.json(
      { 
        error: 'Tutorial generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Try with a simpler topic or check your API configuration'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation and available templates
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/enhanced-content/tutorial',
    description: 'Generate comprehensive hands-on tutorials using Venym Search APIs as primary examples',
    method: 'POST',

    parameters: {
      topic: {
        type: 'string',
        required: 'conditional',
        description: 'Custom tutorial topic (required if templateKey not provided)',
        examples: ['price monitoring system', 'automated data collection', 'competitor analysis tool']
      },
      templateKey: {
        type: 'string',
        required: 'conditional',
        description: 'Predefined tutorial template (required if topic not provided)',
        options: Object.keys(TUTORIAL_TEMPLATES)
      },
      difficulty: {
        type: 'string',
        required: false,
        default: 'intermediate',
        options: ['beginner', 'intermediate', 'advanced'],
        description: 'Target skill level for the tutorial'
      },
      programmingLanguage: {
        type: 'string',
        required: false,
        default: 'Python',
        options: ['Python', 'JavaScript', 'Node.js', 'PHP', 'Go'],
        description: 'Primary programming language for examples'
      },
      estimatedTime: {
        type: 'string',
        required: false,
        default: '60 minutes',
        examples: ['30 minutes', '60 minutes', '90 minutes', '2 hours'],
        description: 'Estimated completion time'
      },
      includeVideoScript: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Include video walkthrough script'
      },
      includeDeploymentGuide: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include production deployment instructions'
      },
      projectComplexity: {
        type: 'string',
        required: false,
        default: 'medium',
        options: ['simple', 'medium', 'complex'],
        description: 'Complexity level of the final project'
      },
      autoPublish: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Automatically publish the generated tutorial'
      }
    },

    availableTemplates: Object.entries(TUTORIAL_TEMPLATES).map(([key, template]) => ({
      key,
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      estimatedTime: template.estimatedTime,
      apis: template.apis,
      finalProject: template.finalProject
    })),

    rateLimit: {
      requests: 2,
      window: '12 minutes',
      reason: 'Tutorial generation requires extensive AI processing and code example creation'
    },

    example: {
      request: {
        templateKey: 'web-scraping-basics',
        difficulty: 'beginner',
        programmingLanguage: 'Python',
        includeDeploymentGuide: true,
        autoPublish: false
      },
      response: {
        success: true,
        content: {
          title: 'Build Your First Web Scraper with Venym Search: Complete Tutorial',
          wordCount: 4200,
          format: 'tutorial-guide'
        },
        tutorialDetails: {
          projectSpecs: {
            title: 'Build Your First Web Scraper',
            difficulty: 'beginner',
            estimatedTime: '45 minutes'
          }
        }
      }
    },

    contentStructure: {
      sections: [
        'Project overview and what you\'ll build',
        'Prerequisites and environment setup',
        'Venym Search account setup and API key configuration',
        'Step 1: Basic setup and first API call',
        'Step 2: Core functionality implementation',
        'Step 3: Error handling and optimization',
        'Step 4: Advanced features and customization',
        'Step 5: Testing and debugging',
        'Deployment and production considerations',
        'Next steps and project enhancements',
        'Complete code repository and resources'
      ],
      codeStructure: 'Progressive complexity with checkpoints and validation',
      searchHiveIntegration: 'Primary implementation tool with comprehensive examples'
    },

    requirements: {
      environment: ['OPENROUTER_API_KEY', 'BACKEND_API_URL'],
      optional: ['USE_ENHANCED_AI=true']
    }
  })
}