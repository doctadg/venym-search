'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search, Code2, Database, Shield, Zap, ArrowRight, ChevronDown, Menu,
  Share2, GitBranch, MessageSquare, Globe, Lock, BarChart3, Sparkles,
  Terminal, Key, Layers, ArrowUpRight, CheckCircle2, Cpu, Network, Activity,
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect, useRef } from "react"
import ApiDemo from "@/components/api-demo"

/* ───────────── DATA ───────────── */

const PRODUCTS = [
  { name: "SwiftSearch", icon: Search, href: "/products/swiftsearch", tag: "SEARCH", desc: "Query 8 search engines in parallel. Merged, ranked results in under 2 seconds.", credits: "2 cr/req" },
  { name: "ScrapeForge", icon: Code2, href: "/products/scrapeforge", tag: "SCRAPE", desc: "Bypass anti-bot, render JS, solve CAPTCHAs. Scrape anything that loads in a browser.", credits: "5 cr/req" },
  { name: "DeepDive", icon: Database, href: "/products/deepdive", tag: "RESEARCH", desc: "One call: search the web, scrape top results, synthesize with AI. Research, automated.", credits: "10 cr/req" },
]

const STATS = [
  { val: 8, suffix: "", label: "Search Engines" },
  { val: 2, suffix: "s", prefix: "<", label: "Avg Latency" },
  { val: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
  { val: 50, suffix: "K+", label: "Daily Requests" },
] as const

const CAPABILITIES = [
  { icon: Globe, title: "8 Search Engines", desc: "Google, Bing, DuckDuckGo, Brave, Yahoo, Mojeek and more — queried in parallel, results re-ranked." },
  { icon: Lock, title: "Anti-Bot Bypass", desc: "Real browser fingerprints, residential proxies, CAPTCHA solving, smart retries. Built in." },
  { icon: Sparkles, title: "AI Synthesis", desc: "DeepDive reads up to 20 sources and returns a cited, structured synthesis. No hallucinations." },
  { icon: Key, title: "Bearer Auth", desc: "Generate, rotate, and revoke keys from the dashboard. Scoped permissions per environment." },
  { icon: BarChart3, title: "Credit Billing", desc: "Pay per request. No minimums. No overage surprises. 5,000 free credits to start." },
  { icon: Network, title: "Edge Network", desc: "Deployed across the Vercel edge. Sub-50ms cold start anywhere on the planet." },
]

const TRUSTED = ["VENYM LABS", "HYPERSWAP.AI", "TIDE.AG", "SPIDER LABS", "MROR", "VENYM26"]

const TERMINAL_EXAMPLES = [
  {
    api: "swiftsearch",
    badge: "POST /v1/swiftsearch",
    request: `curl -X POST https://api.venym.io/v1/swiftsearch \\
  -H "Authorization: Bearer sk_live_••••" \\
  -d '{"query":"latest AI research papers"}'`,
    response: `{
  "results": [
    { "title": "Scaling Laws of LLMs", "url": "..." },
    { "title": "Mixture of Experts at Scale", "url": "..." },
    { "title": "Constitutional AI v3", "url": "..." }
  ],
  "engines": ["google","bing","brave","ddg"],
  "elapsed_ms": 1247
}`,
  },
  {
    api: "scrapeforge",
    badge: "POST /v1/scrapeforge",
    request: `curl -X POST https://api.venym.io/v1/scrapeforge \\
  -H "Authorization: Bearer sk_live_••••" \\
  -d '{"url":"https://news.ycombinator.com","render":true}'`,
    response: `{
  "url": "https://news.ycombinator.com",
  "status": 200,
  "markdown": "# Hacker News\\n\\n1. Show HN: ...",
  "links": 312,
  "rendered_ms": 1820
}`,
  },
  {
    api: "deepdive",
    badge: "POST /v1/deepdive",
    request: `curl -X POST https://api.venym.io/v1/deepdive \\
  -H "Authorization: Bearer sk_live_••••" \\
  -d '{"topic":"quantum computing market 2026"}'`,
    response: `{
  "summary": "The quantum computing market is...",
  "sources": 18,
  "citations": [
    { "claim": "Market size ≈ $1.3B", "url": "..." }
  ],
  "synthesized_ms": 8941
}`,
  },
]

/* ───────────── HOOKS ───────────── */

function useInView<T extends HTMLElement>(opts: IntersectionObserverInit = { threshold: 0.3 }) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        obs.disconnect()
      }
    }, opts)
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function CountUp({ end, suffix = "", prefix = "", decimals = 0, duration = 1600 }: { end: number; suffix?: string; prefix?: string; decimals?: number; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(end * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>
}

/* ───────────── HERO TERMINAL ───────────── */

function HeroTerminal() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<"typing" | "loading" | "response" | "hold">("typing")
  const [typed, setTyped] = useState("")
  const sample = TERMINAL_EXAMPLES[idx]

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === "typing") {
      if (typed.length < sample.request.length) {
        t = setTimeout(() => setTyped(sample.request.slice(0, typed.length + 1)), 14)
      } else {
        t = setTimeout(() => setPhase("loading"), 350)
      }
    } else if (phase === "loading") {
      t = setTimeout(() => setPhase("response"), 900)
    } else if (phase === "response") {
      t = setTimeout(() => setPhase("hold"), 200)
    } else if (phase === "hold") {
      t = setTimeout(() => {
        setIdx((i) => (i + 1) % TERMINAL_EXAMPLES.length)
        setTyped("")
        setPhase("typing")
      }, 3800)
    }
    return () => clearTimeout(t)
  }, [phase, typed, sample.request])

  return (
    <div className="relative">
      {/* Floating result card top-right */}
      <div
        className="absolute -top-6 -right-4 md:-right-10 z-20 hidden sm:block float-card"
        style={{ ['--rot' as string]: '4deg', animationDelay: '0.3s' }}
      >
        <div className="bg-[#0d0d10]/95 backdrop-blur-md border border-white/10 rounded-md px-3 py-2.5 shadow-2xl shadow-black/60 w-[200px]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">200 OK</span>
            <span className="text-[9px] font-mono text-white/30 ml-auto">1.2s</span>
          </div>
          <div className="text-[10px] font-mono text-white/60">8 engines · 47 results</div>
        </div>
      </div>

      {/* Floating engine pill bottom-left */}
      <div
        className="absolute -bottom-5 -left-4 z-20 hidden sm:block float-card"
        style={{ ['--rot' as string]: '-3deg', animationDelay: '1.2s' }}
      >
        <div className="bg-[#0d0d10]/95 backdrop-blur-md border border-white/10 rounded-md px-3 py-2 shadow-2xl shadow-black/60">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-white/40" />
            <span className="text-[10px] font-mono text-white/60">edge.fra1 · venym-rt</span>
          </div>
        </div>
      </div>

      {/* Terminal card */}
      <div className="relative bg-[#08080a] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
        {/* Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0d]">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="text-[10px] font-mono text-white/40 tracking-wider">{sample.badge}</div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400/80 tracking-wider">LIVE</span>
          </div>
        </div>

        {/* Request */}
        <div className="px-4 pt-4 pb-3 font-mono text-[12px] leading-relaxed">
          <div className="text-white/30 text-[10px] mb-1.5 tracking-wider uppercase">$ Request</div>
          <pre className="whitespace-pre-wrap text-white/70 min-h-[88px]">
            {typed}
            {phase === "typing" && <span className="terminal-cursor text-white">▌</span>}
          </pre>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Response */}
        <div className="px-4 pt-3 pb-4 font-mono text-[12px] leading-relaxed bg-[#06060a]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-white/30 text-[10px] tracking-wider uppercase">{'>'} Response</div>
            {phase === "loading" && (
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse" />
                <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse [animation-delay:120ms]" />
                <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse [animation-delay:240ms]" />
              </div>
            )}
            {(phase === "response" || phase === "hold") && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400/80" />
                <span className="text-[10px] text-emerald-400/70 font-mono">200 · 1247ms</span>
              </div>
            )}
          </div>
          <pre className="whitespace-pre text-[11px] min-h-[130px] overflow-hidden">
            <code className={`text-emerald-300/80 transition-opacity duration-500 ${phase === "response" || phase === "hold" ? "opacity-100" : "opacity-0"}`}>
              {sample.response}
            </code>
          </pre>
        </div>
      </div>

      {/* API selector dots */}
      <div className="flex items-center justify-center gap-3 mt-5">
        {TERMINAL_EXAMPLES.map((ex, i) => (
          <button
            key={ex.api}
            onClick={() => { setIdx(i); setTyped(""); setPhase("typing") }}
            className={`group flex items-center gap-2 transition`}
            aria-label={ex.api}
          >
            <span className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-1.5 bg-white/20 group-hover:bg-white/40"}`} />
            <span className={`text-[10px] font-mono uppercase tracking-wider transition ${i === idx ? "text-white/70" : "text-white/30 group-hover:text-white/50"}`}>{ex.api}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ───────────── PAGE ───────────── */

export default function VenymSearchLanding() {
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  // mouse-tracked glow for bento cards
  const handleBentoMouse = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/85 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-14 px-5">
          <Link href="/" className="font-bold tracking-[0.25em] text-sm flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            VENYM<span className="text-white/40 font-normal">.SEARCH</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide flex items-center gap-1 bg-transparent">
                Products <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-[#0c0c0c] border-white/10 rounded-md mt-2 min-w-[260px] p-1.5">
                {PRODUCTS.map(p => (
                  <DropdownMenuItem key={p.name} asChild>
                    <Link href={p.href} className="flex items-start gap-3 py-2.5 px-3 text-[12px] text-white/60 hover:text-white hover:bg-white/[0.04] cursor-pointer focus:bg-white/[0.04] focus:text-white rounded-sm">
                      <div className="h-7 w-7 rounded-sm bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                        <p.icon className="h-3.5 w-3.5 opacity-70" />
                      </div>
                      <div>
                        <div className="font-medium text-white/90">{p.name}</div>
                        <div className="text-[10px] text-white/30 mt-0.5 tracking-wide uppercase font-mono">{p.tag} · {p.credits}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/docs" className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide">Docs</Link>
            <Link href="/pricing" className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide">Pricing</Link>
            <Link href="/tools" className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide">Tools</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="venym-btn-primary text-[10px] py-2 px-4">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide">Sign in</Link>
                <Link href="/signup" className="venym-btn-primary text-[10px] py-2 px-4 flex items-center gap-1.5">
                  Get API Key <ArrowRight className="h-3 w-3" />
                </Link>
              </>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#050505] border-white/[0.06] w-[280px]">
              <SheetHeader>
                <SheetTitle className="text-white font-bold tracking-[0.25em] text-sm">VENYM.SEARCH</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {PRODUCTS.map(p => (
                  <Link key={p.name} href={p.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 px-2 text-[12px] text-white/60 hover:text-white border-b border-white/[0.04]">
                    <p.icon className="h-4 w-4 opacity-50" /> {p.name}
                  </Link>
                ))}
                <Link href="/docs" onClick={() => setMobileOpen(false)} className="py-3 px-2 text-[12px] text-white/60 hover:text-white border-b border-white/[0.04]">Docs</Link>
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="py-3 px-2 text-[12px] text-white/60 hover:text-white border-b border-white/[0.04]">Pricing</Link>
                <Link href="/tools" onClick={() => setMobileOpen(false)} className="py-3 px-2 text-[12px] text-white/60 hover:text-white border-b border-white/[0.04]">Tools</Link>
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="venym-btn-primary text-center mt-4 text-[10px] py-2.5">Dashboard</Link>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[12px] text-white/60 hover:text-white py-2">Sign in</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="venym-btn-primary text-center text-[10px] py-2.5">Get API Key</Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-dots" />
        <div className="absolute inset-0 glow-radial" />

        <div className="relative max-w-[1280px] mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">All systems operational · v2.1.4</span>
              </div>

              <h1 className="font-bold tracking-tight leading-[0.95] text-[clamp(2.5rem,8vw,5.5rem)]">
                <span className="block gradient-text">Search.</span>
                <span className="block gradient-text-static">Scrape.</span>
                <span className="block text-white/25">Synthesize.</span>
              </h1>

              <p className="mt-7 text-[15px] md:text-base text-white/45 leading-relaxed max-w-xl">
                Three APIs for everything the web has to offer. Real-time multi-engine search,
                anti-bot scraping, and AI-powered research — all behind a single key, billed by credit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <Link href="/signup" className="venym-btn-primary text-[11px] py-3 px-6 flex items-center justify-center gap-2 group">
                  Start Free
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/docs/quickstart" className="venym-btn-secondary text-[11px] py-3 px-6 flex items-center justify-center gap-2">
                  <Terminal className="h-3.5 w-3.5 opacity-50" /> Quickstart Guide
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-white/30">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> 5,000 free credits</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> No credit card</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> Cancel anytime</div>
              </div>
            </div>

            {/* RIGHT — Terminal */}
            <div className="relative">
              <HeroTerminal />
            </div>
          </div>
        </div>

        {/* TRUSTED BY MARQUEE */}
        <div className="relative border-y border-white/[0.06] bg-[#070707]/60 backdrop-blur overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 py-5 whitespace-nowrap">
            <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase shrink-0 px-5">Powering teams at</span>
            <div className="flex scroll-x">
              {[...TRUSTED, ...TRUSTED].map((name, i) => (
                <span key={i} className="text-[12px] font-mono tracking-[0.3em] text-white/40 px-10">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 border-x border-white/[0.06]">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`relative py-10 px-6 ${i < 3 ? 'md:border-r' : ''} ${i < 2 ? 'border-r border-b md:border-b-0' : 'border-b md:border-b-0'} border-white/[0.06]`}
            >
              <div className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight tabular-nums">
                <CountUp end={s.val} suffix={s.suffix} prefix={'prefix' in s ? s.prefix : ''} decimals={'decimals' in s ? s.decimals : 0} />
              </div>
              <div className="text-[10px] text-white/30 mt-2 tracking-[0.2em] uppercase font-mono">{s.label}</div>
              <div className="absolute top-3 right-3 text-[9px] font-mono text-white/15">[{String(i + 1).padStart(2, '0')}]</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS (BENTO) ─── */}
      <section className="py-24 md:py-32 px-5 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Layers className="h-4 w-4 text-white/30" />
                <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Products // 03</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] max-w-2xl">
                Three APIs.<br />
                <span className="text-white/30">One key.</span>
              </h2>
            </div>
            <Link href="/pricing" className="group flex items-center gap-2 text-[12px] text-white/40 hover:text-white transition">
              View pricing <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* SwiftSearch — featured (spans 2) */}
            <Link
              href="/products/swiftsearch"
              onMouseMove={handleBentoMouse}
              className="bento-card group relative md:col-span-2 rounded-xl p-7 md:p-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Search className="h-5 w-5 text-white/60" />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase">Search · 2 cr/req</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">SwiftSearch</h3>
              <p className="text-[14px] text-white/40 leading-relaxed max-w-md mb-8">
                Query 8 search engines in parallel. Merged, ranked, deduplicated results in under 2 seconds.
                No quota juggling, no per-engine adapters.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["google", "bing", "brave", "ddg", "yahoo", "mojeek", "ecosia", "qwant"].map(eng => (
                  <span key={eng} className="text-[10px] font-mono text-white/40 px-2 py-1 border border-white/[0.06] rounded bg-white/[0.02]">
                    {eng}
                  </span>
                ))}
              </div>
            </Link>

            {/* ScrapeForge */}
            <Link
              href="/products/scrapeforge"
              onMouseMove={handleBentoMouse}
              className="bento-card group relative rounded-xl p-7 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-white/60" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mb-3">Scrape · 5 cr/req</div>
              <h3 className="text-xl font-bold tracking-tight mb-2">ScrapeForge</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Bypass anti-bot, render JavaScript, solve CAPTCHAs. Returns markdown, HTML, or structured JSON.
              </p>
            </Link>

            {/* DeepDive */}
            <Link
              href="/products/deepdive"
              onMouseMove={handleBentoMouse}
              className="bento-card group relative rounded-xl p-7 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Database className="h-5 w-5 text-white/60" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mb-3">Research · 10 cr/req</div>
              <h3 className="text-xl font-bold tracking-tight mb-2">DeepDive</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">
                One call: search → scrape top 20 → synthesize with citations. Research, automated.
              </p>
            </Link>

            {/* Wide info row */}
            <Link
              href="/docs/quickstart"
              onMouseMove={handleBentoMouse}
              className="bento-card group relative md:col-span-3 rounded-xl p-7 md:p-8 overflow-hidden flex flex-col md:flex-row md:items-center gap-6 md:gap-10"
            >
              <div className="flex items-center gap-4 shrink-0">
                <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-400/80" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mb-1">Quickstart</div>
                  <div className="text-[15px] font-semibold">Make your first request in 60 seconds.</div>
                </div>
              </div>
              <div className="flex-1 font-mono text-[11px] text-white/40 bg-[#070707] border border-white/[0.04] rounded-md px-4 py-3 overflow-x-auto">
                <span className="text-white/30">$</span> <span className="text-white/70">npm i @venym/search</span> <span className="text-white/20">&&</span> <span className="text-white/70">venym auth login</span>
              </div>
              <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LIVE DEMO ─── */}
      <section className="py-24 md:py-32 px-5 border-t border-white/[0.06] relative">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="h-4 w-4 text-white/30" />
                <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Try It Live // 04</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                Run a real query<br />
                <span className="text-white/30">in your browser.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/[0.06] rounded-full bg-white/[0.02]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">No signup required</span>
            </div>
          </div>

          {/* Demo frame */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 via-white/[0.02] to-purple-500/10 pointer-events-none" />
            <div className="relative bg-[#08080a] border border-white/[0.06] rounded-2xl p-4 md:p-8">
              <ApiDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES (BENTO) ─── */}
      <section className="py-24 md:py-32 px-5 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-4 w-4 text-white/30" />
            <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Infrastructure // 05</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-14 max-w-3xl">
            Built for production.<br />
            <span className="text-white/30">Not for demos.</span>
          </h2>

          <div className="grid md:grid-cols-3 grid-flow-row gap-4">
            {CAPABILITIES.map((c, i) => {
              const featured = i === 0
              return (
                <div
                  key={i}
                  onMouseMove={handleBentoMouse}
                  className={`bento-card relative rounded-xl p-7 overflow-hidden ${featured ? 'md:row-span-2 md:col-span-1' : ''}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <c.icon className="h-[18px] w-[18px] text-white/60" />
                    </div>
                    <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[{String(i + 1).padStart(2, '0')}]</span>
                  </div>
                  <h3 className={`font-semibold tracking-tight mb-2 ${featured ? 'text-xl md:text-2xl' : 'text-[15px]'}`}>{c.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{c.desc}</p>
                  {featured && (
                    <div className="mt-8 pt-6 border-t border-white/[0.06]">
                      <div className="text-[10px] font-mono text-white/30 tracking-wider uppercase mb-3">Coverage map</div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 16 }).map((_, j) => (
                          <div
                            key={j}
                            className="aspect-square rounded-sm"
                            style={{ background: `rgba(110, 180, 140, ${0.08 + (j % 5) * 0.07})` }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-white/30">
                        <span>fra1</span><span>iad1</span><span>sin1</span><span>syd1</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-36 px-5 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 glow-radial opacity-60" />
        <div className="absolute inset-0 mesh-dots opacity-50" />

        <div className="relative max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
              <Sparkles className="h-3 w-3 text-white/60" />
              <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">Start in 60 seconds</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="gradient-text">5,000 free credits.</span><br />
              <span className="text-white/25">No credit card.</span>
            </h2>
            <p className="text-white/40 text-[15px] max-w-lg mx-auto leading-relaxed">
              Full API access on day one. SwiftSearch, ScrapeForge, and DeepDive. Use them however you want.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/signup" className="venym-btn-primary text-[11px] py-3.5 px-8 flex items-center gap-2 group">
              Create Account
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/docs" className="venym-btn-secondary text-[11px] py-3.5 px-8">Read the Docs</Link>
          </div>

          {/* Mini code block */}
          <div className="max-w-xl mx-auto bg-[#08080a]/80 backdrop-blur border border-white/[0.08] rounded-lg p-4 font-mono text-[12px] text-white/50">
            <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-wider text-white/25">
              <span>~/project</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span>bash</span>
            </div>
            <div><span className="text-white/30">$</span> <span className="text-white/80">curl https://api.venym.io/v1/swiftsearch \</span></div>
            <div className="pl-4"><span className="text-white/60">-H "Authorization: Bearer $VENYM_KEY" \</span></div>
            <div className="pl-4"><span className="text-white/60">-d '{`{"query":"hello world"}`}'</span></div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-12 px-5">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="font-bold tracking-[0.25em] text-sm mb-3 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                VENYM<span className="text-white/40 font-normal">.SEARCH</span>
              </div>
              <p className="text-[12px] text-white/30 leading-relaxed max-w-xs">
                Enterprise web search, scraping, and AI synthesis APIs. A Venym Labs product.
              </p>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase mb-3">Products</div>
              {PRODUCTS.map(p => (
                <Link key={p.name} href={p.href} className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">{p.name}</Link>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase mb-3">Developers</div>
              <Link href="/docs" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Documentation</Link>
              <Link href="/docs/quickstart" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Quickstart</Link>
              <Link href="/docs/api-reference/swiftsearch" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">API Reference</Link>
              <Link href="/tools" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Free Tools</Link>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase mb-3">Connect</div>
              <Link href="https://x.com/RealDoctaDG" className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/80 transition py-0.5"><Share2 className="h-3 w-3" /> Twitter</Link>
              <Link href="https://github.com/doctadg" className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/80 transition py-0.5"><GitBranch className="h-3 w-3" /> GitHub</Link>
              <Link href="https://t.me/realdoctadg" className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/80 transition py-0.5"><MessageSquare className="h-3 w-3" /> Telegram</Link>
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <span className="text-[10px] font-mono text-white/15 tracking-wider">© 2026 VENYM SEARCH · A VENYM LABS PRODUCT</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/30 tracking-wider">ALL SYSTEMS NORMAL</span>
              </div>
              <span className="text-[10px] font-mono text-white/15 tracking-wider">search.venym.io</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
