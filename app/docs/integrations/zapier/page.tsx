import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Mail,
  Slack
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Enterprise Ready
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            8,000+ Apps
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Zapier Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Connect Venym Search to 8,000+ apps with no-code automation. Build powerful workflows 
          that search, scrape, and research the web automatically.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold">No-Code Automation</h3>
            </div>
            <p className="text-sm text-gray-600">Connect Venym Search to any app without writing code</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Enterprise Scale</h3>
            </div>
            <p className="text-sm text-gray-600">Handle millions of automation runs with enterprise features</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#efa72d]" />
              <h3 className="font-semibold">Team Collaboration</h3>
            </div>
            <p className="text-sm text-gray-600">Share workflows across teams with role-based permissions</p>
          </CardContent>
        </Card>
      </div>

      <Callout type="success" title="What you'll build">
        By the end of this guide, you'll have automated workflows that can search the web, scrape specific pages, 
        conduct research, and connect that data to any of Zapier's 8,000+ supported applications.
      </Callout>

      {/* Setup Instructions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Setup Instructions</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">1</span>
                Connect Venym Search to Zapier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  First, you'll need to add Venym Search as a custom webhook or use our pre-built Zapier app when available.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Option A: Custom Webhooks (Available Now)</h4>
                  <p className="text-sm text-gray-600 mb-3">Use Venym Search APIs as webhook actions in any Zap.</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#17457c] hover:bg-[#17457c]/90">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Webhook Setup Guide
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Option B: Native Zapier App (Coming Soon)</h4>
                  <p className="text-sm text-gray-600 mb-3">Pre-built triggers and actions for easier setup.</p>
                  <Badge className="bg-blue-100 text-blue-800">In Development</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">2</span>
                Configure Your API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Add your Venym Search API key to Zapier's webhook configuration or app settings.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Security:</strong> Store your API key securely in Zapier's authentication system. 
                        Never include it directly in webhook URLs or automation steps.
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/docs/quickstart">
                  <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                    Get Your API Key
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">3</span>
                Test Your Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create a simple test Zap to ensure Venym Search is working correctly with your setup.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Quick Test Workflow:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Trigger: Manual trigger or schedule</li>
                  <li>Action: Venym Search Search for "test query"</li>
                  <li>Action: Send results to email or Slack</li>
                  <li>Run the test and verify results</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Available Venym Search Actions</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Real-time web search with enhanced results.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Search any topic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Auto-scrape results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Extract contact info</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Social discovery</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Scrape
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Extract content from any webpage.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Extract text content</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Get images & links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Extract metadata</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Handle dynamic content</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">AI-powered research and analysis.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Multi-source research</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Trend analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Content summarization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Sentiment analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Popular Workflow Examples</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {workflowExamples.map((workflow, index) => (
            <Card key={workflow.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#17457c]/10 rounded-lg">
                    <workflow.icon className="w-5 h-5 text-[#17457c]" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{workflow.title}</CardTitle>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Workflow Steps:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                      {workflow.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Connected Apps:</h4>
                    <div className="flex flex-wrap gap-1">
                      {workflow.apps.map((app) => (
                        <Badge key={app} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                    <PlayCircle className="w-3 h-3 mr-2" />
                    Try This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Webhook Configuration Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Trigger Webhook (Incoming Data)</h3>
            <p className="text-gray-600 mb-4">
              Example payload when Venym Search sends data to Zapier via webhook trigger.
            </p>
            <CodeBlock
              code={webhookCode}
              language="json"
              title="Search Results Trigger Payload"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Action Webhook (Outgoing Request)</h3>
            <p className="text-gray-600 mb-4">
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

      {/* Advanced Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Features</h2>
        
        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700">Conditional Logic & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Use Zapier's Filter and Path features to create intelligent workflows:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Filter search results by relevance score or date</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Route high-priority alerts to different channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Apply different actions based on content type</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Handle errors and retry logic automatically</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="text-[#efa72d]">Multi-Step Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Chain multiple Venym Search actions together for complex automation:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Example: Comprehensive Lead Research</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Search for companies in target industry</li>
                  <li>Scrape each company website for contact info</li>
                  <li>Score leads based on criteria</li>
                  <li>Add qualified leads to CRM with research notes</li>
                  <li>Send personalized outreach emails</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing & Limits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Usage & Credits</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Venym Search Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Search</span>
                  <span className="font-semibold">1 credit per search</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scrape</span>
                  <span className="font-semibold">1 credit per page</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">5 credits per research</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto-scraping</span>
                  <span className="font-semibold">+3 credits per page</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Monitor usage in your Venym Search dashboard to optimize automation costs.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zapier Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Free Plan</span>
                  <span className="font-semibold">100 tasks/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starter Plan</span>
                  <span className="font-semibold">750 tasks/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional</span>
                  <span className="font-semibold">2,000+ tasks/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enterprise</span>
                  <span className="font-semibold">Unlimited tasks</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Each Venym Search API call counts as one Zapier task.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[#efa72d]" />
              Start Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ready to automate? Get your Venym Search API key and start building your first Zapier integration.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/quickstart">
                <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90">
                  Get API Key
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Zapier App Store
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#17457c]" />
              More Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore more integration examples and automation workflows.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/integrations/make">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Make.com
                </Button>
              </Link>
              <Link href="/docs/integrations/n8n">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  n8n
                </Button>
              </Link>
              <Link href="/docs/integrations">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  All Integrations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}