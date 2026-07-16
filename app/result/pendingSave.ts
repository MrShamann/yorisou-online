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
