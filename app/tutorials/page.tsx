import Link from 'next/link'
import { tutorials } from '@/lib/tutorial-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


const difficultyColor = {

  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
}

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Venym Search Tutorials</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Step-by-step guides to help you build with Venym Search. From web scraping to AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Link key={tutorial.slug} href={`/tutorials/${tutorial.slug}`}>
              <Card className="bg-[#1a1a2e] border-gray-800 hover:border-purple-500/50 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={difficultyColor[tutorial.difficulty]}>
                      {tutorial.difficulty}
                    </Badge>
                    <span className="text-gray-500 text-sm">{tutorial.readingTime} min read</span>
                  </div>
                  <CardTitle className="text-white text-lg">{tutorial.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {tutorial.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-gray-700 text-gray-400">
                    {tutorial.category}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


