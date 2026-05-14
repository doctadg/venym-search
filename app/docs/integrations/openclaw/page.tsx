import { CheckCircle, Zap, Terminal, Shield, ArrowRight, ExternalLink, Search, Globe, Bot, Sparkles } from 'lucide-react'
import Link from 'next/link'
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
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION · OPENCLAW</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Official
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
            Popular
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          OpenClaw Web Search, Scraping & Research Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed mb-4 max-w-3xl">
          Add real-time web search, web scraping, and multi-source research capabilities to your OpenClaw AI agent. A direct <strong className="text-white">Brave Search API replacement</strong> with built-in web crawling, content extraction, and LLM-optimized output — all in three bash scripts with zero dependencies.
        </p>
        <p className="text-[13px] text-white/40 leading-relaxed max-w-3xl">
          Venym Search provides AI agents with live internet access. Unlike Brave Search or SerpAPI, Venym Search combines web search with full-page content extraction and scraping in a single API. Built specifically for autonomous agents, LLMs, and AI workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {[
          { icon: Search, title: 'Brave Search API Alternative', desc: 'Drop-in replacement for Brave Search API, SerpAPI, Google Custom Search, and Tavily. Real-time search results with clean, structured JSON output ready for LLM consumption.' },
          { icon: Globe, title: 'Web Scraping & Crawling Built-In', desc: 'Unlike search-only APIs, Venym Search includes full-page web scraping with JavaScript rendering, content extraction, and automatic text cleaning — no separate scraping service needed.' },
          { icon: Sparkles, title: 'LLM-Optimized Output', desc: 'All content is cleaned, deduplicated, and formatted as markdown with word counts and reading times. Token-efficient output reduces LLM context waste by up to 60%.' }
        ].map((f) => (
          <div key={f.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <f.icon className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">{f.title}</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="venym-meta mb-3">Comparison</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
          Venym Search vs Brave Search API vs SerpAPI
        </h2>
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Feature</th>
                <th className="text-center p-4 text-[10px] font-mono uppercase tracking-[0.15em] text-white">Venym Search</th>
                <th className="text-center p-4 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Brave Search</th>
                <th className="text-center p-4 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">SerpAPI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Web Search', true, true, true],
                ['Web Scraping', true, false, false],
                ['Deep Research', true, false, false],
                ['LLM-Optimized Output', true, false, false],
                ['Free Tier', true, true, false],
                ['Zero Dependencies', true, false, false]
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-white/[0.06]">
                  <td className="p-4 text-white/65">{row[0]}</td>
                  {[row[1], row[2], row[3]].map((val, i) => (
                    <td key={i} className="p-4 text-center">
                      {val ? <CheckCircle className="w-4 h-4 text-emerald-400/80 mx-auto" /> : <span className="text-white/30">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 text-white/65 font-medium">Starting Price</td>
                <td className="p-4 text-center font-medium text-white">Free</td>
                <td className="p-4 text-center text-white/65">$3/1K queries</td>
                <td className="p-4 text-center text-white/65">$50/month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-10">
        {[
          { icon: Zap, title: 'Zero Dependencies — Pure Bash', desc: 'No Python SDK, no Node.js package, no pip install. Just curl and jq. Works on any system with bash — Raspberry Pi, VPS, macOS, Linux. Perfect for resource-constrained AI agent deployments.' },
          { icon: Terminal, title: 'Three Scripts, Full Coverage', desc: null, items: ['Search — Real-time web search (Google, Bing, DuckDuckGo)', 'Scrape — Full-page web scraping with content extraction'] },
          { icon: Shield, title: 'Token-Efficient for LLMs', desc: 'Content is cleaned, deduplicated, and formatted as markdown. Boilerplate, navigation, footers, and ads are stripped automatically. Word counts and reading times included — reduce LLM context waste by up to 60%.' },
          { icon: Bot, title: 'Built for AI Agents', desc: 'Designed for autonomous AI agents, not humans. JSON output on stdout, errors on stderr, exit codes for success/failure. Credits-based billing means predictable costs for agentic workloads.' }
        ].map((f) => (
          <div key={f.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <f.icon className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">{f.title}</span>
            </div>
            {f.desc ? (
              <p className="text-[13px] text-white/55 leading-relaxed">{f.desc}</p>
            ) : (
              <ul className="text-[13px] text-white/65 space-y-1">
                {f.items!.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="venym-meta mb-3">Setup</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Setup</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">1. Get your free API key</h3>
          <p className="text-[14px] text-white/65">
            Sign up at <a href="https://search.venym.io" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">search.venym.io</a> — free plan includes 5,000 credits/month (enough for ~5,000 searches or ~300 research queries).
          </p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">2. Install the skill</h3>
          <pre className="bg-[#050505] border border-white/[0.06] text-white/80 p-4 rounded-sm font-mono text-[12.5px] overflow-x-auto">{`# Copy into your OpenClaw workspace
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

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">3. Use in your agent</h3>
          <pre className="bg-[#050505] border border-white/[0.06] text-white/80 p-4 rounded-sm font-mono text-[12.5px] overflow-x-auto">{`# Web search
./scripts/web_search.sh "best restaurants in Tokyo" --count 5

# URL scraping
./scripts/web_scrape.sh "https://example.com"

# Deep research
./scripts/web_research.sh "quantum computing breakthroughs" --pages 10`}</pre>
          <p className="text-[12.5px] text-white/40 mt-3">
            All scripts output JSON to stdout, errors to stderr. Exit code 0 on success.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <div className="venym-meta mb-3">Response Format</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">API Response Format</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Search — Web Search Response</h3>
            <pre className="bg-[#050505] border border-white/[0.06] text-white/80 p-4 rounded-sm font-mono text-[12.5px] overflow-x-auto">{`{
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

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Scrape — Web Scraping Response</h3>
            <pre className="bg-[#050505] border border-white/[0.06] text-white/80 p-4 rounded-sm font-mono text-[12.5px] overflow-x-auto">{`{
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
      </div>

      <div className="mb-10">
        <div className="venym-meta mb-3">Notes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Requirements & Notes</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
          <ul className="space-y-3 text-[14px] text-white/65">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Always use <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">search.venym.io</code></strong> — not <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">www.search.venym.io</code>. The www subdomain can redirect and strip Authorization headers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Requires jq</strong> for JSON construction. Install: <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">apt install jq</code> or <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">brew install jq</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Pricing:</strong> Free ($0) → Starter ($9/mo) → Builder ($49/mo) → Unicorn ($199/mo). No per-query overage fees.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <div className="venym-meta mb-3">FAQ</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {[
            { q: 'How is Venym Search different from Brave Search API?', a: 'Brave Search API only provides search results. Venym Search combines search with web scraping, content extraction, and deep research in a single API. All content is cleaned and optimized for LLM token efficiency. Plus, Venym Search has a free tier with 5,000 credits/month.' },
            { q: 'Can Venym Search replace Tavily or SerpAPI for my AI agent?', a: "Yes. Venym Search is a direct replacement for Tavily, SerpAPI, Brave Search, and Google Custom Search. It provides real-time search results in the same JSON format, plus adds web scraping and content extraction that those APIs don't offer." },
            { q: 'Does Venym Search work on Raspberry Pi or low-resource devices?', a: 'Yes. The OpenClaw integration uses pure bash scripts with curl and jq — no Python or Node.js runtime needed. It works on ARM devices, Raspberry Pi, and any system with bash.' },
            { q: 'What does "LLM-optimized" output mean?', a: 'Venym Search strips boilerplate (navigation, footers, ads, cookie banners), deduplicates content, normalizes whitespace, and formats output as clean markdown. This reduces token waste by up to 60% compared to raw search results or unprocessed scraped HTML.' }
          ].map((item) => (
            <div key={item.q} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
              <h3 className="text-[14px] font-medium text-white mb-2">{item.q}</h3>
              <p className="text-[13px] text-white/55 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/docs/quickstart" className="venym-btn-primary">
          Get Free API Key
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Link>
        <Link href="/docs/api-reference" className="venym-btn-secondary">
          Full API Reference
          <ExternalLink className="w-3 h-3 ml-1.5" />
        </Link>
        <Link href="/pricing" className="venym-btn-ghost">
          View Pricing
        </Link>
      </div>
    </div>
  )
}
