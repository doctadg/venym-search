import Link from 'next/link'
import {
  Zap,
  Users,
  Building2,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  Globe,
  Database,
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function ZapierIntegrationPage() {

  const webhookCode = `// Trigger example - New search results found
{
  "event": "new_search_results",
  "query": "bitcoin price prediction 2025",
  "timestamp": "2025-01-22T10:30:00Z",
  "results_count": 8,
  "search_results": [
    {
      "title": "Bitcoin Price Prediction 2025: Expert Analysis",
      "url": "https://example.com/bitcoin-analysis",
      "snippet": "Leading crypto analysts predict Bitcoin could reach...",
      "date": "2025-01-21"
    }
  ]
}`

  const actionCode = `// Action example - Send scraped data to Google Sheets
{
  "url": "https://coindesk.com/price/bitcoin",
  "extract_options": ["title", "text", "price"],
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "worksheet": "Bitcoin Data",
  "row_data": {
    "timestamp": "{{current_time}}",
    "price": "{{scraped_price}}",
    "article_title": "{{scraped_title}}",
    "source_url": "{{url}}"
  }
}`

  const workflowExamples = [
    {
      title: "Lead Generation Automation",
      description: "Search for companies → Extract contact info → Add to CRM",
      steps: [
        "Search finds companies by industry/location",
        "Scrape extracts contact information",
        "Auto-populate Salesforce/HubSpot records",
        "Send Slack notifications to sales team"
      ],
      apps: ["Venym Search", "Salesforce", "Slack", "Gmail"],
      icon: Users
    },
    {
      title: "Content Monitoring",
      description: "Monitor brand mentions → Analyze sentiment → Alert team",
      steps: [
        "Daily Search for brand mentions",
        "Filter high-priority mentions",
        "Send alerts via email/Slack"
      ],
      apps: ["Venym Search", "Slack", "Gmail", "Airtable"],
      icon: Globe
    },
    {
      title: "Competitive Intelligence",
      description: "Track competitors → Scrape pricing → Update database",
      steps: [
        "Search for competitor product pages",
        "Scrape extracts pricing data",
        "Compare with historical data",
        "Update competitive analysis sheets"
      ],
      apps: ["Venym Search", "Google Sheets", "Slack", "Zapier"],
      icon: Database
    },
    {
      title: "Market Research",
      description: "Research trends → Compile reports → Share insights",
      steps: [
        "Compile data from multiple sources",
        "Generate automated reports",
        "Share via email/team channels"
      ],
      apps: ["Venym Search", "Google Docs", "Gmail", "Slack"],
      icon: Building2
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION :: ZAPIER</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
            Enterprise Ready
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
            8,000+ Apps
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
          Zapier Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-3xl">
          Connect Venym Search to 8,000+ apps with no-code automation. Build powerful workflows
          that search, scrape, and research the web automatically.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">No-Code Automation</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Connect Venym Search to any app without writing code</p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">Enterprise Scale</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Handle millions of automation runs with enterprise features</p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-violet-400/80" />
            <span className="text-[15px] font-medium text-white">Team Collaboration</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Share workflows across teams with role-based permissions</p>
        </div>
      </div>

      <Callout type="success" title="What you'll build">
        By the end of this guide, you'll have automated workflows that can search the web, scrape specific pages,
        conduct research, and connect that data to any of Zapier's 8,000+ supported applications.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Setup</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Setup Instructions</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">01</span>
              <h3 className="text-[14px] font-medium text-white">Connect Venym Search to Zapier</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                First, you'll need to add Venym Search as a custom webhook or use our pre-built Zapier app when available.
              </p>
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Option A: Custom Webhooks (Available Now)</h4>
                <p className="text-[13px] text-white/55 mb-3">Use Venym Search APIs as webhook actions in any Zap.</p>
                <button className="venym-btn-primary">
                  <ExternalLink className="w-3 h-3 mr-1.5" />
                  Webhook Setup Guide
                </button>
              </div>
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Option B: Native Zapier App (Coming Soon)</h4>
                <p className="text-[13px] text-white/55 mb-3">Pre-built triggers and actions for easier setup.</p>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">In Development</span>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">02</span>
              <h3 className="text-[14px] font-medium text-white">Configure Your API Key</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Add your Venym Search API key to Zapier's webhook configuration or app settings.
              </p>
              <Callout type="warning" title="Security">
                Store your API key securely in Zapier's authentication system.
                Never include it directly in webhook URLs or automation steps.
              </Callout>
              <Link href="/docs/quickstart" className="venym-btn-secondary">
                Get Your API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">03</span>
              <h3 className="text-[14px] font-medium text-white">Test Your Connection</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Create a simple test Zap to ensure Venym Search is working correctly with your setup.
              </p>
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Quick Test Workflow:</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Trigger: Manual trigger or schedule</li>
                  <li>Action: Venym Search Search for "test query"</li>
                  <li>Action: Send results to email or Slack</li>
                  <li>Run the test and verify results</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Actions</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Available Venym Search Actions</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400/80" />
              <h3 className="text-lg font-semibold text-white">Search</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Real-time web search with enhanced results.</p>
              <div className="space-y-2">
                {['Search any topic', 'Auto-scrape results', 'Extract contact info', 'Social discovery'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Database className="w-4 h-4 text-violet-400/80" />
              <h3 className="text-lg font-semibold text-white">Scrape</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Extract content from any webpage.</p>
              <div className="space-y-2">
                {['Extract text content', 'Get images & links', 'Extract metadata', 'Handle dynamic content'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-lg font-semibold text-white">Research</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">AI-powered research and analysis.</p>
              <div className="space-y-2">
                {['Multi-source research', 'Trend analysis', 'Content summarization', 'Sentiment analysis'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Examples</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Popular Workflow Examples</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {workflowExamples.map((workflow) => (
            <div key={workflow.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-start gap-3">
                <workflow.icon className="w-4 h-4 text-white/50 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{workflow.title}</h3>
                  <p className="text-[13px] text-white/55">{workflow.description}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Workflow Steps</h4>
                  <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                    {workflow.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Connected Apps</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {workflow.apps.map((app) => (
                      <span key={app} className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="venym-btn-secondary w-full justify-center">
                  <PlayCircle className="w-3 h-3 mr-1.5" />
                  Try This Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Webhooks</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Webhook Configuration Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Trigger Webhook (Incoming Data)</h3>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Example payload when Venym Search sends data to Zapier via webhook trigger.
            </p>
            <CodeBlock
              code={webhookCode}
              language="json"
              title="Search Results Trigger Payload"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Action Webhook (Outgoing Request)</h3>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Example configuration for sending data from Zapier to Venym Search APIs.
            </p>
            <CodeBlock
              code={actionCode}
              language="json"
              title="Scraping Action Configuration"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Advanced</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Features</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-sky-300/80">Conditional Logic & Filters</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Use Zapier's Filter and Path features to create intelligent workflows:
              </p>
              <ul className="text-[13px] text-white/65 space-y-2">
                {['Filter search results by relevance score or date', 'Route high-priority alerts to different channels', 'Apply different actions based on content type', 'Handle errors and retry logic automatically'].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-amber-300/80">Multi-Step Workflows</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Chain multiple Venym Search actions together for complex automation:
              </p>
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Example: Comprehensive Lead Research</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Search for companies in target industry</li>
                  <li>Scrape each company website for contact info</li>
                  <li>Score leads based on criteria</li>
                  <li>Add qualified leads to CRM with research notes</li>
                  <li>Send personalized outreach emails</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Usage</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Usage & Credits</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Venym Search Credits</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Search</span>
                  <span className="text-[13px] font-medium text-white">1 credit per search</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Scrape</span>
                  <span className="text-[13px] font-medium text-white">1 credit per page</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] font-medium text-white">5 credits per research</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Auto-scraping</span>
                  <span className="text-[13px] font-medium text-white">+3 credits per page</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-[13px] text-white/55">
                  Monitor usage in your Venym Search dashboard to optimize automation costs.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Zapier Limits</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Free Plan</span>
                  <span className="text-[13px] font-medium text-white">100 tasks/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Starter Plan</span>
                  <span className="text-[13px] font-medium text-white">750 tasks/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Professional</span>
                  <span className="text-[13px] font-medium text-white">2,000+ tasks/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Enterprise</span>
                  <span className="text-[13px] font-medium text-white">Unlimited tasks</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-[13px] text-white/55">
                  Each Venym Search API call counts as one Zapier task.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-amber-400/80" />
            <span className="venym-meta">Start</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Start Building</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Ready to automate? Get your Venym Search API key and start building your first Zapier integration.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/quickstart" className="venym-btn-primary">
                Get API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
              <button className="venym-btn-secondary">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                Zapier App Store
              </button>
            </div>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-sky-400/80" />
            <span className="venym-meta">More</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">More Examples</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Explore more integration examples and automation workflows.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/integrations/make" className="venym-btn-secondary">
                Make.com
              </Link>
              <Link href="/docs/integrations/n8n" className="venym-btn-secondary">
                n8n
              </Link>
              <Link href="/docs/integrations" className="venym-btn-secondary">
                All Integrations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
