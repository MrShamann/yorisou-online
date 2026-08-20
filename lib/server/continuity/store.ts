import "server-only";

// CNT-1 — the product-tier repository behind continuity.core.
//
// THIS FILE IS WHERE THE YORISOU TABLE NAME IS ALLOWED TO EXIST. lib/platform/continuityCore.ts is
// brand-free by contract and a structural guard enforces it, so the mapping from a generic source
// FAMILY to a concrete Yorisou table lives here and only here.
//
// READS are service-role PostgREST against the projection index. WRITES are the SECURITY DEFINER
// RPCs; the table grants service_role SELECT only, so a bug in this file cannot become a write.
//
// NOTHING IN THE REQUEST PATH CALLS THE WRITE METHODS, and that is deliberate rather than an
// oversight. Propagation is an AFTER trigger on the four source tables, so a moment is written
// inside the source's own transaction — atomic in a way a second HTTP call could never be. The
// write methods exist because the capability contract defines them and a repair seam needs them,
// not because the product reaches for them; archP6Continuity.test.ts fails if a route or page ever
// does.

import {
  type ContinuityPageRequest,
  type ContinuitySourceFamily,
  type ProjectionKey,
  type ProjectionSource,
  type TimelineMoment,
} from "@/lib/platform/continuityCore";
import type { ContinuityRepository } from "@/lib/server/platform/continuityCore/service";

const TABLE = "yorisou_continuity_projections";

/** Exactly the columns the index holds. There is no content column to select, by design. */
const COLUMNS = "owner_account_id,source_family,source_ref,occurred_at,variant,invalidated_at";

type ProjectionRow = {
  owner_account_id: string;
  source_family: ContinuitySourceFamily;
  source_ref: string;
  occurred_at: string;
  variant: string | null;
  invalidated_at: string | null;
};

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("continuity_persistence_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit = {}) {
  const { url, key } = config();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  if (!response.ok) {
    // Surface the RPC's own named exception (continuity_owner_required, …) and nothing else: the
    // raw body can quote the offending values, which must not reach a log line.
    const text = await response.text().catch(() => "");
    const known = /continuity_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `continuity_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

function toMoment(row: ProjectionRow): TimelineMoment {
  return {
    owner_ref: row.owner_account_id,
    source_family: row.source_family,
    source_ref: row.source_ref,
    occurred_at: row.occurred_at,
    variant: row.variant,
    status: row.invalidated_at === null ? "active" : "invalidated",
  };
}

export const continuityRepository: ContinuityRepository = {
  async upsertMoment(source: ProjectionSource): Promise<TimelineMoment> {
    await rpc<boolean>("yorisou_continuity_project", {
      p_owner_account_id: source.owner_ref,
      p_source_family: source.source_family,
      p_source_ref: source.source_ref,
      p_occurred_at: source.occurred_at,
      p_variant: source.variant,
    });
    // The RPC answers whether it wrote, not what the row now says — and the two differ exactly when
    // the moment was already invalidated. Re-reading is what keeps a caller from assuming a refused
    // write succeeded.
    const params = new URLSearchParams({
      select: COLUMNS,
      owner_account_id: `eq.${source.owner_ref}`,
      source_family: `eq.${source.source_family}`,
      source_ref: `eq.${source.source_ref}`,
      limit: "1",
    });
    const response = await request(`${TABLE}?${params}`);
    if (!response.ok) throw new Error(`continuity_persistence_failed:${response.status}`);
    const rows = (await response.json()) as ProjectionRow[];
    if (!rows[0]) throw new Error("continuity_projection_missing_after_write");
    return toMoment(rows[0]);
  },

  async invalidateForSource(key: ProjectionKey): Promise<number> {
    return rpc<number>("yorisou_continuity_invalidate_source", {
      p_owner_account_id: key.owner_ref,
      p_source_family: key.source_family,
      p_source_ref: key.source_ref,
    });
  },

  async listActive(ownerRef: string, limit: number): Promise<readonly TimelineMoment[]> {
    const params = new URLSearchParams({
      select: COLUMNS,
      owner_account_id: `eq.${ownerRef}`,
      invalidated_at: "is.null",
      order: "occurred_at.desc,source_ref.desc",
      limit: String(limit),
    });
    const response = await request(`${TABLE}?${params}`);
    if (!response.ok) throw new Error(`continuity_persistence_failed:${response.status}`);
    return ((await response.json()) as ProjectionRow[]).map(toMoment);
  },

  async pageActive(pageRequest: ContinuityPageRequest): Promise<readonly TimelineMoment[]> {
    const params = new URLSearchParams({
      select: COLUMNS,
      owner_account_id: `eq.${pageRequest.owner_ref}`,
      invalidated_at: "is.null",
      // The same sort key the legacy reader used, on the same values: occurred_at IS the source's
      // created_at, and source_ref IS its id. source_ref is COLLATE "C" so the text tie-break orders
      // identically to the uuid tie-break the old reader used.
      order: "occurred_at.desc,source_ref.desc",
      // One more than asked, so the service can tell "a full page" from "a full page and more".
      limit: String(pageRequest.limit + 1),
    });
    params.set(
      "source_family",
      pageRequest.families.length === 1
        ? `eq.${pageRequest.families[0]}`
        : `in.(${pageRequest.families.join(",")})`,
    );
    if (pageRequest.variant !== null) params.set("variant", `eq.${pageRequest.variant}`);
    if (pageRequest.after) {
      params.set(
        "or",
        `(occurred_at.lt.${pageRequest.after.occurred_at},` +
          `and(occurred_at.eq.${pageRequest.after.occurred_at},source_ref.lt.${pageRequest.after.source_ref}))`,
      );
    }
    const response = await request(`${TABLE}?${params}`);
    if (!response.ok) throw new Error(`continuity_persistence_failed:${response.status}`);
    return ((await response.json()) as ProjectionRow[]).map(toMoment);
  },
};
