import Link from 'next/link'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'
import { APIMethod, StatusCode } from '../../components/APIMethod'
import { ArrowRight, Wrench, Zap } from 'lucide-react'


const tools = [
  { id: 1, name: 'JSON Formatter & Validator', slug: 'json-formatter', description: 'Format, validate, and minify JSON data with syntax highlighting and error detection.', page: '/tools/json-formatter' },
  { id: 2, name: 'Base64 Encoder/Decoder', slug: 'base64-encoder', description: 'Encode and decode Base64 strings with support for text, files, and URL-safe encoding.', page: '/tools/base64-encoder' },
  { id: 3, name: 'URL Encoder/Decoder', slug: 'url-encoder', description: 'Encode and decode URLs and query parameters. Supports full URL and component encoding.', page: '/tools/url-encoder' },
  { id: 4, name: 'UUID/GUID Generator', slug: 'uuid-generator', description: 'Generate UUIDs v1, v4, and v7 with bulk generation and format options.', page: '/tools/uuid-generator' },
  { id: 5, name: 'JWT Decoder', slug: 'jwt-decoder', description: 'Decode and inspect JWT tokens. View header, payload, and verify signatures.', page: '/tools/jwt-decoder' },
  { id: 6, name: 'Regex Tester', slug: 'regex-tester', description: 'Test regular expressions with real-time matching, group extraction, and cheat sheet.', page: '/tools/regex-tester' },
  { id: 7, name: 'HTML Entity Encoder', slug: 'html-entity-encoder', description: 'Encode and decode HTML entities. Convert special characters for safe HTML usage.', page: '/tools/html-entity-encoder' },
  { id: 8, name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', description: 'Generate placeholder text with configurable word count, paragraph count, and style.', page: '/tools/lorem-ipsum-generator' },
  { id: 9, name: 'User Agent Parser', slug: 'user-agent-parser', description: 'Parse any User-Agent string to extract browser, OS, device type, and rendering engine info. Bot detection included.', page: '/tools/user-agent-parser' },
  { id: 10, name: 'robots.txt Generator & Tester', slug: 'robots-txt-generator', description: 'Generate robots.txt files with rule builder and test URLs against robots.txt rules.', page: '/tools/robots-txt-generator' },
  { id: 11, name: 'Color Converter', slug: 'color-converter', description: 'Convert colors between HEX, RGB, HSL formats. Generate palettes and check WCAG contrast ratios.', page: '/tools/color-converter' },
]

const quickExample = {
  python: `import requests

# Parse a User-Agent string
res = requests.post(
    "https://search.venym.io/api/v1/tools/user-agent-parser",
    json={"user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0"}
)
data = res.json()
print(data["browser"]["name"])  # Chrome
print(data["os"]["name"])       # Windows
print(data["device"]["type"])   # Desktop`,
  javascript: `const res = await fetch(
  "https://search.venym.io/api/v1/tools/user-agent-parser",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0"
    })
  }
);
const data = await res.json();
console.log(data.browser.name);  // Chrome
console.log(data.os.name);       // Windows`,
  bash: `curl -X POST https://search.venym.io/api/v1/tools/user-agent-parser \\
  -H "Content-Type: application/json" \\
  -d '{"user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0"}'`
}

export default function ToolsAPIDocsPage() {
  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>DEVELOPER TOOLS API</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Free — No Auth
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Developer Tools API
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          A collection of free developer utilities — JSON formatting, encoding, parsing, and more. All tools work via interactive UI or REST API, no authentication required.
        </p>
      </div>

      <div className="grid gap-px bg-white/[0.06] border border-white/[0.06] rounded-sm overflow-hidden md:grid-cols-3 mb-12">
        <div className="bg-[#080808] p-5 text-center">
          <Wrench className="w-4 h-4 text-amber-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white tabular-nums">11 Tools</div>
          <div className="text-[12px] text-white/50 mt-1">Free utilities</div>
        </div>
        <div className="bg-[#080808] p-5 text-center">
          <Zap className="w-4 h-4 text-emerald-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white">No Auth</div>
          <div className="text-[12px] text-white/50 mt-1">No API key needed</div>
        </div>
        <div className="bg-[#080808] p-5 text-center">
          <ArrowRight className="w-4 h-4 text-sky-400/80 mx-auto mb-2" />
          <div className="text-xl font-semibold text-white">REST API</div>
          <div className="text-[12px] text-white/50 mt-1">JSON in/out</div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Start</h2>
        <CodeBlock multiLanguage={quickExample} title="Parse a User-Agent string" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Pattern</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">API Pattern</h2>
        <APIMethod
          method="POST"
          endpoint="/v1/tools/{tool-slug}"
          description="All tools follow the same pattern: POST with JSON body, receive JSON response. No authentication required."
        />

        <Callout type="info" title="Base URL">
          All tool API requests go to <code>https://search.venym.io/api/v1/tools/</code> followed by the tool slug.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Tools</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Available Tools</h2>

        <div className="space-y-2">
          {tools.map((tool) => (
            <div key={tool.id} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4 hover:border-white/[0.12] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">
                      {String(tool.id).padStart(2, '0')}
                    </span>
                    <h3 className="text-[14px] font-medium text-white">{tool.name}</h3>
                  </div>
                  <p className="text-[13px] text-white/55">{tool.description}</p>
                  <code className="text-[11px] font-mono text-white/40 mt-1 block">
                    POST /api/v1/tools/{tool.slug}
                  </code>
                </div>
                <Link href={tool.page} className="venym-btn-ghost shrink-0">
                  Try it
                  <ArrowRight className="w-3 h-3 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {tools.map((tool) => (
          <script
            key={tool.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: tool.name,
                description: tool.description,
                url: `https://search.venym.io${tool.page}`,
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Any',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                provider: {
                  '@type': 'Organization',
                  name: 'Venym Search',
                  url: 'https://search.venym.io',
                },
              }),
            }}
          />
        ))}
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Status Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Response Codes</h2>
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 space-y-1">
          <StatusCode code={200} description="Request successful — result in response body" />
          <StatusCode code={400} description="Bad request — invalid or missing parameters" />
          <StatusCode code={500} description="Internal server error" />
        </div>
      </div>

      <div className="mb-12 border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Need more power?</h3>
        <p className="text-[14px] text-white/55 leading-relaxed mb-4">
          Search, scraping, and deep content extraction for production applications.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Link href="/docs/api/search" className="venym-btn-primary">
            Search API
          </Link>
          <Link href="/docs/api/scrape" className="venym-btn-secondary">
            Scrape API
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">Browse All Tools</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Try the interactive UI for all developer tools.
          </p>
          <Link href="/tools/json-formatter" className="venym-btn-secondary">
            Go to Tools
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">Core APIs</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Explore Venym Search&apos;s production APIs for web search and data extraction.
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
