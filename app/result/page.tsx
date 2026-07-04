import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import OpenTestingNotice from "../components/OpenTestingNotice";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ResultShareActions from "../components/ResultShareActions";
import { OpenTestingPageTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";
import { buildSelfUnderstandingReportHref } from "@/lib/yorisou/reports/loader";

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

  const summary = highlights
    .map((item) => item.text.replace(/。$/u, ""))
    .join("、");

  return `${summary}傾向があります。`;
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
  const routeContext = { resultId, overlayId, confidenceBand, payloadKey } as const;
  const compatibility = getTemporary120QResultCompatibility(routeContext);
  const resultShareHref = buildPublicResultHref("/result/share", routeContext);
  const recommendationHref = buildPublicResultHref("/recommendations", routeContext);
  const fullReportHref = compatibility.assignment
    ? buildSelfUnderstandingReportHref(compatibility.assignment.publicCode)
    : null;
  const highlightSummary = buildHighlightSummary(compatibility.highlights);
  const publicTypeLabel = compatibility.assignment
    ? `${compatibility.assignment.clanJapanese}のタイプ`
    : "いま色テストの結果";

  return (
    <main className="min-h-screen bg-[#FBFAF6] text-[#2F2A28]">
      <OpenTestingPageTracker
        eventName="result_viewed"
        route="/result"
        source="result_page"
        entrySource={payloadKey ? "payload" : "public-result"}
        resultId={resultId}
        overlayId={overlayId}
        confidence={confidenceBand}
      />
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-6 md:py-12">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>{compatibility.brandedTestName}</MvpPill>
              <MvpPill>{compatibility.currentStateNote}</MvpPill>
            </div>

            <MvpCard className="space-y-5 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
              <div
                className="space-y-3 rounded-[1.18rem] px-4 py-4 sm:px-5 sm:py-5"
                style={{
                  background: "linear-gradient(135deg, #F4FAF7 0%, #fff 100%)",
                  border: "1px solid rgba(23,59,53,0.1)",
                }}
              >
                <div className="flex flex-wrap gap-2">
                  {compatibility.heroChips.map((bullet) => (
                    <span
                      key={bullet}
                      className="rounded-full border border-[rgba(105,151,130,0.16)] bg-white/72 px-3 py-1 text-[11px] font-semibold leading-5 text-[#315F50]"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
                {compatibility.assignment ? (
                  <>
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">あなたのいま色は、</p>
                    <h1 className="display-serif text-[2.3rem] leading-[1.02] text-[#2F2A28] md:text-[3rem]">
                      {compatibility.assignment.nickname}。
                    </h1>
                    <p className="text-[14px] font-semibold leading-6 text-[#4D7A69]">{publicTypeLabel}</p>
                  </>
                ) : (
                  <h1 className="display-serif text-[2.12rem] leading-[1.06] text-[#2F2A28] md:text-[3rem]">
                    {compatibility.displayLine}
                  </h1>
                )}
                <p className="text-[14px] leading-7 text-[#6F625C]">
                  {compatibility.recognitionLine}
                </p>
              </div>

              <div
                className="rounded-[1.08rem] px-4 py-4"
                style={{
                  background: "#F4FAF7",
                  border: "1px solid rgba(23,59,53,0.1)",
                }}
              >
                <div className="service-kicker">今の見え方</div>
                <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{compatibility.recognitionLine}</p>
                <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{highlightSummary}</p>
                <p className="mt-2 text-[12px] font-semibold leading-6 text-[#4D7A69]">
                  {compatibility.assignment ? compatibility.assignment.secondaryBadge : compatibility.placeholderText}
                </p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {compatibility.highlights.map((item) => (
                  <div
                    key={`${item.label}:${item.text}`}
                    className="rounded-[1rem] px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.78)",
                      border: "1px solid rgba(23,59,53,0.08)",
                    }}
                  >
                    <p className="text-[12px] font-semibold text-[#49615B]">{item.label}</p>
                    <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-[1.08rem] border border-[rgba(23,59,53,0.08)] bg-[rgba(248,250,246,0.82)] p-4">
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">次の一歩</p>
                <p className="text-[14px] leading-7 text-[#6F625C]">{compatibility.gentleNextStep}</p>
              </div>

              <div className="space-y-3 rounded-[1.08rem] border border-[rgba(23,59,53,0.08)] bg-[rgba(255,253,249,0.74)] p-4">
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">このあと読めるもの</p>
                <p className="text-[13px] leading-6 text-[#7A7068]">
                  まずは詳しいレポートを開き、必要なら今日のヒントをあとから見返せます。
                </p>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  {fullReportHref ? (
                    <OpenTestingTrackingLink
                      href={fullReportHref}
                      tracking={{
                        reportEvent: {
                          eventType: "full_viewed",
                          reportType: "self-understanding-v0.2.1",
                          route: "/result",
                          source: "result_page",
                          entrySource: payloadKey ? "payload" : "public-result",
                          resultId,
                          overlayId,
                          confidence: confidenceBand,
                        },
                      }}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      今の詳しいレポートを読む
                    </OpenTestingTrackingLink>
                  ) : null}
                  <MvpActionLink
                    href={recommendationHref}
                    label="今のヒントを見る"
                    tone="secondary"
                    className="rounded-full border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] !text-[#315F50] shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-[1.08rem] border border-[rgba(23,59,53,0.08)] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">シェア</p>
                <p className="text-[13px] leading-6 text-[#7A7068]">
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

              <OpenTestingNotice
                body="現在は公開テスト中のため、結果から詳しいレポート、保存導線まで一通り試せます。わかりにくかった点や不具合があれば、この結果ページからそのまま送ってください。"
                primaryHref="/contact?topic=open-testing"
                primaryLabel="感想や不具合を送る"
                secondaryHref={fullReportHref ?? recommendationHref}
                secondaryLabel={fullReportHref ? "詳しいレポートへ進む" : "今のヒントを見る"}
              />
            </MvpCard>
          </div>
        </div>
      </section>
    </main>
  );
}
