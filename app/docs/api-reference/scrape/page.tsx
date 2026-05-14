import Link from 'next/link'
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
      <div className="mb-10">
        <div className="venym-meta mb-3">SCRAPE API · REFERENCE</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Scrape API Reference
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Interactive testing for enterprise web scraping.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/docs/api/scrape" className="venym-btn-secondary">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            View Guide
          </Link>
          <Link href="/docs/api/scrape/examples" className="venym-btn-secondary">
            <Code2 className="w-3.5 h-3.5 mr-1.5" />
            Examples
          </Link>
        </div>

        <Callout type="success" title="Enterprise Web Scraping">
          Test Scrape's enterprise-grade scraping capabilities including JavaScript rendering, residential proxies, and comprehensive data extraction.
        </Callout>
      </div>

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

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Response Schema</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Schema</h2>
        <ResponseTable fields={responseFields} title="Scrape Response Fields" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Features</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Enterprise Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Cpu, title: 'JavaScript Rendering', items: ['Chromium browser engine', 'Full ES6+ support', 'DOM manipulation', 'AJAX/Fetch requests'] },
            { icon: Network, title: 'Proxy Network', items: ['100M+ residential IPs', '200+ countries', 'Automatic rotation', 'High-speed datacenters'] },
            { icon: Shield, title: 'Anti-Detection', items: ['Browser fingerprinting', 'Bot detection bypass', 'CAPTCHA handling', 'Behavioral mimicking'] },
            { icon: Zap, title: 'Data Extraction', items: ['Structured data parsing', 'Link extraction', 'Image processing', 'Meta data analysis'] }
          ].map((f) => (
            <div key={f.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <f.icon className="w-4 h-4 text-white/50" />
                <span className="text-[14px] font-medium text-white">{f.title}</span>
              </div>
              <ul className="text-[13px] text-white/65 space-y-1.5">
                {f.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Bulk Scraping</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Bulk Scraping</h2>
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">POST</span>
            <code className="text-[13px] font-mono text-white/80">/v1/scrape/bulk</code>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Process up to 100 URLs simultaneously with intelligent load balancing and error handling.
            </p>
            <pre className="bg-[#050505] border border-white/[0.06] p-4 rounded-sm text-[12.5px] font-mono text-white/80 overflow-x-auto">
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
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Error Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Codes</h2>
        <div className="space-y-2">
          {[
            { code: '200 OK', tone: 'border-emerald-400/20 text-emerald-300/80', desc: 'Page scraped successfully' },
            { code: '400 Bad Request', tone: 'border-rose-400/20 text-rose-300/80', desc: 'Invalid URL or parameters' },
            { code: '403 Forbidden', tone: 'border-amber-400/20 text-amber-300/80', desc: 'Target site blocked the request' },
            { code: '504 Gateway Timeout', tone: 'border-violet-400/20 text-violet-300/80', desc: 'Target site took too long to respond' }
          ].map((row) => (
            <div key={row.code} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4 flex items-center gap-4">
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${row.tone}`}>
                {row.code}
              </span>
              <p className="text-[13px] text-white/70">{row.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Use Cases</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'E-commerce Data', desc: 'Extract product details, prices, and inventory', code: `{
  "url": "https://shop.example.com/product/123",
  "render_js": true,
  "wait_for": ".price",
  "extract_schema": true,
  "extract_images": true
}` },
            { title: 'News Articles', desc: 'Extract article content and metadata', code: `{
  "url": "https://news.example.com/article/123",
  "extract_meta": true,
  "extract_links": true,
  "proxy_type": "residential"
}` },
            { title: 'Social Media', desc: 'Scrape posts, comments, and user profiles', code: `{
  "url": "https://social.example.com/profile/user",
  "render_js": true,
  "wait_for": ".posts-container",
  "screenshot": true,
  "proxy_type": "residential"
}` },
            { title: 'Real Estate', desc: 'Extract property listings and details', code: `{
  "url": "https://realty.example.com/listing/123",
  "extract_schema": true,
  "extract_images": true,
  "extract_meta": true,
  "proxy_country": "US"
}` }
          ].map((u) => (
            <div key={u.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <h3 className="text-[15px] font-medium text-white mb-2">{u.title}</h3>
              <p className="text-[13px] text-white/55 mb-3">{u.desc}</p>
              <pre className="bg-[#050505] border border-white/[0.06] p-3 rounded-sm text-[11.5px] font-mono text-white/70 overflow-x-auto">
                {u.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Credits</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Credit Consumption</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="text-[15px] font-medium text-white mb-4">Base Costs</div>
            <div className="space-y-3">
              {[
                ['Basic scraping:', '3 credits'],
                ['JavaScript rendering:', '+5 credits'],
                ['Residential proxy:', '+2 credits'],
                ['Screenshot capture:', '+3 credits']
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[13px] text-white/70">{label}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="text-[15px] font-medium text-white mb-4">Extraction Features</div>
            <div className="space-y-3">
              {[
                ['Link extraction:', '+1 credit'],
                ['Image extraction:', '+1 credit'],
                ['Schema extraction:', '+2 credits'],
                ['Meta data extraction:', '+1 credit']
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[13px] text-white/70">{label}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api-reference/search" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Search API Reference
        </Link>
      </div>
    </div>
  )
}
