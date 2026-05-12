'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Search, Code2, Database, ArrowRight, ChevronDown, Menu,
  Check, X, Sparkles, Zap, Building2, Rocket, Terminal,
  ArrowUpRight, CheckCircle2, Layers, Infinity as InfinityIcon,
  Wallet, LineChart, ShieldCheck, Globe, Cpu, Gauge,
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Fragment, useMemo, useState } from "react"

/* ───────────── DATA ───────────── */

const PRODUCTS = [
  { name: "SwiftSearch", icon: Search, href: "/products/swiftsearch", tag: "SEARCH", credits: "2 cr/req" },
  { name: "ScrapeForge", icon: Code2, href: "/products/scrapeforge", tag: "SCRAPE", credits: "5 cr/req" },
  { name: "DeepDive", icon: Database, href: "/products/deepdive", tag: "RESEARCH", credits: "10 cr/req" },
]

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
  href?: string
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
    cta: 'Start Free',
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
    cta: 'Start Building',
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
    cta: 'Go Pro',
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
    cta: 'Talk to Sales',
    href: 'mailto:sales@venym.io',
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
  { label: 'SwiftSearch (search)', values: [true, true, true, true] },
  { label: 'ScrapeForge (scrape)', values: [true, true, true, true] },
  { label: 'DeepDive (research)', values: [true, true, true, true] },
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
    a: 'One credit = $0.0001. SwiftSearch costs 2 credits per request, ScrapeForge 5, DeepDive 10. You only pay for successful responses — failed requests are free. Credits reset at the start of each billing cycle.',
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
  if (v === true) return <Check className="h-4 w-4 text-emerald-400/80 mx-auto" />
  if (v === false) return <X className="h-3.5 w-3.5 text-white/15 mx-auto" />
  if (v === undefined) return <Check className="h-4 w-4 text-emerald-400/80 mx-auto" />
  return <span className="text-[12px] text-white/70 font-mono">{v}</span>
}

/* ───────────── CREDIT CALCULATOR ───────────── */

function CreditCalculator() {
  const [search, setSearch] = useState(20000)
  const [scrape, setScrape] = useState(5000)
  const [research, setResearch] = useState(500)

  const totalCredits = search * 2 + scrape * 5 + research * 10
  const overage = totalCredits * 0.0001

  const recommended = useMemo(() => {
    if (totalCredits <= 5_000) return PLANS[0]
    if (totalCredits <= 100_000) return PLANS[1]
    if (totalCredits <= 500_000) return PLANS[2]
    return PLANS[3]
  }, [totalCredits])

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
      {/* Sliders */}
      <div className="venym-card !p-7 md:!p-9 space-y-7">
        {[
          { icon: Search, label: 'SwiftSearch', sub: '2 cr / req', val: search, max: 200_000, set: setSearch, step: 500 },
          { icon: Code2, label: 'ScrapeForge', sub: '5 cr / req', val: scrape, max: 100_000, set: setScrape, step: 100 },
          { icon: Database, label: 'DeepDive', sub: '10 cr / req', val: research, max: 50_000, set: setResearch, step: 50 },
        ].map(row => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <row.icon className="h-4 w-4 text-white/60" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white/90">{row.label}</div>
                  <div className="text-[10px] font-mono text-white/30 tracking-wider uppercase">{row.sub}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[18px] font-bold tabular-nums">{fmt(row.val)}</div>
                <div className="text-[10px] font-mono text-white/30 tracking-wider uppercase">req / mo</div>
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
        ))}
      </div>

      {/* Result */}
      <div className="venym-glow-card p-7 md:p-9 flex flex-col justify-between min-h-full">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Wallet className="h-4 w-4 text-white/40" />
            <span className="text-[10px] font-mono text-white/40 tracking-[0.25em] uppercase">Estimated Monthly</span>
          </div>
          <div className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight leading-none tabular-nums">
            {fmt(totalCredits)}
            <span className="text-white/30 text-[0.55em] font-mono ml-2 tracking-wider">CREDITS</span>
          </div>
          <div className="text-[12px] text-white/40 mt-3 font-mono">
            ≈ ${overage.toFixed(2)} at $0.0001 / credit
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <div className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mb-3">Recommended plan</div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <recommended.icon className="h-5 w-5 text-white/60" />
                {recommended.name}
              </div>
              <div className="text-[12px] text-white/40 mt-1">{recommended.tagline}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold tabular-nums">
                {recommended.monthly === null ? 'Custom' : recommended.monthly === 0 ? '$0' : `$${recommended.monthly}`}
              </div>
              <div className="text-[10px] font-mono text-white/30 tracking-wider uppercase">/ month</div>
            </div>
          </div>
          <Link
            href={recommended.id === 'enterprise' ? 'mailto:sales@venym.io' : `/signup?plan=${recommended.id}`}
            className="venym-btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2 group"
          >
            Choose {recommended.name}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ───────────── PAGE ───────────── */

