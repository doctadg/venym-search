"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  ArrowRight,
  CreditCard,
  Zap,
  Calculator,
  User,
  Building2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useSignUp } from "@clerk/nextjs";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: "5,000 credits/month",
    description: "Great for side projects and small tools",
    popular: false,
    features: ["SwiftSearch API", "ScrapeForge", "DeepDive", "Basic support"]
  },
  {
    id: "builder",
    name: "Builder",
    price: 49,
    credits: "100,000 credits/month",
    description: "Perfect for scaling with less effort",
    popular: true,
    features: ["Everything in Starter", "Priority support", "Advanced analytics", "Higher rate limits"]
  },
  {
    id: "unicorn",
    name: "Unicorn",
    price: 199,
    credits: "500,000 credits/month",
    description: "Built for high volume and speed",
    popular: false,
    features: ["Everything in Builder", "Dedicated support", "Custom integrations", "SLA guarantees"]
  }
];

interface FormData {
  email: string;
  password: string;
  fullName: string;
  company: string;
  planId: string;
  useCase: string;
}

export default function SignupPage() {
  const { user, isLoaded } = useUser();
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();
  const isAuthenticated = !!user;
  const authLoading = !isLoaded;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    company: "",
    planId: searchParams?.get("plan") === "free" ? "" : (searchParams?.get("plan") || ""),
    useCase: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 4;
  const progressValue = (currentStep / totalSteps) * 100;

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!signUpLoaded || !signUp) return;
    
    setError("");
    setLoading(true);

    try {
      // Start the sign-up process using Clerk
      const signUpAttempt = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      // If email verification is required, handle it
      if (signUpAttempt.status === 'missing_requirements') {
        // Send email verification code
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setError('Please check your email and verify your account, then try again.');
        setLoading(false);
        return;
      }

      // If sign-up is complete, set the session as active
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        
        // Store user data in Clerk's unsafeMetadata for later sync
        try {
          const clerkUser = await signUp.update({
            unsafeMetadata: {
              full_name: formData.fullName,
              company: formData.company,
              plan: formData.planId || 'free',
              use_case: formData.useCase
            }
          });
        } catch (metadataError) {
          console.warn('Failed to store user metadata:', metadataError);
        }
        
        // For paid plans, redirect to Stripe checkout
        if (formData.planId && formData.planId !== "") {
          const selectedPlan = plans.find(p => p.id === formData.planId);
          if (selectedPlan && selectedPlan.price > 0) {
            // Redirect to payment processing
            await handlePaymentFlow();
            return;
          }
        }
        
        // For free plan, go to onboarding
        router.push("/onboarding");
      }
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.errors?.[0]?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFlow = async () => {
    try {
      console.log("Starting payment flow for plan:", formData.planId);
      
      // Create Stripe checkout session for subscription
      const response = await fetch("/api/payments/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_type: formData.planId,
          success_url: `${window.location.origin}/onboarding?payment=success`,
          cancel_url: `${window.location.origin}/signup?payment=cancelled`,
        }),
      });

      console.log("Payment API response status:", response.status);
      
      const data = await response.json();
      console.log("Payment API response data:", data);
      
      if (response.ok && data.checkout_url) {
        console.log("Redirecting to Stripe checkout:", data.checkout_url);
        // Redirect to Stripe checkout
        window.location.href = data.checkout_url;
      } else {
        console.error("Payment API error:", {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        const errorMsg = data.error || `Payment session failed: ${response.status} - ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Payment flow error:", error);
      const errorMsg = `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(errorMsg);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#efa72d] mx-auto mb-4" />
          <p className="text-[#edf3f1] font-black text-xl">LOADING...</p>
        </div>
      </div>
    );
  }

  const selectedPlan = plans.find(p => p.id === formData.planId);

  return (
    <div className="flex flex-col min-h-screen bg-[#17457c] text-[#edf3f1]">
        {/* Header */}
      <header className="px-4 lg:px-6 h-16 md:h-20 flex items-center border-b-4 border-[#efa72d] bg-[#17457c]">
        <Link href="/" className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] transition-colors font-black">
          <ArrowLeft className="h-5 w-5" />
          <span>BACK TO HOME</span>
        </Link>
        <Link href="/" className="flex items-center justify-center mx-auto">
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
        <div className="w-24" />
      </header>

      {/* Progress Section */}
      <section className="bg-[#17457c] py-6 border-b-4 border-[#efa72d]">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-[#edf3f1] font-black mb-4">
              <span className="text-lg">STEP {currentStep} OF {totalSteps}</span>
              <span className="text-[#efa72d] text-lg">{Math.round(progressValue)}% COMPLETE</span>
            </div>
            <div className="w-full bg-[#edf3f1] h-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <div 
                className="bg-[#efa72d] h-full border-r-2 border-black transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-[#17457c] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,167,45,0.1)_25%,rgba(239,167,45,0.1)_50%,transparent_50%,transparent_75%,rgba(239,167,45,0.1)_75%)] bg-[length:20px_20px]"></div>
        <div className="container px-4 md:px-6 py-12 relative z-10">
          <Card className="w-full max-w-3xl mx-auto border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] bg-[#edf3f1]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-4xl font-black text-[#17457c] tracking-tight transform -skew-y-1">
              {currentStep === 1 && "CREATE YOUR ACCOUNT"}
              {currentStep === 2 && "CHOOSE YOUR PLAN"}
              {currentStep === 3 && "TELL US ABOUT YOU"}
              {currentStep === 4 && "CONFIRM & START"}
            </CardTitle>
            <p className="text-[#6b839a] font-bold mt-4">
              {currentStep === 1 && "Join the brutal data revolution"}
              {currentStep === 2 && "Pick your weapon of choice"}
              {currentStep === 3 && "Help us personalize your experience"}
              {currentStep === 4 && "Ready to unleash the power"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Account Creation */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="font-black text-[#17457c] text-lg">
                      FULL NAME (OPTIONAL)
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      className="border-4 border-[#6b839a] font-bold text-[#17457c] bg-white mt-2 h-12 text-lg shadow-[4px_4px_0px_0px_#6b839a] focus:shadow-[2px_2px_0px_0px_#6b839a] transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-black text-[#17457c] text-lg">
                      EMAIL ADDRESS
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="border-4 border-[#6b839a] font-bold text-[#17457c] bg-white mt-2 h-12 text-lg shadow-[4px_4px_0px_0px_#6b839a] focus:shadow-[2px_2px_0px_0px_#6b839a] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="font-black text-[#17457c] text-lg">
                      PASSWORD
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="border-4 border-[#6b839a] font-bold text-[#17457c] bg-white mt-2 h-12 text-lg shadow-[4px_4px_0px_0px_#6b839a] focus:shadow-[2px_2px_0px_0px_#6b839a] transition-all"
                      required
                    />
                    <p className="text-[#6b839a] font-bold mt-2">
                      Must be at least 8 characters long
                    </p>
                  </div>
                </div>

                <div className="bg-[#efa72d] p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                  <h3 className="font-black text-[#17457c] text-xl mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    WHAT YOU GET FOR FREE:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "500 FREE CREDITS TO START",
                      "FULL ACCESS TO ALL APIS",
                      "NO CREDIT CARD REQUIRED",
                      "UPGRADE ANYTIME"
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-[#17457c]" />
                        <span className="font-black text-[#17457c]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={nextStep}
                  disabled={!formData.email || !formData.password || formData.password.length < 8}
                  className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-xl py-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                >
                  CONTINUE TO PLANS
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            )}

            {/* Step 2: Plan Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6 p-4 bg-[#6b839a] border-2 border-black">
                  <p className="text-[#edf3f1] font-black text-lg">CHOOSE YOUR WEAPON. UPGRADE ANYTIME.</p>
                </div>

                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => updateFormData("planId", plan.id)}
                      className={`relative p-6 border-4 cursor-pointer transition-all duration-200 transform hover:translate-x-1 hover:translate-y-1 ${
                        formData.planId === plan.id
                          ? "border-[#efa72d] bg-[#efa72d]/20 shadow-[8px_8px_0px_0px_#efa72d] hover:shadow-[4px_4px_0px_0px_#efa72d]"
                          : "border-[#6b839a] bg-white hover:bg-[#edf3f1] shadow-[4px_4px_0px_0px_#6b839a] hover:shadow-[2px_2px_0px_0px_#6b839a]"
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-4 bg-[#efa72d] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                          <Zap className="w-4 h-4 mr-1" />
                          POPULAR
                        </Badge>
                      )}
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="min-w-0">
                          <h3 className="text-xl sm:text-2xl font-black text-[#17457c] transform -skew-y-1">{plan.name.toUpperCase()}</h3>
                          <p className="text-[#6b839a] font-bold mt-1 text-sm sm:text-base">{plan.description.toUpperCase()}</p>
                          <p className="text-[#efa72d] font-black text-base sm:text-lg mt-2">{plan.credits.toUpperCase()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-3xl sm:text-4xl font-black text-[#17457c]">${plan.price}</div>
                          <div className="font-bold text-[#6b839a]">/MONTH</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {plan.features.map((feature, i) => (
                          <Badge key={i} className="bg-[#6b839a] text-[#edf3f1] font-bold border border-black">
                            {feature.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Free tier option */}
                  <div
                    onClick={() => updateFormData("planId", "")}
                    className={`relative p-6 border-4 cursor-pointer transition-all duration-200 transform hover:translate-x-1 hover:translate-y-1 ${
                      formData.planId === ""
                        ? "border-green-500 bg-green-500/20 shadow-[8px_8px_0px_0px_#22c55e] hover:shadow-[4px_4px_0px_0px_#22c55e]"
                        : "border-[#6b839a] bg-white hover:bg-[#edf3f1] shadow-[4px_4px_0px_0px_#6b839a] hover:shadow-[2px_2px_0px_0px_#6b839a]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-black text-[#17457c] transform -skew-y-1">FREE TIER</h3>
                        <p className="text-[#6b839a] font-bold mt-1 text-sm sm:text-base">PERFECT FOR TESTING THE WATERS</p>
                        <p className="text-green-500 font-black text-base sm:text-lg mt-2">500 CREDITS/MONTH</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl sm:text-4xl font-black text-[#17457c]">$0</div>
                        <div className="font-bold text-[#6b839a]">/MONTH</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={prevStep}
                    className="flex-1 bg-[#6b839a] hover:bg-[#5a758d] text-[#edf3f1] font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    BACK
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    CONTINUE
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="company" className="font-black text-[#17457c] text-lg">
                      COMPANY (OPTIONAL)
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.company}
                      onChange={(e) => updateFormData("company", e.target.value)}
                      className="border-4 border-[#6b839a] font-bold text-[#17457c] bg-white mt-2 h-12 text-lg shadow-[4px_4px_0px_0px_#6b839a] focus:shadow-[2px_2px_0px_0px_#6b839a] transition-all"
                    />
                  </div>

                  <div>
                    <Label className="font-black text-[#17457c] text-lg mb-4 block">
                      WHAT'S YOUR PRIMARY USE CASE?
                    </Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {[
                        "Content Creation",
                        "E-commerce Intelligence", 
                        "Lead Generation",
                        "Market Research",
                        "Data Analysis",
                        "Other"
                      ].map((useCase) => (
                        <Button
                          key={useCase}
                          type="button"
                          onClick={() => updateFormData("useCase", useCase)}
                          className={`font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all ${
                            formData.useCase === useCase
                              ? "bg-[#efa72d] text-[#17457c]"
                              : "bg-white text-[#17457c] hover:bg-[#edf3f1]"
                          }`}
                        >
                          {useCase.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={prevStep}
                    className="flex-1 bg-[#6b839a] hover:bg-[#5a758d] text-[#edf3f1] font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    BACK
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    CONTINUE
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center p-4 bg-[#6b839a] border-2 border-black">
                  <h3 className="text-2xl font-black text-[#edf3f1]">READY TO DOMINATE DATA?</h3>
                </div>

                {/* Summary */}
                <div className="bg-white p-6 border-4 border-[#6b839a] shadow-[4px_4px_0px_0px_#6b839a] space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-[#efa72d]" />
                    <div>
                      <div className="font-black text-[#17457c] text-lg">{formData.fullName || "BRUTAL BUILDER"}</div>
                      <div className="font-bold text-[#6b839a]">{formData.email}</div>
                    </div>
                  </div>
                  
                  {formData.company && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-[#efa72d]" />
                      <div className="font-black text-[#17457c] text-lg">{formData.company.toUpperCase()}</div>
                    </div>
                  )}

                  {formData.useCase && (
                    <div className="flex items-center gap-3">
                      <Calculator className="w-6 h-6 text-[#efa72d]" />
                      <div>
                        <div className="font-black text-[#17457c]">USE CASE</div>
                        <div className="font-bold text-[#6b839a]">{formData.useCase.toUpperCase()}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-[#efa72d]" />
                    <div>
                      <div className="font-black text-[#17457c] text-lg">
                        {selectedPlan ? selectedPlan.name.toUpperCase() : "FREE TIER"}
                      </div>
                      <div className="font-bold text-[#6b839a]">
                        {selectedPlan ? selectedPlan.credits.toUpperCase() : "500 CREDITS/MONTH"}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border-4 border-red-500 shadow-[4px_4px_0px_0px_#ef4444]">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <span className="text-red-700 font-bold">{error}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={prevStep}
                    className="flex-1 bg-[#6b839a] hover:bg-[#5a758d] text-[#edf3f1] font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    BACK
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        CREATING ACCOUNT...
                      </>
                    ) : (
                      <>
                        UNLEASH THE POWER
                        <CheckCircle className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center pt-6 border-t-4 border-[#6b839a]">
              <p className="text-[#6b839a] font-bold text-lg">
                ALREADY HAVE AN ACCOUNT?{" "}
                <Link href="/login" className="text-[#efa72d] font-black hover:text-[#d4941f] transition-colors transform hover:skew-y-1 inline-block">
                  SIGN IN HERE →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}