// POR-1 — is the deletion executor's session-revocation backend actually usable?
//
// THE DEFECT THIS CLOSES.
//
// M4 ran the real governed deletion against a stack with no shared object store. The saga froze the
// manifest, placed the lock marker, CROSSED THE IRREVERSIBLE BOUNDARY, and only then reached
// `session_revocation` — which writes through the shared store — and failed with
// `shared_store_not_configured`.
//
// The failure itself was handled correctly: `failed_retryable`, cursor preserved, nothing falsely
// reported as deleted. But the account was already past the point of no return over a dependency
// that was missing BEFORE the first stage ran. A pre-existing, mandatory, statically-knowable
// requirement was discovered at the worst possible moment.
//
// So the executor now asks first. And the question is asked by DOING, not by reading environment
// variables: a configured-but-unreachable endpoint, a missing bucket, or a credential that cannot
// write are all indistinguishable from correct configuration if you only check that strings are
// non-empty.
//
// WHAT THIS DELIBERATELY DOES NOT DO.
//
// It does not gate a job that has ALREADY crossed. A shared store that fails mid-operation is a
// different situation with a different correct answer — resume from the exact cursor — and refusing
// there would strand a half-erased account. Pre-existing absence and mid-flight outage look the same
// in a log and must not be treated the same.

import "server-only";

import { classifyProbeFailure, type DeletionBackendUnready } from "./deletionBackendReadinessDecision";
import { probeSharedStoreRoundTrip, resolveSharedStoreMode } from "./yorisouData";

export type DeletionBackendReadiness =
  | { ready: true; mode: string }
  | { ready: false; reason: DeletionBackendUnready; mode: string };

/**
 * A bounded, disposable round trip through the REAL adapter.
 *
 * The key lives under a probe prefix that carries no identity, and it is removed again. If the
 * delete fails, the probe reports NOT ready — a store that cannot delete cannot revoke a session,
 * and discovering that at `session_revocation` is exactly the failure being prevented.
 */
export async function checkDeletionBackendReadiness(): Promise<DeletionBackendReadiness> {
  const mode = resolveSharedStoreMode({
    bucket: process.env.YORISOU_SHARED_STORE_BUCKET,
    endpoint: process.env.YORISOU_SHARED_STORE_ENDPOINT,
    accessKeyId: process.env.YORISOU_SHARED_STORE_ACCESS_KEY_ID,
    secretAccessKey: process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY,
  });

  if (mode === "disabled") {
    // Not a runtime fault. The deployment simply has no shared store, and session revocation has no
    // backend to write to.
    return { ready: false, reason: "shared_store_not_configured", mode };
  }

  const probe = await probeSharedStoreRoundTrip();
  if (probe.ok) return { ready: true, mode };

  return { ready: false, reason: classifyProbeFailure(probe.stage, probe.code), mode };
}
