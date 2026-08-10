// POR-1 — how a mutation-fence refusal maps to HTTP.
//
// The fence refusing a write is an ANSWER, not a fault. Every route that performs an account-linked
// write ends in `catch (error) { ... 500 }`, and `AccountMutationDenied` is thrown when the account
// is being deleted, when the gate is draining, or when the fence could not be consulted — all of
// which are the system working. A hosted concurrent-deletion run surfaced it exactly that way: the
// stale writer racing the erasure answered 500, so the acceptance could not tell a correct refusal
// from a crash. Same shape as the earlier `rpc()` defect this package fixed, where the fence's and
// the deletion's bounded codes were both flattened into one meaningless string.
//
//   409 — deleted or erasing. Final for this request: retrying cannot help, and saying "try again"
//         would invite a retry loop against an erasure.
//   503 — draining, or the fence could not be reached. Genuinely retryable.
//
// 500 keeps its meaning. A route that maps a known refusal to 500 teaches everyone to ignore 500s.
//
// No `server-only` and no import of the lease module: the mapping is pure, and the permanent test
// exercises THIS module rather than a paraphrase of it. The denial vocabulary is duplicated as a
// type-level union deliberately — `accountMutationDeniedResponse` re-checks it against the real
// `AccountMutationDenial`, so the two cannot drift without a type error.

export type MutationDenialReason =
  | "account_mutation_denied_deleted"
  | "account_mutation_denied_erasing"
  | "account_mutation_denied_gate"
  | "account_mutation_unavailable";

const STATUS: Record<MutationDenialReason, number> = {
  account_mutation_denied_deleted: 409,
  account_mutation_denied_erasing: 409,
  account_mutation_denied_gate: 503,
  account_mutation_unavailable: 503,
};

export function accountMutationDenialStatus(reason: MutationDenialReason): number {
  return STATUS[reason];
}
