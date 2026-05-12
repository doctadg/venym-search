import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageSquare, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Book,
  ExternalLink,
  ArrowRight,
  Users,
  FileText,
  Zap
} from 'lucide-react'
import { Callout } from '../components/Callout'

export default function SupportPage() {
  const supportOptions = [
    {
      title: "Email Support",
      icon: Mail,
      description: "Get help via email with detailed responses",
      response: "< 24 hours",
      availability: "24/7",
      contact: "support@search.venym.io",
      color: "blue"
    },
    {
      title: "Community Forum",
      icon: Users,
      description: "Ask questions and share knowledge with other developers",
      response: "Community driven",
      availability: "Always open",
      contact: "community.search.venym.io",
      color: "green"
    },
    {
      title: "Documentation",
      icon: Book,
      description: "Comprehensive guides, tutorials, and API references",
      response: "Instant",
      availability: "24/7",
      contact: "docs.search.venym.io",
      color: "purple"
    }
  ]

  const commonIssues = [
    {
      issue: "Authentication Error (401)",
      solution: "Check that your API key is correct and properly formatted. Ensure you're using 'Bearer' prefix in Authorization header.",
      link: "/docs/authentication"
    },
    {
      issue: "Rate Limit Exceeded (429)",
      solution: "You've hit your plan's rate limit. Implement exponential backoff or upgrade your plan for higher limits.",
      link: "/docs/rate-limits"
    },
    {
      issue: "Insufficient Credits (402)",
      solution: "Your account is out of credits. Upgrade your plan or wait for the next billing cycle.",
      link: "/pricing"
    },
    {
      issue: "Invalid Request (400)",
      solution: "Check your request parameters against the API documentation. Ensure JSON is properly formatted.",
      link: "/docs/api/swiftsearch"
    },
    {
      issue: "Timeout Errors",
      solution: "Increase request timeout to 30-60 seconds. Some scraping operations take longer than others.",
      link: "/docs/errors"
    },
    {
      issue: "Empty Results",
      solution: "Try different search terms, check language/country parameters, or verify the target website is accessible.",
      link: "/docs/api/swiftsearch/parameters"
    }
  ]

  const planFeatures = [
    {
      plan: "Free",
      support: "Email support",
      response: "48 hours",
      features: ["Community forum access", "Documentation", "Basic troubleshooting"]
    },
    {
      plan: "Pro", 
      support: "Priority email support",
      response: "24 hours",
      features: ["Priority community forum", "Implementation guidance", "Code review"]
    },
    {
      plan: "Enterprise",
      support: "Dedicated support",
      response: "4 hours",
      features: ["Direct engineer contact", "Custom integration help", "SLA guarantee", "Phone support"]
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Support
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Support & Help Center
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Get help with Venym Search APIs, troubleshoot issues, and connect with our developer community. 
          We're here to help you succeed with your integration.
        </p>
      </div>

      <Callout type="success" title="24/7 Support Available">
        Our support team and community are available around the clock to help you solve integration challenges and optimize your Venym Search usage.
      </Callout>

      {/* Support Options */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Get Support</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {supportOptions.map((option, index) => (
            <Card key={index} className={`border-l-4 border-l-${option.color}-500`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <option.icon className={`w-6 h-6 text-${option.color}-600`} />
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm">{option.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Response: {option.response}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Available: {option.availability}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <a 
                    href={`mailto:${option.contact}`} 
                    className="text-[#efa72d] hover:underline font-medium text-sm"
                  >
                    {option.contact}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Common Issues */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Common Issues & Solutions</h2>
        
        <div className="space-y-4">
          {commonIssues.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <AlertCircle className="w-5 h-5 text-[#efa72d]" />
                  {item.issue}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-3">{item.solution}</p>
                <Link href={item.link}>
                  <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                    Learn More
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Support by Plan */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Support by Plan</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {planFeatures.map((plan, index) => (
            <Card key={index} className={plan.plan === 'Pro' ? 'border-[#efa72d] border-2' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.plan}</CardTitle>
                  {plan.plan === 'Pro' && (
                    <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">{plan.support}</div>
                  <div className="text-sm font-medium text-[#efa72d]">Response: {plan.response}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Guidelines */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">When Contacting Support</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Please Include
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Your account email or API key prefix</div>
              <div>• Specific error messages and status codes</div>
              <div>• Request ID from API response (if available)</div>
              <div>• Steps to reproduce the issue</div>
              <div>• Expected vs actual behavior</div>
              <div>• Code samples (with API keys removed)</div>
              <div>• Programming language and SDK version</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#efa72d]" />
                For Faster Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Check the documentation first</div>
              <div>• Search community forum for similar issues</div>
              <div>• Test with curl to isolate SDK issues</div>
              <div>• Provide minimal reproducible example</div>
              <div>• Include relevant logs and timestamps</div>
              <div>• Specify urgency level (if business critical)</div>
              <div>• Use clear, descriptive subject lines</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status & Updates */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Status & Updates</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Check real-time status of Venym Search APIs and services.
              </p>
              <Link href="/docs/status">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  View Status Page
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-500" />
                Changelog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest API changes and new features.
              </p>
              <Link href="/docs/changelog">
                <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                  View Changelog
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Community Resources</h2>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Developer Community</h3>
                  <p className="text-gray-600 mb-4">
                    Join thousands of developers using Venym Search. Share code, ask questions, and learn from others.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://discord.gg/VENYM_SEARCH" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Join Discord
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                    <a href="https://github.com/VENYM_SEARCH/community" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                        GitHub Discussions
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Book className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Learning Resources</h3>
                  <p className="text-gray-600 mb-4">
                    Tutorials, guides, and examples to help you get the most out of Venym Search APIs.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/docs/guides/bitcoin-tracking">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        View Tutorials
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </Button>
                    </Link>
                    <a href="https://youtube.com/@VENYM_SEARCH" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                        Video Guides
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Form CTA */}
      <div className="bg-gradient-to-r from-[#17457c] to-[#17457c]/90 rounded-lg p-8 text-white text-center">
        <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
        <p className="mb-6 text-white/90">
          Can't find what you're looking for? Our support team is ready to help you solve any integration challenges.
        </p>
        <div className="flex justify-center gap-4">
          <a href="mailto:support@search.venym.io">
            <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
              Contact Support
              <Mail className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Link href="/docs">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#17457c]">
              Browse Docs
              <Book className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}