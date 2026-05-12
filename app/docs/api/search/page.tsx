import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
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
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
  }
);

const data = response.data;
console.log(\`Found \${data.search_results.length} results\`);
console.log(\`Scraped \${data.scraped_content.length} pages\`);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_API_KEY_key_here" \\
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Real-time Search
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Search API
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Real-time web search with automatic content extraction, contact discovery, 
          and social profile detection. Get structured results from the latest web content.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-[#efa72d] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">17ms</div>
            <div className="text-sm text-gray-600">Avg latency</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">99.3%</div>
            <div className="text-sm text-gray-600">Success rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">Real-time</div>
            <div className="text-sm text-gray-600">Fresh results</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">1 credit</div>
            <div className="text-sm text-gray-600">Starting cost</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Example</h2>
        <CodeBlock
          multiLanguage={quickExample}
          title="Search with automatic content extraction"
        />
      </div>

      {/* API Endpoint */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">API Endpoint</h2>
        <APIMethod
          method="POST"
          endpoint="/v1/search"
          description="Execute a real-time web search with optional content extraction and data enrichment"
        />

        <Callout type="info" title="Base URL">
          All requests should be made to <code>https://www.search.venym.io/api</code>
        </Callout>
      </div>

      {/* Parameters */}
      <div className="mb-12">
        <ParameterTable parameters={parameters} />
      </div>

      {/* Feature Access by Plan */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Feature Access by Plan</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-gray-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Free</CardTitle>
              <Badge variant="secondary" className="w-fit">10 requests/hour</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Basic search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Auto-scraping</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Starter</CardTitle>
              <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-100">1K requests/hour</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Everything in Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Contact extraction</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Builder</CardTitle>
              <Badge className="w-fit bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">5K requests/hour</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Everything in Starter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Social discovery</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Unicorn</CardTitle>
              <Badge className="w-fit bg-purple-100 text-purple-800 hover:bg-purple-100">20K requests/hour</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">All features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Priority processing</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Credit Calculation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Credit Calculation</h2>
        
        <p className="text-gray-600 mb-6">
          Search uses a flexible credit system based on the features you use. Here's how credits are calculated:
        </p>

        <div className="space-y-4">
          {creditExamples.map((example, index) => (
            <Card key={index} className="border-l-4 border-l-[#efa72d]/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{example.description}</h4>
                  <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">
                    {example.cost}
                  </Badge>
                </div>
                <code className="text-sm bg-gray-100 p-2 rounded block text-gray-700">
                  {example.example}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>

        <Callout type="tip" title="Credit optimization">
          Only use <code>auto_scrape_top</code>, <code>include_contacts</code>, and <code>include_social</code> when you actually need the additional data to minimize credit usage.
        </Callout>
      </div>

      {/* Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        
        <ResponseTable fields={responseFields} />

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Success Response</h3>
          <CodeBlock
            code={successResponse}
            language="json"
            title="Search API response"
          />
        </div>
      </div>

      {/* Status Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Codes</h2>
        
        <div className="space-y-3">
          <StatusCode code={200} description="Request successful" />
          <StatusCode code={400} description="Bad request - invalid parameters" />
          <StatusCode code={401} description="Unauthorized - invalid API key" />
          <StatusCode code={402} description="Insufficient credits" />
          <StatusCode code={403} description="Feature not available on your plan" />
          <StatusCode code={429} description="Rate limit exceeded" />
          <StatusCode code={500} description="Internal server error" />
        </div>
      </div>

      {/* Rate Limits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Rate Limits</h2>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requests/Hour</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requests/Minute</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Concurrent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-3 text-sm text-gray-900">Free</td>
                <td className="px-6 py-3 text-sm text-gray-600">10</td>
                <td className="px-6 py-3 text-sm text-gray-600">1</td>
                <td className="px-6 py-3 text-sm text-gray-600">1</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-900">Starter</td>
                <td className="px-6 py-3 text-sm text-gray-600">1,000</td>
                <td className="px-6 py-3 text-sm text-gray-600">50</td>
                <td className="px-6 py-3 text-sm text-gray-600">5</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-900">Builder</td>
                <td className="px-6 py-3 text-sm text-gray-600">5,000</td>
                <td className="px-6 py-3 text-sm text-gray-600">100</td>
                <td className="px-6 py-3 text-sm text-gray-600">10</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-900">Unicorn</td>
                <td className="px-6 py-3 text-sm text-gray-600">20,000</td>
                <td className="px-6 py-3 text-sm text-gray-600">500</td>
                <td className="px-6 py-3 text-sm text-gray-600">25</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Rate limit headers">
          Response headers include <code>X-RateLimit-Remaining</code> and <code>X-RateLimit-Reset</code> to help you track your usage.
        </Callout>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#efa72d]" />
              See More Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore detailed implementation examples and use cases.
            </p>
            <Link href="/docs/api/search/examples">
              <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                View Examples
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#17457c]" />
              Other APIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/scrape">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Scrape
                </Button>
              </Link>
      </div>
    </div>
  )
}