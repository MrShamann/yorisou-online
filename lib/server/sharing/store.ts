import "server-only";
// SHR-1 — server-only ShareObject persistence repository (service-role PostgREST, mirroring the
// DD-1 and DCI stores). Every mutation goes through an atomic SECURITY DEFINER RPC that writes the
// object and its content-free audit row in ONE transaction; there is no update-the-card path in
// SQL or here. The public read selects ONLY public-safe columns — owner_account_id and source_ref
// exist in the table and never in a response from this module's public path.

import type { ShareObjectReference, ShareObjectView } from "@/lib/platform/sharingCore";
import type { SharingRepository, SharePublishResult } from "@/lib/server/platform/sharingCore/service";

const OBJECTS = "yorisou_share_objects";

/** Public-safe columns ONLY. Adding owner/source columns here is a reviewable privacy event. */
const PUBLIC_COLUMNS = "public_id,card_family,template_version,payload_version,public_payload,published_at";

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("sharing_persistence_not_configured");
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
    const text = await response.text().catch(() => "");
    const known = /share_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `sharing_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

type PublishRow = { public_id: string; card_family: string; template_version: string; published_at: string; reused: boolean };

export async function publishShareObject(input: {
  ownerAccountId: string;
  candidate: {
    card_family: string;
    source_family: string;
    source_ref: string;
    template_ref: string;
    template_version: string;
    payload_version: string;
    payload: unknown;
  };
  digest: string;
}): Promise<SharePublishResult> {
  const row = await rpc<PublishRow>("yorisou_share_object_publish", {
    p_owner_account_id: input.ownerAccountId,
    p_card_family: input.candidate.card_family,
    p_source_family: input.candidate.source_family,
    p_source_ref: input.candidate.source_ref,
    p_template_ref: input.candidate.template_ref,
    p_template_version: input.candidate.template_version,
    p_payload_version: input.candidate.payload_version,
    p_public_payload: input.candidate.payload,
    p_payload_digest: input.digest,
  });
  const reference: ShareObjectReference = {
    public_id: row.public_id,
    card_family: row.card_family,
    template_version: row.template_version,
    published_at: row.published_at,
  };
  return { reference, reused: row.reused };
}

export async function revokeShareObject(ownerAccountId: string, publicId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_share_object_revoke", {
    p_owner_account_id: ownerAccountId,
    p_public_id: publicId,
  });
}

export async function revokeShareObjectsBySource(sourceFamily: string, sourceRef: string): Promise<number> {
  return rpc<number>("yorisou_share_objects_revoke_by_source", {
    p_source_family: sourceFamily,
    p_source_ref: sourceRef,
  });
}

export async function activeShareForSource(
  ownerAccountId: string,
  sourceFamily: string,
  sourceRef: string,
  templateRef: string,
): Promise<(ShareObjectReference & { digest: string }) | null> {
  const params = new URLSearchParams({
    select: "public_id,card_family,template_version,published_at,payload_digest",
    owner_account_id: `eq.${ownerAccountId}`,
    source_family: `eq.${sourceFamily}`,
    source_ref: `eq.${sourceRef}`,
    template_ref: `eq.${templateRef}`,
    revoked_at: "is.null",
    limit: "1",
  });
  const response = await request(`${OBJECTS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`sharing_persistence_failed:${response.status}`);
  const row = ((await response.json()) as Array<{
    public_id: string;
    card_family: string;
    template_version: string;
    published_at: string;
    payload_digest: string;
  }>)[0];
  if (!row) return null;
  return {
    public_id: row.public_id,
    card_family: row.card_family,
    template_version: row.template_version,
    published_at: row.published_at,
    digest: row.payload_digest,
  };
}

export async function publicShareView(publicId: string): Promise<ShareObjectView | null> {
  // Defensive shape check before it ever reaches a query string.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(publicId)) return null;
  const params = new URLSearchParams({
    select: PUBLIC_COLUMNS,
    public_id: `eq.${publicId}`,
    revoked_at: "is.null",
    limit: "1",
  });
  const response = await request(`${OBJECTS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`sharing_persistence_failed:${response.status}`);
  const row = ((await response.json()) as Array<{
    public_id: string;
    card_family: string;
    template_version: string;
    payload_version: string;
    public_payload: unknown;
    published_at: string;
  }>)[0];
  if (!row) return null;
  return {
    public_id: row.public_id,
    card_family: row.card_family,
    template_version: row.template_version,
    payload_version: row.payload_version,
    payload: row.public_payload,
    published_at: row.published_at,
  };
}

/** The concrete repository the routes hand to the generic sharing.core runtime. */
export const sharingRepository: SharingRepository = {
  publish: (input) =>
    publishShareObject({ ownerAccountId: input.ownerAccountId, candidate: input.candidate, digest: input.digest }),
  revoke: revokeShareObject,
  revokeBySource: revokeShareObjectsBySource,
  activeForSource: activeShareForSource,
  publicView: publicShareView,
};
