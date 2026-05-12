'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search, Code2, Database, Shield, Zap, Clock,
  ArrowRight, ChevronDown, Menu, Share2, GitBranch, MessageSquare,
  Globe, Lock, BarChart3, Sparkles, Terminal, Key, Layers,
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import ApiDemo from "@/components/api-demo"

const PRODUCTS = [
  { name: "SwiftSearch", icon: Search, href: "/products/swiftsearch", tag: "SEARCH API", desc: "Query 8 search engines in parallel. Get merged, ranked results in under 2 seconds." },
  { name: "ScrapeForge", icon: Code2, href: "/products/scrapeforge", tag: "SCRAPE API", desc: "Bypass anti-bot, render JavaScript, handle CAPTCHAs. Scrape anything that loads." },
  { name: "DeepDive", icon: Database, href: "/products/deepdive", tag: "RESEARCH API", desc: "One call: search → scrape top results → AI synthesis. Research, automated." },
]

const CAPABILITIES = [
  { icon: Globe, title: "8 Search Engines", desc: "Google, Bing, DuckDuckGo, Brave, and more. Parallel queries, merged results." },
  { icon: Lock, title: "Anti-Bot Bypass", desc: "Headless browser rendering, CAPTCHA solving, smart retry logic built in." },
  { icon: Sparkles, title: "AI Synthesis", desc: "DeepDive reads, scrapes, and synthesizes information from multiple sources." },
  { icon: Key, title: "API Key Auth", desc: "Simple bearer token auth. Generate keys from your dashboard. Revoke anytime." },
  { icon: BarChart3, title: "Credit Billing", desc: "Pay per request. No minimums. 5,000 free credits to start." },
  { icon: Zap, title: "Edge Deployed", desc: "Vercel global network. Low latency from anywhere in the world." },
]

const CODE_EXAMPLE = `curl -X POST https://search.venym.io/api/v1/swiftsearch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "latest AI research papers"}'`

