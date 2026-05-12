import { prisma } from '../prisma'
import { ContentGeneratorService } from './content-generator'
import { KeywordResearchService } from './keyword-research'
import { SeoOptimizerService } from './seo-optimizer'

interface AutomationJob {
  id: string
  name: string
  schedule_pattern: string
  content_type: string
  target_keywords: string[]
  template_id?: string
  publication_settings?: any
  is_active: boolean
}

export class AutomationSchedulerService {
  private openaiApiKey: string
  private searchApiKey: string
  private contentGenerator: ContentGeneratorService
  private keywordService: KeywordResearchService
  private seoOptimizer: SeoOptimizerService

  constructor(openaiApiKey: string, searchApiKey: string) {
    this.openaiApiKey = openaiApiKey
    this.searchApiKey = searchApiKey
    this.contentGenerator = new ContentGeneratorService(openaiApiKey, searchApiKey)
    this.keywordService = new KeywordResearchService(searchApiKey)
    this.seoOptimizer = new SeoOptimizerService()
  }

  async createAutomationSchedule(schedule: {
    name: string
    description?: string
    schedule_pattern: string
    content_type: string
    target_keywords: string[]
    template_id?: string
    publication_settings?: any
  }): Promise<string> {
    const nextRunAt = this.calculateNextRun(schedule.schedule_pattern)
    
    const automationSchedule = await prisma.automationSchedule.create({
      data: {
        name: schedule.name,
        description: schedule.description,
        schedule_pattern: schedule.schedule_pattern,
        content_type: schedule.content_type,
        target_keywords: schedule.target_keywords,
        template_id: schedule.template_id,
        publication_settings: schedule.publication_settings,
        next_run_at: nextRunAt,
        is_active: true
      }
    })

    return automationSchedule.id
  }

  async processScheduledJobs(): Promise<void> {
    const now = new Date()
    
    const dueJobs = await prisma.automationSchedule.findMany({
      where: {
        is_active: true,
        next_run_at: {
          lte: now
        }
      },
      include: {
        template: true
      }
    })

    console.log(`Found ${dueJobs.length} scheduled jobs to process`)

    for (const job of dueJobs) {
      try {
        await this.executeJob({
          ...job,
          template_id: job.template_id ?? undefined
        } as AutomationJob & { template?: any })
        
        // Update last run and calculate next run
        const nextRunAt = this.calculateNextRun(job.schedule_pattern)
        await prisma.automationSchedule.update({
          where: { id: job.id },
          data: {
            last_run_at: now,
            next_run_at: nextRunAt
          }
        })
        
        console.log(`Successfully executed job: ${job.name}`)
      } catch (error) {
        console.error(`Failed to execute job ${job.name}:`, error)
        
        // Update last run anyway to prevent infinite retries
        const nextRunAt = this.calculateNextRun(job.schedule_pattern)
        await prisma.automationSchedule.update({
          where: { id: job.id },
          data: {
            last_run_at: now,
            next_run_at: nextRunAt
          }
        })
      }
    }
  }

  private async executeJob(job: AutomationJob & { template?: any }): Promise<void> {
    switch (job.content_type) {
      case 'blog_post':
        await this.generateBlogPost(job)
        break
      case 'keyword_research':
        await this.performKeywordResearch(job)
        break
      default:
        throw new Error(`Unknown content type: ${job.content_type}`)
    }
  }