export default function PricingPage() {
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
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
            <Link href="/pricing" className="text-[11px] font-medium text-white tracking-wide">Pricing</Link>
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
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="py-3 px-2 text-[12px] text-white border-b border-white/[0.04]">Pricing</Link>
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
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 mesh-dots" />
        <div className="absolute inset-0 glow-radial" />

        <div className="relative max-w-[1280px] mx-auto px-5 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
            <Wallet className="h-3 w-3 text-white/60" />
            <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">Pricing // Pay only for what you ship</span>
          </div>

          <h1 className="font-bold tracking-tight leading-[0.95] text-[clamp(2.5rem,8vw,5.5rem)] mx-auto max-w-4xl">
            <span className="block gradient-text">Usage-based.</span>
            <span className="block gradient-text-static">No surprises.</span>
          </h1>

          <p className="mt-7 text-[15px] md:text-base text-white/45 leading-relaxed max-w-xl mx-auto">
            One credit equals $0.0001. Three APIs share one balance. Start free, scale to half a million calls,
            or sign a contract. Nothing in between is hidden.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 inline-flex items-center gap-4 border border-white/[0.08] rounded-full px-5 py-2 bg-[#080808]/80 backdrop-blur">
            <span className={`text-[11px] font-mono tracking-wider uppercase transition ${!annual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
            <span className={`text-[11px] font-mono tracking-wider uppercase transition flex items-center gap-2 ${annual ? 'text-white' : 'text-white/40'}`}>
              Annual
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-400/10 text-emerald-300/90 border border-emerald-400/20 tracking-wider">−20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── PRICING GRID ─── */}
      <section className="relative px-5 py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map(plan => {
              const price = annual ? plan.annual : plan.monthly
              const featured = !!plan.featured
              const Wrapper: React.ElementType = 'div'
              return (
                <Wrapper
                  key={plan.id}
                  className={
                    featured
                      ? "venym-glow-card relative flex flex-col p-7 md:p-8"
                      : "bento-card relative flex flex-col rounded-xl p-7 md:p-8"
                  }
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-white/15 bg-[#050505] text-[9px] font-mono tracking-[0.25em] uppercase text-white/80 flex items-center gap-1.5 z-10">
                      <Sparkles className="h-2.5 w-2.5" />
                      Most chosen
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <plan.icon className="h-4 w-4 text-white/70" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold tracking-tight">{plan.name}</div>
                        <div className="text-[10px] font-mono text-white/30 tracking-wider uppercase">{plan.tagline}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    {price === null ? (
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl md:text-5xl font-bold tracking-tight">Custom</div>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl text-white/50 font-medium">$</span>
                        <span className="text-[44px] md:text-[52px] font-bold tracking-tight tabular-nums leading-none">{price}</span>
                        <span className="text-[11px] font-mono text-white/30 tracking-wider uppercase ml-1">/ mo</span>
                      </div>
                    )}
                    {annual && price !== null && price > 0 && (
                      <div className="text-[10px] font-mono text-white/30 mt-1 tracking-wider uppercase">
                        Billed yearly · save ${((plan.monthly! - plan.annual!) * 12).toFixed(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-6 py-2.5 px-3 rounded-sm bg-white/[0.02] border border-white/[0.05]">
                    <Gauge className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-[12px] font-mono text-white/70 tabular-nums">{plan.credits}</span>
                    <span className="text-[10px] font-mono text-white/30 tracking-wider uppercase ml-auto">credits / mo</span>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, i) => {
                      const off = f.value === false
                      return (
                        <li key={i} className={`flex items-start gap-2.5 text-[12.5px] ${off ? 'text-white/25' : 'text-white/65'}`}>
                          {off
                            ? <X className="h-3.5 w-3.5 mt-[3px] shrink-0 text-white/15" />
                            : <Check className="h-3.5 w-3.5 mt-[3px] shrink-0 text-emerald-400/80" />}
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
                    className={
                      featured
                        ? "venym-btn-primary w-full py-3 flex items-center justify-center gap-2 group"
                        : "venym-btn-secondary w-full py-3 flex items-center justify-center gap-2 group"
                    }
                  >
                    {plan.cta}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Wrapper>
              )
            })}
          </div>

          {/* Inline guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-white/30">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> No credit card to start</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> Cancel or change anytime</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> SOC 2 in progress</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-white/40" /> US, EU, APAC regions</div>
          </div>
        </div>
      </section>

      {/* ─── CALCULATOR ─── */}
      <section className="relative px-5 py-24 md:py-28 border-t border-white/[0.06]">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LineChart className="h-4 w-4 text-white/30" />
                <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Estimate // 02</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] max-w-2xl">
                Plug in your traffic.<br />
                <span className="text-white/30">See the bill.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/[0.06] rounded-full bg-white/[0.02]">
              <Cpu className="h-3 w-3 text-white/40" />
              <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">Live · $0.0001 / credit</span>
            </div>
          </div>

          <CreditCalculator />
        </div>
      </section>

      {/* ─── COMPARE TABLE ─── */}
      <section className="relative px-5 py-24 md:py-28 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="h-4 w-4 text-white/30" />
            <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Compare // 03</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-12 max-w-3xl">
            Every feature.<br />
            <span className="text-white/30">Side by side.</span>
          </h2>

          <div className="relative border border-white/[0.06] rounded-xl overflow-hidden bg-[#080808]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left p-5 text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase w-[28%]">Feature</th>
                    {PLANS.map(p => (
                      <th key={p.id} className={`p-5 text-center ${p.featured ? 'bg-white/[0.02]' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                          <p.icon className="h-3.5 w-3.5 text-white/40" />
                          <span className="text-[12px] font-semibold text-white/90">{p.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <Fragment key={i}>
                      {row.group && (
                        <tr className="bg-white/[0.015]">
                          <td colSpan={5} className="px-5 pt-6 pb-2 text-[10px] font-mono text-white/40 tracking-[0.25em] uppercase border-t border-white/[0.04]">
                            {row.group}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t border-white/[0.04] hover:bg-white/[0.015] transition">
                        <td className="p-4 text-[13px] text-white/70">{row.label}</td>
                        {row.values.map((v, j) => (
                          <td key={j} className={`p-4 text-center ${PLANS[j].featured ? 'bg-white/[0.02]' : ''}`}>
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

      {/* ─── ENTERPRISE BAND ─── */}
      <section className="relative px-5 py-20 md:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="bento-card rounded-xl p-8 md:p-12 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Building2 className="h-4 w-4 text-white/40" />
                <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Enterprise</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.05] mb-4">
                Need 50M+ requests a month?<br />
                <span className="text-white/30">We build that contract.</span>
              </h3>
              <p className="text-[14px] text-white/45 leading-relaxed max-w-lg">
                Volume pricing, dedicated infrastructure, on-prem or VPC deployment, SSO/SAML, audit logs,
                and a named solutions engineer. MSA in your inbox within 48 hours.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link href="mailto:sales@venym.io" className="venym-btn-primary text-[11px] py-3 px-6 flex items-center gap-2 group">
                  Talk to Sales <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link href="/docs" className="venym-btn-secondary text-[11px] py-3 px-6">Read the docs</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: 'SOC 2 + GDPR' },
                { icon: Globe, label: 'On-prem / VPC' },
                { icon: InfinityIcon, label: 'Custom rate limits' },
                { icon: Cpu, label: 'Dedicated infra' },
                { icon: Terminal, label: 'SSO / SAML' },
                { icon: Wallet, label: 'Volume pricing' },
              ].map((c, i) => (
                <div key={i} className="border border-white/[0.06] rounded-md p-4 bg-white/[0.015]">
                  <c.icon className="h-4 w-4 text-white/50 mb-3" />
                  <div className="text-[12px] text-white/70 font-medium">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="relative px-5 py-24 md:py-28 border-t border-white/[0.06]">
        <div className="max-w-[920px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-4 w-4 text-white/30" />
            <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">FAQ // 05</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-12 max-w-2xl">
            Questions we&apos;ve already<br />
            <span className="text-white/30">heard twice.</span>
          </h2>

          <Accordion type="single" collapsible className="w-full border-t border-white/[0.06]">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/[0.06]">
                <AccordionTrigger className="text-left text-[15px] font-medium text-white/85 hover:text-white py-5 hover:no-underline">
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/25 tracking-wider tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] text-white/45 leading-relaxed pl-10 pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative px-5 py-24 md:py-32 border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 glow-radial opacity-60" />
        <div className="absolute inset-0 mesh-dots opacity-50" />

        <div className="relative max-w-[1000px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">All systems operational</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] mb-6">
            <span className="gradient-text">Pick a plan.</span><br />
            <span className="text-white/25">Ship by lunch.</span>
          </h2>
          <p className="text-white/40 text-[15px] max-w-lg mx-auto leading-relaxed mb-9">
            Three production APIs behind one key. 5,000 credits to evaluate. No card, no demo, no sales call.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="venym-btn-primary text-[11px] py-3.5 px-8 flex items-center gap-2 group">
              Start Free
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="mailto:sales@venym.io" className="venym-btn-secondary text-[11px] py-3.5 px-8">Talk to Sales</Link>
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
              <Link href="/pricing" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Pricing</Link>
              <Link href="/tools" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Free Tools</Link>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase mb-3">Company</div>
              <Link href="mailto:sales@venym.io" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Sales</Link>
              <Link href="mailto:support@venym.io" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Support</Link>
              <Link href="/legal/terms" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Terms</Link>
              <Link href="/legal/privacy" className="block text-[12px] text-white/40 hover:text-white/80 transition py-0.5">Privacy</Link>
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row gap-3 items-center justify-between text-[11px] font-mono text-white/25 tracking-wider">
            <div>© 2026 VENYM LABS · BUILT FOR DEVELOPERS</div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
