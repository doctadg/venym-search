import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building2, 
  Shield, 
  Users,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  Globe,
  Database,
  Settings,
  Mail,
  FileSpreadsheet
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Enterprise
          </Badge>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Microsoft 365
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Microsoft Power Automate Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Integrate Venym Search with Microsoft's enterprise automation platform. 
          Build workflows that connect web intelligence to Microsoft 365, Dynamics 365, and Azure services.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Enterprise Integration</h3>
            </div>
            <p className="text-sm text-gray-600">Native integration with Microsoft 365 and Dynamics 365</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Security & Compliance</h3>
            </div>
            <p className="text-sm text-gray-600">Enterprise-grade security with GDPR and SOC compliance</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#efa72d]" />
              <h3 className="font-semibold">Team Collaboration</h3>
            </div>
            <p className="text-sm text-gray-600">Share workflows across teams with role-based access</p>
          </CardContent>
        </Card>
      </div>

      <Callout type="success" title="What you'll build">
        Enterprise automation workflows that search the web, process data with AI, integrate with Microsoft 365, 
        and maintain full compliance with your organization's security policies.
      </Callout>

      {/* Setup Instructions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Setup Instructions</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">1</span>
                Create Custom Connector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create a custom connector for Venym Search API using OpenAPI definition to enable native integration.
                </p>
                
                <CodeBlock
                  code={connectorCode}
                  language="json"
                  title="Venym Search OpenAPI Definition"
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Connector Creation Steps:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Go to Power Automate → Data → Custom connectors</li>
                    <li>Create from OpenAPI definition</li>
                    <li>Import the Venym Search OpenAPI specification</li>
                    <li>Configure authentication (API Key)</li>
                    <li>Test the connector and save</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#17457c] text-white rounded-full text-sm font-bold">2</span>
                Configure Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Set up secure API key authentication for Venym Search in your Power Automate environment.
                </p>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Security Features</h5>
                    <p className="text-xs text-gray-600">API keys are encrypted and stored securely in Microsoft's Azure infrastructure with enterprise compliance.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Connection Sharing</h5>
                    <p className="text-xs text-gray-600">Share connections across your organization with role-based access control and audit logging.</p>
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
                Build Your First Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create an automated flow that demonstrates Venym Search integration with Microsoft 365 services.
                </p>
                
                <CodeBlock
                  code={flowCode}
                  language="json"
                  title="Lead Generation Flow Definition"
                />

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Pro Tip:</strong> Use Power Automate's visual designer to build flows, 
                        then export to JSON for version control and team collaboration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Microsoft 365 Integrations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Microsoft 365 & Dynamics Integrations</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {integrations.map((integration, index) => (
            <Card key={integration.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#17457c]/10 rounded-lg">
                    <integration.icon className="w-5 h-5 text-[#17457c]" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{integration.title}</CardTitle>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Connected Apps:</h4>
                    <div className="flex flex-wrap gap-1">
                      {integration.apps.map((app) => (
                        <Badge key={app} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Use Case:</h4>
                    <p className="text-xs text-gray-600">{integration.useCase}</p>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                    <PlayCircle className="w-3 h-3 mr-2" />
                    View Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compliance & Security */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Enterprise Compliance & Security</h2>
        
        <p className="text-gray-600 mb-6">
          Build workflows that meet enterprise security and compliance requirements with built-in audit trails and data governance.
        </p>
        
        <CodeBlock
          code={complianceCode}
          language="json"
          title="GDPR Compliant Workflow Example"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-700">Security Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Azure AD authentication integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Data encryption in transit and at rest</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Role-based access control (RBAC)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Conditional access policies</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700">Compliance Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">GDPR data processing controls</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">SOC 2 Type II compliance</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Audit logging and monitoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Data residency controls</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Enterprise Features</h2>
        
        <div className="space-y-6">
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="text-[#efa72d]">AI Builder Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Enhance Venym Search data with Microsoft's AI Builder for document processing, sentiment analysis, and custom AI models.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Document AI for scraped content processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Sentiment analysis on search results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Custom object detection in images</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Text classification and entity extraction</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-700">Power Platform Ecosystem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Power Apps Integration:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Build custom apps with Venym Search data</li>
                    <li>• Real-time search interfaces</li>
                    <li>• Mobile apps for field research</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Power BI Dashboards:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Market intelligence dashboards</li>
                    <li>• Competitive analysis reports</li>
                    <li>• Lead generation metrics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing & Limits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Enterprise Pricing & Limits</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Power Automate Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Per User Plan</span>
                  <span className="font-semibold">$15/user/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Per Flow Plan</span>
                  <span className="font-semibold">$100/5 flows/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Process Plan</span>
                  <span className="font-semibold">$150/bot/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium Connectors</span>
                  <span className="font-semibold">Included</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Venym Search custom connector available with all paid plans.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Venym Search Usage</CardTitle>
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
                  <span className="text-gray-600">Enterprise Support</span>
                  <span className="font-semibold">24/7 available</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Volume discounts available for enterprise customers.
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
              Ready for enterprise automation? Get your Venym Search API key and build with Power Automate.
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
                Power Automate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#17457c]" />
              Enterprise Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Need enterprise support? Contact our team for custom integrations and onboarding.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                Contact Sales
              </Button>
              <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                Enterprise Demo
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

