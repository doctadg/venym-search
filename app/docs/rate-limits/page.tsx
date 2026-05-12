import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  TrendingUp, 
  Shield, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Timer,
  BarChart3
} from 'lucide-react'
import { CodeBlock } from '../components/CodeBlock'
import { Callout } from '../components/Callout'

export default function RateLimitsPage() {
  const rateLimitHeaders = `{
  "x-ratelimit-limit": "1000",
  "x-ratelimit-remaining": "999", 
  "x-ratelimit-reset": "1640995200",
  "x-ratelimit-window": "3600"
}`

  const rateLimitExample = {
    python: `import requests
import time

API_KEY = "sk_live_YOUR_API_KEY_API_KEY_key_here"

def make_request_with_retry():
    max_retries = 3
    retry_delay = 1
    
    for attempt in range(max_retries):
        response = requests.post(
            "https://www.search.venym.io/api/v1/swiftsearch",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"query": "test query", "max_results": 5}
        )
        
        # Check rate limit headers
        remaining = int(response.headers.get('x-ratelimit-remaining', 0))
        reset_time = int(response.headers.get('x-ratelimit-reset', 0))
        
        if response.status_code == 429:
            # Rate limited, wait and retry
            wait_time = max(retry_delay, reset_time - time.time())
            print(f"Rate limited. Waiting {wait_time} seconds...")
            time.sleep(wait_time)
            retry_delay *= 2  # Exponential backoff
            continue
        
        # Success or other error
        return response
    
    raise Exception("Max retries exceeded")

# Usage
response = make_request_with_retry()
print(f"Status: {response.status_code}")`,
    javascript: `const axios = require('axios');

const API_KEY = 'sk_live_YOUR_API_KEY_API_KEY_key_here';

async function makeRequestWithRetry() {
  const maxRetries = 3;
  let retryDelay = 1000; // 1 second
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://www.search.venym.io/api/v1/swiftsearch',
        {
          query: 'test query',
          max_results: 5
        },
        {
          headers: { 'Authorization': \`Bearer \${API_KEY}\` }
        }
      );
      
      // Check rate limit headers
      const remaining = parseInt(response.headers['x-ratelimit-remaining'] || '0');
      const resetTime = parseInt(response.headers['x-ratelimit-reset'] || '0');
      
      console.log(\`Remaining requests: \${remaining}\`);
      return response;
      
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limited, wait and retry
        const waitTime = Math.max(retryDelay, 
          (parseInt(error.response.headers['x-ratelimit-reset']) || 0) * 1000 - Date.now()
        );
        
        console.log(\`Rate limited. Waiting \${waitTime}ms...\`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retryDelay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Usage
makeRequestWithRetry()
  .then(response => console.log(\`Status: \${response.status}\`))
  .catch(error => console.error('Error:', error.message));`,
    bash: `#!/bin/bash

API_KEY="sk_live_YOUR_API_KEY_API_KEY_key_here"
MAX_RETRIES=3
RETRY_DELAY=1

make_request_with_retry() {
  local attempt=1
  
  while [ $attempt -le $MAX_RETRIES ]; do
    response=$(curl -s -w "%{http_code}" -X POST \\
      https://www.search.venym.io/api/v1/swiftsearch \\
      -H "Authorization: Bearer $API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{"query": "test query", "max_results": 5}')
    
    http_code="\${response: -3}"
    
    if [ "$http_code" = "429" ]; then
      echo "Rate limited. Waiting \${RETRY_DELAY} seconds..."
      sleep $RETRY_DELAY
      RETRY_DELAY=$((RETRY_DELAY * 2))
      attempt=$((attempt + 1))
    else
      echo "Status: $http_code"
      return 0
    fi
  done
  
  echo "Max retries exceeded"
  return 1
}

make_request_with_retry`
  }

  const billingLimitsCode = {
    python: `import requests

def check_usage():
    response = requests.get(
        "https://www.search.venym.io/api/v1/usage",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Credits used this month: {data['credits_used']}")
        print(f"Credits remaining: {data['credits_remaining']}")
        print(f"Billing cycle resets: {data['reset_date']}")
        
        # Check if approaching limit
        usage_percent = (data['credits_used'] / data['credits_limit']) * 100
        if usage_percent > 80:
            print("⚠️  Warning: Approaching credit limit!")
            
    return response.json()`,
    javascript: `async function checkUsage() {
  try {
    const response = await axios.get(
      'https://www.search.venym.io/api/v1/usage',
      { headers: { 'Authorization': \`Bearer \${API_KEY}\` } }
    );
    
    const data = response.data;
    console.log(\`Credits used this month: \${data.credits_used}\`);
    console.log(\`Credits remaining: \${data.credits_remaining}\`);
    console.log(\`Billing cycle resets: \${data.reset_date}\`);
    
    // Check if approaching limit
    const usagePercent = (data.credits_used / data.credits_limit) * 100;
    if (usagePercent > 80) {
      console.warn('⚠️  Warning: Approaching credit limit!');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking usage:', error.message);
  }
}`,
    bash: `curl -H "Authorization: Bearer $API_KEY" \\
  https://www.search.venym.io/api/v1/usage | \\
  jq '{credits_used, credits_remaining, reset_date}'`
  }

  const plans = [
    {
      name: "Free",
      requests: "1,000/month",
      rateLimit: "10/minute",
      credits: "5,000",
      features: ["Basic rate limits", "Email support", "Standard endpoints"]
    },
    {
      name: "Pro",
      requests: "25,000/month", 
      rateLimit: "100/minute",
      credits: "50,000",
      features: ["Higher rate limits", "Priority support", "All endpoints", "Bulk operations"]
    },
    {
      name: "Enterprise",
      requests: "Custom",
      rateLimit: "Custom", 
      credits: "Custom",
      features: ["Custom rate limits", "Dedicated support", "SLA guarantee", "White-label options"]
    }
  ]

  const endpoints = [
    {
      endpoint: "/v1/swiftsearch",
      free: "10/min",
      pro: "100/min",
      enterprise: "Custom",
      credits: "1-2 per request"
    },
    {
      endpoint: "/v1/scrapeforge", 
      free: "5/min",
      pro: "50/min",
      enterprise: "Custom",
      credits: "2-5 per request"
    },
    {
      endpoint: "/v1/deepdive",
      free: "2/min",
      pro: "20/min", 
      enterprise: "Custom",
      credits: "5-15 per request"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#efa72d]/10 rounded-lg">
            <Timer className="w-6 h-6 text-[#efa72d]" />
          </div>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Rate Limits
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Rate Limits & Usage
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Understand Venym Search's rate limiting system, credit usage, and how to handle limits gracefully in your applications.
        </p>
      </div>

      <Callout type="info" title="Rate Limiting Overview">
        Venym Search uses a combination of rate limiting (requests per minute) and credit-based billing to ensure fair usage and optimal performance for all users.
      </Callout>

      {/* Rate Limit Tiers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Rate Limit Tiers</h2>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`${plan.name === 'Pro' ? 'border-[#efa72d] border-2' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.name === 'Pro' && (
                    <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-[#17457c]">{plan.rateLimit}</div>
                  <div className="text-sm text-gray-600">{plan.requests}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#efa72d]" />
                  <span className="text-sm">{plan.credits} credits</span>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Per-Endpoint Limits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Per-Endpoint Rate Limits</h2>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Endpoint</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Free Tier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pro Tier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Enterprise</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {endpoints.map((endpoint, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-[#17457c]">
                        {endpoint.endpoint}
                      </td>
                      <td className="px-6 py-4 text-sm">{endpoint.free}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#efa72d]">{endpoint.pro}</td>
                      <td className="px-6 py-4 text-sm">{endpoint.enterprise}</td>
                      <td className="px-6 py-4 text-sm">{endpoint.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limit Headers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Rate Limit Headers</h2>
        
        <p className="text-gray-600 mb-6">
          Every API response includes rate limit headers to help you track your usage:
        </p>
        
        <CodeBlock
          language="json"
          code={rateLimitHeaders}
          title="Rate Limit Response Headers"
        />
        
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Header Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">x-ratelimit-limit</code>
                <p className="text-sm text-gray-600 mt-1">Total requests allowed per window</p>
              </div>
              <div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">x-ratelimit-remaining</code>
                <p className="text-sm text-gray-600 mt-1">Requests remaining in current window</p>
              </div>
              <div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">x-ratelimit-reset</code>
                <p className="text-sm text-gray-600 mt-1">Unix timestamp when window resets</p>
              </div>
              <div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">x-ratelimit-window</code>
                <p className="text-sm text-gray-600 mt-1">Window duration in seconds</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Always check remaining requests</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Implement exponential backoff</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Cache responses when possible</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Monitor usage patterns</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Handling Rate Limits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Handling Rate Limits</h2>
        
        <p className="text-gray-600 mb-6">
          When you exceed rate limits, the API returns a <code className="bg-gray-100 px-2 py-1 rounded">429 Too Many Requests</code> status. 
          Here's how to handle this gracefully:
        </p>
        
        <CodeBlock
          multiLanguage={rateLimitExample}
          title="Rate Limit Handling with Retry Logic"
        />
        
        <div className="mt-6">
          <Callout type="tip" title="Retry Strategy Tips">
            Use exponential backoff with jitter to avoid thundering herd problems. Start with 1 second delay, then 2s, 4s, etc. Always respect the <code>x-ratelimit-reset</code> header for accurate timing.
          </Callout>
        </div>
      </div>

      {/* Credit Usage Monitoring */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Credit Usage Monitoring</h2>
        
        <p className="text-gray-600 mb-6">
          Track your credit usage to avoid hitting billing limits:
        </p>
        
        <CodeBlock
          multiLanguage={billingLimitsCode}
          title="Monitor Your Credit Usage"
        />
        
        <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Credit Exhaustion:</strong> When you run out of credits, API requests will return a <code>402 Payment Required</code> status. 
            Set up usage monitoring to avoid service interruption.
          </AlertDescription>
        </Alert>
      </div>

      {/* Status Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Rate Limit Status Codes</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="w-5 h-5" />
                429 Too Many Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                You've exceeded the rate limit for your plan. Wait before making more requests.
              </p>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-xs">
                  {`{"error": "Rate limit exceeded", "retry_after": 60}`}
                </code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                402 Payment Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Your credit balance is exhausted. Upgrade your plan or wait for the next billing cycle.
              </p>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-xs">
                  {`{"error": "Insufficient credits", "credits_remaining": 0}`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Optimization Strategies</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#efa72d]" />
                Batch Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Use bulk endpoints when available to reduce total requests:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Combine multiple URLs in ScrapeForge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use higher <code>max_results</code> in SwiftSearch</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Research multiple topics in DeepDive</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Request Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Spread requests across time to avoid bursting:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Implement request queues</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use background processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Schedule during off-peak hours</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}