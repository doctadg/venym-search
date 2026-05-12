import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    {
      name: "query",
      type: "string",
      required: true,
      description: "The search query to execute. Supports natural language queries, keywords, and search operators.",
      example: '"Bitcoin price analysis" OR "crypto market trends"',
      validation: "1-500 characters, must not be empty"
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      description: "Maximum number of search results to return. Higher values consume more credits.",
      example: "10",
      validation: "1-50, default: 10"
    },
    {
      name: "auto_scrape_top",
      type: "integer",
      required: false,
      description: "Number of top results to automatically scrape for content extraction.",
      example: "3",
      validation: "0-10, default: 0"
    },
    {
      name: "include_contacts",
      type: "boolean",
      required: false,
      description: "Extract contact information (emails, phone numbers) from scraped content.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "include_social",
      type: "boolean",
      required: false,
      description: "Extract social media links and handles from scraped content.",
      example: "false",
      validation: "true/false, default: false"
    },
    {
      name: "country",
      type: "string",
      required: false,
      description: "Target country for search results using ISO 3166-1 alpha-2 codes.",
      example: '"US", "GB", "DE"',
      validation: "2-letter country code, default: US"
    },
    {
      name: "language",
      type: "string",
      required: false,
      description: "Preferred language for search results using ISO 639-1 codes.",
      example: '"en", "es", "fr"',
      validation: "2-letter language code, default: en"
    },
    {
      name: "time_range",
      type: "string",
      required: false,
      description: "Filter results by publication time.",
      example: '"24h", "week", "month", "year"',
      validation: "24h, week, month, year, or null"
    },
    {
      name: "safe_search",
      type: "string",
      required: false,
      description: "Filter explicit content from search results.",
      example: '"strict", "moderate", "off"',
      validation: "strict, moderate, off, default: moderate"
    },
    {
      name: "result_type",
      type: "string",
      required: false,
      description: "Type of search results to prioritize.",
      example: '"web", "news", "images", "videos"',
      validation: "web, news, images, videos, default: web"
    }
  ]

  const responseParameters = [
    {
      name: "search_results",
      type: "array",
      description: "Array of search result objects containing title, URL, snippet, and metadata.",
      example: "[{title: '...', link: '...', snippet: '...'}, ...]"
    },
    {
      name: "scraped_content",
      type: "array",
      description: "Array of scraped content from auto_scrape_top results (if enabled).",
      example: "[{url: '...', content: '...', contacts: [...], social: [...]}, ...]"
    },
    {
      name: "total_results",
      type: "integer",
      description: "Total number of search results found (may exceed max_results).",
      example: "1247"
    },
    {
      name: "search_time",
      type: "float",
      description: "Time taken to execute the search query in seconds.",
      example: "0.34"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed by this request.",
      example: "15"
    },
    {
      name: "remaining_credits",
      type: "integer",
      description: "Number of API credits remaining in your account.",
      example: "9985"
    },
    {
      name: "request_id",
      type: "string",
      description: "Unique identifier for this API request (useful for support).",
      example: '"req_1234567890abcdef"'
    }
  ]

  const exampleMinimal = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "query": "latest AI developments"
    }
)`,
    javascript: `const response = await fetch('https://www.search.venym.io/api/v1/search', {
  method: 'POST',
  headers: {
    'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'latest AI developments'
  })
});`,


    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "latest AI developments"
  }'`
  }

  const exampleAdvanced = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
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
    'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here',
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
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_API_KEY_key_here" \\
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">Search Parameters</h1>
            <p className="text-gray-600">Complete parameter reference for the Search API</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/search">
            <Button variant="outline" size="sm">
              ← Overview
            </Button>
          </Link>
          <Link href="/docs/api/search/examples">
            <Button variant="outline" size="sm">
              Examples →
            </Button>
          </Link>
        </div>

        <Callout type="info" title="Parameter Validation">
          All parameters are validated before processing. Invalid parameters will return a 400 error with details about what needs to be corrected.
        </Callout>
      </div>

      {/* Request Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Request Parameters</h2>
        
        <div className="mb-6">
          <ParameterTable 
            parameters={requestParameters}
            title="Search Request Parameters"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Hash className="w-5 h-5" />
                Credit Consumption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Base search:</span>
                <Badge variant="secondary">1 credit</Badge>
              </div>
              <div className="flex justify-between">
                <span>Per result returned:</span>
                <Badge variant="secondary">0.1 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Per page scraped:</span>
                <Badge variant="secondary">2 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Contact extraction:</span>
                <Badge variant="secondary">+0.5 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Social extraction:</span>
                <Badge variant="secondary">+0.3 credits</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Globe className="w-5 h-5" />
                Supported Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-sm">
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
              <p className="text-xs text-gray-500 mt-3">
                And 50+ more countries supported
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        
        <ResponseTable 
          fields={responseParameters}
          title="Search Response Fields"
        />
      </div>

      {/* Example Requests */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Example Requests</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-[#17457c] mb-4">Minimal Request</h3>
            <p className="text-gray-600 mb-4">
              The simplest possible request with just a search query:
            </p>
            <CodeBlock 
              multiLanguage={exampleMinimal}
              title="Minimal Search Request"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#17457c] mb-4">Advanced Request</h3>
            <p className="text-gray-600 mb-4">
              Using all available parameters for maximum functionality:
            </p>
            <CodeBlock 
              multiLanguage={exampleAdvanced}
              title="Advanced Search Request"
            />
          </div>
        </div>
      </div>

      {/* Parameter Tips */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Parameter Tips & Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Query Optimization:</strong>
                <p className="text-sm text-gray-600">Use specific keywords and phrases. Avoid overly broad queries.</p>
              </div>
              <div>
                <strong>Result Limits:</strong>
                <p className="text-sm text-gray-600">Start with max_results=10, increase only if needed to save credits.</p>
              </div>
              <div>
                <strong>Scraping Strategy:</strong>
                <p className="text-sm text-gray-600">Set auto_scrape_top=3-5 for the most valuable content extraction.</p>
              </div>
              <div>
                <strong>Regional Targeting:</strong>
                <p className="text-sm text-gray-600">Use country parameter for location-specific results.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Common Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Empty Queries:</strong>
                <p className="text-sm text-gray-600">Always provide a non-empty query string.</p>
              </div>
              <div>
                <strong>Credit Waste:</strong>
                <p className="text-sm text-gray-600">Don't set max_results too high for exploratory searches.</p>
              </div>
              <div>
                <strong>Invalid Countries:</strong>
                <p className="text-sm text-gray-600">Use ISO 3166-1 alpha-2 codes (e.g., "US", not "USA").</p>
              </div>
              <div>
                <strong>Contact Extraction:</strong>
                <p className="text-sm text-gray-600">Only enable when needed - it increases processing time and costs.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/search">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Search Overview
          </Button>
        </Link>
        <Link href="/docs/api/search/examples">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            View Examples
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}