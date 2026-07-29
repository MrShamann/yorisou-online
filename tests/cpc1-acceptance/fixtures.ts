import { createHash, randomBytes, randomUUID } from "node:crypto";

import { expect, type Page } from "@playwright/test";

import questionBank from "../../data/yorisou/120q-question-bank.generated.json";

// CPC-1 acceptance — governed Preview-only fixture utilities.
//
// Every mutation goes through the REAL application boundary (the same routes the product calls),
// so a fixture cannot manufacture a state the product could not reach. The only direct database
// access is (a) read-only tombstone verification and (b) minting an already-expired attempt for
// the expired-credential denial — both env-gated, both impossible through the app by design.
//
// Secrets discipline: passwords are generated per run and held in memory only; the service-role
// key is read from the environment inside a request header and is never logged, asserted on, or
// interpolated into an error message. Nothing in this module may be committed with a credential.

/** Cleanup marker recognised by scripts/ux2/preview-cleanup.sql (`entry_source in (...)`). */
export const FIXTURE_ENTRY_SOURCE = "ux2-acceptance";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The canonical row id a URL carries, or null. Shared by the journey and matrix suites. */
export function canonicalRowId(url: string): string | null {
  const value = new URL(url).searchParams.get("result");
  return value && UUID_RE.test(value) ? value : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Synthetic Preview identities
// ─────────────────────────────────────────────────────────────────────────────

export type SyntheticUser = {
  name: string;
  email: string;
  password: string;
  city: string;
};

/**
 * A unique synthetic Preview user. Registration in this product is immediate (cookie-session
 * auth over an object store — there is NO email-confirmation step to satisfy), so the browser
 * flow needs no external mail delivery. The password is generated per run: it satisfies the
 * policy (≥12 chars, upper/lower/digit/symbol) and never appears in the repository or in logs.
 */
export function syntheticUser(label: string): SyntheticUser {
  const runId = `${Date.now().toString(36)}${randomBytes(3).toString("hex")}`;
  return {
    name: `CPC1検証 ${label}`,
    email: `cpc1-${label}-${runId}@synthetic-preview.invalid`,
    password: `Cpc1!Aa9-${randomUUID()}`,
    city: "検証",
  };
}

/**
 * Register through the real endpoint, sharing the page's cookie jar so the browser context is
 * authenticated afterwards. JSON mode returns the account id instead of a document redirect.
 */
export async function registerSyntheticUser(page: Page, user: SyntheticUser): Promise<string> {
  const response = await page.request.post("/api/auth/register", {
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      city: user.city,
      role: "self",
    },
  });
  expect(response.status(), "synthetic registration must succeed").toBe(200);
  const body = (await response.json()) as { success?: boolean; account?: { id?: string } };
  expect(body.success, "registration response must confirm success").toBe(true);
  expect(body.account?.id, "registration must return the account id").toBeTruthy();
  return body.account!.id!;
}

export async function loginSyntheticUser(page: Page, user: SyntheticUser): Promise<void> {
  const response = await page.request.post("/api/auth/login", {
    data: { email: user.email, password: user.password },
  });
  expect(response.status(), "synthetic login must succeed").toBe(200);
}

/**
 * Sign out through the application boundary. There is no sign-out CONTROL anywhere in the UI
 * (a recorded CPC-1 product gap) — the route is the only real boundary available to cross.
 */
export async function signOut(page: Page): Promise<void> {
  const response = await page.request.post("/api/auth/logout");
  expect(response.ok(), "logout must succeed").toBe(true);
}

// ─────────────────────────────────────────────────────────────────────────────
// Attempts and results, through the real routes
// ─────────────────────────────────────────────────────────────────────────────

type BankQuestion = { questionId: string; options: Array<{ id: string }> };

/** A complete governed answer map — every question answered with its first option. */
export function fullGovernedAnswerMap(): Record<string, string> {
  return Object.fromEntries(
    (questionBank as BankQuestion[]).map((q) => [q.questionId, q.options[0].id]),
  );
}

export const REQUIRED_ANSWER_COUNT = (questionBank as BankQuestion[]).length;

/** Start an attempt; the httpOnly attempt cookie lands in the page's context. */
export async function startAttemptViaApi(page: Page): Promise<string> {
  const response = await page.request.post("/api/assessment/attempts", {
    data: { entrySource: FIXTURE_ENTRY_SOURCE },
  });
  expect(response.status(), "attempt start must return 201").toBe(201);
  const body = (await response.json()) as { attemptId: string };
  expect(body.attemptId).toMatch(UUID_RE);
  return body.attemptId;
}

/**
 * A completed, persisted, anonymous result — produced by the same start/complete routes the
 * product uses, with server-side governed scoring. Returns the canonical identifiers.
 */
export async function completeAttemptViaApi(
  page: Page,
): Promise<{ attemptId: string; resultRowId: string; resultId: string }> {
  const attemptId = await startAttemptViaApi(page);
  const response = await page.request.post(`/api/assessment/attempts/${attemptId}/complete`, {
    data: { answers: fullGovernedAnswerMap() },
  });
  expect(response.status(), "completion must return 201").toBe(201);
  const body = (await response.json()) as { resultRowId: string; resultId: string };
  expect(body.resultRowId).toMatch(UUID_RE);
  return { attemptId, resultRowId: body.resultRowId, resultId: body.resultId };
}

export async function claimResult(page: Page, resultRowId: string) {
  return page.request.post(`/api/assessment/results/${resultRowId}/claim`);
}

export type InterpretationPayload = {
  responseType: "confirmed" | "corrected" | "rejected" | "deferred";
  correctedResultId?: string;
  reasonCode?: string;
  intentNonce?: string;
};

