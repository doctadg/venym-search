'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  BookOpen,
  Zap,
  Code2,
  Database,
  Puzzle,
  Rocket,
  Settings,
  ArrowRight,
  ExternalLink
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
    title: "Getting Started",
    icon: Rocket,
    children: [
      { title: "Welcome", href: "/docs" },
      { title: "Quickstart", href: "/docs/quickstart", badge: "5 min" },
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Rate Limits", href: "/docs/rate-limits" },
      { title: "Error Handling", href: "/docs/errors" }
    ]
  },
  {
    title: "API Reference",
    icon: Code2,
    children: [
      {
        title: "SwiftSearch",
        href: "/docs/api/swiftsearch",
        children: [
          { title: "Overview", href: "/docs/api/swiftsearch" },
          { title: "Parameters", href: "/docs/api/swiftsearch/parameters" },
          { title: "Examples", href: "/docs/api/swiftsearch/examples" }
        ]
      },
      {
        title: "ScrapeForge", 
        href: "/docs/api/scrapeforge",
        children: [
          { title: "Overview", href: "/docs/api/scrapeforge" },
          { title: "Parameters", href: "/docs/api/scrapeforge/parameters" },
          { title: "Examples", href: "/docs/api/scrapeforge/examples" }
        ]
      },
      {
        title: "DeepDive",
        href: "/docs/api/deepdive", 
        children: [
          { title: "Overview", href: "/docs/api/deepdive" },
          { title: "Parameters", href: "/docs/api/deepdive/parameters" },
          { title: "Examples", href: "/docs/api/deepdive/examples" }
        ]
      }
    ]
  },
  {
    title: "SDKs & Libraries",
    icon: Database,
    children: [
      { title: "Python SDK", href: "/docs/sdks/python", badge: "Popular" },
      { title: "JavaScript/Node.js", href: "/docs/sdks/javascript" },
      { title: "Go SDK", href: "/docs/sdks/go" },
      { title: "PHP SDK", href: "/docs/sdks/php" },
      { title: "REST API", href: "/docs/sdks/rest" }
    ]
  },
  {
    title: "Integrations",
    icon: Puzzle,
    children: [
      { title: "OpenClaw", href: "/docs/integrations/openclaw", badge: "New ★ Popular" },
      { title: "Model Context Protocol (MCP)", href: "/docs/integrations/mcp", badge: "New" },
      { title: "LangChain", href: "/docs/integrations/langchain", badge: "Popular" },
      { title: "OpenAI Assistants", href: "/docs/integrations/openai-assistants" },
      { title: "n8n", href: "/docs/integrations/n8n" },
      { title: "Zapier", href: "/docs/integrations/zapier" },
      { title: "Make.com", href: "/docs/integrations/make" },
      { title: "Pipedream", href: "/docs/integrations/pipedream" },
      { title: "Power Automate", href: "/docs/integrations/power-automate" }
    ]
  },
  {
    title: "Implementation Guides",
    icon: BookOpen,
    children: [
      { title: "Bitcoin Price Tracking", href: "/docs/guides/bitcoin-tracking", badge: "Featured" },
      { title: "E-commerce Monitoring", href: "/docs/guides/ecommerce-monitoring", badge: "Popular" }
    ]
  },
  {
    title: "Developer Tools",
    icon: Settings,
    children: [
      { title: "Changelog", href: "/docs/changelog" },
      { title: "System Status", href: "/docs/status", badge: "Live" },
      { title: "Support", href: "/docs/support" }
    ]
  }
]

interface NavigationItemProps {
  item: NavigationItem
  level?: number
}

function NavigationItemComponent({ item, level = 0 }: NavigationItemProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(() => {
    if (item.children) {
      return item.children.some(child => 
        pathname === child.href || 
        (child.children && child.children.some(grandchild => pathname === grandchild.href))
      )
    }
    return false
  })

  const isActive = pathname === item.href
  const hasActiveChild = item.children?.some(child => 
    pathname === child.href || 
    (child.children && child.children.some(grandchild => pathname === grandchild.href))
  )

  if (!item.children) {
    return (
      <Link
        href={item.href || '#'}
        className={`
          flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 group
          ${isActive 
            ? 'bg-[#efa72d]/10 text-[#efa72d] border-l-2 border-[#efa72d]' 
            : 'text-gray-600 hover:text-[#17457c] hover:bg-gray-50'
          }
          ${level > 0 ? 'ml-6' : ''}
          ${level > 1 ? 'ml-4' : ''}
        `}
      >
        {level === 0 && item.icon && <item.icon className="w-4 h-4" />}
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-[#efa72d]/10 text-[#efa72d] border-0">
            {item.badge}
          </Badge>
        )}
        {item.href?.startsWith('http') && <ExternalLink className="w-3 h-3" />}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 group
          ${hasActiveChild 
            ? 'bg-gray-50 text-[#17457c] font-medium' 
            : 'text-gray-700 hover:text-[#17457c] hover:bg-gray-50'
          }
          ${level > 0 ? 'ml-6' : ''}
        `}
      >
        {level === 0 && item.icon && <item.icon className="w-4 h-4" />}
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-[#efa72d]/10 text-[#efa72d] border-0">
            {item.badge}
          </Badge>
        )}
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isExpanded && item.children && (
        <div className="ml-3 mt-1 space-y-1">
          {item.children.map((child, index) => (
            <NavigationItemComponent key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function DocsNavigation() {
  return (
    <nav className="space-y-2 py-4">
      {navigation.map((item, index) => (
        <NavigationItemComponent key={index} item={item} />
      ))}
    </nav>
  )
}

export default function DocsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-3 mr-6">
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
            <Badge variant="outline" className="text-xs px-2 py-1 border-[#efa72d] text-[#efa72d]">
              DOCS
            </Badge>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#efa72d]/20"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/dashboard"
              className="hidden sm:flex"
            >
              <Button 
                variant="outline"
                size="sm"
                className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white"
              >
                Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="px-6 py-4">
                  <Link href="/" className="flex items-center gap-3">
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
                  </Link>
                </div>
                <Separator />
                <ScrollArea className="flex-1 px-4">
                  <DocsNavigation />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 border-r min-h-[calc(100vh-4rem)] bg-gray-50/50">
          <ScrollArea className="h-full px-4">
            <DocsNavigation />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex justify-end mb-4">
              <CopyMarkdownButton />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}