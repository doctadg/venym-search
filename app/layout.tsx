import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/react'

export const metadata: Metadata = {
  title: {
    default: 'Venym Search - Enterprise Web Scraping APIs',
    template: '%s | Venym Search'
  },
  authors: [{ name: 'Venym Search' }],
  creator: 'Venym Search',
  publisher: 'Venym Search',
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
    title: 'Venym Search - Enterprise Web Scraping APIs',
    description: 'Enterprise web scraping APIs for modern developers. Search, scrape, and research the web with AI-powered tools.',
    url: 'https://search.venym.io',
    siteName: 'Venym Search',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Venym Search - Enterprise Web Scraping APIs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venym Search - Enterprise Web Scraping APIs',
    description: 'Enterprise web scraping APIs for modern developers. Search, scrape, and research the web with AI-powered tools.',
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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#17457c' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const clerkProviderElement = await ClerkProvider({ children })

  return (
    <html lang="en">
      <body>
        {clerkProviderElement}
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Venym Search",
                url: "https://search.venym.io",
                logo: "https://search.venym.io/logo.png",
                description: "Enterprise web scraping APIs for modern developers. Search, scrape, and research the web with AI-powered tools.",
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Venym Search",
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
