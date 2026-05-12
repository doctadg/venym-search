'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { FileText, Plus, Trash2, ChevronDown, Copy, Check, CheckCircle, XCircle, Zap, Link2 } from 'lucide-react'

interface Rule {
  id: string
  user_agent: string
  allow: string[]
  disallow: string[]
  crawl_delay: string
}

const PRESETS: Record<string, {
  rules: Array<{ user_agent: string; allow: string[]; disallow: string[]; crawl_delay?: number }>
  sitemaps: string[]
  host?: string
}> = {
  'WordPress': {
    rules: [
      {
        user_agent: '*',
        allow: ['/wp-admin/admin-ajax.php'],
        disallow: ['/wp-admin/', '/wp-includes/', '/wp-content/plugins/', '/wp-content/cache/', '/trackback/', '/?s=', '/search/', '/?p=', '/?feed=', '/comments/'],
      },
    ],
    sitemaps: ['https://example.com/sitemap.xml', 'https://example.com/sitemap_index.xml'],
  },
  'Next.js': {
    rules: [
      {
        user_agent: '*',
        allow: ['/', '/api/'],
        disallow: ['/api/internal/', '/_next/static/', '/_next/image/'],
      },
    ],
    sitemaps: ['https://example.com/sitemap.xml'],
  },
  'Restrictive': {
    rules: [
      {
        user_agent: '*',
        allow: ['/'],
        disallow: ['/*?*', '/*$', '/wp-*', '/admin/', '/login/', '/private/'],
      },
    ],
    sitemaps: ['https://example.com/sitemap.xml'],
    host: 'https://example.com',
  },
  'Open': {
    rules: [
      {
        user_agent: '*',
        allow: ['/'],
        disallow: [],
      },
    ],
    sitemaps: [],
  },
}

function makeId() { return Math.random().toString(36).slice(2, 9) }

