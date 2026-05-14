import Link from 'next/link'
import { useCases } from '@/lib/usecase-data'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Use Cases — What AI Agents Build with Venym',
  description: 'See what teams ship with Venym: agent research loops, market intel, RAG ingest, lead enrichment, price monitoring, news synthesis — anything an agent needs the web for.',
  openGraph: {
    title: 'Venym — Use Cases for AI Agents',
    description: 'Agent research, RAG ingest, market intel, lead enrichment, price monitoring.',
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
      <div className="min-h-screen bg-background text-white">
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">
                What Agents Build // 05
              </span>
            </div>
            <h1 className="text-4xl md:text-[6rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
              The open web, <br />
              <span className="text-gray-700 italic font-light">on agent rails.</span>
            </h1>
            <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed">
              Research loops. RAG ingest. Market intel. Lead enrichment. Price monitoring.
              News synthesis. Anything your agent needs the live web for.
            </p>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="grid gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <Link key={uc.slug} href={`/use-cases/${uc.slug}`} className="group block">
                <div className="h-full flex flex-col border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 p-6 md:p-7">
                  <div className="text-2xl mb-4">{iconMap[uc.icon] || '📋'}</div>
                  <h3 className="text-lg md:text-xl font-display font-medium text-white tracking-tight mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-sm font-sans font-light text-gray-400 leading-relaxed mb-5 flex-1">
                    {uc.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                    {uc.features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] px-2 py-1 border border-white/5 bg-white/[0.02]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-background">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-[0.85] tracking-tighter mb-6">
              Ship your agent <span className="text-gray-700 italic font-light">today.</span>
            </h2>
            <p className="text-gray-400 font-sans font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              100 free credits on signup. No card. Wire Venym into your agent loop in 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white text-black text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors"
              >
                [ VIEW PRICING ]
              </Link>
              <Link
                href="/docs"
                className="px-8 py-4 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                [ READ THE DOCS ]
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


