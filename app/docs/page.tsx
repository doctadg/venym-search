import Link from 'next/link'
import {
  Rocket,
  Code2,
  Database,
  BookOpen,
  ArrowUpRight,
  Search,
  Terminal,
  Puzzle,
  Activity,
  FileCode,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { CodeBlock } from './components/CodeBlock'

export default function DocsHomePage() {
  const quickStartCode = {
    bash: `curl -X POST https://api.venym.io/v1/swiftsearch \\
  -H "Authorization: Bearer sk_live_••••" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"Bitcoin price 2026","max_results":5}'`,
    python: `import requests

API_KEY = "sk_live_••••"

response = requests.post(
    "https://api.venym.io/v1/swiftsearch",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"query": "Bitcoin price 2026", "max_results": 5},
)

print(response.json())`,
    javascript: `const res = await fetch("https://api.venym.io/v1/swiftsearch", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.VENYM_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: "Bitcoin price 2026",
    max_results: 5,
  }),
});

const data = await res.json();`,
  }

  const apis = [
    {
      id: 'API-01',
      name: 'SwiftSearch',
      method: 'POST',
      path: '/v1/swiftsearch',
      description: 'Query 8 search engines in parallel. Merged, ranked results in under 2 seconds.',
      icon: Search,
      href: '/docs/api/swiftsearch',
      credits: '2 cr / req',
    },
    {
      id: 'API-02',
      name: 'ScrapeForge',
      method: 'POST',
      path: '/v1/scrapeforge',
      description: 'Bypass anti-bot, render JS, solve CAPTCHAs. Scrape anything that loads in a browser.',
      icon: Code2,
      href: '/docs/api/scrapeforge',
      credits: '5 cr / req',
    },
    {
      id: 'API-03',
      name: 'DeepDive',
      method: 'POST',
      path: '/v1/deepdive',
      description: 'One call: search the web, scrape top results, synthesize with AI. Research, automated.',
      icon: Database,
      href: '/docs/api/deepdive',
      credits: '10 cr / req',
    },
  ]

  const integrations = [
    { name: 'Model Context Protocol', tag: 'MCP', description: 'Universal AI agent integration.', href: '/docs/integrations/mcp', badge: 'NEW' },
    { name: 'LangChain', tag: 'LC', description: 'Custom tools for LangChain agents.', href: '/docs/integrations/langchain' },
    { name: 'OpenAI Assistants', tag: 'OAI', description: 'Function calling with the OpenAI SDK.', href: '/docs/integrations/openai-assistants' },
    { name: 'n8n', tag: 'N8N', description: 'No-code workflow automation.', href: '/docs/integrations/n8n' },
    { name: 'Zapier', tag: 'ZAP', description: 'Connect with 5000+ apps.', href: '/docs/integrations/zapier' },
    { name: 'Make.com', tag: 'MK', description: 'Visual workflow builder.', href: '/docs/integrations/make' },
  ]

  const guides = [
    {
      title: 'Bitcoin Price Tracking',
      description: 'Build a real-time cryptocurrency monitoring system using SwiftSearch + DeepDive.',
      href: '/docs/guides/bitcoin-tracking',
      badge: 'FEATURED',
    },
    {
      title: 'E-commerce Price Monitoring',
      description: 'Track competitor prices across multiple retailers on a schedule.',
      href: '/docs/guides/ecommerce-monitoring',
    },
    {
      title: 'AI-Powered Lead Generation',
      description: 'Extract contacts and enrich prospect data automatically.',
      href: '/docs/guides/lead-generation',
    },
  ]

  const stats = [
    { val: '99.9%', label: 'Uptime SLA' },
    { val: '<2s', label: 'Avg Latency' },
    { val: '8', label: 'Search Engines' },
    { val: '24 / 7', label: 'Support' },
  ]

  return (
    <div className="max-w-none -mt-2">
      {/* ─── HERO ─── */}
      <section className="mb-20">
        <div className="venym-section-label">
          <span>Documentation · v1.0</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-5 leading-[1.05]">
          Build with the Venym
          <br />
          Search API.
        </h1>

        <p className="text-[15px] text-white/50 max-w-2xl leading-relaxed mb-8">
          Enterprise web search, scraping, and research APIs for developers.
          Three endpoints. One API key. Full coverage of the open web.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <Link href="/docs/quickstart" className="venym-btn-primary">
            Quickstart
            <ArrowUpRight className="w-3 h-3 ml-1.5" />
          </Link>
          <Link href="/docs/api/swiftsearch" className="venym-btn-secondary">
            API Reference
          </Link>
          <Link href="/docs/integrations/mcp" className="venym-btn-ghost">
            Integrations
            <ChevronRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border-y border-white/[0.06]">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#050505] py-5 px-4">
              <div className="text-2xl font-semibold text-white tabular-nums">{s.val}</div>
              <div className="venym-meta mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── QUICKSTART CODE ─── */}
      <section className="mb-20">
        <div className="venym-section-label">
          <span>01 · Your First Request</span>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
          Get started in 60 seconds.
        </h2>
        <p className="text-[14px] text-white/50 mb-6 max-w-2xl">
          Generate a key from the dashboard, then make your first call. New accounts get 5,000 free credits.
        </p>
        <CodeBlock multiLanguage={quickStartCode} title="POST /v1/swiftsearch" />
      </section>

      {/* ─── CORE APIs ─── */}
      <section className="mb-20">
        <div className="venym-section-label">
          <span>02 · Core Endpoints</span>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
          Three APIs. Composable.
        </h2>
        <p className="text-[14px] text-white/50 mb-8 max-w-2xl">
          Built to be chained. Search with one, scrape with the next, synthesize with the last.
        </p>

        <div className="grid gap-px bg-white/[0.06] border border-white/[0.06] rounded-sm overflow-hidden md:grid-cols-3">
          {apis.map((api) => {
            const Icon = api.icon
            return (
              <Link
                key={api.id}
                href={api.href}
                className="group relative bg-[#080808] hover:bg-[#0c0c0c] p-6 transition-colors duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  <span className="venym-meta">{api.id}</span>
                </div>

                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">
                  {api.method} {api.path}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{api.name}</h3>
                <p className="text-[13px] text-white/50 leading-relaxed mb-6 flex-1">
                  {api.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="venym-meta">{api.credits}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ─── INTEGRATIONS ─── */}
      <section className="mb-20">
        <div className="venym-section-label">
          <span>03 · Integrations</span>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
          Plug into your stack.
        </h2>
        <p className="text-[14px] text-white/50 mb-8 max-w-2xl">
          Native support for the tools developers already use. Zero glue code required.
        </p>

        <div className="grid gap-px bg-white/[0.06] border border-white/[0.06] rounded-sm overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((it) => (
            <Link
              key={it.name}
              href={it.href}
              className="group bg-[#080808] hover:bg-[#0c0c0c] p-5 transition-colors duration-300 flex items-start gap-4"
            >
              <div className="w-10 h-10 shrink-0 border border-white/[0.08] rounded-sm flex items-center justify-center font-mono text-[10px] tracking-[0.15em] text-white/50 group-hover:text-white group-hover:border-white/20 transition-colors">
                {it.tag}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[14px] font-medium text-white truncate">{it.name}</h3>
                  {it.badge && (
                    <span className="text-[9px] font-mono tracking-[0.15em] text-white/50 border border-white/10 px-1.5 py-0.5 rounded-sm">
                      {it.badge}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-white/40 leading-snug">{it.description}</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── GUIDES ─── */}
      <section className="mb-20">
        <div className="venym-section-label">
          <span>04 · Implementation Guides</span>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-8">
          Step-by-step recipes.
        </h2>

        <div className="space-y-px">
          {guides.map((g, i) => (
            <Link
              key={g.href}
              href={g.href}
              className="group flex items-center gap-6 p-5 border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#0a0a0a] transition-colors duration-200 rounded-sm"
            >
              <span className="venym-meta w-12 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[15px] font-medium text-white">{g.title}</h3>
                  {g.badge && (
                    <span className="text-[9px] font-mono tracking-[0.15em] text-white/50 border border-white/10 px-1.5 py-0.5 rounded-sm">
                      {g.badge}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-white/45">{g.description}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DEVELOPER TOOLS ─── */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06] rounded-sm overflow-hidden">
          <div className="bg-[#080808] p-7">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-white/50" />
              <span className="venym-meta">Developer Tools</span>
            </div>
            <div className="space-y-px">
              {[
                { label: 'Postman Collection', href: '/docs/postman' },
                { label: 'OpenAPI Spec', href: '/docs/openapi' },
                { label: 'Python SDK', href: '/docs/sdks/python' },
                { label: 'JavaScript SDK', href: '/docs/sdks/javascript' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between py-2.5 text-[13px] text-white/60 hover:text-white border-b border-white/[0.04] last:border-0 group transition-colors"
                >
                  <span>{l.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#080808] p-7">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-white/50" />
              <span className="venym-meta">Status & Support</span>
            </div>
            <div className="space-y-px">
              {[
                { label: 'System Status', href: '/docs/status', live: true },
                { label: 'API Changelog', href: '/docs/changelog' },
                { label: 'Rate Limits', href: '/docs/rate-limits' },
                { label: 'Contact Support', href: '/docs/support' },
              ].map((l: any) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between py-2.5 text-[13px] text-white/60 hover:text-white border-b border-white/[0.04] last:border-0 group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {l.live && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                    )}
                    {l.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
