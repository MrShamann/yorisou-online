// APP-2 WS-B — explainable, deterministic personal adaptation.
//
// This module reprioritizes the governed service catalogue for /my-yorisou using
// ONLY device-local, public-safe journey signals (the SR-1 guest journey). It is:
//
//   • DETERMINISTIC — the same input always yields the same ordering. No
//     Math.random, no wall-clock read inside the ranking (recency is passed in as
//     `nowMs` so tests are reproducible), no network, no model call. Ranking is a
//     pure function of the declared inputs (§6.2).
//   • EXPLAINABLE — every ranked item carries machine-readable reason CODES and a
//     human "why now" sentence. Nothing is surfaced without a stated reason
//     (§6.1). There is no opaque score the user cannot trace.
//   • RESPECTFUL of signals — items the visitor HID or marked "今は違う" (not_now)
//     are never repeated in the adaptive list; items already TRIED are recognized
//     as done (kept, but moved down), never pushed as if new (§6.3).
//
// It performs NO medical, psychological, clinical, risk or vulnerability
// inference, and placement can never be bought — ordering depends only on the
// visitor's own explicit signals and the item's declared eligibility (§6.4).

import {
  SR1_SERVICE_CATALOGUE,
  type ServiceItem,
  type ServiceItemType,
} from "@/app/data/sr1/serviceCatalogue";
import type { GuestFeedbackEntry, GuestNeedId, GuestPace } from "@/lib/sr1/guestJourney";

// The reason a catalogue item was prioritized (or de-prioritized). Codes are
// stable identifiers used by both the UI and the contract tests.
export type AdaptationReasonCode =
  | "result_family"
  | "need_match"
  | "saved"
  | "found_useful"
  | "pace_fit"
  | "returning_resume"
  | "already_tried"
  | "new_to_you";

export type AdaptationReason = { code: AdaptationReasonCode; label: string };

export type AdaptedItemState = "suggested" | "saved" | "done";

export type AdaptedItem = {
  item: ServiceItem;
  score: number;
  state: AdaptedItemState;
  reasons: AdaptationReason[];
  primaryReason: string; // the top human "why now" line
};

// The full set of device-local signals the ranking is allowed to read. Nothing
// here is personal, clinical, or account-bound.
export type AdaptationInput = {
  need?: GuestNeedId;
  latestResultFamily?: string;
  savedItemIds?: string[];
  triedItemIds?: string[];
  hiddenItemIds?: string[];
  feedback?: GuestFeedbackEntry[];
  pace?: GuestPace;
  returning?: boolean;
  // Injected wall-clock so recency is testable and the ranking stays pure.
  nowMs?: number;
  // Injected latest-tried timestamp (ISO) so "recently tried" is deterministic.
  lastTriedAt?: string;
};

// Transparent, fixed weights. Higher = surfaced earlier. Every weight maps to a
// visible reason so the user can always trace the ordering.
const WEIGHT = {
  result_family: 50,
  need_match: 40,
  saved: 30,
  found_useful: 20,
  pace_fit: 10,
  returning_resume: 8,
  new_to_you: 4,
  // Completed items stay available but drop below fresh suggestions.
  tried_penalty: -60,
} as const;

// A stable default order for a brand-new visitor with no signals, so the list is
// never random and matches the prior hand-ordered intent (small action → read →
// try → return).
const TYPE_BASE: Record<ServiceItemType, number> = {
  small_action: 6,
  report: 5,
  guided_experience: 4,
  reflection: 4,
  public_resource: 3,
  return_action: 2,
};

const REASON_LABEL: Record<AdaptationReasonCode, string> = {
  result_family: "前回の結果に近いテーマ",
  need_match: "今大事にしたいことに近い",
  saved: "あなたが保存したもの",
  found_useful: "役に立ったと教えてくれた",
  pace_fit: "今のペースに合う",
  returning_resume: "続きから戻りやすい",
  already_tried: "前に試したもの（もう一度でもOK）",
  new_to_you: "まだ試していない候補",
};

// Catalogue index — the deterministic final tiebreaker (documents source order).
const ORDER_INDEX = new Map(SR1_SERVICE_CATALOGUE.map((item, i) => [item.id, i]));

function isShortItem(item: ServiceItem): boolean {
  const t = item.estimatedTime;
  return t.includes("すぐ") || t.includes("1分") || t.includes("2分");
}

