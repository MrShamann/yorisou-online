import "server-only";
// YV-1 — server-only yorisou-values persistence repository (service-role
// PostgREST, mirroring lib/server/dailyCheckInStore.ts). Owner scoping is
// enforced HERE and in the API layer; anonymous callers never reach this module.
// All mutation goes through the atomic SECURITY DEFINER RPCs.

const RECORDS = "yorisou_values_assessments";

export type ValuesAssessmentRecord = {
  id: string;
  owner_account_id: string;
  method_id: string;
  method_version: string;
  bank_version: string;
  scoring_version: string;
  result_schema_version: string;
  bank_content_hash: string;
  answers: Record<string, "A" | "B">;
  result_id: string;
  is_mixed: boolean;
  confirmation: "confirmed" | "not_quite" | "skipped";
  current_version: number;
  produced_at: string;
  created_at: string;
  updated_at: string;
};

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("values_persistence_not_configured");
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
    const known = /values_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `values_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

const RECORD_COLUMNS =
  "id,owner_account_id,method_id,method_version,bank_version,scoring_version,result_schema_version,bank_content_hash,answers,result_id,is_mixed,confirmation,current_version,produced_at,created_at,updated_at";

export async function createValuesAssessment(input: {
  ownerAccountId: string;
  methodVersion: string;
  bankVersion: string;
  scoringVersion: string;
  resultSchemaVersion: string;
  answers: Record<string, "A" | "B">;
  resultId: string;
  isMixed: boolean;
  confirmation: "confirmed" | "not_quite" | "skipped";
  bankContentHash: string;
  producedAt: string;
}): Promise<string> {
  return rpc<string>("yorisou_values_assessment_create", {
    p_owner_account_id: input.ownerAccountId,
    p_method_version: input.methodVersion,
    p_bank_version: input.bankVersion,
    p_scoring_version: input.scoringVersion,
    p_result_schema_version: input.resultSchemaVersion,
    p_answers: input.answers,
    p_result_id: input.resultId,
    p_is_mixed: input.isMixed,
    p_confirmation: input.confirmation,
    p_bank_content_hash: input.bankContentHash,
    p_produced_at: input.producedAt,
  });
}

export type ExpectedProvenance = {
  methodVersion: string;
  bankVersion: string;
  scoringVersion: string;
  resultSchemaVersion: string;
  bankContentHash: string;
};

// YV-1.1 (YV-C1/YV-C2): ANSWER correction only — provenance re-verified in the
// locked transaction; byte-equivalent answers rejected by the RPC. Confirmation
// is NOT written here.
export async function correctValuesAssessment(input: {
  ownerAccountId: string;
  assessmentId: string;
  answers: Record<string, "A" | "B">;
  resultId: string;
  isMixed: boolean;
  expected: ExpectedProvenance;
}): Promise<number> {
  return rpc<number>("yorisou_values_assessment_correct", {
    p_owner_account_id: input.ownerAccountId,
    p_assessment_id: input.assessmentId,
    p_answers: input.answers,
    p_result_id: input.resultId,
    p_is_mixed: input.isMixed,
    p_expected_method_version: input.expected.methodVersion,
    p_expected_bank_version: input.expected.bankVersion,
    p_expected_scoring_version: input.expected.scoringVersion,
    p_expected_result_schema_version: input.expected.resultSchemaVersion,
    p_expected_bank_content_hash: input.expected.bankContentHash,
  });
}

// YV-1.1 (YV-C1): confirmation-only mutation — no version increment, no version
// row, no corrected event; one confirmation_changed event. Provenance re-verified.
export async function setValuesConfirmation(input: {
  ownerAccountId: string;
  assessmentId: string;
  confirmation: "confirmed" | "not_quite" | "skipped";
  expected: ExpectedProvenance;
}): Promise<string> {
  return rpc<string>("yorisou_values_assessment_set_confirmation", {
    p_owner_account_id: input.ownerAccountId,
    p_assessment_id: input.assessmentId,
    p_confirmation: input.confirmation,
    p_expected_method_version: input.expected.methodVersion,
    p_expected_bank_version: input.expected.bankVersion,
    p_expected_scoring_version: input.expected.scoringVersion,
    p_expected_result_schema_version: input.expected.resultSchemaVersion,
    p_expected_bank_content_hash: input.expected.bankContentHash,
  });
}

export async function deleteValuesAssessment(ownerAccountId: string, assessmentId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_values_assessment_delete", {
    p_owner_account_id: ownerAccountId,
    p_assessment_id: assessmentId,
  });
}

export async function listValuesAssessmentsForOwner(ownerAccountId: string, limit = 50): Promise<ValuesAssessmentRecord[]> {
  const params = new URLSearchParams({
    select: RECORD_COLUMNS,
    owner_account_id: `eq.${ownerAccountId}`,
    order: "produced_at.desc",
    limit: String(limit),
  });
  const response = await request(`${RECORDS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`values_persistence_failed:${response.status}`);
  return (await response.json()) as ValuesAssessmentRecord[];
}

export async function getValuesAssessmentForOwner(ownerAccountId: string, assessmentId: string): Promise<ValuesAssessmentRecord | null> {
  const params = new URLSearchParams({
    select: RECORD_COLUMNS,
    owner_account_id: `eq.${ownerAccountId}`,
    id: `eq.${assessmentId}`,
    limit: "1",
  });
  const response = await request(`${RECORDS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`values_persistence_failed:${response.status}`);
  return ((await response.json()) as ValuesAssessmentRecord[])[0] || null;
}
