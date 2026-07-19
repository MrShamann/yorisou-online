import type { Metadata } from "next";
import Link from "next/link";

import DteEventTracker from "../components/DteEventTracker";
import { OpenTestingReportTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ReportIntentAction from "./ReportIntentAction";
import { buildSelfUnderstandingPreviewByCode, buildSelfUnderstandingReportHref } from "@/lib/yorisou/reports/loader";
import { DepthSignatureStatic } from "../components/depth-field/DepthSignature";

export const metadata: Metadata = {
  title: "詳細レポート | Yorisou",
  description:
    "いま色テスト by よりそう の公開結果から、詳しい読み解きの見方と次のヒントを確認できるページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

function sanitizePreviewParagraphs(paragraphs: string[], publicCode: string, clanEnglish?: string) {
  const identityPattern = clanEnglish ? `${clanEnglish} / ${publicCode}` : publicCode;

  return paragraphs.filter((paragraph) => {
    if (paragraph.includes(identityPattern)) return false;
    if (paragraph.includes("コードは診断名ではなく")) return false;
    if (/^Secondary badge:/i.test(paragraph)) return false;
    return true;
  });
}

const teaserBullets = [
  "どんな場面で力を使いやすいか",
  "どんなときに少し立ち止まりやすいか",
  "次に整えるとよさそうな小さなヒント",
] as const;

export default async function ReportPreviewPage({
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
  const resultHref = buildPublicResultHref("/result", routeContext);
  const recommendationsHref = buildPublicResultHref("/recommendations", routeContext);
  const fullReportHref = compatibility.assignment
    ? buildSelfUnderstandingReportHref(compatibility.assignment.publicCode)
    : null;
  const reportPreview = compatibility.assignment
    ? (() => {
        try {
          const preview = buildSelfUnderstandingPreviewByCode(compatibility.assignment!.publicCode);
          return {
            ...preview,
            paragraphs: sanitizePreviewParagraphs(
              preview.paragraphs,
              compatibility.assignment!.publicCode,
              compatibility.assignment!.clanEnglish,
            ),
          };
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <main className="aix2">
      <DteEventTracker
        event="report_preview_viewed"
        surface="report_preview"
        source="report_preview_page"
        locale="ja"
      />
      <OpenTestingReportTracker
        eventType="preview_viewed"
        reportType="self-understanding-v0.2.1"
        route="/report-preview"
        source="report_preview_page"
        entrySource="report-preview"
        resultId={resultId}
        overlayId={overlayId}
        confidence={confidenceBand}
      />
      <DteEventTracker
        event="paywall_visible"
        surface="report_preview"
        source="report_preview_page"
        locale="ja"
      />

      <section className="border-b border-[var(--hair)]">
        <div className="container py-7 md:py-10">
          <div className="mx-auto max-w-[44rem] space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1 text-[11px] font-semibold text-[#5ce6b4]">
                詳しい読み解き
              </span>
            </div>

            <div className="space-y-3">
              {/* AIX-1 — continuity: the same State Signature carries from the
                  result into the deeper reading (public-safe IDs only). */}
              <div className="aix2-sig-frame float-right ml-4 w-[26%] max-w-[130px]" aria-hidden="true">
                <DepthSignatureStatic
                  context={{ resultId, overlayId, confidenceBand }}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="aix2-eyebrow">{compatibility.brandedTestName}</p>
              <h1 className="aix2-serif font-semibold text-[2rem] leading-[1.12] text-[color:var(--tx)] md:text-[2.8rem]">
                見えてきたのは、
                <br className="hidden sm:block" />
                <span className="text-[color:var(--jade-bright)]">今の動き方の輪郭です。</span>
              </h1>
              <p className="max-w-[38rem] text-[15px] leading-8 aix2-mut">
                今回の結果では、どんな場面で力を使いやすいか、どんなときに少し立ち止まりやすいか、次に整えるとよさそうな小さなヒントを見ています。
              </p>
              <p className="max-w-[38rem] text-[15px] leading-8 aix2-mut">
                詳しい読み解きは公開プレビューだけを先に表示しています。本編や拡張は、このプレビュー画面ではまだ開きません。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(compatibility.assignment
                ? compatibility.heroChips
                : ["120問ベース", "今の動き方", "準備中"] as const).map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.06)] px-3 py-1.5 text-[12px] font-medium text-[#aec3b7]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[44rem] space-y-10">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <p className="aix2-eyebrow">いま受け取れるもの</p>
              <div className="aix2-panel p-5 md:p-6">
                {reportPreview ? (
                  <div className="space-y-3">
                    {reportPreview.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-[14px] leading-8 aix2-mut">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-[15px] leading-8 text-[color:var(--tx)]">
                      {compatibility.displayLine}という見え方を起点に、今の動き方をやわらかく見返すための入口を整えています。
                    </p>
                    <p className="mt-3 text-[14px] leading-7 aix2-mut">
                      {compatibility.recognitionLine}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="aix2-eyebrow">この先で見ていくこと</p>
              <div className="aix2-panel p-5 md:p-6">
                <ul className="space-y-2.5">
                  {teaserBullets.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-7 text-[color:var(--tx)]">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--jade)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {fullReportHref ? (
            <div className="aix2-panel p-5 md:p-6">
              <p className="aix2-eyebrow">オープンテスト中の全文</p>
              <p className="mt-3 text-[14px] leading-7 aix2-mut">
                現在はオープンテスト中のため、公開プレビューの先にある本編と拡張も読めます。内部メモは含みません。
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <OpenTestingTrackingLink
                  href={fullReportHref}
                  tracking={{
                    reportEvent: {
                      eventType: "intent_clicked",
                      reportType: "self-understanding-v0.2.1",
                      route: "/report-preview",
                      source: "report_preview_page",
                      entrySource: "report-preview",
                      resultId,
                      overlayId,
                      confidence: confidenceBand,
                    },
                  }}
                  className="aix2-btn aix2-btn-primary !min-h-[48px] !text-[14px]"
                >
                  今の詳しいレポートを読む
                </OpenTestingTrackingLink>
                <Link
                  href={resultHref}
                  className="aix2-btn aix2-btn-ghost !min-h-[48px] !text-[14px]"
                >
                  結果にもどる
                </Link>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="aix2-eyebrow">読み方のトーン</p>
            <div className="border-l-2 border-[var(--hair-2)] pl-5">
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">
                ここでお届けするのは、今の自分を決めつけるための答えではなく、少し見返しやすくするための読み方です。
              </p>
              <p className="mt-3 text-[14px] leading-7 aix2-mut">
                受け取りやすい形を先に整えながら、詳しい本文は焦らず準備していきます。
              </p>
            </div>
          </div>

          <ReportIntentAction
            backHref={resultHref}
            backLabel="結果にもどる"
            secondaryHref={fullReportHref ?? recommendationsHref}
            secondaryLabel={fullReportHref ? "今の詳しいレポートを読む" : "今のヒントを見る"}
            resultContext={{
              ...(resultId ? { resultId } : {}),
              ...(overlayId ? { overlayId } : {}),
              confidenceBand,
              ...(payloadKey ? { payloadKey } : {}),
            }}
          />

          <div className="aix2-panel">
            <p className="text-[11px] leading-7 aix2-faint">
              このページでは、詳しい本文そのものではなく、公開プレビューと次のヒントだけを先に整えています。
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[12px] aix2-faint">
              <Link href={resultHref} className="hover:underline" data-report-preview="not-now-free-result">
                結果にもどる
              </Link>
              <span className="aix2-faint">·</span>
              <Link href={recommendationsHref} className="hover:underline">
                今のヒントを見る
              </Link>
              <span className="aix2-faint">·</span>
              <Link href="/check-in" className="hover:underline">
                もう一度チェックする
              </Link>
            </div>
          </div>

          <div className="aix2-panel p-5">
            <p className="aix2-eyebrow">公開テストについて</p>
            <p className="mt-2 text-[13px] leading-7 aix2-mut">
              公開テスト中のため、プレビュー体験そのもののわかりやすさも確認しています。ここで伝わりにくかった点や、本文へ進む導線で迷った点があればそのまま送ってください。
            </p>
            <Link href="/contact?topic=open-testing" className="aix2-link mt-4 inline-block">プレビューの感想を送る →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
