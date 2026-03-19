import type { Metadata } from "next";
import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import { getInsightCategoriesFromEntries, getInsightTagsFromEntries } from "@/lib/insights";
import { fetchNews } from "@/lib/insights/service";

export const metadata: Metadata = {
  title: "Yorisou Insights | 地域モビリティの視点",
  description:
    "高齢社会、地域交通、福祉移動、シニア向けモビリティに関する話題を、Yorisouの視点で整理するNews + Analysisセクションです。",
};

type SearchParams = Promise<{
  category?: string;
  tag?: string;
}>;

export default async function InsightsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const insights = await fetchNews("ja");
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
              地域モビリティを、
              <span className="block text-[#6B5A4A]">実務の視点で読み解く。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou Insightsは、シニアモビリティ、地域交通、高齢社会の移動課題に関する話題を、
              ご本人・ご家族・地域関係者にとって分かりやすく整理するための編集セクションです。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              速報性よりも、生活導線、家族負担、地域での運用現実に照らして何が重要かを優先しています。
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/45">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">絞り込み</div>
                <p className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                  関心の近い論点から絞り込めます。
                </p>
              </div>
              <div className="text-sm text-[#6B5A4A]">{filtered.length}件</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
                <FilterChip href="/insights" label="すべて" active={!params.category} />
                {categories.map((item) => (
                  <FilterChip
                    key={item.value}
                    href={`/insights?category=${item.value}`}
                    label={item.label}
                    active={params.category === item.value}
                  />
                ))}
            </div>
            <details className="mt-4 rounded-2xl bg-[#FCFAF6] px-4 py-3">
              <summary className="cursor-pointer text-sm text-[#6B5A4A]">タグで絞り込む</summary>
              <div className="mt-3 flex flex-wrap gap-3">
                {tags.map((item) => (
                  <FilterChip
                    key={item.value}
                    href={`/insights?tag=${encodeURIComponent(item.value)}`}
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
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">注目インサイト</div>
                <h2 className="mt-3 text-3xl font-light">今、優先して見ておきたい論点</h2>
              </div>
              <div className="text-sm text-[#6B5A4A]">{featured.length}件</div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <InsightCard insight={featured[0]} locale="ja" detailBasePath="/insights" />
              <div className="grid gap-6">
                {featured.slice(1, 3).map((insight) => (
                  <InsightCard key={insight.slug} insight={insight} locale="ja" detailBasePath="/insights" />
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
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">記事一覧</div>
              <h2 className="mt-3 text-3xl font-light">{featured.length > 0 ? "最新インサイト" : "Yorisou Insights"}</h2>
            </div>
            <div className="hidden text-sm text-[#6B5A4A] md:block">{filtered.length}件</div>
          </div>

          <div className="grid gap-6">
            {(featured.length > 0 ? latest : filtered).map((insight) => (
              <InsightCard key={insight.slug} insight={insight} locale="ja" detailBasePath="/insights" />
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
