import { NextResponse } from "next/server";
// YV-1 — yorisou-values assessments API (owner-scoped; server-side gated).
// GET: own assessment history (public-safe fields; NO internal win rates).
// POST: score the 48 answers server-side and persist a NEW assessment record
//       (a retake is another POST). Provenance (method/bank/scoring/schema/hash)
//       is validated and stored; the result is recomputed on the server — the
//       client cannot inject a result.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { yorisouValuesAccess } from "@/lib/yorisou/methods/yorisou-values/access";
import { assembleYorisouValuesResult } from "@/lib/yorisou/methods/yorisou-values/scoring";
import { YORISOU_VALUES_DEFINITION, YORISOU_VALUES_BANK_HASH } from "@/lib/yorisou/methods/yorisou-values/definition.generated";
import { mapValuesStoreError, readBoundedJson, firstUnknownKey } from "@/lib/server/yorisouValuesApi";
import { createValuesAssessment, listValuesAssessmentsForOwner } from "@/lib/server/yorisouValuesStore";

const DEF = YORISOU_VALUES_DEFINITION;

// YV-1.1 (YV-C4): strict create contract — exactly these top-level keys.
const CREATE_ALLOWED_KEYS = ["answers", "confirmation", "methodVersion", "bankVersion", "scoringVersion", "resultSchemaVersion", "bankContentHash"] as const;

function normalizeAnswers(raw: unknown): Record<string, "A" | "B"> | null {
  if (typeof raw !== "object" || raw === null) return null;
  const out: Record<string, "A" | "B"> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v !== "A" && v !== "B") return null;
    out[k] = v;
  }
  return out;
}

export async function GET() {
  const access = yorisouValuesAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    const records = await listValuesAssessmentsForOwner(ownerAccountId);
    // Public-safe history: id, produced_at, result identity + display name,
    // confirmation, version. NO answers, NO internal numeric scores.
    const resultName = new Map<string, string>(DEF.results.map((r) => [r.resultId, r.public.displayNameJa]));
    return NextResponse.json({
      assessments: records.map((r) => ({
        id: r.id,
        producedAt: r.produced_at,
        resultId: r.result_id,
        displayNameJa: resultName.get(r.result_id) ?? null,
        isMixed: r.is_mixed,
        confirmation: r.confirmation,
        currentVersion: r.current_version,
      })),
    });
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_read_failed");
    if (mapped.status === 500) console.error("yorisou-values history read failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

type CreateBody = {
  answers?: unknown;
  confirmation?: unknown;
  // provenance (required to match current canonical versions):
  methodVersion?: unknown;
  bankVersion?: unknown;
  scoringVersion?: unknown;
  resultSchemaVersion?: unknown;
  bankContentHash?: unknown;
};

export async function POST(request: Request) {
  const access = yorisouValuesAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const read = await readBoundedJson(request);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });
  const body = read.body as CreateBody | null;
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const unknownKey = firstUnknownKey(body as Record<string, unknown>, CREATE_ALLOWED_KEYS);
  if (unknownKey) return NextResponse.json({ error: "unexpected_field", field: unknownKey }, { status: 400 });

  // Provenance must match the current canonical versions + hash (fail closed).
  if (
    body.methodVersion !== DEF.methodVersion ||
    body.bankVersion !== DEF.bankVersion ||
    body.scoringVersion !== DEF.scoringVersion ||
    body.resultSchemaVersion !== DEF.resultSchemaVersion ||
    body.bankContentHash !== YORISOU_VALUES_BANK_HASH
  ) {
    return NextResponse.json({ error: "values_contract_version_mismatch" }, { status: 422 });
  }
  const answers = normalizeAnswers(body.answers);
  if (!answers) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const confirmation = body.confirmation === "confirmed" || body.confirmation === "not_quite" ? body.confirmation : "skipped";

  // Server-side scoring — the client never supplies the result.
  const assembled = assembleYorisouValuesResult(answers, YORISOU_VALUES_BANK_HASH);
  if (!assembled.ok) return NextResponse.json({ error: "validation_failed", codes: assembled.codes }, { status: 422 });
  if (assembled.result.execution === "insufficient_coverage") {
    return NextResponse.json(
      { error: "insufficient_coverage", remaining: assembled.result.remaining, answeredCount: assembled.result.answeredCount, insufficientCopyJa: assembled.result.insufficientCopyJa },
      { status: 422 },
    );
  }

  try {
    const recordId = await createValuesAssessment({
      ownerAccountId,
      methodVersion: DEF.methodVersion,
      bankVersion: DEF.bankVersion,
      scoringVersion: DEF.scoringVersion,
      resultSchemaVersion: DEF.resultSchemaVersion,
      answers,
      resultId: assembled.result.resultId,
      isMixed: assembled.result.isMixed,
      confirmation,
      bankContentHash: YORISOU_VALUES_BANK_HASH,
      producedAt: new Date().toISOString(),
    });
    return NextResponse.json({ assessmentId: recordId, resultId: assembled.result.resultId, currentVersion: 1 }, { status: 201 });
  } catch (error) {
    const mapped = mapValuesStoreError(error, "values_save_failed");
    if (mapped.status === 500) console.error("yorisou-values create failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
