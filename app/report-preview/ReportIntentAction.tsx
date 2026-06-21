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
  resultContext,
}: {
  backHref: string;
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
      <div className="service-kicker">方向を残す</div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleExpressIntent}
          data-report-intent="express-interest"
          className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 py-3 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] hover:opacity-95"
        >
          {hasIntent ? "方向を記録しました" : "詳しく読みたい方向を残す"}
        </button>
      </div>
      <div className="rounded-[0.95rem] border border-[rgba(23,59,53,0.1)] bg-[#F4FAF7] px-4 py-3">
        <p className="text-[12px] leading-6 text-[#6F625C]">
          これは購入や申込みではありません。方向だけをこの端末に残します。
        </p>
      </div>
      {hasIntent ? (
        <div className="rounded-[1rem] border border-[rgba(105,151,130,0.24)] bg-[#F4FAF7] px-4 py-3">
          <p className="text-[15px] font-bold leading-7 text-[#315F50]">方向を記録しました</p>
          <p className="mt-1 text-[12px] leading-6 text-[#315F50]">
            記録はブラウザ内だけに残ります。
          </p>
        </div>
      ) : (
        <p className="text-[14px] leading-7 text-[#2F2A28]">
          今の結果をもとに、あとで詳しく読みたいという方向を残せます。
        </p>
      )}
      <MvpActionLink href={backHref} label="無料結果に戻る" tone="secondary" className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none" />
    </MvpCard>
  );
}
