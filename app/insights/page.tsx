import type { Metadata } from "next";
import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import MotionReveal from "@/app/components/MotionReveal";
import { fetchNews } from "@/lib/insights/service";
import { getAllInsights } from "@/lib/insights/index";
import type { InsightEntry } from "@/lib/insights/types";

export const metadata: Metadata = {
  title: "Yorisouの読みもの | 移動と暮らしを考える",
  description:
    "高齢社会と移動、暮らしの支え方、地域での導入の考え方を、Yorisouの視点で静かに読み進められる一覧です。",
};

export default async function InsightsPage() {
  const insights = await loadSafeInsights();
  const topics = buildTopicHighlights(insights);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-14">
          <MotionReveal className="max-w-[44rem]" delay={30}>
            <div className="service-kicker">Yorisouの読みもの</div>
            <h1 className="display-serif mt-4 max-w-[14.5em] text-[1.72rem] leading-[1.66] md:text-[2.08rem]">
              <span className="block md:whitespace-nowrap">移動と暮らしを考えるための、</span>
              <span className="block md:whitespace-nowrap">静かな読みもの。</span>
            </h1>
            <p className="mt-4 page-copy">
              ひなたとの対話の前にも後にも、気になる論点だけを静かに拾えるように並べています。
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">気になるテーマから</p>
            <h2 className="section-title">まずは、近いテーマをひとつ選ぶだけで大丈夫です。</h2>
          </MotionReveal>
          <div className="rail-scroll mt-6">
            {topics.map((topic, index) => (
              <MotionReveal key={topic.label} delay={80 + index * 60} distance={16}>
                <Link
                key={topic.label}
                href={topic.href}
                className="motion-card min-w-[240px] rounded-[1.3rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.42)] px-5 py-5 transition hover:bg-[rgba(225,232,219,0.6)]"
              >
                <div className="text-sm text-[var(--accent-sage-text)]">{topic.label}</div>
                <div className="mt-2 text-[1.08rem] leading-8 text-[var(--text)]">{topic.title}</div>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--muted)]">{topic.summary}</p>
                </Link>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">新しい読みもの</p>
            <h2 className="section-title">長く一覧を追わなくても、気になる記事から読めます。</h2>
          </MotionReveal>
          <div className="rail-scroll mt-6">
            {insights.map((insight, index) => (
              <MotionReveal key={insight.slug} delay={80 + index * 45} distance={16}>
                <InsightCard key={insight.slug} insight={insight} locale="ja" detailBasePath="/insights" variant="rail" />
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

async function loadSafeInsights(): Promise<InsightEntry[]> {
  try {
    const insights = sanitizeInsights(await fetchNews("ja"));
    return insights.length > 0 ? insights : getAllInsights("ja");
  } catch {
    return getAllInsights("ja");
  }
}

function sanitizeInsights(insights: InsightEntry[]) {
  return insights.filter((item) => {
    return Boolean(
      item &&
        item.slug &&
        item.title &&
        item.summary &&
        item.whyItMatters &&
        item.categoryLabel &&
        item.regionLabel &&
        Array.isArray(item.tags) &&
        Array.isArray(item.yorisouView) &&
        !Number.isNaN(new Date(item.publishedAt).getTime())
    );
  });
}

function buildTopicHighlights(insights: InsightEntry[]) {
  const family = insights.find((item) => item.tags.includes("家族安心") || item.category === "senior-mobility") || insights[0];
  const regional = insights.find((item) => item.tags.includes("実証") || item.category === "community-transport") || insights[1] || insights[0];
  const support = insights.find((item) => item.tags.includes("ラストマイル") || item.category === "welfare-mobility") || insights[2] || insights[0];

  return [
    {
      label: "ご家族の安心",
      title: family.title,
      summary: family.whyItMatters,
      href: `/insights/${family.slug}`,
    },
    {
      label: "地域での導入",
      title: regional.title,
      summary: regional.whyItMatters,
      href: `/insights/${regional.slug}`,
    },
    {
      label: "導入後の支え方",
      title: support.title,
      summary: support.whyItMatters,
      href: `/insights/${support.slug}`,
    },
  ];
}
