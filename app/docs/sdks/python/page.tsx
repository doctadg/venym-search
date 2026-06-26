import Link from 'next/link'
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
client = Venym Search(api_key="sk_live_64_HEX_CHARS_key_here")

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
print(f"Content length: {len(scraped_data.text)}")`

  const clientConfigCode = `from VENYM_SEARCH import Venym Search

# Basic configuration with API key
client = Venym Search(
    api_key="sk_live_64_HEX_CHARS_key_here"
)

# Full configuration
client = Venym Search(
    api_key="sk_live_64_HEX_CHARS_key_here",
    base_url="https://www.search.venym.io/api/v1",
    timeout=30,
)

# Environment-based configuration (recommended)
import os
client = Venym Search()  # Reads VENYM_SEARCH_API_KEY env var

# Check API health
health = client.health()
print(f"API Status: {health}")`

  const swiftSearchCode = `# Search examples
results = client.venym_search(
    query="AI startups funding 2025",
    max_results=20,
    auto_scrape_top=5,
    include_contacts=True,
    include_social=True,
)

print("Search Results:")
for result in results.search_results:
    print(f"- {result.title} ({result.link})")

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
scraped = client.scrape(
    url="https://news.ycombinator.com",
    extract=["title", "text", "links", "images", "metadata"],
    wait_for=".storylink",
    use_browser=True,
    timeout=30,
)

print(f"Title: {scraped.title}")
print(f"Text: {scraped.text[:500]}...")
print(f"Credits used: {scraped.credits_used}")

# Batch scraping multiple URLs
urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
]

batch_results = client.batch_scrape(urls, timeout=15000)
for result in batch_results:
    print(f"{result.url}: {result.title if not result.error else 'Failed: ' + result.error}")`

  const asyncCode = `import asyncio
from VENYM_SEARCH import AsyncVenym Search

async def main():
    client = AsyncVenym Search(api_key="sk_live_64_HEX_CHARS_key_here")

    try:
        results = await client.venym_search("Python async tutorial")
        print(f"Found {results.results_count} results")

        search_task = asyncio.create_task(client.venym_search("AI news"))
        scrape_task = asyncio.create_task(client.scrape("https://example.com"))

        search_res, scrape_res = await asyncio.gather(
            search_task, scrape_task
        )
    finally:
        await client.close()

asyncio.run(main())`

  const errorHandlingCode = `from VENYM_SEARCH import Venym Search
from VENYM_SEARCH.exceptions import VenymSearchError, AuthenticationError, RateLimitError

client = Venym Search(api_key="sk_live_64_HEX_CHARS_key_here")

try:
    results = client.venym_search("test query")
except AuthenticationError:
    print("Invalid API key - check your credentials")
except RateLimitError as e:
    print(f"Rate limited: {e}")
except VenymSearchError as e:
    print(f"API error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")`

  const dataModelsCode = `# Response shapes

# SearchResponse
search_results = client.venym_search("test query")
print(search_results.query)              # str
print(search_results.search_results)     # list of results
print(search_results.credits_used)       # int
print(search_results.remaining_credits)  # int

# ScrapeResponse
scrape_result = client.scrape("https://example.com")
print(scrape_result.url)                 # str
print(scrape_result.title)               # str
print(scrape_result.text)                # str
print(scrape_result.credits_used)        # int

# Convert to dict/JSON for storage
data_dict = search_results.model_dump()
json_str = search_results.model_dump_json()`

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>SDK · PYTHON</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Official
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Python SDK
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          The official Python SDK for Venym Search APIs. Type-safe, async-ready Python bindings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-12">
        {[
          { icon: Code, title: 'Type Safe', desc: 'Full type hints & Pydantic models' },
          { icon: Zap, title: 'Async Ready', desc: 'Built-in async/await support' },
          { icon: Shield, title: 'Error Handling', desc: 'Typed exceptions for every error' }
        ].map((f) => (
          <div key={f.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <f.icon className="w-5 h-5 text-white/50 mb-3" />
            <h3 className="text-[14px] font-medium text-white mb-1">{f.title}</h3>
            <p className="text-[12px] text-white/55">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Installation</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Installation</h2>

        <CodeBlock multiLanguage={installCode} title="Install the Python SDK from GitHub" />

        <Callout type="info" title="Requirements">
          Python 3.8+ required. The SDK uses httpx for HTTP requests and Pydantic for response models. Supports both synchronous and asynchronous usage.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Start</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Get up and running with all three APIs in minutes.
        </p>
        <CodeBlock code={quickStartCode} language="python" title="Quick start example covering all APIs" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Configuration</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Client Configuration</h2>
        <CodeBlock code={clientConfigCode} language="python" title="Client configuration options" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Search</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Search API</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Real-time web search with automatic content extraction and data enrichment.
        </p>
        <CodeBlock code={swiftSearchCode} language="python" title="Search examples" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Scrape</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Scrape API</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Extract structured content from any URL, including JavaScript-rendered pages.
        </p>
        <CodeBlock code={scrapeForgeCode} language="python" title="Scrape examples" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Async</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Async Support</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          High-performance async/await support for concurrent requests and better scalability.
        </p>
        <CodeBlock code={asyncCode} language="python" title="Async usage patterns" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Error Handling</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Handling</h2>
        <CodeBlock code={errorHandlingCode} language="python" title="Error handling with retry logic" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">08 · Models</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Models</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          All response objects are Pydantic models with full type support. Use <code>.model_dump()</code> or <code>.model_dump_json()</code> for serialization.
        </p>
        <CodeBlock code={dataModelsCode} language="python" title="Response objects and their fields" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">09 · Config Reference</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Configuration Reference</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Parameter</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Type</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Default</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['api_key', 'str', 'VENYM_SEARCH_API_KEY env var', 'Your Venym Search API key'],
                ['base_url', 'str', 'https://www.search.venym.io/api/v1', 'API base URL'],
                ['timeout', 'int', '30', 'Request timeout in seconds']
              ].map((row) => (
                <tr key={row[0]} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-[13px] font-mono text-white/80">{row[0]}</td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{row[1]}</td>
                  <td className="px-6 py-3 text-[13px] font-mono text-white/65">{row[2]}</td>
                  <td className="px-6 py-3 text-[13px] text-white/70">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">10 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Best Practices</h2>

        <div className="space-y-3">
          {[
            { t: 'Use environment variables for API keys', d: 'Store your API key in VENYM_SEARCH_API_KEY environment variable instead of hardcoding' },
            { t: 'Monitor credit usage', d: 'Check remaining_credits in responses and set up alerts before running out' },
            { t: 'Use async for high-throughput applications', d: 'AsyncVenym Search with async with context manager for concurrent requests' }
          ].map((item) => (
            <div key={item.t} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[14px] font-medium text-white">{item.t}</p>
                  <p className="text-[13px] text-white/55 mt-1">{item.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">GitHub Repository</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Source code, issues, and examples.
          </p>
          <Link href="https://github.com/doctadg/VENYM_SEARCH-python" target="_blank" className="venym-btn-secondary">
            <ExternalLink className="w-3 h-3 mr-1.5" />
            View on GitHub
          </Link>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">API Reference</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Full API documentation with all parameters and response formats.
          </p>
          <div className="flex gap-2">
            <Link href="/docs/api/search" className="venym-btn-ghost">Search</Link>
            <Link href="/docs/api/scrape" className="venym-btn-ghost">Scrape</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
