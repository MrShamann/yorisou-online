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
