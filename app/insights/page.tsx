import type { Metadata } from "next";
import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import { fetchNews } from "@/lib/insights/service";
import type { InsightEntry } from "@/lib/insights/types";

export const metadata: Metadata = {
  title: "Yorisou Insights | 高齢社会と移動を読み解く",
  description:
    "高齢社会、地域交通、福祉移動、シニア向けモビリティの論点を、Yorisouの実務視点で整理するインテリジェンスレイヤーです。",
};

export default async function InsightsPage() {
  const insights = await fetchNews("ja");
  const featured = insights.filter((item) => item.featured);
  const hero = featured[0] || insights[0];
  const topicHighlights = buildTopicHighlights(insights, hero).filter(Boolean) as Array<{
    label: string;
    title: string;
    summary: string;
    href: string;
  }>;

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              今、まず読んでおきたいことを
              <span className="block text-[#6B5A4A]">Yorisouの視点で整理しています。</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              ご家族の安心、地域導入の考え方、導入後の支え方。高齢社会と移動の論点を、まず読むべき順に並べています。
            </p>
          </div>
        </div>
      </section>

      {hero && (
        <section className="px-6 py-14 md:px-10 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-[2.2rem] border border-[#D6C3A3]/35 bg-white/82 p-7 shadow-[0_20px_56px_rgba(59,47,47,0.06)] md:p-9">
                <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
                  <span className="rounded-full border border-[#D6C3A3]/45 bg-[#FCFAF6] px-3 py-1">{hero.categoryLabel}</span>
                  <span>{formatDate(hero.publishedAt)}</span>
                  <span>{hero.regionLabel}</span>
                </div>
                <h2 className="mt-5 text-3xl font-light leading-tight text-[#3B2F2F] md:text-[2.5rem]">
                  <Link href={`/insights/${hero.slug}`} className="transition hover:text-[#6B5A4A]">
                    {hero.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#5A4B3E]">{hero.summary}</p>
                <div className="mt-6 rounded-[1.5rem] border border-[#D6C3A3]/28 bg-[#FCFAF6] px-5 py-4">
                  <div className="text-xs tracking-[0.18em] text-[#8A7764]">いま読む理由</div>
                  <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{hero.whyItMatters}</p>
                </div>
                <div className="mt-7">
                  <Link href={`/insights/${hero.slug}`} className="btn btn-primary">
                    この記事を読む
                  </Link>
                </div>
              </article>

              <div>
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">気になるテーマから読む</div>
                <div className="mt-4 grid gap-4">
                  {topicHighlights.slice(0, 3).map((topic) => (
                    <Link
                      key={topic.label}
                      href={topic.href}
                      className="rounded-[1.6rem] border border-[#D6C3A3]/32 bg-white/78 px-5 py-5 shadow-sm transition hover:bg-white"
                    >
                      <div className="text-sm text-[#8A7764]">{topic.label}</div>
                      <h3 className="mt-2 text-xl font-light leading-tight text-[#3B2F2F]">{topic.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{topic.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-light">{hero ? "そのほかの読みもの" : "Yorisouの読みもの"}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">続けて読みやすい順に、関連する論点を並べています。</p>
            </div>
            <div className="hidden text-sm text-[#6B5A4A] md:block">{insights.length}件</div>
          </div>

          <div className="grid gap-6">
            {(hero ? insights.filter((insight) => insight.slug !== hero.slug) : insights).map((insight) => (
              <InsightCard key={insight.slug} insight={insight} locale="ja" detailBasePath="/insights" variant="list" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function buildTopicHighlights(insights: InsightEntry[], fallback?: InsightEntry) {
  const family = insights.find((item) => item.tags.includes("家族安心") || item.category === "senior-mobility") || fallback;
  const regional = insights.find((item) => item.tags.includes("実証") || item.category === "community-transport") || fallback;
  const support = insights.find((item) => item.tags.includes("ラストマイル") || item.category === "welfare-mobility") || fallback;

  return [
    family && {
      label: "ご家族の安心",
      title: family.title,
      summary: family.whyItMatters,
      href: `/insights/${family.slug}`,
    },
    regional && {
      label: "地域導入の考え方",
      title: regional.title,
      summary: regional.whyItMatters,
      href: `/insights/${regional.slug}`,
    },
    support && {
      label: "導入後の支え方",
      title: support.title,
      summary: support.whyItMatters,
      href: `/insights/${support.slug}`,
    },
  ];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
