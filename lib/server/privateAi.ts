import "server-only";

import { createHash, randomUUID } from "crypto";
import { getSavedTestResultForOwner, type SavedTestResult } from "@/lib/server/testResults";

const PROJECT_ID = "yorisou";
const WORKFLOW = "test_result_reflection";
const WORKFLOW_VERSION = "v1";
const PROMPT_VERSION = "private-reflection-ja-v1";

type Json = Record<string, unknown>;
export type Reflection = {
  id: string; saved_result_id: string; content: ReflectionContent; provider: string; model: string; created_at: string;
};
export type ReflectionContent = {
  headline: string; current_state_summary: string;
  visible_patterns: Array<{ title: string; description: string; basis: string }>;
  possible_tensions: Array<{ title: string; description: string }>;
  reflection_questions: string[];
  small_next_steps: Array<{ title: string; description: string; effort: "low" | "medium"; category: "reflection" | "action" | "environment" | "communication" | "rest" }>;
  limitations: string;
};
export type PrivateState = { reflections: Reflection[]; memories: Array<{ id: string; memory_type: string; source_type: string; content: string; created_at: string }>; recommendations: Array<{ id: string; title: string; description: string; reason: string; category: string; status: string }>; checkIns: Array<{ id: string; suggested_for: string | null; return_path: string; status: string }> };

