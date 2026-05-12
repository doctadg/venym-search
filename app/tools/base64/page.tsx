'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Lock, Copy, Check, ChevronDown, Loader2, ArrowRight, ArrowLeftRight } from 'lucide-react'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [encode, setEncode] = useState(true)
  const [urlSafe, setUrlSafe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [encodingType, setEncodingType] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  async function process() {
    if (!input.trim()) return
    setLoading(true)
    setOutput('')
    setEncodingType('')
    try {
      const res = await fetch('/api/v1/tools/base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, encode, url_safe: urlSafe }),
      })
      const data = await res.json()
      if (res.ok) {
        setOutput(data.output)
        setEncodingType(data.encoding)
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
    if (output && !output.startsWith('Error')) {
      setInput(output)
      setEncode(!encode)
      setOutput('')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Lock className="w-8 h-8" />
          Base64 Encoder / Decoder
        </h1>
        <p className="text-gray-600">
          Encode or decode Base64 in standard or URL-safe variants.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6 mb-6 p-4 rounded-lg border bg-white">
        <div className="flex items-center gap-3">
          <Button
            variant={encode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEncode(true)}
            className={encode ? 'bg-[#17457c] hover:bg-[#17457c]/90' : ''}
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            Encode
          </Button>
          <Button
            variant={!encode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEncode(false)}
            className={!encode ? 'bg-[#17457c] hover:bg-[#17457c]/90' : ''}
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Decode
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Switch checked={urlSafe} onCheckedChange={setUrlSafe} id="url-safe" />
          <Label htmlFor="url-safe" className="text-sm text-gray-600">
            URL-safe (base64url)
          </Label>
        </div>
        {encodingType && (
          <Badge variant="outline" className="text-xs border-[#efa72d] text-[#efa72d]">
            {encodingType === 'url_safe' ? 'URL-safe Base64' : 'Standard Base64'}
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              {encode ? 'Plain Text' : 'Base64 Input'}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput(encode ? 'Hello, Venym Search!' : 'SGVsbG8sIFNlYXJjaGhpdmUh')
                setOutput('')
                setEncodingType('')
              }}
              className="text-xs text-[#efa72d]"
            >
              Load Sample
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={encode ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
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
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {encode ? 'Encode' : 'Decode'}
            </Button>
            {output && !output.startsWith('Error') && (
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
              {encode ? 'Base64 Output' : 'Decoded Output'}
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
            placeholder={encode ? 'Base64 result...' : 'Decoded result...'}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-lg border bg-blue-50/50 p-4">
        <h3 className="text-sm font-medium text-[#17457c] mb-2">Encoding Variants</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <strong>Standard Base64:</strong> Uses A-Z, a-z, 0-9, +, / with = padding. Ideal for general-purpose encoding.
          </div>
          <div>
            <strong>URL-safe Base64:</strong> Replaces + with - and / with _, removes padding. Perfect for URLs, filenames, and JWTs.
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
              code: `curl -X POST https://search.venym.io/api/v1/tools/base64 \\
  -H "Content-Type: application/json" \\
  -d '{"input": "hello world", "encode": true, "url_safe": false}'`,
            },
            {
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://search.venym.io/api/v1/tools/base64",
    json={"input": "SGVsbG8gd29ybGQ=", "encode": False, "url_safe": False}
)
print(res.json())`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/base64", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: "hello world", encode: true, url_safe: false })
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
