import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  ArrowRight,
  BookOpen,
  Search,
  Database,
  TrendingUp,
  FileText,
  Target,
  Zap,
  Shield
} from 'lucide-react'
import { APITester } from '../../components/APITester'
import { Callout } from '../../components/Callout'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'

export default function DeepDiveAPIReferencePage() {
  const parameters = [
    {
      name: "research_query",
      type: "string",
      required: true,
      description: "The main research question or topic to investigate. Should be specific and well-defined.",
      example: "Impact of AI on software development productivity 2025"
    },
    {
      name: "sources",
      type: "array",
      required: false,
      description: "Types of sources to include in the research analysis.",
      example: '["academic", "news", "industry_reports", "social_media"]',
      options: ["academic", "news", "industry_reports", "social_media", "financial", "patents"]
    },
    {
      name: "analysis_depth",
      type: "string",
      required: false,
      description: "Depth of AI analysis to perform on the collected data.",
      options: ["quick", "standard", "comprehensive"]
    },
    {
      name: "max_sources",
      type: "integer",
      required: false,
      description: "Maximum number of sources to analyze for the research (5-100).",
      example: "25"
    },
    {
      name: "timeframe",
      type: "string",
      required: false,
      description: "Time period to focus the research on (affects source selection).",
      example: "2023-2025"
    },
    {
      name: "language",
      type: "string",
      required: false,
      description: "Primary language for source analysis and response generation.",
      example: "en",
      options: ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "ru", "ar"]
    },
    {
      name: "geographic_focus",
      type: "array",
      required: false,
      description: "Geographic regions to prioritize in the research.",
      example: '["North America", "Europe", "Asia-Pacific"]'
    },
    {
      name: "analysis_type",
      type: "string",
      required: false,
      description: "Specific type of analysis to perform on the research data.",
      options: ["competitive_analysis", "market_research", "academic_review", "trend_analysis"]
    },
    {
      name: "entities",
      type: "array",
      required: false,
      description: "Specific entities (companies, people, products) to focus the analysis on.",
      example: '["OpenAI", "Google", "Microsoft"]'
    },
    {
      name: "focus_areas",
      type: "array",
      required: false,
      description: "Specific aspects or topics to emphasize in the analysis.",
      example: '["market_share", "pricing", "innovation", "customer_satisfaction"]'
    },
    {
      name: "include_sentiment",
      type: "boolean",
      required: false,
      description: "Perform sentiment analysis on sources and entities."
    },
    {
      name: "include_trends",
      type: "boolean",
      required: false,
      description: "Identify and analyze trends in the research domain."
    },
    {
      name: "confidence_threshold",
      type: "string",
      required: false,
      description: "Minimum confidence score for including insights in results (0.0-1.0).",
      example: "0.7"
    },
    {
      name: "generate_summary",
      type: "boolean",
      required: false,
      description: "Generate an executive summary of the research findings."
    },
    {
      name: "include_citations",
      type: "boolean",
      required: false,
      description: "Include properly formatted citations for all analyzed sources."
    },
    {
      name: "citation_format",
      type: "string",
      required: false,
      description: "Format style for generated citations.",
      options: ["apa", "mla", "chicago", "ieee"]
    },
    {
      name: "generate_recommendations",
      type: "boolean",
      required: false,
      description: "Generate actionable recommendations based on findings."
    },
    {
      name: "export_format",
      type: "string",
      required: false,
      description: "Additional export format for the research report.",
      options: ["pdf", "docx", "markdown"]
    },
    {
      name: "visualization_data",
      type: "boolean",
      required: false,
      description: "Include structured data for creating charts and visualizations."
    }
  ]

  const exampleRequest = {
    research_query: "AI impact on software development productivity 2025",
    sources: ["academic", "news", "industry_reports"],
    analysis_depth: "standard",
    max_sources: 25,
    timeframe: "2024-2025",
    language: "en",
    geographic_focus: ["North America", "Europe"],
    analysis_type: "market_research",
    entities: ["OpenAI", "GitHub Copilot", "Microsoft"],
    focus_areas: ["productivity", "code_quality", "developer_experience"],
    include_sentiment: true,
    include_trends: true,
    confidence_threshold: "0.7",
    generate_summary: true,
    include_citations: true,
    citation_format: "apa",
    generate_recommendations: false,
    export_format: "",
    visualization_data: false
  }

  const responseFields = [
    {
      name: "executive_summary",
      type: "string",
      description: "AI-generated executive summary of all research findings.",
      example: '"The research indicates a 35% increase in developer productivity when using AI-powered coding assistants..."'
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
      example: '{"OpenAI": {"sentiment": 0.82, "mentions": 127, "key_topics": [...]}}'
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
      example: '[{"citation": "Smith, J. (2024). AI Development Impact. Tech Journal, 15(3), 123-145.", "url": "..."}]'
    },
    {
      name: "recommendations",
      type: "array",
      description: "AI-generated actionable recommendations (if generate_recommendations=true).",
      example: '[{"recommendation": "...", "rationale": "...", "priority": "high", "implementation": "..."}]'
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
      example: "187.6"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed by this research request.",
      example: "42"
    },
    {
      name: "remaining_credits",
      type: "integer",
      description: "Remaining API credits in your account.",
      example: "9958"
    },
    {
      name: "request_id",
      type: "string",
      description: "Unique identifier for this research request.",
      example: '"req_deepdive_987654321"'
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">DeepDive API Reference</h1>
            <p className="text-gray-600">Interactive testing for AI-powered research and analysis</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/deepdive">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              View Guide
            </Button>
          </Link>
          <Link href="/docs/api/deepdive/examples">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Examples
            </Button>
          </Link>
        </div>

        <Callout type="success" title="AI Research Platform">
          Test DeepDive's advanced AI research capabilities including multi-source analysis, 
          trend identification, and comprehensive report generation with citations.
        </Callout>
      </div>

      {/* API Tester */}
      <div className="mb-12">
        <APITester
          endpoint="https://www.search.venym.io/api/v1/deepdive"
          method="POST"
          title="AI-Powered Research & Analysis"
          description="Conduct comprehensive research with AI analysis, trend identification, and professional report generation"
          parameters={parameters}
          exampleRequest={exampleRequest}
          demoApiKey="demo_sk_deepdive_54321"
        />
      </div>

      {/* Response Schema */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Schema</h2>
        <ResponseTable 
          fields={responseFields}
          title="DeepDive Response Fields"
        />
      </div>

      {/* AI Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">AI Research Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Brain className="w-5 h-5" />
                Multi-Source Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Academic papers</div>
              <div>• Industry reports</div>
              <div>• News articles</div>
              <div>• Financial data</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Trend Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Pattern recognition</div>
              <div>• Trend direction analysis</div>
              <div>• Confidence scoring</div>
              <div>• Temporal analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Target className="w-5 h-5" />
                Entity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Competitive positioning</div>
              <div>• Sentiment tracking</div>
              <div>• Market share analysis</div>
              <div>• Brand perception</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <FileText className="w-5 h-5" />
                Report Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Executive summaries</div>
              <div>• Academic citations</div>
              <div>• Actionable insights</div>
              <div>• Export formats</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Analysis Types</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Competitive Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Compare entities across multiple dimensions and identify competitive advantages</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "analysis_type": "competitive_analysis",
  "entities": ["Company A", "Company B", "Company C"],
  "focus_areas": ["market_share", "pricing", "features"],
  "include_sentiment": true
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Research</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Analyze market conditions, trends, and opportunities in specific industries</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "analysis_type": "market_research",
  "sources": ["industry_reports", "financial", "news"],
  "include_trends": true,
  "timeframe": "2024-2025"
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Review</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Systematic review of academic literature with citation analysis</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "analysis_type": "academic_review",
  "sources": ["academic", "patents"],
  "include_citations": true,
  "citation_format": "apa"
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Identify emerging trends and predict future developments</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "analysis_type": "trend_analysis",
  "include_trends": true,
  "visualization_data": true,
  "generate_recommendations": true
}`}
              </div>
            </CardContent>
          </Card>
        </div>
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
            <CardContent className="text-sm space-y-2">
              <div>• Peer-reviewed journals</div>
              <div>• Research papers</div>
              <div>• Conference proceedings</div>
              <div>• Academic databases</div>
              <Badge className="bg-blue-100 text-blue-700">High Authority</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Search className="w-5 h-5" />
                News & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• News articles</div>
              <div>• Press releases</div>
              <div>• Industry publications</div>
              <div>• Expert opinions</div>
              <Badge className="bg-green-100 text-green-700">Current Events</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Industry Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Market research reports</div>
              <div>• Financial analysis</div>
              <div>• Industry surveys</div>
              <div>• White papers</div>
              <Badge className="bg-purple-100 text-purple-700">Market Insights</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Database className="w-5 h-5" />
                Financial Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• SEC filings</div>
              <div>• Earnings reports</div>
              <div>• Financial statements</div>
              <div>• Analyst reports</div>
              <Badge className="bg-orange-100 text-orange-700">Financial Focus</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Target className="w-5 h-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Social media posts</div>
              <div>• User discussions</div>
              <div>• Product reviews</div>
              <div>• Community feedback</div>
              <Badge className="bg-yellow-100 text-yellow-700">Public Sentiment</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Shield className="w-5 h-5" />
                Patents & IP
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Patent filings</div>
              <div>• Patent analysis</div>
              <div>• IP portfolios</div>
              <div>• Technology trends</div>
              <Badge className="bg-red-100 text-red-700">Innovation Focus</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Codes</h2>
        <div className="space-y-3">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-green-100 text-green-700 mb-2">200 OK</Badge>
                  <p className="text-sm">Research completed successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="destructive" className="mb-2">400 Bad Request</Badge>
                  <p className="text-sm">Invalid research query or parameters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-orange-100 text-orange-700 mb-2">402 Payment Required</Badge>
                  <p className="text-sm">Insufficient credits for research depth</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-purple-100 text-purple-700 mb-2">503 Service Unavailable</Badge>
                  <p className="text-sm">AI analysis service temporarily unavailable</p>
                </div>
              </div>
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
              <CardTitle className="text-[#17457c]">Base Analysis Costs</CardTitle>
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
              <CardTitle className="text-[#17457c]">Advanced Features</CardTitle>
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
                <span>Report export (PDF/DOCX):</span>
                <Badge variant="secondary">+10 credits</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api-reference/scrapeforge">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            ScrapeForge API Reference
          </Button>
        </Link>
        <Link href="/docs/api/deepdive">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            DeepDive Guide
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}