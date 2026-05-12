'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Clock,
  Eye,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  User,
  ArrowRight,
  Zap,
  BookOpen,
  Globe,
  Target
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  published_at: string
  reading_time: number
  word_count: number
  generated_by_ai: boolean
  author: {
    full_name: string | null
    email: string
  } | null
  metrics: {
    views: number
    engagement_score: number | null
  } | null
}

interface TrendingTopic {
  id: string
  keyword: string
  trend_score: number
  topic_category: string
  last_analyzed: string
}

interface BlogStats {
  totalPosts: number
  totalViews: number
  avgEngagement: number
  topCategories: { category: string; count: number }[]
}

export default function BlogHomepage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadBlogData()
  }, [page, selectedCategory, searchQuery])

  const loadBlogData = async () => {
    try {
      setIsLoading(true)
      
      // Load posts
      const categoryParam = selectedCategory === 'all' ? '' : selectedCategory
      const postsResponse = await fetch(`/api/blog/posts?page=${page}&category=${categoryParam}&search=${searchQuery}`)
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.posts || [])
        if (page === 1 && postsData.posts?.length > 0) {
          setFeaturedPost(postsData.posts[0])
        }
      }

      // Load trending topics
      if (page === 1) {
        const trendsResponse = await fetch('/api/blog/trending')
        if (trendsResponse.ok) {
          const trendsData = await trendsResponse.json()
          setTrendingTopics(trendsData.topics || [])
        }

        // Load stats
        const statsResponse = await fetch('/api/blog/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      }
    } catch (error) {
      console.error('Failed to load blog data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadBlogData()
  }

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-[#17457c] text-[#edf3f1]">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#efa72d] mx-auto"></div>
            <p className="mt-4 text-[#edf3f1]/70">Loading the latest insights...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#17457c] text-[#edf3f1]">
      {/* Header */}
      <div className="border-b-4 border-[#efa72d] bg-[#17457c]">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-[#efa72d] rounded-lg">
                <BookOpen className="h-8 w-8 text-[#17457c]" />
              </div>
              <Badge className="bg-[#efa72d] text-[#17457c] font-black text-sm px-3 py-2">
                <Zap className="h-4 w-4 mr-1" />
                AI-POWERED
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
              <span className="block transform -skew-x-2">VENYM_SEARCH</span>
              <span className="block text-[#efa72d] transform skew-x-2">INSIGHTS</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-bold text-[#edf3f1]/90 max-w-4xl mx-auto mb-8">
              Real-time insights powered by our own APIs. Fresh content every hour, 
              generated autonomously from the latest web trends.
            </p>

            {/* Stats Bar */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#efa72d] mb-1">
                    {stats.totalPosts}
                  </div>
                  <div className="text-sm font-bold text-[#edf3f1]/70">ARTICLES PUBLISHED</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#efa72d] mb-1">
                    {stats.totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-[#edf3f1]/70">TOTAL VIEWS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#efa72d] mb-1">
                    {Math.round(stats.avgEngagement * 10) / 10}
                  </div>
                  <div className="text-sm font-bold text-[#edf3f1]/70">ENGAGEMENT SCORE</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <Card className="bg-[#6b839a] border-2 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d]">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#edf3f1]/60 h-5 w-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, trends, topics..."
                    className="pl-10 bg-black/20 border-2 border-[#edf3f1]/20 focus:border-[#efa72d] text-[#edf3f1]"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="md:w-48 bg-black/20 border-2 border-[#edf3f1]/20 focus:border-[#efa72d] text-[#edf3f1]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#6b839a] border-2 border-[#efa72d]">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Web Scraping">Web Scraping</SelectItem>
                    <SelectItem value="API Development">API Development</SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Tech Trends">Tech Trends</SelectItem>
                    <SelectItem value="Tutorials">Tutorials</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  type="submit"
                  className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                >
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-[#efa72d]" />
              <h2 className="text-2xl md:text-3xl font-black">FEATURED ARTICLE</h2>
            </div>
            
            <Card className="bg-[#6b839a] border-2 md:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] md:shadow-[8px_8px_0px_0px_#efa72d] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#efa72d] transition-all">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className="bg-[#efa72d] text-[#17457c] font-black">
                        {featuredPost.category}
                      </Badge>
                      {featuredPost.generated_by_ai && (
                        <Badge variant="secondary" className="bg-black/30 text-[#edf3f1] border border-[#efa72d]/30">
                          <Zap className="h-3 w-3 mr-1" />
                          AI-Generated
                        </Badge>
                      )}
                      <div className="flex items-center gap-2 text-sm text-[#edf3f1]/70">
                        <Clock className="h-4 w-4" />
                        {featuredPost.reading_time} min read
                      </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-[#edf3f1] mb-4 leading-tight">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-[#edf3f1]/80 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-[#edf3f1]/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredPost.published_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {featuredPost.metrics?.views || 0} views
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 flex items-center justify-center p-8 md:p-12">
                    <div className="text-center">
                      <div className="mb-4">
                        <Globe className="h-16 w-16 text-[#efa72d] mx-auto" />
                      </div>
                      <div className="text-sm font-bold text-[#edf3f1]/70 mb-4">
                        Powered by Venym Search APIs
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                          Read Article
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trending Topics */}
        {trendingTopics.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-[#efa72d]" />
              <h2 className="text-2xl md:text-3xl font-black">TRENDING NOW</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingTopics.slice(0, 3).map((topic) => (
                <Card 
                  key={topic.id}
                  className="bg-black/30 border-2 border-[#efa72d]/30 hover:border-[#efa72d] hover:bg-black/40 transition-all cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-[#efa72d]/20 text-[#efa72d] font-bold text-xs">
                        {topic.topic_category}
                      </Badge>
                      <div className="text-sm font-bold text-[#efa72d]">
                        {Math.round(topic.trend_score * 100)}% hot
                      </div>
                    </div>
                    
                    <h4 className="font-black text-[#edf3f1] mb-2 capitalize">
                      {topic.keyword}
                    </h4>
                    
                    <div className="text-xs text-[#edf3f1]/60">
                      Updated {new Date(topic.last_analyzed).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Articles Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black">LATEST INSIGHTS</h2>
            <div className="text-sm text-[#edf3f1]/60">
              Updated hourly with fresh content
            </div>
          </div>
          
          {posts.length === 0 ? (
            <Card className="bg-[#6b839a]/50 border-2 border-[#efa72d]/30">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-[#efa72d]/50 mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#edf3f1] mb-2">No Articles Found</h3>
                <p className="text-[#edf3f1]/60">
                  {searchQuery || (selectedCategory && selectedCategory !== 'all')
                    ? "Try adjusting your search or filters"
                    : "Our AI is working on the first batch of articles"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post) => (
                <Card 
                  key={post.id}
                  className="bg-[#6b839a] border-2 border-[#efa72d]/30 hover:border-[#efa72d] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#efa72d] transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="secondary" className="bg-[#efa72d]/20 text-[#efa72d] font-bold text-xs">
                        {post.category}
                      </Badge>
                      {post.generated_by_ai && (
                        <Badge variant="secondary" className="bg-black/30 text-[#edf3f1]/80 text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-black text-[#edf3f1] mb-3 leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-[#edf3f1]/70 mb-4 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-[#edf3f1]/60 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_time}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.metrics?.views || 0}
                        </div>
                      </div>
                      <div>
                        {formatDate(post.published_at)}
                      </div>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
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
          )}
        </div>

        {/* Load More */}
        {posts.length >= 10 && (
          <div className="text-center">
            <Button
              onClick={() => setPage(page + 1)}
              disabled={isLoading}
              className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-8 py-3"
            >
              {isLoading ? 'Loading...' : 'Load More Articles'}
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-[#efa72d] py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-black text-[#17457c] mb-6">
            POWERED BY VENYM_SEARCH APIs
          </h3>
          <p className="text-lg font-bold text-[#17457c]/80 mb-8 max-w-2xl mx-auto">
            Every article on this blog is generated using our own web scraping and search APIs. 
            See what you can build with real-time web data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-[#17457c] hover:bg-[#123456] text-[#edf3f1] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-8 py-3">
                Try Our APIs
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
    </div>
  )
}