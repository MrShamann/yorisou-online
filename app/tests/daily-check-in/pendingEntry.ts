// DCI-1 — anonymous-to-auth continuation for the daily check-in (RTR-1 pattern).
// The pending entry lives ONLY in device-local sessionStorage (never in URLs,
// logs or analytics), with a short TTL, and is taken exactly once after login.
// Anonymous state is never silently written to an account — the user explicitly
// chooses サインインして保存 and then explicitly confirms the save on return.

export type PendingDailyEntry = {
  values: Record<string, string | null>;
  memoOptIn: boolean;
  memo: string | null;
  entryLocalDate: string;
  timezone: string;
  storedAt: number;
};

const KEY = "yorisou.daily-check-in.pending-save.v1";
const TTL_MS = 10 * 60 * 1000;

export function storePendingDailyEntry(entry: Omit<PendingDailyEntry, "storedAt">): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...entry, storedAt: Date.now() }));
  } catch {
    // storage unavailable — continuation simply won't resume
  }
}

export function takePendingDailyEntry(): PendingDailyEntry | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY); // taken exactly once
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingDailyEntry;
    if (!parsed || typeof parsed.storedAt !== "number" || Date.now() - parsed.storedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}
