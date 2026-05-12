import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Venym Search Blog — AI-Powered Web Scraping & Search Insights',
  alternates: {
    types: {
      'application/rss+xml': 'https://search.venym.io/feed.xml',
    },
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
