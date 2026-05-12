'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface CopyMarkdownButtonProps {
  title?: string
}

export function CopyMarkdownButton({ title }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const generateMarkdown = async () => {
    try {
      // Extract the main content from the page
      const mainContent = document.querySelector('main')
      if (!mainContent) return ''

      // Get the page title
      const pageTitle = title || document.title.split(' | ')[0]
      
      // Start with the title
      let markdown = `# ${pageTitle}\n\n`
      
      // Add the URL for reference
      markdown += `**Documentation URL:** https://www.search.venym.io${pathname}\n\n`
      
      // Extract text content and convert to markdown
      const extractContent = (element: Element): string => {
        let content = ''
        
        for (const child of element.children) {
          const tagName = child.tagName.toLowerCase()
          const textContent = child.textContent?.trim() || ''
          
          if (!textContent) continue
          
          switch (tagName) {
            case 'h1':
              content += `# ${textContent}\n\n`
              break
            case 'h2':
              content += `## ${textContent}\n\n`
              break
            case 'h3':
              content += `### ${textContent}\n\n`
              break
            case 'h4':
              content += `#### ${textContent}\n\n`
              break
            case 'p':
              content += `${textContent}\n\n`
              break
            case 'pre':
              // Handle code blocks
              const codeContent = child.querySelector('code')?.textContent || textContent
              const language = child.className.includes('language-') 
                ? child.className.match(/language-(\w+)/)?.[1] || ''
                : ''
              content += `\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`
              break
            case 'code':
              if (child.parentElement?.tagName.toLowerCase() !== 'pre') {
                content += `\`${textContent}\``
              }
              break
            case 'ul':
            case 'ol':
              // Handle lists
              const listItems = child.querySelectorAll('li')
              listItems.forEach((li, index) => {
                const bullet = tagName === 'ul' ? '-' : `${index + 1}.`
                content += `${bullet} ${li.textContent?.trim()}\n`
              })
              content += '\n'
              break
            case 'table':
              // Handle tables
              const rows = child.querySelectorAll('tr')
              rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('th, td')
                const cellTexts = Array.from(cells).map(cell => cell.textContent?.trim() || '')
                content += `| ${cellTexts.join(' | ')} |\n`
                
                // Add header separator for first row
                if (rowIndex === 0 && row.querySelectorAll('th').length > 0) {
                  const separator = Array(cells.length).fill('---').join(' | ')
                  content += `| ${separator} |\n`
                }
              })
              content += '\n'
              break
            case 'blockquote':
              const lines = textContent.split('\n')
              lines.forEach(line => {
                if (line.trim()) content += `> ${line.trim()}\n`
              })
              content += '\n'
              break
            default:
              // For other elements, extract content recursively
              if (child.children.length > 0) {
                content += extractContent(child)
              } else if (textContent) {
                content += `${textContent}\n\n`
              }
          }
        }
        
        return content
      }
      
      // Extract content from the main element
      markdown += extractContent(mainContent)
      
      // Add footer
      markdown += `---\n\n*This documentation was copied from Venym Search API Docs*\n*Visit https://www.search.venym.io/docs for the latest version*`
      
      return markdown
    } catch (error) {
      console.error('Error generating markdown:', error)
      return 'Error generating markdown content'
    }
  }

  const copyToClipboard = async () => {
    try {
      const markdown = await generateMarkdown()
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy markdown:', error)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyToClipboard}
      className="gap-2 text-gray-600 hover:text-[#17457c] border-gray-200 hover:border-[#17457c]"
      title="Copy page as Markdown for LLM use"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>Copy as MD</span>
        </>
      )}
    </Button>
  )
}