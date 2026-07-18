import type { Metadata } from "next";
import Link from "next/link";

import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ResultShareActions from "../components/ResultShareActions";
import { OpenTestingPageTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";
import { buildSelfUnderstandingReportHref } from "@/lib/yorisou/reports/loader";
import RevealExperience from "./reveal/RevealExperience";
import { EvidencePanel, ConstellationPanel, LimitsPanel, PrivacyPanel, GentleActions } from "./reveal/RevealSections";
import PrivateResultSave from "./PrivateResultSave";
import { DepthSignatureStatic } from "../components/depth-field/DepthSignature";

export const metadata: Metadata = {
  metadataBase: new URL("https://yorisou.online"),
  title: "いま色テストの結果 | Yorisou",
  description:
    "今の動き方を、24の色と名前で見てみるテスト。120Qをもとにした公開結果ページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

function buildHighlightSummary(highlights: { text: string }[]) {
  if (highlights.length === 0) {
    return "今の動き方を、公開できる範囲でやわらかく整えています。";
  }
  const summary = highlights.map((item) => item.text.replace(/。$/u, "")).join("、");
  return `${summary}傾向があります。`;
}

export default async function ResultPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = (await searchParams) || {};
  const resultId = readParam(params, "resultId");
  const overlayId = readParam(params, "overlayId");
  const confidenceBand = readParam(params, "confidence") === "medium" ? "medium" : "low";
  const payloadKey = readParam(params, "payloadKey");
  const routeContext = { resultId, overlayId, confidenceBand, payloadKey } as const;
  const compatibility = getTemporary120QResultCompatibility(routeContext);
  const resultShareHref = buildPublicResultHref("/result/share", routeContext);
  const recommendationHref = buildPublicResultHref("/recommendations", routeContext);
  const fullReportHref = compatibility.assignment
    ? buildSelfUnderstandingReportHref(compatibility.assignment.publicCode)
    : null;
  const highlightSummary = buildHighlightSummary(compatibility.highlights);
  const publicTypeLabel = compatibility.assignment ? `${compatibility.assignment.clanJapanese}のタイプ` : "いま色テストの結果";

  return (
    <main className="aix2">
      <OpenTestingPageTracker
        eventName="result_viewed"
        route="/result"
        source="result_page"
        entrySource={payloadKey ? "payload" : "public-result"}
        resultId={resultId}
        overlayId={overlayId}
        confidence={confidenceBand}
      />
      <section className="border-b border-[var(--hair)]">
        <div className="container py-8 md:py-14">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] leading-5 text-[color:var(--jade-bright)]">{compatibility.brandedTestName}</span>
              <span className="rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] leading-5 aix2-mut">{compatibility.currentStateNote}</span>
            </div>

            <div className="aix2-glass space-y-5 p-4 sm:p-7">
              <p className="sr-only">
                結果のまとめ: {compatibility.assignment ? `あなたのいま色は「${compatibility.assignment.nickname}」(${publicTypeLabel})。` : compatibility.displayLine}
                {highlightSummary} この結果は診断ではなく、いまの傾向のやわらかい整理です。以下の内容はアニメーションなしでもすべて読めます。
              </p>
              <RevealExperience stages={[
              <div key="hero" className="grid gap-5">
              <div className="relative overflow-hidden rounded-[16px] border border-[var(--hair)] bg-[rgba(26,32,29,0.5)] px-4 py-5 sm:px-5">
                {/* AIX-2 — Depth Signature: deterministic volumetric identity of
                    this public result (public-safe IDs only). */}
                <div className="mx-auto mb-2 w-[52%] max-w-[240px] sm:float-right sm:mb-0 sm:ml-4 sm:w-[38%]">
                  <div className="aix2-sig-frame">
                    <DepthSignatureStatic context={{ resultId, overlayId, confidenceBand }} className="absolute inset-0 h-full w-full" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {compatibility.heroChips.map((bullet) => (
                    <span key={bullet} className="rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.06)] px-3 py-1 text-[11px] font-semibold leading-5 text-[color:var(--jade-bright)]">
                      {bullet}
                    </span>
                  ))}
                </div>
                {compatibility.assignment ? (
                  <>
                    <p className="mt-3 text-[12px] font-semibold tracking-[0.08em] aix2-mut">あなたのいま色は、</p>
                    <h1 className="aix2-serif text-[2.4rem] font-semibold leading-[1.04] text-[color:var(--tx)] md:text-[3.1rem]">
                      {compatibility.assignment.nickname}。
                    </h1>
                    <p className="text-[14px] font-semibold leading-6 text-[color:var(--jade-bright)]">{publicTypeLabel}</p>
                  </>
                ) : (
                  <h1 className="aix2-serif mt-3 text-[2.15rem] font-semibold leading-[1.08] text-[color:var(--tx)] md:text-[3rem]">
                    {compatibility.displayLine}
                  </h1>
                )}
                <p className="mt-2 text-[14px] leading-7 aix2-mut">{compatibility.recognitionLine}</p>
              </div>

              <div className="rounded-[14px] border border-[var(--hair)] bg-[rgba(26,32,29,0.4)] px-4 py-4">
                <div className="aix2-eyebrow">今の見え方</div>
                <p className="mt-2 text-[14px] leading-7 aix2-mut">{compatibility.recognitionLine}</p>
                <p className="mt-2 text-[14px] leading-7 aix2-mut">{highlightSummary}</p>
                <p className="mt-2 text-[12px] font-semibold leading-6 text-[color:var(--jade-bright)]">
                  {compatibility.assignment ? compatibility.assignment.secondaryBadge : compatibility.placeholderText}
                </p>
              </div>
              </div>,

              <EvidencePanel key="evidence" highlights={compatibility.highlights} />,

              <ConstellationPanel
                key="constellation"
                centerLabel={compatibility.assignment ? compatibility.assignment.nickname : "いまのあなた"}
                highlights={compatibility.highlights}
              />,

              <LimitsPanel key="limits" band={confidenceBand} />,

              <GentleActions key="actions">
              <div className="space-y-3">
                <p className="text-[14px] leading-7 aix2-mut">{compatibility.gentleNextStep}</p>
              </div>

              <div className="space-y-3 rounded-[14px] border border-[var(--hair)] bg-[rgba(26,32,29,0.4)] px-4 py-4">
                <p className="aix2-eyebrow">このあと読めるもの</p>
                <p className="text-[13px] leading-6 aix2-mut">
                  まずは詳しいレポートを開き、必要なら今日のヒントをあとから見返せます。
                </p>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  {fullReportHref ? (
                    <OpenTestingTrackingLink
                      href={fullReportHref}
                      tracking={{
                        reportEvent: {
                          eventType: "intent_clicked",
                          reportType: "self-understanding-v0.2.1",
                          route: "/result",
                          source: "result_page",
                          entrySource: payloadKey ? "payload" : "public-result",
                          resultId,
                          overlayId,
                          confidence: confidenceBand,
                        },
                      }}
                      className="aix2-btn aix2-btn-primary !min-h-[48px] !text-[14px]"
                    >
                      今の詳しいレポートを読む
                    </OpenTestingTrackingLink>
                  ) : null}
                  <Link href={recommendationHref} className="aix2-btn aix2-btn-ghost !min-h-[48px] !text-[14px]">
                    今のヒントを見る
                  </Link>
                </div>
              </div>
              </GentleActions>,

              <div key="privacy-share" className="grid gap-4">
              <PrivacyPanel />
              <div className="aix2-panel space-y-3 p-5">
                <p className="aix2-eyebrow">シェア</p>
                <p className="text-[13px] leading-6 aix2-mut">
                  今の印象を短い言葉のまま残したいときだけ、ここからシェアできます。
                </p>
                <ResultShareActions
                  shareUrl={resultShareHref}
                  shareTitle={compatibility.brandedTestName}
                  shareText={`${compatibility.shareLine}\n${compatibility.currentStateNote}`}
                  shareCardUrl={resultShareHref}
                  personaId={resultId ?? "imairo-placeholder"}
                  shareSurface="result-page"
                  showCopyLink={false}
                />
              </div>

              <div className="aix2-panel p-5">
                <p className="aix2-eyebrow">公開テストについて</p>
                <p className="mt-2 text-[13px] leading-7 aix2-mut">
                  現在は公開テスト中のため、結果から詳しいレポート、保存導線まで一通り試せます。わかりにくかった点や不具合があれば、この結果ページからそのまま送ってください。
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  <Link href="/contact?topic=open-testing" className="aix2-link">感想や不具合を送る →</Link>
                  <Link href={fullReportHref ?? recommendationHref} className="aix2-link">{fullReportHref ? "詳しいレポートへ進む →" : "今のヒントを見る →"}</Link>
                </div>
              </div>
              </div>,
              ]} />
            </div>

            {compatibility.assignment ? (
              <PrivateResultSave
                context={{
                  resultId: compatibility.assignment.publicCode,
                  overlayId,
                  confidence: confidenceBand,
                  payloadKey,
                }}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
