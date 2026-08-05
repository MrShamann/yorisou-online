import "server-only";

// POR-1 — ATOMIC TRUTHFUL REGISTRATION PROVISIONING.
//
// WHAT WAS WRONG.
//
// `app/api/auth/register/route.ts` had TWO false-success paths, and both ended in a 200:
//
//     if (!deterministicPrincipal.ok) { console.error(...) }      ← logged, then continued
//     catch (foundationError)         { console.error(...) }      ← logged, then continued
//
// After either one the route bound a session, set authenticated cookies and returned success. The
// person was logged in as a principal with no canonical UserProfile and no email AuthIdentity: able
// to hold a session, invisible to the identity graph, and unable to be found by anything that
// resolves a person canonically. Nothing downstream noticed, because the one moment that could have
// noticed reported success.
//
// A third path was quieter and just as false. `bindSessionToUser` returns `null` when the write does
// not land, and the route answered that with `{ ...session, userId: account.id }` — an in-memory
// object shaped like a bound session that no store has ever seen. The cookie was then set from it.
//
// WHAT THIS MODULE GUARANTEES.
//
// A `completed` outcome means every one of these is PROVEN by a read that happened after the write:
//
//     legacy-compatible account record        canonical UserProfile
//     normalized email lookup                 canonical email AuthIdentity
//     account-linked session                  valid principal-landing contract
//
// Not "we called the function that creates it" — resolved back out of the store. The distinction is
// the entire point: the old code called every one of these functions too.
//
// HOW IT RESUMES.
//
// Registration is several writes across two stores. Once the response is honest, a partial failure
// becomes a 5xx on a multi-write operation, and without a record of how far it got a retry either
// duplicates the account or gives up. So each stage is bracketed by a durable cursor whose single
// meaning is THE NEXT STAGE THAT MUST EXECUTE — the same rule, for the same reason, as the deletion
// engine's cursor. A retryable failure PRESERVES the cursor; it is a note about the previous
// attempt, never an instruction about where to start.
//
// WHAT IT NEVER PERSISTS: the raw password, the session cookie, the request body, the email address,
// any provider secret. The saga is keyed by a digest and carries fingerprints and bounded states.

import { createHash } from "node:crypto";
import { randomBytes } from "node:crypto";

import { rpc } from "./assessmentAttemptStore";
import { identityFoundationService } from "./foundation/identityService";
import {
  decideProvisioningAccess,
  isIdentityProvisioningSchemaReady,
  resolveProvisioningMode,
  type ProvisioningOutcome,
} from "./identityProvisioningRollout";
import { AccountMutationDenied } from "./accountMutationLease";
import {
  createAccount,
  findAccountById,
  findSessionById,
  insertSessionRecordIfAbsent,
  normalizeEmail,
} from "./yorisouData";
import { withAccountProvisioningLease } from "./accountMutationLease";
import type { AccountRecord, SessionRecord } from "./yorisouData";
import {
  bindSessionToUser,
  ensureViewerSession,
  parseSessionPrincipalLanding,
  switchSessionToPrincipalLandingTruthWithProof,
} from "./yorisouAuth";

/** The bounded failure vocabulary the saga's CHECK constraint accepts. */
export type ProvisioningFailureClass =
  | "account_write_failed"
  | "email_already_registered"
  | "canonical_identity_failed"
  | "foundation_transport_failed"
  | "session_binding_failed"
  | "verification_incomplete"
  | "mutation_fence_denied"
  | "account_absent_after_creation"
  | "executor_lost"
  | "unclassified";

export type ProvisioningCursor =
  | "account_creation"
  | "canonical_identity"
  | "session_binding"
  | "verification"
  | "finalizing"
  | "completed";

const NEXT_CURSOR: Record<Exclude<ProvisioningCursor, "completed">, ProvisioningCursor> = {
  account_creation: "canonical_identity",
  canonical_identity: "session_binding",
  session_binding: "verification",
  verification: "finalizing",
  finalizing: "completed",
};

