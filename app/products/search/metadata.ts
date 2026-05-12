import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search API - Real-time Search + Auto-Scraping | Venym Search',
  description: 'Combine Google search with automatic web scraping in one API call. Extract contacts, social profiles, and full content from search results instantly. 10x faster than building your own.',
  keywords: ['search api', 'web scraping', 'google search api', 'contact extraction', 'lead generation', 'data extraction', 'search automation'],
  openGraph: {
    title: 'Search API - Search + Scrape in One Call',
    description: 'Get search results AND full page content automatically. Extract contacts and social profiles from every result.',
    url: 'https://search.venym.io/products/search',
    siteName: 'Venym Search',
    images: [
      {
        url: 'https://search.venym.io/og-search.png',
        width: 1200,
        height: 630,
        alt: 'Search API Product'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search API - Search + Scrape in One Call',
    description: 'Get search results AND full page content automatically. Extract contacts and social profiles from every result.',
    images: ['https://search.venym.io/og-search.png']
  },
  alternates: {
    canonical: 'https://search.venym.io/products/search'
  }
}

// JSON-LD structured data
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Search API",
  "description": "Real-time search API with automatic web scraping and contact extraction",
  "url": "https://search.venym.io/products/search",
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
    "Real-time Google search",
    "Automatic web scraping",
    "Contact extraction",
    "Social profile discovery",
    "JSON API responses"
  ]
}