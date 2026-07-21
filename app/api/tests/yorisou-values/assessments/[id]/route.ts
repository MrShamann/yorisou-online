import { NextResponse } from "next/server";
// YV-1 — per-assessment operations (owner-scoped; server-side gated).
// GET:    the owned assessment's canonical public + private result (recomputed
//         server-side from stored answers; internal win rates never returned).
// PATCH:  YV-1.1 (YV-C1) — EITHER an answer correction (recomputed → new
//         version) OR a confirmation change (no version increment, no
//         recompute). The two are distinct operations and never combined.
// DELETE: governed private-content erasure.
//
// YV-1.1 (YV-C2): before any read/interpretation or mutation, the stored
// record's provenance (method/bank/scoring/result-schema/hash) must still match
// the current canonical definition. A stale record is NEVER reinterpreted under
// new content — it fails closed with a bounded contract-mismatch code and stays
// deletable.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { resolveYorisouValuesRouteAccess } from "@/lib/cpv1/pilotRouteAccess";
import { assembleYorisouValuesResult } from "@/lib/yorisou/methods/yorisou-values/scoring";
import { hintsForResult } from "@/lib/yorisou/methods/yorisou-values/hints";
import {
  mapValuesStoreError,
  readBoundedJson,
  firstUnknownKey,
  recordProvenanceMatchesCanonical,
  CANONICAL_VALUES_PROVENANCE,
} from "@/lib/server/yorisouValuesApi";
import { correctValuesAssessment, setValuesConfirmation, deleteValuesAssessment, getValuesAssessmentForOwner } from "@/lib/server/yorisouValuesStore";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// YV-1.1 (YV-C4): strict PATCH contract — exactly these top-level keys, and a
// request must carry exactly one operation (answers XOR confirmation).
const PATCH_ALLOWED_KEYS = ["answers", "confirmation"] as const;
const CONTRACT_MISMATCH = "values_record_contract_version_mismatch";

// Shared: recompute the canonical result payload for a stored record. Internal
// numerics are excluded by assembleYorisouValuesResult.
function renderResult(record: { answers: Record<string, "A" | "B">; bank_content_hash: string; confirmation: string; current_version: number }, consentForHints: boolean) {
  const assembled = assembleYorisouValuesResult(record.answers, record.bank_content_hash);
  if (!assembled.ok || assembled.result.execution !== "scored") return null;
  const r = assembled.result;
  return {
    resultId: r.resultId,
    isMixed: r.isMixed,
    public: r.public,
    private: r.private,
    secondarySignal: r.secondarySignal,
    closeSet: r.closeSet,
    confirmation: record.confirmation,
    currentVersion: record.current_version,
    hints: hintsForResult(r.resultId, consentForHints),
  };
}

// PPR-1 — resolve the route gate (Preview OR production private-pilot) AND the
// owner in one step. Denied → 404 (route-concealing); authenticated non-owner-less
// → 401. Returns the owner account id when the gate + auth both pass.
type GatedOwner = { denied: 404 | 401 } | { ownerAccountId: string };
async function gatedOwner(): Promise<GatedOwner> {
  const gate = await resolveYorisouValuesRouteAccess();
  if (!gate.allowed) return { denied: 404 };
  const viewer = gate.viewer ?? (await getViewerContext());
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return { denied: 401 };
  return { ownerAccountId };
}

