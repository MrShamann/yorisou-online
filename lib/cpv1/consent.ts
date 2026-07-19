// CPV1 WS-E (+ CPV1-R1 §9 independent permissions) — method-level consent.
//
// Consent is per method, not global, and permissions are INDEPENDENT — never an
// ordered level and never inferred from one another. Three independent axes:
//   • Retention: session_only / device_local / account_saved.
//   • Downstream purposes: report / companion / recommendation / community /
//     public / archive / legacy — each an explicit, independent grant.
//   • Visibility: private / shared / public_safe.
// Recommendation use does not grant Companion use (or vice-versa); report use
// grants neither; community + public each require an explicit action; Archive
// inclusion does not grant Legacy designation; Legacy is recipient-specific.

export type RetentionMode = "session_only" | "device_local" | "account_saved";
export type Visibility = "private" | "shared" | "public_safe";
export type DownstreamPurpose = "report" | "companion" | "recommendation" | "community" | "public" | "archive" | "legacy";

export type MethodConsent = {
  methodId: string;
  retention: RetentionMode; // default session_only for sensitive methods
  saveAcknowledged: boolean; // explicit save action taken
  rawLocationMinimized: boolean; // true ⇒ only derived tz/coords kept
  derivedProvenance: string | null;
  visibility: Visibility; // default private
  // §9 — INDEPENDENT purpose grants. Each false by default; none implies another.
  purposes: Record<DownstreamPurpose, boolean>;
  // Legacy is recipient-specific: designation requires ≥1 explicit recipient id.
  legacyRecipients: string[];
  updatedAt: string;
};

const SENSITIVE_METHOD_FAMILIES = new Set(["chinese_traditional", "western_symbolic"]);

function noPurposes(): Record<DownstreamPurpose, boolean> {
  return {
    report: false,
    companion: false,
    recommendation: false,
    community: false,
    public: false,
    archive: false,
    legacy: false,
  };
}

// Default consent — restrictive. Sensitive/birth-data families start session-only,
// private, no downstream purposes, no recipients.
export function defaultConsent(methodId: string, family: string): MethodConsent {
  const sensitive = SENSITIVE_METHOD_FAMILIES.has(family);
  return {
    methodId,
    retention: sensitive ? "session_only" : "device_local",
    saveAcknowledged: false,
    rawLocationMinimized: true,
    derivedProvenance: null,
    visibility: "private",
    purposes: noPurposes(),
    legacyRecipients: [],
    updatedAt: "",
  };
}

// A save is only valid when explicitly acknowledged. Sensitive (session_only)
// methods cannot be persisted beyond the session.
export function canPersist(c: MethodConsent): boolean {
  if (c.retention === "session_only") return false;
  return c.saveAcknowledged;
}

// §9 — a purpose is allowed ONLY if it is independently granted (never inferred),
// with community/public additionally requiring public_safe visibility, and legacy
// additionally requiring an explicit recipient.
export function consentAllows(c: MethodConsent, purpose: DownstreamPurpose): boolean {
  if (!c.purposes[purpose]) return false;
  if ((purpose === "community" || purpose === "public") && c.visibility !== "public_safe") return false;
  if (purpose === "community" && !c.saveAcknowledged) return false;
  if (purpose === "legacy" && c.legacyRecipients.length === 0) return false;
  return true;
}

export function canShareToCommunity(c: MethodConsent): boolean {
  return consentAllows(c, "community");
}

// §9 — revoking a purpose only changes THAT purpose; others are untouched. The
// returned consent reflects the revocation immediately (applies on next read).
export function revokePurpose(c: MethodConsent, purpose: DownstreamPurpose): MethodConsent {
  return { ...c, purposes: { ...c.purposes, [purpose]: false } };
}

export function grantPurpose(c: MethodConsent, purpose: DownstreamPurpose): MethodConsent {
  return { ...c, purposes: { ...c.purposes, [purpose]: true } };
}

export type UserDataRight = "confirm" | "correct" | "reject" | "hide" | "forget" | "delete" | "export" | "revoke_downstream";

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
