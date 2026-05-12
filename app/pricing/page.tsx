"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Zap, Users, Building2, ArrowRight, Search, Code2, Database, ChevronDown, Target, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const isAuthenticated = !!user;
  const loading = !isLoaded;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#17457c] text-[#edf3f1]">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 md:h-20 flex items-center border-b-4 border-[#efa72d] bg-[#17457c]">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search Logo"
                width={48}
                height={48}
                className="w-8 h-8 md:w-12 md:h-12 brightness-0 invert"
              />
            </div>
            <span className="font-black text-lg md:text-2xl tracking-tight">VENYM_SEARCH</span>
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
                  href="/products/swiftsearch"
                  className="text-base font-black text-[#edf3f1] hover:text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] focus:text-[#efa72d] flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  SWIFTSEARCH
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/products/scrapeforge"
                  className="text-base font-black text-[#edf3f1] hover:text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] focus:text-[#efa72d] flex items-center gap-2"
                >
                  <Code2 className="h-4 w-4" />
                  SCRAPEFORGE
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/products/deepdive"
                  className="text-base font-black text-[#edf3f1] hover:text-[#efa72d] hover:bg-[#6b839a] cursor-pointer focus:bg-[#6b839a] focus:text-[#efa72d] flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  DEEPDIVE
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/pricing"
            className="text-base xl:text-lg font-black text-[#efa72d] border-b-2 border-[#efa72d] pb-1"
          >
            PRICING
          </Link>
          <Link
            href="/tools"
            className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1]"
          >
            TOOLS
          </Link>
        </nav>
        {/* Authentication buttons - positioned on the right */}
        <div className="ml-auto hidden lg:flex gap-4 items-center">
          {loading ? (
            <div className="w-16 h-8 bg-gray-600 animate-pulse rounded"></div>
          ) : isAuthenticated ? (
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
          {!loading && !isAuthenticated && (
            <Link href="/signup">
              <Button size="sm" className="bg-[#efa72d] text-[#17457c] font-black text-xs px-3 py-2 border-2 border-[#edf3f1] shadow-[2px_2px_0px_0px_#edf3f1]">
                START FREE
              </Button>
            </Link>
          )}
          {!loading && isAuthenticated && (
            <Link href="/dashboard">
              <Button size="sm" className="bg-[#efa72d] text-[#17457c] font-black text-xs px-3 py-2 border-2 border-[#edf3f1] shadow-[2px_2px_0px_0px_#edf3f1]">
                DASHBOARD
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
                  <Link href="/products/swiftsearch" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all">
                    <Search className="h-4 w-4" /> SWIFTSEARCH
                  </Link>
                  <Link href="/products/scrapeforge" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all">
                    <Code2 className="h-4 w-4" /> SCRAPEFORGE
                  </Link>
                  <Link href="/products/deepdive" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] font-bold py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all">
                    <Database className="h-4 w-4" /> DEEPDIVE
                  </Link>
                </div>
                <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-[#efa72d] font-black py-2 px-4 border-l-4 border-[#efa72d] transition-all">PRICING</Link>
                {!isAuthenticated && (
                  <>
                    <div className="h-px bg-[#efa72d] my-2"></div>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#edf3f1] hover:text-[#efa72d] font-black py-2 px-4 border-l-4 border-transparent hover:border-[#efa72d] transition-all">LOGIN</Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="text-[#efa72d] font-black py-2 px-4 border-l-4 border-[#efa72d] transition-all">SIGN UP</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-[#17457c] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,167,45,0.08)_25%,rgba(239,167,45,0.08)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.08)_75%)] bg-[length:20px_20px]"></div>
          <div className="container px-4 md:px-6 relative z-10 max-w-5xl mx-auto">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                  <span className="block transform -skew-y-1">SIMPLE</span>
                  <span className="block text-[#efa72d] transform skew-y-1">PRICING</span>
                </h1>
                <div className="w-32 sm:w-48 h-2 sm:h-3 bg-[#efa72d] mx-auto transform skew-x-12 mb-4 sm:mb-6"></div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#edf3f1] leading-tight max-w-3xl mx-auto">
                  1 CREDIT = $0.0001 → SIMPLE PRICING
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Free Plan White Bar */}
        <section className="w-full py-10 md:py-14 bg-white text-black border-y-4 border-black">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 bg-[#efa72d] border-2 border-black shadow-[2px_2px_0px_0px_#000000]"></div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter">
                    START FREE TODAY
                  </h3>
                </div>
                <p className="text-base md:text-lg font-bold text-gray-700 max-w-2xl mx-auto">
                  Developers get <span className="text-[#efa72d] font-black">500 FREE CREDITS</span> to test our APIs. No credit card required. Full access to all endpoints.
                </p>
              </div>
              {loading ? (
                <div className="w-40 h-12 bg-gray-300 animate-pulse rounded"></div>
              ) : isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-black font-black text-base md:text-lg px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all">
                    GO TO DASHBOARD
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-black font-black text-base md:text-lg px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all">
                    CLAIM FREE CREDITS
                    <Target className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Subscription Plans Section */}
        <section id="subscriptions" className="w-full py-20 md:py-28 bg-[#6b839a]">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-6 text-[#edf3f1]">
                MONTHLY <span className="text-[#efa72d]">SUBSCRIPTIONS</span>
              </h2>
              <div className="w-48 h-3 bg-[#efa72d] mx-auto mb-4"></div>
              <p className="text-lg md:text-xl font-bold text-gray-300 max-w-2xl mx-auto">
                Recurring credits every month. Cancel anytime.
              </p>
            </div>
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-4 mb-12 max-w-6xl mx-auto">
              {[
                { id: "free", name: "FREE", price: "$0", credits: "500 credits", icon: Users, features: ["SwiftSearch API", "ScrapeForge", "DeepDive", "Basic support", "Dashboard access"] },
                { id: "starter", name: "STARTER", price: "$9", credits: "5K credits/mo", icon: Code2, features: ["SwiftSearch API", "ScrapeForge", "DeepDive", "Basic support", "Dashboard access"] },
                { id: "builder", name: "BUILDER", price: "$49", credits: "100K credits/mo", icon: Building2, popular: true, features: ["Everything in Starter", "Priority support", "Advanced analytics", "Custom webhooks", "Higher rate limits"] },
                { id: "unicorn", name: "UNICORN", price: "$199", credits: "500K credits/mo", icon: Zap, features: ["Everything in Builder", "Dedicated support engineer", "Custom integrations", "SLA guarantees", "Advanced security"] },
              ].map((plan, index) => (
                <Card
                  key={index}
                  className={`${plan.popular ? "bg-[#efa72d] text-[#17457c] border-[#edf3f1]" : "bg-[#17457c] text-[#edf3f1] border-[#efa72d]"} border-4 shadow-[6px_6px_0px_0px_${plan.popular ? "#edf3f1" : "#efa72d"}] transform hover:translate-x-1 hover:translate-y-1 transition-all relative`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-black text-white font-black px-4 py-2 border-2 border-white text-sm">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 pb-4 text-center">
                    <CardTitle className={`text-2xl md:text-3xl font-black ${plan.popular ? "text-[#17457c]" : "text-[#edf3f1]"}`}>
                      {plan.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-8 text-center space-y-6">
                    <div className="space-y-2">
                      <div className={`text-5xl md:text-6xl font-black ${plan.popular ? "text-[#17457c]" : "text-[#efa72d]"}`}>
                        {plan.price}
                      </div>
                      <div className="text-sm md:text-base font-bold text-gray-300">
                        {plan.credits}
                      </div>
                    </div>
                    <div className="h-px w-full bg-current opacity-20"></div>
                    <div className="space-y-3 text-left">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? "text-[#17457c]" : "text-[#efa72d]"}`} />
                          <span className="font-bold text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={async () => {
                        if (plan.id === 'free') {
                          if (!isAuthenticated) { window.location.href = '/signup?plan=free'; return; }
                          window.location.href = '/dashboard';
                          return;
                        }
                        if (!isAuthenticated) { window.location.href = '/signup?plan=' + plan.id; return; }
                        try {
                          const res = await fetch('/api/payments/create-subscription-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_type: plan.id }) });
                          if (res.ok) { const data = await res.json(); window.location.href = data.checkout_url; } else { alert('Failed to start subscription'); }
                        } catch { alert('Failed to start subscription'); }
                      }}
                      className={`w-full font-black text-lg py-4 border-4 ${plan.popular ? "bg-black text-white border-black hover:bg-gray-800" : "bg-[#efa72d] text-[#17457c] border-[#edf3f1] hover:bg-[#d4941f]"} shadow-[4px_4px_0px_0px_${plan.popular ? "#000000" : "#edf3f1"}]`}
                    >
                      {plan.id === 'free' ? 'GET STARTED FREE' : 'GET STARTED'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 md:py-28 bg-[#17457c] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(239,167,45,0.05)_25%,rgba(239,167,45,0.05)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.05)_75%)] bg-[length:40px_40px]"></div>
          <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-[#edf3f1]">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <div className="w-48 h-3 bg-[#efa72d] mx-auto transform -skew-x-12 mb-6"></div>
            </div>
            <div className="space-y-6">
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[6px_6px_0px_0px_#efa72d]">
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-black mb-4 text-[#efa72d]">What are credits and how do they work?</h3>
                  <p className="text-white font-bold text-base md:text-lg">
                    Credits are our universal currency across all APIs. Different operations consume different amounts of credits based on complexity and computational cost. This gives you maximum flexibility to use our APIs as needed.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[6px_6px_0px_0px_#efa72d]">
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-black mb-4 text-[#efa72d]">Can I change plans anytime?</h3>
                  <p className="text-white font-bold text-base md:text-lg">
                    Absolutely. Upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll prorate any billing differences.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[6px_6px_0px_0px_#efa72d]">
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-black mb-4 text-[#efa72d]">What happens if I exceed my credit limit?</h3>
                  <p className="text-white font-bold text-base md:text-lg">
                    Your APIs will be throttled once you hit your monthly limit. Upgrade your plan to get more credits and continue using our services without interruption.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[6px_6px_0px_0px_#efa72d]">
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-black mb-4 text-[#efa72d]">Do you offer custom enterprise solutions?</h3>
                  <p className="text-white font-bold text-base md:text-lg">
                    Yes! Our Enterprise plan is fully customizable. Contact our sales team for volume discounts, custom SLAs, dedicated infrastructure, and white-label solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Anti-Sales CTA */}
        <section className="w-full py-20 md:py-28 bg-[#6b839a] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(239,167,45,0.08)_25%,rgba(239,167,45,0.08)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.08)_75%)] bg-[length:40px_40px]"></div>
          <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10">
            <div className="text-center space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                  <span className="block transform skew-x-2">NO "BOOK DEMO"</span>
                  <span className="block text-[#efa72d] transform -skew-x-2">BULLSH*T</span>
                </h2>
                <div className="w-32 h-3 bg-[#efa72d] mx-auto transform -skew-x-12"></div>
                <div className="max-w-3xl mx-auto">
                  <div className="text-xl md:text-2xl font-bold text-[#edf3f1] leading-relaxed space-y-2">
                    <div>1. Get free API key</div>
                    <div>2. curl our endpoints</div>
                    <div>3. Scale to $10k/month</div>
                    <div>4. THEN we'll Zoom. Probably.</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="w-80 h-16 bg-gray-600 animate-pulse rounded mx-auto"></div>
                ) : isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-xl px-12 py-6 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                    >
                      GO TO YOUR DASHBOARD
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-xl px-12 py-6 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                    >
                      START FREE TRIAL (5K CREDITS)
                    </Button>
                  </Link>
                )}
                <p className="text-sm font-bold text-gray-400">{isAuthenticated ? "Welcome back!" : "No CC required. Cancel anytime."}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#17457c] border-t-4 border-[#efa72d] py-12">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="font-black text-white text-lg">BOOTSTRAPPED & PROUD</h3>
              <div className="space-y-2 text-gray-400 font-bold">
                <div>Self-funded since day one</div>
                <div>Built by developers, for developers</div>
                <div>No VC overlords</div>
              </div>
            </div>
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="font-black text-white text-lg">RESOURCES</h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="font-black text-gray-400 hover:text-[#efa72d] transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  className="font-black text-gray-400 hover:text-[#efa72d] transition-colors"
                >
                  GitHub (24k stars)
                </Link>
                <Link
                  href="#"
                  className="font-black text-gray-400 hover:text-[#efa72d] transition-colors"
                >
                  Twitter (Build updates)
                </Link>
                <Link
                  href="#"
                  className="font-black text-gray-400 hover:text-[#efa72d] transition-colors"
                >
                  Discord (4,213 devs)
                </Link>
              </nav>
            </div>
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="font-black text-white text-lg">GROWTH STORY</h3>
              <div className="text-gray-400 font-bold">
                <div className="mb-4">$0 → $1.2M ARR in 14 months</div>
                <div className="text-sm">
                  "We replaced three separate APIs with Venym Search. Search, scrape, and research — one endpoint. 
                  Cut our infrastructure costs by 60% and shipped our agent 3 weeks faster."
                  like Oracle, and sold by ex-McKinsey bros."
                </div>
                <div className="text-xs mt-2">— Alex Chen, Founder (ex-DeepMind)</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="font-black text-gray-400">© 2025 Venym Search • Proudly un-enterprise • We don't hire MBAs</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
