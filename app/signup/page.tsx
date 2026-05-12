"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    features: [] as string[],
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
      const signUpAttempt = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      if (signUpAttempt.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setError('Please check your email and verify your account, then try again.');
        setLoading(false);
        return;
      }

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });

        try {
          await signUp.update({
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

        if (formData.planId && formData.planId !== "") {
          const selectedPlan = plans.find(p => p.id === formData.planId);
          if (selectedPlan && selectedPlan.price > 0) {
            await handlePaymentFlow();
            return;
          }
        }

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

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        const errorMsg = data.error || `Payment session failed: ${response.status} - ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(errorMsg);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  const selectedPlan = plans.find(p => p.id === formData.planId);

  const stepTitle =
    currentStep === 1 ? "Create your account" :
    currentStep === 2 ? "Choose your plan" :
    currentStep === 3 ? "Tell us about you" :
    "Confirm & start";

  const stepSubtitle =
    currentStep === 1 ? "Join Venym Search" :
    currentStep === 2 ? "Pick the plan that fits your scale" :
    currentStep === 3 ? "Help us personalize your experience" :
    "Review your details before we provision";

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4 md:px-6 gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <Link href="/" className="flex items-center gap-3 mx-auto">
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
              Sign Up
            </span>
          </Link>

          <div className="w-16" />
        </div>
      </header>

      <section className="border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              Step {currentStep} / {totalSteps}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
              {Math.round(progressValue)}% complete
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
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
          <div className="mb-8">
            <div className="venym-meta mb-3">CLASS :: REGISTRATION</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {stepTitle}
            </h1>
            <p className="mt-2 text-[13px] text-white/50">{stepSubtitle}</p>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30"
                    >
                      Full Name (Optional)
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                      required
                    />
                    <p className="text-[11px] text-white/40 font-mono">
                      Must be at least 8 characters
                    </p>
                  </div>
                </div>

                <div className="border border-white/[0.06] bg-white/[0.02] p-5 rounded-sm">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">
                    What you get
                  </div>
                  <ul className="space-y-2">
                    {[
                      "500 free credits to start",
                      "Full access to all APIs",
                      "No credit card required",
                      "Upgrade anytime"
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-[13px] text-white/70">
                        <CheckCircle className="h-3.5 w-3.5 text-white/50 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!formData.email || !formData.password || formData.password.length < 8}
                  className="venym-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="w-3 h-3 ml-2" />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => updateFormData("planId", plan.id)}
                      className={`relative w-full text-left p-5 rounded-sm border transition-all duration-200 ${
                        formData.planId === plan.id
                          ? "border-white/40 bg-white/[0.04]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2 left-4 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.2em] text-black bg-white px-2 py-0.5 rounded-sm">
                          <Zap className="w-2.5 h-2.5" />
                          Popular
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                            Tier // {plan.id}
                          </div>
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <p className="text-[12px] text-white/50 mt-1">{plan.description}</p>
                          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/70 mt-2">
                            {plan.credits}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-3xl font-bold text-white">${plan.price}</div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">/month</div>
                        </div>
                      </div>
                      {plan.features.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {plan.features.map((feature, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 border border-white/10 px-2 py-0.5 rounded-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => updateFormData("planId", "")}
                    className={`relative w-full text-left p-5 rounded-sm border transition-all duration-200 ${
                      formData.planId === ""
                        ? "border-white/40 bg-white/[0.04]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
                          Tier // free
                        </div>
                        <h3 className="text-xl font-bold text-white">Free Tier</h3>
                        <p className="text-[12px] text-white/50 mt-1">Perfect for testing the waters</p>
                        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/70 mt-2">
                          500 credits/month
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-3xl font-bold text-white">$0</div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">/month</div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={prevStep} className="venym-btn-secondary flex-1">
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Back
                  </button>
                  <button onClick={nextStep} className="venym-btn-primary flex-1">
                    Continue
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30"
                  >
                    Company (Optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                    Primary Use Case
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Content Creation",
                      "E-commerce Intelligence",
                      "Lead Generation",
                      "Market Research",
                      "Data Analysis",
                      "Other"
                    ].map((useCase) => (
                      <button
                        key={useCase}
                        type="button"
                        onClick={() => updateFormData("useCase", useCase)}
                        className={`text-left px-3 py-3 text-[12px] rounded-sm border transition-all duration-150 ${
                          formData.useCase === useCase
                            ? "border-white/40 bg-white/[0.05] text-white"
                            : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {useCase}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={prevStep} className="venym-btn-secondary flex-1">
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Back
                  </button>
                  <button onClick={nextStep} className="venym-btn-primary flex-1">
                    Continue
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm divide-y divide-white/[0.06]">
                  <div className="flex items-center gap-3 p-4">
                    <User className="w-4 h-4 text-white/50 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                        Account
                      </div>
                      <div className="text-[13px] text-white truncate">
                        {formData.fullName || "—"}
                      </div>
                      <div className="text-[12px] text-white/50 truncate">{formData.email}</div>
                    </div>
                  </div>

                  {formData.company && (
                    <div className="flex items-center gap-3 p-4">
                      <Building2 className="w-4 h-4 text-white/50 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                          Company
                        </div>
                        <div className="text-[13px] text-white">{formData.company}</div>
                      </div>
                    </div>
                  )}

                  {formData.useCase && (
                    <div className="flex items-center gap-3 p-4">
                      <Calculator className="w-4 h-4 text-white/50 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                          Use Case
                        </div>
                        <div className="text-[13px] text-white">{formData.useCase}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4">
                    <CreditCard className="w-4 h-4 text-white/50 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                        Plan
                      </div>
                      <div className="text-[13px] text-white">
                        {selectedPlan ? selectedPlan.name : "Free Tier"}
                      </div>
                      <div className="text-[12px] text-white/50">
                        {selectedPlan ? selectedPlan.credits : "500 credits/month"}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/[0.10] rounded-sm">
                    <AlertCircle className="h-3.5 w-3.5 text-white/60 shrink-0" />
                    <span className="text-white/70 text-[12px] font-mono">{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={prevStep} className="venym-btn-secondary flex-1">
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="venym-btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Creating Account
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle className="w-3 h-3 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/[0.06] text-center">
              <p className="text-[12px] text-white/40">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
