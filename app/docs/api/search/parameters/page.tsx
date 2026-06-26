import Link from 'next/link'
import {
  Search,
  Settings,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Hash,
  Type,
  Clock
} from 'lucide-react'
import { CodeBlock } from '../../../components/CodeBlock'
import { Callout } from '../../../components/Callout'
import { ParameterTable, ResponseTable } from '../../../components/ParameterTable'


export default function SearchParametersPage() {

  const requestParameters = [
    { name: "query", type: "string", required: true, description: "The search query to execute. Supports natural language queries, keywords, and search operators.", example: '"Bitcoin price analysis" OR "crypto market trends"' },
    { name: "max_results", type: "integer", required: false, description: "Maximum number of search results to return. Higher values consume more credits.", example: "10", default: "10" },
    { name: "auto_scrape_top", type: "integer", required: false, description: "Number of top results to automatically scrape for content extraction.", example: "3", default: "0" },
    { name: "include_contacts", type: "boolean", required: false, description: "Extract contact information (emails, phone numbers) from scraped content.", example: "true", default: "false" },
    { name: "include_social", type: "boolean", required: false, description: "Extract social media links and handles from scraped content.", example: "false", default: "false" },
    { name: "country", type: "string", required: false, description: "Target country for search results using ISO 3166-1 alpha-2 codes.", example: "US", default: "US" },
    { name: "language", type: "string", required: false, description: "Preferred language for search results using ISO 639-1 codes.", example: "en", default: "en" },
    { name: "time_range", type: "string", required: false, description: "Filter results by publication time.", example: '"24h", "week", "month", "year"' },
    { name: "safe_search", type: "string", required: false, description: "Filter explicit content from search results.", example: '"strict", "moderate", "off"', default: "moderate" },
    { name: "result_type", type: "string", required: false, description: "Type of search results to prioritize.", example: '"web", "news", "images", "videos"', default: "web" }
  ]

  const responseParameters = [
    { name: "search_results", type: "array", description: "Array of search result objects containing title, URL, snippet, and metadata.", example: "[{title: '...', link: '...', snippet: '...'}, ...]" },
    { name: "scraped_content", type: "array", description: "Array of scraped content from auto_scrape_top results (if enabled).", example: "[{url: '...', content: '...', contacts: [...], social: [...]}, ...]" },
    { name: "total_results", type: "integer", description: "Total number of search results found (may exceed max_results).", example: "1247" },
    { name: "search_time", type: "float", description: "Time taken to execute the search query in seconds.", example: "0.34" },
    { name: "credits_used", type: "integer", description: "Number of API credits consumed by this request.", example: "15" },
    { name: "remaining_credits", type: "integer", description: "Number of API credits remaining in your account.", example: "9985" },
    { name: "request_id", type: "string", description: "Unique identifier for this API request (useful for support).", example: '"req_1234567890abcdef"' }
  ]

  const exampleMinimal = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
    json={
        "query": "latest AI developments"
    }
)`,
    javascript: `const response = await fetch('https://www.search.venym.io/api/v1/search', {
  method: 'POST',
  headers: {
    'Authorization": "Bearer': 'sk_live_64_HEX_CHARS_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'latest AI developments'
  })
});`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_64_HEX_CHARS_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "latest AI developments"
  }'`
  }

  const exampleAdvanced = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
    json={
        "query": "enterprise SaaS startups 2025",
        "max_results": 20,
        "auto_scrape_top": 5,
        "include_contacts": True,
        "include_social": True,
        "country": "US",
        "language": "en",
        "time_range": "month",
        "safe_search": "moderate",
        "result_type": "web"
    }
)`,
    javascript: `const response = await fetch('https://www.search.venym.io/api/v1/search', {
  method: 'POST',
  headers: {
    'Authorization": "Bearer': 'sk_live_64_HEX_CHARS_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'enterprise SaaS startups 2025',
    max_results: 20,
    auto_scrape_top: 5,
    include_contacts: true,
    include_social: true,
    country: 'US',
    language: 'en',
    time_range: 'month',
    safe_search: 'moderate',
    result_type: 'web'
  })
});`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_64_HEX_CHARS_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "enterprise SaaS startups 2025",
    "max_results": 20,
    "auto_scrape_top": 5,
    "include_contacts": true,
    "include_social": true,
    "country": "US",
    "language": "en",
    "time_range": "month",
    "safe_search": "moderate",
    "result_type": "web"
  }'`
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SEARCH · PARAMETERS</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Search Parameters
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Complete parameter reference for the Search API.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/docs/api/search" className="venym-btn-secondary">
            <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
            Overview
          </Link>
          <Link href="/docs/api/search/examples" className="venym-btn-secondary">
            Examples
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <Callout type="info" title="Parameter Validation">
          All parameters are validated before processing. Invalid parameters will return a 400 error with details about what needs to be corrected.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Request</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Request Parameters</h2>

        <ParameterTable parameters={requestParameters} title="Search Request Parameters" />

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Credit Consumption</span>
            </div>
            <div className="space-y-3">
              {[
                ['Base search:', '1 credit'],
                ['Per result returned:', '0.1 credits'],
                ['Per page scraped:', '2 credits'],
                ['Contact extraction:', '+0.5 credits'],
                ['Social extraction:', '+0.3 credits']
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[13px] text-white/70">{k}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Supported Countries</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[12.5px] text-white/65">
              <div>US - United States</div>
              <div>GB - United Kingdom</div>
              <div>DE - Germany</div>
              <div>FR - France</div>
              <div>ES - Spain</div>
              <div>IT - Italy</div>
              <div>CA - Canada</div>
              <div>AU - Australia</div>
              <div>JP - Japan</div>
              <div>IN - India</div>
              <div>BR - Brazil</div>
              <div>MX - Mexico</div>
            </div>
            <p className="text-[11px] text-white/40 mt-3 font-mono">And 50+ more countries supported</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Response</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Format</h2>
        <ResponseTable fields={responseParameters} title="Search Response Fields" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Examples</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Example Requests</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Minimal Request</h3>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              The simplest possible request with just a search query:
            </p>
            <CodeBlock multiLanguage={exampleMinimal} title="Minimal Search Request" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Advanced Request</h3>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Using all available parameters for maximum functionality:
            </p>
            <CodeBlock multiLanguage={exampleAdvanced} title="Advanced Search Request" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Parameter Tips & Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Optimization Tips</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Query Optimization:</strong><p className="text-white/55">Use specific keywords and phrases. Avoid overly broad queries.</p></div>
              <div><strong className="text-white">Result Limits:</strong><p className="text-white/55">Start with max_results=10, increase only if needed to save credits.</p></div>
              <div><strong className="text-white">Scraping Strategy:</strong><p className="text-white/55">Set auto_scrape_top=3-5 for the most valuable content extraction.</p></div>
              <div><strong className="text-white">Regional Targeting:</strong><p className="text-white/55">Use country parameter for location-specific results.</p></div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Common Mistakes</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Empty Queries:</strong><p className="text-white/55">Always provide a non-empty query string.</p></div>
              <div><strong className="text-white">Credit Waste:</strong><p className="text-white/55">Don't set max_results too high for exploratory searches.</p></div>
              <div><strong className="text-white">Invalid Countries:</strong><p className="text-white/55">Use ISO 3166-1 alpha-2 codes (e.g., "US", not "USA").</p></div>
              <div><strong className="text-white">Contact Extraction:</strong><p className="text-white/55">Only enable when needed - it increases processing time and costs.</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api/search" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Search Overview
        </Link>
        <Link href="/docs/api/search/examples" className="venym-btn-primary">
          View Examples
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}
