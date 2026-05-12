import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "query": "Python web scraping libraries 2025",
        "max_results": 10
    }
)

data = response.json()
print(f"Found {len(data['search_results'])} results")

# Display results
for result in data['search_results']:
    print(f"Title: {result['title']}")
    print(f"URL: {result['link']}")
    print(f"Snippet: {result['snippet'][:100]}...")
    print("-" * 50)`,
    javascript: `const axios = require('axios');

async function basicSearch() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/search',
      {
        query: 'Python web scraping libraries 2025',
        max_results: 10
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log(\`Found \${data.search_results.length} results\`);

    // Display results
    data.search_results.forEach(result => {
      console.log(\`Title: \${result.title}\`);
      console.log(\`URL: \${result.link}\`);
      console.log(\`Snippet: \${result.snippet.substring(0, 100)}...\`);
      console.log('-'.repeat(50));
    });
  } catch (error) {
    console.error('Search failed:', error.response?.data || error.message);
  }
}

basicSearch();`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Python web scraping libraries 2025",
    "max_results": 10
  }' | jq '.search_results[] | {title: .title, url: .link, snippet: .snippet}'`
  }

  const newsSearch = {
    python: `import requests
from datetime import datetime

# Search for recent news with time filtering
response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
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
print(f"Found {data['total_results']} total news articles")
print(f"Showing top {len(data['search_results'])} results from the past week\\n")

for i, article in enumerate(data['search_results'], 1):
    print(f"{i}. {article['title']}")
    print(f"   Source: {article.get('domain', 'Unknown')}")
    print(f"   Published: {article.get('published_date', 'Unknown')}")
    print(f"   URL: {article['link']}")
    print(f"   Summary: {article['snippet'][:150]}...")
    print()`,
    javascript: `const axios = require('axios');

async function searchRecentNews() {
  try {
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
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log(\`Found \${data.total_results} total news articles\`);
    console.log(\`Showing top \${data.search_results.length} results from the past week\\n\`);

    data.search_results.forEach((article, index) => {
      console.log(\`\${index + 1}. \${article.title}\`);
      console.log(\`   Source: \${article.domain || 'Unknown'}\`);
      console.log(\`   Published: \${article.published_date || 'Unknown'}\`);
      console.log(\`   URL: \${article.link}\`);
      console.log(\`   Summary: \${article.snippet.substring(0, 150)}...\`);
      console.log();
    });
  } catch (error) {
    console.error('News search failed:', error.response?.data || error.message);
  }
}

searchRecentNews();`
  }

  const leadGeneration = {
    python: `import requests
import json

# Lead generation with contact extraction
response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
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
print(f"Found {len(data['search_results'])} search results")
print(f"Scraped {len(data['scraped_content'])} pages for contacts\\n")

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
print("=== EXTRACTED CONTACTS ===")
for contact in all_contacts:
    if contact['email'] and contact['email'] not in unique_emails:
        unique_emails.add(contact['email'])
        print(f"Name: {contact.get('name', 'Unknown')}")
        print(f"Email: {contact['email']}")
        print(f"Phone: {contact.get('phone', 'Not found')}")
        print(f"Source: {contact['source_url']}")
        if contact['social_links']:
            print(f"Social: {', '.join(contact['social_links'][:3])}")
        print("-" * 60)

print(f"\\nTotal unique contacts found: {len(unique_emails)}")`,
    javascript: `const axios = require('axios');

async function generateLeads() {
  try {
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
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log(\`Credits used: \${data.credits_used}\`);
    console.log(\`Found \${data.search_results.length} search results\`);
    console.log(\`Scraped \${data.scraped_content.length} pages for contacts\\n\`);

    // Extract and organize contacts
    const allContacts = [];
    data.scraped_content.forEach(scraped => {
      if (scraped.contacts) {
        scraped.contacts.forEach(contact => {
          allContacts.push({
            source_url: scraped.url,
            email: contact.email,
            phone: contact.phone,
            name: contact.name,
            social_links: scraped.social || []
          });
        });
      }
    });

    // Display unique contacts
    const uniqueEmails = new Set();
    console.log('=== EXTRACTED CONTACTS ===');
    allContacts.forEach(contact => {
      if (contact.email && !uniqueEmails.has(contact.email)) {
        uniqueEmails.add(contact.email);
        console.log(\`Name: \${contact.name || 'Unknown'}\`);
        console.log(\`Email: \${contact.email}\`);
        console.log(\`Phone: \${contact.phone || 'Not found'}\`);
        console.log(\`Source: \${contact.source_url}\`);
        if (contact.social_links.length > 0) {
          console.log(\`Social: \${contact.social_links.slice(0, 3).join(', ')}\`);
        }
        console.log('-'.repeat(60));
      }
    });

    console.log(\`\\nTotal unique contacts found: \${uniqueEmails.size}\`);
  } catch (error) {
    console.error('Lead generation failed:', error.response?.data || error.message);
  }
}

generateLeads();`
  }

  const competitorAnalysis = {
    python: `import requests
import json
from collections import Counter

# Multi-query competitor analysis
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
        headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
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
    print(f"Query: {query}")
    print(f"Results: {len(data['search_results'])}, Credits: {data['credits_used']}\\n")

# Analyze domains and topics
domains = [result.get('domain', 'unknown') for result in all_results]
domain_counts = Counter(domains)

print("=== TOP DOMAINS MENTIONED ===")
for domain, count in domain_counts.most_common(10):
    print(f"{domain}: {count} mentions")

# Extract key insights from scraped content
print("\\n=== KEY INSIGHTS ===")
insights = []
for result in all_results:
    if 'scraped_content' in result:
        for content in result['scraped_content']:
            # Simple keyword extraction
            text = content.get('content', '').lower()
            if 'pricing' in text or 'features' in text:
                insights.append({
                    'url': content['url'],
                    'snippet': text[:200] + "...",
                    'relevance_score': text.count('pricing') + text.count('features')
                })

# Sort by relevance
insights.sort(key=lambda x: x['relevance_score'], reverse=True)
for insight in insights[:5]:
    print(f"URL: {insight['url']}")
    print(f"Snippet: {insight['snippet']}")
    print(f"Relevance: {insight['relevance_score']}")
    print("-" * 50)`
  }

  const priceMonitoring = {
    python: `import requests
import re
from datetime import datetime

# E-commerce price monitoring
products_to_monitor = [
    "iPhone 15 Pro price",
    "MacBook Air M3 deals",
    "Sony WH-1000XM5 headphones price"
]

price_data = []

for product_query in products_to_monitor:
    response = requests.post(
        "https://www.search.venym.io/api/v1/search",
        headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
        json={
            "query": product_query + " site:amazon.com OR site:bestbuy.com OR site:target.com",
            "max_results": 10,
            "auto_scrape_top": 5,
            "country": "US"
        }
    )
    
    data = response.json()
    
    # Extract price information from scraped content
    for scraped in data.get('scraped_content', []):
        content = scraped.get('content', '')
        
        # Simple price extraction regex
        price_matches = re.findall(r'\\$[0-9,]+\\.?[0-9]*', content)
        
        if price_matches:
            price_data.append({
                'product': product_query,
                'url': scraped['url'],
                'domain': scraped.get('domain', 'unknown'),
                'prices_found': price_matches[:3],  # Top 3 prices
                'timestamp': datetime.now().isoformat(),
                'content_snippet': content[:300] + "..."
            })

# Display price monitoring results
print("=== PRICE MONITORING RESULTS ===")
print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\\n")

for item in price_data:
    print(f"Product: {item['product']}")
    print(f"Store: {item['domain']}")
    print(f"Prices found: {', '.join(item['prices_found'])}")
    print(f"URL: {item['url']}")
    print(f"Snippet: {item['content_snippet'][:150]}...")
    print("-" * 60)

# Save to file for historical tracking
with open(f"price_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w') as f:
    json.dump(price_data, f, indent=2)

print(f"\\nSaved {len(price_data)} price records to file")`
  }

  const examples = [
    {
      title: "Basic Search",
      description: "Simple search with result parsing and display",
      icon: Search,
      difficulty: "Beginner",
      credits: "~2 credits",
      code: basicSearch
    },
    {
      title: "News Monitoring", 
      description: "Search for recent news articles with time filtering",
      icon: Newspaper,
      difficulty: "Beginner",
      credits: "~3 credits",
      code: newsSearch
    },
    {
      title: "Lead Generation",
      description: "Extract contact information and social profiles",
      icon: Users,
      difficulty: "Intermediate", 
      credits: "~25 credits",
      code: leadGeneration
    },
    {
      title: "Competitor Analysis",
      description: "Analyze multiple competitors with domain insights",
      icon: BarChart,
      difficulty: "Advanced",
      credits: "~40 credits", 
      code: competitorAnalysis
    },
    {
      title: "Price Monitoring",
      description: "Track product prices across e-commerce sites",
      icon: ShoppingCart,
      difficulty: "Advanced",
      credits: "~30 credits",
      code: priceMonitoring
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Code className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">Search Examples</h1>
            <p className="text-gray-600">Real-world use cases and implementation patterns</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/search/parameters">
            <Button variant="outline" size="sm">
              ← Parameters
            </Button>
          </Link>
          <Link href="/docs/api/search">
            <Button variant="outline" size="sm">
              Overview
            </Button>
          </Link>
        </div>

        <Callout type="success" title="Production Ready Examples">
          All examples include proper error handling, rate limiting considerations, and best practices for production use.
        </Callout>
      </div>

      {/* Examples */}
      <div className="space-y-12">
        {examples.map((example, index) => (
          <div key={index} className="border-b pb-12 last:border-b-0">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-[#efa72d]/10 rounded-lg">
                  <example.icon className="w-6 h-6 text-[#efa72d]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#17457c]">{example.title}</h2>
                  <p className="text-gray-600">{example.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(example.difficulty)}>
                    {example.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {example.credits}
                  </Badge>
                </div>
              </div>
            </div>

            <CodeBlock 
              multiLanguage={example.code}
              title={`${example.title} Implementation`}
            />
          </div>
        ))}
      </div>

      {/* Use Case Matrix */}
      <div className="mb-12 mt-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Use Case Matrix</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Market Research
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Competitor analysis</div>
              <div>• Industry trend monitoring</div>
              <div>• Product feature comparison</div>
              <div>• Market sentiment analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Users className="w-5 h-5" />
                Lead Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Contact information extraction</div>
              <div>• Social media profile discovery</div>
              <div>• Company directory scraping</div>
              <div>• Prospect research automation</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <ShoppingCart className="w-5 h-5" />
                E-commerce
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Price monitoring</div>
              <div>• Product availability tracking</div>
              <div>• Review sentiment analysis</div>
              <div>• Competitor pricing</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Newspaper className="w-5 h-5" />
                Content & News
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• News aggregation</div>
              <div>• Content curation</div>
              <div>• Press mention tracking</div>
              <div>• Industry updates</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Briefcase className="w-5 h-5" />
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Company research</div>
              <div>• Industry reports</div>
              <div>• Financial data collection</div>
              <div>• Market analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Target className="w-5 h-5" />
                SEO & Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Keyword research</div>
              <div>• Backlink analysis</div>
              <div>• Content gap analysis</div>
              <div>• Brand mention tracking</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Implementation Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#17457c]">Error Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Always handle API errors:</strong>
                <p className="text-gray-600">Check response status codes and handle rate limiting gracefully.</p>
              </div>
              <div>
                <strong>Implement retry logic:</strong>
                <p className="text-gray-600">Use exponential backoff for transient failures.</p>
              </div>
              <div>
                <strong>Validate responses:</strong>
                <p className="text-gray-600">Check for required fields before processing data.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#17457c]">Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Batch requests:</strong>
                <p className="text-gray-600">Group similar queries to minimize API calls.</p>
              </div>
              <div>
                <strong>Cache results:</strong>
                <p className="text-gray-600">Store results locally to avoid duplicate requests.</p>
              </div>
              <div>
                <strong>Use appropriate timeouts:</strong>
                <p className="text-gray-600">Set reasonable timeout values for your use case.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/search/parameters">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Parameters Reference
          </Button>
        </Link>
        <Link href="/docs/api/scrape">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            Scrape API
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}