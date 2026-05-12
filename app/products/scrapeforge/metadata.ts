import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ScrapeForge API - Advanced Web Scraping with Link Following | Venym Search',
  description: 'Professional web scraping API that follows internal links, bypasses anti-bot protection, and extracts structured data at scale. Built for enterprise applications.',
  keywords: ['web scraping api', 'data extraction', 'link following', 'anti-bot protection', 'structured data', 'enterprise scraping', 'website crawler'],
  openGraph: {
    title: 'ScrapeForge API - Enterprise Web Scraping',
    description: 'Advanced web scraping with intelligent link following and anti-bot protection. Extract data from any website at scale.',
    url: 'https://search.venym.io/products/scrapeforge',
    siteName: 'Venym Search',
    images: [
      {
        url: 'https://search.venym.io/og-scrapeforge.png',
        width: 1200,
        height: 630,
        alt: 'ScrapeForge API Product'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScrapeForge API - Enterprise Web Scraping',
    description: 'Advanced web scraping with intelligent link following and anti-bot protection. Extract data from any website at scale.',
    images: ['https://search.venym.io/og-scrapeforge.png']
  },
  alternates: {
    canonical: 'https://search.venym.io/products/scrapeforge'
  }
}

// JSON-LD structured data
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ScrapeForge API",
  "description": "Advanced web scraping API with link following and anti-bot protection",
  "url": "https://search.venym.io/products/scrapeforge",
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