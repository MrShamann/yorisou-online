// PXR-1 — 保存する / 今は違う, device-local.
//
// The two controls have to do something, or they are theatre. 保存する has to make the thing
// findable later; 今は違う has to make it go away. Both are recorded here, in this browser only.
//
// WHAT THIS IS NOT. Not a profile, not a preference model, not an analytics event, not an identity
// store, and not an input to any inference. Nothing here is read to decide what a person is like —
// it is read to decide what to show and what to stop showing, which is a different thing. Saving
// is not a signal of a trait, and dismissing is not a negative rating. There is no score, no
// streak, no counter, and nothing that accumulates into a judgement.
//
// It follows the same contract shape as `lib/yorisou/today/currentStateCheckIn.ts`: one versioned
// key, a record this version wrote or nothing, and an event so open surfaces stay in step.

export const RECOMMENDATION_FEEDBACK_VERSION = "pxr1-recommendation-feedback-v1" as const;

export type RecommendationFeedbackRecord = {
  version: typeof RECOMMENDATION_FEEDBACK_VERSION;
  /** Recommendation ids the person chose to keep. Order is save order, newest last. */
  saved: string[];
  /** Recommendation ids the person set aside. 「今は」— reversible, and reversed from the UI. */
  dismissed: string[];
  updatedAt: string;
};

const STORAGE_KEY = "yorisou.pxr1.recommendationFeedback.v1";
export const RECOMMENDATION_FEEDBACK_EVENT = "yorisou:pxr1-recommendation-feedback";

/** One frozen instance, so "nothing recorded" is the SAME object every time it is returned. */
export const EMPTY_RECOMMENDATION_FEEDBACK: RecommendationFeedbackRecord = Object.freeze({
  version: RECOMMENDATION_FEEDBACK_VERSION,
  saved: Object.freeze([]) as unknown as string[],
  dismissed: Object.freeze([]) as unknown as string[],
  updatedAt: "",
});

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function parseFeedback(raw: string | null): RecommendationFeedbackRecord {
  if (!raw) return EMPTY_RECOMMENDATION_FEEDBACK;
  try {
    const parsed = JSON.parse(raw) as Partial<RecommendationFeedbackRecord>;
    if (parsed.version !== RECOMMENDATION_FEEDBACK_VERSION) return EMPTY_RECOMMENDATION_FEEDBACK;
    if (!isStringArray(parsed.saved) || !isStringArray(parsed.dismissed)) {
      return EMPTY_RECOMMENDATION_FEEDBACK;
    }
    return {
      version: RECOMMENDATION_FEEDBACK_VERSION,
      saved: parsed.saved,
      dismissed: parsed.dismissed,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return EMPTY_RECOMMENDATION_FEEDBACK;
  }
}

// Cached against the raw string — REQUIRED, not an optimisation. `useSyncExternalStore` compares
// snapshots by identity during render; a reader that re-parses on every call is never equal to
// itself and the component loops until React throws. See the same note in
// `lib/yorisou/today/currentStateCheckIn.ts`, where exactly that shipped and had to be fixed.
let cachedRaw: string | null = null;
let cachedRecord: RecommendationFeedbackRecord = EMPTY_RECOMMENDATION_FEEDBACK;

/** Reads only a record this version wrote. An older or unknown shape is ignored, never guessed at. */
export function readRecommendationFeedback(): RecommendationFeedbackRecord {
  if (typeof window === "undefined") return EMPTY_RECOMMENDATION_FEEDBACK;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY_RECOMMENDATION_FEEDBACK;
  }
  if (raw === cachedRaw) return cachedRecord;
  cachedRaw = raw;
  cachedRecord = parseFeedback(raw);
  return cachedRecord;
}

/** The server and first-paint snapshot. Stable by construction. */
export function readRecommendationFeedbackServerSnapshot(): RecommendationFeedbackRecord {
  return EMPTY_RECOMMENDATION_FEEDBACK;
}

function write(next: Omit<RecommendationFeedbackRecord, "version" | "updatedAt">): void {
  if (typeof window === "undefined") return;
  const record: RecommendationFeedbackRecord = {
    version: RECOMMENDATION_FEEDBACK_VERSION,
    saved: next.saved,
    dismissed: next.dismissed,
    updatedAt: new Date().toISOString(),
  };
  try {
    const raw = JSON.stringify(record);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedRecord = record;
    window.dispatchEvent(new Event(RECOMMENDATION_FEEDBACK_EVENT));
  } catch {
    // A full or blocked store must not break the interaction.
  }
}

const without = (list: string[], id: string) => list.filter((x) => x !== id);
const withId = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

/** Saving something that was set aside brings it back — the two states are mutually exclusive. */
export function saveRecommendation(id: string): void {
  const current = readRecommendationFeedback();
  write({ saved: withId(current.saved, id), dismissed: without(current.dismissed, id) });
}

export function unsaveRecommendation(id: string): void {
  const current = readRecommendationFeedback();
  write({ saved: without(current.saved, id), dismissed: current.dismissed });
}

/** 今は違う. Reversible by design: the copy says 今は, so the state has to be undoable. */
export function dismissRecommendation(id: string): void {
  const current = readRecommendationFeedback();
  write({ saved: without(current.saved, id), dismissed: withId(current.dismissed, id) });
}

export function restoreRecommendation(id: string): void {
  const current = readRecommendationFeedback();
  write({ saved: current.saved, dismissed: without(current.dismissed, id) });
}

export function subscribeRecommendationFeedback(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(RECOMMENDATION_FEEDBACK_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(RECOMMENDATION_FEEDBACK_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
