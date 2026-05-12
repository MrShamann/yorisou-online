import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import ReportIntentAction from "./ReportIntentAction";

export const metadata: Metadata = {
  title: "詳しいレポート | Yorisou",
  description:
    "無料結果のあとで、もう少し深く読みたいときの入口だけを静かに見られる Yorisou のページです。",
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
  const result =
    getCurrentStateResult(resultId) ??
    currentStateCheckV1.fallbackResult;
  const overlay =
    getCurrentStateOverlay(overlayId) ??
    currentStateCheckV1.overlays.find((item) => item.id === "balancing")!;

  const previewPoints = [
    {
      title: "72問で、もう少し広く見る",
      promise: "24問よりも広い範囲で、流れの見え方を静かに整理します。",
    },
    {
      title: "もう少し丁寧に読む",
      promise: "今の結果を、もう少し細かい見方で読み直すための案内です。",
    },
    {
      title: "少し深い見立て",
      promise: "無料結果よりも少しだけ詳しい見方を、準備中の範囲で案内します。",
    },
    {
      title: "まだ準備中",
      promise: "いまは公開前の案内だけを置いています。動く正式版ではありません。",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,_rgba(221,236,242,0.72),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_42%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container grid gap-5 py-5 md:py-12 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>クイックチェックの先</MvpPill>
              <MvpPill>72問は準備中</MvpPill>
            </div>
            <div className="space-y-3">
              <p className="service-kicker">{result.publicName}の詳しい見え方</p>
              <h1 className="display-serif max-w-[12em] text-[2rem] leading-[1.13] text-[#2F2A28] md:text-[3rem]">
                もう少し広く、
                <span className="block text-[#173B35]">もう少し丁寧に読むための入口です。</span>
              </h1>
              <p className="max-w-[36rem] text-[15px] font-medium leading-7 text-[#6F625C] md:leading-8">
                ここでは、無料結果のあとに見える正式版の案内だけを静かに置いています。72問は準備中で、動く本番ではありません。
              </p>
            </div>
            <div className="grid gap-2.5">
              {previewPoints.slice(0, 2).map((section) => (
                <MvpCard
                  key={section.title}
                  className="flex items-start gap-3 rounded-[1.18rem] border-[rgba(23,59,53,0.1)] bg-white/93 p-3.5 shadow-[0_18px_38px_rgba(23,59,53,0.08)]"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE8DD] text-[13px] font-semibold text-[#D95F4E]">
                    72
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold leading-6 text-[#2F2A28]">{section.title}</div>
                    <p className="text-[12px] leading-6 text-[#6F625C]">{section.promise}</p>
                  </div>
                </MvpCard>
              ))}
            </div>
            <ReportIntentAction backHref={`/result?resultId=${result.id}&overlayId=${overlay.id}`} nextHref="/formal-check" />
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
            href="/formal-check"
            label="正式版の案内を見る"
            className="rounded-full !border-[#173B35] !bg-[#173B35] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)]"
          />
          <MvpActionLink
            href={`/result?resultId=${result.id}&overlayId=${overlay.id}`}
            label="無料結果に戻る"
            tone="secondary"
            className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
          />
        </div>
      </section>
    </main>
  );
}
