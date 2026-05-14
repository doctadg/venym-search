'use client'

import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Search,
  Code2,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Zap,
  Building2,
  Rocket,
  Cpu,
  Globe,
  ShieldCheck,
  Wallet,
  Terminal,
  Infinity as InfinityIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Fragment, useMemo, useState } from 'react'

/* ───────────── DATA ───────────── */

type Plan = {
  id: 'free' | 'starter' | 'pro' | 'enterprise'
  name: string
  tagline: string
  monthly: number | null
  annual: number | null
  credits: string
  creditsNum: number
  icon: typeof Rocket
  cta: string
  featured?: boolean
  features: { label: string; value?: string | boolean }[]
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Kick the tires.',
    monthly: 0,
    annual: 0,
    credits: '5,000',
    creditsNum: 5_000,
    icon: Rocket,
    cta: 'START FREE',
    features: [
      { label: 'Credits per month', value: '5,000' },
      { label: 'All three APIs' },
      { label: 'Community support' },
      { label: 'Rate limit', value: '20 req/min' },
      { label: 'Dashboard analytics' },
      { label: 'Webhooks', value: false },
      { label: 'SLA', value: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ship a side project.',
    monthly: 29,
    annual: 24,
    credits: '100,000',
    creditsNum: 100_000,
    icon: Zap,
    cta: 'START BUILDING',
    features: [
      { label: 'Credits per month', value: '100,000' },
      { label: 'All three APIs' },
      { label: 'Email support' },
      { label: 'Rate limit', value: '120 req/min' },
      { label: 'Dashboard analytics' },
      { label: 'Webhooks' },
      { label: 'SLA', value: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Scale to production.',
    monthly: 99,
    annual: 79,
    credits: '500,000',
    creditsNum: 500_000,
    icon: Sparkles,
    cta: 'GO PRO',
    featured: true,
    features: [
      { label: 'Credits per month', value: '500,000' },
      { label: 'All three APIs' },
      { label: 'Priority support, < 4h' },
      { label: 'Rate limit', value: '600 req/min' },
      { label: 'Dashboard analytics' },
      { label: 'Webhooks' },
      { label: 'SLA', value: '99.9%' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Bend the platform.',
    monthly: null,
    annual: null,
    credits: 'Custom',
    creditsNum: 0,
    icon: Building2,
    cta: 'TALK TO SALES',
    features: [
      { label: 'Credits per month', value: 'Custom' },
      { label: 'All three APIs' },
      { label: 'Dedicated engineer' },
      { label: 'Rate limit', value: 'Custom' },
      { label: 'Advanced analytics' },
      { label: 'Webhooks & custom integrations' },
      { label: 'SLA', value: '99.99%' },
    ],
  },
]

const COMPARE_ROWS: { label: string; values: (string | boolean)[]; group?: string }[] = [
  { group: 'Credits & APIs', label: 'Monthly credits', values: ['5,000', '100,000', '500,000', 'Custom'] },
  { label: 'Search', values: [true, true, true, true] },
  { label: 'Scrape', values: [true, true, true, true] },
  { label: 'Rate limit', values: ['20 / min', '120 / min', '600 / min', 'Custom'] },
  { group: 'Platform', label: 'Dashboard analytics', values: [true, true, true, true] },
  { label: 'Multiple API keys', values: ['2', '10', 'Unlimited', 'Unlimited'] },
  { label: 'Webhooks', values: [false, true, true, true] },
  { label: 'Team seats', values: ['1', '3', '10', 'Custom'] },
  { group: 'Support & SLA', label: 'Support', values: ['Community', 'Email', 'Priority < 4h', 'Dedicated'] },
  { label: 'Uptime SLA', values: [false, false, '99.9%', '99.99%'] },
  { label: 'Audit logs & SSO', values: [false, false, false, true] },
  { label: 'Custom contract', values: [false, false, false, true] },
]

const FAQS = [
  {
    q: 'How do credits work?',
    a: 'Every API request consumes credits — Search costs 2, Scrape costs 5. One credit is $0.0001. Your monthly plan pre-pays a credit balance; overage tops up at the same rate. No tiered surprises.',
  },
  {
    q: 'What happens when I run out of credits?',
    a: 'Your API returns a 402. No surprise charges. You can either upgrade your plan or top up with overage credits ($1 per 10,000) — whichever is cheaper for your traffic.',
  },
  {
    q: 'Can I switch or cancel plans anytime?',
    a: 'Yes. Upgrades are immediate and prorated. Downgrades take effect at the next billing cycle. No phone calls, no retention scripts — just a button in your dashboard.',
  },
  {
    q: 'Do you offer annual discounts?',
    a: 'Yes. Switch to annual billing to save ~20% on every paid plan. Enterprise contracts are negotiated separately based on volume commit.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Every account starts with 5,000 free credits — enough to evaluate all three APIs in production conditions. No card required to start.',
  },
  {
    q: 'How is Enterprise different?',
    a: 'Volume pricing, custom rate limits, on-prem or VPC deployment, SSO, audit logs, dedicated solutions engineering, and a signed MSA. Built for teams running 50M+ requests/month.',
  },
]

/* ───────────── HELPERS ───────────── */

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

function valueCell(v: string | boolean | undefined) {
  if (v === true) return <Check className="h-4 w-4 text-green-500/70 mx-auto" strokeWidth={1.5} />
  if (v === false) return <span className="text-white/15 font-mono text-xs">—</span>
  if (v === undefined) return <Check className="h-4 w-4 text-green-500/70 mx-auto" strokeWidth={1.5} />
  return <span className="text-[11px] md:text-xs font-mono text-white/60">{v}</span>
}

/* ───────────── CREDIT CALCULATOR ───────────── */

function CreditCalculator() {
  const [search, setSearch] = useState(20000)
  const [scrape, setScrape] = useState(5000)

  const totalCredits = search * 2 + scrape * 5
  const overage = totalCredits * 0.0001

  const recommended = useMemo(() => {
    if (totalCredits <= 5_000) return PLANS[0]
    if (totalCredits <= 100_000) return PLANS[1]
    if (totalCredits <= 500_000) return PLANS[2]
    return PLANS[3]
  }, [totalCredits])

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-3 md:gap-5">
      {/* Sliders */}
      <div className="border border-white/5 bg-white/[0.01] p-6 md:p-8 space-y-7">
        {[
          { icon: Search, label: 'SEARCH', sub: '2 cr / req', val: search, max: 200_000, set: setSearch, step: 500 },
          { icon: Code2, label: 'SCRAPE', sub: '5 cr / req', val: scrape, max: 100_000, set: setScrape, step: 100 },
        ].map((row) => {
          const Icon = row.icon
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-white/50" strokeWidth={1.25} />
                  <div>
                    <div className="text-[11px] md:text-xs font-mono text-white tracking-[0.2em]">
                      {row.label}
                    </div>
                    <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em] mt-0.5">
                      {row.sub}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-display font-medium tracking-tighter tabular-nums text-white">
                    {fmt(row.val)}
                  </div>
                  <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">
                    REQ / MO
                  </div>
                </div>
              </div>
              <Slider
                value={[row.val]}
                max={row.max}
                step={row.step}
                onValueChange={(v) => row.set(v[0])}
                className="cursor-pointer"
              />
            </div>
          )
        })}
      </div>

      {/* Result */}
      <div className="border border-white/10 bg-white/[0.03] p-6 md:p-8 flex flex-col justify-between min-h-full">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Wallet className="h-3.5 w-3.5 text-white/40" strokeWidth={1.5} />
            <span className="text-[10px] font-mono text-white/40 tracking-[0.4em] uppercase">
              Estimated / Mo
            </span>
          </div>
          <div className="text-[clamp(2.5rem,5vw,4rem)] font-display font-medium tracking-tighter leading-[0.9] tabular-nums text-white">
            {fmt(totalCredits)}
          </div>
          <div className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.3em] mt-2">
            CREDITS
          </div>
          <div className="text-xs text-white/40 mt-4 font-mono">
            ≈ ${overage.toFixed(2)} at $0.0001 / credit
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-[10px] font-mono text-gray-700 tracking-[0.4em] uppercase mb-4">
            RECOMMENDED PLAN
          </div>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-2xl md:text-3xl font-display font-medium tracking-tighter text-white">
                {recommended.name}
              </div>
              <div className="text-[11px] font-sans font-light text-gray-500 mt-1">
                {recommended.tagline}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl md:text-3xl font-display font-medium tracking-tighter tabular-nums text-white">
                {recommended.monthly === null ? 'Custom' : recommended.monthly === 0 ? '$0' : `$${recommended.monthly}`}
              </div>
              <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">
                / MONTH
              </div>
            </div>
          </div>
          <Link
            href={recommended.id === 'enterprise' ? 'mailto:sales@venym.io' : `/signup?plan=${recommended.id}`}
            className="block text-center px-4 py-3 bg-white text-black text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors"
          >
            [ CHOOSE {recommended.name.toUpperCase()} ]
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ───────────── PAGE ───────────── */

export default function PricingPage() {
  const { user, isSignedIn } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [annual, setAnnual] = useState(false)

  const handleCheckout = async (planId: Plan['id']) => {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:sales@venym.io'
      return
    }
    if (planId === 'free') {
      window.location.href = user ? '/dashboard' : '/signup?plan=free'
      return
    }
    if (!user) {
      window.location.href = `/signup?plan=${planId}`
      return
    }
    try {
      const res = await fetch('/api/payments/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_type: planId, billing: annual ? 'annual' : 'monthly' }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      window.location.href = data.checkout_url
    } catch {
      alert('Could not start checkout. Please try again.')
    }
  }

  return (
    <div className="relative w-full bg-background text-white selection:bg-white selection:text-black font-sans min-h-screen">
      <div className="fixed inset-0 bg-noise opacity-[0.04] pointer-events-none z-[60]" />

      {/* NAV */}
      <nav className="w-full flex justify-between items-center px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-xs uppercase tracking-[0.2em] font-mono text-gray-500 bg-background/95 backdrop-blur-md z-50 sticky top-0 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-white font-bold tracking-[0.3em] text-sm md:text-base">VENYM</span>
          <span className="hidden sm:inline text-gray-700 tracking-[0.4em]">/ PRICING</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link href="/products/search" className="hover:text-white transition-colors">SEARCH</Link>
          <Link href="/products/scrape" className="hover:text-white transition-colors">SCRAPE</Link>
          <Link href="/docs" className="hover:text-white transition-colors">DOCS</Link>
          <Link href="/pricing" className="text-white">PRICING</Link>
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
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-28">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.5em]">
                Pricing // Pay only for what you ship
              </span>
            </div>

            <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-display font-medium leading-[0.88] tracking-tighter mb-8 max-w-4xl">
              Usage-based.
              <br />
              <span className="text-gray-700 italic font-light">No surprises.</span>
            </h1>

            <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed mb-10">
              One credit equals $0.0001. Three APIs share one balance. Start free, scale to half a
              million calls, or sign a contract. Nothing in between is hidden.
            </p>

            <div className="inline-flex items-center gap-4 border border-white/10 px-5 py-2.5 bg-white/[0.02]">
              <span className={`text-[10px] font-mono tracking-[0.3em] uppercase transition ${!annual ? 'text-white' : 'text-white/30'}`}>
                MONTHLY
              </span>
              <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
              <span className={`text-[10px] font-mono tracking-[0.3em] uppercase transition flex items-center gap-2 ${annual ? 'text-white' : 'text-white/30'}`}>
                ANNUAL
                <span className="text-[8px] font-mono px-1.5 py-0.5 bg-green-500/10 text-green-500/70 border border-green-500/20 tracking-wider">
                  −20%
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* PRICING GRID */}
        <section className="relative bg-background py-20 md:py-28 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                Plans // 01
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {PLANS.map((plan) => {
                const price = annual ? plan.annual : plan.monthly
                const featured = !!plan.featured
                const Icon = plan.icon
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col border transition-all duration-500 p-6 md:p-8 ${
                      featured
                        ? 'border-white/30 bg-white/[0.04]'
                        : 'border-white/5 bg-white/[0.01] hover:border-white/15'
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-2 left-6 text-[8px] font-mono text-black bg-white px-2 py-1 uppercase tracking-[0.3em] font-bold">
                        MOST CHOSEN
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-6">
                      <Icon className="h-4 w-4 text-white/50" strokeWidth={1.25} />
                      <div>
                        <div className="text-[11px] font-mono text-white tracking-[0.2em] uppercase">
                          {plan.name}
                        </div>
                        <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em] mt-0.5">
                          {plan.tagline}
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      {price === null ? (
                        <div className="text-4xl md:text-5xl font-display font-medium tracking-tighter text-white">
                          Custom
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl text-white/40 font-display font-light">$</span>
                          <span className="text-5xl md:text-6xl font-display font-medium tracking-tighter tabular-nums leading-none text-white">
                            {price}
                          </span>
                          <span className="text-[10px] font-mono text-gray-700 tracking-[0.3em] uppercase ml-1">
                            / mo
                          </span>
                        </div>
                      )}
                      {annual && price !== null && price > 0 && (
                        <div className="text-[9px] font-mono text-gray-700 mt-2 tracking-[0.3em] uppercase">
                          BILLED YEARLY · SAVE ${((plan.monthly! - plan.annual!) * 12).toFixed(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-6 py-2.5 px-3 bg-white/[0.03] border border-white/5">
                      <span className="text-[11px] font-mono text-white/70 tabular-nums">
                        {plan.credits}
                      </span>
                      <span className="text-[9px] font-mono text-gray-700 tracking-[0.3em] uppercase ml-auto">
                        CREDITS / MO
                      </span>
                    </div>

                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((f, i) => {
                        const off = f.value === false
                        return (
                          <li
                            key={i}
                            className={`flex items-start gap-2.5 text-[12px] ${
                              off ? 'text-white/20' : 'text-white/60'
                            }`}
                          >
                            {off ? (
                              <X className="h-3 w-3 mt-1 shrink-0 text-white/15" strokeWidth={1.5} />
                            ) : (
                              <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-500/70" strokeWidth={1.5} />
                            )}
                            <span>
                              {f.label}
                              {typeof f.value === 'string' && (
                                <span className="text-white/35 font-mono text-[11px] ml-1.5">· {f.value}</span>
                              )}
                            </span>
                          </li>
                        )
                      })}
                    </ul>

                    <button
                      onClick={() => handleCheckout(plan.id)}
                      className={`text-center px-4 py-3 text-[10px] font-mono uppercase tracking-[0.3em] font-bold transition-colors ${
                        featured
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'border border-white/10 text-white hover:bg-white/5'
                      }`}
                    >
                      [ {plan.cta} ]
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-700">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500/60" strokeWidth={1.5} />
                NO CARD TO START
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500/60" strokeWidth={1.5} />
                CANCEL ANYTIME
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500/60" strokeWidth={1.5} />
                SOC 2 IN PROGRESS
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500/60" strokeWidth={1.5} />
                US / EU / APAC REGIONS
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="relative bg-background py-20 md:py-28 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                Estimate // 02
              </span>
            </div>
            <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter mb-12 max-w-3xl">
              Plug in your traffic. <br />
              <span className="text-gray-700 italic font-light">See the bill.</span>
            </h2>

            <CreditCalculator />
          </div>
        </section>

        {/* COMPARE TABLE */}
        <section className="relative bg-background py-20 md:py-28 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                Compare // 03
              </span>
            </div>
            <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter mb-12 max-w-3xl">
              Every feature. <br />
              <span className="text-gray-700 italic font-light">Side by side.</span>
            </h2>

            <div className="border border-white/5 bg-white/[0.01] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-5 text-[10px] font-mono text-gray-800 tracking-[0.3em] uppercase w-[28%]">
                        FEATURE
                      </th>
                      {PLANS.map((p) => {
                        const Icon = p.icon
                        return (
                          <th
                            key={p.id}
                            className={`p-5 text-center ${p.featured ? 'bg-white/[0.03]' : ''}`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-white/40" strokeWidth={1.25} />
                              <span className="text-[11px] font-mono text-white tracking-[0.2em] uppercase">
                                {p.name}
                              </span>
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row, i) => (
                      <Fragment key={i}>
                        {row.group && (
                          <tr className="bg-white/[0.02]">
                            <td
                              colSpan={5}
                              className="px-5 pt-6 pb-2 text-[9px] font-mono text-white/50 tracking-[0.4em] uppercase border-t border-white/5"
                            >
                              {row.group}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t border-white/5 hover:bg-white/[0.02] transition">
                          <td className="p-4 text-[12px] md:text-[13px] font-sans font-light text-gray-400">
                            {row.label}
                          </td>
                          {row.values.map((v, j) => (
                            <td
                              key={j}
                              className={`p-4 text-center ${PLANS[j].featured ? 'bg-white/[0.03]' : ''}`}
                            >
                              {valueCell(v)}
                            </td>
                          ))}
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ENTERPRISE BAND */}
        <section className="relative bg-background py-20 md:py-28 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <div className="border border-white/5 bg-white/[0.01] p-8 md:p-12 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-white/20" />
                  <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                    Enterprise // 04
                  </span>
                </div>
                <h3 className="text-3xl md:text-[3.5rem] font-display font-medium leading-[0.9] tracking-tighter mb-5">
                  50M+ requests a month? <br />
                  <span className="text-gray-700 italic font-light">We build that contract.</span>
                </h3>
                <p className="text-gray-400 font-sans font-light text-base leading-relaxed max-w-lg mb-8">
                  Volume pricing, dedicated infrastructure, on-prem or VPC deployment, SSO/SAML, audit
                  logs, and a named solutions engineer. MSA in your inbox within 48 hours.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="mailto:sales@venym.io"
                    className="px-8 py-4 bg-white text-black text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors"
                  >
                    [ TALK TO SALES ]
                  </Link>
                  <Link
                    href="/docs"
                    className="px-8 py-4 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                  >
                    [ READ THE DOCS ]
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {[
                  { icon: ShieldCheck, label: 'SOC 2 + GDPR' },
                  { icon: Globe, label: 'On-prem / VPC' },
                  { icon: InfinityIcon, label: 'Custom rate limits' },
                  { icon: Cpu, label: 'Dedicated infra' },
                  { icon: Terminal, label: 'SSO / SAML' },
                  { icon: Wallet, label: 'Volume pricing' },
                ].map((c, i) => {
                  const Icon = c.icon
                  return (
                    <div
                      key={i}
                      className="border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-white/50 mb-3" strokeWidth={1.25} />
                      <div className="text-[11px] md:text-xs font-sans font-light text-white/70">
                        {c.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative bg-background py-20 md:py-28 border-t border-white/5">
          <div className="max-w-[920px] mx-auto px-6 md:px-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                FAQ // 05
              </span>
            </div>
            <h2 className="text-3xl md:text-[5rem] font-display font-medium leading-[0.85] tracking-tighter mb-12 max-w-2xl">
              Questions we&apos;ve <br />
              <span className="text-gray-700 italic font-light">heard twice.</span>
            </h2>

            <Accordion type="single" collapsible className="w-full border-t border-white/5">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-white/5"
                >
                  <AccordionTrigger className="text-left text-[14px] md:text-[15px] font-sans font-light text-white/85 hover:text-white py-5 hover:no-underline">
                    <span className="flex items-center gap-5">
                      <span className="text-[10px] font-mono text-gray-700 tracking-[0.3em] tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] md:text-sm font-sans font-light text-gray-400 leading-relaxed pl-12 pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-background border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-32 text-center">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.6em]">
                Commencement // 06
              </span>
              <div className="w-12 h-[1px] bg-white/20" />
            </div>
            <h2 className="text-4xl md:text-[7rem] font-display font-medium leading-[0.85] tracking-tighter mb-10 max-w-4xl mx-auto">
              Pick a plan. <br />
              <span className="text-gray-700 italic font-light">Ship by lunch.</span>
            </h2>
            <p className="text-gray-400 font-sans font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Three production APIs behind one key. 5,000 credits to evaluate. No card, no demo, no
              sales call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={isSignedIn ? '/dashboard' : '/signup'}
                className="px-12 py-5 bg-white text-black text-[11px] font-mono uppercase tracking-[0.4em] font-bold hover:bg-gray-200 transition-colors"
              >
                [ START FREE ]
              </Link>
              <Link
                href="mailto:sales@venym.io"
                className="px-12 py-5 border border-white/10 text-white text-[11px] font-mono uppercase tracking-[0.4em] hover:bg-white/5 transition-all"
              >
                [ TALK TO SALES ]
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
              <span className="text-[9px] font-mono text-green-500/60 uppercase tracking-[0.5em]">
                ● ALL SYSTEMS OPERATIONAL
              </span>
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
              <Link href="/products/search" className="hover:text-white transition-colors">search</Link>
              <Link href="/products/scrape" className="hover:text-white transition-colors">scrape</Link>
              <Link href="/docs" className="hover:text-white transition-colors">docs</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">pricing</Link>
              <Link href="/blog" className="hover:text-white transition-colors">blog</Link>
            </div>
            <span className="text-[9px] font-mono text-gray-900 uppercase tracking-[0.6em]">
              © VENYM LABS 2026
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
