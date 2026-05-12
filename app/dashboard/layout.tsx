import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Venym Search API Management',
  description: 'Manage your Venym Search API keys, monitor usage, view request history, and access billing information for your web scraping services.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}