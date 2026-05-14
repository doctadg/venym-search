import { prisma } from '../prisma'

interface BlogPostData {
  id: string
  title: string
  content: string
  excerpt: string
  keywords: string[]
  category?: string
  published_at?: Date
  author?: {
    full_name?: string
  }
}

interface SeoOptimization {
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
}

export class SeoOptimizerService {
  private baseUrl: string

  constructor(baseUrl: string = 'https://VENYM_SEARCH.ai') {
    this.baseUrl = baseUrl
  }

  async optimizeBlogPost(blogPostId: string): Promise<SeoOptimization> {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
      include: {
        author: {
          select: {
            full_name: true
          }
        }
      }
    })

    if (!blogPost) {
      throw new Error('Blog post not found')
    }

    const optimization = await this.generateSeoOptimization({
      ...blogPost,
      excerpt: blogPost.excerpt ?? ''
    } as BlogPostData)
    
    // Save SEO data to database
    await this.saveSeoData(blogPostId, optimization)
    
    return optimization
  }

  private async generateSeoOptimization(blogPost: BlogPostData): Promise<SeoOptimization> {
    const focusKeyword = blogPost.keywords[0] || ''
    const keywordDensity = this.calculateKeywordDensity(blogPost.content, focusKeyword)
    const links = this.extractLinks(blogPost.content)
    
    const optimization: SeoOptimization = {
      canonical_url: `${this.baseUrl}/blog/${this.generateSlug(blogPost.title)}`,
      og_title: this.generateOgTitle(blogPost.title),
      og_description: this.generateOgDescription(blogPost.excerpt),
      og_image: this.generateOgImage(blogPost.title, blogPost.category),
      twitter_title: this.generateTwitterTitle(blogPost.title),
      twitter_description: this.generateTwitterDescription(blogPost.excerpt),
      twitter_image: this.generateOgImage(blogPost.title, blogPost.category),
      schema_markup: this.generateSchemaMarkup(blogPost),
      focus_keyword: focusKeyword,
      keyword_density: keywordDensity,
      internal_links: links.internal,
      external_links: links.external
    }

    return optimization
  }

  private generateOgTitle(title: string): string {
    // Optimize for Facebook (recommended: 40 characters)
    if (title.length <= 40) return title
    return title.substring(0, 37) + '...'
  }

  private generateOgDescription(excerpt: string): string {
    // Optimize for Facebook (recommended: 150-300 characters)
    let description = excerpt.replace(/['"]/g, '').trim()
    if (description.length > 300) {
      description = description.substring(0, 297) + '...'
    }
    return description
  }

  private generateTwitterTitle(title: string): string {
    // Twitter title (recommended: 70 characters)
    if (title.length <= 70) return title
    return title.substring(0, 67) + '...'
  }

  private generateTwitterDescription(excerpt: string): string {
    // Twitter description (recommended: 200 characters)
    let description = excerpt.replace(/['"]/g, '').trim()
    if (description.length > 200) {
      description = description.substring(0, 197) + '...'
    }
    return description
  }

  private generateOgImage(title: string, category?: string): string {
    // Generate dynamic OG image URL (you'd implement an image generation service)
    const encodedTitle = encodeURIComponent(title)
    const encodedCategory = category ? encodeURIComponent(category) : 'blog'
    return `${this.baseUrl}/api/og-image?title=${encodedTitle}&category=${encodedCategory}`
  }

  private generateSchemaMarkup(blogPost: BlogPostData): any {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogPost.title,
      "description": blogPost.excerpt,
      "image": this.generateOgImage(blogPost.title, blogPost.category),
      "author": {
        "@type": "Person",
        "name": blogPost.author?.full_name || "Venym Search Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Venym Search",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/venym.png`
        }
      },
      "url": `${this.baseUrl}/blog/${this.generateSlug(blogPost.title)}`,
      "datePublished": blogPost.published_at?.toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/blog/${this.generateSlug(blogPost.title)}`
      },
      "keywords": blogPost.keywords.join(', '),
      "articleSection": blogPost.category || "Technology",
      "wordCount": this.countWords(blogPost.content),
      "timeRequired": `PT${Math.ceil(this.countWords(blogPost.content) / 200)}M`
    }

    return schema
  }

  private calculateKeywordDensity(content: string, keyword: string): number {
    if (!keyword || !content) return 0
    
    const wordCount = this.countWords(content)
    const keywordOccurrences = (content.toLowerCase().match(
      new RegExp(keyword.toLowerCase(), 'g')
    ) || []).length
    
    return wordCount > 0 ? (keywordOccurrences / wordCount) * 100 : 0
  }

  private extractLinks(content: string): { internal: string[], external: string[] } {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const urlRegex = /https?:\/\/[^\s)]+/g
    
    const links = { internal: [] as string[], external: [] as string[] }
    
    // Extract markdown links
    let match
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2]
      if (url.startsWith(this.baseUrl) || url.startsWith('/')) {
        links.internal.push(url)
      } else {
        links.external.push(url)
      }
    }
    
    // Extract plain URLs
    while ((match = urlRegex.exec(content)) !== null) {
      const url = match[0]
      if (url.startsWith(this.baseUrl)) {
        if (!links.internal.includes(url)) {
          links.internal.push(url)
        }
      } else {
        if (!links.external.includes(url)) {
          links.external.push(url)
        }
      }
    }
    
    return links
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length
  }

  private async saveSeoData(blogPostId: string, optimization: SeoOptimization): Promise<void> {
    await prisma.seoData.upsert({
      where: { blog_post_id: blogPostId },
      update: {
        canonical_url: optimization.canonical_url,
        og_title: optimization.og_title,
        og_description: optimization.og_description,
        og_image: optimization.og_image,
        twitter_title: optimization.twitter_title,
        twitter_description: optimization.twitter_description,
        twitter_image: optimization.twitter_image,
        schema_markup: optimization.schema_markup,
        focus_keyword: optimization.focus_keyword,
        keyword_density: optimization.keyword_density,
        internal_links: optimization.internal_links,
        external_links: optimization.external_links,
        updated_at: new Date()
      },
      create: {
        blog_post_id: blogPostId,
        canonical_url: optimization.canonical_url,
        og_title: optimization.og_title,
        og_description: optimization.og_description,
        og_image: optimization.og_image,
        twitter_title: optimization.twitter_title,
        twitter_description: optimization.twitter_description,
        twitter_image: optimization.twitter_image,
        schema_markup: optimization.schema_markup,
        focus_keyword: optimization.focus_keyword,
        keyword_density: optimization.keyword_density,
        internal_links: optimization.internal_links || [],
        external_links: optimization.external_links || []
      }
    })
  }

  async generateSitemap(): Promise<string> {
    const publishedPosts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        title: true,
        updated_at: true,
        published_at: true
      },
      orderBy: { published_at: 'desc' }
    })

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${this.baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`

    publishedPosts.forEach(post => {
      const lastmod = post.updated_at?.toISOString() || post.published_at?.toISOString() || new Date().toISOString()
      sitemap += `
  <url>
    <loc>${this.baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })

    sitemap += '\n</urlset>'
    return sitemap
  }

  async generateRobotsTxt(): Promise<string> {
    return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

# Allow blog content
Allow: /blog/
Allow: /docs/`
  }
}