function config() { const url = process.env.SUPABASE_URL?.trim(); const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(); if (!url || !key) throw new Error("private_ai_store_not_configured"); return { url: url.replace(/\/$/, ""), key }; }
async function request(path: string, init: RequestInit = {}) { const { url, key } = config(); const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) }, cache: "no-store" }); if (!response.ok) throw new Error(`private_ai_store_failed:${response.status}`); return response; }
function hash(value: unknown) { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function assertText(value: unknown, max: number) { return typeof value === "string" && value.trim().length > 0 && value.length <= max ? value.trim() : null; }
function asList(value: unknown, limit: number) { return Array.isArray(value) && value.length <= limit ? value : null; }

function validateReflection(value: unknown): ReflectionContent {
  if (!value || typeof value !== "object") throw new Error("provider_schema_invalid");
  const data = value as Json;
  const headline = assertText(data.headline, 160); const current = assertText(data.current_state_summary, 900); const limitations = assertText(data.limitations, 600);
  const patterns = asList(data.visible_patterns, 3); const tensions = asList(data.possible_tensions, 3); const questions = asList(data.reflection_questions, 3); const steps = asList(data.small_next_steps, 5);
  if (!headline || !current || !limitations || !patterns || !tensions || !questions || !steps) throw new Error("provider_schema_invalid");
  const visible_patterns = patterns.map((item) => { const x = item as Json; const title = assertText(x.title, 120); const description = assertText(x.description, 500); const basis = assertText(x.basis, 400); if (!title || !description || !basis) throw new Error("provider_schema_invalid"); return { title, description, basis }; });
  const possible_tensions = tensions.map((item) => { const x = item as Json; const title = assertText(x.title, 120); const description = assertText(x.description, 500); if (!title || !description) throw new Error("provider_schema_invalid"); return { title, description }; });
  const reflection_questions = questions.map((item) => { const text = assertText(item, 300); if (!text) throw new Error("provider_schema_invalid"); return text; });
  const small_next_steps = steps.map((item) => { const x = item as Json; const title = assertText(x.title, 120); const description = assertText(x.description, 500); const effort = x.effort; const category = x.category; if (!title || !description || (effort !== "low" && effort !== "medium") || !["reflection","action","environment","communication","rest"].includes(String(category))) throw new Error("provider_schema_invalid"); return { title, description, effort: effort as "low" | "medium", category: category as ReflectionContent["small_next_steps"][number]["category"] }; });
  return { headline, current_state_summary: current, visible_patterns, possible_tensions, reflection_questions, small_next_steps, limitations };
}

function minimizedResult(saved: SavedTestResult) { return { test_id: saved.test_id, test_version: saved.test_version, result_id: saved.result_id, result_title: saved.result_title, result_summary: saved.public_summary, top_dimensions: saved.score_summary.topDimensions.map((item) => ({ label: item.label, score: item.score })) }; }
function reflectionPrompt(saved: SavedTestResult) { return `あなたはYORISOUの非臨床的な私的振り返りを作成します。診断、恒久的な人格断定、運命、科学的確実性、指示、過度な共感表現は禁止です。決定論的な結果を変更しません。回答は日本語のJSONのみです。\n\n入力（最小化済み）:\n${JSON.stringify(minimizedResult(saved))}\n\n次のJSONスキーマに厳密に従ってください: {"headline":"string","current_state_summary":"string","visible_patterns":[{"title":"string","description":"string","basis":"結果のどの要素を見たか"}],"possible_tensions":[{"title":"string","description":"string"}],"reflection_questions":["string"],"small_next_steps":[{"title":"string","description":"string","effort":"low|medium","category":"reflection|action|environment|communication|rest"}],"limitations":"すべてを当てはめる必要はありません。参考として扱ってください。"}。visible_patterns は1-3件、possible_tensions は0-3件、reflection_questions は1-3件、small_next_steps は3-5件。`; }

async function callProvider(prompt: string, enabled: { mistral_enabled: boolean; openrouter_enabled: boolean }) {
  const attempts: Array<{ provider: string; model: string; call: () => Promise<Response> }> = [];
  if (enabled.mistral_enabled && process.env.MISTRAL_API_KEY?.trim()) attempts.push({ provider: "mistral", model: process.env.MISTRAL_MODEL || "mistral-small-latest", call: () => fetch("https://api.mistral.ai/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(20000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` }, body: JSON.stringify({ model: process.env.MISTRAL_MODEL || "mistral-small-latest", temperature: 0.25, max_tokens: 1100, response_format: { type: "json_object" }, messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }] }) }) });
  if (enabled.openrouter_enabled && process.env.OPENROUTER_API_KEY?.trim()) attempts.push({ provider: "openrouter", model: process.env.YORISOU_PRIVATE_AI_OPENROUTER_MODEL || "mistralai/mistral-small-3.1", call: () => fetch(`${process.env.OPENROUTER_BASE_URL?.replace(/\/$/, "") || "https://openrouter.ai/api/v1"}/chat/completions`, { method: "POST", signal: AbortSignal.timeout(20000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }, body: JSON.stringify({ model: process.env.YORISOU_PRIVATE_AI_OPENROUTER_MODEL || "mistralai/mistral-small-3.1", temperature: 0.25, max_tokens: 1100, response_format: { type: "json_object" }, messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }] }) }) });
  let lastError = "provider_unavailable";
  for (const attempt of attempts) { try { const started = Date.now(); const response = await attempt.call(); if (!response.ok) { const body = await response.json().catch(() => null) as { error?: { code?: unknown } } | null; const code = typeof body?.error?.code === "string" && /^[a-z0-9_-]{1,48}$/i.test(body.error.code) ? `_${body.error.code}` : ""; lastError = `provider_http_${response.status}${code}`; continue; } const data = await response.json() as { choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } }; const raw = data.choices?.[0]?.message?.content; if (!raw) { lastError = "provider_empty"; continue; } return { content: validateReflection(JSON.parse(raw)), provider: attempt.provider, model: attempt.model, latency: Date.now() - started, inputTokens: data.usage?.prompt_tokens || null, outputTokens: data.usage?.completion_tokens || null }; } catch (error) { lastError = error instanceof Error && error.name === "TimeoutError" ? "provider_timeout" : "provider_error"; } }
  throw new Error(lastError);
}

async function controls() { return ((await (await request("yorisou_ai_runtime_controls?select=global_enabled,reflection_enabled,mistral_enabled,openrouter_enabled,daily_budget_cents,reflection_budget_cents&singleton=eq.true")).json()) as Array<{ global_enabled: boolean; reflection_enabled: boolean; mistral_enabled: boolean; openrouter_enabled: boolean; daily_budget_cents: number; reflection_budget_cents: number }>)[0]; }
async function patch(path: string, body: unknown) { await request(path, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(body) }); }
async function taskForIdempotencyKey(key: string) {
  return ((await (await request(`agent_runtime_tasks?select=id,status&idempotency_key=eq.${encodeURIComponent(key)}&limit=1`)).json()) as Array<{ id: string; status: string }>)[0];
}

