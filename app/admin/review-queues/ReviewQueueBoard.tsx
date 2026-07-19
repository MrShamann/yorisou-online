"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ReviewQueueItem } from "@/lib/server/app2ServiceBackend";

// WS-G — admin review-queue board. Lists items with their type/severity/status/
// count/safe-summary, and drives lifecycle transitions through the admin API
// (open → reviewing → resolved/dismissed → reopened). Safe summaries only.

const NEXT_STATUSES: Record<string, { to: string; label: string }[]> = {
  open: [
    { to: "reviewing", label: "レビュー開始" },
    { to: "dismissed", label: "対応不要" },
  ],
  reviewing: [
    { to: "resolved", label: "解決" },
    { to: "dismissed", label: "対応不要" },
  ],
  resolved: [{ to: "reopened", label: "再オープン" }],
  dismissed: [{ to: "reopened", label: "再オープン" }],
  reopened: [
    { to: "reviewing", label: "レビュー再開" },
    { to: "resolved", label: "解決" },
  ],
};

const STATUS_LABEL: Record<string, string> = {
  open: "未対応",
  reviewing: "レビュー中",
  resolved: "解決済み",
  dismissed: "対応不要",
  reopened: "再オープン",
};

export default function ReviewQueueBoard({ items }: { items: ReviewQueueItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function transition(itemId: string, toStatus: string) {
    setBusyId(itemId);
    setError(null);
    try {
      const res = await fetch("/api/admin/review-queues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "transition", itemId, toStatus }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "更新できませんでした");
      } else {
        router.refresh();
      }
    } catch {
      setError("通信に失敗しました");
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return (
      <div className="aix2-panel mt-3 p-6">
        <p className="text-[14px] leading-8 aix2-mut">レビュー待ちの項目はありません。</p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {error ? (
        <p role="alert" className="text-[13px] text-[#f2896c]">
          {error}
        </p>
      ) : null}
      {items.map((item) => (
        <div key={item.id} className="aix2-panel p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-bold text-[color:var(--tx)]">{item.queue_type}</span>
            <span className="inline-flex items-center rounded-full border border-[var(--hair-2)] px-2.5 py-1 text-[10.5px] aix2-mut">
              {item.severity}
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-2.5 py-1 text-[10.5px] text-[color:var(--jade-bright)]">
              {STATUS_LABEL[item.status] ?? item.status}
            </span>
            <span className="text-[11px] aix2-faint">×{item.occurrence_count}</span>
          </div>
          <p className="mt-2 text-[13px] leading-7 aix2-mut">{item.safe_summary}</p>
          {item.resolution_note ? (
            <p className="mt-1 text-[12px] leading-6 aix2-faint">対応メモ: {item.resolution_note}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {(NEXT_STATUSES[item.status] ?? []).map((next) => (
              <button
                key={next.to}
                type="button"
                disabled={busyId === item.id}
                onClick={() => transition(item.id, next.to)}
                className="rounded-full border border-[var(--hair-2)] px-3 py-1.5 text-[12px] text-[color:var(--tx)] transition-colors hover:border-[var(--hair-jade)] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)]"
              >
                {next.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
