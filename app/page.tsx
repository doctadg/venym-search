'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search, Code2, Database, Shield, ArrowRight, ChevronDown, Menu,
  Share2, GitBranch, MessageSquare, Globe, Lock, BarChart3, Sparkles,
  Terminal, Layers, ArrowUpRight, CheckCircle2, Cpu, Network,
  Boxes, Wifi,
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
  { val: 50, suffix: "M+", label: "API Calls / mo" },
] as const

const TRUSTED = ["VENYM LABS", "HYPERSWAP.AI", "TIDE.AG", "SPIDER LABS", "MROR", "VENYM26", "AUTOPILOT.IO", "GRAPHQUERY"]

const INTEGRATIONS = [
  { name: "OpenAI",     x: 90,  y: 80,  r: 6 },
  { name: "LangChain",  x: 240, y: 50,  r: 7 },
  { name: "n8n",        x: 380, y: 90,  r: 5 },
  { name: "Zapier",     x: 470, y: 180, r: 6 },
  { name: "Make",       x: 360, y: 230, r: 5 },
  { name: "Pipedream",  x: 200, y: 240, r: 6 },
  { name: "Vercel AI",  x: 60,  y: 200, r: 5 },
  { name: "Anthropic",  x: 160, y: 140, r: 6 },
]

const INT_EDGES: [number, number][] = [
  [7, 0], [7, 1], [7, 2], [7, 3], [7, 5], [7, 6], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 7], [4, 7],
]

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

