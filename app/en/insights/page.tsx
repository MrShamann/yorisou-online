import type { Metadata } from "next";
import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import { getInsightCategoriesFromEntries, getInsightTagsFromEntries } from "@/lib/insights";
import { fetchNews } from "@/lib/insights/service";

export const metadata: Metadata = {
  title: "Yorisou Insights | News + Analysis",
  description:
    "A curated Yorisou editorial section on senior mobility, community transport, aging-society trends, and practical mobility service design in Japan.",
};

type SearchParams = Promise<{
  category?: string;
  tag?: string;
}>;

export default async function InsightsPageEn({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const insights = await fetchNews("en");
  const filtered = insights.filter((item) => {
    const categoryMatch = !params.category || item.category === params.category;
    const tagMatch = !params.tag || item.tags.includes(params.tag);
    return categoryMatch && tagMatch;
  });
  const categories = getInsightCategoriesFromEntries(insights);
  const tags = getInsightTagsFromEntries(insights);

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">News + Analysis</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Reading local mobility
              <span className="block text-[#6B5A4A]">through a practical Yorisou lens.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou Insights is a curated editorial section that interprets senior mobility, welfare transport,
              and community mobility trends for users, families, and local partners in Japan.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/45">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">YORISOU VIEW</div>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                We focus less on headline volume and more on what each topic means for daily routes, family reassurance,
                and realistic local implementation. The aim is a trusted mobility briefing, not a noisy news feed.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Filters</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <FilterChip href="/en/insights" label="All" active={!params.category} />
                {categories.map((item) => (
                  <FilterChip
                    key={item.value}
                    href={`/en/insights?category=${item.value}`}
                    label={item.label}
                    active={params.category === item.value}
                  />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {tags.map((item) => (
                  <FilterChip
                    key={item.value}
                    href={`/en/insights?tag=${encodeURIComponent(item.value)}`}
                    label={`#${item.label}`}
                    active={params.tag === item.value}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Articles</div>
              <h2 className="mt-3 text-3xl font-light">Yorisou Insights</h2>
            </div>
            <div className="text-sm text-[#6B5A4A]">{filtered.length} items</div>
          </div>

          <div className="grid gap-6">
            {filtered.map((insight) => (
              <InsightCard key={insight.slug} insight={insight} locale="en" detailBasePath="/en/insights" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active ? "border-[#6B5A4A] bg-[#6B5A4A] text-white" : "border-[#D6C3A3]/45 bg-[#FCFAF6] text-[#5A4B3E] hover:bg-white"
      }`}
    >
      {label}
    </Link>
  );
}
