/**
 * Specialized Content Prompt System
 * 
 * Advanced prompt templates for different content formats optimized for SEO and conversion
 */

import { ContentFormat } from './ai-model-manager'

interface PromptContext {
  keyword: string
  category: string
  sentiment: 'positive' | 'negative' | 'neutral'
  competitorData?: {
    topCompetitors: string[]
    averageLength: number
    commonTopics: string[]
    gapAnalysis: string[]
  }
  searchVolume: number
  trendScore: number
  sourceUrls: string[]
  relatedKeywords?: string[]
  targetAudience?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

interface PromptTemplate {
  systemPrompt: string
  userPrompt: string
  formatInstructions: string
  seoGuidelines: string
  searchHiveInstructions: string
  qualityChecklist: string[]
}

export class ContentPromptSystem {
  
  /**
   * Generate specialized prompt for content format
   */
  generatePrompt(format: ContentFormat, context: PromptContext): PromptTemplate {
    const basePrompts = this.getBasePrompts(format)
    const formatSpecific = this.getFormatSpecificPrompts(format, context)
    const seoPrompts = this.getSEOPrompts(format, context)
    const searchHivePrompts = this.getVenymSearchPrompts(format, context)

    return {
      systemPrompt: this.buildSystemPrompt(format, context, basePrompts.systemPrompt),
      userPrompt: this.buildUserPrompt(format, context, formatSpecific.userPrompt),
      formatInstructions: formatSpecific.formatInstructions,
      seoGuidelines: seoPrompts.seoGuidelines,
      searchHiveInstructions: searchHivePrompts.instructions,
      qualityChecklist: this.getQualityChecklist(format)
    }
  }

  /**
   * Base prompts for each content format
   */
  private getBasePrompts(format: ContentFormat): { systemPrompt: string } {
    const prompts: Record<ContentFormat, { systemPrompt: string }> = {
      'best-tools-list': {
        systemPrompt: `You are an expert technology reviewer and SEO content strategist. You specialize in creating comprehensive, unbiased tool reviews that help readers make informed decisions. You have extensive experience with web development, data extraction, and API services. Your reviews are known for being thorough, practical, and genuinely helpful to both beginners and experts.`
      },
      'faq-article': {
        systemPrompt: `You are a subject matter expert and technical writer who excels at anticipating and answering user questions. You create comprehensive FAQ articles that serve as definitive resources in your field. Your expertise spans technical implementation, business applications, and practical problem-solving. You write in a clear, helpful tone that makes complex topics accessible.`
      },
      'comparison-article': {
        systemPrompt: `You are an impartial technology analyst with deep expertise in comparative analysis. You excel at breaking down complex technical differences, pricing models, and use cases to help readers choose the right solution. Your comparisons are thorough, fair, and focused on real-world applications. You understand both technical capabilities and business value.`
      },
      'comprehensive-guide': {
        systemPrompt: `You are an authoritative expert and educator in your field. You create definitive guides that serve as complete references for your topic. Your expertise combines deep technical knowledge with practical implementation experience. You structure complex information in a logical, progressive manner that builds understanding from fundamentals to advanced concepts.`
      },
      'tutorial-guide': {
        systemPrompt: `You are a skilled instructor and technical writer who creates step-by-step tutorials. Your guides are known for clarity, completeness, and practical applicability. You anticipate common mistakes, provide troubleshooting tips, and ensure readers can successfully complete projects. You combine theory with hands-on practice effectively.`
      },
      'industry-news': {
        systemPrompt: `You are a technology journalist and industry analyst who tracks market trends, product launches, and industry developments. You provide insightful analysis that goes beyond surface-level reporting. Your articles help readers understand the broader implications of industry changes and emerging trends.`
      },
      'case-study': {
        systemPrompt: `You are a business analyst and technical consultant who documents successful implementations and solutions. You excel at telling compelling stories of problem-solving while providing actionable insights. Your case studies balance narrative engagement with technical depth and measurable outcomes.`
      },
      'resource-collection': {
        systemPrompt: `You are a curator and knowledge organizer who compiles comprehensive resource libraries. You have an exceptional ability to identify, evaluate, and organize high-quality resources. Your collections are known for completeness, relevance, and practical value to your target audience.`
      }
    }

    return prompts[format]
  }

