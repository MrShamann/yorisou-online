import "server-only";
// UX-2 / ICP-1 — server-only repository for the public-assessment persistence spine
// (attempt → persisted result → interpretation response).
//
// Mirrors the accepted lib/server/yorisouValuesStore.ts pattern: service-role PostgREST,
// all mutation through the bounded SECURITY DEFINER RPCs added by the Preview-only migration
// 202607270001. Owner scoping is enforced HERE and again inside every RPC.
//
// The claim secret is NEVER stored in cleartext: the caller holds the token, the database holds
// only sha256(token). This is what lets an anonymous user receive a real result before being
// asked to register, and then safely claim it after authenticating.

import { createHash, randomBytes } from "crypto";
import {
  type PersistedResultEnvelopeV1,
  readPersistedResultEnvelope,
} from "@/lib/server/persistedDimensionSummary";

const ATTEMPTS = "yorisou_assessment_attempts";
const RESULTS = "yorisou_assessment_results";
const RESPONSES = "yorisou_interpretation_responses";

export type AttemptStatus = "in_progress" | "completed" | "abandoned";
export type ResponseType = "confirmed" | "corrected" | "rejected" | "deferred";

export type AssessmentAttempt = {
  id: string;
  method_id: string;
  method_version: string;
  owner_account_id: string | null;
  status: AttemptStatus;
  answers: Record<string, string>;
  answered_count: number;
  required_count: number;
  started_at: string;
  updated_at: string;
  completed_at: string | null;
  claimed_at: string | null;
  expires_at: string | null;
};

export type AssessmentResult = {
  id: string;
  attempt_id: string;
  owner_account_id: string | null;
  method_id: string;
  method_version: string;
  scoring_version: string;
  result_schema_version: string;
  result_id: string;
  overlay_id: string | null;
  dimension_output: Record<string, unknown>;
  original_result_id: string;
  visibility: "private" | "link_shared";
  produced_at: string;
  deleted_at: string | null;
};

export type InterpretationResponse = {
  id: string;
  result_row_id: string;
  owner_account_id: string;
  response_type: ResponseType;
  corrected_result_id: string | null;
  reason_code: string | null;
  supersedes_response_id: string | null;
  recommendation_use_permitted: boolean;
  continuity_use_permitted: boolean;
  source: string;
  created_at: string;
};

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("assessment_persistence_not_configured");
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
    // Surface only bounded, allowlisted codes; never raw Postgres text.
    const known =
      /attempt_[a-z_]+|claim_[a-z_]+|result_[a-z_]+|assessment_[a-z_]+/.exec(text)?.[0] ||
      `assessment_persistence_failed:${response.status}`;
    throw new Error(known);
  }
  return (await response.json()) as T;
}

// ── claim token ──────────────────────────────────────────────────────────────
export function createClaimToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashClaimToken(token) };
}

export function hashClaimToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ── attempt lifecycle ────────────────────────────────────────────────────────
export async function startAttempt(input: {
  methodId: string;
  methodVersion: string;
  requiredCount: number;
  claimTokenHash: string;
  entrySource?: string | null;
  ttlHours?: number;
}): Promise<string> {
  return rpc<string>("yorisou_attempt_start", {
    p_method_id: input.methodId,
    p_method_version: input.methodVersion,
    p_required_count: input.requiredCount,
    p_claim_token_hash: input.claimTokenHash,
    p_entry_source: input.entrySource ?? null,
    p_ttl_hours: input.ttlHours ?? 72,
  });
}

export async function saveAttemptProgress(input: {
  attemptId: string;
  claimTokenHash: string | null;
  ownerAccountId: string | null;
  answers: Record<string, string>;
  answeredCount: number;
}): Promise<number> {
  return rpc<number>("yorisou_attempt_save_progress", {
    p_attempt_id: input.attemptId,
    p_claim_token_hash: input.claimTokenHash,
    p_owner_account_id: input.ownerAccountId,
    p_answers: input.answers,
    p_answered_count: input.answeredCount,
  });
}

// Completing is atomic AND idempotent — a second call returns the same result row id.
export async function completeAttempt(input: {
  attemptId: string;
  claimTokenHash: string | null;
  ownerAccountId: string | null;
  answers: Record<string, string>;
  answeredCount: number;
  resultId: string;
  overlayId: string | null;
  // Only the canonical envelope may be persisted — never an arbitrary object.
  dimensionOutput: PersistedResultEnvelopeV1;
  scoringVersion: string;
  resultSchemaVersion: string;
}): Promise<string> {
  // Defence in depth: validate at the write boundary as well as in the database guard.
  if (!readPersistedResultEnvelope(input.dimensionOutput)) {
    throw new Error("assessment_persisted_envelope_invalid");
  }
  return rpc<string>("yorisou_attempt_complete", {
    p_attempt_id: input.attemptId,
    p_claim_token_hash: input.claimTokenHash,
    p_owner_account_id: input.ownerAccountId,
    p_answers: input.answers,
    p_answered_count: input.answeredCount,
    p_result_id: input.resultId,
    p_overlay_id: input.overlayId,
    p_dimension_output: input.dimensionOutput,
    p_scoring_version: input.scoringVersion,
    p_result_schema_version: input.resultSchemaVersion,
  });
}

export async function claimAttempt(input: {
  attemptId: string;
  claimTokenHash: string;
  ownerAccountId: string;
}): Promise<string> {
  return rpc<string>("yorisou_attempt_claim", {
    p_attempt_id: input.attemptId,
    p_claim_token_hash: input.claimTokenHash,
    p_owner_account_id: input.ownerAccountId,
  });
}