export async function listPrivateState(owner: string, resultId?: string): Promise<PrivateState> {
  const resultFilter = resultId ? `&saved_result_id=eq.${encodeURIComponent(resultId)}` : "";
  const [reflections, memories, recommendations, checkIns] = await Promise.all([
    request(`yorisou_ai_reflections?select=id,saved_result_id,content,provider,model,created_at&owner_account_id=eq.${encodeURIComponent(owner)}&withdrawn_at=is.null&deleted_at=is.null${resultFilter}&order=created_at.desc`).then((r) => r.json()) as Promise<Reflection[]>,
    request(`yorisou_private_memory_items?select=id,memory_type,source_type,content,created_at&owner_account_id=eq.${encodeURIComponent(owner)}&deleted_at=is.null${resultFilter}&order=created_at.desc&limit=30`).then((r) => r.json()) as Promise<PrivateState["memories"]>,
    request(`yorisou_private_recommendations?select=id,title,description,reason,category,status&owner_account_id=eq.${encodeURIComponent(owner)}${resultFilter}&order=created_at.asc&limit=20`).then((r) => r.json()) as Promise<PrivateState["recommendations"]>,
    request(`yorisou_private_check_in_plans?select=id,suggested_for,return_path,status&owner_account_id=eq.${encodeURIComponent(owner)}${resultFilter}&status=eq.active&order=created_at.desc&limit=5`).then((r) => r.json()) as Promise<PrivateState["checkIns"]>,
  ]);
  return { reflections, memories, recommendations, checkIns };
}

export async function generateReflection(owner: string, resultId: string) {
  const saved = await getSavedTestResultForOwner(resultId, owner); if (!saved) throw new Error("saved_result_not_found");
  if (!["C02", "F01", "F02"].includes(saved.test_id)) throw new Error("unsupported_result");
  const control = await controls(); if (!control?.global_enabled || !control.reflection_enabled || control.reflection_budget_cents < 1) throw new Error("workflow_disabled");
  const inputHash = hash(minimizedResult(saved));
  const existing = (await (await request(`yorisou_ai_runs?select=id,status&owner_account_id=eq.${encodeURIComponent(owner)}&saved_result_id=eq.${resultId}&workflow_type=eq.${WORKFLOW}&workflow_version=eq.${WORKFLOW_VERSION}&input_hash=eq.${inputHash}&limit=1`)).json()) as Array<{ id: string; status: string }>;
  if (existing[0]?.status === "completed") return { state: await listPrivateState(owner, resultId), deduplicated: true };
  const baseIdempotencyKey = `reflection:${owner}:${resultId}:${inputHash}`;
  const baseTask = await taskForIdempotencyKey(baseIdempotencyKey);
  let idempotencyKey = baseIdempotencyKey;
  if (baseTask) {
    if (["ready", "claimed", "running", "completed"].includes(baseTask.status)) return { state: await listPrivateState(owner, resultId), deduplicated: true };
    if (baseTask.status !== "failed") throw new Error("generation_retry_exhausted");
    idempotencyKey = `${baseIdempotencyKey}:retry-1`;
    const retryTask = await taskForIdempotencyKey(idempotencyKey);
    if (retryTask) {
      if (["ready", "claimed", "running", "completed"].includes(retryTask.status)) return { state: await listPrivateState(owner, resultId), deduplicated: true };
      throw new Error("generation_retry_exhausted");
    }
  }
  const task = ((await (await request("agent_runtime_tasks", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ project_id: PROJECT_ID, agent_id: "akari", workflow_type: WORKFLOW, skill_id: "hinata.private_reflection.v1", priority: 100, input_payload: { saved_result_id: resultId, input_hash: inputHash, prompt_version: PROMPT_VERSION }, data_classification: "sensitive", approval_required: false, available_at: new Date().toISOString(), maximum_attempts: 2, timeout_seconds: 30, retry_policy: { max_retries: 1, fallback_max: 1 }, idempotency_key: idempotencyKey, cost_budget_cents: control.reflection_budget_cents, correlation_id: randomUUID() }) })).json()) as Array<{ id: string }>)[0];
  if (!task) throw new Error("task_create_failed");
  const workerId = "yorisou-web-worker";
  await patch(`agent_runtime_tasks?id=eq.${task.id}`, { status: "ready" });
  const claimed = await (await request("rpc/claim_yorisou_agent_runtime_task", { method: "POST", body: JSON.stringify({ p_task_id: task.id, p_worker_id: workerId, p_lease_seconds: 60 }) })).json() as Array<{ id: string }>;
  if (!claimed.some((entry) => entry.id === task.id)) throw new Error("task_claim_failed");
  await patch(`agent_runtime_tasks?id=eq.${task.id}&claimed_by=eq.${workerId}`, { status: "running", started_at: new Date().toISOString() });
  try {
    const output = await callProvider(reflectionPrompt(saved), control);
    const run = ((await (await request("yorisou_ai_runs", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ project_id: PROJECT_ID, owner_account_id: owner, saved_result_id: resultId, task_id: task.id, workflow_type: WORKFLOW, workflow_version: WORKFLOW_VERSION, input_hash: inputHash, provider: output.provider, model: output.model, status: "completed", prompt_version: PROMPT_VERSION, data_minimized: true, input_tokens: output.inputTokens, output_tokens: output.outputTokens, estimated_cost_cents: Math.min(control.reflection_budget_cents, 1), latency_ms: output.latency, completed_at: new Date().toISOString() }) })).json()) as Array<{ id: string }>)[0];
    if (!run) throw new Error("run_create_failed");
    await request("yorisou_ai_reflections", { method: "POST", body: JSON.stringify({ project_id: PROJECT_ID, owner_account_id: owner, saved_result_id: resultId, run_id: run.id, workflow_version: WORKFLOW_VERSION, provider: output.provider, model: output.model, content: output.content }) });
    await Promise.all(output.content.small_next_steps.map((step) => request("yorisou_private_recommendations", { method: "POST", body: JSON.stringify({ project_id: PROJECT_ID, owner_account_id: owner, saved_result_id: resultId, title: step.title, description: step.description, reason: "AIの振り返りで示された、今の結果に関連する小さな選択肢です。", category: step.category }) })));
    await patch(`agent_runtime_tasks?id=eq.${task.id}&claimed_by=eq.${workerId}`, { status: "completed", completed_at: new Date().toISOString(), output_summary: "private reflection stored" });
    return { state: await listPrivateState(owner, resultId), deduplicated: false };
  } catch (error) {
    await patch(`agent_runtime_tasks?id=eq.${task.id}&claimed_by=eq.${workerId}`, { status: "failed", failed_at: new Date().toISOString(), error_class: error instanceof Error ? error.message.slice(0, 80) : "provider_error", error_summary: "Private reflection generation did not complete." });
    throw error;
  }
}

