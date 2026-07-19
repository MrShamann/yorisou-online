// APP-2 WS-C — LINE application-side signed-callback contract.
//
// This is the DETERMINISTIC, provider-independent contract for how the YORISOU
// application accepts (or rejects) a signed LINE login callback. The REAL LINE
// provider handshake (authorize redirect, token exchange, id_token JWK
// verification) already lives in lib/server/yorisouLine.ts and stays external;
// this module specifies and enforces the *application's own* obligations so they
// can be verified without a live LINE channel:
//
//   • signature — the callback envelope is HMAC-signed by us at start-time and
//     verified at callback-time (timing-safe), so a tampered/forged callback is
//     rejected even before any network call.
//   • state / nonce — must match what we issued (CSRF + token-binding).
//   • expiry — callbacks past their TTL are rejected.
//   • replay — a state that was already consumed is rejected.
//   • idempotency — re-delivering the SAME successful attempt (same idempotency
//     key) is a no-op "duplicate", never a second identity side-effect.
//   • cancel — a provider "access_denied" is a first-class, retryable outcome.
//   • consent — continuity to an account requires explicit consent.
//   • return-destination — only same-site relative paths; never an open redirect.
//   • guest↔account continuity — NEVER a silent identity merge; a conflicting
//     account id yields an explicit conflict decision the caller must resolve.
//   • recovery — every failure yields a safe, user-facing recovery object.
//
// Everything here is pure and window/PII-free: no raw authorization code, no
// display name, no user id is ever logged or returned in the audit event.

import { createHash, createHmac, timingSafeEqual } from "crypto";

export type LineCallbackIntent = "login" | "register" | "support";

// The signed envelope. The `code` is the opaque provider authorization code; it
// is part of the signed payload but is NEVER placed in audit output or returnTo.
export type LineCallbackEnvelope = {
  state: string;
  nonce: string;
  code: string;
  intent: LineCallbackIntent;
  returnTo: string;
  issuedAt: number; // ms epoch when auth was started
  consent: boolean; // user consented to continuity/attachment
  guestRef?: string | null; // opaque device-local journey ref (non-PII)
  accountId?: string | null; // account the callback intends to attach to
  providerError?: string | null; // e.g. "access_denied" on user cancel
  idempotencyKey: string; // stable per authorization attempt
};

export type LineCallbackExpectation = {
  state: string; // the state we stored at start-time
  nonce: string; // the nonce we stored at start-time
  ttlMs: number; // how long a callback stays valid (e.g. 10 min)
};

export type LineCallbackContext = {
  now: number; // injected wall-clock (deterministic tests)
  consumedStates: readonly string[]; // states already used (replay guard)
  consumedIdempotencyKeys: readonly string[]; // successful attempts (idempotency)
  existingAccountId?: string | null; // account currently bound to this session
};

export type LineCallbackOutcome =
  | "ok"
  | "duplicate"
  | "cancelled"
  | "invalid_signature"
  | "state_mismatch"
  | "nonce_mismatch"
  | "expired"
  | "replay"
  | "missing_consent"
  | "malformed";

export type ContinuityDecision = "attach_to_account" | "keep_guest" | "identity_conflict";

export type LineCallbackRecovery = {
  retryable: boolean;
  code: LineCallbackOutcome;
  message: string; // safe, user-facing JP — no technical leak
};

// Audit event is deliberately minimal + non-reversible: a short hash of the
// state, the outcome, and the time. No code, nonce, account id, or return path.
export type LineCallbackAudit = {
  type: "line_callback";
  outcome: LineCallbackOutcome;
  stateFingerprint: string; // sha256(state).slice(0,12) — non-reversible
  at: number;
};

export type LineCallbackResult = {
  outcome: LineCallbackOutcome;
  ok: boolean;
  continuity: ContinuityDecision | null;
  returnTo: string; // always a safe, same-site relative path
  recovery: LineCallbackRecovery | null;
  audit: LineCallbackAudit;
};

const SAFE_DEFAULT_RETURN = "/my-yorisou";

// Only same-site relative paths (single leading slash, no scheme, no protocol-
// relative "//host", no backslashes). Anything else collapses to a safe default
// so a poisoned returnTo can never become an open redirect.
export function safeReturnPath(returnTo: string | null | undefined): string {
  if (typeof returnTo !== "string") return SAFE_DEFAULT_RETURN;
  const value = returnTo.trim();
  if (!value.startsWith("/")) return SAFE_DEFAULT_RETURN;
  if (value.startsWith("//")) return SAFE_DEFAULT_RETURN;
  if (value.includes("\\")) return SAFE_DEFAULT_RETURN;
  if (/^\/\s*https?:/i.test(value)) return SAFE_DEFAULT_RETURN;
  if (value.includes("://")) return SAFE_DEFAULT_RETURN;
  return value;
}

// Canonical serialization of the SIGNED fields (stable key order). Changing any
// signed field invalidates the signature.
function canonicalPayload(envelope: LineCallbackEnvelope): string {
  return JSON.stringify([
    envelope.state,
    envelope.nonce,
    envelope.code,
    envelope.intent,
    envelope.returnTo,
    envelope.issuedAt,
    envelope.consent ? 1 : 0,
    envelope.guestRef ?? "",
    envelope.accountId ?? "",
    envelope.idempotencyKey,
  ]);
}

export function signLineCallback(secret: string, envelope: LineCallbackEnvelope): string {
  return createHmac("sha256", secret).update(canonicalPayload(envelope)).digest("base64url");
}

