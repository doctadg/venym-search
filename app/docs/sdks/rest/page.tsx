import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Globe, 
  Key,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'
import { APIMethod } from '../../components/APIMethod'

export default function RESTAPIPage() {
  const authExample = `# Authentication Header
Authorization: Bearer sk_live_YOUR_API_KEY_API_KEY_api_key_here

# Alternative format (if your client doesn't support Bearer)
Authorization: sk_live_YOUR_API_KEY_API_KEY_api_key_here`

  const swiftSearchExample = {
    curl: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY_API_KEY_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "latest AI developments 2025",
    "max_results": 10,
    "country": "us",
    "language": "en",
    "safe_search": "moderate"
  }'`,
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer sk_live_YOUR_API_KEY_API_KEY_key"},
    json={
        "query": "latest AI developments 2025",
        "max_results": 10,
        "country": "us", 
        "language": "en",
        "safe_search": "moderate"
    }
)

data = response.json()`,
    javascript: `const response = await fetch('https://www.search.venym.io/api/v1/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_YOUR_API_KEY_API_KEY_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'latest AI developments 2025',
    max_results: 10,
    country: 'us',
    language: 'en',
    safe_search: 'moderate'
  })
});

const data = await response.json();`
  }

  const scrapeForgeExample = {
    curl: `curl -X POST https://www.search.venym.io/api/v1/scrape \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY_API_KEY_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/article",
    "extract_options": ["title", "text", "links", "images"],
    "follow_redirects": true,
    "wait_for_selector": ".content",
    "remove_selectors": [".ads", ".popup"]
  }'`,
    python: `response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer sk_live_YOUR_API_KEY_API_KEY_key"},
    json={
        "url": "https://example.com/article",
        "extract_options": ["title", "text", "links", "images"],
        "follow_redirects": True,
        "wait_for_selector": ".content",
        "remove_selectors": [".ads", ".popup"]
    }
)`,
    javascript: `const response = await fetch('https://www.search.venym.io/api/v1/scrape', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_YOUR_API_KEY_API_KEY_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/article',
    extract_options: ['title', 'text', 'links', 'images'],
    follow_redirects: true,
    wait_for_selector: '.content',
    remove_selectors: ['.ads', '.popup']
  })
});`
  }

  const responseExample = `{
  "search_results": [
    {
      "title": "AI Breakthrough: New Language Model Achieves Human-Level Reasoning",
      "link": "https://example.com/ai-news",
      "snippet": "Researchers announce significant advancement in AI reasoning capabilities...",
      "position": 1,
      "date": "2025-01-15",
      "relevance_score": 0.95
    }
  ],
  "credits_used": 1,
  "remaining_credits": 4999,
  "results_count": 10,
  "processing_time_ms": 1250,
  "request_id": "req_abc123"
}`

  const errorResponse = `{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED", 
  "details": "You have exceeded the rate limit for your plan. Please wait before making more requests.",
  "retry_after": 60,
  "request_id": "req_def456",
  "timestamp": "2025-01-15T10:30:00Z",
  "documentation_url": "https://docs.search.venym.io/errors"
}`

  const endpoints = [
    {
      endpoint: "/v1/search",
      method: "POST",
      description: "Real-time web search with automatic result extraction",
      credits: "1-2 per request"
    },
    {
      endpoint: "/v1/scrape",
      method: "POST", 
      description: "Extract content from any webpage, bypass protections",
      credits: "2-5 per request"
    },
    {      endpoint: "/v1/usage",
      method: "GET",
      description: "Get current API usage statistics and credits",
      credits: "Free"
    },
    {
      endpoint: "/v1/validate",
      method: "GET", 
      description: "Validate API key and check account status",
      credits: "Free"
    }
  ]

  const statusCodes = [
    {
      code: "200",
      status: "OK",
      description: "Request successful",
      example: "Normal API response with data"
    },
    {
      code: "400",
      status: "Bad Request",
      description: "Invalid request parameters",
      example: "Missing required field or invalid JSON"
    },
    {
      code: "401", 
      status: "Unauthorized",
      description: "Invalid or missing API key",
      example: "API key not found or malformed"
    },
    {
      code: "402",
      status: "Payment Required",
      description: "Insufficient credits",
      example: "Account has no remaining credits"
    },
    {
      code: "429",
      status: "Too Many Requests", 
      description: "Rate limit exceeded",
      example: "Too many requests per minute for plan"
    },
    {
      code: "500",
      status: "Internal Server Error",
      description: "Server error occurred",
      example: "Temporary service issue"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            REST API
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          REST API Documentation
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Complete REST API reference for Venym Search services. Use HTTP requests directly 
          without any SDK dependencies for maximum flexibility and control.
        </p>
      </div>

      <Callout type="info" title="Base URL">
        All API requests should be made to <code>https://www.search.venym.io/api/v1</code>
      </Callout>

      {/* Authentication */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Authentication</h2>
        
        <p className="text-gray-600 mb-6">
          All requests require authentication using your API key in the Authorization header.
        </p>
        
        <CodeBlock
          code={authExample}
          language="bash"
          title="Required Authentication Header"
        />
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Your API key starts with <code className="bg-white px-2 py-1 rounded">sk_live_YOUR_API_KEY_API_KEY</code> for production</li>
            <li>• Keep your API key secure and never expose it in client-side code</li>
            <li>• Use environment variables to store your API key</li>
            <li>• API keys are tied to your account and billing plan</li>
          </ul>
        </div>
      </div>

      {/* Core Endpoints */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Endpoints</h2>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Endpoint</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {endpoints.map((endpoint, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-[#17457c]">
                        {endpoint.endpoint}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge className={`${endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} hover:${endpoint.method === 'POST' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {endpoint.method}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{endpoint.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{endpoint.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search API */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Search API</h2>
        
        <APIMethod
          method="POST"
          endpoint="/v1/search"
          description="Real-time web search with automatic result extraction"
        />
        
        <p className="text-gray-600 mb-6">
          Search the web in real-time and get structured results with automatic content extraction.
        </p>
        
        <CodeBlock
          multiLanguage={swiftSearchExample}
          title="Search Request Example"
        />
      </div>

      {/* Scrape API */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Scrape API</h2>
        
        <APIMethod
          method="POST" 
          endpoint="/v1/scrape"
          description="Extract content from any webpage, bypass protections"
        />
        
        <p className="text-gray-600 mb-6">
          Extract content from any webpage with advanced parsing and protection bypassing.
        </p>
        
        <CodeBlock
          multiLanguage={scrapeForgeExample}
          title="Scrape Request Example"
        />
      </div>

      {/* Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        
        <p className="text-gray-600 mb-6">
          All successful API responses follow a consistent JSON format:
        </p>
        
        <CodeBlock
          language="json"
          code={responseExample}
          title="Successful Response Example"
        />
        
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Standard Fields</h4>
            <div className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">credits_used</code> - Credits consumed by request</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">remaining_credits</code> - Credits left in account</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">processing_time_ms</code> - Request processing time</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">request_id</code> - Unique request identifier</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Content Type</h4>
            <div className="space-y-2 text-sm">
              <div>All responses use <code className="bg-gray-100 px-2 py-1 rounded">application/json</code></div>
              <div>UTF-8 encoding for all text content</div>
              <div>Timestamps in ISO 8601 format</div>
              <div>Numeric IDs as strings for consistency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Responses</h2>
        
        <p className="text-gray-600 mb-6">
          Error responses include detailed information to help debug issues:
        </p>
        
        <CodeBlock
          language="json"
          code={errorResponse}
          title="Error Response Example"
        />
      </div>

      {/* Status Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">HTTP Status Codes</h2>
        
        <div className="grid gap-4 md:grid-cols-1">
          {statusCodes.map((status, index) => (
            <Card key={index} className="border-l-4 border-l-gray-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Badge className={`
                    ${status.code === '200' ? 'bg-green-100 text-green-800' : ''}
                    ${status.code === '400' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${status.code === '401' ? 'bg-orange-100 text-orange-800' : ''}
                    ${status.code === '402' ? 'bg-purple-100 text-purple-800' : ''}
                    ${status.code === '429' ? 'bg-blue-100 text-blue-800' : ''}
                    ${status.code === '500' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {status.code}
                  </Badge>
                  <span className="text-gray-900">{status.status}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{status.description}</p>
                <p className="text-sm text-gray-500">Example: {status.example}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Rate Limiting</h2>
        
        <p className="text-gray-600 mb-6">
          All requests include rate limit headers for tracking usage:
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#efa72d]" />
                Rate Limit Headers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">x-ratelimit-limit</code> - Requests allowed per window</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">x-ratelimit-remaining</code> - Requests remaining</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">x-ratelimit-reset</code> - Window reset time (Unix)</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">x-ratelimit-window</code> - Window duration (seconds)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Handling Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Check remaining requests before making calls</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Implement exponential backoff for retries</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Respect retry-after header on 429 responses</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Request Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Always set appropriate timeouts (30-60 seconds)</div>
              <div>• Use compression headers (Accept-Encoding: gzip)</div>
              <div>• Include User-Agent header for identification</div>
              <div>• Validate request data before sending</div>
              <div>• Handle all possible HTTP status codes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Store API keys in environment variables</div>
              <div>• Use HTTPS for all requests</div>
              <div>• Validate SSL certificates</div>
              <div>• Never log API keys or sensitive data</div>
              <div>• Rotate API keys regularly</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}