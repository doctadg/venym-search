'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
import {
  KeyRound,
  Copy,
  Check,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react'

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4S5J3N6k7q8r9s0t1u2v3w4x5y6z7A8B9C0D1E2F3'

interface JwtResult {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  is_expired: boolean
  issued_at?: string
  expires_at?: string
  issuer?: string
}

const KNOWN_CLAIMS: Record<string, string> = {
  iss: 'Issuer',
  sub: 'Subject',
  aud: 'Audience',
  exp: 'Expiration Time',
  nbf: 'Not Before',
  iat: 'Issued At',
  jti: 'JWT ID',
  name: 'Name',
  email: 'Email',
  role: 'Role',
  scope: 'Scope',
  permissions: 'Permissions',
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState<JwtResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [apiOpen, setApiOpen] = useState(false)

  async function decodeJwt() {
    if (!token.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/v1/tools/jwt-decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to decode JWT')
      }
    } catch {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <KeyRound className="w-8 h-8" />
          JWT Decoder
        </h1>
        <p className="text-gray-600">
          Decode and inspect JSON Web Tokens. View header, payload, signature, and expiration status.
        </p>
      </div>

      {/* Token Input */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">JWT Token</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setToken(SAMPLE_JWT)
              setResult(null)
              setError('')
            }}
            className="text-xs text-[#efa72d]"
          >
            Load Sample
          </Button>
        </div>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here (eyJhbGci...)"
          className="min-h-[120px] font-mono text-sm"
        />
        <div className="flex items-center gap-3">
          <Button
            onClick={decodeJwt}
            disabled={loading || !token.trim()}
            className="bg-[#17457c] hover:bg-[#17457c]/90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4 mr-2" />
            )}
            Decode Token
          </Button>
          {error && (
            <span className="text-sm text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </span>
          )}
        </div>
      </div>

      {/* Decoded Result */}
      {result && (
        <div className="space-y-4">
          {/* Visual Token Breakdown */}
          <div className="rounded-lg border bg-white p-4">
            <Label className="text-xs text-gray-500 mb-2 block">Token Structure</Label>
            <div className="flex gap-1 font-mono text-xs overflow-x-auto">
              <div className="bg-rose-50 text-rose-700 px-2 py-1 rounded truncate max-w-[200px]">
                {token.split('.')[0]}...
              </div>
              <span className="text-gray-400">.</span>
              <div className="bg-violet-50 text-violet-700 px-2 py-1 rounded truncate max-w-[200px]">
                {token.split('.')[1]}...
              </div>
              <span className="text-gray-400">.</span>
              <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded truncate max-w-[200px]">
                {token.split('.')[2]}...
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Header
              </span>
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                Payload
              </span>
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Signature
              </span>
            </div>
          </div>

          {/* Expiration Status */}
          <div className="flex items-center gap-3">
            {result.is_expired ? (
              <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Expired
              </Badge>
            ) : result.payload.exp ? (
              <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                <Check className="w-3 h-3 mr-1" />
                Valid (not expired)
              </Badge>
            ) : (
              <Badge className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50">
                <Clock className="w-3 h-3 mr-1" />
                No expiration set
              </Badge>
            )}
            {result.issued_at && (
              <span className="text-xs text-gray-500">
                Issued: {new Date(result.issued_at).toLocaleString()}
              </span>
            )}
            {result.expires_at && (
              <span className="text-xs text-gray-500">
                Expires: {new Date(result.expires_at).toLocaleString()}
              </span>
            )}
          </div>

          <Separator />

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Header */}
            <Card className="border-l-4 border-l-rose-400">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-rose-700">
                    Header
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyText(JSON.stringify(result.header, null, 2), 'header')}
                    className="text-xs h-7"
                  >
                    {copied === 'header' ? (
                      <><Check className="w-3 h-3 mr-1" />Copied</>
                    ) : (
                      <><Copy className="w-3 h-3 mr-1" />Copy</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <pre className="text-xs font-mono bg-gray-50 rounded p-3 overflow-x-auto">
                  {JSON.stringify(result.header, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Signature */}
            <Card className="border-l-4 border-l-emerald-400">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-emerald-700">
                    Signature
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyText(result.signature, 'signature')}
                    className="text-xs h-7"
                  >
                    {copied === 'signature' ? (
                      <><Check className="w-3 h-3 mr-1" />Copied</>
                    ) : (
                      <><Copy className="w-3 h-3 mr-1" />Copy</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <pre className="text-xs font-mono bg-gray-50 rounded p-3 overflow-x-auto break-all">
                  {result.signature}
                </pre>
                <p className="text-xs text-gray-400 mt-2">
                  Signature verification requires the secret key. This tool only decodes the token.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payload */}
          <Card className="border-l-4 border-l-violet-400">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-violet-700">
                  Payload
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyText(JSON.stringify(result.payload, null, 2), 'payload')}
                  className="text-xs h-7"
                >
                  {copied === 'payload' ? (
                    <><Check className="w-3 h-3 mr-1" />Copied</>
                  ) : (
                    <><Copy className="w-3 h-3 mr-1" />Copy</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <pre className="text-xs font-mono bg-gray-50 rounded p-3 overflow-x-auto max-h-[200px]">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Claims Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Claims</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Claim</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(result.payload).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-mono text-sm font-medium text-[#17457c]">
                          {key}
                          {KNOWN_CLAIMS[key] && (
                            <span className="block text-xs text-gray-400 font-sans">
                              {KNOWN_CLAIMS[key]}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {typeof value === 'number'
                              ? key === 'iat' || key === 'exp' || key === 'nbf'
                                ? 'timestamp'
                                : 'number'
                              : typeof value}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {key === 'iat' || key === 'exp' || key === 'nbf'
                            ? `${value} (${new Date((value as number) * 1000).toISOString()})`
                            : JSON.stringify(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
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
              code: `curl -X POST https://search.venym.io/api/v1/tools/jwt-decode \\
  -H "Content-Type: application/json" \\
  -d '{"token": "eyJhbGci..."}'`,
            },
            {
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://search.venym.io/api/v1/tools/jwt-decode",
    json={"token": "eyJhbGci..."}
)
data = res.json()
print("Header:", data["header"])
print("Payload:", data["payload"])
print("Expired:", data["is_expired"])`,
            },
            {
              lang: 'javascript',
              code: `const res = await fetch("https://search.venym.io/api/v1/tools/jwt-decode", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: "eyJhbGci..." })
});
const data = await res.json();
console.log("Payload:", data.payload);
console.log("Expired:", data.is_expired);`,
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