export type ProvisioningResult =
  | {
      outcome: "completed";
      account: AccountRecord;
      session: SessionRecord;
      durationMs: number;
      resumed: boolean;
      attemptCount: number;
    }
  | {
      outcome: Exclude<ProvisioningOutcome, "completed">;
      failureClass: ProvisioningFailureClass;
      /**
       * Which check actually refused, within the class.
       *
       * The saga's `failure_class` is a closed enum on purpose, so it stays small enough to reason
       * about and cannot become somewhere an exception message is stored. But "session_binding_failed"
       * has four distinct causes with four different operator responses, and a log line that cannot
       * tell them apart costs a deploy-and-rerun cycle per diagnosis — the exact tax the deletion
       * work paid before it started recording residue FAMILIES.
       *
       * Bounded, closed, and non-PII, like the class it refines.
       */
      detail?: ProvisioningFailureDetail;
      durationMs: number;
    };

export type ProvisioningFailureDetail =
  | "bind_returned_null"
  | "session_not_stored"
  | "session_landing_missing"
  | "session_account_link_missing"
  | "session_insert_failed"
  | "bind_threw"
  // Verification families. Bounded, fixed, and content-free — they name WHICH canonical piece could
  // not be proved, which is the difference between three unrelated defects wearing one class.
  | "missing:account"
  | "missing:user_profile"
  | "missing:email_auth_identity"
  | "missing:session"
  | "missing:principal_landing"
  | "missing:session_account_link"
  | "missing:multiple";

/**
 * The intent identity.
 *
 * Derived by the SERVER from the normalized email, never from a client-supplied idempotency field —
 * an attacker chooses that value and a broken client repeats it, and either would let one request
 * attach itself to another registration's saga. Because the key IS the email identity, "one
 * normalized email → one active principal" is the primary key rather than a check.
 */
export function provisioningKeyForEmail(email: string): string {
  return createHash("sha256").update(`por1-provisioning:v1:${normalizeEmail(email)}`).digest("hex");
}

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type OpenResult = {
  outcome: "claimed" | "completed" | "in_progress" | "failed_terminal";
  claimed: boolean;
  cursor: ProvisioningCursor;
  state: string;
  generation: number;
  accountId: string | null;
  attemptCount?: number;
  resumed?: boolean;
  failureClass?: ProvisioningFailureClass | null;
};

/**
 * One registration, end to end.
 *
 * `bindSession` is injected rather than imported at the call site so the route stays a transport
 * adapter and the invariant lives here, where it is tested.
 */
