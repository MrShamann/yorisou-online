// CPV1 WS-B2/B3 — Method & Content Rights Registry + public activation gate.
//
// First-class governance for every method's rights posture. A method may reach a
// PUBLIC route only when its rights record CLEARS and the full activation gate
// passes. "Found online" is never a valid route. Unknown/incomplete rights are
// RIGHTS_REVIEW_REQUIRED and stay off public routes.

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
  softwareLicense: string; // SPDX id or "n/a" or "review_required"
  commercialUsePermission: RightsStatus;
  translationRights: RightsStatus;
  modificationRights: RightsStatus;
  attribution: string | null;
  dataOrEphemerisSource: string | null; // e.g. licensed ephemeris; null if n/a
  artworkRights: RightsStatus;
  reviewer: string | null; // human reviewer; null while unreviewed
  evidence: string | null; // link/ref to the rights evidence; null while none
  reviewDate: string | null; // ISO; null while unreviewed
  activationGate: "closed" | "open"; // open only after a passing Founder review
};

// The routes that CAN clear rights once the rest of the record is satisfied.
const CLEARABLE_ROUTES: ReadonlySet<RightsRoute> = new Set<RightsRoute>([
  "YORISOU_ORIGINAL",
  "VERIFIED_PUBLIC_DOMAIN_REIMPLEMENTATION",
  "OPEN_LICENSE_COMMERCIAL_USE",
  "FORMALLY_LICENSED_INTEGRATION",
  "OFFICIAL_EXTERNAL_HANDOFF",
  "USER_RESULT_IMPORT",
]);

// A rights record CLEARS only when the route is clearable, copyright + commercial
// use + artwork are clear (or n/a), a human reviewer + evidence + date exist, and
// the activation gate has been opened. RIGHTS_REVIEW_REQUIRED never clears.
export function rightsClears(r: RightsRecord): boolean {
  if (!CLEARABLE_ROUTES.has(r.rightsRoute)) return false;
  const ok = (s: RightsStatus) => s === "clear" || s === "not_applicable";
  return (
    ok(r.copyrightStatus) &&
    ok(r.commercialUsePermission) &&
    ok(r.artworkRights) &&
    Boolean(r.reviewer) &&
    Boolean(r.evidence) &&
    Boolean(r.reviewDate) &&
    r.activationGate === "open"
  );
}

// A pending/blocked template used for every external method until a human clears
// its rights. Deliberately non-clearing.
export function rightsReviewRequired(methodId: string, source: string): RightsRecord {
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
    artworkRights: "pending",
    reviewer: null,
    evidence: null,
    reviewDate: null,
    activationGate: "closed",
  };
}

// A YORISOU-original record (clears once a Founder review opens the gate). For
// existing, already-shipped original methods we mark the gate open with a
// self-attributed review so they remain usable; genuinely new originals stay
// closed until reviewed.
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
  };
}
