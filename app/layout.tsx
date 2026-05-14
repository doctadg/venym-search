import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/react'

export const metadata: Metadata = {
  title: {
    default: 'Venym — Web Search & Scrape API for AI Agents',
    template: '%s | Venym'
  },
  description: 'Web search and scrape API built for AI agents. One endpoint, eight engines, JS-rendered, anti-bot, citation-ready. Drop into LangChain, MCP, OpenAI tool-calls.',
  keywords: ['ai agent search api', 'web scraping api for ai', 'llm web search', 'langchain search tool', 'mcp scraping server', 'agent web access', 'serp api', 'browser scraping api'],
  authors: [{ name: 'Venym Labs' }],
  creator: 'Venym Labs',
  publisher: 'Venym Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://search.venym.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Venym — Web Search & Scrape API for AI Agents',
    description: 'One endpoint. Eight engines. JS-rendered scrape. Built so AI agents can read the open web.',
    url: 'https://search.venym.io',
    siteName: 'Venym',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Venym — Web Search & Scrape API for AI Agents',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venym — Web Search & Scrape API for AI Agents',
    description: 'One endpoint. Eight engines. JS-rendered scrape. Built so AI agents can read the open web.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider dynamic>
          {children}
          <Toaster />
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Venym",
                url: "https://search.venym.io",
                logo: "https://search.venym.io/logo.png",
                description: "Web search and scrape API built for AI agents. One endpoint, eight engines, JS-rendered, citation-ready.",
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Venym",
                url: "https://search.venym.io",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://search.venym.io/docs/api/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </body>
    </html>
  )
}
