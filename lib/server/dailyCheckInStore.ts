import "server-only";
// DCI-1 — server-only daily-check-in persistence repository (service-role
// PostgREST, mirroring lib/server/testResults.ts). Owner scoping is enforced
// HERE and in the API layer; anonymous callers never reach this module.
// All multi-row invariants go through the atomic SECURITY DEFINER RPCs.

const RECORDS = "yorisou_daily_state_records";

export type DailyStateRecord = {
  id: string;
  owner_account_id: string;
  method_id: string;
  method_version: string;
  schema_version: string;
  ack_version: string;
  produced_at: string;
  entry_local_date: string;
  timezone: string;
  utc_offset_minutes: number | null;
  state: Record<string, string | null>;
  memo: string | null;
  ack_id: string;
  current_version: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("daily_persistence_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  return response;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  if (!response.ok) {
    // Surface the RPC's named exception (e.g. daily_record_exists) without leaking content.
    const text = await response.text().catch(() => "");
    const known = /daily_record_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `daily_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

const RECORD_COLUMNS =
  "id,owner_account_id,method_id,method_version,schema_version,ack_version,produced_at,entry_local_date,timezone,utc_offset_minutes,state,memo,ack_id,current_version,created_at,updated_at,deleted_at";

export async function createDailyRecord(input: {
  ownerAccountId: string;
  methodVersion: string;
  schemaVersion: string;
  ackVersion: string;
  producedAt: string;
  entryLocalDate: string;
  timezone: string;
  utcOffsetMinutes: number | null;
  state: Record<string, string | null>;
  memo: string | null;
  ackId: string;
}): Promise<string> {
  return rpc<string>("yorisou_daily_record_create", {
    p_owner_account_id: input.ownerAccountId,
    p_method_version: input.methodVersion,
    p_schema_version: input.schemaVersion,
    p_ack_version: input.ackVersion,
    p_produced_at: input.producedAt,
    p_entry_local_date: input.entryLocalDate,
    p_timezone: input.timezone,
    p_utc_offset_minutes: input.utcOffsetMinutes,
    p_state: input.state,
    p_memo: input.memo,
    p_ack_id: input.ackId,
  });
}

export async function correctDailyRecord(input: {
  ownerAccountId: string;
  entryLocalDate: string;
  producedAt: string;
  state: Record<string, string | null>;
  memo: string | null;
  ackId: string;
}): Promise<number> {
  return rpc<number>("yorisou_daily_record_correct", {
    p_owner_account_id: input.ownerAccountId,
    p_entry_local_date: input.entryLocalDate,
    p_produced_at: input.producedAt,
    p_state: input.state,
    p_memo: input.memo,
    p_ack_id: input.ackId,
    p_reason_code: "user_correction",
  });
}

export async function deleteDailyRecord(ownerAccountId: string, entryLocalDate: string): Promise<boolean> {
  return rpc<boolean>("yorisou_daily_record_delete", {
    p_owner_account_id: ownerAccountId,
    p_entry_local_date: entryLocalDate,
    p_deleted_by: "owner",
  });
}

// Owner-scoped visible history, newest first, bounded window.
export async function listDailyRecordsForOwner(ownerAccountId: string, sinceLocalDate: string, limit = 62): Promise<DailyStateRecord[]> {
  const params = new URLSearchParams({
    select: RECORD_COLUMNS,
    owner_account_id: `eq.${ownerAccountId}`,
    entry_local_date: `gte.${sinceLocalDate}`,
    deleted_at: "is.null",
    order: "entry_local_date.desc",
    limit: String(limit),
  });
  const response = await request(`${RECORDS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`daily_persistence_failed:${response.status}`);
  return (await response.json()) as DailyStateRecord[];
}

export async function getDailyRecordForOwner(ownerAccountId: string, entryLocalDate: string): Promise<DailyStateRecord | null> {
  const params = new URLSearchParams({
    select: RECORD_COLUMNS,
    owner_account_id: `eq.${ownerAccountId}`,
    entry_local_date: `eq.${entryLocalDate}`,
    deleted_at: "is.null",
    limit: "1",
  });
  const response = await request(`${RECORDS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`daily_persistence_failed:${response.status}`);
  return ((await response.json()) as DailyStateRecord[])[0] || null;
}

export async function ownerHasAnyDailyRecord(ownerAccountId: string): Promise<boolean> {
  const params = new URLSearchParams({ select: "id", owner_account_id: `eq.${ownerAccountId}`, limit: "1" });
  const response = await request(`${RECORDS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`daily_persistence_failed:${response.status}`);
  return ((await response.json()) as { id: string }[]).length > 0;
}
