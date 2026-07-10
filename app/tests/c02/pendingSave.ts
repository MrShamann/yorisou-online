"use client";

import type { C02AnswerMap } from "@/lib/yorisou-tests/c02";

const PENDING_C02_SAVE_KEY = "yorisou.c02.pending-save.v1";

export function storePendingC02Save(answers: C02AnswerMap) {
  window.sessionStorage.setItem(PENDING_C02_SAVE_KEY, JSON.stringify({ answers, createdAt: Date.now() }));
}

export function takePendingC02Save(): C02AnswerMap | null {
  const raw = window.sessionStorage.getItem(PENDING_C02_SAVE_KEY);
  window.sessionStorage.removeItem(PENDING_C02_SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { answers?: unknown; createdAt?: unknown };
    if (typeof parsed.createdAt !== "number" || Date.now() - parsed.createdAt > 10 * 60 * 1000) return null;
    if (!parsed.answers || typeof parsed.answers !== "object" || Array.isArray(parsed.answers)) return null;
    return parsed.answers as C02AnswerMap;
  } catch { return null; }
}
