import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scrape API - Advanced Web Scraping with Link Following | Venym Search',
  description: 'Professional web scraping API that follows internal links, bypasses anti-bot protection, and extracts structured data at scale. Built for enterprise applications.',
  keywords: ['web scraping api', 'data extraction', 'link following', 'anti-bot protection', 'structured data', 'enterprise scraping', 'website crawler'],
  openGraph: {
    title: 'Scrape API - Enterprise Web Scraping',
    description: 'Advanced web scraping with intelligent link following and anti-bot protection. Extract data from any website at scale.',
    url: 'https://search.venym.io/products/scrape',
    siteName: 'Venym Search',
    images: [
      {
        url: 'https://search.venym.io/og-scrape.png',
        width: 1200,
        height: 630,
        alt: 'Scrape API Product'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scrape API - Enterprise Web Scraping',
    description: 'Advanced web scraping with intelligent link following and anti-bot protection. Extract data from any website at scale.',
    images: ['https://search.venym.io/og-scrape.png']
  },
  alternates: {
    canonical: 'https://search.venym.io/products/scrape'
  }
}

// JSON-LD structured data
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Scrape API",
  "description": "Advanced web scraping API with link following and anti-bot protection",
  "url": "https://search.venym.io/products/scrape",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "USD",
    "name": "Starter Pack"
  },
  "provider": {
    "@type": "Organization",
    "name": "Venym Search",
    "url": "https://search.venym.io"
  },
  "featureList": [
    "Advanced web scraping",
    "Link following",
    "Anti-bot protection",
    "Structured data extraction",
    "Enterprise scale"
  ]
}