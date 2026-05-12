'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search, Code2, Database, Play, Loader2, Copy,
  CheckCircle2, AlertCircle, Clock, Zap, Terminal
} from 'lucide-react'
import { toast } from 'sonner'

interface ApiDemoProps {
  className?: string
}

const apiConfigs = {
  swiftsearch: {
    name: 'SWIFTSEARCH',
    icon: Search,
    description: 'Real-time results in 2 lines',
    placeholder: 'Bitcoin price 2025',
    examples: [
      'Bitcoin price predictions 2025',
      'AI news today',
      'Tesla stock analysis',
      'Climate change research'
    ],
    credits: 2
  },
  scrapeforge: {
    name: 'SCRAPEFORGE',
    icon: Code2,
    description: 'Bypass Akamai like it\'s 1999',
    placeholder: 'https://example.com',
    examples: [
      'https://news.ycombinator.com',
      'https://techcrunch.com',
      'Product comparison site',
      'E-commerce product page'
    ],
    credits: 5
  },
  deepdive: {
    name: 'DEEPDIVE',
    icon: Database,
    description: 'Research papers aren\'t boring',
    placeholder: 'quantum computing trends',
    examples: [
      'Quantum computing market trends',
      'Renewable energy adoption',
      'Cryptocurrency regulation',
      'AI ethics research'
    ],
    credits: 10
  }
}

type ApiType = keyof typeof apiConfigs

export default function ApiDemo({ className }: ApiDemoProps) {
  const [activeApi, setActiveApi] = useState<ApiType>('swiftsearch')
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const currentConfig = apiConfigs[activeApi]

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  const copyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      toast.success('Response copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const runDemo = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query to test')
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_type: activeApi,
          query: query.trim()
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Demo request failed')
      }

      setResponse(data)
      toast.success('Demo completed successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatResponseForDisplay = (data: any) => {
    const { demo, processing_time_ms, message, ...actualResponse } = data
    return actualResponse
  }

  return (
    <div className={className}>
      {/* Terminal-style card wrapper */}
      <div className="border border-white/5 bg-white/[0.01]">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em]">API ENDPOINT // LIVE</span>
          </div>
          <span className="text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 text-green-500/60 bg-green-500/5">
            ● OPERATIONAL
          </span>
        </div>

        {/* Tab selector */}
        <div className="border-b border-white/5">
          <Tabs value={activeApi} onValueChange={(value) => setActiveApi(value as ApiType)} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-transparent h-auto p-0 rounded-none">
              {Object.entries(apiConfigs).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-white/[0.03] data-[state=active]:border-b data-[state=active]:border-white data-[state=active]:text-white text-gray-600 border-b border-transparent rounded-none h-12 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{config.name}</span>
                    <span className="sm:hidden">{config.name.slice(0, 5)}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(apiConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key} className="mt-0 p-6">
                <div className="space-y-6">
                  {/* API info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <config.icon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-light text-gray-400">{config.description}</span>
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-white/10 text-gray-600 w-fit">
                      {config.credits} credits/call
                    </span>
                  </div>

                  {/* Input area */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={config.placeholder}
                      className="flex-1 bg-white/[0.02] text-white border border-white/10 focus:border-white/20 text-sm p-4 font-mono placeholder:text-gray-700 rounded-none"
                      onKeyDown={(e) => e.key === 'Enter' && runDemo()}
                    />
                    <Button
                      onClick={runDemo}
                      disabled={isLoading || !query.trim()}
                      className="bg-white text-black hover:bg-gray-200 font-mono text-[10px] uppercase tracking-[0.2em] px-8 h-auto py-4 rounded-none disabled:opacity-30"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          RUNNING
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 mr-2" />
                          EXECUTE
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Example queries */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.3em]">Examples:</span>
                    {config.examples.slice(0, 3).map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleClick(example)}
                        className="text-[10px] font-mono text-gray-600 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] px-3 py-1.5 border border-white/5 hover:border-white/10 transition-all"
                      >
                        {example}
                      </button>
                    ))}
                  </div>

                  {/* Response */}
                  {(response || error) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em] flex items-center gap-2">
                          {error ? (
                            <>
                              <AlertCircle className="h-3.5 w-3.5 text-red-400/60" />
                              ERROR
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500/60" />
                              RESPONSE
                              {response?.processing_time_ms && (
                                <span className="text-gray-700 ml-2">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {response.processing_time_ms}ms
                                </span>
                              )}
                            </>
                          )}
                        </span>
                        {response && (
                          <button
                            onClick={copyResponse}
                            className="text-gray-700 hover:text-gray-400 transition-colors"
                          >
                            {copied ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500/60" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="bg-black/50 border border-white/5 p-4 max-h-96 overflow-y-auto font-mono text-xs">
                        {error ? (
                          <div className="text-red-400/80 text-xs">
                            {error}
                          </div>
                        ) : (
                          <>
                            <pre className="text-green-500/70 text-xs overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
                              {JSON.stringify(formatResponseForDisplay(response), null, 2)}
                            </pre>
                            {response?.demo && (
                              <div className="mt-4 pt-3 border-t border-white/5 text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em]">
                                <Zap className="h-3 w-3 inline mr-1" />
                                {response.message}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {!response && !error && (
                    <div className="text-center py-12">
                      <Terminal className="h-6 w-6 text-gray-800 mx-auto mb-3" />
                      <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">
                        Enter query → Execute → Response streams here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