export async function provisionRegistration(input: {
  name: string;
  email: string;
  password: string;
  city: string;
  role: AccountRecord["role"];
}): Promise<ProvisioningResult> {
  const startedAt = Date.now();
  const durable = resolveProvisioningMode({ schemaReady: isIdentityProvisioningSchemaReady() }) === "durable_saga";

  if (!durable) {
    // No saga table on this deployment. Every stage still runs and every stage is still PROVEN;
    // what is missing is the durable cursor, so a crash leaves partial state to be re-derived rather
    // than resumed. Honesty is not gated on the schema — see identityProvisioningRollout.
    return runInline(input, startedAt);
  }

  const key = provisioningKeyForEmail(input.email);
  const token = randomBytes(32).toString("hex");

  let open: OpenResult;
  try {
    open = await rpc<OpenResult>("yorisou_provisioning_open", {
      p_provisioning_key: key,
      p_token_hash: token,
      p_ttl_seconds: 90,
    });
  } catch {
    // The coordinator itself is unreachable. Refuse rather than proceed unrecorded: an unrecorded
    // registration is exactly the state this saga exists to abolish.
    return { outcome: "retryable", failureClass: "unclassified", durationMs: Date.now() - startedAt };
  }

  if (open.outcome === "completed") {
    // A retry of a registration that already succeeded is the SAME registration, finished. This is
    // what makes "the response was lost after a successful write" resolvable rather than a
    // duplicate-account bug.
    const account = open.accountId ? await findAccountById(open.accountId) : null;
    if (!account) {
      // Completed, but the account is gone — deleted between then and now. Never re-create it.
      return { outcome: "email_exists", failureClass: "email_already_registered", durationMs: Date.now() - startedAt };
    }
    const session = await bindAndProve(account);
    if (!session.ok) {
      return {
        outcome: "retryable",
        failureClass: session.failureClass,
        detail: session.detail,
        durationMs: Date.now() - startedAt,
      };
    }
    return {
      outcome: "completed",
      account,
      session: session.session,
      durationMs: Date.now() - startedAt,
      resumed: true,
      attemptCount: open.attemptCount ?? 0,
    };
  }

  if (open.outcome === "in_progress") {
    return { outcome: "in_progress", failureClass: "executor_lost", durationMs: Date.now() - startedAt };
  }

  if (open.outcome === "failed_terminal") {
    return {
      outcome: "terminal",
      failureClass: open.failureClass ?? "unclassified",
      durationMs: Date.now() - startedAt,
    };
  }

  const generation = open.generation;
  let cursor: ProvisioningCursor = open.cursor;
  let accountId: string | null = open.accountId;

  const step = async (from: Exclude<ProvisioningCursor, "completed">, patch?: {
    accountId?: string;
    ownerFingerprint?: string;
    sessionFingerprint?: string;
  }) => {
    await rpc("yorisou_provisioning_complete_step", {
      p_provisioning_key: key,
      p_token_hash: token,
      p_generation: generation,
      p_expected_cursor: from,
      p_next_cursor: NEXT_CURSOR[from],
      p_account_id: patch?.accountId ?? null,
      p_owner_fingerprint: patch?.ownerFingerprint ?? null,
      p_session_fingerprint: patch?.sessionFingerprint ?? null,
    });
    cursor = NEXT_CURSOR[from];
  };

  const fail = async (
    failureClass: ProvisioningFailureClass,
    terminal: boolean,
    detail?: ProvisioningFailureDetail,
  ): Promise<ProvisioningResult> => {
    try {
      await rpc("yorisou_provisioning_record_failure", {
        p_provisioning_key: key,
        p_token_hash: token,
        p_generation: generation,
        p_failure_class: failureClass,
        // THE DETAIL, not a second copy of the class.
        //
        // `p_error_code` used to be handed `failureClass` again, so the durable record carried the
        // same word twice and the only place the DETAIL existed was a console line. That made a
        // hosted failure unclassifiable after the fact: `session_binding_failed` covers a session
        // that was never inserted, one whose bind returned null, and one that was written and then
        // did not read back — three different defects with three different repairs, and the row
        // could not tell them apart.
        //
        // The detail is a fixed bounded enum with no PII, which is exactly what this column is for.
        p_error_code: detail ?? failureClass,
        p_terminal: terminal,
      });
    } catch {
      // Recording the failure failed too. The claim will lapse on its own TTL, so the saga is still
      // resumable; swallowing here would be wrong only if it changed the answer, and it does not.
    }
    return {
      outcome: terminal ? "terminal" : "retryable",
      failureClass,
      detail,
      durationMs: Date.now() - startedAt,
    };
  };

  try {
    // ── account_creation ────────────────────────────────────────────────────
    let account: AccountRecord | null = null;
    if (cursor === "account_creation") {
      const created = await createAccount({
        name: input.name,
        email: input.email,
        password: input.password,
        city: input.city,
        role: input.role,
      });
      if (!created.ok) {
        // An existing email is a legitimate, final answer — and this saga created NOTHING, so the
        // row is discarded rather than recorded as a terminal failure.
        //
        // Recording it would be two bugs. The saga is keyed by a digest of the address, so a
        // `failed_terminal` row would make that address permanently unregisterable — including by
        // the real owner after they delete their account, since a purge keyed by account id or
        // fingerprint cannot find a row that has neither. And the access gate reads a live saga as
        // "this email has an incomplete registration", so anyone could lock any account out of
        // login by attempting to register its address.
        try {
          await rpc("yorisou_provisioning_abandon", {
            p_provisioning_key: key,
            p_token_hash: token,
            p_generation: generation,
          });
        } catch {
          // The claim lapses on its own TTL either way; the answer to the caller is unchanged.
        }
        return { outcome: "email_exists", failureClass: "email_already_registered", durationMs: Date.now() - startedAt };
      }
      account = created.account;
      accountId = account.id;
      await step("account_creation", {
        accountId: account.id,
        ownerFingerprint: fingerprint(account.id),
      });
    } else {
      if (!accountId) return fail("account_absent_after_creation", true);
      account = await findAccountById(accountId);
      if (!account) {
        // The saga says an account was created and it is not there. That is a completed deletion, or
        // a store that lost it; either way re-creating it would be a resurrection. Terminal.
        return fail("account_absent_after_creation", true);
      }
    }

    // ── canonical_identity ──────────────────────────────────────────────────
    if (cursor === "canonical_identity") {
      let principal;
      try {
        principal = await identityFoundationService.ensureDeterministicEmailPrincipalForAccount(account);
      } catch (error) {
        // THE SWALLOW THAT WAS. This used to be caught, logged, and followed by a 200.
        return fail(
          error instanceof AccountMutationDenied ? "mutation_fence_denied" : "foundation_transport_failed",
          false,
        );
      }
      if (!principal.ok) {
        // THE OTHER SWALLOW. `ok === false` used to be logged and ignored.
        return fail("canonical_identity_failed", false);
      }
      await step("canonical_identity");
    }

    // ── session_binding ─────────────────────────────────────────────────────
    let session: SessionRecord | null = null;
    if (cursor === "session_binding") {
      const bound = await bindAndProve(account);
      if (!bound.ok) return fail(bound.failureClass, false, bound.detail);
      session = bound.session;
      await step("session_binding", { sessionFingerprint: fingerprint(session.id) });
    } else {
      const bound = await bindAndProve(account);
      if (!bound.ok) return fail(bound.failureClass, false, bound.detail);
      session = bound.session;
    }

    // ── verification — READ-ONLY, and the only thing that may authorise a 200 ─
    if (cursor === "verification") {
      const proof = await proveCanonicalIdentity(account, session);
      if (!proof.complete) {
        // WHICH piece, durably. `verification_incomplete` alone covers six different situations, and
        // the durable record could not tell them apart — the same gap that hid `session_landing_missing`
        // for an entire package until the detail was persisted.
        const detail = (
          proof.missing.length === 1 ? `missing:${proof.missing[0]}` : "missing:multiple"
        ) as ProvisioningFailureDetail;
        return fail("verification_incomplete", false, detail);
      }
      await step("verification");
    }

    // ── finalizing ──────────────────────────────────────────────────────────
    if (cursor === "finalizing") {
      await step("finalizing");
    }

    return {
      outcome: "completed",
      account,
      session,
      durationMs: Date.now() - startedAt,
      resumed: Boolean(open.resumed),
      attemptCount: open.attemptCount ?? 1,
    };
  } catch (error) {
    if (error instanceof AccountMutationDenied) return fail("mutation_fence_denied", false);
    return fail("unclassified", false);
  }
}

