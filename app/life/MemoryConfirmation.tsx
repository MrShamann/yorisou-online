"use client";

import { useState } from "react";

import { MEMORY_TYPE_LABELS, type MemoryCandidate } from "@/lib/life-os/contract";
import { lifePost } from "@/lib/life-os/client";

// OSF-1 — 「これを覚えておきますか」.
//
// The candidate shown here has no row behind it. It arrived in the response body of whatever the
// person just wrote, and if they close the tab it is gone — there is no draft, no pending record and
// no "we'll ask you later" queue. That is the entire point of the design: the product cannot end up
// holding something a person never agreed to, because there is nowhere for it to be held.
//
// The content is displayed IN FULL, verbatim, before the confirm control. No truncation and no
// summary — someone confirming a memory has to be able to read the exact sentence that will be
// stored, and an ellipsis in the middle of it makes the confirmation meaningless.
//
// 「あとで」 is a real decline, not a snooze: it removes the card and stores nothing.

type Props = { candidates: MemoryCandidate[] };

type Decision = "pending" | "saving" | "saved" | "declined" | "failed";

export default function MemoryConfirmation({ candidates }: Props) {
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});

  if (candidates.length === 0) return null;

  async function confirm(index: number, candidate: MemoryCandidate) {
    setDecisions((current) => ({ ...current, [index]: "saving" }));
    const result = await lifePost("memories", {
      // Sent as a separate top-level field, not folded into the candidate object. The endpoint reads
      // THIS and rejects anything that is not exactly `true`, so a client that forgot to collect a
      // decision cannot satisfy it by echoing back the candidate it was given.
      confirmed: true,
      memory: {
        memoryType: candidate.memoryType,
        content: candidate.content,
        source: candidate.source,
        digest: candidate.digest,
        subject: candidate.subject ?? {},
      },
    });
    setDecisions((current) => ({ ...current, [index]: result.ok ? "saved" : "failed" }));
  }

  return (
    <section className="mt-10">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        覚えておきますか
      </h2>
      <p className="mt-2 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
        あなたが確認したものだけが残ります。何もしなければ、保存されません。
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {candidates.map((candidate, index) => {
          const decision = decisions[index] ?? "pending";
          if (decision === "declined") return null;
          return (
            <li
              key={candidate.digest}
              className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4"
            >
              <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                {MEMORY_TYPE_LABELS[candidate.memoryType]}
              </p>
              {/* Verbatim, complete. */}
              <p className="mt-2 whitespace-pre-wrap text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]">
                {candidate.content}
              </p>
              <p className="mt-2 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
                {candidate.reason}
              </p>

              {decision === "saved" ? (
                <p className="mt-4 text-[14px] font-medium text-[var(--pxr-text-secondary)]">
                  覚えておきます。
                </p>
              ) : (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void confirm(index, candidate)}
                    disabled={decision === "saving"}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white disabled:opacity-70"
                  >
                    {decision === "saving" ? "保存しています" : "覚えておく"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions((current) => ({ ...current, [index]: "declined" }))}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
                  >
                    今はしない
                  </button>
                </div>
              )}
              {decision === "failed" && (
                <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                  保存できませんでした。何も残っていません。
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