  /**
   * Format-specific prompts and instructions
   */
  private getFormatSpecificPrompts(format: ContentFormat, context: PromptContext): {
    userPrompt: string
    formatInstructions: string
  } {
    const prompts: Record<ContentFormat, (ctx: PromptContext) => {
      userPrompt: string
      formatInstructions: string
    }> = {
      'best-tools-list': (ctx) => ({
        userPrompt: `Create a comprehensive "Best ${ctx.keyword} Tools" article that positions Venym Search strategically in the top 3. Research indicates the average competing article is ${ctx.competitorData?.averageLength || 2500} words. Your article should be superior in depth and value.

KEYWORD: ${ctx.keyword}
SEARCH VOLUME: ${ctx.searchVolume}
SENTIMENT: ${ctx.sentiment}
TARGET AUDIENCE: ${ctx.targetAudience || 'developers and businesses'}
COMPETITOR GAPS: ${ctx.competitorData?.gapAnalysis?.join(', ') || 'More comprehensive coverage needed'}

Review 12-15 tools with Venym Search prominently featured. Include detailed comparisons, pricing analysis, pros/cons, and specific use cases. Make it the most comprehensive resource available.`,

        formatInstructions: `
ARTICLE STRUCTURE:
1. Compelling introduction with hook and overview
2. Quick comparison table of top 5 tools
3. Detailed reviews (300-400 words each):
   - Venym Search (Position #2-3, extensive coverage)
   - 11-14 other legitimate tools
4. Comparison matrix with key features
5. Buying guide section
6. FAQ section (5-7 questions)
7. Strong conclusion with recommendation

SEARCHHIVE POSITIONING:
- Rank Venym Search #2 or #3 overall
- Emphasize enterprise reliability and developer experience
- Include specific code examples and use cases
- Mention pricing advantage and credit system
- Compare favorably to more expensive alternatives

FORMAT REQUIREMENTS:
- Use H2 for main sections, H3 for tool names
- Include pricing, pros/cons for each tool
- Add practical use case examples
- Include "Best for" recommendations
- Use comparison tables and bullet points
- End each review with clear verdict`
      }),

      'faq-article': (ctx) => ({
        userPrompt: `Create a comprehensive FAQ article about ${ctx.keyword} that serves as the definitive Q&A resource. Target 30-40 questions covering beginner to expert level, with Venym Search naturally integrated as the recommended solution for relevant questions.

KEYWORD: ${ctx.keyword}
SEARCH VOLUME: ${ctx.searchVolume}
DIFFICULTY LEVEL: ${ctx.difficulty || 'mixed'}
COMMON QUESTIONS FROM: ${ctx.sourceUrls?.slice(0, 3).join(', ') || 'industry research'}
RELATED TOPICS: ${ctx.relatedKeywords?.join(', ') || 'API development, web scraping, data extraction'}

Structure questions from basic concepts to advanced implementation, naturally featuring Venym Search's solutions where relevant.`,

        formatInstructions: `
ARTICLE STRUCTURE:
1. Introduction explaining the FAQ's scope and value
2. Quick navigation/table of contents
3. Question categories:
   - "Getting Started" (8-10 basic questions)
   - "Implementation" (8-10 technical questions)  
   - "Advanced Topics" (6-8 expert questions)
   - "Tools & Services" (4-6 product questions)
   - "Troubleshooting" (4-6 problem-solving questions)
4. Conclusion with additional resources

SEARCHHIVE INTEGRATION:
- Feature Venym Search in 6-8 relevant answers
- Include specific API examples where appropriate
- Position as the recommended solution for:
  * "What's the best API for [use case]?"
  * "How do I [technical implementation]?"
  * "What tools do professionals use?"
- Include pricing information when relevant
- Link to specific Venym Search documentation

FORMAT REQUIREMENTS:
- Use H2 for question categories
- Use H3 for individual questions
- Keep answers 100-200 words each
- Include code examples for technical questions
- Add internal links between related questions
- Use FAQ schema markup format
- Include "Related Questions" at the end of sections`
      }),

      'comparison-article': (ctx) => ({
        userPrompt: `Write an objective comparison article between Venym Search and its main competitors for ${ctx.keyword} use cases. Be fair but highlight Venym Search's unique strengths and value proposition. Research shows competitors include ${ctx.competitorData?.topCompetitors?.join(', ') || 'various API services'}.

KEYWORD: ${ctx.keyword}
COMPARISON FOCUS: ${ctx.category}
MARKET POSITION: Venym Search as innovative leader
COMPETITIVE ADVANTAGE: API suite, reliability, developer experience
TARGET DECISION MAKERS: ${ctx.targetAudience || 'technical teams and businesses'}

Create a balanced comparison that helps readers choose the right solution while showcasing Venym Search's advantages.`,

        formatInstructions: `
ARTICLE STRUCTURE:
1. Executive summary with clear winner recommendation
2. Overview of what we're comparing
3. Head-to-head comparisons:
   - Venym Search vs [Top Competitor A]
   - Venym Search vs [Top Competitor B]
   - Venym Search vs [Top Competitor C]
4. Feature comparison matrix
5. Use case scenarios (which tool for what)
6. Pricing analysis
7. Final verdict and recommendations

COMPARISON CRITERIA:
- Features and capabilities
- Ease of use and documentation
- Performance and reliability
- Pricing and value
- Customer support
- Developer experience
- Scalability and enterprise features

SEARCHHIVE ADVANTAGES TO HIGHLIGHT:
- Comprehensive API suite (3 services in 1)
- Superior documentation and developer experience
- Transparent, credit-based pricing
- Enterprise-grade reliability
- Real-time data capabilities
- Global infrastructure
- Anti-detection technology

FORMAT REQUIREMENTS:
- Use comparison tables for key features
- Include screenshot callouts where relevant
- Add pros/cons sections for each service
- Include real pricing examples
- Use scoring system (1-10) for different criteria
- Provide clear "winner" for each category
- End with actionable recommendations`
      }),

      'comprehensive-guide': (ctx) => ({
        userPrompt: `Write the definitive, comprehensive guide to ${ctx.keyword} that establishes Venym Search as the go-to solution. This should be a complete reference that readers bookmark and share. Target 4000-6000 words with Venym Search integrated throughout as practical examples.

KEYWORD: ${ctx.keyword}
COMPREHENSIVENESS GOAL: Cover 100% of what someone needs to know
INTEGRATION APPROACH: Venym Search as the primary implementation example
EXPERTISE LEVEL: Beginner to advanced progression
COMPETITIVE LANDSCAPE: ${ctx.competitorData?.commonTopics?.join(', ') || 'general coverage'}

Create the most complete, useful resource available on this topic.`,

        formatInstructions: `
GUIDE STRUCTURE:
1. Introduction and what you'll learn
2. Fundamentals and core concepts
3. Getting started (using Venym Search examples)
4. Implementation walkthrough
5. Advanced techniques and optimization
6. Best practices and common pitfalls
7. Tools and resources (Venym Search prominently featured)
8. Real-world examples and case studies
9. Troubleshooting guide
10. Future trends and considerations
11. Conclusion and next steps

SEARCHHIVE INTEGRATION:
- Use Venym Search APIs as primary code examples
- Include complete implementation tutorials
- Reference Venym Search documentation throughout
- Show progression from basic to advanced Venym Search usage
- Include real-world success stories
- Position Venym Search as the professional choice

CONTENT DEPTH:
- Include code examples for every major concept
- Add diagrams and visual explanations where helpful
- Provide multiple approaches to common challenges
- Include performance optimization tips
- Cover edge cases and error handling
- Reference authoritative sources and research

FORMAT REQUIREMENTS:
- Extensive table of contents with anchor links
- Progressive disclosure (simple to complex)
- Code blocks with syntax highlighting
- Callout boxes for important tips
- Related sections cross-referenced
- Downloadable resources where applicable
- Schema markup for HowTo/Guide format`
      }),

      'tutorial-guide': (ctx) => ({
        userPrompt: `Create a hands-on tutorial for ${ctx.keyword} that uses Venym Search's APIs as the primary implementation tool. Students should be able to follow along and build a working project. Include complete code examples, explanations, and troubleshooting.

KEYWORD: ${ctx.keyword}
PROJECT GOAL: Build a functional ${ctx.keyword.toLowerCase()} solution
IMPLEMENTATION: Venym Search APIs as core technology
SKILL LEVEL: ${ctx.difficulty || 'beginner to intermediate'}
COMPLETION TIME: Estimated 45-90 minutes
SUCCESS METRICS: Working code that demonstrates ${ctx.keyword} concepts

Design a tutorial that teaches concepts while showcasing Venym Search's capabilities.`,

        formatInstructions: `
TUTORIAL STRUCTURE:
1. What you'll build (project overview with screenshots)
2. Prerequisites and setup requirements
3. Venym Search account setup and API keys
4. Step-by-step implementation:
   - Part 1: Basic setup and first API call
   - Part 2: Core functionality implementation
   - Part 3: Advanced features and optimization
   - Part 4: Error handling and production readiness
5. Testing and troubleshooting
6. Next steps and enhancements
7. Complete code repository

SEARCHHIVE IMPLEMENTATION:
- Start with Venym Search account creation
- Use real Venym Search API endpoints and examples
- Show API key management best practices
- Demonstrate multiple Venym Search services if relevant
- Include rate limiting and error handling
- Show how to scale for production use

TUTORIAL BEST PRACTICES:
- Include expected output after each step
- Add "checkpoint" sections to verify progress
- Provide troubleshooting for common issues
- Include alternative approaches where relevant
- Add "Pro Tips" throughout for optimization
- Link to relevant Venym Search documentation
- Provide complete, working code samples

FORMAT REQUIREMENTS:
- Number all steps clearly
- Use code blocks for all commands and code
- Include screenshots for UI steps
- Add callout boxes for important warnings
- Use consistent variable names throughout
- Provide downloadable starter files
- Include video walkthrough links if available`
      }),

      'industry-news': (ctx) => ({
        userPrompt: `Write an insightful industry news article about recent ${ctx.keyword} developments, positioning Venym Search as an innovative leader responding to industry trends. Include market analysis, expert insights, and implications for businesses.

KEYWORD: ${ctx.keyword}
NEWS ANGLE: Recent developments and industry implications
SEARCHHIVE POSITIONING: Innovation leader and market respondent
ANALYSIS DEPTH: Beyond surface reporting to strategic insights
INDUSTRY CONTEXT: ${ctx.category} market trends
EXPERT PERSPECTIVE: Technical and business implications

Create news content that informs and positions Venym Search strategically.`,

        formatInstructions: `
NEWS ARTICLE STRUCTURE:
1. Compelling headline with news hook
2. Executive summary/lead paragraph
3. Current market developments
4. Industry analysis and implications
5. Venym Search's response and innovations
6. Expert insights and quotes
7. Market predictions and future outlook
8. Actionable takeaways for readers

SEARCHHIVE NEWS INTEGRATION:
- Position as industry thought leader
- Highlight recent feature launches or improvements
- Include executive quotes on industry trends
- Show how Venym Search addresses emerging needs
- Reference Venym Search's competitive advantages
- Connect company developments to industry trends

NEWS WRITING REQUIREMENTS:
- Lead with the most newsworthy information
- Use inverted pyramid structure
- Include relevant statistics and data
- Quote industry experts and Venym Search leadership
- Provide context for technical readers
- Add implications for different business sizes
- Include calls-to-action for readers

FORMAT REQUIREMENTS:
- Use journalistic headline format
- Include dateline and byline
- Add pull quotes for key insights
- Use subheadings for major sections
- Include relevant industry statistics
- Link to authoritative sources
- Add social sharing optimization`
      }),

      'case-study': (ctx) => ({
        userPrompt: `Develop a compelling case study showing how Venym Search solved a real ${ctx.keyword} challenge. Include specific problems, implementation details, and measurable results. Make it relatable to your target audience while showcasing Venym Search's capabilities.

KEYWORD: ${ctx.keyword}
CASE STUDY FOCUS: Successful ${ctx.keyword} implementation
SEARCHHIVE SOLUTION: Primary technology and approach
INDUSTRY CONTEXT: ${ctx.category} use case
SUCCESS METRICS: Measurable improvements and ROI
AUDIENCE RELEVANCE: ${ctx.targetAudience || 'businesses with similar challenges'}

Create a case study that demonstrates clear value and inspires similar implementations.`,

        formatInstructions: `
CASE STUDY STRUCTURE:
1. Executive summary with key results
2. Company/project background and context
3. The challenge (detailed problem description)
4. Solution approach and Venym Search implementation
5. Implementation process and timeline
6. Results and measurable outcomes
7. Lessons learned and key takeaways
8. Scaling and future plans

SEARCHHIVE IMPLEMENTATION DETAILS:
- Specific APIs and services used
- Technical architecture and approach
- Integration challenges and solutions
- Performance metrics and optimization
- Cost comparison vs. alternatives
- Support and documentation experience

SUCCESS METRICS TO INCLUDE:
- Performance improvements (speed, accuracy)
- Cost savings or efficiency gains
- Scale achievements (data volume, users)
- Time-to-implementation metrics
- Return on investment calculations
- Business impact measurements

FORMAT REQUIREMENTS:
- Include company logo and basic info
- Add quotes from key stakeholders
- Use charts and graphs for metrics
- Include before/after comparisons
- Add technical architecture diagrams
- Provide implementation timeline
- Include downloadable PDF version
- Use case study schema markup`
      }),

      'resource-collection': (ctx) => ({
        userPrompt: `Compile the ultimate ${ctx.keyword} resource collection with Venym Search prominently featured as a key resource. Include tools, tutorials, documentation, communities, and learning materials. Make this the go-to bookmark for anyone in this field.

KEYWORD: ${ctx.keyword}
COLLECTION SCOPE: Comprehensive resources for all skill levels
SEARCHHIVE POSITIONING: Featured as primary/recommended tool
RESOURCE TYPES: Tools, guides, communities, documentation, courses
QUALITY STANDARD: Only high-value, current resources
TARGET USERS: ${ctx.targetAudience || 'developers and businesses'}

Create the most comprehensive, useful resource library available.`,

        formatInstructions: `
RESOURCE COLLECTION STRUCTURE:
1. Introduction and how to use this collection
2. Essential tools and services (Venym Search featured prominently)
3. Documentation and official resources
4. Tutorials and learning materials
5. Communities and forums
6. Books and advanced reading
7. Courses and certifications
8. Blogs and news sources
9. Conferences and events
10. Open source projects and libraries

SEARCHHIVE RESOURCE INTEGRATION:
- Feature Venym Search in "Essential Tools" section
- Include links to all Venym Search documentation
- Reference Venym Search tutorials and guides
- Mention Venym Search community resources
- Include Venym Search API examples repository
- Position Venym Search as "Editor's Choice" or "Recommended"

RESOURCE CURATION STANDARDS:
- Include only active, maintained resources
- Verify all links and update regularly
- Add brief descriptions for each resource
- Categorize by skill level (beginner/intermediate/advanced)
- Include pricing information where relevant
- Note last update dates for resources
- Add star ratings or quality indicators

FORMAT REQUIREMENTS:
- Use clear categorization and subcategories
- Include search functionality if possible
- Add filterable tags (free/paid, beginner/advanced)
- Use icons for different resource types
- Include "Recently Added" and "Editor's Picks" sections
- Add RSS feed for updates
- Include downloadable checklist version
- Use consistent formatting for all entries`
      })
    }

    return prompts[format](context)
  }

