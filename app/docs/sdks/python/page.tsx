import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package,
  Code,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Download,
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'

export default function PythonSDKPage() {
  const installCode = {
    python: `# Install from GitHub (PyPI coming soon)
pip install git+https://github.com/doctadg/VENYM_SEARCH-python.git`,
    bash: `# Install from GitHub
pip install git+https://github.com/doctadg/VENYM_SEARCH-python.git

# Update to latest version
pip install --upgrade git+https://github.com/doctadg/VENYM_SEARCH-python.git`
  }

  const quickStartCode = `from VENYM_SEARCH import Venym Search

# Initialize client with your API key
client = Venym Search(api_key="sk_live_YOUR_API_KEY_API_KEY_key_here")

# Or use environment variable (recommended)
# export VENYM_SEARCH_API_KEY="sk_live_YOUR_API_KEY_API_KEY_key_here"
# client = Venym Search()

# Search: Real-time web search
search_results = client.venym_search(
    query="Bitcoin price 2025 predictions",
    max_results=10,
    auto_scrape_top=3
)

print(f"Found {search_results.results_count} results")
print(f"Credits used: {search_results.credits_used}")

# Access results
for result in search_results.search_results:
    print(f"Title: {result.title}")
    print(f"URL: {result.link}")
    print(f"Snippet: {result.snippet}\\n")

# Scrape: Extract content from URLs
scraped_data = client.scrape(
    url="https://coindesk.com/price/bitcoin"
)

print(f"Page title: {scraped_data.title}")
print(f"Content length: {len(scraped_data.text)}")

    query="cryptocurrency market trends 2025",
    max_pages=5
)

print(f"Scraped {len(research.scraped_content)} pages")
if research.summary:
    print(f"Summary: {research.summary}")`

  const clientConfigCode = `from VENYM_SEARCH import Venym Search

# Basic configuration with API key
client = Venym Search(
    api_key="sk_live_YOUR_API_KEY_API_KEY_key_here"
)

# Full configuration
client = Venym Search(
    api_key="sk_live_YOUR_API_KEY_API_KEY_key_here",
    base_url="https://www.search.venym.io/api/v1",  # Custom endpoint
    timeout=30,  # Request timeout in seconds
)

# Environment-based configuration (recommended)
# export VENYM_SEARCH_API_KEY="sk_live_YOUR_API_KEY_API_KEY_key_here"
import os
client = Venym Search()  # Reads VENYM_SEARCH_API_KEY env var

# Check API health
health = client.health()
print(f"API Status: {health}")`

  const swiftSearchCode = `# Search examples

# Basic search
results = client.venym_search("Python web scraping tutorial")

# Advanced search with all options
results = client.venym_search(
    query="AI startups funding 2025",
    max_results=20,
    auto_scrape_top=5,           # Scrape top 5 results
    include_contacts=True,       # Extract contact info
    include_social=True,         # Find social profiles
)

# Access different result types
print("Search Results:")
for result in results.search_results:
    print(f"- {result.title} ({result.link})")

print(f"\\nResults count: {results.results_count}")
print(f"Scraped count: {results.scraped_count}")
print(f"Credits used: {results.credits_used}")
print(f"Remaining credits: {results.remaining_credits}")

# Access scraped content (when auto_scrape_top is set)
print("\\nScraped Content:")
for content in results.scraped_content:
    if not content.error:
        print(f"- {content.title}: {len(content.text)} chars")

# Access contacts (when include_contacts=True)
if results.contacts:
    for contact in results.contacts:
        print(f"- {contact.name} ({contact.email}) at {contact.company}")

# Access social profiles (when include_social=True)
if results.social_profiles:
    for profile in results.social_profiles:
        print(f"- {profile.platform}: {profile.url}")

# Handle errors gracefully
try:
    results = client.venym_search("test query")
except VenymSearchError as e:
    print(f"API Error: {e}")
except RateLimitError as e:
    print(f"Rate limited: {e}")
except AuthenticationError as e:
    print(f"Auth error: {e}")`

  const scrapeForgeCode = `# Scrape examples

# Basic web scraping
scraped = client.scrape(
    url="https://example.com/article"
)

# Advanced scraping with options
scraped = client.scrape(
    url="https://news.ycombinator.com",
    extract=["title", "text", "links", "images", "metadata"],
    wait_for=".storylink",       # CSS selector to wait for
    use_browser=True,            # Use headless browser
    timeout=30,                  # Override timeout for this request
)

# Access extracted content
print(f"Title: {scraped.title}")
print(f"Text: {scraped.text[:500]}...")  # First 500 chars
print(f"Credits used: {scraped.credits_used}")
print(f"Remaining credits: {scraped.remaining_credits}")

# Links found on page
if scraped.links:
    print(f"\\nFound {len(scraped.links)} links:")
    for link in scraped.links[:5]:
        print(f"- {link.text}: {link.url}")

# Images found on page
if scraped.images:
    print(f"\\nFound {len(scraped.images)} images:")
    for img in scraped.images[:3]:
        print(f"- {img.alt}: {img.src}")

# Metadata
if scraped.metadata:
    print(f"\\nMetadata: {scraped.metadata}")

# Handle errors
if scraped.error:
    print(f"Scrape error: {scraped.error}")

# Batch scraping multiple URLs
urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
]

batch_results = client.batch_scrape(urls, timeout=15000)
for result in batch_results:
    print(f"{result.url}: {result.title if not result.error else 'Failed: ' + result.error}")`


# Basic research
    query="quantum computing breakthroughs 2025"
)

