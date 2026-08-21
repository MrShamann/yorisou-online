import "server-only";

// LCO-1 — the consent record, read and written the same way every other governed row is: reads by
// service-role PostgREST, writes only through SECURITY DEFINER RPCs. The table grants service_role
// SELECT alone, so a defect in this file cannot become a write.

import { LIFE_OS_CONSENT_VERSION } from "@/lib/life-os/consent";

export type LifeOsConsentRecord = {
  owner_account_id: string;
  consent_version: string;
  accepted_at: string;
  revoked_at: string | null;
};

const TABLE = "yorisou_life_os_consents";
const COLUMNS = "owner_account_id,consent_version,accepted_at,revoked_at";

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("life_os_consent_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit = {}) {
  const { url, key } = config();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

/** This person's consent row, or null. Owner-scoped by the query, as every read here is. */
export async function readLifeOsConsent(ownerAccountId: string): Promise<LifeOsConsentRecord | null> {
  if (!ownerAccountId) return null;
  const params = new URLSearchParams({ select: COLUMNS, owner_account_id: `eq.${ownerAccountId}`, limit: "1" });
  const response = await request(`${TABLE}?${params}`);
  if (!response.ok) throw new Error(`life_os_consent_read_failed:${response.status}`);
  return ((await response.json()) as LifeOsConsentRecord[])[0] ?? null;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const known = /life_os_consent_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `life_os_consent_write_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

/** Record acceptance of the wording currently shown. The version is taken from the copy module so
 *  a caller cannot record agreement to a version that was never displayed. */
export function recordLifeOsConsent(ownerAccountId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_life_os_consent_record", {
    p_owner_account_id: ownerAccountId,
    p_consent_version: LIFE_OS_CONSENT_VERSION,
  });
}

/** Withdraw. Returns how many rows transitioned — 0 means it was already withdrawn. */
export function revokeLifeOsConsent(ownerAccountId: string): Promise<number> {
  return rpc<number>("yorisou_life_os_consent_revoke", { p_owner_account_id: ownerAccountId });
}