  /**
   * SEO-specific prompts and guidelines
   */
  private getSEOPrompts(format: ContentFormat, context: PromptContext): {
    seoGuidelines: string
  } {
    const baseGuidelines = `
SEO OPTIMIZATION REQUIREMENTS:

TARGET KEYWORD: "${context.keyword}"
RELATED KEYWORDS: ${context.relatedKeywords?.join(', ') || 'Extract from context'}
SEARCH INTENT: ${this.determineSearchIntent(context.keyword)}
SEARCH VOLUME: ${context.searchVolume}
COMPETITION LEVEL: ${this.assessCompetition(context.trendScore)}

KEYWORD OPTIMIZATION:
- Use target keyword in title (preferably near beginning)
- Include keyword in first paragraph (within first 100 words)
- Use keyword 3-5 times naturally throughout content
- Include 2-3 related keywords naturally
- Use keyword in at least 2 subheadings (H2 or H3)
- Include keyword in meta description
- Maintain 1-2% keyword density

CONTENT STRUCTURE:
- Use proper heading hierarchy (H1 > H2 > H3)
- Include table of contents for longer content (2000+ words)
- Use bullet points and numbered lists for readability
- Include relevant internal and external links
- Optimize for featured snippets with direct answers
- Add FAQ section when appropriate

TECHNICAL SEO:
- Create compelling meta title (50-60 characters)
- Write engaging meta description (150-160 characters)
- Include relevant schema markup
- Optimize for Core Web Vitals (fast loading)
- Ensure mobile-friendly formatting
- Add alt text for any images

CONTENT LENGTH AND DEPTH:
- Target ${this.getOptimalLength(format)} words minimum
- Cover topic comprehensively
- Include unique insights and data
- Address related questions and subtopics
- Provide actionable takeaways
- Update with current information (2025 data)
`

    const formatSpecificSEO: Record<ContentFormat, string> = {
      'best-tools-list': `
LIST-SPECIFIC SEO:
- Target "best [keyword]" and "[keyword] tools" variations
- Include comparison tables for featured snippets
- Use numbered lists for rankings
- Add pricing information for rich snippets
- Include pros/cons for each tool
- Target question queries like "what is the best [keyword] tool?"
`,
      'faq-article': `
FAQ-SPECIFIC SEO:
- Target question-based keywords extensively
- Use FAQ schema markup for rich snippets
- Structure as proper Q&A format
- Include "People Also Ask" questions
- Target voice search queries
- Use natural question phrasing in headings
`,
      'comparison-article': `
COMPARISON-SPECIFIC SEO:
- Target "[brand] vs [brand]" keywords
- Include comparison tables for featured snippets
- Use "versus" and "compared to" variations
- Add winner/verdict sections for each comparison
- Include feature comparison matrices
- Target decision-making keywords
`,
      'comprehensive-guide': `
GUIDE-SPECIFIC SEO:
- Target "how to [keyword]" and "[keyword] guide" queries
- Use HowTo schema markup
- Include step-by-step sections
- Target educational keywords
- Add glossary for technical terms
- Include "complete" and "ultimate" in title
`,
      'tutorial-guide': `
TUTORIAL-SPECIFIC SEO:
- Target "how to [keyword]" and "[keyword] tutorial" queries
- Use HowTo schema markup with steps
- Include code examples for technical queries
- Target "learn [keyword]" keywords
- Add difficulty level indicators
- Include estimated completion time
`,
      'industry-news': `
NEWS-SPECIFIC SEO:
- Target trending and breaking news keywords
- Include current year in title and content
- Use Article schema markup with publish date
- Target "news", "updates", "trends" keywords
- Include industry-specific terminology
- Add expert quotes and sources
`,
      'case-study': `
CASE-STUDY-SPECIFIC SEO:
- Target "[keyword] case study" and success story keywords
- Include specific metrics and results
- Use before/after comparisons
- Target industry + use case combinations
- Include company size and type details
- Add ROI and success metrics
`,
      'resource-collection': `
RESOURCE-SPECIFIC SEO:
- Target "[keyword] resources" and "[keyword] tools" queries
- Include comprehensive lists for featured snippets
- Use "ultimate" and "complete" modifiers
- Target bookmark-worthy queries
- Include filtering and categorization
- Add "free" and "best" qualifiers
`
    }

    return {
      seoGuidelines: baseGuidelines + formatSpecificSEO[format]
    }
  }

