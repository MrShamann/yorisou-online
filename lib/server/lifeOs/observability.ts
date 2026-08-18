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

/**
 * What an error CLASS may look like — and this is deliberately much narrower than it was.
 *
 * The previous pattern was `/^[a-z0-9_.:-]{1,64}$/i`, which was wrong in a way a redaction test found:
 * **a JWT matches it.** A base64url header, a dot, a payload, a dot, a signature is nothing but
 * letters, digits and dots, and a short one fits inside 64 characters — so a service-role key or a
 * session token appearing in an `error.message` (a fetch failure quoting its URL, a driver quoting a
 * header) would have been written to the log verbatim, by the one module whose entire purpose is that
 * this cannot happen. The example is built rather than quoted in
 * `lib/server/__tests__/osf1Observability.test.ts`, because the repository's own secret-pattern gate
 * greps for that prefix and should not be taught exceptions.
 *
 * Two changes close it, and both are properties of real class names rather than of secrets:
 *
 *   - **Lowercase only.** Every class in this codebase is snake_case (`osf1_memory_confirmation_
 *     mismatch`, `http_503`, `provider_malformed`). base64url is mixed-case by construction.
 *   - **No opaque run longer than 24 characters.** A class is words joined by separators; a token,
 *     a hex digest and a base64 segment are one long run. This is what catches an all-lowercase
 *     secret, which the case rule alone would not.
 *   - **No hexadecimal run of 16 or more, and no UUID.** The two rules above still admit a UUID and
 *     three dot-joined 20-char hex segments — 122 and 240 bits respectively, which is exactly the
 *     shape of a session token, an API key and a reset token. A second review found them. No real
 *     class name in this codebase contains sixteen consecutive hex characters, so this costs nothing.
 *
 * EXPORTED, because lib/server/lifeOs/guard.ts had its own copy of the ORIGINAL pattern — the
 * case-insensitive, segment-unbounded one this docstring describes as JWT-admitting. It was saved only
 * because its value is re-validated at this sink, which is not a property to rely on: the next caller
 * to route that value anywhere else reintroduces the bug. One check, one place.
 */
const MAX_CLASS_LENGTH = 64;
const MAX_SEGMENT_LENGTH = 24;
const CLASS_PATTERN = /^[a-z0-9]+(?:[_.:-][a-z0-9]+)*$/;

export function isErrorClass(value: string): boolean {
  if (value.length === 0 || value.length > MAX_CLASS_LENGTH) return false;
  if (!CLASS_PATTERN.test(value)) return false;
  if (/[0-9a-f]{16,}/.test(value)) return false;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)) return false;
  return value.split(/[_.:-]/).every((segment) => segment.length <= MAX_SEGMENT_LENGTH);
}

/**
 * A row id, or nothing.
 *
 * `objectId` is a string, and the module header claims a caller "cannot log a reflection, a memory, or
 * a prompt, because there is no parameter that would take one". That was not quite true: this one would
 * have taken any string handed to it. Every current caller passes a server-generated uuid, so there was
 * no leak — but the guarantee was a property of the callers rather than of the module, which is the
 * arrangement the header says it rejects. Bounded here, so the claim is the module's again.
 */
function boundedObjectId(value: string | null | undefined): string | null {
  if (!value) return null;
  return /^[A-Za-z0-9_-]{1,64}$/.test(value) ? value : "unloggable";
}

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
    const errorClass = raw === null ? null : isErrorClass(raw) ? raw : "unclassified";
    const record: LifeOsOpsRecord = {
      event: input.event,
      correlationId: input.correlationId,
      objectId: boundedObjectId(input.objectId),
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
