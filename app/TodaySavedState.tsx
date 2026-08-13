import Link from "next/link";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { latestCurrentStateRecord } from "@/lib/server/lifeOs/store";
import { labelForIntent, labelForState, type IntentOptionId, type StateOptionId } from "@/lib/yorisou/today/currentStateCheckIn";

// OSF-1 — the account-backed current state, on 今日.
//
// The Phase 1 package asks the Today page to let someone view their current state, not only create
// one. TodayContinuity already does that for the device-local record; this does it for the record
// kept against an account, which is the one that survives a new phone.
//
// RENDERS NOTHING unless there is something真 to render — signed out, no record, or an unreachable
// database all produce null rather than an empty frame or an error. That is the same discipline
// TodayContinuity follows, and it is why adding this cannot make 今日 worse for the visitor who has
// told us nothing.
//
// Every route in this app is already dynamic (app/layout.tsx reads cookies for the header), so
// reading the session here costs no static rendering that was otherwise available.

function summary(tags: string[]): string {
  return tags
    .map((tag) => labelForState(tag as StateOptionId) || labelForIntent(tag as IntentOptionId) || "")
    .filter(Boolean)
    .join(" / ");
}

export default async function TodaySavedState() {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  if (!accountId) return null;

  const record = await latestCurrentStateRecord(accountId).catch(() => null);
  if (!record) return null;

  const text = summary(record.state_tags);
  if (!text) return null;

  return (
    <section className="mt-10">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        前回の記録
      </h2>
      <p className="mt-2 text-[17px] leading-[1.7] text-[var(--pxr-text-primary)]">{text}</p>
      {record.reflection && (
        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          {record.reflection}
        </p>
      )}
      <Link
        href="/life"
        className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        わたしの記録を見る
      </Link>
    </section>
  );
}
