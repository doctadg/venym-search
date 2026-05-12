import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { competitors, getCompetitor } from "@/lib/compare-data";

/* ── static params & metadata ── */

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};
  return {
    title: `Venym Search vs ${c.name} — Features, Pricing & Code Comparison`,
    description: `Compare Venym Search and ${c.name}: pricing, features, pros & cons, and code examples. See why developers switch to Venym Search.`,
  };
}

/* ── helpers ── */

function Bool({ value }: { value: boolean }) {
  return value ? (
    <Check className="inline h-4 w-4 text-green-500" />
  ) : (
    <X className="inline h-4 w-4 text-red-500/60" />
  );
}

/* ── page ── */

export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) notFound();

  // Feature table rows (Venym Search vs competitor)
  const featureRows = c.features.map((f) => ({
    feature: f,
    them: true,
    us: true,
  }));
  // Add features Venym Search has that they might not
  const extraFeatures = [
    { feature: "Unified Search + Scrape API", them: false, us: true },
    { feature: "Built-in AI Extraction", them: false, us: true },
    { feature: "10,000+ requests on starter plan", them: false, us: true },
  ];

  const faqs = [
    {
      q: `Why should I choose Venym Search over ${c.name}?`,
      a: `Venym Search combines web search, scraping, and AI-powered extraction in a single API starting at $29/mo for 10,000 requests. ${c.name} ${c.pricing.includes("500") || c.pricing.includes("299") || c.pricing.includes("300") ? "starts at a much higher price point" : "charges more per request at scale"} and doesn't offer the same unified experience.`,
    },
    {
      q: `Is it easy to migrate from ${c.name} to Venym Search?`,
      a: "Yes! Venym Search has a simple REST API with SDKs for Python, JavaScript, and more. Most migrations take under an hour. Our docs include step-by-step migration guides.",
    },
    {
      q: "Does Venym Search offer a free trial?",
      a: "Yes — you get 1,000 free requests on sign-up, no credit card required. Try it risk-free.",
    },
    {
      q: `How does Venym Search pricing compare to ${c.name}?`,
      a: `${c.name} pricing: ${c.pricing}. Venym Search pricing: ${c.searchHivePricing}. Venym Search gives you more requests per dollar with a unified API for search, scrape, and extract.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Venym Search",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "29",
          priceCurrency: "USD",
        },
        description: `Venym Search is a unified web search, scraping, and AI extraction API — a powerful alternative to ${c.name}.`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-4xl px-4 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            Compare
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Venym Search vs {c.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {c.description}
          </p>
        </div>

        {/* Pricing comparison */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">💰 Pricing Comparison</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{c.pricing}</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/40 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-green-400">
                  Venym Search ✓
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{c.searchHivePricing}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature table */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">⚡ Feature Comparison</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Feature</th>
                  <th className="px-4 py-3 text-center font-medium">
                    {c.name}
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-green-400">
                    Venym Search
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...featureRows, ...extraFeatures].map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2.5">{row.feature}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Bool value={row.them} />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Bool value={row.us} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Code comparison */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">🖥️ Code Comparison</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-400">
                  {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 text-xs leading-relaxed">
                  <code>{`// ${c.name} — multiple steps
const response = await fetch(
  "${c.website}/v1/search?q=example",
  {
    headers: {
      "Authorization": "Bearer YOUR_KEY"
    }
  }
);
const data = await response.json();
// Manual parsing & extraction
const results = data.organic_results
  .map(r => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet
  }));`}</code>
                </pre>
              </CardContent>
            </Card>
            <Card className="border-green-500/40 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-green-400">
                  Venym Search ✓
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 text-xs leading-relaxed">
                  <code>{`// Venym Search — one call, done
const { data } = await VENYM_SEARCH
  .search("example", {
    extract: true,
    limit: 10
  });

// Clean, structured results
// with AI extraction built in
console.log(data.results);
// [{ title, url, content, ... }]`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">
            👍 Pros &amp; 👎 Cons of {c.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-400">
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {c.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-400">
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {c.cons.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500/60" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">❓ FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-medium">{faq.q}</h3>
                <p className="mt-2 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
          <h2 className="text-3xl font-bold">
            Ready to switch from {c.name}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Get 1,000 free requests on sign-up. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">Read the Docs</Link>
            </Button>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/compare"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← View all comparisons
          </Link>
        </div>
      </article>
    </>
  );
}
