import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "テスト一覧 | Yorisou",
  description:
    "いまの状態を、いくつかの入口から軽く整理できます。診断や固定的なラベルづけではなく、自分の状態を見直すための小さなチェックです。",
};

const tests = [
  {
    id: "quick-check",
    kicker: "クイックチェック",
    title: "今の自分の流れを軽く整理する",
    description: "今の状態を軽く整理する24問のチェックです。正解はなく、今の感覚に近いものをひとつずつ選ぶだけです。答えると無料結果が返ってきます。",
    href: "/check-in",
    ctaLabel: "はじめる",
    pills: ["24問", "無料結果あり", "ログイン不要"],
    primary: true,
  },
  {
    id: "relationship-fatigue",
    kicker: "関係疲れチェック",
    title: "人との距離感や疲れ方を見直す",
    description: "人との関わり方や疲れのパターンを、今の状態から小さく整理するための入口です。",
    href: "/tests/relationship-fatigue",
    ctaLabel: "内容を見る",
    pills: ["関係・距離感", "無料"],
    primary: false,
  },
  {
    id: "love-distance",
    kicker: "恋愛距離チェック",
    title: "恋愛や親密さの距離感を整理する",
    description: "恋愛や親密さの距離感を整理するための入口です。今の自分の感覚を静かに確認できます。",
    href: "/tests/love-distance",
    ctaLabel: "内容を見る",
    pills: ["恋愛・距離感", "無料"],
    primary: false,
  },
] as const;

export default function TestsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(221,236,242,0.6),transparent_36%),linear-gradient(180deg,#FFF7F1_0%,#fffdf9_46%,#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-10 md:py-16">
          <div className="mx-auto max-w-[42rem]">
            <p className="service-kicker">Yorisou テスト一覧</p>
            <h1 className="display-serif mt-4 text-[2rem] leading-[1.18] text-[#2F2A28] md:text-[2.8rem]">
              今の状態に合う入口を、<span className="block text-[#315F50]">静かに選ぶ。</span>
            </h1>
            <p className="mt-4 max-w-[34rem] text-[15px] leading-8 text-[#6F625C]">
              いまの状態を、いくつかの入口から軽く整理できます。診断や固定的なラベルづけではなく、自分の状態を見直すための小さなチェックです。
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="mx-auto grid max-w-[42rem] gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`rounded-[1.35rem] border p-5 shadow-[0_18px_38px_rgba(23,59,53,0.07)] md:p-6 ${
                test.primary
                  ? "border-[rgba(23,59,53,0.16)] bg-white/96"
                  : "border-[rgba(23,59,53,0.1)] bg-white/88"
              }`}
            >
              <div className="flex flex-wrap gap-1.5">
                {test.pills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex rounded-full border border-[rgba(105,151,130,0.22)] bg-[#F4FAF7] px-3 py-1 text-[11px] font-semibold text-[#315F50]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <p className="service-kicker mt-3">{test.kicker}</p>
              <h2 className="display-serif mt-2 text-[1.3rem] leading-[1.38] text-[#2F2A28] md:text-[1.55rem]">
                {test.title}
              </h2>
              <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{test.description}</p>
              <div className="mt-4">
                <Link
                  href={test.href}
                  className={`inline-flex min-h-[50px] items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold transition hover:-translate-y-0.5 ${
                    test.primary
                      ? "border border-[#173B35] bg-[#173B35] text-white shadow-[0_14px_28px_rgba(23,59,53,0.22)] hover:bg-[#0F2F2B]"
                      : "border border-[rgba(105,151,130,0.34)] bg-[#EAF7F1] text-[#315F50] hover:bg-[#ddf0e8]"
                  }`}
                >
                  {test.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-[42rem]">
          <p className="text-[12px] leading-7 text-[#8A7764]">
            いずれも診断や評価ではありません。今の状態の傾向を理解するための入口です。
          </p>
        </div>
      </section>
    </main>
  );
}
