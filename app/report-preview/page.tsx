import type { Metadata } from "next";
import Link from "next/link";

import DteEventTracker from "../components/DteEventTracker";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ReportIntentAction from "./ReportIntentAction";

export const metadata: Metadata = {
  title: "詳細レポート | Yorisou",
  description:
    "120問結果の正式レポート承認前に、導線互換表示だけを確認できる Yorisou のレポートプレビューページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

const tocItems = [
  { n: 1, title: "結果契約の確認", status: "visible" as const },
  { n: 2, title: "正式分類の差し替え", status: "partial" as const },
  { n: 3, title: "詳細レポート本文", status: "locked" as const },
  { n: 4, title: "行動提案セクション", status: "locked" as const },
  { n: 5, title: "保存用まとめ", status: "locked" as const },
] as const;

const lockedCards = [
  {
    title: "詳細レポート本文",
    description: "正式な120問レポート本文は、Control Agent 承認後に差し替えます。",
  },
  {
    title: "行動提案セクション",
    description: "承認前のため、個別の提案や解釈はここでは表示しません。",
  },
  {
    title: "保存用まとめ",
    description: "正式仕様が固まるまで、共有・保存向けの最終本文は公開しません。",
  },
] as const;

const receiveBullets = [
  "120問フローの完了導線",
  "公開結果ページへの戻り導線",
  "承認待ち状態の明示",
  "保存・共有の互換動作",
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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,_rgba(221,236,242,0.6),_transparent_32%),linear-gradient(180deg,#FFF7F1_0%,#fffdf9_44%,#F4FAF7_100%)] text-[#2F2A28]">
      <DteEventTracker
        event="report_preview_viewed"
        surface="report_preview"
        source="report_preview_page"
        locale="ja"
      />
      <DteEventTracker
        event="paywall_visible"
        surface="report_preview"
        source="report_preview_page"
        locale="ja"
      />

      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-9 md:py-14">
          <div className="mx-auto max-w-[44rem] space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-[rgba(105,151,130,0.22)] bg-[#F4FAF7] px-3 py-1 text-[11px] font-semibold text-[#315F50]">
                詳細レポート
              </span>
              <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.1)] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#6F625C]">
                RESULT_TAXONOMY_NOT_APPROVED
              </span>
            </div>

            <div className="space-y-3">
              <p className="service-kicker">120問結果の次に進む導線を確認できます</p>
              <h1 className="display-serif text-[2rem] leading-[1.18] text-[#2F2A28] md:text-[2.8rem]">
                120問結果の正式レポートは、<br className="hidden sm:block" />
                <span className="text-[#173B35]">承認後に差し替え予定です。</span>
              </h1>
              <p className="max-w-[38rem] text-[15px] leading-8 text-[#6F625C]">
                {compatibility.placeholderText}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["120問ベース", "互換表示", "分類保留", "詳細仕様待ち"] as const).map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-full border border-[rgba(23,59,53,0.12)] bg-white/90 px-3 py-1.5 text-[12px] font-medium text-[#49615B] shadow-[0_4px_10px_rgba(23,59,53,0.04)]"
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
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">今の状態</p>
            <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_14px_28px_rgba(23,59,53,0.06)] md:p-6">
              <p className="text-[15px] leading-8 text-[#2F2A28]">
                正式な結果分類と詳細レポート本文はまだ承認されていません。この画面では、120問フロー完了後の互換導線だけを維持しています。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">レポート導線の互換状態</p>
            <div className="rounded-[1.35rem] overflow-hidden border border-[rgba(23,59,53,0.1)] bg-white/90 shadow-[0_12px_28px_rgba(23,59,53,0.05)]">
              {tocItems.map((item) => (
                <div
                  key={item.n}
                  className="flex items-center gap-3 border-b border-[rgba(23,59,53,0.06)] px-4 py-3 last:border-b-0"
                >
                  <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    item.status === "locked"
                      ? "bg-[rgba(23,59,53,0.07)] text-[#8A9E98]"
                      : "bg-[#173B35] text-white"
                  }`}>
                    {item.status === "locked" ? "🔒" : item.n}
                  </span>
                  <span className={`flex-1 text-[13px] leading-6 ${
                    item.status === "locked" ? "text-[#A09890]" : "font-medium text-[#2F2A28]"
                  }`}>
                    {item.title}
                  </span>
                  <span className={`shrink-0 text-[11px] font-medium ${
                    item.status === "visible"
                      ? "text-[#315F50]"
                      : item.status === "partial"
                        ? "text-[#7A9A8E]"
                        : "text-[#C4BCB6]"
                  }`}>
                    {item.status === "visible" ? "互換表示" : item.status === "partial" ? "保留中" : "承認後に開放予定"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">詳細本文の状態</p>
            <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/92 shadow-[0_14px_28px_rgba(23,59,53,0.06)]">
              <div className="p-5 md:p-6">
                <p className="text-[15px] leading-8 text-[#2F2A28]">
                  120問の結果契約はこの時点で有効ですが、公開用の分類名・章本文・詳細レポート文面は承認前です。
                </p>
                <p className="mt-4 text-[15px] leading-8 text-[#2F2A28] opacity-60">
                  そのため、この画面では導線確認用のプレースホルダーだけを表示し、個別解釈や有料レポート本文は出しません。
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(252,250,245,0.96)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4">
                <span className="rounded-full border border-[rgba(23,59,53,0.12)] bg-white/96 px-4 py-2 text-[12px] font-semibold text-[#315F50] shadow-[0_6px_16px_rgba(23,59,53,0.1)]">
                  正式本文は承認後に差し替えます
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">保留中の章</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lockedCards.map((card) => (
                <div
                  key={card.title}
                  className="space-y-2 rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/80 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] opacity-50">🔒</span>
                    <p className="text-[13px] font-semibold text-[#49615B]">{card.title}</p>
                  </div>
                  <p className="text-[12px] leading-6 text-[#7A7068]">{card.description}</p>
                  <p className="text-[11px] font-medium text-[#A09890]">正式仕様承認後に有効化予定です</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-5 shadow-[0_12px_28px_rgba(23,59,53,0.05)] md:p-6">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">正式レポート承認後に差し替わる項目</p>
            <ul className="space-y-2.5">
              {receiveBullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] leading-7 text-[#2F2A28]">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#173B35]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ReportIntentAction
            backHref={resultHref}
            sampleHref="/reports/sample"
            resultContext={{
              ...(resultId ? { resultId } : {}),
              ...(overlayId ? { overlayId } : {}),
              confidenceBand,
              ...(payloadKey ? { payloadKey } : {}),
            }}
          />

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-[#8A7764]">
            <Link href={resultHref} className="hover:underline" data-report-preview="not-now-free-result">
              今は無料結果だけ見る
            </Link>
            <span className="text-[#D4CCC6]">·</span>
            <Link href="/check-in" className="hover:underline">
              もう一度チェックする
            </Link>
            <span className="text-[#D4CCC6]">·</span>
            <Link href="/tests" className="hover:underline">
              他のチェックを見る
            </Link>
          </div>

          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.08)] bg-white/60 px-5 py-4">
            <p className="text-[11px] leading-7 text-[#8A8078]">
              このプレビューは正式な結果分類や有料レポート本文の代わりではありません。現在は、120問フロー後の安全な互換導線だけを維持しています。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
