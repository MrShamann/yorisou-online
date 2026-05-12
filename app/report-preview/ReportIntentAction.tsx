"use client";

import { useSyncExternalStore } from "react";

import { MvpActionLink, MvpCard } from "../components/MvpSurface";
import { readReportIntent, saveReportIntent, subscribeReportIntent } from "./reportIntentState";

export default function ReportIntentAction({
  backHref,
  nextHref,
}: {
  backHref: string;
  nextHref: string;
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
    });
  };

  return (
    <MvpCard className="space-y-3.5 rounded-[1.22rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_20px_42px_rgba(23,59,53,0.09)] md:p-5">
      <div className="service-kicker">公開時に受け取る</div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleExpressIntent}
          data-report-intent="express-interest"
          className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 py-3 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] hover:opacity-95"
        >
          {hasIntent ? "受け取り希望を記録しました" : "公開時に受け取る"}
        </button>
        <MvpActionLink href={nextHref} label="正式版の案内を見る" tone="ghost" className="rounded-full !text-[#315F50]" />
      </div>
      <div className="rounded-[0.95rem] border border-[rgba(233,120,99,0.12)] bg-[#FFF7F1] px-4 py-3">
        <p className="text-[12px] leading-6 text-[#6F625C]">
          これは購入ではありません。支払いは発生していません。現在は案内受け取り・公開通知のみです。決済機能はまだ公開されていません。
        </p>
      </div>
      {hasIntent ? (
        <div className="rounded-[1rem] border border-[rgba(105,151,130,0.24)] bg-[#F4FAF7] px-4 py-3">
          <p className="text-[15px] font-bold leading-7 text-[#315F50]">受け取り希望を記録しました</p>
          <p className="mt-1 text-[12px] leading-6 text-[#315F50]">
            これは購入ではありません。支払いは発生していません。現在は案内受け取り・公開通知のみです。決済機能はまだ公開されていません。
          </p>
        </div>
      ) : (
        <p className="text-[14px] leading-7 text-[#2F2A28]">
          深いレポートは準備中です。公開されたら受け取る、という意向だけをこの端末に記録できます。
        </p>
      )}
      <MvpActionLink href={backHref} label="無料結果に戻る" tone="secondary" className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none" />
    </MvpCard>
  );
}
