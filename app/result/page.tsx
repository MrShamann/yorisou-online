import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ResultShareActions from "../components/ResultShareActions";
import LocalResultSave from "./LocalResultSave";

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
  const resultPath = buildPublicResultHref("/result", routeContext);
  const continuePath = buildPublicResultHref("/result/continue", routeContext);
  const previewHref = buildPublicResultHref("/report-preview", routeContext);
  const recommendationHref = buildPublicResultHref("/recommendations", routeContext);
  const traitChips = [
    compatibility.heroChips[0] ?? compatibility.currentStateNote,
    compatibility.heroChips[1] ?? compatibility.globalNote,
    compatibility.heroChips[2] ?? compatibility.taxonomyStatus,
  ] as [string, string, string];
  const resultLabel = compatibility.assignment
    ? `${compatibility.assignment.nickname} (${compatibility.assignment.publicCode})`
    : "いま色テストの結果";

  return (
    <main className="min-h-screen bg-[#FBFAF6] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-6 md:py-12">
          <div className="mx-auto grid max-w-[42rem] gap-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>{compatibility.brandedTestName}</MvpPill>
              <MvpPill>{compatibility.resultStatus === "assigned" ? compatibility.taxonomyStatus : "公開結果プレースホルダー"}</MvpPill>
              <MvpPill>{compatibility.currentStateNote}</MvpPill>
            </div>

            <MvpCard className="space-y-5 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
              <div
                className="space-y-4 rounded-[1.18rem] px-4 py-4"
                style={{
                  background: "linear-gradient(135deg, #F4FAF7 0%, #fff 100%)",
                  border: "1px solid rgba(23,59,53,0.1)",
                }}
              >
                <p className="service-kicker">{compatibility.brandedTestName}</p>
                <h1 className="display-serif mt-2 text-[2.28rem] leading-[1.06] text-[#2F2A28] md:text-[3rem]">
                  {compatibility.displayLine}
                </h1>
                {compatibility.codeLine ? (
                  <p className="text-[16px] font-semibold leading-8 text-[#4A3E39]">
                    {compatibility.codeLine}
                  </p>
                ) : null}
                <p className="text-[14px] leading-7 text-[#6F625C]">{compatibility.currentStateNote}</p>
                <p className="text-[14px] leading-7 text-[#6F625C]">
                  {compatibility.assignment ? compatibility.globalNote : compatibility.placeholderText}
                </p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {compatibility.heroChips.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[1rem] border border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] px-4 py-3 text-[13px] font-semibold leading-6 text-[#315F50]"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <LocalResultSave
                resultType={compatibility.brandedTestName}
                resultLabel={resultLabel}
                recognitionLine={compatibility.currentStateNote}
                baseResultId={resultId ?? undefined}
                overlayId={overlayId ?? undefined}
                confidenceBand={confidenceBand}
                payloadKey={payloadKey ?? undefined}
                traitChips={traitChips}
                context="public-result"
                resultPath={resultPath}
                continuePath={continuePath}
                className="rounded-[0.95rem] border border-[rgba(23,59,53,0.06)] bg-[rgba(248,250,246,0.9)] p-4"
              />

              <ResultShareActions
                shareUrl="/line/mini-app"
                shareTitle={compatibility.brandedTestName}
                shareText={`${compatibility.shareLine}\n${compatibility.currentStateNote}`}
                shareCardUrl={resultShareHref}
                personaId={resultId ?? "imairo-placeholder"}
                shareSurface="result-page"
              />

              <div className="grid gap-3">
                <div
                  className="rounded-[1.08rem] px-4 py-3"
                  style={{
                    background: "#F4FAF7",
                    border: "1px solid rgba(23,59,53,0.1)",
                  }}
                >
                  <div className="service-kicker">今の見え方</div>
                  <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">{compatibility.subheadline}</p>
                  <p className="mt-2 text-[12px] font-semibold leading-6 text-[#4D7A69]">
                    {compatibility.assignment
                      ? compatibility.assignment.secondaryBadge
                      : "公開できるいま色が整うまでは、プレースホルダー表示のまま保ちます。"}
                  </p>
                </div>

                <div
                  className="rounded-[1rem] px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(23,59,53,0.08)",
                  }}
                >
                  <p className="text-[12px] font-semibold text-[#6F625C]">次に見られるもの</p>
                  <p className="mt-1 text-[12px] leading-6 text-[#9A9088]">
                    詳細レポートはまだ固定本文を出さず、公開結果と案内導線だけを安全に保っています。
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <MvpActionLink
                  href={recommendationHref}
                  label="次のヒントを見る"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
                <MvpActionLink
                  href={previewHref}
                  label="詳細レポートの案内を見る"
                  tone="ghost"
                  className="rounded-full !text-[#315F50]"
                />
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <MvpActionLink
                  href="/tests"
                  label="ほかの入口を見る"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
                <MvpActionLink
                  href="/check-in"
                  label={compatibility.ctaLabel}
                  tone="ghost"
                  className="rounded-full !text-[#315F50]"
                />
              </div>
            </MvpCard>
          </div>
        </div>
      </section>
    </main>
  );
}
