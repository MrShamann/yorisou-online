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
// TWO DELIVERY CLASSES NOW EXIST, AND THIS MODULE IMPLEMENTS ONLY ONE OF THEM.
//
// ASYNCHRONOUS (this file): the write is attempted after the mutation and its failure is swallowed.
// A dropped row is invisible. Correct when the mutation is self-evidencing — the row itself is the
// record, and nothing was destroyed.
//
// TRANSACTIONAL (NOT this file): the audit insert happens inside the mutation's own SECURITY DEFINER
// RPC, so either both land or neither does — see 202608160001. Four actions are delivered that way:
// reflection.created, memory.confirmed, memory.deleted and memory.updated. They are marked in
// AUDIT_DELIVERY_CLASS below and they must NEVER be passed to auditLifeOs(): the database has
// already written them, and a second best-effort insert would duplicate a row in an append-only
// table that has no way to remove it. `assertAsynchronousAction` enforces that at the call site.
//
// The trade-off the transactional class carries is real and deliberate: if the audit table is
// unavailable, the mutation fails. A person can lose a reflection because its record could not be
// written. See docs/yorisou/osf1/OSF1_AUDIT_DELIVERY_CLASSES.md.

import { createHash } from "crypto";
import { newCorrelationId, recordLifeOsOps } from "@/lib/server/lifeOs/observability";

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
  "yorisou.life.memory.updated",
  "yorisou.life.memory.suppressed",
  "yorisou.life.memory.restored",
  "yorisou.life.memory.revoked",
  "yorisou.life.experience.created",
  "yorisou.life.experience.updated",
  "yorisou.life.assistant.drafted",
  "yorisou.life.assistant.refused",
] as const;
export type LifeOsAuditAction = (typeof LIFE_OS_AUDIT_ACTIONS)[number];

/**
 * The delivery class each action is delivered with. This is now a statement of fact, not of intent:
 * every "transactional" entry is written inside its mutation's RPC by 202608160001, and every
 * "asynchronous" entry is written by auditLifeOs() below.
 */
export const AUDIT_DELIVERY_CLASS: Record<LifeOsAuditAction, "transactional" | "asynchronous"> = {
  "yorisou.life.context.updated": "asynchronous",
  "yorisou.life.state.created": "asynchronous",
  "yorisou.life.state.annotated": "asynchronous",
  "yorisou.life.goal.created": "asynchronous",
  "yorisou.life.goal.status_changed": "asynchronous",
  "yorisou.life.reflection.created": "transactional",
  "yorisou.life.memory.confirmed": "transactional",
  "yorisou.life.memory.deleted": "transactional",
  "yorisou.life.memory.updated": "transactional",
  // Each of these changes what the product is PERMITTED to do with something the person told it.
  // The record of a permission change must not be able to go missing separately from the change.
  "yorisou.life.memory.suppressed": "transactional",
  "yorisou.life.memory.restored": "transactional",
  "yorisou.life.memory.revoked": "transactional",
  // Self-evidencing: the card is the record, and neither action destroys anything.
  "yorisou.life.experience.created": "asynchronous",
  "yorisou.life.experience.updated": "asynchronous",
  "yorisou.life.assistant.drafted": "asynchronous",
  "yorisou.life.assistant.refused": "asynchronous",
};

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

/** The transactional actions, derived so the two constants cannot drift apart. */
export const TRANSACTIONAL_AUDIT_ACTIONS = LIFE_OS_AUDIT_ACTIONS.filter(
  (action) => AUDIT_DELIVERY_CLASS[action] === "transactional",
);

/**
 * Record one Life OS mutation. Best-effort by design — see the header.
 *
 * Refuses a transactional action outright. That is not defensiveness: the database has already
 * written that row inside the mutation's transaction, and the audit table is append-only, so a
 * duplicate here could never be cleaned up.
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
  if (AUDIT_DELIVERY_CLASS[input.action] === "transactional") {
    throw new Error(`life_os_audit_transactional_action_not_writable_here:${input.action}`);
  }
  const cfg = config();
  if (!cfg) return; // no store configured (local dev): nothing to write to, and not an error
  try {
    const response = await fetch(`${cfg.url}/rest/v1/rpc/yorisou_osf1_audit_write`, {
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
    // A dropped asynchronous audit row is invisible by design — so it is at least COUNTED. Without
    // this, "the audit is best-effort" and "the audit never fails" look identical from outside.
    if (!response.ok) {
      recordLifeOsOps({
        event: "life_os.audit.write_failed",
        correlationId: newCorrelationId(),
        objectId: input.entityRef ?? null,
        ownerAccountId: input.ownerAccountId,
        errorClass: `http_${response.status}`,
      });
    }
  } catch {
    // Swallowed on purpose. The mutation the caller just performed must not be undone by the
    // failure of its own audit record — but it is recorded as an operational event, because an
    // audit gap nobody can see is the failure mode this whole module exists to avoid.
    recordLifeOsOps({
      event: "life_os.audit.write_failed",
      correlationId: newCorrelationId(),
      objectId: input.entityRef ?? null,
      ownerAccountId: input.ownerAccountId,
      errorClass: "transport_failed",
    });
  }
}
