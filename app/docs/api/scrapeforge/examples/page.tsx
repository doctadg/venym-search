import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function ScrapeForgeExamplesPage() {
  const staticScraping = {
    python: `import requests

# Scraping static HTML content
response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge",
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
print(f"Links found: {len(data.get('links', []))}")
print(f"Load time: {data['load_time']}s")

# Extract article titles from meta data
if 'meta_data' in data:
    print(f"Page title: {data['meta_data'].get('title', 'N/A')}")
    print(f"Description: {data['meta_data'].get('description', 'N/A')}")
    
# Process links to find article URLs
article_links = []
for link in data.get('links', []):
    if '/article/' in link['url'] or '/news/' in link['url']:
        article_links.append({
            'url': link['url'],
            'title': link['text'],
            'full_url': urljoin(data['final_url'], link['url'])
        })

print(f"Found {len(article_links)} article links")
for article in article_links[:5]:  # Show first 5
    print(f"- {article['title']}: {article['full_url']}")`,
    javascript: `const axios = require('axios');
const { URL } = require('url');

async function scrapeStaticContent() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/scrapeforge',
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

    const data = response.data;
    console.log(\`Status: \${data.status_code}\`);
    console.log(\`Content length: \${data.content.length} characters\`);
    console.log(\`Links found: \${data.links?.length || 0}\`);
    console.log(\`Load time: \${data.load_time}s\`);

    // Extract article titles from meta data
    if (data.meta_data) {
      console.log(\`Page title: \${data.meta_data.title || 'N/A'}\`);
      console.log(\`Description: \${data.meta_data.description || 'N/A'}\`);
    }
    
    // Process links to find article URLs
    const articleLinks = [];
    if (data.links) {
      data.links.forEach(link => {
        if (link.url.includes('/article/') || link.url.includes('/news/')) {
          articleLinks.push({
            url: link.url,
            title: link.text,
            full_url: new URL(link.url, data.final_url).href
          });
        }
      });
    }

    console.log(\`Found \${articleLinks.length} article links\`);
    articleLinks.slice(0, 5).forEach(article => {
      console.log(\`- \${article.title}: \${article.full_url}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Scraping failed:', error.response?.data || error.message);
  }
}

scrapeStaticContent();`
  }

  const spaScraping = {
    python: `import requests
import json
import time

# Scraping Single Page Application (SPA) with JavaScript rendering
response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge",
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
print(f"Final URL: {data['final_url']}")
print(f"Status: {data['status_code']}")

# Extract product data from structured data
products = []
if 'schema_data' in data:
    for schema in data['schema_data']:
        if schema.get('@type') == 'Product':
            products.append({
                'name': schema.get('name', 'Unknown'),
                'price': schema.get('price', 'N/A'),
                'description': schema.get('description', '')[:100] + '...',
                'image': schema.get('image', 'N/A'),
                'availability': schema.get('availability', 'Unknown')
            })

print(f"\\nFound {len(products)} products with structured data:")
for i, product in enumerate(products[:3], 1):
    print(f"{i}. {product['name']}")
    print(f"   Price: {product['price']}")
    print(f"   Available: {product['availability']}")
    print(f"   Description: {product['description']}")
    print()

# Extract product images
product_images = []
if 'images' in data:
    for img in data['images']:
        if 'product' in img.get('alt', '').lower() or 'product' in img.get('src', '').lower():
            product_images.append({
                'src': img['src'],
                'alt': img.get('alt', ''),
                'width': img.get('width', 0),
                'height': img.get('height', 0)
            })

print(f"Found {len(product_images)} product images")

# Save screenshot URL for later analysis
if 'screenshot_url' in data:
    print(f"Screenshot saved: {data['screenshot_url']}")
    
print(f"Credits used: {data['credits_used']}")`,
    javascript: `const axios = require('axios');

async function scrapeSPAContent() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/scrapeforge',
      {
        url: 'https://spa-ecommerce.com/products',
        render_js: true,
        wait_for: '.product-grid',
        wait_time: 15,
        extract_links: true,
        extract_images: true,
        extract_schema: true,
        screenshot: true,
        screenshot_options: {
          format: 'png',
          quality: 85,
          full_page: false
        },
        proxy_type: 'residential'
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log(\`JavaScript rendering completed in \${data.load_time}s\`);
    console.log(\`Final URL: \${data.final_url}\`);
    console.log(\`Status: \${data.status_code}\`);

    // Extract product data from structured data
    const products = [];
    if (data.schema_data) {
      data.schema_data.forEach(schema => {
        if (schema['@type'] === 'Product') {
          products.push({
            name: schema.name || 'Unknown',
            price: schema.price || 'N/A',
            description: (schema.description || '').substring(0, 100) + '...',
            image: schema.image || 'N/A',
            availability: schema.availability || 'Unknown'
          });
        }
      });
    }

    console.log(\`\\nFound \${products.length} products with structured data:\`);
    products.slice(0, 3).forEach((product, index) => {
      console.log(\`\${index + 1}. \${product.name}\`);
      console.log(\`   Price: \${product.price}\`);
      console.log(\`   Available: \${product.availability}\`);
      console.log(\`   Description: \${product.description}\`);
      console.log();
    });

    // Extract product images
    const productImages = [];
    if (data.images) {
      data.images.forEach(img => {
        if ((img.alt || '').toLowerCase().includes('product') || 
            (img.src || '').toLowerCase().includes('product')) {
          productImages.push({
            src: img.src,
            alt: img.alt || '',
            width: img.width || 0,
            height: img.height || 0
          });
        }
      });
    }

    console.log(\`Found \${productImages.length} product images\`);

    // Save screenshot URL for later analysis
    if (data.screenshot_url) {
      console.log(\`Screenshot saved: \${data.screenshot_url}\`);
    }
    
    console.log(\`Credits used: \${data.credits_used}\`);
    
    return data;
  } catch (error) {
    console.error('SPA scraping failed:', error.response?.data || error.message);
  }
}

scrapeSPAContent();`
  }

  const bulkScraping = {
    python: `import requests
import concurrent.futures
import time

# Bulk scraping multiple e-commerce product pages
product_urls = [
    "https://shop1.com/product/laptop-xyz",
    "https://shop2.com/item/smartphone-abc", 
    "https://shop3.com/products/tablet-def",
    "https://shop1.com/product/headphones-ghi",
    "https://shop2.com/item/monitor-jkl"
]

# Bulk request for efficient processing
response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge/bulk",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "urls": product_urls,
        "render_js": True,
        "wait_for": ".price, .product-price, [data-testid='price']",
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
print(f"Bulk scraping completed!")
print(f"Successful: {data['successful_count']}")
print(f"Failed: {data['failed_count']}")
print(f"Total credits used: {data['credits_used']}")
print(f"Processing time: {data['total_time']}s")

# Process results for price comparison
price_comparison = []
for result in data['results']:
    if result['status'] == 'success':
        url = result['url']
        content_data = result['data']
        
        # Extract price from structured data
        price = 'Not found'
        product_name = 'Unknown'
        
        if 'schema_data' in content_data:
            for schema in content_data['schema_data']:
                if schema.get('@type') == 'Product':
                    price = schema.get('price', price)
                    product_name = schema.get('name', product_name)
                    break
        
        # Fallback to meta data
        if price == 'Not found' and 'meta_data' in content_data:
            product_name = content_data['meta_data'].get('title', product_name)
        
        price_comparison.append({
            'url': url,
            'product': product_name,
            'price': price,
            'domain': url.split('/')[2],
            'load_time': content_data['load_time']
        })
    else:
        print(f"Failed to scrape: {result['url']} - {result['error']}")

# Display price comparison
print("\\n=== PRICE COMPARISON ===")
for item in sorted(price_comparison, key=lambda x: x['domain']):
    print(f"Store: {item['domain']}")
    print(f"Product: {item['product'][:50]}...")
    print(f"Price: {item['price']}")
    print(f"Load time: {item['load_time']}s")
    print(f"URL: {item['url']}")
    print("-" * 60)

# Save results to file
import json
with open('price_comparison.json', 'w') as f:
    json.dump(price_comparison, f, indent=2)

print(f"\\nSaved {len(price_comparison)} product comparisons to price_comparison.json")`,
    javascript: `const axios = require('axios');
const fs = require('fs').promises;

async function bulkScrapeProducts() {
  const productUrls = [
    'https://shop1.com/product/laptop-xyz',
    'https://shop2.com/item/smartphone-abc', 
    'https://shop3.com/products/tablet-def',
    'https://shop1.com/product/headphones-ghi',
    'https://shop2.com/item/monitor-jkl'
  ];

  try {
    // Bulk request for efficient processing
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/scrapeforge/bulk',
      {
        urls: productUrls,
        render_js: true,
        wait_for: '.price, .product-price, [data-testid="price"]',
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

    const data = response.data;
    console.log('Bulk scraping completed!');
    console.log(\`Successful: \${data.successful_count}\`);
    console.log(\`Failed: \${data.failed_count}\`);
    console.log(\`Total credits used: \${data.credits_used}\`);
    console.log(\`Processing time: \${data.total_time}s\`);

    // Process results for price comparison
    const priceComparison = [];
    data.results.forEach(result => {
      if (result.status === 'success') {
        const url = result.url;
        const contentData = result.data;
        
        // Extract price from structured data
        let price = 'Not found';
        let productName = 'Unknown';
        
        if (contentData.schema_data) {
          const productSchema = contentData.schema_data.find(
            schema => schema['@type'] === 'Product'
          );
          if (productSchema) {
            price = productSchema.price || price;
            productName = productSchema.name || productName;
          }
        }
        
        // Fallback to meta data
        if (price === 'Not found' && contentData.meta_data) {
          productName = contentData.meta_data.title || productName;
        }
        
        priceComparison.push({
          url: url,
          product: productName,
          price: price,
          domain: new URL(url).hostname,
          load_time: contentData.load_time
        });
      } else {
        console.log(\`Failed to scrape: \${result.url} - \${result.error}\`);
      }
    });

    // Display price comparison
    console.log('\\n=== PRICE COMPARISON ===');
    priceComparison
      .sort((a, b) => a.domain.localeCompare(b.domain))
      .forEach(item => {
        console.log(\`Store: \${item.domain}\`);
        console.log(\`Product: \${item.product.substring(0, 50)}...\`);
        console.log(\`Price: \${item.price}\`);
        console.log(\`Load time: \${item.load_time}s\`);
        console.log(\`URL: \${item.url}\`);
        console.log('-'.repeat(60));
      });

    // Save results to file
    await fs.writeFile('price_comparison.json', JSON.stringify(priceComparison, null, 2));
    console.log(\`\\nSaved \${priceComparison.length} product comparisons to price_comparison.json\`);
    
    return priceComparison;
  } catch (error) {
    console.error('Bulk scraping failed:', error.response?.data || error.message);
  }
}

bulkScrapeProducts();`
  }

  const authScraping = {
    python: `import requests

# Scraping protected content with authentication
# Step 1: Login to get session cookies
login_response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://secure-site.com/login",
        "render_js": True,
        "wait_for": "#login-form",
        "custom_headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
        },
        "post_data": {
            "username": "your_username",
            "password": "your_password",
            "csrf_token": "token_from_form"
        }
    }
)

login_data = login_response.json()
print(f"Login status: {login_data['status_code']}")

# Extract session cookies from login response
session_cookies = {}
if 'set_cookies' in login_data:
    for cookie in login_data['set_cookies']:
        session_cookies[cookie['name']] = cookie['value']

print(f"Retrieved {len(session_cookies)} session cookies")

# Step 2: Access protected content using session cookies
protected_response = requests.post(
    "https://www.search.venym.io/api/v1/scrapeforge",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "url": "https://secure-site.com/dashboard",
        "render_js": True,
        "wait_for": ".dashboard-content",
        "cookies": session_cookies,
        "custom_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://secure-site.com/login"
        },
        "extract_links": True,
        "extract_meta": True
    }
)

protected_data = protected_response.json()
print(f"\\nProtected content access:")
print(f"Status: {protected_data['status_code']}")
print(f"Content length: {len(protected_data['content'])} characters")
print(f"Page title: {protected_data.get('meta_data', {}).get('title', 'N/A')}")

# Check if we successfully accessed protected content
if 'login' not in protected_data['final_url'].lower():
    print("✅ Successfully accessed protected content!")
    
    # Extract user-specific data
    user_links = []
    for link in protected_data.get('links', []):
        if any(keyword in link['url'].lower() for keyword in ['profile', 'account', 'settings', 'dashboard']):
            user_links.append(link)
    
    print(f"Found {len(user_links)} user-specific links:")
    for link in user_links[:5]:
        print(f"- {link['text']}: {link['url']}")
else:
    print("❌ Authentication failed or session expired")

print(f"Total credits used: {login_data['credits_used'] + protected_data['credits_used']}")`,
    javascript: `const axios = require('axios');

async function scrapeWithAuthentication() {
  try {
    // Step 1: Login to get session cookies
    const loginResponse = await axios.post(
      'https://www.search.venym.io/api/v1/scrapeforge',
      {
        url: 'https://secure-site.com/login',
        render_js: true,
        wait_for: '#login-form',
        custom_headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        post_data: {
          username: 'your_username',
          password: 'your_password',
          csrf_token: 'token_from_form'
        }
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const loginData = loginResponse.data;
    console.log(\`Login status: \${loginData.status_code}\`);

    // Extract session cookies from login response
    const sessionCookies = {};
    if (loginData.set_cookies) {
      loginData.set_cookies.forEach(cookie => {
        sessionCookies[cookie.name] = cookie.value;
      });
    }

    console.log(\`Retrieved \${Object.keys(sessionCookies).length} session cookies\`);

    // Step 2: Access protected content using session cookies
    const protectedResponse = await axios.post(
      'https://www.search.venym.io/api/v1/scrapeforge',
      {
        url: 'https://secure-site.com/dashboard',
        render_js: true,
        wait_for: '.dashboard-content',
        cookies: sessionCookies,
        custom_headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://secure-site.com/login'
        },
        extract_links: true,
        extract_meta: true
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const protectedData = protectedResponse.data;
    console.log('\\nProtected content access:');
    console.log(\`Status: \${protectedData.status_code}\`);
    console.log(\`Content length: \${protectedData.content.length} characters\`);
    console.log(\`Page title: \${protectedData.meta_data?.title || 'N/A'}\`);

    // Check if we successfully accessed protected content
    if (!protectedData.final_url.toLowerCase().includes('login')) {
      console.log('✅ Successfully accessed protected content!');
      
      // Extract user-specific data
      const userLinks = [];
      if (protectedData.links) {
        protectedData.links.forEach(link => {
          const keywords = ['profile', 'account', 'settings', 'dashboard'];
          if (keywords.some(keyword => link.url.toLowerCase().includes(keyword))) {
            userLinks.push(link);
          }
        });
      }
      
      console.log(\`Found \${userLinks.length} user-specific links:\`);
      userLinks.slice(0, 5).forEach(link => {
        console.log(\`- \${link.text}: \${link.url}\`);
      });
    } else {
      console.log('❌ Authentication failed or session expired');
    }

    console.log(\`Total credits used: \${loginData.credits_used + protectedData.credits_used}\`);
    
    return protectedData;
  } catch (error) {
    console.error('Authentication scraping failed:', error.response?.data || error.message);
  }
}

scrapeWithAuthentication();`
  }

  const examples = [
    {
      title: "Static Content Scraping",
      description: "Scrape traditional HTML pages with link and metadata extraction",
      icon: FileText,
      difficulty: "Beginner",
      credits: "~5 credits",
      features: ["Link extraction", "Meta data", "Residential proxies", "Fast processing"],
      code: staticScraping
    },
    {
      title: "JavaScript SPA Scraping", 
      description: "Scrape Single Page Applications with dynamic content rendering",
      icon: Code2,
      difficulty: "Intermediate",
      credits: "~12 credits",
      features: ["JavaScript rendering", "Wait conditions", "Schema extraction", "Screenshot capture"],
      code: spaScraping
    },
    {
      title: "Bulk Product Scraping",
      description: "Efficiently scrape multiple e-commerce sites for price comparison",
      icon: ShoppingCart,
      difficulty: "Advanced", 
      credits: "~35 credits",
      features: ["Bulk processing", "Concurrent requests", "Automatic retries", "Price extraction"],
      code: bulkScraping
    },
    {
      title: "Authenticated Scraping",
      description: "Access protected content behind login forms and user sessions",
      icon: Shield,
      difficulty: "Expert",
      credits: "~20 credits",
      features: ["Session management", "Cookie handling", "Custom headers", "Multi-step flow"],
      code: authScraping
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-orange-100 text-orange-700'
      case 'Expert': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Code2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">ScrapeForge Examples</h1>
            <p className="text-gray-600">Enterprise web scraping patterns and real-world implementations</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/scrapeforge/parameters">
            <Button variant="outline" size="sm">
              ← Parameters
            </Button>
          </Link>
          <Link href="/docs/api/scrapeforge">
            <Button variant="outline" size="sm">
              Overview
            </Button>
          </Link>
        </div>

        <Callout type="success" title="Production-Ready Examples">
          All examples include enterprise-grade error handling, proxy rotation, and optimization 
          strategies for high-volume scraping operations.
        </Callout>
      </div>

      {/* Examples */}
      <div className="space-y-12">
        {examples.map((example, index) => (
          <div key={index} className="border-b pb-12 last:border-b-0">
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-[#efa72d]/10 rounded-lg">
                  <example.icon className="w-6 h-6 text-[#efa72d]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#17457c]">{example.title}</h2>
                    <Badge className={getDifficultyColor(example.difficulty)}>
                      {example.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {example.credits}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{example.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {example.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
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

      {/* Industry Use Cases */}
      <div className="mb-12 mt-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Industry Use Cases</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <ShoppingCart className="w-5 h-5" />
                E-commerce Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Competitor price monitoring</div>
              <div>• Product availability tracking</div>
              <div>• Review sentiment analysis</div>
              <div>• Inventory level monitoring</div>
              <div>• Dynamic pricing optimization</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Financial Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Stock price monitoring</div>
              <div>• Financial report extraction</div>
              <div>• Market sentiment analysis</div>
              <div>• Economic indicator tracking</div>
              <div>• Earnings data collection</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Database className="w-5 h-5" />
                Real Estate
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Property listing aggregation</div>
              <div>• Market price analysis</div>
              <div>• Rental rate tracking</div>
              <div>• Property feature extraction</div>
              <div>• Neighborhood data collection</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Newspaper className="w-5 h-5" />
                Media & News
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• News article aggregation</div>
              <div>• Social media monitoring</div>
              <div>• Brand mention tracking</div>
              <div>• Content trend analysis</div>
              <div>• Press release collection</div>
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
              <div>• Company directory scraping</div>
              <div>• Social profile discovery</div>
              <div>• Email verification</div>
              <div>• Professional network analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Globe className="w-5 h-5" />
                Travel & Hospitality
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Hotel price comparison</div>
              <div>• Flight availability tracking</div>
              <div>• Review aggregation</div>
              <div>• Amenity data extraction</div>
              <div>• Booking trend analysis</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Optimization */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Performance Optimization Strategies</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Zap className="w-5 h-5" />
                Speed Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Selective JavaScript rendering:</strong>
                <p className="text-gray-600">Only use render_js when the content requires it</p>
              </div>
              <div>
                <strong>Specific wait conditions:</strong>
                <p className="text-gray-600">Use precise CSS selectors for wait_for parameter</p>
              </div>
              <div>
                <strong>Optimal proxy selection:</strong>
                <p className="text-gray-600">Choose datacenter proxies for speed, residential for stealth</p>
              </div>
              <div>
                <strong>Concurrent processing:</strong>
                <p className="text-gray-600">Use bulk endpoints for multiple URLs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Clock className="w-5 h-5" />
                Reliability Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Implement retry logic:</strong>
                <p className="text-gray-600">Handle temporary failures with exponential backoff</p>
              </div>
              <div>
                <strong>Monitor success rates:</strong>
                <p className="text-gray-600">Track scraping success and adjust strategies</p>
              </div>
              <div>
                <strong>Use appropriate timeouts:</strong>
                <p className="text-gray-600">Set wait_time based on typical page load speeds</p>
              </div>
              <div>
                <strong>Handle edge cases:</strong>
                <p className="text-gray-600">Plan for CAPTCHAs, rate limits, and IP blocks</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Common Issues & Solutions</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">Issue: JavaScript Content Not Loading</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Symptoms:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Empty or incomplete content</li>
                    <li>• Missing dynamic elements</li>
                    <li>• Placeholder text instead of data</li>
                  </ul>
                </div>
                <div>
                  <strong>Solutions:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Enable render_js: true</li>
                    <li>• Use specific wait_for selectors</li>
                    <li>• Increase wait_time parameter</li>
                    <li>• Add necessary custom_headers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">Issue: Getting Blocked or Rate Limited</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Symptoms:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• 403 Forbidden responses</li>
                    <li>• CAPTCHA challenges</li>
                    <li>• Consistent timeouts</li>
                  </ul>
                </div>
                <div>
                  <strong>Solutions:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Use residential proxies</li>
                    <li>• Add realistic user_agent</li>
                    <li>• Implement request delays</li>
                    <li>• Rotate proxy countries</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">Issue: High Credit Consumption</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Symptoms:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Unexpectedly high costs</li>
                    <li>• Slow processing times</li>
                    <li>• Unnecessary feature usage</li>
                  </ul>
                </div>
                <div>
                  <strong>Solutions:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Disable unused extractions</li>
                    <li>• Use datacenter proxies when possible</li>
                    <li>• Optimize wait conditions</li>
                    <li>• Batch similar requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/scrapeforge/parameters">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Parameters Reference
          </Button>
        </Link>
        <Link href="/docs/api/deepdive">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            DeepDive API
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}