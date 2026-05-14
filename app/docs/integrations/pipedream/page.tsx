import Link from 'next/link'
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
  Bot,
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
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION :: PIPEDREAM</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
            Serverless
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            2,700+ APIs
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
          Pipedream Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-3xl">
          Build serverless automation workflows with Venym Search and Pipedream.
          Create event-driven, scalable integrations that respond to web data changes in real-time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {features.map((feature) => (
          <div key={feature.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <feature.icon className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">{feature.title}</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">{feature.description}</p>
            <div className="space-y-1">
              {feature.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                  <span className="text-[12px] text-white/55">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Callout type="success" title="What you'll build">
        Serverless workflows that monitor web data, trigger on changes, process information with AI,
        and integrate with thousands of apps - all without managing infrastructure.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Setup</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Setup Instructions</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">01</span>
              <h3 className="text-[14px] font-medium text-white">Create Venym Search App Connection</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Configure Venym Search as a custom app in Pipedream for reusable authentication and methods.
              </p>

              <CodeBlock
                code={authCode}
                language="javascript"
                title="Venym Search App Configuration"
              />

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Authentication Setup:</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Create new app in Pipedream Apps directory</li>
                  <li>Add API key authentication method</li>
                  <li>Define reusable methods for all Venym Search APIs</li>
                  <li>Test connection with sample requests</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">02</span>
              <h3 className="text-[14px] font-medium text-white">Build Venym Search Components</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Create reusable components for each Venym Search API that can be used across workflows.
              </p>

              <CodeBlock
                code={componentCode}
                language="javascript"
                title="Search Component"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-3">
                  <h5 className="text-[14px] font-medium text-white mb-2">Component Benefits</h5>
                  <p className="text-[12px] text-white/55">Reusable across workflows, built-in validation, consistent error handling, and shared authentication.</p>
                </div>
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-3">
                  <h5 className="text-[14px] font-medium text-white mb-2">Publishing</h5>
                  <p className="text-[12px] text-white/55">Publish to Pipedream registry for community use or keep private for your organization.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">03</span>
              <h3 className="text-[14px] font-medium text-white">Configure API Authentication</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Set up secure authentication for Venym Search API in your Pipedream account.
              </p>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Authentication Steps:</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Go to Pipedream → Accounts → Add Account</li>
                  <li>Select "Venym Search" app (custom or published)</li>
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
        <div className="venym-meta mb-3">02 · Components</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Venym Search Component Library</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400/80" />
              <h3 className="text-lg font-semibold text-white">Search Action</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Enhanced web search with real-time results.</p>
              <div className="space-y-2">
                {['Real-time search execution', 'Auto-scraping integration', 'Contact extraction', 'Social discovery'].map((f) => (
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
              <h3 className="text-lg font-semibold text-white">Scrape Action</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">Extract content from any webpage or document.</p>
              <div className="space-y-2">
                {['Content extraction', 'JavaScript rendering', 'Custom selectors', 'Metadata extraction'].map((f) => (
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
              <Bot className="w-4 h-4 text-amber-400/80" />
              <h3 className="text-lg font-semibold text-white">Research Action</h3>
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
        <div className="venym-meta mb-3">03 · Workflow</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Workflow Example</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
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

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Triggers</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Event-Driven Triggers</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Create triggers that monitor web data and automatically execute workflows when conditions are met.
        </p>

        <CodeBlock
          code={triggerCode}
          language="javascript"
          title="Venym Search Monitoring Trigger"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Trigger Types</h3>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Webhook triggers from external systems</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Scheduled interval monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Database change detection</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-sky-400/80" />
                <span className="text-[13px] text-white/65">Web data change monitoring</span>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Use Cases</h3>
            </div>
            <div className="p-6 space-y-2">
              {['Brand mention monitoring', 'Competitor price tracking', 'News and trend detection', 'Lead generation automation'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Best Practices</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-emerald-300/80">Performance Optimization</h3>
            </div>
            <div className="p-6 space-y-3">
              {['Use async/await for parallel API calls', 'Implement proper error handling and retries', 'Cache frequently accessed data', "Use Pipedream's built-in deduplication"].map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80 mt-0.5" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-sky-300/80">Cost Management</h3>
            </div>
            <div className="p-6 space-y-3">
              {['Monitor Venym Search credit usage', 'Set execution limits in Pipedream', 'Use filters to process only relevant data', 'Optimize polling intervals'].map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <Settings className="w-3.5 h-3.5 text-sky-400/80 mt-0.5" />
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
            <PlayCircle className="w-4 h-4 text-amber-400/80" />
            <span className="venym-meta">Start</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Start Building</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Ready for serverless automation? Get your Venym Search API key and start building with Pipedream.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/quickstart" className="venym-btn-primary">
                Get API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
              <button className="venym-btn-secondary">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                Pipedream Registry
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
              Explore other automation platforms and developer tools.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/integrations/zapier" className="venym-btn-secondary">
                Zapier
              </Link>
              <Link href="/docs/integrations/make" className="venym-btn-secondary">
                Make.com
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
