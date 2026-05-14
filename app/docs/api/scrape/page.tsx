import Link from 'next/link'
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


export default function ScrapeAPIPage() {

  const quickExample = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
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
  'https://www.search.venym.io/api/v1/scrape',
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
    bash: `curl -X POST https://www.search.venym.io/api/v1/scrape \\
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
    "https://www.search.venym.io/api/v1/scrape/bulk",
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
  'https://www.search.venym.io/api/v1/scrape/bulk',
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
    },
    {
      title: "Lead Generation",
      description: "Contact information, company data, social profiles",
      icon: Globe,
    },
    {
      title: "Market Research",
      description: "Competitor analysis, market trends, industry data",
      icon: CheckCircle,
    },
    {
      title: "Content Monitoring",
      description: "Brand mentions, news articles, social media",
      icon: Clock,
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SCRAPE API</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Scrape API
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Enterprise web scraping that bypasses any protection.
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Link href="/docs/api/scrape/parameters" className="venym-btn-primary">
            <Code2 className="w-3.5 h-3.5 mr-1.5" />
            API Reference
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>

          <Link href="/docs/api/scrape/examples" className="venym-btn-secondary">
            View Examples
          </Link>

          <Link href="/docs/quickstart" className="venym-btn-ghost">
            Quick Start
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <Callout type="success" title="Enterprise-Grade Reliability">
          Scrape handles the most challenging sites with 99.8% success rate, JavaScript rendering, and residential proxy rotation. Perfect for mission-critical data extraction.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Endpoint</div>
        <APIMethod
          method="POST"
          endpoint="https://www.search.venym.io/api/v1/scrape"
          description="Scrape any website with enterprise-grade reliability and JavaScript support"
        />

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Status Codes</h3>
          <div className="grid gap-2 md:grid-cols-2 border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <StatusCode code={200} description="Successfully scraped the target URL" />
            <StatusCode code={400} description="Invalid request parameters or malformed URL" />
            <StatusCode code={403} description="Target site blocked the request" />
            <StatusCode code={429} description="Rate limit exceeded - retry after delay" />
            <StatusCode code={500} description="Internal server error - contact support" />
            <StatusCode code={504} description="Timeout - target site took too long to respond" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-3">Quick Start</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Get started with Scrape in under 2 minutes. Simply provide a URL and get clean, structured data.
        </p>

        <CodeBlock
          multiLanguage={quickExample}
          title="Basic scraping with JavaScript rendering"
        />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Core Features</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Core Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-4 h-4 text-emerald-400/80" />
                <span className="text-[15px] font-medium text-white">{feature.title}</span>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed mb-4">{feature.description}</p>
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Use Cases</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 text-center hover:border-white/[0.12] transition-colors">
              <useCase.icon className="w-5 h-5 text-white/50 mx-auto mb-3" />
              <h3 className="text-[14px] font-medium text-white mb-2">{useCase.title}</h3>
              <p className="text-[12.5px] text-white/55">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Parameters</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Key Parameters</h2>
        <ParameterTable parameters={basicParameters} title="Essential Scrape Parameters" />

        <div className="mt-6">
          <Link href="/docs/api/scrape/parameters" className="venym-btn-secondary w-full justify-center">
            View Complete Parameter Reference
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Response</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Format</h2>
        <ResponseTable fields={responseFields} title="Scrape Response Fields" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Bulk Scraping</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-3">Bulk Scraping</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Process multiple URLs simultaneously with intelligent load balancing and error handling.
        </p>

        <CodeBlock
          multiLanguage={bulkScraping}
          title="Bulk scraping multiple URLs"
        />

        <div className="mt-6 p-4 border border-sky-400/20 bg-sky-400/[0.04] rounded-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-sky-400/80 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-white">Bulk Scraping Benefits</h4>
              <ul className="text-[13px] text-white/70 mt-2 space-y-1">
                <li>• Process up to 100 URLs per request</li>
                <li>• Intelligent concurrency control</li>
                <li>• Automatic retry for failed requests</li>
                <li>• Consolidated billing and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8">
          <div className="grid gap-6 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-semibold text-white tabular-nums mb-2">99.8%</div>
              <div className="text-[12px] text-white/50 font-mono uppercase tracking-[0.15em]">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white tabular-nums mb-2">0.8s</div>
              <div className="text-[12px] text-white/50 font-mono uppercase tracking-[0.15em]">Avg Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white tabular-nums mb-2">50M+</div>
              <div className="text-[12px] text-white/50 font-mono uppercase tracking-[0.15em]">Pages Scraped</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white tabular-nums mb-2">24/7</div>
              <div className="text-[12px] text-white/50 font-mono uppercase tracking-[0.15em]">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">08 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Recommended Practices</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div>
                <strong className="text-white">Use specific selectors:</strong>
                <p className="text-white/55">Wait for specific elements with wait_for parameter</p>
              </div>
              <div>
                <strong className="text-white">Enable JS rendering selectively:</strong>
                <p className="text-white/55">Only use render_js when necessary to save credits</p>
              </div>
              <div>
                <strong className="text-white">Handle failures gracefully:</strong>
                <p className="text-white/55">Implement proper error handling and retry logic</p>
              </div>
              <div>
                <strong className="text-white">Respect rate limits:</strong>
                <p className="text-white/55">Stay within your plan's concurrent request limits</p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Common Pitfalls</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div>
                <strong className="text-white">Scraping too frequently:</strong>
                <p className="text-white/55">Balance data freshness with rate limiting</p>
              </div>
              <div>
                <strong className="text-white">Ignoring robots.txt:</strong>
                <p className="text-white/55">Respect website policies and terms of service</p>
              </div>
              <div>
                <strong className="text-white">Not handling dynamic content:</strong>
                <p className="text-white/55">Use render_js for JavaScript-heavy sites</p>
              </div>
              <div>
                <strong className="text-white">Missing error handling:</strong>
                <p className="text-white/55">Always check status codes and handle failures</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api/search" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Search API
        </Link>
        <Link href="/docs/api/scrape/parameters" className="venym-btn-primary">
          View Parameters
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}
