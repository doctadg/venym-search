import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { solutions } from '@/lib/solutions-data'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const s = solutions.find((x) => x.slug === slug)
  if (!s) return {}
  return {
    title: s.title,
    description: s.description,
    openGraph: { title: s.title, description: s.description, url: `https://VENYM_SEARCH.io/solutions/${s.slug}` }
  }
}

const iconMap: Record<string, string> = {
  'Link2': '🔗', 'Users': '👥', 'MessageSquare': '💬', 'Workflow': '⚡',
  'Zap': '⚡', 'GitMerge': '🔀', 'Sparkles': '✨', 'Brain': '🧠',
  'Cable': '🔌', 'Triangle': '▲'
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params
  const s = solutions.find((x) => x.slug === slug)
  if (!s) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: s.title,
    description: s.description,
    url: `https://VENYM_SEARCH.io/solutions/${s.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://VENYM_SEARCH.io' },
        { '@type': 'ListItem', position: 2, name: 'Integrations', item: 'https://VENYM_SEARCH.io/solutions' },
        { '@type': 'ListItem', position: 3, name: s.title, item: `https://VENYM_SEARCH.io/solutions/${s.slug}` }
      ]
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="container py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/solutions" className="hover:text-foreground">Integrations</Link>
              <span>/</span>
              <span className="text-foreground">{s.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container relative py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
              <Badge variant="secondary" className="mb-4">Integration</Badge>
              <div className="text-5xl mb-4">{iconMap[s.icon] || '🔌'}</div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{s.title}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{s.description}</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold mb-8">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.features.map((feature) => (
              <Card key={feature}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-primary">✓</span> {feature}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="border-t bg-muted/30">
          <div className="container py-16">
            <h2 className="text-2xl font-bold mb-8">Quick Start</h2>
            <div className="mx-auto max-w-3xl">
              <pre className="overflow-x-auto rounded-lg border bg-card p-6 text-sm">
                <code>{s.codeExample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold mb-8">Benefits</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.benefits.map((benefit) => (
              <Card key={benefit}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-primary text-lg">→</span>
                    <span>{benefit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30">
          <div className="container py-16 text-center">
            <h2 className="text-3xl font-bold">Start integrating today</h2>
            <p className="mt-4 text-muted-foreground">Free tier includes 1,000 API calls/month.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild><Link href="/pricing">Get API Key</Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/docs">API Docs</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
