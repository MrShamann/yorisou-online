import type { Metadata } from "next";

import InsightCard from "@/app/components/InsightCard";
import { fetchNews } from "@/lib/insights/service";

export const metadata: Metadata = {
  title: "Yorisou Insights | 高齢社会と移動を読み解く",
  description:
    "高齢社会、地域交通、福祉移動、シニア向けモビリティの論点を、Yorisouの実務視点で整理するインテリジェンスレイヤーです。",
};

export default async function InsightsPage() {
  const insights = await fetchNews("ja");
  const featured = insights.filter((item) => item.featured);
  const latest = insights.filter((item) => !item.featured);

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="eyebrow">Aging &amp; Mobility Intelligence</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              高齢社会の移動を、
              <span className="block text-[#6B5A4A]">次の判断につながる形で読み解く。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou Insightsは、シニアモビリティ、地域交通、高齢社会の移動課題を、
              ご本人・ご家族・地域関係者・事業パートナーにとって判断しやすい形に整理するインテリジェンスレイヤーです。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              単なるブログやニュース集約ではなく、生活導線、家族負担、地域運用、将来のサービス設計に照らして何が重要かを優先しています。
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-[#FCFAF6]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Editorial Role</div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">政策・制度・地域実務を、現場で使える視点に翻訳します。</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Product Intelligence</div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">相談支援、導入判断、将来のYorisou標準づくりに返すための知見を蓄積します。</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Public Reading</div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">高齢社会と移動の変化を、公共性と暮らしの両方から落ち着いて読み解きます。</p>
            </div>
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
            <div className="hidden text-sm text-[#6B5A4A] md:block">{insights.length}件</div>
          </div>

          <div className="grid gap-6">
            {(featured.length > 0 ? latest : insights).map((insight) => (
              <InsightCard key={insight.slug} insight={insight} locale="ja" detailBasePath="/insights" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
