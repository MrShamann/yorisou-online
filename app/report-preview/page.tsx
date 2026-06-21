import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import { buildT6PublicResultHref } from "../check-in/t6ResultModel";
import ReportIntentAction from "./ReportIntentAction";

export const metadata: Metadata = {
  title: "詳細レポート | Yorisou",
  description:
    "無料結果をもとに、あとで詳しく読みたい方向だけをブラウザ内に残せる Yorisou のページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

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
  const resultHref = buildT6PublicResultHref("/result", routeContext);

  const previewPoints = [
    {
      title: "今の結果をもとに読む",
      promise: result.reportPreviewBridge ?? result.recognitionLine,
    },
    {
      title: "深く読むための方向を確認する",
      promise: "生活リズム、人との距離、気持ちの戻り方など、今の状態から広げて読めるテーマを先に選べます。",
    },
    {
      title: "方向だけを残す",
      promise: "このページでは回答や購入は始まりません。あとで詳しく読みたいという方向だけをブラウザ内に残せます。",
    },
    {
      title: "固定したラベルではありません",
      promise: "今の状態から見える傾向をもとにしています。日を変えて読むと、また少し違う入口が見えることがあります。",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,_rgba(221,236,242,0.72),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_42%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container grid gap-5 py-5 md:py-12 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>クイックチェックの先</MvpPill>
              <MvpPill>詳しく読む</MvpPill>
            </div>
            <div className="space-y-3">
              <p className="service-kicker">{result.publicName}から深く読む</p>
              <h1 className="display-serif max-w-[12em] text-[2rem] leading-[1.13] text-[#2F2A28] md:text-[3rem]">
                {result.publicName}をもとに、
                <span className="block text-[#173B35]">もう少し深く読む。</span>
              </h1>
              <p className="max-w-[36rem] text-[15px] font-medium leading-7 text-[#6F625C] md:leading-8">
                無料結果をもとに、あとで詳しく読みたい方向だけをブラウザ内に残せます。購入や申込みではありません。
              </p>
            </div>
            <div className="grid gap-2.5">
              {previewPoints.slice(0, 2).map((section) => (
                <MvpCard
                  key={section.title}
                  className="flex items-start gap-3 rounded-[1.18rem] border-[rgba(23,59,53,0.1)] bg-white/93 p-3.5 shadow-[0_18px_38px_rgba(23,59,53,0.08)]"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF7F1] text-[13px] font-semibold text-[#315F50]">
                    ↓
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold leading-6 text-[#2F2A28]">{section.title}</div>
                    <p className="text-[12px] leading-6 text-[#6F625C]">{section.promise}</p>
                  </div>
                </MvpCard>
              ))}
            </div>
            <ReportIntentAction
              backHref={resultHref}
              resultContext={{
                resultId: result.id,
                overlayId: overlay.id,
                confidenceBand,
                ...(payloadKey ? { payloadKey } : {}),
              }}
            />
          </div>
          <div className="hidden gap-3 lg:grid">
            <MvpCard className="space-y-2.5 rounded-[1.05rem] bg-white/90">
              <div className="service-kicker">{overlay.publicLabel}</div>
              <p className="text-[15px] leading-8 text-[var(--text)]">{overlay.publicLine}</p>
            </MvpCard>
            {previewPoints.slice(2).map((section) => (
              <MvpCard key={section.title} className="space-y-2.5 rounded-[1.05rem] bg-white/90">
                <div className="service-kicker">{section.title}</div>
                <p className="text-[15px] leading-8 text-[var(--text)]">{section.promise}</p>
              </MvpCard>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-7 md:py-12">
        <div className="grid gap-3 md:grid-cols-2">
          {previewPoints.slice(2).map((section) => (
            <MvpCard key={section.title} className="space-y-2.5 rounded-[1.05rem] bg-white/90">
              <div className="service-kicker">{section.title}</div>
              <p className="text-[14px] leading-7 text-[var(--text)] md:text-[15px] md:leading-8">{section.promise}</p>
            </MvpCard>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <MvpActionLink
            href={resultHref}
            label="無料結果に戻る"
            tone="secondary"
            className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
          />
          <MvpActionLink
            href="/check-in"
            label="もう一度チェックする"
            tone="ghost"
            className="rounded-full !text-[#315F50]"
          />
        </div>
      </section>
    </main>
  );
}
