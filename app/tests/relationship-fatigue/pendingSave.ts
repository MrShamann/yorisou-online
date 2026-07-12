"use client";

import type { AnswerMap } from "./data";

const PENDING_RF_SAVE_KEY = "yorisou.relationship-fatigue.pending-save.v1";

export function storePendingRFSave(answers: AnswerMap) {
  window.sessionStorage.setItem(PENDING_RF_SAVE_KEY, JSON.stringify({ answers, createdAt: Date.now() }));
}

export function takePendingRFSave(): AnswerMap | null {
  const raw = window.sessionStorage.getItem(PENDING_RF_SAVE_KEY);
  window.sessionStorage.removeItem(PENDING_RF_SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { answers?: unknown; createdAt?: unknown };
    if (typeof parsed.createdAt !== "number" || Date.now() - parsed.createdAt > 10 * 60 * 1000) return null;
    if (!parsed.answers || typeof parsed.answers !== "object" || Array.isArray(parsed.answers)) return null;
    return parsed.answers as AnswerMap;
  } catch {
    return null;
  }
}
