import Link from 'next/link'
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
      tone: 'border-emerald-400/20 text-emerald-300/80',
      icon: Bot,
      href: '/docs/integrations/langchain',
      category: 'AI & Machine Learning',
      features: ['Agent Tools', 'Real-time Search', 'Research Automation']
    },
    {
      name: 'Zapier',
      description: 'Connect Venym Search to 8,000+ apps with no-code automation',
      status: 'Enterprise Ready',
      tone: 'border-sky-400/20 text-sky-300/80',
      icon: Zap,
      href: '/docs/integrations/zapier',
      category: 'Automation Platforms',
      features: ['8,000+ Apps', 'No-code', 'Enterprise Scale']
    },
    {
      name: 'Make.com',
      description: 'Visual workflow automation with advanced AI capabilities',
      status: 'Advanced',
      tone: 'border-violet-400/20 text-violet-300/80',
      icon: Workflow,
      href: '/docs/integrations/make',
      category: 'Automation Platforms',
      features: ['Visual Builder', 'AI-Enhanced', 'Complex Logic']
    },
    {
      name: 'n8n',
      description: 'Open-source workflow automation for developers',
      status: 'Developer Favorite',
      tone: 'border-rose-400/20 text-rose-300/80',
      icon: Code,
      href: '/docs/integrations/n8n',
      category: 'Open Source',
      features: ['Self-hosted', 'Custom Nodes', 'Developer Tools']
    },
    {
      name: 'Pipedream',
      description: 'Serverless automation platform for API integrations',
      status: 'Serverless',
      tone: 'border-amber-400/20 text-amber-300/80',
      icon: Cpu,
      href: '/docs/integrations/pipedream',
      category: 'Developer Platforms',
      features: ['Serverless', '2,700+ APIs', 'Event-driven']
    },
    {
      name: 'Microsoft Power Automate',
      description: 'Enterprise automation within Microsoft ecosystem',
      status: 'Enterprise',
      tone: 'border-sky-400/20 text-sky-300/80',
      icon: Building2,
      href: '/docs/integrations/power-automate',
      category: 'Enterprise',
      features: ['Microsoft 365', 'Enterprise Grade', 'Compliance']
    },
    {
      name: 'GitHub Actions',
      description: 'CI/CD automation with web monitoring capabilities',
      status: 'DevOps',
      tone: 'border-white/10 text-white/60',
      icon: Code,
      href: '/docs/integrations/github-actions',
      category: 'Developer Tools',
      features: ['CI/CD', 'DevOps', 'Automation']
    },
    {
      name: 'Bubble.io',
      description: 'No-code app development with Venym Search data',
      status: 'No-code',
      tone: 'border-violet-400/20 text-violet-300/80',
      icon: Globe,
      href: '/docs/integrations/bubble',
      category: 'No-code Platforms',
      features: ['No-code', 'App Builder', 'Database Integration']
    },
    {
      name: 'Retool',
      description: 'Internal tool development with live web data',
      status: 'Internal Tools',
      tone: 'border-amber-400/20 text-amber-300/80',
      icon: Building2,
      href: '/docs/integrations/retool',
      category: 'Internal Tools',
      features: ['Admin Dashboards', 'Internal Tools', 'Real-time Data']
    },
    {
      name: 'Airtable',
      description: 'Database automation with web scraping workflows',
      status: 'Database',
      tone: 'border-emerald-400/20 text-emerald-300/80',
      icon: Users,
      href: '/docs/integrations/airtable',
      category: 'Productivity',
      features: ['Database', 'Project Management', 'Team Collaboration']
    },
    {
      name: 'OpenClaw',
      description: 'Add web search, scraping & research to your OpenClaw agent with zero dependencies',
      status: 'Official',
      tone: 'border-emerald-400/20 text-emerald-300/80',
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
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATIONS</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
            10+ available
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Integrations
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl mb-6">
          Connect Venym Search to your favorite tools and platforms. From AI agents to automation workflows, bring real-time web data into your existing stack with minimal setup.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link href="/docs/quickstart" className="venym-btn-primary">
            Get API Key
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
          <Link href="https://github.com/VENYM_SEARCH/integrations" className="venym-btn-secondary">
            <ExternalLink className="w-3 h-3 mr-1.5" />
            View Examples
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Categories</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Integration Categories</h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.name} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <category.icon className="w-4 h-4 text-white/50" />
                <h3 className="text-[13px] font-medium text-white">{category.name}</h3>
                <span className="ml-auto text-[10px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                  {category.count}
                </span>
              </div>
              <p className="text-[12px] text-white/55">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Available</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Available Integrations</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <div key={integration.name} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <integration.icon className="w-5 h-5 text-white/50" />
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${integration.tone}`}>
                  {integration.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
              <p className="text-[13px] text-white/55 leading-relaxed mb-4 flex-1">
                {integration.description}
              </p>

              <div className="mb-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Key Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {integration.features.map((feature) => (
                    <span key={feature} className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={integration.href} className="venym-btn-primary flex-1 justify-center">
                  View Docs
                  <ArrowRight className="w-3 h-3 ml-1.5" />
                </Link>
                <Link href={integration.href} className="venym-btn-secondary" aria-label="External">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">Quick Start Guide</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            New to Venym Search? Start with our quickstart guide to get your API key and make your first request.
          </p>
          <Link href="/docs/quickstart" className="venym-btn-secondary">
            Get Started
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">Custom Integration</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Don't see your platform? Build a custom integration using our REST API and comprehensive documentation.
          </p>
          <Link href="/docs/api" className="venym-btn-secondary">
            API Docs
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
