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

export function takePendingResultClaim(): PendingResultClaim | null {
  const raw = window.sessionStorage.getItem(PENDING_RESULT_CLAIM_KEY);
  window.sessionStorage.removeItem(PENDING_RESULT_CLAIM_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { resultRowId?: unknown; createdAt?: unknown };
    if (typeof parsed.createdAt !== "number" || Date.now() - parsed.createdAt > 10 * 60 * 1000) return null;
    if (typeof parsed.resultRowId !== "string" || !UUID_RE.test(parsed.resultRowId)) return null;
    return { resultRowId: parsed.resultRowId };
  } catch {
    return null;
  }
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
 * Read and REMOVE the intent. Removal happens before the network call, so a replay of the same
 * intent is impossible even if the request is retried or the page is reopened.
 */
export function takePendingInterpretationIntent(): PendingInterpretationIntent | null {
  const raw = window.sessionStorage.getItem(PENDING_INTENT_KEY);
  window.sessionStorage.removeItem(PENDING_INTENT_KEY);
  if (!raw) return null;
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
