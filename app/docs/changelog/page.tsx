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

  const typeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="w-4 h-4 text-emerald-400/80" />
      case 'improvement':
        return <Zap className="w-4 h-4 text-sky-400/80" />
      case 'fix':
        return <Bug className="w-4 h-4 text-amber-400/80" />
      case 'security':
        return <Shield className="w-4 h-4 text-violet-400/80" />
      case 'breaking':
        return <AlertTriangle className="w-4 h-4 text-rose-400/80" />
      default:
        return <Wrench className="w-4 h-4 text-white/50" />
    }
  }

  const typePill = (type: string) => {
    const tone: Record<string, string> = {
      feature: "border-emerald-400/20 text-emerald-300/80",
      improvement: "border-sky-400/20 text-sky-300/80",
      fix: "border-amber-400/20 text-amber-300/80",
      security: "border-violet-400/20 text-violet-300/80",
      breaking: "border-rose-400/20 text-rose-300/80"
    }
    return (
      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${tone[type] || 'border-white/10 text-white/60'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const versionPill = (type: string) => {
    const tone: Record<string, string> = {
      major: "border-rose-400/20 text-rose-300/80",
      minor: "border-sky-400/20 text-sky-300/80",
      patch: "border-emerald-400/20 text-emerald-300/80"
    }
    return (
      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${tone[type] || 'border-white/10 text-white/60'}`}>
        {type.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3">CHANGELOG</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          API Changelog
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Track all changes, improvements, and new features in Venym Search APIs. Stay up to date with the latest releases and plan your integrations accordingly.
        </p>
      </div>

      <div className="mb-12">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400/80" />
              <span className="text-[16px] font-medium text-white">Latest Release: {releases[0].version}</span>
            </div>
            <div className="flex items-center gap-2">
              {versionPill(releases[0].type)}
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
                Latest
              </span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-[12.5px] font-mono text-white/40 mb-4">Released on {releases[0].date}</p>
            <div className="space-y-3">
              {releases[0].changes.map((change, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-white/[0.06] rounded-sm">
                  {typeIcon(change.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[14px] font-medium text-white">{change.title}</span>
                      {typePill(change.type)}
                    </div>
                    <p className="text-[13px] text-white/55 leading-relaxed">{change.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Release History</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Release History</h2>

        <div className="space-y-4">
          {releases.slice(1).map((release, releaseIndex) => (
            <div key={releaseIndex} className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <GitCommit className="w-4 h-4 text-white/50" />
                  <span className="text-[15px] font-medium text-white">{release.version}</span>
                </div>
                <div className="flex items-center gap-3">
                  {versionPill(release.type)}
                  <div className="flex items-center gap-1.5 text-[12px] font-mono text-white/40">
                    <Calendar className="w-3 h-3" />
                    {release.date}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start gap-3 p-3 border border-white/[0.04] bg-white/[0.01] rounded-sm">
                      {typeIcon(change.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[14px] font-medium text-white">{change.title}</span>
                          {typePill(change.type)}
                        </div>
                        <p className="text-[13px] text-white/55 leading-relaxed">{change.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Change Types</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Change Types</h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Plus className="w-4 h-4 text-emerald-400/80" />, type: 'feature', desc: 'New functionality and capabilities added to the API' },
            { icon: <Zap className="w-4 h-4 text-sky-400/80" />, type: 'improvement', desc: 'Enhancements to existing features and performance optimizations' },
            { icon: <Bug className="w-4 h-4 text-amber-400/80" />, type: 'fix', desc: 'Bug fixes and issue resolutions' },
            { icon: <Shield className="w-4 h-4 text-violet-400/80" />, type: 'security', desc: 'Security improvements and vulnerability fixes' },
            { icon: <AlertTriangle className="w-4 h-4 text-rose-400/80" />, type: 'breaking', desc: 'Changes that may require code modifications' },
            { icon: <Wrench className="w-4 h-4 text-white/50" />, type: 'maintenance', desc: 'Infrastructure updates and maintenance' },
          ].map((item) => (
            <div key={item.type} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                {typePill(item.type)}
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Versioning</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Semantic Versioning</h2>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
          <p className="text-[14px] text-white/55 leading-relaxed mb-6">
            Venym Search follows Semantic Versioning (SemVer) for all API releases:
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-5 border border-rose-400/20 bg-rose-400/[0.03] rounded-sm">
              <div className="text-2xl font-semibold text-rose-300/80 tabular-nums mb-2">X.0.0</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-300/80">MAJOR</div>
              <div className="text-[12px] text-white/55 mt-2">Breaking changes</div>
            </div>

            <div className="text-center p-5 border border-sky-400/20 bg-sky-400/[0.03] rounded-sm">
              <div className="text-2xl font-semibold text-sky-300/80 tabular-nums mb-2">0.X.0</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-300/80">MINOR</div>
              <div className="text-[12px] text-white/55 mt-2">New features, backward compatible</div>
            </div>

            <div className="text-center p-5 border border-emerald-400/20 bg-emerald-400/[0.03] rounded-sm">
              <div className="text-2xl font-semibold text-emerald-300/80 tabular-nums mb-2">0.0.X</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/80">PATCH</div>
              <div className="text-[12px] text-white/55 mt-2">Bug fixes, backward compatible</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">Stay Updated</h3>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-xl mx-auto">
          Get notified about new releases, breaking changes, and important updates to Venym Search APIs.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href="https://github.com/VENYM_SEARCH/api/releases" target="_blank" rel="noopener noreferrer" className="venym-btn-primary">
            Watch on GitHub
          </a>
          <a href="mailto:changelog@search.venym.io?subject=Subscribe to Changelog" className="venym-btn-secondary">
            Email Notifications
          </a>
        </div>
      </div>
    </div>
  )
}
