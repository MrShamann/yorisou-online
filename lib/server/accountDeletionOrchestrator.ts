import "server-only";

// POR-1 — the account-deletion orchestrator.
//
// The database saga owns the durable state machine; this drives it and performs the steps the
// database cannot: object-store erasure and identity removal. The division matters — a job that
// crashes after the database step must be resumable, and it can only be resumed if the state lives
// in the database rather than in a request that has already ended.
//
// WHAT CHANGED, AND WHY IT HAD TO.
//
// The previous version was a chain of `if (state === X)` blocks. It read the coarse state, and on a
// retry from `failed_retryable` it re-entered at `locked` — which meant a run that failed at
// VERIFICATION went back through session revocation and the account hold, re-writing the identity it
// had just erased. It also had no notion of a single writer, so two confirm requests drove the same
// saga side by side.
//
// This version is a LOOP OVER A CURSOR, under a CLAIM:
//
//   • The claim makes the executor single-writer. Every step presents the token, the generation and
//     the stage it expects to be on; the database validates all of it in one statement under a row
//     lock and refuses the second run rather than letting it proceed.
//   • The cursor is the next stage that must execute. A retryable failure preserves it, so a retry
//     resumes exactly where it stopped and never replays a stage that writes identity.
//   • The manifest is frozen before the crossing, so every stage after erasure works from a durable
//     record rather than from an account that no longer exists.
//
// The originating session is deliberately NOT kept alive to finish the work. Sessions are revoked
// early, on purpose: a person who asked to be deleted should not remain logged in while it happens,
// and the job must complete regardless of what their browser does next.

import {
  buildDeletionManifest,
  deleteAccountIndexes,
  deleteAccountLinkedObjects,
  deletePrimaryIdentity,
  revokeAccountSessions,
  verifyIdentityErasure,
} from "./accountIdentityDeletion";
import { createHash } from "node:crypto";

import { rpc, request } from "./assessmentAttemptStore";
import { purgeProvisioningForOwner } from "./identityProvisioning";
import {
  isIdentityProvisioningSchemaReady,
  resolveProvisioningMode,
} from "./identityProvisioningRollout";
import { pruneRecentLineWebhookSubjects, setAccountDeletionLock } from "./yorisouData";
import { finalizeAccountMutationGate, withAccountDeletionContext } from "./accountMutationLease";
import { checkDeletionBackendReadiness } from "./deletionBackendReadiness";
import { shouldGateOnBackendReadiness } from "./deletionBackendReadinessDecision";
import {
  accountErasureAuthoritySchemaReady,
  decideErasureAuthority,
} from "./accountErasureAuthorityRollout";
import {
  probeErasureTransport,
  type ErasureTransportReadiness,
} from "./por1ErasureTransportReadiness";
import {
  deriveErasureAuthorityFacts,
  toBoundedLogRecord,
} from "./por1ErasureAuthorityDiagnostic";
import { isPor1CapabilityEnabled } from "./por1RuntimeControls";
import {
  claimDeletionExecutor,
  completeDeletionStep,
  drainMutationGate,
  finalizeDeletionStep,
  isAtOrPastIrreversible,
  nextStage,
  putDeletionManifest,
  readDeletionManifest,
  readResumeState,
  recordRetryableError,
  releaseDeletionExecutor,
  renewDeletionExecutor,
  type DeletionStage,
  type DeletionTargetManifest,
  type ExecutorClaim,
} from "./accountDeletionExecutor";
import {
  decideAccountAuthentication,
  isDeletionOpeningSuperseded,
  type AccountAuthenticationDecision,
} from "./accountDeletionLock";
import { decideCookieRestoredAccount } from "./accountDeletionAuthority";

export type DeletionState =
  | "requested"
  | "identity_verified"
  | "locked"
  | "database_erasure"
  | "storage_erasure"
  | "identity_erasure"
  | "verifying"
  | "completed"
  | "failed_retryable"
  | "failed_terminal"
  | "cancelled"
  | "legal_hold";

