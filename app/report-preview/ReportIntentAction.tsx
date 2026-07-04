"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { trackDteEvent } from "../components/DteEventTracker";
import { trackOpenTestingReportEvent } from "../components/OpenTestingTracker";
import { readReportIntent, saveReportIntent, subscribeReportIntent } from "./reportIntentState";

type ReportIntentContext = {
  resultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  payloadKey?: string;
};

export default function ReportIntentAction({
  backHref,
  backLabel = "結果にもどる",
  secondaryHref,
  secondaryLabel,
  resultContext,
}: {
  backHref: string;
  backLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
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
    void trackDteEvent({
      event: "report_interest_saved",
      surface: "report_preview",
      source: "intent_cta",
      locale: "ja",
      ...(resultContext?.resultId ? { resultKey: resultContext.resultId } : {}),
    });
    void trackOpenTestingReportEvent({
      eventType: "intent_clicked",
      reportType: "self-understanding-v0.2.1",
      route: "/report-preview",
      source: "intent_cta",
      entrySource: "report-preview",
      resultId: resultContext?.resultId || null,
      overlayId: resultContext?.overlayId || null,
      confidence: resultContext?.confidenceBand || null,
    });
  };

  return (
    <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.12)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
      <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">あとで詳しく読みたいとき</p>

      <button
        type="button"
        onClick={handleExpressIntent}
        data-report-intent="express-interest"
        className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 py-3 text-[15px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
      >
        {hasIntent ? "あとで読みたいメモを残しました" : "あとで詳しく読む"}
      </button>

      {hasIntent ? (
        <div className="rounded-[1rem] border border-[rgba(105,151,130,0.24)] bg-[#F4FAF7] px-4 py-3">
          <p className="text-[14px] font-semibold leading-7 text-[#315F50]">あとで見返したい気持ちを残しました</p>
          <p className="mt-0.5 text-[12px] leading-6 text-[#315F50]">
            記録はこの端末のブラウザ内だけに残ります。軽いメモとして使えます。
          </p>
        </div>
      ) : (
        <div className="rounded-[0.95rem] border border-[rgba(23,59,53,0.08)] bg-[#F4FAF7] px-4 py-3">
          <p className="text-[12px] leading-6 text-[#6F625C]">
            この場で詳しい本文は開きません。あとで見返したい気持ちだけを、この端末に静かに残します。
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(105,151,130,0.34)] bg-[#EAF7F1] px-5 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5 hover:bg-[#ddf0e8]"
            onClick={() => {
              void trackDteEvent({
                event: "report_preview_secondary_opened",
                surface: "report_preview",
                source: "intent_cta",
                locale: "ja",
              });
            }}
          >
            {secondaryLabel}
          </Link>
        ) : null}
        <Link
          href={backHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.12)] bg-white/80 px-5 text-[13px] font-medium text-[#6F625C] transition hover:bg-white"
          onClick={() => {
            void trackDteEvent({
              event: "not_now_clicked",
              surface: "report_preview",
              source: "intent_cta",
              locale: "ja",
            });
          }}
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
