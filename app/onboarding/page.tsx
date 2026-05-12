"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, 
  ArrowRight, 
  Copy, 
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  Search,
  Globe,
  Database,
  Code,
  Book,
  Code2,
  ChevronDown,
  Target,
  Flame
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to Venym Search!",
    description: "You're ready to unleash brutal data power"
  },
  {
    id: "apis",
    title: "Meet Your APIs",
    description: "Discover what each API can do for you"
  },
  {
    id: "api-key",
    title: "Get Your API Key",
    description: "Your secret weapon for data domination"
  },
  {
    id: "first-request",
    title: "Make Your First Request",
    description: "See the power in action"
  },
  {
    id: "complete",
    title: "You're Ready!",
    description: "Time to build something amazing"
  }
];

const apis = [
  {
    name: "SEARCH",
    icon: Search,
    description: "LIGHTNING-FAST WEB SEARCH WITH STRUCTURED RESULTS",
    useCase: "PERFECT FOR CONTENT RESEARCH, MARKET ANALYSIS, AND COMPETITIVE INTELLIGENCE",
    endpoint: "/api/v1/search",
    example: {
      query: "latest AI trends 2024",
      response: "GET STRUCTURED SEARCH RESULTS WITH TITLES, SNIPPETS, URLS, AND METADATA"
    }
  },
  {
    name: "SCRAPE",
    icon: Code2,
    description: "POWERFUL WEB SCRAPING THAT HANDLES ANY SITE",
    useCase: "EXTRACT DATA FROM E-COMMERCE SITES, NEWS SOURCES, AND SOCIAL PLATFORMS",
    endpoint: "/api/v1/scrape",
    example: {
      query: "https://example-ecommerce.com/products",
      response: "GET CLEAN, STRUCTURED DATA FROM ANY WEBPAGE"
    }
  },
  {
    icon: Database,
    description: "ENRICH AND ENHANCE YOUR DATA WITH AI-POWERED INSIGHTS", 
    useCase: "ADD CONTEXT, ANALYZE SENTIMENT, AND EXTRACT KEY INFORMATION",
    example: {
      query: "Company: Apple Inc.",
      response: "GET COMPREHENSIVE COMPANY DATA, FINANCIALS, AND MARKET INSIGHTS"
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signup");
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle payment success - redirect to dashboard if user just completed payment
  useEffect(() => {
    if (paymentSuccess && isAuthenticated && !authLoading) {
      // User just completed payment, redirect to dashboard
      router.push("/dashboard");
    }
  }, [paymentSuccess, isAuthenticated, authLoading, router]);

  // Generate API key
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

  // Make test API request
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
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#efa72d]" />
      </div>
    );
  }

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
            href="/pricing"
            className="text-base xl:text-lg font-black hover:text-[#efa72d] transition-colors border-b-2 border-transparent hover:border-[#efa72d] pb-1 text-[#edf3f1]"
          >
            PRICING
          </Link>
        </nav>
        {/* Authentication buttons - positioned on the right */}
        <div className="ml-auto hidden lg:flex gap-4 items-center">
          <Link href="/dashboard">
            <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              DASHBOARD
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        {/* Mobile Navigation - Simple Button */}
        <div className="ml-auto flex lg:hidden gap-2">
          <Link href="/dashboard">
            <Button size="sm" className="bg-[#efa72d] text-[#17457c] font-black text-sm px-4 py-2 border-2 border-[#edf3f1]">
              DASHBOARD
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,167,45,0.1)_25%,rgba(239,167,45,0.1)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.1)_75%)] bg-[length:20px_20px]"></div>
        {/* Progress Header */}
        <div className="px-4 py-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-[#edf3f1]">
                GETTING STARTED
              </h1>
              <Badge className="bg-[#efa72d] text-[#17457c] font-black px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                STEP {currentStep + 1} OF {onboardingSteps.length}
              </Badge>
            </div>
            <div className="bg-[#6b839a] h-4 rounded border-2 border-[#efa72d] overflow-hidden">
              <div 
                className="h-full bg-[#efa72d] transition-all duration-500 ease-out"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <div className="text-lg font-bold text-[#edf3f1] mt-2">
              {onboardingSteps[currentStep].description.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-8 relative z-10">
          <div className="max-w-4xl mx-auto">
          
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] transform hover:translate-x-2 hover:translate-y-2 transition-all">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter mb-6">
                    <span className="block transform -skew-y-1 text-[#edf3f1]">WELCOME TO</span>
                    <span className="block text-[#efa72d] transform skew-y-1">VENYM_SEARCH!</span>
                  </CardTitle>
                  <div className="inline-block mb-6">
                    <Badge className="bg-[#efa72d] text-[#17457c] font-black text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 border-2 sm:border-4 border-[#edf3f1] shadow-[4px_4px_0px_0px_#edf3f1] transform rotate-1">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      HEY {user?.fullName?.toUpperCase() || "THERE"}!
                    </Badge>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#edf3f1] border-l-4 border-[#efa72d] pl-4 text-left max-w-2xl mx-auto">
                    YOU'RE NOW PART OF THE VENYM_SEARCH FAMILY. TIME TO UNLEASH BRUTAL DATA POWER.
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-black border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d]">
                      <CardContent className="p-6 text-center">
                        <Search className="w-8 h-8 text-[#efa72d] mx-auto mb-3" />
                        <h3 className="font-black text-[#efa72d] mb-2">SEARCH</h3>
                        <p className="text-sm font-bold text-white">LIGHTNING-FAST WEB SEARCH</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d]">
                      <CardContent className="p-6 text-center">
                        <Code2 className="w-8 h-8 text-[#efa72d] mx-auto mb-3" />
                        <h3 className="font-black text-[#efa72d] mb-2">SCRAPE</h3>
                        <p className="text-sm font-bold text-white">POWERFUL WEB SCRAPING</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d]">
                      <CardContent className="p-6 text-center">
                        <Database className="w-8 h-8 text-[#efa72d] mx-auto mb-3" />
                        <p className="text-sm font-bold text-white">AI-POWERED ENRICHMENT</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-[#efa72d] border-4 border-black shadow-[4px_4px_0px_0px_#000000]">
                    <CardContent className="p-6 text-center">
                      <Zap className="w-6 h-6 text-[#17457c] mx-auto mb-3" />
                      <h3 className="text-lg font-black text-[#17457c] mb-2">YOU'VE GOT 500 FREE CREDITS!</h3>
                      <p className="font-bold text-[#17457c]">THAT'S ENOUGH TO MAKE THOUSANDS OF API CALLS AND REALLY TEST OUR POWER.</p>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={nextStep}
                    className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 px-8 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                  >
                    LET'S GET STARTED!
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 1: API Overview */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d]">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter">
                      <span className="block transform -skew-y-1 text-[#edf3f1]">MEET YOUR</span>
                      <span className="block text-[#efa72d] transform skew-y-1">BRUTAL APIS</span>
                    </CardTitle>
                    <div className="w-32 h-3 bg-[#efa72d] mx-auto transform -skew-x-12 mb-6 mt-4"></div>
                    <p className="text-lg font-bold text-[#edf3f1]">EACH API IS DESIGNED FOR MAXIMUM POWER AND FLEXIBILITY</p>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  {apis.map((api, index) => (
                    <Card key={api.name} className="bg-black border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] transform hover:translate-x-2 hover:translate-y-2 transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-[#efa72d] p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
                            <api.icon className="w-8 h-8 text-[#17457c]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-black mb-3 text-[#efa72d]">{api.name}</h3>
                            <p className="text-white font-bold mb-4">{api.description}</p>
                            <p className="text-gray-300 font-bold text-sm mb-4">{api.useCase}</p>
                            <div className="bg-[#17457c] p-4 border-2 border-[#efa72d]">
                              <div className="text-sm font-mono">
                                <div className="text-[#efa72d] font-black">EXAMPLE:</div>
                                <div className="text-white mt-1 font-bold">{api.example.query}</div>
                                <div className="text-[#efa72d] mt-2 font-black">RESPONSE:</div>
                                <div className="text-gray-300 text-xs mt-1 font-bold">{api.example.response}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                >
                  GET MY API KEY
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: API Key Generation */}
            {currentStep === 2 && (
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] transform hover:translate-x-2 hover:translate-y-2 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter">
                    <span className="block transform -skew-y-1 text-[#edf3f1]">GET YOUR</span>
                    <span className="block text-[#efa72d] transform skew-y-1">API KEY</span>
                  </CardTitle>
                  <div className="w-32 h-3 bg-[#efa72d] mx-auto transform -skew-x-12 mb-6 mt-4"></div>
                  <p className="text-lg font-bold text-[#edf3f1]">YOUR SECRET WEAPON FOR ACCESSING OUR APIS</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!keyGenerated ? (
                    <div className="text-center space-y-4">
                      <Card className="bg-[#efa72d] border-4 border-black shadow-[4px_4px_0px_0px_#000000]">
                        <CardContent className="p-6">
                          <h3 className="font-black text-[#17457c] mb-3 text-xl">🔑 YOUR API KEY</h3>
                          <p className="font-bold text-[#17457c] mb-4">
                            THIS KEY GIVES YOU ACCESS TO ALL OUR APIS. KEEP IT SECRET AND SECURE!
                          </p>
                          <Button
                            onClick={generateApiKey}
                            className="bg-[#17457c] text-[#efa72d] font-black hover:bg-[#0f2a4a] border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                          >
                            GENERATE MY API KEY
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Card className="bg-black border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-black text-[#efa72d]">YOUR API KEY</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="text-[#efa72d] hover:bg-[#17457c]"
                            >
                              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-[#17457c] p-3 border-2 border-[#efa72d] font-mono text-sm text-[#efa72d] break-all">
                              {showApiKey ? apiKey : "sh_" + "*".repeat(32)}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey)}
                              className="border-2 border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c]"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_#000000]">
                        <CardContent className="p-4">
                          <h4 className="font-black text-white mb-2 text-lg">🚨 IMPORTANT SECURITY NOTES</h4>
                          <ul className="text-sm text-white font-bold space-y-1">
                            <li>• NEVER SHARE YOUR API KEY PUBLICLY</li>
                            <li>• DON'T COMMIT IT TO VERSION CONTROL</li>
                            <li>• USE ENVIRONMENT VARIABLES IN PRODUCTION</li>
                            <li>• YOU CAN REGENERATE IT ANYTIME IN YOUR DASHBOARD</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Button
                        onClick={nextStep}
                        className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                      >
                        MAKE MY FIRST API CALL
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: First API Request */}
            {currentStep === 3 && (
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] transform hover:translate-x-2 hover:translate-y-2 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter">
                    <span className="block transform -skew-y-1 text-[#edf3f1]">MAKE YOUR</span>
                    <span className="block text-[#efa72d] transform skew-y-1">FIRST REQUEST</span>
                  </CardTitle>
                  <div className="w-32 h-3 bg-[#efa72d] mx-auto transform -skew-x-12 mb-6 mt-4"></div>
                  <p className="text-lg font-bold text-[#edf3f1]">LET'S SEE THE POWER IN ACTION!</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* API Selection */}
                  <div className="grid grid-cols-3 gap-4">
                    {apis.map((api, index) => (
                      <Button
                        key={api.name}
                        variant={selectedApi === index ? "default" : "outline"}
                        onClick={() => setSelectedApi(index)}
                        className={`p-4 h-auto flex flex-col items-center gap-2 font-black border-2 ${
                          selectedApi === index 
                            ? "bg-[#efa72d] text-[#17457c] border-black shadow-[4px_4px_0px_0px_#000000]" 
                            : "border-[#efa72d] text-[#efa72d] bg-transparent hover:bg-[#efa72d] hover:text-[#17457c]"
                        }`}
                      >
                        <api.icon className="w-6 h-6" />
                        <span className="font-black text-xs">{api.name}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Example Request */}
                  <Card className="bg-black border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d]">
                    <CardContent className="p-4">
                      <h4 className="font-black mb-3 text-[#efa72d] text-lg">EXAMPLE REQUEST</h4>
                      <div className="font-mono text-sm bg-[#17457c] p-3 border-2 border-[#efa72d]">
                        <div className="text-[#efa72d]">curl -X POST {apis[selectedApi].endpoint} \</div>
                        <div className="text-[#efa72d] ml-4">-H "x-api-key: {showApiKey ? apiKey : "YOUR_API_KEY"}" \</div>
                        <div className="text-[#efa72d] ml-4">-H "Content-Type: application/json" \</div>
                        <div className="text-[#efa72d] ml-4">-d '{`{"query": "${apis[selectedApi].example.query}"}`}'</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Button */}
                  <Button
                    onClick={testApiCall}
                    disabled={!keyGenerated}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all"
                  >
                    <Code className="w-5 h-5 mr-2" />
                    TEST {apis[selectedApi].name} API
                  </Button>

                  {/* Response */}
                  {testResponse && (
                    <Card className="bg-black border-4 border-green-500 shadow-[4px_4px_0px_0px_green]">
                      <CardContent className="p-4">
                        <h4 className="font-black mb-3 text-green-400 text-lg">API RESPONSE</h4>
                        <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap bg-[#17457c] p-3 border-2 border-green-500">
                          {testResponse}
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    onClick={nextStep}
                    className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all"
                  >
                    CONTINUE TO DASHBOARD
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Completion - Show upgrade option */}
            {currentStep === 4 && (
              <Card className="bg-[#6b839a] border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] transform hover:translate-x-2 hover:translate-y-2 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter mb-6">
                    <span className="block transform -skew-y-1 text-[#edf3f1]">🎉 YOU'RE READY</span>
                    <span className="block text-[#efa72d] transform skew-y-1">TO BUILD!</span>
                  </CardTitle>
                  <div className="w-32 h-3 bg-[#efa72d] mx-auto transform -skew-x-12 mb-6"></div>
                  <p className="text-lg font-bold text-[#edf3f1] border-l-4 border-[#efa72d] pl-4 text-left max-w-2xl mx-auto">
                    YOU'VE GOT EVERYTHING YOU NEED. UPGRADE FOR MORE POWER OR JUMP RIGHT IN.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-black border-4 border-green-500 shadow-[4px_4px_0px_0px_green] text-center">
                      <CardContent className="p-6">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="font-black text-green-400 mb-2">ACCOUNT CREATED</h3>
                        <p className="text-sm font-bold text-white">YOU'RE OFFICIALLY PART OF VENYM_SEARCH</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black border-4 border-green-500 shadow-[4px_4px_0px_0px_green] text-center">
                      <CardContent className="p-6">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="font-black text-green-400 mb-2">API KEY GENERATED</h3>
                        <p className="text-sm font-bold text-white">READY TO MAKE API REQUESTS</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black border-4 border-green-500 shadow-[4px_4px_0px_0px_green] text-center">
                      <CardContent className="p-6">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="font-black text-green-400 mb-2">500 FREE CREDITS</h3>
                        <p className="text-sm font-bold text-white">FREE CREDITS READY TO USE</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black border-4 border-green-500 shadow-[4px_4px_0px_0px_green] text-center">
                      <CardContent className="p-6">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="font-black text-green-400 mb-2">APIS EXPLORED</h3>
                        <p className="text-sm font-bold text-white">YOU KNOW WHAT EACH API DOES</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Upgrade Plans */}
                  <div className="bg-black border-4 border-[#efa72d] p-6">
                    <h3 className="text-2xl font-black text-[#efa72d] text-center mb-4">⚡ NEED MORE POWER?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        { id: "starter", name: "STARTER", price: "$9/mo", credits: "5,000 credits/mo" },
                        { id: "builder", name: "BUILDER", price: "$49/mo", credits: "100,000 credits/mo", popular: true },
                        { id: "unicorn", name: "UNICORN", price: "$199/mo", credits: "500,000 credits/mo" },
                      ].map((plan) => (
                        <Card key={plan.id} className={`${plan.popular ? "bg-[#efa72d] text-[#17457c] border-black" : "bg-[#17457c] text-[#edf3f1] border-[#efa72d]"} border-4 p-4 text-center`}>
                          <h4 className="font-black text-lg">{plan.name}</h4>
                          <div className="text-3xl font-black my-2">{plan.price}</div>
                          <p className="text-sm font-bold">{plan.credits}</p>
                          <Button
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
                            className={`mt-3 w-full font-black border-4 ${plan.popular ? "bg-black text-white border-black hover:bg-gray-800" : "bg-[#efa72d] text-[#17457c] border-[#edf3f1] hover:bg-[#d4941f]"}`}
                          >
                            UPGRADE
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link href="/dashboard">
                      <Button className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-6 border-4 border-[#edf3f1] shadow-[8px_8px_0px_0px_#edf3f1] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#edf3f1] transition-all">
                        SKIP - GO TO DASHBOARD
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    
                    <div className="flex gap-4">
                      <Link href="/docs" className="flex-1">
                        <Button variant="outline" className="w-full border-2 border-[#efa72d] text-[#efa72d] font-black hover:bg-[#efa72d] hover:text-[#17457c]">
                          <Book className="w-4 h-4 mr-2" />
                          VIEW DOCS
                        </Button>
                      </Link>
                      <Link href="/examples" className="flex-1">
                        <Button variant="outline" className="w-full border-2 border-[#efa72d] text-[#efa72d] font-black hover:bg-[#efa72d] hover:text-[#17457c]">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          SEE EXAMPLES
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}