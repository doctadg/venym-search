import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
API_KEY = "sk_live_YOUR_API_KEY"

# Include API key in headers
headers = {
    "Authorization": "Bearer " + API_KEY,
    "Content-Type": "application/json"
}

# Make authenticated request
response = requests.post(
    "https://www.search.venym.io/api/v1/swiftsearch",
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
const API_KEY = 'sk_live_YOUR_API_KEY';

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
    'https://www.search.venym.io/api/v1/swiftsearch',
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
API_KEY="sk_live_YOUR_API_KEY"

# Include API key in header
curl -X POST https://www.search.venym.io/api/v1/swiftsearch \\
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
response = requests.post("https://www.search.venym.io/api/v1/swiftsearch", headers=headers)`,
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
VENYM_SEARCH_API_KEY=sk_live_YOUR_API_KEY_key_here

# Load in script
source .env

# Use environment variable
curl -H "Authorization: Bearer $VENYM_SEARCH_API_KEY" \\
     https://www.search.venym.io/api/v1/swiftsearch`
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#efa72d]/10 rounded-lg">
            <Shield className="w-6 h-6 text-[#efa72d]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Authentication
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Secure access to Venym Search APIs using API keys. Learn about authentication methods, 
          security best practices, and troubleshooting common issues.
        </p>
      </div>

      {/* Quick Overview */}
      <Card className="mb-12 border-l-4 border-l-[#efa72d]">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-[#efa72d]" />
              <div>
                <div className="font-semibold text-[#17457c]">API Key Based</div>
                <div className="text-sm text-gray-600">Simple header authentication</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <div className="font-semibold text-[#17457c]">TLS Encrypted</div>
                <div className="text-sm text-gray-600">All requests over HTTPS</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-semibold text-[#17457c]">Rotate Anytime</div>
                <div className="text-sm text-gray-600">Generate new keys instantly</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Your API Key */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Getting Your API Key</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#17457c] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Create Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Sign up for a free Venym Search account</p>
                  <p className="text-sm text-gray-500 mt-1">Get 5,000 free credits to start</p>
                </div>
                <Link href="/signup">
                  <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
                    Sign Up Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#17457c] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                Generate API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Navigate to your dashboard and create a new API key</p>
                  <p className="text-sm text-gray-500 mt-1">Keys start with <code className="bg-gray-100 px-2 py-1 rounded text-xs">sk_live_YOUR_API_KEY</code></p>
                </div>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Authentication Method */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Authentication Method</h2>
        
        <p className="text-gray-600 mb-6">
          Venym Search uses API key authentication. Include your API key in the <code>Authorization: Bearer</code> header 
          with every request to authenticate your application.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Header Format</h3>
            <CodeBlock
              code="Authorization: Bearer sk_live_YOUR_API_KEY_key_here"
              language="bash"
              title="Required Authentication Header"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Examples</h3>
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

      {/* Security Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Security Best Practices</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Store your API keys in environment variables, never hardcode them in your source code.
              </p>
              
              <CodeBlock
                multiLanguage={envExamples}
                title="Using environment variables for API keys"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                What NOT to do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Never expose API keys client-side</p>
                    <p className="text-sm text-gray-600">Don't include them in JavaScript that runs in browsers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Don't commit keys to version control</p>
                    <p className="text-sm text-gray-600">Add your .env files to .gitignore</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Don't share keys in public forums</p>
                    <p className="text-sm text-gray-600">Including Stack Overflow, GitHub issues, etc.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Shield className="w-5 h-5" />
                Additional Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Use separate keys for different environments</p>
                    <p className="text-sm text-gray-600">Different keys for development, staging, and production</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Rotate keys regularly</p>
                    <p className="text-sm text-gray-600">Generate new keys monthly or when team members change</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Monitor usage in dashboard</p>
                    <p className="text-sm text-gray-600">Watch for unexpected usage patterns that might indicate compromise</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Responses */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Authentication Errors</h2>
        
        <p className="text-gray-600 mb-6">
          Common authentication error responses and how to handle them.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">401</Badge>
              Unauthorized
            </h3>
            <CodeBlock
              code={errorResponses["401"]}
              language="json"
              title="Invalid or missing API key"
            />
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Solution:</strong> Check that your API key is correct and included in the <code>Authorization: Bearer</code> header.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">403</Badge>
              Forbidden
            </h3>
            <CodeBlock
              code={errorResponses["403"]}
              language="json"
              title="Insufficient plan access"
            />
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Solution:</strong> Upgrade your plan to access this feature, or remove the restricted parameter from your request.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">429</Badge>
              Rate Limited
            </h3>
            <CodeBlock
              code={errorResponses["429"]}
              language="json"
              title="Too many requests"
            />
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Solution:</strong> Wait for the specified <code>retry_after</code> period, or upgrade your plan for higher rate limits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Authentication */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Testing Your Authentication</h2>
        
        <p className="text-gray-600 mb-6">
          Use this simple test to verify your API key is working correctly.
        </p>

        <CodeBlock
          code={`curl -X POST https://www.search.venym.io/api/v1/swiftsearch \\
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "test", "max_results": 1}'`}
          language="bash"
          title="Test authentication"
        />

        <div className="mt-6">
          <Callout type="success" title="Expected successful response">
            You should receive a 200 status code with search results and your remaining credit count.
          </Callout>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-[#17457c] mb-2">Still having authentication issues?</h3>
          <p className="text-gray-600">
            Our support team can help you troubleshoot authentication problems.
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Link href="/docs/support">
            <Button variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
              Get Help
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
              Manage API Keys
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}