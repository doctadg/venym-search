'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Globe, CheckCircle, Target, Flame, Share2, GitBranch, MessageSquare, BookOpen,
  TrendingUp, Cpu, Search, Code2, Database, Zap, Users, Shield, Clock, DollarSign,
  ArrowRight, ChevronDown, Menu, Wrench,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import ApiDemo from "@/components/api-demo"

const PRODUCTS = [
  { name: "SWIFTSEARCH", icon: Search, href: "/products/swiftsearch", tag: "SEARCH", desc: "Real-time web search across 8 engines in parallel. Sub-second results." },
  { name: "SCRAPEFORGE", icon: Code2, href: "/products/scrapeforge", tag: "SCRAPE", desc: "Bypass any anti-bot. JavaScript rendering, CAPTCHA handling, contact extraction." },
  { name: "DEEPDIVE", icon: Database, href: "/products/deepdive", tag: "RESEARCH", desc: "Multi-source AI research. Search → scrape → synthesize in one call." },
]

const STATS = [
  { value: "8", label: "SEARCH ENGINES" },
  { value: "<2s", label: "AVG LATENCY" },
  { value: "99.9%", label: "UPTIME" },
  { value: "50K+", label: "API CALLS/DAY" },
]

const FEATURES = [
  { icon: Search, title: "Multi-Engine Search", desc: "Parallel queries across Google, Bing, DuckDuckGo, Brave, and 4 more engines with intelligent merging." },
  { icon: Code2, title: "Anti-Bot Bypass", desc: "JavaScript rendering, CAPTCHA solving, smart retries. Scrape anything, anywhere." },
  { icon: Database, title: "AI Research Engine", desc: "DeepDive searches, scrapes top results, and synthesizes findings in a single API call." },
  { icon: Shield, title: "Enterprise Auth", desc: "API key management, rate limiting, credit-based billing with Stripe integration." },
  { icon: Zap, title: "Edge-Optimized", desc: "Deployed on Vercel's global network. Every request hits the nearest edge node." },
  { icon: Clock, title: "Real-Time Results", desc: "No stale caches. Every search query returns fresh, live results from the web." },
]

