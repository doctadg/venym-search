import { CheckCircle, Zap, Terminal, Shield, ArrowRight, ExternalLink, Search, Globe, Bot, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Integration — AI Agent Search & Scraping API | Venym Search',
  description: 'Add web search, web scraping, and deep research to your OpenClaw agent. Direct Brave Search API replacement with built-in web crawling, content extraction, and LLM-optimized output. Free to start, no Python or Node dependencies.',
  keywords: [
    'OpenClaw web search integration',
    'AI agent search API',
    'Brave Search API alternative',
    'web scraping API for AI agents',
    'OpenClaw Venym Search skill',
    'AI agent web crawling',
    'search API for autonomous agents',
    'web search API replacement',
    'LLM search integration',
    'AI agent internet access',
    'web scraping for LLMs',
    'search API free tier',
    'real-time search for AI',
    'agent web browsing API',
    'autonomous agent search'
  ],
  openGraph: {
    title: 'OpenClaw Integration — AI Agent Search, Scraping & Research API',
    description: 'Drop-in Brave Search API replacement for OpenClaw agents. Web search + scraping + research in 3 bash scripts. LLM-optimized output, zero dependencies.',
    type: 'article',
    siteName: 'Venym Search',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw Integration — AI Agent Search & Scraping API',
    description: 'Direct Brave Search API replacement with web scraping built in. Zero dependencies, LLM-optimized output.',
  },
}

