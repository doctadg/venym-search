'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import {
  Shield,
  Layers,
  Database,
  Zap,
  Globe,
  TrendingUp,
  Code2,
  BarChart3,
  Users,
  Lightbulb,
} from 'lucide-react'
import { structuredData } from './metadata'

const FEATURES = [
  {
    id: '01',
    codename: 'EVASION STACK',
    class: 'CLASS::STEALTH',
    description:
      'Residential proxy mesh, TLS fingerprint spoofing, CAPTCHA solver pool. Cloudflare, Akamai, DataDome — bypass rate hits 99.3% across our production traffic.',
    metrics: ['CLOUDFLARE BYPASS', 'CAPTCHA SOLVER', 'TLS SPOOFING'],
    output: 'BLOCKED → RENDERED',
  },
  {
    id: '02',
    codename: 'JS RENDERING',
    class: 'CLASS::BROWSER',
    description:
      'Full headless Chromium per request. SPAs, lazy-loaded content, dynamic auth flows — if a human can load the page, Scrape can extract it.',
    metrics: ['HEADLESS CHROMIUM', 'DYNAMIC CONTENT', 'AUTH FLOWS'],
    output: 'URL → RENDERED DOM',
  },
  {
    id: '03',
    codename: 'LINK CRAWLER',
    class: 'CLASS::DISCOVERY',
    description:
      'Configurable internal-link traversal up to five levels deep. Pattern filters keep the crawl scoped. Perfect for catalog scrapes and site audits.',
    metrics: ['DEPTH 1-5', 'PATTERN FILTERS', 'PARALLEL FETCH'],
    output: 'URL → SITE GRAPH',
  },
  {
    id: '04',
    codename: 'STRUCTURED OUT',
    class: 'CLASS::EXTRACTION',
    description:
      'Schema.org markup parsed automatically. HTML tables converted to JSON. Media assets surfaced. The output is what your pipeline actually wanted.',
    metrics: ['SCHEMA.ORG', 'TABLE → JSON', 'MEDIA ASSETS'],
    output: 'PAGE → STRUCTURED',
  },
]

const USE_CASES = [
  {
    icon: TrendingUp,
    title: 'E-commerce intelligence',
    body: 'Monitor competitor catalogs, prices, and inventory across thousands of SKUs. Anti-bot evasion handled, link traversal handled, results structured.',
    tag: '2.3M products tracked daily',
  },
  {
    icon: BarChart3,
    title: 'Financial + regulatory data',
    body: 'Navigate SEC EDGAR, court filings, and disclosure portals with complex flows. Tables come back as JSON, ready to feed into your model pipeline.',
    tag: '50K filings processed monthly',
  },
  {
    icon: Users,
    title: 'HR + recruitment',
    body: 'Build talent databases from job boards, company pages, and professional networks. Scrape walks the site, extracts the people, returns clean records.',
    tag: '1.2M profiles enriched weekly',
  },
  {
    icon: Lightbulb,
    title: 'Research + knowledge graphs',
    body: 'Mine academic journals, patent databases, and citation networks. Crawl depth and pattern filters keep the dataset focused.',
    tag: '890K papers indexed',
  },
]

const PLANS = [
  {
    name: 'STARTER',
    price: '$9',
    credits: '5K credits / mo',
    body: 'Basic scraping for prototypes and small projects.',
    features: ['Single-page scrape', 'Basic anti-bot', 'Email support'],
    popular: false,
    cta: 'GET STARTED',
  },
  {
    name: 'BUILDER',
    price: '$49',
    credits: '100K credits / mo',
    body: 'Production scraping for growing teams.',
    features: ['Link follow (2 levels)', 'Contact extraction', 'Priority routing'],
    popular: true,
    cta: 'GET STARTED',
  },
  {
    name: 'UNICORN',
    price: '$199',
    credits: '500K credits / mo',
    body: 'Full enterprise extraction at volume.',
    features: ['Deep link follow (5 levels)', 'Bulk processing', 'Dedicated support'],
    popular: false,
    cta: 'GET STARTED',
  },
]

