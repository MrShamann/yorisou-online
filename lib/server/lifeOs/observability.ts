import "server-only";

// OSF-1 §17 — the minimum operational visibility an INTERNAL/PREVIEW Life OS needs.
//
// WHAT THIS IS FOR. An internal beta with no way to see failures is an internal beta that reports
// "it seemed fine". Seven things must be detectable without asking a person what happened to them:
// an audit insert failing, a mutation failing, the gate denying access, the schema not being ready,
// the assistant's provider failing, erasure failing, and the moderation queue behaving oddly.
//
// WHAT THIS IS NOT. Not analytics, not a funnel, not a metric about a person. These are operational
// events about the SYSTEM. Nothing here is read back into the product, and nothing here influences
// what any person is shown.
//
// ─────────────────────────────────────────────────────────────────────────────
// REDACTION IS A PROPERTY OF THIS MODULE, NOT OF ITS CALLERS
// ─────────────────────────────────────────────────────────────────────────────
//
// The audit table solves the same problem with a size cap and a rule that callers pass literals.
// That works there because there are ten call sites. Operational logging is written in a hurry,
// during an incident, by someone adding one more field — so the type here does not ACCEPT free text
// at all. A caller cannot log a reflection, a memory, or a prompt, because there is no parameter
// that would take one.
//
// The account id is never logged either. Where an actor must be identifiable across events, it is
// the same sha256 fingerprint the audit table stores, so an operator can correlate without the log
// becoming a second copy of who did what.

import { createHash } from "crypto";
import { deploymentContext } from "@/lib/cpv1/deploymentContext";

export const LIFE_OS_OPS_EVENTS = [
  "life_os.audit.write_failed",
  "life_os.mutation.failed",
  "life_os.access.denied",
  "life_os.schema.not_ready",
  "life_os.assistant.provider_failed",
  "life_os.erasure.failed",
  "life_os.moderation.anomaly",
] as const;
export type LifeOsOpsEvent = (typeof LIFE_OS_OPS_EVENTS)[number];

/**
 * Everything an operator gets. Note what is absent: no message, no detail bag, no payload, no
 * `unknown`. Adding one would reintroduce exactly the risk this shape removes.
 */
export type LifeOsOpsRecord = {
  event: LifeOsOpsEvent;
  /** Correlates the events of one request. Caller-supplied so a chain can be followed. */
  correlationId: string;
  /** A row id — safe because it identifies a record, not a person, and never its content. */
  objectId?: string | null;
  /** sha256 of the account id, matching the audit table. NEVER the id itself. */
  actorFingerprint?: string | null;
  /** A bounded class name, not a message: `osf1_memory_confirmation_mismatch`, `fetch_failed`. */
  errorClass?: string | null;
  environment: string;
  release: string | null;
};

const CLASS_PATTERN = /^[a-z0-9_.:-]{1,64}$/i;

export function opsActorFingerprint(ownerAccountId: string): string {
  return createHash("sha256").update(ownerAccountId, "utf8").digest("hex");
}

/** A correlation id for one request. Random, unlinkable, and never derived from the person. */
export function newCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Emit one operational event.
 *
 * Writes to stderr as a single JSON line — the transport every host this runs on already collects,
 * and one that adds no dependency and cannot itself fail in a way that breaks a request. It never
 * throws: observability that can take down the thing it observes is worse than none.
 */
export function recordLifeOsOps(input: {
  event: LifeOsOpsEvent;
  correlationId: string;
  objectId?: string | null;
  ownerAccountId?: string | null;
  errorClass?: string | null;
}): void {
  try {
    // An unrecognised error class is replaced, not passed through. This is the one field an
    // exception message could reach, and an exception message is exactly where a row's content
    // would appear if a driver decided to quote it.
    const raw = input.errorClass ?? null;
    const errorClass = raw === null ? null : CLASS_PATTERN.test(raw) ? raw : "unclassified";
    const record: LifeOsOpsRecord = {
      event: input.event,
      correlationId: input.correlationId,
      objectId: input.objectId ?? null,
      actorFingerprint: input.ownerAccountId ? opsActorFingerprint(input.ownerAccountId) : null,
      errorClass,
      environment: deploymentContext(),
      release: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    };
    process.stderr.write(`${JSON.stringify(record)}\n`);
  } catch {
    // Swallowed on purpose, and this one genuinely is unreachable in normal operation — it exists
    // so that a malformed input can never turn a logging call into a failed request.
  }
}