export async function GET(request: Request, context: Context) {
  const gated = await gatedOwner();
  if ("denied" in gated) return NextResponse.json({ error: gated.denied === 404 ? "not_found" : "authentication_required" }, { status: gated.denied });
  const ownerAccountId = gated.ownerAccountId;
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  try {
    const record = await getValuesAssessmentForOwner(ownerAccountId, id);
    if (!record) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    // YV-C2: refuse to reinterpret a stale record under the current definition.
    if (!recordProvenanceMatchesCanonical(record)) {
      return NextResponse.json({ error: CONTRACT_MISMATCH, storedVersion: record.method_version, currentVersion: CANONICAL_VALUES_PROVENANCE.methodVersion, deletable: true }, { status: 409 });
    }
    const consent = new URL(request.url).searchParams.get("hints") === "1";
    const rendered = renderResult(record, consent);
    if (!rendered) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    return NextResponse.json(rendered);
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_read_failed");
    if (mapped.status === 500) console.error("yorisou-values result read failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function PATCH(request: Request, context: Context) {
  const gated = await gatedOwner();
  if ("denied" in gated) return NextResponse.json({ error: gated.denied === 404 ? "not_found" : "authentication_required" }, { status: gated.denied });
  const ownerAccountId = gated.ownerAccountId;
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const read = await readBoundedJson(request);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });
  const body = read.body as { answers?: unknown; confirmation?: unknown } | null;
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  // YV-C4: strict fields + non-empty + single-operation (answers XOR confirmation).
  const unknownKey = firstUnknownKey(body as Record<string, unknown>, PATCH_ALLOWED_KEYS);
  if (unknownKey) return NextResponse.json({ error: "unexpected_field", field: unknownKey }, { status: 400 });
  const hasAnswers = body.answers !== undefined;
  const hasConfirmation = body.confirmation !== undefined;
  if (!hasAnswers && !hasConfirmation) return NextResponse.json({ error: "empty_update" }, { status: 400 });
  // YV-C1: an answer correction and a confirmation change are distinct events.
  if (hasAnswers && hasConfirmation) return NextResponse.json({ error: "ambiguous_update" }, { status: 400 });

  try {
    const existing = await getValuesAssessmentForOwner(ownerAccountId, id);
    if (!existing) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    // YV-C2: a stale record is neither reinterpreted nor mutated (still deletable).
    if (!recordProvenanceMatchesCanonical(existing)) {
      return NextResponse.json({ error: CONTRACT_MISMATCH, storedVersion: existing.method_version, currentVersion: CANONICAL_VALUES_PROVENANCE.methodVersion, deletable: true }, { status: 409 });
    }

    // Confirmation-only path — YV-C1: no version increment, no recompute, no
    // corrected event. Emits a distinct confirmation_changed event in the RPC.
    if (hasConfirmation) {
      const c = body.confirmation;
      if (c !== "confirmed" && c !== "not_quite" && c !== "skipped") return NextResponse.json({ error: "invalid_confirmation" }, { status: 400 });
      const value = await setValuesConfirmation({ ownerAccountId, assessmentId: id, confirmation: c, expected: CANONICAL_VALUES_PROVENANCE });
      return NextResponse.json({ assessmentId: id, confirmation: value, currentVersion: existing.current_version });
    }

    // Answer-correction path — recomputed deterministically; the RPC rejects a
    // byte-equivalent (no-op) answer change with values_no_answer_change.
    if (typeof body.answers !== "object" || body.answers === null) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    const normalized: Record<string, "A" | "B"> = {};
    for (const [k, v] of Object.entries(body.answers as Record<string, unknown>)) {
      if (v !== "A" && v !== "B") return NextResponse.json({ error: "invalid_request" }, { status: 400 });
      normalized[k] = v;
    }
    const assembled = assembleYorisouValuesResult(normalized, existing.bank_content_hash);
    if (!assembled.ok) return NextResponse.json({ error: "validation_failed", codes: assembled.codes }, { status: 422 });
    if (assembled.result.execution === "insufficient_coverage") {
      return NextResponse.json({ error: "insufficient_coverage", remaining: assembled.result.remaining }, { status: 422 });
    }
    const version = await correctValuesAssessment({
      ownerAccountId,
      assessmentId: id,
      answers: normalized,
      resultId: assembled.result.resultId,
      isMixed: assembled.result.isMixed,
      expected: CANONICAL_VALUES_PROVENANCE,
    });
    return NextResponse.json({ assessmentId: id, currentVersion: version, resultId: assembled.result.resultId, confirmation: existing.confirmation });
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_correction_failed");
    if (mapped.status === 500) console.error("yorisou-values correction failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const gated = await gatedOwner();
  if ("denied" in gated) return NextResponse.json({ error: gated.denied === 404 ? "not_found" : "authentication_required" }, { status: gated.denied });
  const ownerAccountId = gated.ownerAccountId;
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  try {
    // Deletion never reinterprets content — a stale record is still erasable, so
    // NO provenance gate here (YV-C2: stale records remain deletable).
    const deleted = await deleteValuesAssessment(ownerAccountId, id);
    if (!deleted) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    return NextResponse.json({ deleted: true, erased: true, assessmentId: id });
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_delete_failed");
    if (mapped.status === 500) console.error("yorisou-values delete failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
