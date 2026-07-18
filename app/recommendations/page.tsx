import type { Metadata } from "next";
import Link from "next/link";

import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import RecommendationSignalForm from "./RecommendationSignalForm";

export const metadata: Metadata = {
  title: "見つける | YORISOU 今の状態に合うもの",
  description:
    "今の状態に合う一歩・体験・レポート・読みもの・道具・場所・サービスを、理由つきで。命令ではなく、合わないときは選べます。表示順は買えません。",
};

// AIX-3 — "見つける (Discover What Fits)" domain. Result compatibility, the
// signal form and all links are preserved; only the surface is reframed into
// the dark product system. No ranking logic changes here.

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

const KINDS = ["小さな一歩", "体験", "レポート", "読みもの", "道具", "場所", "公共の情報", "サービス", "条件を満たしたプロダクト"];

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
  const routeContext = { resultId, overlayId, confidenceBand, payloadKey } as const;
  const compatibility = getTemporary120QResultCompatibility(routeContext);
  const savedHref = buildPublicResultHref("/saved", routeContext);
  const confidenceLabel = confidenceBand === "medium" ? "公開結果を確認中" : "公開結果を表示中";
  const traitChips = compatibility.assignment ? compatibility.heroChips : ["120問ベース", "今の動き方", "今の見え方"];

  return (
    <main className="aix2">
      {/* ===== Hero ===== */}
      <section className="aix2-band aix2-band--tight">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="max-w-[40rem]">
              <p className="aix2-eyebrow">見つける · Discover</p>
              <h1 className="aix2-band-title mt-3">
                {compatibility.displayLine}
                <span className="mt-1 block text-[color:var(--jade-bright)]">合うものを、見つける。</span>
              </h1>
              <p className="aix2-lead mt-4">
                {compatibility.assignment ? compatibility.globalNote : compatibility.placeholderText}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {traitChips.map((chip) => (
                  <span key={chip} className="aix3-chip">{chip}</span>
                ))}
                <span className="aix3-chip">{confidenceLabel}</span>
              </div>
            </div>

            <div className="aix2-panel aix2-panel--now p-6">
              <p className="aix2-eyebrow">おすすめに含まれるもの</p>
              <p className="mt-3 text-[13.5px] leading-7 aix2-mut">
                今の状態に合いそうな候補を、種類を問わず、理由つきで。命令ではなく、合わないときは選べます。表示順は買えません。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {KINDS.map((k) => (
                  <span key={k} className="aix3-tag" aria-hidden="true">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Discover actions ===== */}
      <section className="aix2-band !pt-0">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="aix2-panel p-6">
              <p className="aix2-eyebrow">状態から選ぶ</p>
              <h2 className="mt-2 text-[1.3rem] font-bold text-[color:var(--tx)]">有限のおすすめを見る</h2>
              <p className="mt-2 text-[14px] leading-7 aix2-mut">保存、試す、振り返りまでを自分のペースで記録できます。</p>
              <Link href="/recommendations/graph" className="aix2-btn aix2-btn-primary mt-4 !min-h-[46px] !text-[14px]">おすすめを開く</Link>
            </div>
            <div className="aix2-panel p-6">
              <p className="aix2-eyebrow">今の傾向を保存する</p>
              <h2 className="mt-2 text-[1.3rem] font-bold text-[color:var(--tx)]">あとで同じ流れに戻る</h2>
              <p className="mt-2 text-[14px] leading-7 aix2-mut">保存済みページでは、この端末に残した結果からもう一度見返せます。</p>
              <Link href={savedHref} className="aix2-btn aix2-btn-ghost mt-4 !min-h-[46px] !text-[14px]">保存済みを見る</Link>
            </div>
            <div className="aix2-panel p-6">
              <p className="aix2-eyebrow">もう一度チェックする</p>
              <h2 className="mt-2 text-[1.3rem] font-bold text-[color:var(--tx)]">別の日の傾向と見比べる</h2>
              <p className="mt-2 text-[14px] leading-7 aix2-mut">日を変えて見ると、今の傾向が少し読みやすくなることがあります。</p>
              <Link href="/check-in" className="aix2-btn aix2-btn-ghost mt-4 !min-h-[46px] !text-[14px]">120問をもう一度見る</Link>
            </div>
            <div className="aix2-panel p-6">
              <p className="aix2-eyebrow">小さな次の一歩</p>
              <h2 className="mt-2 text-[1.3rem] font-bold text-[color:var(--tx)]">今できること</h2>
              <p className="mt-2 text-[14px] leading-7 aix2-mut">{getOverlaySuggestion(overlayId ?? "balancing")}</p>
            </div>
          </div>

          <div className="mt-6">
            <RecommendationSignalForm
              resultContext={{
                ...(resultId ? { resultId } : {}),
                ...(overlayId ? { overlayId } : {}),
                confidenceBand,
                ...(payloadKey ? { payloadKey } : {}),
              }}
              options={[
                { value: "self-understanding-reading", label: "あとで詳しく読む", hint: "落ち着いたときに見返したい" },
                { value: "rest-and-recovery", label: "小さな次の一歩", hint: "今できることだけ軽く試したい" },
                { value: "none-right-now", label: "もう一度チェックする", hint: "今日は比較を先にしたいとき" },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
