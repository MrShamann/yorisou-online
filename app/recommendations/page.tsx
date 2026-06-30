import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import RecommendationSignalForm from "./RecommendationSignalForm";

export const metadata: Metadata = {
  title: "次にほしいヒント | Yorisou",
  description:
    "120問結果の互換表示のあとで、次の入口だけを静かに選べる Yorisou のページです。",
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
  const savedHref = buildPublicResultHref("/saved", routeContext);
  const confidenceLabel = confidenceBand === "medium" ? "互換状態を確認中" : "暫定導線を維持中";
  const genericTraitChips = ["120問ベース", "分類保留", "互換表示"] as const;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_88%_0%,_rgba(221,236,242,0.72),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_44%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container grid gap-5 py-5 md:py-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-start lg:gap-8">
          <div className="max-w-[40rem] space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>次のヒント</MvpPill>
              <MvpPill>120問互換表示</MvpPill>
            </div>
            <div className="space-y-3">
              <p className="service-kicker">120問結果互換表示の次に見るもの</p>
              <h1 className="display-serif max-w-[11em] text-[2rem] leading-[1.13] text-[#2F2A28] md:text-[2.72rem]">
                互換表示のあとで、
                <span className="block text-[#173B35]">次の入口を選ぶ。</span>
              </h1>
              <p className="max-w-[34rem] text-[15px] font-medium leading-7 text-[#6F625C]">
                {compatibility.placeholderText}
              </p>
            </div>
            <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/92 shadow-[0_16px_34px_rgba(23,59,53,0.07)]">
              <div className="flex flex-wrap gap-1.5">
                <MvpPill>{compatibility.taxonomyStatus}</MvpPill>
                <MvpPill>{confidenceLabel}</MvpPill>
              </div>
              <p className="text-[13px] leading-7 text-[#4A3E39]">正式な分類名と解釈文は承認待ちのため、この画面では互換導線だけを残しています。</p>
              <div className="flex flex-wrap gap-1.5">
                {genericTraitChips.map((chip) => (
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
                  label="120問をもう一度見る"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
              </MvpCard>

              <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(105,151,130,0.14)] bg-white/92 shadow-[0_14px_30px_rgba(105,151,130,0.08)]">
                <div className="service-kicker">小さな次の一歩</div>
                <h2 className="display-serif text-[1.36rem] leading-[1.38]">承認前でもできること</h2>
                <p className="text-[14px] leading-7 text-[var(--text)]">{getOverlaySuggestion(overlayId ?? "balancing")}</p>
              </MvpCard>
            </div>
          </div>

          <RecommendationSignalForm
            resultContext={{
              ...(resultId ? { resultId } : {}),
              ...(overlayId ? { overlayId } : {}),
              confidenceBand,
              ...(payloadKey ? { payloadKey } : {}),
            }}
            options={[
              {
                value: "self-understanding-reading",
                label: "承認後に詳しく読む",
                hint: "正式仕様の反映後に見返したい",
              },
              {
                value: "rest-and-recovery",
                label: "小さな次の一歩",
                hint: "今できることだけ軽く試したい",
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
