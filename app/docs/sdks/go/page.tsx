import Link from 'next/link'
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
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })

    ctx := context.Background()

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
}`

  const scrapeExample = `package main

import (
    "context"
    "fmt"
    "log"
    "os"

    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func scrapeWebpage() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })

    ctx := context.Background()

    scrapeReq := &VENYM_SEARCH.ScrapeRequest{
        URL: "https://example.com/article",
        ExtractOptions: []string{"title", "text", "links", "images"},
        FollowRedirects: true,
        WaitForSelector: ".content",
        RemoveSelectors: []string{".ads", ".popup"},
    }

    result, err := client.Scrape(ctx, scrapeReq)
    if err != nil {
        log.Fatalf("Scraping failed: %v", err)
    }

    fmt.Printf("Page title: %s\\n", result.PrimaryContent.Title)
    fmt.Printf("Content length: %d characters\\n", len(result.PrimaryContent.Text))
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
        Concurrent: 2,
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
    "os"

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

    fmt.Println(result.Summary)
}`

  const configExample = `package main

import (
    "context"
    "net/http"
    "net/url"
    "os"
    "time"

    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func advancedConfiguration() {
    proxyURL, _ := url.Parse("http://proxy.example.com:8080")
    transport := &http.Transport{
        Proxy: http.ProxyURL(proxyURL),
    }

    httpClient := &http.Client{
        Transport: transport,
        Timeout:   60 * time.Second,
    }

    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey:     os.Getenv("VENYM_SEARCH_API_KEY"),
        HTTPClient: httpClient,
        Timeout:    60 * time.Second,
        Retries:    5,
        RetryDelay: 1 * time.Second,
    })

    _ = client
    _ = context.Background()
}`

  const errorHandlingExample = `package main

import (
    "context"
    "errors"
    "fmt"
    "log"
    "os"
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
        var rateLimitErr *VENYM_SEARCH.RateLimitError
        var authErr *VENYM_SEARCH.AuthenticationError

        switch {
        case errors.As(err, &rateLimitErr):
            time.Sleep(time.Duration(rateLimitErr.RetryAfter) * time.Second)
            return robustAPICall()
        case errors.As(err, &authErr):
            return nil, fmt.Errorf("check your API key: %w", authErr)
        default:
            log.Printf("Unexpected error: %v", err)
            return nil, err
        }
    }

    return result, nil
}`

  const concurrencyExample = `package main

import (
    "context"
    "fmt"
    "os"
    "sync"
    "time"

    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

func concurrentSearch() {
    client := VENYM_SEARCH.NewClient(&VENYM_SEARCH.Config{
        APIKey: os.Getenv("VENYM_SEARCH_API_KEY"),
    })

    queries := []string{
        "Go programming best practices",
        "microservices architecture patterns",
        "cloud native development",
    }

    jobs := make(chan string, len(queries))
    results := make(chan *VENYM_SEARCH.SearchResponse, len(queries))

    numWorkers := 3
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for query := range jobs {
                ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
                result, err := client.Search(ctx, &VENYM_SEARCH.SearchRequest{
                    Query:      query,
                    MaxResults: 5,
                })
                cancel()
                if err == nil {
                    results <- result
                }
            }
        }()
    }

    for _, query := range queries {
        jobs <- query
    }
    close(jobs)

    go func() {
        wg.Wait()
        close(results)
    }()

    for result := range results {
        fmt.Printf("Got %d results\\n", len(result.SearchResults))
    }
}`

  const middlewareExample = `package main

import (
    "context"
    "log"
    "time"

    "github.com/VENYM_SEARCH/VENYM_SEARCH-go"
)

type LoggingMiddleware struct{}

func (m *LoggingMiddleware) ProcessRequest(ctx context.Context, req *VENYM_SEARCH.Request) (*VENYM_SEARCH.Request, error) {
    start := time.Now()
    req.Headers["X-Request-Start"] = start.Format(time.RFC3339)
    log.Printf("Making request to %s %s", req.Method, req.URL)
    return req, nil
}

