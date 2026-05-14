import Link from 'next/link'
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
    { name: "url", type: "string", required: true, description: "The target URL to scrape. Must be a valid HTTP/HTTPS URL with proper encoding.", example: '"https://example.com/products"' },
    { name: "render_js", type: "boolean", required: false, description: "Execute JavaScript on the page using a real browser engine (Chromium).", example: "true", default: "false" },
    { name: "wait_for", type: "string", required: false, description: "CSS selector or XPath to wait for before considering the page loaded.", example: '"#product-list"' },
    { name: "wait_time", type: "integer", required: false, description: "Maximum time to wait for the wait_for element in seconds.", example: "10", default: "10" },
    { name: "user_agent", type: "string", required: false, description: "Custom User-Agent string to use for the request.", example: '"Mozilla/5.0 ..."' },
    { name: "proxy_type", type: "string", required: false, description: "Type of proxy to use for the request.", example: '"residential", "datacenter", "mobile"', default: "residential" },
    { name: "proxy_country", type: "string", required: false, description: "Target country for proxy location using ISO 3166-1 alpha-2 codes.", example: '"US", "GB", "DE"' }
  ]

  const advancedParameters = [
    { name: "extract_links", type: "boolean", required: false, description: "Extract all links found on the page with their text and attributes.", example: "true", default: "false" },
    { name: "extract_images", type: "boolean", required: false, description: "Extract all images with their URLs, alt text, and dimensions.", example: "true", default: "false" },
    { name: "extract_schema", type: "boolean", required: false, description: "Extract structured data (JSON-LD, Microdata, RDFa) from the page.", example: "true", default: "false" },
    { name: "extract_meta", type: "boolean", required: false, description: "Extract meta tags, Open Graph, and Twitter Card data.", example: "true", default: "false" },
    { name: "custom_headers", type: "object", required: false, description: "Custom HTTP headers to include with the request.", example: '{"Authorization": "Bearer token"}' },
    { name: "cookies", type: "object", required: false, description: "Cookies to include with the request.", example: '{"session_id": "abc123"}' },
    { name: "screenshot", type: "boolean", required: false, description: "Capture a screenshot of the page (requires render_js=true).", example: "true", default: "false" },
    { name: "screenshot_options", type: "object", required: false, description: "Screenshot configuration options.", example: '{"format": "png", "quality": 90, "full_page": true}' }
  ]

  const bulkParameters = [
    { name: "urls", type: "array", required: true, description: "Array of URLs to scrape in bulk (max 100 URLs per request).", example: '["https://site1.com", "https://site2.com"]' },
    { name: "concurrent_requests", type: "integer", required: false, description: "Number of URLs to process simultaneously.", example: "5", default: "3" },
    { name: "retry_failed", type: "boolean", required: false, description: "Automatically retry failed requests with different proxies.", example: "true", default: "true" },
    { name: "max_retries", type: "integer", required: false, description: "Maximum number of retry attempts for failed requests.", example: "3", default: "2" },
    { name: "callback_url", type: "string", required: false, description: "Webhook URL to receive results asynchronously.", example: '"https://your-api.com/webhook"' }
  ]

  const responseParameters = [
    { name: "content", type: "string", description: "The raw HTML content of the scraped page.", example: '"<html>...</html>"' },
    { name: "text_content", type: "string", description: "Plain text content extracted from HTML.", example: '"Welcome to our store..."' },
    { name: "links", type: "array", description: "Array of link objects with URL, text, and attributes.", example: '[{"url": "...", "text": "..."}]' },
    { name: "images", type: "array", description: "Array of image objects with src, alt, and dimensions.", example: '[{"src": "...", "alt": "..."}]' },
    { name: "schema_data", type: "array", description: "Structured data found on the page.", example: '[{"@type": "Product", "name": "..."}]' },
    { name: "meta_data", type: "object", description: "Meta tags, Open Graph, and Twitter Card data.", example: '{"title": "...", "og:image": "..."}' },
    { name: "screenshot_url", type: "string", description: "URL to the captured screenshot.", example: '"https://cdn.VENYM_SEARCH.com/screenshots/abc123.png"' },
    { name: "load_time", type: "float", description: "Total time taken to load and process the page in seconds.", example: "2.847" },
    { name: "status_code", type: "integer", description: "HTTP status code returned by the target server.", example: "200" },
    { name: "final_url", type: "string", description: "Final URL after following redirects.", example: '"https://example.com/products"' },
    { name: "credits_used", type: "integer", description: "Number of API credits consumed by this request.", example: "7" }
  ]

  const basicExample = {
    python: `import requests

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

response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://spa-example.com/dashboard",
        "render_js": True,
        "wait_for": "#dashboard-content",
        "wait_time": 15,
        "proxy_type": "residential",
        "proxy_country": "US",
        "extract_links": True,
        "extract_images": True,
        "extract_schema": True,
        "extract_meta": True,
        "screenshot": True
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
    proxy_type: 'residential',
    proxy_country: 'US',
    extract_links: true,
    extract_images: true,
    extract_schema: true,
    extract_meta: true,
    screenshot: true
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
  }
);`
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SCRAPE · PARAMETERS</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Scrape Parameters
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Complete parameter reference for enterprise web scraping.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/docs/api/scrape" className="venym-btn-secondary">
            <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
            Overview
          </Link>
          <Link href="/docs/api/scrape/examples" className="venym-btn-secondary">
            Examples
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <Callout type="info" title="Enterprise Features">
          Scrape includes advanced features like JavaScript rendering, residential proxies, and comprehensive data extraction. Credit consumption varies based on features used.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Core</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Core Parameters</h2>
        <ParameterTable parameters={coreParameters} title="Essential Scrape Parameters" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Advanced</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Parameters</h2>
        <ParameterTable parameters={advancedParameters} title="Advanced Extraction & Rendering Options" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Bulk</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Bulk Scraping Parameters</h2>
        <ParameterTable parameters={bulkParameters} title="Bulk Processing Options" />

        <Callout type="warning" title="Bulk Scraping Limits">
          Bulk requests are limited to 100 URLs per request. For larger datasets, use multiple requests or contact support for enterprise solutions.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Credits</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Credit Consumption</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Base Costs</span>
            </div>
            <div className="space-y-3">
              {[
                ['Basic scraping:', '3 credits'],
                ['JavaScript rendering:', '+5 credits'],
                ['Residential proxy:', '+2 credits'],
                ['Mobile proxy:', '+4 credits']
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[13px] text-white/70">{k}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Feature Costs</span>
            </div>
            <div className="space-y-3">
              {[
                ['Link extraction:', '+1 credit'],
                ['Image extraction:', '+1 credit'],
                ['Schema extraction:', '+2 credits'],
                ['Screenshot capture:', '+3 credits']
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[13px] text-white/70">{k}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Response</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Format</h2>
        <ResponseTable fields={responseParameters} title="Scrape Response Fields" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Examples</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Example Requests</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Basic Request</h3>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Simple scraping without JavaScript rendering for static content:
            </p>
            <CodeBlock multiLanguage={basicExample} title="Basic Scrape Request" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Advanced Request</h3>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Full-featured scraping with all extraction options and JavaScript rendering:
            </p>
            <CodeBlock multiLanguage={advancedExample} title="Advanced Scrape Request" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Technical</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Technical Details</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Cpu, title: 'JavaScript Engine', items: ['Chromium-based rendering', 'Full ES6+ support', 'DOM manipulation handling', 'AJAX/Fetch request processing', 'Custom wait conditions'] },
            { icon: Network, title: 'Proxy Network', items: ['100M+ residential IPs', '200+ countries available', 'Automatic IP rotation', 'High-speed datacenter options', 'Mobile carrier networks'] },
            { icon: Shield, title: 'Security Features', items: ['TLS 1.3 encryption', 'Browser fingerprint masking', 'Anti-bot detection bypass', 'Request signature hiding', 'Behavioral mimicking'] }
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
        <div className="venym-meta mb-3">08 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Parameter Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Optimization Tips</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Use render_js selectively:</strong><p className="text-white/55">Only enable for dynamic content to save credits and time.</p></div>
              <div><strong className="text-white">Set appropriate wait_for:</strong><p className="text-white/55">Use specific selectors for critical elements.</p></div>
              <div><strong className="text-white">Choose right proxy type:</strong><p className="text-white/55">Residential for high-protection sites, datacenter for speed.</p></div>
              <div><strong className="text-white">Batch similar requests:</strong><p className="text-white/55">Use bulk endpoint for multiple URLs from same domain.</p></div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Common Issues</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Incorrect wait_for selectors:</strong><p className="text-white/55">Test selectors in browser dev tools first.</p></div>
              <div><strong className="text-white">Too short wait_time:</strong><p className="text-white/55">Allow sufficient time for slow-loading content.</p></div>
              <div><strong className="text-white">Missing required headers:</strong><p className="text-white/55">Some sites require specific headers for access.</p></div>
              <div><strong className="text-white">Invalid custom headers:</strong><p className="text-white/55">Ensure header names and values are properly formatted.</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api/scrape" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Scrape Overview
        </Link>
        <Link href="/docs/api/scrape/examples" className="venym-btn-primary">
          View Examples
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}