# Comprehensive research with options
    query="sustainable energy investment opportunities",
    max_pages=10,
    extract_content=True,
    include_domains=["reuters.com", "bloomberg.com"],
    exclude_domains=["spam-site.com"]
)

# Access research results
print(f"Sources analyzed: {len(research.search_results)}")
print(f"Pages scraped: {len(research.scraped_content)}")

# Search results
print("\\nKey Sources:")
for result in research.search_results:
    print(f"- {result.title} ({result.link})")

# Scraped and analyzed content
print("\\nContent Analysis:")
for content in research.scraped_content[:3]:
    if not content.error:
        summary = content.text[:200] + "..." if len(content.text) > 200 else content.text
        print(f"- {content.title}:\\n  {summary}\\n")

# AI-generated summary
if research.summary:
    print(f"Summary:\\n{research.summary}")

# Credit tracking
print(f"Credits used: {research.credits_used}")
print(f"Remaining credits: {research.remaining_credits}")`

  const asyncCode = `import asyncio
from VENYM_SEARCH import AsyncVenym Search

async def main():
    # Async client for high-performance applications
    client = AsyncVenym Search(api_key="sk_live_YOUR_API_KEY_API_KEY_key_here")
    
    try:
        # Async search
        results = await client.venym_search("Python async tutorial")
        print(f"Found {results.results_count} results")
        
        # Concurrent requests
        search_task = asyncio.create_task(client.venym_search("AI news"))
        scrape_task = asyncio.create_task(client.scrape("https://example.com"))
        
        # Wait for all to complete
        search_res, scrape_res, research_res = await asyncio.gather(
            search_task, scrape_task, research_task
        )
        
        print(f"Search: {search_res.results_count} results")
        print(f"Scrape: {scrape_res.title}")
        print(f"Research: {len(research_res.scraped_content)} sources")
        
    finally:
        await client.close()

# Run the async function
asyncio.run(main())

# Or use context manager (recommended)
async def with_context_manager():
    async with AsyncVenym Search(api_key="sk_live_YOUR_API_KEY_API_KEY_key_here") as client:
        results = await client.venym_search("test query")
        return results`

  const errorHandlingCode = `from VENYM_SEARCH import Venym Search
from VENYM_SEARCH.exceptions import VenymSearchError, AuthenticationError, RateLimitError

client = Venym Search(api_key="sk_live_YOUR_API_KEY_API_KEY_key_here")

try:
    results = client.venym_search("test query")
    
except AuthenticationError:
    print("Invalid API key - check your credentials")
    
except RateLimitError as e:
    print(f"Rate limited: {e}")
    
except VenymSearchError as e:
    print(f"API error: {e}")
    
except Exception as e:
    print(f"Unexpected error: {e}")

# Retry logic with exponential backoff
import time
import random

def search_with_retry(query, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.venym_search(query)
        except RateLimitError as e:
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f"Rate limited, retrying in {wait_time:.1f}s...")
                time.sleep(wait_time)
            else:
                raise
        except VenymSearchError as e:
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f"API error, retrying in {wait_time:.1f}s...")
                time.sleep(wait_time)
            else:
                raise

# Usage
try:
    results = search_with_retry("Bitcoin price analysis")
    print(f"Success! Found {results.results_count} results")
except Exception as e:
    print(f"All retries failed: {e}")`

  const dataModelsCode = `# Response shapes

# SearchResponse
search_results = client.venym_search("test query")
print(search_results.query)              # str
print(search_results.search_results)     # list of results
print(search_results.scraped_content)    # list of scraped pages (when auto_scrape_top set)
print(search_results.contacts)           # Optional[list] (when include_contacts=True)
print(search_results.social_profiles)    # Optional[list] (when include_social=True)
print(search_results.credits_used)       # int
print(search_results.remaining_credits)  # int
print(search_results.results_count)      # int
print(search_results.scraped_count)      # int

# ScrapeResponse
scrape_result = client.scrape("https://example.com")
print(scrape_result.url)                 # str
print(scrape_result.title)               # str
print(scrape_result.text)                # str
print(scrape_result.links)               # list
print(scrape_result.images)              # list
print(scrape_result.metadata)            # dict
print(scrape_result.error)               # Optional[str]
print(scrape_result.credits_used)        # int
print(scrape_result.remaining_credits)   # int

print(research.search_results)           # list
print(research.scraped_content)          # list
print(research.summary)                  # Optional[str]
print(research.credits_used)             # int
print(research.remaining_credits)        # int

