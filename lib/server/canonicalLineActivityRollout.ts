// POR-1 — the canonical LINE activity ROLLOUT RULE, as a pure function.
//
// The canonical LINE tables live in a Preview-only migration. A deployment that predates it must
// keep its exact previous behaviour and must not attempt an RPC that cannot succeed — the same
// rollout-ordering problem the mutation fence hit, where requiring a Preview-only RPC turned the
// Production-lineage CI databases red.
//
// Readiness is a deployment FACT stated by the deployment, never inferred from a runtime error. A
// missing function, a schema-cache miss, a timeout or a 5xx are not evidence of an old schema, so
// none of them may silently demote the canonical store back to the array this replaces.
//
// No `server-only`: the rule is pure, and the permanent tests exercise this module rather than a
// paraphrase of it.

export type LineActivityMode = "legacy_array" | "canonical";

/**
 * `legacy_array` — the deployment predates `202607310001`. The shared recent-subject array is still
 *   the index, with all of its lost-update hazard; that is what ships today and changing it here
 *   would change behaviour on a deployment whose schema cannot support the change.
 * `canonical`    — the tables exist. They are authoritative for BOTH the read and the write, and
 *   the shared array stops being written at all. Not "written too": a second writer to a
 *   read-modify-write document is the defect, so a compatibility mirror of THAT object would
 *   reintroduce exactly what this replaces.
 *
 * Note what is deliberately NOT gated here. Per-event objects (`phase1/line-events/<id>.json`) are
 * already row-addressable — one key per event, no shared document, no lost update — so they keep
 * being written in both modes. That is what makes an application rollback safe: a rolled-back
 * deployment still finds every event where it expects it, and only loses the derived index, which
 * it rebuilds as it goes.
 */
export function resolveLineActivityMode(input: { schemaReady: boolean }): LineActivityMode {
  return input.schemaReady ? "canonical" : "legacy_array";
}

/**
 * Readiness is its own environment variable, not a fifth capability.
 *
 * The four `YORISOU_POR1_*` capabilities are product switches an operator flips to stop a
 * misbehaving feature. This is infrastructure: whether a schema exists. Conflating them would mean
 * kill-switching a LINE feature also silently re-enabled writes to the defective shared array.
 */
export function isCanonicalLineActivitySchemaReady(): boolean {
  const raw = process.env.YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY;
  if (typeof raw !== "string") return false;
  return raw.trim().toLowerCase() === "on";
}
