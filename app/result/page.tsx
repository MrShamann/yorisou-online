import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ResultShareActions from "../components/ResultShareActions";
import LocalResultSave from "./LocalResultSave";

export const metadata: Metadata = {
  title: "無料結果 | Yorisou",
  description:
    "120問チェックイン後の互換表示として、安全なプレースホルダー結果を確認できる Yorisou の結果ページです。",
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
  const resultId = readParam(params, "resultId");
  const overlayId = readParam(params, "overlayId");
  const confidenceBand = readParam(params, "confidence") === "medium" ? "medium" : "low";
  const payloadKey = readParam(params, "payloadKey");
  const routeContext = {
    resultId,
    overlayId,
    confidenceBand,
    payloadKey,
  } as const;
  const compatibility = getTemporary120QResultCompatibility(routeContext);
  const resultShareHref = buildPublicResultHref("/result/share", routeContext);
  const resultPath = buildPublicResultHref("/result", routeContext);
  const continuePath = buildPublicResultHref("/result/continue", routeContext);
  const genericTraitChips = ["120問ベース", "分類保留", "互換表示"] as const;
  const resultSections = [
    {
      label: "現在の表示状態",
      title: "正式な結果分類はまだ公開していません",
      body: [compatibility.placeholderText],
    },
    {
      label: "この画面で分かること",
      title: "120問ベースの互換表示です",
      body: ["回答は120問フローで受け取り済みです。承認前のため、分類名や個別の解釈文はここでは出しません。"],
    },
    {
      label: "保存について",
      title: "この端末にだけ残せます",
      body: ["簡易保存では公開向けの互換状態だけを残します。回答内容や未承認の詳細分類は保存しません。"],
    },
    {
      label: "次の段階",
      title: "正式仕様の承認後に結果面を更新します",
      body: ["Edward / Control Agent の承認後に、120問の正式結果契約へ差し替える予定です。"],
    },
  ] as const;
  const storyHref = buildPublicResultHref("/result/share", {
    ...routeContext,
    payloadKey,
  });

  return (
    <main className="min-h-screen bg-[#FBFAF6] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-12">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>120問の互換表示</MvpPill>
              <MvpPill>{compatibility.taxonomyStatus}</MvpPill>
              <MvpPill>公開分類は保留中です</MvpPill>
            </div>

            <MvpCard className="space-y-4 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
              <div
                className="space-y-4 rounded-[1.18rem] px-4 py-4"
                style={{
                  background: "linear-gradient(135deg, #F4FAF7 0%, #fff 100%)",
                  border: "1px solid rgba(23,59,53,0.1)",
                }}
              >
                <p className="service-kicker">120問チェックインの暫定結果表示</p>
                <h1 className="display-serif mt-2 text-[2.28rem] leading-[1.06] text-[#2F2A28] md:text-[3rem]">
                  120問結果の互換表示
                </h1>
                <p className="text-[16px] font-semibold leading-8 text-[#4A3E39]">
                  正式な結果分類はまだ承認されていません。
                </p>
                <p className="text-[14px] leading-7 text-[#6F625C]">{compatibility.placeholderText}</p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {genericTraitChips.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[1rem] border border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] px-4 py-3 text-[13px] font-semibold leading-6 text-[#315F50]"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <LocalResultSave
                resultType="120Q結果互換表示"
                resultLabel="120問結果（分類保留）"
                recognitionLine={compatibility.placeholderText}
                baseResultId={resultId ?? undefined}
                overlayId={overlayId ?? undefined}
                confidenceBand={confidenceBand}
                payloadKey={payloadKey ?? undefined}
                traitChips={[...genericTraitChips]}
                context="public-result"
                resultPath={resultPath}
                continuePath={continuePath}
                className="rounded-[0.95rem] border border-[rgba(23,59,53,0.06)] bg-[rgba(248,250,246,0.9)] p-4"
              />

              <ResultShareActions
                shareUrl="/line/mini-app"
                shareTitle="Yorisou — 120問結果互換表示"
                shareText={"Yorisouで120問チェックインを完了しました。\n正式な結果分類は承認待ちのため、現在は互換表示のみを共有します。"}
                shareCardUrl={resultShareHref}
                personaId={resultId ?? "yorisou-120q-placeholder"}
                shareSurface="result-page"
              />

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
                      120問結果の互換カード
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {genericTraitChips.map((chip) => (
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

                  <a
                    href={`${storyHref}${storyHref.includes("?") ? "&" : "?"}story=1`}
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

              <div
                className="rounded-[1rem] px-4 py-3.5"
                style={{
                  background: "rgba(23,59,53,0.03)",
                  border: "1px solid rgba(23,59,53,0.07)",
                }}
              >
                <p className="text-[12px] font-semibold text-[#6F625C]">くわしいレポートは承認待ちです</p>
                <p className="mt-1 text-[12px] leading-6 text-[#9A9088]">今は安全な互換表示だけを維持しています。</p>
              </div>

              <div className="grid gap-3">
                <div
                  className="rounded-[1.08rem] px-4 py-3"
                  style={{
                    background: "#F4FAF7",
                    border: "1px solid rgba(23,59,53,0.1)",
                  }}
                >
                  <div className="service-kicker">互換状態の確認</div>
                  <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{compatibility.placeholderText}</p>
                  <p className="mt-2 text-[12px] font-semibold leading-6 text-[#4D7A69]">
                    正式な結果分類は Edward / Control Agent 承認後に反映します。
                  </p>
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
                      ? "今回は互換表示の導線が安定して確認できる状態です。"
                      : "今回は軽い導線確認として互換表示を受け取ってください。"}
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
            </MvpCard>
          </div>
        </div>
      </section>
    </main>
  );
}
