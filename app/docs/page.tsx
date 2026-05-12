import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Code2, 
  Database, 
  BookOpen,
  ArrowRight,
  Zap,
  Search,
  Globe,
  Target,
  Users,
  CheckCircle
} from 'lucide-react'
import { CodeBlock } from './components/CodeBlock'
import { Callout } from './components/Callout'

export default function DocsHomePage() {
  const quickStartCode = {
    python: `import requests

# Your API key from dashboard
API_KEY = "sk_live_YOUR_API_KEY_key_here"

# Search the web in real-time
response = requests.post(
    "https://www.search.venym.io/api/v1/swiftsearch",
    headers={"Authorization": "Bearer " + API_KEY},
    json={"query": "Bitcoin price 2025", "max_results": 5}
)

results = response.json()
print(f"Found {len(results['search_results'])} results")`,
    javascript: `const axios = require('axios');

// Your API key from dashboard
const API_KEY = 'sk_live_YOUR_API_KEY_key_here';

// Search the web in real-time
const response = await axios.post(
  'https://www.search.venym.io/api/v1/swiftsearch',
  {
    query: 'Bitcoin price 2025',
    max_results: 5
  },
  {
    headers: { 'Authorization": "Bearer': API_KEY }
  }
);

console.log(\`Found \${response.data.search_results.length} results\`);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/swiftsearch \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Bitcoin price 2025",
    "max_results": 5
  }'`
  }

  const apis = [
    {
      name: "SwiftSearch",
      description: "Real-time web search with automatic result extraction",
      icon: Search,
      href: "/docs/api/swiftsearch",
      features: ["Real-time results", "Auto-scraping", "Contact extraction", "Social discovery"],
      color: "text-blue-600"
    },
    {
      name: "ScrapeForge",
      description: "Enterprise web scraping that bypasses any protection", 
      icon: Code2,
      href: "/docs/api/scrapeforge",
      features: ["JavaScript rendering", "Residential proxies", "Link crawling", "Bulk operations"],
      color: "text-green-600"
    },
    {
      name: "DeepDive",
      description: "AI-powered research across multiple sources",
      icon: Database,
      href: "/docs/api/deepdive",
      features: ["Multi-source research", "AI summarization", "Social mentions", "Citation tracking"],
      color: "text-purple-600"
    }
  ]

  const integrations = [
    { name: "Model Context Protocol (MCP)", description: "Universal AI agent integration", popular: true, new: true },
    { name: "LangChain", description: "Custom tools for AI agents", popular: true },
    { name: "n8n", description: "No-code workflow automation", popular: false },
    { name: "Zapier", description: "Connect 5000+ apps", popular: false },
    { name: "OpenAI Assistants", description: "Function calling integration", popular: true },
    { name: "Anthropic Claude", description: "Tool use with Claude models", popular: false },
    { name: "Make.com", description: "Visual workflow builder", popular: false }
  ]

  const guides = [
    {
      title: "Bitcoin Price Tracking Bot",
      description: "Build a real-time cryptocurrency monitoring system",
      href: "/docs/guides/bitcoin-tracking",
      badge: "Featured",
      icon: Target
    },
    {
      title: "E-commerce Price Monitoring", 
      description: "Track competitor prices across multiple sites",
      href: "/docs/guides/ecommerce-monitoring",
      badge: null,
      icon: Globe
    },
    {
      title: "AI-Powered Lead Generation",
      description: "Extract contacts and enrich prospect data",
      href: "/docs/guides/lead-generation", 
      badge: null,
      icon: Users
    }
  ]

  return (
    <div className="max-w-none">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#efa72d]/10 rounded-xl">
            <BookOpen className="w-8 h-8 text-[#efa72d]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#17457c] mb-2">
              Venym Search API Documentation
            </h1>
            <p className="text-xl text-gray-600">
              Enterprise web scraping and search APIs for modern developers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/docs/quickstart">
            <Button size="lg" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
              <Rocket className="w-4 h-4 mr-2" />
              Quick Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/docs/api/swiftsearch">
            <Button variant="outline" size="lg" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
              API Reference
            </Button>
          </Link>
          
          <Link href="/docs/integrations/langchain">
            <Button variant="ghost" size="lg" className="text-gray-600 hover:text-[#17457c]">
              View Integrations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Callout type="success" title="New: Model Context Protocol (MCP) Integration">
          Connect Venym Search to any AI agent with our official MCP server. Universal compatibility with Claude Desktop, Cursor, and more. 
          <Link href="/docs/integrations/mcp" className="text-green-700 underline font-medium ml-1">
            Get started →
          </Link>
        </Callout>
      </div>

      {/* Navigation Quick Links */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Documentation Navigation</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/docs/quickstart">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-[#17457c]">Getting Started</h3>
              </div>
              <p className="text-sm text-gray-600">Quick setup and authentication guide</p>
            </Card>
          </Link>
          
          <Link href="/docs/api/swiftsearch">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-[#17457c]">API Reference</h3>
              </div>
              <p className="text-sm text-gray-600">Complete API documentation and examples</p>
            </Card>
          </Link>
          
          <Link href="/docs/integrations">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-[#17457c]">Integrations</h3>
              </div>
              <p className="text-sm text-gray-600">Connect with your favorite tools</p>
            </Card>
          </Link>
          
          <Link href="/docs/guides/bitcoin-tracking">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-[#17457c]">Guides</h3>
              </div>
              <p className="text-sm text-gray-600">Step-by-step implementation tutorials</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Start Code */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-4">Get Started in 2 Minutes</h2>
        <p className="text-gray-600 mb-6">
          Make your first API call and start scraping the web immediately.
        </p>
        
        <CodeBlock
          multiLanguage={quickStartCode}
          title="Search the web in real-time"
        />
      </div>

      {/* Core APIs */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core APIs</h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {apis.map((api, index) => (
            <Link key={index} href={api.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#efa72d] hover:border-l-[#17457c]">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <api.icon className={`w-6 h-6 ${api.color}`} />
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </div>
                  <p className="text-gray-600 text-sm">{api.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {api.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Integrations */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Popular Integrations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, index) => (
            <Link 
              key={index} 
              href={integration.name.includes('MCP') ? '/docs/integrations/mcp' : `/docs/integrations/${integration.name.toLowerCase().replace(/\s+/g, '-').replace('.com', '')}`}
            >
              <Card className="p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#17457c]">{integration.name}</h3>
                  <div className="flex gap-2">
                    {(integration as any).new && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        New
                      </Badge>
                    )}
                    {integration.popular && (
                      <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Implementation Guides */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Implementation Guides</h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <guide.icon className="w-6 h-6 text-[#efa72d]" />
                    <CardTitle className="text-lg flex-1">{guide.title}</CardTitle>
                    {guide.badge && (
                      <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">
                        {guide.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{guide.description}</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <Card className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 text-white">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">99.3%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">17ms</div>
                <div className="text-sm opacity-90">Avg Latency</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">3,214</div>
                <div className="text-sm opacity-90">Active Developers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">24/7</div>
                <div className="text-sm opacity-90">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#17457c]">
              <Zap className="w-5 h-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/docs/support" className="block">
              <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 Developer Support</span>
              </div>
            </Link>
            <Link href="/docs/status" className="block">
              <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>System Status & Uptime</span>
              </div>
            </Link>
            <Link href="/docs/changelog" className="block">
              <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>API Updates & Changelog</span>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#17457c]">
              <Code2 className="w-5 h-5" />
              Developer Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/docs/postman" className="block">
              <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-4 h-4 text-[#efa72d]" />
                <span>Postman Collection</span>
              </div>
            </Link>
            <Link href="/docs/openapi" className="block">
              <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-4 h-4 text-[#efa72d]" />
                <span>OpenAPI Specification</span>
              </div>
            </Link>
            <Link href="/docs/sdks/python" className="block">
              <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-4 h-4 text-[#efa72d]" />
                <span>Official SDKs</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}