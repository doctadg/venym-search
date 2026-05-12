import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  AlertCircle
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
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#efa72d]/10 rounded-xl">
            <Zap className="w-8 h-8 text-[#efa72d]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#17457c] mb-2">
              Model Context Protocol (MCP) Integration
            </h1>
            <p className="text-xl text-gray-600">
              Connect Venym Search's web scraping and search capabilities to any AI agent
            </p>
          </div>
        </div>

        <Callout type="success" title="Universal AI Agent Support">
          MCP is an open standard that allows AI agents to seamlessly integrate with external tools and data sources. 
          Think of it as USB for AI integrations - one protocol, endless possibilities.
        </Callout>
      </div>

      {/* Quick Start */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Start</h2>
        
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#efa72d]" />
                <CardTitle className="text-lg">1. Install MCP Server</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="bash"
                code={installCode.npm}
                title="Install globally"
              />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#17457c]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#17457c]" />
                <CardTitle className="text-lg">2. Configure API Key</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="bash"
                code="export VENYM_SEARCH_API_KEY=sk_live_YOUR_API_KEY_API_KEY_key_here"
                title="Set environment variable"
              />
              <p className="text-sm text-gray-600 mt-2">
                Get your API key from the <Link href="/dashboard" className="text-[#efa72d] underline">dashboard</Link>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <CardTitle className="text-lg">3. Connect to AI Client</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Add Venym Search to your AI client's MCP configuration
              </p>
              <Link href="#client-setup">
                <Button variant="outline" size="sm">
                  View Setup Guides
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Available Tools</h2>
        <div className="grid gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <tool.icon className="w-6 h-6 text-[#efa72d]" />
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs font-mono">
                    {tool.name}
                  </Badge>
                </div>
                <p className="text-gray-600">{tool.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Example Usage</h4>
                    <CodeBlock
                      language="javascript"
                      code={tool.example}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Client Setup */}
      <div className="mb-16" id="client-setup">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">AI Client Setup</h2>
        
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {clients.map((client, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{client.icon}</span>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                  </div>
                  <Badge 
                    variant={client.status === 'Supported' ? 'default' : 'secondary'}
                    className={client.status === 'Supported' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {client.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{client.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <span className="font-medium">Setup:</span> {client.setup}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Claude Desktop Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Claude Desktop Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Add this configuration to your Claude Desktop MCP settings file:
            </p>
            <CodeBlock
              language="json"
              code={claudeConfig}
              title="claude_desktop_config.json"
            />
          </CardContent>
        </Card>

        {/* Cursor Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Cursor Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Add this to your Cursor settings:
            </p>
            <CodeBlock
              language="json"
              code={cursorConfig}
              title="cursor-settings.json"
            />
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Usage Examples</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ask your AI agent to research any topic comprehensively:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-[#efa72d]">
                <p className="font-medium text-gray-800 mb-2">💬 You:</p>
                <p className="text-gray-700 mb-4">"Research the latest developments in quantum computing and provide me with a comprehensive summary including key players and recent breakthroughs."</p>
                
                <p className="font-medium text-gray-800 mb-2">🤖 AI Agent:</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Find and extract contact information from company websites:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-[#17457c]">
                <p className="font-medium text-gray-800 mb-2">💬 You:</p>
                <p className="text-gray-700 mb-4">"Find contact information for the top 5 AI startups in San Francisco."</p>
                
                <p className="font-medium text-gray-800 mb-2">🤖 AI Agent:</p>
                <p className="text-gray-700">Uses <code>venym_search</code> to find companies, then <code>batch_scrape</code> with contact extraction to gather emails and phone numbers.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Analyze and extract specific information from web pages:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-green-500">
                <p className="font-medium text-gray-800 mb-2">💬 You:</p>
                <p className="text-gray-700 mb-4">"Scrape this product page and extract all the technical specifications and pricing information."</p>
                
                <p className="font-medium text-gray-800 mb-2">🤖 AI Agent:</p>
                <p className="text-gray-700">Uses <code>scrape</code> with custom extraction patterns to pull structured data from complex pages.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Troubleshooting</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Authentication Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">If you're getting authentication errors:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                <li>Verify your API key is correct and active in the <Link href="/dashboard" className="text-[#efa72d] underline">dashboard</Link></li>
                <li>Ensure the <code>VENYM_SEARCH_API_KEY</code> environment variable is set</li>
                <li>Check that your plan has sufficient credits</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Connection Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">If the MCP server won't connect:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                <li>Restart your AI client after configuration changes</li>
                <li>Check that the MCP server is properly installed: <code>npx @VENYM_SEARCH/mcp-server --version</code></li>
                <li>Verify the configuration syntax in your AI client settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Tool Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">If tools are failing:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                <li>Check the Venym Search <Link href="/docs/authentication" className="text-[#efa72d] underline">API status</Link> for any outages</li>
                <li>Verify URLs are accessible and properly formatted</li>
                <li>Reduce batch sizes if hitting rate limits</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 text-white rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg opacity-90 mb-6">
            Our team is here to help you get the most out of Venym Search's MCP integration
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/docs/support">
              <Button variant="secondary" size="lg" className="bg-white text-[#17457c] hover:bg-gray-100">
                <CheckCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="/docs/api/search">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#17457c]">
                <Code2 className="w-4 h-4 mr-2" />
                API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}