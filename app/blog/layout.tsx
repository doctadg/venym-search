import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Venym Search Blog — AI-Powered Web Scraping & Search Insights',
  description: 'Real-time insights on web scraping, search APIs, and AI data extraction. Comparison guides, tutorials, and technical deep dives — powered by Venym Search.',
  alternates: {
    types: {
      'application/rss+xml': 'https://search.venym.io/feed.xml',
    },
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
