// CPV1 WS-F (+ CPV1-R1 §8 identity, data-rights events, deletion model;
// + R1 Part-B 11A.1 composite identity, 11A.2 reason-coded audit) —
// longitudinal history events (immutable / version-preserving).
//
// History events are append-only. When a method's logic changes, prior results
// are NOT silently rewritten — a new event records the change. Confirmation and
// correction target an ENFORCED COMPOSITE identity (object kind + object ref +
// method id + method version), never a bare id — so confirmation can never leak
// between method versions, between methods, or between object kinds even if a
// textual id is reused. Data-rights events (forget/delete/export/revoke/permission
// changes) are first-class and carry NO personal free text: their audit detail is
// an internally-generated fixed message keyed by an enumerated reason code.

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

// R1 11A.2 — data-rights audit reason codes. Audit detail is generated INTERNALLY
// from these; callers may never supply free text.
export type DataRightsReason =
  | "user_requested"
  | "consent_withdrawn"
  | "retention_expired"
  | "policy_enforced"
  | "export_fulfilled"
  | "downstream_revoked";

// Fixed, non-personal audit messages. This is the ONLY source of data-rights
// safeDetail — no user/report/memory/relationship content can ever enter it.
export const DATA_RIGHTS_MESSAGES: Record<DataRightsReason, string> = {
  user_requested: "data-rights action performed at user request",
  consent_withdrawn: "consent withdrawn by user",
  retention_expired: "retention window expired",
  policy_enforced: "removed by data-retention policy",
  export_fulfilled: "user data export fulfilled",
  downstream_revoked: "downstream use revoked by user",
};

// The fixed tombstone detail (deletion). Also non-personal.
export const TOMBSTONE_DETAIL = "personal content deleted at user request" as const;

// The complete set of allowed data-rights safeDetail strings (for schema alignment
// + tests): the enumerated reason messages plus the tombstone marker.
export const ALLOWED_DATA_RIGHTS_DETAILS: readonly string[] = [
  ...Object.values(DATA_RIGHTS_MESSAGES),
  TOMBSTONE_DETAIL,
];

// The event types that are data-rights / audit events (must carry a reason code
// and a fixed non-personal detail).
export const DATA_RIGHTS_EVENT_TYPES: readonly HistoryEventType[] = [
  "user_forgot",
  "user_deleted",
  "user_exported",
  "downstream_revoked",
  "method_consent_changed",
  "companion_permission_changed",
  "recommendation_permission_changed",
  "community_permission_changed",
  "archive_permission_changed",
  "legacy_designation_changed",
];

export type HistoryEvent = {
  id: string; // EVENT id — distinguishes duplicate events
  type: HistoryEventType;
  methodId: string | null;
  methodVersion: string | null;
  objectKind: ObjectKind;
  objectRef: string | null; // EXACT object identity (result/observation/action id) — NEVER a method id
  at: string; // ISO; append-only
  safeDetail: string | null; // NON-personal detail only
  reasonCode: DataRightsReason | null; // 11A.2 — set for data-rights events; null otherwise
  supersedesVersion: string | null; // version-preserving
  priorVersionConfirmed: boolean; // §8 — whether the superseded version was user-confirmed
};

// Append-only guard: history is never mutated in place.
export function appendEvent(history: readonly HistoryEvent[], event: HistoryEvent): HistoryEvent[] {
  return [...history, event];
}

// ── 11A.1 — enforced COMPOSITE identity ──────────────────────────────────────
// The stable identity of the object an event targets is the tuple
//   (objectKind, methodId, methodVersion, objectRef).
// Returns null (identity cannot be safely formed → confirms/matches NOTHING) when:
//   - objectRef is null/empty (no object to identify), OR
//   - objectKind is null (kind unknown), OR
//   - the kind is result/observation but methodId or methodVersion is null
//     (a method-derived object REQUIRES method+version to be isolated per version).
// Because methodVersion and methodId and objectKind are all part of the key:
//   • same objectRef + different methodVersion  → different identity (version isolation)
//   • same objectRef + different methodId        → different identity (method isolation)
//   • same textual id as result vs observation   → different identity (kind isolation)
// JSON encoding avoids any delimiter-collision across id/version strings.
const METHOD_SCOPED_KINDS: readonly ObjectKind[] = ["result", "observation"];