# Convert to dict/JSON for storage
data_dict = search_results.model_dump()
json_str = search_results.model_dump_json()`

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Official SDK
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Python SDK
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          The official Python SDK for Venym Search APIs. Type-safe, async-ready Python bindings 
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <Code className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-semibold text-sm">Type Safe</h3>
            <p className="text-xs text-gray-600 mt-1">Full type hints & Pydantic models</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <Zap className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold text-sm">Async Ready</h3>
            <p className="text-xs text-gray-600 mt-1">Built-in async/await support</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardContent className="p-4">
            <Shield className="w-6 h-6 text-[#efa72d] mb-2" />
            <h3 className="font-semibold text-sm">Error Handling</h3>
            <p className="text-xs text-gray-600 mt-1">Typed exceptions for every error</p>
          </CardContent>
        </Card>
      </div>

      {/* Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Installation</h2>
        
        <CodeBlock
          multiLanguage={installCode}
          title="Install the Python SDK from GitHub"
        />

        <div className="mt-6">
          <Callout type="info" title="Requirements">
            Python 3.8+ required. The SDK uses httpx for HTTP requests and Pydantic for response models. Supports both synchronous and asynchronous usage.
          </Callout>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Start</h2>
        
        <p className="text-gray-600 mb-6">
          Get up and running with all three APIs in minutes.
        </p>

        <CodeBlock
          code={quickStartCode}
          language="python"
          title="Quick start example covering all APIs"
        />
      </div>

      {/* Client Configuration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Client Configuration</h2>
        
        <CodeBlock
          code={clientConfigCode}
          language="python"
          title="Client configuration options"
        />
      </div>

      {/* Search */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Search API</h2>
        
        <p className="text-gray-600 mb-6">
          Real-time web search with automatic content extraction and data enrichment.
        </p>

        <CodeBlock
          code={swiftSearchCode}
          language="python"
          title="Search examples"
        />
      </div>

      {/* Scrape */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Scrape API</h2>
        
        <p className="text-gray-600 mb-6">
          Extract structured content from any URL, including JavaScript-rendered pages.
        </p>

        <CodeBlock
          code={scrapeForgeCode}
          language="python"
          title="Scrape examples"
        />
      </div>

      <div className="mb-12">
        
        <p className="text-gray-600 mb-6">
          Multi-source research across multiple pages with content extraction.
        </p>

        <CodeBlock
          language="python"
        />
      </div>

      {/* Async Support */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Async Support</h2>
        
        <p className="text-gray-600 mb-6">
          High-performance async/await support for concurrent requests and better scalability.
        </p>

        <CodeBlock
          code={asyncCode}
          language="python"
          title="Async usage patterns"
        />
      </div>

      {/* Error Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Handling</h2>
        
        <CodeBlock
          code={errorHandlingCode}
          language="python"
          title="Error handling with retry logic"
        />
      </div>

      {/* Data Models */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Models</h2>
        
        <p className="text-gray-600 mb-6">
          All response objects are Pydantic models with full type support. Use <code>.model_dump()</code> or <code>.model_dump_json()</code> for serialization.
        </p>

        <CodeBlock
          code={dataModelsCode}
          language="python"
          title="Response objects and their fields"
        />
      </div>

      {/* Configuration Reference */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Configuration Reference</h2>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Parameter</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Default</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-3 font-mono text-sm">api_key</td>
                <td className="px-6 py-3 text-sm">str</td>
                <td className="px-6 py-3 text-sm"><code>VENYM_SEARCH_API_KEY</code> env var</td>
                <td className="px-6 py-3 text-sm">Your Venym Search API key</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-sm">base_url</td>
                <td className="px-6 py-3 text-sm">str</td>
                <td className="px-6 py-3 text-sm font-mono text-xs">https://www.search.venym.io/api/v1</td>
                <td className="px-6 py-3 text-sm">API base URL</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-sm">timeout</td>
                <td className="px-6 py-3 text-sm">int</td>
                <td className="px-6 py-3 text-sm">30</td>
                <td className="px-6 py-3 text-sm">Request timeout in seconds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Best Practices</h2>
        
        <div className="space-y-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Use environment variables for API keys</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Store your API key in <code>VENYM_SEARCH_API_KEY</code> environment variable instead of hardcoding
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#efa72d]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#efa72d] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Monitor credit usage</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Check <code>remaining_credits</code> in responses and set up alerts before running out
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Use async for high-throughput applications</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <code>AsyncVenym Search</code> with <code>async with</code> context manager for concurrent requests
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#efa72d]" />
              GitHub Repository
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Source code, issues, and examples.
            </p>
            <Link href="https://github.com/doctadg/VENYM_SEARCH-python" target="_blank">
              <Button size="sm" variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#17457c]" />
              API Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Full API documentation with all parameters and response formats.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Search
                </Button>
              </Link>
              <Link href="/docs/api/scrape">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Scrape
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
