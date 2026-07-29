"use client";

// RTR-1 — pending private save of the public IMAIRO-120Q result across the
// login boundary (same pattern as C02 / relationship-fatigue). Only the
// public route context is stored, in sessionStorage, for at most 10 minutes.

export type PendingImairoSave = {
  resultId: string;
  overlayId: string | null;
  confidence: "low" | "medium";
  payloadKey: string | null;
};

const PENDING_IMAIRO_SAVE_KEY = "yorisou.imairo.pending-save.v1";

export function storePendingImairoSave(context: PendingImairoSave) {
  window.sessionStorage.setItem(PENDING_IMAIRO_SAVE_KEY, JSON.stringify({ context, createdAt: Date.now() }));
}

export function takePendingImairoSave(): PendingImairoSave | null {
  const raw = window.sessionStorage.getItem(PENDING_IMAIRO_SAVE_KEY);
  window.sessionStorage.removeItem(PENDING_IMAIRO_SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { context?: unknown; createdAt?: unknown };
    if (typeof parsed.createdAt !== "number" || Date.now() - parsed.createdAt > 10 * 60 * 1000) return null;
    const context = parsed.context as Partial<PendingImairoSave> | null;
    if (!context || typeof context !== "object" || typeof context.resultId !== "string" || !context.resultId) return null;
    return {
      resultId: context.resultId,
      overlayId: typeof context.overlayId === "string" ? context.overlayId : null,
      confidence: context.confidence === "medium" ? "medium" : "low",
      payloadKey: typeof context.payloadKey === "string" ? context.payloadKey : null,
    };
  } catch {
    return null;
  }
}

// ── UX-2R / CPC-1 Wave A — persisted mode carries an INTENT, not a copy ──────────────────────
//
// In legacy mode the pending save had to carry the result itself, because nothing existed on the
// server yet. In persisted mode the record already exists and is owner-scoped, so crossing the
// login boundary needs nothing but an opaque row id: the browser never holds result content, and
// a stolen sessionStorage value is useless without the httpOnly attempt credential.

export type PendingResultClaim = { resultRowId: string };

const PENDING_RESULT_CLAIM_KEY = "yorisou.result.pending-claim.v1";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function storePendingResultClaim(resultRowId: string) {
  if (!UUID_RE.test(resultRowId)) return;
  window.sessionStorage.setItem(
    PENDING_RESULT_CLAIM_KEY,
    JSON.stringify({ resultRowId, createdAt: Date.now() }),
  );
}

/**
 * PEEK — read and validate WITHOUT removing (same acknowledgement lifecycle as the
 * interpretation intent below). The claim RPC is idempotent for the same owner, so holding the
 * record until the server confirms costs nothing and survives a crash mid-claim.
 * A record that fails validation can never be used and is dropped on read.
 */
export function peekPendingResultClaim(): PendingResultClaim | null {
  const raw = window.sessionStorage.getItem(PENDING_RESULT_CLAIM_KEY);
  if (!raw) return null;
  const parsed = parseClaim(raw);
  if (!parsed) window.sessionStorage.removeItem(PENDING_RESULT_CLAIM_KEY);
  return parsed;
}

function parseClaim(raw: string): PendingResultClaim | null {
  try {
    const parsed = JSON.parse(raw) as { resultRowId?: unknown; createdAt?: unknown };
    if (typeof parsed.createdAt !== "number" || Date.now() - parsed.createdAt > 10 * 60 * 1000) return null;
    if (typeof parsed.resultRowId !== "string" || !UUID_RE.test(parsed.resultRowId)) return null;
    return { resultRowId: parsed.resultRowId };
  } catch {
    return null;
  }
}

/** Clear the claim record — only after the server confirmed the claim, or on a terminal 4xx. */
export function clearPendingResultClaim() {
  window.sessionStorage.removeItem(PENDING_RESULT_CLAIM_KEY);
}

// ── UX-2R / CPC-1 §4 — pending INTERPRETATION intent across the login boundary ────────────────
//
// The claim intent only remembered "which row do I want to own". It did not remember what the
// person was in the middle of SAYING. Someone who chose 「しっくりこない」 while anonymous was sent
// to login, claimed the record, and then had to find and press the same answer again — the product
// forgetting the one thing they had just told it.
//
// Bounded by construction: an opaque row id, a governed response type, a governed corrected code,
// a bounded reason code, a nonce and an expiry. No result copy, no answers, no free text.