const SDK_TABS = [
  {
    lang: "cURL",
    code: `curl https://api.venym.io/v1/swiftsearch \\
  -H "Authorization: Bearer $VENYM_KEY" \\
  -d '{"query":"hello world"}'`,
  },
  {
    lang: "JavaScript",
    code: `import { Venym } from "@venym/sdk";

const venym = new Venym(process.env.VENYM_KEY);
const { results } = await venym.search({
  query: "hello world",
});`,
  },
  {
    lang: "Python",
    code: `from venym import Venym

venym = Venym(api_key=os.environ["VENYM_KEY"])
results = venym.search.create(
    query="hello world"
)`,
  },
  {
    lang: "Go",
    code: `import "github.com/venym/sdk-go"

client := venym.NewClient(os.Getenv("VENYM_KEY"))
res, _ := client.Search.Create(ctx, &venym.SearchParams{
    Query: venym.String("hello world"),
})`,
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

function CountUp({ end, suffix = "", prefix = "", decimals = 0, duration = 1800 }: { end: number; suffix?: string; prefix?: string; decimals?: number; duration?: number }) {
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

/* ───────────── INLINE SVG ART ───────────── */

function SearchRadar() {
  return (
    <svg viewBox="0 0 280 280" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06060a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(180,160,255,0.0)" />
          <stop offset="80%" stopColor="rgba(180,160,255,0.5)" />
          <stop offset="100%" stopColor="rgba(220,200,255,0.95)" />
        </linearGradient>
        <radialGradient id="sweepWedge" cx="100%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(180,160,255,0.45)" />
          <stop offset="60%" stopColor="rgba(140,120,220,0.1)" />
          <stop offset="100%" stopColor="rgba(140,120,220,0)" />
        </radialGradient>
      </defs>

      <circle cx="140" cy="140" r="125" fill="url(#radarBg)" />

      {/* Concentric rings */}
      {[40, 70, 100, 125].map((r) => (
        <circle key={r} cx="140" cy="140" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}

      {/* Crosshair */}
      <line x1="15" y1="140" x2="265" y2="140" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="140" y1="15" x2="140" y2="265" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 4" />

      {/* Rotating sweep wedge */}
      <g className="radar-spin" style={{ transformOrigin: '140px 140px' }}>
        <path d="M140 140 L265 140 A125 125 0 0 0 220 52 Z" fill="url(#sweepWedge)" />
        <line x1="140" y1="140" x2="265" y2="140" stroke="url(#sweepGrad)" strokeWidth="1.5" />
      </g>

      {/* Engine result blips */}
      <g>
        <circle cx="200" cy="80"  r="2.5" fill="#c4b5fd" className="blip-a" />
        <circle cx="92"  cy="100" r="2.5" fill="#a5f3fc" className="blip-b" />
        <circle cx="76"  cy="180" r="2.5" fill="#fde68a" className="blip-c" />
        <circle cx="190" cy="200" r="2.5" fill="#bbf7d0" className="blip-d" />
        <circle cx="230" cy="160" r="2.5" fill="#fecaca" className="blip-e" />
      </g>

      {/* Center hub */}
      <circle cx="140" cy="140" r="4" fill="#fff" />
      <circle cx="140" cy="140" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="ping-soft" style={{ transformOrigin: '140px 140px' }} />

      {/* Engine labels */}
      <g fontFamily="ui-monospace, monospace" fontSize="8" fill="rgba(255,255,255,0.45)" letterSpacing="1.4">
        <text x="225" y="60">GOOGLE</text>
        <text x="36"  y="78">BING</text>
        <text x="36"  y="210">BRAVE</text>
        <text x="220" y="225">DDG</text>
      </g>
    </svg>
  )
}

function ScrapeBrowser() {
  return (
    <svg viewBox="0 0 360 240" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="jsonBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16161e" />
          <stop offset="100%" stopColor="#0a0a10" />
        </linearGradient>
      </defs>

      {/* Browser shell */}
      <rect x="14" y="14" width="220" height="200" rx="6" fill="#0c0c12" stroke="rgba(255,255,255,0.08)" />
      {/* Title bar */}
      <rect x="14" y="14" width="220" height="22" rx="6" fill="#11111a" />
      <rect x="14" y="28" width="220" height="8" fill="#11111a" />
      <circle cx="26" cy="25" r="3" fill="rgba(255,255,255,0.12)" />
      <circle cx="36" cy="25" r="3" fill="rgba(255,255,255,0.12)" />
      <circle cx="46" cy="25" r="3" fill="rgba(255,255,255,0.12)" />
      <rect x="60" y="20" width="160" height="10" rx="3" fill="#0a0a12" stroke="rgba(255,255,255,0.06)" />
      <text x="68" y="27.5" fontFamily="ui-monospace, monospace" fontSize="6.5" fill="rgba(255,255,255,0.45)">news.ycombinator.com</text>

      {/* Page content blocks (highlighted targets) */}
      <rect x="28" y="50" width="120" height="14" rx="2" fill="rgba(180,160,255,0.18)" stroke="rgba(180,160,255,0.5)" strokeDasharray="2 2" />
      <rect x="28" y="74" width="190" height="6" rx="1" fill="rgba(255,255,255,0.06)" />
      <rect x="28" y="86" width="170" height="6" rx="1" fill="rgba(255,255,255,0.06)" />

      <rect x="28" y="106" width="190" height="38" rx="2" fill="rgba(165,243,252,0.07)" stroke="rgba(165,243,252,0.45)" strokeDasharray="2 2" />
      <rect x="36" y="114" width="80" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
      <rect x="36" y="124" width="160" height="3" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x="36" y="131" width="140" height="3" rx="1" fill="rgba(255,255,255,0.18)" />

      <rect x="28" y="154" width="190" height="38" rx="2" fill="rgba(187,247,208,0.05)" stroke="rgba(187,247,208,0.35)" strokeDasharray="2 2" />
      <rect x="36" y="162" width="65" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      <rect x="36" y="172" width="160" height="3" rx="1" fill="rgba(255,255,255,0.12)" />
      <rect x="36" y="179" width="120" height="3" rx="1" fill="rgba(255,255,255,0.12)" />

      {/* Extraction lines */}
      <path d="M148 57 C 200 57 240 78 286 78" fill="none" stroke="rgba(180,160,255,0.5)" strokeWidth="1" className="flow-dash-fast" />
      <path d="M218 125 C 256 125 270 118 286 118" fill="none" stroke="rgba(165,243,252,0.45)" strokeWidth="1" className="flow-dash-fast" />
      <path d="M218 173 C 256 173 270 158 286 158" fill="none" stroke="rgba(187,247,208,0.4)" strokeWidth="1" className="flow-dash-fast" />

      {/* JSON output panel */}
      <rect x="252" y="50" width="94" height="160" rx="6" fill="url(#jsonBg)" stroke="rgba(255,255,255,0.08)" />
      <rect x="252" y="50" width="94" height="14" rx="6" fill="#13131c" />
      <text x="259" y="60" fontFamily="ui-monospace, monospace" fontSize="6" fill="rgba(255,255,255,0.45)" letterSpacing="1">JSON.OUT</text>

      <g fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="0.2">
        <text x="258" y="76"  fill="rgba(180,160,255,0.85)">title:</text>
        <text x="282" y="76"  fill="rgba(255,255,255,0.6)">"Show HN"</text>
        <text x="258" y="88"  fill="rgba(180,160,255,0.85)">url:</text>
        <text x="278" y="88"  fill="rgba(255,255,255,0.6)">"/item?id=..."</text>
        <text x="258" y="100" fill="rgba(180,160,255,0.85)">score:</text>
        <text x="287" y="100" fill="rgba(255,255,255,0.6)">312</text>
        <text x="258" y="116" fill="rgba(165,243,252,0.85)">author:</text>
        <text x="290" y="116" fill="rgba(255,255,255,0.6)">"dang"</text>
        <text x="258" y="128" fill="rgba(165,243,252,0.85)">comments:</text>
        <text x="300" y="128" fill="rgba(255,255,255,0.6)">189</text>
        <text x="258" y="144" fill="rgba(187,247,208,0.85)">tags:</text>
        <text x="278" y="144" fill="rgba(255,255,255,0.6)">[</text>
        <text x="265" y="156" fill="rgba(255,255,255,0.6)">"ai",</text>
        <text x="265" y="166" fill="rgba(255,255,255,0.6)">"ml"</text>
        <text x="265" y="176" fill="rgba(255,255,255,0.6)">]</text>
        <text x="258" y="194" fill="rgba(255,255,255,0.3)">status: 200</text>
        <text x="258" y="204" fill="rgba(255,255,255,0.3)">time: 1.82s</text>
      </g>

      {/* Scan line over browser */}
      <g style={{ transform: 'translateY(0)' }}>
        <rect x="22" y="40" width="208" height="2" fill="rgba(180,160,255,0.5)" className="scanline-y" style={{ filter: 'blur(0.5px)' }} />
      </g>
    </svg>
  )
}

function AiPipeline() {
  return (
    <svg viewBox="0 0 440 160" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a26" />
          <stop offset="100%" stopColor="#0a0a12" />
        </linearGradient>
        <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(180,160,255,0.6)" />
          <stop offset="100%" stopColor="rgba(180,160,255,0)" />
        </radialGradient>
      </defs>

      {/* Connecting flow lines */}
      <path d="M70 80 L 150 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M70 80 L 150 80" stroke="rgba(180,160,255,0.8)" strokeWidth="1.5" className="flow-dash-fast" />

      <path d="M210 80 L 290 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M210 80 L 290 80" stroke="rgba(165,243,252,0.7)" strokeWidth="1.5" className="flow-dash-fast" style={{ animationDelay: '0.6s' }} />

      <path d="M350 80 L 430 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M350 80 L 430 80" stroke="rgba(187,247,208,0.7)" strokeWidth="1.5" className="flow-dash-fast" style={{ animationDelay: '1.2s' }} />

      {/* Node 1: Search */}
      <g>
        <rect x="10" y="50" width="60" height="60" rx="10" fill="url(#nodeGrad)" stroke="rgba(180,160,255,0.35)" />
        <circle cx="38" cy="76" r="9" fill="none" stroke="rgba(180,160,255,0.85)" strokeWidth="1.5" />
        <line x1="45" y1="83" x2="51" y2="89" stroke="rgba(180,160,255,0.85)" strokeWidth="1.5" strokeLinecap="round" />
        <text x="40" y="103" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.55)" letterSpacing="1">SEARCH</text>
      </g>

      {/* Node 2: Scrape */}
      <g>
        <rect x="150" y="50" width="60" height="60" rx="10" fill="url(#nodeGrad)" stroke="rgba(165,243,252,0.35)" />
        <rect x="166" y="64" width="28" height="22" rx="2" fill="none" stroke="rgba(165,243,252,0.85)" strokeWidth="1.5" />
        <line x1="170" y1="70" x2="190" y2="70" stroke="rgba(165,243,252,0.85)" strokeWidth="1" />
        <line x1="170" y1="76" x2="184" y2="76" stroke="rgba(165,243,252,0.5)" strokeWidth="1" />
        <line x1="170" y1="81" x2="188" y2="81" stroke="rgba(165,243,252,0.5)" strokeWidth="1" />
        <text x="180" y="103" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.55)" letterSpacing="1">SCRAPE</text>
      </g>

      {/* Node 3: Brain / AI */}
      <g>
        <circle cx="320" cy="80" r="36" fill="url(#brainGlow)" opacity="0.6" />
        <rect x="290" y="50" width="60" height="60" rx="14" fill="url(#nodeGrad)" stroke="rgba(220,180,255,0.4)" />
        {/* Brain — overlapping arcs */}
        <path d="M306 72 C 306 64, 320 60, 322 70 C 324 60, 338 64, 338 72 C 338 78, 332 82, 326 82 L 322 88 L 318 82 C 312 82, 306 78, 306 72 Z" fill="none" stroke="rgba(220,180,255,0.85)" strokeWidth="1.4" />
        <line x1="322" y1="62" x2="322" y2="90" stroke="rgba(220,180,255,0.4)" strokeWidth="1" />
        <circle cx="310" cy="72" r="1.2" fill="rgba(220,180,255,0.85)" />
        <circle cx="334" cy="72" r="1.2" fill="rgba(220,180,255,0.85)" />
        <text x="320" y="103" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.55)" letterSpacing="1">SYNTHESIZE</text>
      </g>

      {/* Node 4: Output JSON */}
      <g>
        <rect x="378" y="50" width="56" height="60" rx="10" fill="url(#nodeGrad)" stroke="rgba(187,247,208,0.35)" />
        <text x="406" y="75" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="rgba(187,247,208,0.85)">{'{ }'}</text>
        <line x1="386" y1="84" x2="426" y2="84" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="386" y1="89" x2="418" y2="89" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="406" y="103" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.55)" letterSpacing="1">OUTPUT</text>
      </g>

      {/* Step labels above */}
      <g fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.25)" letterSpacing="1.5">
        <text x="40"  y="32" textAnchor="middle">01</text>
        <text x="180" y="32" textAnchor="middle">02</text>
        <text x="320" y="32" textAnchor="middle">03</text>
        <text x="406" y="32" textAnchor="middle">04</text>
      </g>
    </svg>
  )
}

