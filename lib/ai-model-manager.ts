/**
 * AI Model Management and Rotation System
 * 
 * Intelligent model selection based on content format, cost, and performance
 */

import { logger } from './logger'

export interface AIModel {
  id: string
  name: string
  provider: 'openrouter' | 'openai' | 'anthropic'
  costPerToken: number
  maxTokens: number
  strengths: string[]
  bestFormats: ContentFormat[]
  averageQuality: number // 1-10 scale
  averageSpeed: number // seconds
  uptime: number // 0-1 scale
  lastUsed?: Date
  totalUsage: number
  successRate: number // 0-1 scale
}

export type ContentFormat = 
  | 'comprehensive-guide' 
  | 'faq-article' 
  | 'best-tools-list' 
  | 'comparison-article' 
  | 'tutorial-guide'
  | 'industry-news'
  | 'case-study'
  | 'resource-collection'

interface ModelUsageStats {
  modelId: string
  requestsToday: number
  costsToday: number
  successesToday: number
  failuresToday: number
  averageResponseTime: number
  lastUpdated: Date
}

export class AIModelManager {
  private models: Map<string, AIModel> = new Map()
  private usageStats: Map<string, ModelUsageStats> = new Map()
  private readonly maxDailyCost = 50 // $50 per day limit
  private readonly maxModelUsagePerDay = 20 // Max uses per model per day
  
  constructor() {
    this.initializeModels()
    this.loadUsageStats()
  }

  /**
   * Initialize available AI models with their characteristics
   */
  private initializeModels(): void {
    const models: AIModel[] = [
      {
        id: 'anthropic/claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'openrouter',
        costPerToken: 0.00003,
        maxTokens: 8192,
        strengths: ['analytical thinking', 'technical accuracy', 'detailed explanations'],
        bestFormats: ['comprehensive-guide', 'comparison-article', 'case-study'],
        averageQuality: 9.2,
        averageSpeed: 8.5,
        uptime: 0.99,
        totalUsage: 0,
        successRate: 0.95
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        provider: 'openrouter',
        costPerToken: 0.00005,
        maxTokens: 4096,
        strengths: ['creativity', 'engagement', 'conversational tone'],
        bestFormats: ['best-tools-list', 'tutorial-guide', 'industry-news'],
        averageQuality: 9.0,
        averageSpeed: 6.2,
        uptime: 0.98,
        totalUsage: 0,
        successRate: 0.92
      },
      {
        id: 'meta-llama/llama-3.1-70b-instruct',
        name: 'Llama 3.1 70B',
        provider: 'openrouter',
        costPerToken: 0.00001,
        maxTokens: 4096,
        strengths: ['cost-effective', 'balanced output', 'reliable'],
        bestFormats: ['industry-news', 'resource-collection', 'faq-article'],
        averageQuality: 8.0,
        averageSpeed: 5.8,
        uptime: 0.97,
        totalUsage: 0,
        successRate: 0.88
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        provider: 'openrouter',
        costPerToken: 0.000025,
        maxTokens: 8192,
        strengths: ['research synthesis', 'factual accuracy', 'structured content'],
        bestFormats: ['faq-article', 'resource-collection', 'comprehensive-guide'],
        averageQuality: 8.5,
        averageSpeed: 7.1,
        uptime: 0.96,
        totalUsage: 0,
        successRate: 0.90
      },
      {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'openrouter',
        costPerToken: 0.000005,
        maxTokens: 4096,
        strengths: ['fast responses', 'cost-effective', 'concise content'],
        bestFormats: ['industry-news', 'case-study'],
        averageQuality: 7.5,
        averageSpeed: 3.2,
        uptime: 0.99,
        totalUsage: 0,
        successRate: 0.93
      },
      // Fallback models
      {
        id: 'openai/gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openrouter',
        costPerToken: 0.000002,
        maxTokens: 4096,
        strengths: ['very cost-effective', 'fast', 'backup option'],
        bestFormats: ['industry-news', 'faq-article'],
        averageQuality: 7.0,
        averageSpeed: 2.5,
        uptime: 0.99,
        totalUsage: 0,
        successRate: 0.85
      }
    ]

    models.forEach(model => {
      this.models.set(model.id, model)
      this.initializeUsageStats(model.id)
    })

    logger.info(`Initialized ${models.length} AI models for rotation`)
  }