export type DeletionStatus = {
  state: DeletionState;
  /** True once cancellation is no longer possible — the irreversible boundary. */
  irreversible: boolean;
  errorCode: string | null;
};

/** States from which nothing destructive has yet happened, so cancelling is still honest. */
const CANCELLABLE: DeletionState[] = ["requested", "identity_verified"];

export function isCancellable(state: DeletionState) {
  return CANCELLABLE.includes(state);
}

async function advance(accountId: string, to: DeletionState, errorCode?: string) {
  return rpc<string>("yorisou_account_deletion_advance", {
    p_owner_account_id: accountId,
    p_to: to,
    p_error_code: errorCode ?? null,
  });
}

export async function openDeletionJob(accountId: string): Promise<string> {
  // Idempotent in the database: an existing active job is returned rather than duplicated.
  return rpc<string>("yorisou_account_deletion_open", { p_owner_account_id: accountId });
}

/**
 * Record that reauthentication succeeded. The saga rejects this from an illegal prior state.
 *
 * A REFUSAL HERE IS NOT A FAILURE, and reporting it as one is how a deletion that is actively
 * succeeding gets rendered to the person as a 500. Two confirms — a double-click, a refresh, a retry
 * that arrived while the first was still running — both read the job as `requested`, and only one of
 * them can be the one that opens it. The loser is told the engine has it, and the caller's next step
 * (`executeDeletion`) produces the honest answer: it is refused the claim and reports `in_progress`.
 *
 * Only these two shapes are absorbed. Anything else still throws.
 */
export async function advanceToIdentityVerified(
  accountId: string,
): Promise<"advanced" | "already_owned"> {
  try {
    await advance(accountId, "identity_verified");
    return "advanced";
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    if (isDeletionOpeningSuperseded(code)) return "already_owned";
    throw error;
  }
}

export async function readDeletionStatus(accountId: string): Promise<DeletionStatus | null> {
  const rows = await rpc<{ state: DeletionState; error_code: string | null }[]>(
    "yorisou_account_deletion_status",
    { p_owner_account_id: accountId },
  );
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { state: DeletionState; error_code: string | null });
  if (!row) return null;

  // The RPC answers "no job" with a SENTINEL, `{"state":"none"}`, not with an empty result. Passing
  // that through as if it were a saga state is what a null-check alone misses: `none` is truthy, so
  // the confirm route would skip opening a job and skip the opening transition, and executeDeletion
  // would fall through every branch and report `unexpected_state:none`. Deletion would never run.
  // The sentinel is normalised HERE, once, so no caller has to know about it.
  if ((row.state as string) === "none") return null;
  return {
    state: row.state,
    irreversible: !isCancellable(row.state),
    errorCode: row.error_code ?? null,
  };
}

/**
 * POR-1 WS5 — the authentication gate.
 *
 * Called at every point where credentials would mint a new session. The durable job is consulted
 * ONLY when the account record is missing, because that is the one case the record-borne marker
 * cannot answer: the record that would have carried it has already been erased.
 *
 * That path fails CLOSED. A store miss is already abnormal; refusing a login there costs a person
 * one retry, while allowing it would let an erased account be resurrected from a stale cookie.
 */
