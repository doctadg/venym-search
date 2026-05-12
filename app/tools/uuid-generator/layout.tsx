import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UUID Generator - Generate UUID v4 & v7 Free Online | Venym Search',
  description:
    'Generate UUID v4 (random) and UUID v7 (time-ordered) identifiers in bulk up to 100. Free online UUID generator — no signup required.',
  openGraph: {
    title: 'UUID Generator - Generate UUID v4 & v7 Free Online | Venym Search',
    description:
      'Generate UUID v4 (random) and UUID v7 (time-ordered) identifiers in bulk up to 100. Free — no signup required.',
    type: 'website',
  },
}

export default function UuidGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
