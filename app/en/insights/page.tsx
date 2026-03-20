import type { Metadata } from "next";

import InsightCard from "@/app/components/InsightCard";
import { fetchNews } from "@/lib/insights/service";

export const metadata: Metadata = {
  title: "Yorisou Insights | Aging & Mobility Intelligence",
  description:
    "A curated Yorisou editorial layer on senior mobility, community transport, aging-society trends, and practical mobility service design in Japan.",
};

export default async function InsightsPageEn() {
  const insights = await fetchNews("en");
  const featured = insights.filter((item) => item.featured);
  const latest = insights.filter((item) => !item.featured);
  const listItems = featured.length > 0 ? latest : insights;

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="eyebrow">Aging &amp; Mobility Intelligence</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Reading senior mobility
              <span className="block text-[#6B5A4A]">through a practical Yorisou lens.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou Insights is the editorial intelligence layer connected to our mobility service platform.
              It interprets senior mobility, community transport, and aging-society shifts in Japan for families,
              local operators, and partners.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              The priority is not headline volume. We focus on what matters for real routes, family reassurance,
              local operations, and future service design.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-[#FCFAF6]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Editorial Role</div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                We translate policy, care, and transport signals into operational reading for the Japan market.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Product Intelligence</div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                The insights layer feeds consultation quality, pilot decisions, and long-term Yorisou standards.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Public Reading</div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                Visitors can read mobility change through lived experience, family impact, and workable local systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="px-6 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">Featured</div>
                <h2 className="mt-3 text-3xl font-light">Editorial priorities worth watching now</h2>
              </div>
              <div className="text-sm text-[#6B5A4A]">{featured.length} items</div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <InsightCard insight={featured[0]} locale="en" detailBasePath="/en/insights" />
              <div className="grid gap-6">
                {featured.slice(1, 3).map((insight) => (
                  <InsightCard key={insight.slug} insight={insight} locale="en" detailBasePath="/en/insights" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Articles</div>
              <h2 className="mt-3 text-3xl font-light">{featured.length > 0 ? "Latest Insights" : "Yorisou Insights"}</h2>
            </div>
            <div className="hidden text-sm text-[#6B5A4A] md:block">{insights.length} items</div>
          </div>

          {insights.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-8 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">No public insights yet</div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5A4B3E]">
                English editorial items are being prepared. The Yorisou intelligence layer is active, but this index currently has no public English entries.
                Please check back soon or browse the Japanese insights in the meantime.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {listItems.map((insight) => (
                <InsightCard key={insight.slug} insight={insight} locale="en" detailBasePath="/en/insights" />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