// ── reads (owner- or token-scoped; never unscoped) ───────────────────────────
// Anonymous token access requires a live, unexpired, non-abandoned attempt. Expiry is enforced
// by the SERVER on reads too — never left to browser cookie expiry.
export async function getAttemptForToken(attemptId: string, claimTokenHash: string): Promise<AssessmentAttempt | null> {
  const params = new URLSearchParams({
    id: `eq.${attemptId}`,
    claim_token_hash: `eq.${claimTokenHash}`,
    status: "in.(in_progress,completed)",   // never resume an abandoned attempt
    expires_at: `gt.${new Date().toISOString()}`,
    limit: "1",
  });
  const r = await request(`${ATTEMPTS}?${params}`, { method: "GET" });
  if (!r.ok) throw new Error(`assessment_persistence_failed:${r.status}`);
  return ((await r.json()) as AssessmentAttempt[])[0] || null;
}

export async function getAttemptForOwner(attemptId: string, ownerAccountId: string): Promise<AssessmentAttempt | null> {
  const params = new URLSearchParams({
    id: `eq.${attemptId}`,
    owner_account_id: `eq.${ownerAccountId}`,
    status: "in.(in_progress,completed)",
    limit: "1",
  });
  const r = await request(`${ATTEMPTS}?${params}`, { method: "GET" });
  if (!r.ok) throw new Error(`assessment_persistence_failed:${r.status}`);
  return ((await r.json()) as AssessmentAttempt[])[0] || null;
}

export async function getResultById(resultRowId: string): Promise<AssessmentResult | null> {
  const params = new URLSearchParams({ id: `eq.${resultRowId}`, deleted_at: "is.null", limit: "1" });
  const r = await request(`${RESULTS}?${params}`, { method: "GET" });
  if (!r.ok) throw new Error(`assessment_persistence_failed:${r.status}`);
  return ((await r.json()) as AssessmentResult[])[0] || null;
}

// Erased rows are excluded from every owner-scoped listing (deleted_at is.null below).
export async function listResultsForOwner(ownerAccountId: string, limit = 50): Promise<AssessmentResult[]> {
  const params = new URLSearchParams({
    owner_account_id: `eq.${ownerAccountId}`,
    deleted_at: "is.null",
    order: "produced_at.desc",
    limit: String(limit),
  });
  const r = await request(`${RESULTS}?${params}`, { method: "GET" });
  if (!r.ok) throw new Error(`assessment_persistence_failed:${r.status}`);
  return (await r.json()) as AssessmentResult[];
}

// ── interpretation responses ─────────────────────────────────────────────────
export async function recordInterpretationResponse(input: {
  resultRowId: string;
  ownerAccountId: string;
  responseType: ResponseType;
  correctedResultId?: string | null;
  reasonCode?: string | null;
  source?: "web" | "line" | "import";
  /**
   * Client-supplied idempotency nonce (§1.2). When present, the RPC returns the ORIGINAL response
   * for a replay instead of appending a second one, and rejects a replay whose payload differs.
   * Absent for a directly-authenticated response, where there is no login round trip to survive.
   */
  intentNonce?: string | null;
}): Promise<string> {
  return rpc<string>("yorisou_interpretation_respond", {
    p_result_row_id: input.resultRowId,
    p_owner_account_id: input.ownerAccountId,
    p_response_type: input.responseType,
    p_corrected_result_id: input.correctedResultId ?? null,
    p_reason_code: input.reasonCode ?? null,
    p_source: input.source ?? "web",
    p_intent_nonce: input.intentNonce ?? null,
  });
}

export async function listResponsesForResult(resultRowId: string, ownerAccountId: string): Promise<InterpretationResponse[]> {
  const params = new URLSearchParams({
    result_row_id: `eq.${resultRowId}`,
    owner_account_id: `eq.${ownerAccountId}`,
    order: "created_at.desc",
  });
  const r = await request(`${RESPONSES}?${params}`, { method: "GET" });
  if (!r.ok) throw new Error(`assessment_persistence_failed:${r.status}`);
  return (await r.json()) as InterpretationResponse[];
}

export async function listResponsesForOwner(ownerAccountId: string, limit = 100): Promise<InterpretationResponse[]> {
  const params = new URLSearchParams({
    owner_account_id: `eq.${ownerAccountId}`,
    order: "created_at.desc",
    limit: String(limit),
  });
  const r = await request(`${RESPONSES}?${params}`, { method: "GET" });
  if (!r.ok) throw new Error(`assessment_persistence_failed:${r.status}`);
  return (await r.json()) as InterpretationResponse[];
}

// TRUE erasure (not a soft hide): removes the raw answers, the interpretation responses and the
// result content, leaving only a content-free tombstone. The API wording matches this behaviour.
// Governed abandon — the real rule behind "start over". Closes the previous attempt, erases its
// answers and invalidates its claim token so it can never be resumed, completed or claimed.
export async function abandonAttempt(input: {
  attemptId: string;
  claimTokenHash: string | null;
  ownerAccountId: string | null;
  reason: "user_restarted" | "expired" | "erased";
}): Promise<boolean> {
  return rpc<boolean>("yorisou_attempt_abandon", {
    p_attempt_id: input.attemptId,
    p_claim_token_hash: input.claimTokenHash,
    p_owner_account_id: input.ownerAccountId,
    p_reason: input.reason,
  });
}

export async function eraseAssessmentResult(resultRowId: string, ownerAccountId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_assessment_result_erase", {
    p_result_row_id: resultRowId,
    p_owner_account_id: ownerAccountId,
  });
}

// The derivation itself lives in ./currentUnderstanding — it is pure and deliberately free of
// `server-only` so the node test suite can exercise the REAL rule rather than a restatement of it.
export { deriveCurrentUnderstanding } from "./currentUnderstanding";
