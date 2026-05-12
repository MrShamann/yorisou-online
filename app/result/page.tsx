import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import LocalResultSave from "./LocalResultSave";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../check-in/currentStateCheckV1";

export const metadata: Metadata = {
  title: "無料結果 | Yorisou",
  description:
    "今の状態チェックの無料結果として、今のあなたに近いモードと短い認識の一行を受け取れる Yorisou の結果ページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const resultId = readParam(params, "resultId") ?? currentStateCheckV1.scoring.fallbackResultId;
  const overlayId = readParam(params, "overlayId");
  const confidenceBand = readParam(params, "confidence") === "medium" ? "medium" : "low";

  const result =
    getCurrentStateResult(resultId) ??
    currentStateCheckV1.fallbackResult;
  const overlay =
    getCurrentStateOverlay(overlayId) ??
    currentStateCheckV1.overlays.find((item) => item.id === "balancing")!;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_rgba(221,236,242,0.72),_transparent_34%),radial-gradient(circle_at_12%_12%,_rgba(233,120,99,0.14),_transparent_28%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_46%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-12">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>24問のチェック結果</MvpPill>
              <MvpPill>{overlay.publicLabel}</MvpPill>
              <MvpPill>今見えている範囲の傾向です</MvpPill>
            </div>

            <MvpCard className="space-y-4 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
              <div className="rounded-[1.18rem] bg-[radial-gradient(circle_at_20%_0%,_rgba(217,164,65,0.22),_transparent_42%),linear-gradient(135deg,_#FFF7F1,_#F4FAF7)] px-4 py-4">
                <p className="service-kicker">クイックチェックの無料結果</p>
                <h1 className="display-serif mt-2 text-[2.28rem] leading-[1.06] text-[#2F2A28] md:text-[3rem]">
                  {result.publicName}
                </h1>
                <p className="mt-3 text-[15px] font-semibold leading-8 text-[#4A3E39]">
                  {result.recognitionLine}
                </p>
                <p className="mt-3 text-[13px] leading-7 text-[#6F625C]">{overlay.publicLine}</p>
              </div>

              <div className="grid gap-2.5">
                {result.traitChips.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[1rem] border border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] px-4 py-3 text-[14px] font-semibold leading-7 text-[#315F50]"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="rounded-[1rem] border border-[rgba(217,164,65,0.18)] bg-[#FFF7F1] px-4 py-3">
                <p className="text-[13px] leading-7 text-[#6F625C]">
                  {confidenceBand === "medium"
                    ? "今見えている範囲の傾向です。"
                    : "今見えている範囲の傾向です。"}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <MvpActionLink
                  href="/report-preview"
                  label="この結果をもう少し詳しく見る"
                  className="min-h-[56px] rounded-full !border-[#173B35] !bg-[#173B35] text-[16px] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.24)] hover:!bg-[#0F2F2B]"
                />
                <MvpActionLink
                  href="/result/share"
                  label="シェア"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
                <MvpActionLink
                  href="/check-in"
                  label="もう一度チェック"
                  tone="ghost"
                  className="rounded-full !text-[#315F50]"
                />
              </div>

              <LocalResultSave
                resultType="24Q結果"
                resultLabel={result.publicName}
                recognitionLine={result.recognitionLine}
                baseResultId={result.id}
                overlayId={overlay.id}
                confidenceBand={confidenceBand}
                traitChips={result.traitChips}
                context="public-result"
                className="rounded-[0.95rem] border border-[rgba(23,59,53,0.06)] bg-[rgba(248,250,246,0.9)] p-4"
              />

              <p className="rounded-[0.95rem] bg-[#FFF7F1] px-3.5 py-2.5 text-[12px] leading-6 text-[#6F625C]">
                これは24問のクイックチェック結果です。無料結果では今の流れを短く受け取れます。正式版の72問は準備中です。
              </p>
            </MvpCard>
          </div>
        </div>
      </section>
    </main>
  );
}
