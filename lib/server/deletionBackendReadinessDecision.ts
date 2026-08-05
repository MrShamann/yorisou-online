// POR-1 — the deletion-backend readiness DECISION, separated from the I/O that gathers it.
//
// Deliberately free of `server-only`, following the same repo pattern as por1RuntimeControls and
// accountDeletionLock: the node suite then exercises the real decision instead of a restatement of
// it. The probe that talks to the object store lives in `deletionBackendReadiness.ts`.
//
// WHY THIS DECISION EXISTS AT ALL.
//
// M4 ran the real governed deletion against a stack with no shared object store. The saga froze the
// manifest, placed the lock marker, CROSSED THE IRREVERSIBLE BOUNDARY, and only then reached
// `session_revocation` — which writes through that store — and failed. Every individual behaviour
// was correct; the ORDER was not. A pre-existing, statically-knowable requirement was discovered
// past the point of no return.

export type DeletionBackendUnready =
  | "shared_store_not_configured"
  | "shared_store_unreachable"
  | "shared_store_not_writable"
  | "shared_store_not_readable"
  | "shared_store_not_deletable";

export type ProbeStage = "write" | "read" | "delete";

/**
 * Should this job be gated on backend readiness before it runs?
 *
 * ONLY a job that has not crossed. A store that fails mid-operation is a different situation with
 * the opposite correct answer — resume from the exact cursor — and refusing there would strand a
 * half-erased account. The two are indistinguishable in a log, which is why the rule is written
 * down rather than inferred at the call site.
 */
export function shouldGateOnBackendReadiness(job: {
  irreversible: boolean;
  pastIrreversibleCursor: boolean;
}): boolean {
  return !job.irreversible && !job.pastIrreversibleCursor;
}

/**
 * Turn a probe failure into a bounded reason code.
 *
 * A network failure is worth distinguishing from a permission one: the first is plausibly transient
 * and the same release may succeed on retry, the second needs the deployment fixed. An operator
 * reading the code needs to know which.
 */
export function classifyProbeFailure(stage: ProbeStage, code: string): DeletionBackendUnready {
  if (code.includes("shared_store_not_configured")) return "shared_store_not_configured";
  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|fetch failed|NoSuchBucket|getaddrinfo/i.test(code)) {
    return "shared_store_unreachable";
  }
  if (stage === "read") return "shared_store_not_readable";
  if (stage === "delete") return "shared_store_not_deletable";
  return "shared_store_not_writable";
}
