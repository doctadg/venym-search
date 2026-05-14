import Link from 'next/link'
import { solutions } from '@/lib/solutions-data'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Agent Integrations — LangChain, MCP, OpenAI, n8n',
  description: 'Drop Venym into your agent stack. First-class tools for LangChain, LlamaIndex, MCP, OpenAI tool-calls, plus native nodes for n8n, Zapier, Make, Pipedream.',
  openGraph: {
    title: 'Venym — Agent Integrations',
    description: 'Drop web search and scrape into LangChain, MCP, OpenAI tool-calls, n8n, Zapier, Make.',
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
      <div className="min-h-screen bg-background text-white">
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">
                Agent Integrations // 04
              </span>
            </div>
            <h1 className="text-4xl md:text-[6rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
              Plugs into <br />
              <span className="text-gray-700 italic font-light">every agent stack.</span>
            </h1>
            <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed">
              Drop Venym into LangChain, MCP, OpenAI tool-calls, LlamaIndex.
              Wire it through n8n, Zapier, Make, Pipedream. The endpoints look
              like any HTTP API — because they are.
            </p>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="grid gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="group block">
                <div className="h-full flex flex-col border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 p-6 md:p-7">
                  <div className="text-2xl mb-4">{iconMap[s.icon] || '🔌'}</div>
                  <h3 className="text-lg md:text-xl font-display font-medium text-white tracking-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm font-sans font-light text-gray-400 leading-relaxed mb-5 flex-1">
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                    {s.features.slice(0, 3).map((f) => (
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
              Don't see your stack?
            </h2>
            <p className="text-gray-400 font-sans font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Venym is a plain HTTP API. If your agent can fetch, it can read the web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs"
                className="px-8 py-4 bg-white text-black text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-colors"
              >
                [ READ THE DOCS ]
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                [ VIEW PRICING ]
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


