import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import LocalResultSave from "./LocalResultSave";
import ResultShareActions from "../components/ResultShareActions";
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
    <main className="min-h-screen bg-[#FBFAF6] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-12">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>24問のチェック結果</MvpPill>
              <MvpPill>{overlay.publicLabel}</MvpPill>
              <MvpPill>今の状態から見える傾向です</MvpPill>
            </div>

            <MvpCard className="space-y-4 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
              {/* A. Identity card */}
              <div
                className="space-y-4 rounded-[1.18rem] px-4 py-4"
                style={{
                  background: "linear-gradient(135deg, #F4FAF7 0%, #fff 100%)",
                  border: "1px solid rgba(23,59,53,0.1)",
                }}
              >
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

              {/* B. Save / share / continue zone */}
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

              <ResultShareActions
                shareUrl="/line/mini-app"
                shareTitle="Yorisou — 今の状態チェック"
                shareText={"Yorisouで今の状態をチェックしました。\n短いチェックで、自分の今の流れを整理できます。"}
                shareCardUrl={resultShareHref}
                personaId={result.id}
                shareSurface="result-page"
              />

              {/* Instagram-oriented card — screenshot-save path */}
              <details className="overflow-hidden rounded-[1.18rem] border border-[rgba(23,59,53,0.1)] bg-white/95">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A9088]">
                      Instagram用カード
                    </p>
                    <p className="mt-0.5 text-[13px] leading-6 text-[#6F625C]">
                      スクリーンショットして投稿できます
                    </p>
                  </div>
                  <span className="shrink-0 text-[18px] leading-none text-[#B0A89E]">›</span>
                </summary>

                <div className="px-4 pb-5 pt-1">
                  {/* Card preview */}
                  <div
                    className="rounded-[1.3rem] px-5 py-6"
                    style={{ background: "#173B35" }}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[10px] font-semibold tracking-[0.22em]"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        YORISOU
                      </p>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.12em]"
                        style={{
                          border: "1px solid rgba(255,255,255,0.16)",
                          color: "rgba(255,255,255,0.45)",
                        }}
                      >
                        公開結果カード
                      </span>
                    </div>
                    <h2
                      className="display-serif mt-4 leading-[1.18]"
                      style={{ fontSize: "1.65rem", color: "#fff" }}
                    >
                      {result.publicName}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.traitChips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full px-2.5 py-1 text-[11px]"
                          style={{
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <p
                      className="mt-5 text-[10px] tracking-[0.1em]"
                      style={{ color: "rgba(255,255,255,0.32)" }}
                    >
                      yorisou.online
                    </p>
                  </div>

                  {/* Open story card page */}
                  <a
                    href={`/result/share?story=1&resultId=${encodeURIComponent(result.id)}&overlayId=${encodeURIComponent(overlay.id)}&confidence=${confidenceBand}`}
                    className="mt-3 flex min-h-[48px] w-full items-center justify-center rounded-[1rem] text-[14px] font-semibold transition active:scale-[0.975]"
                    style={{
                      background: "#173B35",
                      color: "#fff",
                    }}
                  >
                    カードページを開く →
                  </a>
                  <p className="mt-2 text-center text-[11px] leading-6 text-[#9A9088]">
                    スクリーンショットしてInstagramストーリーズに投稿できます
                  </p>
                </div>
              </details>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <MvpActionLink
                  href="/tests"
                  label="ほかの入口を見る"
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

              {/* C. Report teaser */}
              <div
                className="rounded-[1rem] px-4 py-3.5"
                style={{
                  background: "rgba(23,59,53,0.03)",
                  border: "1px solid rgba(23,59,53,0.07)",
                }}
              >
                <p className="text-[12px] font-semibold text-[#6F625C]">くわしいレポートは準備中</p>
                <p className="mt-1 text-[12px] leading-6 text-[#9A9088]">今は無料の結果だけ見られます。</p>
              </div>

              {/* Overlay context */}
              <div className="grid gap-3">
                <div
                  className="rounded-[1.08rem] px-4 py-3"
                  style={{
                    background: "#F4FAF7",
                    border: "1px solid rgba(23,59,53,0.1)",
                  }}
                >
                  <div className="service-kicker">{overlay.publicLabel}</div>
                  <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{overlay.resultSheetLine}</p>
                  <p className="mt-2 text-[12px] font-semibold leading-6 text-[#4D7A69]">{overlay.nextStepCue}</p>
                </div>
                <div
                  className="rounded-[1rem] px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(23,59,53,0.08)",
                  }}
                >
                  <p className="text-[13px] leading-7 text-[#6F625C]">
                    {confidenceBand === "medium"
                      ? "今回は、今の状態が少し見えやすくなっています。"
                      : "今回は、今の状態から見える傾向として軽く受け取ってください。"}
                  </p>
                </div>
              </div>

              {/* Detail sections */}
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
            </MvpCard>
          </div>
        </div>
      </section>
    </main>
  );
}