export function verifyLineCallbackSignature(
  secret: string,
  envelope: LineCallbackEnvelope,
  signature: string,
): boolean {
  if (typeof signature !== "string" || signature.length === 0) return false;
  const expected = signLineCallback(secret, envelope);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function fingerprint(state: string): string {
  return createHash("sha256").update(String(state)).digest("hex").slice(0, 12);
}

const RECOVERY_MESSAGE: Record<Exclude<LineCallbackOutcome, "ok" | "duplicate">, string> = {
  cancelled: "連携をキャンセルしました。もう一度つなぐこともできます。",
  invalid_signature: "安全のため、この連携リンクは受け付けられませんでした。もう一度お試しください。",
  state_mismatch: "リンクの有効性を確認できませんでした。お手数ですが、もう一度お試しください。",
  nonce_mismatch: "リンクの有効性を確認できませんでした。お手数ですが、もう一度お試しください。",
  expired: "リンクの有効期限が切れました。もう一度つなぎ直してください。",
  replay: "このリンクはすでに使われています。もう一度つなぎ直してください。",
  missing_consent: "引き継ぎには同意が必要です。内容を確認してからお進みください。",
  malformed: "連携情報を読み取れませんでした。もう一度お試しください。",
};

function recovery(code: Exclude<LineCallbackOutcome, "ok" | "duplicate">): LineCallbackRecovery {
  // Every application-side failure is retryable by restarting the connect flow.
  return { retryable: true, code, message: RECOVERY_MESSAGE[code] };
}

// Safe user-facing recovery copy for a given outcome code — reused by the
// recovery UI. Unknown/ok/duplicate codes fall back to a neutral message.
export function lineRecoveryMessage(code: string): string {
  if (code in RECOVERY_MESSAGE) {
    return RECOVERY_MESSAGE[code as keyof typeof RECOVERY_MESSAGE];
  }
  return "うまく連携できませんでした。もう一度お試しください。";
}

function decideContinuity(
  envelope: LineCallbackEnvelope,
  context: LineCallbackContext,
): ContinuityDecision {
  const incoming = envelope.accountId ?? null;
  const existing = context.existingAccountId ?? null;
  // A conflicting existing account is NEVER silently merged.
  if (incoming && existing && incoming !== existing) return "identity_conflict";
  if (incoming) return "attach_to_account";
  return "keep_guest";
}

function result(
  outcome: LineCallbackOutcome,
  envelope: LineCallbackEnvelope,
  context: LineCallbackContext,
  opts: { continuity?: ContinuityDecision | null } = {},
): LineCallbackResult {
  const ok = outcome === "ok";
  const rec =
    outcome === "ok" || outcome === "duplicate"
      ? null
      : recovery(outcome as Exclude<LineCallbackOutcome, "ok" | "duplicate">);
  return {
    outcome,
    ok,
    continuity: opts.continuity ?? null,
    returnTo: safeReturnPath(envelope.returnTo),
    recovery: rec,
    audit: {
      type: "line_callback",
      outcome,
      stateFingerprint: fingerprint(envelope.state ?? ""),
      at: context.now,
    },
  };
}

/**
 * Evaluate a signed LINE callback against what we issued. Pure + deterministic:
 * identical (secret, envelope, signature, expectation, context) ⇒ identical
 * result. The check order is security-first (structure → signature → binding →
 * freshness → replay/idempotency → consent).
 */
export function evaluateLineCallback(params: {
  secret: string;
  envelope: LineCallbackEnvelope;
  signature: string;
  expectation: LineCallbackExpectation;
  context: LineCallbackContext;
}): LineCallbackResult {
  const { secret, envelope, signature, expectation, context } = params;

  // 1) Structural validity — required fields must be present and well-typed.
  const structurallyValid =
    envelope &&
    typeof envelope.state === "string" &&
    envelope.state.length > 0 &&
    typeof envelope.nonce === "string" &&
    envelope.nonce.length > 0 &&
    typeof envelope.idempotencyKey === "string" &&
    envelope.idempotencyKey.length > 0 &&
    typeof envelope.issuedAt === "number" &&
    Number.isFinite(envelope.issuedAt);
  if (!structurallyValid) return result("malformed", envelope ?? ({ state: "" } as LineCallbackEnvelope), context);

  // 2) Signature — reject tampered/forged envelopes before trusting any field.
  if (!verifyLineCallbackSignature(secret, envelope, signature)) {
    return result("invalid_signature", envelope, context);
  }

  // 3) Provider cancel — a genuine user cancel is a first-class retryable state.
  if (envelope.providerError === "access_denied" || envelope.providerError === "user_cancel") {
    return result("cancelled", envelope, context);
  }

  // 4) State / nonce binding (CSRF + token binding).
  if (envelope.state !== expectation.state) return result("state_mismatch", envelope, context);
  if (envelope.nonce !== expectation.nonce) return result("nonce_mismatch", envelope, context);

  // 5) Freshness.
  if (context.now - envelope.issuedAt > expectation.ttlMs) return result("expired", envelope, context);

  // 6) Idempotency BEFORE replay: re-delivery of the same successful attempt is a
  //    harmless duplicate (no second side-effect), not an attack.
  if (context.consumedIdempotencyKeys.includes(envelope.idempotencyKey)) {
    return result("duplicate", envelope, context, { continuity: decideContinuity(envelope, context) });
  }

  // 7) Replay: the state was already consumed by a *different* attempt.
  if (context.consumedStates.includes(envelope.state)) {
    return result("replay", envelope, context);
  }

  // 8) Consent — attaching to an account requires explicit consent.
  const continuity = decideContinuity(envelope, context);
  if (continuity === "attach_to_account" && !envelope.consent) {
    return result("missing_consent", envelope, context);
  }

  // 9) Success. The caller must resolve `identity_conflict` explicitly (no silent
  //    merge). returnTo is always a safe, same-site path.
  return result("ok", envelope, context, { continuity });
}
