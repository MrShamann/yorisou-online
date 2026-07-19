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
    <div className="rounded-[1.35rem] border border-[var(--hair)] bg-[rgba(20,38,30,0.5)] p-5 shadow-[0_20px_42px_rgba(4,20,14,0.35)] space-y-4 md:p-6">
      <p className="text-[11px] font-semibold tracking-[0.13em] text-[#8aa298]">あとで詳しく読みたいとき</p>

      <button
        type="button"
        onClick={handleExpressIntent}
        data-report-intent="express-interest"
        className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full aix2-btn aix2-btn-primary !min-h-[48px] !text-[14px]"
      >
        {hasIntent ? "あとで読みたいメモを残しました" : "あとで詳しく読む"}
      </button>

      {hasIntent ? (
        <div className="rounded-[1rem] border border-[var(--hair-2)] bg-[rgba(47,197,150,0.08)] px-4 py-3">
          <p className="text-[14px] font-semibold leading-7 text-[#5ce6b4]">あとで見返したい気持ちを残しました</p>
          <p className="mt-0.5 text-[12px] leading-6 text-[#5ce6b4]">
            記録はこの端末のブラウザ内だけに残ります。軽いメモとして使えます。
          </p>
        </div>
      ) : (
        <div className="rounded-[0.95rem] border border-[var(--hair)] bg-[rgba(47,197,150,0.08)] px-4 py-3">
          <p className="text-[12px] leading-6 text-[#aec3b7]">
            この場で詳しい本文は開きません。あとで見返したい気持ちだけを、この端末に静かに残します。
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="aix2-btn aix2-btn-ghost !min-h-[44px] !px-5 !text-[13px]"
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
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--hair)] bg-[rgba(20,38,30,0.35)] px-5 text-[13px] font-medium text-[#aec3b7] transition hover:bg-[rgba(20,38,30,0.6)]"
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
