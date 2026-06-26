export interface Tutorial {
  title: string
  slug: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  steps: { title: string; content: string; code?: string }[]
  readingTime: number
}

export const tutorials: Tutorial[] = [
  {
    title: 'How to Scrape Amazon Product Data',
    slug: 'scrape-amazon-product-data',
    description: 'Learn how to extract product titles, prices, ratings, and reviews from Amazon using Venym Search Scrape API.',
    difficulty: 'intermediate',
    category: 'Web Scraping',
    readingTime: 8,
    steps: [
      { title: 'Set up your API key', content: 'Sign up at search.venym.io and get your API key from the dashboard.' },
      { title: 'Make your first scrape request', content: 'Use the Scrape endpoint to extract product data from any Amazon page.', code: `import Venym Search from 'VENYM_SEARCH';\nconst client = new Venym Search('sk_live_64_HEX_CHARS');\nconst result = await client.scrape({\n  url: 'https://www.amazon.com/dp/B0BSHF7WHW',\n  extract: { title: 'h1#title', price: '.a-price .a-offscreen', rating: '#acrPopover' }\n});` },
      { title: 'Parse and store the data', content: 'Extract structured fields from the response and save to your database.' },
      { title: 'Set up monitoring', content: 'Schedule regular scrapes to track price changes over time.' }
    ]
  },
  {
    title: 'Monitor Competitor Prices in Real-Time',
    slug: 'monitor-competitor-prices',
    description: 'Build an automated price monitoring system that tracks competitor pricing changes using Venym Search.',
    difficulty: 'intermediate',
    category: 'E-commerce',
    readingTime: 10,
    steps: [
      { title: 'Define competitor URLs', content: 'Create a list of competitor product pages to monitor.' },
      { title: 'Set up scheduled scraping', content: 'Use Scrape to extract prices on a schedule.', code: `const response = await fetch('https://search.venym.io/api/v1/scrape', {\n  method: 'POST',\n  headers: { 'Authorization': 'Bearer sk_live_64_HEX_CHARS', 'Content-Type': 'application/json' },\n  body: JSON.stringify({ url: competitorUrl, extract: { price: '.price' } })\n});` },
      { title: 'Build a price comparison dashboard', content: 'Display price trends and alerts when competitors change pricing.' },
      { title: 'Set up notifications', content: 'Get alerts via Slack, email, or webhooks when prices drop.' }
    ]
  },
  {
    title: 'Build a News Aggregator',
    slug: 'build-news-aggregator',
    description: 'Create a real-time news aggregation platform that collects and categorizes articles from multiple sources.',
    difficulty: 'advanced',
    category: 'Content Aggregation',
    readingTime: 12,
    steps: [
      { title: 'Search for news articles', content: 'Use Search to find recent articles across multiple sources.', code: `const news = await client.search({\n  query: 'artificial intelligence latest news',\n  max_results: 20\n});` },
      { title: 'Scrape full article content', content: 'Extract the full text, author, date, and images from each article.' },
      { title: 'Categorize with AI', content: 'Use AI to categorize articles by topic, sentiment, and relevance.' },
      { title: 'Build the frontend', content: 'Create a clean aggregator UI with filtering and search.' }
    ]
  },
  {
    title: 'Extract Structured Data from Any Website',
    slug: 'extract-structured-data',
    description: 'Learn techniques for extracting structured JSON data from any webpage using CSS selectors and AI-powered extraction.',
    difficulty: 'beginner',
    category: 'Web Scraping',
    readingTime: 7,
    steps: [
      { title: 'Identify the data fields', content: 'Inspect the page to find the CSS selectors for your target data.' },
      { title: 'Configure extraction rules', content: 'Define which elements to extract using Scrape.', code: `const data = await client.scrape({\n  url: 'https://example.com/products',\n  extract: {\n    products: [{ selector: '.product-card', fields: { name: 'h3', price: '.price', image: 'img@src' } }]\n  }\n});` },
      { title: 'Handle pagination', content: 'Scrape multiple pages of results automatically.' },
      { title: 'Export the data', content: 'Save extracted data as JSON, CSV, or directly to your database.' }
    ]
  },
  {
    title: 'Web Search in Python',
    slug: 'web-search-python',
    description: 'A complete guide to integrating Venym Search web search into your Python applications.',
    difficulty: 'beginner',
    category: 'API Integration',
    readingTime: 6,
    steps: [
      { title: 'Install the SDK', content: 'Install the Venym Search Python package.', code: `pip install VENYM_SEARCH` },
      { title: 'Initialize the client', content: 'Set up your API key and make your first search.', code: `from VENYM_SEARCH import Venym Search\nclient = Venym Search(api_key="sk_live_64_HEX_CHARS")\nresults = client.search(query="latest AI developments", max_results=10)` },
      { title: 'Process results', content: 'Loop through search results and extract the data you need.', code: `for result in results['search_results']:\n    print(f"{result['title']} - {result['url']}")` },
      { title: 'Build a search tool', content: 'Wrap it in a CLI tool or web app for easy access.' }
    ]
  },
  {
    title: 'Give AI Agents Web Access',
    slug: 'ai-agent-web-access',
    description: 'Learn how to connect AI agents to the web using Venym Search for real-time information retrieval.',
    difficulty: 'intermediate',
    category: 'AI / LLM',
    readingTime: 10,
    steps: [
      { title: 'Understand the architecture', content: 'AI agents need web access to answer questions about current events, data, and more.' },
      { title: 'Create a search tool', content: 'Build a tool wrapper that your AI agent can call.', code: `def web_search(query: str) -> str:\n    client = Venym Search(api_key="sk_live_64_HEX_CHARS")\n    results = client.search(query=query, max_results=5)\n    return "\\n".join([r["snippet"] for r in results["search_results"]])` },
      { title: 'Integrate with your agent', content: 'Register the tool with LangChain, CrewAI, or your custom agent framework.' },
      { title: 'Add caching and rate limiting', content: 'Optimize API usage with intelligent caching.' }
    ]
  },
  {
    title: 'RAG with Real-Time Web Data',
    slug: 'rag-realtime-data',
    description: 'Build a Retrieval-Augmented Generation pipeline that uses live web data instead of static documents.',
    difficulty: 'advanced',
    category: 'AI / LLM',
    readingTime: 14,
    steps: [
      { title: 'Design the pipeline', content: 'Plan your RAG architecture with real-time web search as the retrieval layer.' },
      { title: 'Chunk and embed content', content: 'Process the retrieved content into embeddings for your vector store.' },
      { title: 'Build the generation layer', content: 'Use the retrieved context to generate accurate, cited responses.' },
      { title: 'Add citations', content: 'Link back to source URLs for transparency and trust.' }
    ]
  },
  {
    title: 'Scrape JavaScript-Rendered Pages',
    slug: 'scrape-javascript-pages',
    description: 'Extract data from single-page applications and JavaScript-heavy websites that require rendering.',
    difficulty: 'intermediate',
    category: 'Web Scraping',
    readingTime: 8,
    steps: [
      { title: 'Understand the challenge', content: 'SPA content is loaded dynamically and not available in raw HTML.' },
      { title: 'Use Scrape with rendering', content: 'Venym Search handles JavaScript rendering automatically.', code: `const result = await client.scrape({\n  url: 'https://spa-example.com/data',\n  render_js: true,\n  wait_for: '.data-loaded'\n});` },
      { title: 'Handle dynamic content', content: 'Wait for specific elements or timeouts to ensure content loads.' },
      { title: 'Extract the data', content: 'Once rendered, extract data using standard CSS selectors.' }
    ]
  },
  {
    title: 'Automate Market Research',
    slug: 'automate-market-research',
    difficulty: 'advanced',
    category: 'Research',
    readingTime: 11,
    steps: [
      { title: 'Define research parameters', content: 'Set up your research topics, competitors, and market segments.' },
      { title: 'Analyze findings', content: 'Use AI to synthesize research into actionable insights.' },
      { title: 'Generate reports', content: 'Create formatted reports with charts and recommendations.' }
    ]
  },
  {
    title: 'Build a Price Tracker',
    slug: 'build-price-tracker',
    description: 'Create a full-featured price tracking application that monitors products across multiple stores.',
    difficulty: 'intermediate',
    category: 'E-commerce',
    readingTime: 9,
    steps: [
      { title: 'Design the tracker', content: 'Plan your product database, scraping schedule, and alert system.' },
      { title: 'Set up scraping jobs', content: 'Create scheduled tasks to scrape product pages.', code: `async function trackPrice(url: string, selector: string) {\n  const result = await client.scrape({ url, extract: { price: selector } });\n  return parseFloat(result.scraped_content.price.replace(/[^0-9.]/g, ''));\n}` },
      { title: 'Store price history', content: 'Save each price check to track changes over time.' },
      { title: 'Build alert notifications', content: 'Send alerts when prices drop below target thresholds.' }
    ]
  },
  {
    title: 'Scrape Real Estate Listings',
    slug: 'scrape-real-estate-listings',
    description: 'Extract property listings, prices, and details from real estate websites at scale.',
    difficulty: 'intermediate',
    category: 'Real Estate',
    readingTime: 9,
    steps: [
      { title: 'Identify target sites', content: 'Choose the real estate platforms to scrape.' },
      { title: 'Extract listing data', content: 'Scrape property details including price, location, and features.', code: `const listings = await client.scrape({\n  url: 'https://realestate.com/search?city=austin',\n  extract: {\n    properties: [{ selector: '.listing', fields: { price: '.price', address: '.address', beds: '.beds' } }]\n  }\n});` },
      { title: 'Handle pagination', content: 'Navigate through multiple pages of search results.' },
      { title: 'Analyze market trends', content: 'Aggregate data to identify pricing trends and opportunities.' }
    ]
  },
  {
    title: 'Monitor Brand Mentions',
    slug: 'monitor-brand-mentions',
    description: 'Track what people are saying about your brand across the web with automated monitoring.',
    difficulty: 'beginner',
    category: 'Marketing',
    readingTime: 7,
    steps: [
      { title: 'Set up search queries', content: 'Create queries for your brand name, products, and key people.' },
      { title: 'Schedule regular searches', content: 'Run Search on a schedule to find new mentions.', code: `const mentions = await client.search({ query: '"YourBrand" -site:yourbrand.com', max_results: 50 });` },
      { title: 'Analyze sentiment', content: 'Use AI to classify mentions as positive, negative, or neutral.' },
      { title: 'Create alerts', content: 'Notify your team when important mentions are detected.' }
    ]
  },
  {
    title: 'Extract Contact Information',
    slug: 'extract-contact-info',
    description: 'Extract emails, phone numbers, and addresses from websites for lead generation and outreach.',
    difficulty: 'beginner',
    category: 'Lead Generation',
    readingTime: 6,
    steps: [
      { title: 'Identify target pages', content: 'Find contact pages, about pages, and team directories.' },
      { title: 'Scrape and extract', content: 'Use Scrape to pull contact data from pages.', code: `const contacts = await client.scrape({\n  url: 'https://example.com/contact',\n  extract: { emails: 'a[href^="mailto:"]', phones: 'a[href^="tel:"]' }\n});` },
      { title: 'Validate and clean', content: 'Verify extracted emails and normalize phone numbers.' },
      { title: 'Export to CRM', content: 'Push verified contacts to your CRM or database.' }
    ]
  },
  {
    title: 'Build a Job Scraper',
    slug: 'build-job-scraper',
    description: 'Aggregate job listings from multiple job boards into a single searchable database.',
    difficulty: 'intermediate',
    category: 'Data Collection',
    readingTime: 8,
    steps: [
      { title: 'Choose job boards', content: 'Select target job boards and understand their page structure.' },
      { title: 'Scrape listings', content: 'Extract job titles, companies, locations, and descriptions.', code: `const jobs = await client.scrape({\n  url: 'https://jobs.example.com/search?q=python',\n  extract: {\n    listings: [{ selector: '.job-card', fields: { title: 'h2', company: '.company', location: '.location' } }]\n  }\n});` },
      { title: 'Deduplicate listings', content: 'Identify and remove duplicate postings across sources.' },
      { title: 'Build the search interface', content: 'Create a searchable, filterable job board UI.' }
    ]
  },
  {
    title: 'Scrape Social Media Data',
    slug: 'scrape-social-media-data',
    description: 'Extract public posts, profiles, and engagement metrics from social media platforms.',
    difficulty: 'advanced',
    category: 'Social Media',
    readingTime: 10,
    steps: [
      { title: 'Understand legal boundaries', content: 'Only scrape public data. Respect robots.txt and ToS.' },
      { title: 'Set up scraping', content: 'Use Venym Search to extract public social media content.', code: `const posts = await client.scrape({\n  url: 'https://social.example.com/user/techguru',\n  render_js: true,\n  extract: { posts: [{ selector: '.post', fields: { text: '.content', likes: '.likes' } }] }\n});` },
      { title: 'Analyze engagement', content: 'Track likes, shares, comments, and sentiment.' },
      { title: 'Store and visualize', content: 'Build dashboards to track social metrics over time.' }
    ]
  },
  {
    title: 'Automate Due Diligence Research',
    slug: 'automate-due-diligence',
    description: 'Speed up due diligence by automating company research, financial data collection, and risk analysis.',
    difficulty: 'advanced',
    category: 'Finance',
    readingTime: 12,
    steps: [
      { title: 'Define research scope', content: 'Outline what data you need: financials, team, market, competitors.' },
      { title: 'Cross-reference findings', content: 'Verify data across multiple sources for accuracy.' },
      { title: 'Generate due diligence report', content: 'Compile findings into a structured report with risk assessment.' }
    ]
  },
  {
    title: 'Build an AI Research Assistant',
    slug: 'build-ai-research-assistant',
    description: 'Create an AI-powered research assistant that can search, scrape, and synthesize information automatically.',
    difficulty: 'advanced',
    category: 'AI / LLM',
    readingTime: 13,
    steps: [
      { title: 'Design the assistant', content: 'Plan the architecture: search → scrape → synthesize → respond.' },
      { title: 'Build the search tool', content: 'Create a tool that lets the AI search the web.', code: `async function research(topic: string) {\n  const [search, deep] = await Promise.all([\n    client.search({ query: topic, max_results: 10 }),\n    client.research({ topic, max_sources: 10 })\n  ]);\n  return { search, deep };\n}` },
      { title: 'Add the synthesis layer', content: 'Use an LLM to synthesize research findings into coherent responses.' },
      { title: 'Add citations', content: 'Include source links for every claim in the response.' },
      { title: 'Build the interface', content: 'Create a chat interface for interacting with the assistant.' }
    ]
  },
  {
    title: 'Create a Data Pipeline',
    slug: 'create-data-pipeline',
    description: 'Build an ETL pipeline that collects web data, transforms it, and loads it into your data warehouse.',
    difficulty: 'advanced',
    category: 'Data Engineering',
    readingTime: 11,
    steps: [
      { title: 'Design the pipeline', content: 'Plan your data sources, transformations, and destination.' },
      { title: 'Set up extraction', content: 'Use Venym Search APIs to extract data from multiple sources.', code: `async function extract(urls: string[]) {\n  return Promise.all(urls.map(url => client.scrape({ url, extract: { title: 'h1', content: 'article' } })));\n}` },
      { title: 'Transform the data', content: 'Clean, normalize, and enrich extracted data.' },
      { title: 'Load into warehouse', content: 'Insert processed data into your database or data warehouse.' },
      { title: 'Schedule and monitor', content: 'Set up automated scheduling with error handling and monitoring.' }
    ]
  },
  {
    title: 'Scrape Without Getting Blocked',
    slug: 'scrape-without-blocked',
    description: 'Best practices for reliable web scraping that avoids IP bans, CAPTCHAs, and rate limiting.',
    difficulty: 'intermediate',
    category: 'Web Scraping',
    readingTime: 9,
    steps: [
      { title: 'Use a scraping API', content: 'Venym Search handles proxy rotation, CAPTCHAs, and user agents for you.', code: `const result = await client.scrape({\n  url: 'https://protected-site.com',\n  render_js: true,\n  stealth: true\n});` },
      { title: 'Respect rate limits', content: 'Add delays between requests and respect robots.txt.' },
      { title: 'Rotate user agents', content: 'Use different user agent strings for each request.' },
      { title: 'Handle errors gracefully', content: 'Implement retry logic with exponential backoff.' }
    ]
  },
  {
    title: 'Proxy Rotation Guide',
    slug: 'proxy-rotation-guide',
    description: 'Everything you need to know about proxy rotation for large-scale web scraping operations.',
    difficulty: 'intermediate',
    category: 'Infrastructure',
    readingTime: 8,
    steps: [
      { title: 'Why proxy rotation matters', content: 'Avoid IP bans and access geo-restricted content.' },
      { title: 'Built-in proxy support', content: 'Venym Search includes proxy rotation — no setup needed.', code: `const result = await client.scrape({\n  url: 'https://geo-restricted.com',\n  country: 'US'\n});` },
      { title: 'Types of proxies', content: 'Understand residential, datacenter, and mobile proxies.' },
      { title: 'Best practices', content: 'Rotation frequency, session management, and failover strategies.' }
    ]
  }
]

export function getTutorial(slug: string): Tutorial | undefined {
  return tutorials.find(t => t.slug === slug)
}

export function getTutorialSlugs(): string[] {
  return tutorials.map(t => t.slug)
}
