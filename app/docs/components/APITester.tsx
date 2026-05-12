'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Copy, 
  Check, 
  AlertTriangle, 
  Loader2,
  Code,
  Key,
  Settings
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'

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

export function APITester({ 
  endpoint, 
  method, 
  title, 
  description, 
  parameters,
  exampleRequest = {},
  demoApiKey = "demo_sk_test_YOUR_API_KEY_API_KEY"
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
      [name]: value
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
    headers: { 'Authorization": "Bearer': '${apiKey}' }
  }
);

console.log(response.data);`

      case 'curl':
        return `curl -X ${method} ${endpoint} \\
  -H "Authorization": "Bearer: ${apiKey}" \\
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
      // Simulate API call (in real implementation, this would call the actual API)
      // For demo purposes, we'll create a mock response
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      
      const mockResponse = {
        success: true,
        data: {
          message: "This is a demo response. In production, this would call the actual API.",
          endpoint: endpoint,
          method: method,
          parameters: formData,
          timestamp: new Date().toISOString()
        },
        credits_used: Math.floor(Math.random() * 10) + 1,
        processing_time: (Math.random() * 2 + 0.5).toFixed(2)
      }
      
      setResponse(mockResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (param: typeof parameters[0]) => {
    const value = formData[param.name] || ''
    
    if (param.options) {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(param.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#efa72d]/20 focus:border-[#efa72d]"
        >
          <option value="">Select {param.name}</option>
          {param.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )
    }
    
    if (param.type === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => handleInputChange(param.name, e.target.checked)}
            className="rounded border-gray-300 focus:ring-[#efa72d]"
          />
          <Label className="text-sm">Enable {param.name}</Label>
        </div>
      )
    }
    
    if (param.type === 'array') {
      return (
        <Textarea
          value={Array.isArray(value) ? value.join(', ') : value}
          onChange={(e) => handleInputChange(param.name, e.target.value.split(',').map(s => s.trim()))}
          placeholder={`Enter ${param.name} separated by commas`}
          className="min-h-[80px]"
        />
      )
    }
    
    if (param.type === 'object') {
      return (
        <Textarea
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
          className="min-h-[100px] font-mono text-sm"
        />
      )
    }
    
    return (
      <Input
        type={param.type === 'integer' ? 'number' : 'text'}
        value={value}
        onChange={(e) => handleInputChange(param.name, param.type === 'integer' ? parseInt(e.target.value) || 0 : e.target.value)}
        placeholder={param.example || `Enter ${param.name}`}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {method}
          </Badge>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
            {endpoint}
          </code>
        </div>
        <h3 className="text-xl font-semibold text-[#17457c]">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Builder */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Settings className="w-5 h-5" />
                Request Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4" />
                  API Key
                </Label>
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Using demo key for testing. Replace with your actual API key.
                </p>
              </div>

              {/* Parameters */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Parameters</Label>
                {parameters.map(param => (
                  <div key={param.name}>
                    <Label className="text-sm mb-1 flex items-center gap-2">
                      {param.name}
                      {param.required && (
                        <Badge variant="destructive" className="text-xs px-1">
                          Required
                        </Badge>
                      )}
                    </Label>
                    {renderInput(param)}
                    <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                  </div>
                ))}
              </div>

              {/* Test Button */}
              <Button
                onClick={testAPI}
                disabled={loading}
                className="w-full bg-[#efa72d] hover:bg-[#efa72d]/90 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test API
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Code Examples & Response */}
        <div className="space-y-4">
          {/* Code Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Code className="w-5 h-5" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="python" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                
                {(['python', 'javascript', 'curl'] as const).map(lang => (
                  <TabsContent key={lang} value={lang} className="mt-4">
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generateCode(lang)}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(lang)}
                        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                      >
                        {copiedCode === lang ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* API Response */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#17457c]">API Response</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#efa72d]" />
                  <span className="ml-2 text-gray-600">Testing API...</span>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              )}
              
              {response && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      200 OK
                    </Badge>
                    <Badge variant="outline">
                      {response.processing_time}s
                    </Badge>
                    <Badge variant="outline">
                      {response.credits_used} credits
                    </Badge>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              )}
              
              {!loading && !error && !response && (
                <div className="text-center py-8 text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Click "Test API" to see the response</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}