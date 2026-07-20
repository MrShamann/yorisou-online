// DCI-1.1 §5 — SERVER-AUTHORITATIVE time contract for daily-check-in creation.
//
// Standard create: the server generates producedAt from server time and derives
// entryLocalDate from it in the submitted (validated) IANA timezone. The client
// never controls canonical producedAt/entryLocalDate and cannot create backdated
// or future-dated records.
//
// Anonymous resumed create: the pending entry's original completedAt + timezone
// may be preserved ONLY within a bounded window (10 minutes, matching the pending
// TTL) plus a small documented clock-skew allowance for the future (120s).
// Expired/invalid pending time never silently creates a backdated record — the
// caller returns a bounded validation error and the user records a current entry.

import { isValidIanaTimezone, localDateForInstant } from "@/lib/yorisou/method-runtime/recordedState";

export const RESUMED_MAX_AGE_MS = 10 * 60 * 1000; // = pending-entry TTL
export const RESUMED_FUTURE_SKEW_MS = 120 * 1000; // documented clock-skew allowance

export type TimeIdentity = {
  producedAt: string;
  entryLocalDate: string;
  timezone: string;
  utcOffsetMinutes: number | null;
};

export type TimeContractResult =
  | { ok: true; identity: TimeIdentity }
  | { ok: false; code: "invalid_timezone" | "resumed_time_invalid" | "resumed_time_expired" | "resumed_time_future" };

function utcOffsetMinutesFor(instantIso: string, timezone: string): number | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "shortOffset" }).formatToParts(new Date(instantIso));
    const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
    if (!m) return name === "GMT" ? 0 : null;
    const sign = m[1] === "-" ? -1 : 1;
    return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
  } catch {
    return null;
  }
}

// Standard create: server time only.
export function serverTimeIdentity(timezone: string, now: Date = new Date()): TimeContractResult {
  if (!isValidIanaTimezone(timezone)) return { ok: false, code: "invalid_timezone" };
  const producedAt = now.toISOString();
  const entryLocalDate = localDateForInstant(producedAt, timezone);
  if (!entryLocalDate) return { ok: false, code: "invalid_timezone" };
  return { ok: true, identity: { producedAt, entryLocalDate, timezone, utcOffsetMinutes: utcOffsetMinutesFor(producedAt, timezone) } };
}

// Resumed create: preserve the original completion instant within the bounded
// window; the LOCAL DATE is always derived by the server from completedAt in the
// ORIGINAL timezone (a post-login browser timezone change never re-buckets it).
export function resumedTimeIdentity(completedAt: unknown, timezone: unknown, now: Date = new Date()): TimeContractResult {
  if (typeof timezone !== "string" || !isValidIanaTimezone(timezone)) return { ok: false, code: "invalid_timezone" };
  if (typeof completedAt !== "string") return { ok: false, code: "resumed_time_invalid" };
  const instant = new Date(completedAt);
  if (Number.isNaN(instant.getTime())) return { ok: false, code: "resumed_time_invalid" };
  const age = now.getTime() - instant.getTime();
  if (age > RESUMED_MAX_AGE_MS) return { ok: false, code: "resumed_time_expired" };
  if (age < -RESUMED_FUTURE_SKEW_MS) return { ok: false, code: "resumed_time_future" };
  const producedAt = instant.toISOString();
  const entryLocalDate = localDateForInstant(producedAt, timezone);
  if (!entryLocalDate) return { ok: false, code: "invalid_timezone" };
  return { ok: true, identity: { producedAt, entryLocalDate, timezone, utcOffsetMinutes: utcOffsetMinutesFor(producedAt, timezone) } };
}

// §7 — correction window: PATCH is accepted only while the server's now in the
// record's STORED timezone is still the record's entryLocalDate.
export function correctionWindowOpen(entryLocalDate: string, storedTimezone: string, now: Date = new Date()): boolean {
  return localDateForInstant(now.toISOString(), storedTimezone) === entryLocalDate;
}
