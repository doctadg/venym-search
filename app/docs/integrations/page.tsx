import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  Bot, 
  Workflow,
  Code,
  Building2,
  Users,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Puzzle,
  Globe,
  Cpu
} from 'lucide-react'

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'LangChain',
      description: 'Build AI agents with real-time web search capabilities',
      status: 'Popular',
      statusColor: 'bg-green-100 text-green-800',
      icon: Bot,
      href: '/docs/integrations/langchain',
      category: 'AI & Machine Learning',
      features: ['Agent Tools', 'Real-time Search', 'Research Automation']
    },
    {
      name: 'Zapier',
      description: 'Connect Venym Search to 8,000+ apps with no-code automation',
      status: 'Enterprise Ready',
      statusColor: 'bg-blue-100 text-blue-800',
      icon: Zap,
      href: '/docs/integrations/zapier',
      category: 'Automation Platforms',
      features: ['8,000+ Apps', 'No-code', 'Enterprise Scale']
    },
    {
      name: 'Make.com',
      description: 'Visual workflow automation with advanced AI capabilities',
      status: 'Advanced',
      statusColor: 'bg-purple-100 text-purple-800',
      icon: Workflow,
      href: '/docs/integrations/make',
      category: 'Automation Platforms',
      features: ['Visual Builder', 'AI-Enhanced', 'Complex Logic']
    },
    {
      name: 'n8n',
      description: 'Open-source workflow automation for developers',
      status: 'Developer Favorite',
      statusColor: 'bg-[#EA4B71]/10 text-[#EA4B71]',
      icon: Code,
      href: '/docs/integrations/n8n',
      category: 'Open Source',
      features: ['Self-hosted', 'Custom Nodes', 'Developer Tools']
    },
    {
      name: 'Pipedream',
      description: 'Serverless automation platform for API integrations',
      status: 'Serverless',
      statusColor: 'bg-orange-100 text-orange-800',
      icon: Cpu,
      href: '/docs/integrations/pipedream',
      category: 'Developer Platforms',
      features: ['Serverless', '2,700+ APIs', 'Event-driven']
    },
    {
      name: 'Microsoft Power Automate',
      description: 'Enterprise automation within Microsoft ecosystem',
      status: 'Enterprise',
      statusColor: 'bg-blue-100 text-blue-800',
      icon: Building2,
      href: '/docs/integrations/power-automate',
      category: 'Enterprise',
      features: ['Microsoft 365', 'Enterprise Grade', 'Compliance']
    },
    {
      name: 'GitHub Actions',
      description: 'CI/CD automation with web monitoring capabilities',
      status: 'DevOps',
      statusColor: 'bg-gray-100 text-gray-800',
      icon: Code,
      href: '/docs/integrations/github-actions',
      category: 'Developer Tools',
      features: ['CI/CD', 'DevOps', 'Automation']
    },
    {
      name: 'Bubble.io',
      description: 'No-code app development with Venym Search data',
      status: 'No-code',
      statusColor: 'bg-indigo-100 text-indigo-800',
      icon: Globe,
      href: '/docs/integrations/bubble',
      category: 'No-code Platforms',
      features: ['No-code', 'App Builder', 'Database Integration']
    },
    {
      name: 'Retool',
      description: 'Internal tool development with live web data',
      status: 'Internal Tools',
      statusColor: 'bg-yellow-100 text-yellow-800',
      icon: Building2,
      href: '/docs/integrations/retool',
      category: 'Internal Tools',
      features: ['Admin Dashboards', 'Internal Tools', 'Real-time Data']
    },
    {
      name: 'Airtable',
      description: 'Database automation with web scraping workflows',
      status: 'Database',
      statusColor: 'bg-teal-100 text-teal-800',
      icon: Users,
      href: '/docs/integrations/airtable',
      category: 'Productivity',
      features: ['Database', 'Project Management', 'Team Collaboration']
    },
    {
      name: 'OpenClaw',
      description: 'Add web search, scraping & research to your OpenClaw agent with zero dependencies',
      status: 'Official',
      statusColor: 'bg-green-100 text-green-800',
      icon: Bot,
      href: '/docs/integrations/openclaw',
      category: 'AI & Machine Learning',
      features: ['Bash Scripts', 'Zero Deps', 'LLM-Optimized']
    }
  ]

  const categories = [
    { name: 'AI & Machine Learning', count: 2, icon: Bot, description: 'AI agents and LLM integrations' },
    { name: 'Automation Platforms', count: 2, icon: Zap, description: 'No-code automation tools' },
    { name: 'Developer Platforms', count: 2, icon: Code, description: 'API-first development tools' },
    { name: 'Enterprise', count: 1, icon: Building2, description: 'Enterprise-grade solutions' },
    { name: 'No-code Platforms', count: 1, icon: Puzzle, description: 'Visual app builders' },
    { name: 'Open Source', count: 1, icon: Users, description: 'Community-driven tools' },
    { name: 'Developer Tools', count: 1, icon: Code, description: 'CI/CD and DevOps tools' },
    { name: 'Internal Tools', count: 1, icon: Building2, description: 'Admin and operations dashboards' }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#17457c]/10 rounded-lg">
            <Puzzle className="w-6 h-6 text-[#17457c]" />
          </div>
          <Badge className="bg-[#17457c]/10 text-[#17457c] hover:bg-[#17457c]/10">
            10+ Integrations
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Integrations
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-6">
          Connect Venym Search to your favorite tools and platforms. From AI agents to automation workflows, 
          bring real-time web data into your existing stack with minimal setup.
        </p>

        <div className="flex gap-4">
          <Link href="/docs/quickstart">
            <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90">
              Get API Key
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="https://github.com/VENYM_SEARCH/integrations">
            <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Examples
            </Button>
          </Link>
        </div>
      </div>

      {/* Integration Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Integration Categories</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <category.icon className="w-5 h-5 text-[#17457c]" />
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {category.count}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Available Integrations</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.name} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#17457c]/10 transition-colors">
                    <integration.icon className="w-5 h-5 text-[#17457c]" />
                  </div>
                  <Badge className={integration.statusColor}>
                    {integration.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {integration.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={integration.href} className="flex-1">
                    <Button size="sm" className="w-full bg-[#17457c] hover:bg-[#17457c]/90">
                      View Docs
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#efa72d]" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              New to Venym Search? Start with our quickstart guide to get your API key and make your first request.
            </p>
            <Link href="/docs/quickstart">
              <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#17457c]" />
              Custom Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Don't see your platform? Build a custom integration using our REST API and comprehensive documentation.
            </p>
            <Link href="/docs/api">
              <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                API Docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}