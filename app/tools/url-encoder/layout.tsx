import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Encoder & Decoder - Free Online Tool | Venym Search',
  description:
    'Encode and decode URLs with percent encoding. Full character breakdown for every encoded component. Free online URL encoder/decoder — no signup required.',
  openGraph: {
    title: 'URL Encoder & Decoder - Free Online Tool | Venym Search',
    description:
      'Encode and decode URLs with percent encoding. Full character breakdown for every encoded component. Free — no signup required.',
    type: 'website',
  },
}

export default function UrlEncoderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
