"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { readSavedResultRecord, subscribeSavedResult } from "./result/saveState";

// Today's continuity block — the ONLY part of the home screen that is allowed to be personal.
//
// PXR-1 rule: Today must not fake personalization. Everything above this renders identically for
// everyone, because a first-time visitor has told us nothing and a home screen that guesses at their
// state ("今日は疲れているようです") would be inventing evidence. This component reads the SAME governed
// device-local record the /saved surface reads — no parallel store, no second source of truth — and
// renders nothing at all when that record is absent.
//
// Rendering nothing is deliberate. An empty "最近の気づき" heading over a placeholder is worse than the
// section not existing: it tells a new person they are missing something.
export default function TodayContinuity() {
  const saved = useSyncExternalStore(
    subscribeSavedResult,
    readSavedResultRecord,
    // Server and first client paint agree on "no history", so nothing flashes into view and then out.
    () => null,
  );

  if (!saved) return null;

  return (
    <section className="mt-10">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        最近の気づき
      </h2>
      <Link
        href="/saved"
        className="mt-3 flex min-h-[var(--pxr-touch-target)] flex-col rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-5"
      >
        <span className="text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
          {saved.resultLabel}
        </span>
        <span className="mt-1 text-[14px] leading-[1.8] text-[var(--pxr-text-secondary)]">
          {saved.recognitionLine ?? "この端末に保存されています。"}
        </span>
      </Link>
    </section>
  );
}