  /**
   * Select optimal model based on content format and current constraints
   */
  selectOptimalModel(
    contentFormat: ContentFormat,
    priority: 'quality' | 'speed' | 'cost' = 'quality',
    estimatedTokens: number = 3000
  ): string {
    logger.info(`Selecting model for ${contentFormat} format (priority: ${priority})`)

    // Get candidates based on format compatibility
    const formatCandidates = this.getFormatCandidates(contentFormat)
    
    // Filter by daily usage limits and costs
    const availableCandidates = formatCandidates.filter(modelId => 
      this.isModelAvailable(modelId, estimatedTokens)
    )

    if (availableCandidates.length === 0) {
      logger.warn('No available models, using fallback')
      return this.getFallbackModel()
    }

    // Score and rank candidates
    const scoredCandidates = availableCandidates.map(modelId => ({
      modelId,
      score: this.scoreModel(modelId, contentFormat, priority, estimatedTokens)
    }))

    // Sort by score (highest first)
    scoredCandidates.sort((a, b) => b.score - a.score)

    const selectedModelId = scoredCandidates[0].modelId
    const selectedModel = this.models.get(selectedModelId)!

    logger.info(`Selected ${selectedModel.name} (score: ${scoredCandidates[0].score.toFixed(2)})`)
    
    return selectedModelId
  }

  /**
   * Get models that are good for specific content format
   */
  private getFormatCandidates(contentFormat: ContentFormat): string[] {
    const candidates: Array<{ modelId: string; compatibility: number }> = []

    this.models.forEach((model, modelId) => {
      let compatibility = 0.5 // Base compatibility

      // Boost for best formats
      if (model.bestFormats.includes(contentFormat)) {
        compatibility += 0.4
      }

      // Boost for related strengths
      const formatStrengthMap: Record<ContentFormat, string[]> = {
        'comprehensive-guide': ['analytical thinking', 'detailed explanations', 'technical accuracy'],
        'faq-article': ['structured content', 'factual accuracy', 'research synthesis'],
        'best-tools-list': ['creativity', 'engagement', 'balanced output'],
        'comparison-article': ['analytical thinking', 'technical accuracy', 'detailed explanations'],
        'tutorial-guide': ['creativity', 'engagement', 'detailed explanations'],
        'industry-news': ['fast responses', 'concise content', 'balanced output'],
        'case-study': ['analytical thinking', 'detailed explanations', 'factual accuracy'],
        'resource-collection': ['research synthesis', 'structured content', 'factual accuracy']
      }

      const desiredStrengths = formatStrengthMap[contentFormat] || []
      const strengthMatches = model.strengths.filter(strength => 
        desiredStrengths.some(desired => strength.includes(desired))
      ).length

      compatibility += strengthMatches * 0.1

      if (compatibility > 0.6) {
        candidates.push({ modelId, compatibility })
      }
    })

    return candidates
      .sort((a, b) => b.compatibility - a.compatibility)
      .map(c => c.modelId)
  }

  /**
   * Check if model is available within limits
   */
  private isModelAvailable(modelId: string, estimatedTokens: number): boolean {
    const model = this.models.get(modelId)
    const stats = this.usageStats.get(modelId)
    
    if (!model || !stats) return false

    // Check daily usage limit
    if (stats.requestsToday >= this.maxModelUsagePerDay) {
      return false
    }

    // Check daily cost limit
    const estimatedCost = estimatedTokens * model.costPerToken
    if (stats.costsToday + estimatedCost > this.maxDailyCost * 0.8) { // 80% of daily limit
      return false
    }

    // Check success rate
    if (model.successRate < 0.7) {
      return false
    }

    return true
  }

  /**
   * Score model based on multiple factors
   */
  private scoreModel(
    modelId: string, 
    contentFormat: ContentFormat, 
    priority: 'quality' | 'speed' | 'cost',
    estimatedTokens: number
  ): number {
    const model = this.models.get(modelId)!
    const stats = this.usageStats.get(modelId)!
    
    let score = 0

    // Base quality score
    score += model.averageQuality * 10

    // Format compatibility boost
    if (model.bestFormats.includes(contentFormat)) {
      score += 20
    }

    // Priority-based scoring
    switch (priority) {
      case 'quality':
        score += model.averageQuality * 5
        score += model.successRate * 15
        break
      case 'speed':
        score += (10 - model.averageSpeed) * 3 // Lower time = higher score
        score += model.uptime * 10
        break
      case 'cost':
        const costScore = Math.max(0, 10 - (model.costPerToken * 100000))
        score += costScore * 5
        break
    }

    // Recent performance boost
    const recentSuccessRate = stats.requestsToday > 0 
      ? stats.successesToday / (stats.successesToday + stats.failuresToday)
      : model.successRate
    score += recentSuccessRate * 10

    // Diversity boost (prefer less used models)
    const usageRatio = stats.requestsToday / Math.max(this.maxModelUsagePerDay, 1)
    score += (1 - usageRatio) * 5

    // Uptime factor
    score *= model.uptime

    return score
  }

  /**
   * Get fallback model for emergencies
   */
  private getFallbackModel(): string {
    // Return cheapest, most reliable model
    const fallbackCandidates = Array.from(this.models.entries())
      .filter(([_, model]) => model.successRate > 0.8)
      .sort((a, b) => a[1].costPerToken - b[1].costPerToken)

    return fallbackCandidates[0]?.[0] || 'openai/gpt-3.5-turbo'
  }