function ConstellationGraph() {
  return (
    <svg viewBox="0 0 540 320" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(180,160,255,0.6)" />
          <stop offset="100%" stopColor="rgba(180,160,255,0)" />
        </radialGradient>
      </defs>

      {/* Background grid */}
      <g opacity="0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="320" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="540" y2={i * 60} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        ))}
      </g>

      {/* Edges */}
      {INT_EDGES.map(([a, b], i) => {
        const A = INTEGRATIONS[a]
        const B = INTEGRATIONS[b]
        return (
          <line
            key={i}
            x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
          />
        )
      })}

      {/* Animated flow edges (outbound from hub at index 7) */}
      {[0, 1, 2, 3, 5, 6].map((i) => {
        const A = INTEGRATIONS[7]
        const B = INTEGRATIONS[i]
        return (
          <line
            key={`f${i}`}
            x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke="rgba(180,160,255,0.5)"
            strokeWidth="1"
            className="flow-dash"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        )
      })}

      {/* Central VENYM hub */}
      <circle cx={INTEGRATIONS[7].x + 90} cy={INTEGRATIONS[7].y + 20} r="80" fill="url(#hubGlow)" opacity="0.5" className="glow-pulse" />

      {/* Nodes */}
      {INTEGRATIONS.map((n, i) => (
        <g key={n.name}>
          <circle cx={n.x} cy={n.y} r={n.r + 8} fill="none" stroke="rgba(255,255,255,0.08)" />
          <circle cx={n.x} cy={n.y} r={n.r} fill="rgba(180,160,255,0.15)" stroke="rgba(180,160,255,0.6)" strokeWidth="1.2" className="constellation-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
          <text
            x={n.x + (n.x > 270 ? -10 : 10)}
            y={n.y + 4}
            textAnchor={n.x > 270 ? "end" : "start"}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="rgba(255,255,255,0.7)"
            letterSpacing="1"
          >
            {n.name}
          </text>
        </g>
      ))}

      {/* Central VENYM marker (overlaps integration index 7 position) */}
      <g>
        <circle cx="270" cy="160" r="22" fill="rgba(10,10,16,0.95)" stroke="rgba(255,255,255,0.25)" />
        <circle cx="270" cy="160" r="28" fill="none" stroke="rgba(180,160,255,0.35)" strokeDasharray="2 4" className="orbit-ring" style={{ transformOrigin: '270px 160px' }} />
        <text x="270" y="164" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#fff" letterSpacing="2" fontWeight="700">VENYM</text>
      </g>
    </svg>
  )
}

