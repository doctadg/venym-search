'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Activity } from "lucide-react"

interface HealthData {
  status: string
  timestamp: string
  version?: string
  environment?: string
  uptime?: number
  responseTime: number
  database: {
    status: string
    latency?: number
    error?: string
    connectionPool?: any
  }
  system: {
    memory: {
      used: number
      total: number
      external: number
    }
    cpu: any
    nodeVersion: string
    platform: string
  }
  vercel?: {
    region?: string
    environment?: string
    deployment?: string
  }
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/health')
      const data = await response.json()
      
      if (response.ok) {
        setHealth(data)
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Health check failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'unhealthy':
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status === 'healthy' || status === 'connected' ? 'default' : 'destructive'
    return (
      <Badge variant={variant} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    )
  }

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'Unknown'
    
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (loading && !health) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#efa72d] mx-auto mb-4" />
          <p className="text-[#edf3f1]">Loading health status...</p>
        </div>
      </div>
    )
  }

  if (error && !health) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <Card className="w-full max-w-md border-4 border-red-500 bg-[#edf3f1]">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <XCircle className="h-6 w-6 mr-2" />
              Health Check Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={fetchHealth} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#17457c] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#edf3f1] flex items-center">
              <Activity className="h-8 w-8 mr-3 text-[#efa72d]" />
              System Health
            </h1>
            <p className="text-[#6b839a] mt-2">
              Last updated: {lastUpdate?.toLocaleTimeString() || 'Never'}
            </p>
          </div>
          <Button 
            onClick={fetchHealth} 
            disabled={loading}
            className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {health && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Status */}
            <Card className="border-4 border-[#efa72d] bg-[#edf3f1]">
              <CardHeader>
                <CardTitle className="text-[#17457c] flex items-center">
                  {getStatusIcon(health.status)}
                  <span className="ml-2">Overall Status</span>
                  {getStatusBadge(health.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Response Time: {health.responseTime}ms</div>
                  <div>Environment: {health.environment}</div>
                  <div>Version: {health.version || 'Unknown'}</div>
                  <div>Uptime: {formatUptime(health.uptime)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card className="border-4 border-[#efa72d] bg-[#edf3f1]">
              <CardHeader>
                <CardTitle className="text-[#17457c] flex items-center">
                  {getStatusIcon(health.database.status)}
                  <span className="ml-2">Database</span>
                  {getStatusBadge(health.database.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {health.database.latency && (
                    <div>Latency: {health.database.latency}ms</div>
                  )}
                  {health.database.connectionPool && (
                    <>
                      <div>Max Connections: {health.database.connectionPool.maxConnections}</div>
                      <div>Pooling: {health.database.connectionPool.usePooling ? 'Enabled' : 'Disabled'}</div>
                    </>
                  )}
                  {health.database.error && (
                    <div className="text-red-600 font-semibold">
                      Error: {health.database.error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Resources */}
            <Card className="border-4 border-[#efa72d] bg-[#edf3f1]">
              <CardHeader>
                <CardTitle className="text-[#17457c]">System Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Memory: {health.system.memory.used}MB / {health.system.memory.total}MB</div>
                  <div>Platform: {health.system.platform}</div>
                  <div>Node.js: {health.system.nodeVersion}</div>
                </div>
              </CardContent>
            </Card>

            {/* Vercel Info (if available) */}
            {health.vercel && (
              <Card className="border-4 border-[#efa72d] bg-[#edf3f1]">
                <CardHeader>
                  <CardTitle className="text-[#17457c]">Vercel Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Region: {health.vercel.region}</div>
                    <div>Environment: {health.vercel.environment}</div>
                    <div>Deployment: {health.vercel.deployment}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}