export interface Competitor {
  name: string;
  slug: string;
  description: string;
  features: string[];
  pricing: string;
  searchHivePricing: string;
  pros: string[];
  cons: string[];
  website: string;
}

export const competitors: Competitor[] = [
  {
    name: "SerpAPI",
    slug: "serpapi",
    description:
      "Google search results API that scrapes search engine result pages in real-time. Owned by Maple&nbsp;Media.",
    features: [
      "Google Search API",
      "Bing, Yahoo, Baidu support",
      "Local, image, video search",
      "Knowledge graph extraction",
      "Rich snippets parsing",
    ],
    pricing: "From $50/mo (5,000 searches)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Accurate Google SERP data",
      "Well-documented API",
      "30+ search engines",
      "Reliable uptime",
    ],
    cons: [
      "Expensive at scale",
      "Google-centric — limited web scraping",
      "Rate limits on lower tiers",
      "No built-in AI/LLM extraction",
    ],
    website: "https://serpapi.com",
  },
  {
    name: "ScrapingBee",
    slug: "scrapingbee",
    description:
      "Web scraping API that handles headless browsers, proxies, and CAPTCHAs for you.",
    features: [
      "Headless browser rendering",
      "Proxy rotation",
      "CAPTCHA handling",
      "JavaScript rendering",
      "Screenshot API",
    ],
    pricing: "From $49/mo (1,000 credits)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Easy to use",
      "Good proxy infrastructure",
      "Handles JS rendering",
      "Decent documentation",
    ],
    cons: [
      "Credits get consumed fast",
      "No search-specific features",
      "Limited free tier",
      "Slow at scale",
    ],
    website: "https://scrapingbee.com",
  },
  {
    name: "Bright Data",
    slug: "bright-data",
    description:
      "Enterprise proxy and web scraping platform with the world's largest residential proxy network.",
    features: [
      "Residential proxies",
      "Data center proxies",
      "Web Scraper IDE",
      "SERP API",
      "Dataset marketplace",
    ],
    pricing: "From $500/mo (enterprise-focused)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Massive proxy network",
      "Enterprise-grade reliability",
      "SERP API included",
      "Advanced targeting options",
    ],
    cons: [
      "Very expensive",
      "Complex pricing model",
      "Steep learning curve",
      "Overkill for most use cases",
    ],
    website: "https://brightdata.com",
  },
  {
    name: "Firecrawl",
    slug: "firecrawl",
    description:
      "Web scraping and crawling API that converts websites into clean LLM-ready markdown.",
    features: [
      "Web crawling",
      "Markdown conversion",
      "JavaScript rendering",
      "Structured extraction",
      "Batch scraping",
    ],
    pricing: "From $19/mo (500 credits)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Great for LLM pipelines",
      "Clean markdown output",
      "Fast crawling",
      "Good structured extraction",
    ],
    cons: [
      "Limited search capabilities",
      "Credits expire monthly",
      "No real-time search API",
      "Smaller proxy network",
    ],
    website: "https://firecrawl.dev",
  },
  {
    name: "Tavily",
    slug: "tavily",
    description:
      "AI-native search API built for LLM agents with automatic answer extraction.",
    features: [
      "AI search API",
      "Answer extraction",
      "Topic-based search",
      "Search context for LLMs",
      "Python & JS SDKs",
    ],
    pricing: "From $30/mo (1,000 calls)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Purpose-built for AI agents",
      "Clean, relevant results",
      "Good for RAG pipelines",
      "Simple API",
    ],
    cons: [
      "Expensive per request",
      "Limited to search only",
      "No web scraping",
      "Fewer features than competitors",
    ],
    website: "https://tavily.com",
  },
  {
    name: "Exa",
    slug: "exa",
    description:
      "AI-powered search engine API using embeddings for high-quality, relevant results.",
    features: [
      "Neural search",
      "Content search",
      "Similarity search",
      "Auto-highlighted results",
      "Category filtering",
    ],
    pricing: "From $25/mo (1,000 requests)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "High-quality results",
      "Neural search is innovative",
      "Good for content discovery",
      "Clean API design",
    ],
    cons: [
      "Smaller index than Google",
      "Expensive at scale",
      "Limited scraping features",
      "Niche use case focus",
    ],
    website: "https://exa.ai",
  },
  {
    name: "Jina AI",
    slug: "jina-ai",
    description:
      "AI platform offering search, reader, and embedding APIs for multimodal data.",
    features: [
      "Jina Reader API",
      "Search API",
      "Embeddings API",
      "Reranker API",
      "Segmenter API",
    ],
    pricing: "Free tier + pay-per-use",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Free tier available",
      "Multiple AI tools",
      "Good embeddings",
      "Active open-source community",
    ],
    cons: [
      "Complex pricing at scale",
      "Reader API rate-limited",
      "Search quality varies",
      "Scattered product suite",
    ],
    website: "https://jina.ai",
  },
  {
    name: "Brave Search API",
    slug: "brave-search-api",
    description:
      "Search API from the privacy-focused Brave browser, powered by their independent index.",
    features: [
      "Web search API",
      "News & image search",
      "Privacy-focused",
      "Independent search index",
      "Summarizer feature",
    ],
    pricing: "From $5/mo (2,000 queries)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Affordable entry price",
      "Privacy-focused",
      "Independent index",
      "Simple integration",
    ],
    cons: [
      "Smaller index than Google",
      "No web scraping",
      "Limited advanced features",
      "Basic result quality",
    ],
    website: "https://brave.com/search/api",
  },
  {
    name: "ScrapFly",
    slug: "scrapfly",
    description:
      "Web scraping API with anti-bot bypass, headless browsers, and residential proxies.",
    features: [
      "Anti-bot bypass",
      "Headless browser",
      "Residential proxies",
      "Scrape cache",
      "Webhook integration",
    ],
    pricing: "From $30/mo (100K API credits)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Good anti-bot bypass",
      "Affordable entry price",
      "Caching reduces costs",
      "Detailed error reporting",
    ],
    cons: [
      "No search API",
      "Credits system is confusing",
      "Limited LLM integration",
      "Smaller community",
    ],
    website: "https://scrapfly.io",
  },
  {
    name: "Apify",
    slug: "apify",
    description:
      "Platform for web scraping and automation with a marketplace of pre-built actors.",
    features: [
      "Actor marketplace",
      "Web scraping",
      "Scheduled runs",
      "Proxy integration",
      "Dataset storage",
    ],
    pricing: "From $49/mo (platform fee)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Huge actor marketplace",
      "No-code options",
      "Good scheduling",
      "Active community",
    ],
    cons: [
      "Complex pricing (compute + usage)",
      "Overkill for simple scraping",
      "Actors vary in quality",
      "No built-in search API",
    ],
    website: "https://apify.com",
  },
  {
    name: "ZenRows",
    slug: "zenrows",
    description:
      "Web scraping API with AI-powered anti-bot bypass and residential proxies.",
    features: [
      "Anti-bot bypass",
      "Residential proxies",
      "JavaScript rendering",
      "CAPTCHA solving",
      "Concurrent requests",
    ],
    pricing: "From $49/mo (250K credits)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "High success rate",
      "Good anti-bot system",
      "Concurrent scraping",
      "Fair pricing for volume",
    ],
    cons: [
      "Credits can run out fast",
      "No search API",
      "Limited AI features",
      "Complex for beginners",
    ],
    website: "https://zenrows.com",
  },
  {
    name: "Oxylabs",
    slug: "oxylabs",
    description:
      "Enterprise proxy and data collection platform with one of the largest proxy pools.",
    features: [
      "Residential proxies",
      "Data center proxies",
      "E-commerce scraper API",
      "SERP scraper",
      "Web Unblocker",
    ],
    pricing: "From $300/mo (enterprise-focused)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Massive proxy pool",
      "Enterprise-grade SLA",
      "Good SERP scraper",
      "Dedicated account managers",
    ],
    cons: [
      "Very expensive",
      "Enterprise contracts required",
      "Complex onboarding",
      "Not for small teams",
    ],
    website: "https://oxylabs.io",
  },
  {
    name: "ScraperAPI",
    slug: "scraperapi",
    description:
      "Simple web scraping API that handles proxies, browsers, and CAPTCHAs automatically.",
    features: [
      "Proxy rotation",
      "JavaScript rendering",
      "CAPTCHA handling",
      "Geotargeting",
      "Custom headers",
    ],
    pricing: "From $49/mo (100K credits)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Simple to integrate",
      "Good documentation",
      "Reliable proxies",
      "Fair pricing",
    ],
    cons: [
      "No search-specific features",
      "Limited AI integration",
      "Basic feature set",
      "No built-in parsing",
    ],
    website: "https://scraperapi.com",
  },
  {
    name: "Diffbot",
    slug: "diffbot",
    description:
      "AI-powered web data extraction platform that structures any web page automatically.",
    features: [
      "Automatic extraction",
      "Article, product, discussion APIs",
      "Knowledge graph",
      "Bulk processing",
      "Crawl + extract",
    ],
    pricing: "From $299/mo (enterprise-focused)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Powerful AI extraction",
      "Automatic structuring",
      "Knowledge graph is unique",
      "Good for bulk processing",
    ],
    cons: [
      "Very expensive",
      "Overkill for simple tasks",
      "Steep learning curve",
      "No search API",
    ],
    website: "https://diffbot.com",
  },
  {
    name: "Phantombuster",
    slug: "phantombuster",
    description:
      "Automation platform for LinkedIn, Instagram, Twitter, and other social media scraping.",
    features: [
      "LinkedIn automation",
      "Twitter scraping",
      "Instagram scraping",
      "Email finder",
      "Scheduled workflows",
    ],
    pricing: "From $69/mo (5 slots)",
    searchHivePricing: "From $29/mo (10,000 requests)",
    pros: [
      "Great for social media",
      "No-code interface",
      "Pre-built templates",
      "Good for lead gen",
    ],
    cons: [
      "Social media only",
      "No general web scraping",
      "Accounts can get banned",
      "Expensive for what it does",
    ],
    website: "https://phantombuster.com",
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