export async function evaluateAuthenticationLock(input: {
  accountId: string;
  storeRecordFound: boolean;
  deletionLockedAt: string | null | undefined;
}): Promise<AccountAuthenticationDecision> {
  if (input.deletionLockedAt) {
    return decideAccountAuthentication({ ...input, durableDeletionState: undefined });
  }
  if (input.storeRecordFound) {
    return { allowed: true };
  }

  // Delegated rather than reimplemented. The login door and the session door were asking the same
  // question — "the record is missing; is this cookie naming a live account or an erased one?" —
  // and only this one was asking it. Sharing the gate also closes a gap that was here: a job that
  // failed TERMINALLY part-way through erasure is not in `ERASED_OR_ERASING` and not `HELD`, so the
  // state string alone said "allow" about an account whose identity had already been destroyed. The
  // shared gate consults `irreversible_started_at`, which is the recorded fact and does say so.
  const decision = await decideCookieRestoredAccount({
    accountId: input.accountId,
    deletionLockedAt: input.deletionLockedAt,
    surface: "ordinary",
  });
  if (decision.resolves) return { allowed: true };

  // `deletion_state_unavailable` maps to `account_deleted` here, unchanged from before: this path
  // has always failed closed, and the login surface's reason vocabulary is part of its contract.
  return {
    allowed: false,
    reason:
      decision.reason === "account_deletion_in_progress"
        ? "account_deletion_in_progress"
        : "account_deleted",
  };
}

export type DeletionOutcome =
  | { outcome: "completed" }
  | { outcome: "retryable"; errorCode: string }
  | { outcome: "terminal"; errorCode: string }
  | { outcome: "in_progress"; errorCode: string };

/** A stage failed in a way that another attempt could survive. */
class RetryableStageError extends Error {}

/**
 * Drive the saga to completion, resuming from wherever the cursor says it is.
 *
 * Safe to call repeatedly. A second concurrent call does not run: it is refused the claim and
 * reports `in_progress`, which is the honest answer to a double-clicked confirm button.
 */
/**
 * The collaborators `executeDeletion` reaches for, named so a test can substitute them.
 *
 * This exists because the readiness policy was once wired into the wrong layer and a decision-table
 * test could not see it — the only way to prove the RUNTIME honours a rule is to run the runtime.
 * The default is the real implementation set, every production caller keeps its one-argument form,
 * and there is deliberately no test-only environment branch: the body under test is the body that
 * ships.
 */
/**
 * The transport probe, measured at most once per short window per server instance.
 *
 * WHY MEMOISED, AND WHY THAT IS NOT A WEAKENING.
 *
 * What the probe detects — an unresolvable signature, a schema cache that has not caught up, a lost
 * EXECUTE grant, an unreachable database — are all DEPLOYMENT-SCOPED facts. They do not vary between
 * two requests a second apart, so asking once per request buys no additional safety.
 *
 * It does cost something, and the cost was measured rather than assumed: probing per attempt put an
 * extra PostgREST round trip in front of EVERY pre-irreversible `executeDeletion`, and the POR-1
 * concurrency acceptance drives four adversaries at one account simultaneously. Against the same
 * Preview deployment the accepted baseline passed that test 2/2 while the per-attempt version failed
 * it 2/2, so the added traffic on that exact path was not free.
 *
 * A short TTL keeps the guarantee that matters: a deployment that becomes unable to erase is noticed
 * within seconds, still strictly before any new job may cross the irreversible boundary. A failed
 * probe is deliberately NOT cached — only a healthy answer is — so an unready deployment is
 * re-measured on every attempt and can never be latched into a stale "ready".
 */
const TRANSPORT_PROBE_TTL_MS = 30_000;
let transportProbeCache: { at: number; result: ErasureTransportReadiness } | null = null;
let transportProbeInFlight: Promise<ErasureTransportReadiness> | null = null;

async function memoizedTransportProbe(): Promise<ErasureTransportReadiness> {
  const now = Date.now();
  if (transportProbeCache && now - transportProbeCache.at < TRANSPORT_PROBE_TTL_MS) {
    return transportProbeCache.result;
  }
  // Concurrent callers share ONE in-flight probe. Four adversaries racing the same account must not
  // become four probes.
  if (transportProbeInFlight) return transportProbeInFlight;

  transportProbeInFlight = probeErasureTransport({
    callRpc: async (fn, args) => {
      const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
      return { status: response.status, bodyText: await response.text().catch(() => "") };
    },
  })
    .then((result) => {
      // Only a HEALTHY answer is cached. An unready deployment is re-measured every time.
      transportProbeCache = result.ready ? { at: Date.now(), result } : null;
      return result;
    })
    .finally(() => {
      transportProbeInFlight = null;
    });

  return transportProbeInFlight;
}

