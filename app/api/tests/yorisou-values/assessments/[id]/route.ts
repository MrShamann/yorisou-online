import { NextResponse } from "next/server";
// YV-1 — per-assessment operations (owner-scoped; server-side gated).
// GET:    the owned assessment's canonical public + private result (recomputed
//         server-side from stored answers; internal win rates never returned).
// PATCH:  answer correction (recomputed → new version) and/or confirmation.
// DELETE: governed private-content erasure.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { yorisouValuesAccess } from "@/lib/yorisou/methods/yorisou-values/access";
import { assembleYorisouValuesResult } from "@/lib/yorisou/methods/yorisou-values/scoring";
import { hintsForResult } from "@/lib/yorisou/methods/yorisou-values/hints";
import { mapValuesStoreError, readBoundedJson } from "@/lib/server/yorisouValuesApi";
import { correctValuesAssessment, deleteValuesAssessment, getValuesAssessmentForOwner } from "@/lib/server/yorisouValuesStore";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

export async function GET(request: Request, context: Context) {
  const access = yorisouValuesAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  try {
    const record = await getValuesAssessmentForOwner(ownerAccountId, id);
    if (!record) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
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
  const access = yorisouValuesAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const read = await readBoundedJson(request);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });
  const body = read.body as { answers?: unknown; confirmation?: unknown } | null;
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  try {
    const existing = await getValuesAssessmentForOwner(ownerAccountId, id);
    if (!existing) return NextResponse.json({ error: "record_not_found" }, { status: 404 });

    // Answer correction (if provided) recomputes deterministically; otherwise the
    // stored answers stand and only confirmation changes. Confirmation never
    // silently rewrites the method-derived result.
    let answers = existing.answers;
    if (body.answers !== undefined) {
      const normalized: Record<string, "A" | "B"> = {};
      if (typeof body.answers !== "object" || body.answers === null) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
      for (const [k, v] of Object.entries(body.answers as Record<string, unknown>)) {
        if (v !== "A" && v !== "B") return NextResponse.json({ error: "invalid_request" }, { status: 400 });
        normalized[k] = v;
      }
      answers = normalized;
    }
    const confirmation = body.confirmation === "confirmed" || body.confirmation === "not_quite" ? body.confirmation : body.confirmation === "skipped" ? "skipped" : existing.confirmation;

    const assembled = assembleYorisouValuesResult(answers, existing.bank_content_hash);
    if (!assembled.ok) return NextResponse.json({ error: "validation_failed", codes: assembled.codes }, { status: 422 });
    if (assembled.result.execution === "insufficient_coverage") {
      return NextResponse.json({ error: "insufficient_coverage", remaining: assembled.result.remaining }, { status: 422 });
    }
    const version = await correctValuesAssessment({
      ownerAccountId,
      assessmentId: id,
      answers,
      resultId: assembled.result.resultId,
      isMixed: assembled.result.isMixed,
      confirmation,
    });
    return NextResponse.json({ assessmentId: id, currentVersion: version, resultId: assembled.result.resultId, confirmation });
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_correction_failed");
    if (mapped.status === 500) console.error("yorisou-values correction failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const access = yorisouValuesAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  try {
    const deleted = await deleteValuesAssessment(ownerAccountId, id);
    if (!deleted) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    return NextResponse.json({ deleted: true, erased: true, assessmentId: id });
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_delete_failed");
    if (mapped.status === 500) console.error("yorisou-values delete failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
