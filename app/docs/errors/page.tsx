import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
    API_KEY = "sk_live_YOUR_API_KEY_API_KEY_key_here"
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
  const API_KEY = 'sk_live_YOUR_API_KEY_API_KEY_key_here';
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
API_KEY="sk_live_YOUR_API_KEY_API_KEY_key_here"
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
                echo "✅ Success!"
                echo "$response_body" | jq '.'
                return 0
                ;;
            400)
                echo "❌ Bad Request (400)"
                echo "$response_body" | jq -r '.error // "Invalid request parameters"'
                return 1
                ;;
            401)
                echo "🔒 Unauthorized (401)"
                echo "Please check your API key"
                return 1
                ;;
            402)
                echo "💳 Payment Required (402)"
                echo "Insufficient credits - please upgrade your plan"
                return 1
                ;;
            429)
                echo "⏰ Rate Limited (429)"
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
                echo "🔧 Server Error ($http_code)"
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
                echo "🌐 Network Error"
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
                echo "❓ Unexpected Status ($http_code)"
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
      color: "text-red-600",
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
      color: "text-orange-600",
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
      color: "text-purple-600",
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
      color: "text-yellow-600", 
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
      color: "text-gray-600",
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Bug className="w-6 h-6 text-red-600" />
          </div>
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Error Handling
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Error Handling Guide
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Comprehensive guide to handling Venym Search API errors gracefully in your applications.
          Learn about error codes, retry strategies, and best practices.
        </p>
      </div>

      <Callout type="info" title="Error Response Format">
        All Venym Search API errors return consistent JSON responses with error codes, descriptions, and actionable details to help you debug issues quickly.
      </Callout>

      {/* Error Response Structure */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Response Structure</h2>
        
        <p className="text-gray-600 mb-6">
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
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Response Fields</h4>
            <div className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">error</code> - Human-readable error message</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">code</code> - Machine-readable error code</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">details</code> - Additional context and guidance</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">request_id</code> - Unique identifier for debugging</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Optional Fields</h4>
            <div className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">retry_after</code> - Seconds to wait before retry</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">remaining</code> - Requests/credits remaining</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">reset</code> - When limits reset (Unix timestamp)</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">validation_errors</code> - Field-specific errors</div>
            </div>
          </div>
        </div>
      </div>

      {/* HTTP Status Codes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">HTTP Status Codes</h2>
        
        <div className="space-y-6">
          {errorCodes.map((error, index) => (
            <Card key={index} className={`border-l-4 border-l-current ${error.color}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 ${error.color}`}>
                  <error.icon className="w-6 h-6" />
                  <span>{error.code} {error.title}</span>
                </CardTitle>
                <p className="text-gray-600">{error.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Common Causes:</h4>
                  <ul className="space-y-1">
                    {error.causes.map((cause, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Example Response:</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-xs">
                      {JSON.stringify(error.example, null, 2)}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Validation Errors (400)</h2>
        
        <p className="text-gray-600 mb-6">
          When request parameters are invalid, you'll receive detailed validation errors:
        </p>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Field</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Error</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {validationErrors.map((validation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-[#17457c]">
                        {validation.field}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">{validation.error}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{validation.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Handling Implementation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Implementation Examples</h2>
        
        <p className="text-gray-600 mb-6">
          Robust error handling with retry logic, exponential backoff, and proper exception handling:
        </p>
        
        <CodeBlock
          multiLanguage={errorHandlingExample}
          title="Comprehensive Error Handling"
        />
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Handling Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Do's
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Always check status codes before processing responses</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Implement exponential backoff for retries</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Log error details with request IDs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Handle network timeouts gracefully</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Provide meaningful error messages to users</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Don'ts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Don't ignore error responses</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Don't retry immediately without delays</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Don't expose API keys in error logs</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Don't retry on 4xx errors (except 429)</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Don't fail silently - always handle errors</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monitoring & Debugging */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Monitoring & Debugging</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <BarChart3 className="w-5 h-5" />
                Error Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Track error patterns to identify issues:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Monitor error rates and types</li>
                <li>• Set up alerts for unusual patterns</li>
                <li>• Track retry success rates</li>
                <li>• Monitor credit usage trends</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Bug className="w-5 h-5" />
                Debugging Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Debug issues effectively:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Always log the <code>request_id</code></li>
                <li>• Include full error response in logs</li>
                <li>• Test with curl for isolated debugging</li>
                <li>• Check API status page for outages</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-[#17457c] mb-4">Still Having Issues?</h3>
        <p className="text-gray-600 mb-6">
          If you're encountering persistent errors or need help with implementation, our support team is here to help.
        </p>
        <div className="flex justify-center gap-4">
          <Card className="p-4">
            <div className="text-sm">
              <div className="font-semibold">Include in Support Requests:</div>
              <div className="mt-2 text-gray-600">
                • Request ID from error response<br/>
                • Full error message and status code<br/>
                • Your implementation code (sanitized)<br/>
                • Expected vs actual behavior
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}