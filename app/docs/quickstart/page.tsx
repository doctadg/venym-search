import Link from 'next/link'
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
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>QUICKSTART</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
            5 minutes
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Quick Start Guide
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Get up and running with Venym Search APIs in under 5 minutes. From API key generation to your first successful request.
        </p>
      </div>

      <Callout type="info" title="What you'll learn">
        <ul className="list-disc list-inside space-y-1 text-[13px] text-white/70">
          <li>Get your API key</li>
          <li>Make your first search request</li>
          <li>Scrape a webpage</li>
          <li>Handle responses and errors</li>
        </ul>
      </Callout>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">01</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Get Your API Key</h2>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">Create Account & Generate Key</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
              <span className="text-[14px] text-white/70">Sign up at <Link href="/signup" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">VENYM_SEARCH.com/signup</Link> (takes 30 seconds)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
              <span className="text-[14px] text-white/70">Navigate to your <Link href="/dashboard" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">dashboard</Link></span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
              <span className="text-[14px] text-white/70">Click "Generate API Key" → Copy your key (starts with <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">sk_live_YOUR_API_KEY_API_KEY</code>)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
              <span className="text-[14px] text-white/70">You get <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">5,000 free credits</span> to start</span>
            </div>
          </div>
        </div>

        <Callout type="tip" title="Keep your API key secure">
          Never expose your API key in client-side code. Store it as an environment variable and use it only in your backend services.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">02</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Authentication</h2>
        </div>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          All API requests require authentication using your API key in the request header.
        </p>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Header Format</h3>
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

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">03</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Your First API Call</h2>
        </div>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
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
          <h4 className="text-[14px] font-medium text-white mb-3">Expected Response:</h4>
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

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">04</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Try Our Other APIs</h2>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-4 h-4 text-emerald-400/80" />
              <h3 className="text-lg font-semibold text-white">Scrape - Web Scraping</h3>
            </div>

            <APIMethod
              method="POST"
              endpoint="/v1/scrape"
              description="Extract content from any webpage, bypass protections"
            />

            <CodeBlock
              multiLanguage={scrapeCode}
              title="Scrape webpage content"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">05</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Next Steps</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Explore Full API Reference</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Learn about all parameters, response formats, and advanced features.
            </p>
            <Link href="/docs/api/search" className="venym-btn-secondary">
              View API Docs
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Build Real Applications</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Follow step-by-step guides to build complete applications.
            </p>
            <Link href="/docs/guides/bitcoin-tracking" className="venym-btn-secondary">
              Implementation Guides
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Use SDKs & Integrations</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Speed up development with official SDKs and integrations.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/docs/sdks/python" className="venym-btn-ghost">
                Python SDK
              </Link>
              <Link href="/docs/integrations/langchain" className="venym-btn-ghost">
                LangChain
              </Link>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-violet-400/80" />
              <span className="text-[15px] font-medium text-white">Monitor Usage</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Track your API usage, credits, and performance metrics.
            </p>
            <Link href="/dashboard" className="venym-btn-secondary">
              View Dashboard
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">Need Help?</h3>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-xl mx-auto">
          Stuck on something? Our developer support team is here to help.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/docs/support" className="venym-btn-secondary">
            Get Support
          </Link>
          <Link href="/docs/examples" className="venym-btn-primary">
            View Examples
          </Link>
        </div>
      </div>
    </>
  )
}
