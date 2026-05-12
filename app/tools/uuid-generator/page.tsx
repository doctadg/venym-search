'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Copy, Check, ChevronDown, Loader2, Hash, RefreshCw } from 'lucide-react'

interface UUIDResult {
  uuids: string[]
  version: string
  count: number
}

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<'v4' | 'v7'>('v4')
  const [count, setCount] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [noDashes, setNoDashes] = useState(false)
  const [result, setResult] = useState<UUIDResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/tools/uuid-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          version,
          uppercase,
          no_dashes: noDashes,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  async function bulkCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.uuids.join('\n'))
    setCopied('bulk')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Hash className="w-8 h-8" />
          UUID / GUID Generator
        </h1>
        <p className="text-gray-600">
          Generate RFC 4122 UUID v4 or UUID v7 identifiers in bulk. Free, no API key needed.
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6 p-5 rounded-lg border bg-white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Version */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Version</Label>
            <div className="flex gap-2">
              <Button
                variant={version === 'v4' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setVersion('v4')}
                className={version === 'v4' ? 'bg-[#17457c] hover:bg-[#17457c]/90 flex-1' : 'flex-1'}
              >
                v4 (Random)
              </Button>
              <Button
                variant={version === 'v7' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setVersion('v7')}
                className={version === 'v7' ? 'bg-[#17457c] hover:bg-[#17457c]/90 flex-1' : 'flex-1'}
              >
                v7 (Time-ordered)
              </Button>
            </div>
          </div>

          {/* Count */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Count (1–100)</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full"
            />
          </div>

          {/* Uppercase */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Formatting</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch checked={uppercase} onCheckedChange={setUppercase} id="uppercase" />
                <Label htmlFor="uppercase" className="text-sm text-gray-600">UPPERCASE</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={noDashes} onCheckedChange={setNoDashes} id="nodashes" />
                <Label htmlFor="nodashes" className="text-sm text-gray-600">No dashes</Label>
              </div>
            </div>
          </div>

          {/* Generate */}
          <div className="flex items-end">
            <Button
              onClick={generate}
              disabled={loading}
              className="w-full bg-[#17457c] hover:bg-[#17457c]/90"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Generate
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700">Generated UUIDs</Label>
              <Badge variant="outline" className="text-xs border-[#efa72d] text-[#efa72d]">
                {result.version}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {result.count} generated
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={bulkCopy} className="text-xs">
              {copied === 'bulk' ? (
                <><Check className="w-3 h-3 mr-1" />Copied All</>
              ) : (
                <><Copy className="w-3 h-3 mr-1" />Copy All</>
              )}
            </Button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {result.uuids.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-white p-3 hover:bg-gray-50 transition-colors"
              >
                <code className="font-mono text-sm text-gray-800 truncate mr-4">
                  {uuid}
                </code>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    #{i + 1}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => copyText(uuid, `uuid-${i}`)}
                  >
                    {copied === `uuid-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Hash className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">Click Generate to create UUIDs</p>
          </CardContent>
        </Card>
      )}

      {/* Version Info */}
      <div className="mt-6 rounded-lg border bg-blue-50/50 p-4">
        <h3 className="text-sm font-medium text-[#17457c] mb-2">UUID Versions</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <strong className="text-[#17457c]">v4 (Random):</strong> 122 random bits. No ordering guarantees — each UUID is independent. Most commonly used for database IDs, unique keys, and general-purpose identifiers.
          </div>
          <div>
            <strong className="text-[#17457c]">v7 (Time-ordered):</strong> 48-bit millisecond timestamp + 74 random bits. Monotonically sortable by generation time. Ideal for database primary keys, distributed systems, and log correlation.
          </div>
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
              code: `curl -X POST https://search.venym.io/api/v1/tools/uuid-generate \\
  -H "Content-Type: application/json" \\
  -d '{"count": 5, "version": "v4", "uppercase": false, "no_dashes": false}'`,
            },
            {
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://search.venym.io/api/v1/tools/uuid-generate",
    json={"count": 10, "version": "v7", "uppercase": true, "no_dashes": True}
)
for uuid in res.json()["uuids"]:
    print(uuid)`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/uuid-generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ count: 5, version: "v4" })
});
const { uuids } = await res.json();
console.log(uuids);`,
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
