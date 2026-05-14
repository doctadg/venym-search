import Link from 'next/link'
import {
  Code,
  Users,
  Server,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  GitBranch,
  Download,
  Settings,
  Globe,
  Database,
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
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION :: N8N</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-rose-400/20 text-rose-300/80">
            Developer Favorite
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Open Source
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
          n8n Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-3xl">
          Build powerful, self-hosted automation workflows with Venym Search and n8n.
          Create custom nodes, deploy on your own infrastructure, and maintain full control over your data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {features.map((feature) => (
          <div key={feature.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <feature.icon className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">{feature.title}</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">{feature.description}</p>
            <div className="space-y-1">
              {feature.benefits.map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                  <span className="text-[12px] text-white/55">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Callout type="success" title="What you'll build">
        Self-hosted automation workflows that search the web, scrape content, conduct research,
        and integrate with your existing tools - all with complete control over your data and infrastructure.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Setup</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Setup Instructions</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">01</span>
              <h3 className="text-[14px] font-medium text-white">Install n8n with Docker</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Deploy n8n with Docker for easy setup and scalability. This configuration includes custom node support.
              </p>

              <CodeBlock
                code={dockerComposeCode}
                language="yaml"
                title="docker-compose.yml"
              />

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-3">Quick Start Commands:</h4>
                <div className="space-y-2">
                  <CodeBlock code="docker-compose up -d" language="bash" />
                  <CodeBlock code="open http://localhost:5678" language="bash" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">02</span>
              <h3 className="text-[14px] font-medium text-white">Install Venym Search Nodes</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Install the custom Venym Search nodes for seamless integration with all APIs.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                  <h4 className="text-[14px] font-medium text-white mb-2">Option A: Community Package</h4>
                  <p className="text-[13px] text-white/55 mb-3">Install from n8n community package registry.</p>
                  <CodeBlock code="npm install n8n-nodes-VENYM_SEARCH" language="bash" />
                </div>
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                  <h4 className="text-[14px] font-medium text-white mb-2">Option B: Manual Installation</h4>
                  <p className="text-[13px] text-white/55 mb-3">Clone and build the nodes yourself.</p>
                  <button className="venym-btn-secondary">
                    <GitBranch className="w-3 h-3 mr-1.5" />
                    GitHub Repository
                  </button>
                </div>
              </div>

              <Callout type="warning">
                Custom nodes require n8n restart after installation.
                Make sure to restart your n8n instance to load the new Venym Search nodes.
              </Callout>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">03</span>
              <h3 className="text-[14px] font-medium text-white">Configure Venym Search Credentials</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Set up your Venym Search API credentials in n8n for secure authentication.
              </p>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Credentials Setup:</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Go to n8n Settings → Credentials</li>
                  <li>Click "Create New" → "Venym Search API"</li>
                  <li>Enter your Venym Search API key</li>
                  <li>Test the connection</li>
                  <li>Save for use across all workflows</li>
                </ol>
              </div>

              <Link href="/docs/quickstart" className="venym-btn-secondary">
                Get Your API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Development</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Custom Node Development</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Learn how to create and customize Venym Search nodes for n8n to fit your specific use cases.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Venym Search Node Structure</h3>
            <CodeBlock
              code={nodeStructureCode}
              language="typescript"
              title="Venym Search Search Node Implementation"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Credentials Configuration</h3>
            <CodeBlock
              code={credentialsCode}
              language="typescript"
              title="Venym Search API Credentials"
            />
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-amber-300/80">Node Development Resources</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-2">
                <Download className="w-4 h-4 text-amber-400/80 mt-0.5" />
                <span className="text-[13px] text-white/65">Download the complete Venym Search node package</span>
              </div>
              <div className="flex items-start gap-2">
                <Code className="w-4 h-4 text-amber-400/80 mt-0.5" />
                <span className="text-[13px] text-white/65">Follow n8n's node development documentation</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-400/80 mt-0.5" />
                <span className="text-[13px] text-white/65">Join the n8n community for support and collaboration</span>
              </div>
              <div className="flex items-start gap-2">
                <GitBranch className="w-4 h-4 text-amber-400/80 mt-0.5" />
                <span className="text-[13px] text-white/65">Contribute improvements back to the community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Nodes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Available Venym Search Nodes</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400/80" />
              <h3 className="text-lg font-semibold text-white">Search Node</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Enhanced web search with real-time results.</p>
              <div className="space-y-2">
                {['Real-time search results', 'Auto-scraping options', 'Contact extraction', 'Social discovery'].map((f) => (
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
              <h3 className="text-lg font-semibold text-white">Scrape Node</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Extract content from any webpage or document.</p>
              <div className="space-y-2">
                {['Text and metadata extraction', 'Image and link discovery', 'JavaScript rendering', 'Custom selectors'].map((f) => (
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
              <Settings className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-lg font-semibold text-white">Research Node</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">AI-powered research and analysis automation.</p>
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
        <div className="venym-meta mb-3">04 · Workflow</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Complete Workflow Example</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Here's a complete n8n workflow that demonstrates automated lead generation using Venym Search nodes.
        </p>

        <CodeBlock
          code={workflowCode}
          language="json"
          title="Lead Generation Workflow"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Workflow Features</h3>
            </div>
            <div className="p-6 space-y-2">
              {['Scheduled execution', 'Contact extraction and filtering', 'CRM integration', 'Team notifications'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Deployment Options</h3>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Self-hosted on your servers</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Docker container deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Kubernetes orchestration</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Team collaboration features</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Self-hosting</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Self-hosting Benefits</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-emerald-300/80">Data Privacy & Control</h3>
            </div>
            <div className="p-6 space-y-3">
              {['All data stays on your infrastructure', 'No third-party data sharing', 'GDPR and compliance friendly', 'Custom security configurations'].map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-sky-300/80">Cost & Performance</h3>
            </div>
            <div className="p-6 space-y-3">
              {['No per-execution fees', 'Unlimited workflow executions', 'Scale based on your needs', 'Optimize for your workloads'].map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400/80" />
            <span className="venym-meta">Start</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Start Building</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Ready to build self-hosted automation? Get your Venym Search API key and deploy n8n.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/quickstart" className="venym-btn-primary">
                Get API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
              <button className="venym-btn-secondary">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                n8n Documentation
              </button>
            </div>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-sky-400/80" />
            <span className="venym-meta">Community</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Community Resources</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Join the community and explore more automation platforms.
            </p>
            <div className="flex gap-2 flex-wrap">
              <button className="venym-btn-secondary">
                <Users className="w-3 h-3 mr-1.5" />
                Discord
              </button>
              <button className="venym-btn-secondary">
                <GitBranch className="w-3 h-3 mr-1.5" />
                GitHub
              </button>
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
