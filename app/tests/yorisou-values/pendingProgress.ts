// YV-1 §12 — anonymous device-local progress + resume-provenance contract.
// Progress stays in sessionStorage (never sent to a hosted DB while anonymous),
// carries full method/schema/bank/scoring provenance + the canonical bank hash +
// an explicit expiry, is discardable, is taken exactly once, and is NEVER treated
// as compatible after canonical version drift. Pure compatibility check is
// unit-tested.

export type PendingValuesProgress = {
  v: 1; // contract marker
  answers: Record<string, "A" | "B">;
  methodVersion: string;
  bankVersion: string;
  scoringVersion: string;
  resultSchemaVersion: string;
  bankContentHash: string;
  storedAt: number;
};

const KEY = "yorisou.values.pending-progress.v1";
const TTL_MS = 24 * 60 * 60 * 1000; // one day — a 48-question flow deserves more than 10 min

export function storePendingValuesProgress(p: Omit<PendingValuesProgress, "v" | "storedAt">): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...p, v: 1, storedAt: Date.now() }));
  } catch {
    /* storage unavailable — progress simply won't resume */
  }
}

export function readPendingValuesProgress(): PendingValuesProgress | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingValuesProgress;
    if (!parsed || parsed.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function takePendingValuesProgress(): PendingValuesProgress | null {
  const p = readPendingValuesProgress();
  discardPendingValuesProgress();
  return p;
}

export function discardPendingValuesProgress(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export type PendingValuesCompatibility =
  | { compatible: true }
  | { compatible: false; reason: "unsupported_contract" | "expired" | "stale_method_version" | "stale_bank_version" | "stale_scoring_version" | "stale_schema_version" | "hash_mismatch" | "malformed" };

// Pure compatibility gate — verify BEFORE applying any pending payload.
export function checkPendingValuesCompatibility(
  entry: unknown,
  current: { methodVersion: string; bankVersion: string; scoringVersion: string; resultSchemaVersion: string; bankContentHash: string },
  now: number = Date.now(),
): PendingValuesCompatibility {
  const p = entry as PendingValuesProgress | null;
  if (!p || typeof p !== "object" || p.v !== 1) return { compatible: false, reason: "unsupported_contract" };
  if (typeof p.answers !== "object" || p.answers === null || typeof p.storedAt !== "number") return { compatible: false, reason: "malformed" };
  if (now - p.storedAt > TTL_MS) return { compatible: false, reason: "expired" };
  if (p.methodVersion !== current.methodVersion) return { compatible: false, reason: "stale_method_version" };
  if (p.bankVersion !== current.bankVersion) return { compatible: false, reason: "stale_bank_version" };
  if (p.scoringVersion !== current.scoringVersion) return { compatible: false, reason: "stale_scoring_version" };
  if (p.resultSchemaVersion !== current.resultSchemaVersion) return { compatible: false, reason: "stale_schema_version" };
  if (p.bankContentHash !== current.bankContentHash) return { compatible: false, reason: "hash_mismatch" };
  return { compatible: true };
}
