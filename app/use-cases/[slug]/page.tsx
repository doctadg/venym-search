import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCases } from '@/lib/usecase-data'
import type { Metadata } from 'next'


interface PageProps {

  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const uc = useCases.find((u) => u.slug === slug)
  if (!uc) return {}
  return {
    title: uc.title,
    description: uc.description,
    openGraph: { title: uc.title, description: uc.description, url: `https://VENYM_SEARCH.io/use-cases/${uc.slug}` }
  }
}

const iconMap: Record<string, string> = {
  'Bot': '🤖', 'Globe': '🌐', 'TrendingUp': '📈', 'DollarSign': '💰',
  'Newspaper': '📰', 'Search': '🔍', 'Building2': '🏠', 'BarChart3': '📊',
  'Bell': '🔔', 'MessageSquare': '💬', 'Users': '👥', 'BookOpen': '📚'
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params
  const uc = useCases.find((u) => u.slug === slug)
  if (!uc) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: uc.title,
    description: uc.description,
    url: `https://VENYM_SEARCH.io/use-cases/${uc.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://VENYM_SEARCH.io' },
        { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://VENYM_SEARCH.io/use-cases' },
        { '@type': 'ListItem', position: 3, name: uc.title, item: `https://VENYM_SEARCH.io/use-cases/${uc.slug}` }
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
              <Link href="/use-cases" className="hover:text-foreground">Use Cases</Link>
              <span>/</span>
              <span className="text-foreground">{uc.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container relative py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
              <Badge variant="secondary" className="mb-4">Use Case</Badge>
              <div className="text-5xl mb-4">{iconMap[uc.icon] || '📋'}</div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{uc.title}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{uc.description}</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uc.features.map((feature) => (
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
            <h2 className="text-2xl font-bold mb-8">Get Started in Minutes</h2>
            <div className="mx-auto max-w-3xl">
              <pre className="overflow-x-auto rounded-lg border bg-card p-6 text-sm">
                <code>{uc.codeExample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold mb-8">Why Teams Choose Venym Search</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uc.benefits.map((benefit) => (
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
            <h2 className="text-3xl font-bold">Start building today</h2>
            <p className="mt-4 text-muted-foreground">Get 1,000 free API calls per month.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild><Link href="/pricing">Get Started Free</Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/docs">Read Documentation</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


