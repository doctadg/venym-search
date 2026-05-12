import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTutorial, getTutorialSlugs, tutorials } from '@/lib/tutorial-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const difficultyColor = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
}

export async function generateStaticParams() {
  return getTutorialSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tutorial = getTutorial(slug)
  if (!tutorial) return {}
  return {
    title: `How to ${tutorial.title} — Venym Search Tutorial`,
    description: tutorial.description,
    openGraph: {
      title: `How to ${tutorial.title} — Venym Search Tutorial`,
      description: tutorial.description,
      type: 'article'
    }
  }
}

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tutorial = getTutorial(slug)
  if (!tutorial) notFound()

  const related = tutorials.filter(t => t.category === tutorial.category && t.slug !== tutorial.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: tutorial.title,
    description: tutorial.description,
    totalTime: `PT${tutorial.readingTime}M`,
    step: tutorial.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.content
    }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-8 text-sm text-gray-400">
          <Link href="/tutorials" className="hover:text-purple-400">Tutorials</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{tutorial.title}</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={difficultyColor[tutorial.difficulty]}>{tutorial.difficulty}</Badge>
            <span className="text-gray-400">{tutorial.readingTime} min read</span>
            <Badge variant="outline" className="border-gray-700 text-gray-400">{tutorial.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{tutorial.title}</h1>
          <p className="text-gray-400 text-lg">{tutorial.description}</p>
        </div>

        <div className="space-y-8">
          {tutorial.steps.map((step, i) => (
            <div key={i} className="border-l-2 border-purple-500/30 pl-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-purple-500/20 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <p className="text-gray-300 mb-3">{step.content}</p>
              {step.code && (
                <pre className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-gray-300">{step.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Ready to try it?</h3>
          <p className="text-gray-400 mb-4">Get your free API key and start building in minutes.</p>
          <Link
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Get Free API Key →
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(t => (
                <Link key={t.slug} href={`/tutorials/${t.slug}`}>
                  <Card className="bg-[#1a1a2e] border-gray-800 hover:border-purple-500/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">{t.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={difficultyColor[t.difficulty]}>{t.difficulty}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
