'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView,
} from 'framer-motion'
import { Cpu, Network, Boxes } from 'lucide-react'
import ApiDemo from '@/components/api-demo'

/* ─────────────────────────────────────────────────────────────
   AnimatedLine — precision scroll-in grid line (from venym26)
   ───────────────────────────────────────────────────────────── */
const AnimatedLine = ({
  direction = 'horizontal',
  className = '',
  delay = 0,
  origin = 'left',
}: {
  direction?: 'horizontal' | 'vertical'
  className?: string
  delay?: number
  origin?: 'left' | 'right' | 'top' | 'bottom'
}) => {
  const isHorizontal = direction === 'horizontal'
  const initial = isHorizontal
    ? { x: origin === 'left' ? '-100%' : '100%', opacity: 0 }
    : { y: origin === 'top' ? '-100%' : '100%', opacity: 0 }
  const animate = isHorizontal ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }
  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
      className={`bg-white/10 absolute z-20 ${className} ${
        isHorizontal ? 'h-[1px] w-full left-0' : 'w-[1px] h-full top-0'
      }`}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */

const PRODUCTS = [
  {
    id: '01',
    codename: 'SEARCH',
    class: 'CLASS::SEARCH',
    status: 'OPERATIONAL',
    italic: 'parallel',
    title: 'Search,',
    suffix: 'merged.',
    tagline: 'Venym Engine // 01',
    description:
      'Eight engines queried in parallel. Deduped, ranked, and merged in under two seconds. One endpoint replaces every brittle scraper you built last quarter.',
    metrics: ['8 ENGINES // PARALLEL', 'SUB-2s LATENCY', '2 CREDITS / REQ'],
    pipeline: ['QUERY', 'FAN-OUT', 'MERGE', 'RANK', 'RESPONSE'],
  },
  {
    id: '02',
    codename: 'SCRAPE',
    class: 'CLASS::EXTRACTION',
    status: 'OPERATIONAL',
    italic: 'browser-grade',
    title: 'Scrape,',
    suffix: 'unblocked.',
    tagline: 'Venym Engine // 02',
    description:
      'Headless browser rendering, anti-bot evasion, CAPTCHA bypass, residential proxies. If a human can load it, Scrape can extract it.',
    metrics: ['JS-RENDERED', 'ANTI-BOT // CAPTCHA', '5 CREDITS / REQ'],
    pipeline: ['URL', 'RENDER', 'EVADE', 'EXTRACT', 'MARKDOWN'],
  },

]

const CAPABILITIES = [
  {
    id: '01',
    codename: 'ROUTER',
    class: 'CLASS::DISPATCH',
    status: 'OPERATIONAL',
    description:
      'Intelligent request routing across eight backbone engines. Failover within milliseconds. Geographic distribution by default. Your queries never wait on a single point of failure.',
    metrics: ['8 BACKBONES', 'AUTO-FAILOVER', 'GEO-DISTRIBUTED'],
    output: 'QUERY → BEST AVAILABLE ENGINE',
  },
  {
    id: '02',
    codename: 'EVADER',
    class: 'CLASS::STEALTH',
    status: 'OPERATIONAL',
    description:
      'Residential proxy mesh, fingerprint randomization, TLS fingerprint spoofing, CAPTCHA solver pool. The full anti-detection stack, maintained so you don\'t have to.',
    metrics: ['RESIDENTIAL POOL', 'TLS SPOOFING', 'CAPTCHA SOLVER'],
    output: 'BLOCKED → RENDERED → EXTRACTED',
  },
  {
    id: '03',
    codename: 'SYNTHESIZER',
    class: 'CLASS::COGNITION',
    status: 'OPERATIONAL',
    description:
      'Frontier model orchestration with citation enforcement. Every claim traces back to a source. Structured outputs, schema-conformant, ready to drop into your pipeline.',
    metrics: ['CITATION-ENFORCED', 'SCHEMA OUTPUT', 'MULTI-MODEL'],
    output: 'SOURCES → STRUCTURED ANSWER',
  },
  {
    id: '04',
    codename: 'SENTINEL',
    class: 'CLASS::INFRA',
    status: 'OPERATIONAL',
    description:
      'Per-key rate limits, usage analytics, webhook callbacks, prompt-level audit logs. Run scrapers across teams without the chaos. Compliance-ready by default.',
    metrics: ['AUDIT TRAIL', 'WEBHOOK READY', 'TEAM SCOPES'],
    output: 'TRAFFIC → METERED + LOGGED',
  },
]

