import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Decoder - Decode JWT Token Online Free | Venym Search',
  description:
    'Decode JWT tokens instantly to inspect header, payload, and signature. Check expiration status and view all claims. Free online JWT decoder — no signup required.',
  openGraph: {
    title: 'JWT Decoder - Decode JWT Token Online Free | Venym Search',
    description:
      'Decode JWT tokens instantly to inspect header, payload, and signature. Check expiration status and view all claims. Free — no signup required.',
    type: 'website',
  },
}

export default function JwtDecodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
