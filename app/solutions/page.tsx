import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { solutions } from '@/lib/solutions-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integrations - Venym Search',
  description: 'Integrate Venym Search with LangChain, CrewAI, n8n, Zapier, OpenAI, and more. Connect web data to your favorite tools.',
  openGraph: {
    title: 'Venym Search Integrations',
    description: 'Connect Venym Search to your favorite AI and automation tools.',
  }
}

const iconMap: Record<string, string> = {
  'Link2': '🔗', 'Users': '👥', 'MessageSquare': '💬', 'Workflow': '⚡',
  'Zap': '⚡', 'GitMerge': '🔀', 'Sparkles': '✨', 'Brain': '🧠',
  'Cable': '🔌', 'Triangle': '▲'
}

export default function SolutionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Venym Search Integrations',
    description: metadata.description,
    url: 'https://VENYM_SEARCH.io/solutions',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: solutions.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.title,
        url: `https://VENYM_SEARCH.io/solutions/${s.slug}`
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
              <Badge variant="secondary" className="mb-4">Integrations</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Connect to Your <span className="text-primary/80">Stack</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Venym Search integrates with the tools you already use — AI frameworks, automation platforms, and LLM providers.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
                  <CardHeader>
                    <div className="text-3xl mb-2">{iconMap[s.icon] || '🔌'}</div>
                    <CardTitle className="text-xl">{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {s.features.slice(0, 3).map((f) => (
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
            <h2 className="text-3xl font-bold">Don't see your tool?</h2>
            <p className="mt-4 text-muted-foreground">Venym Search works with any HTTP client. Check our REST API docs.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild><Link href="/docs">API Documentation</Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/pricing">View Pricing</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
