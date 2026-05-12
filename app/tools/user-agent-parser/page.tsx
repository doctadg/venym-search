'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Monitor, Smartphone, Tablet, Bot, ChevronDown, Copy, Check, Globe, Cpu, Zap } from 'lucide-react'

const UA_PRESETS: Record<string, string> = {
  'Chrome (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Chrome (Mac)': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Chrome (Android)': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  'Chrome (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.104 Mobile/15E148 Safari/604.1',
  'Firefox (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Firefox (Mac)': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Safari (Mac)': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Safari (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  'Edge (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  'Samsung Internet': 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36',
  'Opera (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OPR/109.0.0.0',
  'Googlebot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Bingbot': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Twitterbot': 'Twitterbot/1.0',
  'iPad': 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  'Linux (Ubuntu)': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Brave (Mac)': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Yandex Browser': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 YaBrowser/24.1.0.0 Safari/537.36',
  'Vivaldi (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Vivaldi/6.6.3271.40',
  'Discordbot': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
}

interface ParseResult {
  user_agent: string
  browser: { name: string; version: string; engine: string }
  os: { name: string; version: string; platform: string }
  device: { type: string; is_mobile: boolean; is_tablet: boolean; is_desktop: boolean; is_bot: boolean }
}

function DeviceIcon({ type }: { type: string }) {
  switch (type) {
    case 'Mobile': return <Smartphone className="w-5 h-5" />
    case 'Tablet': return <Tablet className="w-5 h-5" />
    case 'Bot': return <Bot className="w-5 h-5" />
    default: return <Monitor className="w-5 h-5" />
  }
}

export default function UserAgentParserPage() {
  const [userAgent, setUserAgent] = useState('')
  const [result, setResult] = useState<ParseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const parse = async () => {
    if (!userAgent.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/v1/tools/parse-user-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_agent: userAgent.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to parse')
        return
      }
      setResult(data)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const presetKeys = Object.keys(UA_PRESETS)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#17457c]/10 rounded-lg">
              <Globe className="w-6 h-6 text-[#17457c]" />
            </div>
            <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10 border-0">Free Tool</Badge>
          </div>
          <h1 className="text-3xl font-bold text-[#17457c] mb-2">User Agent Parser</h1>
          <p className="text-gray-600">Parse any User-Agent string to extract browser, OS, and device information.</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="preset-select">Quick Presets</Label>
                  <Select onValueChange={(val) => setUserAgent(UA_PRESETS[val] || '')}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a common UA string..." />
                    </SelectTrigger>
                    <SelectContent>
                      {presetKeys.map((key) => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="ua-input">User Agent String</Label>
                <Textarea
                  id="ua-input"
                  placeholder="Paste a User-Agent string here..."
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="mt-1 min-h-[80px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={parse}
                  disabled={!userAgent.trim() || loading}
                  className="bg-[#17457c] hover:bg-[#17457c]/90 text-white"
                >
                  {loading ? 'Parsing...' : 'Parse User Agent'}
                </Button>
                {userAgent && (
                  <Button variant="outline" onClick={() => { setUserAgent(''); setResult(null); setError('') }}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">{error}</CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Bot Detection Badge */}
            {result.device.is_bot && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <Bot className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 font-medium">Bot Detected</span>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0">
                  Automated Crawler
                </Badge>
              </div>
            )}

            {/* Device Type */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DeviceIcon type={result.device.type} />
                  Device
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Type', value: result.device.type },
                    { label: 'Mobile', value: result.device.is_mobile ? 'Yes' : 'No' },
                    { label: 'Tablet', value: result.device.is_tablet ? 'Yes' : 'No' },
                    { label: 'Desktop', value: result.device.is_desktop ? 'Yes' : 'No' },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Browser Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Browser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Name', value: result.browser.name },
                    { label: 'Version', value: result.browser.version || 'N/A' },
                    { label: 'Engine', value: result.browser.engine },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* OS Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Operating System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Name', value: result.os.name },
                    { label: 'Version', value: result.os.version || 'N/A' },
                    { label: 'Platform', value: result.os.platform },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Raw JSON */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Raw JSON Response</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'json')}
                  >
                    {copied === 'json' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied === 'json' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

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
                  <Label className="text-xs text-gray-500">Endpoint</Label>
                  <code className="block text-sm bg-gray-100 p-2 rounded mt-1">POST /api/v1/tools/parse-user-agent</code>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">cURL</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`curl -X POST https://search.venym.io/api/v1/tools/parse-user-agent \\
  -H "Content-Type: application/json" \\
  -d '{"user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0"}'`}
                  </pre>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Python</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`import requests
res = requests.post(
  "https://search.venym.io/api/v1/tools/parse-user-agent",
  json={"user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0"}
)
print(res.json())`}
                  </pre>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">JavaScript</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`const res = await fetch(
  "https://search.venym.io/api/v1/tools/parse-user-agent",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_agent: "Mozilla/5.0 ..." })
  }
);
const data = await res.json();`}
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
