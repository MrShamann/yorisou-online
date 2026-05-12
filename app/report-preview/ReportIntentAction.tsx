"use client";

import { useSyncExternalStore } from "react";

import { MvpActionLink, MvpCard } from "../components/MvpSurface";
import { readReportIntent, saveReportIntent, subscribeReportIntent } from "./reportIntentState";

type ReportIntentContext = {
  resultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  payloadKey?: string;
};

export default function ReportIntentAction({
  backHref,
  nextHref,
  resultContext,
}: {
  backHref: string;
  nextHref: string;
  resultContext?: ReportIntentContext;
}) {
  const intentRecord = useSyncExternalStore(subscribeReportIntent, readReportIntent, () => null);
  const hasIntent = Boolean(intentRecord);

  const handleExpressIntent = () => {
    saveReportIntent({
      expressedAt: new Date().toISOString(),
      reportType: "deeper-reflection-preview",
      source: "local-browser",
      version: "v0.2",
      path: "/report-preview",
      ...(resultContext?.resultId ? { resultId: resultContext.resultId } : {}),
      ...(resultContext?.overlayId ? { overlayId: resultContext.overlayId } : {}),
      ...(resultContext?.confidenceBand ? { confidenceBand: resultContext.confidenceBand } : {}),
      ...(resultContext?.payloadKey ? { payloadKey: resultContext.payloadKey } : {}),
    });
  };

  return (
    <MvpCard className="space-y-3.5 rounded-[1.22rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_20px_42px_rgba(23,59,53,0.09)] md:p-5">
      <div className="service-kicker">案内希望を残す</div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleExpressIntent}
          data-report-intent="express-interest"
          className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 py-3 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] hover:opacity-95"
        >
          {hasIntent ? "案内希望を記録しました" : "案内希望をこの端末に残す"}
        </button>
        <MvpActionLink href={nextHref} label="正式版の案内を見る" tone="ghost" className="rounded-full !text-[#315F50]" />
      </div>
      <div className="rounded-[0.95rem] border border-[rgba(233,120,99,0.12)] bg-[#FFF7F1] px-4 py-3">
        <p className="text-[12px] leading-6 text-[#6F625C]">
          これは72問版を始める操作ではありません。今は「あとで詳しく読みたい」という希望だけを、この端末に残します。
        </p>
      </div>
      {hasIntent ? (
        <div className="rounded-[1rem] border border-[rgba(105,151,130,0.24)] bg-[#F4FAF7] px-4 py-3">
          <p className="text-[15px] font-bold leading-7 text-[#315F50]">案内希望を記録しました</p>
          <p className="mt-1 text-[12px] leading-6 text-[#315F50]">
            記録はブラウザ内だけに残ります。正式版は準備中で、ここでは結果や詳しい本文は生成しません。
          </p>
        </div>
      ) : (
        <p className="text-[14px] leading-7 text-[#2F2A28]">
          詳しい読み物は準備中です。あとで見たい、という意向だけをこの端末に記録できます。
        </p>
      )}
      <MvpActionLink href={backHref} label="無料結果に戻る" tone="secondary" className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none" />
    </MvpCard>
  );
}
