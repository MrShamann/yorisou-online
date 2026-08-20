import "server-only";

// CPR-1 — the POR-1 fence for the two assessment mutations that can CREATE or REASSIGN an owned
// assessment source.
//
// WHY THIS FILE EXISTS, AND WHY THE FENCE IS NOT IN SQL.
//
// Account erasure enumerates every live assessment source an account owns, locks them all, and then
// destroys their derivatives. That is only sound if the set cannot grow after the enumeration — and
// two canonical mutations can grow it:
//
//   yorisou_attempt_claim     reassigns an ANONYMOUS attempt and its result to an account
//   yorisou_attempt_complete  inserts a NEW persisted result for an account-owned attempt
//
// Neither was fenced. A claim issued while a deletion was in flight left the DELETED account owning
// a live attempt and a live result, reproduced on a real cluster.
//
// The first fix acquired the POR-1 lease INSIDE those SQL functions. That was wrong, and a
// three-session test showed exactly how: a lease created in the same transaction as the business
// mutation is UNCOMMITTED, so it is invisible to `yorisou_account_deletion_complete_step`, whose
// crossing guard counts visible unreleased leases. The deletion executor could therefore cross the
// irreversible boundary while a writer was genuinely mid-flight.
//
// POR-1's contract is the opposite shape, and every other fenced mutation already follows it: the
// lease is taken over the TRANSPORT — one PostgREST RPC that commits — so it is visible to every
// other session before the business mutation starts. Before this package, no SQL function called
// `yorisou_account_mutation_begin` at all.
//
// So the fence lives here:
//
//   mutation_begin RPC  ->  COMMIT  ->  lease visible  ->  business RPC  ->  release RPC
//
// The database functions are left exactly as their canonical migration defines them. They validate
// their own authorization as they always did; they do not know about leases.

import { withAccountMutationLease } from "@/lib/server/accountMutationLease";
import { claimAttempt, completeAttempt } from "@/lib/server/assessmentAttemptStore";

type ClaimInput = Parameters<typeof claimAttempt>[0];
type CompleteInput = Parameters<typeof completeAttempt>[0];

/**
 * Claim an anonymous attempt for an account, under a committed POR-1 mutation lease.
 *
 * An account whose deletion has begun is refused by `yorisou_account_mutation_begin` before the
 * claim is attempted, so an anonymous result can never be assigned to a deleting or deleted
 * account. The refusal is POR-1's own bounded `AccountMutationDenied`; nothing new is invented here.
 */
export function claimAttemptFenced(input: ClaimInput): Promise<string> {
  return withAccountMutationLease({
    accountId: input.ownerAccountId,
    operation: "assessment_attempt_claim",
    execute: () => claimAttempt(input),
  });
}

/**
 * Complete an attempt. Only the ACCOUNT-BOUND path is fenced — an anonymous completion has no
 * account to fence, takes no lease, and is passed straight through unchanged.
 */
export function completeAttemptFenced(input: CompleteInput): Promise<string> {
  const accountId = input.ownerAccountId;
  if (!accountId) return completeAttempt(input);
  return withAccountMutationLease({
    accountId,
    operation: "assessment_attempt_complete",
    execute: () => completeAttempt(input),
  });
}
