import type { Metadata } from "next";
import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import { fetchNews } from "@/lib/insights/service";
import type { InsightEntry } from "@/lib/insights/types";

export const metadata: Metadata = {
  title: "Yorisouの読みもの | 移動と暮らしを考える",
  description:
    "高齢社会と移動、暮らしの支え方、地域導入の考え方を、Yorisouの視点でやさしく整理する読みもの一覧です。",
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
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative overflow-hidden border-b border-[color:var(--line-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16">
          <div className="max-w-3xl">
            <div className="service-kicker">Yorisouの読みもの</div>
            <h1 className="display-serif mt-5 max-w-[16em] text-[1.88rem] font-light leading-[1.6] md:text-[2.28rem]">
              <span className="block md:whitespace-nowrap">移動と暮らしを考えるための、</span>
              <span className="block md:whitespace-nowrap">静かな読みもの。</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              ご家族の安心、地域導入の考え方、導入後の支え方。ひなたとの相談の前後にも読みやすい形で、
              気になる論点を整理しています。
            </p>
          </div>
        </div>
      </section>

      {hero && (
        <section className="px-6 py-10 md:px-10 md:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
              <article className="rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.84)] p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
                  <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1">{hero.categoryLabel}</span>
                  <span>{formatDate(hero.publishedAt)}</span>
                  <span>{hero.regionLabel}</span>
                </div>
                <h2 className="mt-5 text-[1.5rem] font-light leading-[1.58] text-[#3B2F2F] md:text-[1.8rem]">
                  <Link href={`/insights/${hero.slug}`} className="transition hover:text-[#6B5A4A]">
                    {hero.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#5A4B3E]">{hero.summary}</p>
                <div className="mt-5 rounded-[1.4rem] bg-[var(--surface-soft)] px-5 py-4">
                  <div className="text-xs tracking-[0.18em] text-[#8A7764]">いま読む理由</div>
                  <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{hero.whyItMatters}</p>
                </div>
                <div className="mt-6">
                  <Link href={`/insights/${hero.slug}`} className="text-sm text-[var(--text)] underline underline-offset-4">
                    この記事を読む
                  </Link>
                </div>
              </article>

              <div>
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">気になるテーマから読む</div>
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                  {topicHighlights.slice(0, 3).map((topic) => (
                    <Link
                      key={topic.label}
                      href={topic.href}
                      className="min-w-[260px] rounded-[1.35rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.78)] px-5 py-5 transition hover:bg-white"
                    >
                      <div className="text-sm text-[#8A7764]">{topic.label}</div>
                      <h3 className="mt-2 line-clamp-2 text-[1.08rem] font-light leading-[1.55] text-[#3B2F2F]">{topic.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5A4B3E]">{topic.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[1.7rem] font-light leading-[1.56]">{hero ? "そのほかの読みもの" : "Yorisouの読みもの"}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">相談の前にも後にも読みやすい順で、関連する論点を並べています。</p>
            </div>
            <div className="hidden text-sm text-[#6B5A4A] md:block">{insights.length}件</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
