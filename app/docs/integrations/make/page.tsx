import Link from 'next/link'
import {
  Workflow,
  Bot,
  Puzzle,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  Database,
  Settings,
  Globe,
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function MakeIntegrationPage() {

  const httpModuleCode = `{
  "url": "https://www.search.venym.io/api/v1/search",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer " + "${"{{connection.api_key}}"}",
    "Content-Type": "application/json"
  },
  "body": {
    "query": "${"{{1.search_query}}"}",
    "max_results": "${"{{1.max_results}}"}",
    "auto_scrape": true,
    "extract_contacts": true
  }
}`

  const scenarioCode = `{
  "name": "Lead Generation Workflow",
  "description": "Search for companies and extract contact information",
  "modules": [
    {
      "id": 1,
      "module": "builtin:BasicTrigger",
      "version": 1,
      "parameters": {
        "interval": 60,
        "query": "construction companies Seattle"
      }
    },
    {
      "id": 2,
      "module": "http:ActionSendData",
      "version": 3,
      "parameters": {
        "url": "https://www.search.venym.io/api/v1/search",
        "method": "POST",
        "headers": [
          {
            "name": "Authorization": "Bearer",
            "value": "{{connection.api_key}}"
          }
        ],
        "qs": [],
        "bodyType": "application/json",
        "body": "{{json(parameters)}}"
      }
    },
    {
      "id": 3,
      "module": "json:ParseJSON",
      "version": 1
    },
    {
      "id": 4,
      "module": "array:Iterator",
      "version": 1
    },
    {
      "id": 5,
      "module": "google-sheets:addRow",
      "version": 2,
      "parameters": {
        "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        "values": [
          "{{4.title}}",
          "{{4.link}}",
          "{{4.contact_info.email}}",
          "{{4.contact_info.phone}}",
          "{{formatDate(now; 'YYYY-MM-DD')}}"


        ]
      }
    }
  ]
}`

  const errorHandlingCode = `{
  "modules": [
    {
      "id": "VENYM_SEARCH-request",
      "module": "http:ActionSendData",
      "version": 3,
      "errorHandlers": [
        {
          "error": "*",
          "directives": [
            {
              "type": "retry",
              "count": 3,
              "interval": 5
            },
            {
              "type": "break"
            }
          ]
        }
      ]
    },
    {
      "id": "error-notification",
      "module": "slack:createMessage",
      "version": 2,
      "parameters": {
        "text": "Venym Search API error: {{VENYM_SEARCH-request.error.message}}",
        "channel": "#alerts"
      }
    }
  ]
}`

  const aiWorkflowCode = `// AI-Enhanced Workflow with Make.com AI modules
{
  "name": "Intelligent Content Monitoring",
  "modules": [
    {
      "id": 1,
      "module": "http:Venym Search:Search",
      "parameters": {
        "query": "{{trigger.brand_name}} news",
        "max_results": 10
      }
    },
    {
      "id": 2,
      "module": "openai:createCompletion",
      "version": 1,
      "parameters": {
        "prompt": "Analyze sentiment of this content: {{1.snippet}}",
        "model": "gpt-4",
        "max_tokens": 100
      }
    },
    {
      "id": 3,
      "module": "filter:BasicFilter",
      "version": 1,
      "filter": {
        "conditions": [
          [
            {
              "a": "{{2.choices[].text}}",
              "o": "text:contains",
              "b": "negative"
            }
          ]
        ]
      }
    },
    {
      "id": 4,
      "module": "slack:createMessage",
      "version": 2,
      "parameters": {
        "text": "🚨 Negative mention detected: {{1.title}}\\nSentiment: {{2.choices[].text}}\\nURL: {{1.link}}",
        "channel": "#pr-alerts"
      }
    }
  ]
}`

  const workflows = [
    {
      title: "AI-Powered Research Assistant",
      description: "Automated market research with AI analysis and reporting",
      complexity: "Advanced",
      features: [
        "Multi-source research compilation",
        "AI-powered trend analysis",
        "Automated report generation",
        "Smart insights extraction"
      ],
      icon: Bot,
      modules: ["Venym Search Search", "AI Analysis", "Report Generator"]
    },
    {
      title: "Real-time Competitive Monitoring",
      description: "Track competitors with visual workflow automation",
      complexity: "Intermediate",
      modules: ["Venym Search Search", "Scrape", "Airtable", "Email"],
      features: [
        "Scheduled competitor searches",
        "Price monitoring and alerts",
        "Visual data processing",
        "Automated notifications"
      ],
      icon: Globe
    },
    {
      title: "Lead Generation Pipeline",
      description: "End-to-end lead discovery and qualification workflow",
      complexity: "Beginner",
      modules: ["Venym Search APIs", "Data Processing", "CRM Integration", "Team Notifications"],
      features: [
        "Company discovery automation",
        "Contact information extraction",
        "Lead scoring and filtering",
        "CRM integration"
      ],
      icon: Database
    }
  ]

  const complexityTone = (c: string) =>
    c === 'Advanced' ? 'border-rose-400/20 text-rose-300/80' :
    c === 'Intermediate' ? 'border-amber-400/20 text-amber-300/80' :
    'border-emerald-400/20 text-emerald-300/80'

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION :: MAKE</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-violet-400/20 text-violet-300/80">
            Visual Workflows
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
            AI-Enhanced
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
          Make.com Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-3xl">
          Build sophisticated visual workflows that combine Venym Search's web intelligence
          with Make.com's powerful automation platform and AI capabilities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Workflow className="w-4 h-4 text-violet-400/80" />
            <span className="text-[15px] font-medium text-white">Visual Workflow Builder</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Drag-and-drop interface for complex automation logic</p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">AI-Powered Workflows</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Integrate OpenAI, Claude, and other AI services seamlessly</p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Puzzle className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">Advanced Logic</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Conditional paths, loops, and complex data transformations</p>
        </div>
      </div>

      <Callout type="success" title="What you'll build">
        Create intelligent workflows that search the web, analyze content with AI, process data through
        multiple stages, and deliver insights to your team automatically.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Setup</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Setup Instructions</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">01</span>
              <h3 className="text-[14px] font-medium text-white">Create Venym Search HTTP Modules</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Set up HTTP modules for each Venym Search API endpoint you want to use in your workflows.
              </p>

              <CodeBlock
                code={httpModuleCode}
                language="json"
                title="Search HTTP Module Setup"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-3">
                  <h5 className="text-[14px] font-medium text-white mb-2">Authentication</h5>
                  <p className="text-[12px] text-white/55">Store your Venym Search API key in Make.com's connection settings for secure reuse across scenarios.</p>
                </div>
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-3">
                  <h5 className="text-[14px] font-medium text-white mb-2">Dynamic Parameters</h5>
                  <p className="text-[12px] text-white/55">Use Make.com variables ({"{{variable}}"}) to make your modules dynamic and reusable.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">02</span>
              <h3 className="text-[14px] font-medium text-white">Configure API Authentication</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Create a secure connection for your Venym Search API key in Make.com.
              </p>
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Connection Setup Steps:</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Go to Make.com → Connections → Create new connection</li>
                  <li>Choose "Custom" connection type</li>
                  <li>Add your Venym Search API key as a secure parameter</li>
                  <li>Test the connection with a simple API call</li>
                  <li>Save and reuse across all Venym Search modules</li>
                </ol>
              </div>
              <Link href="/docs/quickstart" className="venym-btn-secondary">
                Get Your API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">03</span>
              <h3 className="text-[14px] font-medium text-white">Build Your First Scenario</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Create a simple workflow to test your Venym Search integration.
              </p>
              <CodeBlock
                code={scenarioCode}
                language="json"
                title="Lead Generation Scenario Example"
              />
              <Callout type="tip">
                Start with a manual trigger to test your workflow,
                then switch to scheduled or webhook triggers for automation.
              </Callout>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Modules</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Venym Search API Modules</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400/80" />
              <h3 className="text-lg font-semibold text-white">Search Module</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Real-time web search with advanced options.</p>
              <div className="space-y-2 mb-4">
                {['Enhanced search results', 'Auto-scraping integration', 'Contact extraction', 'Social profile discovery'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
                  1 credit per search
                </span>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Database className="w-4 h-4 text-violet-400/80" />
              <h3 className="text-lg font-semibold text-white">Scrape Module</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Extract content from any webpage or PDF.</p>
              <div className="space-y-2 mb-4">
                {['Text and metadata extraction', 'Image and link discovery', 'JavaScript rendering', 'Structured data output'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-violet-400/20 text-violet-300/80">
                  1 credit per page
                </span>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-lg font-semibold text-white">Research Module</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">AI-powered research and analysis workflows.</p>
              <div className="space-y-2 mb-4">
                {['Multi-source research', 'Trend analysis', 'Content summarization', 'Sentiment analysis'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
                  5 credits per research
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Templates</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Workflow Templates</h2>

        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-start gap-4">
                <workflow.icon className="w-4 h-4 text-white/50 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{workflow.title}</h3>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${complexityTone(workflow.complexity)}`}>
                      {workflow.complexity}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/55">{workflow.description}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Key Features</h4>
                    <ul className="text-[13px] text-white/65 space-y-1">
                      {workflow.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Required Modules</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(workflow.modules || []).map((module) => (
                        <span key={module} className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                  <button className="venym-btn-primary">
                    <PlayCircle className="w-3 h-3 mr-1.5" />
                    Use Template
                  </button>
                  <button className="venym-btn-secondary">
                    <ExternalLink className="w-3 h-3 mr-1.5" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · AI</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">AI-Enhanced Workflow Example</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Combine Venym Search with Make.com's AI modules for intelligent content processing and analysis.
        </p>

        <CodeBlock
          code={aiWorkflowCode}
          language="json"
          title="Intelligent Content Monitoring with AI"
        />

        <div className="mt-6">
          <Callout type="tip" title="AI Integration Tips">
            Make.com supports OpenAI, Anthropic Claude, Google AI, and other AI services.
            Use these with Venym Search data for sentiment analysis, content summarization,
            trend detection, and automated decision making.
          </Callout>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Handling & Best Practices</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-rose-300/80">Robust Error Handling</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Implement comprehensive error handling for reliable automation workflows.
              </p>
              <CodeBlock
                code={errorHandlingCode}
                language="json"
                title="Error Handling Configuration"
              />
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-sky-300/80">Performance Optimization</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  "Use Make.com's execution limit settings to control costs",
                  'Implement filters to process only relevant data',
                  'Cache frequently accessed data to reduce API calls',
                  'Use parallel processing for independent operations',
                  'Monitor Venym Search credit usage in your dashboard',
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-amber-300/80">Workflow Organization</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  'Use clear naming conventions for modules and scenarios',
                  'Document complex workflows with notes and descriptions',
                  'Create reusable templates for common Venym Search patterns',
                  'Use folders to organize related scenarios',
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Settings className="w-3.5 h-3.5 text-amber-400/80 mt-0.5" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
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
              Ready to create intelligent workflows? Get your Venym Search API key and start building with Make.com.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/quickstart" className="venym-btn-primary">
                Get API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
              <button className="venym-btn-secondary">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                Make.com Templates
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
            <h3 className="text-lg font-semibold text-white mb-3">More Integrations</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Explore other automation platforms and integration options.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/integrations/zapier" className="venym-btn-secondary">
                Zapier
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
