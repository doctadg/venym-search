'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Code,
  Key,
  Settings,
} from 'lucide-react'

interface APITesterProps {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  title: string
  description: string
  parameters: {
    name: string
    type: string
    required: boolean
    description: string
    example?: string
    options?: string[]
  }[]
  exampleRequest?: any
  demoApiKey?: string
}

const methodTone: Record<string, string> = {
  GET: 'text-emerald-300/80 border-emerald-400/20',
  POST: 'text-sky-300/80 border-sky-400/20',
  PUT: 'text-amber-300/80 border-amber-400/20',
  DELETE: 'text-rose-300/80 border-rose-400/20',
}

const inputClass =
  "w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"

const labelClass =
  "block text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1.5"

const sectionTitle =
  "flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40"

export function APITester({
  endpoint,
  method,
  title,
  description,
  parameters,
  exampleRequest = {},
  demoApiKey = "demo_sk_test_64_HEX_CHARS",
}: APITesterProps) {
  const [apiKey, setApiKey] = useState(demoApiKey)
  const [formData, setFormData] = useState(exampleRequest)
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleInputChange = (name: string, value: string | boolean | number | string[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateCode = (language: 'python' | 'javascript' | 'curl') => {
    const jsonData = JSON.stringify(formData, null, 2)

    switch (language) {
      case 'python':
        return `import requests

response = requests.${method.toLowerCase()}(
    "${endpoint}",
    headers={"Authorization": "Bearer " + "${apiKey}"},
    json=${jsonData}
)

data = response.json()
print(data)`

      case 'javascript':
        return `const axios = require('axios');

const response = await axios.${method.toLowerCase()}(
  '${endpoint}',
  ${jsonData},
  {
    headers: { 'Authorization': 'Bearer ${apiKey}' }
  }
);

console.log(response.data);`

      case 'curl':
        return `curl -X ${method} ${endpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(formData)}'`

      default:
        return ''
    }
  }

  const copyCode = async (language: string) => {
    try {
      const code = generateCode(language as 'python' | 'javascript' | 'curl')
      await navigator.clipboard.writeText(code)
      setCopiedCode(language)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockResponse = {
        success: true,
        data: {
          message: "This is a demo response. In production, this would call the actual API.",
          endpoint,
          method,
          parameters: formData,
          timestamp: new Date().toISOString(),
        },
        credits_used: Math.floor(Math.random() * 10) + 1,
        processing_time: (Math.random() * 2 + 0.5).toFixed(2),
      }

      setResponse(mockResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (param: typeof parameters[0]) => {
    const value = formData[param.name] ?? ''

    if (param.options) {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(param.name, e.target.value)}
          className={inputClass}
        >
          <option value="">Select {param.name}</option>
          {param.options.map((option) => (
            <option key={option} value={option} className="bg-[#0a0a0a]">
              {option}
            </option>
          ))}
        </select>
      )
    }

    if (param.type === 'boolean') {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => handleInputChange(param.name, e.target.checked)}
            className="accent-white"
          />
          <span className="text-[13px] text-white/70">Enable {param.name}</span>
        </label>
      )
    }

    if (param.type === 'array') {
      return (
        <textarea
          value={Array.isArray(value) ? value.join(', ') : value}
          onChange={(e) =>
            handleInputChange(
              param.name,
              e.target.value.split(',').map((s) => s.trim())
            )
          }
          placeholder={`Enter ${param.name} separated by commas`}
          className="w-full min-h-[80px] px-3 py-2 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm font-mono"
        />
      )
    }

    if (param.type === 'object') {
      return (
        <textarea
          value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              handleInputChange(param.name, parsed)
            } catch {
              handleInputChange(param.name, e.target.value)
            }
          }}
          placeholder={`Enter ${param.name} as JSON object`}
          className="w-full min-h-[100px] px-3 py-2 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm font-mono"
        />
      )
    }

    return (
      <input
        type={param.type === 'integer' ? 'number' : 'text'}
        value={value}
        onChange={(e) =>
          handleInputChange(
            param.name,
            param.type === 'integer' ? parseInt(e.target.value) || 0 : e.target.value
          )
        }
        placeholder={param.example || `Enter ${param.name}`}
        className={inputClass}
      />
    )
  }

  return (
    <div className="space-y-6 my-6">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${methodTone[method] ?? 'text-white/70 border-white/15'}`}>
            {method}
          </span>
          <code className="text-[12px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 px-2.5 py-1 rounded-sm">
            {endpoint}
          </code>
        </div>
        <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>
        <p className="text-[13px] text-white/55 mt-1">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Builder */}
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <span className={sectionTitle}>
              <Settings className="w-3.5 h-3.5 text-white/40" />
              Request Builder
            </span>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Key className="w-3 h-3" />
                  API Key
                </span>
              </label>
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className={`${inputClass} font-mono`}
              />
              <p className="text-[11px] font-mono text-white/30 mt-1.5">
                Using demo key. Replace with your actual API key.
              </p>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Parameters</label>
              {parameters.map((param) => (
                <div key={param.name}>
                  <label className="flex items-center gap-2 mb-1.5">
                    <code className="text-[12px] font-mono text-white/80">{param.name}</code>
                    {param.required && (
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm border border-rose-400/20 text-rose-300/80">
                        Required
                      </span>
                    )}
                  </label>
                  {renderInput(param)}
                  <p className="text-[11px] text-white/40 mt-1">{param.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={testAPI}
              disabled={loading}
              className="venym-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                  Testing
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1.5" />
                  Test API
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Examples & Response */}
        <div className="space-y-6">
          {/* Code Examples */}
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <span className={sectionTitle}>
                <Code className="w-3.5 h-3.5 text-white/40" />
                Code Examples
              </span>
            </div>
            <div className="p-4">
              <Tabs defaultValue="python" className="w-full">
                <TabsList className="bg-transparent border-b border-white/[0.06] rounded-none p-0 h-auto w-full justify-start gap-0">
                  {(['python', 'javascript', 'curl'] as const).map((lang) => (
                    <TabsTrigger
                      key={lang}
                      value={lang}
                      className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[10px] font-mono uppercase tracking-[0.15em] px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
                    >
                      {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {(['python', 'javascript', 'curl'] as const).map((lang) => (
                  <TabsContent key={lang} value={lang} className="mt-4">
                    <div className="relative">
                      <pre className="bg-[#050505] border border-white/[0.06] text-white/80 p-4 rounded-sm overflow-x-auto text-[12.5px] leading-relaxed font-mono">
                        <code>{generateCode(lang)}</code>
                      </pre>
                      <button
                        onClick={() => copyCode(lang)}
                        className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 rounded-sm transition-colors"
                      >
                        {copiedCode === lang ? <Check className="w-3 h-3 text-emerald-400/80" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* API Response */}
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <span className={sectionTitle}>API Response</span>
            </div>
            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                  <span className="ml-2 text-[12px] font-mono uppercase tracking-[0.15em] text-white/40">Testing</span>
                </div>
              )}

              {error && (
                <div className="border border-rose-400/20 bg-rose-400/5 rounded-sm p-4">
                  <div className="flex items-center gap-2 text-rose-300/80 text-[10px] font-mono uppercase tracking-[0.2em]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Error
                  </div>
                  <p className="text-[13px] text-rose-200/70 mt-1.5">{error}</p>
                </div>
              )}

              {response && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
                      200 OK
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
                      {response.processing_time}s
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
                      {response.credits_used} credits
                    </span>
                  </div>
                  <pre className="bg-[#050505] border border-white/[0.06] text-white/80 p-4 rounded-sm overflow-x-auto text-[12.5px] leading-relaxed font-mono">
                    <code>{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              )}

              {!loading && !error && !response && (
                <div className="text-center py-10">
                  <Code className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-white/40">
                    Click Test API to see the response
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
