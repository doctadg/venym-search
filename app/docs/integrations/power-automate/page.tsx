import Link from 'next/link'
import {
  Building2,
  Shield,
  Users,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  Database,
  Mail,
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function PowerAutomateIntegrationPage() {

  const connectorCode = `{
  "swagger": "2.0",
  "info": {
    "title": "Venym Search",
    "description": "Venym Search API for web search, scraping, and research",
    "version": "1.0",
    "contact": {
      "name": "Venym Search Support",
      "url": "https://VENYM_SEARCH.com/support",
      "email": "support@VENYM_SEARCH.com"
    }
  },
  "host": "search.venym.io/api",
  "basePath": "/",
  "schemes": ["https"],
  "consumes": [],
  "produces": [],
  "paths": {
    "/v1/search": {
      "post": {
        "responses": {
          "200": {
            "description": "Search results",
            "schema": {
              "type": "object",
              "properties": {
                "search_results": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "title": {"type": "string"},
                      "link": {"type": "string"},
                      "snippet": {"type": "string"},
                      "date": {"type": "string"},
                      "contact_info": {
                        "type": "object",
                        "properties": {
                          "email": {"type": "string"},
                          "phone": {"type": "string"}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "summary": "Search - Enhanced Web Search",
        "description": "Search the web with enhanced results and optional contact extraction",
        "operationId": "Search",
        "x-ms-visibility": "important",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "Search query",
                  "title": "Query",
                  "x-ms-visibility": "important"
                },
                "max_results": {
                  "type": "integer",
                  "description": "Maximum number of results",
                  "title": "Max Results",
                  "default": 10,
                  "minimum": 1,
                  "maximum": 50
                },
                "auto_scrape": {
                  "type": "boolean",
                  "description": "Automatically scrape result pages",
                  "title": "Auto Scrape",
                  "default": false
                },
                "extract_contacts": {
                  "type": "boolean",
                  "description": "Extract contact information",
                  "title": "Extract Contacts",
                  "default": false
                }
              },
              "required": ["query"]
            }
          }
        ]
      }
    },
    "/v1/scrape": {
      "post": {
        "responses": {
          "200": {
            "description": "Scraped content",
            "schema": {
              "type": "object",
              "properties": {
                "primary_content": {
                  "type": "object",
                  "properties": {
                    "title": {"type": "string"},
                    "text": {"type": "string"},
                    "images": {"type": "array"},
                    "links": {"type": "array"}
                  }
                }
              }
            }
          }
        },
        "summary": "Scrape - Web Scraping",
        "description": "Extract content from any webpage",
        "operationId": "Scrape",
        "x-ms-visibility": "important",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "url": {
                  "type": "string",
                  "description": "URL to scrape",
                  "title": "URL",
                  "x-ms-visibility": "important"
                },
                "extract_options": {
                  "type": "array",
                  "description": "What to extract",
                  "title": "Extract Options",
                  "items": {
                    "type": "string",
                    "enum": ["title", "text", "images", "links", "metadata"]
                  },
                  "default": ["title", "text"]
                }
              },
              "required": ["url"]
            }
          }
        ]
      }
    }
  },
  "definitions": {},
  "parameters": {},
  "responses": {},
  "securityDefinitions": {
    "API Key": {
      "type": "apiKey",
      "in": "header",
      "name": "Authorization": "Bearer"
    }
  },
  "security": [
    {
      "API Key": []
    }
  ],
  "tags": []
}`

  const flowCode = `{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "$connections": {
        "defaultValue": {},
        "type": "Object"
      }
    },
    "triggers": {
      "Recurrence": {
        "recurrence": {
          "frequency": "Day",
          "interval": 1,
          "schedule": {
            "hours": ["9"]
          }
        },
        "type": "Recurrence"
      }
    },
    "actions": {
      "Initialize_Search_Terms": {
        "runAfter": {},
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            {
              "name": "SearchQuery",
              "type": "string",
              "value": "construction companies Seattle"
            }
          ]
        }
      },
      "Venym_Search_Search": {
        "runAfter": {
          "Initialize_Search_Terms": ["Succeeded"]
        },
        "type": "ApiConnection",
        "inputs": {
          "host": {
            "connection": {
              "name": "@parameters('$connections')['VENYM_SEARCH']['connectionId']"
            }
          },
          "method": "post",
          "path": "/v1/search",
          "body": {
            "query": "@variables('SearchQuery')",
            "max_results": 20,
            "extract_contacts": true
          }
        }
      },
      "Filter_Valid_Contacts": {
        "runAfter": {
          "Venym_Search_Search": ["Succeeded"]
        },
        "type": "Query",
        "inputs": {
          "from": "@body('Venym_Search_Search')['search_results']",
          "where": "@and(not(empty(item()['contact_info']['email'])), not(contains(item()['contact_info']['email'], 'noreply')))"
        }
      },
      "Apply_to_each_result": {
        "foreach": "@body('Filter_Valid_Contacts')",
        "actions": {
          "Add_to_SharePoint_List": {
            "type": "ApiConnection",
            "inputs": {
              "host": {
                "connection": {
                  "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                }
              },
              "method": "post",
              "path": "/datasets/@{encodeURIComponent('https://contoso.sharepoint.com/sites/sales')}/tables/@{encodeURIComponent('Leads')}/items",
              "body": {
                "Title": "@items('Apply_to_each_result')['title']",
                "Company": "@items('Apply_to_each_result')['title']",
                "Website": "@items('Apply_to_each_result')['link']",
                "Email": "@items('Apply_to_each_result')['contact_info']['email']",
                "Phone": "@items('Apply_to_each_result')['contact_info']['phone']",
                "Source": "Venym Search Automation",
                "DateFound": "@utcNow()"
              }
            }
          },
          "Send_Teams_Message": {
            "runAfter": {
              "Add_to_SharePoint_List": ["Succeeded"]
            },
            "type": "ApiConnection",
            "inputs": {
              "host": {
                "connection": {
                  "name": "@parameters('$connections')['teams']['connectionId']"
                }
              },
              "method": "post",
              "path": "/v1.0/teams/@{encodeURIComponent('team-id')}/channels/@{encodeURIComponent('channel-id')}/messages",
              "body": {
                "body": {
                  "content": "🎯 New lead found: @{items('Apply_to_each_result')['title']} - @{items('Apply_to_each_result')['contact_info']['email']}"
                }
              }
            }
          }
        },
        "runAfter": {
          "Filter_Valid_Contacts": ["Succeeded"]
        },
        "type": "Foreach"
      }
    }
  }
}`

  const complianceCode = `{
  "name": "GDPR Compliant Lead Processing",
  "description": "Enterprise workflow with compliance controls",
  "triggers": {
    "Manual": {
      "type": "Request",
      "kind": "Http",
      "inputs": {
        "schema": {
          "type": "object",
          "properties": {
            "search_query": {"type": "string"},
            "data_processing_consent": {"type": "boolean"},
            "retention_period_days": {"type": "integer"}
          },
          "required": ["search_query", "data_processing_consent"]
        }
      }
    }
  },
  "actions": {
    "Validate_Consent": {
      "type": "If",
      "expression": {
        "and": [
          {
            "equals": [
              "@triggerBody()['data_processing_consent']",
              true
            ]
          }
        ]
      },
      "actions": {
        "Log_Data_Processing": {
          "type": "ApiConnection",
          "inputs": {
            "host": {
              "connection": {
                "name": "@parameters('$connections')['azureloganalytics']['connectionId']"
              }
            },
            "method": "post",
            "path": "/api/logs",
            "body": {
              "event_type": "data_processing_start",
              "user_consent": true,
              "search_query": "@triggerBody()['search_query']",
              "timestamp": "@utcNow()",
              "retention_period": "@triggerBody()['retention_period_days']"
            }
          }
        },
        "Venym_Search_Search_With_Audit": {
          "runAfter": {
            "Log_Data_Processing": ["Succeeded"]
          },
          "type": "ApiConnection",
          "inputs": {
            "host": {
              "connection": {
                "name": "@parameters('$connections')['VENYM_SEARCH']['connectionId']"
              }
            },
            "method": "post",
            "path": "/v1/search",
            "body": {
              "query": "@triggerBody()['search_query']",
              "max_results": 10,
              "extract_contacts": false
            }
          }
        },
        "Store_in_Compliance_Storage": {
          "runAfter": {
            "Venym_Search_Search_With_Audit": ["Succeeded"]
          },
          "type": "ApiConnection",
          "inputs": {
            "host": {
              "connection": {
                "name": "@parameters('$connections')['azureblob']['connectionId']"
              }
            },
            "method": "post",
            "path": "/datasets/default/files",
            "queries": {
              "folderPath": "/compliance-data",
              "name": "search-@{utcNow('yyyyMMdd-HHmmss')}.json"
            },
            "body": {
              "search_query": "@triggerBody()['search_query']",
              "results": "@body('Venym_Search_Search_With_Audit')",
              "processed_at": "@utcNow()",
              "retention_until": "@addDays(utcNow(), triggerBody()['retention_period_days'])",
              "user_consent": true
            }
          }
        }
      },
      "else": {
        "actions": {
          "Return_Consent_Error": {
            "type": "Response",
            "inputs": {
              "statusCode": 403,
              "body": {
                "error": "Data processing consent required",
                "code": "CONSENT_REQUIRED"
              }
            }
          }
        }
      }
    }
  }
}`

  const integrations = [
    {
      title: "Microsoft 365 Integration",
      description: "Seamlessly integrate with Outlook, Teams, SharePoint, and OneDrive",
      apps: ["Outlook", "Teams", "SharePoint", "OneDrive", "Power BI"],
      useCase: "Lead data flows directly into SharePoint lists, Teams notifications, and Outlook tasks",
      icon: Mail
    },
    {
      title: "Dynamics 365 CRM",
      description: "Automated lead generation and customer data enrichment",
      apps: ["Dynamics CRM", "Sales Insights", "Customer Service", "Marketing"],
      useCase: "Venym Search data automatically creates and enriches CRM records with web intelligence",
      icon: Users
    },
    {
      title: "Power Platform Ecosystem",
      description: "Connect with Power BI, Power Apps, and Power Virtual Agents",
      apps: ["Power BI", "Power Apps", "Power Virtual Agents", "AI Builder"],
      useCase: "Create dashboards, build apps with Venym Search data, and enhance chatbots with web search",
      icon: Database
    },
    {
      title: "Azure Services",
      description: "Enterprise-grade integration with Azure cloud services",
      apps: ["Azure Logic Apps", "Azure Functions", "Cognitive Services", "Azure Storage"],
      useCase: "Build scalable, secure workflows with AI processing and enterprise storage",
      icon: Building2
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>INTEGRATION :: POWER AUTOMATE</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-sky-400/20 text-sky-300/80">
            Enterprise
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Microsoft 365
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
          Microsoft Power Automate Integration
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-3xl">
          Integrate Venym Search with Microsoft's enterprise automation platform.
          Build workflows that connect web intelligence to Microsoft 365, Dynamics 365, and Azure services.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">Enterprise Integration</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Native integration with Microsoft 365 and Dynamics 365</p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-400/80" />
            <span className="text-[15px] font-medium text-white">Security & Compliance</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Enterprise-grade security with GDPR and SOC compliance</p>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">Team Collaboration</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">Share workflows across teams with role-based access</p>
        </div>
      </div>

      <Callout type="success" title="What you'll build">
        Enterprise automation workflows that search the web, process data with AI, integrate with Microsoft 365,
        and maintain full compliance with your organization's security policies.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Setup</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Setup Instructions</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">01</span>
              <h3 className="text-[14px] font-medium text-white">Create Custom Connector</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Create a custom connector for Venym Search API using OpenAPI definition to enable native integration.
              </p>

              <CodeBlock
                code={connectorCode}
                language="json"
                title="Venym Search OpenAPI Definition"
              />

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                <h4 className="text-[14px] font-medium text-white mb-2">Connector Creation Steps:</h4>
                <ol className="list-decimal list-inside text-[13px] text-white/55 space-y-1">
                  <li>Go to Power Automate → Data → Custom connectors</li>
                  <li>Create from OpenAPI definition</li>
                  <li>Import the Venym Search OpenAPI specification</li>
                  <li>Configure authentication (API Key)</li>
                  <li>Test the connector and save</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="w-7 h-7 inline-flex items-center justify-center text-[11px] font-mono text-white/60 border border-white/15 rounded-sm">02</span>
              <h3 className="text-[14px] font-medium text-white">Configure Authentication</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Set up secure API key authentication for Venym Search in your Power Automate environment.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-3">
                  <h5 className="text-[14px] font-medium text-white mb-2">Security Features</h5>
                  <p className="text-[12px] text-white/55">API keys are encrypted and stored securely in Microsoft's Azure infrastructure with enterprise compliance.</p>
                </div>
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-3">
                  <h5 className="text-[14px] font-medium text-white mb-2">Connection Sharing</h5>
                  <p className="text-[12px] text-white/55">Share connections across your organization with role-based access control and audit logging.</p>
                </div>
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
              <h3 className="text-[14px] font-medium text-white">Build Your First Flow</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-white/55 leading-relaxed">
                Create an automated flow that demonstrates Venym Search integration with Microsoft 365 services.
              </p>

              <CodeBlock
                code={flowCode}
                language="json"
                title="Lead Generation Flow Definition"
              />

              <Callout type="tip">
                Use Power Automate's visual designer to build flows,
                then export to JSON for version control and team collaboration.
              </Callout>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Microsoft</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Microsoft 365 & Dynamics Integrations</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => (
            <div key={integration.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm hover:border-white/[0.12] transition-colors">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-start gap-3">
                <integration.icon className="w-4 h-4 text-white/50 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{integration.title}</h3>
                  <p className="text-[13px] text-white/55">{integration.description}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Connected Apps</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {integration.apps.map((app) => (
                      <span key={app} className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border border-white/10 text-white/60">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">Use Case</h4>
                  <p className="text-[12px] text-white/55">{integration.useCase}</p>
                </div>

                <button className="venym-btn-secondary w-full justify-center">
                  <PlayCircle className="w-3 h-3 mr-1.5" />
                  View Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Compliance</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Enterprise Compliance & Security</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Build workflows that meet enterprise security and compliance requirements with built-in audit trails and data governance.
        </p>

        <CodeBlock
          code={complianceCode}
          language="json"
          title="GDPR Compliant Workflow Example"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-emerald-300/80">Security Features</h3>
            </div>
            <div className="p-6 space-y-3">
              {['Azure AD authentication integration', 'Data encryption in transit and at rest', 'Role-based access control (RBAC)', 'Conditional access policies'].map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-sky-300/80">Compliance Capabilities</h3>
            </div>
            <div className="p-6 space-y-3">
              {['GDPR data processing controls', 'SOC 2 Type II compliance', 'Audit logging and monitoring', 'Data residency controls'].map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-sky-400/80 mt-0.5" />
                  <span className="text-[13px] text-white/65">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Advanced</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Enterprise Features</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-amber-300/80">AI Builder Integration</h3>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-white/55 leading-relaxed mb-4">
                Enhance Venym Search data with Microsoft's AI Builder for document processing, sentiment analysis, and custom AI models.
              </p>
              <div className="space-y-2">
                {['Document AI for scraped content processing', 'Sentiment analysis on search results', 'Custom object detection in images', 'Text classification and entity extraction'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-medium text-violet-300/80">Power Platform Ecosystem</h3>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-[14px] font-medium text-white mb-2">Power Apps Integration:</h4>
                  <ul className="text-[13px] text-white/55 space-y-1">
                    <li>• Build custom apps with Venym Search data</li>
                    <li>• Real-time search interfaces</li>
                    <li>• Mobile apps for field research</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[14px] font-medium text-white mb-2">Power BI Dashboards:</h4>
                  <ul className="text-[13px] text-white/55 space-y-1">
                    <li>• Market intelligence dashboards</li>
                    <li>• Competitive analysis reports</li>
                    <li>• Lead generation metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Pricing</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Enterprise Pricing & Limits</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Power Automate Plans</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Per User Plan</span>
                  <span className="text-[13px] font-medium text-white">$15/user/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Per Flow Plan</span>
                  <span className="text-[13px] font-medium text-white">$100/5 flows/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Process Plan</span>
                  <span className="text-[13px] font-medium text-white">$150/bot/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-white/55">Premium Connectors</span>
                  <span className="text-[13px] font-medium text-white">Included</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-[13px] text-white/55">
                  Venym Search custom connector available with all paid plans.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Venym Search Usage</h3>
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
                  <span className="text-[13px] text-white/55">Enterprise Support</span>
                  <span className="text-[13px] font-medium text-white">24/7 available</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-[13px] text-white/55">
                  Volume discounts available for enterprise customers.
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
              Ready for enterprise automation? Get your Venym Search API key and build with Power Automate.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/quickstart" className="venym-btn-primary">
                Get API Key
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
              <button className="venym-btn-secondary">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                Power Automate
              </button>
            </div>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-sky-400/80" />
            <span className="venym-meta">Support</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Enterprise Support</h3>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Need enterprise support? Contact our team for custom integrations and onboarding.
            </p>
            <div className="flex gap-2 flex-wrap">
              <button className="venym-btn-secondary">
                Contact Sales
              </button>
              <button className="venym-btn-secondary">
                Enterprise Demo
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