export type DeletionExecutionDependencies = {
  readResumeState: typeof readResumeState;
  checkDeletionBackendReadiness: typeof checkDeletionBackendReadiness;
  claimDeletionExecutor: typeof claimDeletionExecutor;
  releaseDeletionExecutor: typeof releaseDeletionExecutor;
  recordRetryableError: typeof recordRetryableError;
  isPor1CapabilityEnabled: typeof isPor1CapabilityEnabled;
  accountErasureAuthoritySchemaReady: typeof accountErasureAuthoritySchemaReady;
  /** Measures whether the strong erasure RPC can be invoked right now. Non-destructive. */
  probeTransport: () => Promise<ErasureTransportReadiness>;
  runStages: (claim: ExecutorClaim) => Promise<DeletionOutcome>;
};

export const productionDeletionDependencies: DeletionExecutionDependencies = {
  readResumeState,
  checkDeletionBackendReadiness,
  claimDeletionExecutor,
  releaseDeletionExecutor,
  recordRetryableError,
  isPor1CapabilityEnabled,
  accountErasureAuthoritySchemaReady,
  probeTransport: () => memoizedTransportProbe(),
  runStages: (claim) => runStages(claim),
};

export async function executeDeletion(
  accountId: string,
  dependencies: DeletionExecutionDependencies = productionDeletionDependencies,
): Promise<DeletionOutcome> {
  const {
    readResumeState: readResume,
    checkDeletionBackendReadiness: checkBackend,
    claimDeletionExecutor: claimExecutor,
    releaseDeletionExecutor: releaseExecutor,
    recordRetryableError: recordRetryable,
    isPor1CapabilityEnabled: capabilityEnabled,
    accountErasureAuthoritySchemaReady: erasureSchemaReady,
    probeTransport,
    runStages: runStagesFn,
  } = dependencies;
  const resume = await readResume(accountId);
  if (!resume) return { outcome: "terminal", errorCode: "account_deletion_job_not_found" };
  if (resume.state === "completed") return { outcome: "completed" };
  if (resume.state === "cancelled" || resume.state === "legal_hold" || resume.state === "failed_terminal") {
    return { outcome: "terminal", errorCode: `account_deletion_${resume.state}` };
  }

  // ── ASK BEFORE CROSSING ─────────────────────────────────────────────────────
  //
  // `session_revocation` writes through the shared object store. When that store is absent, the saga
  // used to freeze the manifest, place the lock marker, CROSS THE IRREVERSIBLE BOUNDARY, and only
  // then discover the dependency was never there — leaving the account past the point of no return
  // over a requirement that was statically knowable before the first stage ran.
  //
  // The gate applies ONLY to a job that has not crossed. A store that fails mid-operation is a
  // different situation with a different correct answer — resume from the exact cursor — and
  // refusing there would strand a half-erased account. The two look identical in a log and must not
  // be treated the same.
  if (shouldGateOnBackendReadiness({
        irreversible: resume.irreversible,
        pastIrreversibleCursor: isAtOrPastIrreversible(resume.cursor),
      })) {
    const backend = await checkBackend();
    if (!backend.ready) {
      // Retryable, not terminal: the deployment can be fixed and the same job resumed. Nothing has
      // been destroyed, and `irreversible_started_at` stays null.
      return { outcome: "retryable", errorCode: backend.reason };
    }
  }

  // ── THE ERASURE AUTHORITY MUST EXIST BEFORE A NEW DELETION STARTS ──────────
  //
  // Same shape as the gate above, for the same reason, learned the same way. At 108c939 a hosted
  // deletion reached `database_erasure` and answered 500, because the database did not have the
  // four-argument erasure entry point the code calls — a deployment fact that was knowable before
  // the first stage ran.
  //
  // And, exactly like the backend gate: this applies ONLY to a job that has not crossed. A job that
  // is already irreversible must still be resumable, because refusing it would strand a half-erased
  // account over the same deployment fact. If the strong contract really is absent, that resume
  // fails its step as a RETRYABLE error, preserving the cursor, the manifest and
  // `irreversible_started_at` — which is recoverable, where refusing the claim is not.
  //
  // There is no fallback to the owner-only RPC in either branch: it erases from an owner id alone,
  // without the exact job, token and generation that make erasure authorized.
  const alreadyIrreversible = resume.irreversible || isAtOrPastIrreversible(resume.cursor);

  // The flag is a belief about the schema; this is a measurement of whether the strong entry point
  // can actually be invoked right now. It is skipped for a job that has already crossed, because the
  // answer cannot change that decision and probing would only add a way to fail.
  const transportReady = alreadyIrreversible ? undefined : (await probeTransport()).ready;

  const erasureAuthority = decideErasureAuthority({
    executorEnabled: capabilityEnabled("ACCOUNT_DELETION_EXECUTOR"),
    schemaReady: erasureSchemaReady(),
    alreadyIrreversible,
    transportReady,
  });

  // EVERY mode is handled here on purpose. The previous version handled only the unready refusal, so
  // the disabled-executor mode fell through and claimed the job anyway — an unwritten behaviour that
  // nothing tested and nobody had decided. A switch makes forgetting one a type error.
  //
  // Both refusals are RETRYABLE and happen BEFORE the claim: nothing is opened, nothing is
  // destroyed, and the account is not locked out. Deliberately not a generic 500.
  switch (erasureAuthority.mode) {
    case "executor_disabled":
      return { outcome: "retryable", errorCode: "account_deletion_executor_disabled" };
    case "refuse_infrastructure_unready":
      return { outcome: "retryable", errorCode: erasureAuthority.reason };
    case "strong_erasure":
      break;
  }

  const claimResult = await claimExecutor(accountId);
  if (!claimResult.claimed) {
    // Another executor holds this job. Reporting a failure here would invite the person to retry into
    // the same refusal; reporting progress is both true and actionable.
    return { outcome: "in_progress", errorCode: claimResult.reason };
  }

  const claim = claimResult.claim;
  try {
    return await runStagesFn(claim);
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";

    // A contract violation can never succeed on retry; anything else is worth another attempt.
    // NOTE the deliberate absence of `illegal_transition` handling for cursor errors: a cursor
    // mismatch means another executor moved the job, which is a reason to stop, not to burn the job.
    const terminal =
      code.includes("account_deletion_job_not_found") ||
      code.includes("account_deletion_cancelled") ||
      code.includes("account_deletion_manifest_missing");

    if (terminal) {
      await advance(accountId, "failed_terminal", code).catch(() => undefined);
      return { outcome: "terminal", errorCode: code };
    }

    if (code.includes("cursor_mismatch") || code.includes("executor_")) {
      // Someone else is driving, or this claim lapsed mid-run. Either way this run must stop without
      // recording a failure against a job that may be progressing perfectly well in another worker.
      return { outcome: "in_progress", errorCode: code };
    }

    await recordRetryable(claim, code);
    return { outcome: "retryable", errorCode: code };
  } finally {
    await releaseExecutor(claim);
  }
}

