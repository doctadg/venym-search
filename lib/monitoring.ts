/**
 * Production monitoring and error tracking
 * 
 * Provides comprehensive error handling, performance monitoring,
 * and health checks for production deployment
 */

import { logger } from './logger'

export interface PerformanceMetrics {
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  userId?: string
  userAgent?: string
  ip?: string
  timestamp: Date
}

export interface ErrorContext {
  userId?: string
  endpoint?: string
  userAgent?: string
  ip?: string
  stack?: string
  additionalData?: any
}

class MonitoringService {
  private metrics: PerformanceMetrics[] = []
  private errorCount = 0
  private requestCount = 0

  /**
   * Track API request performance
   */
  trackRequest(metrics: PerformanceMetrics) {
    this.metrics.push(metrics)
    this.requestCount++

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Log slow requests (>5 seconds)
    if (metrics.responseTime > 5000) {
      logger.warn('slow_request', {
        endpoint: metrics.endpoint,
        method: metrics.method,
        responseTime: metrics.responseTime,
        userId: metrics.userId
      })
    }

    // Log errors
    if (metrics.statusCode >= 400) {
      this.errorCount++
      
      if (metrics.statusCode >= 500) {
        logger.error('server_error', {
          endpoint: metrics.endpoint,
          method: metrics.method,
          statusCode: metrics.statusCode,
          userId: metrics.userId
        })
      }
    }
  }

  /**
   * Track application errors
   */
  trackError(error: Error, context: ErrorContext = {}) {
    this.errorCount++

    logger.error('application_error', {
      message: error.message,
      stack: error.stack,
      ...context
    })

    // In production, you might want to send this to an external service
    // like Sentry, DataDog, or custom error tracking
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(error, context)
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    const now = Date.now()
    const last24Hours = this.metrics.filter(
      m => now - m.timestamp.getTime() < 24 * 60 * 60 * 1000
    )

    const avgResponseTime = last24Hours.length > 0 
      ? last24Hours.reduce((sum, m) => sum + m.responseTime, 0) / last24Hours.length
      : 0

    const errorRate = last24Hours.length > 0
      ? last24Hours.filter(m => m.statusCode >= 400).length / last24Hours.length
      : 0

    return {
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      last24Hours: {
        requests: last24Hours.length,
        avgResponseTime: Math.round(avgResponseTime),
        errorRate: Math.round(errorRate * 100 * 100) / 100, // percentage with 2 decimals
        errors: last24Hours.filter(m => m.statusCode >= 400).length
      }
    }
  }

  /**
   * Health check for the application
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    timestamp: Date
    checks: {
      database: boolean
      memory: boolean
      rootServer: boolean
    }
    metrics: {
      totalRequests: number
      totalErrors: number
      last24Hours: {
        requests: number
        avgResponseTime: number
        errorRate: number
        errors: number
      }
    }
  }> {
    const checks = {
      database: await this.checkDatabase(),
      memory: this.checkMemory(),
      rootServer: await this.checkRootServer(),
    }

    const allHealthy = Object.values(checks).every(check => check === true)
    const status = allHealthy ? 'healthy' : 'degraded'

    return {
      status,
      timestamp: new Date(),
      checks,
      metrics: this.getMetrics()
    }
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<boolean> {
    try {
      const { checkDatabaseHealth } = await import('./database-prisma')
      const result = await checkDatabaseHealth()
      return result.healthy
    } catch (error) {
      logger.error('Database health check failed', {}, error as Error)
      return false
    }
  }

  /**
   * Check memory usage
   */
  private checkMemory(): boolean {
    const usage = process.memoryUsage()
    const heapUsedMB = usage.heapUsed / 1024 / 1024
    const heapTotalMB = usage.heapTotal / 1024 / 1024
    
    // Alert if heap usage is over 95% (more reasonable for 4GB server)
    const memoryUsagePercent = (heapUsedMB / heapTotalMB) * 100
    
    if (memoryUsagePercent > 95) {
      logger.warn('Critical memory usage', {
        heapUsedMB: Math.round(heapUsedMB),
        heapTotalMB: Math.round(heapTotalMB),
        usagePercent: Math.round(memoryUsagePercent)
      })
      return false
    }

    return true
  }

  /**
   * Check root server connectivity (external API health)
   */
  private async checkRootServer(): Promise<boolean> {
    try {
      const rootUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.search.venym.io'
      const healthEndpoint = `${rootUrl}/api/health`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(healthEndpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Venym Search-HealthCheck/1.0'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        // Accept both 'healthy' and 'degraded' as passing for root server
        return data.status === 'healthy' || data.status === 'degraded'
      }
      
      return false
    } catch (error) {
      logger.warn('Root server health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return false
    }
  }

  /**
   * Send error to external monitoring service
   */
  private async sendToExternalService(error: Error, context: ErrorContext) {
    // Placeholder for external service integration
    // You could integrate with Sentry, DataDog, etc.
    console.error('External monitoring:', {
      error: error.message,
      stack: error.stack,
      context
    })
  }

  /**
   * Clear old metrics (for memory management)
   */
  clearOldMetrics() {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    this.metrics = this.metrics.filter(m => m.timestamp.getTime() > oneWeekAgo)
  }
}

// Global monitoring instance
export const monitoring = new MonitoringService()

/**
 * Express middleware for request tracking
 */
export function createMonitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now()

    // Override res.end to capture response metrics
    const originalEnd = res.end
    res.end = function(...args: any[]) {
      const responseTime = Date.now() - startTime
      
      monitoring.trackRequest({
        endpoint: req.url || req.path,
        method: req.method,
        statusCode: res.statusCode,
        responseTime,
        userId: req.user?.id,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection?.remoteAddress,
        timestamp: new Date()
      })

      originalEnd.apply(this, args)
    }

    next()
  }
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack
    })
    
    monitoring.trackError(new Error(`Unhandled Promise Rejection: ${reason}`), {
      additionalData: { promise: promise.toString() }
    })
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack
    })
    
    monitoring.trackError(error, {
      additionalData: { type: 'uncaughtException' }
    })

    // In production, you might want to gracefully shutdown
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  })

  // Handle SIGTERM for graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, starting graceful shutdown')
    // Perform cleanup here
    process.exit(0)
  })

  // Handle SIGINT (Ctrl+C) for graceful shutdown
  process.on('SIGINT', () => {
    logger.info('SIGINT received, starting graceful shutdown')
    // Perform cleanup here
    process.exit(0)
  })
}

/**
 * Cleanup interval for metrics (runs every hour)
 */
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    monitoring.clearOldMetrics()
  }, 60 * 60 * 1000) // 1 hour
}