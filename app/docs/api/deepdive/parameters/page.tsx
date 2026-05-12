import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Settings, 
  Brain, 
  Database,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  FileText,
  Search,
  Target,
  Clock,
  Zap
} from 'lucide-react'
import { CodeBlock } from '../../../components/CodeBlock'
import { Callout } from '../../../components/Callout'
import { ParameterTable, ResponseTable } from '../../../components/ParameterTable'

export default function DeepDiveParametersPage() {
  const coreParameters = [
    {
      name: "research_query",
      type: "string",
      required: true,
      description: "The main research question or topic to investigate. Should be specific and well-defined.",
      example: '"Impact of remote work on employee productivity in tech companies"',
      validation: "10-500 characters, must be meaningful research question"
    },
    {
      name: "sources",
      type: "array",
      required: false,
      description: "Types of sources to include in the research analysis.",
      example: '["academic", "news", "industry_reports", "social_media"]',
      validation: "Valid source types, default: all available"
    },
    {
      name: "analysis_depth",
      type: "string",
      required: false,
      description: "Depth of AI analysis to perform on the collected data.",
      example: '"comprehensive", "standard", "quick"',
      validation: "comprehensive/standard/quick, default: standard"
    },
    {
      name: "max_sources",
      type: "integer",
      required: false,
      description: "Maximum number of sources to analyze for the research.",
      example: "25",
      validation: "5-100, default: 20"
    },
    {
      name: "timeframe",
      type: "string",
      required: false,
      description: "Time period to focus the research on (affects source selection).",
      example: '"last_year", "2020-2025", "current"',
      validation: "Valid time period or range"
    },
    {
      name: "language",
      type: "string",
      required: false,
      description: "Primary language for source analysis and response generation.",
      example: '"en", "es", "fr", "de"',
      validation: "ISO 639-1 language code, default: en"
    },
    {
      name: "geographic_focus",
      type: "array",
      required: false,
      description: "Geographic regions to prioritize in the research.",
      example: '["North America", "Europe", "Asia-Pacific"]',
      validation: "Valid region names or country codes"
    }
  ]

  const analysisParameters = [
    {
      name: "analysis_type",
      type: "string",
      required: false,
      description: "Specific type of analysis to perform on the research data.",
      example: '"competitive_analysis", "market_research", "academic_review"',
      validation: "Predefined analysis types"
    },
    {
      name: "entities",
      type: "array",
      required: false,
      description: "Specific entities (companies, people, products) to focus the analysis on.",
      example: '["Tesla", "Toyota", "Volkswagen"]',
      validation: "Entity names, max 10 entities"
    },
    {
      name: "focus_areas",
      type: "array",
      required: false,
      description: "Specific aspects or topics to emphasize in the analysis.",
      example: '["pricing", "market_share", "innovation", "customer_satisfaction"]',
      validation: "Relevant focus keywords"
    },
    {
      name: "include_sentiment",
      type: "boolean",
      required: false,
      description: "Perform sentiment analysis on sources and entities.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "include_trends",
      type: "boolean",
      required: false,
      description: "Identify and analyze trends in the research domain.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "confidence_threshold",
      type: "float",
      required: false,
      description: "Minimum confidence score for including insights in results.",
      example: "0.7",
      validation: "0.0-1.0, default: 0.6"
    },
    {
      name: "cross_reference",
      type: "boolean",
      required: false,
      description: "Cross-reference findings across multiple sources for validation.",
      example: "true",
      validation: "true/false, default: true"
    }
  ]

  const outputParameters = [
    {
      name: "generate_summary",
      type: "boolean",
      required: false,
      description: "Generate an executive summary of the research findings.",
      example: "true",
      validation: "true/false, default: true"
    },
    {
      name: "include_citations",
      type: "boolean",
      required: false,
      description: "Include properly formatted citations for all analyzed sources.",
      example: "true",
      validation: "true/false, default: true"
    },
    {
      name: "citation_format",
      type: "string",
      required: false,
      description: "Format style for generated citations.",
      example: '"apa", "mla", "chicago", "ieee"',
      validation: "apa/mla/chicago/ieee, default: apa"
    },
    {
      name: "generate_recommendations",
      type: "boolean",
      required: false,
      description: "Generate actionable recommendations based on findings.",
      example: "true",
      validation: "true/false, default: false"
    },
    {
      name: "include_methodology",
      type: "boolean",
      required: false,
      description: "Include detailed methodology explanation in the response.",
      example: "false",
      validation: "true/false, default: false"
    },
    {
      name: "export_format",
      type: "string",
      required: false,
      description: "Additional export format for the research report.",
      example: '"pdf", "docx", "markdown"',
      validation: "pdf/docx/markdown, generates download URL"
    },
    {
      name: "visualization_data",
      type: "boolean",
      required: false,
      description: "Include structured data for creating charts and visualizations.",
      example: "true",
      validation: "true/false, default: false"
    }
  ]

  const responseParameters = [
    {
      name: "executive_summary",
      type: "string",
      description: "AI-generated executive summary of all research findings.",
      example: '"The research indicates a 23% increase in productivity when implementing remote work policies..."'
    },
    {
      name: "key_insights",
      type: "array",
      description: "Array of key insights with confidence scores and supporting evidence.",
      example: '[{"insight": "...", "confidence": 0.89, "evidence_count": 15, "sources": [...]}]'
    },
    {
      name: "entity_analysis",
      type: "object",
      description: "Detailed analysis for each specified entity (if entities parameter used).",
      example: '{"Tesla": {"sentiment": 0.72, "mentions": 45, "key_topics": [...]}}'
    },
    {
      name: "trend_analysis",
      type: "array",
      description: "Identified trends with direction, confidence, and timeframe (if include_trends=true).",
      example: '[{"trend": "...", "direction": "increasing", "confidence": 0.85, "timeframe": "2024-2025"}]'
    },
    {
      name: "sources_analyzed",
      type: "array",
      description: "Complete list of sources with metadata, relevance scores, and analysis notes.",
      example: '[{"url": "...", "title": "...", "type": "academic", "relevance": 0.92, "date": "2024-12-15"}]'
    },
    {
      name: "citations",
      type: "array",
      description: "Properly formatted citations in the requested citation format.",
      example: '[{"citation": "Smith, J. (2024). Research Title. Journal Name, 15(3), 123-145.", "url": "..."}]'
    },
    {
      name: "recommendations",
      type: "array",
      description: "AI-generated actionable recommendations (if generate_recommendations=true).",
      example: '[{"recommendation": "...", "rationale": "...", "priority": "high", "implementation": "..."}]'
    },
    {
      name: "methodology",
      type: "object",
      description: "Detailed explanation of research methodology used (if include_methodology=true).",
      example: '{"approach": "...", "source_selection": "...", "analysis_methods": [...], "limitations": [...]}'
    },
    {
      name: "visualization_data",
      type: "object",
      description: "Structured data for creating charts and graphs (if visualization_data=true).",
      example: '{"charts": [...], "tables": [...], "metrics": {...}}'
    },
    {
      name: "export_url",
      type: "string",
      description: "Download URL for exported report (if export_format specified).",
      example: '"https://cdn.VENYM_SEARCH.com/reports/research_abc123.pdf"'
    },
    {
      name: "processing_time",
      type: "float",
      description: "Total time taken to complete the research analysis in seconds.",
      example: "127.3"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed by this research request.",
      example: "45"
    }
  ]

  const basicExample = {
    python: `import requests

# Basic research with minimal parameters
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_key_here"},
    json={
        "research_query": "Benefits of electric vehicles for urban transportation",
        "sources": ["academic", "news", "industry_reports"],
        "max_sources": 15,
        "analysis_depth": "standard"
    }
)`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://www.search.venym.io/api/v1/deepdive',
  {
    research_query: 'Benefits of electric vehicles for urban transportation',
    sources: ['academic', 'news', 'industry_reports'],
    max_sources: 15,
    analysis_depth: 'standard'
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_key_here' }
  }
);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/deepdive \\
  -H "Authorization": "Bearer: sk_live_YOUR_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "research_query": "Benefits of electric vehicles for urban transportation",
    "sources": ["academic", "news", "industry_reports"],
    "max_sources": 15,
    "analysis_depth": "standard"
  }'`
  }

  const comprehensiveExample = {
    python: `import requests

# Comprehensive analysis with all features
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_key_here"},
    json={
        "research_query": "Competitive landscape of cloud computing platforms 2025",
        "sources": ["academic", "news", "industry_reports", "social_media", "financial"],
        "analysis_type": "competitive_analysis",
        "entities": ["AWS", "Microsoft Azure", "Google Cloud", "IBM Cloud"],
        "focus_areas": ["market_share", "pricing", "features", "customer_satisfaction"],
        "analysis_depth": "comprehensive",
        "max_sources": 50,
        "timeframe": "2023-2025",
        "geographic_focus": ["North America", "Europe", "Asia-Pacific"],
        "include_sentiment": True,
        "include_trends": True,
        "confidence_threshold": 0.75,
        "generate_summary": True,
        "include_citations": True,
        "citation_format": "apa",
        "generate_recommendations": True,
        "include_methodology": True,
        "export_format": "pdf",
        "visualization_data": True
    }
)`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://www.search.venym.io/api/v1/deepdive',
  {
    research_query: 'Competitive landscape of cloud computing platforms 2025',
    sources: ['academic', 'news', 'industry_reports', 'social_media', 'financial'],
    analysis_type: 'competitive_analysis',
    entities: ['AWS', 'Microsoft Azure', 'Google Cloud', 'IBM Cloud'],
    focus_areas: ['market_share', 'pricing', 'features', 'customer_satisfaction'],
    analysis_depth: 'comprehensive',
    max_sources: 50,
    timeframe: '2023-2025',
    geographic_focus: ['North America', 'Europe', 'Asia-Pacific'],
    include_sentiment: true,
    include_trends: true,
    confidence_threshold: 0.75,
    generate_summary: true,
    include_citations: true,
    citation_format: 'apa',
    generate_recommendations: true,
    include_methodology: true,
    export_format: 'pdf',
    visualization_data: true
  },
  {
    headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_key_here' }
  }
);`
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">DeepDive Parameters</h1>
            <p className="text-gray-600">Complete parameter reference for AI-powered research and analysis</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/deepdive">
            <Button variant="outline" size="sm">
              ← Overview
            </Button>
          </Link>
          <Link href="/docs/api/deepdive/examples">
            <Button variant="outline" size="sm">
              Examples →
            </Button>
          </Link>
        </div>

        <Callout type="info" title="AI Research Platform">
          DeepDive uses advanced AI to analyze multiple sources, identify patterns, and generate 
          actionable insights. Parameter selection affects analysis quality and processing time.
        </Callout>
      </div>

      {/* Core Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Research Parameters</h2>
        
        <ParameterTable 
          parameters={coreParameters}
          title="Essential Research Configuration"
        />
      </div>

      {/* Analysis Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Analysis Configuration</h2>
        
        <ParameterTable 
          parameters={analysisParameters}
          title="AI Analysis Settings"
        />
      </div>

      {/* Output Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Output Configuration</h2>
        
        <ParameterTable 
          parameters={outputParameters}
          title="Response Format & Export Options"
        />
      </div>

      {/* Source Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Available Source Types</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <FileText className="w-5 h-5" />
                Academic Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-1">
                <div>• Peer-reviewed journals</div>
                <div>• Research papers</div>
                <div>• Conference proceedings</div>
                <div>• Academic databases</div>
                <div>• Thesis and dissertations</div>
              </div>
              <Badge className="mt-3 bg-blue-100 text-blue-700">
                High Authority
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Search className="w-5 h-5" />
                News & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-1">
                <div>• News articles</div>
                <div>• Press releases</div>
                <div>• Industry publications</div>
                <div>• Blog posts</div>
                <div>• Expert opinions</div>
              </div>
              <Badge className="mt-3 bg-green-100 text-green-700">
                Current Events
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Industry Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-1">
                <div>• Market research reports</div>
                <div>• Financial analysis</div>
                <div>• Industry surveys</div>
                <div>• White papers</div>
                <div>• Case studies</div>
              </div>
              <Badge className="mt-3 bg-purple-100 text-purple-700">
                Market Insights
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Database className="w-5 h-5" />
                Financial Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-1">
                <div>• SEC filings</div>
                <div>• Earnings reports</div>
                <div>• Financial statements</div>
                <div>• Analyst reports</div>
                <div>• Market data</div>
              </div>
              <Badge className="mt-3 bg-orange-100 text-orange-700">
                Financial Focus
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Target className="w-5 h-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-1">
                <div>• Social media posts</div>
                <div>• User discussions</div>
                <div>• Product reviews</div>
                <div>• Community feedback</div>
                <div>• Influencer content</div>
              </div>
              <Badge className="mt-3 bg-yellow-100 text-yellow-700">
                Public Sentiment
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Brain className="w-5 h-5" />
                Patents & IP
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-1">
                <div>• Patent filings</div>
                <div>• Patent analysis</div>
                <div>• IP portfolios</div>
                <div>• Technology trends</div>
                <div>• Innovation tracking</div>
              </div>
              <Badge className="mt-3 bg-red-100 text-red-700">
                Innovation Focus
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Credit Consumption */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Credit Consumption</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Zap className="w-5 h-5" />
                Base Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Quick analysis:</span>
                <Badge variant="secondary">10 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Standard analysis:</span>
                <Badge variant="secondary">25 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Comprehensive analysis:</span>
                <Badge variant="secondary">50 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Per additional source:</span>
                <Badge variant="secondary">+1 credit</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Brain className="w-5 h-5" />
                Feature Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Sentiment analysis:</span>
                <Badge variant="secondary">+5 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Trend identification:</span>
                <Badge variant="secondary">+8 credits</Badge>
              </div>
              <div className="flex justify-between">
                <span>Entity analysis:</span>
                <Badge variant="secondary">+3 credits/entity</Badge>
              </div>
              <div className="flex justify-between">
                <span>PDF/DOCX export:</span>
                <Badge variant="secondary">+10 credits</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        
        <ResponseTable 
          fields={responseParameters}
          title="DeepDive Response Fields"
        />
      </div>

      {/* Example Requests */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Example Requests</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-[#17457c] mb-4">Basic Research Request</h3>
            <p className="text-gray-600 mb-4">
              Simple research with standard analysis depth and common source types:
            </p>
            <CodeBlock 
              multiLanguage={basicExample}
              title="Basic DeepDive Research"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#17457c] mb-4">Comprehensive Analysis Request</h3>
            <p className="text-gray-600 mb-4">
              Full-featured research with all analysis options and export capabilities:
            </p>
            <CodeBlock 
              multiLanguage={comprehensiveExample}
              title="Comprehensive DeepDive Analysis"
            />
          </div>
        </div>
      </div>

      {/* Analysis Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Analysis Type Reference</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">competitive_analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Purpose:</strong>
                  <p className="text-gray-600 mt-1">Compare entities across multiple dimensions and identify competitive advantages.</p>
                </div>
                <div>
                  <strong>Required Parameters:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• entities (array)</li>
                    <li>• focus_areas (array)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">market_research</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Purpose:</strong>
                  <p className="text-gray-600 mt-1">Analyze market conditions, trends, and opportunities in a specific industry.</p>
                </div>
                <div>
                  <strong>Recommended Sources:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• industry_reports</li>
                    <li>• financial</li>
                    <li>• news</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">academic_review</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Purpose:</strong>
                  <p className="text-gray-600 mt-1">Systematic review of academic literature with citation analysis and research gaps.</p>
                </div>
                <div>
                  <strong>Features:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• Citation networks</li>
                    <li>• Research methodology analysis</li>
                    <li>• Gap identification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Parameter Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Optimization Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Research query specificity:</strong>
                <p className="text-sm text-gray-600">Use specific, focused questions rather than broad topics.</p>
              </div>
              <div>
                <strong>Source selection:</strong>
                <p className="text-sm text-gray-600">Choose source types that align with your research objectives.</p>
              </div>
              <div>
                <strong>Analysis depth balance:</strong>
                <p className="text-sm text-gray-600">Use 'quick' for exploratory research, 'comprehensive' for final analysis.</p>
              </div>
              <div>
                <strong>Entity focus:</strong>
                <p className="text-sm text-gray-600">Limit entities to 5-10 for focused competitive analysis.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Overly broad queries:</strong>
                <p className="text-sm text-gray-600">Vague research questions produce unfocused results.</p>
              </div>
              <div>
                <strong>Insufficient source diversity:</strong>
                <p className="text-sm text-gray-600">Single source types can create biased analysis.</p>
              </div>
              <div>
                <strong>Too many entities:</strong>
                <p className="text-sm text-gray-600">Analyzing 10+ entities dilutes focus and increases costs.</p>
              </div>
              <div>
                <strong>Ignoring timeframe:</strong>
                <p className="text-sm text-gray-600">Outdated sources can skew analysis for current topics.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/deepdive">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            DeepDive Overview
          </Button>
        </Link>
        <Link href="/docs/api/deepdive/examples">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            View Examples
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}