export default function RobotsTxtGeneratorPage() {
  const [tab, setTab] = useState('generate')
  const [rules, setRules] = useState<Rule[]>([
    { id: makeId(), user_agent: '*', allow: ['/'], disallow: ['/admin/'], crawl_delay: '' }
  ])
  const [sitemaps, setSitemaps] = useState<string[]>(['https://example.com/sitemap.xml'])
  const [host, setHost] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  // Test state
  const [robotsTxt, setRobotsTxt] = useState('')
  const [testUrl, setTestUrl] = useState('')
  const [testUa, setTestUa] = useState('*')
  const [testResult, setTestResult] = useState<{ url: string; allowed: boolean; matching_rule: string; user_agent: string } | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testError, setTestError] = useState('')
  const [copied, setCopied] = useState('')

  const updateRule = (id: string, field: keyof Rule, value: unknown) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const addRule = () => {
    setRules(prev => [...prev, { id: makeId(), user_agent: '*', allow: ['/'], disallow: [], crawl_delay: '' }])
  }

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  const addPath = (id: string, type: 'allow' | 'disallow') => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [type]: [...r[type], ''] } : r))
  }

  const updatePath = (id: string, type: 'allow' | 'disallow', idx: number, value: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== id) return r
      const arr = [...r[type]]
      arr[idx] = value
      return { ...r, [type]: arr }
    }))
  }

  const removePath = (id: string, type: 'allow' | 'disallow', idx: number) => {
    setRules(prev => prev.map(r => {
      if (r.id !== id) return r
      const arr = r[type].filter((_, i) => i !== idx)
      return { ...r, [type]: arr }
    }))
  }

  const addSitemap = () => setSitemaps(prev => [...prev, ''])
  const removeSitemap = (idx: number) => setSitemaps(prev => prev.filter((_, i) => i !== idx))
  const updateSitemap = (idx: number, value: string) => {
    setSitemaps(prev => { const arr = [...prev]; arr[idx] = value; return arr })
  }

  const generate = async () => {
    setLoading(true)
    try {
      const payload = {
        mode: 'generate',
        rules: rules.map(r => ({
          user_agent: r.user_agent,
          allow: r.allow.filter(Boolean),
          disallow: r.disallow.filter(Boolean),
          crawl_delay: r.crawl_delay ? parseInt(r.crawl_delay) : undefined,
        })),
        sitemaps: sitemaps.filter(Boolean),
        host: host || undefined,
      }
      const res = await fetch('/api/v1/tools/robots-txt-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setPreview(''); return }
      setPreview(data.robots_txt)
    } catch {
      setPreview('')
    } finally {
      setLoading(false)
    }
  }

  const applyPreset = (name: string) => {
    const preset = PRESETS[name]
    if (!preset) return
    setRules(preset.rules.map(r => ({
      id: makeId(),
      user_agent: r.user_agent,
      allow: [...r.allow],
      disallow: [...r.disallow],
      crawl_delay: r.crawl_delay?.toString() || '',
    })))
    setSitemaps([...preset.sitemaps])
    setHost(preset.host || '')
    setPreview('')
  }

  const testRobots = async () => {
    if (!robotsTxt.trim() || !testUrl.trim()) return
    setTestLoading(true)
    setTestError('')
    setTestResult(null)
    try {
      const res = await fetch('/api/v1/tools/robots-txt-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'test', robots_txt: robotsTxt, url: testUrl, user_agent: testUa || '*' }),
      })
      const data = await res.json()
      if (!res.ok) { setTestError(data.error || 'Test failed'); return }
      setTestResult(data)
    } catch {
      setTestError('Network error')
    } finally {
      setTestLoading(false)
    }
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#17457c]/10 rounded-lg">
              <FileText className="w-6 h-6 text-[#17457c]" />
            </div>
            <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10 border-0">Free Tool</Badge>
          </div>
          <h1 className="text-3xl font-bold text-[#17457c] mb-2">robots.txt Generator &amp; Tester</h1>
          <p className="text-gray-600">Generate, preview, and test robots.txt files. Check if URLs are allowed or blocked.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>

          {/* GENERATE TAB */}
          <TabsContent value="generate" className="space-y-4">
            {/* Presets */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PRESETS).map(name => (
                    <Button key={name} variant="outline" size="sm" onClick={() => applyPreset(name)}>
                      {name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            {rules.map((rule, ruleIdx) => (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Rule {ruleIdx + 1}</CardTitle>
                    {rules.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>User-Agent</Label>
                    <Input
                      value={rule.user_agent}
                      onChange={(e) => updateRule(rule.id, 'user_agent', e.target.value)}
                      placeholder="* or Googlebot"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Allow */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-green-700">Allow</Label>
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addPath(rule.id, 'allow')}>
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {rule.allow.map((path, idx) => (
                          <div key={idx} className="flex gap-1">
                            <Input
                              value={path}
                              onChange={(e) => updatePath(rule.id, 'allow', idx, e.target.value)}
                              placeholder="/"
                              className="text-sm"
                            />
                            <Button variant="ghost" size="sm" className="shrink-0 text-red-400" onClick={() => removePath(rule.id, 'allow', idx)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disallow */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-red-700">Disallow</Label>
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addPath(rule.id, 'disallow')}>
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {rule.disallow.map((path, idx) => (
                          <div key={idx} className="flex gap-1">
                            <Input
                              value={path}
                              onChange={(e) => updatePath(rule.id, 'disallow', idx, e.target.value)}
                              placeholder="/admin/"
                              className="text-sm"
                            />
                            <Button variant="ghost" size="sm" className="shrink-0 text-red-400" onClick={() => removePath(rule.id, 'disallow', idx)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-32">
                    <Label>Crawl-Delay (sec)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={rule.crawl_delay}
                      onChange={(e) => updateRule(rule.id, 'crawl_delay', e.target.value)}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addRule}>
              <Plus className="w-4 h-4 mr-2" /> Add Rule
            </Button>

            {/* Sitemaps & Host */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sitemaps &amp; Host</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Sitemap URLs</Label>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addSitemap}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  {sitemaps.map((url, idx) => (
                    <div key={idx} className="flex gap-1 mb-1">
                      <Input value={url} onChange={(e) => updateSitemap(idx, e.target.value)} placeholder="https://example.com/sitemap.xml" className="text-sm" />
                      <Button variant="ghost" size="sm" className="shrink-0 text-red-400" onClick={() => removeSitemap(idx)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="w-full">
                  <Label>Host (optional)</Label>
                  <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="https://example.com" className="mt-1" />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex gap-2">
              <Button onClick={generate} disabled={loading} className="bg-[#17457c] hover:bg-[#17457c]/90 text-white">
                {loading ? 'Generating...' : 'Generate robots.txt'}
              </Button>
            </div>

            {/* Preview */}
            {preview && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Generated robots.txt</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => copyText(preview, 'robots')}>
                      {copied === 'robots' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === 'robots' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre">
                    {preview}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* ScrapeForge promo */}
            <Card className="border-[#efa72d]/30 bg-[#efa72d]/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#efa72d] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Want deeper insights?</p>
                  <a href="/docs/api/scrapeforge" className="text-sm text-[#17457c] hover:underline">
                    Test your robots.txt with ScrapeForge →
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TEST TAB */}
          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="robots-input">robots.txt Content</Label>
                  <Textarea
                    id="robots-input"
                    value={robotsTxt}
                    onChange={(e) => setRobotsTxt(e.target.value)}
                    placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://example.com/sitemap.xml`}
                    className="mt-1 min-h-[150px] font-mono text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="test-url">URL to Test</Label>
                    <Input
                      id="test-url"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="https://example.com/admin/dashboard"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-ua">User-Agent</Label>
                    <Input
                      id="test-ua"
                      value={testUa}
                      onChange={(e) => setTestUa(e.target.value)}
                      placeholder="* or Googlebot"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={testRobots} disabled={testLoading || !robotsTxt.trim() || !testUrl.trim()} className="bg-[#17457c] hover:bg-[#17457c]/90 text-white">
                  {testLoading ? 'Testing...' : 'Test URL'}
                </Button>
              </CardContent>
            </Card>

            {testError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 text-red-700">{testError}</CardContent>
              </Card>
            )}

            {testResult && (
              <Card className={testResult.allowed ? 'border-green-200' : 'border-red-200'}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {testResult.allowed ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                    <div>
                      <div className="text-lg font-bold">
                        {testResult.allowed ? 'ALLOWED' : 'BLOCKED'}
                      </div>
                      <div className="text-sm text-gray-500">
                        User-agent: {testResult.user_agent}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Matching Rule</div>
                    <code className="text-sm font-mono">{testResult.matching_rule}</code>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <div className="text-xs text-gray-500 mb-1">URL</div>
                    <code className="text-sm font-mono break-all">{testResult.url}</code>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* API Section */}
        <Separator className="my-8" />

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-[#17457c] hover:text-[#17457c]/80 mb-4">
            <ChevronDown className="w-4 h-4" />
            Try it via API
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Generate Endpoint</Label>
                  <code className="block text-sm bg-gray-100 p-2 rounded mt-1">POST /api/v1/tools/robots-txt-generate</code>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">cURL (Generate)</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`curl -X POST https://search.venym.io/api/v1/tools/robots-txt-generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "mode": "generate",
    "rules": [{"user_agent": "*", "allow": ["/"], "disallow": ["/admin/"]}],
    "sitemaps": ["https://example.com/sitemap.xml"]
  }'`}
                  </pre>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Python (Test)</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`import requests
res = requests.post(
  "https://search.venym.io/api/v1/tools/robots-txt-generate",
  json={
    "mode": "test",
    "robots_txt": "User-agent: *\\nDisallow: /admin/",
    "url": "https://example.com/admin/dashboard",
    "user_agent": "*"
  }
)
print(res.json())  # {"url": "...", "allowed": false, "matching_rule": "Disallow: /admin/"} `}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by <a href="https://search.venym.io" className="text-[#17457c] font-semibold hover:underline">Venym Search</a> APIs — Free developer tools, no auth required
          </p>
        </div>
      </div>
    </div>
  )
}
