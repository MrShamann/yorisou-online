import "server-only";
// DD-1 — server-only Daily Discovery persistence repository (service-role PostgREST, mirroring
// lib/server/dailyCheckInStore.ts). Owner scoping is enforced HERE and in the route layer;
// anonymous callers never reach this module. The one mutation goes through the atomic idempotent
// SECURITY DEFINER RPC — first writer per (owner, local date, pack) wins, forever.

import type { DiscoveryRepository, DiscoverySessionRow } from "@/lib/server/platform/discoveryCore/service";

const SESSIONS = "yorisou_discovery_sessions";

const ROW_COLUMNS = "id,local_date,pack_id,pack_version,pattern_family,result_id,completed_at";

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("discovery_persistence_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = config();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  if (!response.ok) {
    // Surface the RPC's named exception without leaking content.
    const text = await response.text().catch(() => "");
    const known = /discovery_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `discovery_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

export async function getDiscoverySessionForDate(
  ownerAccountId: string,
  localDate: string,
  packId: string,
): Promise<DiscoverySessionRow | null> {
  const params = new URLSearchParams({
    select: ROW_COLUMNS,
    owner_account_id: `eq.${ownerAccountId}`,
    local_date: `eq.${localDate}`,
    pack_id: `eq.${packId}`,
    limit: "1",
  });
  const response = await request(`${SESSIONS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`discovery_persistence_failed:${response.status}`);
  return ((await response.json()) as DiscoverySessionRow[])[0] || null;
}

export async function listRecentDiscoveryResultIds(
  ownerAccountId: string,
  packId: string,
  limit: number,
): Promise<string[]> {
  if (limit <= 0) return [];
  const params = new URLSearchParams({
    select: "result_id",
    owner_account_id: `eq.${ownerAccountId}`,
    pack_id: `eq.${packId}`,
    order: "local_date.desc",
    limit: String(limit),
  });
  const response = await request(`${SESSIONS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`discovery_persistence_failed:${response.status}`);
  return ((await response.json()) as { result_id: string }[]).map((row) => row.result_id);
}

export async function completeDiscoverySession(input: {
  ownerAccountId: string;
  localDate: string;
  calendarTimezone: string;
  packId: string;
  packVersion: string;
  patternFamily: string;
  resultId: string;
  completedAt: string;
}): Promise<DiscoverySessionRow> {
  return rpc<DiscoverySessionRow>("yorisou_discovery_session_complete", {
    p_owner_account_id: input.ownerAccountId,
    p_local_date: input.localDate,
    p_calendar_timezone: input.calendarTimezone,
    p_pack_id: input.packId,
    p_pack_version: input.packVersion,
    p_pattern_family: input.patternFamily,
    p_result_id: input.resultId,
    p_completed_at: input.completedAt,
  });
}

/** The concrete repository, bound to the real store — what routes hand to the generic runtime. */
export const discoveryRepository: DiscoveryRepository = {
  getSessionForDate: getDiscoverySessionForDate,
  listRecentResultIds: listRecentDiscoveryResultIds,
  completeSession: completeDiscoverySession,
};