export default function ScrapeProductPage() {
  const { isSignedIn } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="relative w-full bg-background text-white selection:bg-white selection:text-black font-sans min-h-screen">
        <div className="fixed inset-0 bg-noise opacity-[0.04] pointer-events-none z-[60]" />

        {/* NAV */}
        <nav className="w-full flex justify-between items-center px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-xs uppercase tracking-[0.2em] font-mono text-gray-500 bg-background/95 backdrop-blur-md z-50 sticky top-0 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-white font-bold tracking-[0.3em] text-sm md:text-base">
              VENYM
            </span>
            <span className="hidden sm:inline text-gray-700 tracking-[0.4em]">/ SCRAPE</span>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            <Link href="/products/search" className="hover:text-white transition-colors">
              SEARCH
            </Link>
            <Link href="/products/scrape" className="text-white">
              SCRAPE
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              DOCS
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              PRICING
            </Link>
            <Link
              href={isSignedIn ? '/dashboard' : '/signup'}
              className="px-4 py-2 bg-white text-black text-[9px] font-mono font-bold tracking-[0.3em]"
            >
              {isSignedIn ? 'DASHBOARD' : 'GET API KEY'}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1px] bg-white origin-center"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[1px] bg-white"
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1px] bg-white origin-center"
            />
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 top-[53px] z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-7"
            >
              {[
                ['/products/search', 'Search'],
                ['/products/scrape', 'Scrape'],
                ['/docs', 'Docs'],
                ['/pricing', 'Pricing'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display font-medium tracking-tight text-white"
                >
                  {label}
                </Link>
              ))}
              <Link
                href={isSignedIn ? '/dashboard' : '/signup'}
                onClick={() => setMobileMenuOpen(false)}
                className="px-8 py-3 bg-white text-black text-[10px] font-mono font-bold tracking-[0.3em]"
              >
                {isSignedIn ? 'DASHBOARD' : 'GET API KEY'}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative w-full">
          {/* HERO */}
          <section className="relative w-full bg-background overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-28 lg:py-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.5em]">
                  Venym Engine // 02 · Scrape
                </span>
              </div>

              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <div className="lg:col-span-7 min-w-0">
                  <h1 className="text-[clamp(2.25rem,7vw,5.5rem)] font-display font-medium leading-[0.88] tracking-tighter mb-8 break-words">
                    Scrape,
                    <br />
                    <span className="text-gray-700 italic font-light">unblocked.</span>
                    <br />
                    Browser-grade.
                  </h1>
                  <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed mb-10">
                    Headless rendering, anti-bot evasion, CAPTCHA bypass, residential
                    proxies, intelligent link following. If a human can load it, Scrape
                    can extract it.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={isSignedIn ? '/dashboard' : '/signup'}
                      className="px-8 py-4 bg-white text-black text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors text-center"
                    >
                      [ GET API KEY ]
                    </Link>
                    <Link
                      href="/docs/api-reference/scrape"
                      className="px-8 py-4 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-center"
                    >
                      [ READ THE DOCS ]
                    </Link>
                  </div>

                  <div className="mt-10 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
                    <span className="text-[9px] font-mono text-green-500/60 uppercase tracking-[0.4em]">
                      ● ENDPOINT LIVE // 99.3% BYPASS RATE
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 min-w-0 w-full">
                  <div className="border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-gray-800">DEMO-02</span>
                        <span className="text-[10px] font-mono text-white tracking-[0.15em] uppercase">
                          POST / SCRAPE
                        </span>
                      </div>
                      <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 text-green-500/60 bg-green-500/5">
                        LIVE
                      </span>
                    </div>
                    <pre className="p-5 md:p-6 text-[11px] md:text-xs font-mono text-white/80 overflow-x-auto leading-relaxed">
{`curl -X POST https://search.venym.io/api/v1/scrape \\
  -H "X-API-Key: sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://target-site.com",
    "follow_internal_links": true,
    "max_depth": 3,
    "max_pages": 50,
    "extract": ["text", "links", "tables"]
  }'

# Response includes:
# ✓ Primary page markdown
# ✓ 50 traversed internal pages
# ✓ Tables extracted as JSON
# ✓ Anti-bot bypassed`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CAPABILITIES */}
          <section className="relative bg-background py-20 md:py-28 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-12 md:mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  System Capabilities // 02
                </span>
              </div>
              <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
                Four subsystems. <br />
                <span className="text-gray-700 italic font-light">One Scrape call.</span>
              </h2>
              <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed">
                Evasion, rendering, traversal, extraction — composed behind a single
                endpoint so your pipeline gets data, not a stack of failed proxies.
              </p>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-8 space-y-3 md:space-y-5">
              {FEATURES.map((cap) => (
                <div
                  key={cap.id}
                  className="group relative border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500"
                >
                  <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3 md:gap-6">
                      <span className="text-[9px] font-mono text-gray-800">NODE-{cap.id}</span>
                      <span className="text-[10px] md:text-xs font-mono text-white tracking-[0.15em] uppercase">
                        {cap.codename}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden md:inline text-[9px] font-mono text-gray-700">
                        {cap.class}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 text-green-500/60 bg-green-500/5">
                        OPERATIONAL
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-5 lg:col-span-4 px-6 md:px-8 py-6 md:py-8 border-b md:border-b-0 md:border-r border-white/5">
                      <p className="text-sm md:text-base font-sans font-light text-gray-400 leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                    <div className="md:col-span-4 lg:col-span-5 px-6 md:px-8 py-6 md:py-8 border-b md:border-b-0 md:border-r border-white/5">
                      <div className="space-y-3 md:space-y-4">
                        {cap.metrics.map((m, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-gray-700 w-12">
                              [{String(i + 1).padStart(2, '0')}]
                            </span>
                            <span className="text-[10px] md:text-xs font-mono text-white/60 uppercase tracking-[0.15em]">
                              {m}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-3 px-6 md:px-8 py-6 md:py-8 flex flex-col justify-center">
                      <span className="text-[8px] font-mono text-gray-800 uppercase tracking-[0.3em] block mb-3">
                        OUTPUT
                      </span>
                      <div className="bg-white/[0.03] border border-white/5 px-4 py-3 font-mono text-[10px] md:text-xs text-white/40 leading-relaxed">
                        {cap.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TELEMETRY STRIP */}
          <section className="relative bg-background border-t border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 max-w-[1400px] mx-auto">
              {[
                { val: '99.3%', label: 'BYPASS RATE' },
                { val: '1.2s', label: 'AVG LATENCY' },
                { val: '1M+', label: 'PAGES / DAY' },
                { val: '17', label: 'REGIONS' },
              ].map((s, i, arr) => {
                const last = i === arr.length - 1
                const lastInRow = i % 2 === 1
                return (
                <div
                  key={s.label}
                  className={`px-4 md:px-8 py-10 md:py-14 border-b md:border-b-0 border-white/5 ${
                    lastInRow ? '' : 'border-r'
                  } ${last ? 'md:border-r-0' : 'md:border-r'} border-white/5`}
                >
                  <span className="text-[9px] font-mono text-gray-800 uppercase tracking-[0.4em] block mb-4 md:mb-6">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  <div className="text-4xl md:text-6xl font-display font-medium leading-[0.85] tracking-tighter text-white">
                    {s.val}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] block mt-4 md:mt-6">
                    {s.label}
                  </span>
                </div>
                )
              })}
            </div>
          </section>

          {/* USE CASES */}
          <section className="relative bg-background border-t border-white/5 py-20 md:py-28">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-12 md:mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  Use Cases // 03
                </span>
              </div>
              <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
                What teams ship <br />
                <span className="text-gray-700 italic font-light">with Scrape.</span>
              </h2>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {USE_CASES.map((u) => {
                const Icon = u.icon
                return (
                  <div
                    key={u.title}
                    className="border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 p-6 md:p-8"
                  >
                    <Icon className="h-5 w-5 text-white/50 mb-6" strokeWidth={1.25} />
                    <h3 className="text-xl md:text-2xl font-display font-medium tracking-tight text-white mb-3">
                      {u.title}
                    </h3>
                    <p className="text-sm md:text-base font-sans font-light text-gray-400 leading-relaxed mb-6">
                      {u.body}
                    </p>
                    <span className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] border-t border-white/5 pt-4 block">
                      {u.tag}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* PRICING */}
          <section className="relative bg-background border-t border-white/5 py-20 md:py-28">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-12 md:mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  Pricing // 04
                </span>
              </div>
              <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
                Pay per page. <br />
                <span className="text-gray-700 italic font-light">No proxy bills.</span>
              </h2>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {PLANS.map((p) => (
                <div
                  key={p.name}
                  className={`relative flex flex-col border ${
                    p.popular
                      ? 'border-white/30 bg-white/[0.04]'
                      : 'border-white/5 bg-white/[0.01]'
                  } hover:border-white/20 transition-all duration-500 p-6 md:p-8`}
                >
                  {p.popular && (
                    <span className="absolute -top-2 left-6 text-[8px] font-mono text-black bg-white px-2 py-1 uppercase tracking-[0.3em] font-bold">
                      POPULAR
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-4">
                    {p.name}
                  </span>
                  <div className="text-4xl md:text-5xl font-display font-medium tracking-tighter text-white mb-1">
                    {p.price}
                  </div>
                  <span className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.2em] mb-4">
                    {p.credits}
                  </span>
                  <p className="text-sm font-sans font-light text-gray-400 leading-relaxed mb-6">
                    {p.body}
                  </p>
                  <div className="space-y-2 mb-8 flex-1">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <span className="text-white/40 text-[10px] font-mono mt-0.5">→</span>
                        <span className="text-[11px] md:text-xs font-mono text-white/60 leading-relaxed">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={isSignedIn ? '/dashboard' : '/signup'}
                    className={`text-center px-4 py-3 text-[10px] font-mono uppercase tracking-[0.3em] font-bold transition-colors ${
                      p.popular
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'border border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    [ {p.cta} ]
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="relative bg-background border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-32 text-center">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  Commencement // 05
                </span>
                <div className="w-12 h-[1px] bg-white/20" />
              </div>
              <h2 className="text-4xl md:text-[7rem] font-display font-medium leading-[0.85] tracking-tighter mb-10 max-w-4xl mx-auto">
                Scrape the open web. <br />
                <span className="text-gray-700 italic font-light">without limits.</span>
              </h2>
              <p className="text-gray-400 font-sans font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                500 free credits on signup. No card. Replace your scraping infrastructure
                with one HTTP endpoint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={isSignedIn ? '/dashboard' : '/signup'}
                  className="px-12 py-5 bg-white text-black text-[11px] font-mono uppercase tracking-[0.4em] font-bold hover:bg-gray-200 transition-colors"
                >
                  [ GET API KEY ]
                </Link>
                <Link
                  href="/docs/api-reference/scrape"
                  className="px-12 py-5 border border-white/10 text-white text-[11px] font-mono uppercase tracking-[0.4em] hover:bg-white/5 transition-all"
                >
                  [ VIEW DOCS ]
                </Link>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold tracking-[0.3em] text-sm">VENYM</span>
                <div className="h-3 w-[1px] bg-white/10" />
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.5em]">
                  search infrastructure
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-2 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">
                <Link href="/products/search" className="hover:text-white transition-colors">
                  search
                </Link>
                <Link href="/products/scrape" className="hover:text-white transition-colors">
                  scrape
                </Link>
                <Link href="/docs" className="hover:text-white transition-colors">
                  docs
                </Link>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  pricing
                </Link>
                <Link href="/blog" className="hover:text-white transition-colors">
                  blog
                </Link>
              </div>
              <span className="text-[9px] font-mono text-gray-900 uppercase tracking-[0.6em]">
                © VENYM LABS 2026
              </span>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
