import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Database, 
  Brain, 
  Zap, 
  Search,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  BarChart
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'
import { APIMethod, StatusCode } from '../../components/APIMethod'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'

export default function DeepDiveAPIPage() {
  const quickExample = {
    python: `import requests

response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_key_here"},
    json={
        "research_query": "Impact of AI on healthcare industry 2025",
        "sources": ["academic", "news", "industry_reports"],
        "analysis_depth": "comprehensive",
        "include_citations": True,
        "max_sources": 15,
        "generate_summary": True
    }
)

data = response.json()
print(f"Research completed in {data['processing_time']}s")
print(f"Sources analyzed: {len(data['sources_analyzed'])}")
print(f"Summary: {data['executive_summary'][:200]}...")
print(f"Key insights: {len(data['key_insights'])}")`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://www.search.venym.io/api/v1/deepdive',
  {
    research_query: 'Impact of AI on healthcare industry 2025',
    sources: ['academic', 'news', 'industry_reports'],
    analysis_depth: 'comprehensive',
    include_citations: true,
    max_sources: 15,
    generate_summary: true
  },
  {
    headers: { 'Authorization': 'Bearer sk_live_YOUR_API_KEY_key_here' }
  }
);

const data = response.data;
console.log(\`Research completed in \${data.processing_time}s\`);
console.log(\`Sources analyzed: \${data.sources_analyzed.length}\`);
console.log(\`Summary: \${data.executive_summary.substring(0, 200)}...\`);
console.log(\`Key insights: \${data.key_insights.length}\`);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/deepdive \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "research_query": "Impact of AI on healthcare industry 2025",
    "sources": ["academic", "news", "industry_reports"],
    "analysis_depth": "comprehensive",
    "include_citations": true,
    "max_sources": 15,
    "generate_summary": true
  }'`
  }

  const competitorAnalysis = {
    python: `import requests

# Comprehensive competitor analysis research
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_key_here"},
    json={
        "research_query": "Shopify vs WooCommerce vs BigCommerce comparison 2025",
        "sources": ["industry_reports", "reviews", "news", "social_media"],
        "analysis_type": "competitive_analysis",
        "entities": ["Shopify", "WooCommerce", "BigCommerce"],
        "focus_areas": ["pricing", "features", "market_share", "customer_satisfaction"],
        "include_sentiment": True,
        "include_trends": True,
        "generate_recommendations": True
    }
)

data = response.json()
print(f"Competitive analysis completed")
print(f"Companies analyzed: {len(data.get('entity_analysis', {}))}")
print(f"Market trends identified: {len(data.get('trend_analysis', []))}")

# Display competitive insights
for entity, analysis in data.get('entity_analysis', {}).items():
    print(f"\\n{entity.upper()}:")
    print(f"  Sentiment Score: {analysis.get('sentiment_score', 'N/A')}")
    print(f"  Market Position: {analysis.get('market_position', 'N/A')}")
    print(f"  Key Strengths: {', '.join(analysis.get('strengths', [])[:3])}")
    print(f"  Key Weaknesses: {', '.join(analysis.get('weaknesses', [])[:3])}")

print(f"\\nRecommendations: {data.get('recommendations', 'None provided')}")`,
    javascript: `const axios = require('axios');

async function competitorAnalysis() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/deepdive',
      {
        research_query: 'Shopify vs WooCommerce vs BigCommerce comparison 2025',
        sources: ['industry_reports', 'reviews', 'news', 'social_media'],
        analysis_type: 'competitive_analysis',
        entities: ['Shopify', 'WooCommerce', 'BigCommerce'],
        focus_areas: ['pricing', 'features', 'market_share', 'customer_satisfaction'],
        include_sentiment: true,
        include_trends: true,
        generate_recommendations: true
      },
      {
        headers: { 'Authorization': 'Bearer sk_live_YOUR_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log('Competitive analysis completed');
    console.log(\`Companies analyzed: \${Object.keys(data.entity_analysis || {}).length}\`);
    console.log(\`Market trends identified: \${data.trend_analysis?.length || 0}\`);

    // Display competitive insights
    Object.entries(data.entity_analysis || {}).forEach(([entity, analysis]) => {
      console.log(\`\\n\${entity.toUpperCase()}:\`);
      console.log(\`  Sentiment Score: \${analysis.sentiment_score || 'N/A'}\`);
      console.log(\`  Market Position: \${analysis.market_position || 'N/A'}\`);
      console.log(\`  Key Strengths: \${(analysis.strengths || []).slice(0, 3).join(', ')}\`);
      console.log(\`  Key Weaknesses: \${(analysis.weaknesses || []).slice(0, 3).join(', ')}\`);
    });

    console.log(\`\\nRecommendations: \${data.recommendations || 'None provided'}\`);
    
    return data;
  } catch (error) {
    console.error('Analysis failed:', error.response?.data || error.message);
  }
}

competitorAnalysis();`
  }

  const basicParameters = [
    {
      name: "research_query",
      type: "string",
      required: true,
      description: "The research question or topic to investigate in detail.",
      example: '"Impact of remote work on productivity"'
    },
    {
      name: "sources",
      type: "array", 
      required: false,
      description: "Types of sources to include in the research.",
      example: '["academic", "news", "industry_reports"]'
    },
    {
      name: "analysis_depth",
      type: "string",
      required: false,
      description: "Depth of analysis to perform on the research topic.",
      example: '"comprehensive", "standard", "quick"'
    },
    {
      name: "max_sources",
      type: "integer",
      required: false,
      description: "Maximum number of sources to analyze.",
      example: "15"
    },
    {
      name: "generate_summary",
      type: "boolean",
      required: false,
      description: "Generate an executive summary of findings.",
      example: "true"
    }
  ]

  const responseFields = [
    {
      name: "executive_summary",
      type: "string",
      description: "AI-generated executive summary of the research findings.",
      example: '"The research indicates significant impact of AI on healthcare efficiency..."'
    },
    {
      name: "key_insights",
      type: "array",
      description: "Array of key insights and findings from the research.",
      example: '[{"insight": "...", "confidence": 0.89, "sources": [...]}]'
    },
    {
      name: "sources_analyzed",
      type: "array", 
      description: "List of sources that were analyzed with metadata.",
      example: '[{"url": "...", "title": "...", "type": "academic", "relevance": 0.92}]'
    },
    {
      name: "trend_analysis",
      type: "array",
      description: "Identified trends and patterns in the research domain.",
      example: '[{"trend": "...", "direction": "increasing", "timeframe": "2024-2025"}]'
    },
    {
      name: "citations",
      type: "array",
      description: "Properly formatted citations for all analyzed sources.",
      example: '[{"citation": "...", "url": "...", "accessed": "2025-01-15"}]'
    },
    {
      name: "processing_time",
      type: "float",
      description: "Time taken to complete the research analysis in seconds.",
      example: "45.7"
    },
    {
      name: "credits_used",
      type: "integer",
      description: "Number of API credits consumed by this research request.",
      example: "25"
    }
  ]

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced natural language processing for deep content understanding",
      icon: Brain,
      benefits: ["Semantic analysis", "Context understanding", "Intelligent summarization"]
    },
    {
      title: "Multi-Source Research",
      description: "Aggregate data from academic papers, news, reports, and social media",
      icon: Database,
      benefits: ["Academic databases", "News aggregation", "Industry reports"]
    },
    {
      title: "Trend Identification",
      description: "Identify emerging trends and patterns across time periods",
      icon: TrendingUp,
      benefits: ["Pattern recognition", "Trend forecasting", "Historical analysis"]
    },
    {
      title: "Citation Management",
      description: "Automatic citation generation and source verification",
      icon: FileText,
      benefits: ["APA/MLA format", "Source verification", "Reference tracking"]
    }
  ]

  const useCases = [
    {
      title: "Market Research",
      description: "Industry analysis, competitor research, market trends",
      icon: BarChart,
      color: "text-blue-600"
    },
    {
      title: "Academic Research", 
      description: "Literature reviews, research synthesis, citation analysis",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Investment Research",
      description: "Due diligence, market analysis, risk assessment",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Strategic Planning",
      description: "Business intelligence, trend analysis, opportunity identification",
      icon: Lightbulb,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Database className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#17457c] mb-2">
              DeepDive API
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered research across multiple sources with intelligent analysis
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/docs/api/deepdive/parameters">
            <Button size="lg" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
              <Brain className="w-4 h-4 mr-2" />
              API Reference
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/docs/api/deepdive/examples">
            <Button variant="outline" size="lg" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
              View Examples
            </Button>
          </Link>
          
          <Link href="/docs/quickstart">
            <Button variant="ghost" size="lg" className="text-gray-600 hover:text-[#17457c]">
              Quick Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Callout type="success" title="AI-Powered Research Platform">
          DeepDive combines multiple data sources with advanced AI analysis to provide comprehensive 
          research insights, trend identification, and actionable intelligence for any topic.
        </Callout>
      </div>

      {/* API Method */}
      <div className="mb-16">
        <APIMethod 
          method="POST" 
          endpoint="https://www.search.venym.io/api/v1/deepdive"
          description="Conduct comprehensive AI-powered research across multiple sources with intelligent analysis"
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#17457c] mb-4">Status Codes</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <StatusCode code={200} description="Research completed successfully" />
            <StatusCode code={400} description="Invalid research parameters or query" />
            <StatusCode code={402} description="Insufficient credits for requested analysis depth" />
            <StatusCode code={429} description="Rate limit exceeded - research in progress" />
            <StatusCode code={500} description="Internal server error - contact support" />
            <StatusCode code={503} description="Service temporarily unavailable" />
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-4">Quick Start</h2>
        <p className="text-gray-600 mb-6">
          Start comprehensive research with AI analysis in minutes. Simply provide a research question 
          and let DeepDive gather, analyze, and synthesize information from multiple sources.
        </p>
        
        <CodeBlock
          multiLanguage={quickExample}
          title="Basic research with AI analysis"
        />
      </div>

      {/* Core Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="h-full border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Research Applications</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-3 p-3 bg-gray-100 rounded-full w-fit">
                  <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                </div>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Parameters Overview */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Key Parameters</h2>
        <ParameterTable 
          parameters={basicParameters}
          title="Essential DeepDive Parameters"
        />
        
        <div className="mt-6">
          <Link href="/docs/api/deepdive/parameters">
            <Button variant="outline" className="w-full">
              View Complete Parameter Reference
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Response Format */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Format</h2>
        <ResponseTable 
          fields={responseFields}
          title="DeepDive Response Fields"
        />
      </div>

      {/* Advanced Example */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Competitive Analysis</h2>
        <p className="text-gray-600 mb-6">
          Perform comprehensive competitive analysis with entity recognition, sentiment analysis, 
          and strategic recommendations.
        </p>
        
        <CodeBlock
          multiLanguage={competitorAnalysis}
          title="Advanced competitive analysis research"
        />
      </div>

      {/* Research Types */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Supported Analysis Types</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Industry trend identification</div>
              <div>• Market size estimation</div>
              <div>• Growth forecasting</div>
              <div>• Competitive landscape</div>
              <div>• Opportunity assessment</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Users className="w-5 h-5" />
                Competitive Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Competitor positioning</div>
              <div>• Feature comparison</div>
              <div>• Pricing analysis</div>
              <div>• Market share insights</div>
              <div>• Strategic recommendations</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <FileText className="w-5 h-5" />
                Academic Research
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Literature synthesis</div>
              <div>• Citation analysis</div>
              <div>• Research gap identification</div>
              <div>• Methodology comparison</div>
              <div>• Evidence evaluation</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Target className="w-5 h-5" />
                Investment Research
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Due diligence reports</div>
              <div>• Financial analysis</div>
              <div>• Risk assessment</div>
              <div>• Market validation</div>
              <div>• Investment thesis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Lightbulb className="w-5 h-5" />
                Strategic Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Business intelligence</div>
              <div>• SWOT analysis</div>
              <div>• Strategic opportunities</div>
              <div>• Risk identification</div>
              <div>• Action recommendations</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Search className="w-5 h-5" />
                Topic Research
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Comprehensive overviews</div>
              <div>• Expert opinions</div>
              <div>• Case study analysis</div>
              <div>• Best practices</div>
              <div>• Implementation guides</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="mb-16">
        <Card className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 text-white">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">50M+</div>
                <div className="text-sm opacity-90">Sources Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">95%</div>
                <div className="text-sm opacity-90">Research Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">12</div>
                <div className="text-sm opacity-90">Languages Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#efa72d] mb-2">45s</div>
                <div className="text-sm opacity-90">Avg Analysis Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Research Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Effective Research Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Be specific and focused:</strong>
                <p className="text-sm text-gray-600">Use clear, specific research questions rather than broad topics</p>
              </div>
              <div>
                <strong>Include context and timeframe:</strong>
                <p className="text-sm text-gray-600">Specify relevant time periods and geographical scope</p>
              </div>
              <div>
                <strong>Select appropriate sources:</strong>
                <p className="text-sm text-gray-600">Choose source types that match your research needs</p>
              </div>
              <div>
                <strong>Use proper analysis depth:</strong>
                <p className="text-sm text-gray-600">Balance thoroughness with processing time and cost</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Common Research Pitfalls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Overly broad queries:</strong>
                <p className="text-sm text-gray-600">Avoid vague topics that produce unfocused results</p>
              </div>
              <div>
                <strong>Insufficient source diversity:</strong>
                <p className="text-sm text-gray-600">Include multiple source types for balanced perspectives</p>
              </div>
              <div>
                <strong>Ignoring temporal relevance:</strong>
                <p className="text-sm text-gray-600">Consider how time-sensitive your research topic is</p>
              </div>
              <div>
                <strong>Not validating AI insights:</strong>
                <p className="text-sm text-gray-600">Review and verify AI-generated insights with original sources</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/scrapeforge">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            ScrapeForge API
          </Button>
        </Link>
        <Link href="/docs/api/deepdive/parameters">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            View Parameters
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}