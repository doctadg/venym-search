'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, ExternalLink } from 'lucide-react'

interface CodeBlockProps {
  code?: string
  language?: string
  title?: string
  showCopy?: boolean
  multiLanguage?: {
    [key: string]: string
  }
}

export function CodeBlock({ 
  code, 
  language = 'bash', 
  title, 
  showCopy = true,
  multiLanguage 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState(language)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getLanguageLabel = (lang: string) => {
    const labels: { [key: string]: string } = {
      bash: 'cURL',
      javascript: 'JavaScript',
      python: 'Python',
      go: 'Go',
      php: 'PHP',
      json: 'JSON',
      typescript: 'TypeScript',
      jsx: 'React',
      tsx: 'React TS'
    }
    return labels[lang] || lang.toUpperCase()
  }

  if (multiLanguage) {
    return (
      <div className="relative rounded-lg border bg-gray-50 overflow-hidden">
        {title && (
          <div className="px-4 py-3 bg-gray-100 border-b flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          </div>
        )}
        
        <Tabs value={activeLanguage} onValueChange={setActiveLanguage} className="w-full">
          <div className="flex items-center justify-between border-b bg-white">
            <TabsList className="h-auto p-1 bg-transparent">
              {Object.keys(multiLanguage).map((lang) => (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  className="text-xs px-3 py-2 data-[state=active]:bg-[#efa72d]/10 data-[state=active]:text-[#efa72d]"
                >
                  {getLanguageLabel(lang)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {showCopy && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 mr-2"
                onClick={() => copyToClipboard(multiLanguage[activeLanguage])}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>

          {Object.entries(multiLanguage).map(([lang, codeContent]) => (
            <TabsContent key={lang} value={lang} className="m-0">
              <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-gray-100">
                <code className={`language-${lang}`}>{codeContent}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg border bg-gray-50 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-gray-100 border-b flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <Badge variant="outline" className="text-xs">
            {getLanguageLabel(language)}
          </Badge>
        </div>
      )}
      
      <div className="relative">
        <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-gray-100">
          <code className={`language-${language}`}>{code || ''}</code>
        </pre>
        
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            onClick={() => copyToClipboard(code || '')}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-2 py-1 text-sm bg-gray-100 text-[#17457c] rounded-md font-mono">
      {children}
    </code>
  )
}