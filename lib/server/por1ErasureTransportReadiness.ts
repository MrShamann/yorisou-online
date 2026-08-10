// POR-1 — a REAL readiness proof for the erasure transport, not a statement of intent.
//
// WHY A FLAG WAS NOT ENOUGH.
//
// `YORISOU_POR1_ACCOUNT_ERASURE_AUTHORITY_SCHEMA_READY` says an operator BELIEVES the post-P111
// erasure contract is deployed. It is set by a human, at a moment of their choosing, and it stays
// set. It cannot notice that PostgREST's schema cache does not yet know the four-argument signature,
// that the service role lost EXECUTE, or that the RPC is unreachable right now. During the
// 2026-08-10 Production incident every readiness fact read `true` while two deletions failed at the
// erasure step — the flag was telling the truth about intent and nothing about capability.
//
// So this probe asks the only question that matters before an account is destroyed: *can this
// deployment actually invoke the strong erasure entry point at this instant?* It asks by calling it,
// with an identity that cannot exist, and treating a bounded refusal as the healthy answer — because
// a refusal proves PostgREST resolved the function, the caller was permitted, and PostgreSQL ran the
// wrapper. Nothing weaker proves that, and nothing stronger can be done without erasing something.
//
// NON-DESTRUCTIVE BY CONSTRUCTION. The job id is a fresh random UUID and the owner is a reserved
// impossible identifier, so the wrapper's first statement — `select ... where id = p_job_id` — finds
// nothing and raises before any erasure can begin. The probe writes nothing and reads nothing about
// a real person.
//
// THE WEAK SIGNATURE IS NEVER CALLED. `erase_database(text)` was dropped by 202608010111 precisely
// because it erases from an owner id alone. Probing it would both fail and normalise its existence.
//
// No `server-only`: the transport is injected, so the node suite exercises this exact resolver.

import { randomUUID, randomBytes } from "crypto";

import { boundedRpcErrorCode } from "./por1BoundedErrors";

/** The ONLY function this probe is permitted to call. */
export const STRONG_ERASURE_RPC = "yorisou_account_deletion_erase_database";

export type ErasureTransportUnreadyReason =
  /** PostgREST cannot resolve the four-argument signature (PGRST202 / 404). */
  | "erasure_rpc_unavailable"
  /** The caller is not authenticated to PostgREST. */
  | "erasure_rpc_unauthorized"
  /** The caller is authenticated but lacks EXECUTE. */
  | "erasure_rpc_forbidden"
  /** The transport did not answer at all. */
  | "erasure_rpc_unreachable"
  /** It answered, but not in a shape that proves the wrapper ran. */
  | "erasure_rpc_unexpected_response";

export type ErasureTransportReadiness =
  | { ready: true }
  | { ready: false; reason: ErasureTransportUnreadyReason };

export type RpcTransportResponse = { status: number; bodyText: string };

export type ErasureTransportProbeDependencies = {
  /** Performs one PostgREST RPC and returns its raw status and body text. */
  callRpc: (fn: string, args: Record<string, unknown>) => Promise<RpcTransportResponse>;
  /** Injectable purely so a test can pin the generated identity. */
  newJobId?: () => string;
  newOwnerId?: () => string;
  newTokenHash?: () => string;
};

/**
 * A bounded refusal from the erasure family proves the wrapper executed.
 *
 * Deliberately narrow: only the two families the wrapper itself can raise count as proof. A token
 * from some unrelated family would mean we reached *something*, but not that we reached this.
 */
function refusalProvesWrapperRan(code: string): boolean {
  return code.startsWith("account_deletion_") || code.startsWith("account_erasure_");
}

export async function probeErasureTransport(
  dependencies: ErasureTransportProbeDependencies,
): Promise<ErasureTransportReadiness> {
  const jobId = dependencies.newJobId ? dependencies.newJobId() : randomUUID();
  const ownerId = dependencies.newOwnerId
    ? dependencies.newOwnerId()
    : `acct_por1_transport_probe_${randomBytes(12).toString("hex")}`;
  const tokenHash = dependencies.newTokenHash
    ? dependencies.newTokenHash()
    : randomBytes(32).toString("hex");

  let response: RpcTransportResponse;
  try {
    response = await dependencies.callRpc(STRONG_ERASURE_RPC, {
      p_job_id: jobId,
      p_owner_account_id: ownerId,
      p_executor_token_hash: tokenHash,
      p_executor_generation: 1,
    });
  } catch {
    return { ready: false, reason: "erasure_rpc_unreachable" };
  }

  // A nonexistent job MUST be refused. A success here would mean the identity we invented matched
  // something, or the wrapper does not check — either way this deployment is not safe to erase with.
  if (response.status >= 200 && response.status < 300) {
    return { ready: false, reason: "erasure_rpc_unexpected_response" };
  }

  const code = boundedRpcErrorCode({ status: response.status, bodyText: response.bodyText });

  if (refusalProvesWrapperRan(code)) return { ready: true };
  if (code === "postgrest_rpc_unavailable") return { ready: false, reason: "erasure_rpc_unavailable" };
  if (code === "postgrest_unauthorized") return { ready: false, reason: "erasure_rpc_unauthorized" };
  if (code === "postgrest_forbidden") return { ready: false, reason: "erasure_rpc_forbidden" };
  return { ready: false, reason: "erasure_rpc_unexpected_response" };
}
