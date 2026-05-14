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
    { endpoint: "/v1/search", method: "POST", description: "Real-time web search with automatic result extraction", credits: "1-2 per request" },
    { endpoint: "/v1/scrape", method: "POST", description: "Extract content from any webpage, bypass protections", credits: "2-5 per request" },
    { endpoint: "/v1/usage", method: "GET", description: "Get current API usage statistics and credits", credits: "Free" },
    { endpoint: "/v1/validate", method: "GET", description: "Validate API key and check account status", credits: "Free" }
  ]

  const statusCodes = [
    { code: "200", status: "OK", tone: "border-emerald-400/20 text-emerald-300/80", description: "Request successful", example: "Normal API response with data" },
    { code: "400", status: "Bad Request", tone: "border-amber-400/20 text-amber-300/80", description: "Invalid request parameters", example: "Missing required field or invalid JSON" },
    { code: "401", status: "Unauthorized", tone: "border-amber-400/20 text-amber-300/80", description: "Invalid or missing API key", example: "API key not found or malformed" },
    { code: "402", status: "Payment Required", tone: "border-violet-400/20 text-violet-300/80", description: "Insufficient credits", example: "Account has no remaining credits" },
    { code: "429", status: "Too Many Requests", tone: "border-sky-400/20 text-sky-300/80", description: "Rate limit exceeded", example: "Too many requests per minute for plan" },
    { code: "500", status: "Internal Server Error", tone: "border-rose-400/20 text-rose-300/80", description: "Server error occurred", example: "Temporary service issue" }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SDK · REST API</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          REST API Documentation
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Complete REST API reference for Venym Search services. Use HTTP requests directly without any SDK dependencies for maximum flexibility and control.
        </p>
      </div>

      <Callout type="info" title="Base URL">
        All API requests should be made to <code>https://www.search.venym.io/api/v1</code>
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Authentication</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Authentication</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          All requests require authentication using your API key in the Authorization header.
        </p>

        <CodeBlock code={authExample} language="bash" title="Required Authentication Header" />

        <div className="mt-6 p-5 border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <h4 className="text-[14px] font-medium text-white mb-2">Important Notes:</h4>
          <ul className="text-[13px] text-white/65 space-y-1.5">
            <li>• Your API key starts with <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">sk_live_YOUR_API_KEY_API_KEY</code> for production</li>
            <li>• Keep your API key secure and never expose it in client-side code</li>
            <li>• Use environment variables to store your API key</li>
            <li>• API keys are tied to your account and billing plan</li>
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Endpoints</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Core Endpoints</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Endpoint</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Method</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Description</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Credits</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint, index) => (
                <tr key={index} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-[13px] font-mono text-white/80">{endpoint.endpoint}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${endpoint.method === 'POST' ? 'border-sky-400/20 text-sky-300/80' : 'border-emerald-400/20 text-emerald-300/80'}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{endpoint.description}</td>
                  <td className="px-6 py-3 text-[13px] text-white/70">{endpoint.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Search</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Search API</h2>

        <APIMethod method="POST" endpoint="/v1/search" description="Real-time web search with automatic result extraction" />

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Search the web in real-time and get structured results with automatic content extraction.
        </p>

        <CodeBlock multiLanguage={swiftSearchExample} title="Search Request Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Scrape</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Scrape API</h2>

        <APIMethod method="POST" endpoint="/v1/scrape" description="Extract content from any webpage, bypass protections" />

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Extract content from any webpage with advanced parsing and protection bypassing.
        </p>

        <CodeBlock multiLanguage={scrapeForgeExample} title="Scrape Request Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Response</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Format</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          All successful API responses follow a consistent JSON format:
        </p>

        <CodeBlock language="json" code={responseExample} title="Successful Response Example" />

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <h4 className="text-[14px] font-medium text-white mb-3">Standard Fields</h4>
            <div className="space-y-2 text-[13px] text-white/70">
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">credits_used</code> - Credits consumed by request</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">remaining_credits</code> - Credits left in account</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">processing_time_ms</code> - Request processing time</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">request_id</code> - Unique request identifier</div>
            </div>
          </div>
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <h4 className="text-[14px] font-medium text-white mb-3">Content Type</h4>
            <div className="space-y-2 text-[13px] text-white/70">
              <div>All responses use <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">application/json</code></div>
              <div>UTF-8 encoding for all text content</div>
              <div>Timestamps in ISO 8601 format</div>
              <div>Numeric IDs as strings for consistency</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Errors</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Responses</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Error responses include detailed information to help debug issues:
        </p>

        <CodeBlock language="json" code={errorResponse} title="Error Response Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Status Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">HTTP Status Codes</h2>

        <div className="space-y-3">
          {statusCodes.map((status, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${status.tone}`}>
                  {status.code}
                </span>
                <span className="text-[15px] font-medium text-white">{status.status}</span>
              </div>
              <p className="text-[13px] text-white/65 mb-1">{status.description}</p>
              <p className="text-[12.5px] text-white/40">Example: {status.example}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">08 · Rate Limiting</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Rate Limiting</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          All requests include rate limit headers for tracking usage:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Rate Limit Headers</span>
            </div>
            <div className="space-y-2 text-[13px] text-white/70">
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-limit</code> - Requests allowed per window</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-remaining</code> - Requests remaining</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-reset</code> - Window reset time (Unix)</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-window</code> - Window duration (seconds)</div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Handling Limits</span>
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5" />
                <span className="text-white/70">Check remaining requests before making calls</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5" />
                <span className="text-white/70">Implement exponential backoff for retries</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5" />
                <span className="text-white/70">Respect retry-after header on 429 responses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">09 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Request Optimization</span>
            </div>
            <ul className="text-[13px] text-white/70 space-y-1.5">
              <li>• Always set appropriate timeouts (30-60 seconds)</li>
              <li>• Use compression headers (Accept-Encoding: gzip)</li>
              <li>• Include User-Agent header for identification</li>
              <li>• Validate request data before sending</li>
              <li>• Handle all possible HTTP status codes</li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Security</span>
            </div>
            <ul className="text-[13px] text-white/70 space-y-1.5">
              <li>• Store API keys in environment variables</li>
              <li>• Use HTTPS for all requests</li>
              <li>• Validate SSL certificates</li>
              <li>• Never log API keys or sensitive data</li>
              <li>• Rotate API keys regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
