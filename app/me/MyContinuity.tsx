"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { useRecommendationFeedback } from "../components/RecommendationCard";
import { DISCOVERY_INVENTORY } from "@/lib/yorisou/recommendations/discoveryInventory";
import { buildHistoryEntries, relativeDayLabel } from "@/lib/yorisou/history/readModel";
import {
  readCurrentStateCheckIn,
  subscribeCurrentStateCheckIn,
} from "@/lib/yorisou/today/currentStateCheckIn";
import { readSavedResultRecord, subscribeSavedResult } from "../result/saveState";

// わたし — continuity, not a dashboard.
//
// NO METRICS. No streak, no total, no "3日連続", no completion percentage, no chart. Yorisou is for
// people who are tired; a screen that scores how consistently they have used an app is a screen
// that can make them feel worse for having taken a break. What is here is what they actually did,
// in their own words, with the day it happened — and a way back to it.
//
// Every line is read from the governed device-local records. Nothing is generated, nothing is
// summarised across entries, and an empty state says it is empty rather than inventing a first
// milestone to celebrate.
const HEADING = "text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]";
const PANEL =
  "rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-5";
const ACTION =
  "mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]";

export default function MyContinuity() {
  const checkIn = useSyncExternalStore(
    subscribeCurrentStateCheckIn,
    readCurrentStateCheckIn,
    () => null,
  );
  const saved = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const feedback = useRecommendationFeedback();

  const entries = buildHistoryEntries({ checkIn, saved });
  // Client-only: these islands render nothing on the server, so reading the clock here cannot
  // produce a hydration mismatch.
  const now = new Date();

  const savedEntries = DISCOVERY_INVENTORY.filter((entry) => feedback.saved.includes(entry.id));

  return (
    <>
      <section className="mt-7">
        <h2 className={HEADING}>これまで</h2>
        {entries.length === 0 ? (
          <div className={`mt-3 ${PANEL}`}>
            <p className="text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
              まだ記録はありません。
            </p>
            <Link href="/today/check-in" className={ACTION}>
              今の気配を見る
            </Link>
          </div>
        ) : (
          <ul className="m-0 mt-3 grid list-none gap-3 p-0">
            {entries.map((entry) => {
              const day = relativeDayLabel(entry.occurredAt, now);
              return (
                <li key={entry.id}>
                  <Link href={entry.href} className={`block ${PANEL}`}>
                    {day ? (
                      <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">{day}</p>
                    ) : null}
                    <p className="mt-1 text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
                      {entry.headline}
                    </p>
                    {entry.detail ? (
                      <p className="mt-1 text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                        {entry.detail}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-7">
        <h2 className={HEADING}>保存したもの</h2>
        {savedEntries.length === 0 && !saved ? (
          <div className={`mt-3 ${PANEL}`}>
            <p className="text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
              気になったものを保存すると、ここに集まります。
            </p>
            <Link href="/explore" className={ACTION}>
              合いそうなものを探す
            </Link>
          </div>
        ) : (
          <ul className="m-0 mt-3 grid list-none gap-3 p-0">
            {saved ? (
              <li>
                <Link href="/saved" className={`block ${PANEL}`}>
                  <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">保存した結果</p>
                  <p className="mt-1 text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
                    {saved.resultLabel}
                  </p>
                </Link>
              </li>
            ) : null}
            {savedEntries.map((entry) => (
              <li key={entry.id}>
                <Link href={entry.href} className={`block ${PANEL}`}>
                  <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                    {entry.timeHint}
                  </p>
                  <p className="mt-1 text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
                    {entry.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                    {entry.body}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