export async function respondToInterpretation(
  page: Page,
  resultRowId: string,
  payload: InterpretationPayload,
) {
  return page.request.post(`/api/assessment/results/${resultRowId}/response`, { data: payload });
}

export type RecommendationSurface = "result" | "recommendations" | "graph" | "private_state" | "line";

export async function materializeRecommendationSet(
  page: Page,
  resultRowId: string,
  source: RecommendationSurface,
) {
  return page.request.post("/api/recommendations", { data: { resultRowId, source } });
}

export type RecommendationAction =
  | "saved"
  | "try_intent"
  | "tried"
  | "helpful"
  | "not_helpful"
  | "not_relevant"
  | "hidden"
  | "resource_opened";

export async function recordRecommendationAction(
  page: Page,
  itemId: string,
  payload: {
    action: RecommendationAction;
    resultRowId: string;
    source: RecommendationSurface;
    idempotencyKey?: string;
  },
) {
  return page.request.post(`/api/recommendations/${itemId}`, { data: payload });
}

/** Erasure through the application — the governed DELETE, never raw DML. */
export async function eraseResultThroughApp(page: Page, resultRowId: string) {
  return page.request.delete(`/api/assessment/results/${resultRowId}`);
}

export async function abandonAttemptViaApi(page: Page, attemptId: string) {
  return page.request.post(`/api/assessment/attempts/${attemptId}/abandon`, {
    data: { reason: "restart" },
  });
}

/**
 * Best-effort cleanup through governed boundaries only: results are erased with the same DELETE
 * the person would use, attempts abandoned through the real route. Failures are collected, not
 * thrown — cleanup must never mask the assertion that actually failed the test.
 */
export async function cleanupThroughApp(
  page: Page,
  handles: { resultRowIds?: string[]; attemptIds?: string[] },
): Promise<string[]> {
  const failures: string[] = [];
  for (const rowId of handles.resultRowIds ?? []) {
    const response = await eraseResultThroughApp(page, rowId).catch(() => null);
    if (!response || (!response.ok() && response.status() !== 404)) {
      failures.push(`erase ${rowId}: ${response ? response.status() : "network"}`);
    }
  }
  for (const attemptId of handles.attemptIds ?? []) {
    const response = await abandonAttemptViaApi(page, attemptId).catch(() => null);
    if (!response || (!response.ok() && response.status() !== 404)) {
      failures.push(`abandon ${attemptId}: ${response ? response.status() : "network"}`);
    }
  }
  return failures;
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview database access — env-gated, read-only except for minting expired credentials
// ─────────────────────────────────────────────────────────────────────────────

function previewDb(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** True when the run was given direct Preview-database access for verification steps. */
export function previewDbConfigured(): boolean {
  return previewDb() !== null;
}

async function dbRequest(path: string, init?: RequestInit): Promise<Response> {
  const config = previewDb();
  if (!config) throw new Error("preview_db_not_configured");
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export type ResultRowSnapshot = {
  id: string;
  attempt_id: string;
  owner_account_id: string | null;
  result_id: string | null;
  original_result_id: string | null;
  overlay_id: string | null;
  dimension_output: Record<string, unknown>;
  deleted_at: string | null;
};

/** Read-only snapshot of a result row, for tombstone verification against the frozen contract. */
export async function readResultRowFromPreviewDb(rowId: string): Promise<ResultRowSnapshot | null> {
  const response = await dbRequest(
    `yorisou_assessment_results?id=eq.${rowId}` +
      `&select=id,attempt_id,owner_account_id,result_id,original_result_id,overlay_id,dimension_output,deleted_at`,
  );
  if (!response.ok) throw new Error(`preview_db_read_failed_${response.status}`);
  const rows = (await response.json()) as ResultRowSnapshot[];
  return rows[0] ?? null;
}

export type AttemptRowSnapshot = {
  id: string;
  status: string;
  answers: Record<string, unknown>;
  owner_account_id: string | null;
  claim_token_hash: string | null;
};

export async function readAttemptRowFromPreviewDb(attemptId: string): Promise<AttemptRowSnapshot | null> {
  const response = await dbRequest(
    `yorisou_assessment_attempts?id=eq.${attemptId}` +
      `&select=id,status,answers,owner_account_id,claim_token_hash`,
  );
  if (!response.ok) throw new Error(`preview_db_read_failed_${response.status}`);
  const rows = (await response.json()) as AttemptRowSnapshot[];
  return rows[0] ?? null;
}

/**
 * Mint an attempt whose credential is ALREADY expired (ttl 0) — unreachable through the app,
 * which always issues 72h. Returns the id and the serialized cookie value so the test can present
 * a syntactically valid, genuinely expired credential. The raw token never leaves this process.
 */
export async function createExpiredAttemptInPreviewDb(): Promise<{
  attemptId: string;
  cookieValue: string;
}> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const response = await dbRequest("rpc/yorisou_attempt_start", {
    method: "POST",
    body: JSON.stringify({
      p_method_id: "imairo-120q",
      p_method_version: "compat-v0.2",
      p_required_count: REQUIRED_ANSWER_COUNT,
      p_claim_token_hash: tokenHash,
      p_entry_source: FIXTURE_ENTRY_SOURCE,
      p_ttl_hours: 0,
    }),
  });
  if (!response.ok) throw new Error(`expired_attempt_mint_failed_${response.status}`);
  const attemptId = ((await response.json()) as string).replace(/"/g, "");
  const cookieValue = Buffer.from(JSON.stringify({ attemptId, token }), "utf8").toString("base64url");
  return { attemptId, cookieValue };
}
