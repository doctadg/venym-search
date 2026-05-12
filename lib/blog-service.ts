/**
 * Blog Service Layer
 * 
 * Handles all blog-related database operations for the autonomous content system
 */

import { prisma } from './prisma'
import { logger } from './logger'
import type { 
  BlogPost, 
  TrendingTopic, 
  ContentGenerationJob, 
  BlogMetrics, 
  BlogCategory,
  SeoData,
  PostStatus,
  JobStatus 
} from '@prisma/client'

// Extended types for complex queries
export type BlogPostWithRelations = BlogPost & {
  seo_data: SeoData[]
  metrics: BlogMetrics | null
  author: { id: string; full_name: string | null; email: string } | null
}

export type TrendingTopicWithJobs = TrendingTopic & {
  content_jobs: ContentGenerationJob[]
}

/**
 * Blog Post Operations
 */
export async function createBlogPost(data: {
  title: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
  keywords: string[]
  category?: string
  tags: string[]
  featured_image?: string
  status?: PostStatus
  author_id?: string
  generated_by_ai?: boolean
  source_keywords: string[]
  target_keywords: string[]
}): Promise<BlogPost | null> {
  try {
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Calculate reading time (approximate)
    const wordCount = data.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

    const blogPost = await prisma.blogPost.create({
      data: {
        ...data,
        slug,
        word_count: wordCount,
        reading_time: readingTime,
        published_at: data.status === 'PUBLISHED' ? new Date() : null
      }
    })

    // Create initial metrics record
    await prisma.blogMetrics.create({
      data: {
        blog_post_id: blogPost.id
      }
    })

    return blogPost
  } catch (error) {
    logger.error('Error creating blog post', { title: data.title }, error as Error)
    return null
  }
}

export async function getBlogPosts(options: {
  limit?: number
  offset?: number
  status?: PostStatus
  category?: string
  search?: string
  orderBy?: 'created_at' | 'published_at' | 'views'
  orderDirection?: 'asc' | 'desc'
}): Promise<BlogPostWithRelations[]> {
  try {
    const where: any = {}
    
    if (options.status) {
      where.status = options.status
    }
    
    if (options.category) {
      where.category = options.category
    }
    
    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { excerpt: { contains: options.search, mode: 'insensitive' } },
        { keywords: { has: options.search } },
        { tags: { has: options.search } }
      ]
    }

    const orderBy: any = {}
    if (options.orderBy === 'views') {
      orderBy.metrics = { views: options.orderDirection || 'desc' }
    } else {
      orderBy[options.orderBy || 'created_at'] = options.orderDirection || 'desc'
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy,
      take: options.limit || 20,
      skip: options.offset || 0,
      include: {
        seo_data: true,
        metrics: true,
        author: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      }
    })

    return posts
  } catch (error) {
    logger.error('Error getting blog posts', { options }, error as Error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        seo_data: true,
        metrics: true,
        author: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      }
    })

    // Increment view count
    if (post) {
      await incrementBlogViews(post.id)
    }

    return post
  } catch (error) {
    logger.error('Error getting blog post by slug', { slug }, error as Error)
    return null
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    // Recalculate word count and reading time if content is updated
    const updateData: any = { ...data }
    
    if (data.content) {
      const wordCount = data.content.split(/\s+/).length
      updateData.word_count = wordCount
      updateData.reading_time = Math.ceil(wordCount / 200)
    }

    if (data.status === 'PUBLISHED' && !data.published_at) {
      updateData.published_at = new Date()
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    })

    return post
  } catch (error) {
    logger.error('Error updating blog post', { id, data }, error as Error)
    return null
  }
}

/**
 * Trending Topic Operations
 */
export async function createTrendingTopic(data: {
  keyword: string
  topic_category?: string
  trend_score?: number
  search_volume?: number
  source_urls: string[]
  sentiment?: string
  priority_level?: number
  metadata?: any
}): Promise<TrendingTopic | null> {
  try {
    const topic = await prisma.trendingTopic.create({
      data
    })
    return topic
  } catch (error) {
    logger.error('Error creating trending topic', { keyword: data.keyword }, error as Error)
    return null
  }
}

export async function getTrendingTopics(options: {
  limit?: number
  isActive?: boolean
  contentGenerated?: boolean
  minTrendScore?: number
  orderBy?: 'trend_score' | 'created_at' | 'last_analyzed'
}): Promise<TrendingTopicWithJobs[]> {
  try {
    const where: any = {}
    
    if (options.isActive !== undefined) {
      where.is_active = options.isActive
    }
    
    if (options.contentGenerated !== undefined) {
      where.content_generated = options.contentGenerated
    }
    
    if (options.minTrendScore) {
      where.trend_score = { gte: options.minTrendScore }
    }

    const topics = await prisma.trendingTopic.findMany({
      where,
      orderBy: { [options.orderBy || 'trend_score']: 'desc' },
      take: options.limit || 50,
      include: {
        content_jobs: {
          orderBy: { created_at: 'desc' },
          take: 5
        }
      }
    })

    return topics
  } catch (error) {
    logger.error('Error getting trending topics', { options }, error as Error)
    return []
  }
}