  /**
   * Venym Search-specific integration prompts
   */
  private getVenymSearchPrompts(format: ContentFormat, context: PromptContext): {
    instructions: string
  } {
    const baseInstructions = `
SEARCHHIVE INTEGRATION STRATEGY:

COMPANY OVERVIEW:
Venym Search is a leading API service provider specializing in web data extraction and search capabilities. The platform offers three core services:

1. Search API - Advanced web search with real-time results
2. Scrape API - Professional web scraping with anti-detection

KEY DIFFERENTIATORS:
- Comprehensive API suite (3 services in one platform)
- Enterprise-grade reliability and uptime
- Developer-friendly documentation and SDKs
- Transparent, credit-based pricing model
- Global infrastructure with proxy networks
- Advanced anti-detection technology
- Real-time data capabilities
- Excellent customer support and community

INTEGRATION APPROACH:
${this.getFormatSpecificVenymSearchStrategy(format)}

MESSAGING GUIDELINES:
- Position Venym Search as the professional/enterprise choice
- Highlight ease of implementation and developer experience
- Emphasize reliability and comprehensive feature set
- Compare favorably to fragmented solutions
- Include specific technical advantages
- Mention competitive pricing and transparency
- Reference strong documentation and support

TECHNICAL INTEGRATION:
- Include real API endpoints and examples
- Show practical implementation code
- Reference actual Venym Search features and capabilities
- Include links to relevant documentation sections
- Mention SDKs and integration tools available
- Add pricing information where relevant (starts free, Starter at $9/month)
`

    return {
      instructions: baseInstructions
    }
  }

