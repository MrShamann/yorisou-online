import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import LocalResultSave from "./LocalResultSave";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import { buildT6PublicResultHref } from "../check-in/t6ResultModel";

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
  const payloadKey = readParam(params, "payloadKey");

  const result =
    getCurrentStateResult(resultId) ??
    currentStateCheckV1.fallbackResult;
  const overlay =
    getCurrentStateOverlay(overlayId) ??
    currentStateCheckV1.overlays.find((item) => item.id === "balancing")!;
  const routeContext = {
    resultId: result.id,
    overlayId: overlay.id,
    confidenceBand,
    payloadKey,
  } as const;
  const recommendationsHref = buildT6PublicResultHref("/recommendations", routeContext);
  const resultShareHref = buildT6PublicResultHref("/result/share", routeContext);
  const resultPath = buildT6PublicResultHref("/result", routeContext);
  const continuePath = buildT6PublicResultHref("/result/continue", routeContext);
  const resultSections = [
    {
      label: "いま見えている傾向",
      title: result.currentTendencyTitle ?? "まず、いまのあなたに近い流れ",
      body: result.currentTendencyBody ? [result.currentTendencyBody] : result.summary,
    },
    {
      label: "日常で出やすい動き方",
      title: result.dailyPatternTitle ?? "ふだんの場面では、こう出やすい",
      body: result.dailyPattern ? [result.dailyPattern] : [],
    },
    {
      label: "つまずきやすいところ",
      title: result.frictionTitle ?? "疲れやすくなるポイント",
      body: result.frictionPoint ? [result.frictionPoint] : [],
    },
    {
      label: "次に試すとよいこと",
      title: result.nextStepTitle ?? "今日から軽く試せること",
      body: result.nextStep,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_rgba(221,236,242,0.72),_transparent_34%),radial-gradient(circle_at_12%_12%,_rgba(233,120,99,0.14),_transparent_28%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_46%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-12">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>24問のチェック結果</MvpPill>
              <MvpPill>{overlay.publicLabel}</MvpPill>
              <MvpPill>今の状態から見える傾向です</MvpPill>
            </div>

            <MvpCard className="space-y-4 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
              <div className="space-y-4 rounded-[1.18rem] bg-[radial-gradient(circle_at_20%_0%,_rgba(217,164,65,0.22),_transparent_42%),linear-gradient(135deg,_#FFF7F1,_#F4FAF7)] px-4 py-4">
                <p className="service-kicker">クイックチェックの無料結果</p>
                <h1 className="display-serif mt-2 text-[2.28rem] leading-[1.06] text-[#2F2A28] md:text-[3rem]">
                  {result.publicName}
                </h1>
                <p className="text-[16px] font-semibold leading-8 text-[#4A3E39]">
                  {result.recognitionHook}
                </p>
                <p className="text-[14px] leading-7 text-[#6F625C]">{result.recognitionLine}</p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {result.traitChips.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[1rem] border border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] px-4 py-3 text-[13px] font-semibold leading-6 text-[#315F50]"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.08rem] border border-[rgba(217,164,65,0.18)] bg-[#FFF7F1] px-4 py-3">
                  <div className="service-kicker">{overlay.publicLabel}</div>
                  <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{overlay.resultSheetLine}</p>
                  <p className="mt-2 text-[12px] font-semibold leading-6 text-[#8A6D3F]">{overlay.nextStepCue}</p>
                </div>
                <div className="rounded-[1rem] border border-[rgba(217,164,65,0.18)] bg-white/82 px-4 py-3">
                  <p className="text-[13px] leading-7 text-[#6F625C]">
                    {confidenceBand === "medium"
                      ? "今回は、今の状態が少し見えやすくなっています。"
                      : "今回は、今の状態から見える傾向として軽く受け取ってください。"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {resultSections.map((section, index) => (
                  <section
                    key={section.label}
                    className="rounded-[1.12rem] border border-[rgba(105,151,130,0.16)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(23,59,53,0.055)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF7F1] text-[13px] font-bold text-[#315F50]">
                        {index + 1}
                      </span>
                      <div className="min-w-0 space-y-2">
                        <div className="service-kicker">{section.label}</div>
                        <h2 className="display-serif text-[1.35rem] leading-[1.34] text-[#2F2A28]">
                          {section.title}
                        </h2>
                        <div className="space-y-2.5">
                          {section.body.map((paragraph) => (
                            <p key={paragraph} className="text-[14px] leading-7 text-[#4A3E39]">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <MvpActionLink
                  href={recommendationsHref}
                  label="次のヒントを見る"
                  className="min-h-[56px] rounded-full !border-[#173B35] !bg-[#173B35] text-[16px] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.24)] hover:!bg-[#0F2F2B]"
                />
                <MvpActionLink
                  href={resultShareHref}
                  label="シェア"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
                <MvpActionLink
                  href="/check-in"
                  label="もう一度チェックする"
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
                payloadKey={payloadKey ?? undefined}
                traitChips={result.traitChips}
                context="public-result"
                resultPath={resultPath}
                continuePath={continuePath}
                className="rounded-[0.95rem] border border-[rgba(23,59,53,0.06)] bg-[rgba(248,250,246,0.9)] p-4"
              />


            </MvpCard>
          </div>
        </div>
      </section>
    </main>
  );
}
