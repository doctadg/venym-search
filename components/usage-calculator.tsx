"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calculator, Search, Globe, Database, ArrowRight } from "lucide-react";

const apiCosts = {
  swiftSearch: { name: "SwiftSearch", icon: Search, color: "text-blue-400", cost: 2 },
  scrapeForge: { name: "ScrapeForge", icon: Globe, color: "text-green-400", cost: 5 },
  deepDive: { name: "DeepDive", icon: Database, color: "text-purple-400", cost: 10 }
};

const plans = [
  {
    id: "free",
    name: "Free Tier",
    price: 0,
    credits: 500,
    color: "border-gray-600 bg-gray-800/30"
  },
  {
    id: "hobby",
    name: "Hobby",
    price: 9,
    credits: 5000,
    color: "border-blue-500 bg-blue-500/10"
  },
  {
    id: "pro", 
    name: "Pro",
    price: 49,
    credits: 100000,
    color: "border-yellow-500 bg-yellow-500/10",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise", 
    price: 199,
    credits: 500000,
    color: "border-purple-500 bg-purple-500/10"
  }
];

interface UsageCalculatorProps {
  onPlanSelect?: (planId: string) => void;
}

export default function UsageCalculator({ onPlanSelect }: UsageCalculatorProps) {
  const [usage, setUsage] = useState({
    swiftSearch: 1000,
    scrapeForge: 500,
    deepDive: 200
  });

  const totalCredits = 
    usage.swiftSearch * apiCosts.swiftSearch.cost +
    usage.scrapeForge * apiCosts.scrapeForge.cost +
    usage.deepDive * apiCosts.deepDive.cost;

  const recommendedPlan = plans.find((plan, index) => {
    const nextPlan = plans[index + 1];
    return totalCredits <= plan.credits || (!nextPlan && totalCredits > plan.credits);
  }) || plans[plans.length - 1];

  const updateUsage = (api: keyof typeof usage, value: number[]) => {
    setUsage(prev => ({ ...prev, [api]: value[0] }));
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="w-6 h-6 text-yellow-400" />
          Usage Calculator
        </CardTitle>
        <p className="text-gray-400">Estimate your monthly usage to find the perfect plan</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Usage Sliders */}
        <div className="space-y-6">
          {Object.entries(apiCosts).map(([key, api]) => {
            const Icon = api.icon;
            const currentUsage = usage[key as keyof typeof usage];
            const creditsUsed = currentUsage * api.cost;
            
            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${api.color}`} />
                    <span className="font-semibold">{api.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {api.cost} credits/call
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{currentUsage.toLocaleString()} calls</div>
                    <div className="text-sm text-gray-400">
                      {creditsUsed.toLocaleString()} credits
                    </div>
                  </div>
                </div>
                <Slider
                  value={[currentUsage]}
                  onValueChange={(value) => updateUsage(key as keyof typeof usage, value)}
                  max={key === 'swiftSearch' ? 25000 : key === 'scrapeForge' ? 15000 : 10000}
                  min={0}
                  step={key === 'swiftSearch' ? 250 : key === 'scrapeForge' ? 125 : 50}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>

        {/* Usage Summary */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
          <h4 className="font-bold mb-3">Monthly Usage Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total API calls:</span>
              <span className="font-semibold">
                {(usage.swiftSearch + usage.scrapeForge + usage.deepDive).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total credits needed:</span>
              <span className="font-semibold text-yellow-400">
                {totalCredits.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated cost:</span>
              <span className="font-semibold">
                ${(totalCredits * 0.0001).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Recommendations */}
        <div className="space-y-4">
          <h4 className="font-bold">Recommended Plans</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plans.map((plan) => {
              const isRecommended = plan.id === recommendedPlan.id;
              const fits = totalCredits <= plan.credits;
              const utilizationRate = Math.min((totalCredits / plan.credits) * 100, 100);
              
              return (
                <div
                  key={plan.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                    isRecommended 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : plan.color
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-bold flex items-center gap-2">
                        {plan.name}
                        {plan.popular && (
                          <Badge className="text-xs bg-orange-500">Popular</Badge>
                        )}
                        {isRecommended && (
                          <Badge className="text-xs bg-yellow-400 text-black">
                            Recommended
                          </Badge>
                        )}
                      </h5>
                      <div className="text-sm text-gray-400">
                        {plan.credits.toLocaleString()} credits/month
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-400">/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Usage Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Usage</span>
                      <span>{Math.round(utilizationRate)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-200 ${
                          utilizationRate > 90 ? 'bg-red-500' :
                          utilizationRate > 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                      />
                    </div>
                  </div>

                  {fits ? (
                    <div className="text-green-400 text-sm font-semibold">
                      ✓ Perfect fit for your usage
                    </div>
                  ) : (
                    <div className="text-red-400 text-sm font-semibold">
                      ⚠ Exceeds plan limits
                    </div>
                  )}

                  {onPlanSelect && (
                    <Button
                      onClick={() => onPlanSelect(plan.id)}
                      variant={isRecommended ? "default" : "outline"}
                      className={`w-full mt-3 ${
                        isRecommended 
                          ? "bg-yellow-400 text-black hover:bg-yellow-300" 
                          : "border-gray-600 text-gray-300 hover:bg-gray-800"
                      }`}
                      size="sm"
                    >
                      Select {plan.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
          <h4 className="font-bold text-blue-400 mb-2">💡 Usage Tips</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Start with a lower plan and upgrade as you scale</li>
            <li>• Monitor usage in your dashboard to optimize costs</li>
            <li>• Consider batching requests to reduce API calls</li>
            <li>• Use caching to avoid repeat calls for same data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}