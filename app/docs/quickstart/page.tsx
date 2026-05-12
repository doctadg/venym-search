import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Key, 
  Code, 
  CheckCircle, 
  ArrowRight, 
  Clock,
  Zap,
  Target,
  Search,
} from 'lucide-react'
import { CodeBlock } from '../components/CodeBlock'
import { Callout } from '../components/Callout'
import { APIMethod } from '../components/APIMethod'


export default function QuickStartPage() {
  const firstCallCode = {
    python: `import requests

# Replace with your actual API key from the dashboard
API_KEY = "sk_live_YOUR_API_KEY_API_KEY_key_here"

response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "query": "latest AI developments 2025",
        "max_results": 5
    }
)

if response.status_code == 200:
    data = response.json()
    print(f"Found {len(data['search_results'])} results")
    print(f"Credits used: {data['credits_used']}")
    print(f"Remaining credits: {data['remaining_credits']}")
    
    # Print the first result
    if data['search_results']:
        first_result = data['search_results'][0]
        print(f"\\nFirst result:")
        print(f"Title: {first_result['title']}")
        print(f"URL: {first_result['link']}")
        print(f"Snippet: {first_result['snippet']}")
else:
    print(f"Error {response.status_code}: {response.text}")`,
    javascript: `const axios = require('axios');



// Replace with your actual API key from the dashboard
const API_KEY = 'sk_live_YOUR_API_KEY_API_KEY_key_here';

async function searchWeb() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/search',
      {
        query: 'latest AI developments 2025',
        max_results: 5
      },
      {
        headers: {
          'Authorization': \`Bearer \$\{API_KEY\}\`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;
    console.log(\`Found \$\{data.search_results.length\} results\`);
    console.log(\`Credits used: \$\{data.credits_used\}\`);
    console.log(\`Remaining credits: \$\{data.remaining_credits\}\`);
    
    // Print the first result
    if (data.search_results.length > 0) {
      const firstResult = data.search_results[0];
      console.log('\\nFirst result:');
      console.log(\`Title: \$\{firstResult.title\}\`);
      console.log(\`URL: \$\{firstResult.link\}\`);
      console.log(\`Snippet: \$\{firstResult.snippet\}\`);
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

searchWeb();`,
    bash: `# Replace with your actual API key from the dashboard
API_KEY="sk_live_YOUR_API_KEY_API_KEY_key_here"

curl -X POST https://www.search.venym.io/api/v1/search \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \\
  -d '{
    "query": "latest AI developments 2025",
    "max_results": 5
  }' | jq '.'`
  }

  const scrapeCode = {
    python: `import requests

API_KEY = "sk_live_YOUR_API_KEY_API_KEY_key_here"

# Scrape a specific webpage
response = requests.post(
    "https://www.search.venym.io/api/v1/scrape",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "url": "https://example.com/article",
        "extract_options": ["title", "text", "metadata"]
    }
)

data = response.json()
print(f"Page title: {data['primary_content']['title']}")
print(f"Content length: {len(data['primary_content']['text'])} characters")`,
    javascript: `const response = await axios.post(
  'https://www.search.venym.io/api/v1/scrape',
  {
    url: 'https://example.com/article',
    extract_options: ['title', 'text', 'metadata']
  },
  { headers: { 'Authorization': \`Bearer \$\{API_KEY\}\` } },
);

const data = response.data;
console.log(\`Page title: \$\{data.primary_content.title\}\`);
console.log(\`Content length: \$\{data.primary_content.text.length\} characters\`);`,
    bash: `curl -X POST https://www.search.venym.io/api/v1/scrape \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/article",
    "extract_options": ["title", "text", "metadata"]
  }' | jq '.primary_content.title'`
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#efa72d]/10 rounded-lg">
            <Clock className="w-6 h-6 text-[#efa72d]" />
          </div>
          <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">
            5 minutes
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Quick Start Guide
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Get up and running with Venym Search APIs in under 5 minutes. 
          From API key generation to your first successful request.
        </p>
      </div>

      <Callout type="info" title="What you'll learn">
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
          <li>Get your API key</li>
          <li>Make your first search request</li>
          <li>Scrape a webpage</li>
          <li>Handle responses and errors</li>
        </ul>
      </Callout>

      {/* Step 1: Get API Key */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-2xl font-bold text-[#17457c]">Get Your API Key</h2>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#efa72d]" />
              Create Account & Generate Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Sign up at <Link href="/signup" className="text-[#efa72d] hover:underline font-medium">VENYM_SEARCH.com/signup</Link> (takes 30 seconds)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Navigate to your <Link href="/dashboard" className="text-[#efa72d] hover:underline font-medium">dashboard</Link></span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Click "Generate API Key" → Copy your key (starts with <code className="bg-gray-100 px-2 py-1 rounded text-sm">sk_live_YOUR_API_KEY_API_KEY</code>)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>You get <Badge className="bg-green-100 text-green-800 hover:bg-green-100">5,000 free credits</Badge> to start</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Callout type="tip" title="Keep your API key secure">
          Never expose your API key in client-side code. Store it as an environment variable and use it only in your backend services.
        </Callout>
      </div>

      {/* Step 2: Authentication */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-2xl font-bold text-[#17457c]">Authentication</h2>
        </div>

        <p className="text-gray-600 mb-6">
          All API requests require authentication using your API key in the request header.
        </p>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Header Format</h3>
          <CodeBlock
            code={`Authorization: Bearer your_api_key_here`}
            language="bash"
            title="Required Authentication Header"
          />
        </div>

        <Callout type="tip" title="Alternative header formats">
          You can also use <code>Authorization: Bearer your_key_here</code> if your HTTP client doesn't support custom headers easily.
        </Callout>
      </div>

      {/* Step 3: First API Call */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-2xl font-bold text-[#17457c]">Your First API Call</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Let's start with Search - our real-time web search API.
        </p>

        <APIMethod
          method="POST"
          endpoint="/v1/search"
          description="Search the web in real-time and get structured results"
        />

        <CodeBlock
          multiLanguage={firstCallCode}
          title="Search the web for current information"
        />

        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Expected Response:</h4>
          <CodeBlock
            language="json"
            code={`{
  "query": "latest AI developments 2025",
  "search_results": [
    {
      "title": "AI Breakthrough: New Language Model Achieves Human-Level Reasoning",
      "link": "https://example.com/ai-news",
      "snippet": "Researchers announce significant advancement in AI reasoning capabilities...",
      "position": 1,
      "date": "2025-07-20"
    }
  ],
  "credits_used": 1,
  "remaining_credits": 4999,
  "results_count": 5
}`}
          />
        </div>
      </div>

      {/* Step 4: Try Other APIs */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <h2 className="text-2xl font-bold text-[#17457c]">Try Our Other APIs</h2>
        </div>

        <div className="space-y-8">
          {/* Scrape */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Scrape - Web Scraping</h3>
            </div>
            
            <APIMethod
              method="POST"
              endpoint="/v1/scrape"
              description="Extract content from any webpage, bypass protections"
            />

            <CodeBlock
              multiLanguage={scrapeCode}
              title="Scrape webpage content"
              title="Research a topic across multiple sources"
            />
          </div>
        </div>
      </div>

      {/* Step 5: Next Steps */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold">
            5
          </div>
          <h2 className="text-2xl font-bold text-[#17457c]">Next Steps</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#efa72d]" />
                Explore Full API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Learn about all parameters, response formats, and advanced features.
              </p>
              <Link href="/docs/api/search">
                <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                  View API Docs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#17457c]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#17457c]" />
                Build Real Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Follow step-by-step guides to build complete applications.
              </p>
              <Link href="/docs/guides/bitcoin-tracking">
                <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Implementation Guides
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Use SDKs & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Speed up development with official SDKs and integrations.
              </p>
              <div className="flex gap-2">
                <Link href="/docs/sdks/python">
                  <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                    Python SDK
                  </Button>
                </Link>
                <Link href="/docs/integrations/langchain">
                  <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                    LangChain
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Monitor Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track your API usage, credits, and performance metrics.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-[#17457c] mb-4">Need Help?</h3>
        <p className="text-gray-600 mb-6">
          Stuck on something? Our developer support team is here to help.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/docs/support">
            <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
              Get Support
            </Button>
          </Link>
          <Link href="/docs/examples">
            <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
              View Examples
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}