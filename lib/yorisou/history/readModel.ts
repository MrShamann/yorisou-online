// PXR-1 — the history read model.
//
// Surfaces that SHOW history stop reaching into the shapes that STORE it. わたし and 今日 both
// wanted "the most recent thing that happened", and each was working it out for itself from two
// different record types with different field names and different time fields. That is how two
// screens end up disagreeing about what a person did most recently.
//
// The storage contracts stay exactly where they are and keep their own versioning:
//   • `lib/yorisou/today/currentStateCheckIn.ts` — the light interaction
//   • `app/result/saveState.ts`                 — the saved canonical result
// Nothing here writes, migrates, merges or unifies them. This module only translates them into one
// display shape, so presentation has a single vocabulary and storage keeps its separate ones.
//
// NOTHING IS GENERATED. Every headline is a string the person chose or an approved result label.
// There is no summarising, no narrative over the top, and no interpretation of a sequence — "you
// have been unsettled lately" is exactly the kind of claim this product does not get to make.

import type { CurrentStateCheckInRecord } from "@/lib/yorisou/today/currentStateCheckIn";
import { labelForIntent, labelForState } from "@/lib/yorisou/today/currentStateCheckIn";

export type HistoryEntryKind = "current_state_check_in" | "saved_result";

export type HistoryEntry = {
  id: string;
  kind: HistoryEntryKind;
  /** The person's own words, or an approved result label. Never composed prose. */
  headline: string;
  /** A supporting fact, or null. Never a narrative. */
  detail: string | null;
  occurredAt: string;
  href: string;
};

/** The saved-result fields this model reads. Kept structural so the storage type stays free to grow. */
export type SavedResultLike = {
  savedAt: string;
  resultLabel: string;
  recognitionLine?: string;
  resultPath?: string;
};

export function buildHistoryEntries(input: {
  checkIn: CurrentStateCheckInRecord | null;
  saved: SavedResultLike | null;
}): HistoryEntry[] {
  const entries: HistoryEntry[] = [];

  if (input.checkIn) {
    entries.push({
      id: `check-in:${input.checkIn.completedAt}`,
      kind: "current_state_check_in",
      headline: `${labelForState(input.checkIn.state)}。${labelForIntent(input.checkIn.intent)}。`,
      detail: null,
      occurredAt: input.checkIn.completedAt,
      href: "/today/check-in",
    });
  }

  if (input.saved) {
    entries.push({
      id: `saved-result:${input.saved.savedAt}`,
      kind: "saved_result",
      headline: input.saved.resultLabel,
      detail: input.saved.recognitionLine ?? null,
      occurredAt: input.saved.savedAt,
      href: input.saved.resultPath ?? "/saved",
    });
  }

  // Newest first, by what actually happened — not by which record the caller read first.
  // Unparseable timestamps sort last rather than throwing off the whole order.
  return entries.sort((a, b) => {
    const at = Date.parse(a.occurredAt);
    const bt = Date.parse(b.occurredAt);
    if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
    if (Number.isNaN(at)) return 1;
    if (Number.isNaN(bt)) return -1;
    return bt - at;
  });
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A calendar-day label, in the person's terms.
 *
 * Days are counted from local midnight, not by dividing elapsed milliseconds: something recorded at
 * 23:50 is 昨日 by breakfast, and calling it 今日 because nine hours have not passed is the kind of
 * small wrongness that makes a product feel like it is not paying attention. Returns null when the
 * timestamp cannot be read, so callers omit the label instead of printing a guess.
 */
export function relativeDayLabel(iso: string, now: Date): string | null {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return null;

  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(then)) / DAY_MS);

  if (days <= 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  return "しばらく前";
}