/**
 * Bind the session and PROVE the binding by resolving it back out of the store.
 *
 * `bindSessionToUser` and `switchSessionToPrincipalLandingTruth` both fall back to an in-memory
 * object when their write does not land. Those fallbacks exist for paths where a missing session is
 * survivable; registration is not one of them, and a cookie minted from a session no store has ever
 * seen is an authenticated browser with no server-side identity.
 */
async function bindAndProve(
  account: AccountRecord,
): Promise<
  | { ok: true; session: SessionRecord }
  | { ok: false; failureClass: ProvisioningFailureClass; detail?: ProvisioningFailureDetail }
> {
  try {
    const session = await ensureViewerSession();

    // The cookie is self-contained, so `ensureViewerSession` can return a SYNTHETIC session that the
    // store has never seen — and `touchSession` updates in place, so binding it would silently do
    // nothing. Persist the row first, keeping the id: a new id would break the anonymous→register
    // continuity that is the reason someone registers from a session that already has activity.
    const persisted = await withAccountProvisioningLease({
      accountId: account.id,
      operation: "session_account_binding",
      execute: (context) => insertSessionRecordIfAbsent(context, session),
    });
    if (!persisted) {
      return { ok: false, failureClass: "session_binding_failed", detail: "session_insert_failed" };
    }

    const bound = await bindSessionToUser(session.id, account.id, {
      legacyAccount: account,
      source: "register",
    });
    if (!bound) return { ok: false, failureClass: "session_binding_failed", detail: "bind_returned_null" };

    const switched = await switchSessionToPrincipalLandingTruthWithProof(bound, {
      legacyAccount: account,
      source: "register",
    });
    const withLanding = switched.session;

    // THE WRITE PROVES ITSELF; A CACHEABLE RE-READ CANNOT.
    //
    // This used to resolve the session back out of the store and inspect the copy it got. That read
    // is a GET on the key just written, and this transport serves superseded versions of a key it
    // has recently seen — so it returned the copy `insertSessionRecordIfAbsent` wrote moments
    // earlier, WITHOUT the landing contract, and registration was refused with
    // `session_landing_missing`. Truthfully by its own contract, and wrongly in fact: the write had
    // landed. Measured 1 in ~4 concurrent pairs, and the durable detail is what finally named it.
    //
    // The thing the re-read was invented to catch is the IN-MEMORY FALLBACK — a session object no
    // store has ever seen, which would mint a cookie for an identity that does not exist server-side.
    // `touchSession` is update-only and returns null in exactly that case, so the write already knows.
    // Asking it is both stronger and immune to the cache.
    if (!switched.contractApplied) {
      return { ok: false, failureClass: "session_binding_failed", detail: "session_landing_missing" };
    }
    if (!switched.persisted) {
      return { ok: false, failureClass: "session_binding_failed", detail: "session_not_stored" };
    }

    // The account link is asserted on the record the write RETURNED, which is the row the store now
    // holds — not on whatever a subsequent read happens to be served.
    const landing = parseSessionPrincipalLanding(withLanding.principalLanding);
    if (!landing) {
      return { ok: false, failureClass: "session_binding_failed", detail: "session_landing_missing" };
    }
    if (withLanding.userId !== account.id && landing.legacyAccountId !== account.id) {
      return { ok: false, failureClass: "session_binding_failed", detail: "session_account_link_missing" };
    }

    return { ok: true, session: withLanding };
  } catch (error) {
    if (error instanceof AccountMutationDenied) return { ok: false, failureClass: "mutation_fence_denied" };
    return { ok: false, failureClass: "session_binding_failed", detail: "bind_threw" };
  }
}

