import type { Metadata } from 'next'
import Link from 'next/link'
import {

  Braces,
  Link2,
  Lock,
  KeyRound,
  ArrowRight,
  Hash,
  Fingerprint,
  Globe,
  Clock,
  MonitorSmartphone,
  FileCode,
  Palette,
} from 'lucide-react'


export const metadata: Metadata = {
  title: 'Free Developer Tools - JSON, Base64, Regex, UUID & More | Venym Search',
  description:
    '11 free online developer tools: JSON formatter, URL encoder, Base64 converter, JWT decoder, regex tester, UUID generator, and more. No signup required. Use in browser or via API.',
  openGraph: {
    title: 'Free Developer Tools - JSON, Base64, Regex, UUID & More | Venym Search',
    description:
      '11 free online developer tools: JSON formatter, URL encoder, Base64 converter, JWT decoder, regex tester, UUID generator, and more. No signup required.',
    type: 'website',
  },
}

const tools = [
  {
    title: 'JSON Formatter & Validator',
    description:
      'Format, validate, and analyze JSON with smart auto-fix for common issues. Sort keys, adjust indentation, and get detailed stats.',
    href: '/tools/json-formatter',
    icon: Braces,
    color: 'text-blue-600 bg-blue-50',
    api: '/api/v1/tools/json-format',
  },
  {
    title: 'URL Encoder / Decoder',
    description:
      'Encode or decode URLs and query parameters with full component breakdown. Supports encodeURIComponent and decodeURIComponent.',
    href: '/tools/url-encoder',
    icon: Link2,
    color: 'text-green-600 bg-green-50',
    api: '/api/v1/tools/url-encode',
  },
  {
    title: 'Base64 Encoder / Decoder',
    description:
      'Encode or decode Base64 in standard or URL-safe variants. Perfect for data URIs, JWTs, and binary-safe text encoding.',
    href: '/tools/base64',
    icon: Lock,
    color: 'text-purple-600 bg-purple-50',
    api: '/api/v1/tools/base64',
  },
  {
    title: 'JWT Decoder',
    description:
      'Decode and inspect JSON Web Tokens instantly. View header, payload, signature, expiration status, and registered claims.',
    href: '/tools/jwt-decode',
    icon: KeyRound,
    color: 'text-orange-600 bg-orange-50',
    api: '/api/v1/tools/jwt-decode',
  },
  {
    title: 'Regex Tester',
    description:
      'Test regular expressions with real-time match highlighting, group capture display, and flag configuration.',
    href: '/tools/regex-tester',
    icon: Hash,
    color: 'text-red-600 bg-red-50',
    api: '/api/v1/tools/regex-test',
  },
  {
    title: 'UUID / GUID Generator',
    description:
      'Generate UUIDs v4 and v7. Bulk generation up to 100, uppercase/lowercase, with or without dashes.',
    href: '/tools/uuid-generator',
    icon: Fingerprint,
    color: 'text-cyan-600 bg-cyan-50',
    api: '/api/v1/tools/uuid-generate',
  },
  {
    title: 'HTTP Status Codes Reference',
    description:
      'Complete reference for all HTTP status codes with descriptions, common causes, and troubleshooting tips.',
    href: '/tools/http-status-codes',
    icon: Globe,
    color: 'text-emerald-600 bg-emerald-50',
    api: null,
  },
  {
    title: 'Cron Expression Generator',
    description:
      'Generate and explain cron expressions with human-readable descriptions and next run time previews.',
    href: '/tools/cron-generator',
    icon: Clock,
    color: 'text-indigo-600 bg-indigo-50',
    api: '/api/v1/tools/cron-explain',
  },
  {
    title: 'User Agent Parser',
    description:
      'Parse any user agent string to extract browser, OS, device type, and rendering engine. Detects bots and mobile devices.',
    href: '/tools/user-agent-parser',
    icon: MonitorSmartphone,
    color: 'text-amber-600 bg-amber-50',
    api: '/api/v1/tools/parse-user-agent',
  },
  {
    title: 'robots.txt Generator & Tester',
    description:
      'Generate robots.txt files with rule builder and presets. Test if URLs are allowed or blocked by any robots.txt.',
    href: '/tools/robots-txt-generator',
    icon: FileCode,
    color: 'text-teal-600 bg-teal-50',
    api: '/api/v1/tools/robots-txt-generate',
  },
  {
    title: 'Color Picker & Converter',
    description:
      'Convert colors between HEX, RGB, HSL formats. Generate palettes and check WCAG contrast ratios for accessibility.',
    href: '/tools/color-converter',
    icon: Palette,
    color: 'text-pink-600 bg-pink-50',
    api: '/api/v1/tools/color-convert',
  },
]

export default function ToolsPage() {
  return (
    <div>
      <div className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-white/20" />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">
            Free Dev Tools // 00
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-medium leading-[0.9] tracking-tighter mb-5">
          Eleven dev tools. <br />
          <span className="text-gray-700 italic font-light">Free, in-browser, API-callable.</span>
        </h1>
        <p className="text-gray-400 font-sans font-light text-base md:text-lg max-w-2xl leading-relaxed">
          JSON, URL, Base64, JWT, regex, UUID, cron, user-agent, robots.txt, color.
          Use in browser, or POST to the API from your agent.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 p-5 md:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 border border-white/5 bg-white/[0.02] shrink-0">
                <tool.icon className="w-5 h-5 text-white/60" strokeWidth={1.25} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-display font-medium text-white tracking-tight mb-2">
                  {tool.title}
                </h2>
                <p className="text-sm font-sans font-light text-gray-400 leading-relaxed mb-3">
                  {tool.description}
                </p>
                {tool.api && (
                  <code className="text-[10px] text-white/40 font-mono tracking-wider block truncate">
                    POST {tool.api}
                  </code>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/70 transition-colors shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 md:mt-16 border border-white/5 bg-white/[0.01] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">
            Free API Access
          </span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
        <p className="text-sm md:text-base font-sans font-light text-gray-400 leading-relaxed">
          Every tool is also a free API endpoint — no auth required. POST a JSON
          body, get processed output. Perfect for piping into AI agent toolchains.
          See each tool page for curl, Python, and TypeScript examples.
        </p>
      </div>
    </div>
  )
}


