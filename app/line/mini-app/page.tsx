import type { Metadata } from "next";
import Link from "next/link";

import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";
import MiniAppEntrySignals from "./MiniAppEntrySignals";

export const metadata: Metadata = {
  title: "Yorisou | チェックを始める",
  description: "今の状態に合う入口を選んで、軽く整理するチェックを始められます。",
};

const secondaryTests = [
  {
    id: "relationship-fatigue",
    kicker: "関係疲れチェック",
    title: "人との距離感や疲れ方を見直す",
    description: "人との関わり方や疲れのパターンを、今の状態から小さく整理するための入口です。",
    href: "/tests/relationship-fatigue",
    pills: ["関係・距離感"],
  },
  {
    id: "love-distance",
    kicker: "恋愛距離チェック",
    title: "恋愛や親密さの距離感を整理する",
    description: "恋愛や親密さの距離感を、今の自分の感覚から静かに確認できます。",
    href: "/tests/love-distance",
    pills: ["恋愛・距離感"],
  },
] as const;

export default async function MiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const startHref = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: resolvedSearchParams || {} });

  return (
    <main
      className="min-h-screen bg-[linear-gradient(180deg,#FAFAF8_0%,#F4FAF7_100%)] text-[#2F2A28]"
      style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="display-serif text-[1.25rem] font-semibold tracking-[0.09em] text-[#2F2A28]">YORISOU</div>
          <span className="rounded-full border border-[rgba(105,151,130,0.34)] bg-[#EAF7F1] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#315F50]">
            LINE
          </span>
        </div>

        {/* Hero copy */}
        <div className="mb-5">
          <p className="service-kicker">今の状態に合う入口を選ぶ</p>
          <h1 className="display-serif mt-2 text-[1.7rem] leading-[1.26] text-[#2F2A28]">
            まずは短いチェックから。
          </h1>
          <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">
            答えた内容に合わせて、今の自分を少し整理できます。
          </p>
        </div>

        {/* Primary CTA card */}
        <div className="mb-3 rounded-[1.35rem] border border-[rgba(23,59,53,0.16)] bg-white/96 p-5 shadow-[0_16px_32px_rgba(23,59,53,0.09)]">
          <div className="flex flex-wrap gap-1.5">
            {(["24問", "無料", "3分ほど"] as const).map((pill) => (
              <span
                key={pill}
                className="inline-flex rounded-full border border-[rgba(105,151,130,0.22)] bg-[#F4FAF7] px-3 py-1 text-[11px] font-semibold text-[#315F50]"
              >
                {pill}
              </span>
            ))}
          </div>
          <p className="service-kicker mt-3">クイックチェック</p>
          <h2 className="display-serif mt-1 text-[1.22rem] leading-[1.38] text-[#2F2A28]">
            今の自分の流れを軽く整理する
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#6F625C]">24問のクイックチェックです。今の感覚に近いものをひとつずつ選ぶだけ。答えると無料結果が返ってきます。</p>
          <MiniAppEntrySignals href={startHref} locale="ja" label="クイックチェックを始める" />
        </div>

        {/* Secondary test cards */}
        <div className="grid gap-2.5">
          {secondaryTests.map((test) => (
            <Link
              key={test.id}
              href={test.href}
              className="block rounded-[1.15rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-4 shadow-[0_8px_18px_rgba(23,59,53,0.05)] transition hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-1.5">
                    {([...test.pills] as string[]).map((pill) => (
                      <span
                        key={pill}
                        className="inline-flex rounded-full border border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] px-2.5 py-0.5 text-[10px] font-semibold text-[#315F50]"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                  <p className="service-kicker mt-2 text-[10px]">{test.kicker}</p>
                  <h2 className="mt-1 text-[14px] font-semibold leading-[1.46] text-[#2F2A28]">
                    {test.title}
                  </h2>
                  <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">{test.description}</p>
                </div>
                <span className="mt-1 shrink-0 text-[#315F50]">›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-[11px] leading-6 text-[#8A7764]">
          ログインなしで始められます。診断ではありません。
        </p>
      </div>
    </main>
  );
}
