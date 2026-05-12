'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Code2,
  Database,
  Play,
  Loader2,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-4 sm:mb-6 transform -skew-x-2">
          LIVE API DEMO
        </h2>
        <div className="w-32 sm:w-48 h-2 sm:h-3 bg-[#efa72d] mx-auto transform skew-x-12 mb-4 sm:mb-6"></div>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#edf3f1] max-w-4xl mx-auto">
          <span className="hidden sm:inline">TEST OUR APIS WITH REAL QUERIES - NO SIGNUP REQUIRED</span>
          <span className="sm:hidden">TEST LIVE - NO SIGNUP</span>
        </p>
      </div>

      <Tabs value={activeApi} onValueChange={(value) => setActiveApi(value as ApiType)} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-[#6b839a] border-2 border-[#efa72d] p-1">
          {Object.entries(apiConfigs).map(([key, config]) => {
            const Icon = config.icon
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="font-black text-[10px] sm:text-xs md:text-sm lg:text-lg data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 md:gap-2 p-1.5 sm:p-2 md:p-3"
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">{config.name}</span>
                <span className="sm:hidden">{config.name.slice(0, 5)}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(apiConfigs).map(([key, config]) => (
          <TabsContent key={key} value={key} className="mt-6 sm:mt-8">
            <Card className="bg-[#6b839a] border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="space-y-6">
                  {/* API Info Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <config.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#efa72d]" />
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#efa72d]">
                          {config.description}
                        </h3>
                        <p className="text-sm sm:text-base text-[#edf3f1] font-bold">
                          Try it live with your own queries
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#efa72d] text-[#17457c] font-black text-sm px-3 py-1 w-fit">
                      {config.credits} credits per call
                    </Badge>
                  </div>

                  {/* Query Input */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={config.placeholder}
                        className="flex-1 bg-black text-white border-2 border-gray-700 focus:border-[#efa72d] text-sm sm:text-base p-3 sm:p-4 font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && runDemo()}
                      />
                      <Button
                        onClick={runDemo}
                        disabled={isLoading || !query.trim()}
                        className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-6 py-3 sm:py-4 text-sm sm:text-base"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Try Demo
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Example Queries */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs sm:text-sm text-[#edf3f1] font-bold">Try:</span>
                      {config.examples.slice(0, 3).map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExampleClick(example)}
                          className="text-xs sm:text-sm bg-black/30 hover:bg-black/50 text-[#efa72d] px-2 py-1 rounded border border-[#efa72d]/30 hover:border-[#efa72d] transition-all font-mono"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Response Area */}
                  {(response || error) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-[#edf3f1] flex items-center gap-2">
                          {error ? (
                            <>
                              <AlertCircle className="h-5 w-5 text-red-400" />
                              Error Response
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              Demo Response
                              {response?.processing_time_ms && (
                                <Badge variant="secondary" className="ml-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {response.processing_time_ms}ms
                                </Badge>
                              )}
                            </>
                          )}
                        </h4>
                        {response && (
                          <Button
                            onClick={copyResponse}
                            variant="ghost"
                            size="sm"
                            className="text-[#efa72d] hover:bg-black/20"
                          >
                            {copied ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div className="bg-black p-4 rounded border-2 border-gray-700 max-h-96 overflow-y-auto">
                        {error ? (
                          <div className="text-red-400 font-mono text-sm">
                            {error}
                          </div>
                        ) : (
                          <>
                            <pre className="text-green-400 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
                              {JSON.stringify(formatResponseForDisplay(response), null, 2)}
                            </pre>
                            {response?.demo && (
                              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded text-blue-300 text-sm font-bold">
                                <Zap className="h-4 w-4 inline mr-2" />
                                {response.message}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Call to Action */}
                  {!response && !error && (
                    <div className="text-center py-8 text-[#edf3f1]/70">
                      <div className="text-lg font-bold mb-2">Ready to test?</div>
                      <div className="text-sm">Enter a query above and click "Try Demo" to see real API results</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>


    </div>
  )
}