/**
 * Re-derive the erasure authority invariants after the database refused, and log them as booleans.
 *
 * Best-effort by design: this runs on a path that is ALREADY failing, so it must never turn a
 * bounded refusal into a second, different failure. Every error here is swallowed.
 *
 * Nothing identifying is read into the log. The row's values are used only for comparison inside
 * `deriveErasureAuthorityFacts`, and `toBoundedLogRecord` re-coerces every field to a boolean.
 */
async function logErasureAuthorityRefusal(claim: ExecutorClaim): Promise<void> {
  try {
    const columns =
      "owner_account_id,state,execution_cursor,irreversible_started_at," +
      "executor_token_hash,executor_generation,executor_expires_at";
    const jobResponse = await request(
      `yorisou_account_deletion_jobs?id=eq.${encodeURIComponent(claim.jobId)}&select=${columns}`,
      { method: "GET" },
    );
    const rows = jobResponse.ok ? ((await jobResponse.json()) as Array<Record<string, unknown>>) : [];
    const row = rows[0];

    let manifestPresent = false;
    if (row) {
      const manifestResponse = await request(
        `yorisou_account_deletion_manifests?job_id=eq.${encodeURIComponent(claim.jobId)}&select=job_id`,
        { method: "GET" },
      );
      manifestPresent =
        manifestResponse.ok && ((await manifestResponse.json()) as unknown[]).length > 0;
    }

    const facts = deriveErasureAuthorityFacts(
      row
        ? {
            ownerAccountId: (row.owner_account_id as string) ?? null,
            state: (row.state as string) ?? null,
            executionCursor: (row.execution_cursor as string) ?? null,
            irreversibleStartedAt: (row.irreversible_started_at as string) ?? null,
            executorTokenHash: (row.executor_token_hash as string) ?? null,
            executorGeneration:
              typeof row.executor_generation === "number" ? row.executor_generation : null,
            executorExpiresAt: (row.executor_expires_at as string) ?? null,
            manifestPresent,
          }
        : null,
      {
        ownerAccountId: claim.accountId,
        executorTokenHash: claim.tokenHash,
        executorGeneration: claim.generation,
      },
      new Date(),
    );

    // One bounded structured record. Booleans and one invariant NAME — never an id, token,
    // generation number, email, session or object key.
    console.error("account deletion erasure authority refused", toBoundedLogRecord(facts));
  } catch {
    // A diagnostic that breaks the path it is diagnosing is worse than no diagnostic.
  }
}

