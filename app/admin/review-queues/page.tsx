import type { Metadata } from "next";

import {
  getReviewQueueSummary,
  isApp2BackendConfigured,
  listReviewItems,
  logAdminAccess,
  type ReviewQueueItem,
  type ReviewQueueSummaryRow,
} from "@/lib/server/app2ServiceBackend";
import { requireAdminViewer } from "@/lib/server/foundation/access";

import ReviewQueueBoard from "./ReviewQueueBoard";

export const metadata: Metadata = {
  title: "レビュー・キュー | YORISOU Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// WS-G — review queues surface. Admin-gated + access-logged. Truthful states.

async function load(): Promise<{ configured: boolean; reachable: boolean; items: ReviewQueueItem[]; summary: ReviewQueueSummaryRow[] }> {
  if (!isApp2BackendConfigured()) return { configured: false, reachable: false, items: [], summary: [] };
  try {
    const [items, summary] = await Promise.all([listReviewItems(), getReviewQueueSummary()]);
    return { configured: true, reachable: true, items, summary };
  } catch {
    return { configured: true, reachable: false, items: [], summary: [] };
  }
}

export default async function ReviewQueuesPage() {
  const viewer = await requireAdminViewer();
  const data = await load();

  if (data.configured && data.reachable) {
    await logAdminAccess({
      actor: viewer.account?.id ?? "unknown",
      scope: "review_queue",
      action: "read_board",
      route: "/admin/review-queues",
      allowed: true,
      outcome: "allowed",
    }).catch(() => {});
  }

  const openCount = data.summary
    .filter((s) => s.status === "open" || s.status === "reviewing")
    .reduce((n, s) => n + s.item_count, 0);

  return (
    <main className="aix2">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[52rem]">
          <p className="aix2-eyebrow">YORISOU Admin · Founder</p>
          <h1 className="aix2-serif mt-3 text-[1.9rem] leading-[1.25] text-[color:var(--tx)]">レビュー・キュー</h1>
          <p className="mt-3 text-[13.5px] leading-7 aix2-mut">
            安全な要約のみを表示します（個人情報・回答内容は含みません）。各操作は監査ログに記録されます。
          </p>

          {!data.configured ? (
            <div className="aix2-panel mt-7 p-6">
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">バックエンドは未接続です。</p>
              <p className="mt-2 text-[13.5px] leading-7 aix2-mut">接続されると、レビュー項目をここに表示します。</p>
            </div>
          ) : !data.reachable ? (
            <div className="aix2-panel mt-7 p-6">
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">バックエンドに接続できませんでした。</p>
            </div>
          ) : (
            <div className="mt-7">
              <p className="text-[13px] leading-7 aix2-faint">対応が必要な項目: {openCount}</p>
              <ReviewQueueBoard items={data.items} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
