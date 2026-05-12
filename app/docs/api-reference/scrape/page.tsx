import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code2, 
  ArrowRight,
  BookOpen,
  Cpu,
  Shield,
  Network,
  Zap
} from 'lucide-react'
import { APITester } from '../../components/APITester'
import { Callout } from '../../components/Callout'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'


export default function ScrapeAPIReferencePage() {

  const parameters = [
    {
      name: "url",
      type: "string",
      required: true,
      description: "The target URL to scrape. Must be a valid HTTP/HTTPS URL.",
      example: "https://example.com/products"
    },
    {
      name: "render_js",
      type: "boolean",
      required: false,
      description: "Execute JavaScript on the page using Chromium browser engine."
    },
    {
      name: "wait_for",
      type: "string",
      required: false,
      description: "CSS selector or XPath to wait for before scraping.",
      example: "#product-list"
    },
    {
      name: "wait_time",
      type: "integer",
      required: false,
      description: "Maximum time to wait for elements in seconds (1-60).",
      example: "10"
    },
    {
      name: "user_agent",
      type: "string",
      required: false,
      description: "Custom User-Agent string for the request.",
      example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


    },
    {
      name: "proxy_type",
      type: "string",
      required: false,
      description: "Type of proxy to use for the request.",
      options: ["residential", "datacenter", "mobile"]
    },
    {
      name: "proxy_country",
      type: "string",
      required: false,
      description: "Target country for proxy location (ISO 3166-1 alpha-2).",
      example: "US",
      options: ["US", "GB", "DE", "FR", "ES", "IT", "CA", "AU", "BR", "IN", "JP"]
    },
    {
      name: "extract_links",
      type: "boolean",
      required: false,
      description: "Extract all links found on the page with metadata."
    },
    {
      name: "extract_images",
      type: "boolean",
      required: false,
      description: "Extract all images with URLs, alt text, and dimensions."
    },
    {
      name: "extract_schema",
      type: "boolean",
      required: false,
      description: "Extract structured data (JSON-LD, Microdata, RDFa)."
    },
    {
      name: "extract_meta",
      type: "boolean",
      required: false,
      description: "Extract meta tags, Open Graph, and Twitter Card data."
    },
    {
      name: "screenshot",
      type: "boolean",
      required: false,
      description: "Capture a screenshot of the page (requires render_js=true)."
    },
    {
      name: "custom_headers",
      type: "object",
      required: false,
      description: "Custom HTTP headers to include with the request.",
      example: '{"Authorization": "Bearer token"}'
    },
    {
      name: "cookies",
      type: "object",
      required: false,
      description: "Cookies to include with the request.",
      example: '{"session_id": "abc123"}'
    }
  ]

  const exampleRequest = {
    url: "https://example.com/products",
    render_js: true,
    wait_for: "#product-list",
    wait_time: 10,
    proxy_type: "residential",
    proxy_country: "US",
    extract_links: true,
    extract_images: false,
    extract_schema: true,
    extract_meta: true,
    screenshot: false,
    custom_headers: {},
    cookies: {}
  }

  const responseFields = [
    {
      name: "content",
      type: "string",
      description: "The raw HTML content of the scraped page.",
      example: '"<html><head>...</head><body>...</body></html>"'
    },
    {
      name: "text_content",
      type: "string", 
      description: "Plain text content extracted from HTML.",
      example: '"Welcome to our product catalog..."'
    },
    {
      name: "links",
      type: "array",
      description: "Array of link objects with URL, text, and attributes.",
      example: '[{"url": "...", "text": "...", "rel": "...", "target": "..."}]'
    },
    {
      name: "images",
      type: "array",
      description: "Array of image objects with src, alt, and dimensions.",
      example: '[{"src": "...", "alt": "...", "width": 800, "height": 600}]'
    },
    {
      name: "schema_data",
      type: "array",
      description: "Structured data found on the page.",
      example: '[{"@type": "Product", "name": "...", "price": "..."}]'
    },
    {
      name: "meta_data",
      type: "object",
      description: "Meta tags, Open Graph, and Twitter Card data.",
      example: '{"title": "...", "description": "...", "og:image": "..."}'
    },
    {
      name: "screenshot_url",
      type: "string",
      description: "URL to the captured screenshot (if enabled).",
      example: '"https://cdn.VENYM_SEARCH.com/screenshots/abc123.png"'
    },
    {
      name: "load_time",
      type: "float",
      description: "Time taken to load and process the page in seconds.",
      example: "2.34"
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

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Code2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">Scrape API Reference</h1>
            <p className="text-gray-600">Interactive testing for enterprise web scraping</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/scrape">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              View Guide
            </Button>
          </Link>
          <Link href="/docs/api/scrape/examples">
            <Button variant="outline" size="sm">
              <Code2 className="w-4 h-4 mr-2" />
              Examples
            </Button>
          </Link>
        </div>

        <Callout type="success" title="Enterprise Web Scraping">
          Test Scrape's enterprise-grade scraping capabilities including JavaScript rendering, 
          residential proxies, and comprehensive data extraction.
        </Callout>
      </div>

      {/* API Tester */}
      <div className="mb-12">
        <APITester
          endpoint="https://www.search.venym.io/api/v1/scrape"
          method="POST"
          title="Scrape Any Website"
          description="Enterprise web scraping with JavaScript rendering, proxy rotation, and comprehensive data extraction"
          parameters={parameters}
          exampleRequest={exampleRequest}
          demoApiKey="demo_sk_scrape_67890"
        />
      </div>

      {/* Response Schema */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Schema</h2>
        <ResponseTable 
          fields={responseFields}
          title="Scrape Response Fields"
        />
      </div>

      {/* Enterprise Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Enterprise Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Cpu className="w-5 h-5" />
                JavaScript Rendering
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Chromium browser engine</div>
              <div>• Full ES6+ support</div>
              <div>• DOM manipulation</div>
              <div>• AJAX/Fetch requests</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Network className="w-5 h-5" />
                Proxy Network
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• 100M+ residential IPs</div>
              <div>• 200+ countries</div>
              <div>• Automatic rotation</div>
              <div>• High-speed datacenters</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Shield className="w-5 h-5" />
                Anti-Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Browser fingerprinting</div>
              <div>• Bot detection bypass</div>
              <div>• CAPTCHA handling</div>
              <div>• Behavioral mimicking</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Zap className="w-5 h-5" />
                Data Extraction
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Structured data parsing</div>
              <div>• Link extraction</div>
              <div>• Image processing</div>
              <div>• Meta data analysis</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bulk Scraping */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Bulk Scraping</h2>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">POST</code>
              /v1/scrape/bulk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Process up to 100 URLs simultaneously with intelligent load balancing and error handling.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`{
  "urls": [
    "https://site1.com/page1",
    "https://site2.com/page2",
    "https://site3.com/page3"
  ],
  "render_js": true,
  "concurrent_requests": 3,
  "retry_failed": true,
  "max_retries": 2
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Codes</h2>
        <div className="space-y-3">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-green-100 text-green-700 mb-2">200 OK</Badge>
                  <p className="text-sm">Page scraped successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="destructive" className="mb-2">400 Bad Request</Badge>
                  <p className="text-sm">Invalid URL or parameters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-orange-100 text-orange-700 mb-2">403 Forbidden</Badge>
                  <p className="text-sm">Target site blocked the request</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-purple-100 text-purple-700 mb-2">504 Gateway Timeout</Badge>
                  <p className="text-sm">Target site took too long to respond</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">E-commerce Data</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Extract product details, prices, and inventory</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "url": "https://shop.example.com/product/123",
  "render_js": true,
  "wait_for": ".price",
  "extract_schema": true,
  "extract_images": true
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">News Articles</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Extract article content and metadata</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "url": "https://news.example.com/article/123",
  "extract_meta": true,
  "extract_links": true,
  "proxy_type": "residential"
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Scrape posts, comments, and user profiles</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "url": "https://social.example.com/profile/user",
  "render_js": true,
  "wait_for": ".posts-container",
  "screenshot": true,
  "proxy_type": "residential"
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real Estate</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Extract property listings and details</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "url": "https://realty.example.com/listing/123",
  "extract_schema": true,
  "extract_images": true,
  "extract_meta": true,
  "proxy_country": "US"
}`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Credit Consumption */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Credit Consumption</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#17457c]">Base Costs</CardTitle>
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
                <span>Screenshot capture:</span>
                <Badge variant="secondary">+3 credits</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#17457c]">Extraction Features</CardTitle>
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
                <span>Meta data extraction:</span>
                <Badge variant="secondary">+1 credit</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api-reference/search">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Search API Reference
          </Button>
        </Link>
      </div>
    </div>
  )
}
