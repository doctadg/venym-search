import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Workflow, 
  Bot, 
  Puzzle,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  Zap,
  Database,
  Settings,
  Globe
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
      icon: Bot
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

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Workflow className="w-6 h-6 text-purple-600" />
          </div>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Visual Workflows
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            AI-Enhanced
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Make.com Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Build sophisticated visual workflows that combine Venym Search's web intelligence 
          with Make.com's powerful automation platform and AI capabilities.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Workflow className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Visual Workflow Builder</h3>
            </div>
            <p className="text-sm text-gray-600">Drag-and-drop interface for complex automation logic</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">AI-Powered Workflows</h3>
            </div>
            <p className="text-sm text-gray-600">Integrate OpenAI, Claude, and other AI services seamlessly</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Puzzle className="w-5 h-5 text-[#efa72d]" />
              <h3 className="font-semibold">Advanced Logic</h3>
            </div>
            <p className="text-sm text-gray-600">Conditional paths, loops, and complex data transformations</p>
          </CardContent>
        </Card>
      </div>

      <Callout type="success" title="What you'll build">
        Create intelligent workflows that search the web, analyze content with AI, process data through 
        multiple stages, and deliver insights to your team automatically.
      </Callout>

      {/* Setup Instructions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Setup Instructions</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">1</span>
                Create Venym Search HTTP Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Set up HTTP modules for each Venym Search API endpoint you want to use in your workflows.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Required HTTP Module Configuration:</h4>
                  <CodeBlock
                    code={httpModuleCode}
                    language="json"
                    title="Search HTTP Module Setup"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Authentication</h5>
                    <p className="text-xs text-gray-600">Store your Venym Search API key in Make.com's connection settings for secure reuse across scenarios.</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Dynamic Parameters</h5>
                    <p className="text-xs text-gray-600">Use Make.com variables ({"{{variable}}"}) to make your modules dynamic and reusable.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">2</span>
                Configure API Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create a secure connection for your Venym Search API key in Make.com.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Connection Setup Steps:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Go to Make.com → Connections → Create new connection</li>
                    <li>Choose "Custom" connection type</li>
                    <li>Add your Venym Search API key as a secure parameter</li>
                    <li>Test the connection with a simple API call</li>
                    <li>Save and reuse across all Venym Search modules</li>
                  </ol>
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
                Build Your First Scenario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create a simple workflow to test your Venym Search integration.
                </p>
                <CodeBlock
                  code={scenarioCode}
                  language="json"
                  title="Lead Generation Scenario Example"
                />
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Pro Tip:</strong> Start with a manual trigger to test your workflow, 
                        then switch to scheduled or webhook triggers for automation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Venym Search Modules */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Venym Search API Modules</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Search Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Real-time web search with advanced options.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Enhanced search results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Auto-scraping integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Contact extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Social profile discovery</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  1 credit per search
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Scrape Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Extract content from any webpage or PDF.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Text and metadata extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Image and link discovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">JavaScript rendering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Structured data output</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  1 credit per page
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">AI-powered research and analysis workflows.</p>
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
              <div className="mt-4 pt-4 border-t">
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  5 credits per research
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Workflow Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Workflow Templates</h2>
        
        <div className="space-y-6">
          {workflows.map((workflow, index) => (
            <Card key={workflow.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#17457c]/10 rounded-lg">
                    <workflow.icon className="w-6 h-6 text-[#17457c]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{workflow.title}</CardTitle>
                      <Badge className={workflow.complexity === 'Advanced' ? 'bg-red-100 text-red-800' : 
                                      workflow.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800'}>
                        {workflow.complexity}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{workflow.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {workflow.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Required Modules:</h4>
                    <div className="flex flex-wrap gap-1">
                      {workflow.modules.map((module) => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button size="sm" className="bg-[#17457c] hover:bg-[#17457c]/90">
                    <PlayCircle className="w-3 h-3 mr-2" />
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Integration Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">AI-Enhanced Workflow Example</h2>
        
        <p className="text-gray-600 mb-6">
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

      {/* Error Handling & Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Handling & Best Practices</h2>
        
        <div className="space-y-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-red-700">Robust Error Handling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Implement comprehensive error handling for reliable automation workflows.
              </p>
              <CodeBlock
                code={errorHandlingCode}
                language="json"
                title="Error Handling Configuration"
              />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700">Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Use Make.com's execution limit settings to control costs</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Implement filters to process only relevant data</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Cache frequently accessed data to reduce API calls</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Use parallel processing for independent operations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Monitor Venym Search credit usage in your dashboard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="text-[#efa72d]">Workflow Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Use clear naming conventions for modules and scenarios</span>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Document complex workflows with notes and descriptions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Create reusable templates for common Venym Search patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Use folders to organize related scenarios</span>
                </div>
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
              Ready to create intelligent workflows? Get your Venym Search API key and start building with Make.com.
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
                Make.com Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#17457c]" />
              More Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore other automation platforms and integration options.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/integrations/zapier">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Zapier
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