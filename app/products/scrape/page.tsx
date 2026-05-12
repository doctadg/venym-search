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
  Code2,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Search,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Star,
  Lightbulb,
  BarChart3,
  Database,
  Link as LinkIcon,
  Settings,
  Layers,
  Download,
  ChevronDown,
  Menu,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { structuredData } from './metadata'
export default function ScrapePage() {
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
                    className="text-base font-black text-[#edf3f1] hover:text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] focus:text-[#efa72d] flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    SEARCH
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/products/scrape"
                    className="text-base font-black text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] flex items-center gap-2"
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
                      className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all"
                    >
                      <Search className="h-4 w-4" />
                      SEARCH
                    </Link>
                    <Link
                      href="/products/scrape"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-[#efa72d] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-[#efa72d] transition-all"
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
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(239,167,45,0.1)_25%,rgba(239,167,45,0.1)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.1)_75%)] bg-[length:30px_30px]"></div>
            <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-7xl">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-8">
                  <div className="space-y-6">
                    <Badge className="bg-[#efa72d] text-[#17457c] font-black text-lg px-6 py-3 border-4 border-[#edf3f1] shadow-[6px_6px_0px_0px_#edf3f1] transform rotate-1">
                      <Code2 className="w-5 h-5 mr-2" />
                      ENTERPRISE GRADE
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                      <span className="block text-[#efa72d]">SCRAPE</span>
                      <span className="block">SCRAPING ON</span>
                      <span className="block">STEROIDS</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-2xl">
                      Advanced web scraping that follows links, bypasses protection, and extracts structured data. 
                      Built for enterprise applications that need reliable, scalable data extraction.
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
                    <Link href="#capabilities">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-4 border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] font-black text-xl px-12 py-6 bg-transparent"
                      >
                        SEE CAPABILITIES
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1">
                  <Card className="bg-black border-4 border-[#efa72d] shadow-[12px_12px_0px_0px_#efa72d]">
                    <CardContent className="p-8">
                      <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                        {`curl -X POST "https://www.search.venym.io/api/v1/scrape" \
  -H "X-API-Key: sk_live_YOUR_API_KEY_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://target-site.com",
    "follow_internal_links": true,
    "max_depth": 3,
    "max_pages": 50,
    "include_contacts": true,
    "extract_options": ["text", "links", "metadata"]
  }'

# Response includes:
# ✓ Primary page content
# ✓ 50 discovered internal pages
# ✓ Contact information extracted
# ✓ Site structure mapping
# ✓ Anti-bot protection bypassed`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="w-full py-10 sm:py-20 bg-[#efa72d] text-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  WEB SCRAPING IS BROKEN
                </h2>
                <div className="w-48 h-3 bg-black mx-auto mb-6"></div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    title: "ANTI-BOT PROTECTION",
                    problem: "Cloudflare, Akamai, and DataDome block 80% of scraping attempts",
                    solution: "Scrape bypasses protection with 99.3% success rate"
                  },
                  {
                    icon: Clock,
                    title: "SLOW & UNRELIABLE",
                    problem: "Traditional scrapers take 10+ seconds per page and fail randomly",
                    solution: "Average 1.2s per page with intelligent retry mechanisms"
                  },
                  {
                    icon: Settings,
                    title: "COMPLEX SETUP",
                    problem: "Building scrapers requires months of development and maintenance",
                    solution: "Deploy production scraping in 5 minutes with one API call"
                  }
                ].map((item, index) => (
                  <Card key={index} className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                    <CardContent className="p-8">
                      <item.icon className="h-12 w-12 mb-6 text-red-500" />
                      <h3 className="text-xl font-black mb-4 text-red-500">{item.title}</h3>
                      <p className="font-bold mb-4 text-gray-300">{item.problem}</p>
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-[#efa72d]" />
                          <span className="font-black text-[#efa72d]">Scrape Solution:</span>
                        </div>
                        <p className="font-bold text-sm">{item.solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Capabilities Section */}
          <section id="capabilities" className="w-full py-20 bg-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  ADVANCED CAPABILITIES
                </h2>
                <div className="w-48 h-3 bg-[#efa72d] mx-auto mb-6"></div>
              </div>

              <Tabs defaultValue="protection" className="w-full max-w-6xl mx-auto">
                <TabsList className="flex w-full overflow-x-auto bg-[#6b839a] border-2 sm:border-4 border-[#efa72d]">
                  <TabsTrigger value="protection" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Anti-Bot
                  </TabsTrigger>
                  <TabsTrigger value="following" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Link Following
                  </TabsTrigger>
                  <TabsTrigger value="extraction" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Data Extraction
                  </TabsTrigger>
                  <TabsTrigger value="scale" className="font-black whitespace-nowrap data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm flex-shrink-0">
                    Enterprise Scale
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="protection" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Bypass Any Protection</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Cloudflare & Akamai</p>
                            <p className="text-gray-300">Advanced fingerprint rotation and challenge solving</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">JavaScript Rendering</p>
                            <p className="text-gray-300">Full browser execution for SPA applications</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">CAPTCHA Solving</p>
                            <p className="text-gray-300">Automatic CAPTCHA detection and solving</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <span className="font-mono text-sm text-gray-300">cloudflare.com</span>
                            <Badge className="bg-green-600 text-white font-black">BYPASSED</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <span className="font-mono text-sm text-gray-300">akamai.com</span>
                            <Badge className="bg-green-600 text-white font-black">BYPASSED</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <span className="font-mono text-sm text-gray-300">datadome.co</span>
                            <Badge className="bg-green-600 text-white font-black">BYPASSED</Badge>
                          </div>
                          <div className="text-center pt-4">
                            <div className="text-2xl font-black text-[#efa72d] mb-2">99.3%</div>
                            <div className="text-sm font-bold text-gray-400">Success Rate</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="following" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Intelligent Link Following</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <LinkIcon className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Internal Link Discovery</p>
                            <p className="text-gray-300">Automatically find and follow internal site links</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Layers className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Depth Control</p>
                            <p className="text-gray-300">Configure crawl depth from 1-5 levels deep</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Settings className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Smart Filtering</p>
                            <p className="text-gray-300">Pattern matching for relevant links only</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm">
{`{
  "primary_content": {
    "url": "https://example.com",
    "title": "Homepage",
    "text": "Welcome to our site..."
  },
  "discovered_links": [
    {
      "url": "https://example.com/about",
      "title": "About Us",
      "depth": 1
    },
    {
      "url": "https://example.com/products",
      "title": "Our Products", 
      "depth": 1
    },
    {
      "url": "https://example.com/contact",
      "title": "Contact Us",
      "depth": 1
    }
  ],
  "total_pages": 47
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="extraction" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Structured Data Extraction</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Database className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Schema.org Data</p>
                            <p className="text-gray-300">Extract structured markup automatically</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BarChart3 className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Table Extraction</p>
                            <p className="text-gray-300">Convert HTML tables to structured JSON</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Download className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Media Assets</p>
                            <p className="text-gray-300">Extract images, videos, and documents</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm">
{`{
  "structured_data": {
    "type": "Organization",
    "name": "Acme Corp",
    "description": "Leading tech company",
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA"
    }
  },
  "tables": [
    {
      "headers": ["Product", "Price", "Stock"],
      "rows": [
        ["Widget A", "$29.99", "50"],
        ["Widget B", "$39.99", "25"]
      ]
    }
  ]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="scale" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-[#efa72d]">Built for Enterprise Scale</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Zap className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Parallel Processing</p>
                            <p className="text-gray-300">Scrape 100+ pages simultaneously</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Global Infrastructure</p>
                            <p className="text-gray-300">17 regions worldwide for optimal performance</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-6 w-6 text-[#efa72d] mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Auto-Scaling</p>
                            <p className="text-gray-300">Handle traffic spikes automatically</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-black border-4 border-[#efa72d]">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-4 bg-gray-900 rounded">
                            <div className="text-2xl font-black text-[#efa72d] mb-1">1M+</div>
                            <div className="text-xs font-bold text-gray-400">Pages/Day</div>
                          </div>
                          <div className="p-4 bg-gray-900 rounded">
                            <div className="text-2xl font-black text-[#efa72d] mb-1">1.2s</div>
                            <div className="text-xs font-bold text-gray-400">Avg Latency</div>
                          </div>
                          <div className="p-4 bg-gray-900 rounded">
                            <div className="text-2xl font-black text-[#efa72d] mb-1">99.9%</div>
                            <div className="text-xs font-bold text-gray-400">Uptime</div>
                          </div>
                          <div className="p-4 bg-gray-900 rounded">
                            <div className="text-2xl font-black text-[#efa72d] mb-1">17</div>
                            <div className="text-xs font-bold text-gray-400">Regions</div>
                          </div>
                        </div>
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
                  Enterprise teams using Scrape for mission-critical data extraction
                </p>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                {[
                  {
                    icon: TrendingUp,
                    title: "E-commerce Intelligence",
                    description: "Monitor competitor prices, inventory levels, and product catalogs across multiple sites with automated link following.",
                    example: "Scrape Amazon product categories → Follow to individual products → Extract prices and reviews",
                    metric: "2.3M products tracked daily"
                  },
                  {
                    icon: BarChart3,
                    title: "Financial Data Extraction", 
                    description: "Extract financial reports, SEC filings, and market data from regulatory websites with complex navigation.",
                    example: "Navigate SEC EDGAR → Find 10-K filings → Extract financial tables and metrics",
                    metric: "50K documents processed monthly"
                  },
                  {
                    icon: Users,
                    title: "HR & Recruitment",
                    description: "Scrape job boards, company career pages, and professional networks to build comprehensive talent databases.",
                    example: "Scrape LinkedIn company pages → Follow employee profiles → Extract skills and experience",
                    metric: "1.2M profiles enriched weekly"
                  },
                  {
                    icon: Lightbulb,
                    title: "Research & Academia",
                    description: "Gather research papers, citations, and academic data from university and journal websites.",
                    example: "Scrape research journals → Follow citation links → Build knowledge graphs",
                    metric: "890K papers indexed"
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
                        {useCase.metric}
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
                  ENTERPRISE PRICING
                </h2>
                <div className="w-48 h-3 bg-[#efa72d] mx-auto mb-6"></div>
                <p className="text-xl font-bold max-w-3xl mx-auto">
                  Advanced features require higher plans. Built for serious applications.
                </p>
              </div>
              <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
                {[
                  {
                    name: "STARTER",
                    price: "$9/mo",
                    credits: "5,000 credits/mo",
                    description: "Basic scraping for simple projects",
                    features: ["Basic anti-bot protection", "Single page scraping", "Email support"],
                    popular: false,
                    available: true
                  },
                  {
                    name: "BUILDER",
                    price: "$49/mo",
                    credits: "100,000 credits/mo",
                    description: "Advanced features for growing businesses",
                    features: ["+ Link following (2 levels)", "+ Contact extraction", "+ Priority processing"],
                    popular: true,
                    available: true
                  },
                  {
                    name: "UNICORN",
                    price: "$199/mo", 
                    credits: "500,000 credits/mo",
                    description: "Full enterprise capabilities",
                    features: ["+ Deep link following (5 levels)", "+ Bulk processing", "+ Dedicated support"],
                    popular: false,
                    available: true
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
                          GET STARTED
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-12">
                <p className="text-gray-400 font-bold">
                  💡 Link following and advanced features available on Builder+ plans
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="w-full py-10 sm:py-20 bg-[#efa72d] text-[#17457c]">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  SCRAPE WITHOUT LIMITS
                </h2>
                <p className="text-xl font-bold">
                  Join 1,890+ developers who replaced their scraping infrastructure with Scrape.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-black hover:bg-gray-800 text-white font-black text-xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000]"
                    >
                      START FREE TRIAL
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </Link>
                  <Link href="https://docs.VENYM_SEARCH.com/scrape">
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
                  No credit card required • 5K credits free • Enterprise support available
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
                  <Link href="/products/search" className="font-black text-gray-400 hover:text-[#efa72d] transition-colors">
                    Search
                  </Link>
                  <Link href="/products/scrape" className="font-black text-[#efa72d] hover:text-white transition-colors">
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