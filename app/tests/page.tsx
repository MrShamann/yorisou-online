import type { Metadata } from "next";
import Link from "next/link";

import { DIAGNOSTIC_ENTRY_CARDS } from "../data/platformNarrative";

export const metadata: Metadata = {
  title: "テスト一覧 | Yorisou",
  description:
    "Yorisouの診断入口を一覧で見られるページです。今の状態、関係の距離感、仕事や生活のリズムを見つめるための入口から、いまの自分に近いテーマを選べます。",
};

export default function TestsPage() {
  return (
    <main className="min-h-screen bg-[#FBFAF6] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-10 md:py-16">
          <div className="mx-auto max-w-[46rem]">
            <p className="service-kicker">Yorisou 診断入口</p>
            <h1 className="display-serif mt-4 text-[2rem] leading-[1.18] text-[#2F2A28] md:text-[2.95rem]">
              いまの自分に近い入口を選ぶ
            </h1>
            <p className="mt-4 max-w-[38rem] text-[15px] leading-8 text-[#6F625C]">
              Yorisouの診断は、性格を決めつけるものではありません。今の状態や関係の距離感、仕事や生活のリズムを見つめるための入口です。
            </p>
            <p className="mt-3 max-w-[38rem] text-[12px] leading-6 text-[#8A7764]">
              公開中の入口はそのまま始められます。先行テーマは、関心やフィードバックを受け取りながら整えていきます。
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-10">
        <div className="mx-auto max-w-[52rem]">
          <div className="grid gap-4">
            {DIAGNOSTIC_ENTRY_CARDS.map((test) => (
              <div
                key={test.title}
                className={`rounded-[1.4rem] border p-5 shadow-[0_18px_38px_rgba(23,59,53,0.07)] md:p-6 ${
                  test.availableNow
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
                      test.availableNow
                        ? "bg-[#173B35] text-white"
                        : "border border-[rgba(23,59,53,0.08)] bg-[rgba(23,59,53,0.04)] text-[#7A7068]"
                    }`}
                  >
                    {test.status}
                  </span>
                  <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.08)] bg-white px-3 py-1 text-[11px] font-semibold text-[#8A7764]">
                    {test.time}
                  </span>
                </div>
                <h2 className="display-serif mt-4 text-[1.35rem] leading-[1.38] text-[#2F2A28] md:text-[1.62rem]">
                  {test.title}
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#5F5750]">{test.hook}</p>
                <div className="mt-4 rounded-[1.05rem] border border-[rgba(23,59,53,0.08)] bg-[#F8F7F4] px-4 py-3">
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">この入口で受け取れるもの</p>
                  <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{test.outcome}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href={test.href}
                    className={`inline-flex min-h-[50px] items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold transition hover:-translate-y-0.5 ${
                      test.availableNow
                        ? "border border-[#173B35] bg-[#173B35] text-white shadow-[0_14px_28px_rgba(23,59,53,0.22)] hover:bg-[#0F2F2B]"
                        : "border border-[rgba(105,151,130,0.34)] bg-[#EAF7F1] text-[#315F50] hover:bg-[#ddf0e8]"
                    }`}
                  >
                    {test.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mx-auto max-w-[52rem]">
          <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.08)] bg-white/75 px-5 py-5">
            <p className="service-kicker">入口の先でつながるもの</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">結果とレポート</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  無料結果だけで終わらず、必要ならレポートの見本や関連導線へ進めます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">LINE保存</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  結果を見返したい人は、LINEから無理なく続けられる入口を選べます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">次の提案</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  今後は、Yorisou SelectやDesignの提案もテーマごとに育てていきます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-8">
        <div className="mx-auto max-w-[52rem]">
          <p className="text-[12px] leading-7 text-[#8A7764]">
            いずれも医療・心理診断ではありません。今の状態を見直し、次の選択肢を考えるための入口です。
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
