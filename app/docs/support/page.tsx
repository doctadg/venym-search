import Link from 'next/link'
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
    },
    {
      title: "Community Forum",
      icon: Users,
      description: "Ask questions and share knowledge with other developers",
      response: "Community driven",
      availability: "Always open",
      contact: "community.search.venym.io",
    },
    {
      title: "Documentation",
      icon: Book,
      description: "Comprehensive guides, tutorials, and API references",
      response: "Instant",
      availability: "24/7",
      contact: "docs.search.venym.io",
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
      link: "/docs/api/search"
    },
    {
      issue: "Timeout Errors",
      solution: "Increase request timeout to 30-60 seconds. Some scraping operations take longer than others.",
      link: "/docs/errors"
    },
    {
      issue: "Empty Results",
      solution: "Try different search terms, check language/country parameters, or verify the target website is accessible.",
      link: "/docs/api/search/parameters"
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
      <div className="mb-10">
        <div className="venym-meta mb-3">SUPPORT</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Support & Help Center
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Get help with Venym Search APIs, troubleshoot issues, and connect with our developer community. We're here to help you succeed with your integration.
        </p>
      </div>

      <Callout type="success" title="24/7 Support Available">
        Our support team and community are available around the clock to help you solve integration challenges and optimize your Venym Search usage.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Get Support</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Get Support</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map((option, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <option.icon className="w-4 h-4 text-white/50" />
                <span className="text-[15px] font-medium text-white">{option.title}</span>
              </div>

              <p className="text-[13px] text-white/55 leading-relaxed mb-4">{option.description}</p>

              <div className="space-y-2 text-[12.5px] text-white/60 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span>Response: {option.response}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Available: {option.availability}</span>
                </div>
              </div>

              <a
                href={`mailto:${option.contact}`}
                className="text-[13px] text-white hover:text-white/80 underline underline-offset-2 decoration-white/30"
              >
                {option.contact}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · Common Issues</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Common Issues & Solutions</h2>

        <div className="space-y-3">
          {commonIssues.map((item, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400/80" />
                <span className="text-[15px] font-medium text-white">{item.issue}</span>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed mb-3">{item.solution}</p>
              <Link href={item.link} className="venym-btn-ghost">
                Learn More
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Support By Plan</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Support by Plan</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {planFeatures.map((plan, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-medium text-white">{plan.plan}</span>
                {plan.plan === 'Pro' && (
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-violet-400/20 text-violet-300/80">
                    Popular
                  </span>
                )}
              </div>
              <div className="text-[13px] text-white/55 mb-1">{plan.support}</div>
              <div className="text-[12px] font-mono text-white/40 mb-4">Response: {plan.response}</div>
              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span className="text-[13px] text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Contact Guidelines</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">When Contacting Support</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Please Include</span>
            </div>
            <div className="space-y-2 text-[13px] text-white/65">
              <div>• Your account email or API key prefix</div>
              <div>• Specific error messages and status codes</div>
              <div>• Request ID from API response (if available)</div>
              <div>• Steps to reproduce the issue</div>
              <div>• Expected vs actual behavior</div>
              <div>• Code samples (with API keys removed)</div>
              <div>• Programming language and SDK version</div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">For Faster Resolution</span>
            </div>
            <div className="space-y-2 text-[13px] text-white/65">
              <div>• Check the documentation first</div>
              <div>• Search community forum for similar issues</div>
              <div>• Test with curl to isolate SDK issues</div>
              <div>• Provide minimal reproducible example</div>
              <div>• Include relevant logs and timestamps</div>
              <div>• Specify urgency level (if business critical)</div>
              <div>• Use clear, descriptive subject lines</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Status & Updates</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Status & Updates</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">System Status</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Check real-time status of Venym Search APIs and services.
            </p>
            <Link href="/docs/status" className="venym-btn-primary">
              View Status Page
              <ExternalLink className="w-3 h-3 ml-1.5" />
            </Link>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Book className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Changelog</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">
              Stay updated with the latest API changes and new features.
            </p>
            <Link href="/docs/changelog" className="venym-btn-secondary">
              View Changelog
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Community Resources</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Community Resources</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-start gap-4">
              <Users className="w-5 h-5 text-violet-400/80 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Developer Community</h3>
                <p className="text-[13px] text-white/55 leading-relaxed mb-4">
                  Join thousands of developers using Venym Search. Share code, ask questions, and learn from others.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://discord.gg/VENYM_SEARCH" target="_blank" rel="noopener noreferrer" className="venym-btn-primary">
                    Join Discord
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                  </a>
                  <a href="https://github.com/VENYM_SEARCH/community" target="_blank" rel="noopener noreferrer" className="venym-btn-secondary">
                    GitHub Discussions
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-start gap-4">
              <Book className="w-5 h-5 text-amber-400/80 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Learning Resources</h3>
                <p className="text-[13px] text-white/55 leading-relaxed mb-4">
                  Tutorials, guides, and examples to help you get the most out of Venym Search APIs.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/docs/guides/bitcoin-tracking" className="venym-btn-primary">
                    View Tutorials
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Link>
                  <a href="https://youtube.com/@VENYM_SEARCH" target="_blank" rel="noopener noreferrer" className="venym-btn-secondary">
                    Video Guides
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">Still Need Help?</h3>
        <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-xl mx-auto">
          Can't find what you're looking for? Our support team is ready to help you solve any integration challenges.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href="mailto:support@search.venym.io" className="venym-btn-primary">
            Contact Support
            <Mail className="w-3.5 h-3.5 ml-1.5" />
          </a>
          <Link href="/docs" className="venym-btn-secondary">
            Browse Docs
            <Book className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
