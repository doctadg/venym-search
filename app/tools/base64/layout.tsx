import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - Free Online Tool | Venym Search',
  description:
    'Encode and decode Base64 in standard or URL-safe variants. Convert text to Base64 and back instantly. Free online Base64 tool — no signup required.',
  openGraph: {
    title: 'Base64 Encoder & Decoder - Free Online Tool | Venym Search',
    description:
      'Encode and decode Base64 in standard or URL-safe variants. Convert text to Base64 and back instantly. Free — no signup required.',
    type: 'website',
  },
}

export default function Base64Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