/**
 * The stage loop.
 *
 * Each iteration executes exactly the stage the cursor names, then moves the cursor exactly one
 * step. Nothing here decides where to resume — the cursor already did, durably, before this request
 * existed.
 */
async function runStages(claim: ExecutorClaim): Promise<DeletionOutcome> {
  const accountId = claim.accountId;
  // Enumerated once per run and reused across stages. Read from the durable manifest rather than
  // re-derived, because after `identity_erasure` there is nothing left to derive it from.
  let manifest: DeletionTargetManifest | null = null;

  const requireManifest = async (): Promise<DeletionTargetManifest> => {
    manifest = manifest ?? (await readDeletionManifest(accountId));
    if (!manifest) throw new Error("account_deletion_manifest_missing");
    return manifest;
  };

  for (;;) {
    const stage: DeletionStage = claim.cursor;
    if (stage === "completed") return { outcome: "completed" };
    // Bounded, non-PII detail a stage may attach to its own audit row. Reset every iteration so one
    // stage's evidence can never be recorded against another's.
    let stageDetail: Record<string, unknown> = {};

    // The claim is bounded, and a full erasure can outlive its TTL. Renewing between stages keeps a
    // slow-but-healthy run from losing the job to itself.
    await renewDeletionExecutor(claim);

    try {
      switch (stage) {
        case "mutation_draining": {
          // ── CLOSE THE GATE, THEN DRAIN. This is the fence. ────────────────────
          //
          // Ordinary writes and this erasure race over one record across two systems. Closing stops
          // new writers; draining waits for the ones already inside. Only when both are true may
          // anything be destroyed — an in-flight writer must finish BEFORE its target is erased, not
          // after, because "after" is how a stale copy resurrects a deleted account.
          const gate = await drainMutationGate(claim);
          if (!gate.drained) {
            // Not a failure. Writers are still finishing, and the cursor still says `mutation_draining`,
            // so the retry resumes here and erasure is still known never to have begun.
            await recordRetryableError(claim, `mutation_draining:${gate.activeLeases}`);
            return { outcome: "retryable", errorCode: `mutation_gate_${gate.gateState}` };
          }

          // FREEZE THE MANIFEST while the account still exists. After the crossing there is nothing
          // left to enumerate from, and a later stage that found nothing would report success.
          const built = await buildDeletionManifest(accountId);
          if (built) {
            await putDeletionManifest(claim, built);
            manifest = built;
          } else if (!(await readDeletionManifest(accountId))) {
            // No account AND no manifest: there is nothing this run can prove it erased, and the one
            // thing it must not do is call that success.
            throw new Error("account_deletion_manifest_missing");
          }
          break;
        }

        case "lock_marker": {
          // Hold the account. Placed ONCE, here, and never on a retry — the cursor is what guarantees
          // that. This is a read-modify-upsert of the primary identity, so replaying it after erasure
          // is precisely how a deleted account came back.
          await withAccountDeletionContext({
            accountId,
            operation: "account_profile_update",
            execute: (context) => setAccountDeletionLock(context, accountId, true),
          });
          break;
        }

        case "session_revocation": {
          // Revoked BEFORE erasure: no live session may observe a partially deleted account.
          const targets = await requireManifest();
          await withAccountDeletionContext({
            accountId,
            operation: "session_account_binding",
            execute: (context) => revokeAccountSessions(context, targets),
          });
          break;
        }

        case "database_erasure": {
          // Erasure is bounded but not instant, and a lease that lapses MID-erasure would leave the
          // account half-destroyed with no claim to resume under. So the lease is extended first,
          // and a refusal here is a refusal to start: renew fails exactly when this executor is no
          // longer the claim holder, which is the one situation where erasing would be wrong.
          //
          // Renewal keeps the token and the generation and moves only the expiry, so the authority
          // presented below is the same authority that was validated when the claim was taken.
          if (!(await renewDeletionExecutor(claim))) {
            throw new RetryableStageError("executor_claim_lost_before_erasure");
          }

          // The full authority, never rediscovered: the exact job, its owner, and proof that THIS
          // executor holds that job's current claim. SQL revalidates all of it under a row lock, so
          // a wrong id, a wrong token or a superseded generation is refused rather than trusted.
          try {
            await rpc("yorisou_account_deletion_erase_database", {
              p_job_id: claim.jobId,
              p_owner_account_id: claim.accountId,
              p_executor_token_hash: claim.tokenHash,
              p_executor_generation: claim.generation,
            });
          } catch (error) {
            // The SQL answers every failing clause with ONE opaque code, correctly — telling an
            // unauthorised caller which invariant to forge next would be a real weakness. But that
            // left the 2026-08-10 incident with no way to learn WHY. So we re-derive the invariants
            // ourselves and log BOOLEANS. The external refusal is unchanged and the error is
            // rethrown untouched.
            const code = error instanceof Error ? error.message : "";
            if (code === "account_deletion_erase_not_authorized") {
              await logErasureAuthorityRefusal(claim);
            }
            throw error;
          }
          // Partial provisioning state is account-linked and lives outside the declarative plan,
          // which is fixed in an applied migration. Removing it also RELEASES THE EMAIL: the saga is
          // keyed by a digest of the address, so one left behind would make that address permanently
          // unregisterable by the person who just asked to be forgotten.
          if (resolveProvisioningMode({ schemaReady: isIdentityProvisioningSchemaReady() }) === "durable_saga") {
            await purgeProvisioningForOwner({
              accountId,
              ownerFingerprint: createHash("sha256").update(accountId).digest("hex"),
            });
          }
          break;
        }

        case "storage_erasure": {
          const targets = await requireManifest();
          await withAccountDeletionContext({
            accountId,
            operation: "identity_mirror_sync",
            execute: async (context) => {
              // Indexes first: an orphaned index pointing at a missing account is a broken login,
              // while an orphaned account with no index is merely unreachable and still deletable.
              await deleteAccountIndexes(context, targets);
              await deleteAccountLinkedObjects(context, targets);
              await pruneRecentLineWebhookSubjects(context, targets.recentSubjectFingerprints);
            },
          });
          break;
        }

        case "identity_erasure": {
          const targets = await requireManifest();
          await withAccountDeletionContext({
            accountId,
            operation: "account_profile_update",
            execute: (context) => deletePrimaryIdentity(context, targets, accountId),
          });
          break;
        }

        case "verifying": {
          const targets = await requireManifest();
          // THE STORE IS NOT READ-AFTER-DELETE CONSISTENT.
          //
          // The isolated Preview transport returned the account record as still present for a short
          // window after a successful delete, so verification found "residue" that was already gone
          // and the saga refused to finalize — correctly, on the evidence it had. A hand-run probe
          // with seconds between the steps never saw it; the saga runs them back to back.
          //
          // Retrying does NOT weaken the guarantee: a real residue survives every attempt and is
          // still refused. It only stops a consistency lag from being mistaken for a failed erasure.
          let verification = await verifyIdentityErasure(accountId, targets);
          for (let attempt = 0; attempt < 5 && !verification.clean; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            verification = await verifyIdentityErasure(accountId, targets);
          }
          if (!verification.clean) {
            // Record WHICH families blocked it. Family names only — never a key, which would embed
            // an email hash or a live session identifier.
            throw new RetryableStageError(`identity_residue:${verification.residue.join(",")}`);
          }
          // THE MEASUREMENT, taken on the runtime's own path.
          //
          // Which of the two reads lags could not be settled from a laptop: the transport code is
          // byte-identical, so the difference is where the request originates, and only the lambda
          // can answer from there. These are bounded counts of how each absence question was
          // ANSWERED — no keys, no ids, nothing owner-linked — carried into the audit row for the
          // stage that asked them.
          stageDetail = { absenceStates: verification.absenceStates };
          break;
        }

        case "finalizing": {
          // Verify the database, complete, and stop naming the person — one atomic act, because
          // finalization drops the id that every other operation looks the job up by.
          const result = await finalizeDeletionStep(claim);
          if (!result.completed) {
            return { outcome: "retryable", errorCode: "verification_residue" };
          }
          // The gate stops naming a person at the same moment the job does.
          await finalizeAccountMutationGate(accountId);
          return { outcome: "completed" };
        }
      }
    } catch (error) {
      if (error instanceof RetryableStageError) {
        await recordRetryableError(claim, error.message);
        return { outcome: "retryable", errorCode: error.message };
      }
      throw error;
    }

    const next = nextStage(stage);
    if (!next) throw new Error(`account_deletion_no_successor_${stage}`);
    // The cursor moves ONLY after the stage's external effect has actually happened. A crash between
    // the two leaves the cursor where it was, and the retry re-runs a stage that is idempotent —
    // which is the correct trade, because the alternative is marking work done that never ran.
    await completeDeletionStep(claim, stage, next, stageDetail);
  }
}

export async function cancelDeletion(accountId: string): Promise<boolean> {
  const resume = await readResumeState(accountId);
  if (!resume) return false;
  // Refuse rather than pretend. Once erasure has begun there is nothing left to cancel, and reporting
  // success would tell the person their data still exists when it does not. `irreversible` is the
  // RECORDED FACT, not a guess from the state string — a job sitting in `failed_retryable` half-way
  // through erasure is not cancellable, and only the fact can say so.
  if (resume.irreversible || isAtOrPastIrreversible(resume.cursor)) return false;
  if (!isCancellable(resume.state as DeletionState)) return false;

  await advance(accountId, "cancelled");
  // The durable transition is the cancellation; the marker is only its enforcement shadow. At a legal
  // cancel point no hold has been placed yet, so this is a defensive no-op rather than the thing that
  // frees the account.
  await withAccountDeletionContext({
    accountId,
    operation: "account_profile_update",
    execute: (context) => setAccountDeletionLock(context, accountId, false),
  });
  return true;
}