  private async generateBlogPost(job: AutomationJob & { template?: any }): Promise<void> {
    // Select a target keyword from the list
    const keyword = this.selectKeywordForGeneration(job.target_keywords)
    
    if (!keyword) {
      console.log(`No suitable keyword found for job: ${job.name}`)
      return
    }

    // Check if we already have a recent post for this keyword
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        target_keywords: {
          has: keyword
        },
        created_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })

    if (existingPost) {
      console.log(`Recent post already exists for keyword: ${keyword}`)
      return
    }

    // Generate content
    const generatedContent = await this.contentGenerator.generateBlogPost({
      keyword,
      targetLength: job.publication_settings?.word_count || 2000,
      tone: job.publication_settings?.tone || 'professional',
      includeImages: job.publication_settings?.include_images || true,
      includeCodeExamples: job.publication_settings?.include_code || false,
      targetAudience: job.publication_settings?.target_audience || 'professionals'
    })

    // Save the blog post
    const blogPostId = await this.contentGenerator.saveBlogPost(generatedContent)

    // Optimize for SEO
    await this.seoOptimizer.optimizeBlogPost(blogPostId)

    // Auto-publish if configured
    if (job.publication_settings?.auto_publish) {
      await prisma.blogPost.update({
        where: { id: blogPostId },
        data: {
          status: 'PUBLISHED',
          published_at: new Date()
        }
      })
    }

    console.log(`Generated blog post for keyword: ${keyword}`)
  }

  private async performKeywordResearch(job: AutomationJob): Promise<void> {
    const industry = job.publication_settings?.industry || 'technology'
    const limit = job.publication_settings?.keyword_limit || 20

    const trendingKeywords = await this.keywordService.discoverTrendingKeywords(industry, limit)
    
    // Research top keywords
    for (const keyword of trendingKeywords.slice(0, 5)) {
      try {
        const keywordData = await this.keywordService.researchKeyword(keyword)
        await this.keywordService.saveKeywordResearch(keywordData)
      } catch (error) {
        console.error(`Error researching keyword "${keyword}":`, error)
      }
    }

    console.log(`Completed keyword research for ${industry}`)
  }

  private selectKeywordForGeneration(targetKeywords: string[]): string | null {
    if (targetKeywords.length === 0) return null
    
    // Simple round-robin selection (you could implement more sophisticated logic)
    const randomIndex = Math.floor(Math.random() * targetKeywords.length)
    return targetKeywords[randomIndex]
  }

  private calculateNextRun(cronPattern: string): Date {
    // Simple cron parser for common patterns
    // In production, use a library like node-cron or cron-parser
    
    const now = new Date()
    
    switch (cronPattern) {
      case '0 * * * *': // Every hour
        return new Date(now.getTime() + 60 * 60 * 1000)
      
      case '0 */2 * * *': // Every 2 hours
        return new Date(now.getTime() + 2 * 60 * 60 * 1000)
      
      case '0 */6 * * *': // Every 6 hours
        return new Date(now.getTime() + 6 * 60 * 60 * 1000)
      
      case '0 0 * * *': // Daily at midnight
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        return tomorrow
      
      case '0 8 * * *': // Daily at 8 AM
        const next8AM = new Date(now)
        next8AM.setHours(8, 0, 0, 0)
        if (next8AM <= now) {
          next8AM.setDate(next8AM.getDate() + 1)
        }
        return next8AM
      
      case '0 0 * * 1': // Weekly on Monday
        const nextMonday = new Date(now)
        const daysUntilMonday = (8 - now.getDay()) % 7 || 7
        nextMonday.setDate(now.getDate() + daysUntilMonday)
        nextMonday.setHours(0, 0, 0, 0)
        return nextMonday
      
      default:
        // Default to 1 hour if pattern not recognized
        return new Date(now.getTime() + 60 * 60 * 1000)
    }
  }

  async getActiveSchedules(): Promise<any[]> {
    return await prisma.automationSchedule.findMany({
      where: { is_active: true },
      include: {
        template: true
      }
    })
  }

  async pauseSchedule(scheduleId: string): Promise<void> {
    await prisma.automationSchedule.update({
      where: { id: scheduleId },
      data: { is_active: false }
    })
  }

  async resumeSchedule(scheduleId: string): Promise<void> {
    const nextRunAt = this.calculateNextRun('0 * * * *') // Default to hourly
    
    await prisma.automationSchedule.update({
      where: { id: scheduleId },
      data: { 
        is_active: true,
        next_run_at: nextRunAt
      }
    })
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await prisma.automationSchedule.delete({
      where: { id: scheduleId }
    })
  }

  async getJobStats(): Promise<any> {
    const [totalJobs, activeJobs, blogPosts, keywords] = await Promise.all([
      prisma.automationSchedule.count(),
      prisma.automationSchedule.count({ where: { is_active: true } }),
      prisma.blogPost.count({ where: { generated_by_ai: true } }),
      prisma.keywordResearch.count()
    ])

    const recentBlogPosts = await prisma.blogPost.count({
      where: {
        generated_by_ai: true,
        created_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    return {
      totalJobs,
      activeJobs,
      totalBlogPosts: blogPosts,
      totalKeywords: keywords,
      recentBlogPosts
    }
  }
}