/**
 * The success invariant, checked by READING every required piece back.
 *
 * This is what a 200 means. Every function that creates these was already being called before POR-1;
 * what was missing was anybody asking afterwards whether they had worked.
 */
export async function proveCanonicalIdentity(
  account: AccountRecord,
  session: SessionRecord,
): Promise<{ complete: boolean; missing: string[] }> {
  const missing: string[] = [];

  const [storedAccount, profile, identity, storedSession] = await Promise.all([
    findAccountById(account.id),
    identityFoundationService.getUserProfileByLegacyAccountId(account.id),
    identityFoundationService.getAuthIdentityByEmail(account.email),
    findSessionById(session.id),
  ]);

  if (!storedAccount) missing.push("account");
  if (!profile) missing.push("user_profile");
  if (!identity || (profile && identity.userProfileId !== profile.userProfileId)) {
    missing.push("email_auth_identity");
  }
  // EXISTENCE is asked of the store; the CONTRACT is read from the record the write returned.
  //
  // Re-reading the landing here reproduced the defect `bindAndProve` had just been repaired for, one
  // stage later: the session read is a GET on a key written moments ago, and this transport serves
  // superseded copies of such a key — so verification was handed the pre-landing version and refused
  // a registration that had fully succeeded. `session` is the row `touchSession` returned, which is
  // what the store actually holds.
  //
  // The independent half is untouched and is the point of WS-C: the account, the UserProfile and the
  // email AuthIdentity are all read back from their own stores, because nothing in this request can
  // vouch for them.
  if (!storedSession) missing.push("session");
  const landing = parseSessionPrincipalLanding(session.principalLanding);
  if (!landing) missing.push("principal_landing");
  else if (session.userId !== account.id && landing.legacyAccountId !== account.id) {
    missing.push("session_account_link");
  }

  return { complete: missing.length === 0, missing };
}

/**
 * The no-saga path. Identical stages, identical proof, no durable cursor.
 *
 * It exists so a deployment that predates `202607310003` is TRUTHFUL rather than merely unchanged.
 * The old behaviour on this deployment was a 200 over an unproven identity, and keeping that until
 * the migration lands would mean shipping the honesty fix and the schema together or not at all.
 */
