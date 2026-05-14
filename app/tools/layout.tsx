import Link from 'next/link'

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
    <div className="min-h-screen bg-background text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-4 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="font-bold tracking-[0.3em] text-sm md:text-base">VENYM</span>
            <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-[0.4em] text-gray-700">
              / TOOLS
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors whitespace-nowrap"
              >
                {tool.title}
              </Link>
            ))}
          </nav>
          <Link
            href="/tools"
            className="ml-auto shrink-0 text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors"
          >
            [ ALL TOOLS ]
          </Link>
        </div>
      </header>

      <nav className="border-b border-white/5 bg-background">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">Home</Link>
          <span className="text-white/20">/</span>
          <Link href="/tools" className="text-white/40 hover:text-white transition-colors">Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {children}
      </main>

      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">
            Free dev tools // powered by <span className="text-white">VENYM</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors"
            >
              Explore the API →
            </Link>
            <Link
              href="/docs"
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
