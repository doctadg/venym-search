import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    title: "AI Engineer",
    company: "DataForge AI", 
    content: "SearchHive's APIs are brutal in the best way. SwiftSearch gives me structured data that would take hours to scrape manually. My AI agents are finally connected to real-time web data.",
    rating: 5,
    useCase: "AI Agent Development"
  },
  {
    name: "Marcus Rodriguez",
    title: "Founder",
    company: "EcomIntel",
    content: "ScrapeForge handles JavaScript-heavy sites that other scrapers can't touch. We're monitoring 10k+ product pages daily and the data quality is incredible.",
    rating: 5,
    useCase: "E-commerce Intelligence"
  },
  {
    name: "Dr. Emily Watson",
    title: "Research Director", 
    company: "TrendScope",
    content: "DeepDive's enrichment capabilities transformed our market research. We're getting insights from raw data that would have taken weeks to analyze manually.",
    rating: 5,
    useCase: "Market Research"
  },
  {
    name: "Alex Kim",
    title: "CTO",
    company: "LeadGen Pro",
    content: "The credit system is genius - we can scale up during campaigns and scale down during quiet periods. No more paying for unused capacity.",
    rating: 5,
    useCase: "Lead Generation"
  },
  {
    name: "Jordan Blake",
    title: "Product Manager",
    company: "ContentAI",
    content: "Integration took less than an hour. The APIs are well-documented and the data format is consistent. Our content pipeline has never been more reliable.",
    rating: 5,
    useCase: "Content Creation"
  },
  {
    name: "Rachel Park",
    title: "Data Scientist",
    company: "FinTech Analytics",
    content: "We're processing millions of data points monthly. SearchHive's reliability and speed keep our real-time dashboards running smooth.",
    rating: 5,
    useCase: "Financial Analytics"
  }
];

const stats = [
  { label: "API Calls Processed", value: "2.3B+", description: "This month alone" },
  { label: "Active Developers", value: "3,214+", description: "And growing daily" }, 
  { label: "Uptime", value: "99.9%", description: "Reliable when you need it" },
  { label: "Avg Response Time", value: "<200ms", description: "Lightning fast" }
];

export default function TestimonialsSection() {
  return (
    <div className="py-16 bg-gray-900/20">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by developers who demand
            <span className="text-yellow-400"> brutal performance</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of developers building the next generation of AI-powered applications
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-yellow-400/30" />
                  <p className="text-gray-300 text-sm leading-relaxed pl-4">
                    {testimonial.content}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.useCase}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}