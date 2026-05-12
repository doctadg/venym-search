import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'
import { APIMethod, StatusCode } from '../../components/APIMethod'
import { ArrowRight, Wrench, Zap } from 'lucide-react'


const tools = [

  {
    id: 1,
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    description: 'Format, validate, and minify JSON data with syntax highlighting and error detection.',
    page: '/tools/json-formatter',
  },
  {
    id: 2,
    name: 'Base64 Encoder/Decoder',
    slug: 'base64-encoder',
    description: 'Encode and decode Base64 strings with support for text, files, and URL-safe encoding.',
    page: '/tools/base64-encoder',
  },
  {
    id: 3,
    name: 'URL Encoder/Decoder',
    slug: 'url-encoder',
    description: 'Encode and decode URLs and query parameters. Supports full URL and component encoding.',
    page: '/tools/url-encoder',
  },
  {
    id: 4,
    name: 'UUID/GUID Generator',
    slug: 'uuid-generator',
    description: 'Generate UUIDs v1, v4, and v7 with bulk generation and format options.',
    page: '/tools/uuid-generator',
  },
  {
    id: 5,
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    description: 'Decode and inspect JWT tokens. View header, payload, and verify signatures.',
    page: '/tools/jwt-decoder',
  },
  {
    id: 6,
    name: 'Regex Tester',
    slug: 'regex-tester',
    description: 'Test regular expressions with real-time matching, group extraction, and cheat sheet.',
    page: '/tools/regex-tester',
  },
  {
    id: 7,
    name: 'HTML Entity Encoder',
    slug: 'html-entity-encoder',
    description: 'Encode and decode HTML entities. Convert special characters for safe HTML usage.',
    page: '/tools/html-entity-encoder',
  },
  {
    id: 8,
    name: 'Lorem Ipsum Generator',
    slug: 'lorem-ipsum-generator',
    description: 'Generate placeholder text with configurable word count, paragraph count, and style.',
    page: '/tools/lorem-ipsum-generator',
  },
  {
    id: 9,
    name: 'User Agent Parser',
    slug: 'user-agent-parser',
    description: 'Parse any User-Agent string to extract browser, OS, device type, and rendering engine info. Bot detection included.',
    page: '/tools/user-agent-parser',
  },
  {
    id: 10,
    name: 'robots.txt Generator & Tester',
    slug: 'robots-txt-generator',
    description: 'Generate robots.txt files with rule builder and test URLs against robots.txt rules.',
    page: '/tools/robots-txt-generator',
  },
  {
    id: 11,
    name: 'Color Converter',
    slug: 'color-converter',
    description: 'Convert colors between HEX, RGB, HSL formats. Generate palettes and check WCAG contrast ratios.',
    page: '/tools/color-converter',
  },
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#efa72d]/10 rounded-lg">
            <Wrench className="w-6 h-6 text-[#efa72d]" />
          </div>
          <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10 border-0">
            Free — No Auth Required
          </Badge>
        </div>

        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Developer Tools API
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          A collection of free developer utilities — JSON formatting, encoding, parsing, and more.
          All tools work via interactive UI or REST API, no authentication required.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Wrench className="w-6 h-6 text-[#efa72d] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">11 Tools</div>
            <div className="text-sm text-gray-600">Free utilities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">No Auth</div>
            <div className="text-sm text-gray-600">No API key needed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ArrowRight className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#17457c]">REST API</div>
            <div className="text-sm text-gray-600">JSON in/out</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Start</h2>
        <CodeBlock
          multiLanguage={quickExample}
          title="Parse a User-Agent string"
        />
      </div>

      {/* API Pattern */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">API Pattern</h2>
        <APIMethod
          method="POST"
          endpoint="/v1/tools/{tool-slug}"
          description="All tools follow the same pattern: POST with JSON body, receive JSON response. No authentication required."
        />

        <Callout type="info" title="Base URL">
          All tool API requests go to <code>https://search.venym.io/api/v1/tools/</code> followed by the tool slug.
        </Callout>
      </div>

      {/* Tools List */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Available Tools</h2>

        <div className="space-y-3">
          {tools.map((tool) => (
            <Card key={tool.id} className="border-l-4 border-l-[#efa72d]/50 hover:border-l-[#efa72d] transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {tool.id}
                      </Badge>
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                    <code className="text-xs text-gray-400 mt-1 block">
                      POST /api/v1/tools/{tool.slug}
                    </code>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={tool.page}>
                      <Badge className="bg-[#17457c] hover:bg-[#17457c]/90 text-white border-0 cursor-pointer">
                        Try it
                      </Badge>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* JSON-LD for each tool */}
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

      {/* Response Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Codes</h2>
        <div className="space-y-3">
          <StatusCode code={200} description="Request successful — result in response body" />
          <StatusCode code={400} description="Bad request — invalid or missing parameters" />
          <StatusCode code={500} description="Internal server error" />
        </div>
      </div>

      {/* Cross-promo */}
      <div className="mb-12">
        <Card className="border-[#17457c]/20 bg-[#17457c]/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#17457c] mb-2">Need more power?</h3>
            <p className="text-gray-600 mb-4">
              scraping, and deep content extraction for production applications.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Badge className="bg-[#17457c] hover:bg-[#17457c]/90 text-white border-0 cursor-pointer">
                  Search API
                </Badge>
              </Link>
              <Link href="/docs/api/scrape">
                <Badge className="bg-[#17457c]/80 hover:bg-[#17457c]/70 text-white border-0 cursor-pointer">
                  Scrape API
                </Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#efa72d]" />
              Browse All Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Try the interactive UI for all developer tools.
            </p>
            <Link href="/tools/json-formatter">
              <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10 border-0 cursor-pointer">
                Go to Tools <ArrowRight className="w-3 h-3 inline ml-1" />
              </Badge>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#17457c]" />
              Core APIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore Venym Search&apos;s production APIs for web search and data extraction.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Badge className="bg-[#17457c] hover:bg-[#17457c]/90 text-white border-0 cursor-pointer">
                  Search
                </Badge>
              </Link>
              <Link href="/docs/api/scrape">
                <Badge className="bg-[#17457c] hover:bg-[#17457c]/90 text-white border-0 cursor-pointer">
                  Scrape
                </Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
