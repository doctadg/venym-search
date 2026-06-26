import {
  AlertTriangle,
  XCircle,
  Shield,
  Bug,
  Server,
  Zap,
  Clock,
  Key,
  CreditCard,
  CheckCircle,
  Code,
  BarChart3
} from 'lucide-react'
import { CodeBlock } from '../components/CodeBlock'
import { Callout } from '../components/Callout'

export default function ErrorsPage() {
  const errorHandlingExample = {
    python: `import requests
import time
import logging


logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

class VenymSearchError(Exception):
    """Base exception for Venym Search API errors"""
    pass

class RateLimitError(VenymSearchError):
    """Raised when rate limit is exceeded"""
    pass

class AuthenticationError(VenymSearchError):
    """Raised when authentication fails"""
    pass

class InsufficientCreditsError(VenymSearchError):
    """Raised when account has no credits"""
    pass

def make_api_request(endpoint, data, max_retries=3):
    """
    Make API request with comprehensive error handling
    """
    API_KEY = "sk_live_64_HEX_CHARS_key_here"
    base_url = "https://www.search.venym.io/api/v1"

    for attempt in range(max_retries):
        try:
            response = requests.post(
                f"{base_url}/{endpoint}",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                },
                json=data,
                timeout=30
            )

            # Handle specific status codes
            if response.status_code == 200:
                return response.json()

            elif response.status_code == 400:
                error_data = response.json()
                logger.error(f"Bad request: {error_data.get('error', 'Unknown error')}")
                raise ValueError(f"Invalid request: {error_data.get('error')}")

            elif response.status_code == 401:
                logger.error("Authentication failed - check your API key")
                raise AuthenticationError("Invalid API key")

            elif response.status_code == 402:
                logger.error("Insufficient credits")
                raise InsufficientCreditsError("Account has no remaining credits")

            elif response.status_code == 429:
                retry_after = int(response.headers.get('retry-after', 60))
                logger.warning(f"Rate limited. Waiting {retry_after} seconds...")

                if attempt < max_retries - 1:
                    time.sleep(retry_after)
                    continue
                else:
                    raise RateLimitError("Rate limit exceeded")

            elif response.status_code >= 500:
                logger.error(f"Server error: {response.status_code}")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    raise VenymSearchError(f"Server error: {response.status_code}")

            else:
                logger.error(f"Unexpected status code: {response.status_code}")
                raise VenymSearchError(f"API error: {response.status_code}")

        except requests.exceptions.Timeout:
            logger.error("Request timeout")
            if attempt < max_retries - 1:
                continue
            raise VenymSearchError("Request timeout")

        except requests.exceptions.ConnectionError:
            logger.error("Connection error")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise VenymSearchError("Connection error")

    raise VenymSearchError("Max retries exceeded")

# Example usage
try:
    result = make_api_request("search", {
        "query": "latest news",
        "max_results": 5
    })
    print(f"Success: Found {len(result['search_results'])} results")

except AuthenticationError:
    print("Please check your API key")

except InsufficientCreditsError:
    print("Please upgrade your plan or wait for credit renewal")

except RateLimitError:
    print("Please wait before making more requests")

except ValueError as e:
    print(f"Invalid request: {e}")

except VenymSearchError as e:
    print(f"API error: {e}")`,

    javascript: `const axios = require('axios');



class VenymSearchError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = 'VenymSearchError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

class RateLimitError extends VenymSearchError {
  constructor(message, retryAfter = null) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

class AuthenticationError extends VenymSearchError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class InsufficientCreditsError extends VenymSearchError {
  constructor(message) {
    super(message, 402);
    this.name = 'InsufficientCreditsError';
  }
}

async function makeApiRequest(endpoint, data, maxRetries = 3) {
  const API_KEY = 'sk_live_64_HEX_CHARS_key_here';
  const baseURL = 'https://www.search.venym.io/api/v1';

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(
        \`\${baseURL}/\${endpoint}\`,
        data,
        {
          headers: {
            'Authorization': \`Bearer \${API_KEY}\`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data;

    } catch (error) {
      const { response } = error;

      if (!response) {
        // Network error
        console.error('Network error:', error.message);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        throw new VenymSearchError('Network error: ' + error.message);
      }

      const { status, data: errorData } = response;

      switch (status) {
        case 400:
          console.error('Bad request:', errorData.error);
          throw new VenymSearchError(\`Invalid request: \${errorData.error}\`, 400, errorData);

        case 401:
          console.error('Authentication failed');
          throw new AuthenticationError('Invalid API key');

        case 402:
          console.error('Insufficient credits');
          throw new InsufficientCreditsError('Account has no remaining credits');

        case 429:
          const retryAfter = parseInt(response.headers['retry-after'] || '60');
          console.warn(\`Rate limited. Waiting \${retryAfter} seconds...\`);

          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            continue;
          }
          throw new RateLimitError('Rate limit exceeded', retryAfter);

        case 500:
        case 502:
        case 503:
        case 504:
          console.error(\`Server error: \${status}\`);
          if (attempt < maxRetries - 1) {
            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(\`Retrying in \${waitTime}ms...\`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          throw new VenymSearchError(\`Server error: \${status}\`, status, errorData);

        default:
          console.error(\`Unexpected status: \${status}\`);
          throw new VenymSearchError(\`API error: \${status}\`, status, errorData);
      }
    }
  }

  throw new VenymSearchError('Max retries exceeded');
}

// Example usage
async function example() {
  try {
    const result = await makeApiRequest('search', {
      query: 'latest news',
      max_results: 5
    });

    console.log(\`Success: Found \${result.search_results.length} results\`);

  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Please check your API key');
    } else if (error instanceof InsufficientCreditsError) {
      console.error('Please upgrade your plan or wait for credit renewal');
    } else if (error instanceof RateLimitError) {
      console.error(\`Rate limited. Retry after \${error.retryAfter} seconds\`);
    } else if (error instanceof VenymSearchError) {
      console.error(\`API error (\${error.statusCode}): \${error.message}\`);
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}

example();`,

    bash: `#!/bin/bash

# Venym Search API error handling script
API_KEY="sk_live_64_HEX_CHARS_key_here"
BASE_URL="https://www.search.venym.io/api/v1"
MAX_RETRIES=3

make_api_request() {
    local endpoint="$1"
    local data="$2"
    local attempt=1

    while [ $attempt -le $MAX_RETRIES ]; do
        echo "Attempt $attempt of $MAX_RETRIES"

        # Make the request and capture response + status code
        response=$(curl -s -w "%{json}%{http_code}" \\
            -X POST "$BASE_URL/$endpoint" \\
            -H "Authorization: Bearer $API_KEY" \\
            -H "Content-Type: application/json" \\
            -d "$data" \\
            --max-time 30)

        # Extract status code (last 3 characters)
        http_code="\${response: -3}"
        # Extract response body (everything except last 3 characters)
        response_body="\${response%???}"

        case $http_code in
            200)
                echo "Success!"
                echo "$response_body" | jq '.'
                return 0
                ;;
            400)
                echo "Bad Request (400)"
                echo "$response_body" | jq -r '.error // "Invalid request parameters"'
                return 1
                ;;
            401)
                echo "Unauthorized (401)"
                echo "Please check your API key"
                return 1
                ;;
            402)
                echo "Payment Required (402)"
                echo "Insufficient credits - please upgrade your plan"
                return 1
                ;;
            429)
                echo "Rate Limited (429)"
                retry_after=$(echo "$response_body" | jq -r '.retry_after // 60')
                if [ $attempt -lt $MAX_RETRIES ]; then
                    echo "Waiting $retry_after seconds before retry..."
                    sleep "$retry_after"
                    attempt=$((attempt + 1))
                    continue
                else
                    echo "Max retries exceeded"
                    return 1
                fi
                ;;
            5*)
                echo "Server Error ($http_code)"
                if [ $attempt -lt $MAX_RETRIES ]; then
                    wait_time=$((2 ** (attempt - 1)))
                    echo "Retrying in $wait_time seconds..."
                    sleep $wait_time
                    attempt=$((attempt + 1))
                    continue
                else
                    echo "Server error persists after $MAX_RETRIES attempts"
                    return 1
                fi
                ;;
            000)
                echo "Network Error"
                if [ $attempt -lt $MAX_RETRIES ]; then
                    echo "Connection failed, retrying..."
                    attempt=$((attempt + 1))
                    continue
                else
                    echo "Network error persists"
                    return 1
                fi
                ;;
            *)
                echo "Unexpected Status ($http_code)"
                echo "$response_body"
                return 1
                ;;
        esac
    done
}

# Example usage
echo "Testing Search API..."
make_api_request "search" '{
    "query": "latest news",
    "max_results": 5
}'`
  }

  const errorCodes = [
    {
      code: "400",
      title: "Bad Request",
      icon: XCircle,
      tone: "text-rose-300/80 border-rose-400/20",
      description: "The request was invalid or cannot be served",
      causes: [
        "Missing required parameters",
        "Invalid parameter values",
        "Malformed JSON body",
        "Invalid query syntax"
      ],
      example: {
        error: "Missing required parameter: query",
        code: "MISSING_PARAMETER",
        details: "The 'query' parameter is required for search requests"
      }
    },
    {
      code: "401",
      title: "Unauthorized",
      icon: Key,
      tone: "text-amber-300/80 border-amber-400/20",
      description: "Authentication failed or API key is invalid",
      causes: [
        "Missing Authorization header",
        "Invalid API key format",
        "Expired API key",
        "API key not found"
      ],
      example: {
        error: "Invalid API key",
        code: "AUTHENTICATION_FAILED",
        details: "Please check your API key and ensure it's correctly formatted"
      }
    },
    {
      code: "402",
      title: "Payment Required",
      icon: CreditCard,
      tone: "text-violet-300/80 border-violet-400/20",
      description: "Account has insufficient credits or billing issue",
      causes: [
        "Credits exhausted",
        "Payment method failed",
        "Account suspended",
        "Plan limit exceeded"
      ],
      example: {
        error: "Insufficient credits",
        code: "NO_CREDITS",
        credits_remaining: 0,
        details: "Your account has no remaining credits. Please upgrade your plan."
      }
    },
    {
      code: "429",
      title: "Too Many Requests",
      icon: Clock,
      tone: "text-amber-300/80 border-amber-400/20",
      description: "Rate limit exceeded for your plan tier",
      causes: [
        "Exceeded requests per minute",
        "Concurrent request limit",
        "Burst limit exceeded",
        "Daily/monthly limit reached"
      ],
      example: {
        error: "Rate limit exceeded",
        code: "RATE_LIMITED",
        retry_after: 60,
        limit: 100,
        remaining: 0,
        reset: 1640995200
      }
    },
    {
      code: "500",
      title: "Internal Server Error",
      icon: Server,
      tone: "text-white/60 border-white/15",
      description: "Unexpected server error occurred",
      causes: [
        "Database connection issues",
        "Service temporarily unavailable",
        "Unexpected system error",
        "Third-party service failure"
      ],
      example: {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        details: "An unexpected error occurred. Please try again later.",
        request_id: "req_1234567890"
      }
    }
  ]

  const validationErrors = [
    {
      field: "query",
      error: "Query parameter is required",
      fix: "Provide a non-empty query string"
    },
    {
      field: "max_results",
      error: "max_results must be between 1 and 100",
      fix: "Set max_results to a value between 1-100"
    },
    {
      field: "url",
      error: "Invalid URL format",
      fix: "Ensure URL includes protocol (http/https)"
    },
    {
      field: "extract_options",
      error: "Invalid extraction option",
      fix: "Use valid options: title, text, links, images, metadata"
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">ERROR HANDLING</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Error Handling Guide
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Comprehensive guide to handling Venym Search API errors gracefully in your applications. Learn about error codes, retry strategies, and best practices.
        </p>
      </div>

      <Callout type="info" title="Error Response Format">
        All Venym Search API errors return consistent JSON responses with error codes, descriptions, and actionable details to help you debug issues quickly.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Response Structure</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Response Structure</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          All error responses follow a consistent format to make error handling predictable:
        </p>

        <CodeBlock
          language="json"
          code={`{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "details": "You have exceeded the rate limit for your plan. Please wait before making more requests.",
  "retry_after": 60,
  "request_id": "req_1234567890",
  "timestamp": "2025-01-15T10:30:00Z",
  "documentation_url": "https://docs.search.venym.io/errors"
}`}
          title="Standard Error Response Format"
        />

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <h4 className="text-[14px] font-medium text-white mb-3">Response Fields</h4>
            <div className="space-y-2 text-[13px] text-white/70">
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">error</code> - Human-readable error message</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">code</code> - Machine-readable error code</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">details</code> - Additional context and guidance</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">request_id</code> - Unique identifier for debugging</div>
            </div>
          </div>
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <h4 className="text-[14px] font-medium text-white mb-3">Optional Fields</h4>
            <div className="space-y-2 text-[13px] text-white/70">
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">retry_after</code> - Seconds to wait before retry</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">remaining</code> - Requests/credits remaining</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">reset</code> - When limits reset (Unix timestamp)</div>
              <div><code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">validation_errors</code> - Field-specific errors</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Status Codes</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">HTTP Status Codes</h2>

        <div className="space-y-4">
          {errorCodes.map((error, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                <error.icon className="w-4 h-4 text-white/50" />
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${error.tone}`}>
                  {error.code}
                </span>
                <span className="text-[15px] font-medium text-white">{error.title}</span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[13px] text-white/55 leading-relaxed">{error.description}</p>
                <div>
                  <h4 className="text-[14px] font-medium text-white mb-2">Common Causes:</h4>
                  <ul className="space-y-1">
                    {error.causes.map((cause, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[13px] text-white/65">
                        <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[14px] font-medium text-white mb-2">Example Response:</h4>
                  <div className="bg-[#050505] border border-white/[0.06] p-3 rounded-sm">
                    <code className="text-[11.5px] font-mono text-white/70 whitespace-pre">
                      {JSON.stringify(error.example, null, 2)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Validation Errors</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Validation Errors (400)</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          When request parameters are invalid, you'll receive detailed validation errors:
        </p>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Field</th>
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Error</th>
                  <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Solution</th>
                </tr>
              </thead>
              <tbody>
                {validationErrors.map((validation, index) => (
                  <tr key={index} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-[13px] font-mono text-white/80">{validation.field}</td>
                    <td className="px-6 py-3 text-[13px] text-rose-300/80">{validation.error}</td>
                    <td className="px-6 py-3 text-[13px] text-white/65">{validation.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Implementation</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Implementation Examples</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Robust error handling with retry logic, exponential backoff, and proper exception handling:
        </p>

        <CodeBlock
          multiLanguage={errorHandlingExample}
          title="Comprehensive Error Handling"
        />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Best Practices</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Handling Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Do's</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Always check status codes before processing responses</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Implement exponential backoff for retries</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Log error details with request IDs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Handle network timeouts gracefully</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Provide meaningful error messages to users</span>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-rose-400/80" />
              <span className="text-[15px] font-medium text-white">Don'ts</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Don't ignore error responses</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Don't retry immediately without delays</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Don't expose API keys in error logs</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Don't retry on 4xx errors (except 429)</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400/80 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70">Don't fail silently - always handle errors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Monitoring</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Monitoring & Debugging</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Error Monitoring</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">
              Track error patterns to identify issues:
            </p>
            <ul className="space-y-2 text-[13px] text-white/70">
              <li>• Monitor error rates and types</li>
              <li>• Set up alerts for unusual patterns</li>
              <li>• Track retry success rates</li>
              <li>• Monitor credit usage trends</li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bug className="w-4 h-4 text-violet-400/80" />
              <span className="text-[15px] font-medium text-white">Debugging Tips</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">
              Debug issues effectively:
            </p>
            <ul className="space-y-2 text-[13px] text-white/70">
              <li>• Always log the <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">request_id</code></li>
              <li>• Include full error response in logs</li>
              <li>• Test with curl for isolated debugging</li>
              <li>• Check API status page for outages</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">Still Having Issues?</h3>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-xl mx-auto">
          If you're encountering persistent errors or need help with implementation, our support team is here to help.
        </p>
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4 text-left max-w-md mx-auto">
          <div className="text-[13px]">
            <div className="text-[14px] font-medium text-white mb-2">Include in Support Requests:</div>
            <div className="text-white/65">
              • Request ID from error response<br />
              • Full error message and status code<br />
              • Your implementation code (sanitized)<br />
              • Expected vs actual behavior
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