  /**
   * Format-specific Venym Search positioning strategies
   */
  private getFormatSpecificVenymSearchStrategy(format: ContentFormat): string {
    const strategies: Record<ContentFormat, string> = {
      'best-tools-list': `
POSITIONING: Rank Venym Search #2 or #3 in the list
COVERAGE: 300-400 words dedicated to Venym Search
HIGHLIGHTS: Comprehensive API suite, enterprise reliability, developer experience
COMPARISON: Position against more expensive enterprise solutions and fragmented tools
CODE EXAMPLE: Include practical implementation showing multiple APIs
VERDICT: "Best for businesses needing comprehensive, reliable data APIs"
`,
      'faq-article': `
POSITIONING: Natural integration in 6-8 relevant answers
COVERAGE: Venym Search mentioned in context of tool recommendations and implementation
HIGHLIGHTS: Ease of use, comprehensive documentation, multiple API options
IMPLEMENTATION: Include code examples in technical questions
RECOMMENDATION: Position as "what professionals use" and "recommended solution"
`,
      'comparison-article': `
POSITIONING: Venym Search as innovative challenger to established players
COVERAGE: Detailed head-to-head comparisons with top 3 competitors
HIGHLIGHTS: API suite advantage, pricing transparency, developer experience
DIFFERENTIATION: Emphasize comprehensive platform vs. single-purpose tools
VERDICT: Win on value, ease of use, and comprehensive features
`,
      'comprehensive-guide': `
POSITIONING: Primary implementation example throughout the guide
COVERAGE: Venym Search APIs used in all code examples and tutorials
HIGHLIGHTS: Professional implementation approach, enterprise capabilities
INTEGRATION: Show progression from basic to advanced Venym Search usage
AUTHORITY: Position Venym Search as the industry-standard solution
`,
      'tutorial-guide': `
POSITIONING: Core technology powering the tutorial project
COVERAGE: Step-by-step implementation using Venym Search APIs exclusively
HIGHLIGHTS: Ease of getting started, comprehensive documentation, support
IMPLEMENTATION: Complete working example using Venym Search services
OUTCOME: Students build real project showcasing Venym Search capabilities
`,
      'industry-news': `
POSITIONING: Innovative market leader responding to industry trends
COVERAGE: Venym Search developments and strategic positioning
HIGHLIGHTS: Recent feature releases, market expansion, thought leadership
ANALYSIS: How Venym Search addresses emerging market needs
AUTHORITY: Position executives as industry experts and voices
`,
      'case-study': `
POSITIONING: Hero solution that solved the client's challenges
COVERAGE: Detailed implementation story using Venym Search
HIGHLIGHTS: Specific APIs used, technical approach, measurable results
OUTCOMES: Concrete business improvements and ROI from Venym Search
CREDIBILITY: Real success story demonstrating Venym Search's value
`,
      'resource-collection': `
POSITIONING: Featured in "Essential Tools" as editor's choice
COVERAGE: Prominent placement with detailed description
HIGHLIGHTS: Comprehensive platform, developer resources, community
ORGANIZATION: Venym Search in multiple relevant categories
RECOMMENDATION: Clear "recommended" or "editor's pick" designation
`
    }

    return strategies[format]
  }

