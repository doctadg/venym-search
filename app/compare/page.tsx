import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { competitors } from "@/lib/compare-data";


export const metadata = {
  title: "Venym vs Competitors — Web Search & Scrape APIs Compared",
  description:
    "Side-by-side comparisons with SerpAPI, ScrapingBee, Bright Data, Firecrawl, Tavily, and 10 more. See who wins for AI agent workloads on price, features, and DX.",
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-white/20" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">
              Compare // 06
            </span>
          </div>
          <h1 className="text-4xl md:text-[6rem] font-display font-medium leading-[0.85] tracking-tighter mb-6">
            Venym vs <br />
            <span className="text-gray-700 italic font-light">the rest of the field.</span>
          </h1>
          <p className="text-gray-400 font-sans font-light text-base md:text-xl max-w-2xl leading-relaxed">
            Honest comparisons with 15 search and scrape APIs. See who actually
            wins for AI agent workloads — price, features, latency, DX.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <Link key={c.slug} href={`/compare/${c.slug}`} className="group block">
              <div className="h-full flex flex-col border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 p-6 md:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg md:text-xl font-display font-medium text-white tracking-tight">
                    Venym vs {c.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-sans font-light text-gray-400 leading-relaxed mb-5 line-clamp-3 flex-1">
                  {c.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {c.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] px-2 py-1 border border-white/5 bg-white/[0.02]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex w-full items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] truncate pr-3">
                    {c.pricing}
                  </span>
                  <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.3em] whitespace-nowrap">
                    Compare →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