export type PendingInterpretationIntent = {
  resultRowId: string;
  responseType: "confirmed" | "corrected" | "rejected" | "deferred";
  correctedResultId: string | null;
  reasonCode: string | null;
  nonce: string;
};

const PENDING_INTENT_KEY = "yorisou.result.pending-intent.v1";
const INTENT_TTL_MS = 10 * 60 * 1000;
const RESPONSE_TYPES = new Set(["confirmed", "corrected", "rejected", "deferred"]);
const CODE_RE = /^[A-Za-z0-9_-]{1,32}$/;

export function storePendingInterpretationIntent(
  intent: Omit<PendingInterpretationIntent, "nonce">,
) {
  if (!UUID_RE.test(intent.resultRowId)) return;
  if (!RESPONSE_TYPES.has(intent.responseType)) return;
  if (intent.correctedResultId !== null && !CODE_RE.test(intent.correctedResultId)) return;
  if (intent.reasonCode !== null && !CODE_RE.test(intent.reasonCode)) return;
  // A correction without a target is not a correction; storing it would produce a request the
  // server must reject after the person has already gone through login.
  if (intent.responseType === "corrected" && !intent.correctedResultId) return;

  const nonce = crypto.randomUUID();
  window.sessionStorage.setItem(
    PENDING_INTENT_KEY,
    JSON.stringify({ ...intent, nonce, createdAt: Date.now() }),
  );
}

/**
 * PEEK — read and validate WITHOUT removing.
 *
 * The first version removed the intent before any network call. That made a browser-level replay
 * impossible, but it also destroyed the only record of what the person had said the moment the
 * page was read — so a crash, a closed tab, or a failed claim lost the answer with no way back.
 * Duplicate prevention now lives in the database (unique nonce per result+owner), which frees the
 * browser to HOLD the intent until the server has actually acknowledged it.
 *
 * Lifecycle: peek → claim → submit with the same nonce → server returns created or replayed →
 * only then clear.
 */
export function peekPendingInterpretationIntent(): PendingInterpretationIntent | null {
  const raw = window.sessionStorage.getItem(PENDING_INTENT_KEY);
  if (!raw) return null;

  const parsed = parseIntent(raw);
  // A record that fails validation can NEVER be used, so it is dropped rather than re-read on
  // every visit. Only a record that is still usable survives a peek.
  if (!parsed) window.sessionStorage.removeItem(PENDING_INTENT_KEY);
  return parsed;
}

function parseIntent(raw: string): PendingInterpretationIntent | null {
  try {
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (typeof p.createdAt !== "number" || Date.now() - p.createdAt > INTENT_TTL_MS) return null;
    if (typeof p.resultRowId !== "string" || !UUID_RE.test(p.resultRowId)) return null;
    if (typeof p.responseType !== "string" || !RESPONSE_TYPES.has(p.responseType)) return null;
    if (typeof p.nonce !== "string" || !UUID_RE.test(p.nonce)) return null;

    const correctedResultId =
      typeof p.correctedResultId === "string" && CODE_RE.test(p.correctedResultId)
        ? p.correctedResultId
        : null;
    if (p.responseType === "corrected" && !correctedResultId) return null;

    return {
      resultRowId: p.resultRowId,
      responseType: p.responseType as PendingInterpretationIntent["responseType"],
      correctedResultId,
      reasonCode:
        typeof p.reasonCode === "string" && CODE_RE.test(p.reasonCode) ? p.reasonCode : null,
      nonce: p.nonce,
    };
  } catch {
    return null;
  }
}

/**
 * Clear the intent. Called ONLY after the server confirms the response was created or replayed,
 * or when the failure is terminal (validation/conflict) and retrying could never succeed.
 * An unresolved network failure deliberately leaves it in place so a reload can resume.
 */
export function clearPendingInterpretationIntent() {
  window.sessionStorage.removeItem(PENDING_INTENT_KEY);
}

/** Discard a stored record that failed validation — it can never be used and must not linger. */
export function quarantinePendingInterpretationIntent() {
  window.sessionStorage.removeItem(PENDING_INTENT_KEY);
}
