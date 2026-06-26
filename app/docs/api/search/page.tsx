import Link from 'next/link'
import {
  Search,
  Zap,
  Clock,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'
import { APIMethod, StatusCode } from '../../components/APIMethod'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'


export default function SearchPage() {

  const quickExample = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
    json={
        "query": "Bitcoin price 2025",
        "max_results": 10,
        "auto_scrape_top": 3,
        "include_contacts": True,
        "include_social": False
    }
)

data = response.json()
print(f"Found {len(data['search_results'])} results")
print(f"Scraped {len(data['scraped_content'])} pages")`,
    javascript: `const axios = require('axios');



const response = await axios.post(
  'https://www.search.venym.io/api/v1/search',
  {
    query: 'Bitcoin price 2025',
    max_results: 10,
    auto_scrape_top: 3,
    include_contacts: true,
    include_social: false
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_64_HEX_CHARS_key_here' }
  }
);

const data = response.data;
console.log(\`Found \${data.search_results.length} results\`);
console.log(\`Scraped \${data.scraped_content.length} pages\`);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_64_HEX_CHARS_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Bitcoin price 2025",
    "max_results": 10,
    "auto_scrape_top": 3,
    "include_contacts": true,
    "include_social": false
  }'`
  }

  const parameters = [
    {
      name: "query",
      type: "string",
      required: true,
      description: "The search query to execute. Use natural language or specific keywords.",
      example: "Bitcoin price prediction 2025"
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      default: "10",
      description: "Maximum number of search results to return. Must be between 1 and 50.",
      example: "10"
    },
    {
      name: "auto_scrape_top",
      type: "integer",
      required: false,
      description: "Automatically scrape content from the top N results. Costs 3 credits per scraped page.",
      example: "3"
    },
    {
      name: "include_contacts",
      type: "boolean",
      required: false,
      default: "false",
      description: "Extract contact information from scraped content. Requires Starter plan or higher. Costs +5 credits.",
      example: "true"
    },
    {
      name: "include_social",
      type: "boolean",
      required: false,
      default: "false",
      description: "Discover social media profiles mentioned in results. Requires Builder plan or higher. Costs +5 credits.",
      example: "false"
    }
  ]

  const responseFields = [
    {
      name: "query",
      type: "string",
      description: "The original search query that was executed"
    },
    {
      name: "search_results",
      type: "array",
      description: "Array of search results with title, URL, snippet, position, and date"
    },
    {
      name: "scraped_content",
      type: "array",
      description: "Content from automatically scraped pages (if auto_scrape_top was used)"
    },
    {
      name: "contacts",
      type: "array",
      description: "Extracted contact information (if include_contacts was true)"
    },
    {
      name: "social_profiles",
      type: "array",
      description: "Discovered social media profiles (if include_social was true)"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Total credits consumed by this request"
    },
    {
      name: "remaining_credits",
      type: "integer",
      description: "Your remaining credit balance after this request"
    },
    {
      name: "results_count",
      type: "integer",
      description: "Number of search results returned"
    },
    {
      name: "scraped_count",
      type: "integer",
      description: "Number of pages that were automatically scraped"
    }
  ]

  const successResponse = `{
  "query": "Bitcoin price 2025",
  "search_results": [
    {
      "title": "Bitcoin Price Prediction: Will BTC Hit $150K by 2025?",
      "link": "https://example.com/bitcoin-prediction",
      "snippet": "Experts predict Bitcoin could reach $150,000 by end of 2025 driven by institutional adoption...",
      "position": 1,
      "date": "2025-07-20"
    },
    {
      "title": "Crypto Market Analysis: BTC Long-term Outlook",
      "link": "https://example.com/crypto-analysis",
      "snippet": "Technical analysis suggests Bitcoin is entering a new bull cycle...",
      "position": 2,
      "date": "2025-07-19"
    }
  ],
  "scraped_content": [
    {
      "url": "https://example.com/bitcoin-prediction",
      "title": "Bitcoin Price Prediction: Will BTC Hit $150K by 2025?",
      "text": "The cryptocurrency market has been experiencing unprecedented growth...",
      "error": null
    }
  ],
  "contacts": [
    {
      "email": "analyst@cryptoinsights.com",
      "name": "John Smith",
      "company": "Crypto Insights",
      "source_url": "https://example.com/bitcoin-prediction"
    }
  ],
  "credits_used": 9,
  "remaining_credits": 4991,
  "results_count": 2,
  "scraped_count": 1
}`

  const creditExamples = [
    {
      description: "Basic search (10 results)",
      cost: "1 credit",
      example: '{"query": "AI news", "max_results": 10}'
    },
    {
      description: "Search + auto-scrape 3 pages",
      cost: "10 credits (1 + 3×3)",
      example: '{"query": "AI news", "auto_scrape_top": 3}'
    },
    {
      description: "Search + scraping + contacts",
      cost: "15 credits (1 + 3×3 + 5)",
      example: '{"query": "AI news", "auto_scrape_top": 3, "include_contacts": true}'
    },
    {
      description: "Full featured search",
      cost: "19 credits (1 + 3×3 + 5 + 5)",
      example: '{"query": "AI news", "auto_scrape_top": 3, "include_contacts": true, "include_social": true}'
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>SEARCH API</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
            Real-time
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Search API
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Real-time web search with automatic content extraction, contact discovery, and social profile detection. Get structured results from the latest web content.
        </p>
      </div>

      <div className="grid gap-px bg-white/[0.06] border border-white/[0.06] rounded-sm overflow-hidden md:grid-cols-4 mb-12">
        <div className="bg-[#080808] p-5 text-center">
          <Zap className="w-4 h-4 text-amber-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white tabular-nums">17ms</div>
          <div className="text-[12px] text-white/50 mt-1">Avg latency</div>
        </div>
        <div className="bg-[#080808] p-5 text-center">
          <Globe className="w-4 h-4 text-emerald-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white tabular-nums">99.3%</div>
          <div className="text-[12px] text-white/50 mt-1">Success rate</div>
        </div>
        <div className="bg-[#080808] p-5 text-center">
          <Clock className="w-4 h-4 text-sky-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white">Real-time</div>
          <div className="text-[12px] text-white/50 mt-1">Fresh results</div>
        </div>
        <div className="bg-[#080808] p-5 text-center">
          <Users className="w-4 h-4 text-violet-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white">1 credit</div>
          <div className="text-[12px] text-white/50 mt-1">Starting cost</div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Quick Example</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Example</h2>
        <CodeBlock
          multiLanguage={quickExample}
          title="Search with automatic content extraction"
        />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Endpoint</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">API Endpoint</h2>
        <APIMethod
          method="POST"
          endpoint="/v1/search"
          description="Execute a real-time web search with optional content extraction and data enrichment"
        />

        <Callout type="info" title="Base URL">
          All requests should be made to <code>https://www.search.venym.io/api</code>
        </Callout>
      </div>

      <div className="mb-12">
        <ParameterTable parameters={parameters} />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Plans</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Feature Access by Plan</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Free', limit: '10 requests/hour', tone: 'border-white/10 text-white/60', features: ['Basic search', 'Auto-scraping'] },
            { name: 'Starter', limit: '1K requests/hour', tone: 'border-sky-400/20 text-sky-300/80', features: ['Everything in Free', 'Contact extraction'] },
            { name: 'Builder', limit: '5K requests/hour', tone: 'border-amber-400/20 text-amber-300/80', features: ['Everything in Starter', 'Social discovery'] },
            { name: 'Unicorn', limit: '20K requests/hour', tone: 'border-violet-400/20 text-violet-300/80', features: ['All features', 'Priority processing'] },
          ].map((plan) => (
            <div key={plan.name} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="text-[15px] font-medium text-white mb-2">{plan.name}</div>
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${plan.tone} inline-block mb-4`}>
                {plan.limit}
              </span>
              <div className="space-y-2">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/70">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Credits</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Credit Calculation</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Search uses a flexible credit system based on the features you use. Here's how credits are calculated:
        </p>

        <div className="space-y-3">
          {creditExamples.map((example, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h4 className="text-[14px] font-medium text-white">{example.description}</h4>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
                  {example.cost}
                </span>
              </div>
              <code className="text-[12px] font-mono bg-[#050505] border border-white/[0.06] text-white/70 p-2 rounded-sm block">
                {example.example}
              </code>
            </div>
          ))}
        </div>

        <Callout type="tip" title="Credit optimization">
          Only use <code>auto_scrape_top</code>, <code>include_contacts</code>, and <code>include_social</code> when you actually need the additional data to minimize credit usage.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Response Format</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Format</h2>

        <ResponseTable fields={responseFields} />

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Example Success Response</h3>
          <CodeBlock
            code={successResponse}
            language="json"
            title="Search API response"
          />
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Status Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Codes</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 space-y-1">
          <StatusCode code={200} description="Request successful" />
          <StatusCode code={400} description="Bad request - invalid parameters" />
          <StatusCode code={401} description="Unauthorized - invalid API key" />
          <StatusCode code={402} description="Insufficient credits" />
          <StatusCode code={403} description="Feature not available on your plan" />
          <StatusCode code={429} description="Rate limit exceeded" />
          <StatusCode code={500} description="Internal server error" />
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Rate Limits</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Rate Limits</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Plan</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Requests/Hour</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Requests/Minute</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Concurrent</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Free', '10', '1', '1'],
                ['Starter', '1,000', '50', '5'],
                ['Builder', '5,000', '100', '10'],
                ['Unicorn', '20,000', '500', '25']
              ].map((row) => (
                <tr key={row[0]} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-[13px] text-white/80">{row[0]}</td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{row[1]}</td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{row[2]}</td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Rate limit headers">
          Response headers include <code>X-RateLimit-Remaining</code> and <code>X-RateLimit-Reset</code> to help you track your usage.
        </Callout>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">See More Examples</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Explore detailed implementation examples and use cases.
          </p>
          <Link href="/docs/api/search/examples" className="venym-btn-secondary">
            View Examples
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">Other APIs</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Combine Search with our other endpoints.
          </p>
          <div className="flex gap-2">
            <Link href="/docs/api/scrape" className="venym-btn-ghost">
              Scrape
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
