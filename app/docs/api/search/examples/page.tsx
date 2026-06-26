import Link from 'next/link'
import {
  Search,
  Code,
  Globe,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  Target,
  BarChart,
  Briefcase,
  ShoppingCart,
  Newspaper
} from 'lucide-react'
import { CodeBlock } from '../../../components/CodeBlock'
import { Callout } from '../../../components/Callout'

export default function SearchExamplesPage() {
  const basicSearch = {
    python: `import requests

# Basic search with minimal parameters
response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
    json={
        "query": "Python web scraping libraries 2025",
        "max_results": 10
    }
)

data = response.json()
print(f"Found {len(data['search_results'])} results")

for result in data['search_results']:
    print(f"Title: {result['title']}")
    print(f"URL: {result['link']}")
    print(f"Snippet: {result['snippet'][:100]}...")
    print("-" * 50)`,
    javascript: `const axios = require('axios');

async function basicSearch() {
  const response = await axios.post(
    'https://www.search.venym.io/api/v1/search',
    {
      query: 'Python web scraping libraries 2025',
      max_results: 10
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_64_HEX_CHARS_key_here' }
    }
  );
  console.log(\`Found \${response.data.search_results.length} results\`);
}

basicSearch();`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_64_HEX_CHARS_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Python web scraping libraries 2025",
    "max_results": 10
  }'`
  }

  const newsSearch = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
    json={
        "query": "AI breakthrough artificial intelligence",
        "max_results": 15,
        "result_type": "news",
        "time_range": "week",
        "country": "US",
        "language": "en"
    }
)

data = response.json()
print(f"Found {data['total_results']} total news articles")`,
    javascript: `const axios = require('axios');

async function searchRecentNews() {
  const response = await axios.post(
    'https://www.search.venym.io/api/v1/search',
    {
      query: 'AI breakthrough artificial intelligence',
      max_results: 15,
      result_type: 'news',
      time_range: 'week',
      country: 'US',
      language: 'en'
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_64_HEX_CHARS_key_here' }
    }
  );
  console.log(\`Found \${response.data.total_results} total news articles\`);
}

searchRecentNews();`
  }

  const leadGeneration = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
    json={
        "query": "SaaS startup founders email contact",
        "max_results": 20,
        "auto_scrape_top": 8,
        "include_contacts": True,
        "include_social": True,
        "country": "US"
    }
)

data = response.json()
print(f"Credits used: {data['credits_used']}")

# Extract and organize contacts
all_contacts = []
for scraped in data['scraped_content']:
    if scraped.get('contacts'):
        for contact in scraped['contacts']:
            all_contacts.append({
                'source_url': scraped['url'],
                'email': contact.get('email'),
                'phone': contact.get('phone'),
                'name': contact.get('name'),
                'social_links': scraped.get('social', [])
            })

# Display unique contacts
unique_emails = set()
for contact in all_contacts:
    if contact['email'] and contact['email'] not in unique_emails:
        unique_emails.add(contact['email'])
        print(f"Name: {contact.get('name', 'Unknown')}")
        print(f"Email: {contact['email']}")
        print(f"Source: {contact['source_url']}")

print(f"\\nTotal unique contacts found: {len(unique_emails)}")`,
    javascript: `const axios = require('axios');

