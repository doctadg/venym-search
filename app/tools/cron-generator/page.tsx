'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Copy, Check, ChevronDown, Loader2, Clock, Play, ArrowRight, Sparkles,
} from 'lucide-react'

interface CronResult {
  expression: string
  explanation: string
  human_readable: string
  next_runs: string[]
}

const PRESETS = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Every day at midnight', expression: '0 0 * * *' },
  { label: 'Every day at noon', expression: '0 12 * * *' },
  { label: 'Every Monday at 9am', expression: '0 9 * * 1' },
  { label: 'Every month on the 1st', expression: '0 0 1 * *' },
  { label: 'Every weekday at 8am', expression: '0 8 * * 1-5' },
  { label: 'Every Sunday at midnight', expression: '0 0 * * 0' },
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
  { label: 'Every 6 hours', expression: '0 */6 * * *' },
  { label: 'Every January 1st at midnight', expression: '0 0 1 1 *' },
  { label: 'Every Friday at 5pm', expression: '0 17 * * 5' },
]

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}

export default function CronGeneratorPage() {
  const [mode, setMode] = useState<'explain' | 'generate'>('explain')
  const [expression, setExpression] = useState('')
  const [genFields, setGenFields] = useState({
    minute: '0',
    hour: '*',
    day: '*',
    month: '*',
    weekday: '*',
  })
  const [result, setResult] = useState<CronResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  const explainCron = useCallback(async (expr: string) => {
    if (!expr.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/v1/tools/cron-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setExpression(expr.trim())
      } else {
        setResult({ expression: expr, explanation: data.error, human_readable: data.error, next_runs: [] })
      }
    } catch {
      setResult({ expression: expr, explanation: 'Failed to connect to API', human_readable: 'Failed to connect to API', next_runs: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  function generateCron() {
    const expr = `${genFields.minute} ${genFields.hour} ${genFields.day} ${genFields.month} ${genFields.weekday}`
    explainCron(expr)
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Auto-explain on expression change in explain mode with debounce
  useEffect(() => {
    if (mode === 'explain' && expression.trim().split(/\s+/).length === 5) {
      const timer = setTimeout(() => explainCron(expression), 500)
      return () => clearTimeout(timer)
    }
  }, [expression, mode, explainCron])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Clock className="w-8 h-8" />
          Cron Expression Generator & Explainer
        </h1>
        <p className="text-gray-600">
          Generate, explain, and preview cron expressions. See the next 10 scheduled run times.
        </p>
      </div>

      {/* Presets */}
      <div className="mb-6 p-5 rounded-lg border bg-white">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <Button
              key={preset.expression}
              variant="outline"
              size="sm"
              className={`text-xs ${expression === preset.expression ? 'border-[#17457c] bg-[#17457c]/5 text-[#17457c]' : ''}`}
              onClick={() => {
                setExpression(preset.expression)
                if (mode === 'explain') {
                  explainCron(preset.expression)
                }
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as 'explain' | 'generate')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="explain" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Explain
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate
          </TabsTrigger>
        </TabsList>

        {/* Explain Mode */}
        <TabsContent value="explain" className="space-y-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Cron Expression
              </Label>
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="* * * * *"
                className="font-mono text-lg"
                onKeyDown={(e) => e.key === 'Enter' && explainCron(expression)}
              />
              <p className="text-xs text-gray-400 mt-1">Format: minute hour day month weekday</p>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => explainCron(expression)}
                disabled={loading || !expression.trim()}
                className="bg-[#17457c] hover:bg-[#17457c]/90"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Explain
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Generate Mode */}
        <TabsContent value="generate" className="space-y-6">
          <div className="p-5 rounded-lg border bg-white">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">Minute (0-59)</Label>
                <Input
                  value={genFields.minute}
                  onChange={(e) => setGenFields(f => ({ ...f, minute: e.target.value }))}
                  placeholder="* or */5"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">Hour (0-23)</Label>
                <Input
                  value={genFields.hour}
                  onChange={(e) => setGenFields(f => ({ ...f, hour: e.target.value }))}
                  placeholder="* or 9"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">Day of Month (1-31)</Label>
                <Input
                  value={genFields.day}
                  onChange={(e) => setGenFields(f => ({ ...f, day: e.target.value }))}
                  placeholder="* or 1"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">Month (1-12)</Label>
                <Input
                  value={genFields.month}
                  onChange={(e) => setGenFields(f => ({ ...f, month: e.target.value }))}
                  placeholder="* or 1"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">Weekday (0-6, Sun=0)</Label>
                <Input
                  value={genFields.weekday}
                  onChange={(e) => setGenFields(f => ({ ...f, weekday: e.target.value }))}
                  placeholder="* or 1-5"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={generateCron} disabled={loading} className="bg-[#17457c] hover:bg-[#17457c]/90">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate & Preview
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Expression & Explanation */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-sm border-[#17457c] text-[#17457c] px-3 py-1">
                    {result.expression}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => copyText(result.expression, 'expr')} className="text-xs">
                    {copied === 'expr' ? <><Check className="w-3 h-3 mr-1" />Copied</> : <><Copy className="w-3 h-3 mr-1" />Copy</>}
                  </Button>
                </div>
              </div>

              {result.explanation && !result.explanation.startsWith('Error') && !result.explanation.includes('Failed') && (
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-4">
                  <p className="text-sm text-[#17457c] font-medium">{result.human_readable || result.explanation}</p>
                </div>
              )}

              {result.explanation && (result.explanation.startsWith('Error') || result.explanation.includes('Failed') || result.explanation.includes('Invalid')) && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{result.explanation}</p>
                </div>
              )}

              {/* Field Breakdown */}
              {result.expression.split(/\s+/).length === 5 && !result.explanation.includes('Invalid') && (
                <div className="grid grid-cols-5 gap-2">
                  {['Minute', 'Hour', 'Day', 'Month', 'Weekday'].map((label, i) => (
                    <div key={label} className="text-center rounded-lg border p-2 bg-gray-50">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-mono text-lg font-bold text-[#17457c]">
                        {result.expression.split(/\s+/)[i]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Runs */}
          {result.next_runs.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-[#17457c] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Next 10 Scheduled Runs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.next_runs.map((run, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border bg-white p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Badge variant="secondary" className="text-[10px] font-mono w-6 shrink-0 justify-center">
                        {i + 1}
                      </Badge>
                      <code className="text-sm font-mono text-gray-700 flex-1">
                        {formatDateTime(run)}
                      </code>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => copyText(formatDateTime(run), `run-${i}`)}>
                        {copied === `run-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!result && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Clock className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">Enter a cron expression or use generate mode to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Cron Syntax Reference */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-[#17457c]">Cron Expression Syntax</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Field</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Values</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Special Chars</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Examples</th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-600">
                <tr className="border-b"><td className="py-2 pr-4 font-medium">Minute</td><td className="py-2 pr-4 font-mono">0-59</td><td className="py-2 pr-4">* , - /</td><td className="py-2 font-mono">5, */10, 0,30</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 font-medium">Hour</td><td className="py-2 pr-4 font-mono">0-23</td><td className="py-2 pr-4">* , - /</td><td className="py-2 font-mono">9, */2, 0,12</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 font-medium">Day of Month</td><td className="py-2 pr-4 font-mono">1-31</td><td className="py-2 pr-4">* , - /</td><td className="py-2 font-mono">1, 15, */10</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 font-medium">Month</td><td className="py-2 pr-4 font-mono">1-12</td><td className="py-2 pr-4">* , - /</td><td className="py-2 font-mono">1, 6, */3</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Day of Week</td><td className="py-2 pr-4 font-mono">0-6 (0=Sun)</td><td className="py-2 pr-4">* , - /</td><td className="py-2 font-mono">1, 1-5, */2</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs text-gray-600">
            <div><code className="font-mono bg-gray-100 px-1 rounded">*</code> — any value</div>
            <div><code className="font-mono bg-gray-100 px-1 rounded">,</code> — list separator (e.g., 1,3,5)</div>
            <div><code className="font-mono bg-gray-100 px-1 rounded">-</code> — range (e.g., 1-5)</div>
            <div><code className="font-mono bg-gray-100 px-1 rounded">/</code> — step values (e.g., */15)</div>
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
              code: `curl -X POST https://search.venym.io/api/v1/tools/cron-explain \\
  -H "Content-Type: application/json" \\
  -d '{"expression": "0 9 * * 1"}'`,
            },
            {
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://search.venym.io/api/v1/tools/cron-explain",
    json={"expression": "*/15 * * * *"}
)
data = res.json()
print(data["human_readable"])
for run in data["next_runs"]:
    print(f"  {run}")`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/cron-explain", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ expression: "0 0 1 * *" })
});
const data = await res.json();
console.log(data.human_readable);
console.log(data.next_runs);`,
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
