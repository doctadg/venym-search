/**
 * Structured Logging Utility
 * 
 * Provides consistent logging across the application with different levels,
 * request tracing, and production-ready log formatting.
 */

export interface LogContext {
  requestId?: string
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  method?: string
  url?: string
  statusCode?: number
  duration?: number
  [key: string]: any
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
  environment: string
  service: string
  version?: string
}

class Logger {
  private readonly service = 'venym-search-api'
  private readonly version = process.env.npm_package_version || 'unknown'
  private readonly environment = process.env.NODE_ENV || 'development'

  private shouldLog(level: LogLevel): boolean {
    const logLevels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      fatal: 4
    }

    const minLevel = this.environment === 'production' ? 'info' : 'debug'
    return logLevels[level] >= logLevels[minLevel]
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: this.environment,
      service: this.service,
      version: this.version
    }

    if (context) {
      entry.context = context
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        ...(this.environment === 'development' && { stack: error.stack })
      }
    }

    return entry
  }

  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const output = this.environment === 'production' 
      ? JSON.stringify(entry)
      : this.formatForDevelopment(entry)

    switch (entry.level) {
      case 'debug':
      case 'info':
        console.log(output)
        break
      case 'warn':
        console.warn(output)
        break
      case 'error':
      case 'fatal':
        console.error(output)
        break
    }
  }

  private formatForDevelopment(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString()
    const level = entry.level.toUpperCase().padEnd(5)
    const context = entry.context ? ` [${JSON.stringify(entry.context)}]` : ''
    const error = entry.error ? `\n  Error: ${entry.error.message}` : ''
    const stack = entry.error?.stack && this.environment === 'development' ? `\n  Stack: ${entry.error.stack}` : ''
    
    return `${timestamp} [${level}] ${entry.message}${context}${error}${stack}`
  }

  debug(message: string, context?: LogContext): void {
    this.output(this.formatLog('debug', message, context))
  }

  info(message: string, context?: LogContext): void {
    this.output(this.formatLog('info', message, context))
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.output(this.formatLog('warn', message, context, error))
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.output(this.formatLog('error', message, context, error))
  }

  fatal(message: string, context?: LogContext, error?: Error): void {
    this.output(this.formatLog('fatal', message, context, error))
  }

  // Database operation logging
  database(operation: string, success: boolean, duration: number, context?: LogContext, error?: Error): void {
    const message = `Database ${operation} ${success ? 'succeeded' : 'failed'} in ${duration}ms`
    const logContext = {
      ...context,
      operation,
      duration,
      success
    }

    if (success) {
      this.debug(message, logContext)
    } else {
      this.error(message, logContext, error)
    }
  }

  // Authentication logging
  auth(event: string, success: boolean, context?: LogContext, error?: Error): void {
    const message = `Authentication ${event} ${success ? 'succeeded' : 'failed'}`
    const logContext = {
      ...context,
      event,
      success
    }

    if (success) {
      this.info(message, logContext)
    } else {
      this.warn(message, logContext, error)
    }
  }

  // API request logging
  request(method: string, url: string, statusCode: number, duration: number, context?: LogContext): void {
    const message = `${method} ${url} ${statusCode} ${duration}ms`
    const logContext = {
      ...context,
      method,
      url,
      statusCode,
      duration
    }

    if (statusCode >= 500) {
      this.error(message, logContext)
    } else if (statusCode >= 400) {
      this.warn(message, logContext)
    } else {
      this.info(message, logContext)
    }
  }

  // Payment operation logging
  payment(operation: string, success: boolean, amount?: number, context?: LogContext, error?: Error): void {
    const message = `Payment ${operation} ${success ? 'succeeded' : 'failed'}${amount ? ` for $${amount/100}` : ''}`
    const logContext = {
      ...context,
      operation,
      success,
      ...(amount && { amount })
    }

    if (success) {
      this.info(message, logContext)
    } else {
      this.error(message, logContext, error)
    }
  }
}

// Create and export singleton logger instance
export const logger = new Logger()

// Request ID generation utility
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

// Extract request context utility
export function extractRequestContext(request: Request, userId?: string): LogContext {
  const url = new URL(request.url)
  
  return {
    method: request.method,
    url: url.pathname + url.search,
    userAgent: request.headers.get('user-agent') || undefined,
    ip: request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        undefined,
    ...(userId && { userId })
  }
}

// Performance measurement utility
export class PerformanceTimer {
  private startTime: number
  private context: LogContext

  constructor(context: LogContext = {}) {
    this.startTime = Date.now()
    this.context = context
  }

  end(operation: string): number {
    const duration = Date.now() - this.startTime
    logger.debug(`Operation ${operation} completed in ${duration}ms`, {
      ...this.context,
      operation,
      duration
    })
    return duration
  }
}

// Error tracking utility
export function trackError(error: Error, context?: LogContext): void {
  logger.error('Unhandled error occurred', context, error)
  
  // In production, you might want to send to external error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error tracking service (Sentry, Bugsnag, etc.)
  }
}

// Security event logging
export function logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high', context?: LogContext): void {
  const message = `Security event: ${event}`
  const logContext = {
    ...context,
    securityEvent: event,
    severity
  }

  switch (severity) {
    case 'low':
      logger.info(message, logContext)
      break
    case 'medium':
      logger.warn(message, logContext)
      break
    case 'high':
      logger.error(message, logContext)
      break
  }
}