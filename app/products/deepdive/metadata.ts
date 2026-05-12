import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DeepDive API - AI-Powered Research Automation | Venym Search',
  description: 'Automate comprehensive research with AI. Search multiple sources, analyze content, extract insights, and generate summaries. Perfect for market research, due diligence, and competitive analysis.',
  keywords: ['research automation', 'ai research', 'market research api', 'competitive analysis', 'content analysis', 'research summaries', 'ai insights'],
  openGraph: {
    title: 'DeepDive API - AI Research Automation',
    description: 'Automate research workflows with AI. Multi-source analysis, intelligent summaries, and actionable insights in minutes.',
    url: 'https://search.venym.io/products/deepdive',
    siteName: 'Venym Search',
    images: [
      {
        url: 'https://search.venym.io/og-deepdive.png',
        width: 1200,
        height: 630,
        alt: 'DeepDive API Product'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepDive API - AI Research Automation',
    description: 'Automate research workflows with AI. Multi-source analysis, intelligent summaries, and actionable insights in minutes.',
    images: ['https://search.venym.io/og-deepdive.png']
  },
  alternates: {
    canonical: 'https://search.venym.io/products/deepdive'
  }
}

// JSON-LD structured data
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DeepDive API",
  "description": "AI-powered research automation API for comprehensive market research and competitive analysis",
  "url": "https://search.venym.io/products/deepdive",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "249",
    "priceCurrency": "USD",
    "name": "Builder Pack"
  },
  "provider": {
    "@type": "Organization",
    "name": "Venym Search",
    "url": "https://search.venym.io"
  },
  "featureList": [
    "Multi-source research automation",
    "AI content analysis",
    "Intelligent summaries",
    "Competitive intelligence",
    "Market trend analysis"
  ]
}