async function generateLeads() {
  const response = await axios.post(
    'https://www.search.venym.io/api/v1/search',
    {
      query: 'SaaS startup founders email contact',
      max_results: 20,
      auto_scrape_top: 8,
      include_contacts: true,
      include_social: true,
      country: 'US'
    },
    {
      headers: { 'Authorization": "Bearer': 'sk_live_64_HEX_CHARS_key_here' }
    }
  );

  const data = response.data;
  const uniqueEmails = new Set();
  data.scraped_content.forEach(scraped => {
    if (scraped.contacts) {
      scraped.contacts.forEach(contact => {
        if (contact.email && !uniqueEmails.has(contact.email)) {
          uniqueEmails.add(contact.email);
          console.log(\`Email: \${contact.email}\`);
        }
      });
    }
  });
}

generateLeads();`
  }

  const competitorAnalysis = {
    python: `import requests
from collections import Counter

competitors = [
    "Shopify pricing plans features",
    "WooCommerce vs competitors",
    "BigCommerce enterprise features",
    "Magento alternatives 2025"
]

all_results = []
for query in competitors:
    response = requests.post(
        "https://www.search.venym.io/api/v1/search",
        headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
        json={
            "query": query,
            "max_results": 15,
            "auto_scrape_top": 3,
            "country": "US",
            "time_range": "month"
        }
    )
    data = response.json()
    all_results.extend(data['search_results'])

domains = [result.get('domain', 'unknown') for result in all_results]
domain_counts = Counter(domains)
for domain, count in domain_counts.most_common(10):
    print(f"{domain}: {count} mentions")`
  }

  const priceMonitoring = {
    python: `import requests
import re
from datetime import datetime

products_to_monitor = [
    "iPhone 15 Pro price",
    "MacBook Air M3 deals",
    "Sony WH-1000XM5 headphones price"
]

price_data = []

for product_query in products_to_monitor:
    response = requests.post(
        "https://www.search.venym.io/api/v1/search",
        headers={"Authorization": "Bearer " + "sk_live_64_HEX_CHARS_key_here"},
        json={
            "query": product_query + " site:amazon.com OR site:bestbuy.com OR site:target.com",
            "max_results": 10,
            "auto_scrape_top": 5,
            "country": "US"
        }
    )

    data = response.json()
    for scraped in data.get('scraped_content', []):
        content = scraped.get('content', '')
        price_matches = re.findall(r'\\$[0-9,]+\\.?[0-9]*', content)
        if price_matches:
            price_data.append({
                'product': product_query,
                'url': scraped['url'],
                'prices_found': price_matches[:3],
                'timestamp': datetime.now().isoformat()
            })

print(f"Saved {len(price_data)} price records")`
  }

  const examples = [
    { title: "Basic Search", description: "Simple search with result parsing and display", icon: Search, difficulty: "Beginner", credits: "~2 credits", code: basicSearch },
    { title: "News Monitoring", description: "Search for recent news articles with time filtering", icon: Newspaper, difficulty: "Beginner", credits: "~3 credits", code: newsSearch },
    { title: "Lead Generation", description: "Extract contact information and social profiles", icon: Users, difficulty: "Intermediate", credits: "~25 credits", code: leadGeneration },
    { title: "Competitor Analysis", description: "Analyze multiple competitors with domain insights", icon: BarChart, difficulty: "Advanced", credits: "~40 credits", code: competitorAnalysis },
    { title: "Price Monitoring", description: "Track product prices across e-commerce sites", icon: ShoppingCart, difficulty: "Advanced", credits: "~30 credits", code: priceMonitoring }
  ]

  const difficultyTone = (d: string) => {
    switch (d) {
      case 'Beginner': return 'border-emerald-400/20 text-emerald-300/80'
      case 'Intermediate': return 'border-amber-400/20 text-amber-300/80'
      case 'Advanced': return 'border-rose-400/20 text-rose-300/80'
      default: return 'border-white/10 text-white/60'
    }
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">SEARCH · EXAMPLES</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Search Examples
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Real-world use cases and implementation patterns.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/docs/api/search/parameters" className="venym-btn-secondary">
            <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
            Parameters
          </Link>
          <Link href="/docs/api/search" className="venym-btn-secondary">
            Overview
          </Link>
        </div>

        <Callout type="success" title="Production Ready Examples">
          All examples include proper error handling, rate limiting considerations, and best practices for production use.
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
                  <p className="text-[14px] text-white/55 leading-relaxed">{example.description}</p>
                </div>
              </div>
            </div>

            <CodeBlock multiLanguage={example.code} title={`${example.title} Implementation`} />
          </div>
        ))}
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">Use Case Matrix</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Use Case Matrix</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: TrendingUp, title: 'Market Research', items: ['Competitor analysis', 'Industry trend monitoring', 'Product feature comparison', 'Market sentiment analysis'] },
            { icon: Users, title: 'Lead Generation', items: ['Contact information extraction', 'Social media profile discovery', 'Company directory scraping', 'Prospect research automation'] },
            { icon: ShoppingCart, title: 'E-commerce', items: ['Price monitoring', 'Product availability tracking', 'Review sentiment analysis', 'Competitor pricing'] },
            { icon: Newspaper, title: 'Content & News', items: ['News aggregation', 'Content curation', 'Press mention tracking', 'Industry updates'] },
            { icon: Briefcase, title: 'Business Intelligence', items: ['Company research', 'Industry reports', 'Financial data collection', 'Market analysis'] },
            { icon: Target, title: 'SEO & Marketing', items: ['Keyword research', 'Backlink analysis', 'Content gap analysis', 'Brand mention tracking'] }
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
        <div className="venym-meta mb-3">Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Implementation Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="text-[15px] font-medium text-white mb-3">Error Handling</div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Always handle API errors:</strong><p className="text-white/55">Check response status codes and handle rate limiting gracefully.</p></div>
              <div><strong className="text-white">Implement retry logic:</strong><p className="text-white/55">Use exponential backoff for transient failures.</p></div>
              <div><strong className="text-white">Validate responses:</strong><p className="text-white/55">Check for required fields before processing data.</p></div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="text-[15px] font-medium text-white mb-3">Performance Optimization</div>
            <div className="space-y-3 text-[13px]">
              <div><strong className="text-white">Batch requests:</strong><p className="text-white/55">Group similar queries to minimize API calls.</p></div>
              <div><strong className="text-white">Cache results:</strong><p className="text-white/55">Store results locally to avoid duplicate requests.</p></div>
              <div><strong className="text-white">Use appropriate timeouts:</strong><p className="text-white/55">Set reasonable timeout values for your use case.</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/[0.06] flex-wrap gap-3">
        <Link href="/docs/api/search/parameters" className="venym-btn-secondary">
          <ArrowRight className="w-3 h-3 mr-1.5 rotate-180" />
          Parameters Reference
        </Link>
        <Link href="/docs/api/scrape" className="venym-btn-primary">
          Scrape API
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}