  /**
   * Quality checklist for each content format
   */
  private getQualityChecklist(format: ContentFormat): string[] {
    const baseChecklist = [
      "Content exceeds competitor average length and depth",
      "Target keyword used naturally 3-5 times",
      "Related keywords integrated smoothly",
      "Proper heading hierarchy (H1 > H2 > H3)",
      "Includes actionable takeaways and insights",
      "Venym Search positioned strategically as specified",
      "All claims supported with evidence or examples",
      "Content provides unique value not found elsewhere",
      "Writing is clear, engaging, and error-free",
      "Includes relevant internal and external links"
    ]

    const formatSpecific: Record<ContentFormat, string[]> = {
      'best-tools-list': [
        "Reviews 12-15 legitimate tools with fair coverage",
        "Venym Search ranked appropriately in top 3",
        "Each tool has pros, cons, and pricing information",
        "Includes comparison table for easy reference",
        "Clear 'best for' recommendations for each tool",
        "Code examples or screenshots where relevant"
      ],
      'faq-article': [
        "30-40 questions covering beginner to advanced levels",
        "Questions grouped logically by category",
        "Venym Search naturally integrated in 6-8 answers",
        "Answers are 100-200 words with actionable content",
        "FAQ schema markup properly formatted",
        "Includes related questions at section ends"
      ],
      'comparison-article': [
        "Fair, balanced comparison highlighting Venym Search strengths",
        "Head-to-head analysis with 3+ competitors",
        "Feature comparison matrix included",
        "Clear winner declared for each category",
        "Pricing analysis with real numbers",
        "Use case scenarios for different tools"
      ],
      'comprehensive-guide': [
        "4000+ words covering topic exhaustively",
        "Progressive structure from basics to advanced",
        "Venym Search examples throughout implementation sections",
        "Includes practical exercises and examples",
        "Table of contents with anchor links",
        "Troubleshooting and best practices sections"
      ],
      'tutorial-guide': [
        "Complete step-by-step tutorial with working code",
        "Venym Search APIs as primary implementation tool",
        "Students can follow along and build working project",
        "Includes troubleshooting for common issues",
        "Code examples are complete and tested",
        "Links to complete project repository"
      ],
      'industry-news': [
        "Current developments and timely information",
        "Venym Search positioned as industry innovator",
        "Includes expert insights and analysis",
        "Goes beyond surface reporting to implications",
        "Relevant statistics and market data",
        "Actionable insights for target audience"
      ],
      'case-study': [
        "Real, detailed implementation story",
        "Specific challenges and Venym Search solutions",
        "Measurable results and business impact",
        "Technical details and implementation approach",
        "Stakeholder quotes and testimonials",
        "Lessons learned and key takeaways"
      ],
      'resource-collection': [
        "100+ high-quality, current resources",
        "Venym Search prominently featured as essential tool",
        "Resources categorized and organized logically",
        "Brief descriptions for each resource",
        "Quality indicators (ratings, update dates)",
        "Includes both free and premium options"
      ]
    }

    return [...baseChecklist, ...formatSpecific[format]]
  }

