import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Cpu, 
  Zap, 
  Code,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  Globe,
  Database,
  Settings,
  Bot
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function PipedreamIntegrationPage() {
  const componentCode = `import { axios } from "@pipedream/platform";



export default defineComponent({
  name: "Venym Search Search",
  description: "Search the web with enhanced results using Venym Search",
  version: "0.1.0",
  type: "action",
  props: {
    VENYM_SEARCH: {
      type: "app",
      app: "VENYM_SEARCH",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "The search query to execute",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      default: 10,
      min: 1,
      max: 50,
    },
    autoScrape: {
      type: "boolean",
      label: "Auto Scrape",
      description: "Automatically scrape result pages",
      default: false,
    },
    extractContacts: {
      type: "boolean",
      label: "Extract Contacts",
      description: "Extract contact information from results",
      default: false,
    },
  },
  async run({ steps, $ }) {
    const { query, maxResults, autoScrape, extractContacts } = this;
    
    const response = await axios($, {
      method: "POST",
      url: "https://www.search.venym.io/api/v1/search",
      headers: {
        "Authorization": "Bearer " + this.VENYM_SEARCH.$auth.api_key,
        "Content-Type": "application/json",
      },
      data: {
        query,
        max_results: maxResults,
        auto_scrape: autoScrape,
        extract_contacts: extractContacts,
      },
    });

    $.export("$summary", \`Found \${response.data.search_results?.length || 0} results for "\${query}"\`);
    
    return response.data;
  },
});`

  const workflowCode = `import { defineComponent } from "@pipedream/platform";

export default defineComponent({
  name: "Lead Generation Pipeline",
  description: "Automated lead discovery and CRM integration",
  version: "0.1.0",
  async run({ steps, $ }) {
    // Step 1: Search for companies
    const searchResults = await this.VENYM_SEARCH.search({
      query: "construction companies Seattle",
      maxResults: 20,
      extractContacts: true,
    });

    // Step 2: Filter valid leads
    const validLeads = searchResults.search_results.filter(result => 
      result.contact_info?.email && 
      !result.contact_info.email.includes('noreply')
    );

    // Step 3: Enrich with additional data
    const enrichedLeads = await Promise.all(
      validLeads.map(async (lead) => {
        const scrapeResult = await this.VENYM_SEARCH.scrape({
          url: lead.link,
          extractOptions: ["title", "text", "metadata"]
        });
        
        return {
          ...lead,
          company_size: this.extractCompanySize(scrapeResult.primary_content?.text),
          technology_stack: this.extractTechStack(scrapeResult.primary_content?.text),
          scraped_at: new Date().toISOString(),
        };
      })
    );

    // Step 4: Add to CRM
    const crmResults = await Promise.all(
      enrichedLeads.map(async (lead) => {
        return await this.hubspot.createContact({
          email: lead.contact_info.email,
          company: lead.title,
          website: lead.link,
          phone: lead.contact_info.phone,
          lead_source: "Venym Search Automation",
          company_size: lead.company_size,
        });
      })
    );

    // Step 5: Send notification
    await this.slack.sendMessage({
      channel: "#sales",
      text: \`🎯 Found \${enrichedLeads.length} new qualified leads in construction industry\`,
      attachments: [{
        color: "good",
        fields: [
          {
            title: "Companies Found",
            value: enrichedLeads.length.toString(),
            short: true
          },
          {
            title: "With Contact Info",
            value: enrichedLeads.filter(l => l.contact_info?.email).length.toString(),
            short: true
          }
        ]
      }]
    });

    $.export("$summary", \`Processed \${enrichedLeads.length} leads successfully\`);
    return {
      leads: enrichedLeads,
      crm_results: crmResults,
      processed_at: new Date().toISOString()
    };
  },

  extractCompanySize(text) {
    if (!text) return "Unknown";
    const sizeIndicators = {
      "startup": ["startup", "founded", "early stage"],
      "small": ["small business", "10-50 employees", "team of"],
      "medium": ["growing company", "50-200 employees", "established"],
      "large": ["enterprise", "500+ employees", "fortune", "publicly traded"]
    };
    
    for (const [size, indicators] of Object.entries(sizeIndicators)) {
      if (indicators.some(indicator => text.toLowerCase().includes(indicator))) {
        return size;
      }
    }
    return "Unknown";
  },

  extractTechStack(text) {
    if (!text) return [];
    const technologies = ["WordPress", "React", "Angular", "Vue", "Shopify", "Salesforce", "HubSpot"];
    return technologies.filter(tech => 
      text.toLowerCase().includes(tech.toLowerCase())
    );
  }
});`

  const authCode = `// VENYM_SEARCH.app.mjs
export default {
  type: "app",
  app: "VENYM_SEARCH",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "Enter your search query",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results (1-50)",
      min: 1,
      max: 50,
      default: 10,
    }
  },
  methods: {
    _baseUrl() {
      return "https://www.search.venym.io/api";
    },
    _headers() {
      return {
        "Authorization": "Bearer " + this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({ $ = this, path, ...opts }) {
      return await axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    async search(opts = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/v1/search",
        ...opts,
      });
    },
    async scrape(opts = {}) {
      return await this._makeRequest({
        method: "POST", 
        path: "/v1/scrape",
        ...opts,
      });
    },
    async research(opts = {}) {
      return await this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};`

  const triggerCode = `export default defineComponent({
  name: "Venym Search Webhook Trigger",
  description: "Trigger workflow when Venym Search finds new results",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    VENYM_SEARCH: {
      type: "app", 
      app: "VENYM_SEARCH",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Query to monitor for new results",
    },
    checkInterval: {
      type: "integer",
      label: "Check Interval (minutes)",
      description: "How often to check for new results",
      default: 60,
      min: 5,
    },
  },
  hooks: {
    async activate() {
      // Store the last check timestamp
      this.db.set("lastCheck", Date.now());
    },
  },
  async run({ body, headers }) {
    const lastCheck = this.db.get("lastCheck") || 0;
    const now = Date.now();
    
    // Only run if enough time has passed
    if (now - lastCheck < this.checkInterval * 60 * 1000) {
      return;
    }

    try {
      const results = await this.VENYM_SEARCH.search({
        query: this.query,
        maxResults: 20,
      });

      // Filter results newer than last check
      const newResults = results.search_results.filter(result => {
        const resultDate = new Date(result.date || 0).getTime();
        return resultDate > lastCheck;
      });

      if (newResults.length > 0) {
        this.db.set("lastCheck", now);
        
        this.$emit({
          query: this.query,
          new_results: newResults,
          total_found: newResults.length,
          timestamp: new Date().toISOString(),
        }, {
          id: \`\${this.query}-\${now}\`,
          summary: \`Found \${newResults.length} new results for "\${this.query}"\`,
          ts: now,
        });
      }
    } catch (error) {
      console.error("Venym Search trigger error:", error);
    }
  },
});`

  const features = [
    {
      title: "Serverless Components",
      description: "Pre-built Venym Search components for instant integration",
      icon: Cpu,
      benefits: [
        "No server management",
        "Auto-scaling execution",
        "Pay-per-use pricing",
        "Global edge deployment"
      ]
    },
    {
      title: "Event-Driven Architecture",
      description: "React to web data changes in real-time",
      icon: Zap,
      benefits: [
        "Webhook triggers",
        "Real-time monitoring",
        "Instant notifications",
        "Conditional execution"
      ]
    },
    {
      title: "Developer Experience",
      description: "Code-first platform with powerful abstractions",
      icon: Code,
      benefits: [
        "TypeScript/JavaScript",
        "Built-in testing",
        "Version control",
        "Collaborative development"
      ]
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Cpu className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Serverless
          </Badge>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            2,700+ APIs
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Pipedream Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Build serverless automation workflows with Venym Search and Pipedream. 
          Create event-driven, scalable integrations that respond to web data changes in real-time.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {features.map((feature, index) => (
          <Card key={feature.title} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-5 h-5 text-blue-500" />
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
        Serverless workflows that monitor web data, trigger on changes, process information with AI, 
        and integrate with thousands of apps - all without managing infrastructure.
      </Callout>

      {/* Setup Instructions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Setup Instructions</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">1</span>
                Create Venym Search App Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Configure Venym Search as a custom app in Pipedream for reusable authentication and methods.
                </p>
                
                <CodeBlock
                  code={authCode}
                  language="javascript"
                  title="Venym Search App Configuration"
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Authentication Setup:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Create new app in Pipedream Apps directory</li>
                    <li>Add API key authentication method</li>
                    <li>Define reusable methods for all Venym Search APIs</li>
                    <li>Test connection with sample requests</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">2</span>
                Build Venym Search Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create reusable components for each Venym Search API that can be used across workflows.
                </p>
                
                <CodeBlock
                  code={componentCode}
                  language="javascript"
                  title="Search Component"
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Component Benefits</h5>
                    <p className="text-xs text-gray-600">Reusable across workflows, built-in validation, consistent error handling, and shared authentication.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Publishing</h5>
                    <p className="text-xs text-gray-600">Publish to Pipedream registry for community use or keep private for your organization.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">3</span>
                Configure API Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Set up secure authentication for Venym Search API in your Pipedream account.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Authentication Steps:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Go to Pipedream → Accounts → Add Account</li>
                    <li>Select "Venym Search" app (custom or published)</li>
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

      {/* Component Library */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Venym Search Component Library</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Search Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Enhanced web search with real-time results.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Real-time search execution</span>
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
                  <span className="text-sm">Social discovery</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Scrape Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Extract content from any webpage or document.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Content extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">JavaScript rendering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Custom selectors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Metadata extraction</span>
                </div>
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

      {/* Advanced Workflow Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Workflow Example</h2>
        
        <p className="text-gray-600 mb-6">
          Here's a complete serverless workflow that demonstrates intelligent lead generation with multiple Venym Search APIs.
        </p>
        
        <CodeBlock
          code={workflowCode}
          language="javascript"
          title="Intelligent Lead Generation Pipeline"
        />

        <div className="mt-6">
          <Callout type="tip" title="Serverless Benefits">
            This workflow automatically scales based on demand, only charges for execution time, 
            and can handle millions of events without infrastructure management.
          </Callout>
        </div>
      </div>

      {/* Event-Driven Triggers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Event-Driven Triggers</h2>
        
        <p className="text-gray-600 mb-6">
          Create triggers that monitor web data and automatically execute workflows when conditions are met.
        </p>
        
        <CodeBlock
          code={triggerCode}
          language="javascript"
          title="Venym Search Monitoring Trigger"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trigger Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Webhook triggers from external systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Scheduled interval monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Database change detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Web data change monitoring</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Brand mention monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Competitor price tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">News and trend detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Lead generation automation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Best Practices</h2>
        
        <div className="space-y-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-700">Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Use async/await for parallel API calls</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Implement proper error handling and retries</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Cache frequently accessed data</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Use Pipedream's built-in deduplication</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700">Cost Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Monitor Venym Search credit usage</span>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Set execution limits in Pipedream</span>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Use filters to process only relevant data</span>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Optimize polling intervals</span>
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
              Ready for serverless automation? Get your Venym Search API key and start building with Pipedream.
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
                Pipedream Registry
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
              Explore other automation platforms and developer tools.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/integrations/zapier">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Zapier
                </Button>
              </Link>
              <Link href="/docs/integrations/make">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Make.com
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