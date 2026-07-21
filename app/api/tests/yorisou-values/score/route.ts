import { NextResponse } from "next/server";
// YV-1.1 (YV-C3) — ANONYMOUS, NON-PERSISTENT scored result.
//
// Same server-side route gate as the persisted endpoints, but:
//   • NO authentication is required (a signed-out visitor may complete the
//     reflection and see their result without an account).
//   • NO database read or write occurs — nothing is stored, nothing is looked up.
//   • The 48 answers are NEVER logged (only bounded, answer-free error codes are
//     emitted). The scoring is done in-process and the response is discarded by
//     the server after it is returned.
//   • The canonical public/private result copy is returned; internal numeric win
//     rates are never exposed (assembleYorisouValuesResult excludes them).
//
// To PERSIST a result, a signed-in user calls POST /assessments instead. This
// endpoint deliberately has no confirmation field (confirmation is a property of
// a stored record, and there is no record here).

import { yorisouValuesAccess } from "@/lib/yorisou/methods/yorisou-values/access";
import { assembleYorisouValuesResult } from "@/lib/yorisou/methods/yorisou-values/scoring";
import { hintsForResult } from "@/lib/yorisou/methods/yorisou-values/hints";
import { YORISOU_VALUES_BANK_HASH } from "@/lib/yorisou/methods/yorisou-values/definition.generated";
import { readBoundedJson, firstUnknownKey, CANONICAL_VALUES_PROVENANCE } from "@/lib/server/yorisouValuesApi";

// YV-C4: strict contract — provenance + answers only (NO confirmation).
const SCORE_ALLOWED_KEYS = ["answers", "methodVersion", "bankVersion", "scoringVersion", "resultSchemaVersion", "bankContentHash"] as const;

type ScoreBody = {
  answers?: unknown;
  methodVersion?: unknown;
  bankVersion?: unknown;
  scoringVersion?: unknown;
  resultSchemaVersion?: unknown;
  bankContentHash?: unknown;
};

function normalizeAnswers(raw: unknown): Record<string, "A" | "B"> | null {
  if (typeof raw !== "object" || raw === null) return null;
  const out: Record<string, "A" | "B"> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v !== "A" && v !== "B") return null;
    out[k] = v;
  }
  return out;
}

export async function POST(request: Request) {
  const access = yorisouValuesAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const read = await readBoundedJson(request);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });
  const body = read.body as ScoreBody | null;
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const unknownKey = firstUnknownKey(body as Record<string, unknown>, SCORE_ALLOWED_KEYS);
  if (unknownKey) return NextResponse.json({ error: "unexpected_field", field: unknownKey }, { status: 400 });

  // Provenance must match current canonical (fail closed) — same contract as create.
  if (
    body.methodVersion !== CANONICAL_VALUES_PROVENANCE.methodVersion ||
    body.bankVersion !== CANONICAL_VALUES_PROVENANCE.bankVersion ||
    body.scoringVersion !== CANONICAL_VALUES_PROVENANCE.scoringVersion ||
    body.resultSchemaVersion !== CANONICAL_VALUES_PROVENANCE.resultSchemaVersion ||
    body.bankContentHash !== CANONICAL_VALUES_PROVENANCE.bankContentHash
  ) {
    return NextResponse.json({ error: "values_contract_version_mismatch" }, { status: 422 });
  }

  const answers = normalizeAnswers(body.answers);
  if (!answers) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const assembled = assembleYorisouValuesResult(answers, YORISOU_VALUES_BANK_HASH);
  if (!assembled.ok) return NextResponse.json({ error: "validation_failed", codes: assembled.codes }, { status: 422 });
  if (assembled.result.execution === "insufficient_coverage") {
    return NextResponse.json(
      { error: "insufficient_coverage", remaining: assembled.result.remaining, answeredCount: assembled.result.answeredCount, insufficientCopyJa: assembled.result.insufficientCopyJa },
      { status: 422 },
    );
  }

  const r = assembled.result;
  const consent = new URL(request.url).searchParams.get("hints") === "1";
  // No persistence: no assessmentId, no version, no confirmation. `saved: false`
  // makes the non-persistent nature explicit to the client.
  return NextResponse.json({
    saved: false,
    resultId: r.resultId,
    isMixed: r.isMixed,
    public: r.public,
    private: r.private,
    secondarySignal: r.secondarySignal,
    closeSet: r.closeSet,
    hints: hintsForResult(r.resultId, consent),
  });
}