export default function OpenclawIntegration() {
  return (
    <div className="max-w-none">
      {/* SEO-friendly header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-green-100 text-green-800">
            Official Integration
          </Badge>
          <Badge className="bg-[#efa72d]/20 text-[#efa72d]">
            ★ Popular
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          OpenClaw Web Search, Scraping & Research Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-4">
          Add real-time web search, web scraping, and multi-source research capabilities to your OpenClaw AI agent. 
          A direct <strong>Brave Search API replacement</strong> with built-in web crawling, content extraction, 
          and LLM-optimized output — all in three bash scripts with zero dependencies.
        </p>
        <p className="text-gray-500 leading-relaxed">
          Venym Search provides AI agents with live internet access. Unlike Brave Search or SerpAPI, Venym Search 
          combines web search with full-page content extraction and scraping in a single API. Built specifically 
          for autonomous agents, LLMs, and AI workflows.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5 text-[#efa72d]" />
              Brave Search API Alternative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Drop-in replacement for Brave Search API, SerpAPI, Google Custom Search, and Tavily. 
              Real-time search results with clean, structured JSON output ready for LLM consumption.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-[#efa72d]" />
              Web Scraping & Crawling Built-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Unlike search-only APIs, Venym Search includes full-page web scraping with JavaScript rendering, 
              content extraction, and automatic text cleaning — no separate scraping service needed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-[#efa72d]" />
              LLM-Optimized Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              All content is cleaned, deduplicated, and formatted as markdown with word counts and reading times. 
              Token-efficient output reduces LLM context waste by up to 60%.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison table - SEO gold */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">
          Venym Search vs Brave Search API vs SerpAPI
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold text-[#17457c]">Venym Search</th>
                    <th className="text-center p-4 font-semibold">Brave Search</th>
                    <th className="text-center p-4 font-semibold">SerpAPI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-gray-600">Web Search</td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-600">Web Scraping</td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-600">Deep Research</td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-600">LLM-Optimized Output</td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-600">Free Tier</td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-600">Zero Dependencies</td>
                    <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-600 font-semibold">Starting Price</td>
                    <td className="p-4 text-center font-semibold text-[#17457c]">Free</td>
                    <td className="p-4 text-center">$3/1K queries</td>
                    <td className="p-4 text-center">$50/month</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick features */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-[#efa72d]" />
              Zero Dependencies — Pure Bash
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              No Python SDK, no Node.js package, no pip install. Just curl and jq. 
              Works on any system with bash — Raspberry Pi, VPS, macOS, Linux. 
              Perfect for resource-constrained AI agent deployments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Terminal className="w-5 h-5 text-[#efa72d]" />
              Three Scripts, Full Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• <strong>Search</strong> — Real-time web search (Google, Bing, DuckDuckGo)</li>
              <li>• <strong>Scrape</strong> — Full-page web scraping with content extraction</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-[#efa72d]" />
              Token-Efficient for LLMs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Content is cleaned, deduplicated, and formatted as markdown. Boilerplate, 
              navigation, footers, and ads are stripped automatically. Word counts and 
              reading times included — reduce LLM context waste by up to 60%.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-[#efa72d]" />
              Built for AI Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Designed for autonomous AI agents, not humans. JSON output on stdout, 
              errors on stderr, exit codes for success/failure. Credits-based billing 
              means predictable costs for agentic workloads.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Setup */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Setup</h2>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">1. Get your free API key</h3>
            <p className="text-gray-600 mb-3">
              Sign up at <a href="https://search.venym.io" className="text-[#17457c] underline font-medium">search.venym.io</a> — 
              free plan includes 5,000 credits/month (enough for ~5,000 searches or ~300 research queries).
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">2. Install the skill</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`# Copy into your OpenClaw workspace
cp -r integrations/openclaw/skills/VENYM_SEARCH \\
  ~/.openclaw/workspace/skills/

# Set your API key
export VENYM_SEARCH_API_KEY="sk_live_YOUR_API_KEY_API_KEY_key_here"

# Make scripts executable
chmod +x ~/.openclaw/workspace/skills/VENYM_SEARCH/scripts/*.sh

# Test it
~/.openclaw/workspace/skills/VENYM_SEARCH/scripts/web_search.sh \\
  "latest AI news" --count 3`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">3. Use in your agent</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`# Web search
./scripts/web_search.sh "best restaurants in Tokyo" --count 5

# URL scraping
./scripts/web_scrape.sh "https://example.com"

# Deep research
./scripts/web_research.sh "quantum computing breakthroughs" --pages 10`}</pre>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              All scripts output JSON to stdout, errors to stderr. Exit code 0 on success.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Format */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">API Response Format</h2>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Search — Web Search Response</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "query": "AI agents 2025",
  "search_results": [
    {
      "title": "The Rise of Autonomous AI Agents",
      "link": "https://example.com/article",
      "snippet": "Cleaned, relevant snippet...",
      "position": 1
    }
  ],
  "credits_used": 1,
  "remaining_credits": 4999,
  "results_count": 10
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Scrape — Web Scraping Response</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "url": "https://example.com/article",
  "title": "Article Title",
  "text": "Cleaned markdown content...",
  "links": [...],
  "metadata": {"status_code": 200},
  "word_count": 1234,
  "reading_time": "6 min"
}`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Requirements & Notes</h2>
        
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Always use <code className="bg-gray-100 px-1 rounded">search.venym.io</code></strong> — not <code className="bg-gray-100 px-1 rounded">www.search.venym.io</code>. The www subdomain can redirect and strip Authorization headers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Requires jq</strong> for JSON construction. Install: <code className="bg-gray-100 px-1 rounded">apt install jq</code> or <code className="bg-gray-100 px-1 rounded">brew install jq</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Pricing:</strong> Free ($0) → Starter ($9/mo) → Builder ($49/mo) → Unicorn ($199/mo). No per-query overage fees.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ section for SEO */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#17457c] mb-2">
                How is Venym Search different from Brave Search API?
              </h3>
              <p className="text-gray-600 text-sm">
                Brave Search API only provides search results. Venym Search combines search with web scraping, 
                content extraction, and deep research in a single API. All content is cleaned and optimized 
                for LLM token efficiency. Plus, Venym Search has a free tier with 5,000 credits/month.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#17457c] mb-2">
                Can Venym Search replace Tavily or SerpAPI for my AI agent?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes. Venym Search is a direct replacement for Tavily, SerpAPI, Brave Search, and Google Custom Search. 
                It provides real-time search results in the same JSON format, plus adds web scraping and 
                content extraction that those APIs don&apos;t offer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#17457c] mb-2">
                Does Venym Search work on Raspberry Pi or low-resource devices?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes. The OpenClaw integration uses pure bash scripts with curl and jq — no Python or Node.js 
                runtime needed. It works on ARM devices, Raspberry Pi, and any system with bash.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#17457c] mb-2">
                What does &quot;LLM-optimized&quot; output mean?
              </h3>
              <p className="text-gray-600 text-sm">
                Venym Search strips boilerplate (navigation, footers, ads, cookie banners), deduplicates content, 
                normalizes whitespace, and formats output as clean markdown. This reduces token waste by up to 
                60% compared to raw search results or unprocessed scraped HTML.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4">
        <Link href="/docs/quickstart">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90">
            Get Free API Key
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/docs/api-reference">
          <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
            Full API Reference
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            View Pricing
          </Button>
        </Link>
      </div>
    </div>
  )
}
