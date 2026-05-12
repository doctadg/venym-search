'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  BookOpen,
  Code2,
  Database,
  Puzzle,
  Rocket,
  Settings,
  ArrowUpRight,
  Command,
} from 'lucide-react'
import { CopyMarkdownButton } from './components/CopyMarkdownButton'

interface NavigationItem {
  title: string
  href?: string
  icon?: any
  badge?: string
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  {
    title: 'Getting Started',
    icon: Rocket,
    children: [
      { title: 'Welcome', href: '/docs' },
      { title: 'Quickstart', href: '/docs/quickstart', badge: '5 MIN' },
      { title: 'Authentication', href: '/docs/authentication' },
      { title: 'Rate Limits', href: '/docs/rate-limits' },
      { title: 'Error Handling', href: '/docs/errors' },
    ],
  },
  {
    title: 'API Reference',
    icon: Code2,
    children: [
      {
        title: 'Search',
        href: '/docs/api/search',
        children: [
          { title: 'Overview', href: '/docs/api/search' },
          { title: 'Parameters', href: '/docs/api/search/parameters' },
          { title: 'Examples', href: '/docs/api/search/examples' },
        ],
      },
      {
        title: 'Scrape',
        href: '/docs/api/scrape',
        children: [
          { title: 'Overview', href: '/docs/api/scrape' },
          { title: 'Parameters', href: '/docs/api/scrape/parameters' },
          { title: 'Examples', href: '/docs/api/scrape/examples' },
        ],
      },
      {
        children: [
        ],
      },
    ],
  },
  {
    title: 'SDKs & Libraries',
    icon: Database,
    children: [
      { title: 'Python', href: '/docs/sdks/python', badge: 'POPULAR' },
      { title: 'JavaScript / Node', href: '/docs/sdks/javascript' },
      { title: 'Go', href: '/docs/sdks/go' },
      { title: 'PHP', href: '/docs/sdks/php' },
      { title: 'REST API', href: '/docs/sdks/rest' },
    ],
  },
  {
    title: 'Integrations',
    icon: Puzzle,
    children: [
      { title: 'OpenClaw', href: '/docs/integrations/openclaw', badge: 'NEW' },
      { title: 'Model Context Protocol', href: '/docs/integrations/mcp', badge: 'NEW' },
      { title: 'LangChain', href: '/docs/integrations/langchain' },
      { title: 'OpenAI Assistants', href: '/docs/integrations/openai-assistants' },
      { title: 'n8n', href: '/docs/integrations/n8n' },
      { title: 'Zapier', href: '/docs/integrations/zapier' },
      { title: 'Make.com', href: '/docs/integrations/make' },
      { title: 'Pipedream', href: '/docs/integrations/pipedream' },
      { title: 'Power Automate', href: '/docs/integrations/power-automate' },
    ],
  },
  {
    title: 'Guides',
    icon: BookOpen,
    children: [
      { title: 'Bitcoin Price Tracking', href: '/docs/guides/bitcoin-tracking', badge: 'FEATURED' },
      { title: 'E-commerce Monitoring', href: '/docs/guides/ecommerce-monitoring' },
    ],
  },
  {
    title: 'Resources',
    icon: Settings,
    children: [
      { title: 'Changelog', href: '/docs/changelog' },
      { title: 'System Status', href: '/docs/status', badge: 'LIVE' },
      { title: 'Support', href: '/docs/support' },
    ],
  },
]

interface NavigationItemProps {
  item: NavigationItem
  level?: number
}

function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-mono tracking-[0.15em] text-white/40 border border-white/10 px-1.5 py-0.5 rounded-sm">
      {children}
    </span>
  )
}

