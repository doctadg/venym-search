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
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Free Developer Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          JSON formatting, URL encoding, JWT decoding, regex testing, and more.
          No signup required. Use in your browser or integrate via API.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block rounded-xl border bg-white p-6 shadow-sm hover:shadow-md hover:border-[#efa72d]/40 transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${tool.color} shrink-0`}
              >
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#17457c] mb-1">
                  {tool.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {tool.description}
                </p>
                {tool.api && (
                  <code className="text-xs text-gray-400 font-mono">
                    POST {tool.api}
                  </code>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#efa72d] transition-colors shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* API Note */}
      <div className="mt-12 rounded-xl border bg-[#17457c]/5 p-6">
        <h3 className="text-lg font-semibold text-[#17457c] mb-2">
          Free API Access
        </h3>
        <p className="text-sm text-gray-600">
          All tools are available via free API endpoints — no authentication
          required. Each endpoint accepts a POST request with a JSON body and
          returns processed results. Perfect for AI agents, scripts, and
          automation. Check each tool page for usage examples in curl, Python,
          and JavaScript.
        </p>
      </div>
    </div>
  )
}