export async function addMemory(owner: string, input: { resultId?: string; reflectionId?: string; content: string; memoryType: "user_note" | "selected_reflection" | "user_correction" }) { const content = assertText(input.content, 2000); if (!content) throw new Error("invalid_memory"); const row = { project_id: PROJECT_ID, owner_account_id: owner, saved_result_id: input.resultId || null, reflection_id: input.reflectionId || null, memory_type: input.memoryType, source_type: input.memoryType === "selected_reflection" ? "ai_summary" : "user_statement", content, permitted_uses: ["private_state"], visibility: "owner_only" }; await request("yorisou_private_memory_items", { method: "POST", body: JSON.stringify(row) }); }
export async function updateRecommendation(owner: string, id: string, status: string) { if (!["saved","try","tried","helpful","not_relevant","hidden"].includes(status)) throw new Error("invalid_recommendation_status"); await patch(`yorisou_private_recommendations?id=eq.${id}&owner_account_id=eq.${encodeURIComponent(owner)}`, { status, updated_at: new Date().toISOString() }); }
export async function createCheckIn(owner: string, input: { resultId?: string; when: "tomorrow" | "three_days" | "week" | "none" }) { const days = input.when === "tomorrow" ? 1 : input.when === "three_days" ? 3 : input.when === "week" ? 7 : null; if (!days) return; const suggested = new Date(Date.now() + days * 86400000).toISOString(); await request("yorisou_private_check_in_plans", { method: "POST", body: JSON.stringify({ project_id: PROJECT_ID, owner_account_id: owner, saved_result_id: input.resultId || null, suggested_for: suggested, return_path: input.resultId ? `/saved/tests/${input.resultId}` : "/private-state" }) }); }
export async function withdrawReflection(owner: string, id: string) { await patch(`yorisou_ai_reflections?id=eq.${id}&owner_account_id=eq.${encodeURIComponent(owner)}`, { withdrawn_at: new Date().toISOString() }); }
export async function revokePrivateArtifactsForSavedResult(owner: string, resultId: string) {
  const now = new Date().toISOString();
  await Promise.all([
    patch(`yorisou_ai_reflections?owner_account_id=eq.${encodeURIComponent(owner)}&saved_result_id=eq.${resultId}`, { withdrawn_at: now, deleted_at: now }),
    patch(`yorisou_private_memory_items?owner_account_id=eq.${encodeURIComponent(owner)}&saved_result_id=eq.${resultId}`, { deleted_at: now }),
    patch(`yorisou_private_check_in_plans?owner_account_id=eq.${encodeURIComponent(owner)}&saved_result_id=eq.${resultId}`, { status: "cancelled" }),
  ]);
}
