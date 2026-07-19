// CPV1 WS-B2/B3 (+ CPV1-R1 §3) — Method & Content Rights Registry + activation gate.
//
// First-class governance for every method's rights posture. A method reaches a
// PUBLIC route only when its rights record CLEARS under ROUTE-SPECIFIC rules AND
// the activation gate passes. "Found online" is never a valid route. Unknown /
// incomplete rights are RIGHTS_REVIEW_REQUIRED and stay off public routes.
//
// CPV1-R1 hardening: public clearance CANNOT occur while ANY applicable rights
// field remains unresolved. Each route declares which fields are applicable and
// how they must be resolved; any `pending`/`blocked` applicable status, missing
// licence/attribution/ephemeris/artwork, missing reviewer/evidence/date, or a
// closed activation gate blocks clearance.

export type RightsRoute =
  | "YORISOU_ORIGINAL"
  | "VERIFIED_PUBLIC_DOMAIN_REIMPLEMENTATION"
  | "OPEN_LICENSE_COMMERCIAL_USE"
  | "FORMALLY_LICENSED_INTEGRATION"
  | "OFFICIAL_EXTERNAL_HANDOFF"
  | "USER_RESULT_IMPORT"
  | "RIGHTS_REVIEW_REQUIRED";

export type RightsStatus = "clear" | "pending" | "blocked" | "not_applicable";

export type RightsRecord = {
  methodId: string;
  rightsRoute: RightsRoute;
  source: string; // provenance description — never "found online"
  copyrightStatus: RightsStatus;
  trademarkStatus: RightsStatus;
  softwareLicense: string; // SPDX id / "proprietary" / "n/a" / "review_required"
  commercialUsePermission: RightsStatus;
  translationRights: RightsStatus;
  modificationRights: RightsStatus;
  attribution: string | null;
  dataOrEphemerisSource: string | null; // licensed/proven ephemeris; null if none
  artworkRights: RightsStatus;
  reviewer: string | null; // human reviewer; null while unreviewed
  evidence: string | null; // ref to rights evidence / official destination; null while none
  reviewDate: string | null; // ISO; null while unreviewed
  activationGate: "closed" | "open"; // open only after a passing Founder review
  // Method-specific applicability (CPV1-R1 §3 "as applicable"):
  requiresEphemeris?: boolean; // e.g. astrology natal chart needs a proven ephemeris
  requiresArtwork?: boolean; // e.g. Tarot / symbolic cards need original/licensed artwork
};

// A status field is RESOLVED when it is neither pending nor blocked.
function resolved(s: RightsStatus): boolean {
  return s === "clear" || s === "not_applicable";
}
function present(v: string | null): boolean {
  return typeof v === "string" && v.trim().length > 0;
}
function licenceResolved(s: string): boolean {
  return present(s) && s !== "review_required";
}

// The full set of status fields evaluated for "no pending applicable field".
const STATUS_FIELDS: Array<keyof RightsRecord> = [
  "copyrightStatus",
  "trademarkStatus",
  "commercialUsePermission",
  "translationRights",
  "modificationRights",
  "artworkRights",
];

type RouteRule = {
  clearable: boolean;
  // Fields that must be actively CLEAR (not merely not_applicable) for this route.
  requireClear: Array<keyof RightsRecord>;
  // Does the route require a resolved software licence?
  requireLicence: boolean;
  // Fields that must be PRESENT (non-null) for this route.
  requirePresent: Array<"attribution" | "dataOrEphemerisSource">;
};

// Route-specific rules (CPV1-R1 §3 examples encoded).
export const ROUTE_RULES: Record<RightsRoute, RouteRule> = {
  YORISOU_ORIGINAL: {
    clearable: true,
    requireClear: ["copyrightStatus", "commercialUsePermission", "modificationRights"],
    requireLicence: false,
    requirePresent: [],
  },
  VERIFIED_PUBLIC_DOMAIN_REIMPLEMENTATION: {
    // Source evidence (universal) + original modern copy + no trademark issue.
    clearable: true,
    requireClear: ["copyrightStatus", "modificationRights", "trademarkStatus"],
    requireLicence: false,
    requirePresent: [],
  },
  OPEN_LICENSE_COMMERCIAL_USE: {
    // Exact licence terms + attribution.
    clearable: true,
    requireClear: ["copyrightStatus", "commercialUsePermission", "trademarkStatus"],
    requireLicence: true,
    requirePresent: ["attribution"],
  },
  FORMALLY_LICENSED_INTEGRATION: {
    clearable: true,
    requireClear: ["commercialUsePermission", "trademarkStatus"],
    requireLicence: true,
    requirePresent: [],
  },
  OFFICIAL_EXTERNAL_HANDOFF: {
    // Official destination (evidence) + trademark-safe copy + no copied instrument
    // (copyright must be not_applicable/clear → enforced by the no-pending rule).
    clearable: true,
    requireClear: ["trademarkStatus"],
    requireLicence: false,
    requirePresent: [],
  },
  USER_RESULT_IMPORT: {
    // Trademark + product-language review; artwork/software/ephemeris N/A.
    clearable: true,
    requireClear: ["trademarkStatus"],
    requireLicence: false,
    requirePresent: [],
  },
  RIGHTS_REVIEW_REQUIRED: {
    clearable: false,
    requireClear: [],
    requireLicence: false,
    requirePresent: [],
  },
};