function Waveform() {
  return (
    <svg viewBox="0 0 320 100" className="w-full h-full" aria-hidden preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(180,160,255,0)" />
          <stop offset="20%" stopColor="rgba(180,160,255,0.7)" />
          <stop offset="80%" stopColor="rgba(165,243,252,0.7)" />
          <stop offset="100%" stopColor="rgba(165,243,252,0)" />
        </linearGradient>
      </defs>
      <g className="wave-shift">
        <path d="M0,50 Q20,30 40,50 T80,50 T120,50 T160,50 T200,50 T240,50 T280,50 T320,50 T360,50 T400,50 T440,50 T480,50" fill="none" stroke="url(#waveStroke)" strokeWidth="1.5" />
        <path d="M0,50 Q20,70 40,50 T80,50 T120,50 T160,50 T200,50 T240,50 T280,50 T320,50 T360,50 T400,50 T440,50 T480,50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </g>
      <g className="wave-shift" style={{ animationDuration: '12s', animationDirection: 'reverse' as const }}>
        <path d="M0,55 Q15,38 30,55 T60,55 T90,55 T120,55 T150,55 T180,55 T210,55 T240,55 T270,55 T300,55 T330,55 T360,55 T390,55 T420,55 T450,55 T480,55" fill="none" stroke="rgba(180,160,255,0.18)" strokeWidth="1" />
      </g>
      {/* Tick markers */}
      <g fontFamily="ui-monospace, monospace" fontSize="6" fill="rgba(255,255,255,0.25)">
        {[40, 100, 160, 220, 280].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="86" x2={x} y2="92" stroke="rgba(255,255,255,0.12)" />
            <text x={x} y="98" textAnchor="middle">{12 - i * 2}s</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function DashboardMini() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(180,160,255,0.4)" />
          <stop offset="100%" stopColor="rgba(180,160,255,0)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="320" height="220" rx="10" fill="rgba(10,10,16,0.5)" stroke="rgba(255,255,255,0.06)" />

      {/* Header */}
      <text x="16" y="22" fontFamily="ui-monospace, monospace" fontSize="8" fill="rgba(255,255,255,0.4)" letterSpacing="2">VENYM // LIVE</text>
      <circle cx="295" cy="18" r="3" fill="#34d399">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x="280" y="22" textAnchor="end" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(52,211,153,0.7)" letterSpacing="1.5">200 OK</text>

      <line x1="0" y1="34" x2="320" y2="34" stroke="rgba(255,255,255,0.06)" />

      {/* Big number */}
      <text x="16" y="78" fontFamily="ui-monospace, monospace" fontSize="36" fill="#fff" fontWeight="700" letterSpacing="-1">1,247</text>
      <text x="16" y="94" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.4)" letterSpacing="2">REQ / MIN</text>

      {/* Sparkline */}
      <g transform="translate(160, 50)">
        <path d="M0,30 L 15,22 L 30,28 L 45,12 L 60,18 L 75,8 L 90,15 L 105,4 L 120,12 L 135,2 L 150,8 L 150,40 L 0,40 Z" fill="url(#sparkFill)" />
        <path d="M0,30 L 15,22 L 30,28 L 45,12 L 60,18 L 75,8 L 90,15 L 105,4 L 120,12 L 135,2 L 150,8" fill="none" stroke="rgba(180,160,255,0.9)" strokeWidth="1.2" />
        <circle cx="150" cy="8" r="3" fill="#fff">
          <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,0.06)" />

      {/* Bars */}
      <g transform="translate(16, 124)">
        <text x="0" y="-2" fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.4)" letterSpacing="1.5">ENGINE LATENCY (ms)</text>
        {[
          { l: "google", v: 0.85, c: "rgba(180,160,255,0.7)" },
          { l: "bing",   v: 0.65, c: "rgba(165,243,252,0.6)" },
          { l: "brave",  v: 0.45, c: "rgba(187,247,208,0.6)" },
          { l: "ddg",    v: 0.55, c: "rgba(253,230,138,0.6)" },
          { l: "yahoo",  v: 0.3,  c: "rgba(255,255,255,0.3)" },
        ].map((b, i) => (
          <g key={b.l} transform={`translate(${i * 58}, 8)`}>
            <rect
              x="0" y={60 * (1 - b.v)}
              width="40" height={60 * b.v}
              fill={b.c}
              className="bar-rise"
              style={{ ['--from' as string]: '0.4', ['--to' as string]: '1', animationDelay: `${i * 0.2}s` }}
            />
            <text x="20" y="76" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6.5" fill="rgba(255,255,255,0.4)">{b.l}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function GlobeArc() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#16161e" />
          <stop offset="100%" stopColor="#08080c" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="78" fill="url(#globeGrad)" stroke="rgba(255,255,255,0.1)" />
      {/* Latitude lines */}
      {[35, 55, 78, 100, 122, 145, 165].map((y, i) => {
        const r = Math.sqrt(78 * 78 - (y - 100) * (y - 100))
        return r > 0 ? (
          <ellipse key={i} cx="100" cy={y} rx={r} ry={r * 0.18} fill="none" stroke="rgba(180,160,255,0.12)" strokeWidth="1" />
        ) : null
      })}
      {/* Longitude curves */}
      {[-50, -25, 0, 25, 50].map((tilt, i) => (
        <ellipse key={i} cx="100" cy="100" rx="78" ry="22" fill="none" stroke="rgba(180,160,255,0.1)" strokeWidth="1" transform={`rotate(${tilt} 100 100)`} />
      ))}
      {/* Region dots */}
      {[
        { x: 70, y: 80, l: "fra1" },
        { x: 50, y: 110, l: "iad1" },
        { x: 130, y: 90, l: "sin1" },
        { x: 145, y: 135, l: "syd1" },
        { x: 90, y: 65, l: "lhr1" },
      ].map((p) => (
        <g key={p.l}>
          <circle cx={p.x} cy={p.y} r="2.5" fill="#34d399" />
          <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="#34d399" strokeOpacity="0.4" className="ping-soft" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        </g>
      ))}
      {/* Arc trajectory */}
      <path d="M50 110 Q 100 30 145 135" fill="none" stroke="rgba(180,160,255,0.6)" strokeWidth="1" strokeDasharray="3 4" className="flow-dash-fast" />
    </svg>
  )
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
        className="absolute -top-7 -right-4 md:-right-12 z-20 hidden sm:block float-card"
        style={{ ['--rot' as string]: '4deg', animationDelay: '0.3s' }}
      >
        <div className="bg-[#0d0d10]/95 backdrop-blur-md border border-white/10 rounded-md px-3 py-2.5 shadow-2xl shadow-black/60 w-[210px]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">200 OK</span>
            <span className="text-[9px] font-mono text-white/30 ml-auto">1.2s</span>
          </div>
          <div className="text-[10px] font-mono text-white/60">8 engines · 47 results merged</div>
          <div className="mt-2 h-[3px] w-full bg-white/[0.05] rounded overflow-hidden">
            <div className="h-full w-[78%] bg-gradient-to-r from-violet-400/70 to-cyan-400/70" />
          </div>
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

      {/* Background dashboard mini behind terminal */}
      <div className="absolute -right-20 -bottom-16 w-[260px] hidden lg:block opacity-50 pointer-events-none">
        <DashboardMini />
      </div>

      {/* Terminal card with linear-style rotating border */}
      <div className="relative linear-border">
        <div className="bg-[#08080a] rounded-xl overflow-hidden shadow-2xl shadow-black/60">
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
      </div>

      {/* API selector dots */}
      <div className="flex items-center justify-center gap-3 mt-5">
        {TERMINAL_EXAMPLES.map((ex, i) => (
          <button
            key={ex.api}
            onClick={() => { setIdx(i); setTyped(""); setPhase("typing") }}
            className="group flex items-center gap-2 transition"
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

/* ───────────── SDK CODE TABS ───────────── */

function SdkTabs() {
  const [active, setActive] = useState(0)
  const c = SDK_TABS[active]
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 mb-3">
        {SDK_TABS.map((t, i) => (
          <button
            key={t.lang}
            onClick={() => setActive(i)}
            className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-sm transition ${
              i === active ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {t.lang}
          </button>
        ))}
      </div>
      <pre className="flex-1 font-mono text-[11px] leading-relaxed text-white/60 bg-[#070710] border border-white/[0.04] rounded-md p-3 overflow-x-auto whitespace-pre">
        <code>{c.code}</code>
      </pre>
    </div>
  )
}

/* ───────────── PAGE ───────────── */

export default function VenymSearchLanding() {
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // mouse-tracked glow for bento cards
  const handleBentoMouse = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/[0.06] bg-[#050505]/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}>
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
            <Link href="/status" className="text-[11px] font-medium text-white/50 hover:text-white transition tracking-wide flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Status
            </Link>
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
        <div className="absolute top-20 -left-20 w-[420px] h-[420px] rounded-full bg-violet-500/10 blur-[120px] glow-pulse" />
        <div className="absolute top-40 right-0 w-[360px] h-[360px] rounded-full bg-cyan-500/8 blur-[120px] glow-pulse" style={{ animationDelay: '2s' }} />

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
                <Link href="/signup" className="venym-btn-primary cta-glow text-[11px] py-3 px-6 flex items-center justify-center gap-2 group">
                  Start Free
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/docs/quickstart" className="venym-btn-secondary text-[11px] py-3 px-6 flex items-center justify-center gap-2">
                  <Terminal className="h-3.5 w-3.5 opacity-50" /> View Documentation
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
        <div className="relative border-y border-white/[0.06] bg-[#070707]/60 backdrop-blur overflow-hidden marquee-fade">
          <div className="flex items-center gap-3 py-5 whitespace-nowrap">
            <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase shrink-0 px-5">Trusted by 10,000+ developers at</span>
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
              className={`relative py-10 px-6 ${i < 3 ? 'md:border-r' : ''} ${i < 2 ? 'border-r border-b md:border-b-0' : 'border-b md:border-b-0'} border-white/[0.06] group hover:bg-white/[0.015] transition`}
            >
              <div className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight tabular-nums">
                <CountUp end={s.val} suffix={s.suffix} prefix={'prefix' in s ? s.prefix : ''} decimals={'decimals' in s ? s.decimals : 0} />
              </div>
              <div className="text-[10px] text-white/30 mt-2 tracking-[0.2em] uppercase font-mono">{s.label}</div>
              <div className="absolute top-3 right-3 text-[9px] font-mono text-white/15">[{String(i + 1).padStart(2, '0')}]</div>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet-400/60 to-cyan-400/60 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS — BESPOKE PER-PRODUCT ─── */}
      <section className="py-24 md:py-32 px-5 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
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

          {/* SWIFTSEARCH — large feature, radar SVG */}
          <Link
            href="/products/swiftsearch"
            onMouseMove={handleBentoMouse}
            className="bento-card bento-card-lg group relative grid lg:grid-cols-[1fr_1fr] rounded-xl overflow-hidden mb-4"
          >
            <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-[360px]">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-mono text-violet-300/70 tracking-[0.25em] uppercase">SwiftSearch · 2 cr/req</span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-[1.05]">
                  Eight engines.<br />
                  <span className="text-white/40">One ranked feed.</span>
                </h3>
                <p className="text-[14px] text-white/45 leading-relaxed max-w-md">
                  Query Google, Bing, Brave, DuckDuckGo, Yahoo, Mojeek, Ecosia, and Qwant in parallel.
                  Deduplicated, re-ranked, and returned in under 2 seconds.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["google", "bing", "brave", "ddg", "yahoo", "mojeek", "ecosia", "qwant"].map(eng => (
                    <span key={eng} className="text-[10px] font-mono text-white/40 px-2 py-1 border border-white/[0.06] rounded bg-white/[0.02]">
                      {eng}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-white/60 group-hover:text-white transition">
                  Explore SwiftSearch
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-auto bg-gradient-to-br from-violet-500/5 to-transparent border-t lg:border-t-0 lg:border-l border-white/[0.04]">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-[340px] aspect-square">
                  <SearchRadar />
                </div>
              </div>
              <div className="absolute top-4 right-4 text-[9px] font-mono text-white/25 tracking-[0.3em]">FIG · 01 / RADAR</div>
            </div>
          </Link>

          {/* SCRAPEFORGE + DEEPDIVE — two-up */}
          <div className="grid lg:grid-cols-2 gap-4">
            <Link
              href="/products/scrapeforge"
              onMouseMove={handleBentoMouse}
              className="bento-card group relative rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative h-[220px] bg-gradient-to-br from-cyan-400/5 to-transparent border-b border-white/[0.04]">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-[400px]">
                    <ScrapeBrowser />
                  </div>
                </div>
                <div className="absolute top-3 right-4 text-[9px] font-mono text-white/25 tracking-[0.3em]">FIG · 02 / SCRAPE</div>
              </div>
              <div className="p-7 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono text-cyan-300/60 tracking-[0.25em] uppercase">ScrapeForge · 5 cr/req</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3">Render anything.</h3>
                <p className="text-[13px] text-white/45 leading-relaxed mb-6">
                  Headless browsers, residential proxies, CAPTCHA bypass, and intelligent extraction.
                  Returns markdown, HTML, or structured JSON.
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-white/60 group-hover:text-white transition">
                  Explore ScrapeForge
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </Link>

            <Link
              href="/products/deepdive"
              onMouseMove={handleBentoMouse}
              className="bento-card group relative rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative h-[220px] bg-gradient-to-br from-emerald-400/5 to-transparent border-b border-white/[0.04]">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-[420px]">
                    <AiPipeline />
                  </div>
                </div>
                <div className="absolute top-3 right-4 text-[9px] font-mono text-white/25 tracking-[0.3em]">FIG · 03 / PIPELINE</div>
              </div>
              <div className="p-7 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono text-emerald-300/60 tracking-[0.25em] uppercase">DeepDive · 10 cr/req</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3">Research, in one call.</h3>
                <p className="text-[13px] text-white/45 leading-relaxed mb-6">
                  Search the web, scrape the top 20 sources, and synthesize a cited report with AI.
                  Structured output, ready for your agents.
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-white/60 group-hover:text-white transition">
                  Explore DeepDive
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LIVE DEMO ─── */}
      <section className="py-24 md:py-32 px-5 border-t border-white/[0.06] relative">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-[1100px] mx-auto">
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

          {/* Demo frame — terminal chrome */}
          <div className="relative" style={{ perspective: '1200px' }}>
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 via-white/[0.02] to-violet-500/10 pointer-events-none" />
            <div
              className="relative bg-[#08080a] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
              style={{ transform: 'rotateX(0.6deg)', transformOrigin: 'top' }}
            >
              {/* Terminal chrome */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0d]">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] font-mono text-white/40 tracking-wider">venym.io / sandbox</div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-400/80 tracking-wider">SANDBOX</span>
                </div>
              </div>
              <div className="p-4 md:p-8">
                <ApiDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES BENTO ─── */}
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

          <div className="grid md:grid-cols-6 gap-4 auto-rows-[140px]">
            {/* Real-time waveform — big */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-4 md:row-span-2 rounded-xl p-7 overflow-hidden flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mb-2">Real-time activity</div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">Sub-second latency, globally.</h3>
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[01]</span>
              </div>
              <p className="text-[13px] text-white/40 leading-relaxed max-w-md mb-6">
                Edge-deployed across 12 regions. Cold start under 50ms, P99 response under 2 seconds.
              </p>
              <div className="flex-1 -mx-2 -mb-2 flex items-end">
                <div className="w-full h-[110px]">
                  <Waveform />
                </div>
              </div>
            </div>

            {/* Uptime live indicator */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-2 rounded-xl p-7 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Wifi className="h-[18px] w-[18px] text-emerald-400/80" />
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[02]</span>
              </div>
              <div className="text-[28px] font-bold tracking-tight tabular-nums">
                <CountUp end={99.99} suffix="%" decimals={2} />
              </div>
              <div className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-mono mt-1">90-day uptime</div>
              <div className="mt-4 flex gap-[2px]">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="h-3 flex-1 rounded-[1px] bg-emerald-500/50" style={{ opacity: i === 14 ? 0.35 : 0.5 + (i % 3) * 0.15 }} />
                ))}
              </div>
            </div>

            {/* Anti-bot */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-2 rounded-xl p-7 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Lock className="h-[18px] w-[18px] text-white/60" />
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[03]</span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight mb-2">Anti-bot defeated.</h3>
              <p className="text-[12px] text-white/40 leading-relaxed mb-3">Cloudflare, Akamai, PerimeterX, DataDome.</p>
              <div className="flex flex-wrap gap-1">
                {["CF", "AKM", "PX", "DD", "SHIELD"].map(t => (
                  <span key={t} className="text-[9px] font-mono text-white/35 px-1.5 py-0.5 border border-white/[0.06] rounded bg-white/[0.02]">{t}</span>
                ))}
              </div>
            </div>

            {/* Edge regions — globe */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-2 md:row-span-2 rounded-xl p-7 overflow-hidden flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Globe className="h-[18px] w-[18px] text-white/60" />
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[04]</span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight mb-2">12 edge regions.</h3>
              <p className="text-[12px] text-white/40 leading-relaxed mb-4">Closest POP routing. Always.</p>
              <div className="flex-1 -mx-2 flex items-center justify-center">
                <div className="w-full aspect-square max-w-[200px]">
                  <GlobeArc />
                </div>
              </div>
            </div>

            {/* SDK Tabs */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-4 md:row-span-2 rounded-xl p-7 overflow-hidden flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mb-2">SDKs · Any language</div>
                  <h3 className="text-xl font-bold tracking-tight">Built for the stack you already use.</h3>
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[05]</span>
              </div>
              <div className="flex-1 mt-4 min-h-0">
                <SdkTabs />
              </div>
            </div>

            {/* Credit billing */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-2 rounded-xl p-7 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <BarChart3 className="h-[18px] w-[18px] text-white/60" />
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[06]</span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight mb-2">Credit billing.</h3>
              <p className="text-[12px] text-white/40 leading-relaxed">Pay per request. No minimums. No overage surprises.</p>
              <div className="flex items-baseline gap-2 mt-3 font-mono">
                <span className="text-2xl text-white tabular-nums">5,000</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">free credits</span>
              </div>
            </div>

            {/* SOC2 / Security */}
            <div onMouseMove={handleBentoMouse} className="bento-card relative md:col-span-2 rounded-xl p-7 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Shield className="h-[18px] w-[18px] text-white/60" />
                </div>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em]">[07]</span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight mb-2">SOC 2 Type II.</h3>
              <p className="text-[12px] text-white/40 leading-relaxed mb-3">Enterprise-grade keys, audit logs, SSO/SAML.</p>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-emerald-400/80 px-2 py-0.5 border border-emerald-400/30 rounded">SOC 2</span>
                <span className="text-[9px] font-mono text-white/40 px-2 py-0.5 border border-white/10 rounded">GDPR</span>
                <span className="text-[9px] font-mono text-white/40 px-2 py-0.5 border border-white/10 rounded">CCPA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS / ECOSYSTEM ─── */}
      <section className="py-24 md:py-32 px-5 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Network className="h-4 w-4 text-white/30" />
                <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Ecosystem // 06</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-6">
                Plays nicely<br />
                <span className="text-white/30">with everything.</span>
              </h2>
              <p className="text-[14px] md:text-[15px] text-white/45 leading-relaxed max-w-md mb-8">
                Drop Venym into your existing stack. Native integrations for AI frameworks,
                automation platforms, and BYO LLM workflows.
              </p>

              <div className="grid grid-cols-2 gap-2 max-w-md mb-8">
                {INTEGRATIONS.map((i) => (
                  <div key={i.name} className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-white/[0.05] bg-white/[0.015]">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
                    <span className="text-[12px] font-mono text-white/60">{i.name}</span>
                  </div>
                ))}
              </div>

              <Link href="/integrations" className="group inline-flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition">
                Browse all integrations
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
              <div className="relative bg-[#08080a]/70 border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase">network.graph</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400/70 tracking-[0.25em]">8 NODES · 14 EDGES</span>
                </div>
                <div className="aspect-[5/3] w-full">
                  <ConstellationGraph />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING TEASER ─── */}
      <section className="py-20 md:py-28 px-5 border-t border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Boxes className="h-4 w-4 text-white/30" />
                <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Pricing // 07</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.05]">
                Start free. <span className="text-white/30">Scale infinitely.</span>
              </h2>
            </div>
            <Link href="/pricing" className="group inline-flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white transition">
              View all plans
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {[
              { tier: "FREE", credits: "5,000", note: "/mo", label: "Hobby projects", highlight: false },
              { tier: "PRO", credits: "$0.001", note: "/credit", label: "Production apps", highlight: true },
              { tier: "ENTERPRISE", credits: "Custom", note: "", label: "Volume & SSO", highlight: false },
            ].map((p) => (
              <div
                key={p.tier}
                className={`relative rounded-xl p-6 border ${p.highlight ? 'border-white/[0.14] bg-white/[0.025]' : 'border-white/[0.06] bg-[#0a0a0c]'} transition`}
              >
                {p.highlight && (
                  <div className="absolute -top-2 right-4 text-[9px] font-mono uppercase tracking-[0.25em] bg-white text-black px-2 py-0.5 rounded-sm">
                    Recommended
                  </div>
                )}
                <div className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase mb-3">{p.tier}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold tracking-tight">{p.credits}</span>
                  {p.note && <span className="text-[12px] text-white/40 font-mono">{p.note}</span>}
                </div>
                <div className="text-[12px] text-white/50">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-36 px-5 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 glow-radial opacity-60" />
        <div className="absolute inset-0 mesh-dots opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[140px] glow-pulse pointer-events-none" />

        <div className="relative max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
              <Sparkles className="h-3 w-3 text-white/60" />
              <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">The internet is your database</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="gradient-text">Query the web.</span><br />
              <span className="text-white/25">Like an API.</span>
            </h2>
            <p className="text-white/40 text-[15px] max-w-lg mx-auto leading-relaxed">
              5,000 free credits. No credit card. Full access to SwiftSearch, ScrapeForge, and DeepDive on day one.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/signup" className="venym-btn-primary cta-glow text-[11px] py-3.5 px-8 flex items-center gap-2 group">
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
