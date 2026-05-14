import Link from 'next/link'
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
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>SDK · JAVASCRIPT</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            v1.1.0
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          JavaScript/Node.js SDK
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Official JavaScript SDK for Venym Search APIs. Zero runtime dependencies, native fetch, full TypeScript support. Requires Node.js 18+.
        </p>
      </div>

      <Callout type="info" title="Zero Dependencies">
        <code>VENYM_SEARCH-js</code> has zero runtime dependencies and uses the native <code>fetch</code> API. It works in Node.js 18+, modern browsers, and edge runtimes like Vercel Edge Functions and Cloudflare Workers.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Start</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Install</h3>
            <CodeBlock multiLanguage={installCode} title="Installation" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Initialize</h3>
            <CodeBlock language="javascript" code={initCode} title="Set up the client" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Methods</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Core Methods</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Method</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Description</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Returns</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m, i) => (
                <tr key={i} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-[13px] font-mono text-white/80">{m.method}</td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{m.description}</td>
                  <td className="px-6 py-3 text-[13px] font-mono text-white/70">{m.returns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Search</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Search</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Real-time web search with optional auto-scraping of top results, contact extraction, and social profile lookup.
        </p>
        <CodeBlock language="javascript" code={swiftSearchCode} title="Search Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Scrape</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Scrape</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Extract structured content from any webpage — title, text, links, images, and metadata.
        </p>
        <CodeBlock language="javascript" code={scrapeForgeCode} title="Scrape Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Batch</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Batch Scrape</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Scrape multiple URLs in a single request.
        </p>
        <CodeBlock language="javascript" code={batchScrapeCode} title="Batch Scrape Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Health</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Health Check</h2>
        <CodeBlock language="javascript" code={healthCode} title="API Health Check" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Errors</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Handling</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          The SDK exports three error classes for specific handling:
        </p>
        <ul className="list-disc list-inside text-[14px] text-white/65 mb-6 space-y-1">
          <li><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">VenymSearchError</code> — Base error for all API errors (includes <code>statusCode</code>, <code>message</code>)</li>
          <li><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">RateLimitError</code> — Thrown on rate limit (includes <code>retryAfter</code>)</li>
          <li><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">AuthenticationError</code> — Invalid or missing API key</li>
        </ul>
        <CodeBlock language="javascript" code={errorHandlingCode} title="Error Handling Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">08 · TypeScript</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">TypeScript</h2>
        <p className="text-[14px] text-white/55 leading-relaxed">
          The SDK ships with full TypeScript type definitions. All method options and response shapes are fully typed — just install and import with full autocompletion.
        </p>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">09 · Features</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: Zap, title: 'Zero Dependencies', desc: 'No runtime dependencies. Uses native fetch for maximum compatibility and minimal bundle size.' },
            { icon: Shield, title: 'Full TypeScript Support', desc: 'Complete type definitions for all methods, options, and responses out of the box.' },
            { icon: Terminal, title: 'Node.js 18+', desc: 'Built on native fetch. Works in Node.js 18+, modern browsers, and edge runtimes.' },
            { icon: Code, title: 'Clean Error Handling', desc: 'Specific error classes for rate limits, auth failures, and general API errors.' }
          ].map((f) => (
            <div key={f.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <f.icon className="w-4 h-4 text-amber-400/80" />
                <span className="text-[15px] font-medium text-white">{f.title}</span>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">10 · Resources</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Resources</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Guides</span>
            </div>
            <div className="space-y-2">
              {[
                { href: '/docs/guides/bitcoin-tracking', label: 'Bitcoin Price Tracker' },
                { href: '/docs/guides/ecommerce-monitoring', label: 'E-commerce Monitor' },
                { href: '/docs/guides/lead-generation', label: 'Lead Generation System' }
              ].map((g) => (
                <Link key={g.href} href={g.href} className="flex items-center gap-2 p-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.02] rounded-sm transition-colors">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>{g.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">External Resources</span>
            </div>
            <div className="space-y-2">
              <a href="https://github.com/doctadg/VENYM_SEARCH" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.02] rounded-sm transition-colors">
                <Package className="w-3.5 h-3.5 text-white/50" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 ml-auto text-white/40" />
              </a>
              <a href="https://www.npmjs.com/package/VENYM_SEARCH-js" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.02] rounded-sm transition-colors">
                <Download className="w-3.5 h-3.5 text-white/50" />
                <span>npm: VENYM_SEARCH-js</span>
                <ExternalLink className="w-3 h-3 ml-auto text-white/40" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <h3 className="text-[15px] font-medium text-white mb-3">Ready to Build?</h3>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Start building with the Venym Search JavaScript SDK and explore the API reference.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/api/search" className="venym-btn-primary">
              API Reference
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
            <Link href="/docs/guides/bitcoin-tracking" className="venym-btn-secondary">
              View Examples
            </Link>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <h3 className="text-[15px] font-medium text-white mb-3">Need Help?</h3>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Get support, report issues, or contribute to the SDK.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/support" className="venym-btn-secondary">Get Support</Link>
            <a href="https://github.com/doctadg/VENYM_SEARCH/issues" target="_blank" rel="noopener noreferrer" className="venym-btn-secondary">
              Report Issue
              <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
