'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Copy, Check, ChevronDown, Loader2, Search, AlertCircle, Zap,
} from 'lucide-react'

interface MatchResult {
  match: string
  index: number
  groups: Record<string, string>
}

interface RegexResult {
  pattern: string
  flags: string
  matches: MatchResult[]
  match_count: number
  is_valid: boolean
  error?: string
}

const FLAG_OPTIONS = [
  { key: 'g', label: 'Global (g)', description: 'Find all matches' },
  { key: 'i', label: 'Case-insensitive (i)', description: 'Ignore case' },
  { key: 'm', label: 'Multiline (m)', description: '^ and $ match line boundaries' },
  { key: 's', label: 'DotAll (s)', description: '. matches newlines' },
  { key: 'u', label: 'Unicode (u)', description: 'Unicode support' },
]

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flags, setFlags] = useState<string[]>(['g'])
  const [result, setResult] = useState<RegexResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  function toggleFlag(flag: string) {
    setFlags(prev =>
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    )
    setResult(null)
  }

  async function testRegex() {
    if (!pattern.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/v1/tools/regex-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern,
          flags: flags.join(''),
          test_string: testString,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        setResult({ pattern, flags: flags.join(''), matches: [], match_count: 0, is_valid: false, error: data.error })
      }
    } catch {
      setResult({ pattern, flags: flags.join(''), matches: [], match_count: 0, is_valid: false, error: 'Failed to connect to API' })
    } finally {
      setLoading(false)
    }
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const highlightedText = useMemo(() => {
    if (!result || !result.is_valid || !testString) return null
    if (result.matches.length === 0) return { html: testString, parts: [] }

    const parts: Array<{ text: string; isMatch: boolean }> = []
    let lastIndex = 0

    for (const m of result.matches) {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false })
      }
      parts.push({ text: m.match, isMatch: true })
      lastIndex = m.index + m.match.length
    }
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false })
    }

    return { html: parts, parts }
  }, [result, testString])

  function loadSample() {
    setPattern('(\\b\\w+\\b)\\s+\\1')
    setTestString('the the quick brown fox fox jumped over the lazy dog')
    setFlags(['g', 'i'])
    setResult(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8" />
          Regex Tester
        </h1>
        <p className="text-gray-600">
          Test regular expressions with real-time matching, group capture, and highlighted results.
        </p>
      </div>

      {/* Pattern & Flags */}
      <div className="space-y-4 mb-6 p-5 rounded-lg border bg-white">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Regular Expression
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#efa72d] font-mono font-bold text-lg">/</span>
              <Input
                value={pattern}
                onChange={(e) => { setPattern(e.target.value); setResult(null) }}
                placeholder="Enter regex pattern..."
                className="pl-8 pr-8 font-mono"
                onKeyDown={(e) => e.key === 'Enter' && testRegex()}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#efa72d] font-mono font-bold text-lg">
                /{flags.join('')}
              </span>
            </div>
          </div>
          <div className="flex items-end">
            <Button
              onClick={testRegex}
              disabled={loading || !pattern.trim()}
              className="bg-[#17457c] hover:bg-[#17457c]/90 whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Test Regex
            </Button>
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          {FLAG_OPTIONS.map(flag => (
            <div key={flag.key} className="flex items-center gap-2">
              <Checkbox
                id={`flag-${flag.key}`}
                checked={flags.includes(flag.key)}
                onCheckedChange={() => toggleFlag(flag.key)}
              />
              <Label htmlFor={`flag-${flag.key}`} className="text-sm text-gray-600 cursor-pointer">
                {flag.label}
              </Label>
            </div>
          ))}
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={loadSample} className="text-xs text-[#efa72d]">
              Load Sample
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Test String Input */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Test String</Label>
          <Textarea
            value={testString}
            onChange={(e) => { setTestString(e.target.value); setResult(null) }}
            placeholder="Enter text to test against..."
            className="min-h-[250px] font-mono text-sm"
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Results</Label>
            {result && (
              <Badge variant={result.is_valid ? 'default' : 'destructive'} className="text-xs">
                {result.is_valid ? `${result.match_count} match${result.match_count !== 1 ? 'es' : ''}` : 'Invalid'}
              </Badge>
            )}
          </div>

          {result && result.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Invalid Expression</p>
                <p className="text-xs text-red-600 mt-1">{result.error}</p>
              </div>
            </div>
          )}

          {/* Highlighted Output */}
          {result && result.is_valid && highlightedText && (
            <div className="rounded-lg border p-4 bg-gray-50 min-h-[100px]">
              <p className="text-xs text-gray-500 mb-2">Highlighted Matches</p>
              <div className="font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
                {highlightedText.html.map((part, i) =>
                  part.isMatch ? (
                    <span key={i} className="bg-[#efa72d]/30 text-[#17457c] font-semibold rounded px-0.5">
                      {part.text}
                    </span>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
                {result.matches.length === 0 && testString && (
                  <span className="text-gray-400 italic">No matches found</span>
                )}
              </div>
            </div>
          )}

          {/* Match List */}
          {result && result.is_valid && result.matches.length > 0 && (
            <div className="rounded-lg border p-4 space-y-3 max-h-[300px] overflow-y-auto">
              <p className="text-xs text-gray-500">Match Details</p>
              {result.matches.map((m, i) => (
                <div key={i} className="bg-white rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-[#17457c] text-[#17457c]">
                      Match {i + 1}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Index: {m.index}</span>
                      <span>Length: {m.match.length}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyText(m.match, `match-${i}`)}>
                        {copied === `match-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded block">
                    {m.match}
                  </code>
                  {Object.keys(m.groups).length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">Groups</p>
                      {Object.entries(m.groups).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary" className="font-mono text-xs bg-[#efa72d]/10 text-[#efa72d] border-[#efa72d]/20">
                            {key}
                          </Badge>
                          <code className="font-mono text-gray-700">{value}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!result && (
            <div className="rounded-lg border border-dashed p-8 text-center text-gray-400">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter a pattern and test string, then click Test Regex</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-[#17457c]">Common Regex Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { label: 'Email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+' },
              { label: 'URL', pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+' },
              { label: 'Phone', pattern: '\\+?\\d{1,4}[\\s-]?\\(?\\d{1,4}\\)?[\\s-]?\\d{1,4}[\\s-]?\\d{1,9}' },
              { label: 'IP Address', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' },
              { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])' },
              { label: 'Repeated words', pattern: '\\b(\\w+)\\s+\\1\\b' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => { setPattern(item.pattern); setResult(null) }}
                className="flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-medium text-[#17457c]">{item.label}</span>
                <code className="text-[11px] font-mono text-gray-500 truncate w-full">{item.pattern}</code>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Examples */}
      <Collapsible open={apiOpen} onOpenChange={setApiOpen} className="mt-10">
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#17457c] transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${apiOpen ? 'rotate-180' : ''}`} />
            Try it via API
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          {[
            {
              lang: 'curl',
              code: `curl -X POST https://search.venym.io/api/v1/tools/regex-test \\
  -H "Content-Type: application/json" \\
  -d '{"pattern": "\\\\b\\\\w+\\\\b", "flags": "g", "test_string": "hello world 123"}'`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/regex-test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pattern: "(\\\\d+)-(\\\\d+)-(\\\\d+)",
    flags: "g",
    test_string: "2024-01-15 and 2024-12-31"
  })
});
const data = await res.json();
console.log(data.matches);`,
            },
          ].map(example => (
            <div key={example.lang} className="relative rounded-lg bg-gray-900 p-4">
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs">{example.lang}</Badge>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto"><code>{example.code}</code></pre>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
