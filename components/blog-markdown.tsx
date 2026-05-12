'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'
import Link from 'next/link'

/**
 * Tool keyword mappings for automatic internal linking.
 * Processed in order — more specific patterns first to avoid partial conflicts
 * (e.g. "JSON Web Token" before standalone "JSON").
 */
const TOOL_LINK_MAPPINGS: Array<{ pattern: RegExp; href: string; linkText: string }> = [
  // Order matters: longer/more-specific patterns before shorter ones
  { pattern: /\b(JSON Web Token|JWT)\b/i, href: '/tools/jwt-decode', linkText: 'JWT decoder' },
  { pattern: /\b(universally unique identifier)\b/i, href: '/tools/uuid-generator', linkText: 'UUID generator' },
  { pattern: /\b(percent\s+encod\w+)\b/i, href: '/tools/url-encoder', linkText: 'URL encoder' },
  { pattern: /\b(URL\s+encod\w+)\b/i, href: '/tools/url-encoder', linkText: 'URL encoder' },
  { pattern: /\b(regular expression|regex)\b/i, href: '/tools/regex-tester', linkText: 'regex tester' },
  { pattern: /\b(HTTP status)\b/i, href: '/tools/http-status-codes', linkText: 'HTTP status codes reference' },
  { pattern: /\b(status code)\b/i, href: '/tools/http-status-codes', linkText: 'HTTP status codes reference' },
  { pattern: /robots\.txt/i, href: '/tools/robots-txt-generator', linkText: 'robots.txt generator' },
  { pattern: /\buser[\s-]agent\b/i, href: '/tools/user-agent-parser', linkText: 'user agent parser' },
  { pattern: /\bcron(\s+job)?\b/i, href: '/tools/cron-generator', linkText: 'cron expression generator' },
  { pattern: /\bJSON\b/, href: '/tools/json-formatter', linkText: 'free JSON formatter' },
  { pattern: /\bBase64\b/i, href: '/tools/base64', linkText: 'Base64 encoder' },
  { pattern: /\bUUID\b/i, href: '/tools/uuid-generator', linkText: 'UUID generator' },
]

/**
 * Injects contextual internal tool links into markdown content.
 *
 * Rules:
 *  - Only links the FIRST occurrence of each tool's keywords per post
 *  - Skips code blocks (```), inline code (`), existing markdown links, headings, and HTML tags
 *  - Each injected link is itself protected from further matching
 *  - Case-insensitive matching; uses the specified linkText as anchor
 */
function injectToolLinks(markdown: string): string {
  const tokens: string[] = []

  function protect(match: string): string {
    const placeholder = `\x00TL${tokens.length}\x00`
    tokens.push(match)
    return placeholder
  }

  let text = markdown

  // 1. Protect fenced code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, (m) => protect(m))

  // 2. Protect inline code (`...`) — \x00 placeholders from step 1 won't contain backticks
  text = text.replace(/`[^`\n]+`/g, (m) => protect(m))

  // 3. Protect existing markdown links [text](url)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, (m) => protect(m))

  // 4. Protect headings (lines starting with #)
  text = text.replace(/^#{1,6}\s.+$/gm, (m) => protect(m))

  // 5. Protect HTML tags
  text = text.replace(/<[^>]+>/g, (m) => protect(m))

  // 6. Inject tool links — only first match per tool
  for (const mapping of TOOL_LINK_MAPPINGS) {
    const match = mapping.pattern.exec(text)
    if (match) {
      const linkMarkdown = `[${mapping.linkText}](${mapping.href})`
      // Protect the injected link so it can't be matched by subsequent patterns
      const token = protect(linkMarkdown)
      text = text.replace(match[0], token)
    }
  }

  // Restore all tokens in reverse order (handles nested protections correctly)
  for (let i = tokens.length - 1; i >= 0; i--) {
    text = text.split(`\x00TL${i}\x00`).join(tokens[i])
  }

  return text
}

export default function BlogMarkdown({ content }: { content: string }) {
  // Convert [Internal: /path] placeholders to proper markdown links
  const processedContent = content.replace(
    /\[Internal:\s*([^\]]+)\]/g,
    (_, path) => `[${path}](${path.trim()})`
  )

  // Inject contextual tool links
  const linkedContent = injectToolLinks(processedContent)

  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-4xl font-black text-[#edf3f1] mb-8 mt-12">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-black text-[#edf3f1] mb-6 mt-10">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-black text-[#efa72d] mb-4 mt-8">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-[#efa72d] mb-3 mt-6">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="text-[#edf3f1]/90 mb-6 leading-relaxed text-[17px]">{children}</p>
    ),
    a: ({ href, children }) => {
      if (!href) return <span className="text-[#efa72d] font-medium">{children}</span>
      const isInternal = href.startsWith('/')
      if (isInternal) {
        return <Link href={href} className="text-[#efa72d] hover:text-[#edf3f1] underline underline-offset-2 transition-colors font-medium">{children}</Link>
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#efa72d] hover:text-[#edf3f1] underline underline-offset-2 transition-colors font-medium">
          {children}
        </a>
      )
    },
    strong: ({ children }) => (
      <strong className="font-bold text-[#efa72d]">{children}</strong>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-[#edf3f1]/90 mb-6 ml-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-[#edf3f1]/90 mb-6 ml-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-[#edf3f1]/90 leading-relaxed">{children}</li>
    ),
    hr: () => (
      <hr className="border-[#efa72d]/30 my-8" />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#efa72d]/50 bg-[#efa72d]/5 pl-6 pr-4 py-4 my-6 italic text-[#edf3f1]/80">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-8">
        <table className="w-full border-collapse border border-[#efa72d]/30">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-[#efa72d]/10">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left p-3 border border-[#efa72d]/20 text-[#edf3f1] font-bold text-sm">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="p-3 border border-[#efa72d]/10 text-[#edf3f1]/80 text-sm">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-[#efa72d]/5 transition-colors">{children}</tr>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className
      if (isInline) {
        return (
          <code className="bg-[#6b839a]/30 text-[#efa72d] px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        )
      }
      return (
        <code className={`${className} text-sm font-mono`} {...props}>
          {children}
        </code>
      )
    },
    pre: ({ children }) => (
      <pre className="bg-[#0d1117] border border-[#6b839a]/30 rounded-lg p-4 overflow-x-auto my-6">
        {children}
      </pre>
    ),
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {linkedContent}
    </ReactMarkdown>
  )
}
