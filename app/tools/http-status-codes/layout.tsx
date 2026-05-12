import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTTP Status Codes Reference - Complete Code List | Venym Search',
  description:
    'Complete HTTP status code reference with descriptions, common causes, troubleshooting tips, and example headers. Covers 1xx through 5xx codes. Free — no signup required.',
  openGraph: {
    title: 'HTTP Status Codes Reference - Complete Code List | Venym Search',
    description:
      'Complete HTTP status code reference with descriptions, common causes, troubleshooting tips, and example headers. Covers 1xx through 5xx codes. Free — no signup required.',
    type: 'website',
  },
}

export default function HttpStatusCodesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
