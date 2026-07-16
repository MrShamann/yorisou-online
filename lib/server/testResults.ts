import "server-only";
import type { TestAnswerMap } from "@/lib/yorisou-tests/engine";
import type { RuleBasedResolvedResult } from "@/lib/yorisou-tests/types";

import type { ImairoResultSnapshot } from "@/lib/yorisou/public-result/snapshot";

const TABLE = "yorisou_test_results";
export type SavedTestResult = { id: string; owner_account_id: string; test_id: string; test_version: string; scoring_version: string; result_id: string; result_title: string; public_summary: string; score_summary: { score: number; topDimensions: RuleBasedResolvedResult["topDimensions"] }; snapshot_context: Record<string, unknown> | null; created_at: string; updated_at: string; deleted_at: string | null };

function config() { const url = process.env.SUPABASE_URL?.trim(); const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(); if (!url || !key) throw new Error("test_persistence_not_configured"); return { url: url.replace(/\/$/, ""), key }; }
async function request(path: string, init: RequestInit) { const { url, key } = config(); const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) }, cache: "no-store" }); if (!response.ok) throw new Error(`test_persistence_failed:${response.status}`); return response; }

export async function createSavedTestResult(input: { ownerAccountId: string; definition: { testId: string; version: string; scoringVersion: string }; answers: TestAnswerMap; result: RuleBasedResolvedResult }) {
  const response = await request(TABLE, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ owner_account_id: input.ownerAccountId, test_id: input.definition.testId, test_version: input.definition.version, scoring_version: input.definition.scoringVersion, result_id: input.result.resultId, result_title: input.result.title, public_summary: input.result.summary, score_summary: { score: input.result.score, topDimensions: input.result.topDimensions }, answers: input.answers }) });
  const record = ((await response.json()) as SavedTestResult[])[0]; if (!record) throw new Error("test_persistence_empty_response"); return record;
}
export async function getSavedTestResultForOwner(id: string, ownerAccountId: string) { const params = new URLSearchParams({ select: "id,owner_account_id,test_id,test_version,scoring_version,result_id,result_title,public_summary,score_summary,snapshot_context,created_at,updated_at,deleted_at", id: `eq.${id}`, owner_account_id: `eq.${ownerAccountId}`, deleted_at: "is.null", limit: "1" }); return ((await (await request(`${TABLE}?${params}`, { method: "GET" })).json()) as SavedTestResult[])[0] || null; }

// RTR-1: idempotent private snapshot of the public IMAIRO-120Q result.
// One active snapshot per owner + result code: re-saving the same result
// returns the existing row instead of inserting a duplicate.
export async function createSavedImairoSnapshotForOwner(ownerAccountId: string, snapshot: ImairoResultSnapshot) {
  const existingParams = new URLSearchParams({ select: "id,test_id,test_version,result_title,public_summary,created_at", owner_account_id: `eq.${ownerAccountId}`, test_id: `eq.${snapshot.definition.testId}`, result_id: `eq.${snapshot.resultId}`, deleted_at: "is.null", order: "created_at.desc", limit: "1" });
  const existing = ((await (await request(`${TABLE}?${existingParams}`, { method: "GET" })).json()) as SavedTestResult[])[0];
  if (existing) return { record: existing, reused: true as const };
  const response = await request(TABLE, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ owner_account_id: ownerAccountId, test_id: snapshot.definition.testId, test_version: snapshot.definition.version, scoring_version: snapshot.definition.scoringVersion, result_id: snapshot.resultId, result_title: snapshot.resultTitle, public_summary: snapshot.publicSummary, score_summary: { topDimensions: snapshot.topDimensions }, answers: {}, snapshot_context: snapshot.snapshotContext }) });
  const record = ((await response.json()) as SavedTestResult[])[0]; if (!record) throw new Error("test_persistence_empty_response"); return { record, reused: false as const };
}
export async function listSavedTestResultsForOwner(ownerAccountId: string) { const params = new URLSearchParams({ select: "id,test_id,test_version,result_title,public_summary,created_at", owner_account_id: `eq.${ownerAccountId}`, deleted_at: "is.null", order: "created_at.desc" }); return (await (await request(`${TABLE}?${params}`, { method: "GET" })).json()) as Pick<SavedTestResult, "id" | "test_id" | "test_version" | "result_title" | "public_summary" | "created_at">[]; }
export async function deleteSavedTestResultForOwner(id: string, ownerAccountId: string) { const params = new URLSearchParams({ id: `eq.${id}`, owner_account_id: `eq.${ownerAccountId}`, deleted_at: "is.null" }); const response = await request(`${TABLE}?${params}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ deleted_at: new Date().toISOString() }) }); return ((await response.json()) as SavedTestResult[])[0] || null; }
export async function createAccountDeletionRequest(ownerAccountId: string, requesterNote?: string) { const response = await request("yorisou_account_deletion_requests?on_conflict=owner_account_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ owner_account_id: ownerAccountId, requester_note: requesterNote?.slice(0, 500) || null }) }); return ((await response.json()) as { id: string; status: string }[])[0] || null; }
