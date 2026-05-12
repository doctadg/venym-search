import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  ArrowRight,
  BookOpen,
  Code,
  Zap,
  Globe
} from 'lucide-react'
import { APITester } from '../../components/APITester'
import { Callout } from '../../components/Callout'
import { ParameterTable, ResponseTable } from '../../components/ParameterTable'

export default function SearchAPIReferencePage() {
  const parameters = [
    {
      name: "query",
      type: "string",
      required: true,
      description: "The search query to execute. Supports natural language and search operators.",
      example: "Bitcoin price analysis 2025"
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      description: "Maximum number of search results to return (1-50).",
      example: "10"
    },
    {
      name: "auto_scrape_top",
      type: "integer",
      required: false,
      description: "Number of top results to automatically scrape (0-10).",
      example: "3"
    },
    {
      name: "include_contacts",
      type: "boolean",
      required: false,
      description: "Extract contact information from scraped content."
    },
    {
      name: "include_social",
      type: "boolean",
      required: false,
      description: "Extract social media links from scraped content."
    },
    {
      name: "country",
      type: "string",
      required: false,
      description: "Target country for search results (ISO 3166-1 alpha-2).",
      example: "US",
      options: ["US", "GB", "DE", "FR", "ES", "IT", "CA", "AU", "BR", "IN", "JP"]
    },
    {
      name: "language",
      type: "string",
      required: false,
      description: "Preferred language for search results (ISO 639-1).",
      example: "en",
      options: ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "ru", "ar"]
    },
    {
      name: "time_range",
      type: "string",
      required: false,
      description: "Filter results by publication time.",
      options: ["24h", "week", "month", "year"]
    },
    {
      name: "result_type",
      type: "string",
      required: false,
      description: "Type of search results to prioritize.",
      options: ["web", "news", "images", "videos"]
    }
  ]

  const exampleRequest = {
    query: "latest AI developments 2025",
    max_results: 10,
    auto_scrape_top: 3,
    include_contacts: false,
    include_social: false,
    country: "US",
    language: "en",
    time_range: "month",
    result_type: "web"
  }

  const responseFields = [
    {
      name: "search_results",
      type: "array",
      description: "Array of search result objects with title, URL, snippet, and metadata.",
      example: '[{title: "...", link: "...", snippet: "...", domain: "...", published_date: "..."}]'
    },
    {
      name: "scraped_content", 
      type: "array",
      description: "Array of scraped content from auto_scrape_top results (if enabled).",
      example: '[{url: "...", content: "...", contacts: [...], social: [...]}]'
    },
    {
      name: "total_results",
      type: "integer",
      description: "Total number of search results found.",
      example: "1247"
    },
    {
      name: "search_time",
      type: "float",
      description: "Time taken to execute the search in seconds.",
      example: "0.34"
    },
    {
      name: "credits_used",
      type: "integer", 
      description: "Number of API credits consumed.",
      example: "15"
    },
    {
      name: "remaining_credits",
      type: "integer",
      description: "Remaining API credits in your account.",
      example: "9985"
    },
    {
      name: "request_id",
      type: "string",
      description: "Unique identifier for this request.",
      example: '"req_1234567890abcdef"'
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">Search API Reference</h1>
            <p className="text-gray-600">Interactive API testing and complete reference documentation</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/search">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              View Guide
            </Button>
          </Link>
          <Link href="/docs/api/search/examples">
            <Button variant="outline" size="sm">
              <Code className="w-4 h-4 mr-2" />
              Examples
            </Button>
          </Link>
        </div>

        <Callout type="info" title="Interactive API Testing">
          Test the Search API directly from this page with live examples. 
          Replace the demo key with your actual API key for real results.
        </Callout>
      </div>

      {/* API Tester */}
      <div className="mb-12">
        <APITester
          endpoint="https://www.search.venym.io/api/v1/search"
          method="POST"
          title="Search the Web in Real-Time"
          description="Execute real-time web searches with automatic content extraction and enrichment"
          parameters={parameters}
          exampleRequest={exampleRequest}
          demoApiKey="demo_sk_search_12345"
        />
      </div>

      {/* Response Schema */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Response Schema</h2>
        <ResponseTable 
          fields={responseFields}
          title="Search Response Fields"
        />
      </div>

      {/* Key Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Zap className="w-5 h-5" />
                Real-Time Search
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Live web search results</div>
              <div>• Fresh content indexing</div>
              <div>• Multiple search engines</div>
              <div>• Instant result delivery</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Globe className="w-5 h-5" />
                Auto-Scraping
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Automatic content extraction</div>
              <div>• Clean text processing</div>
              <div>• Contact information</div>
              <div>• Social media links</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Search className="w-5 h-5" />
                Smart Filtering
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Geographic targeting</div>
              <div>• Language preferences</div>
              <div>• Time-based filtering</div>
              <div>• Content type selection</div>
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
                  <p className="text-sm">Request successful, results returned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="destructive" className="mb-2">400 Bad Request</Badge>
                  <p className="text-sm">Invalid query or parameters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-orange-100 text-orange-700 mb-2">401 Unauthorized</Badge>
                  <p className="text-sm">Invalid or missing API key</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-yellow-100 text-yellow-700 mb-2">429 Too Many Requests</Badge>
                  <p className="text-sm">Rate limit exceeded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">News Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Track breaking news and industry updates</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "query": "AI breakthrough news",
  "result_type": "news",
  "time_range": "24h",
  "max_results": 20
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Generation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Find potential customers and contacts</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "query": "SaaS startup founders email",
  "auto_scrape_top": 5,
  "include_contacts": true,
  "include_social": true
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Research</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Research competitors and market trends</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "query": "enterprise software market 2025",
  "auto_scrape_top": 10,
  "time_range": "month",
  "max_results": 30
}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Discovery</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">Find relevant content and resources</p>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {`{
  "query": "machine learning tutorials 2025",
  "result_type": "web",
  "language": "en",
  "max_results": 15
}`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/search">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Search Guide
          </Button>
        </Link>
        <Link href="/docs/api-reference/scrape">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            Scrape API Reference
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}