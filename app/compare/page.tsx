import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { competitors } from "@/lib/compare-data";




export const metadata = {

  title: "Venym Search vs Competitors — Compare Web Scraping & Search APIs",
  description:
    "Side-by-side comparison of Venym Search against SerpAPI, ScrapingBee, Bright Data, Firecrawl, Tavily, and 10 more APIs. See pricing, features, and code examples.",
};

export default function ComparePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-14 text-center">
        <Badge variant="secondary" className="mb-4">
          Compare
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Venym Search vs the Competition
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Honest, detailed comparisons with 15 web scraping &amp; search APIs.
          See who wins on price, features, and developer experience.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {competitors.map((c) => (
          <Link key={c.slug} href={`/compare/${c.slug}`} className="group">
            <Card className="flex h-full flex-col transition-colors hover:border-primary/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {c.name}
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {c.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex-col items-start gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {c.features.slice(0, 3).map((f) => (
                    <Badge key={f} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.pricing}</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Compare →
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
