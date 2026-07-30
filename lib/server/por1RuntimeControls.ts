// POR-1 — the four independently stoppable Production capabilities.
//
// Each is a separate switch on purpose. A single "canonical mode" flag would mean that stopping a
// misbehaving recommendation path also stops result persistence, so the safe action would cost
// more than the fault — and an operator who hesitates because the kill switch is too blunt is an
// operator who leaves the fault running.
//
// SERVER-SIDE ONLY. A NEXT_PUBLIC_* value is compiled into the client bundle and is therefore a
// statement about what the UI should show, never a permission. Enforcement lives here.
//
// Deliberately free of `server-only` so the node suite can exercise the REAL resolver rather than a
// restatement of it — the same repo pattern as persistedDimensionSummary and currentUnderstanding.
// It reads a non-public env var, which is absent in the browser, so a client import would resolve
// every capability to OFF: fail-closed either way.

export type Por1Capability =
  | "CANONICAL_CORE"
  | "CANONICAL_RECOMMENDATIONS"
  | "LINE_CANONICAL_RETURN"
  | "ACCOUNT_DELETION_EXECUTOR";

const ENV_PREFIX = "YORISOU_POR1_";

/**
 * Resolve one capability.
 *
 * FAIL CLOSED: unset means OFF. The alternative — treating "unset" as enabled — would activate
 * canonical behaviour in Production the moment a variable was forgotten, which is exactly the
 * accident this package exists to prevent. Only the exact string "on" enables.
 */
export function isPor1CapabilityEnabled(capability: Por1Capability): boolean {
  const raw = process.env[`${ENV_PREFIX}${capability}`];
  if (typeof raw !== "string") return false;
  return raw.trim().toLowerCase() === "on";
}

/** Bounded, non-sensitive snapshot for diagnostics. Never includes any other environment value. */
export function por1CapabilitySnapshot(): Record<Por1Capability, boolean> {
  return {
    CANONICAL_CORE: isPor1CapabilityEnabled("CANONICAL_CORE"),
    CANONICAL_RECOMMENDATIONS: isPor1CapabilityEnabled("CANONICAL_RECOMMENDATIONS"),
    LINE_CANONICAL_RETURN: isPor1CapabilityEnabled("LINE_CANONICAL_RETURN"),
    ACCOUNT_DELETION_EXECUTOR: isPor1CapabilityEnabled("ACCOUNT_DELETION_EXECUTOR"),
  };
}

/**
 * Guard a canonical mutation path.
 *
 * Returns a bounded reason rather than throwing, so callers can conceal or degrade truthfully
 * instead of surfacing a stack trace to someone who simply arrived while a capability was off.
 */
export function requirePor1Capability(
  capability: Por1Capability,
): { allowed: true } | { allowed: false; reason: "capability_disabled" } {
  return isPor1CapabilityEnabled(capability)
    ? { allowed: true }
    : { allowed: false, reason: "capability_disabled" };
}
