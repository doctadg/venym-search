'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Braces, Copy, Check, ChevronDown, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const SAMPLE_JSON = `{"name":"Venym Search","version":"1.0","features":["search","scrape","research"],"config":{"debug":false,"maxRetries":3,},}`

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState('2')
  const [sortKeys, setSortKeys] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    valid: boolean
    error?: string
    stats?: { keys: number; depth: number; size: string }
  } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  async function formatJson() {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    setOutput('')
    try {
      const res = await fetch('/api/v1/tools/json-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, indent: Number(indent), sort_keys: sortKeys }),
      })
      const data = await res.json()
      setOutput(data.output || '')
      setResult({ valid: data.valid, error: data.error, stats: data.stats })
    } catch {
      setResult({ valid: false, error: 'Failed to connect to API' })
    } finally {
      setLoading(false)
    }
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function loadSample() {
    setInput(SAMPLE_JSON)
    setResult(null)
    setOutput('')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Braces className="w-8 h-8" />
          JSON Formatter & Validator
        </h1>
        <p className="text-gray-600">
          Format, validate, and analyze JSON. Auto-fixes common issues like trailing commas and single quotes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Input JSON</Label>
            <Button variant="ghost" size="sm" onClick={loadSample} className="text-xs text-[#efa72d]">
              Load Sample
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...'
            className="min-h-[300px] font-mono text-sm"
          />

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-gray-500">Indent</Label>
              <Select value={indent} onValueChange={setIndent}>
                <SelectTrigger className="w-[70px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} spaces
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={sortKeys} onCheckedChange={setSortKeys} id="sort-keys" />
              <Label htmlFor="sort-keys" className="text-xs text-gray-500">
                Sort keys alphabetically
              </Label>
            </div>
            <Button
              onClick={formatJson}
              disabled={loading || !input.trim()}
              className="bg-[#17457c] hover:bg-[#17457c]/90 ml-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Formatting...
                </>
              ) : (
                <>
                  <Braces className="w-4 h-4 mr-2" />
                  Format JSON
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Output</Label>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyText(output, 'output')}
                className="text-xs"
              >
                {copied === 'output' ? (
                  <><Check className="w-3 h-3 mr-1" />Copied</>
                ) : (
                  <><Copy className="w-3 h-3 mr-1" />Copy</>
                )}
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="min-h-[300px] font-mono text-sm"
          />

          {/* Status */}
          {result && (
            <div className="flex items-center gap-3">
              {result.valid ? (
                <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Valid JSON
                </Badge>
              ) : (
                <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Invalid JSON
                </Badge>
              )}
              {result.error && (
                <span className="text-xs text-gray-500">{result.error}</span>
              )}
            </div>
          )}

          {/* Stats */}
          {result?.stats && result.valid && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Keys', value: result.stats.keys },
                { label: 'Depth', value: result.stats.depth },
                { label: 'Size', value: result.stats.size },
              ].map((stat) => (
                <Card key={stat.label} className="p-3">
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <div className="text-lg font-semibold text-[#17457c]">{stat.value}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

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
              code: `curl -X POST https://search.venym.io/api/v1/tools/json-format \\
  -H "Content-Type: application/json" \\
  -d '{"input": "{\\"key\\": \\"value\\"}", "indent": 2, "sort_keys": false}'`,
            },
            {
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://search.venym.io/api/v1/tools/json-format",
    json={
        "input": '{"key": "value"}',
        "indent": 2,
        "sort_keys": False
    }
)
print(res.json())`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/json-format", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    input: '{"key": "value"}',
    indent: 2,
    sort_keys: false
  })
});
const data = await res.json();
console.log(data);`,
            },
          ].map((example) => (
            <div key={example.lang} className="relative rounded-lg bg-gray-900 p-4">
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                {example.lang}
              </Badge>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
