import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  ExternalLink,
  Zap,
  TrendingUp,
  Globe,
  Copy
} from 'lucide-react'
import { getBlogPostBySlug, getRecentPosts } from '@/lib/blog-service'
import BlogMarkdown from '@/components/blog-markdown'


interface BlogPostPageProps {

  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Article Not Found | Venym Search Blog',
      description: 'The requested article could not be found.'
    }
  }

  const seoData = post.seo_data[0]

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    keywords: post.keywords.join(', '),
    authors: post.author ? [{ name: post.author.full_name || 'Venym Search AI' }] : undefined,
    openGraph: {
      title: seoData?.og_title || post.title,
      description: seoData?.og_description || post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at ? post.published_at.toString() : undefined,
      authors: post.author ? [post.author.full_name || 'Venym Search AI'] : undefined,
      url: `/blog/${post.slug}`,
      images: post.featured_image ? [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitter_title || post.title,
      description: seoData?.twitter_description || post.excerpt || '',
      images: post.featured_image ? [post.featured_image] : []
    },
    alternates: {
      canonical: `/blog/${post.slug}`
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getRecentPosts(4)
  const filteredRelatedPosts = relatedPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // JSON-LD structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at?.toISOString(),
    dateModified: post.updated_at?.toISOString(),
    author: { "@type": "Organization", name: "Venym Search" },
    publisher: {
      "@type": "Organization",
      name: "Venym Search",
      url: "https://search.venym.io",
      logo: {
        "@type": "ImageObject",
        url: "https://search.venym.io/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://search.venym.io/blog/${post.slug}`
    },
    ...(post.word_count ? { wordCount: post.word_count } : {})
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://search.venym.io" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://search.venym.io/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://search.venym.io/blog/${post.slug}` }
    ]
  }

  const jsonLd = [articleJsonLd, breadcrumbJsonLd]

  // Extract FAQ items from content for FAQPage structured data
  const faqItems = post.content
    .split('\n')
    .reduce<Array<{ question: string; answer: string }>>((acc, line, idx, lines) => {


      // Match H3 questions: "### What is X?" or "### How does Y work?"
      const h3Match = line.match(/^###\s+(.+\?)$/i)
      if (h3Match) {
        // Collect answer paragraphs until next H2/H3
        let answer = ''
        for (let j = idx + 1; j < lines.length; j++) {
          if (lines[j].match(/^#{2,3}\s/) || lines[j].match(/^---$/)) break
          if (lines[j].trim()) answer += lines[j].replace(/^>?\s*/, '').trim() + ' '
        }
        if (answer) {
          acc.push({ question: h3Match[1].replace(/\*\*/g, '').trim(), answer: answer.trim() })
        }
      }
      return acc
    }, [])

  if (faqItems.length >= 2) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    })
  }

  return (
    <div className="min-h-screen bg-[#17457c] text-[#edf3f1]">
      {/* Navigation Bar */}
      <div className="border-b border-[#efa72d]/30 bg-[#17457c]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-[#efa72d] hover:text-[#edf3f1] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-bold">Back to Blog</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-[#edf3f1]/70 hover:text-[#efa72d] transition-colors">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline font-bold">Share</span>
              </button>
              <button className="flex items-center gap-2 text-[#edf3f1]/70 hover:text-[#efa72d] transition-colors">
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline font-bold">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-[#efa72d] text-[#17457c] font-black">
                {post.category}
              </Badge>
              {post.generated_by_ai && (
                <Badge variant="secondary" className="bg-black/30 text-[#edf3f1] border border-[#efa72d]/30">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Generated
                </Badge>
              )}
              <Badge variant="secondary" className="bg-[#6b839a] text-[#edf3f1]">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#edf3f1] mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-[#edf3f1]/80 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-[#edf3f1]/60 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-bold">
                  {post.author?.full_name || 'Venym Search AI'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-bold">
                  {post.published_at ? formatDate(post.published_at.toString()) : 'Just now'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-bold">{post.reading_time} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-bold">{post.metrics?.views || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-black/20 text-[#edf3f1]/80 hover:bg-[#efa72d]/20 hover:text-[#efa72d] transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* AI Generation Notice */}
            {post.generated_by_ai && (
              <Card className="bg-blue-900/20 border border-blue-400/30 mb-8">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-300 mb-1">AI-Powered Research</h4>
                      <p className="text-sm text-blue-200/80">
                        This article was generated using Venym Search's own APIs to discover trends and gather real-time web data. 
                        All content is based on current information from authoritative sources.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="article-content">
              <BlogMarkdown content={post.content} />
            </div>
          </div>

          {/* Sources */}
          {post.seo_data[0]?.external_links && post.seo_data[0].external_links.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#efa72d]/30">
              <h3 className="text-2xl font-black text-[#efa72d] mb-6 flex items-center gap-3">
                <ExternalLink className="h-6 w-6" />
                Sources & References
              </h3>
              <div className="grid gap-4">
                {post.seo_data[0].external_links.map((link, index) => (
                  <Card key={index} className="bg-[#6b839a]/30 border border-[#efa72d]/30 hover:border-[#efa72d] transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#edf3f1] mb-1">
                            {new URL(link).hostname}
                          </div>
                          <div className="text-sm text-[#edf3f1]/60 font-mono">
                            {link}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c]"
                          onClick={() => window.open(link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {post.keywords.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#efa72d]/30">
              <h4 className="text-lg font-black text-[#efa72d] mb-4">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword, index) => (
                  <Badge 
                    key={index}
                    className="bg-[#efa72d]/10 text-[#efa72d] border border-[#efa72d]/30"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Articles */}
      {filteredRelatedPosts.length > 0 && (
        <div className="bg-[#6b839a] py-16 mt-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-black text-[#edf3f1] mb-12 text-center">
              RELATED ARTICLES
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredRelatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost.id}
                  className="bg-[#17457c] border-2 border-[#efa72d]/30 hover:border-[#efa72d] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#efa72d] transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="bg-[#efa72d]/20 text-[#efa72d] font-bold text-xs">
                        {relatedPost.category}
                      </Badge>
                      {relatedPost.generated_by_ai && (
                        <Badge variant="secondary" className="bg-black/30 text-[#edf3f1]/80 text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-black text-[#edf3f1] mb-3 leading-tight line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    
                    <p className="text-[#edf3f1]/70 mb-4 text-sm line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-[#edf3f1]/60 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {relatedPost.reading_time}m
                      </div>
                      <div>
                        {relatedPost.published_at ? formatDate(relatedPost.published_at.toString()) : 'Just now'}
                      </div>
                    </div>
                    
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] font-bold"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-[#efa72d] py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-black text-[#17457c] mb-6">
            BUILD WITH VENYM_SEARCH
          </h3>
          <p className="text-lg font-bold text-[#17457c]/80 mb-8 max-w-2xl mx-auto">
            This article was created using our web scraping and search APIs. 
            Start building your own AI-powered applications with real-time web data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-[#17457c] hover:bg-[#123456] text-[#edf3f1] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-8 py-3">
                Get API Access
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" className="border-2 border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-[#edf3f1] font-black px-8 py-3">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}