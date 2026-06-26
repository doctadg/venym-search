"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  Search,
  Database,
  Code,
  Book,
  Code2,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";




const onboardingSteps = [

  {
    id: "welcome",
    title: "Welcome to Venym Search",
    description: "You're ready to deploy"
  },
  {
    id: "apis",
    title: "Meet your APIs",
    description: "Discover what each engine can do"
  },
  {
    id: "api-key",
    title: "Get your API key",
    description: "Your credentials for access"
  },
  {
    id: "first-request",
    title: "Make your first request",
    description: "See the system in action"
  },
  {
    id: "complete",
    title: "You're ready",
    description: "Time to build"
  }
];

const apis = [
  {
    name: "SEARCH",
    icon: Search,
    description: "Lightning-fast web search with structured results",
    useCase: "Content research, market analysis, and competitive intelligence",
    endpoint: "/api/v1/search",
    example: {
      query: "latest AI trends 2024",
      response: "Structured search results with titles, snippets, URLs, and metadata"
    }
  },
  {
    name: "SCRAPE",
    icon: Code2,
    description: "Browser-grade web scraping for any site",
    useCase: "Extract data from e-commerce, news, and social platforms",
    endpoint: "/api/v1/scrape",
    example: {
      query: "https://example-ecommerce.com/products",
      response: "Clean, structured data from any webpage"
    }
  },
  {
    name: "ENRICH",
    icon: Database,
    description: "Enrich data with AI-powered insights",
    useCase: "Add context, analyze sentiment, and extract key information",
    endpoint: "/api/v1/enrich",
    example: {
      query: "Company: Apple Inc.",
      response: "Comprehensive company data, financials, and market insights"
    }
  }
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const isAuthenticated = !!user;
  const authLoading = !isLoaded;
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams?.get("payment") === "success";

  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedApi, setSelectedApi] = useState(0);
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [testResponse, setTestResponse] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signup");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (paymentSuccess && isAuthenticated && !authLoading) {
      router.push("/dashboard");
    }
  }, [paymentSuccess, isAuthenticated, authLoading, router]);

  const generateApiKey = async () => {
    try {
      const response = await fetch("/api/auth/generate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (response.ok) {
        setApiKey(data.api_key.api_key);
        setKeyGenerated(true);
      }
    } catch (error) {
      console.error("Failed to generate API key:", error);
    }
  };

  const testApiCall = async () => {
    const selectedApiData = apis[selectedApi];
    try {
      const response = await fetch(selectedApiData.endpoint, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: selectedApiData.example.query })
      });

      const data = await response.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResponse("Error: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progressValue = ((currentStep + 1) / onboardingSteps.length) * 100;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4 md:px-6 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 relative">
              <Image
                src="/venym.png"
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
              Onboarding
            </span>
          </Link>

          <div className="ml-auto">
            <Link href="/dashboard">
              <button className="venym-btn-primary">
                Dashboard
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              Step {currentStep + 1} / {onboardingSteps.length}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
              {onboardingSteps[currentStep].description}
            </span>
          </div>
          <div className="h-[2px] w-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <div className="venym-meta mb-3">CLASS :: ONBOARDING // 01</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                  Welcome, {user?.fullName?.split(' ')[0] || "Builder"}.
                </h1>
                <p className="text-[14px] text-white/50 max-w-2xl">
                  You're now part of Venym Search. Time to provision your access and deploy your first request.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { icon: Search, name: "Search", desc: "Lightning-fast web search" },
                  { icon: Code2, name: "Scrape", desc: "Browser-grade extraction" },
                  { icon: Database, name: "Enrich", desc: "AI-powered insights" }
                ].map((item) => (
                  <div key={item.name} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 transition-colors hover:border-white/[0.12]">
                    <item.icon className="w-4 h-4 text-white/50 mb-3" />
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                      Engine
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-[12px] text-white/50">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-white/60" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Free Credits
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">500 credits to start</h3>
                <p className="text-[13px] text-white/50">
                  Enough for thousands of API calls. Test the system at scale.
                </p>
              </div>

              <button onClick={nextStep} className="venym-btn-primary w-full">
                Get Started
                <ArrowRight className="w-3 h-3 ml-2" />
              </button>
            </div>
          )}

          {/* Step 1: API Overview */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <div className="venym-meta mb-3">CLASS :: ONBOARDING // 02</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                  Meet your APIs
                </h1>
                <p className="text-[14px] text-white/50 max-w-2xl">
                  Each engine is designed for a different class of extraction work.
                </p>
              </div>

              <div className="space-y-3">
                {apis.map((api) => (
                  <div key={api.name} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 transition-colors hover:border-white/[0.12]">
                    <div className="flex items-start gap-4">
                      <div className="border border-white/[0.10] bg-white/[0.03] p-3 rounded-sm shrink-0">
                        <api.icon className="w-4 h-4 text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                          Engine // {api.name}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{api.name}</h3>
                        <p className="text-[13px] text-white/60 mb-2">{api.description}</p>
                        <p className="text-[12px] text-white/40 mb-4">{api.useCase}</p>
                        <div className="border border-white/[0.06] bg-white/[0.03] rounded-sm p-3 font-mono">
                          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                            Example
                          </div>
                          <div className="text-[12px] text-white/80 mb-2">{api.example.query}</div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                            Response
                          </div>
                          <div className="text-[12px] text-white/60">{api.example.response}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={nextStep} className="venym-btn-primary w-full">
                Get my API key
                <ArrowRight className="w-3 h-3 ml-2" />
              </button>
            </div>
          )}

          {/* Step 2: API Key Generation */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <div className="venym-meta mb-3">CLASS :: ONBOARDING // 03</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                  Get your API key
                </h1>
                <p className="text-[14px] text-white/50 max-w-2xl">
                  Your credentials for accessing the API.
                </p>
              </div>

              {!keyGenerated ? (
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Provision
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Generate your API key</h3>
                  <p className="text-[13px] text-white/50 mb-6 max-w-md mx-auto">
                    This key grants access to all engines. Keep it secret and secure.
                  </p>
                  <button onClick={generateApiKey} className="venym-btn-primary">
                    Generate API Key
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                        Your API Key
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-white/50 hover:text-white p-1"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white/[0.03] border border-white/[0.08] p-3 rounded-sm font-mono text-[12px] text-white/80 break-all">
                        {showApiKey ? apiKey : "sh_" + "*".repeat(32)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(apiKey)}
                        className="inline-flex items-center justify-center w-10 h-10 text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-sm transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">
                      Security Notes
                    </div>
                    <ul className="space-y-1.5 text-[12px] text-white/60">
                      <li className="flex gap-2"><span className="text-white/30">·</span> Never share your API key publicly</li>
                      <li className="flex gap-2"><span className="text-white/30">·</span> Don't commit it to version control</li>
                      <li className="flex gap-2"><span className="text-white/30">·</span> Use environment variables in production</li>
                      <li className="flex gap-2"><span className="text-white/30">·</span> You can regenerate it anytime in your dashboard</li>
                    </ul>
                  </div>

                  <button onClick={nextStep} className="venym-btn-primary w-full">
                    Make my first API call
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: First API Request */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <div className="venym-meta mb-3">CLASS :: ONBOARDING // 04</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                  Make your first request
                </h1>
                <p className="text-[14px] text-white/50 max-w-2xl">
                  Pick an engine and run a live request.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {apis.map((api, index) => (
                  <button
                    key={api.name}
                    onClick={() => setSelectedApi(index)}
                    className={`p-4 rounded-sm border flex flex-col items-center gap-2 transition-all duration-150 ${
                      selectedApi === index
                        ? "border-white/40 bg-white/[0.05] text-white"
                        : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <api.icon className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{api.name}</span>
                  </button>
                ))}
              </div>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-5 py-3 border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                  Example Request
                </div>
                <div className="p-5">
                  <pre className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-3 font-mono text-[11px] text-white/70 overflow-x-auto whitespace-pre-wrap">
{`curl -X POST ${apis[selectedApi].endpoint} \\
  -H "x-api-key: ${showApiKey ? apiKey : "VENYM_SEARCH_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "${apis[selectedApi].example.query}"}'`}
                  </pre>
                </div>
              </div>

              <button
                onClick={testApiCall}
                disabled={!keyGenerated}
                className="venym-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Code className="w-3 h-3 mr-2" />
                Test {apis[selectedApi].name} API
              </button>

              {testResponse && (
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                  <div className="px-5 py-3 border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Response
                  </div>
                  <div className="p-5">
                    <pre className="text-[11px] font-mono text-white/70 overflow-x-auto whitespace-pre-wrap bg-white/[0.03] border border-white/[0.08] rounded-sm p-3">
                      {testResponse}
                    </pre>
                  </div>
                </div>
              )}

              <button onClick={nextStep} className="venym-btn-secondary w-full">
                Continue
                <ArrowRight className="w-3 h-3 ml-2" />
              </button>
            </div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <div className="venym-meta mb-3">CLASS :: ONBOARDING // COMPLETE</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                  You're ready to build.
                </h1>
                <p className="text-[14px] text-white/50 max-w-2xl">
                  Everything is provisioned. Upgrade for more capacity or jump straight in.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: "Account Created", desc: "Officially part of Venym Search" },
                  { title: "API Key Generated", desc: "Ready to make requests" },
                  { title: "500 Free Credits", desc: "Active and ready to use" },
                  { title: "APIs Explored", desc: "You know what each engine does" },
                ].map((item) => (
                  <div key={item.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
                    <CheckCircle className="w-4 h-4 text-white/70 mb-3" />
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                      Complete
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-[12px] text-white/50">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Need More Capacity?
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "starter", name: "Starter", price: "$9", credits: "5,000 credits/mo" },
                    { id: "builder", name: "Builder", price: "$49", credits: "100,000 credits/mo", popular: true },
                    { id: "unicorn", name: "Unicorn", price: "$199", credits: "500,000 credits/mo" },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-5 rounded-sm border relative ${
                        plan.popular
                          ? "border-white/40 bg-white/[0.04]"
                          : "border-white/[0.08] bg-white/[0.02]"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2 left-4 inline-flex items-center text-[9px] font-mono uppercase tracking-[0.2em] text-black bg-white px-2 py-0.5 rounded-sm">
                          Popular
                        </span>
                      )}
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                        Tier // {plan.id}
                      </div>
                      <h4 className="text-base font-semibold text-white">{plan.name}</h4>
                      <div className="my-2">
                        <span className="text-2xl font-bold text-white">{plan.price}</span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">/mo</span>
                      </div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/50 mb-4">{plan.credits}</p>
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/payments/create-subscription-checkout', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ plan_type: plan.id })
                            });
                            if (res.ok) {
                              const data = await res.json();
                              window.location.href = data.checkout_url;
                            } else {
                              alert('Failed to start subscription');
                            }
                          } catch { alert('Failed to start subscription'); }
                        }}
                        className={`w-full ${plan.popular ? "venym-btn-primary" : "venym-btn-secondary"}`}
                      >
                        Upgrade
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/dashboard" className="block">
                  <button className="venym-btn-primary w-full">
                    Go to Dashboard
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </button>
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/docs">
                    <button className="venym-btn-secondary w-full">
                      <Book className="w-3 h-3 mr-1.5" />
                      View Docs
                    </button>
                  </Link>
                  <Link href="/examples">
                    <button className="venym-btn-secondary w-full">
                      <ExternalLink className="w-3 h-3 mr-1.5" />
                      Examples
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
