import type { Metadata } from "next";
import Link from "next/link";

import DteEventTracker from "../components/DteEventTracker";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import { buildT6PublicResultHref } from "../check-in/t6ResultModel";
import ReportIntentAction from "./ReportIntentAction";

export const metadata: Metadata = {
  title: "詳細レポート | Yorisou",
  description:
    "クイックチェックの結果をもとに、感情・関係・行動・回復の視点から今の状態を整理する詳細レポートです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

const tocItems = [
  { n: 1, title: "今の状態の要約", status: "visible" as const },
  { n: 2, title: "深い状態解釈", status: "partial" as const },
  { n: 3, title: "感情の負荷分析", status: "locked" as const },
  { n: 4, title: "人間関係・距離感のレンズ", status: "locked" as const },
  { n: 5, title: "行動と先延ばしのパターン", status: "locked" as const },
  { n: 6, title: "内側の葛藤マップ", status: "locked" as const },
  { n: 7, title: "回復しやすい整え方", status: "locked" as const },
  { n: 8, title: "7日間の小さな行動計画", status: "locked" as const },
  { n: 9, title: "30日間の方向性", status: "locked" as const },
  { n: 10, title: "振り返りの問い", status: "locked" as const },
  { n: 11, title: "推薦・リソースのヒント", status: "locked" as const },
  { n: 12, title: "次に見るべき変化", status: "locked" as const },
  { n: 13, title: "注意書き・限界", status: "visible" as const },
  { n: 14, title: "保存用まとめ", status: "locked" as const },
] as const;

const lockedCards = [
  {
    title: "感情の負荷分析",
    description: "どの場面でエネルギーが消費されやすいか、感情的な負荷のパターンを整理します。",
  },
  {
    title: "人間関係・距離感のレンズ",
    description: "今の人との距離の取り方が、自分にとってどんな意味を持っているかを読み解きます。",
  },
  {
    title: "7日間の小さな行動計画",
    description: "今の状態に合わせた、7日間の具体的な小さな行動案を提示します。",
  },
  {
    title: "30日間の方向性",
    description: "1ヶ月のスパンで、今の状態をどの方向に整えていくかの見通しを整理します。",
  },
  {
    title: "推薦・リソースのヒント",
    description: "今のあなたの状態に合わせて参照できる考え方や整理の入口を提案します。",
  },
] as const;

const receiveBullets = [
  "今の状態の深い読み解き",
  "感情・関係・行動のパターン整理",
  "7日間の小さな行動計画",
  "30日間の見直しポイント",
  "次に見るべき変化のサイン",
] as const;

export default async function ReportPreviewPage({
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
    getCurrentStateResult(resultId) ?? currentStateCheckV1.fallbackResult;
  const overlay =
    getCurrentStateOverlay(overlayId) ??
    currentStateCheckV1.overlays.find((item) => item.id === "balancing")!;
  const routeContext = {
    resultId: result.id,
    overlayId: overlay.id,
    confidenceBand,
    payloadKey,
  } as const;
  const resultHref = buildT6PublicResultHref("/result", routeContext);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,_rgba(221,236,242,0.6),_transparent_32%),linear-gradient(180deg,#FFF7F1_0%,#fffdf9_44%,#F4FAF7_100%)] text-[#2F2A28]">
      {/* Page-level event tracking */}
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

      {/* ── 1. Hero ── */}
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-9 md:py-14">
          <div className="mx-auto max-w-[44rem] space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-[rgba(105,151,130,0.22)] bg-[#F4FAF7] px-3 py-1 text-[11px] font-semibold text-[#315F50]">
                詳細レポート
              </span>
              <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.1)] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#6F625C]">
                プロトタイプ / サンプル表示
              </span>
            </div>

            <div className="space-y-3">
              <p className="service-kicker">あなたの詳細レポートを確認できます</p>
              <h1 className="display-serif text-[2rem] leading-[1.18] text-[#2F2A28] md:text-[2.8rem]">
                クイックチェックの結果をもとに、<br className="hidden sm:block" />
                <span className="text-[#173B35]">今の状態を深く整理する。</span>
              </h1>
              <p className="max-w-[38rem] text-[15px] leading-8 text-[#6F625C]">
                感情・関係・行動・回復の視点から整理します。
              </p>
            </div>

            {/* Volume badges */}
            <div className="flex flex-wrap gap-2">
              {(["約10,000字", "14セクション", "7日間・30日間の行動整理", "保存して見返せる構成"] as const).map((label) => (
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

          {/* ── 2. Visible summary ── */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">今の状態の要約</p>
            <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_14px_28px_rgba(23,59,53,0.06)] md:p-6">
              <p className="text-[15px] leading-8 text-[#2F2A28]">
                今のあなたは、人との関わりを避けたいというより、関係を大切にしようとする中で、返信・予定・気づかいの負荷が少し重なっている状態かもしれません。すぐに大きな判断をするより、まずは「どの場面で疲れが出やすいか」を分けて見ることが助けになります。
              </p>
            </div>
          </div>

          {/* ── 3. Table of contents ── */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">レポートの構成（14セクション）</p>
            <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 divide-y divide-[rgba(23,59,53,0.06)] overflow-hidden shadow-[0_12px_28px_rgba(23,59,53,0.05)]">
              {tocItems.map((item) => (
                <div
                  key={item.n}
                  className="flex items-center gap-3 px-4 py-3"
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
                    {item.status === "visible"
                      ? "表示中"
                      : item.status === "partial"
                      ? "一部表示"
                      : "詳細レポートで読めます"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. Partial deeper section with fade ── */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">深い状態解釈 — 一部表示</p>
            <div className="relative rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/92 overflow-hidden shadow-[0_14px_28px_rgba(23,59,53,0.06)]">
              <div className="p-5 md:p-6">
                <p className="text-[15px] leading-8 text-[#2F2A28]">
                  あなたの回答では、「関係を雑にしたくない気持ち」と「少し距離を置いて整えたい感覚」が同時に見えています。これは矛盾ではなく、今の状態を理解するうえで大切な手がかりです。
                </p>
                <p className="mt-4 text-[15px] leading-8 text-[#2F2A28] opacity-60">
                  この状態は、疲れた人間関係を断ち切ろうとしているのではなく、今の関わり方のリズムを少し変えたいというサインである可能性が高くあります。距離を取ることと、関係を終わらせることは、まったく…
                </p>
              </div>
              {/* Fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(252,250,245,0.96)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4">
                <span className="rounded-full border border-[rgba(23,59,53,0.12)] bg-white/96 px-4 py-2 text-[12px] font-semibold text-[#315F50] shadow-[0_6px_16px_rgba(23,59,53,0.1)]">
                  この先は詳細レポートで読めます
                </span>
              </div>
            </div>
          </div>

          {/* ── 5. Locked preview cards ── */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">詳細レポートで読める章</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lockedCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/80 p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] opacity-50">🔒</span>
                    <p className="text-[13px] font-semibold text-[#49615B]">{card.title}</p>
                  </div>
                  <p className="text-[12px] leading-6 text-[#7A7068]">{card.description}</p>
                  <p className="text-[11px] font-medium text-[#A09890]">この章は詳細レポートで読めます</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. What you will receive ── */}
          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-5 shadow-[0_12px_28px_rgba(23,59,53,0.05)] md:p-6 space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">詳細レポートで読めること</p>
            <ul className="space-y-2.5">
              {receiveBullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] leading-7 text-[#2F2A28]">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#173B35]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── 7. Intent CTA ── */}
          <ReportIntentAction
            backHref={resultHref}
            sampleHref="/reports/sample"
            resultContext={{
              resultId: result.id,
              overlayId: overlay.id,
              confidenceBand,
              ...(payloadKey ? { payloadKey } : {}),
            }}
          />

          {/* ── 8. Not-now links ── */}
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

          {/* ── 9. Safety note ── */}
          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.08)] bg-white/60 px-5 py-4">
            <p className="text-[11px] leading-7 text-[#8A8078]">
              このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。つらさが強い、長く続く、生活に影響している場合は、信頼できる人や専門の相談先につながることも選択肢です。
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
