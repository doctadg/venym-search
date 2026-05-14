'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check } from 'lucide-react'

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
  multiLanguage,
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
      tsx: 'React TS',
    }
    return labels[lang] || lang.toUpperCase()
  }

  if (multiLanguage) {
    return (
      <div className="relative border border-white/[0.06] bg-[#080808] rounded-sm overflow-hidden my-6">
        {title && (
          <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">{title}</span>
          </div>
        )}

        <Tabs value={activeLanguage} onValueChange={setActiveLanguage} className="w-full">
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02]">
            <TabsList className="h-auto p-0 bg-transparent rounded-none gap-0">
              {Object.keys(multiLanguage).map((lang) => (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  className="text-[10px] font-mono uppercase tracking-[0.15em] px-4 py-2.5 rounded-none border-b-2 border-transparent text-white/40 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-white shadow-none"
                >
                  {getLanguageLabel(lang)}
                </TabsTrigger>
              ))}
            </TabsList>

            {showCopy && (
              <button
                onClick={() => copyToClipboard(multiLanguage[activeLanguage])}
                className="inline-flex items-center justify-center w-8 h-8 mr-2 text-white/40 hover:text-white transition-colors"
                aria-label="Copy code"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400/80" /> : <Copy className="h-3 w-3" />}
              </button>
            )}
          </div>

          {Object.entries(multiLanguage).map(([lang, codeContent]) => (
            <TabsContent key={lang} value={lang} className="m-0">
              <pre className="p-4 text-[12.5px] leading-relaxed overflow-x-auto bg-[#050505] text-white/80 font-mono">
                <code className={`language-${lang}`}>{codeContent}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }

  return (
    <div className="relative border border-white/[0.06] bg-[#080808] rounded-sm overflow-hidden my-6">
      {title && (
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">{title}</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            {getLanguageLabel(language)}
          </span>
        </div>
      )}

      <div className="relative">
        <pre className="p-4 text-[12.5px] leading-relaxed overflow-x-auto bg-[#050505] text-white/80 font-mono">
          <code className={`language-${language}`}>{code || ''}</code>
        </pre>

        {showCopy && (
          <button
            onClick={() => copyToClipboard(code || '')}
            className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 rounded-sm transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400/80" /> : <Copy className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  )
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">
      {children}
    </code>
  )
}