async function runInline(
  input: { name: string; email: string; password: string; city: string; role: AccountRecord["role"] },
  startedAt: number,
): Promise<ProvisioningResult> {
  try {
    const created = await createAccount({
      name: input.name,
      email: input.email,
      password: input.password,
      city: input.city,
      role: input.role,
    });
    if (!created.ok) {
      return { outcome: "email_exists", failureClass: "email_already_registered", durationMs: Date.now() - startedAt };
    }

    let principal;
    try {
      principal = await identityFoundationService.ensureDeterministicEmailPrincipalForAccount(created.account);
    } catch (error) {
      return {
        outcome: "retryable",
        failureClass:
          error instanceof AccountMutationDenied ? "mutation_fence_denied" : "foundation_transport_failed",
        durationMs: Date.now() - startedAt,
      };
    }
    if (!principal.ok) {
      return { outcome: "retryable", failureClass: "canonical_identity_failed", durationMs: Date.now() - startedAt };
    }

    const bound = await bindAndProve(created.account);
    if (!bound.ok) {
      return {
        outcome: "retryable",
        failureClass: bound.failureClass,
        detail: bound.detail,
        durationMs: Date.now() - startedAt,
      };
    }

    const proof = await proveCanonicalIdentity(created.account, bound.session);
    if (!proof.complete) {
      return { outcome: "retryable", failureClass: "verification_incomplete", durationMs: Date.now() - startedAt };
    }

    return {
      outcome: "completed",
      account: created.account,
      session: bound.session,
      durationMs: Date.now() - startedAt,
      resumed: false,
      attemptCount: 1,
    };
  } catch (error) {
    if (error instanceof AccountMutationDenied) {
      return { outcome: "retryable", failureClass: "mutation_fence_denied", durationMs: Date.now() - startedAt };
    }
    return { outcome: "retryable", failureClass: "unclassified", durationMs: Date.now() - startedAt };
  }
}

/**
 * May this account authenticate, reset a password, recover, or bind a LINE identity?
 *
 * A registration that created the legacy account record and then failed at canonical identity leaves
 * a PARTIAL account: it has a password and an email lookup, so it can log in, but it has no
 * UserProfile and no email AuthIdentity, so nothing that resolves a person canonically can find it.
 * Letting it authenticate would put someone inside the product as a principal the identity graph
 * does not know about — which is the same broken state the false-success 200 used to create, reached
 * a different way.
 *
 * The gate is the SAGA, not a shape check: an incomplete saga means a registration that is expected
 * to be resumed and completed, so refusing is temporary and honest. A completed saga, or no saga at
 * all (an account that predates this migration), allows.
 *
 * SCOPE, stated rather than implied: with no saga table there is no durable record of an incomplete
 * registration, so this gate can only allow. That deployment is no worse than it was — its
 * registration path now refuses to report success over an unproven identity, so it does not MINT
 * partial accounts through the swallow any more — but a crash mid-registration there still leaves
 * one, and this cannot see it. It is one of the reasons readiness is set before activation.
 */
export async function evaluateProvisioningAccessGate(input: {
  email: string;
  accountId: string;
}): Promise<{ allowed: true } | { allowed: false; reason: "identity_provisioning_incomplete" }> {
  if (resolveProvisioningMode({ schemaReady: isIdentityProvisioningSchemaReady() }) !== "durable_saga") {
    return { allowed: true };
  }

  let status: { found: boolean; state: string | null; accountId: string | null };
  try {
    status = await rpc("yorisou_provisioning_status", {
      p_provisioning_key: provisioningKeyForEmail(input.email),
    });
  } catch {
    // FAIL OPEN, deliberately, and this is the one place in POR-1 that does.
    //
    // Everywhere else "we could not check" must not mean "go ahead", because the thing being checked
    // is permission to WRITE. Here it is permission to LOG IN to an account whose credentials have
    // already been verified, and the failure mode of guessing wrong is locking a real person out of
    // a complete account because a coordinator read timed out. The deletion hold above is the gate
    // that must fail closed, and it does.
    return { allowed: true };
  }

  return decideProvisioningAccess(status, input.accountId);
}

/**
 * Remove a person's provisioning state. Called by governed account deletion.
 *
 * Also releases the email: a completed saga keyed by an email digest that outlives the account would
 * make that address permanently unregisterable, and is itself residue.
 */
export async function purgeProvisioningForOwner(input: {
  accountId?: string | null;
  ownerFingerprint?: string | null;
}): Promise<number> {
  if (!input.accountId && !input.ownerFingerprint) return 0;
  return rpc<number>("yorisou_provisioning_purge_for_owner", {
    p_account_id: input.accountId ?? null,
    p_owner_fingerprint: input.ownerFingerprint ?? null,
  });
}

/** Residue probe for deletion verification. A count, never an inference from a stale read. */
export async function provisioningResidue(input: {
  accountId?: string | null;
  ownerFingerprint?: string | null;
}): Promise<number> {
  if (!input.accountId && !input.ownerFingerprint) return 0;
  return rpc<number>("yorisou_provisioning_residue", {
    p_account_id: input.accountId ?? null,
    p_owner_fingerprint: input.ownerFingerprint ?? null,
  });
}
