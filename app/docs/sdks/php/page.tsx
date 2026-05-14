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
  Server,
  Database
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'


export default function PHPSDKPage() {

  const installCode = {
    composer: `# Install via Composer
composer require VENYM_SEARCH/VENYM_SEARCH-php

# Or with specific version
composer require VENYM_SEARCH/VENYM_SEARCH-php:^1.0`,
    manual: `# Manual installation
curl -sS https://getcomposer.org/installer | php
php composer.phar require VENYM_SEARCH/VENYM_SEARCH-php`
  }

  const basicUsage = `<?php

require_once 'vendor/autoload.php';



use Venym Search\\VenymSearchClient;
use Venym Search\\Exceptions\\VenymSearchException;

// Initialize the client
$client = new VenymSearchClient([
    'api_key' => $_ENV['VENYM_SEARCH_API_KEY'],
    // 'base_url' => 'https://www.search.venym.io/api/v1', // optional
    // 'timeout' => 30, // optional, default 30 seconds
    // 'retries' => 3, // optional, default 3
]);

try {
    // Perform a search
    $result = $client->search([
        'query' => 'latest PHP frameworks 2025',
        'max_results' => 10
    ]);

    echo "Found " . count($result['search_results']) . " results\\n";
    echo "Credits used: " . $result['credits_used'] . "\\n";
    echo "Credits remaining: " . $result['remaining_credits'] . "\\n";

    // Display results
    foreach ($result['search_results'] as $index => $item) {
        echo ($index + 1) . ". " . $item['title'] . "\\n";
        echo "   URL: " . $item['link'] . "\\n";
        echo "   Snippet: " . $item['snippet'] . "\\n";
        echo "   Date: " . $item['date'] . "\\n\\n";
    }

} catch (VenymSearchException $e) {
    echo "Search failed: " . $e->getMessage() . "\\n";
    echo "Error code: " . $e->getCode() . "\\n";

    if ($e->hasRequestId()) {
        echo "Request ID: " . $e->getRequestId() . "\\n";
    }
}`

  const scrapeExample = `<?php

require_once 'vendor/autoload.php';

use Venym Search\\VenymSearchClient;

$client = new VenymSearchClient([
    'api_key' => $_ENV['VENYM_SEARCH_API_KEY']
]);

// Single page scraping
function scrapeWebpage($client) {
    try {
        $result = $client->scrape([
            'url' => 'https://example.com/article',
            'extract_options' => ['title', 'text', 'links', 'images'],
            'follow_redirects' => true,
            'wait_for_selector' => '.content', // optional
            'remove_selectors' => ['.ads', '.popup'] // optional
        ]);

        echo "Page title: " . $result['primary_content']['title'] . "\\n";
        echo "Content length: " . strlen($result['primary_content']['text']) . " characters\\n";
        echo "Found links: " . count($result['extracted_data']['links']) . "\\n";
        echo "Found images: " . count($result['extracted_data']['images']) . "\\n";

    } catch (Exception $e) {
        echo "Scraping failed: " . $e->getMessage() . "\\n";
    }
}

// Bulk scraping
function bulkScrape($client) {
    $urls = [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3'
    ];

    try {
        $results = $client->scrapeBulk([
            'urls' => $urls,
            'extract_options' => ['title', 'text'],
            'concurrent' => 2 // Process 2 URLs at once
        ]);

        foreach ($results as $index => $result) {
            if ($result['success']) {
                echo $urls[$index] . ": " . $result['data']['primary_content']['title'] . "\\n";
            } else {
                echo $urls[$index] . " failed: " . $result['error'] . "\\n";
            }
        }

    } catch (Exception $e) {
        echo "Bulk scraping failed: " . $e->getMessage() . "\\n";
    }
}

scrapeWebpage($client);
bulkScrape($client);`

  const researchExample = `<?php

require_once 'vendor/autoload.php';

use Venym Search\\VenymSearchClient;

$client = new VenymSearchClient([
    'api_key' => $_ENV['VENYM_SEARCH_API_KEY']
]);

// AI-powered research
function researchTopic($client) {
    try {
        $result = $client->research([
            'topic' => 'sustainable energy solutions 2025',
            'max_sources' => 10,
            'include_images' => true,
            'language' => 'en'
        ]);

        echo "Research summary:\\n";
        echo $result['summary'] . "\\n\\n";

        echo "Key insights:\\n";
        foreach ($result['key_insights'] as $index => $insight) {
            echo ($index + 1) . ". " . $insight . "\\n";
        }

        echo "\\nSources analyzed:\\n";
        foreach ($result['sources'] as $index => $source) {
            echo ($index + 1) . ". " . $source['title'] . "\\n";
            echo "   URL: " . $source['url'] . "\\n";
            echo "   Credibility: " . $source['credibility_score'] . "\\n\\n";
        }

    } catch (Exception $e) {
        echo "Research failed: " . $e->getMessage() . "\\n";
    }
}

researchTopic($client);`

  const configExample = `<?php

require_once 'vendor/autoload.php';

use Venym Search\\VenymSearchClient;
use Venym Search\\Http\\GuzzleHttpClient;

// Advanced configuration with custom HTTP client
$httpClient = new GuzzleHttpClient([
    'timeout' => 60,
    'connect_timeout' => 10,
    'verify' => false, // Disable SSL verification if needed
    'proxy' => [
        'http' => 'http://proxy.example.com:8080',
        'https' => 'http://proxy.example.com:8080'
    ]
]);

$client = new VenymSearchClient([
    'api_key' => $_ENV['VENYM_SEARCH_API_KEY'],
    'base_url' => 'https://www.search.venym.io/api/v1',
    'http_client' => $httpClient,
    'timeout' => 60,
    'retries' => 5,
    'retry_delay' => 1, // seconds

    // Rate limiting
    'rate_limit' => [
        'requests_per_minute' => 100,
        'burst_limit' => 10
    ],

    // Custom headers
    'headers' => [
        'User-Agent' => 'MyApp/1.0.0',
        'X-Custom-Header' => 'value'
    ],

    // Response format
    'response_format' => 'detailed', // 'simple' or 'detailed'

    // Error handling
    'throw_on_error' => true,

    // Debug mode
    'debug' => $_ENV['APP_ENV'] === 'development'
]);

// Override settings per request
try {
    $result = $client->search([
        'query' => 'test query',
        'max_results' => 5
    ], [
        'timeout' => 10, // Override timeout for this request
        'retries' => 1   // Override retries for this request
    ]);

    echo "Search completed: " . count($result['search_results']) . " results\\n";

} catch (Exception $e) {
    echo "Search failed: " . $e->getMessage() . "\\n";
}`

  const errorHandlingExample = `<?php

require_once 'vendor/autoload.php';

use Venym Search\\VenymSearchClient;
use Venym Search\\Exceptions\\{
    VenymSearchException,
    RateLimitException,
    AuthenticationException,
    InsufficientCreditsException,
    ValidationException
};

$client = new VenymSearchClient([
    'api_key' => $_ENV['VENYM_SEARCH_API_KEY']
]);

function robustApiCall($client) {
    $maxRetries = 3;
    $retryDelay = 1; // seconds

    for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
        try {
            $result = $client->search([
                'query' => 'example query',
                'max_results' => 10
            ]);

            return $result;

        } catch (RateLimitException $e) {
            echo "Rate limited. Retry after " . $e->getRetryAfter() . " seconds\\n";

            if ($attempt < $maxRetries) {
                sleep($e->getRetryAfter() ?: $retryDelay);
                $retryDelay *= 2; // Exponential backoff
                continue;
            }

            throw $e;

        } catch (AuthenticationException $e) {
            echo "Authentication failed: " . $e->getMessage() . "\\n";
            throw new Exception("Check your API key", 401, $e);

        } catch (InsufficientCreditsException $e) {
            echo "No credits remaining: " . $e->getMessage() . "\\n";
            throw new Exception("Upgrade your plan", 402, $e);

        } catch (ValidationException $e) {
            echo "Invalid request: " . $e->getMessage() . "\\n";
            echo "Validation errors:\\n";

            foreach ($e->getValidationErrors() as $field => $errors) {
                echo "  $field: " . implode(', ', $errors) . "\\n";
            }

            throw $e;

        } catch (VenymSearchException $e) {
            echo "API error ({$e->getStatusCode()}): " . $e->getMessage() . "\\n";

            // Log additional context
            echo "Request ID: " . $e->getRequestId() . "\\n";
            echo "Response: " . $e->getResponseBody() . "\\n";

            if ($attempt < $maxRetries && $e->getStatusCode() >= 500) {
                echo "Retrying in $retryDelay seconds...\\n";
                sleep($retryDelay);
                $retryDelay *= 2;
                continue;
            }

            throw $e;

        } catch (Exception $e) {
            echo "Unexpected error: " . $e->getMessage() . "\\n";
            throw $e;
        }
    }

    throw new Exception("Max retries exceeded");
}

try {
    $result = robustApiCall($client);
    echo "Success: Found " . count($result['search_results']) . " results\\n";

} catch (Exception $e) {
    echo "API call failed: " . $e->getMessage() . "\\n";
}`

  const laravelExample = `<?php

// Laravel Integration Example

// config/services.php
return [
    'VENYM_SEARCH' => [
        'api_key' => env('VENYM_SEARCH_API_KEY'),
        'timeout' => 30,
        'retries' => 3,
    ]
];

// app/Services/SearchService.php
<?php

namespace App\\Services;

use Venym Search\\VenymSearchClient;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Facades\\Log;

class SearchService
{
    protected $client;

    public function __construct()
    {
        $this->client = new VenymSearchClient(config('services.VENYM_SEARCH'));
    }

    public function search(string $query, int $maxResults = 10): array
    {
        $cacheKey = 'search:' . md5($query . $maxResults);

        return Cache::remember($cacheKey, 300, function () use ($query, $maxResults) {
            try {
                return $this->client->search([
                    'query' => $query,
                    'max_results' => $maxResults
                ]);
            } catch (Exception $e) {
                Log::error('Search failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                throw $e;
            }
        });
    }

    public function scrapeUrl(string $url): array
    {
        try {
            return $this->client->scrape([
                'url' => $url,
                'extract_options' => ['title', 'text', 'metadata']
            ]);
        } catch (Exception $e) {
            Log::error('Scraping failed', [
                'url' => $url,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}

// app/Http/Controllers/SearchController.php
<?php

namespace App\\Http\\Controllers;

use App\\Services\\SearchService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class SearchController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:2|max:500',
            'max_results' => 'integer|min:1|max:100'
        ]);

        try {
            $results = $this->searchService->search(
                $request->input('query'),
                $request->input('max_results', 10)
            );

            return response()->json([
                'success' => true,
                'data' => $results
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function scrape(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        try {
            $result = $this->searchService->scrapeUrl($request->input('url'));

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}`

  const symfonyExample = `<?php

// Symfony Integration Example

// config/packages/VENYM_SEARCH.yaml
parameters:
    VENYM_SEARCH.api_key: '%env(VENYM_SEARCH_API_KEY)%'

// src/Service/VenymSearchService.php
<?php

namespace App\\Service;

use Venym Search\\VenymSearchClient;
use Symfony\\Component\\DependencyInjection\\ParameterBag\\ParameterBagInterface;
use Psr\\Log\\LoggerInterface;

class VenymSearchService
{
    private $client;
    private $logger;

    public function __construct(ParameterBagInterface $params, LoggerInterface $logger)
    {
        $this->client = new VenymSearchClient([
            'api_key' => $params->get('VENYM_SEARCH.api_key')
        ]);
        $this->logger = $logger;
    }

    public function search(string $query, int $maxResults = 10): array
    {
        try {
            $result = $this->client->search([
                'query' => $query,
                'max_results' => $maxResults
            ]);

            $this->logger->info('Search completed', [
                'query' => $query,
                'results_count' => count($result['search_results'])
            ]);

            return $result;

        } catch (\\Exception $e) {
            $this->logger->error('Search failed', [
                'query' => $query,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}

// src/Controller/ApiController.php
<?php

namespace App\\Controller;

use App\\Service\\VenymSearchService;
use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;
use Symfony\\Component\\HttpFoundation\\JsonResponse;
use Symfony\\Component\\HttpFoundation\\Request;
use Symfony\\Component\\Routing\\Annotation\\Route;
use Symfony\\Component\\Validator\\Constraints as Assert;
use Symfony\\Component\\Validator\\Validator\\ValidatorInterface;

class ApiController extends AbstractController
{
    private $searchService;

    public function __construct(VenymSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    #[Route('/api/search', name: 'api_search', methods: ['POST'])]
    public function search(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $constraints = new Assert\\Collection([
            'query' => [new Assert\\NotBlank(), new Assert\\Length(['min' => 2, 'max' => 500])],
            'max_results' => [new Assert\\Type('integer'), new Assert\\Range(['min' => 1, 'max' => 100])]
        ]);

        $violations = $validator->validate($data, $constraints);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json(['error' => 'Validation failed', 'details' => $errors], 400);
        }

        try {
            $results = $this->searchService->search(
                $data['query'],
                $data['max_results'] ?? 10
            );

            return $this->json(['success' => true, 'data' => $results]);

        } catch (\\Exception $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}`

  const features = [
    {
      icon: Zap,
      title: "High Performance",
      description: "Built with modern PHP practices, optimized for speed and memory efficiency"
    },
    {
      icon: Shield,
      title: "Type Safety",
      description: "Strong typing with PHP 8+ features including union types and attributes"
    },
    {
      icon: Database,
      title: "Framework Ready",
      description: "Seamless integration with Laravel, Symfony, and other PHP frameworks"
    },
    {
      icon: Server,
      title: "Production Ready",
      description: "Enterprise-grade error handling, logging, and monitoring capabilities"
    }
  ]

  const methods = [
    {
      method: "search($options)",
      description: "Perform real-time web search with advanced filtering options",
      returns: "array"
    },
    {
      method: "scrape($options)",
      description: "Extract content from single webpage with advanced parsing",
      returns: "array"
    },
    {
      method: "scrapeBulk($options)",
      description: "Scrape multiple URLs concurrently with progress tracking",
      returns: "array"
    },
    {
      method: "research($options)",
      description: "AI-powered research across multiple sources with summarization",
      returns: "array"
    },
    {
      method: "getUsage()",
      description: "Get current API usage statistics and remaining credits",
      returns: "array"
    },
    {
      method: "validateKey()",
      description: "Validate API key and check account status",
      returns: "boolean"
    }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>SDK · PHP</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Official
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          PHP SDK
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Official PHP SDK for Venym Search APIs. Built with modern PHP practices, supporting PHP 8+ features and seamless framework integration.
        </p>
      </div>

      <Callout type="success" title="Framework Integration Ready">
        The Venym Search PHP SDK is designed for easy integration with Laravel, Symfony, and other popular PHP frameworks with comprehensive documentation and examples.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Quick Start</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Quick Start</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Installation</h3>
            <CodeBlock multiLanguage={installCode} title="Install Venym Search PHP SDK" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Basic Usage</h3>
            <CodeBlock language="php" code={basicUsage} title="Your First Search Request" />
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
        <CodeBlock language="php" code={scrapeExample} title="Web Scraping and Bulk Operations" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Research</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">AI-Powered Research</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Leverage AI to research topics across multiple sources with automatic summarization:
        </p>
        <CodeBlock language="php" code={researchExample} title="AI Research Example" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Configuration</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Advanced Configuration</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Customize the SDK behavior with advanced configuration options:
        </p>
        <CodeBlock language="php" code={configExample} title="Advanced SDK Configuration" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">07 · Errors</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Error Handling</h2>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Robust error handling with specific exception types and retry logic:
        </p>
        <CodeBlock language="php" code={errorHandlingExample} title="Comprehensive Error Handling" />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">08 · Frameworks</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Framework Integration</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Laravel Integration</h3>
            <CodeBlock language="php" code={laravelExample} title="Complete Laravel Integration Example" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Symfony Integration</h3>
            <CodeBlock language="php" code={symfonyExample} title="Symfony Service and Controller Example" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">09 · Versions</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Version Support</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Terminal,
              title: 'PHP 8.0+',
              desc: 'Full support for PHP 8.0+ with modern language features.',
              items: ['Union types', 'Named arguments', 'Attributes', 'Match expressions']
            },
            {
              icon: Package,
              title: 'Composer',
              desc: 'Installed via Composer with automatic dependency management.',
              items: ['PSR-4 autoloading', 'Semantic versioning', 'Development tools', 'Testing framework']
            },
            {
              icon: Database,
              title: 'Extensions',
              desc: 'Compatible with common PHP extensions and libraries.',
              items: ['cURL extension', 'JSON extension', 'OpenSSL extension', 'Mbstring extension']
            }
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
        <div className="venym-meta mb-3">10 · Resources</div>
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
                { href: 'https://github.com/VENYM_SEARCH/VENYM_SEARCH-php', icon: Package, label: 'GitHub Repository' },
                { href: 'https://packagist.org/packages/VENYM_SEARCH/VENYM_SEARCH-php', icon: Download, label: 'Packagist Package' },
                { href: 'https://VENYM_SEARCH-php.readthedocs.io', icon: BookOpen, label: 'API Documentation' }
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
            Start building with the Venym Search PHP SDK and explore our comprehensive API documentation.
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
            Get support, report issues, or contribute to the Venym Search PHP SDK development.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/support" className="venym-btn-secondary">Get Support</Link>
            <a href="https://github.com/VENYM_SEARCH/VENYM_SEARCH-php/issues" target="_blank" rel="noopener noreferrer" className="venym-btn-secondary">
              Report Issue
              <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
