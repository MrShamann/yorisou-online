import "server-only";

// OSF-1 PHASE B — the Life OS audit writer.
//
// `annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` §Conventions: "ALL mutations emit an `audit_event`".
// Until now the Life OS emitted nothing at all — lib/server/lifeOs/store.ts had no event write of
// any kind, so a person's records could be created, changed and deleted leaving no trace an
// incident review could read.
//
// TWO PROPERTIES THIS DELIBERATELY HAS.
//
// It never stores an account id. The RPC fingerprints the owner (sha256) before insert, so account
// deletion leaves nothing personal behind and the table needs no erasure-plan entry — see the
// migration header for why that resolves the annex's "pseudonymized, not deleted" rule without an
// exception.
//
// It NEVER FAILS A MUTATION. An audit write that throws would mean a person loses the reflection
// they just typed because the ops trace was unavailable — trading the thing that matters for the
// record of it. So every write here is best-effort and swallows its own errors. That is a real
// trade-off, stated rather than hidden: a dropped audit row is invisible. It is the right way round
// because the audit exists to explain what happened to someone's data, not to gate it.

import { createHash } from "crypto";

/** `yorisou.life.<domain>.<verb>` — its own namespace, NOT the canonical `yorisou.exp.*` dictionary. */
export const LIFE_OS_AUDIT_ACTIONS = [
  "yorisou.life.context.updated",
  "yorisou.life.state.created",
  "yorisou.life.state.annotated",
  "yorisou.life.goal.created",
  "yorisou.life.goal.status_changed",
  "yorisou.life.reflection.created",
  "yorisou.life.memory.confirmed",
  "yorisou.life.memory.deleted",
  "yorisou.life.assistant.drafted",
  "yorisou.life.assistant.refused",
] as const;
export type LifeOsAuditAction = (typeof LIFE_OS_AUDIT_ACTIONS)[number];

export type LifeOsEntityKind =
  | "user_context" | "current_state" | "goal" | "reflection" | "memory" | "experience" | "assistant";

/** The fingerprint the database will compute. Exported so tests can assert the two agree. */
export function actorFingerprint(ownerAccountId: string): string {
  return createHash("sha256").update(ownerAccountId, "utf8").digest("hex");
}

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * Record one Life OS mutation. Best-effort by design — see the header.
 *
 * `detail` must carry counts, enum values and outcome codes only. Never user text: the database caps
 * its size but cannot tell prose from a status code, so that discipline lives here and in the
 * callers. Each call site passes literals for exactly this reason.
 */
export async function auditLifeOs(input: {
  ownerAccountId: string;
  action: LifeOsAuditAction;
  entityKind: LifeOsEntityKind;
  entityRef?: string | null;
  reason: string;
  detail?: Record<string, string | number | boolean>;
}): Promise<void> {
  const cfg = config();
  if (!cfg) return; // no store configured (local dev): nothing to write to, and not an error
  try {
    await fetch(`${cfg.url}/rest/v1/rpc/yorisou_osf1_audit_write`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      cache: "no-store",
      body: JSON.stringify({
        p_owner_account_id: input.ownerAccountId,
        p_action: input.action,
        p_entity_kind: input.entityKind,
        p_entity_ref: input.entityRef ?? null,
        p_reason: input.reason,
        p_detail: input.detail ?? {},
      }),
    });
  } catch {
    // Swallowed on purpose. The mutation the caller just performed must not be undone by the
    // failure of its own audit record.
  }
}
