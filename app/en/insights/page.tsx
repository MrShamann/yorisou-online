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
  const featured = filtered.filter((item) => item.featured);
  const latest = filtered.filter((item) => !item.featured);
  const categories = getInsightCategoriesFromEntries(insights);
  const tags = getInsightTagsFromEntries(insights);

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="eyebrow">News + Analysis</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Reading local mobility
              <span className="block text-[#6B5A4A]">through a practical Yorisou lens.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou Insights is a curated editorial section that interprets senior mobility, welfare transport,
              and community mobility trends for users, families, and local partners in Japan.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              The editorial priority is not headline volume but what matters most for real routes, family reassurance, and workable local operations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/45">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">Filters</div>
                <p className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                  Narrow the list by topic.
                </p>
              </div>
              <div className="text-sm text-[#6B5A4A]">{filtered.length} items</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
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
            <details className="mt-4 rounded-2xl bg-[#FCFAF6] px-4 py-3">
              <summary className="cursor-pointer text-sm text-[#6B5A4A]">Filter by tags</summary>
              <div className="mt-3 flex flex-wrap gap-3">
                {tags.map((item) => (
                  <FilterChip
                    key={item.value}
                    href={`/en/insights?tag=${encodeURIComponent(item.value)}`}
                    label={`#${item.label}`}
                    active={params.tag === item.value}
                  />
                ))}
              </div>
            </details>
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
            <div className="hidden text-sm text-[#6B5A4A] md:block">{filtered.length} items</div>
          </div>

          <div className="grid gap-6">
            {(featured.length > 0 ? latest : filtered).map((insight) => (
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
