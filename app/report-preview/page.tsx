import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import ReportIntentAction from "./ReportIntentAction";

export const metadata: Metadata = {
  title: "詳しいレポート | Yorisou",
  description:
    "無料結果のあとで、もう少し深く読みたいときの入口だけを静かに見られる Yorisou のページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readResultId(params: Record<string, string | string[] | undefined>) {
  const value = params.resultId;
  return typeof value === "string" ? value : null;
}

export default async function ReportPreviewPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const resultId = readResultId(params) ?? currentStateCheckV1.scoring.fallbackResultId;
  const result =
    getCurrentStateResult(resultId) ??
    currentStateCheckV1.results.find((item) => item.id === currentStateCheckV1.scoring.fallbackResultId)!;
  const lockedSections = [
    {
      title: "いまの状態の見え方",
      promise: "今の反応や選び方の傾向を整理します。",
    },
    {
      title: "人との距離感",
      promise: "近づき方、離れ方、安心しやすい距離を見ます。",
    },
    {
      title: "仕事・学び方のリズム",
      promise: "集中しやすい流れや疲れやすい場面を整理します。",
    },
    {
      title: "休み方・戻り方",
      promise: "気持ちを戻すための小さなヒントを出します。",
    },
    {
      title: "次に見るとよさそうなもの",
      promise: "今の状態に合う次のチェックと正式版の案内を提案します。",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,_rgba(221,236,242,0.72),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_42%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container grid gap-5 py-5 md:py-12 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>クイックチェックの先</MvpPill>
              <MvpPill>正式版は準備中</MvpPill>
            </div>
            <div className="space-y-3">
              <p className="service-kicker">{result.displayName}の詳しい見え方</p>
              <h1 className="display-serif max-w-[12em] text-[2rem] leading-[1.13] text-[#2F2A28] md:text-[3rem]">
                レポートの構成を、
                <span className="block text-[#173B35]">先に静かに見られます。</span>
              </h1>
              <p className="max-w-[36rem] text-[15px] font-medium leading-7 text-[#6F625C] md:leading-8">
                ここでは章の形だけを確認できます。24問は入口で、もっと正式な読み取りは72問の正式版で進める想定です。
              </p>
            </div>
            <div className="grid gap-2.5">
              {lockedSections.slice(0, 3).map((section) => (
                <MvpCard key={section.title} className="flex items-start gap-3 rounded-[1.18rem] border-[rgba(23,59,53,0.1)] bg-white/93 p-3.5 shadow-[0_18px_38px_rgba(23,59,53,0.08)]">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE8DD] text-[13px] font-semibold text-[#D95F4E]">
                    鍵
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold leading-6 text-[#2F2A28]">{section.title}</div>
                    <p className="text-[12px] leading-6 text-[#6F625C]">{section.promise}</p>
                  </div>
                </MvpCard>
              ))}
            </div>
            <ReportIntentAction backHref={`/result?resultId=${result.id}`} nextHref="/formal-check" />
          </div>
          <div className="hidden gap-3 lg:grid">
            {lockedSections.slice(0, 3).map((section) => (
              <MvpCard key={section.title} className="space-y-2.5 rounded-[1.05rem] bg-white/90">
                <div className="service-kicker">{section.title}</div>
                <p className="text-[15px] leading-8 text-[var(--text)]">{section.promise}</p>
              </MvpCard>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-7 md:py-12">
        <div className="grid gap-3 md:grid-cols-2">
          {lockedSections.slice(3).map((section) => (
            <MvpCard key={section.title} className="space-y-2.5 rounded-[1.05rem] bg-white/90">
              <div className="service-kicker">{section.title}</div>
              <p className="text-[14px] leading-7 text-[var(--text)] md:text-[15px] md:leading-8">{section.promise}</p>
            </MvpCard>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <MvpActionLink href="/formal-check" label="正式版の案内を見る" className="rounded-full !border-[#173B35] !bg-[#173B35] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)]" />
          <MvpActionLink href={`/result?resultId=${result.id}`} label="無料結果に戻る" tone="secondary" className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none" />
        </div>
      </section>
    </main>
  );
}
