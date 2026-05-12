import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 

  GitCommit, 
  Plus, 
  Wrench, 
  Bug,
  AlertTriangle,
  Zap,
  Shield,
  Calendar

} from 'lucide-react'

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.3.0",
      date: "2025-01-15",
      type: "major",
      changes: [
        {
          type: "feature",
          description: "Improved AI summarization with better source attribution and faster processing times. Now supports up to 50 sources per research query."
        },
        {
          type: "feature", 
          title: "New Language Support",
          description: "Added support for 12 additional languages including Arabic, Hindi, and Portuguese for both search and scraping operations."
        },
        {
          type: "improvement",
          title: "Rate Limiting Optimization",
          description: "Optimized rate limiting algorithms to allow better burst handling while maintaining fair usage across all users."
        },
        {
          type: "fix",
          title: "Scrape JavaScript Rendering",
          description: "Fixed issues with JavaScript-heavy websites not rendering properly. Improved support for React and Vue.js applications."
        }
      ]
    },
    {
      version: "v2.2.1", 
      date: "2025-01-08",
      type: "patch",
      changes: [
        {
          type: "fix",
          title: "Search Result Deduplication",
          description: "Fixed issue where duplicate results could appear in search responses when using high max_results values."
        },
        {
          type: "fix",
          title: "API Key Validation",
          description: "Improved API key validation to provide clearer error messages for malformed keys."
        },
        {
          type: "improvement",
          title: "Response Time Optimization",
          description: "Reduced average API response times by 15% through infrastructure improvements."
        }
      ]
    },
    {
      version: "v2.2.0",
      date: "2025-01-01", 
      type: "minor",
      changes: [
        {
          type: "feature",
          title: "Bulk Operations for Scrape",
          description: "New bulk scraping endpoint allows processing up to 100 URLs in a single request with concurrent processing."
        },
        {
          type: "feature",
          title: "Advanced Filtering Options",
          description: "Added content filtering options including domain exclusion, date ranges, and content type filtering for all APIs."
        },
        {
          type: "improvement",
          title: "Enhanced Error Responses",
          description: "More detailed error responses with actionable suggestions and documentation links."
        },
        {
          type: "security",
          title: "Enhanced Security Headers",
          description: "Added additional security headers and improved request validation to prevent potential abuse."
        }
      ]
    },
    {
      version: "v2.1.2",
      date: "2024-12-20",
      type: "patch", 
      changes: [
        {
          type: "fix",
          title: "Memory Optimization",
          description: "Fixed memory leak in large scraping operations that could cause timeouts for complex websites."
        },
        {
          type: "fix",
          title: "Character Encoding",
          description: "Improved handling of non-UTF8 content and special characters in scraped content."
        }
      ]
    },
    {
      version: "v2.1.1",
      date: "2024-12-15",
      type: "patch",
      changes: [
        {
          type: "fix",
          title: "Search Timeout Handling",
          description: "Fixed timeout issues for complex search queries that take longer to process."
        },
        {
          type: "improvement", 
          title: "Documentation Updates",
          description: "Updated API documentation with more examples and clearer parameter descriptions."
        }
      ]
    },
    {
      version: "v2.1.0",
      date: "2024-12-10",
      type: "minor",
      changes: [
        {
          type: "feature",
          title: "Model Context Protocol (MCP) Integration",
          description: "Official MCP server for seamless integration with Claude Desktop, Cursor, and other AI tools."
        },
        {
          type: "feature",
          title: "Webhook Support",
          description: "New webhook system for real-time notifications on long-running operations and account updates."
        },
        {
          type: "improvement",
          title: "SDK Updates",
          description: "Updated all official SDKs (Python, JavaScript, Go, PHP) with better error handling and retry logic."
        }
      ]
    },
    {
      version: "v2.0.0",
      date: "2024-12-01", 
      type: "major",
      changes: [
        {
          type: "breaking",
          title: "API Version 2.0 Release",
          description: "Major API restructure with improved consistency, better error handling, and enhanced performance. See migration guide for upgrading from v1.x."
        },
        {
          type: "feature",
          description: "Brand new AI-powered research API that analyzes multiple sources and provides comprehensive summaries."
        },
        {
          type: "feature",
          title: "Enhanced Authentication",
          description: "New API key format with improved security and granular permissions."
        },
        {
          type: "improvement",
          title: "Unified Response Format",
          description: "Standardized response format across all APIs for better developer experience."
        }
      ]
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'improvement':
        return <Zap className="w-4 h-4 text-blue-600" />
      case 'fix':
        return <Bug className="w-4 h-4 text-orange-600" />
      case 'security':
        return <Shield className="w-4 h-4 text-purple-600" />
      case 'breaking':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Wrench className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      feature: "bg-green-100 text-green-800 hover:bg-green-100",
      improvement: "bg-blue-100 text-blue-800 hover:bg-blue-100", 
      fix: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      security: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      breaking: "bg-red-100 text-red-800 hover:bg-red-100"
    }
    
    return (
      <Badge className={styles[type as keyof typeof styles] || "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const getVersionBadge = (type: string) => {
    const styles = {
      major: "bg-red-100 text-red-800 hover:bg-red-100",
      minor: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      patch: "bg-green-100 text-green-800 hover:bg-green-100"
    }
    
    return (
      <Badge className={styles[type as keyof typeof styles]}>
        {type.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <GitCommit className="w-6 h-6 text-gray-600" />
          </div>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Changelog
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          API Changelog
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Track all changes, improvements, and new features in Venym Search APIs. 
          Stay up to date with the latest releases and plan your integrations accordingly.
        </p>
      </div>

      {/* Latest Release Highlight */}
      <div className="mb-12">
        <Card className="border-l-4 border-l-[#efa72d] bg-gradient-to-r from-[#efa72d]/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#efa72d]" />
                Latest Release: {releases[0].version}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getVersionBadge(releases[0].type)}
                <Badge variant="outline" className="border-[#efa72d] text-[#efa72d]">
                  Latest
                </Badge>
              </div>
            </div>
            <p className="text-gray-600">Released on {releases[0].date}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {releases[0].changes.map((change, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  {getTypeIcon(change.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{change.title}</span>
                      {getTypeBadge(change.type)}
                    </div>
                    <p className="text-sm text-gray-600">{change.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Release History */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Release History</h2>
        
        <div className="space-y-8">
          {releases.slice(1).map((release, releaseIndex) => (
            <Card key={releaseIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <GitCommit className="w-5 h-5 text-gray-600" />
                    {release.version}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    {getVersionBadge(release.type)}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {release.date}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getTypeIcon(change.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{change.title}</span>
                          {getTypeBadge(change.type)}
                        </div>
                        <p className="text-sm text-gray-600">{change.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Change Types</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Plus className="w-4 h-4 text-green-600" />
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Feature</Badge>
              </div>
              <p className="text-sm text-gray-600">New functionality and capabilities added to the API</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Improvement</Badge>
              </div>
              <p className="text-sm text-gray-600">Enhancements to existing features and performance optimizations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Bug className="w-4 h-4 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Fix</Badge>
              </div>
              <p className="text-sm text-gray-600">Bug fixes and issue resolutions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Security</Badge>
              </div>
              <p className="text-sm text-gray-600">Security improvements and vulnerability fixes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Breaking</Badge>
              </div>
              <p className="text-sm text-gray-600">Changes that may require code modifications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-4 h-4 text-gray-600" />
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Maintenance</Badge>
              </div>
              <p className="text-sm text-gray-600">Infrastructure updates and maintenance</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Versioning Info */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Semantic Versioning</h2>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-4">
              Venym Search follows Semantic Versioning (SemVer) for all API releases:
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-2">X.0.0</div>
                <div className="font-semibold text-red-700">MAJOR</div>
                <div className="text-sm text-gray-600 mt-1">Breaking changes</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">0.X.0</div>
                <div className="font-semibold text-blue-700">MINOR</div>
                <div className="text-sm text-gray-600 mt-1">New features, backward compatible</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">0.0.X</div>
                <div className="font-semibold text-green-700">PATCH</div>
                <div className="text-sm text-gray-600 mt-1">Bug fixes, backward compatible</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribe */}
      <div className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 rounded-lg p-8 text-white text-center">
        <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
        <p className="mb-6 text-white/90">
          Get notified about new releases, breaking changes, and important updates to Venym Search APIs.
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://github.com/VENYM_SEARCH/api/releases" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white px-6 py-2 rounded-lg font-medium">
              Watch on GitHub
            </button>
          </a>
          <a href="mailto:changelog@search.venym.io?subject=Subscribe to Changelog">
            <button className="border border-white text-white hover:bg-white hover:text-[#17457c] px-6 py-2 rounded-lg font-medium">
              Email Notifications
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}

