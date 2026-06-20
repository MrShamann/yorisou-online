import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import { buildT6PublicResultHref } from "../check-in/t6ResultModel";
import RecommendationSignalForm from "./RecommendationSignalForm";

export const metadata: Metadata = {
  title: "次にほしいヒント | Yorisou",
  description:
    "無料結果のあとで、次にどんなヒントが役立ちそうかを 1〜2個だけ静かに選べる Yorisou のページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

function getOverlaySuggestion(overlayId: string) {
  switch (overlayId) {
    case "gathering":
      return "今は整理中のものを急いで形にしすぎず、ひとつだけ小さく始めるくらいが合いやすそうです。";
    case "strained":
      return "今日は足すよりも、少し休むことや負荷を減らすことを先に置くと、次の動きが選びやすくなりそうです。";
    case "balancing":
      return "進めたいことと整えたいことを並べて、今週のリズムをひとつだけ見直す入口がよさそうです。";
    case "reopening":
      return "外に向けて少し広げ直すなら、負担の少ない小さな行動をひとつ試すところからで十分です。";
    default:
      return "今の傾向を決めつけず、無理なく試せる小さな一歩だけを選ぶ入口がよさそうです。";
  }
}

export default async function RecommendationsPage({
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
  const reportPreviewHref = buildT6PublicResultHref("/report-preview", routeContext);
  const savedHref = buildT6PublicResultHref("/saved", routeContext);
  const confidenceLabel = confidenceBand === "medium" ? "少し見えやすい範囲" : "今見えている範囲";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_88%_0%,_rgba(221,236,242,0.72),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_44%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container grid gap-5 py-5 md:py-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-start lg:gap-8">
          <div className="max-w-[40rem] space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>次のヒント</MvpPill>
              <MvpPill>2つだけ</MvpPill>
            </div>
            <div className="space-y-3">
              <p className="service-kicker">{result.publicName}の次に見るもの</p>
              <h1 className="display-serif max-w-[11em] text-[2rem] leading-[1.13] text-[#2F2A28] md:text-[2.72rem]">
                今の結果から、
                <span className="block text-[#173B35]">次の入口を選ぶ。</span>
              </h1>
              <p className="max-w-[34rem] text-[15px] font-medium leading-7 text-[#6F625C]">
                {result.recognitionLine}
              </p>
            </div>
            <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/92 shadow-[0_16px_34px_rgba(23,59,53,0.07)]">
              <div className="flex flex-wrap gap-1.5">
                <MvpPill>{overlay.publicLabel}</MvpPill>
                <MvpPill>{confidenceLabel}</MvpPill>
              </div>
              <p className="text-[13px] leading-7 text-[#4A3E39]">{overlay.publicLine}</p>
              <div className="flex flex-wrap gap-1.5">
                {result.traitChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[rgba(105,151,130,0.2)] bg-[#F4FAF7] px-3 py-1.5 text-[12px] font-semibold text-[#315F50]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </MvpCard>

            <div className="grid gap-3">
              <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.12)] bg-[radial-gradient(circle_at_16%_0%,_rgba(217,164,65,0.2),_transparent_46%),linear-gradient(180deg,_#fffefd,_#F4FAF7)] shadow-[0_22px_44px_rgba(23,59,53,0.1)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="service-kicker">もう少し詳しく読む</div>
                  <MvpPill>プレビュー</MvpPill>
                </div>
                <h2 className="display-serif text-[1.48rem] leading-[1.3] text-[#2F2A28]">
                  今の傾向を、短いレポートで見る
                </h2>
                <p className="text-[14px] font-medium leading-7 text-[#4A3E39]">
                  {result.publicName}と{overlay.publicLabel}の文脈を引き継いで、準備中の詳しい読み物の入口だけを確認できます。
                </p>
                <MvpActionLink
                  href={reportPreviewHref}
                  label="レポートプレビューを見る"
                  className="rounded-full !border-[#173B35] !bg-[#173B35] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] hover:!bg-[#0F2F2B]"
                />
              </MvpCard>

              <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(105,151,130,0.14)] bg-white/92 shadow-[0_14px_30px_rgba(105,151,130,0.08)]">
                <div className="service-kicker">今の傾向を保存する</div>
                <h2 className="display-serif text-[1.36rem] leading-[1.38]">あとで同じ流れに戻る</h2>
                <p className="text-[14px] leading-7 text-[var(--text)]">
                  保存済みページでは、この端末に残した結果からもう一度見返せます。
                </p>
                <MvpActionLink
                  href={savedHref}
                  label="保存済みを見る"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
              </MvpCard>

              <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(105,151,130,0.14)] bg-white/92 shadow-[0_14px_30px_rgba(105,151,130,0.08)]">
                <div className="service-kicker">もう一度チェックする</div>
                <h2 className="display-serif text-[1.36rem] leading-[1.38]">別の日の傾向と見比べる</h2>
                <p className="text-[14px] leading-7 text-[var(--text)]">
                  日を変えて見ると、今の傾向が少し読みやすくなることがあります。
                </p>
                <MvpActionLink
                  href="/check-in"
                  label="24問をもう一度見る"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
              </MvpCard>

              <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(105,151,130,0.14)] bg-white/92 shadow-[0_14px_30px_rgba(105,151,130,0.08)]">
                <div className="service-kicker">小さな次の一歩</div>
                <h2 className="display-serif text-[1.36rem] leading-[1.38]">{overlay.publicLabel}のまま試せること</h2>
                <p className="text-[14px] leading-7 text-[var(--text)]">{getOverlaySuggestion(overlay.id)}</p>
              </MvpCard>
            </div>
          </div>

          <RecommendationSignalForm
            resultContext={{
              resultId: result.id,
              overlayId: overlay.id,
              confidenceBand,
              ...(payloadKey ? { payloadKey } : {}),
            }}
            options={[
              {
                value: "self-understanding-reading",
                label: "もう少し詳しく読む",
                hint: "レポートプレビューを先に見たい",
              },
              {
                value: "rest-and-recovery",
                label: "小さな次の一歩",
                hint: "今の状態に合わせて軽く試したい",
              },
              {
                value: "none-right-now",
                label: "もう一度チェックする",
                hint: "今日は比較を先にしたいとき",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