export default function VenymSearchLanding() {
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-14 px-5">
          <Link href="/" className="font-bold tracking-[0.25em] text-sm">
            VENYM<span className="text-white/40 font-normal">.SEARCH</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide flex items-center gap-1 bg-transparent">
                Products <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-[#0c0c0c] border-white/10 rounded-md mt-2 min-w-[200px]">
                {PRODUCTS.map(p => (
                  <DropdownMenuItem key={p.name} asChild>
                    <Link href={p.href} className="flex items-center gap-3 py-2.5 px-3 text-[12px] text-white/60 hover:text-white hover:bg-white/[0.04] cursor-pointer focus:bg-white/[0.04] focus:text-white">
                      <p.icon className="h-3.5 w-3.5 opacity-60" />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[10px] text-white/30">{p.tag}</div>
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
                <Link href="/signup" className="venym-btn-primary text-[10px] py-2 px-4">Get API Key</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
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
        {/* Subtle grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="relative max-w-[1200px] mx-auto px-5 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-white/40 tracking-wider uppercase">API Status: Operational</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Search. Scrape.<br />
              <span className="text-white/30">Synthesize.</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-lg mb-10">
              Three APIs for everything the web has to offer. Real-time search, 
              anti-bot scraping, and AI-powered research — all behind one key.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/signup" className="venym-btn-primary text-[11px] py-3 px-6 text-center">
                Start Free →
              </Link>
              <Link href="/docs/quickstart" className="venym-btn-secondary text-[11px] py-3 px-6 text-center flex items-center justify-center gap-2">
                <Terminal className="h-3.5 w-3.5 opacity-50" /> Quickstart Guide
              </Link>
            </div>

            {/* Inline code preview */}
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg p-4 font-mono text-[12px] text-white/50 leading-relaxed max-w-xl overflow-x-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <span className="ml-2 text-[10px] text-white/20">Terminal</span>
              </div>
              <pre className="whitespace-pre-wrap">{CODE_EXAMPLE}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className="border-y border-white/[0.06] bg-[#080808]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { val: "8", label: "Search Engines" },
            { val: "<2s", label: "Avg Latency" },
            { val: "99.9%", label: "Uptime SLA" },
            { val: "50K+", label: "Daily Requests" },
          ].map((s, i) => (
            <div key={i} className={`py-6 px-5 ${i < 3 ? 'border-r border-white/[0.04]' : ''} ${i < 2 ? 'border-b md:border-b-0 border-white/[0.04]' : ''}`}>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">{s.val}</div>
              <div className="text-[10px] text-white/30 mt-1 tracking-wider uppercase font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRODUCTS ─── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Layers className="h-4 w-4 text-white/20" />
            <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Products</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">Three APIs. One key.</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <Link key={p.name} href={p.href} className="group relative border border-white/[0.06] rounded-lg p-6 hover:border-white/[0.12] transition-all duration-200 bg-[#080808]">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 rounded-md bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition">
                    <p.icon className="h-4 w-4 text-white/40 group-hover:text-white/70 transition" />
                  </div>
                  <span className="text-[10px] font-mono text-white/25 tracking-[0.15em]">{p.tag}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{p.desc}</p>
                <div className="flex items-center gap-1 mt-5 text-[11px] text-white/25 group-hover:text-white/50 transition">
                  Explore <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES ─── */}
      <section className="py-20 md:py-28 px-5 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-4 w-4 text-white/20" />
            <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Infrastructure</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">Built for production</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {CAPABILITIES.map((c, i) => (
              <div key={i} className="group">
                <c.icon className="h-4 w-4 text-white/20 mb-3 group-hover:text-white/40 transition" />
                <h3 className="text-[14px] font-semibold mb-1.5">{c.title}</h3>
                <p className="text-[13px] text-white/30 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE DEMO ─── */}
      <section className="py-20 md:py-28 px-5 border-t border-white/[0.04]">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="h-4 w-4 text-white/20" />
            <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Try It</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">See it in action</h2>
          <ApiDemo />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 md:py-28 px-5 border-t border-white/[0.04]">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">5,000 free credits.</h2>
          <p className="text-white/30 text-[14px] mb-8">No credit card. No rate limits on signup. Full API access from day one.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="venym-btn-primary text-[11px] py-3 px-8">Create Account</Link>
            <Link href="/docs" className="venym-btn-secondary text-[11px] py-3 px-8">Read the Docs</Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-10 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.15em] uppercase mb-3">Products</div>
              {PRODUCTS.map(p => (
                <Link key={p.name} href={p.href} className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">{p.name}</Link>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.15em] uppercase mb-3">Developers</div>
              <Link href="/docs" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">Documentation</Link>
              <Link href="/docs/quickstart" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">Quickstart</Link>
              <Link href="/docs/api-reference/swiftsearch" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">API Reference</Link>
              <Link href="/tools" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">Free Tools</Link>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.15em] uppercase mb-3">Company</div>
              <Link href="https://venym.io" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">Venym Labs</Link>
              <Link href="/pricing" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">Pricing</Link>
              <Link href="/blog" className="block text-[13px] text-white/30 hover:text-white/60 transition py-0.5">Blog</Link>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.15em] uppercase mb-3">Connect</div>
              <Link href="https://x.com/RealDoctaDG" className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition py-0.5"><Share2 className="h-3 w-3" /> Twitter</Link>
              <Link href="https://github.com/doctadg" className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition py-0.5"><GitBranch className="h-3 w-3" /> GitHub</Link>
              <Link href="https://t.me/realdoctadg" className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition py-0.5"><MessageSquare className="h-3 w-3" /> Telegram</Link>
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <span className="text-[10px] font-mono text-white/15 tracking-wider">VENYM SEARCH — A VENYM LABS PRODUCT</span>
            <span className="text-[10px] font-mono text-white/15 tracking-wider">search.venym.io</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
