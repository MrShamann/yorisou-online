// PXR-1 — 今の気配: a NON-DIAGNOSTIC current-state capture.
//
// WHAT THIS IS NOT. Not a test, not an assessment, not a personality classifier. It computes nothing
// about the person: there is no scoring, no dimension, no persona, no archetype, no inference, and no
// free text. It reflects back exactly what someone explicitly selected, and offers one next step.
//
// WHY IT IS NOT DCI-1. The repository already contains a governed lightweight method —
// `lib/yorisou/methods/daily-check-in`, whose acknowledgement cascade "picks COPY — it computes
// nothing about the person". That is the right pattern and this module follows it deliberately.
// It is NOT imported, for one reason: DCI-1 is a gated pilot that is default CLOSED in Production
// (`dailyCheckInAccess` → `denied_production`, the route 404s, `robots: noindex`). Wiring Today's
// primary action to it would dead-end for every real visitor, and quietly promoting another
// package's deliberately-closed pilot is not a decision this package gets to make.
//
// So: DCI-1's PATTERN is reused, DCI-1's CODE is not. Recorded as ADAPT in the canonical PXR doc.
//
// COPY_REFINEMENT_REQUIRED — the reflection lines below are minimal neutral Japanese written to be
// structurally correct and emotionally quiet. They are placeholders for Yorisou Agent refinement,
// NOT approved canonical product copy.

export const CURRENT_STATE_CHECK_IN_VERSION = "pxr1-current-state-v1";

/** Bounded choices only. Free text would turn a calm question into a disclosure surface. */
export type StateOptionId = "unsettled" | "busy-mind" | "heavy" | "steady" | "unsure";
export type IntentOptionId = "rest" | "sort-out" | "shift" | "understand" | "undecided";

export type StateOption = { id: StateOptionId; label: string };
export type IntentOption = { id: IntentOptionId; label: string };

export const STATE_OPTIONS: readonly StateOption[] = [
  { id: "unsettled", label: "落ち着かない" },
  { id: "busy-mind", label: "頭が休まらない" },
  { id: "heavy", label: "なんとなく重い" },
  { id: "steady", label: "わりと落ち着いている" },
  { id: "unsure", label: "よくわからない" },
] as const;

export const INTENT_OPTIONS: readonly IntentOption[] = [
  { id: "rest", label: "少し休みたい" },
  { id: "sort-out", label: "頭の中を整理したい" },
  { id: "shift", label: "気分を変えたい" },
  { id: "understand", label: "自分のことを知りたい" },
  { id: "undecided", label: "まだ決めていない" },
] as const;

/**
 * The device-local continuity record.
 *
 * Deliberately NOT the saved-result record: that contract describes a completed assessment with a
 * persona label, and borrowing it for unrelated state would make Today display a result that never
 * happened. One explicit versioned contract instead, holding only what the person chose.
 *
 * No raw identity, no free text, no inference payload, no server sync, no migration.
 */
export type CurrentStateCheckInRecord = {
  version: typeof CURRENT_STATE_CHECK_IN_VERSION;
  state: StateOptionId;
  intent: IntentOptionId;
  completedAt: string;
  source: "local-browser";
};

const STORAGE_KEY = "yorisou.pxr1.currentStateCheckIn.v1";

/** Reflection is a LOOKUP, never a computation — the same discipline as DCI-1's cascade. */
const REFLECTION_BY_INTENT: Record<IntentOptionId, string> = {
  rest: "少し休みたい、という気持ちがあるようです。",
  "sort-out": "頭の中を整理したい、という気持ちがあるようです。",
  shift: "気分を変えたい、という気持ちがあるようです。",
  understand: "自分のことを知りたい、という気持ちがあるようです。",
  undecided: "まだ決めていない、というのも今の状態です。",
};

/** One bounded next step per intent. Nothing here claims to know why the person feels anything. */
const NEXT_STEP_BY_INTENT: Record<IntentOptionId, { label: string; href: string }> = {
  rest: { label: "静かに読めるものを見る", href: "/explore" },
  "sort-out": { label: "テーマから見てみる", href: "/tests" },
  shift: { label: "合いそうなものを探す", href: "/explore" },
  understand: { label: "いま色テストを見る", href: "/tests/ima-iro" },
  undecided: { label: "合いそうなものを探す", href: "/explore" },
};

export function labelForState(id: StateOptionId): string {
  return STATE_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
export function labelForIntent(id: IntentOptionId): string {
  return INTENT_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
export function reflectionFor(intent: IntentOptionId): string {
  return REFLECTION_BY_INTENT[intent];
}
export function nextStepFor(intent: IntentOptionId) {
  return NEXT_STEP_BY_INTENT[intent];
}

function parseCurrentStateCheckIn(raw: string | null): CurrentStateCheckInRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CurrentStateCheckInRecord>;
    if (parsed.version !== CURRENT_STATE_CHECK_IN_VERSION) return null;
    if (!parsed.state || !parsed.intent || !parsed.completedAt) return null;
    if (!STATE_OPTIONS.some((o) => o.id === parsed.state)) return null;
    if (!INTENT_OPTIONS.some((o) => o.id === parsed.intent)) return null;
    return parsed as CurrentStateCheckInRecord;
  } catch {
    return null;
  }
}

// The snapshot is cached against the raw string, and this is NOT an optimisation.
//
// `useSyncExternalStore` calls the reader during render and compares the result by identity. A
// reader that returns a freshly parsed object every call is never equal to itself, so React
// re-renders, reads again, and the component loops until it throws "Maximum update depth exceeded".
//
// That is exactly what happened: Today crashed for anyone who had completed a check-in, while the
// empty state — the only state without a record to re-parse — stayed fine, so it survived review.
// The cache lives here rather than at the call site so no future caller can reintroduce it.
// `app/result/saveState.ts` caches the same way, for the same reason.
let cachedRaw: string | null = null;
let cachedRecord: CurrentStateCheckInRecord | null = null;

/** Reads only a record this version wrote. An older or unknown shape is ignored, never guessed at. */
export function readCurrentStateCheckIn(): CurrentStateCheckInRecord | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === cachedRaw) return cachedRecord;
  cachedRaw = raw;
  cachedRecord = parseCurrentStateCheckIn(raw);
  return cachedRecord;
}

export function writeCurrentStateCheckIn(state: StateOptionId, intent: IntentOptionId): void {
  if (typeof window === "undefined") return;
  const record: CurrentStateCheckInRecord = {
    version: CURRENT_STATE_CHECK_IN_VERSION,
    state,
    intent,
    completedAt: new Date().toISOString(),
    source: "local-browser",
  };
  try {
    const raw = JSON.stringify(record);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedRecord = record;
    window.dispatchEvent(new Event(CURRENT_STATE_EVENT));
  } catch {
    // A full or blocked store must not break the interaction; continuity is a bonus, not the product.
  }
}

export const CURRENT_STATE_EVENT = "yorisou:pxr1-current-state";

export function subscribeCurrentStateCheckIn(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CURRENT_STATE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CURRENT_STATE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
