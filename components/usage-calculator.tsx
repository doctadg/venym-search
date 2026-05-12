"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calculator, Search, Globe, ArrowRight } from "lucide-react";

const apiCosts = {
  search: { name: "Search", icon: Search, color: "text-white", cost: 2 },
  scrape: { name: "Scrape", icon: Globe, color: "text-white", cost: 5 },
};

const plans = [
  {
    id: "free",
    name: "Free Tier",
    price: 0,
    credits: 500,
    color: "border-white/10 bg-white/[0.02]"
  },
  {
    id: "hobby",
    name: "Hobby",
    price: 9,
    credits: 5000,
    color: "border-white/10 bg-white/[0.02]"
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    credits: 100000,
    color: "border-white/20 bg-white/[0.03]",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    credits: 500000,
    color: "border-white/10 bg-white/[0.02]"
  }
];

interface UsageCalculatorProps {
  onPlanSelect?: (planId: string) => void;
}

export default function UsageCalculator({ onPlanSelect }: UsageCalculatorProps) {
  const [usage, setUsage] = useState({
    search: 1000,
    scrape: 500,
  });

  const totalCredits =
    usage.search * apiCosts.search.cost +
    usage.scrape * apiCosts.scrape.cost;

  const recommendedPlan = plans.find((plan, index) => {
    const nextPlan = plans[index + 1];
    return totalCredits <= plan.credits || (!nextPlan && totalCredits > plan.credits);
  }) || plans[plans.length - 1];

  const updateUsage = (api: keyof typeof usage, value: number[]) => {
    setUsage(prev => ({ ...prev, [api]: value[0] }));
  };

  return (
    <Card className="bg-white/[0.01] border border-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-mono uppercase tracking-[0.2em]">
          <Calculator className="w-4 h-4 text-gray-500" />
          <span className="text-[10px]">Usage Calculator</span>
        </CardTitle>
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">
          Estimate monthly usage → find plan
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {Object.entries(apiCosts).map(([key, api]) => {
            const Icon = api.icon;
            const currentUsage = usage[key as keyof typeof usage];
            const creditsUsed = currentUsage * api.cost;

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${api.color}`} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{api.name}</span>
                    <Badge variant="secondary" className="text-[8px] font-mono bg-white/[0.03] border border-white/5">
                      {api.cost} credits
                    </Badge>
                  </div>
                  <span className="text-[9px] font-mono text-gray-500">{creditsUsed} credits/mo</span>
                </div>
                <Slider
                  value={[currentUsage]}
                  onValueChange={(value) => updateUsage(key as keyof typeof usage, value)}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/5 pt-4">
          <div className="flex justify-between mb-4">
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">Total Credits</span>
            <span className="text-sm font-mono text-white">{totalCredits.toLocaleString()}/mo</span>
          </div>

          <div className="space-y-2">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`flex items-center justify-between p-3 border ${plan.color} ${plan.popular ? 'border-white/20' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em]">{plan.name}</span>
                  {plan.popular && (
                    <Badge className="text-[8px] font-mono bg-white/10 text-white border-0">RECOMMENDED</Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-400">
                    {plan.credits.toLocaleString()} credits
                  </span>
                  <span className="text-sm font-mono text-white ml-3">
                    ${plan.price}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>

          {onPlanSelect && (
            <Button
              onClick={() => onPlanSelect(recommendedPlan.id)}
              className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              {recommendedPlan.name} Plan
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
