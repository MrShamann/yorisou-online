// CPV1 WS-F — longitudinal history events (immutable / version-preserving).
//
// History events are append-only. When a method's logic changes, prior results
// are NOT silently rewritten — a new event records the change, its time, the
// method + version, whether the user confirmed it, and what they tried. Users
// can always see what changed, when, and by which method version.

export type HistoryEventType =
  | "method_completed"
  | "result_created"
  | "user_confirmed"
  | "user_corrected"
  | "user_rejected"
  | "reflection_recorded"
  | "action_saved"
  | "action_tried"
  | "action_completed"
  | "marked_helpful"
  | "marked_not_helpful"
  | "hidden"
  | "not_for_me"
  | "companion_interaction"
  | "community_participation"
  | "recommendation_outcome";

export type HistoryEvent = {
  id: string;
  type: HistoryEventType;
  methodId: string | null;
  methodVersion: string | null;
  objectRef: string | null; // result id / action id / item id (safe ref, no raw content)
  at: string; // ISO; append-only
  safeDetail: string | null; // non-sensitive detail
  // Version-preserving: when a result is superseded, we record the prior version
  // rather than overwriting it.
  supersedesVersion: string | null;
};

// Append-only guard: history is never mutated in place. This helper returns a
// new array; callers must never rewrite an existing event.
export function appendEvent(history: readonly HistoryEvent[], event: HistoryEvent): HistoryEvent[] {
  return [...history, event];
}

// When method logic changes, record the change explicitly instead of rewriting.
export function recordResultChange(input: {
  id: string;
  methodId: string;
  fromVersion: string;
  toVersion: string;
  userConfirmed: boolean;
  at: string;
}): HistoryEvent {
  return {
    id: input.id,
    type: "result_created",
    methodId: input.methodId,
    methodVersion: input.toVersion,
    objectRef: null,
    at: input.at,
    safeDetail: `method logic updated ${input.fromVersion} → ${input.toVersion}; prior result preserved`,
    supersedesVersion: input.fromVersion,
  };
}

// A user-facing "what changed" view derived from the append-only log.
export type ChangeView = {
  at: string;
  methodId: string | null;
  methodVersion: string | null;
  what: string;
  userConfirmed: boolean;
};

export function buildChangeView(history: readonly HistoryEvent[]): ChangeView[] {
  const confirmed = new Set(
    history.filter((e) => e.type === "user_confirmed").map((e) => e.objectRef ?? e.methodId ?? ""),
  );
  return history
    .filter((e) => e.type === "result_created" || e.type === "user_corrected" || e.type === "user_rejected")
    .map((e) => ({
      at: e.at,
      methodId: e.methodId,
      methodVersion: e.methodVersion,
      what: e.safeDetail ?? e.type,
      userConfirmed: confirmed.has(e.objectRef ?? e.methodId ?? ""),
    }));
}
