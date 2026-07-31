// POR-1 — the identity-provisioning ROLLOUT RULE, as a pure function.
//
// The saga tables live in a Preview-only migration, so a deployment that predates them must not
// attempt an RPC that cannot succeed. Same rollout-ordering problem the mutation fence hit, where
// requiring a Preview-only RPC turned the Production-lineage CI databases red.
//
// WHAT READINESS DOES *NOT* GATE — and this is the whole point of the file existing separately.
//
// Readiness gates DURABILITY: whether a registration that dies half-way can be resumed from a
// recorded cursor. It does NOT gate HONESTY. A registration that cannot prove the canonical identity
// exists must refuse to report success in EVERY mode, including one with no saga table, because a
// 200 over an unproven identity is a capability-honesty violation and not a missing feature. Gating
// the truthfulness on a schema flag would mean the old deployment kept lying and nobody could tell
// which deployments were which.
//
// No `server-only`: the rule is pure, and the permanent tests exercise this module rather than a
// paraphrase of it.

export type ProvisioningMode = "durable_saga" | "inline_verified";

/**
 * `inline_verified` — no saga table. Every step still runs, every step is still PROVEN, and a
 *   failure is still reported as a failure. What is missing is the durable cursor, so a crash
 *   mid-registration leaves partial state that the next attempt must re-derive rather than resume.
 * `durable_saga`    — the tables exist. The same steps, with the cursor recorded before and after
 *   each one, so a retry resumes at the exact stage instead of repeating a write.
 */
export function resolveProvisioningMode(input: { schemaReady: boolean }): ProvisioningMode {
  return input.schemaReady ? "durable_saga" : "inline_verified";
}

/**
 * Readiness is its own environment variable, not a fifth capability.
 *
 * The four `YORISOU_POR1_*` capabilities are product switches an operator flips to stop a
 * misbehaving feature. This is infrastructure: whether a schema exists. Conflating them would mean
 * kill-switching a product capability also silently disabled the durability of registration.
 */
export function isIdentityProvisioningSchemaReady(): boolean {
  const raw = process.env.YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY;
  if (typeof raw !== "string") return false;
  return raw.trim().toLowerCase() === "on";
}

/**
 * The bounded outcome vocabulary the route maps to HTTP.
 *
 * Closed on purpose. An open-ended reason string is how an internal error message reaches a response
 * body, and how "we could not reach the identity store" and "that email is taken" end up
 * indistinguishable to the client — which is exactly the ambiguity the fence's error-code work had
 * to undo elsewhere in this package.
 */
export type ProvisioningOutcome =
  | "completed"
  | "email_exists"
  | "in_progress"
  | "retryable"
  | "terminal";

/**
 * Registration's HTTP contract.
 *
 * `200` means, and only means, that every required piece of canonical identity is durably present.
 * `409` is the approved identity conflict — the same answer the pre-POR-1 route already gave, so it
 *   reveals nothing new; the account-existence oracle is unchanged, not widened.
 * `503` is retryable. It is deliberately NOT 500: a caller that can usefully retry should be told
 *   so, and an unclassified 500 that is actually retryable teaches everyone to ignore 500s.
 * `500` is reserved for a genuinely unclassified failure, which is now a small set rather than the
 *   default.
 */
export function provisioningHttpStatus(outcome: ProvisioningOutcome): number {
  switch (outcome) {
    case "completed":
      return 200;
    case "email_exists":
      return 409;
    case "in_progress":
      // Another request is already provisioning this exact registration. Retryable, not a conflict:
      // the honest answer to a double-submit is "ask again in a moment", not "that email is taken".
      return 503;
    case "retryable":
      return 503;
    case "terminal":
      return 500;
  }
}

/**
 * May an account with this saga state authenticate, reset, recover or bind LINE?
 *
 * Pure, and separated from the RPC deliberately: this is the decision, and a decision that can only
 * be exercised by standing up a database is a decision nobody tests exhaustively. Two of its four
 * rules exist because getting them wrong is worse than not having the gate at all.
 */
export function decideProvisioningAccess(
  status: { found: boolean; state: string | null; accountId: string | null },
  accountId: string,
): { allowed: true } | { allowed: false; reason: "identity_provisioning_incomplete" } {
  // No saga: an account that predates this migration, or one whose provisioning row was purged with
  // the account. Nothing to refuse.
  if (!status.found) return { allowed: true };
  if (status.state === "completed") return { allowed: true };

  // A saga that created NOTHING cannot have produced a partial account. Refusing on it would hand
  // anyone a denial-of-service: attempt to register someone else's address, and the address's real
  // owner is locked out of login by a row that describes a registration that never happened.
  if (!status.accountId) return { allowed: true };

  // A saga naming a DIFFERENT account is not about this person.
  if (status.accountId !== accountId) return { allowed: true };

  return { allowed: false, reason: "identity_provisioning_incomplete" };
}