// A structured resolution report: whether the record clears, and every specific
// reason it does not. Used by the gate, the admin/truth surfaces, and the tests.
export function rightsResolutionReport(r: RightsRecord): { cleared: boolean; unresolved: string[] } {
  const rule = ROUTE_RULES[r.rightsRoute];
  const unresolved: string[] = [];

  if (!rule.clearable) unresolved.push("route:not_clearable");

  // Universal: NO applicable status field may be pending/blocked.
  for (const f of STATUS_FIELDS) {
    if (!resolved(r[f] as RightsStatus)) unresolved.push(`${String(f)}:${r[f]}`);
  }
  // Route-specific: these must be actively clear.
  for (const f of rule.requireClear) {
    if ((r[f] as RightsStatus) !== "clear") unresolved.push(`require_clear:${String(f)}:${r[f]}`);
  }
  // Licence.
  if (rule.requireLicence && !licenceResolved(r.softwareLicense)) unresolved.push(`software_licence:${r.softwareLicense || "missing"}`);
  // Route-specific present fields.
  for (const f of rule.requirePresent) {
    if (!present(r[f])) unresolved.push(`missing:${f}`);
  }
  // Method-specific applicability.
  if (r.requiresEphemeris && !present(r.dataOrEphemerisSource)) unresolved.push("missing:dataOrEphemerisSource");
  if (r.requiresArtwork && r.artworkRights !== "clear") unresolved.push(`require_clear:artworkRights:${r.artworkRights}`);
  // Universal provenance + gate.
  if (!present(r.reviewer)) unresolved.push("missing:reviewer");
  if (!present(r.evidence)) unresolved.push("missing:evidence");
  if (!present(r.reviewDate)) unresolved.push("missing:reviewDate");
  if (r.activationGate !== "open") unresolved.push("activation_gate:closed");

  return { cleared: unresolved.length === 0, unresolved };
}

// A rights record CLEARS only when its route-specific resolution report is empty.
export function rightsClears(r: RightsRecord): boolean {
  return rightsResolutionReport(r).cleared;
}

// A pending/blocked template used for every external method until a human clears
// its rights. Deliberately non-clearing. Method-specific applicability can be set
// so the route-specific gate demands ephemeris/artwork where relevant.
export function rightsReviewRequired(
  methodId: string,
  source: string,
  opts: { requiresEphemeris?: boolean; requiresArtwork?: boolean } = {},
): RightsRecord {
  return {
    methodId,
    rightsRoute: "RIGHTS_REVIEW_REQUIRED",
    source,
    copyrightStatus: "pending",
    trademarkStatus: "pending",
    softwareLicense: "review_required",
    commercialUsePermission: "pending",
    translationRights: "pending",
    modificationRights: "pending",
    attribution: null,
    dataOrEphemerisSource: null,
    artworkRights: opts.requiresArtwork ? "pending" : "not_applicable",
    reviewer: null,
    evidence: null,
    reviewDate: null,
    activationGate: "closed",
    requiresEphemeris: opts.requiresEphemeris ?? false,
    requiresArtwork: opts.requiresArtwork ?? false,
  };
}

// A YORISOU-original record (clears once a Founder review opens the gate). Existing
// already-shipped originals mark the gate open with a self-attributed review; new
// originals stay closed until reviewed.
export function yorisouOriginal(
  methodId: string,
  opts: { activated: boolean; reviewer?: string; reviewDate?: string; evidence?: string } = { activated: false },
): RightsRecord {
  return {
    methodId,
    rightsRoute: "YORISOU_ORIGINAL",
    source: "YORISOU original content + logic (owned)",
    copyrightStatus: "clear",
    trademarkStatus: "not_applicable",
    softwareLicense: "proprietary",
    commercialUsePermission: "clear",
    translationRights: "clear",
    modificationRights: "clear",
    attribution: "YORISOU",
    dataOrEphemerisSource: null,
    artworkRights: "clear",
    reviewer: opts.activated ? opts.reviewer ?? "YORISOU (owned)" : null,
    evidence: opts.activated ? opts.evidence ?? "repository provenance" : null,
    reviewDate: opts.activated ? opts.reviewDate ?? "2026-07-19" : null,
    activationGate: opts.activated ? "open" : "closed",
    requiresEphemeris: false,
    requiresArtwork: false,
  };
}