const INTEGRATIONS = [
  'OPENAI',
  'ANTHROPIC',
  'LANGCHAIN',
  'LLAMAINDEX',
  'N8N',
  'ZAPIER',
  'MAKE',
  'PIPEDREAM',
  'VERCEL AI',
]

const STATS = [
  { val: '8', label: 'BACKBONE ENGINES' },
  { val: '<2s', label: 'AVG LATENCY' },
  { val: '99.9%', label: 'UPTIME SLA' },
  { val: '50M+', label: 'CALLS / MONTH' },
]

/* ─────────────────────────────────────────────────────────────
   StatNumber — fade-in on scroll for stat values
   ───────────────────────────────────────────────────────────── */
const StatNumber = ({ value, delay = 0 }: { value: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-5xl md:text-6xl lg:text-7xl font-display font-medium leading-[0.85] tracking-tighter text-white"
    >
      {value}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function VenymSearchLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn } = useUser()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const { scrollYProgress: heroProgressRaw } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroProgress = useSpring(heroProgressRaw, { damping: 30, stiffness: 90, mass: 0.4 })

  const { scrollYProgress: productsProgressRaw } = useScroll({
    target: productsRef,
    offset: ['start start', 'end end'],
  })
  const productsProgress = useSpring(productsProgressRaw, {
    damping: 25,
    stiffness: 80,
    mass: 0.5,
  })

  // Hero transforms — giant text scales out as you scroll
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 1.18])
  const heroOpacity = useTransform(heroProgress, [0, 0.5, 0.9], [1, 0.4, 0])
  const heroSubOpacity = useTransform(heroProgress, [0, 0.3], [1, 0])
  const heroSubY = useTransform(heroProgress, [0, 0.5], [0, 60])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.7])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-background text-white selection:bg-white selection:text-black font-sans"
    >
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-noise opacity-[0.04] pointer-events-none z-[60]" />

      {/* ───────────── NAV ───────────── */}
      <motion.nav
        style={{ opacity: logoOpacity }}
        className="w-full flex justify-between items-center px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-xs uppercase tracking-[0.2em] font-mono text-gray-500 bg-background/95 backdrop-blur-md z-50 sticky top-0 border-b border-white/5"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="text-white font-bold tracking-[0.3em] text-sm md:text-base">
            VENYM
          </span>
          <span className="hidden sm:inline text-gray-700 tracking-[0.4em]">/ SEARCH</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link href="/products/search" className="hover:text-white transition-colors">
            SEARCH
          </Link>
          <Link href="/products/scrape" className="hover:text-white transition-colors">
            SCRAPE
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            DOCS
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            PRICING
          </Link>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white text-black text-[9px] font-mono font-bold tracking-[0.3em]"
            >
              DASHBOARD
            </Link>
          ) : (
            <Link
              href="/signup"
              className="px-4 py-2 bg-white text-black text-[9px] font-mono font-bold tracking-[0.3em]"
            >
              GET API KEY
            </Link>
          )}
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
      </motion.nav>

      {/* Mobile menu */}
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
            ].map(([href, label], i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Link
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display font-medium tracking-tight text-white hover:text-gray-400 transition-colors"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <div className="h-[1px] w-12 bg-white/10 mt-4" />
            <span className="text-[9px] font-mono text-gray-800 uppercase tracking-[0.5em]">
              venym labs // search infra
            </span>
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
        {/* ───────────── HERO ───────────── */}
        <section
          ref={heroRef}
          className="relative w-full h-[150vh] bg-background overflow-hidden"
        >
          <AnimatedLine direction="vertical" className="left-[8%] opacity-20" delay={0.3} origin="top" />
          <AnimatedLine direction="vertical" className="right-[8%] opacity-20" delay={0.5} origin="bottom" />
          <AnimatedLine direction="horizontal" className="bottom-0" delay={0.9} origin="left" />

          <div className="sticky top-0 h-[calc(100vh-3.875rem)] md:h-[calc(100vh-4.875rem)] w-full flex flex-col items-center justify-between overflow-hidden pt-8 md:pt-12 pb-8 md:pb-10">
            {/* Background grid */}
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

            <motion.div
              style={{ scale: heroScale, opacity: heroOpacity }}
              className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-[1600px]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="flex items-center gap-3 mb-6 md:mb-10"
              >
                <div className="h-[1px] w-8 md:w-12 bg-white/20" />
                <span className="text-[9px] md:text-[10px] font-mono text-white/60 uppercase tracking-[0.5em] whitespace-nowrap">
                  Web Search + Scrape API · For AI Agents
                </span>
                <div className="h-[1px] w-8 md:w-12 bg-white/20" />
              </motion.div>

              <h1 className="text-[clamp(3rem,11vw,9.5rem)] leading-[0.88] font-display font-medium tracking-tighter text-white select-none">
                Search.
                <br />
                Scrape.
                <br />
                <span className="text-gray-700 italic font-light">For AI agents.</span>
              </h1>
            </motion.div>

            {/* Sub-hero */}
            <motion.div
              style={{ opacity: heroSubOpacity, y: heroSubY }}
              className="relative flex flex-col items-center px-6 z-10 w-full"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-sm md:text-lg font-sans font-light text-gray-400 leading-relaxed mb-8 max-w-2xl text-center"
              >
                One endpoint. Eight engines. JS-rendered, anti-bot, citation-ready.
                Drop into LangChain, MCP, or any agent loop in 30 seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                <Link
                  href={isSignedIn ? '/dashboard' : '/signup'}
                  className="px-8 py-4 bg-white text-black text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors"
                >
                  [ GET API KEY ]
                </Link>
                <Link
                  href="/docs"
                  className="px-8 py-4 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                >
                  [ READ THE DOCS ]
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
                className="mt-10 flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
                <span className="text-[9px] font-mono text-green-500/60 uppercase tracking-[0.4em]">
                  ● API OPERATIONAL // 50M+ CALLS / MO
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ───────────── METADATA BAR ───────────── */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-mono text-gray-600 bg-background relative border-y border-white/5">
          <div className="px-6 py-6 border-b md:border-b-0 border-r border-white/5">
            EST. MMXXV // VENYM LABS
          </div>
          <div className="px-6 py-6 border-b md:border-b-0 md:border-r border-white/5">
            <span className="text-green-500/70 mr-2">●</span>
            STATUS: OPERATIONAL
          </div>
          <div className="px-6 py-6 border-r border-white/5">
            8 ENGINES // &lt;2s LATENCY
          </div>
          <div className="px-6 py-6">BUILT FOR AI AGENTS</div>
        </div>

        {/* ───────────── PRODUCTS — SCROLL-LOCKED ───────────── */}
        <section
          ref={productsRef}
          className="relative h-[300vh] bg-background border-t border-white/5"
        >
          <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full flex flex-col md:flex-row bg-background overflow-hidden">
            {/* Left sidebar — product indicators */}
            <div className="w-full md:w-1/4 relative h-[26vh] md:h-full flex flex-col justify-end p-8 md:p-12 bg-background border-b md:border-b-0 md:border-r border-white/5">
              <div className="mb-6 md:mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-700">
                  Product Surface
                </span>
              </div>
              {PRODUCTS.map((item, index) => {
                const stepSize = 1 / PRODUCTS.length
                const start = index * stepSize
                const end = (index + 1) * stepSize
                const opacity = useTransform(
                  productsProgress,
                  [start, start + 0.08, end - 0.08, end],
                  [0.25, 1, 1, 0.25]
                )
                const translateY = useTransform(
                  productsProgress,
                  [start, start + 0.08, end - 0.08, end],
                  [16, 0, 0, -16]
                )
                const indicatorOpacity = useTransform(
                  productsProgress,
                  [start, start + 0.08, end - 0.08, end],
                  [0, 1, 1, 0]
                )

                return (
                  <motion.div
                    key={item.id}
                    style={{ opacity, y: translateY }}
                    className="flex items-center gap-3 md:gap-5 mb-4 md:mb-7 last:mb-0"
                  >
                    <span className="text-[9px] font-mono text-gray-800">{item.id}</span>
                    <div className="flex items-center gap-3">
                      <motion.div
                        style={{ opacity: indicatorOpacity }}
                        className="w-1 h-1 bg-white rounded-full"
                      />
                      <span className="font-sans text-sm font-light tracking-wide text-white">
                        {item.codename}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Right content — scroll-linked product reveal */}
            <div className="w-full md:w-3/4 relative h-screen md:h-full overflow-hidden">
              {PRODUCTS.map((item, index) => {
                const stepSize = 1 / PRODUCTS.length
                const start = index * stepSize
                const end = (index + 1) * stepSize
                const fadeRange = stepSize * 0.22
                const opacity = useTransform(
                  productsProgress,
                  [start, start + fadeRange, end - fadeRange, end],
                  [0, 1, 1, 0]
                )
                const scale = useTransform(
                  productsProgress,
                  [start, start + fadeRange, end - fadeRange, end],
                  [0.97, 1, 1, 1.03]
                )
                const translateY = useTransform(
                  productsProgress,
                  [start, start + fadeRange, end - fadeRange, end],
                  [30, 0, 0, -30]
                )
                const pe = useTransform(
                  productsProgress,
                  [start, start + fadeRange, end - fadeRange, end],
                  ['none', 'auto', 'auto', 'none']
                )

                return (
                  <motion.div
                    key={item.id + '-content'}
                    style={{ opacity, scale, y: translateY, zIndex: index, pointerEvents: pe }}
                    className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24"
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                      <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.5em]">
                        {item.class}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 text-green-500/60 bg-green-500/5">
                        {item.status}
                      </span>
                      <span className="text-[9px] font-mono text-gray-800">/ {item.id}</span>
                    </div>

                    <h2 className="text-4xl md:text-[6rem] lg:text-[7rem] font-display font-medium leading-[0.85] tracking-tighter mb-6 md:mb-10">
                      {item.title} <br />
                      <span className="text-gray-700 italic font-light">{item.italic}</span>{' '}
                      <br />
                      {item.suffix}
                    </h2>

                    <p className="text-gray-500 font-sans font-light text-base md:text-xl max-w-xl mb-8 md:mb-10 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
                      {item.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white/[0.03] border border-white/5 px-3 md:px-4 py-2"
                        >
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                          <span className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-[0.15em]">
                            {m}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block border border-white/5 bg-white/[0.01] px-6 py-4 max-w-3xl">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.4em]">
                          Runtime Pipeline
                        </span>
                        <div className="flex-1 h-[1px] bg-white/5" />
                        <span className="text-[9px] font-mono text-green-500/60">● ACTIVE</span>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 text-[9px] font-mono overflow-x-auto">
                        {item.pipeline.map((p, i) => (
                          <React.Fragment key={p}>
                            <span className="text-white/55 whitespace-nowrap bg-white/[0.03] px-3 py-1 border border-white/5">
                              {p}
                            </span>
                            {i < item.pipeline.length - 1 && (
                              <span className="text-white/30 whitespace-nowrap">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-8 md:mt-12">
                      <div className="h-[1px] w-12 bg-white/10" />
                      <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-gray-700">
                        {item.tagline}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ───────────── API DEMO — TERMINAL CARD ───────────── */}
        <section className="relative bg-background border-t border-white/5 py-20 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  Live Endpoint // 02
                </span>
              </div>
              <h2 className="text-4xl md:text-[6rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
                Hit the API. <br />
                <span className="text-gray-700 italic font-light">Right now.</span>
              </h2>
              <p className="text-gray-500 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed">
                No signup. No card. Run a real query against production infrastructure
                and see the response in your browser.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 }}
              className="border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[9px] font-mono text-gray-800">DEMO-01</span>
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                  <span className="text-[10px] md:text-xs font-mono text-white tracking-[0.15em] uppercase">
                    API ENDPOINT // LIVE
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[9px] font-mono text-gray-700">
                    api.venym.io
                  </span>
                  <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 text-green-500/60 bg-green-500/5">
                    OPERATIONAL
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-8 lg:p-12">
                <ApiDemo />
              </div>

              <div className="border-t border-white/5 px-6 md:px-8 py-4 flex items-center gap-3 overflow-x-auto">
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.4em] whitespace-nowrap">
                  Trace
                </span>
                <div className="flex-1 h-[1px] bg-white/5 min-w-[16px]" />
                <span className="text-[9px] font-mono text-white/40 whitespace-nowrap">
                  REQUEST → AUTH → ROUTE → ENGINE → MERGE → RESPONSE
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ───────────── CAPABILITIES — AGENT CARDS ───────────── */}
        <section className="relative bg-background pt-20 pb-16 md:pt-32 md:pb-24 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  System Architecture // 03
                </span>
              </div>
              <h2 className="text-4xl md:text-[7rem] font-display font-medium leading-[0.85] text-white tracking-tighter mb-6">
                Four subsystems. <br />
                <span className="text-gray-700 italic font-light">One agent endpoint.</span>
              </h2>
              <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed">
                Routing, evasion, synthesis, governance. Built so your agent never sees
                a blocked page, a stale cache, or an unscoped credential.
              </p>
            </motion.div>
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-8 space-y-3 md:space-y-5">
            {CAPABILITIES.map((cap, index) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500"
              >
                <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3 md:gap-6">
                    <span className="text-[9px] font-mono text-gray-800">NODE-{cap.id}</span>
                    <div className="hidden sm:flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/10" />
                      <span className="w-2 h-2 rounded-full bg-white/10" />
                      <span className="w-2 h-2 rounded-full bg-white/10" />
                    </div>
                    <span className="text-[10px] md:text-xs font-mono text-white tracking-[0.15em] uppercase">
                      {cap.codename}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-[9px] font-mono text-gray-700">
                      {cap.class}
                    </span>
                    <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 text-green-500/60 bg-green-500/5">
                      {cap.status}
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───────────── INTEGRATION PIPELINE ───────────── */}
        <section className="relative bg-background border-t border-white/5 py-20 md:py-28">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  Integration Mesh // 04
                </span>
              </div>
              <h2 className="text-4xl md:text-[5.5rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
                Plugs into <br />
                <span className="text-gray-700 italic font-light">every agent stack.</span>
              </h2>
              <p className="text-gray-400 font-sans font-light text-base md:text-lg max-w-2xl leading-relaxed">
                Native SDKs for Python and TypeScript. First-class tools for LangChain,
                LlamaIndex, OpenAI tool-calls, and the MCP protocol. Wire it into n8n,
                Zapier, Make, Pipedream. The endpoints look like any HTTP API — because they are.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="border border-white/5 bg-white/[0.01] px-4 md:px-8 py-6 md:py-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.4em]">
                  Integration Pipeline
                </span>
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="text-[9px] font-mono text-green-500/60">● ACTIVE</span>
              </div>

              <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-mono overflow-x-auto pb-3">
                <span className="text-white/30 whitespace-nowrap shrink-0">YOUR APP →</span>
                {INTEGRATIONS.map((name, i) => (
                  <React.Fragment key={name}>
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.04 * i, duration: 0.5 }}
                      className="text-white/55 whitespace-nowrap shrink-0 bg-white/[0.03] px-3 py-1.5 border border-white/5"
                    >
                      {name}
                    </motion.span>
                    {i < INTEGRATIONS.length - 1 && (
                      <span className="text-white/20 whitespace-nowrap shrink-0">→</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-white/30 whitespace-nowrap shrink-0">→ VENYM API</span>
              </div>

              <div className="flex items-center gap-6 mt-6 md:mt-8 pt-6 border-t border-white/5">
                <div className="h-[1px] w-12 bg-white/10" />
                <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-gray-700">
                  REST // GRPC // PYTHON // TYPESCRIPT
                </span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 mt-6">
              {[
                {
                  icon: Cpu,
                  label: 'AGENT FRAMEWORKS',
                  body: 'Drop-in tool definitions for LangChain, LlamaIndex, OpenAI tool-calls, and the MCP protocol.',
                },
                {
                  icon: Network,
                  label: 'WORKFLOW ORCHESTRATORS',
                  body: 'Native nodes for n8n, Zapier, Make, Pipedream. Wire scraping into business pipelines.',
                },
                {
                  icon: Boxes,
                  label: 'NATIVE SDKs',
                  body: 'Typed clients for Python and TypeScript. Streaming, retries, rate-limit handling included.',
                },
              ].map((c, i) => {
                const Icon = c.icon
                return (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.7 }}
                    className="border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 p-6 md:p-7"
                  >
                    <Icon className="h-5 w-5 text-white/50 mb-6" strokeWidth={1.25} />
                    <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.4em] block mb-3">
                      {c.label}
                    </span>
                    <p className="text-sm font-sans font-light text-gray-400 leading-relaxed">
                      {c.body}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ───────────── STATS ───────────── */}
        <section className="relative bg-background border-t border-white/5 py-20 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 md:mb-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                  Operational Telemetry // 05
                </span>
              </div>
              <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter">
                Numbers from <br />
                <span className="text-gray-700 italic font-light">production.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-4 md:px-8 py-10 md:py-14 ${
                    i < STATS.length - 1 ? 'border-r border-white/5' : ''
                  } border-b border-white/5`}
                >
                  <span className="text-[9px] font-mono text-gray-800 uppercase tracking-[0.4em] block mb-4 md:mb-6">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  <StatNumber value={s.val} delay={i * 0.08} />
                  <span className="text-[9px] md:text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] block mt-4 md:mt-6">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── FINAL CTA ───────────── */}
        <section className="relative bg-background border-t border-white/5">
          <div className="relative p-8 md:p-32 lg:p-48 flex flex-col items-center text-center">
            <AnimatedLine direction="vertical" className="left-[12%] opacity-15" delay={0.2} origin="top" />
            <AnimatedLine direction="vertical" className="right-[12%] opacity-15" delay={0.3} origin="bottom" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-12 md:mb-16"
            >
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                Commencement // 06
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-[9rem] font-display font-medium leading-[0.8] mb-12 md:mb-20 tracking-tighter max-w-5xl"
            >
              Ship your agent. <br />
              <span className="text-gray-700 italic font-light">today.</span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-gray-400 font-sans font-light text-base md:text-lg max-w-xl mb-12 md:mb-16 leading-relaxed"
            >
              100 free credits on signup. No card. No expiry. Wire Venym into your
              agent loop and watch it read the web like a human.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center"
            >
              <Link
                href={isSignedIn ? '/dashboard' : '/signup'}
                className="px-12 md:px-16 py-5 md:py-6 bg-white text-black text-[10px] md:text-[11px] font-mono uppercase tracking-[0.4em] font-bold hover:bg-gray-200 transition-colors"
              >
                [ GET API KEY ]
              </Link>
              <Link
                href="/docs"
                className="px-10 md:px-12 py-5 md:py-6 bg-transparent border border-white/10 text-white text-[10px] md:text-[11px] font-mono uppercase tracking-[0.4em] hover:bg-white/5 transition-all"
              >
                [ VIEW DOCS ]
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 md:mt-24 flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
              <span className="text-[9px] font-mono text-green-500/60 uppercase tracking-[0.5em]">
                ● ENDPOINTS LIVE // INGEST READY
              </span>
            </motion.div>
          </div>

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
        </section>
      </main>
    </div>
  )
}
