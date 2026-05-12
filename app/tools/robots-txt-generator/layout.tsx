import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'robots.txt Generator - Create & Test robots.txt Free | Venym Search',
  description:
    'Generate and test robots.txt files with a visual rule builder, presets for WordPress and Next.js, and URL allow/block testing. Free online tool — no signup required.',
  openGraph: {
    title: 'robots.txt Generator - Create & Test robots.txt Free | Venym Search',
    description:
      'Generate and test robots.txt files with a visual rule builder, presets for WordPress and Next.js, and URL allow/block testing. Free — no signup required.',
    type: 'website',
  },
}

export default function RobotsTxtGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
