import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regex Tester - Regular Expression Tester Online | Venym Search',
  description:
    'Test regular expressions online with real-time match highlighting, group capture, and flag configuration. Free regex tester — no signup required.',
  openGraph: {
    title: 'Regex Tester - Regular Expression Tester Online | Venym Search',
    description:
      'Test regular expressions online with real-time match highlighting, group capture, and flag configuration. Free — no signup required.',
    type: 'website',
  },
}

export default function RegexTesterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