function latestSignalByItem(
  feedback: GuestFeedbackEntry[],
): Map<string, GuestFeedbackEntry["signal"]> {
  // The LAST feedback per item wins (a later "今は違う" overrides an earlier
  // "useful", and vice-versa) — so the user's most recent intent is respected.
  const latest = new Map<string, GuestFeedbackEntry>();
  for (const entry of feedback) {
    const prev = latest.get(entry.itemId);
    if (!prev || entry.at >= prev.at) latest.set(entry.itemId, entry);
  }
  const out = new Map<string, GuestFeedbackEntry["signal"]>();
  for (const [id, entry] of latest) out.set(id, entry.signal);
  return out;
}

/**
 * Rank the catalogue for the current device-local journey. Pure + deterministic.
 *
 * Excludes (never repeats) anything the visitor hid or most-recently marked
 * "今は違う" (not_now). Everything surfaced carries reason codes and a why-line.
 */
export function adaptServiceItems(input: AdaptationInput): AdaptedItem[] {
  const saved = new Set(input.savedItemIds ?? []);
  const tried = new Set(input.triedItemIds ?? []);
  const hidden = new Set(input.hiddenItemIds ?? []);
  const latestSignal = latestSignalByItem(input.feedback ?? []);

  const ranked: AdaptedItem[] = [];

  for (const item of SR1_SERVICE_CATALOGUE) {
    // 1) Never repeat hidden items or items the visitor most recently rejected.
    if (hidden.has(item.id)) continue;
    if (latestSignal.get(item.id) === "not_now") continue;
    if (latestSignal.get(item.id) === "hide") continue;

    const reasons: AdaptationReason[] = [];
    let score = TYPE_BASE[item.type] ?? 0;

    // 2) Result-family relevance (strongest explicit signal).
    if (input.latestResultFamily && item.eligibilityTags.includes(input.latestResultFamily)) {
      score += WEIGHT.result_family;
      reasons.push({ code: "result_family", label: REASON_LABEL.result_family });
    }

    // 3) Stated-need relevance.
    if (input.need && item.eligibilityTags.includes(input.need)) {
      score += WEIGHT.need_match;
      reasons.push({ code: "need_match", label: REASON_LABEL.need_match });
    }

    // 4) Saved by the visitor.
    if (saved.has(item.id)) {
      score += WEIGHT.saved;
      reasons.push({ code: "saved", label: REASON_LABEL.saved });
    }

    // 5) Explicitly found useful.
    if (latestSignal.get(item.id) === "useful") {
      score += WEIGHT.found_useful;
      reasons.push({ code: "found_useful", label: REASON_LABEL.found_useful });
    }

    // 6) Pace fit — quick prefers short items; deep prefers reports / longer.
    if (input.pace === "quick" && isShortItem(item)) {
      score += WEIGHT.pace_fit;
      reasons.push({ code: "pace_fit", label: REASON_LABEL.pace_fit });
    } else if (input.pace === "deep" && item.type === "report") {
      score += WEIGHT.pace_fit;
      reasons.push({ code: "pace_fit", label: REASON_LABEL.pace_fit });
    }

    // 7) Returning visitor — resume-oriented items are a little easier to reach.
    if (input.returning && item.type === "return_action") {
      score += WEIGHT.returning_resume;
      reasons.push({ code: "returning_resume", label: REASON_LABEL.returning_resume });
    }

    // 8) Already tried — recognized as done and moved down (never pushed as new).
    let state: AdaptedItemState = "suggested";
    if (tried.has(item.id)) {
      score += WEIGHT.tried_penalty;
      state = "done";
      reasons.push({ code: "already_tried", label: REASON_LABEL.already_tried });
    } else if (saved.has(item.id)) {
      state = "saved";
    } else if (reasons.length === 0) {
      // Nothing matched — it's simply a fresh option the visitor has not seen.
      score += WEIGHT.new_to_you;
      reasons.push({ code: "new_to_you", label: REASON_LABEL.new_to_you });
    }

    const primaryReason = reasons[0]?.label ?? REASON_LABEL.new_to_you;
    ranked.push({ item, score, state, reasons, primaryReason });
  }

  // 9) Deterministic sort: score desc, then original catalogue order asc. No
  //    randomness, no time-dependence — identical input ⇒ identical output.
  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (ORDER_INDEX.get(a.item.id) ?? 0) - (ORDER_INDEX.get(b.item.id) ?? 0);
  });

  return ranked;
}

// Convenience: the top N adapted items (default 4) for a compact surface.
export function topAdaptedItems(input: AdaptationInput, limit = 4): AdaptedItem[] {
  return adaptServiceItems(input).slice(0, Math.max(0, limit));
}
