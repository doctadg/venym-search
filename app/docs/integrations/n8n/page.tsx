import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Users, 
  Server,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  GitBranch,
  Download,
  Settings,
  Globe,
  Database
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function N8nIntegrationPage() {

  const nodeStructureCode = `// Venym Search Search Node Structure
export class VenymSearchSearch implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Venym Search Search',
    name: 'searchHiveSearch',
    icon: 'file:VENYM_SEARCH.svg',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Venym Search Search API',
    defaults: {
      name: 'Venym Search Search',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'searchHiveApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        placeholder: 'Enter search query',
        description: 'The search query to execute',
        required: true,
      },
      {
        displayName: 'Max Results',
        name: 'maxResults',
        type: 'number',
        default: 10,
        description: 'Maximum number of results to return',
      },
      {
        displayName: 'Auto Scrape',
        name: 'autoScrape',
        type: 'boolean',
        default: false,
        description: 'Whether to automatically scrape result pages',
      },
      {
        displayName: 'Extract Contacts',
        name: 'extractContacts',
        type: 'boolean',
        default: false,
        description: 'Whether to extract contact information',
      }
    ],
  };



  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    
    for (let i = 0; i < items.length; i++) {
      try {
        const query = this.getNodeParameter('query', i) as string;
        const maxResults = this.getNodeParameter('maxResults', i) as number;
        const autoScrape = this.getNodeParameter('autoScrape', i) as boolean;
        const extractContacts = this.getNodeParameter('extractContacts', i) as boolean;

        const credentials = await this.getCredentials('searchHiveApi');
        
        const options: OptionsWithUri = {
          method: 'POST',
          uri: 'https://www.search.venym.io/api/v1/search',
          headers: {
            'Authorization': 'Bearer ' + credentials.apiKey,
            'Content-Type': 'application/json',
          },
          body: {
            query,
            max_results: maxResults,
            auto_scrape: autoScrape,
            extract_contacts: extractContacts,
          },
          json: true,
        };

        const response = await this.helpers.request(options);
        
        returnData.push({
          json: response,
          pairedItem: { item: i },
        });

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: i },
          });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}`

  const credentialsCode = `// Venym Search API Credentials
export class VenymSearchApi implements ICredentialType {
  name = 'searchHiveApi';
  displayName = 'Venym Search API';
  documentationUrl = 'https://docs.VENYM_SEARCH.com';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Your Venym Search API key',
      required: true,
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://www.search.venym.io/api',
      description: 'Base URL for Venym Search API',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'Authorization': 'Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/v1/search',
      method: 'POST',
      body: {
        query: 'test',
        max_results: 1,
      },
    },
  };
}`

  const workflowCode = `{
  "name": "Venym Search Lead Generation Workflow",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "triggerAtHour": 9
            }
          ]
        }
      },
      "id": "f6e1ca5b-1853-4b11-8a81-9a5c7e5e5f52",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "query": "{{$('Set Search Terms').item.json.searchQuery}}",
        "maxResults": 20,
        "extractContacts": true
      },
      "id": "8a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "name": "Venym Search Search",
      "type": "searchHiveSearch",
      "typeVersion": 1,
      "position": [450, 300],
      "credentials": {
        "searchHiveApi": {
          "id": "1",
          "name": "Venym Search API Key"
        }
      }
    },
    {
      "parameters": {
        "values": {
          "searchQuery": "construction companies Seattle",
          "industry": "construction",
          "location": "Seattle"
        }
      },
      "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "name": "Set Search Terms",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.2,
      "position": [650, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "f1e2d3c4-b5a6-9788-3c4d-5e6f7g8h9i0j",
              "leftValue": "={{$json.contact_info.email}}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "exists",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        }
      },
      "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
      "name": "Filter Valid Contacts",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2,
      "position": [850, 300]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "properties": {
          "email": "={{$json.contact_info.email}}",
          "company": "={{$json.title}}",
          "website": "={{$json.link}}",
          "phone": "={{$json.contact_info.phone}}",
          "industry": "={{$('Set Search Terms').item.json.industry}}",
          "location": "={{$('Set Search Terms').item.json.location}}"
        }
      },
      "id": "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
      "name": "Add to CRM",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 2,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "channel": "#sales",
        "text": "🎯 New leads found: {{$('Filter Valid Contacts').item.json.length}} companies in {{$('Set Search Terms').item.json.industry}} industry"
      },
      "id": "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [1250, 300]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Set Search Terms",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Search Terms": {
      "main": [
        [
          {
            "node": "Venym Search Search",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Venym Search Search": {
      "main": [
        [
          {
            "node": "Filter Valid Contacts",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Valid Contacts": {
      "main": [
        [
          {
            "node": "Add to CRM",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Add to CRM": {
      "main": [
        [
          {
            "node": "Slack Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`

  const dockerComposeCode = `version: '3.8'
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password_here
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      # Custom nodes path
      - N8N_CUSTOM_EXTENSIONS=/home/node/custom-nodes
    volumes:
      - n8n_data:/home/node/.n8n
      # Mount custom Venym Search nodes
      - ./custom-nodes:/home/node/custom-nodes
    networks:
      - n8n-network

  # Optional: PostgreSQL for production
  postgres:
    image: postgres:13
    restart: always
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n_password
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n-network

volumes:
  n8n_data:
  postgres_data:

networks:
  n8n-network:
    driver: bridge`

  const features = [
    {
      title: "Custom Venym Search Nodes",
      description: "Pre-built nodes for all Venym Search APIs",
      icon: Code,
      benefits: [
        "Drag-and-drop interface",
        "Built-in error handling",
        "Parameter validation"
      ]
    },
    {
      title: "Self-hosted Freedom",
      description: "Full control over your automation infrastructure",
      icon: Server,
      benefits: [
        "Deploy on your own servers",
        "Complete data privacy",
        "Custom modifications",
        "No vendor lock-in"
      ]
    },
    {
      title: "Developer Community",
      description: "Open-source community and extensibility",
      icon: Users,
      benefits: [
        "Active community support",
        "Custom node development",
        "Regular updates",
        "Free forever"
      ]
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#EA4B71]/10 rounded-lg">
            <Code className="w-6 h-6 text-[#EA4B71]" />
          </div>
          <Badge className="bg-[#EA4B71]/10 text-[#EA4B71] hover:bg-[#EA4B71]/10">
            Developer Favorite
          </Badge>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Open Source
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          n8n Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Build powerful, self-hosted automation workflows with Venym Search and n8n. 
          Create custom nodes, deploy on your own infrastructure, and maintain full control over your data.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {features.map((feature, index) => (
          <Card key={feature.title} className="border-l-4 border-l-[#EA4B71]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-5 h-5 text-[#EA4B71]" />
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
              <div className="space-y-1">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Callout type="success" title="What you'll build">
        Self-hosted automation workflows that search the web, scrape content, conduct research, 
        and integrate with your existing tools - all with complete control over your data and infrastructure.
      </Callout>

      {/* Setup Instructions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Setup Instructions</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">1</span>
                Install n8n with Docker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Deploy n8n with Docker for easy setup and scalability. This configuration includes custom node support.
                </p>
                
                <CodeBlock
                  code={dockerComposeCode}
                  language="yaml"
                  title="docker-compose.yml"
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Start Commands:</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="bg-gray-900 text-green-400 p-2 rounded">$ docker-compose up -d</div>
                    <div className="bg-gray-900 text-green-400 p-2 rounded">$ open http://localhost:5678</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">2</span>
                Install Venym Search Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Install the custom Venym Search nodes for seamless integration with all APIs.
                </p>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Option A: Community Package</h4>
                    <p className="text-sm text-gray-600 mb-2">Install from n8n community package registry.</p>
                    <div className="text-sm font-mono bg-gray-900 text-green-400 p-2 rounded">
                      npm install n8n-nodes-VENYM_SEARCH
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Option B: Manual Installation</h4>
                    <p className="text-sm text-gray-600 mb-2">Clone and build the nodes yourself.</p>
                    <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                      <GitBranch className="w-3 h-3 mr-2" />
                      GitHub Repository
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> Custom nodes require n8n restart after installation. 
                        Make sure to restart your n8n instance to load the new Venym Search nodes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">3</span>
                Configure Venym Search Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Set up your Venym Search API credentials in n8n for secure authentication.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Credentials Setup:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Go to n8n Settings → Credentials</li>
                    <li>Click "Create New" → "Venym Search API"</li>
                    <li>Enter your Venym Search API key</li>
                    <li>Test the connection</li>
                    <li>Save for use across all workflows</li>
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
        </div>
      </div>

      {/* Node Development */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Custom Node Development</h2>
        
        <p className="text-gray-600 mb-6">
          Learn how to create and customize Venym Search nodes for n8n to fit your specific use cases.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Venym Search Node Structure</h3>
            <CodeBlock
              code={nodeStructureCode}
              language="typescript"
              title="Venym Search Search Node Implementation"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Credentials Configuration</h3>
            <CodeBlock
              code={credentialsCode}
              language="typescript"
              title="Venym Search API Credentials"
            />
          </div>

          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="text-[#efa72d]">Node Development Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Download className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Download the complete Venym Search node package</span>
                </div>
                <div className="flex items-start gap-2">
                  <Code className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Follow n8n's node development documentation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Join the n8n community for support and collaboration</span>
                </div>
                <div className="flex items-start gap-2">
                  <GitBranch className="w-4 h-4 text-[#efa72d] mt-0.5" />
                  <span className="text-sm">Contribute improvements back to the community</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Nodes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Available Venym Search Nodes</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Search Node
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Enhanced web search with real-time results.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Real-time search results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Auto-scraping options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Contact extraction</span>
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
                Scrape Node
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Extract content from any webpage or document.</p>
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
                  <span className="text-sm">Custom selectors</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">AI-powered research and analysis automation.</p>
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

      {/* Workflow Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Complete Workflow Example</h2>
        
        <p className="text-gray-600 mb-6">
          Here's a complete n8n workflow that demonstrates automated lead generation using Venym Search nodes.
        </p>
        
        <CodeBlock
          code={workflowCode}
          language="json"
          title="Lead Generation Workflow"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Scheduled execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Contact extraction and filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">CRM integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Team notifications</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deployment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Self-hosted on your servers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Docker container deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Kubernetes orchestration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Team collaboration features</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Self-hosting Benefits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Self-hosting Benefits</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-700">Data Privacy & Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">All data stays on your infrastructure</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">No third-party data sharing</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">GDPR and compliance friendly</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Custom security configurations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700">Cost & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">No per-execution fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Unlimited workflow executions</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Scale based on your needs</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Optimize for your workloads</span>
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
              <Download className="w-5 h-5 text-[#efa72d]" />
              Start Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ready to build self-hosted automation? Get your Venym Search API key and deploy n8n.
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
                n8n Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#17457c]" />
              Community Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Join the community and explore more automation platforms.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                <Users className="w-3 h-3 mr-2" />
                Discord
              </Button>
              <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                <GitBranch className="w-3 h-3 mr-2" />
                GitHub
              </Button>
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