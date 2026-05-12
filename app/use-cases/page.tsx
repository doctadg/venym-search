import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCases } from '@/lib/usecase-data'
import type { Metadata } from 'next'


export const metadata: Metadata = {

  title: 'Use Cases - Venym Search',
  description: 'Discover how teams use Venym Search APIs for web scraping, market research, AI agents, and more.',
  openGraph: {
    title: 'Venym Search Use Cases',
    description: 'Enterprise web scraping and search APIs for every industry.',
  }
}

const iconMap: Record<string, string> = {
  'Bot': '🤖', 'Globe': '🌐', 'TrendingUp': '📈', 'DollarSign': '💰',
  'Newspaper': '📰', 'Search': '🔍', 'Building2': '🏠', 'BarChart3': '📊',
  'Bell': '🔔', 'MessageSquare': '💬', 'Users': '👥', 'BookOpen': '📚'
}

export default function UseCasesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Venym Search Use Cases',
    description: metadata.description,
    url: 'https://VENYM_SEARCH.io/use-cases',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: useCases.map((uc, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: uc.title,
        url: `https://VENYM_SEARCH.io/use-cases/${uc.slug}`
      }))
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container relative py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">Use Cases</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Built for Every <span className="text-primary/80">Data Need</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                From AI agents to market research, see how teams use Venym Search to extract, analyze, and act on web data at scale.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <Link key={uc.slug} href={`/use-cases/${uc.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
                  <CardHeader>
                    <div className="text-3xl mb-2">{iconMap[uc.icon] || '📋'}</div>
                    <CardTitle className="text-xl">{uc.title}</CardTitle>
                    <CardDescription>{uc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {uc.features.slice(0, 3).map((f) => (
                        <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="container py-16 text-center">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-4 text-muted-foreground">Start scraping in minutes with our free tier.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">Read Docs</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