export async function updateTrendingTopic(id: string, data: any): Promise<TrendingTopic | null> {
  try {
    const topic = await prisma.trendingTopic.update({
      where: { id },
      data
    })
    return topic
  } catch (error) {
    logger.error('Error updating trending topic', { id, data }, error as Error)
    return null
  }
}

/**
 * Content Generation Job Operations
 */
export async function createContentJob(data: {
  trending_topic_id?: string
  job_type: string
  input_data?: any
}): Promise<ContentGenerationJob | null> {
  try {
    const job = await prisma.contentGenerationJob.create({
      data: {
        ...data,
        started_at: new Date()
      }
    })
    return job
  } catch (error) {
    logger.error('Error creating content job', { data }, error as Error)
    return null
  }
}

export async function updateContentJob(id: string, data: {
  status?: JobStatus
  completed_at?: Date
  error_message?: string
  output_data?: any
  credits_used?: number
  processing_time_ms?: number
}): Promise<ContentGenerationJob | null> {
  try {
    const job = await prisma.contentGenerationJob.update({
      where: { id },
      data
    })
    return job
  } catch (error) {
    logger.error('Error updating content job', { id, data }, error as Error)
    return null
  }
}

export async function getRunningJobs(): Promise<ContentGenerationJob[]> {
  try {
    const jobs = await prisma.contentGenerationJob.findMany({
      where: { status: 'RUNNING' },
      orderBy: { started_at: 'asc' }
    })
    return jobs
  } catch (error) {
    logger.error('Error getting running jobs', error as Error)
    return []
  }
}

/**
 * Blog Metrics Operations
 */
export async function incrementBlogViews(blogPostId: string): Promise<void> {
  try {
    await prisma.blogMetrics.update({
      where: { blog_post_id: blogPostId },
      data: {
        views: { increment: 1 },
        unique_views: { increment: 1 }, // Simplified for now
        last_updated: new Date()
      }
    })
  } catch (error) {
    logger.error('Error incrementing blog views', { blogPostId }, error as Error)
  }
}

export async function updateBlogMetrics(blogPostId: string, data: {
  social_shares?: number
  time_on_page?: number
  bounce_rate?: number
  organic_traffic?: number
  engagement_score?: number
}): Promise<BlogMetrics | null> {
  try {
    const metrics = await prisma.blogMetrics.update({
      where: { blog_post_id: blogPostId },
      data: {
        ...data,
        last_updated: new Date()
      }
    })
    return metrics
  } catch (error) {
    logger.error('Error updating blog metrics', { blogPostId, data }, error as Error)
    return null
  }
}

/**
 * SEO Operations
 */
export async function createSeoData(blogPostId: string, data: {
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  schema_markup?: any
  focus_keyword?: string
  keyword_density?: number
  internal_links?: string[]
  external_links?: string[]
}): Promise<SeoData | null> {
  try {
    const seoData = await prisma.seoData.create({
      data: {
        blog_post_id: blogPostId,
        ...data
      }
    })
    return seoData
  } catch (error) {
    logger.error('Error creating SEO data', { blogPostId, data }, error as Error)
    return null
  }
}

/**
 * Utility Functions
 */
export async function getPopularPosts(limit: number = 10): Promise<BlogPostWithRelations[]> {
  return getBlogPosts({
    limit,
    status: 'PUBLISHED',
    orderBy: 'views',
    orderDirection: 'desc'
  })
}

export async function getRecentPosts(limit: number = 10): Promise<BlogPostWithRelations[]> {
  return getBlogPosts({
    limit,
    status: 'PUBLISHED',
    orderBy: 'published_at',
    orderDirection: 'desc'
  })
}

export async function searchBlogPosts(query: string, limit: number = 20): Promise<BlogPostWithRelations[]> {
  return getBlogPosts({
    search: query,
    limit,
    status: 'PUBLISHED',
    orderBy: 'created_at',
    orderDirection: 'desc'
  })
}

export async function getBlogStats(): Promise<{
  totalPosts: number
  publishedPosts: number
  totalViews: number
  avgEngagement: number
  topCategories: { category: string; count: number }[]
}> {
  try {
    const totalPosts = await prisma.blogPost.count()
    const publishedPosts = await prisma.blogPost.count({ where: { status: 'PUBLISHED' } })
    
    const metricsAgg = await prisma.blogMetrics.aggregate({
      _sum: { views: true, social_shares: true },
      _avg: { engagement_score: true }
    })
    
    const categoryStats = await prisma.blogPost.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { status: 'PUBLISHED', category: { not: null } },
      orderBy: { _count: { category: 'desc' } },
      take: 5
    })

    return {
      totalPosts,
      publishedPosts,
      totalViews: metricsAgg._sum.views || 0,
      avgEngagement: metricsAgg._avg.engagement_score || 0,
      topCategories: categoryStats.map(stat => ({
        category: stat.category || 'Uncategorized',
        count: stat._count.category
      }))
    }
  } catch (error) {
    logger.error('Error getting blog stats', error as Error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      totalViews: 0,
      avgEngagement: 0,
      topCategories: []
    }
  }
}