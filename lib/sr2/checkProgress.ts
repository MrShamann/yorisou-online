// SR-2 — 120Q in-progress persistence (device-local, separately versioned).
//
// Raw in-progress answers are stored ONLY on the user's device, in a SEPARATE
// versioned progress record (§7) — never in the SR-1 public-safe guest journey,
// never in the URL / analytics / share / public HTML. The record is cleared on
// completion or explicit restart, and is discarded automatically when the
// question-bank signature changes (stale version) or the data is corrupt.

export const SR2_CHECK_PROGRESS_KEY = "yorisou.sr2.checkProgress.v1";

export type CheckProgress = {
  version: "sr2.checkprogress.v1";
  bankSignature: string; // question-bank version signature; mismatch → discard
  updatedAt: string;
  currentIndex: number;
  answers: Record<string, string>; // raw in-progress answers, device-local only
};

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value as Record<string, unknown>).every(
    ([k, v]) => typeof k === "string" && typeof v === "string",
  );
}

// Read the saved progress. Returns null when: absent, corrupt, wrong version, or
// the question-bank signature no longer matches (stale bank → safe discard).
export function readCheckProgress(bankSignature: string): CheckProgress | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SR2_CHECK_PROGRESS_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CheckProgress>;
    if (
      !parsed ||
      parsed.version !== "sr2.checkprogress.v1" ||
      typeof parsed.bankSignature !== "string" ||
      typeof parsed.currentIndex !== "number" ||
      !Number.isFinite(parsed.currentIndex) ||
      parsed.currentIndex < 0 ||
      !isRecordOfStrings(parsed.answers)
    ) {
      // corrupt / wrong shape → discard so it can never resume as a bad state
      clearCheckProgress();
      return null;
    }
    if (parsed.bankSignature !== bankSignature) {
      // the question bank changed since this was saved → discard (never resume
      // stale answers against a different bank)
      clearCheckProgress();
      return null;
    }
    return {
      version: "sr2.checkprogress.v1",
      bankSignature: parsed.bankSignature,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
      currentIndex: Math.floor(parsed.currentIndex),
      answers: parsed.answers,
    };
  } catch {
    clearCheckProgress();
    return null;
  }
}

export function writeCheckProgress(input: {
  bankSignature: string;
  currentIndex: number;
  answers: Record<string, string>;
}): void {
  if (typeof window === "undefined") return;
  const record: CheckProgress = {
    version: "sr2.checkprogress.v1",
    bankSignature: input.bankSignature,
    updatedAt: new Date().toISOString(),
    currentIndex: Math.max(0, Math.floor(input.currentIndex)),
    answers: input.answers,
  };
  try {
    window.localStorage.setItem(SR2_CHECK_PROGRESS_KEY, JSON.stringify(record));
  } catch {
    /* storage full / unavailable — non-fatal; the flow still works in-memory */
  }
}

export function clearCheckProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SR2_CHECK_PROGRESS_KEY);
  } catch {
    /* non-fatal */
  }
}

export function answeredCount(progress: CheckProgress | null): number {
  return progress ? Object.keys(progress.answers).length : 0;
}

// A short, stable relative-time label for "last updated" (JP).
export function relativeUpdatedLabel(iso: string, nowMs: number): string {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const diffMin = Math.max(0, Math.floor((nowMs - then) / 60000));
  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}時間前`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}日前`;
}
