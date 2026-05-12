'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Link2, Copy, Check, ChevronDown, Loader2, ArrowRight, ArrowLeftRight } from 'lucide-react'

export default function UrlEncoderPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [encode, setEncode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [components, setComponents] = useState<
    { original: string; encoded: string; type: string }[]
  >([])
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  async function process() {
    if (!input.trim()) return
    setLoading(true)
    setOutput('')
    setComponents([])
    try {
      const res = await fetch('/api/v1/tools/url-encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, encode }),
      })
      const data = await res.json()
      if (res.ok) {
        setOutput(data.output)
        setComponents(data.components || [])
      } else {
        setOutput(`Error: ${data.error}`)
      }
    } catch {
      setOutput('Error: Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function swap() {
    if (output) {
      setInput(output)
      setEncode(!encode)
      setOutput('')
      setComponents([])
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Link2 className="w-8 h-8" />
          URL Encoder / Decoder
        </h1>
        <p className="text-gray-600">
          Encode or decode URL components with full character breakdown.
        </p>
      </div>

      {/* Encode/Decode Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant={encode ? 'default' : 'outline'}
          onClick={() => setEncode(true)}
          className={encode ? 'bg-[#17457c] hover:bg-[#17457c]/90' : ''}
        >
          Encode
        </Button>
        <Button
          variant={!encode ? 'default' : 'outline'}
          onClick={() => setEncode(false)}
          className={!encode ? 'bg-[#17457c] hover:bg-[#17457c]/90' : ''}
        >
          Decode
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              {encode ? 'Plain Text' : 'URL-Encoded Text'}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput(encode ? 'hello world & foo=bar' : 'hello%20world%20%26%20foo%3Dbar')
                setOutput('')
                setComponents([])
              }}
              className="text-xs text-[#efa72d]"
            >
              Load Sample
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={encode ? 'Enter text to encode...' : 'Enter URL-encoded text to decode...'}
            className="min-h-[250px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={process}
              disabled={loading || !input.trim()}
              className="bg-[#17457c] hover:bg-[#17457c]/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : encode ? (
                <ArrowRight className="w-4 h-4 mr-2" />
              ) : (
                <ArrowLeftRight className="w-4 h-4 mr-2" />
              )}
              {encode ? 'Encode' : 'Decode'}
            </Button>
            {output && (
              <Button variant="outline" size="sm" onClick={swap} className="ml-auto text-xs">
                Swap →
              </Button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              {encode ? 'URL-Encoded Output' : 'Decoded Output'}
            </Label>
            {output && !output.startsWith('Error') && (
              <Button variant="ghost" size="sm" onClick={() => copyText(output, 'output')} className="text-xs">
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
            placeholder={encode ? 'Encoded result...' : 'Decoded result...'}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
      </div>

      {/* Component Breakdown */}
      {components.length > 0 && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Component Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Character</TableHead>
                    <TableHead>{encode ? 'Encoded' : 'Decoded'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((comp, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge
                          variant={
                            comp.type === 'special' || comp.type === 'encoded'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            comp.type === 'special' || comp.type === 'encoded'
                              ? 'bg-[#efa72d]/10 text-[#efa72d] border-0'
                              : 'bg-gray-100 text-gray-500 border-0'
                          }
                        >
                          {comp.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {comp.original === ' ' ? '(space)' : comp.original}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-[#17457c]">
                        {comp.encoded === ' ' ? '(space)' : comp.encoded}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

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
              code: `curl -X POST https://search.venym.io/api/v1/tools/url-encode \\
  -H "Content-Type: application/json" \\
  -d '{"input": "hello world", "encode": true}'`,
            },
            {
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://search.venym.io/api/v1/tools/url-encode",
    json={"input": "hello%20world", "encode": False}
)
print(res.json())`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/url-encode", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: "hello world", encode: true })
});
const data = await res.json();
console.log(data.output);`,
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
