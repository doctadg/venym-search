import Link from 'next/link'
import Image from 'next/image'

const tools = [
  { title: 'JSON Formatter', href: '/tools/json-formatter', icon: 'json' },
  { title: 'URL Encoder/Decoder', href: '/tools/url-encoder', icon: 'url' },
  { title: 'Base64 Encoder/Decoder', href: '/tools/base64', icon: 'base64' },
  { title: 'JWT Decoder', href: '/tools/jwt-decode', icon: 'jwt' },
  { title: 'Regex Tester', href: '/tools/regex-tester', icon: 'regex' },
  { title: 'UUID Generator', href: '/tools/uuid-generator', icon: 'uuid' },
  { title: 'HTTP Status Codes', href: '/tools/http-status-codes', icon: 'http' },
  { title: 'Cron Generator', href: '/tools/cron-generator', icon: 'cron' },
  { title: 'User Agent Parser', href: '/tools/user-agent-parser', icon: 'ua' },
  { title: 'robots.txt Generator', href: '/tools/robots-txt-generator', icon: 'robots' },
  { title: 'Color Converter', href: '/tools/color-converter', icon: 'color' },
]

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-3 mr-8">
            <div className="w-8 h-8 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="font-bold text-xl text-[#17457c]">Venym Search</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#efa72d]/10 text-[#efa72d] font-medium border border-[#efa72d]/20">
              TOOLS
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-[#17457c] hover:bg-gray-50 rounded-lg transition-colors"
              >
                {tool.title}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <Link
              href="/tools"
              className="text-sm text-[#17457c] hover:underline"
            >
              All Tools
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto">
        {/* Breadcrumb */}
        <nav className="px-4 py-3 text-sm text-gray-500 border-b bg-white">
          <Link href="/" className="hover:text-[#17457c]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:text-[#17457c]">
            Tools
          </Link>
        </nav>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>

      {/* Footer CTA */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Free developer tools powered by{' '}
              <span className="font-semibold text-[#17457c]">Venym Search</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-sm text-[#efa72d] hover:text-[#d4911f] font-medium hover:underline"
              >
                Explore Venym Search APIs →
              </Link>
              <Link
                href="/docs"
                className="text-sm text-gray-500 hover:text-[#17457c]"
              >
                API Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
