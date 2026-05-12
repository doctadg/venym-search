import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Download, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Terminal,
  ExternalLink,
  BookOpen,
  Package
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function JavaScriptSDKPage() {
  const installCode = {
    npm: `npm install VENYM_SEARCH-js`,
    yarn: `yarn add VENYM_SEARCH-js`,
    pnpm: `pnpm add VENYM_SEARCH-js`
  }

  const initCode = `import { Venym Search, VenymSearchError, RateLimitError, AuthenticationError } from 'VENYM_SEARCH-js';



const client = new Venym Search({
  apiKey: 'sk_live_YOUR_API_KEY_API_KEY_key_here',
  // baseURL: 'https://www.search.venym.io/api/v1', // default
});`

  const swiftSearchCode = `// Search with optional auto-scraping of top results
const result = await client.swiftSearch({
  query: 'latest AI developments 2025',
  max_results: 10,
  auto_scrape_top: 3,
  include_contacts: true,
  include_social: true
});

console.log(\`Found \${result.results_count} results, \${result.scraped_count} scraped\`);
console.log(\`Credits used: \${result.credits_used}, remaining: \${result.remaining_credits}\`);

result.search_results.forEach((r) => {
  console.log(\`\${r.position}. \${r.title}\`);
  console.log(\`   \${r.link}\`);
  console.log(\`   \${r.snippet}\`);
});

// If auto_scrape_top was set, scraped content is included:
result.scraped_content.forEach((page) => {
  console.log(\`Scraped: \${page.url} — \${page.text.length} chars\`);
});`

  const scrapeForgeCode = `// Scrape a single page
const page = await client.scrapeForge({
  url: 'https://example.com/article',
  extract: ['title', 'text', 'links', 'images'],
  wait_for: '.content',
  timeout: 30,
  use_browser: false
});

console.log('Title:', page.title);
console.log('Content length:', page.text.length);
console.log('Links found:', page.links.length);
console.log('Images found:', page.images.length);
console.log('Credits remaining:', page.remaining_credits);`


  const batchScrapeCode = `// Scrape multiple URLs at once
const results = await client.batchScrape({
  urls: [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
  ],
  extract: ['title', 'text'],
  timeout: 30,
  use_browser: false
});

results.forEach((page) => {
  if (page.error) {
    console.error(\`Failed \${page.url}: \${page.error}\`);
  } else {
    console.log(\`OK: \${page.url} — \${page.title}\`);
  }
});`

  const healthCode = `// Check API status
const health = await client.health();
console.log('API status:', health.status);`

  const errorHandlingCode = `import { VenymSearchError, RateLimitError, AuthenticationError } from 'VENYM_SEARCH-js';

try {
  const result = await client.swiftSearch({ query: 'test' });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error(\`Rate limited. Retry after \${error.retryAfter}s\`);
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof VenymSearchError) {
    console.error(\`API error (\${error.statusCode}): \${error.message}\`);
  } else {
    throw error;
  }
}`

  const methods = [
    { method: 'swiftSearch(options)', description: 'Real-time web search with optional auto-scraping', returns: 'SearchResponse' },
    { method: 'scrapeForge(options)', description: 'Extract content from a single webpage', returns: 'ScrapeResponse' },
    { method: 'batchScrape(options)', description: 'Scrape multiple URLs in one request', returns: 'ScrapeResponse[]' },
    { method: 'health()', description: 'Check API health status', returns: 'HealthResponse' },
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Code className="w-6 h-6 text-yellow-600" />
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            JavaScript SDK
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-700">
            v1.1.0
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          JavaScript/Node.js SDK
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Official JavaScript SDK for Venym Search APIs. Zero runtime dependencies, native fetch, 
          full TypeScript support. Requires Node.js 18+.
        </p>
      </div>

      <Callout type="info" title="Zero Dependencies">
        <code>VENYM_SEARCH-js</code> has zero runtime dependencies and uses the native <code>fetch</code> API. 
        It works in Node.js 18+, modern browsers, and edge runtimes like Vercel Edge Functions and Cloudflare Workers.
      </Callout>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Start</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">1. Install</h3>
            <CodeBlock multiLanguage={installCode} title="Installation" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">2. Initialize</h3>
            <CodeBlock language="javascript" code={initCode} title="Set up the client" />
          </div>
        </div>
      </div>

      {/* Core Methods Table */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Methods</h2>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {methods.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-[#17457c]">{m.method}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.description}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-800">{m.returns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Search</h2>
        <p className="text-gray-600 mb-6">
          Real-time web search with optional auto-scraping of top results, contact extraction, and social profile lookup.
        </p>
        <CodeBlock language="javascript" code={swiftSearchCode} title="Search Example" />
      </div>

      {/* Scrape */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Scrape</h2>
        <p className="text-gray-600 mb-6">
          Extract structured content from any webpage — title, text, links, images, and metadata.
        </p>
        <CodeBlock language="javascript" code={scrapeForgeCode} title="Scrape Example" />
      </div>

      <div className="mb-12">
        <p className="text-gray-600 mb-6">
          Multi-page research that searches, scrapes multiple sources, and returns a summary.
        </p>
      </div>

      {/* Batch Scrape */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Batch Scrape</h2>
        <p className="text-gray-600 mb-6">
          Scrape multiple URLs in a single request.
        </p>
        <CodeBlock language="javascript" code={batchScrapeCode} title="Batch Scrape Example" />
      </div>

      {/* Health Check */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Health Check</h2>
        <CodeBlock language="javascript" code={healthCode} title="API Health Check" />
      </div>

      {/* Error Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Handling</h2>
        <p className="text-gray-600 mb-6">
          The SDK exports three error classes for specific handling:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
          <li><code className="font-mono text-sm">VenymSearchError</code> — Base error for all API errors (includes <code>statusCode</code>, <code>message</code>)</li>
          <li><code className="font-mono text-sm">RateLimitError</code> — Thrown on rate limit (includes <code>retryAfter</code>)</li>
          <li><code className="font-mono text-sm">AuthenticationError</code> — Invalid or missing API key</li>
        </ul>
        <CodeBlock language="javascript" code={errorHandlingCode} title="Error Handling Example" />
      </div>

      {/* TypeScript */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">TypeScript</h2>
        <p className="text-gray-600">
          The SDK ships with full TypeScript type definitions. All method options and response shapes 
          are fully typed — just install and import with full autocompletion.
        </p>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#efa72d]" />
                Zero Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No runtime dependencies. Uses native fetch for maximum compatibility and minimal bundle size.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#efa72d]" />
                Full TypeScript Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Complete type definitions for all methods, options, and responses out of the box.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Terminal className="w-6 h-6 text-[#efa72d]" />
                Node.js 18+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Built on native fetch. Works in Node.js 18+, modern browsers, and edge runtimes.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="w-6 h-6 text-[#efa72d]" />
                Clean Error Handling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Specific error classes for rate limits, auth failures, and general API errors.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* External Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Resources</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#efa72d]" />
                Guides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/docs/guides/bitcoin-tracking" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Bitcoin Price Tracker</span>
                </div>
              </Link>
              <Link href="/docs/guides/ecommerce-monitoring" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">E-commerce Monitor</span>
                </div>
              </Link>
              <Link href="/docs/guides/lead-generation" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Lead Generation System</span>
                </div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-500" />
                External Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="https://github.com/doctadg/VENYM_SEARCH" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </div>
              </a>
              <a href="https://www.npmjs.com/package/VENYM_SEARCH-js" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">npm: VENYM_SEARCH-js</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#17457c]">Ready to Build?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Start building with the Venym Search JavaScript SDK and explore the API reference.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Button size="sm" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
                  API Reference
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/docs/guides/bitcoin-tracking">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  View Examples
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-[#17457c]">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Get support, report issues, or contribute to the SDK.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/support">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Get Support
                </Button>
              </Link>
              <a href="https://github.com/doctadg/VENYM_SEARCH/issues" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Report Issue
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
