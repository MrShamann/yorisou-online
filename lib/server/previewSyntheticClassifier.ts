// POR-1 WS-G — WHICH Preview identities are provably ours to delete.
//
// THE GAP THIS CLOSES.
//
// The cleanup tool recognised one suffix, `@synthetic-preview.invalid`, and deleted anything
// carrying it. The acceptance and contention work in this package also created accounts on
// `@example.com`, so a cleanup run would have reported success while leaving 109 synthetic accounts
// behind — and "the second run removed nothing" would have been true for the wrong reason.
//
// THE OBVIOUS FIX IS THE DANGEROUS ONE. `email.endsWith("@example.com")` is not a synthetic
// classifier: `scripts/verify-session-auth-shadow-write-readiness.ts` and
// `verify-session-auth-first-writer-switch-login.ts` both create `shadow-*@example.com` and
// `switch-*@example.com` accounts, and a domain-only rule would sweep those up as collateral. A
// deletion tool must never be one careless predicate away from destroying something it was not
// pointed at.
//
// So membership requires a CONJUNCTION: the reserved domain AND the generated local-part shape that
// only these fixtures produce. Anything else is reported as unknown and left strictly alone.
//
// Pure and dependency-free, so the permanent tests exercise the real decision rather than a
// restatement of it.

export type PreviewSyntheticFamily = "cpc1_acceptance_fixture" | "por1_probe_and_registration";

export type PreviewIdentityClassification =
  | { synthetic: true; family: PreviewSyntheticFamily }
  | { synthetic: false; reason: "domain_not_reserved" | "local_part_not_fixture_generated" };

/**
 * `syntheticUser()` builds `cpc1-<label>-<runId>` where runId is base36 time + 6 hex chars, and the
 * label is a lowercase hyphenated fixture name. Anchored at both ends: a prefix match alone would
 * accept `cpc1-anything` typed by hand.
 */
const CPC1_FIXTURE_LOCAL = /^cpc1-[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{8,}$/;

/**
 * The probe and WS-F4 harnesses build `por1<family><entropy>` — always the literal `por1`, then only
 * lowercase alphanumerics, with enough entropy that it cannot be typed by accident.
 *
 * `por1` is deliberately part of the LOCAL PART and not merely a domain: it is the package marker,
 * and it is what separates these from `shadow-*` and `switch-*` on the same reserved domain.
 */
const POR1_PROBE_LOCAL = /^por1[a-z0-9]{8,}$/;

/** RFC 2606 reserved, plus this project's own invalid-TLD fixture domain. Never routable. */
const RESERVED_DOMAINS = new Set(["example.com", "synthetic-preview.invalid"]);

/**
 * Decide whether a Preview identity is one this package created.
 *
 * Deliberately conservative in one direction only: a false NEGATIVE leaves residue that the
 * inventory will report and a human can look at, while a false POSITIVE destroys something nobody
 * asked to destroy. When those two are not symmetric, the classifier does not get to guess.
 */
export function classifyPreviewSyntheticIdentity(email: string): PreviewIdentityClassification {
  const normalized = (email || "").trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0) return { synthetic: false, reason: "domain_not_reserved" };

  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);

  if (!RESERVED_DOMAINS.has(domain)) {
    return { synthetic: false, reason: "domain_not_reserved" };
  }

  if (domain === "synthetic-preview.invalid" && CPC1_FIXTURE_LOCAL.test(local)) {
    return { synthetic: true, family: "cpc1_acceptance_fixture" };
  }

  if (domain === "example.com" && POR1_PROBE_LOCAL.test(local)) {
    return { synthetic: true, family: "por1_probe_and_registration" };
  }

  return { synthetic: false, reason: "local_part_not_fixture_generated" };
}

/** Split a Preview population into what may be deleted and what must be left alone. */
export function partitionPreviewIdentities<T extends { id: string; email: string }>(
  accounts: T[],
): {
  synthetic: Array<T & { family: PreviewSyntheticFamily }>;
  unknown: Array<{ id: string; reason: string }>;
} {
  const synthetic: Array<T & { family: PreviewSyntheticFamily }> = [];
  const unknown: Array<{ id: string; reason: string }> = [];

  for (const account of accounts) {
    const verdict = classifyPreviewSyntheticIdentity(account.email);
    if (verdict.synthetic) synthetic.push({ ...account, family: verdict.family });
    // Never the email — it is the only personal field these records carry, synthetic or not.
    else unknown.push({ id: `${account.id.slice(0, 8)}…`, reason: verdict.reason });
  }

  return { synthetic, unknown };
}
