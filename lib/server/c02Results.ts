import "server-only";

import type { C02AnswerMap } from "@/lib/yorisou-tests/c02";
import type { RuleBasedResolvedResult } from "@/lib/yorisou-tests/types";

const TABLE = "yorisou_test_results";

export type C02SavedResult = {
  id: string;
  owner_account_id: string;
  test_id: "C02";
  test_version: "v1.0";
  scoring_version: "c02-rule-based-v1";
  result_id: string;
  result_title: string;
  public_summary: string;
  score_summary: { score: number; topDimensions: RuleBasedResolvedResult["topDimensions"] };
  created_at: string;
  updated_at: string;
};

type StoredResult = C02SavedResult & { answers?: C02AnswerMap };

function getConfiguration() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("c02_persistence_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = getConfiguration();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`c02_persistence_failed:${response.status}`);
  }
  return response;
}

function toPublicRecord(record: StoredResult): C02SavedResult {
  return {
    id: record.id,
    owner_account_id: record.owner_account_id,
    test_id: record.test_id,
    test_version: record.test_version,
    scoring_version: record.scoring_version,
    result_id: record.result_id,
    result_title: record.result_title,
    public_summary: record.public_summary,
    score_summary: record.score_summary,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

export async function createC02SavedResult(input: {
  ownerAccountId: string;
  answers: C02AnswerMap;
  result: RuleBasedResolvedResult;
}) {
  const response = await request(`${TABLE}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      owner_account_id: input.ownerAccountId,
      test_id: "C02",
      test_version: "v1.0",
      scoring_version: "c02-rule-based-v1",
      result_id: input.result.resultId,
      result_title: input.result.title,
      public_summary: input.result.summary,
      score_summary: { score: input.result.score, topDimensions: input.result.topDimensions },
      answers: input.answers,
    }),
  });
  const records = (await response.json()) as StoredResult[];
  const record = records[0];
  if (!record) throw new Error("c02_persistence_empty_response");
  return toPublicRecord(record);
}

export async function getC02SavedResultForOwner(id: string, ownerAccountId: string) {
  const params = new URLSearchParams({
    select: "id,owner_account_id,test_id,test_version,scoring_version,result_id,result_title,public_summary,score_summary,created_at,updated_at",
    id: `eq.${id}`,
    owner_account_id: `eq.${ownerAccountId}`,
    limit: "1",
  });
  const response = await request(`${TABLE}?${params.toString()}`, { method: "GET" });
  const records = (await response.json()) as C02SavedResult[];
  return records[0] || null;
}
