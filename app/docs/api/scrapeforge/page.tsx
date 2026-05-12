import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code2, 
  Shield, 
  Zap, 
  Globe,
  Cpu,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Network,
  Lock
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'
import { APIMethod, StatusCode } from '../../components/APIMethod'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'

export default function ScrapeForgeAPIPage() {
  const quickExample = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://example.com/products",
        "render_js": True,
        "wait_for": "#product-list",
        "extract_links": True,
        "follow_redirects": True
    }
)

data = response.json()
print(f"Scraped {len(data['content'])} characters")
print(f"Found {len(data['links'])} links")
print(f"Load time: {data['load_time']}s")`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://www.search.venym.io/api/v1/scrapeforge',
  {
    url: 'https://example.com/products',
    render_js: true,
    wait_for: '#product-list',
    extract_links: true,
    follow_redirects: true
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
  }
);

const data = response.data;
console.log(\`Scraped \${data.content.length} characters\`);
console.log(\`Found \${data.links.length} links\`);
console.log(\`Load time: \${data.load_time}s\`);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/scrapeforge \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/products",
    "render_js": true,
    "wait_for": "#product-list",
    "extract_links": true,
    "follow_redirects": true
  }'`
  }

  const bulkScraping = {
    python: `import requests

# Bulk scraping multiple URLs
urls_to_scrape = [
    "https://example.com/page1",
    "https://example.com/page2", 
    "https://example.com/page3"
]

response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge/bulk",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "urls": urls_to_scrape,
        "render_js": True,
        "concurrent_requests": 3,
        "retry_failed": True,
        "extract_schema": True
    }
)

data = response.json()
print(f"Successfully scraped: {data['successful_count']}")
print(f"Failed: {data['failed_count']}")
print(f"Total credits used: {data['credits_used']}")`,
    javascript: `const axios = require('axios');

// Bulk scraping multiple URLs
const urlsToScrape = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const response = await axios.post(
  'https://www.search.venym.io/api/v1/scrapeforge/bulk',
  {
    urls: urlsToScrape,
    render_js: true,
    concurrent_requests: 3,
    retry_failed: true,
    extract_schema: true
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
  }
);

const data = response.data;
console.log(\`Successfully scraped: \${data.successful_count}\`);
console.log(\`Failed: \${data.failed_count}\`);
console.log(\`Total credits used: \${data.credits_used}\`);`
  }

  const basicParameters = [
    {
      name: "url",
      type: "string",
      required: true,
      description: "The URL to scrape. Must be a valid HTTP/HTTPS URL.",
      example: '"https://example.com/products"'
    },
    {
      name: "render_js",
      type: "boolean", 
      required: false,
      description: "Execute JavaScript on the page before scraping.",
      example: "true"
    },
    {
      name: "wait_for",
      type: "string",
      required: false, 
      description: "CSS selector or XPath to wait for before scraping.",
      example: '"#product-list"'
    },
    {
      name: "extract_links",
      type: "boolean",
      required: false,
      description: "Extract all links found on the page.",
      example: "true"
    },
    {
      name: "follow_redirects",
      type: "boolean",
      required: false,
      description: "Follow HTTP redirects automatically.",
      example: "true"
    }
  ]

  const responseFields = [
    {
      name: "content",
      type: "string",
      description: "The scraped HTML content of the page.",
      example: '"<html><body>...</body></html>"'
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
      description: "Array of links found on the page (if extract_links=true).",
      example: '[{"url": "...", "text": "...", "type": "..."}]'
    },
    {
      name: "load_time",
      type: "float",
      description: "Time taken to load and scrape the page in seconds.",
      example: "2.34"
    },
    {
      name: "status_code",
      type: "integer",
      description: "HTTP status code returned by the target server.",
      example: "200"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed by this request.",
      example: "5"
    }
  ]

  const features = [
    {
      title: "JavaScript Rendering",
      description: "Full browser rendering with Chromium for SPAs and dynamic content",
      icon: Cpu,
      benefits: ["React/Vue/Angular apps", "Dynamic content loading", "AJAX requests"]
    },
    {
      title: "Residential Proxies",
      description: "Premium residential proxy network for high success rates",
      icon: Network,
      benefits: ["99.8% success rate", "Global IP rotation", "Anti-detection"]
    },
    {
      title: "Smart Retry Logic",
      description: "Intelligent retry system with exponential backoff",
      icon: Zap,
      benefits: ["Auto-retry failures", "Rate limit handling", "Optimal timing"]
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade security and compliance for sensitive operations",
      icon: Shield,
      benefits: ["SOC 2 compliant", "Data encryption", "Audit logs"]
    }
  ]

  const useCases = [
    {
      title: "E-commerce Data",
      description: "Product details, pricing, inventory, reviews",
      icon: Database,
      color: "text-blue-600"
    },
    {
      title: "Lead Generation", 
      description: "Contact information, company data, social profiles",
      icon: Globe,
      color: "text-green-600"
    },
    {
      title: "Market Research",
      description: "Competitor analysis, market trends, industry data",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Content Monitoring",
      description: "Brand mentions, news articles, social media",
      icon: Clock,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-xl">
            <Code2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#17457c] mb-2">
              ScrapeForge API
            </h1>
            <p className="text-xl text-gray-600">
              Enterprise web scraping that bypasses any protection
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/docs/api/scrapeforge/parameters">
            <Button size="lg" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
              <Code2 className="w-4 h-4 mr-2" />
              API Reference
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/docs/api/scrapeforge/examples">
            <Button variant="outline" size="lg" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
              View Examples
            </Button>
          </Link>
          
          <Link href="/docs/quickstart">
            <Button variant="ghost" size="lg" className="text-gray-600 hover:text-[#17457c]">
              Quick Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Callout type="success" title="Enterprise-Grade Reliability">
          ScrapeForge handles the most challenging sites with 99.8% success rate, JavaScript rendering, 
          and residential proxy rotation. Perfect for mission-critical data extraction.
        </Callout>
      </div>

      {/* API Method */}
      <div className="mb-16">
        <APIMethod 
          method="POST" 
          endpoint="https://www.search.venym.io/api/v1/scrapeforge"
          description="Scrape any website with enterprise-grade reliability and JavaScript support"
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#17457c] mb-4">Status Codes</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <StatusCode code={200} description="Successfully scraped the target URL" />
            <StatusCode code={400} description="Invalid request parameters or malformed URL" />
            <StatusCode code={403} description="Target site blocked the request" />
            <StatusCode code={429} description="Rate limit exceeded - retry after delay" />
            <StatusCode code={500} description="Internal server error - contact support" />
            <StatusCode code={504} description="Timeout - target site took too long to respond" />
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-4">Quick Start</h2>
        <p className="text-gray-600 mb-6">
          Get started with ScrapeForge in under 2 minutes. Simply provide a URL and get clean, structured data.
        </p>
        
        <CodeBlock
          multiLanguage={quickExample}
          title="Basic scraping with JavaScript rendering"
        />
      </div>

      {/* Core Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="h-full border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Common Use Cases</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-3 p-3 bg-gray-100 rounded-full w-fit">
                  <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                </div>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Parameters Overview */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Key Parameters</h2>
        <ParameterTable 
          parameters={basicParameters}
          title="Essential ScrapeForge Parameters"
        />
        
        <div className="mt-6">
          <Link href="/docs/api/scrapeforge/parameters">
            <Button variant="outline" className="w-full">
              View Complete Parameter Reference
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Response Format */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        <ResponseTable 
          fields={responseFields}
          title="ScrapeForge Response Fields"
        />
      </div>

      {/* Bulk Scraping */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Bulk Scraping</h2>
        <p className="text-gray-600 mb-6">
          Process multiple URLs simultaneously with intelligent load balancing and error handling.
        </p>
        
        <CodeBlock
          multiLanguage={bulkScraping}
          title="Bulk scraping multiple URLs"
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Bulk Scraping Benefits</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Process up to 100 URLs per request</li>
                <li>• Intelligent concurrency control</li>
                <li>• Automatic retry for failed requests</li>
                <li>• Consolidated billing and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="mb-16">
        <Card className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 text-white">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">99.8%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">0.8s</div>
                <div className="text-sm opacity-90">Avg Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">50M+</div>
                <div className="text-sm opacity-90">Pages Scraped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">24/7</div>
                <div className="text-sm opacity-90">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Recommended Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Use specific selectors:</strong>
                <p className="text-sm text-gray-600">Wait for specific elements with wait_for parameter</p>
              </div>
              <div>
                <strong>Enable JS rendering selectively:</strong>
                <p className="text-sm text-gray-600">Only use render_js when necessary to save credits</p>
              </div>
              <div>
                <strong>Handle failures gracefully:</strong>
                <p className="text-sm text-gray-600">Implement proper error handling and retry logic</p>
              </div>
              <div>
                <strong>Respect rate limits:</strong>
                <p className="text-sm text-gray-600">Stay within your plan's concurrent request limits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Common Pitfalls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Scraping too frequently:</strong>
                <p className="text-sm text-gray-600">Balance data freshness with rate limiting</p>
              </div>
              <div>
                <strong>Ignoring robots.txt:</strong>
                <p className="text-sm text-gray-600">Respect website policies and terms of service</p>
              </div>
              <div>
                <strong>Not handling dynamic content:</strong>
                <p className="text-sm text-gray-600">Use render_js for JavaScript-heavy sites</p>
              </div>
              <div>
                <strong>Missing error handling:</strong>
                <p className="text-sm text-gray-600">Always check status codes and handle failures</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/swiftsearch">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            SwiftSearch API
          </Button>
        </Link>
        <Link href="/docs/api/scrapeforge/parameters">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            View Parameters
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}