export function stableIdentity(e: {
  objectKind: ObjectKind;
  methodId: string | null;
  methodVersion: string | null;
  objectRef: string | null;
}): string | null {
  if (!e.objectRef || e.objectRef.length === 0) return null;
  if (e.objectKind === null) return null;
  if (METHOD_SCOPED_KINDS.includes(e.objectKind)) {
    if (!e.methodId || !e.methodVersion) return null; // fail closed (11A.1 test 4)
  }
  return JSON.stringify([e.objectKind, e.methodId, e.methodVersion, e.objectRef]);
}

// Create a user_confirmation event with the FULL composite identity, so callers
// never have to reconstruct the identity convention by hand.
export function recordConfirmation(input: {
  id: string;
  objectKind: ObjectKind;
  methodId: string | null;
  methodVersion: string | null;
  objectRef: string;
  at: string;
}): HistoryEvent {
  return {
    id: input.id,
    type: "user_confirmed",
    methodId: input.methodId,
    methodVersion: input.methodVersion,
    objectKind: input.objectKind,
    objectRef: input.objectRef,
    at: input.at,
    safeDetail: null,
    reasonCode: null,
    supersedesVersion: null,
    priorVersionConfirmed: false,
  };
}

// §8 — record a result-logic change WITHOUT rewriting the prior result. `resultId`
// + `userConfirmed` are both USED: the event targets the exact result (with method
// + version so its identity is version-isolated) and records whether the prior
// version had been confirmed.
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
    reasonCode: null,
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
    safeDetail: TOMBSTONE_DETAIL, // fixed; no personal content
    reasonCode: "user_requested",
    supersedesVersion: null,
    priorVersionConfirmed: false,
  };
}

// A guard used by tests: a tombstone / audit event must never carry personal
// content in safeDetail.
export function tombstoneCarriesNoPersonalContent(e: HistoryEvent): boolean {
  return e.type === "user_deleted" && (e.safeDetail === null || e.safeDetail === TOMBSTONE_DETAIL);
}

// 11A.2 — a data-rights audit event carries NO free text. safeDetail is generated
// internally from the enumerated `reason`; there is no caller-supplied text path.
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
  reason: DataRightsReason; // enumerated — the ONLY input that shapes the detail
}): HistoryEvent {
  return {
    id: input.id,
    type: input.type,
    methodId: null,
    methodVersion: null,
    objectKind: input.objectKind,
    objectRef: input.objectRef,
    at: input.at,
    safeDetail: DATA_RIGHTS_MESSAGES[input.reason], // internally generated; never caller text
    reasonCode: input.reason,
    supersedesVersion: null,
    priorVersionConfirmed: false,
  };
}

// A guard used by tests + verification: a data-rights / audit event's detail is
// always one of the fixed non-personal strings, and it carries a valid reason code.
// Proves no personal/free text can survive in a data-rights audit event.
export function dataRightsEventCarriesNoFreeText(e: HistoryEvent): boolean {
  if (!DATA_RIGHTS_EVENT_TYPES.includes(e.type)) return true; // not a data-rights event
  const detailOk = e.safeDetail === null || ALLOWED_DATA_RIGHTS_DETAILS.includes(e.safeDetail);
  const reasonOk = e.reasonCode !== null && e.reasonCode in DATA_RIGHTS_MESSAGES;
  return detailOk && reasonOk;
}

export type ChangeView = {
  at: string;
  methodId: string | null;
  methodVersion: string | null;
  objectRef: string | null;
  what: string;
  userConfirmed: boolean;
};

// §8/11A.1 — confirmation state is resolved by the EXACT COMPOSITE identity.
// Confirming result A (method M, version v1) does not confirm result B, another
// method, another kind, or version v2 — each has a distinct composite identity.
export function buildChangeView(history: readonly HistoryEvent[]): ChangeView[] {
  const confirmed = new Set<string>();
  for (const e of history) {
    if (e.type === "user_confirmed") {
      const key = stableIdentity(e);
      if (key) confirmed.add(key); // unidentifiable confirmations confirm nothing (11A.1 test 4)
    }
  }
  return history
    .filter((e) => e.type === "result_created" || e.type === "user_corrected" || e.type === "user_rejected")
    .map((e) => {
      const key = stableIdentity(e);
      return {
        at: e.at,
        methodId: e.methodId,
        methodVersion: e.methodVersion,
        objectRef: e.objectRef,
        what: e.safeDetail ?? e.type,
        // Confirmed only if THIS exact composite object was confirmed, or its prior
        // version was explicitly recorded as confirmed on the change event itself.
        userConfirmed: (key ? confirmed.has(key) : false) || e.priorVersionConfirmed,
      };
    });
}
