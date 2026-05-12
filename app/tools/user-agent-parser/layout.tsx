import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Agent Parser - Parse UA String Online Free | Venym Search',
  description:
    'Parse any User-Agent string to extract browser, OS, device type, and engine info. Detects bots, mobile devices, and more. Free UA parser — no signup required.',
  openGraph: {
    title: 'User Agent Parser - Parse UA String Online Free | Venym Search',
    description:
      'Parse any User-Agent string to extract browser, OS, device type, and engine info. Detects bots, mobile devices, and more. Free — no signup required.',
    type: 'website',
  },
}

export default function UserAgentParserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
