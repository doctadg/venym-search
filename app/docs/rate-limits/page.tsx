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
            "https://www.search.venym.io/api/v1/search",
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
        'https://www.search.venym.io/api/v1/search',
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
      https://www.search.venym.io/api/v1/search \\
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
      endpoint: "/v1/search",
      free: "10/min",
      pro: "100/min",
      enterprise: "Custom",
      credits: "1-2 per request"
    },
    {
      endpoint: "/v1/scrape",
      free: "5/min",
      pro: "50/min",
      enterprise: "Custom",
      credits: "2-5 per request"
    },
    {
      free: "2/min",
      pro: "20/min",
      enterprise: "Custom",
      credits: "5-15 per request"
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">RATE LIMITS</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Rate Limits & Usage
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Understand Venym Search's rate limiting system, credit usage, and how to handle limits gracefully in your applications.
        </p>
      </div>

      <Callout type="info" title="Rate Limiting Overview">
        Venym Search uses a combination of rate limiting (requests per minute) and credit-based billing to ensure fair usage and optimal performance for all users.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Tiers</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Rate Limit Tiers</h2>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {plans.map((plan, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-medium text-white">{plan.name}</span>
                {plan.name === 'Pro' && (
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-violet-400/20 text-violet-300/80">
                    Popular
                  </span>
                )}
              </div>
              <div className="text-2xl font-semibold text-white tabular-nums mb-1">{plan.rateLimit}</div>
              <div className="text-[12px] text-white/50 mb-4">{plan.requests}</div>

              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-amber-400/80" />
                <span className="text-[13px] text-white/70">{plan.credits} credits</span>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/65">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Per-Endpoint</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Per-Endpoint Rate Limits</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Endpoint</th>
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Free Tier</th>
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Pro Tier</th>
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Enterprise</th>
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Credits</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint, index) => (
                  <tr key={index} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-[13px] font-mono text-white/80">{endpoint.endpoint}</td>
                    <td className="px-6 py-3 text-[13px] text-white/70">{endpoint.free}</td>
                    <td className="px-6 py-3 text-[13px] font-medium text-white">{endpoint.pro}</td>
                    <td className="px-6 py-3 text-[13px] text-white/70">{endpoint.enterprise}</td>
                    <td className="px-6 py-3 text-[13px] text-white/70">{endpoint.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Headers</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Rate Limit Headers</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Every API response includes rate limit headers to help you track your usage:
        </p>

        <CodeBlock
          language="json"
          code={rateLimitHeaders}
          title="Rate Limit Response Headers"
        />

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="venym-meta mb-3">Header Descriptions</div>
            <div className="space-y-3">
              <div>
                <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-limit</code>
                <p className="text-[12.5px] text-white/55 mt-1">Total requests allowed per window</p>
              </div>
              <div>
                <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-remaining</code>
                <p className="text-[12.5px] text-white/55 mt-1">Requests remaining in current window</p>
              </div>
              <div>
                <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-reset</code>
                <p className="text-[12.5px] text-white/55 mt-1">Unix timestamp when window resets</p>
              </div>
              <div>
                <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">x-ratelimit-window</code>
                <p className="text-[12.5px] text-white/55 mt-1">Window duration in seconds</p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="venym-meta mb-3">Best Practices</div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Always check remaining requests</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Implement exponential backoff</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Cache responses when possible</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Monitor usage patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Handling Limits</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Handling Rate Limits</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          When you exceed rate limits, the API returns a <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">429 Too Many Requests</code> status.
          Here's how to handle this gracefully:
        </p>

        <CodeBlock
          multiLanguage={rateLimitExample}
          title="Rate Limit Handling with Retry Logic"
        />

        <Callout type="tip" title="Retry Strategy Tips">
          Use exponential backoff with jitter to avoid thundering herd problems. Start with 1 second delay, then 2s, 4s, etc. Always respect the <code>x-ratelimit-reset</code> header for accurate timing.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Credit Usage</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Credit Usage Monitoring</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Track your credit usage to avoid hitting billing limits:
        </p>

        <CodeBlock
          multiLanguage={billingLimitsCode}
          title="Monitor Your Credit Usage"
        />

        <Callout type="warning" title="Credit Exhaustion">
          When you run out of credits, API requests will return a <code>402 Payment Required</code> status. Set up usage monitoring to avoid service interruption.
        </Callout>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Status Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Rate Limit Status Codes</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400/80" />
              <span className="text-[14px] font-medium text-white">429 Too Many Requests</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">
              You've exceeded the rate limit for your plan. Wait before making more requests.
            </p>
            <div className="bg-[#050505] border border-white/[0.06] p-3 rounded-sm">
              <code className="text-[11.5px] font-mono text-white/70">
                {`{"error": "Rate limit exceeded", "retry_after": 60}`}
              </code>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400/80" />
              <span className="text-[14px] font-medium text-white">402 Payment Required</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">
              Your credit balance is exhausted. Upgrade your plan or wait for the next billing cycle.
            </p>
            <div className="bg-[#050505] border border-white/[0.06] p-3 rounded-sm">
              <code className="text-[11.5px] font-mono text-white/70">
                {`{"error": "Insufficient credits", "credits_remaining": 0}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Optimization</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Optimization Strategies</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Batch Operations</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Use bulk endpoints when available to reduce total requests:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Combine multiple URLs in Scrape</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Use higher <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">max_results</code> in Search</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
              </li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Request Timing</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Spread requests across time to avoid bursting:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Implement request queues</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Use background processing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Schedule during off-peak hours</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
