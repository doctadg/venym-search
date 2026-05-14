import Link from 'next/link'
import {
  Search,
  ArrowRight,
  BookOpen,
  Code,
  Zap,
  Globe
} from 'lucide-react'
import { APITester } from '../../components/APITester'
import { Callout } from '../../components/Callout'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'


export default function SearchAPIReferencePage() {

  const parameters = [
    {
      name: "query",
      type: "string",
      required: true,
      description: "The search query to execute. Supports natural language and search operators.",
      example: "Bitcoin price analysis 2025"
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      description: "Maximum number of search results to return (1-50).",
      example: "10"
    },
    {
      name: "auto_scrape_top",
      type: "integer",
      required: false,
      description: "Number of top results to automatically scrape (0-10).",
      example: "3"
    },
    {
      name: "include_contacts",
      type: "boolean",
      required: false,
      description: "Extract contact information from scraped content."
    },
    {
      name: "include_social",
      type: "boolean",
      required: false,
      description: "Extract social media links from scraped content."
    },
    {
      name: "country",
      type: "string",
      required: false,
      description: "Target country for search results (ISO 3166-1 alpha-2).",
      example: "US",
      options: ["US", "GB", "DE", "FR", "ES", "IT", "CA", "AU", "BR", "IN", "JP"]
    },
    {
      name: "language",
      type: "string",
      required: false,
      description: "Preferred language for search results (ISO 639-1).",
      example: "en",
      options: ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "ru", "ar"]
    },
    {
      name: "time_range",
      type: "string",
      required: false,
      description: "Filter results by publication time.",
      options: ["24h", "week", "month", "year"]
    },
    {
      name: "result_type",
      type: "string",
      required: false,
      description: "Type of search results to prioritize.",
      options: ["web", "news", "images", "videos"]
    }
  ]

  const exampleRequest = {
    query: "latest AI developments 2025",
    max_results: 10,
    auto_scrape_top: 3,
    include_contacts: false,
    include_social: false,
    country: "US",
    language: "en",
    time_range: "month",
    result_type: "web"
  }

  const responseFields = [
    {
      name: "search_results",
      type: "array",
      description: "Array of search result objects with title, URL, snippet, and metadata.",
      example: '[{title: "...", link: "...", snippet: "...", domain: "...", published_date: "..."}]'
    },
    {
      name: "scraped_content",
      type: "array",
      description: "Array of scraped content from auto_scrape_top results (if enabled).",
      example: '[{url: "...", content: "...", contacts: [...], social: [...]}]'
    },
    {
      name: "total_results",
      type: "integer",
      description: "Total number of search results found.",
      example: "1247"
    },
    {
      name: "search_time",
      type: "float",
      description: "Time taken to execute the search in seconds.",
      example: "0.34"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed.",
      example: "15"
    },
    {
      name: "remaining_credits",
      type: "integer",
      description: "Remaining API credits in your account.",
      example: "9985"
    },
    {
      name: "request_id",
      type: "string",
      description: "Unique identifier for this request.",
      example: '"req_1234567890abcdef"'
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SEARCH API · REFERENCE</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Search API Reference
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Interactive API testing and complete reference documentation.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/docs/api/search" className="venym-btn-secondary">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            View Guide
          </Link>
          <Link href="/docs/api/search/examples" className="venym-btn-secondary">
            <Code className="w-3.5 h-3.5 mr-1.5" />
            Examples
          </Link>
        </div>

        <Callout type="info" title="Interactive API Testing">
          Test the Search API directly from this page with live examples. Replace the demo key with your actual API key for real results.
        </Callout>
      </div>

      <div className="mb-12">
        <APITester
          endpoint="https://www.search.venym.io/api/v1/search"
          method="POST"
          title="Search the Web in Real-Time"
          description="Execute real-time web searches with automatic content extraction and enrichment"
          parameters={parameters}
          exampleRequest={exampleRequest}
          demoApiKey="demo_sk_search_12345"
        />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Response Schema</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Schema</h2>
        <ResponseTable fields={responseFields} title="Search Response Fields" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Features</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400/80" />
              <span className="text-[14px] font-medium text-white">Real-Time Search</span>
            </div>
            <ul className="text-[13px] text-white/65 space-y-1.5">
              <li>• Live web search results</li>
              <li>• Fresh content indexing</li>
              <li>• Multiple search engines</li>
              <li>• Instant result delivery</li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[14px] font-medium text-white">Auto-Scraping</span>
            </div>
            <ul className="text-[13px] text-white/65 space-y-1.5">
              <li>• Automatic content extraction</li>
              <li>• Clean text processing</li>
              <li>• Contact information</li>
              <li>• Social media links</li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-sky-400/80" />
              <span className="text-[14px] font-medium text-white">Smart Filtering</span>
            </div>
            <ul className="text-[13px] text-white/65 space-y-1.5">
              <li>• Geographic targeting</li>
              <li>• Language preferences</li>
              <li>• Time-based filtering</li>
              <li>• Content type selection</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Error Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Codes</h2>
        <div className="space-y-2">
          {[
            { code: '200 OK', tone: 'border-emerald-400/20 text-emerald-300/80', desc: 'Request successful, results returned' },
            { code: '400 Bad Request', tone: 'border-rose-400/20 text-rose-300/80', desc: 'Invalid query or parameters' },
            { code: '401 Unauthorized', tone: 'border-amber-400/20 text-amber-300/80', desc: 'Invalid or missing API key' },
            { code: '429 Too Many Requests', tone: 'border-amber-400/20 text-amber-300/80', desc: 'Rate limit exceeded' }
          ].map((row) => (
            <div key={row.code} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4 flex items-center gap-4">
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${row.tone}`}>
                {row.code}
              </span>
              <p className="text-[13px] text-white/70">{row.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Use Cases</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'News Monitoring', desc: 'Track breaking news and industry updates', code: `{
  "query": "AI breakthrough news",
  "result_type": "news",
  "time_range": "24h",
  "max_results": 20
}` },
            { title: 'Lead Generation', desc: 'Find potential customers and contacts', code: `{
  "query": "SaaS startup founders email",
  "auto_scrape_top": 5,
  "include_contacts": true,
  "include_social": true
}` },
            { title: 'Market Research', desc: 'Research competitors and market trends', code: `{
  "query": "enterprise software market 2025",
  "auto_scrape_top": 10,
  "time_range": "month",
  "max_results": 30
}` },
            { title: 'Content Discovery', desc: 'Find relevant content and resources', code: `{
  "query": "machine learning tutorials 2025",
  "result_type": "web",
  "language": "en",
  "max_results": 15
}` }
          ].map((u) => (
            <div key={u.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <h3 className="text-[15px] font-medium text-white mb-2">{u.title}</h3>
              <p className="text-[13px] text-white/55 mb-3">{u.desc}</p>
              <pre className="bg-[#050505] border border-white/[0.06] p-3 rounded-sm text-[11.5px] font-mono text-white/70 overflow-x-auto">
                {u.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api/search" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Search Guide
        </Link>
        <Link href="/docs/api-reference/scrape" className="venym-btn-primary">
          Scrape API Reference
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}
