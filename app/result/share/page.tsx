import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../../check-in/currentStateCheckV1";
import { buildT6PublicResultHref } from "../../check-in/t6ResultModel";

export const metadata: Metadata = {
  title: "共有カード | Yorisou",
  description:
    "公開結果だけを、落ち着いたカードとして見返せる Yorisou の共有ページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function ResultSharePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const resultId = readParam(params, "resultId") ?? currentStateCheckV1.scoring.fallbackResultId;
  const overlayId = readParam(params, "overlayId");
  const confidenceBand = readParam(params, "confidence") === "medium" ? "medium" : "low";
  const payloadKey = readParam(params, "payloadKey");

  const result = getCurrentStateResult(resultId) ?? currentStateCheckV1.fallbackResult;
  const overlay = getCurrentStateOverlay(overlayId) ?? currentStateCheckV1.overlays.find((item) => item.id === "balancing")!;
  const routeContext = {
    resultId: result.id,
    overlayId: overlay.id,
    confidenceBand,
    payloadKey,
  } as const;
  const resultHref = buildT6PublicResultHref("/result", routeContext);
  const reportPreviewHref = buildT6PublicResultHref("/report-preview", routeContext);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,20,19,0.98)_0%,_rgba(28,40,36,0.96)_26%,_rgba(243,246,239,1)_100%)] px-4 py-4 text-[var(--text)]">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[42rem] items-center">
        <MvpCard className="w-full space-y-5 border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.98)_56%,rgba(242,246,239,0.99)_100%)] text-white shadow-[0_24px_52px_rgba(10,16,14,0.18)]">
          <div className="flex flex-wrap gap-2">
            <MvpPill>{result.publicName}</MvpPill>
            <MvpPill>{overlay.publicLabel}</MvpPill>
            <MvpPill>公開結果のみ</MvpPill>
          </div>
          <div className="space-y-3">
            <p className="service-kicker text-white/68">公開結果カード</p>
            <h1 className="display-serif text-[2.2rem] leading-[1.04] text-white md:text-[2.8rem]">
              {result.publicName}
            </h1>
            <p className="max-w-[30rem] text-[15px] leading-8 text-white/78">
              共有カードには、公開結果だけを入れます。{overlay.publicLabel}として見えている今の傾向を、静かに渡します。
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
            <div className="text-[11px] tracking-[0.2em] text-white/64">認識の一行</div>
            <p className="mt-3 text-[15px] leading-8 text-white">{result.recognitionLine}</p>
            <p className="mt-2 text-[14px] leading-7 text-white/78">{overlay.publicLine}</p>
            <div className="mt-4 grid gap-2">
              {result.traitChips.map((trait) => (
                <span
                  key={trait}
                  className="rounded-[1rem] border border-white/10 bg-white/10 px-3 py-2 text-[13px] leading-7 text-white/90"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
            <div className="text-[10px] tracking-[0.18em] text-white/64">共有の範囲</div>
            <p className="mt-2 text-[14px] leading-7 text-white/82">
              公開結果だけを静かに渡します。自分だけのヒント、回答内容、深い報告は入れません。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <MvpActionLink href={resultHref} label="結果へ戻る" />
            <MvpActionLink href={reportPreviewHref} label="もう少し詳しく見る" tone="secondary" />
            <MvpActionLink href="/privacy" label="共有の境界" tone="ghost" />
          </div>
        </MvpCard>
      </div>
    </main>
  );
}
