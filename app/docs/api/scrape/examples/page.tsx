import Link from 'next/link'
import {
  Code2,
  Database,
  ShoppingCart,
  Newspaper,
  ArrowRight,
  Globe,
  Users,
  TrendingUp,
  FileText,
  Camera,
  Zap,
  Clock,
  Shield
} from 'lucide-react'
import { CodeBlock } from '../../../components/CodeBlock'
import { Callout } from '../../../components/Callout'

export default function ScrapeExamplesPage() {
  const staticScraping = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://example-news.com/articles",
        "render_js": False,
        "extract_links": True,
        "extract_meta": True,
        "proxy_type": "residential",
        "proxy_country": "US"
    }
)

data = response.json()
print(f"Status: {data['status_code']}")
print(f"Content length: {len(data['content'])} characters")
print(f"Links found: {len(data.get('links', []))}")`,
    javascript: `const axios = require('axios');

async function scrapeStaticContent() {
  const response = await axios.post(
    'https://www.search.venym.io/api/v1/scrape',
    {
      url: 'https://example-news.com/articles',
      render_js: false,
      extract_links: true,
      extract_meta: true,
      proxy_type: 'residential',
      proxy_country: 'US'
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
    }
  );
  console.log(response.data);
}

scrapeStaticContent();`
  }

  const spaScraping = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://spa-ecommerce.com/products",
        "render_js": True,
        "wait_for": ".product-grid",
        "wait_time": 15,
        "extract_links": True,
        "extract_images": True,
        "extract_schema": True,
        "screenshot": True,
        "screenshot_options": {
            "format": "png",
            "quality": 85,
            "full_page": False
        },
        "proxy_type": "residential"
    }
)

data = response.json()
print(f"JavaScript rendering completed in {data['load_time']}s")
print(f"Credits used: {data['credits_used']}")`,
    javascript: `const axios = require('axios');

async function scrapeSPAContent() {
  const response = await axios.post(
    'https://www.search.venym.io/api/v1/scrape',
    {
      url: 'https://spa-ecommerce.com/products',
      render_js: true,
      wait_for: '.product-grid',
      wait_time: 15,
      extract_links: true,
      extract_images: true,
      extract_schema: true,
      screenshot: true,
      proxy_type: 'residential'
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
    }
  );
  console.log(response.data);
}

scrapeSPAContent();`
  }

  const bulkScraping = {
    python: `import requests

product_urls = [
    "https://shop1.com/product/laptop-xyz",
    "https://shop2.com/item/smartphone-abc",
    "https://shop3.com/products/tablet-def"
]

response = requests.post(
    "https://www.search.venym.io/api/v1/scrape/bulk",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "urls": product_urls,
        "render_js": True,
        "wait_for": ".price, .product-price",
        "wait_time": 10,
        "concurrent_requests": 3,
        "retry_failed": True,
        "max_retries": 2,
        "extract_schema": True,
        "extract_meta": True,
        "proxy_type": "residential"
    }
)

data = response.json()
print(f"Successful: {data['successful_count']}")
print(f"Failed: {data['failed_count']}")
print(f"Total credits used: {data['credits_used']}")`,
    javascript: `const axios = require('axios');

async function bulkScrapeProducts() {
  const productUrls = [
    'https://shop1.com/product/laptop-xyz',
    'https://shop2.com/item/smartphone-abc',
    'https://shop3.com/products/tablet-def'
  ];

  const response = await axios.post(
    'https://www.search.venym.io/api/v1/scrape/bulk',
    {
      urls: productUrls,
      render_js: true,
      wait_for: '.price, .product-price',
      wait_time: 10,
      concurrent_requests: 3,
      retry_failed: true,
      max_retries: 2,
      extract_schema: true,
      extract_meta: true,
      proxy_type: 'residential'
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
    }
  );

  console.log(\`Successful: \${response.data.successful_count}\`);
}

bulkScrapeProducts();`
  }

  const authScraping = {
    python: `import requests

login_response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://secure-site.com/login",
        "render_js": True,
        "wait_for": "#login-form",
        "post_data": {
            "username": "your_username",
            "password": "your_password"
        }
    }
)

login_data = login_response.json()
session_cookies = {}
if 'set_cookies' in login_data:
    for cookie in login_data['set_cookies']:
        session_cookies[cookie['name']] = cookie['value']

protected_response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://secure-site.com/dashboard",
        "render_js": True,
        "cookies": session_cookies,
        "extract_links": True,
        "extract_meta": True
    }
)

print(protected_response.json())`,
    javascript: `const axios = require('axios');

async function scrapeWithAuthentication() {
  const loginResponse = await axios.post(
    'https://www.search.venym.io/api/v1/scrape',
    {
      url: 'https://secure-site.com/login',
      render_js: true,
      wait_for: '#login-form',
      post_data: {
        username: 'your_username',
        password: 'your_password'
      }
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
    }
  );

  const sessionCookies = {};
  if (loginResponse.data.set_cookies) {
    loginResponse.data.set_cookies.forEach(c => {
      sessionCookies[c.name] = c.value;
    });
  }

  const protectedResponse = await axios.post(
    'https://www.search.venym.io/api/v1/scrape',
    {
      url: 'https://secure-site.com/dashboard',
      render_js: true,
      cookies: sessionCookies,
      extract_links: true,
      extract_meta: true
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
    }
  );

  console.log(protectedResponse.data);
}

scrapeWithAuthentication();`
  }

  const examples = [
    { title: "Static Content Scraping", description: "Scrape traditional HTML pages with link and metadata extraction", icon: FileText, difficulty: "Beginner", credits: "~5 credits", features: ["Link extraction", "Meta data", "Residential proxies", "Fast processing"], code: staticScraping },
    { title: "JavaScript SPA Scraping", description: "Scrape Single Page Applications with dynamic content rendering", icon: Code2, difficulty: "Intermediate", credits: "~12 credits", features: ["JavaScript rendering", "Wait conditions", "Schema extraction", "Screenshot capture"], code: spaScraping },
    { title: "Bulk Product Scraping", description: "Efficiently scrape multiple e-commerce sites for price comparison", icon: ShoppingCart, difficulty: "Advanced", credits: "~35 credits", features: ["Bulk processing", "Concurrent requests", "Automatic retries", "Price extraction"], code: bulkScraping },
    { title: "Authenticated Scraping", description: "Access protected content behind login forms and user sessions", icon: Shield, difficulty: "Expert", credits: "~20 credits", features: ["Session management", "Cookie handling", "Custom headers", "Multi-step flow"], code: authScraping }
  ]

  const difficultyTone = (d: string) => {
    switch (d) {
      case 'Beginner': return 'border-emerald-400/20 text-emerald-300/80'
      case 'Intermediate': return 'border-amber-400/20 text-amber-300/80'
      case 'Advanced': return 'border-orange-400/20 text-orange-300/80'
      case 'Expert': return 'border-rose-400/20 text-rose-300/80'
      default: return 'border-white/10 text-white/60'
    }
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SCRAPE · EXAMPLES</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Scrape Examples
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Enterprise web scraping patterns and real-world implementations.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/docs/api/scrape/parameters" className="venym-btn-secondary">
            <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
            Parameters
          </Link>
          <Link href="/docs/api/scrape" className="venym-btn-secondary">
            Overview
          </Link>
        </div>

        <Callout type="success" title="Production-Ready Examples">
          All examples include enterprise-grade error handling, proxy rotation, and optimization strategies for high-volume scraping operations.
        </Callout>
      </div>

      <div className="space-y-10 mb-12">
        {examples.map((example, index) => (
          <div key={index} className="border-b border-white/[0.06] pb-10 last:border-b-0">
            <div className="mb-5">
              <div className="flex items-start gap-3 flex-wrap mb-3">
                <example.icon className="w-5 h-5 text-amber-400/80 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">{example.title}</h2>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${difficultyTone(example.difficulty)}`}>
                      {example.difficulty}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
                      {example.credits}
                    </span>
                  </div>
                  <p className="text-[14px] text-white/55 leading-relaxed mb-3">{example.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {example.features.map((feature, idx) => (
                      <span key={idx} className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <CodeBlock multiLanguage={example.code} title={`${example.title} Implementation`} />
          </div>
        ))}
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">Industry Use Cases</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Industry Use Cases</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ShoppingCart, title: 'E-commerce Intelligence', items: ['Competitor price monitoring', 'Product availability tracking', 'Review sentiment analysis', 'Inventory level monitoring', 'Dynamic pricing optimization'] },
            { icon: TrendingUp, title: 'Financial Data', items: ['Stock price monitoring', 'Financial report extraction', 'Market sentiment analysis', 'Economic indicator tracking', 'Earnings data collection'] },
            { icon: Database, title: 'Real Estate', items: ['Property listing aggregation', 'Market price analysis', 'Rental rate tracking', 'Property feature extraction', 'Neighborhood data collection'] },
            { icon: Newspaper, title: 'Media & News', items: ['News article aggregation', 'Social media monitoring', 'Brand mention tracking', 'Content trend analysis', 'Press release collection'] },
            { icon: Users, title: 'Lead Generation', items: ['Contact information extraction', 'Company directory scraping', 'Social profile discovery', 'Email verification', 'Professional network analysis'] },
            { icon: Globe, title: 'Travel & Hospitality', items: ['Hotel price comparison', 'Flight availability tracking', 'Review aggregation', 'Amenity data extraction', 'Booking trend analysis'] }
          ].map((u) => (
            <div key={u.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <u.icon className="w-4 h-4 text-white/50" />
                <span className="text-[14px] font-medium text-white">{u.title}</span>
              </div>
              <ul className="text-[13px] text-white/65 space-y-1.5">
                {u.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">Performance</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Performance Optimization Strategies</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Speed Optimization</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Selective JavaScript rendering:</strong><p className="text-white/55">Only use render_js when the content requires it</p></div>
              <div><strong className="text-white">Specific wait conditions:</strong><p className="text-white/55">Use precise CSS selectors for wait_for parameter</p></div>
              <div><strong className="text-white">Optimal proxy selection:</strong><p className="text-white/55">Choose datacenter proxies for speed, residential for stealth</p></div>
              <div><strong className="text-white">Concurrent processing:</strong><p className="text-white/55">Use bulk endpoints for multiple URLs</p></div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Reliability Best Practices</span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Implement retry logic:</strong><p className="text-white/55">Handle temporary failures with exponential backoff</p></div>
              <div><strong className="text-white">Monitor success rates:</strong><p className="text-white/55">Track scraping success and adjust strategies</p></div>
              <div><strong className="text-white">Use appropriate timeouts:</strong><p className="text-white/55">Set wait_time based on typical page load speeds</p></div>
              <div><strong className="text-white">Handle edge cases:</strong><p className="text-white/55">Plan for CAPTCHAs, rate limits, and IP blocks</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">Troubleshooting</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Common Issues & Solutions</h2>

        <div className="space-y-3">
          {[
            {
              title: 'Issue: JavaScript Content Not Loading',
              symptoms: ['Empty or incomplete content', 'Missing dynamic elements', 'Placeholder text instead of data'],
              solutions: ['Enable render_js: true', 'Use specific wait_for selectors', 'Increase wait_time parameter', 'Add necessary custom_headers']
            },
            {
              title: 'Issue: Getting Blocked or Rate Limited',
              symptoms: ['403 Forbidden responses', 'CAPTCHA challenges', 'Consistent timeouts'],
              solutions: ['Use residential proxies', 'Add realistic user_agent', 'Implement request delays', 'Rotate proxy countries']
            },
            {
              title: 'Issue: High Credit Consumption',
              symptoms: ['Unexpectedly high costs', 'Slow processing times', 'Unnecessary feature usage'],
              solutions: ['Disable unused extractions', 'Use datacenter proxies when possible', 'Optimize wait conditions', 'Batch similar requests']
            }
          ].map((issue) => (
            <div key={issue.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <span className="text-[15px] font-medium text-white">{issue.title}</span>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2 text-[13px]">
                  <div>
                    <strong className="text-white">Symptoms:</strong>
                    <ul className="mt-2 space-y-1 text-white/55">
                      {issue.symptoms.map((s) => <li key={s}>• {s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-white">Solutions:</strong>
                    <ul className="mt-2 space-y-1 text-white/55">
                      {issue.solutions.map((s) => <li key={s}>• {s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api/scrape/parameters" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Parameters Reference
        </Link>
      </div>
    </div>
  )
}
