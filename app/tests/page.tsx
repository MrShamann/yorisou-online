import type { Metadata } from "next";
import Link from "next/link";

import { PHASE1_TEST_CATALOG } from "@/lib/yorisou-tests/catalog";

export const metadata: Metadata = {
  title: "入口を選ぶ | Yorisou",
  description:
    "Yorisouの公開テスト入口を、今の状態や関心に合わせて選べるページです。結果、レポート、LINE保存につながる入口を一覧できます。",
};

export default function TestsPage() {
  return (
    <main className="frontstage-page">
      <section className="frontstage-hero">
        <div className="container">
          <div className="frontstage-hero-inner">
            <div className="frontstage-hero-copy">
              <p className="service-kicker">Yorisou 公開テスト</p>
              <h1 className="display-serif frontstage-hero-title mt-3 max-w-[11em]">
                どの入口から始めるか、静かに選べる一覧
              </h1>
              <p className="frontstage-hero-lead max-w-[38rem]">
                Yorisouの第一段階の公開テストをまとめています。今の状態、働き方、職場環境、名前の印象、今日の軽いヒントまで、近いテーマから無理なく試せます。
              </p>
            </div>
            <div className="frontstage-note">
              <p>公開中の入口はそのまま始められます。どの入口も確認用の公開版として扱っており、医療・診断・運命判断ではなく、今の状態や関心を見直すためのリフレクションとして使えます。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-10">
        <div className="mx-auto max-w-[52rem]">
          <div className="grid gap-4">
            {PHASE1_TEST_CATALOG.map((test) => (
              <div
                key={test.testId}
                className={`surface-panel ${
                  test.status === "available"
                    ? "border-[rgba(23,59,53,0.16)] bg-white/96"
                    : "border-[rgba(23,59,53,0.1)] bg-white/88"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-[rgba(105,151,130,0.22)] bg-[#F4FAF7] px-3 py-1 text-[11px] font-semibold text-[#315F50]">
                    {test.category}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                      test.status === "available"
                        ? "bg-[#173B35] text-white"
                        : "border border-[rgba(23,59,53,0.08)] bg-[rgba(23,59,53,0.04)] text-[#7A7068]"
                    }`}
                  >
                    {test.status === "available" ? "公開中" : "準備中"}
                  </span>
                  <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.08)] bg-white px-3 py-1 text-[11px] font-semibold text-[#8A7764]">
                    {test.estimatedTime}
                  </span>
                </div>
                <h2 className="display-serif mt-4 text-[1.35rem] leading-[1.38] text-[#2F2A28] md:text-[1.62rem]">
                  {test.title}
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#5F5750]">{test.description}</p>
                <div className="surface-panel-soft mt-4">
                  <p className="surface-meta">境界メモ</p>
                  <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{test.boundaryNote}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href={test.route}
                    className={`inline-flex min-h-[50px] items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold transition hover:-translate-y-0.5 ${
                      test.status === "available"
                        ? "border border-[#173B35] bg-[#173B35] text-white shadow-[0_14px_28px_rgba(23,59,53,0.22)] hover:bg-[#0F2F2B]"
                        : "border border-[rgba(105,151,130,0.34)] bg-[#EAF7F1] text-[#315F50] hover:bg-[#ddf0e8]"
                    }`}
                  >
                    {test.status === "available" ? test.ctaLabel : "準備中の内容を見る"}
                  </Link>
                </div>
                {test.blockedReason ? (
                  <p className="mt-3 text-[12px] leading-6 text-[#8A7764]">この入口は元データ確認後に公開します。</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mx-auto max-w-[52rem]">
          <div className="surface-panel bg-white/78">
            <p className="service-kicker">入口の先で見えるもの</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">無料の結果</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  タイプ名、傾向、気をつけたい点、次に見たい入口までを、公開できる範囲で受け取れます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">関連する入口</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  今の状態、働き方、職場環境、名前、今日のヒントを行き来しながら、近いテーマを続けて試せます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">境界の明示</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  どの入口も、医療・診断・運命判断・退職助言ではなく、今を整理するためのリフレクションとして扱います。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-8">
        <div className="mx-auto max-w-[52rem]">
          <p className="text-[12px] leading-7 text-[#8A7764]">
            いずれも医療・心理診断ではありません。占いの断定、恋愛や仕事の結論、退職や収入の助言ではなく、今の状態や関心を見直すための入口です。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/open-testing" className="text-[13px] font-semibold text-[#315F50] hover:underline">
              公開中の入口を見る
            </Link>
            <Link href="/line/mini-app" className="text-[13px] font-semibold text-[#315F50] hover:underline">
              LINE入口を見る
            </Link>
            <Link href="/contact?topic=open-testing" className="text-[13px] font-semibold text-[#315F50] hover:underline">
              先行テーマへの関心を送る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
