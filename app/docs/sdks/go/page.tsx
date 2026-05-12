import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Download, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Package,
  Terminal,
  ExternalLink,
  BookOpen,
  Cpu,
  Lock
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'

export default function GoSDKPage() {
  const installCode = `# Install using go mod
go get github.com/VENYM_SEARCH/VENYM_SEARCH-go

# Or with specific version
go get github.com/VENYM_SEARCH/VENYM_SEARCH-go@v1.2.0

# Initialize in your project
go mod init your-project
go get github.com/VENYM_SEARCH/VENYM_SEARCH-go`

  const basicUsage = `package main

import (
    "context"
    "fmt"
    "log"
    "os"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func main() {
    // Initialize client with API key
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
        // BaseURL: "https://www.search.venym.io/api/v1", // optional
        // Timeout: 30 * time.Second, // optional, default 30s
        // Retries: 3, // optional, default 3
    })
    
    ctx := context.Background()
    
    // Perform a search
    searchReq := &VENYM_SEARCH.SearchRequest{
        Query:      "latest Go programming trends 2025",
        MaxResults: 10,
    }
    
    result, err := client.Search(ctx, searchReq)
    if err != nil {
        log.Fatalf("Search failed: %v", err)
    }
    
    fmt.Printf("Found %d results\\n", len(result.SearchResults))
    fmt.Printf("Credits used: %d\\n", result.CreditsUsed)
    fmt.Printf("Credits remaining: %d\\n", result.RemainingCredits)
    
    // Display results
    for i, item := range result.SearchResults {
        fmt.Printf("%d. %s\\n", i+1, item.Title)
        fmt.Printf("   URL: %s\\n", item.Link)
        fmt.Printf("   Snippet: %s\\n", item.Snippet)
        fmt.Printf("   Date: %s\\n\\n", item.Date)
    }
}`

  const scrapeExample = `package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func scrapeWebpage() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })
    
    ctx := context.Background()
    
    // Single page scraping
    scrapeReq := &VENYM_SEARCH.ScrapeRequest{
        URL: "https://example.com/article",
        ExtractOptions: []string{"title", "text", "links", "images"},
        FollowRedirects: true,
        WaitForSelector: ".content", // optional
        RemoveSelectors: []string{".ads", ".popup"}, // optional
    }
    
    result, err := client.Scrape(ctx, scrapeReq)
    if err != nil {
        log.Fatalf("Scraping failed: %v", err)
    }
    
    fmt.Printf("Page title: %s\\n", result.PrimaryContent.Title)
    fmt.Printf("Content length: %d characters\\n", len(result.PrimaryContent.Text))
    fmt.Printf("Found links: %d\\n", len(result.ExtractedData.Links))
    fmt.Printf("Found images: %d\\n", len(result.ExtractedData.Images))
}

func bulkScrape() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })
    
    ctx := context.Background()
    
    urls := []string{
        "https://example.com/page1",
        "https://example.com/page2",
        "https://example.com/page3",
    }
    
    bulkReq := &VENYM_SEARCH.BulkScrapeRequest{
        URLs: urls,
        ExtractOptions: []string{"title", "text"},
        Concurrent: 2, // Process 2 URLs concurrently
    }
    
    results, err := client.ScrapeBulk(ctx, bulkReq)
    if err != nil {
        log.Fatalf("Bulk scraping failed: %v", err)
    }
    
    for i, result := range results {
        if result.Success {
            fmt.Printf("%s: %s\\n", urls[i], result.Data.PrimaryContent.Title)
        } else {
            fmt.Printf("%s failed: %s\\n", urls[i], result.Error)
        }
    }
}`

  const researchExample = `package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func researchTopic() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })
    
    ctx := context.Background()
    
    researchReq := &VENYM_SEARCH.ResearchRequest{
        Topic:         "sustainable energy solutions 2025",
        MaxSources:    10,
        IncludeImages: true,
        Language:      "en",
    }
    
    result, err := client.Research(ctx, researchReq)
    if err != nil {
        log.Fatalf("Research failed: %v", err)
    }
    
    fmt.Println("Research summary:")
    fmt.Println(result.Summary)
    
    fmt.Println("\\nKey insights:")
    for i, insight := range result.KeyInsights {
        fmt.Printf("%d. %s\\n", i+1, insight)
    }
    
    fmt.Println("\\nSources analyzed:")
    for i, source := range result.Sources {
        fmt.Printf("%d. %s\\n", i+1, source.Title)
        fmt.Printf("   URL: %s\\n", source.URL)
        fmt.Printf("   Credibility: %.2f\\n\\n", source.CredibilityScore)
    }
}`

  const configExample = `package main

import (
    "context"
    "net/http"
    "net/url"
    "time"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func advancedConfiguration() {
    // Custom HTTP client with proxy
    proxyURL, _ := url.Parse("http://proxy.example.com:8080")
    transport := &http.Transport{
        Proxy: http.ProxyURL(proxyURL),
    }
    
    httpClient := &http.Client{
        Transport: transport,
        Timeout:   60 * time.Second,
    }
    
    // Advanced client configuration
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey:     os.Getenv("VENYM_SEARCH_API_KEY"),
        BaseURL:    "https://www.search.venym.io/api/v1",
        HTTPClient: httpClient,
        Timeout:    60 * time.Second,
        Retries:    5,
        RetryDelay: 1 * time.Second,
        
        // Rate limiting
        RateLimit: &VENYM_SEARCH.RateLimit{
            RequestsPerMinute: 100,
            BurstLimit:        10,
        },
        
        // Custom headers
        Headers: map[string]string{
            "User-Agent":      "MyApp/1.0.0",
            "X-Custom-Header": "value",
        },
        
        // Response format
        ResponseFormat: VENYM_SEARCH.ResponseFormatDetailed,
        
        // Error handling
        ThrowOnError: true,
        
        // Debug logging
        Debug: true,
    })
    
    ctx := context.Background()
    
    // Override settings per request with context
    requestCtx := VENYM_SEARCH.WithRequestConfig(ctx, &VENYM_SEARCH.RequestConfig{
        Timeout: 10 * time.Second,
        Retries: 1,
    })
    
    result, err := client.Search(requestCtx, &VENYM_SEARCH.SearchRequest{
        Query:      "test query",
        MaxResults: 5,
    })
    
    if err != nil {
        log.Printf("Search failed: %v", err)
        return
    }
    
    fmt.Printf("Search completed: %d results\\n", len(result.SearchResults))
}`

  const errorHandlingExample = `package main

import (
    "context"
    "errors"
    "fmt"
    "log"
    "time"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func robustAPICall() (*VENYM_SEARCH.SearchResponse, error) {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })
    
    ctx := context.Background()
    
    result, err := client.Search(ctx, &VENYM_SEARCH.SearchRequest{
        Query:      "example query",
        MaxResults: 10,
    })
    
    if err != nil {
        // Handle specific error types
        var rateLimitErr *VENYM_SEARCH.RateLimitError
        var authErr *VENYM_SEARCH.AuthenticationError
        var creditsErr *VENYM_SEARCH.InsufficientCreditsError
        var apiErr *VENYM_SEARCH.APIError
        
        switch {
        case errors.As(err, &rateLimitErr):
            fmt.Printf("Rate limited. Retry after %d seconds\\n", rateLimitErr.RetryAfter)
            
            // Wait and retry
            time.Sleep(time.Duration(rateLimitErr.RetryAfter) * time.Second)
            return robustAPICall() // Recursive retry
            
        case errors.As(err, &authErr):
            log.Printf("Authentication failed: %v", authErr)
            return nil, fmt.Errorf("check your API key: %w", authErr)
            
        case errors.As(err, &creditsErr):
            log.Printf("No credits remaining: %v", creditsErr)
            return nil, fmt.Errorf("upgrade your plan: %w", creditsErr)
            
        case errors.As(err, &apiErr):
            log.Printf("API error (%d): %v", apiErr.StatusCode, apiErr)
            
            // Log additional context
            log.Printf("Request ID: %s", apiErr.RequestID)
            log.Printf("Response: %s", string(apiErr.Response))
            
            return nil, fmt.Errorf("api error: %w", apiErr)
            
        default:
            log.Printf("Unexpected error: %v", err)
            return nil, fmt.Errorf("unexpected error: %w", err)
        }
    }
    
    return result, nil
}

func main() {
    result, err := robustAPICall()
    if err != nil {
        log.Fatalf("API call failed: %v", err)
    }
    
    fmt.Printf("Success: Found %d results\\n", len(result.SearchResults))
}`

  const concurrencyExample = `package main

import (
    "context"
    "fmt"
    "sync"
    "time"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

// Worker pool for concurrent API requests
func concurrentSearch() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })
    
    queries := []string{
        "Go programming best practices",
        "microservices architecture patterns",
        "cloud native development",
        "container orchestration",
        "API security guidelines",
    }
    
    // Create channels for work distribution
    jobs := make(chan string, len(queries))
    results := make(chan *VENYM_SEARCH.SearchResponse, len(queries))
    errors := make(chan error, len(queries))
    
    // Start worker goroutines
    numWorkers := 3
    var wg sync.WaitGroup
    
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            
            for query := range jobs {
                fmt.Printf("Worker %d processing: %s\\n", workerID, query)
                
                ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
                result, err := client.Search(ctx, &VENYM_SEARCH.SearchRequest{
                    Query:      query,
                    MaxResults: 5,
                })
                cancel()
                
                if err != nil {
                    errors <- fmt.Errorf("query '%s' failed: %w", query, err)
                } else {
                    results <- result
                }
            }
        }(i)
    }
    
    // Send jobs to workers
    for _, query := range queries {
        jobs <- query
    }
    close(jobs)
    
    // Wait for completion
    go func() {
        wg.Wait()
        close(results)
        close(errors)
    }()
    
    // Collect results
    var allResults []*VENYM_SEARCH.SearchResponse
    var allErrors []error
    
    for {
        select {
        case result, ok := <-results:
            if !ok {
                results = nil
            } else {
                allResults = append(allResults, result)
            }
        case err, ok := <-errors:
            if !ok {
                errors = nil
            } else {
                allErrors = append(allErrors, err)
            }
        }
        
        if results == nil && errors == nil {
            break
        }
    }
    
    fmt.Printf("\\nCompleted: %d successful, %d errors\\n", len(allResults), len(allErrors))
    
    for _, err := range allErrors {
        fmt.Printf("Error: %v\\n", err)
    }
}

// Rate-limited batch processing
func batchProcessing() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
        RateLimit: &VENYM_SEARCH.RateLimit{
            RequestsPerMinute: 60, // 1 request per second
            BurstLimit:        5,  // Allow 5 requests in burst
        },
    })
    
    urls := []string{
        "https://example.com/page1",
        "https://example.com/page2",
        // ... more URLs
    }
    
    // Process URLs with rate limiting
    rateLimiter := time.NewTicker(1 * time.Second) // 1 request per second
    defer rateLimiter.Stop()
    
    ctx := context.Background()
    
    for i, url := range urls {
        <-rateLimiter.C // Wait for rate limiter
        
        fmt.Printf("Processing %d/%d: %s\\n", i+1, len(urls), url)
        
        result, err := client.Scrape(ctx, &VENYM_SEARCH.ScrapeRequest{
            URL:            url,
            ExtractOptions: []string{"title", "text"},
        })
        
        if err != nil {
            fmt.Printf("Failed to scrape %s: %v\\n", url, err)
            continue
        }
        
        fmt.Printf("Success: %s\\n", result.PrimaryContent.Title)
    }
}`

  const middlewareExample = `package main

import (
    "context"
    "fmt"
    "log"
    "time"
    
    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

// Custom middleware for request/response processing
type LoggingMiddleware struct{}

func (m *LoggingMiddleware) ProcessRequest(ctx context.Context, req *VENYM_SEARCH.Request) (*VENYM_SEARCH.Request, error) {
    start := time.Now()
    
    // Add custom headers
    req.Headers["X-Request-Start"] = start.Format(time.RFC3339)
    req.Headers["X-Client-Version"] = "go-sdk/1.0.0"
    
    log.Printf("Making request to %s %s", req.Method, req.URL)
    
    // Store start time in context for response middleware
    ctx = context.WithValue(ctx, "start_time", start)
    req.Context = ctx
    
    return req, nil
}

func (m *LoggingMiddleware) ProcessResponse(ctx context.Context, resp *VENYM_SEARCH.Response) (*VENYM_SEARCH.Response, error) {
    if startTime, ok := ctx.Value("start_time").(time.Time); ok {
        duration := time.Since(startTime)
        log.Printf("Request completed in %v (status: %d)", duration, resp.StatusCode)
    }
    
    return resp, nil
}

func (m *LoggingMiddleware) ProcessError(ctx context.Context, err error) error {
    log.Printf("Request failed: %v", err)
    return err // Don't modify the error
}

// Custom authentication middleware
type CustomAuthMiddleware struct {
    Token string
}

func (m *CustomAuthMiddleware) ProcessRequest(ctx context.Context, req *VENYM_SEARCH.Request) (*VENYM_SEARCH.Request, error) {
    // Add custom authentication
    req.Headers["X-Custom-Auth"] = m.generateCustomAuth()
    return req, nil
}

func (m *CustomAuthMiddleware) generateCustomAuth() string {
    // Custom authentication logic
    return fmt.Sprintf("Bearer %s", m.Token)
}

func middlewareExample() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })
    
    // Add middleware
    client.Use(&LoggingMiddleware{})
    client.Use(&CustomAuthMiddleware{Token: "custom-token"})
    
    ctx := context.Background()
    
    result, err := client.Search(ctx, &VENYM_SEARCH.SearchRequest{
        Query:      "middleware example",
        MaxResults: 5,
    })
    
    if err != nil {
        log.Printf("Search failed: %v", err)
        return
    }
    
    fmt.Printf("Search completed: %d results\\n", len(result.SearchResults))
}`

  const features = [
    {
      icon: Zap,
      title: "High Performance",
      description: "Built with Go's native performance and efficiency, optimized for concurrent operations"
    },
    {
      icon: Shield,
      title: "Type Safety",
      description: "Strong typing with comprehensive struct definitions and compile-time error checking"
    },
    {
      icon: Cpu,
      title: "Concurrency Ready",
      description: "Native goroutine support with built-in rate limiting and worker pools"
    },
    {
      icon: Lock,
      title: "Memory Safe",
      description: "Go's garbage collector and memory safety features prevent common bugs"
    }
  ]

  const methods = [
    {
      method: "Search(ctx, req)",
      description: "Perform real-time web search with context cancellation support",
      returns: "(*SearchResponse, error)"
    },
    {
      method: "Scrape(ctx, req)",
      description: "Extract content from single webpage with advanced parsing options",
      returns: "(*ScrapeResponse, error)"
    },
    {
      method: "ScrapeBulk(ctx, req)",
      description: "Scrape multiple URLs concurrently with progress tracking",
      returns: "([]*ScrapeResponse, error)"
    },
    {
      method: "Research(ctx, req)",
      description: "AI-powered research across multiple sources with summarization",
      returns: "(*ResearchResponse, error)"
    },
    {
      method: "GetUsage(ctx)",
      description: "Get current API usage statistics and remaining credits",
      returns: "(*UsageResponse, error)"
    },
    {
      method: "ValidateKey(ctx)",
      description: "Validate API key and check account status with timeout",
      returns: "(bool, error)"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <Code className="w-6 h-6 text-cyan-600" />
          </div>
          <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
            Go SDK
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-700">
            Official
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Go SDK
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Official Go SDK for Venym Search APIs. Built with Go's native performance, 
          strong typing, and excellent concurrency support for high-throughput applications.
        </p>
      </div>

      <Callout type="success" title="Performance Optimized">
        The Venym Search Go SDK is designed for high-performance applications with built-in 
        concurrency patterns, efficient memory usage, and comprehensive error handling.
      </Callout>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Start</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">1. Installation</h3>
            <CodeBlock
              language="bash"
              code={installCode}
              title="Install Venym Search Go SDK"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">2. Basic Usage</h3>
            <CodeBlock
              language="go"
              code={basicUsage}
              title="Your First Search Request"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Key Features</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <feature.icon className="w-6 h-6 text-[#efa72d]" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Methods */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Core Methods</h2>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {methods.map((method, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-[#17457c]">
                        {method.method}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{method.description}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-800">{method.returns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Web Scraping */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Web Scraping Examples</h2>
        
        <p className="text-gray-600 mb-6">
          Extract content from any webpage with advanced parsing and bulk operations:
        </p>
        
        <CodeBlock
          language="go"
          code={scrapeExample}
          title="Web Scraping and Bulk Operations"
        />
      </div>

      {/* AI Research */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">AI-Powered Research</h2>
        
        <p className="text-gray-600 mb-6">
          Leverage AI to research topics across multiple sources with automatic summarization:
        </p>
        
        <CodeBlock
          language="go"
          code={researchExample}
        />
      </div>

      {/* Configuration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Configuration</h2>
        
        <p className="text-gray-600 mb-6">
          Customize the SDK behavior with advanced configuration options:
        </p>
        
        <CodeBlock
          language="go"
          code={configExample}
          title="Advanced SDK Configuration"
        />
      </div>

      {/* Error Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Handling</h2>
        
        <p className="text-gray-600 mb-6">
          Robust error handling with Go's native error interface and specific error types:
        </p>
        
        <CodeBlock
          language="go"
          code={errorHandlingExample}
          title="Comprehensive Error Handling"
        />
      </div>

      {/* Concurrency */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Concurrency & Performance</h2>
        
        <p className="text-gray-600 mb-6">
          Leverage Go's powerful concurrency features for high-performance applications:
        </p>
        
        <CodeBlock
          language="go"
          code={concurrencyExample}
          title="Concurrent Processing with Worker Pools"
        />
      </div>

      {/* Middleware */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Custom Middleware</h2>
        
        <p className="text-gray-600 mb-6">
          Extend functionality with custom middleware for logging, authentication, and more:
        </p>
        
        <CodeBlock
          language="go"
          code={middlewareExample}
          title="Request/Response Middleware"
        />
      </div>

      {/* Package Structure */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Package Structure</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#efa72d]" />
                Core Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="text-gray-600">github.com/VENYM_SEARCH/VENYM_SEARCH-go</div>
                <div className="ml-4 text-[#17457c]">├── client.go</div>
                <div className="ml-4 text-[#17457c]">├── config.go</div>
                <div className="ml-4 text-[#17457c]">├── types.go</div>
                <div className="ml-4 text-[#17457c]">├── errors.go</div>
                <div className="ml-4 text-[#17457c]">├── middleware.go</div>
                <div className="ml-4 text-[#17457c]">└── ratelimit.go</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Import Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    import "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
                  </code>
                  <p className="text-gray-600 mt-1">Main package</p>
                </div>
                <div>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    import "github.com/VENYM_SEARCH/VENYM_SEARCH-go/middleware"
                  </code>
                  <p className="text-gray-600 mt-1">Middleware utilities</p>
                </div>
                <div>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    import "github.com/VENYM_SEARCH/VENYM_SEARCH-go/examples"
                  </code>
                  <p className="text-gray-600 mt-1">Code examples</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Environment Support */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Environment Support</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-green-600" />
                Go 1.18+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Full support for Go 1.18+ with generics and latest language features.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Generic type constraints</li>
                <li>• Context-aware operations</li>
                <li>• Module support</li>
                <li>• Build constraints</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Cross-Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Works across all platforms supported by Go runtime.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Linux (amd64, arm64)</li>
                <li>• macOS (amd64, arm64)</li>
                <li>• Windows (amd64, 386)</li>
                <li>• FreeBSD, OpenBSD</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Optimized for various deployment environments and patterns.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Docker containers</li>
                <li>• Kubernetes pods</li>
                <li>• AWS Lambda</li>
                <li>• Cloud Run</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Examples & Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Examples & Resources</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#efa72d]" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/docs/guides/bitcoin-tracking" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Bitcoin Price Tracker</span>
                </div>
              </Link>
              <Link href="/docs/guides/ecommerce-monitoring" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">E-commerce Monitor</span>
                </div>
              </Link>
              <Link href="/docs/guides/lead-generation" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Lead Generation System</span>
                </div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-500" />
                External Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="https://github.com/VENYM_SEARCH/VENYM_SEARCH-go" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </div>
              </a>
              <a href="https://pkg.go.dev/github.com/VENYM_SEARCH/VENYM_SEARCH-go" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Go Package Documentation</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </div>
              </a>
              <a href="https://goreportcard.com/report/github.com/VENYM_SEARCH/VENYM_SEARCH-go" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Go Report Card</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#17457c]">Ready to Build?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Start building with the Venym Search Go SDK and explore our comprehensive API documentation.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Button size="sm" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
                  API Reference
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/docs/guides/bitcoin-tracking">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  View Examples
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-[#17457c]">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Get support, report issues, or contribute to the Venym Search Go SDK development.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/support">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Get Support
                </Button>
              </Link>
              <a href="https://github.com/VENYM_SEARCH/VENYM_SEARCH-go/issues" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Report Issue
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}