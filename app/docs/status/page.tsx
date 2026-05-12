'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
      color: "text-green-600"
    },
    {
      title: "Avg Response Time", 
      value: "892ms",
      change: "-45ms",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Requests/Minute",
      value: "15,234",
      change: "+8.2%", 
      icon: Activity,
      color: "text-purple-600"
    },
    {
      title: "Error Rate",
      value: "0.04%",
      change: "-0.01%",
      icon: CheckCircle,
      color: "text-green-600"
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
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      operational: "bg-green-100 text-green-800 hover:bg-green-100",
      degraded: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      outage: "bg-red-100 text-red-800 hover:bg-red-100",
      resolved: "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
    
    return (
      <Badge className={styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            All Systems Operational
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          System Status
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Real-time status and performance metrics for all Venym Search services and infrastructure components.
        </p>
        
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {currentTime.toLocaleString()} UTC
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-12">
        <Card className="border-l-4 border-l-green-500 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-700">All Systems Operational</div>
                  <div className="text-green-600">No current incidents or maintenance</div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Monitoring since</div>
                <div className="font-medium">January 1, 2024</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Performance Metrics</h2>
        
        <div className="grid gap-6 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <Badge variant="outline" className={metric.change.startsWith('+') && !metric.title.includes('Error') ? 'border-green-500 text-green-700' : metric.change.startsWith('-') && metric.title.includes('Error') ? 'border-green-500 text-green-700' : metric.change.startsWith('-') ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Status */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Service Status</h2>
        
        <div className="space-y-4">
          {services.map((service, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(service.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-gray-900">{service.name}</span>
                        {getStatusBadge(service.status)}
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{service.uptime}%</div>
                      <div className="text-gray-500">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{service.responseTime}ms</div>
                      <div className="text-gray-500">Avg Response</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>30-day uptime</span>
                    <span>{service.uptime}%</span>
                  </div>
                  <Progress value={service.uptime} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Infrastructure Components</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {infrastructure.map((component, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">{component.component}</span>
                  </div>
                  {getStatusBadge(component.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{component.description}</span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Globe className="w-3 h-3" />
                    {component.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Recent Incidents</h2>
        
        <div className="space-y-6">
          {incidents.map((incident, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    {getStatusIcon(incident.status)}
                    {incident.title}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(incident.status)}
                    <div className="text-sm text-gray-500">
                      {incident.date} at {incident.time}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Duration</div>
                    <div className="text-sm text-gray-600">{incident.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Affected Services</div>
                    <div className="text-sm text-gray-600">{incident.affected.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Status</div>
                    <div className="text-sm text-gray-600 capitalize">{incident.status}</div>
                  </div>
                </div>
                <p className="text-gray-600">{incident.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscribe */}
      <div className="mb-12">
        <Card className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Stay Informed</h3>
            <p className="mb-6 text-white/90">
              Get real-time notifications about system status changes, planned maintenance, and incident updates.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white px-6 py-2 rounded-lg font-medium">
                Subscribe to Updates
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-[#17457c] px-6 py-2 rounded-lg font-medium">
                RSS Feed
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <div className="text-center text-gray-600">
        <p>
          Having issues not listed here? Contact our support team at{' '}
          <a href="mailto:support@search.venym.io" className="text-[#efa72d] hover:underline">
            support@search.venym.io
          </a>
        </p>
      </div>
    </div>
  )
}