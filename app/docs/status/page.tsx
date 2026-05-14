'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Globe,
  Server,
  Database,
  Zap,
  TrendingUp
} from 'lucide-react'

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const services = [
    {
      name: "Search API",
      status: "operational",
      uptime: 99.98,
      responseTime: 245,
      description: "Real-time web search and extraction"
    },
    {
      name: "Scrape API",
      status: "operational",
      uptime: 99.95,
      responseTime: 1240,
      description: "Web scraping and content extraction"
    },
    {
      status: "operational",
      uptime: 99.92,
      responseTime: 3450,
      description: "AI-powered research and analysis"
    },
    {
      name: "Authentication Service",
      status: "operational",
      uptime: 99.99,
      responseTime: 89,
      description: "API key validation and rate limiting"
    },
    {
      name: "Dashboard & Portal",
      status: "operational",
      uptime: 99.96,
      responseTime: 156,
      description: "User dashboard and account management"
    },
    {
      name: "Documentation Site",
      status: "operational",
      uptime: 99.99,
      responseTime: 134,
      description: "API documentation and guides"
    }
  ]

  const infrastructure = [
    {
      component: "Load Balancers",
      status: "operational",
      location: "Global",
      description: "Request distribution and failover"
    },
    {
      component: "Database Cluster",
      status: "operational",
      location: "US East",
      description: "Primary data storage and replication"
    },
    {
      component: "Cache Layer",
      status: "operational",
      location: "Multi-region",
      description: "Redis cluster for response caching"
    },
    {
      component: "CDN Network",
      status: "operational",
      location: "Global",
      description: "Content delivery and static assets"
    }
  ]

  const metrics = [
    {
      title: "Overall Uptime",
      value: "99.96%",
      change: "+0.02%",
      icon: TrendingUp,
    },
    {
      title: "Avg Response Time",
      value: "892ms",
      change: "-45ms",
      icon: Zap,
    },
    {
      title: "Requests/Minute",
      value: "15,234",
      change: "+8.2%",
      icon: Activity,
    },
    {
      title: "Error Rate",
      value: "0.04%",
      change: "-0.01%",
      icon: CheckCircle,
    }
  ]

  const incidents = [
    {
      title: "Increased Response Times",
      status: "resolved",
      date: "2025-01-10",
      time: "14:30 UTC",
      duration: "23 minutes",
      affected: ["Scrape API"],
      description: "Brief increase in response times due to high load. Resolved by scaling infrastructure."
    },
    {
      title: "Authentication Service Maintenance",
      status: "resolved",
      date: "2025-01-05",
      time: "02:00 UTC",
      duration: "15 minutes",
      affected: ["Authentication Service"],
      description: "Scheduled maintenance for security updates. No service interruption."
    },
    {
      title: "Partial Search Outage",
      status: "resolved",
      date: "2024-12-28",
      time: "09:45 UTC",
      duration: "1 hour 12 minutes",
      affected: ["Search API"],
      description: "Database failover caused temporary search unavailability. Resolved with backup systems."
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-emerald-400/80" />
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-amber-400/80" />
      case 'outage':
        return <XCircle className="w-4 h-4 text-rose-400/80" />
      default:
        return <Clock className="w-4 h-4 text-white/40" />
    }
  }

  const getStatusBadge = (status: string) => {
    const tone: Record<string, string> = {
      operational: "border-emerald-400/20 text-emerald-300/80",
      degraded: "border-amber-400/20 text-amber-300/80",
      outage: "border-rose-400/20 text-rose-300/80",
      resolved: "border-sky-400/20 text-sky-300/80"
    }

    return (
      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${tone[status] || 'border-white/10 text-white/60'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            All Systems Operational
          </span>
        </div>
        <div className="venym-meta mb-3">STATUS</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          System Status
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Real-time status and performance metrics for all Venym Search services and infrastructure components.
        </p>

        <div className="mt-4 text-[12px] font-mono text-white/40">
          Last updated: {currentTime.toLocaleString()} UTC
        </div>
      </div>

      <div className="mb-12">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400/80" />
              <div>
                <div className="text-xl font-semibold text-white">All Systems Operational</div>
                <div className="text-[13px] text-white/55">No current incidents or maintenance</div>
              </div>
            </div>
            <div className="text-right text-[12px]">
              <div className="text-white/40 font-mono uppercase tracking-[0.15em]">Monitoring since</div>
              <div className="text-white/70 mt-1">January 1, 2024</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Performance Metrics</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Performance Metrics</h2>

        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <metric.icon className="w-4 h-4 text-white/50" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-semibold text-white tabular-nums mb-1">{metric.value}</div>
              <div className="text-[12px] text-white/50">{metric.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Service Status</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Service Status</h2>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {getStatusIcon(service.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-[14px] font-medium text-white">{service.name}</span>
                      {getStatusBadge(service.status)}
                    </div>
                    <p className="text-[13px] text-white/55">{service.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-[12px]">
                  <div className="text-center">
                    <div className="font-medium text-white tabular-nums">{service.uptime}%</div>
                    <div className="text-white/40 font-mono uppercase tracking-[0.15em] text-[10px] mt-1">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-white tabular-nums">{service.responseTime}ms</div>
                    <div className="text-white/40 font-mono uppercase tracking-[0.15em] text-[10px] mt-1">Avg</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-1.5">
                  <span>30-day uptime</span>
                  <span>{service.uptime}%</span>
                </div>
                <div className="h-1 bg-white/[0.04] rounded-sm overflow-hidden">
                  <div className="h-full bg-emerald-400/40" style={{ width: `${service.uptime}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Infrastructure</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Infrastructure Components</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {infrastructure.map((component, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-white/50" />
                  <span className="text-[14px] font-medium text-white">{component.component}</span>
                </div>
                {getStatusBadge(component.status)}
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/55">{component.description}</span>
                <div className="flex items-center gap-1 text-white/40 text-[12px] font-mono">
                  <Globe className="w-3 h-3" />
                  {component.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Recent Incidents</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Recent Incidents</h2>

        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(incident.status)}
                  <span className="text-[15px] font-medium text-white">{incident.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(incident.status)}
                  <div className="text-[11px] font-mono text-white/40">
                    {incident.date} · {incident.time}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-1">Duration</div>
                    <div className="text-[13px] text-white/70">{incident.duration}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-1">Affected Services</div>
                    <div className="text-[13px] text-white/70">{incident.affected.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-1">Status</div>
                    <div className="text-[13px] text-white/70 capitalize">{incident.status}</div>
                  </div>
                </div>
                <p className="text-[13px] text-white/55 leading-relaxed">{incident.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">Stay Informed</h3>
          <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-xl mx-auto">
            Get real-time notifications about system status changes, planned maintenance, and incident updates.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button className="venym-btn-primary">Subscribe to Updates</button>
            <button className="venym-btn-secondary">RSS Feed</button>
          </div>
        </div>
      </div>

      <div className="text-center text-[13px] text-white/55">
        <p>
          Having issues not listed here? Contact our support team at{' '}
          <a href="mailto:support@search.venym.io" className="text-white hover:text-white/80 underline underline-offset-2 decoration-white/30">
            support@search.venym.io
          </a>
        </p>
      </div>
    </div>
  )
}
