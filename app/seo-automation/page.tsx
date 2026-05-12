'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AutomationSchedule {
  id: string
  name: string
  description?: string
  schedule_pattern: string
  content_type: string
  target_keywords: string[]
  is_active: boolean
  last_run_at?: string
  next_run_at?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  seo_score?: number
  word_count?: number
  created_at: string
  published_at?: string
}

interface Stats {
  totalJobs: number
  activeJobs: number
  totalBlogPosts: number
  totalKeywords: number
  recentBlogPosts: number
}

export default function SeoAutomationPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [schedules, setSchedules] = useState<AutomationSchedule[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    schedule_pattern: '0 8 * * *',
    content_type: 'blog_post',
    target_keywords: '',
    publication_settings: {
      word_count: 2000,
      tone: 'professional',
      auto_publish: false,
      include_images: true
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, schedulesRes, postsRes] = await Promise.all([
        fetch('/api/seo/automation?action=stats'),
        fetch('/api/seo/automation?action=schedules'),
        fetch('/api/seo/blog-posts?limit=10')
      ])

      const statsData = await statsRes.json()
      const schedulesData = await schedulesRes.json()
      const postsData = await postsRes.json()

      setStats(statsData.stats)
      setSchedules(schedulesData.schedules)
      setBlogPosts(postsData.posts)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSchedule = async () => {
    try {
      const response = await fetch('/api/seo/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_schedule',
          ...newSchedule,
          target_keywords: newSchedule.target_keywords.split(',').map(k => k.trim()).filter(k => k)
        })
      })

      if (response.ok) {
        setNewSchedule({
          name: '',
          description: '',
          schedule_pattern: '0 8 * * *',
          content_type: 'blog_post',
          target_keywords: '',
          publication_settings: {
            word_count: 2000,
            tone: 'professional',
            auto_publish: false,
            include_images: true
          }
        })
        fetchData()
      }
    } catch (error) {
      console.error('Error creating schedule:', error)
    }
  }

  const pauseSchedule = async (scheduleId: string) => {
    try {
      await fetch('/api/seo/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'pause_schedule',
          schedule_id: scheduleId
        })
      })
      fetchData()
    } catch (error) {
      console.error('Error pausing schedule:', error)
    }
  }

  const resumeSchedule = async (scheduleId: string) => {
    try {
      await fetch('/api/seo/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'resume_schedule',
          schedule_id: scheduleId
        })
      })
      fetchData()
    } catch (error) {
      console.error('Error resuming schedule:', error)
    }
  }

  const runJobsManually = async () => {
    try {
      await fetch('/api/seo/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'run_jobs'
        })
      })
      fetchData()
    } catch (error) {
      console.error('Error running jobs:', error)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">SEO Automation Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBlogPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalKeywords || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentBlogPosts || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules">Automation Schedules</TabsTrigger>
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="create">Create Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Automation Schedules</h2>
            <Button onClick={runJobsManually}>Run Jobs Manually</Button>
          </div>
          
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{schedule.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{schedule.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                        {schedule.is_active ? 'Active' : 'Paused'}
                      </Badge>
                      <Badge variant="outline">{schedule.content_type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Schedule:</strong> {schedule.schedule_pattern}
                    </div>
                    <div>
                      <strong>Keywords:</strong> {schedule.target_keywords.length}
                    </div>
                    <div>
                      <strong>Last Run:</strong> {schedule.last_run_at ? new Date(schedule.last_run_at).toLocaleDateString() : 'Never'}
                    </div>
                    <div>
                      <strong>Next Run:</strong> {schedule.next_run_at ? new Date(schedule.next_run_at).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {schedule.is_active ? (
                      <Button variant="outline" size="sm" onClick={() => pauseSchedule(schedule.id)}>
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => resumeSchedule(schedule.id)}>
                        Resume
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Blog Posts</h2>
          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">/{post.slug}</p>
                      <div className="flex gap-4 text-sm mt-2">
                        <span>Words: {post.word_count}</span>
                        <span>SEO Score: {post.seo_score}/100</span>
                        <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Automation Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Schedule Name</Label>
                  <Input
                    id="name"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                    placeholder="Daily Tech Blog Posts"
                  />
                </div>
                <div>
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select value={newSchedule.content_type} onValueChange={(value) => setNewSchedule({...newSchedule, content_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog_post">Blog Post</SelectItem>
                      <SelectItem value="keyword_research">Keyword Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                  placeholder="Automated blog post generation for tech topics"
                />
              </div>

              <div>
                <Label htmlFor="schedule">Schedule Pattern</Label>
                <Select value={newSchedule.schedule_pattern} onValueChange={(value) => setNewSchedule({...newSchedule, schedule_pattern: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0 8 * * *">Daily at 8 AM</SelectItem>
                    <SelectItem value="0 */6 * * *">Every 6 hours</SelectItem>
                    <SelectItem value="0 0 * * 1">Weekly on Monday</SelectItem>
                    <SelectItem value="0 * * * *">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  value={newSchedule.target_keywords}
                  onChange={(e) => setNewSchedule({...newSchedule, target_keywords: e.target.value})}
                  placeholder="AI automation, search API, web scraping, data extraction"
                />
              </div>

              <Button onClick={createSchedule} className="w-full">
                Create Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}