  /**
   * Record model usage and update stats
   */
  async recordModelUsage(
    modelId: string, 
    tokensUsed: number, 
    responseTime: number, 
    success: boolean
  ): Promise<void> {
    const model = this.models.get(modelId)
    const stats = this.usageStats.get(modelId)
    
    if (!model || !stats) return

    // Update model stats
    model.totalUsage += 1
    model.lastUsed = new Date()

    // Update daily stats
    stats.requestsToday += 1
    stats.costsToday += tokensUsed * model.costPerToken

    if (success) {
      stats.successesToday += 1
      // Update average response time
      const totalRequests = stats.successesToday + stats.failuresToday
      stats.averageResponseTime = (stats.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests
    } else {
      stats.failuresToday += 1
    }

    // Update model success rate
    model.successRate = model.totalUsage > 0 
      ? (stats.successesToday + (model.successRate * (model.totalUsage - stats.requestsToday))) / model.totalUsage
      : model.successRate

    stats.lastUpdated = new Date()

    // Log usage for monitoring
    logger.info(`Model usage recorded: ${model.name} (${success ? 'success' : 'failure'}, ${tokensUsed} tokens, ${responseTime}s)`)

    // Save stats periodically
    if (stats.requestsToday % 5 === 0) {
      await this.saveUsageStats()
    }
  }

  /**
   * Get current model statistics for monitoring
   */
  getModelStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    
    this.models.forEach((model, modelId) => {
      const usage = this.usageStats.get(modelId)!
      stats[modelId] = {
        name: model.name,
        provider: model.provider,
        qualityScore: model.averageQuality,
        successRate: model.successRate,
        dailyUsage: usage.requestsToday,
        dailyCost: usage.costsToday,
        averageResponseTime: usage.averageResponseTime,
        totalUsage: model.totalUsage,
        lastUsed: model.lastUsed?.toISOString()
      }
    })

    return stats
  }

  /**
   * Get daily cost summary
   */
  getDailyCostSummary(): {
    totalCost: number
    maxCost: number
    utilizationRate: number
    modelBreakdown: Record<string, number>
  } {
    let totalCost = 0
    const modelBreakdown: Record<string, number> = {}

    this.usageStats.forEach((stats, modelId) => {
      totalCost += stats.costsToday
      modelBreakdown[this.models.get(modelId)?.name || modelId] = stats.costsToday
    })

    return {
      totalCost,
      maxCost: this.maxDailyCost,
      utilizationRate: totalCost / this.maxDailyCost,
      modelBreakdown
    }
  }

  /**
   * Reset daily statistics (call at midnight)
   */
  resetDailyStats(): void {
    this.usageStats.forEach(stats => {
      stats.requestsToday = 0
      stats.costsToday = 0
      stats.successesToday = 0
      stats.failuresToday = 0
      stats.lastUpdated = new Date()
    })

    logger.info('Daily model statistics reset')
  }

  /**
   * Recommend optimal models for upcoming content generation
   */
  getRecommendations(upcomingFormats: ContentFormat[]): Record<ContentFormat, string> {
    const recommendations: Partial<Record<ContentFormat, string>> = {}

    upcomingFormats.forEach(format => {
      recommendations[format] = this.selectOptimalModel(format, 'quality')
    })

    return recommendations as Record<ContentFormat, string>
  }

  /**
   * Health check for all models
   */
  async performHealthCheck(): Promise<Record<string, boolean>> {
    const healthStatus: Record<string, boolean> = {}

    for (const [modelId, model] of this.models.entries()) {
      // Simple health check based on recent performance
      const stats = this.usageStats.get(modelId)!
      const recentSuccessRate = stats.requestsToday > 0 
        ? stats.successesToday / (stats.successesToday + stats.failuresToday)
        : model.successRate

      healthStatus[modelId] = recentSuccessRate > 0.7 && model.uptime > 0.9
    }

    return healthStatus
  }

  // Private utility methods
  private initializeUsageStats(modelId: string): void {
    this.usageStats.set(modelId, {
      modelId,
      requestsToday: 0,
      costsToday: 0,
      successesToday: 0,
      failuresToday: 0,
      averageResponseTime: 0,
      lastUpdated: new Date()
    })
  }

  private loadUsageStats(): void {
    // In production, load from database or cache
    // For now, use in-memory initialization
    logger.info('Usage statistics initialized')
  }

  private async saveUsageStats(): Promise<void> {
    // In production, save to database or cache
    // For now, just log
    const summary = this.getDailyCostSummary()
    logger.info(`Model usage saved - Total cost: $${summary.totalCost.toFixed(4)}, Utilization: ${(summary.utilizationRate * 100).toFixed(1)}%`)
  }
}

// Export singleton instance
export const aiModelManager = new AIModelManager()