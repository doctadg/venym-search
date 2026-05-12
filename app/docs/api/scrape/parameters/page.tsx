import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Settings, 
  Code2, 
  Globe,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Cpu,
  Network,
  Zap
} from 'lucide-react'
import { CodeBlock } from '../../../components/CodeBlock'
import { Callout } from '../../../components/Callout'
import { ParameterTable, ResponseTable } from '../../../components/ParameterTable'


export default function ScrapeParametersPage() {
  const coreParameters = [
    {
      name: "url",
      type: "string",
      required: true,
      description: "The target URL to scrape. Must be a valid HTTP/HTTPS URL with proper encoding.",
      example: '"https://example.com/products"',
      validation: "Valid URL format, max 2048 characters"
    },
    {
      name: "render_js",
      type: "boolean",
      required: false,
      description: "Execute JavaScript on the page using a real browser engine (Chromium).",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "wait_for",
      type: "string",
      required: false,
      description: "CSS selector or XPath to wait for before considering the page loaded.",
      example: '"#product-list", "//div[@class=\\"content\\"]"',
      validation: "Valid CSS selector or XPath"
    },
    {
      name: "wait_time",
      type: "integer",
      required: false,
      description: "Maximum time to wait for the wait_for element in seconds.",
      example: "10",
      validation: "1-60 seconds, default: 10"
    },
    {
      name: "user_agent",
      type: "string",
      required: false,
      description: "Custom User-Agent string to use for the request.",
      example: '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"',


      validation: "Valid User-Agent string, max 500 characters"
    },
    {
      name: "proxy_type",
      type: "string",
      required: false,
      description: "Type of proxy to use for the request.",
      example: '"residential", "datacenter", "mobile"',
      validation: "residential, datacenter, mobile, default: residential"
    },
    {
      name: "proxy_country",
      type: "string",
      required: false,
      description: "Target country for proxy location using ISO 3166-1 alpha-2 codes.",
      example: '"US", "GB", "DE"',
      validation: "2-letter country code, default: random"
    }
  ]

  const advancedParameters = [
    {
      name: "extract_links",
      type: "boolean",
      required: false,
      description: "Extract all links found on the page with their text and attributes.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "extract_images",
      type: "boolean",
      required: false,
      description: "Extract all images with their URLs, alt text, and dimensions.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "extract_schema",
      type: "boolean",
      required: false,
      description: "Extract structured data (JSON-LD, Microdata, RDFa) from the page.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "extract_meta",
      type: "boolean",
      required: false,
      description: "Extract meta tags, Open Graph, and Twitter Card data.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "custom_headers",
      type: "object",
      required: false,
      description: "Custom HTTP headers to include with the request.",
      example: '{"Authorization": "Bearer token", "X-Custom": "value"}',
      validation: "Valid JSON object, max 10 headers"
    },
    {
      name: "cookies",
      type: "object",
      required: false,
      description: "Cookies to include with the request.",
      example: '{"session_id": "abc123", "user_pref": "value"}',
      validation: "Valid JSON object, max 20 cookies"
    },
    {
      name: "screenshot",
      type: "boolean",
      required: false,
      description: "Capture a screenshot of the page (requires render_js=true).",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "screenshot_options",
      type: "object",
      required: false,
      description: "Screenshot configuration options.",
      example: '{"format": "png", "quality": 90, "full_page": true}',
      validation: "format: png/jpg, quality: 1-100, full_page: boolean"
    }
  ]

  const bulkParameters = [
    {
      name: "urls",
      type: "array",
      required: true,
      description: "Array of URLs to scrape in bulk (max 100 URLs per request).",
      example: '["https://site1.com", "https://site2.com", "https://site3.com"]',
      validation: "1-100 valid URLs"
    },
    {
      name: "concurrent_requests",
      type: "integer",
      required: false,
      description: "Number of URLs to process simultaneously.",
      example: "5",
      validation: "1-10, default: 3"
    },
    {
      name: "retry_failed",
      type: "boolean",
      required: false, 
      description: "Automatically retry failed requests with different proxies.",
      example: "true",
      validation: "true/false, default: true"
    },
    {
      name: "max_retries",
      type: "integer",
      required: false,
      description: "Maximum number of retry attempts for failed requests.",
      example: "3",
      validation: "0-5, default: 2"
    },
    {
      name: "callback_url",
      type: "string",
      required: false,
      description: "Webhook URL to receive results asynchronously.",
      example: '"https://your-api.com/webhook"',
      validation: "Valid HTTPS URL"
    }
  ]

  const responseParameters = [
    {
      name: "content",
      type: "string",
      description: "The raw HTML content of the scraped page.",
      example: '"<html><head>...</head><body>...</body></html>"'
    },
    {
      name: "text_content", 
      type: "string",
      description: "Plain text content extracted from HTML (JavaScript-rendered if applicable).",
      example: '"Welcome to our store. Browse our latest products..."'
    },
    {
      name: "links",
      type: "array",
      description: "Array of link objects with URL, text, and attributes (if extract_links=true).",
      example: '[{"url": "...", "text": "...", "rel": "...", "target": "..."}]'
    },
    {
      name: "images",
      type: "array", 
      description: "Array of image objects with src, alt, and dimensions (if extract_images=true).",
      example: '[{"src": "...", "alt": "...", "width": 800, "height": 600}]'
    },
    {
      name: "schema_data",
      type: "array",
      description: "Structured data found on the page (if extract_schema=true).",
      example: '[{"@type": "Product", "name": "...", "price": "..."}]'
    },
    {
      name: "meta_data",
      type: "object",
      description: "Meta tags, Open Graph, and Twitter Card data (if extract_meta=true).",
      example: '{"title": "...", "description": "...", "og:image": "..."}'
    },
    {
      name: "screenshot_url",
      type: "string",
      description: "URL to the captured screenshot (if screenshot=true).",
      example: '"https://cdn.VENYM_SEARCH.com/screenshots/abc123.png"'
    },
    {
      name: "load_time",
      type: "float",
      description: "Total time taken to load and process the page in seconds.",
      example: "2.847"
    },
    {
      name: "status_code",
      type: "integer",
      description: "HTTP status code returned by the target server.",
      example: "200"
    },
    {
      name: "final_url",
      type: "string", 
      description: "Final URL after following redirects.",
      example: '"https://example.com/products"'
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed by this request.",
      example: "7"
    }
  ]

  const basicExample = {
    python: `import requests

# Basic scraping with minimal parameters
response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://example.com/products",
        "render_js": False,
        "extract_links": True
    }
)`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://www.search.venym.io/api/v1/scrape',
  {
    url: 'https://example.com/products',
    render_js: false,
    extract_links: true
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
  }
);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/scrape \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/products",
    "render_js": false,
    "extract_links": true
  }'`
  }

  const advancedExample = {
    python: `import requests

# Advanced scraping with all features
response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://spa-example.com/dashboard",
        "render_js": True,
        "wait_for": "#dashboard-content",
        "wait_time": 15,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "proxy_type": "residential",
        "proxy_country": "US",
        "extract_links": True,
        "extract_images": True,
        "extract_schema": True,
        "extract_meta": True,
        "screenshot": True,
        "screenshot_options": {
            "format": "png",
            "quality": 90,
            "full_page": True
        },
        "custom_headers": {
            "Authorization": "Bearer token123",
            "X-Requested-With": "XMLHttpRequest"
        },
        "cookies": {
            "session_id": "abc123xyz",
            "user_preference": "dark_mode"
        }
    }
)`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://www.search.venym.io/api/v1/scrape',
  {
    url: 'https://spa-example.com/dashboard',
    render_js: true,
    wait_for: '#dashboard-content',
    wait_time: 15,
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    proxy_type: 'residential',
    proxy_country: 'US',
    extract_links: true,
    extract_images: true,
    extract_schema: true,
    extract_meta: true,
    screenshot: true,
    screenshot_options: {
      format: 'png',
      quality: 90,
      full_page: true
    },
    custom_headers: {
      'Authorization': 'Bearer token123',
      'X-Requested-With': 'XMLHttpRequest'
    },
    cookies: {
      session_id: 'abc123xyz',
      user_preference: 'dark_mode'
    }
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
  }
);`
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Settings className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">Scrape Parameters</h1>
            <p className="text-gray-600">Complete parameter reference for enterprise web scraping</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/scrape">
            <Button variant="outline" size="sm">
              ← Overview
            </Button>
          </Link>
          <Link href="/docs/api/scrape/examples">
            <Button variant="outline" size="sm">
              Examples →
            </Button>
          </Link>
        </div>

        <Callout type="info" title="Enterprise Features">
          Scrape includes advanced features like JavaScript rendering, residential proxies, 
          and comprehensive data extraction. Credit consumption varies based on features used.
        </Callout>
      </div>

      {/* Core Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Parameters</h2>
        
        <ParameterTable 
          parameters={coreParameters}
          title="Essential Scrape Parameters"
        />
      </div>

      {/* Advanced Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Parameters</h2>
        
        <ParameterTable 
          parameters={advancedParameters}
          title="Advanced Extraction & Rendering Options"
        />
      </div>

      {/* Bulk Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Bulk Scraping Parameters</h2>
        
        <ParameterTable 
          parameters={bulkParameters}
          title="Bulk Processing Options"
        />

        <Callout type="warning" title="Bulk Scraping Limits">
          Bulk requests are limited to 100 URLs per request. For larger datasets, 
          use multiple requests or contact support for enterprise solutions.
        </Callout>
      </div>

      {/* Credit Consumption */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Credit Consumption</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Zap className="w-5 h-5" />
                Base Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Basic scraping:</span>
                <Badge variant="secondary">3 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>JavaScript rendering:</span>
                <Badge variant="secondary">+5 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Residential proxy:</span>
                <Badge variant="secondary">+2 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Mobile proxy:</span>
                <Badge variant="secondary">+4 credits</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Code2 className="w-5 h-5" />
                Feature Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Link extraction:</span>
                <Badge variant="secondary">+1 credit</Badge>
              </div>
              <div className="flex justify-between">
                <span>Image extraction:</span>
                <Badge variant="secondary">+1 credit</Badge>
              </div>
              <div className="flex justify-between">
                <span>Schema extraction:</span>
                <Badge variant="secondary">+2 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Screenshot capture:</span>
                <Badge variant="secondary">+3 credits</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        
        <ResponseTable 
          fields={responseParameters}
          title="Scrape Response Fields"
        />
      </div>

      {/* Example Requests */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Example Requests</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-[#17457c] mb-4">Basic Request</h3>
            <p className="text-gray-600 mb-4">
              Simple scraping without JavaScript rendering for static content:
            </p>
            <CodeBlock 
              multiLanguage={basicExample}
              title="Basic Scrape Request"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#17457c] mb-4">Advanced Request</h3>
            <p className="text-gray-600 mb-4">
              Full-featured scraping with all extraction options and JavaScript rendering:
            </p>
            <CodeBlock 
              multiLanguage={advancedExample}
              title="Advanced Scrape Request"
            />
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Technical Details</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Cpu className="w-5 h-5" />
                JavaScript Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Chromium-based rendering</div>
              <div>• Full ES6+ support</div>
              <div>• DOM manipulation handling</div>
              <div>• AJAX/Fetch request processing</div>
              <div>• Custom wait conditions</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Network className="w-5 h-5" />
                Proxy Network
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• 100M+ residential IPs</div>
              <div>• 200+ countries available</div>
              <div>• Automatic IP rotation</div>
              <div>• High-speed datacenter options</div>
              <div>• Mobile carrier networks</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Shield className="w-5 h-5" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• TLS 1.3 encryption</div>
              <div>• Browser fingerprint masking</div>
              <div>• Anti-bot detection bypass</div>
              <div>• Request signature hiding</div>
              <div>• Behavioral mimicking</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Parameter Best Practices</h2>
        
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
                <strong>Use render_js selectively:</strong>
                <p className="text-sm text-gray-600">Only enable for dynamic content to save credits and time.</p>
              </div>
              <div>
                <strong>Set appropriate wait_for:</strong>
                <p className="text-sm text-gray-600">Use specific selectors for critical elements.</p>
              </div>
              <div>
                <strong>Choose right proxy type:</strong>
                <p className="text-sm text-gray-600">Residential for high-protection sites, datacenter for speed.</p>
              </div>
              <div>
                <strong>Batch similar requests:</strong>
                <p className="text-sm text-gray-600">Use bulk endpoint for multiple URLs from same domain.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Incorrect wait_for selectors:</strong>
                <p className="text-sm text-gray-600">Test selectors in browser dev tools first.</p>
              </div>
              <div>
                <strong>Too short wait_time:</strong>
                <p className="text-sm text-gray-600">Allow sufficient time for slow-loading content.</p>
              </div>
              <div>
                <strong>Missing required headers:</strong>
                <p className="text-sm text-gray-600">Some sites require specific headers for access.</p>
              </div>
              <div>
                <strong>Invalid custom headers:</strong>
                <p className="text-sm text-gray-600">Ensure header names and values are properly formatted.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/scrape">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Scrape Overview
          </Button>
        </Link>
        <Link href="/docs/api/scrape/examples">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            View Examples
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}