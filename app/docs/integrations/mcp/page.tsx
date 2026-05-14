import Link from 'next/link'
import {
  Code2,
  Download,
  ExternalLink,
  CheckCircle,
  Zap,
  Search,
  Globe,
  Terminal,
  Copy,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function MCPIntegrationPage() {

  const installCode = {
    npm: `npm install -g @VENYM_SEARCH/mcp-server`,
    npx: `npx @VENYM_SEARCH/mcp-server`,
    docker: `docker run -e VENYM_SEARCH_API_KEY=your_key ghcr.io/VENYM_SEARCH/mcp-server`
  }

  const claudeConfig = `{
  "mcpServers": {
    "VENYM_SEARCH": {
      "command": "npx",
      "args": ["@VENYM_SEARCH/mcp-server"],
      "env": {
        "VENYM_SEARCH_API_KEY": "sk_live_YOUR_API_KEY_API_KEY_key_here"
      }
    }
  }
}`

  const cursorConfig = `{
  "mcp": {
    "servers": {
      "VENYM_SEARCH": {
        "command": "VENYM_SEARCH-mcp",
        "env": {
          "VENYM_SEARCH_API_KEY": "sk_live_YOUR_API_KEY_API_KEY_key_here"
        }
      }
    }
  }
}`

  const tools = [
    {
      name: 'venym_search',
      title: 'Search',
      description: 'Real-time web search with optional auto-scraping of top results',
      icon: Search,
      features: ['Real-time search', 'Auto-scraping', 'Contact extraction', 'Social discovery'],
      example: `venym_search({
  query: "latest AI developments 2025",
  auto_scrape_top: 3,
  include_contacts: true
})`
    },
    {
      name: 'scrape',
      title: 'Scrape',
      description: 'Enterprise web scraping with browser rendering',
      icon: Code2,
      features: ['JavaScript rendering', 'Bot detection bypass', 'Custom extraction', 'Timeout control'],
      example: `scrape({
  url: "https://example.com",
  extract: ["title", "text", "links"],
  use_browser: true
})`
    },
    {
      name: 'extract_contacts',
      title: 'Extract Contacts',
      description: 'Extract emails and phone numbers from text',
      icon: Globe,
      features: ['Email detection', 'Phone extraction', 'Pattern matching', 'Source tracking'],
      example: `extract_contacts({
  text: "Contact us at hello@example.com or call (555) 123-4567"
})`
    },
    {
      name: 'batch_scrape',
      title: 'Batch Scrape',
      description: 'Scrape multiple URLs efficiently in batch',
      icon: Terminal,
      features: ['Bulk processing', 'Error handling', 'Contact aggregation', 'Progress tracking'],
      example: `batch_scrape({
  urls: ["https://site1.com", "https://site2.com"],
  include_contacts: true
})`
    }
  ]

  const clients = [
    {
      name: 'Claude Desktop',
      description: 'Native integration with Anthropic\'s Claude Desktop app',
      status: 'Supported',
      setup: 'Add to MCP settings',
      icon: '🤖'
    },
    {
      name: 'Cursor',
      description: 'AI-powered code editor with MCP support',
      status: 'Supported',
      setup: 'Configure in settings',
      icon: '⚡'
    },
    {
      name: 'Continue.dev',
      description: 'Open-source AI coding assistant',
      status: 'Supported',
      setup: 'Add to config.json',
      icon: '🔄'
    },
    {
      name: 'VS Code (MCP Extension)',
      description: 'Visual Studio Code with MCP extension',
      status: 'Coming Soon',
      setup: 'Install extension',
      icon: '📝'
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION :: MCP</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
            Universal
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
          Model Context Protocol (MCP) Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-3xl">
          Connect Venym Search's web scraping and search capabilities to any AI agent.
        </p>

        <Callout type="success" title="Universal AI Agent Support">
          MCP is an open standard that allows AI agents to seamlessly integrate with external tools and data sources.
          Think of it as USB for AI integrations - one protocol, endless possibilities.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Start</h2>

        <div className="grid gap-4 lg:grid-cols-3 mb-8">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white/50" />
              <span className="venym-meta">Step 01</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Install MCP Server</h3>
              <CodeBlock
                language="bash"
                code={installCode.npm}
                title="Install globally"
              />
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-white/50" />
              <span className="venym-meta">Step 02</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Configure API Key</h3>
              <CodeBlock
                language="bash"
                code="export VENYM_SEARCH_API_KEY=sk_live_YOUR_API_KEY_API_KEY_key_here"
                title="Set environment variable"
              />
              <p className="text-[13px] text-white/55 mt-3">
                Get your API key from the <Link href="/dashboard" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">dashboard</Link>
              </p>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="venym-meta">Step 03</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Connect to AI Client</h3>
              <p className="text-[13px] text-white/55 mb-4 leading-relaxed">
                Add Venym Search to your AI client's MCP configuration
              </p>
              <Link href="#client-setup" className="venym-btn-secondary">
                View Setup Guides
                <ExternalLink className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Tools</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Available Tools</h2>
        <div className="grid gap-4">
          {tools.map((tool, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                <tool.icon className="w-4 h-4 text-white/50" />
                <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
                  {tool.name}
                </span>
              </div>
              <div className="p-6">
                <p className="text-[14px] text-white/55 leading-relaxed mb-6">{tool.description}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[14px] font-medium text-white mb-3">Features</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.features.map((feature, idx) => (
                        <span key={idx} className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-white mb-3">Example Usage</h4>
                    <CodeBlock
                      language="javascript"
                      code={tool.example}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12" id="client-setup">
        <div className="venym-meta mb-3">03 · Clients</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">AI Client Setup</h2>

        <div className="grid gap-4 lg:grid-cols-2 mb-8">
          {clients.map((client, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{client.icon}</span>
                  <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${client.status === 'Supported' ? 'border-emerald-400/20 text-emerald-300/80' : 'border-white/10 text-white/60'}`}>
                  {client.status}
                </span>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed mb-3">{client.description}</p>
              <p className="text-[13px] text-white/65">
                <span className="text-white/80 font-medium">Setup:</span> {client.setup}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm mb-4">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <Code2 className="w-4 h-4 text-white/50" />
            <span className="venym-meta">Claude Desktop Configuration</span>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Add this configuration to your Claude Desktop MCP settings file:
            </p>
            <CodeBlock
              language="json"
              code={claudeConfig}
              title="claude_desktop_config.json"
            />
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-white/50" />
            <span className="venym-meta">Cursor Configuration</span>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Add this to your Cursor settings:
            </p>
            <CodeBlock
              language="json"
              code={cursorConfig}
              title="cursor-settings.json"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Examples</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Usage Examples</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Research Assistant</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Ask your AI agent to research any topic comprehensively:
              </p>
              <div className="border-l-2 border-white/15 bg-white/[0.02] p-4 rounded-sm">
                <p className="text-[13px] font-medium text-white/80 mb-2">You:</p>
                <p className="text-[13px] text-white/65 mb-4">"Research the latest developments in quantum computing and provide me with a comprehensive summary including key players and recent breakthroughs."</p>

                <p className="text-[13px] font-medium text-white/80 mb-2">AI Agent:</p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Lead Generation</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Find and extract contact information from company websites:
              </p>
              <div className="border-l-2 border-white/15 bg-white/[0.02] p-4 rounded-sm">
                <p className="text-[13px] font-medium text-white/80 mb-2">You:</p>
                <p className="text-[13px] text-white/65 mb-4">"Find contact information for the top 5 AI startups in San Francisco."</p>

                <p className="text-[13px] font-medium text-white/80 mb-2">AI Agent:</p>
                <p className="text-[13px] text-white/65">Uses <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">venym_search</code> to find companies, then <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">batch_scrape</code> with contact extraction to gather emails and phone numbers.</p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Content Analysis</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Analyze and extract specific information from web pages:
              </p>
              <div className="border-l-2 border-white/15 bg-white/[0.02] p-4 rounded-sm">
                <p className="text-[13px] font-medium text-white/80 mb-2">You:</p>
                <p className="text-[13px] text-white/65 mb-4">"Scrape this product page and extract all the technical specifications and pricing information."</p>

                <p className="text-[13px] font-medium text-white/80 mb-2">AI Agent:</p>
                <p className="text-[13px] text-white/65">Uses <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">scrape</code> with custom extraction patterns to pull structured data from complex pages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Troubleshooting</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Troubleshooting</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-[14px] font-medium text-white">Authentication Issues</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-3">If you're getting authentication errors:</p>
              <ul className="list-disc pl-6 space-y-1 text-[13px] text-white/55">
                <li>Verify your API key is correct and active in the <Link href="/dashboard" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">dashboard</Link></li>
                <li>Ensure the <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">VENYM_SEARCH_API_KEY</code> environment variable is set</li>
                <li>Check that your plan has sufficient credits</li>
              </ul>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-[14px] font-medium text-white">Connection Issues</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-3">If the MCP server won't connect:</p>
              <ul className="list-disc pl-6 space-y-1 text-[13px] text-white/55">
                <li>Restart your AI client after configuration changes</li>
                <li>Check that the MCP server is properly installed: <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">npx @VENYM_SEARCH/mcp-server --version</code></li>
                <li>Verify the configuration syntax in your AI client settings</li>
              </ul>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-[14px] font-medium text-white">Tool Errors</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-3">If tools are failing:</p>
              <ul className="list-disc pl-6 space-y-1 text-[13px] text-white/55">
                <li>Check the Venym Search <Link href="/docs/authentication" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">API status</Link> for any outages</li>
                <li>Verify URLs are accessible and properly formatted</li>
                <li>Reduce batch sizes if hitting rate limits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-3">Need Help?</h2>
          <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-2xl mx-auto">
            Our team is here to help you get the most out of Venym Search's MCP integration
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/docs/support" className="venym-btn-primary">
              Contact Support
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
            <Link href="/docs/api/search" className="venym-btn-secondary">
              API Documentation
              <Code2 className="w-3 h-3 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