func (m *LoggingMiddleware) ProcessResponse(ctx context.Context, resp *VENYM_SEARCH.Response) (*VENYM_SEARCH.Response, error) {
    log.Printf("Request completed (status: %d)", resp.StatusCode)
    return resp, nil
}`

  const features = [
    { icon: Zap, title: "High Performance", description: "Built with Go's native performance and efficiency, optimized for concurrent operations" },
    { icon: Shield, title: "Type Safety", description: "Strong typing with comprehensive struct definitions and compile-time error checking" },
    { icon: Cpu, title: "Concurrency Ready", description: "Native goroutine support with built-in rate limiting and worker pools" },
    { icon: Lock, title: "Memory Safe", description: "Go's garbage collector and memory safety features prevent common bugs" }
  ]

  const methods = [
    { method: "Search(ctx, req)", description: "Perform real-time web search with context cancellation support", returns: "(*SearchResponse, error)" },
    { method: "Scrape(ctx, req)", description: "Extract content from single webpage with advanced parsing options", returns: "(*ScrapeResponse, error)" },
    { method: "ScrapeBulk(ctx, req)", description: "Scrape multiple URLs concurrently with progress tracking", returns: "([]*ScrapeResponse, error)" },
    { method: "Research(ctx, req)", description: "AI-powered research across multiple sources with summarization", returns: "(*ResearchResponse, error)" },
    { method: "GetUsage(ctx)", description: "Get current API usage statistics and remaining credits", returns: "(*UsageResponse, error)" },
    { method: "ValidateKey(ctx)", description: "Validate API key and check account status with timeout", returns: "(bool, error)" }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>SDK · GO</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Official
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Go SDK
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Official Go SDK for Venym Search APIs. Built with Go's native performance, strong typing, and excellent concurrency support for high-throughput applications.
        </p>
      </div>

      <Callout type="success" title="Performance Optimized">
        The Venym Search Go SDK is designed for high-performance applications with built-in concurrency patterns, efficient memory usage, and comprehensive error handling.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Start</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Installation</h3>
            <CodeBlock language="bash" code={installCode} title="Install Venym Search Go SDK" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Basic Usage</h3>
            <CodeBlock language="go" code={basicUsage} title="Your First Search Request" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Features</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Key Features</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-4 h-4 text-amber-400/80" />
                <span className="text-[15px] font-medium text-white">{feature.title}</span>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Methods</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Core Methods</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Method</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Description</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Returns</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((method, index) => (
                <tr key={index} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-[13px] font-mono text-white/80">{method.method}</td>
                  <td className="px-6 py-3 text-[13px] text-white/65">{method.description}</td>
                  <td className="px-6 py-3 text-[13px] font-mono text-white/70">{method.returns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Scraping</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Web Scraping Examples</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Extract content from any webpage with advanced parsing and bulk operations:
        </p>
        <CodeBlock language="go" code={scrapeExample} title="Web Scraping and Bulk Operations" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Research</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">AI-Powered Research</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Leverage AI to research topics across multiple sources with automatic summarization:
        </p>
        <CodeBlock language="go" code={researchExample} title="AI Research Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Configuration</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Configuration</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Customize the SDK behavior with advanced configuration options:
        </p>
        <CodeBlock language="go" code={configExample} title="Advanced SDK Configuration" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Errors</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Handling</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Robust error handling with Go's native error interface and specific error types:
        </p>
        <CodeBlock language="go" code={errorHandlingExample} title="Comprehensive Error Handling" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">08 · Concurrency</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Concurrency & Performance</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Leverage Go's powerful concurrency features for high-performance applications:
        </p>
        <CodeBlock language="go" code={concurrencyExample} title="Concurrent Processing with Worker Pools" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">09 · Middleware</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Custom Middleware</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Extend functionality with custom middleware for logging, authentication, and more:
        </p>
        <CodeBlock language="go" code={middlewareExample} title="Request/Response Middleware" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">10 · Environment</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Environment Support</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Terminal, title: 'Go 1.18+', desc: 'Full support for Go 1.18+ with generics and latest language features.', items: ['Generic type constraints', 'Context-aware operations', 'Module support', 'Build constraints'] },
            { icon: Globe, title: 'Cross-Platform', desc: 'Works across all platforms supported by Go runtime.', items: ['Linux (amd64, arm64)', 'macOS (amd64, arm64)', 'Windows (amd64, 386)', 'FreeBSD, OpenBSD'] },
            { icon: Zap, title: 'Deployment', desc: 'Optimized for various deployment environments and patterns.', items: ['Docker containers', 'Kubernetes pods', 'AWS Lambda', 'Cloud Run'] }
          ].map((env) => (
            <div key={env.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <env.icon className="w-4 h-4 text-white/50" />
                <span className="text-[14px] font-medium text-white">{env.title}</span>
              </div>
              <p className="text-[12.5px] text-white/55 leading-relaxed mb-3">{env.desc}</p>
              <ul className="text-[12px] text-white/40 space-y-1">
                {env.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">11 · Resources</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Examples & Resources</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Code Examples</span>
            </div>
            <div className="space-y-2">
              {[
                { href: '/docs/guides/bitcoin-tracking', label: 'Bitcoin Price Tracker' },
                { href: '/docs/guides/ecommerce-monitoring', label: 'E-commerce Monitor' },
                { href: '/docs/guides/lead-generation', label: 'Lead Generation System' }
              ].map((g) => (
                <Link key={g.href} href={g.href} className="flex items-center gap-2 p-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.02] rounded-sm transition-colors">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>{g.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">External Resources</span>
            </div>
            <div className="space-y-2">
              {[
                { href: 'https://github.com/VENYM_SEARCH/VENYM_SEARCH-go', icon: Package, label: 'GitHub Repository' },
                { href: 'https://pkg.go.dev/github.com/VENYM_SEARCH/VENYM_SEARCH-go', icon: BookOpen, label: 'Go Package Documentation' },
                { href: 'https://goreportcard.com/report/github.com/VENYM_SEARCH/VENYM_SEARCH-go', icon: CheckCircle, label: 'Go Report Card' }
              ].map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.02] rounded-sm transition-colors">
                  <l.icon className="w-3.5 h-3.5 text-white/50" />
                  <span>{l.label}</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-white/40" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <h3 className="text-[15px] font-medium text-white mb-3">Ready to Build?</h3>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Start building with the Venym Search Go SDK and explore our comprehensive API documentation.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/api/search" className="venym-btn-primary">
              API Reference
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
            <Link href="/docs/guides/bitcoin-tracking" className="venym-btn-secondary">
              View Examples
            </Link>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <h3 className="text-[15px] font-medium text-white mb-3">Need Help?</h3>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Get support, report issues, or contribute to the Venym Search Go SDK development.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/support" className="venym-btn-secondary">Get Support</Link>
            <a href="https://github.com/VENYM_SEARCH/VENYM_SEARCH-go/issues" target="_blank" rel="noopener noreferrer" className="venym-btn-secondary">
              Report Issue
              <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
