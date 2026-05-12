import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Free Online Tool | Venym Search',
  description:
    'Format, validate, and beautify JSON instantly. Auto-fix trailing commas, sort keys, and analyze nesting depth. Free online JSON formatter and validator — no signup required.',
  openGraph: {
    title: 'JSON Formatter & Validator - Free Online Tool | Venym Search',
    description:
      'Format, validate, and beautify JSON instantly. Auto-fix trailing commas, sort keys, and analyze nesting depth. Free — no signup required.',
    type: 'website',
  },
}

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