export default function VenymSearchLanding() {
  const { user, isLoaded } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-xs uppercase tracking-[0.2em] font-mono text-gray-500 bg-[#050505]/95 backdrop-blur-md z-50 sticky top-0 border-b border-white/5">
        <Link href="/" className="flex items-center">
          <span className="text-white font-bold tracking-[0.3em] text-sm md:text-base">VENYM_SEARCH</span>
        </Link>
        
        {/* Desktop nav */}
        <div className="hidden lg:flex gap-8 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-white transition-colors flex items-center gap-1 bg-transparent text-gray-500 text-[9px] uppercase tracking-[0.2em] font-mono">
              PRODUCTS
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-[#0a0a0a] border border-white/10 mt-2">
              {PRODUCTS.map(p => (
                <DropdownMenuItem key={p.name} asChild>
                  <Link href={p.href} className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white flex items-center gap-2">
                    <p.icon className="h-3 w-3" />
                    {p.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/docs" className="hover:text-white transition-colors text-[9px] uppercase tracking-[0.2em] font-mono text-gray-500">DOCS</Link>
          <Link href="/pricing" className="hover:text-white transition-colors text-[9px] uppercase tracking-[0.2em] font-mono text-gray-500">PRICING</Link>
          <Link href="/tools" className="hover:text-white transition-colors text-[9px] uppercase tracking-[0.2em] font-mono text-gray-500">TOOLS</Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 bg-white text-black text-[9px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors">DASHBOARD</Link>
          ) : (
            <div className="flex gap-3 items-center">
              <Link href="/login" className="hover:text-white transition-colors text-[9px] uppercase tracking-[0.2em] font-mono text-gray-500">LOGIN</Link>
              <Link href="/signup" className="px-4 py-2 bg-white text-black text-[9px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors">GET STARTED</Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#050505] border-white/10 w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-white font-mono tracking-[0.3em] text-sm">VENYM_SEARCH</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {PRODUCTS.map(p => (
                <Link key={p.name} href={p.href} onClick={() => setIsMenuOpen(false)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-white py-2 border-b border-white/5">{p.name}</Link>
              ))}
              <Link href="/docs" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-white py-2 border-b border-white/5">DOCS</Link>
              <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-white py-2 border-b border-white/5">PRICING</Link>
              <Link href="/tools" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-white py-2 border-b border-white/5">TOOLS</Link>
              {user ? (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="mt-4 px-4 py-3 bg-white text-black text-[9px] font-mono uppercase tracking-[0.3em] font-bold text-center">DASHBOARD</Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-white py-2">LOGIN</Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-white text-black text-[9px] font-mono uppercase tracking-[0.3em] font-bold text-center">GET STARTED</Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className="relative w-full">
        {/* HERO */}
        <section className="relative w-full overflow-hidden flex flex-col items-center justify-center py-24 md:py-48 min-h-[70vh] md:min-h-[80vh]">
          <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-white/10" />
          <div className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-white/10" />
          
          <h1 className="text-[18vw] md:text-[14vw] leading-[0.7] font-black tracking-tighter uppercase text-white select-none relative z-10">
            SEARCH
          </h1>
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-gray-600 mt-6 relative z-10">
            Powered by Venym Labs
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mt-12 relative z-10">
            <Link href="/signup" className="venym-btn-primary">GET API KEY</Link>
            <Link href="/docs" className="venym-btn-secondary">READ DOCS</Link>
          </div>

          <p className="text-sm md:text-base text-gray-500 font-light mt-8 text-center max-w-xl px-6 relative z-10">
            Enterprise-grade web scraping, real-time search, and AI-powered research APIs. 
            Three products. One API. Built for builders.
          </p>
        </section>

        {/* METADATA BAR */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 text-[10px] uppercase tracking-[0.3em] font-mono text-gray-600 border-y border-white/5">
          {STATS.map((s, i) => (
            <div key={i} className={`px-6 py-6 ${i < 3 ? 'border-r border-white/5' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''}`}>
              <span className="text-white mr-2">{s.value}</span> {s.label}
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="venym-meta mb-12">PRODUCTS // 03</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRODUCTS.map((p, i) => (
                <Link key={p.name} href={p.href} className="venym-card p-8 group cursor-pointer transition-all duration-300 hover:border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <p.icon className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">{p.tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{p.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  <ArrowRight className="h-4 w-4 mt-6 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="venym-divider" />

        {/* FEATURES */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="venym-meta mb-12">CAPABILITIES // INFRASTRUCTURE</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((f, i) => (
                <div key={i} className="group">
                  <f.icon className="h-5 w-5 text-gray-600 mb-4 group-hover:text-white transition-colors" />
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="venym-divider" />

        {/* API DEMO */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="venym-meta mb-8">TRY IT // LIVE DEMO</div>
            <ApiDemo />
          </div>
        </section>

        <div className="venym-divider" />

        {/* CTA */}
        <section className="py-20 md:py-32 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">START BUILDING</h2>
            <p className="text-gray-500 text-sm md:text-base mb-10">
              5,000 free credits. No credit card required. Full API access from day one.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="venym-btn-primary">GET API KEY</Link>
              <Link href="/docs" className="venym-btn-secondary">DOCUMENTATION</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mb-4">PRODUCTS</div>
                {PRODUCTS.map(p => (
                  <Link key={p.name} href={p.href} className="block text-sm text-gray-500 hover:text-white transition-colors py-1">{p.name}</Link>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mb-4">DEVELOPERS</div>
                <Link href="/docs" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">Documentation</Link>
                <Link href="/docs/quickstart" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">Quickstart</Link>
                <Link href="/docs/api-reference/swiftsearch" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">API Reference</Link>
                <Link href="/tools" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">Free Tools</Link>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mb-4">COMPANY</div>
                <Link href="https://venym.io" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">Venym Labs</Link>
                <Link href="/pricing" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">Pricing</Link>
                <Link href="/blog" className="block text-sm text-gray-500 hover:text-white transition-colors py-1">Blog</Link>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mb-4">CONNECT</div>
                <Link href="https://x.com/RealDoctaDG" className="block text-sm text-gray-500 hover:text-white transition-colors py-1 flex items-center gap-2"><Share2 className="h-3 w-3" /> Twitter</Link>
                <Link href="https://github.com/doctadg" className="block text-sm text-gray-500 hover:text-white transition-colors py-1 flex items-center gap-2"><GitBranch className="h-3 w-3" /> GitHub</Link>
                <Link href="https://t.me/realdoctadg" className="block text-sm text-gray-500 hover:text-white transition-colors py-1 flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Telegram</Link>
              </div>
            </div>
            <div className="venym-divider mb-6" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">VENYM_SEARCH // A VENYM LABS PRODUCT</span>
              <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">EST. MMXXV // search.venym.io</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
