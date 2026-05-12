import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cron Expression Generator & Explainer - Free Online | Venym Search',
  description:
    'Generate and explain cron expressions with human-readable descriptions. Preview the next 10 scheduled run times. Free online cron job generator — no signup required.',
  openGraph: {
    title: 'Cron Expression Generator & Explainer - Free Online | Venym Search',
    description:
      'Generate and explain cron expressions with human-readable descriptions. Preview the next 10 scheduled run times. Free — no signup required.',
    type: 'website',
  },
}

export default function CronGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
