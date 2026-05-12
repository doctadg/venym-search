'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Code2,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Star,
  Lightbulb,
  BarChart3,
  Database,
  Mail,
  Smartphone,
  Link2,
  Share2,
  ChevronDown,
  Menu,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { structuredData } from './metadata'
export default function SearchPage() {
  const { user, isLoaded } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="flex flex-col min-h-screen bg-[#17457c] text-[#edf3f1]">
        {/* Header - Same as landing page */}
        <header className="px-4 lg:px-6 h-16 md:h-20 flex items-center justify-between border-b-4 border-[#efa72d] bg-[#17457c]">
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-12 md:h-12 relative">
                <Image
                  src="/VENYM_SEARCH-logo.png"
                  alt="Venym Search Logo"
                  width={48}
                  height={48}
                  className="w-8 h-8 md:w-12 md:h-12 brightness-0 invert"
                />
              </div>
              <span className="font-black text-base sm:text-lg md:text-2xl tracking-tight">VENYM_SEARCH</span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex gap-6 xl:gap-8 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1] flex items-center gap-1 bg-transparent">
                PRODUCTS
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="bg-[#17457c] border-2 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] mt-2"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/products/search"
                    className="text-base font-black text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    SEARCH
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/products/scrape"
                    className="text-base font-black text-[#edf3f1] hover:text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] focus:text-[#efa72d] flex items-center gap-2"
                  >
                    <Code2 className="h-4 w-4" />
                    SCRAPE
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    className="text-base font-black text-[#edf3f1] hover:text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] focus:text-[#efa72d] flex items-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/docs"
              className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1]"
            >
              DOCS
            </Link>
            <Link
              href="/blog"
              className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1]"
            >
              BLOG
            </Link>
            <Link
              href="/pricing"
              className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1]"
            >
              PRICING
            </Link>
          </nav>
          {/* Authentication buttons - positioned on the right */}
          <div className="ml-auto hidden lg:flex gap-4 items-center">
            {!isLoaded ? (
              <div className="w-16 h-8 bg-gray-600 animate-pulse rounded"></div>
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                  DASHBOARD
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div className="flex gap-4 items-center">
                <Link
                  href="/login"
                  className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1]"
                >
                  LOGIN
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-6">
                    START FREE TRIAL
                    <Target className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            {!isLoaded ? (
              <div className="w-20 h-8 bg-gray-600 animate-pulse rounded"></div>
            ) : user ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-[#efa72d] text-[#17457c] font-black text-xs px-3 py-2 border-2 border-[#edf3f1] shadow-[2px_2px_0px_0px_#edf3f1]">
                  DASHBOARD
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="sm" className="bg-[#efa72d] text-[#17457c] font-black text-xs px-3 py-2 border-2 border-[#edf3f1] shadow-[2px_2px_0px_0px_#edf3f1]">
                  START FREE
                </Button>
              </Link>
            )}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5 text-[#efa72d]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#17457c] border-l-4 border-[#efa72d] w-[250px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-[#efa72d] font-black text-xl">MENU</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="font-black text-[#efa72d] text-sm mb-2">PRODUCTS</div>
                    <Link
                      href="/products/search"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-[#efa72d] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-[#efa72d] transition-all"
                    >
                      <Search className="h-4 w-4" />
                      SEARCH
                    </Link>
                    <Link
                      href="/products/scrape"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                    >
                      <Code2 className="h-4 w-4" />
                      SCRAPE
                    </Link>
                    <Link
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                    >
                      <Database className="h-4 w-4" />
                    </Link>
                  </div>
                  <Link
                    href="/pricing"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#edf3f1] hover:text-[#efa72d] font-black py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                  >
                    PRICING
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#edf3f1] hover:text-[#efa72d] font-black py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                  >
                    BLOG
                  </Link>
                  <Link
                    href="/docs"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#edf3f1] hover:text-[#efa72d] font-black py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                  >
                    DOCS
                  </Link>
                  {!user && (
                    <>
                      <div className="h-px bg-[#efa72d] my-2"></div>
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#edf3f1] hover:text-[#efa72d] font-black py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                      >
                        LOGIN
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-10 sm:py-16 md:py-32 bg-[#17457c] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,167,45,0.1)_25%,rgba(239,167,45,0.1)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.1)_75%)] bg-[length:20px_20px]"></div>
            <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-7xl">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-8">
                  <div className="space-y-6">
                    <Badge className="bg-[#efa72d] text-[#17457c] font-black text-lg px-6 py-3 border-4 border-[#edf3f1] shadow-[6px_6px_0px_0px_#edf3f1]">
                      <Search className="w-5 h-5 mr-2" />
                      MOST POPULAR API
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                      <span className="block text-[#efa72d]">SEARCH</span>
                      <span className="block">SEARCH + SCRAPE</span>
                      <span className="block">IN ONE CALL</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-2xl">
                      Get Google search results AND automatically scrape full content from each page. 
                      Extract contacts, social profiles, and rich data—all in a single API request.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-xl px-12 py-6 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                      >
                        START FREE TRIAL
                        <Target className="ml-3 h-6 w-6" />
                      </Button>
                    </Link>
                    <Link href="#demo">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-4 border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] font-black text-xl px-12 py-6 bg-transparent"
                      >
                        SEE LIVE DEMO
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1">
                  <Card className="bg-black border-4 border-[#efa72d] shadow-[12px_12px_0px_0px_#efa72d]">
                    <CardContent className="p-8">
                      <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                        {`curl -X POST "https://www.search.venym.io/api/v1/search" \
  -H "X-API-Key: sk_live_YOUR_API_KEY_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "latest AI agent frameworks 2025",
    "auto_scrape_top": 5,
    "include_contacts": true,
    "include_social": true
  }'

# Response includes:
# ✓ 10 search results
# ✓ 5 fully scraped pages
# ✓ Extracted email addresses
# ✓ Social media profiles
# ✓ Contact information`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="w-full py-10 sm:py-20 bg-[#efa72d] text-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  WHY DEVELOPERS CHOOSE SEARCH
                </h2>
                <div className="w-48 h-3 bg-black mx-auto mb-6"></div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                {[
                  {
                    icon: Zap,
                    title: "10X FASTER DEVELOPMENT",
                    description: "Replace 10+ API calls with one. No need to build search, scraping, and data extraction separately.",
                    metric: "90% less code"
                  },
                  {
                    icon: Database,
                    title: "RICH DATA EXTRACTION",
                    description: "Automatically extract emails, phone numbers, social profiles, and structured data from every search result.",
                    metric: "15+ data points"
                  },
                  {
                    icon: TrendingUp,
                    title: "ENTERPRISE RELIABILITY",
                    description: "99.7% uptime, intelligent retries, and automatic fallbacks. Built for production workloads.",
                    metric: "17ms avg latency"
                  }
                ].map((benefit, index) => (
                  <Card key={index} className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                    <CardContent className="p-8 text-center">
                      <benefit.icon className="h-16 w-16 mx-auto mb-6 text-[#efa72d]" />
                      <div className="text-3xl font-black text-[#efa72d] mb-4">{benefit.metric}</div>
                      <h3 className="text-xl font-black mb-4">{benefit.title}</h3>
                      <p className="font-bold text-gray-300">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Features Deep Dive */}
          <section className="w-full py-10 sm:py-20 bg-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  FEATURES THAT SAVE YOU MONTHS
                </h2>
                <div className="w-48 h-3 bg-[#efa72d] mx-auto mb-6"></div>
              </div>

              <Tabs defaultValue="search" className="w-full max-w-6xl mx-auto">
                <TabsList className="flex w-full overflow-x-auto bg-[#6b839a] border-2 sm:border-4 border-[#efa72d]">
                  <TabsTrigger value="search" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Smart Search
                  </TabsTrigger>
                  <TabsTrigger value="scrape" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Auto-Scrape
                  </TabsTrigger>
                  <TabsTrigger value="contacts" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Contact Extract
                  </TabsTrigger>
                  <TabsTrigger value="social" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Social Discovery
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Google Search API on Steroids</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Real-time Google Results</p>
                            <p className="text-gray-300">Fresh results with positions, snippets, and metadata</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Advanced Filtering</p>
                            <p className="text-gray-300">Domain filters, date ranges, and result customization</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Related Queries</p>
                            <p className="text-gray-300">Automatic suggestion of related search terms</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm">
{`{
  "query": "AI startups YC 2024",
  "results": [
    {
      "title": "OpenAI Launches New Agent SDK...",
      "link": "https://techcrunch.com/...",
      "snippet": "The latest framework for building autonomous AI agents...",
      "position": 1,
      "date": "2025-01-15"
    }
  ],
  "total_results": 47,
  "related_searches": [
    "AI agent frameworks comparison",
    "autonomous agent development 2025"
  ]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="scrape" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Automatic Content Extraction</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Full Page Content</p>
                            <p className="text-gray-300">Clean text extraction with title and metadata</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Link Discovery</p>
                            <p className="text-gray-300">Extract all internal and external links</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Anti-Bot Protection</p>
                            <p className="text-gray-300">Bypass Cloudflare, Akamai, and other protections</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm">
{`{
  "scraped_content": [
    {
      "url": "https://example.com",
      "title": "AI Startup Raises $50M",
      "text": "Full article content...",
      "links": [
        {"text": "About Us", "url": "/about"},
        {"text": "Contact", "url": "/contact"}
      ],
      "metadata": {
        "author": "John Doe",
        "published": "2024-01-15"
      }
    }
  ]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">AI-Powered Contact Discovery</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Email Extraction</p>
                            <p className="text-gray-300">Find email addresses with confidence scoring</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Smartphone className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Phone Numbers</p>
                            <p className="text-gray-300">Extract and format phone numbers automatically</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Company Info</p>
                            <p className="text-gray-300">Identify company names, addresses, and key personnel</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm">
{`{
  "contacts": [
    {
      "type": "email",
      "value": "ceo@aicompany.com",
      "confidence": 0.95,
      "source_url": "https://aicompany.com"
    },
    {
      "type": "phone", 
      "value": "+1-555-123-4567",
      "confidence": 0.88,
      "source_url": "https://aicompany.com/contact"
    }
  ]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Social Media Intelligence</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Link2 className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">LinkedIn Profiles</p>
                            <p className="text-gray-300">Discover company and personal LinkedIn pages</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Share2 className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Twitter/X Accounts</p>
                            <p className="text-gray-300">Find official social media handles</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">All Platforms</p>
                            <p className="text-gray-300">GitHub, YouTube, Share2, Camera profiles</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm">
{`{
  "social_profiles": [
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/company/aicompany",
      "username": "aicompany",
      "source_url": "https://aicompany.com"
    },
    {
      "platform": "Twitter",
      "url": "https://x.com/aicompany",
      "username": "@aicompany",
      "source_url": "https://aicompany.com"
    }
  ]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Use Cases */}
          <section className="w-full py-10 sm:py-20 bg-[#efa72d] text-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">USE CASES</h2>
                <div className="w-48 h-3 bg-black mx-auto mb-6"></div>
                <p className="text-xl font-bold max-w-3xl mx-auto">
                  Real companies using Search to power their products
                </p>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                {[
                  {
                    icon: Users,
                    title: "Lead Generation",
                    description: "Find prospects by searching for companies in specific industries, then automatically extract contact information and social profiles.",
                    example: "Search 'SaaS startups San Francisco' → Get emails and LinkedIn profiles",
                    companies: "Used by 2,400+ sales teams"
                  },
                  {
                    icon: BarChart3,
                    title: "Market Research", 
                    description: "Research competitors, industry trends, and market opportunities with comprehensive data extraction from multiple sources.",
                    example: "Search 'AI productivity tools 2024' → Get feature comparisons and pricing",
                    companies: "Used by 890+ analysts"
                  },
                  {
                    icon: Lightbulb,
                    title: "Content Creation",
                    description: "Gather information for articles, reports, and social media content by searching topics and extracting key insights.",
                    example: "Search 'climate tech funding' → Get data for investment newsletter",
                    companies: "Used by 1,200+ content creators"
                  },
                  {
                    icon: Code2,
                    title: "AI Training Data",
                    description: "Collect high-quality, structured data for training AI models and building knowledge bases.",
                    example: "Search 'machine learning papers' → Extract abstracts and citations",
                    companies: "Used by 340+ AI companies"
                  }
                ].map((useCase, index) => (
                  <Card key={index} className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                    <CardContent className="p-8">
                      <useCase.icon className="h-12 w-12 mb-6 text-[#efa72d]" />
                      <h3 className="text-2xl font-black mb-4 text-[#efa72d]">{useCase.title}</h3>
                      <p className="font-bold mb-4 text-gray-300">{useCase.description}</p>
                      <div className="bg-gray-900 p-4 rounded border-l-4 border-[#efa72d] mb-4">
                        <p className="font-bold text-sm">{useCase.example}</p>
                      </div>
                      <Badge className="bg-[#efa72d] text-black font-black">
                        {useCase.companies}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="w-full py-10 sm:py-20 bg-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  SIMPLE PRICING
                </h2>
                <div className="w-48 h-3 bg-[#efa72d] mx-auto mb-6"></div>
                <p className="text-xl font-bold max-w-3xl mx-auto">
                  Pay per search. No monthly fees. No complicated tiers.
                </p>
              </div>
              <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
                {[
                  {
                    name: "FREE TRIAL",
                    price: "$0",
                    credits: "500 credits",
                    description: "Perfect for testing and prototyping",
                    features: ["Search + basic scraping", "Community support", "Standard rate limits"],
                    popular: false,
                  },
                  {
                    name: "STARTER",
                    price: "$9/mo",
                    credits: "5,000 credits/mo",
                    description: "Great for side projects and small tools",
                    features: ["+ Contact extraction", "+ Email support", "+ Higher rate limits"],
                    popular: true,
                  },
                  {
                    name: "BUILDER",
                    price: "$49/mo", 
                    credits: "100,000 credits/mo",
                    description: "Perfect for scaling with less effort",
                    features: ["+ Social discovery", "+ Priority processing", "+ Dedicated support"],
                    popular: false,
                  },
                  {
                    name: "UNICORN",
                    price: "$199/mo",
                    credits: "500,000 credits/mo",
                    description: "Built for high volume and speed",
                    features: ["+ Dedicated support engineer", "+ Custom integrations", "+ SLA guarantees"],
                    popular: false,
                  }
                ].map((plan, index) => (
                  <Card
                    key={index}
                    className={`${plan.popular ? "bg-[#efa72d] text-[#17457c] border-[#edf3f1] scale-105" : "bg-[#6b839a] text-[#edf3f1] border-[#efa72d]"} border-4 shadow-[8px_8px_0px_0px_${plan.popular ? "#edf3f1" : "#efa72d"}] relative`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-black text-white font-black px-4 py-2 border-2 border-white">
                          <Star className="w-4 h-4 mr-1" />
                          MOST POPULAR
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-black mb-4">{plan.name}</h3>
                      <div className="text-4xl font-black mb-2">{plan.price}</div>
                      <div className="text-lg font-bold mb-4">{plan.credits}</div>
                      <p className="font-bold mb-6 text-sm">{plan.description}</p>
                      <div className="space-y-3 mb-8">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className={`h-5 w-5 ${plan.popular ? "text-[#17457c]" : "text-[#efa72d]"}`} />
                            <span className="font-bold text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/signup">
                        <Button
                          className={`w-full font-black text-lg py-6 border-4 ${plan.popular ? "bg-black text-white border-black hover:bg-gray-800" : "bg-[#efa72d] text-[#17457c] border-[#edf3f1] hover:bg-[#d4941f]"} shadow-[4px_4px_0px_0px_${plan.popular ? "#000000" : "#edf3f1"}]`}
                        >
                          {plan.price === "$0" ? "START FREE TRIAL" : "GET STARTED"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="w-full py-10 sm:py-20 bg-[#efa72d] text-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  START BUILDING IN MINUTES
                </h2>
                <p className="text-xl font-bold">
                  Join 3,200+ developers who chose Search over building their own scraping infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-black hover:bg-gray-800 text-white font-black text-xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000]"
                    >
                      GET 5K FREE CREDITS
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </Link>
                  <Link href="https://docs.VENYM_SEARCH.com/search">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-4 border-black text-black hover:bg-black hover:text-white font-black text-xl px-12 py-6 bg-transparent"
                    >
                      VIEW DOCS
                    </Button>
                  </Link>
                </div>
                <p className="text-sm font-bold text-gray-700">
                  No credit card required • 5K credits free • Cancel anytime
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#17457c] border-t-4 border-[#efa72d] py-12">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="space-y-4">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/VENYM_SEARCH-logo.png"
                      alt="Venym Search Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 brightness-0 invert"
                    />
                  </div>
                  <span className="font-black text-lg tracking-tight text-[#edf3f1]">VENYM_SEARCH</span>
                </Link>
                <p className="text-gray-400 font-bold text-sm">
                  Enterprise web scraping APIs for modern developers.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-black text-white text-lg">PRODUCTS</h3>
                <nav className="flex flex-col gap-2">
                  <Link href="/products/search" className="font-black text-[#efa72d] hover:text-white transition-colors">
                    Search
                  </Link>
                  <Link href="/products/scrape" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Scrape
                  </Link>
                  </Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h3 className="font-black text-white text-lg">RESOURCES</h3>
                <nav className="flex flex-col gap-2">
                  <Link href="https://docs.VENYM_SEARCH.com" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Documentation
                  </Link>
                  <Link href="/examples" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Code Examples
                  </Link>
                  <Link href="/blog" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Blog
                  </Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h3 className="font-black text-white text-lg">COMPANY</h3>
                <nav className="flex flex-col gap-2">
                  <Link href="/about" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    About Us
                  </Link>
                  <Link href="/contact" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Contact
                  </Link>
                  <Link href="/privacy" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Privacy Policy
                  </Link>
                </nav>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="font-black text-gray-400">© 2025 Venym Search • Built for developers, by developers</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}