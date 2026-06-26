import Link from 'next/link'
import {
  Key,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { CodeBlock } from '../components/CodeBlock'
import { Callout } from '../components/Callout'
import { APIMethod } from '../components/APIMethod'

export default function AuthenticationPage() {
  const authExamples = {
    python: `import requests

# Your API key from the dashboard
API_KEY = "sk_live_64_HEX_CHARS"

# Include API key in headers
headers = {
    "Authorization": "Bearer " + API_KEY,
    "Content-Type": "application/json"
}

# Make authenticated request
response = requests.post(
    "https://www.search.venym.io/api/v1/search",
    headers=headers,
    json={"query": "test search"}
)

if response.status_code == 401:
    print("Authentication failed - check your API key")
elif response.status_code == 200:
    print("Authentication successful!")
    print(f"Remaining credits: {response.json()['remaining_credits']}")`,
    javascript: `const axios = require('axios');

// Your API key from the dashboard
const API_KEY = 'sk_live_64_HEX_CHARS';

// Include API key in headers
const config = {
  headers: {
    'Authorization': \`Bearer \$\{API_KEY\}\`,
    'Content-Type': 'application/json'
  }
};

// Make authenticated request
try {
  const response = await axios.post(
    'https://www.search.venym.io/api/v1/search',
    { query: 'test search' },
    config
  );

  console.log('Authentication successful!');
  console.log(\`Remaining credits: \$\{response.data.remaining_credits\}\`);
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Authentication failed - check your API key');
  }
}`,
    bash: `# Your API key from the dashboard
API_KEY="sk_live_64_HEX_CHARS"

# Include API key in header
curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "test search"}' \\
  --fail-with-body

# Check exit code
if [ $? -eq 0 ]; then
    echo "Authentication successful!"
else
    echo "Authentication failed - check your API key"
fi`
  }

  const envExamples = {
    python: `import os
import requests

from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv('VENYM_SEARCH_API_KEY')

if not API_KEY:
    raise ValueError("VENYM_SEARCH_API_KEY environment variable is required")

# Use in requests
headers = {"Authorization": "Bearer " + API_KEY}
response = requests.post("https://www.search.venym.io/api/v1/search", headers=headers)`,
    javascript: `require('dotenv').config();



// Get API key from environment
const API_KEY = process.env.VENYM_SEARCH_API_KEY;

if (!API_KEY) {
  throw new Error('VENYM_SEARCH_API_KEY environment variable is required');
}

// Use in requests
const config = {
  headers: { 'Authorization': \`Bearer \$\{API_KEY\}\` }
};`,
    bash: `# .env file
VENYM_SEARCH_API_KEY=sk_live_64_HEX_CHARS_key_here

# Load in script
source .env

# Use environment variable
curl -H "Authorization: Bearer $VENYM_SEARCH_API_KEY" \\
     https://www.search.venym.io/api/v1/search`
  }

  const errorResponses = {
    "401": `{
  "error": "Invalid or missing API key",
  "code": "UNAUTHORIZED",
  "message": "Please check your Authorization Bearer header"
}`,
    "403": `{
  "error": "Insufficient plan access",
  "code": "FORBIDDEN",
  "message": "Contact extraction requires Starter plan or higher",
  "upgrade_url": "/dashboard?tab=billing"
}`,
    "429": `{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "message": "Free plan limited to 10 requests per hour",
  "retry_after": 3600,
  "upgrade_url": "/dashboard?tab=billing"
}`
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">AUTHENTICATION</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Authentication
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Secure access to Venym Search APIs using API keys. Learn about authentication methods, security best practices, and troubleshooting common issues.
        </p>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 mb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-amber-400/80" />
            <div>
              <div className="text-[14px] font-medium text-white">API Key Based</div>
              <div className="text-[12.5px] text-white/55">Simple header authentication</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400/80" />
            <div>
              <div className="text-[14px] font-medium text-white">TLS Encrypted</div>
              <div className="text-[12.5px] text-white/55">All requests over HTTPS</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-sky-400/80" />
            <div>
              <div className="text-[14px] font-medium text-white">Rotate Anytime</div>
              <div className="text-[12.5px] text-white/55">Generate new keys instantly</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Getting Your Key</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Getting Your API Key</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">01</span>
              <span className="text-[15px] font-medium text-white">Create Account</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[14px] text-white/65">Sign up for a free Venym Search account</p>
                <p className="text-[12.5px] text-white/40 mt-1">Get 5,000 free credits to start</p>
              </div>
              <Link href="/signup" className="venym-btn-primary">
                Sign Up Free
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">02</span>
              <span className="text-[15px] font-medium text-white">Generate API Key</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[14px] text-white/65">Navigate to your dashboard and create a new API key</p>
                <p className="text-[12.5px] text-white/40 mt-1">Keys start with <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">sk_live_64_HEX_CHARS</code></p>
              </div>
              <Link href="/dashboard" className="venym-btn-secondary">
                Go to Dashboard
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Method</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Authentication Method</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Venym Search uses API key authentication. Include your API key in the <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">Authorization: Bearer</code> header with every request to authenticate your application.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Header Format</h3>
            <CodeBlock
              code="Authorization: Bearer sk_live_64_HEX_CHARS_key_here"
              language="bash"
              title="Required Authentication Header"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Implementation Examples</h3>
            <CodeBlock
              multiLanguage={authExamples}
              title="Authenticating API requests"
            />
          </div>
        </div>

        <Callout type="tip" title="Alternative header formats">
          You can also use <code>Authorization: Bearer your_key_here</code> if your HTTP client doesn't support custom headers easily.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Security</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Security Best Practices</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Environment Variables</span>
            </div>
            <p className="text-[14px] text-white/55 leading-relaxed mb-4">
              Store your API keys in environment variables, never hardcode them in your source code.
            </p>
            <CodeBlock
              multiLanguage={envExamples}
              title="Using environment variables for API keys"
            />
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-rose-400/80" />
              <span className="text-[15px] font-medium text-white">What NOT to do</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <EyeOff className="w-4 h-4 text-rose-400/80 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-white">Never expose API keys client-side</p>
                  <p className="text-[12.5px] text-white/55">Don't include them in JavaScript that runs in browsers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EyeOff className="w-4 h-4 text-rose-400/80 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-white">Don't commit keys to version control</p>
                  <p className="text-[12.5px] text-white/55">Add your .env files to .gitignore</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EyeOff className="w-4 h-4 text-rose-400/80 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-white">Don't share keys in public forums</p>
                  <p className="text-[12.5px] text-white/55">Including Stack Overflow, GitHub issues, etc.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Additional Security</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-white">Use separate keys for different environments</p>
                  <p className="text-[12.5px] text-white/55">Different keys for development, staging, and production</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-white">Rotate keys regularly</p>
                  <p className="text-[12.5px] text-white/55">Generate new keys monthly or when team members change</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-white">Monitor usage in dashboard</p>
                  <p className="text-[12.5px] text-white/55">Watch for unexpected usage patterns that might indicate compromise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Errors</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Authentication Errors</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Common authentication error responses and how to handle them.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-rose-400/20 text-rose-300/80">401</span>
              Unauthorized
            </h3>
            <CodeBlock code={errorResponses["401"]} language="json" title="Invalid or missing API key" />
            <div className="mt-3 p-4 border border-rose-400/20 bg-rose-400/[0.04] rounded-sm">
              <p className="text-[13px] text-white/70">
                <strong className="text-white">Solution:</strong> Check that your API key is correct and included in the <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">Authorization: Bearer</code> header.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">403</span>
              Forbidden
            </h3>
            <CodeBlock code={errorResponses["403"]} language="json" title="Insufficient plan access" />
            <div className="mt-3 p-4 border border-amber-400/20 bg-amber-400/[0.04] rounded-sm">
              <p className="text-[13px] text-white/70">
                <strong className="text-white">Solution:</strong> Upgrade your plan to access this feature, or remove the restricted parameter from your request.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">429</span>
              Rate Limited
            </h3>
            <CodeBlock code={errorResponses["429"]} language="json" title="Too many requests" />
            <div className="mt-3 p-4 border border-amber-400/20 bg-amber-400/[0.04] rounded-sm">
              <p className="text-[13px] text-white/70">
                <strong className="text-white">Solution:</strong> Wait for the specified <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">retry_after</code> period, or upgrade your plan for higher rate limits.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Testing</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Testing Your Authentication</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Use this simple test to verify your API key is working correctly.
        </p>

        <CodeBlock
          code={`curl -X POST https://www.search.venym.io/api/v1/search \\
  -H "Authorization: Bearer VENYM_SEARCH_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "test", "max_results": 1}'`}
          language="bash"
          title="Test authentication"
        />

        <Callout type="success" title="Expected successful response">
          You should receive a 200 status code with search results and your remaining credit count.
        </Callout>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Still having authentication issues?</h3>
          <p className="text-[14px] text-white/55">
            Our support team can help you troubleshoot authentication problems.
          </p>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/docs/support" className="venym-btn-secondary">
            Get Help
          </Link>
          <Link href="/dashboard" className="venym-btn-primary">
            Manage API Keys
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
