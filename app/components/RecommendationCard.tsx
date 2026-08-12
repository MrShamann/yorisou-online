"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import type { RecommendationObject } from "@/lib/yorisou/recommendations/recommendationObject";
import {
  dismissRecommendation,
  readRecommendationFeedback,
  readRecommendationFeedbackServerSnapshot,
  restoreRecommendation,
  saveRecommendation,
  subscribeRecommendationFeedback,
  unsaveRecommendation,
} from "@/lib/yorisou/recommendations/recommendationFeedback";

// PXR-1 — the one card every "here is something you could do next" uses.
//
// THREE CONTROLS, and each does something real:
//   なぜこれ？ opens the reason. Not a tooltip, not a marketing line — the frozen disclosure for
//             this object's reason class, plus the specific thing it rests on when there is one.
//   保存する   keeps it, so わたし can show it later.
//   今は違う   sets it aside, and it goes away. 「今は」, so it is reversible from here.
//
// WHAT IT IS NOT. No rating, no thumbs, no score, no streak, no counter, nothing that accumulates
// into a judgement of the person and nothing that punishes ignoring it. Setting something aside is
// not "negative feedback" that trains a model; it is a person saying not now, and the product
// believing them.
//
// The card renders the reason at the SAME weight as the content, deliberately. A justification a
// person has to hunt for is a justification the product does not really stand behind.

export function useRecommendationFeedback() {
  return useSyncExternalStore(
    subscribeRecommendationFeedback,
    readRecommendationFeedback,
    readRecommendationFeedbackServerSnapshot,
  );
}

const CONTROL =
  "inline-flex min-h-[var(--pxr-touch-target)] items-center text-[14px] font-medium text-[var(--pxr-text-secondary)]";

export default function RecommendationCard({ object }: { object: RecommendationObject }) {
  const feedback = useRecommendationFeedback();
  const isSaved = feedback.saved.includes(object.id);
  const isDismissed = feedback.dismissed.includes(object.id);

  // Set aside: the row stays, so the list does not silently reflow and the choice stays undoable.
  // Removing it outright would leave a person unable to find something they set aside by mistake.
  if (isDismissed) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] px-5 py-4">
        <p className="text-[14px] leading-[1.8] text-[var(--pxr-text-muted)]">
          「{object.title}」は今は表示しません。
        </p>
        <button type="button" onClick={() => restoreRecommendation(object.id)} className={CONTROL}>
          もどす
        </button>
      </section>
    );
  }

  // COMPOSITION. The content is ONE tap target, not a title plus a separate call-to-action link
  // underneath it — a card whose heading is inert and whose only live element is a small link at
  // the bottom asks a person to aim. Everything optional sits in one control row below it, so the
  // card is two bands rather than five stacked 48px rows separated by empty space.
  return (
    <section className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-5">
      {/* The reason line sits OUTSIDE the link. Inside it, the link's accessible name became
          「よりそうが用意した内容今の気配を見るいまの状態を…はじめる」 — the provenance of the offer
          announced as part of where the link goes. It is context for the card, not a destination. */}
      <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
        {object.reasonSummary}
        {object.evidenceDetail ? `・「${object.evidenceDetail}」` : ""}
      </p>

      <Link href={object.href} className="mt-1 block">
        <h3 className="text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
          {object.title}
        </h3>
        <p className="mt-1 text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          {object.body}
        </p>
        <span className="mt-2 inline-flex text-[14px] font-medium text-[var(--pxr-accent)]">
          {object.ctaLabel}
        </span>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-0 border-t border-[var(--pxr-border-subtle)]">
        <button
          type="button"
          onClick={() => (isSaved ? unsaveRecommendation(object.id) : saveRecommendation(object.id))}
          aria-pressed={isSaved}
          className={CONTROL}
        >
          {isSaved ? "保存済み" : "保存する"}
        </button>
        <button type="button" onClick={() => dismissRecommendation(object.id)} className={CONTROL}>
          今は違う
        </button>
        {/* NOT `grid`/`flex` on the <details> itself: a closed <details> hides its non-summary
            children through a UA slot rather than removing them from layout, so a grid parent keeps
            their tracks and leaves a dead band under the closed summary. */}
        <details className="w-full">
          {/* The display property is left alone. Overriding a <summary> to inline-flex drops its
              default `list-item` box, which takes the disclosure marker with it and — as the
              accessibility tree showed — can leave the control exposed as an anonymous generic
              rather than a disclosure. Height comes from padding instead. */}
          <summary className="min-h-[var(--pxr-touch-target)] cursor-pointer py-3 text-[14px] font-medium text-[var(--pxr-accent)]">
            なぜこれ？
          </summary>
          <p className="pb-1 text-[13px] leading-[1.8] text-[var(--pxr-text-secondary)]">
            {object.reasonDisclosure}
          </p>
          <p className="mt-2 pb-1 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
            {object.limitations}
          </p>
        </details>
      </div>
    </section>
  );
}
