// DCI-1.1 — anonymous-to-auth continuation for the daily check-in.
// The pending entry lives ONLY in device-local sessionStorage (never in URLs,
// logs or analytics), with a short TTL, and is taken exactly once after the
// resumed context is successfully loaded. It preserves the ORIGINAL completion
// instant and IANA timezone (DCI-C4): the server derives the entry's local date
// from completedAt in that original timezone — a post-login browser-timezone
// change never re-buckets the entry, and no client-authoritative entryLocalDate
// is stored or sent. Anonymous state is never silently merged into an account —
// the user reviews the resumed entry and explicitly saves (or discards) it.

export type PendingDailyEntry = {
  v: 2; // contract version marker
  values: Record<string, string | null>;
  memoOptIn: boolean;
  memo: string | null;
  completedAt: string; // original completion instant (UTC ISO)
  timezone: string; // original IANA timezone at completion
  methodVersion: string;
  schemaVersion: string;
  storedAt: number;
};

const KEY = "yorisou.daily-check-in.pending-save.v2";
const TTL_MS = 10 * 60 * 1000;

// DCI-1.2 §7 — pending-provenance compatibility (pure; unit-tested). A pending
// payload may be applied to UI state ONLY when its contract marker is supported,
// its method/schema versions equal the CURRENT canonical versions, and every
// field/option id is still valid. Stale payloads are never silently coerced.
export type PendingCompatibility =
  | { compatible: true }
  | { compatible: false; reason: "unsupported_contract" | "stale_method_version" | "stale_schema_version" | "unknown_field" | "unknown_option" | "malformed" };

export function checkPendingCompatibility(
  entry: unknown,
  current: { methodVersion: string; schemaVersion: string; fields: readonly { fieldId: string; options: readonly { optionId: string }[] }[] },
): PendingCompatibility {
  const p = entry as PendingDailyEntry | null;
  if (!p || typeof p !== "object" || p.v !== 2) return { compatible: false, reason: "unsupported_contract" };
  if (typeof p.values !== "object" || p.values === null || typeof p.completedAt !== "string" || typeof p.timezone !== "string") {
    return { compatible: false, reason: "malformed" };
  }
  if (p.methodVersion !== current.methodVersion) return { compatible: false, reason: "stale_method_version" };
  if (p.schemaVersion !== current.schemaVersion) return { compatible: false, reason: "stale_schema_version" };
  const known = new Map(current.fields.map((f) => [f.fieldId, new Set(f.options.map((o) => o.optionId))]));
  for (const [fieldId, optionId] of Object.entries(p.values)) {
    const options = known.get(fieldId);
    if (!options) return { compatible: false, reason: "unknown_field" };
    if (optionId !== null && !options.has(optionId)) return { compatible: false, reason: "unknown_option" };
  }
  return { compatible: true };
}

export function storePendingDailyEntry(entry: Omit<PendingDailyEntry, "storedAt" | "v">): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...entry, v: 2, storedAt: Date.now() }));
  } catch {
    // storage unavailable — continuation simply won't resume
  }
}

// Taken exactly once; malformed/expired/wrong-version payloads return null.
export function takePendingDailyEntry(): PendingDailyEntry | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingDailyEntry;
    if (!parsed || parsed.v !== 2 || typeof parsed.storedAt !== "number") return null;
    if (typeof parsed.completedAt !== "string" || typeof parsed.timezone !== "string") return null;
    if (Date.now() - parsed.storedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}
