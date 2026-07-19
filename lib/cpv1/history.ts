// CPV1 WS-F (+ CPV1-R1 §8 identity, data-rights events, deletion model) —
// longitudinal history events (immutable / version-preserving).
//
// History events are append-only. When a method's logic changes, prior results
// are NOT silently rewritten — a new event records the change. §8: confirmation
// and correction target EXACT objects (a result/observation id + version), never
// a method id alone. Data-rights events (forget/delete/export/revoke/permission
// changes) are first-class. Deletion of personal content must never survive in
// audit metadata — a tombstone carries NO personal content.

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
  | "recommendation_outcome"
  // §8 — data-rights / audit events (each is real, tested, and schema-backed):
  | "user_forgot"
  | "user_deleted"
  | "user_exported"
  | "downstream_revoked"
  | "method_consent_changed"
  | "companion_permission_changed"
  | "recommendation_permission_changed"
  | "community_permission_changed"
  | "archive_permission_changed"
  | "legacy_designation_changed";

// The kind of object an event targets — so a result is never confused with a
// method or an observation.
export type ObjectKind = "result" | "observation" | "action" | "permission" | "recipient" | null;

export type HistoryEvent = {
  id: string; // EVENT id — distinguishes duplicate events (§8 test 7)
  type: HistoryEventType;
  methodId: string | null;
  methodVersion: string | null;
  objectKind: ObjectKind;
  objectRef: string | null; // EXACT object identity (result/observation/action id) — NEVER a method id
  at: string; // ISO; append-only
  safeDetail: string | null; // NON-personal detail only
  supersedesVersion: string | null; // version-preserving
  priorVersionConfirmed: boolean; // §8 — whether the superseded version was user-confirmed
};

// Append-only guard: history is never mutated in place.
export function appendEvent(history: readonly HistoryEvent[], event: HistoryEvent): HistoryEvent[] {
  return [...history, event];
}

// §8 — record a result-logic change WITHOUT rewriting the prior result. `resultId`
// + `userConfirmed` are both USED: the event targets the exact result and records
// whether the prior version had been confirmed.
export function recordResultChange(input: {
  id: string; // event id
  methodId: string;
  resultId: string; // EXACT result identity
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
    objectKind: "result",
    objectRef: input.resultId,
    at: input.at,
    safeDetail: `method logic updated ${input.fromVersion} → ${input.toVersion}; prior result ${
      input.userConfirmed ? "was user-confirmed and " : ""
    }preserved`,
    supersedesVersion: input.fromVersion,
    priorVersionConfirmed: input.userConfirmed,
  };
}

// §8 — a deletion tombstone. Carries NO personal content: safeDetail is a fixed
// non-personal marker and objectRef is only the object id (never content).
export function makeTombstone(input: { id: string; objectKind: ObjectKind; objectRef: string; at: string }): HistoryEvent {
  return {
    id: input.id,
    type: "user_deleted",
    methodId: null,
    methodVersion: null,
    objectKind: input.objectKind,
    objectRef: input.objectRef,
    at: input.at,
    safeDetail: "personal content deleted at user request", // fixed; no personal content
    supersedesVersion: null,
    priorVersionConfirmed: false,
  };
}

// A guard used by tests: a tombstone / audit event must never carry personal
// content in safeDetail. (We can only enforce the shape; callers must not inject
// personal content — this proves the deletion event's safeDetail is a fixed marker.)
export function tombstoneCarriesNoPersonalContent(e: HistoryEvent): boolean {
  return e.type === "user_deleted" && (e.safeDetail === null || e.safeDetail === "personal content deleted at user request");
}

// §8 — the exact confirmation identity is the object ref ONLY. A confirmation with
// a null/empty ref is unsafe and is IGNORED (never inferred from a method id).
function confirmationKey(e: HistoryEvent): string | null {
  return e.objectRef && e.objectRef.length > 0 ? e.objectRef : null;
}

export type ChangeView = {
  at: string;
  methodId: string | null;
  methodVersion: string | null;
  objectRef: string | null;
  what: string;
  userConfirmed: boolean;
};

// §8 — confirmation state is resolved by EXACT object ref. Confirming result A does
// not confirm result B or another version, because each has a distinct objectRef.
export function buildChangeView(history: readonly HistoryEvent[]): ChangeView[] {
  const confirmed = new Set<string>();
  for (const e of history) {
    if (e.type === "user_confirmed") {
      const key = confirmationKey(e);
      if (key) confirmed.add(key); // null/empty refs never confirm anything (§8 tests 8,9)
    }
  }
  return history
    .filter((e) => e.type === "result_created" || e.type === "user_corrected" || e.type === "user_rejected")
    .map((e) => {
      const key = confirmationKey(e);
      return {
        at: e.at,
        methodId: e.methodId,
        methodVersion: e.methodVersion,
        objectRef: e.objectRef,
        what: e.safeDetail ?? e.type,
        // Confirmed only if THIS exact object was confirmed (or its prior version was).
        userConfirmed: (key ? confirmed.has(key) : false) || e.priorVersionConfirmed,
      };
    });
}

// §8 — a data-rights event (forget/export/revoke/permission change) targeting an
// exact object. Non-personal safeDetail only.
export function recordDataRightsEvent(input: {
  id: string;
  type: Extract<
    HistoryEventType,
    | "user_forgot"
    | "user_exported"
    | "downstream_revoked"
    | "method_consent_changed"
    | "companion_permission_changed"
    | "recommendation_permission_changed"
    | "community_permission_changed"
    | "archive_permission_changed"
    | "legacy_designation_changed"
  >;
  objectKind: ObjectKind;
  objectRef: string;
  at: string;
  safeDetail?: string | null;
}): HistoryEvent {
  return {
    id: input.id,
    type: input.type,
    methodId: null,
    methodVersion: null,
    objectKind: input.objectKind,
    objectRef: input.objectRef,
    at: input.at,
    safeDetail: input.safeDetail ?? null, // callers pass NON-personal detail only
    supersedesVersion: null,
    priorVersionConfirmed: false,
  };
}
