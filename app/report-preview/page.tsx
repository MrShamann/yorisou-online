import type { Metadata } from "next";
import Link from "next/link";

import DteEventTracker from "../components/DteEventTracker";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";
import ReportIntentAction from "./ReportIntentAction";

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
                詳しい読み解き
              </span>
              {compatibility.assignment ? (
                <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.1)] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#6F625C]">
                  {compatibility.assignment.publicCode}
                </span>
              ) : null}
            </div>

            <div className="space-y-3">
              <p className="service-kicker">{compatibility.brandedTestName}</p>
              <h1 className="display-serif text-[2rem] leading-[1.18] text-[#2F2A28] md:text-[2.8rem]">
                見えてきたのは、
                <br className="hidden sm:block" />
                <span className="text-[#173B35]">今の動き方の輪郭です。</span>
              </h1>
              <p className="max-w-[38rem] text-[15px] leading-8 text-[#6F625C]">
                今回の結果では、どんな場面で力を使いやすいか、どんなときに少し立ち止まりやすいか、次に整えるとよさそうな小さなヒントを見ています。
              </p>
              <p className="max-w-[38rem] text-[15px] leading-8 text-[#6F625C]">
                詳しい読み解きは準備中です。今は、結果の見方と次のヒントだけを先にお届けします。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(compatibility.assignment
                ? compatibility.heroChips
                : ["120問ベース", "今の動き方", "準備中"] as const).map((label) => (
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
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">いま受け取れるもの</p>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_14px_28px_rgba(23,59,53,0.06)] md:p-6">
                <p className="text-[15px] leading-8 text-[#2F2A28]">
                  {compatibility.displayLine}という見え方を起点に、今の動き方をやわらかく見返すための入口を整えています。
                </p>
                <p className="mt-3 text-[14px] leading-7 text-[#6F625C]">
                  {compatibility.assignment ? compatibility.globalNote : compatibility.placeholderText}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">この先で見ていくこと</p>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_14px_28px_rgba(23,59,53,0.06)] md:p-6">
                <ul className="space-y-2.5">
                  {teaserBullets.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-7 text-[#2F2A28]">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#173B35]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">今すぐ見やすい入口</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "結果を見返す",
                  description: "今の見え方を落ち着いて確かめたいときに。",
                },
                {
                  title: "次のヒントを見る",
                  description: "今日の動き方に合わせた小さな入口だけを先に。",
                },
                {
                  title: "シェアで残す",
                  description: "言葉を短く保ったまま、今の印象を持ち帰れます。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/80 p-4"
                >
                  <p className="text-[13px] font-semibold text-[#49615B]">{item.title}</p>
                  <p className="mt-2 text-[12px] leading-6 text-[#7A7068]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">読み方のトーン</p>
            <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-5 shadow-[0_12px_28px_rgba(23,59,53,0.05)] md:p-6">
              <p className="text-[15px] leading-8 text-[#2F2A28]">
                ここでお届けするのは、今の自分を決めつけるための答えではなく、少し見返しやすくするための読み方です。
              </p>
              <p className="mt-3 text-[14px] leading-7 text-[#6F625C]">
                受け取りやすい形を先に整えながら、詳しい本文は焦らず準備していきます。
              </p>
            </div>
          </div>

          <ReportIntentAction
            backHref={resultHref}
            backLabel="結果にもどる"
            secondaryHref={recommendationsHref}
            secondaryLabel="今のヒントを見る"
            resultContext={{
              ...(resultId ? { resultId } : {}),
              ...(overlayId ? { overlayId } : {}),
              confidenceBand,
              ...(payloadKey ? { payloadKey } : {}),
            }}
          />

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-[#8A7764]">
            <Link href={resultHref} className="hover:underline" data-report-preview="not-now-free-result">
              結果にもどる
            </Link>
            <span className="text-[#D4CCC6]">·</span>
            <Link href={recommendationsHref} className="hover:underline">
              今のヒントを見る
            </Link>
            <span className="text-[#D4CCC6]">·</span>
            <Link href="/check-in" className="hover:underline">
              もう一度チェックする
            </Link>
          </div>

          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.08)] bg-white/60 px-5 py-4">
            <p className="text-[11px] leading-7 text-[#8A8078]">
              このページでは、詳しい本文そのものではなく、結果の見方と次のヒントだけを先に整えています。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
