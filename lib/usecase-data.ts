export interface UseCase {
  title: string
  slug: string
  description: string
  icon: string
  features: string[]
  codeExample: string
  benefits: string[]
}

export const useCases: UseCase[] = [
  {
    title: "AI Agents & Autonomous Systems",
    slug: "ai-agents",
    description: "Power AI agents with real-time web data for autonomous decision-making, tool use, and intelligent workflows.",
    icon: "Bot",
    features: [
      "Real-time web search for agent reasoning",
      "Structured data extraction for tool calls",
      "Multi-source data aggregation",
      "Rate-limited API for production agents",
      "Streaming responses for low-latency agents"
    ],
    codeExample: `import { Venym Search } from '@VENYM_SEARCH/sdk'

const client = new Venym Search({ apiKey: process.env.SEARCHHIVE_API_KEY })

// AI agent searches the web in real-time
const results = await client.search({
  query: "latest developments in quantum computing 2024",
  maxResults: 10,
  includeAnswer: true
})

// Extract structured data for agent reasoning
const data = await client.scrape({
  url: results.organic[0].link,
  extractSchema: {
    title: "string",
    summary: "string",
    keyPoints: "string[]"
  }
})`,
    benefits: [
      "Reduce agent hallucinations with real data",
      "Enable autonomous web research capabilities",
      "Cut development time by 80%",
      "Scale to millions of agent queries",
      "Production-ready with 99.9% uptime SLA"
    ]
  },
  {
    title: "Web Scraping at Scale",
    slug: "web-scraping",
    description: "Extract data from any website at scale with enterprise-grade reliability, anti-bot bypass, and structured output.",
    icon: "Globe",
    features: [
      "Anti-bot detection bypass",
      "JavaScript rendering support",
      "Automatic pagination handling",
      "Geo-targeted scraping",
      "Structured JSON output"
    ],
    codeExample: `const data = await client.scrape({
  url: "https://example.com/products",
  renderJs: true,
  extractSchema: {
    products: [{
      name: "string",
      price: "number",
      inStock: "boolean"
    }]
  },
  geo: "us"
})`,
    benefits: [
      "Scrape millions of pages daily",
      "99.5% success rate on tough sites",
      "No infrastructure to manage",
      "Auto-retry with smart proxies",
      "Pay only for successful requests"
    ]
  },
  {
    title: "Market Research & Analysis",
    slug: "market-research",
    description: "Automate competitive analysis, market sizing, and trend research with AI-powered data extraction.",
    icon: "TrendingUp",
    features: [
      "Competitor price monitoring",
      "Market trend analysis",
      "Sentiment analysis from reviews",
      "Industry report aggregation",
      "Automated data pipelines"
    ],
    codeExample: `const competitors = await client.search({
  query: "best project management tools 2024 pricing",
  maxResults: 20
})

const pricing = await Promise.all(
  competitors.organic.slice(0, 5).map(r =>
    client.scrape({
      url: r.link,
      extractSchema: {
        plans: [{ name: "string", price: "string", features: "string[]" }]
      }
    })
  )
)`,
    benefits: [
      "10x faster market research cycles",
      "Real-time competitive intelligence",
      "Automated report generation",
      "Data-driven decision making",
      "Continuous monitoring dashboards"
    ]
  },
  {
    title: "Price Monitoring & Repricing",
    slug: "price-monitoring",
    description: "Track competitor prices in real-time and automate repricing strategies to maximize margins and sales.",
    icon: "DollarSign",
    features: [
      "Real-time price tracking",
      "Historical price trends",
      "Automated repricing rules",
      "Multi-marketplace support",
      "Alert notifications"
    ],
    codeExample: `const prices = await client.scrape({
  url: "https://competitor.com/product/123",
  extractSchema: {
    price: "number",
    originalPrice: "number",
    inStock: "boolean",
    variants: [{ name: "string", price: "number" }]
  }
})

if (prices.price < myPrice) {
  await adjustPrice({ newPrice: prices.price * 0.99 })
}`,
    benefits: [
      "Win the Buy Box more often",
      "Maximize profit margins",
      "React to changes in minutes",
      "Track unlimited competitors",
      "Reduce manual monitoring by 95%"
    ]
  },
  {
    title: "Content Aggregation & Curation",
    slug: "content-aggregation",
    description: "Aggregate, filter, and curate content from across the web for newsletters, dashboards, and content hubs.",
    icon: "Newspaper",
    features: [
      "Multi-source content aggregation",
      "AI-powered summarization",
      "Deduplication and clustering",
      "Custom filtering rules",
      "RSS and API output formats"
    ],
    codeExample: `const articles = await client.search({
  query: "AI startup funding round 2024",
  maxResults: 50,
  freshness: "week"
})

const curated = await client.summarize({
  texts: articles.organic.map(a => a.snippet),
  style: "newsletter",
  maxLength: 200
})`,
    benefits: [
      "Build content hubs automatically",
      "Save 20+ hours per week on curation",
      "Never miss important content",
      "Consistent publishing schedule",
      "Grow audience with fresh content"
    ]
  },
  {
    title: "SEO Monitoring & Analysis",
    slug: "seo-monitoring",
    description: "Monitor SERP rankings, track competitors, analyze backlinks, and audit technical SEO at scale.",
    icon: "Search",
    features: [
      "SERP position tracking",
      "Competitor gap analysis",
      "Backlink monitoring",
      "Technical SEO audits",
      "Keyword research at scale"
    ],
    codeExample: `const serp = await client.search({
  query: "web scraping api",
  maxResults: 100,
  location: "United States"
})

const myPosition = serp.organic.findIndex(
  r => r.link.includes("VENYM_SEARCH.io")
) + 1

const gaps = await client.search({
  query: "best scraping tools comparison",
  maxResults: 20
})`,
    benefits: [
      "Track thousands of keywords",
      "Identify content gaps instantly",
      "Monitor competitor strategies",
      "Automated weekly reports",
      "Improve organic traffic 40%+"
    ]
  },
  {
    title: "Real Estate Data Extraction",
    slug: "real-estate-data",
    description: "Extract property listings, pricing trends, and market data from real estate platforms at scale.",
    icon: "Building2",
    features: [
      "Property listing extraction",
      "Price history tracking",
      "Neighborhood data aggregation",
      "Image and media extraction",
      "Market analytics dashboards"
    ],
    codeExample: `const listings = await client.scrape({
  url: "https://realestate.com/listings/manhattan",
  renderJs: true,
  extractSchema: {
    properties: [{
      address: "string",
      price: "number",
      beds: "number",
      baths: "number",
      sqft: "number",
      agent: "string"
    }]
  }
})`,
    benefits: [
      "Build comprehensive property databases",
      "Track market trends in real-time",
      "Automate valuation models",
      "Scale to millions of listings",
      "Reduce data acquisition costs 90%"
    ]
  },
  {
    title: "Financial Data & Market Intelligence",
    slug: "financial-data",
    description: "Extract financial data, earnings reports, and market intelligence from public sources for analysis.",
    icon: "BarChart3",
    features: [
      "Earnings report extraction",
      "SEC filing parsing",
      "Stock news aggregation",
      "Financial statement analysis",
      "Market sentiment tracking"
    ],
    codeExample: `const filings = await client.search({
  query: "site:sec.gov AAPL 10-K filing",
  maxResults: 10
})

const report = await client.scrape({
  url: filings.organic[0].link,
  extractSchema: {
    revenue: "number",
    netIncome: "number",
    eps: "number",
    yearOverYearGrowth: "number"
  }
})`,
    benefits: [
      "Automate financial research workflows",
      "Real-time market intelligence",
      "Reduce manual data entry errors",
      "Compliance-ready data pipelines",
      "Scale analysis across sectors"
    ]
  },
  {
    title: "News Monitoring & Alerts",
    slug: "news-monitoring",
    description: "Monitor news sources in real-time, set up custom alerts, and build news analytics dashboards.",
    icon: "Bell",
    features: [
      "Real-time news monitoring",
      "Custom keyword alerts",
      "Source credibility scoring",
      "Sentiment analysis",
      "Multi-language support"
    ],
    codeExample: `const news = await client.search({
  query: "OpenAI GPT announcement",
  freshness: "day",
  maxResults: 50,
  sources: ["news"]
})

const alerts = news.organic.filter(a =>
  a.snippet.includes("launch") ||
  a.snippet.includes("release")
)`,
    benefits: [
      "Be the first to know about breaking news",
      "Monitor brand mentions globally",
      "Automate crisis detection",
      "Build media intelligence platforms",
      "Track industry trends in real-time"
    ]
  },
  {
    title: "Social Media Data Collection",
    slug: "social-media",
    description: "Collect and analyze social media data for sentiment analysis, trend detection, and audience insights.",
    icon: "MessageSquare",
    features: [
      "Post and comment extraction",
      "Sentiment analysis",
      "Trend detection",
      "Influencer identification",
      "Engagement metrics tracking"
    ],
    codeExample: `const posts = await client.search({
  query: "site:reddit.com web scraping tools",
  maxResults: 100,
  freshness: "week"
})

const insights = await client.analyze({
  texts: posts.organic.map(p => p.snippet),
  analysis: ["sentiment", "topics", "entities"]
})`,
    benefits: [
      "Understand audience sentiment in real-time",
      "Identify emerging trends early",
      "Benchmark against competitors",
      "Inform product development",
      "Measure campaign effectiveness"
    ]
  },
  {
    title: "Lead Generation & Enrichment",
    slug: "lead-generation",
    description: "Discover and enrich B2B leads automatically with company data, contact info, and firmographic intelligence.",
    icon: "Users",
    features: [
      "Company data extraction",
      "Contact discovery",
      "Firmographic enrichment",
      "Technology stack detection",
      "Automated prospecting lists"
    ],
    codeExample: `const companies = await client.search({
  query: "series A fintech startups 2024",
  maxResults: 50
})

const enriched = await Promise.all(
  companies.organic.slice(0, 20).map(c =>
    client.scrape({
      url: c.link,
      extractSchema: {
        company: "string",
        founded: "string",
        employees: "string",
        techStack: "string[]",
        funding: "string"
      }
    })
  )
)`,
    benefits: [
      "Generate 10x more qualified leads",
      "Enrich CRM data automatically",
      "Identify ideal customer profiles",
      "Reduce prospecting time by 70%",
      "Higher conversion rates with data"
    ]
  },
  {
    title: "Research Automation",
    slug: "research-automation",
    description: "Automate academic and business research workflows with AI-powered search, extraction, and synthesis.",
    icon: "BookOpen",
    features: [
      "Academic paper search",
      "Citation extraction",
      "Literature review automation",
      "Multi-source synthesis",
      "Research report generation"
    ],
    codeExample: `const papers = await client.search({
  query: "transformer architecture attention mechanism research",
  maxResults: 30
})

const summaries = await client.batchScrape(
  papers.organic.slice(0, 10).map(p => ({
    url: p.link,
    extractSchema: {
      title: "string",
      abstract: "string",
      methodology: "string",
      findings: "string[]"
    }
  }))
)`,
    benefits: [
      "Accelerate research by 10x",
      "Comprehensive literature coverage",
      "Automated synthesis and summaries",
      "Reduce research costs by 80%",
      "Stay current with latest findings"
    ]
  }
]