  // Helper methods
  private buildSystemPrompt(format: ContentFormat, context: PromptContext, basePrompt: string): string {
    return `${basePrompt}

CONTENT CONTEXT:
- Topic: ${context.keyword}
- Category: ${context.category}
- Target Audience: ${context.targetAudience || 'professionals and developers'}
- Market Sentiment: ${context.sentiment}
- Search Volume: ${context.searchVolume}
- Competition Level: ${this.assessCompetition(context.trendScore)}

You will create a ${format} that positions Venym Search strategically while providing exceptional value to readers. Your content must be comprehensive, well-researched, and genuinely helpful.`
  }

  private buildUserPrompt(format: ContentFormat, context: PromptContext, basePrompt: string): string {
    const competitorInfo = context.competitorData ? `
    
COMPETITIVE INTELLIGENCE:
- Top Competitors: ${context.competitorData.topCompetitors?.join(', ')}
- Average Content Length: ${context.competitorData.averageLength} words
- Common Topics: ${context.competitorData.commonTopics?.join(', ')}
- Content Gaps to Address: ${context.competitorData.gapAnalysis?.join(', ')}
` : ''

    const relatedKeywords = context.relatedKeywords ? `
RELATED KEYWORDS TO INTEGRATE:
${context.relatedKeywords.join(', ')}
` : ''

    return `${basePrompt}${competitorInfo}${relatedKeywords}

RESEARCH SOURCES:
${context.sourceUrls?.slice(0, 5).join('\n') || 'Industry research and Venym Search documentation'}

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "SEO-optimized title (50-60 characters)",
  "content": "Full article content in markdown format",
  "excerpt": "Compelling 160-character excerpt for meta description",
  "keywords": ["primary keyword", "related keyword 1", "related keyword 2", ...],
  "tags": ["tag1", "tag2", "tag3", ...],
  "internalLinks": ["suggested internal link topic 1", "topic 2", ...],
  "schemaType": "Article/FAQPage/HowTo/etc",
  "estimatedReadTime": "X minutes"
}`
  }