function NavLeaf({ item, level }: { item: NavigationItem; level: number }) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const external = item.href?.startsWith('http')

  return (
    <Link
      href={item.href || '#'}
      className={`group relative flex items-center gap-2 pr-3 py-1.5 text-[13px] transition-colors duration-150 ${
        isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
      }`}
      style={{ paddingLeft: `${level === 0 ? 12 : 24 + (level - 1) * 12}px` }}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-white" />
      )}
      <span className="flex-1 truncate">{item.title}</span>
      {item.badge && <NavBadge>{item.badge}</NavBadge>}
      {external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
    </Link>
  )
}

function NavGroup({ item, level = 0 }: NavigationItemProps) {
  const pathname = usePathname()
  const hasActiveDescendant = (n: NavigationItem): boolean => {
    if (pathname === n.href) return true
    return !!n.children?.some(hasActiveDescendant)
  }

  const [isExpanded, setIsExpanded] = useState(() =>
    item.children?.some(hasActiveDescendant) ?? level === 0
  )

  if (level === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 px-3 mb-2">
          {item.icon && <item.icon className="w-3 h-3 text-white/30" />}
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            {item.title}
          </span>
        </div>
        <div className="space-y-px">
          {item.children?.map((child, i) => (
            <NavigationItemComponent key={i} item={child} level={1} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 py-1.5 pr-3 text-[13px] text-white/55 hover:text-white/85 transition-colors"
        style={{ paddingLeft: `${level === 0 ? 12 : 24 + (level - 1) * 12}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-white/30" />
        ) : (
          <ChevronRight className="w-3 h-3 text-white/30" />
        )}
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </button>
      {isExpanded && (
        <div className="space-y-px">
          {item.children?.map((child, i) => (
            <NavigationItemComponent key={i} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function NavigationItemComponent({ item, level = 0 }: NavigationItemProps) {
  if (!item.children) return <NavLeaf item={item} level={level} />
  return <NavGroup item={item} level={level} />
}

function DocsNavigation() {
  return (
    <nav className="py-8">
      {navigation.map((item, index) => (
        <NavigationItemComponent key={index} item={item} />
      ))}
    </nav>
  )
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4 md:px-6 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              Venym Search
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 px-2 py-0.5 rounded-sm">
              Docs
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md ml-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
            <Input
              placeholder="Search documentation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-12 h-9 bg-white/[0.03] border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 rounded-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded-sm pointer-events-none">
              <Command className="w-2.5 h-2.5" />K
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link href="/" className="hidden sm:inline-flex items-center text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 transition-colors px-3 py-2">
              Home
            </Link>
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <button className="venym-btn-primary">
                Dashboard
                <ArrowUpRight className="w-3 h-3 ml-1.5" />
              </button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-white/60 hover:text-white hover:bg-white/[0.05]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 p-0 bg-[#080808] border-white/[0.06] text-white"
              >
                <div className="px-5 py-4 border-b border-white/[0.06]">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/VENYM_SEARCH-logo.png"
                      alt="Venym Search"
                      width={28}
                      height={28}
                      className="w-7 h-7"
                    />
                    <span className="font-semibold text-[15px] text-white">
                      Venym Search
                    </span>
                  </Link>
                </div>
                <ScrollArea className="h-[calc(100vh-60px)] px-2">
                  <DocsNavigation />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-white/[0.06] sticky top-14 h-[calc(100vh-3.5rem)]">
          <ScrollArea className="h-full px-2">
            <DocsNavigation />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-10">
            <div className="flex justify-end mb-6">
              <CopyMarkdownButton />
            </div>
            <div className="prose-docs">{children}</div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/[0.06] mt-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="venym-meta">© Venym Search · API Docs</div>
              <div className="flex gap-6 text-[11px] font-mono uppercase tracking-[0.15em] text-white/30">
                <Link href="/docs/status" className="hover:text-white/70 transition-colors">
                  Status
                </Link>
                <Link href="/docs/changelog" className="hover:text-white/70 transition-colors">
                  Changelog
                </Link>
                <Link href="/docs/support" className="hover:text-white/70 transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
