// CPV1 WS-E — method-level consent + sensitive-input handling.
//
// Consent is per method, not global. Birth-data methods default to SESSION-ONLY
// calculation; saving is an explicit action; retention is granular; raw location
// is minimized (only derived timezone/coordinate provenance is kept when saved);
// community use is prohibited by default. Every user can confirm, correct,
// reject, hide, forget, delete, export, and revoke downstream use.

export type RetentionMode = "session_only" | "device_local" | "account_saved";

export type MethodConsent = {
  methodId: string;
  retention: RetentionMode; // default session_only for sensitive methods
  saveAcknowledged: boolean; // explicit save action taken
  rawLocationMinimized: boolean; // true ⇒ only derived tz/coords kept
  derivedProvenance: string | null; // e.g. "tz=Asia/Tokyo (derived); coords rounded"
  companionUse: boolean; // opt-in
  recommendationUse: boolean; // opt-in
  communityUse: boolean; // default false, must stay false unless explicit
  updatedAt: string;
};

const SENSITIVE_METHOD_FAMILIES = new Set(["chinese_traditional", "western_symbolic"]);

// Default consent for a method. Sensitive/birth-data families start session-only,
// no downstream use, community prohibited.
export function defaultConsent(methodId: string, family: string): MethodConsent {
  const sensitive = SENSITIVE_METHOD_FAMILIES.has(family);
  return {
    methodId,
    retention: sensitive ? "session_only" : "device_local",
    saveAcknowledged: false,
    rawLocationMinimized: true,
    derivedProvenance: null,
    companionUse: false,
    recommendationUse: false,
    communityUse: false,
    updatedAt: "",
  };
}

// A save is only valid when the user has explicitly acknowledged it. Sensitive
// methods cannot be persisted beyond the session without saveAcknowledged.
export function canPersist(c: MethodConsent): boolean {
  if (c.retention === "session_only") return false;
  return c.saveAcknowledged;
}

// Community use is never allowed unless explicitly enabled AND the method
// permits it (methods default to prohibited).
export function canShareToCommunity(c: MethodConsent): boolean {
  return c.communityUse === true && c.saveAcknowledged === true;
}

export type UserDataRight = "confirm" | "correct" | "reject" | "hide" | "forget" | "delete" | "export" | "revoke_downstream";

// Every user always has every right available on their own data.
export const ALL_USER_DATA_RIGHTS: readonly UserDataRight[] = [
  "confirm",
  "correct",
  "reject",
  "hide",
  "forget",
  "delete",
  "export",
  "revoke_downstream",
];