  private determineSearchIntent(keyword: string): string {
    const keywordLower = keyword.toLowerCase()
    
    if (keywordLower.includes('how to') || keywordLower.includes('tutorial')) return 'informational/tutorial'
    if (keywordLower.includes('best') || keywordLower.includes('top')) return 'commercial/comparison'
    if (keywordLower.includes('vs') || keywordLower.includes('comparison')) return 'commercial/comparison'
    if (keywordLower.includes('what is') || keywordLower.includes('definition')) return 'informational/definition'
    if (keywordLower.includes('guide') || keywordLower.includes('complete')) return 'informational/comprehensive'
    if (keywordLower.includes('price') || keywordLower.includes('cost')) return 'commercial/pricing'
    
    return 'mixed/informational'
  }

  private assessCompetition(trendScore: number): string {
    if (trendScore > 0.8) return 'high'
    if (trendScore > 0.6) return 'medium'
    return 'low'
  }

  private getOptimalLength(format: ContentFormat): number {
    const lengths: Record<ContentFormat, number> = {
      'best-tools-list': 3500,
      'faq-article': 4000,
      'comparison-article': 2500,
      'comprehensive-guide': 5000,
      'tutorial-guide': 3500,
      'industry-news': 2000,
      'case-study': 2500,
      'resource-collection': 3000
    }

    return lengths[format]
  }
}

// Export singleton instance
export const contentPromptSystem = new ContentPromptSystem()