import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";

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
 * Sign out through the application boundary. The UI control lives on /private-state
 * (SignOutControl) and is exercised by the principal lifecycle; the API-level matrix crosses the
 * route directly.
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
  // The route derives the credential and the bounded reason server-side; it reads no body.
  return page.request.post(`/api/assessment/attempts/${attemptId}/abandon`);
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

export type RecommendationActionRow = {
  item_id: string;
  action: string;
  sequence_no: number;
};

/** Read-only action rows for one item, ordered by the monotonic sequence. */
export async function readRecommendationActionsFromPreviewDb(
  itemId: string,
): Promise<RecommendationActionRow[]> {
  const response = await dbRequest(
    `yorisou_canonical_recommendation_actions?item_id=eq.${itemId}` +
      `&select=item_id,action,sequence_no&order=sequence_no.asc`,
  );
  if (!response.ok) throw new Error(`preview_db_read_failed_${response.status}`);
  return (await response.json()) as RecommendationActionRow[];
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

// ─────────────────────────────────────────────────────────────────────────────
// POR-1 — account deletion verification helpers.
//
// Read-only, and deliberately COUNTING rather than reading content: proving an erasure does not
// require reading what was erased, and a verification helper that returns a person's answers is a
// data-extraction tool with a test-shaped name.
// ─────────────────────────────────────────────────────────────────────────────

/** How many rows in `table` still carry this owner. Zero is the proof of erasure. */
export async function countRowsForOwnerInPreviewDb(
  table: string,
  ownerColumn: string,
  ownerAccountId: string,
): Promise<number> {
  const response = await dbRequest(`${table}?${ownerColumn}=eq.${ownerAccountId}&select=${ownerColumn}`, {
    headers: { Prefer: "count=exact" },
  });
  if (!response.ok) throw new Error(`preview_db_count_failed_${response.status}`);
  const rows = (await response.json()) as unknown[];
  return rows.length;
}

export type DeletionJobSnapshot = {
  state: string;
  owner_account_id: string | null;
  owner_fingerprint: string | null;
  attempt_count: number;
};

/**
 * The durable job, looked up by the raw account id. After a completed deletion this returns null:
 * finalize() drops the raw id for a one-way fingerprint, which is exactly the behaviour a caller
 * should assert rather than work around.
 */
export async function readDeletionJobFromPreviewDb(
  ownerAccountId: string,
): Promise<DeletionJobSnapshot | null> {
  const response = await dbRequest(
    `yorisou_account_deletion_jobs?owner_account_id=eq.${ownerAccountId}` +
      `&select=state,owner_account_id,owner_fingerprint,attempt_count`,
  );
  if (!response.ok) throw new Error(`preview_db_read_failed_${response.status}`);
  const rows = (await response.json()) as DeletionJobSnapshot[];
  return rows[0] ?? null;
}

/** Audit rows are content-free by construction; this asserts only that the trail EXISTS. */
export async function countDeletionAuditRowsInPreviewDb(jobFingerprint: string): Promise<number> {
  const response = await dbRequest(
    `yorisou_account_deletion_jobs?owner_fingerprint=eq.${jobFingerprint}&select=id`,
  );
  if (!response.ok) throw new Error(`preview_db_read_failed_${response.status}`);
  const rows = (await response.json()) as unknown[];
  return rows.length;
}

// ═════════════════════════════════════════════════════════════════════════════
// POR-1 — ISOLATED PREVIEW IDENTITY-STORE ACCESS.
//
// The deletion acceptance has to prove that objects are GONE, and "gone" is a statement about the
// store, not about what a route chose to show. So this reads the isolated Preview bucket directly.
//
// Two things it is NOT. It is not a way to manufacture product state that the app could not reach —
// everything the acceptance asserts on is created through real routes, with one deliberate,
// documented exception below. And it is not reachable from the application: these helpers live in
// the test process, read their key from the environment, and never appear in a shipped bundle.
//
// Keys are derived exactly as the runtime derives them. A verification that computed its own key
// scheme would prove that the test's scheme is empty, which is not the question.
// ═════════════════════════════════════════════════════════════════════════════

const STORE_PREFIX = "phase1";

function previewStore(): { base: string; bucket: string; key: string } | null {
  const base = (process.env.YORISOU_SHARED_STORE_ENDPOINT || "").replace(/\/$/, "");
  const bucket = process.env.YORISOU_SHARED_STORE_BUCKET || "";
  const key = process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY || "";
  if (!base || !bucket || !key) return null;
  return { base, bucket, key };
}

export function previewStoreConfigured(): boolean {
  return previewStore() !== null;
}

function storeHeaders(extra: Record<string, string> = {}) {
  const config = previewStore();
  if (!config) throw new Error("preview_store_not_configured");
  return { apikey: config.key, Authorization: `Bearer ${config.key}`, ...extra };
}

export async function readStoreObject<T>(key: string): Promise<T | null> {
  const config = previewStore();
  if (!config) throw new Error("preview_store_not_configured");
  const res = await fetch(`${config.base}/object/${config.bucket}/${key}`, {
    method: "GET",
    headers: storeHeaders(),
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`store_read_failed:${res.status}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

export async function writeStoreObject<T>(key: string, value: T): Promise<void> {
  const config = previewStore();
  if (!config) throw new Error("preview_store_not_configured");
  const res = await fetch(`${config.base}/object/${config.bucket}/${key}`, {
    method: "POST",
    headers: storeHeaders({ "Content-Type": "application/json", "x-upsert": "true" }),
    body: JSON.stringify(value, null, 2) + "\n",
  });
  if (!res.ok) throw new Error(`store_write_failed:${res.status}`);
}

export async function storeObjectExists(key: string): Promise<boolean> {
  return (await readStoreObject(key)) !== null;
}

/**
 * Read an object until a condition holds, or give up.
 *
 * The isolated Preview transport is NOT read-after-write consistent: a GET issued a minute after a
 * successful overwrite was measured still returning the previous version. An immediate read-back is
 * therefore an assertion about the CDN, not about the product — and a suite that fails on it reports
 * a deletion defect that is really a cache.
 *
 * Used only where the test itself just wrote, or where the product just wrote and the test is
 * confirming. A residue check that a real failure would survive is unaffected: a genuinely present
 * object survives every attempt.
 */
export async function readStoreObjectUntil<T>(
  key: string,
  predicate: (value: T | null) => boolean,
  // Sized from the MEASURED lag on this transport, and the measurement is the point: an overwrite of
  // the shared LINE-subject index became visible after 4.5s, 5.4s and 11s on three separate probes.
  // It is not a fixed delay, it is a distribution, so the window has to clear the tail rather than
  // the median. A window shorter than the thing it waits for is a flaky test wearing a retry loop.
  //
  // Safe in both directions. Waiting for PRESENCE just delays a precondition. Waiting for ABSENCE
  // cannot pass vacuously: a stale read still showing the deleted entry keeps retrying and then
  // fails, which is exactly what a real residue would do.
  attempts = 60,
): Promise<T | null> {
  let value: T | null = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    value = await readStoreObject<T>(key);
    if (predicate(value)) return value;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return value;
}

export async function listStoreKeys(prefix: string): Promise<string[]> {
  const config = previewStore();
  if (!config) throw new Error("preview_store_not_configured");
  const folder = prefix.replace(/\/$/, "");
  const keys: string[] = [];
  let offset = 0;
  for (;;) {
    const res = await fetch(`${config.base}/object/list/${config.bucket}`, {
      method: "POST",
      headers: storeHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefix: `${folder}/`, limit: 1000, offset }),
    });
    if (!res.ok) throw new Error(`store_list_failed:${res.status}`);
    const entries = (await res.json()) as { name: string; id: string | null }[];
    for (const entry of entries) if (entry.id) keys.push(`${folder}/${entry.name}`);
    if (entries.length < 1000) break;
    offset += 1000;
  }
  return keys;
}

// ── Key derivations, mirroring lib/server/yorisouData.ts exactly ──────────────
export const storeKeys = {
  account: (id: string) => `${STORE_PREFIX}/accounts/by-id/${id}.json`,
  emailLookup: (email: string) =>
    `${STORE_PREFIX}/accounts/by-email/${createHash("sha256").update(email.trim().toLowerCase()).digest("hex")}.json`,
  lineLookup: (lineUserId: string) =>
    `${STORE_PREFIX}/accounts/by-line-user/${createHash("sha256").update(lineUserId).digest("hex")}.json`,
  session: (id: string) => `${STORE_PREFIX}/sessions/${id}.json`,
  passwordReset: (tokenHash: string) => `${STORE_PREFIX}/password-resets/${tokenHash}.json`,
  consultation: (id: string) => `${STORE_PREFIX}/consultations/${id}.json`,
  lineEvent: (id: string) => `${STORE_PREFIX}/line-events/${id}.json`,
  recentLineSubjects: () => `${STORE_PREFIX}/line-events/admin-recent-subjects.json`,
  // The foundation prefix is `phase1/foundation-v1`, not `phase1/foundation`. Getting this wrong
  // makes every foundation assertion vacuously pass against an empty listing — which is exactly how
  // the missing Preview transport stayed invisible.
  foundationUserProfile: (id: string) => `${STORE_PREFIX}/foundation-v1/user-profiles/${id}.json`,
  foundationAuthIdentity: (id: string) => `${STORE_PREFIX}/foundation-v1/auth-identities/${id}.json`,
  foundationUserProfiles: () => `${STORE_PREFIX}/foundation-v1/user-profiles`,
  foundationAuthIdentities: () => `${STORE_PREFIX}/foundation-v1/auth-identities`,
};

/**
 * THE ONE DELIBERATE EXCEPTION: binding a LINE identity onto a synthetic account.
 *
 * Every other piece of state in this suite is created through a real route. A LINE binding cannot
 * be, because it requires a genuine LINE OAuth authorization code from a real person's LINE
 * account — there is no product path that reaches it with synthetic credentials, and inventing one
 * would be a far worse idea than this.
 *
 * So the binding is written into the isolated Preview store using the runtime's own key derivations
 * and record shape, producing exactly the state a real LINE login would leave. It is called out
 * here rather than hidden inside a helper named something else, because a reader deserves to know
 * which part of the fixture is a real flow and which part is a stand-in.
 *
 * A LINE-BOUND account is not optional coverage: the LINE lookup key was wrong for the entire life
 * of the deletion adapter, and no test caught it precisely because no acceptance identity had ever
 * been LINE-bound.
 */
export async function bindLineIdentityInPreviewStore(
  accountId: string,
  lineUserId: string,
): Promise<void> {
  const account = await readStoreObject<Record<string, unknown>>(storeKeys.account(accountId));
  if (!account) throw new Error("account_not_found_in_preview_store");
  const now = new Date().toISOString();

  await writeStoreObject(storeKeys.account(accountId), {
    ...account,
    lineUserId,
    lineConnectedAt: now,
    lineIdTokenSubject: lineUserId,
    updatedAt: now,
    supportProfile: {
      ...((account.supportProfile as Record<string, unknown>) ?? {}),
      lineBindingStatus: "connected",
      lineDisplayName: "POR1検証LINE",
    },
  });
  await writeStoreObject(storeKeys.lineLookup(lineUserId), {
    accountId,
    lineUserId,
    updatedAt: now,
  });
}

/** A LINE user id shaped like the real thing: `U` plus 32 hex characters. */
export function syntheticLineUserId(): string {
  return `U${randomBytes(16).toString("hex")}`;
}

/**
 * Establish LINE ACTIVITY for a subject: a LINE event record and an entry in the shared
 * recent-subject index.
 *
 * Two paths, and which one ran is REPORTED rather than hidden.
 *
 * The real route is preferred and is signed exactly as LINE signs it, so the signature check — the
 * thing that makes a public webhook safe — is exercised rather than bypassed. But the isolated
 * Preview environment deliberately holds NO LINE channel secret: Preview is not a LINE tenant, and
 * giving it a real messaging credential to make a test more elegant would be a worse trade than any
 * test is worth. Without the secret the route answers 401, correctly.
 *
 * So when there is no secret, the two records are written into the isolated Preview store using the
 * runtime's own key derivations and record shapes — producing exactly the state a delivered webhook
 * would leave. The erasure inventory names LINE events and the recent-subject index explicitly, and
 * skipping them because the environment is awkward would leave the least-tested families untested.
 */
export type LineActivityOrigin = "signed_webhook" | "canonical_service_fixture" | "seeded_store";

export async function establishLineActivity(
  baseUrl: string,
  lineUserId: string,
  accountId: string,
): Promise<{ origin: LineActivityOrigin; eventId: string; status: number }> {
  const secret = process.env.LINE_MESSAGING_CHANNEL_SECRET || process.env.LINE_CHANNEL_SECRET || "";
  const eventId = `por1-${randomUUID()}`;
  const now = new Date().toISOString();

  if (secret) {
    const body = JSON.stringify({
      destination: "por1-acceptance",
      events: [
        {
          type: "message",
          mode: "active",
          timestamp: Date.now(),
          source: { type: "user", userId: lineUserId },
          webhookEventId: eventId,
          deliveryContext: { isRedelivery: false },
          message: { id: `${Date.now()}`, type: "text", text: "POR-1 受入" },
        },
      ],
    });
    const signature = createHmac("sha256", secret).update(body).digest("base64");
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const response = await fetch(`${baseUrl}/api/line/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-line-signature": signature,
        ...(bypass ? { "x-vercel-protection-bypass": bypass } : {}),
      },
      body,
    });
    if (response.ok) return { origin: "signed_webhook", eventId, status: response.status };
    // A signed request that is still refused means the deployment's secret differs from the one
    // here. Fall through to seeding rather than reporting a product failure for an env mismatch.
  }

  // POR-1 — THE CANONICAL SERVICE SEAM.
  //
  // Preview deliberately has NO LINE channel secret, so the signed route above is usually
  // unavailable and the run falls through. Seeding the object store alone is no longer an
  // acceptable substitute: since 202607310001/2 the canonical tables are the model, and a fixture
  // that writes only the legacy array would leave the whole canonical LINE family — and the subject
  // erasure barrier that this package exists to add — completely unexercised by the hosted run,
  // while still reporting green.
  //
  // So the event is recorded through the SAME governed RPC the application calls, with the
  // service-role key this test process already holds for verification. That is the seam the
  // contract permits: no public synthetic route, no generic admin endpoint, no secret-gated
  // backdoor, nothing added to the deployment at all.
  if (previewDbConfigured()) {
    const subjectHash = createHash("sha256").update(lineUserId).digest("hex");
    const response = await dbRequest("rpc/yorisou_line_event_record", {
      method: "POST",
      body: JSON.stringify({
        p_line_event_id: eventId,
        p_line_subject_hash: subjectHash,
        p_event_type: "message",
        p_line_subject_id: lineUserId,
        p_webhook_event_id: eventId,
        p_owner_account_id: accountId,
        p_owner_fingerprint: createHash("sha256").update(accountId).digest("hex"),
        p_source_type: "user",
        p_message_type: "text",
        p_message_text: "POR-1 受入",
        p_event_timestamp: now,
        p_received_at: now,
      }),
    });
    if (response.ok) {
      // The per-event object is still written, exactly as the application writes it in BOTH modes —
      // it was always row-addressable and never had the shared-array defect, and keeping it is what
      // makes an application rollback safe.
      await writeStoreObject(storeKeys.lineEvent(eventId), {
        id: eventId,
        accountId,
        lineUserId,
        sourceType: "user",
        eventType: "message",
        messageType: "text",
        messageText: "POR-1 受入",
        postbackData: null,
        replyTokenPresent: false,
        replyStatus: "not_attempted" as const,
        replyError: null,
        webhookEventId: eventId,
        deliveryMode: "active",
        isRedelivery: false,
        eventTimestamp: now,
        receivedAt: now,
      });
      return { origin: "canonical_service_fixture", eventId, status: response.status };
    }
  }

  const record = {
    id: eventId,
    accountId,
    lineUserId,
    sourceType: "user",
    eventType: "message",
    messageType: "text",
    messageText: "POR-1 受入",
    postbackData: null,
    replyTokenPresent: false,
    replyStatus: "not_attempted" as const,
    replyError: null,
    webhookEventId: eventId,
    deliveryMode: "active",
    isRedelivery: false,
    eventTimestamp: now,
    receivedAt: now,
  };
  await writeStoreObject(storeKeys.lineEvent(eventId), record);

  const existing =
    (await readStoreObject<Record<string, unknown>[]>(storeKeys.recentLineSubjects())) ?? [];
  await writeStoreObject(storeKeys.recentLineSubjects(), [
    {
      eventId,
      webhookEventId: eventId,
      lineUserId,
      accountId,
      sourceType: "user",
      eventType: "message",
      messageType: "text",
      messageText: "POR-1 受入",
      postbackData: null,
      eventTimestamp: now,
      receivedAt: now,
    },
    ...existing,
  ]);

  return { origin: "seeded_store", eventId, status: 0 };
}


/**
 * POR-1 — the subject-level LINE erasure barrier, read through the same governed RPCs the deletion
 * uses. Service-role only, from the test process; nothing is added to the deployment.
 */
export async function readLineSubjectState(lineUserId: string): Promise<{
  state: string;
  erasedAt: string | null;
}> {
  const subjectHash = createHash("sha256").update(lineUserId).digest("hex");
  const response = await dbRequest("rpc/yorisou_line_subject_state", {
    method: "POST",
    body: JSON.stringify({ p_line_subject_hash: subjectHash }),
  });
  if (!response.ok) throw new Error(`line_subject_state_failed:${response.status}`);
  const body = (await response.json()) as { state?: string; erased_at?: string | null };
  return { state: body?.state ?? "unknown", erasedAt: body?.erased_at ?? null };
}

/** Active-event rows plus the barrier itself. A subject still `active` is residue with zero rows. */
export async function readLineErasureResidue(lineUserId: string): Promise<number> {
  const subjectHash = createHash("sha256").update(lineUserId).digest("hex");
  const response = await dbRequest("rpc/yorisou_line_subject_erasure_residue", {
    method: "POST",
    body: JSON.stringify({ p_line_subject_hash: subjectHash }),
  });
  if (!response.ok) throw new Error(`line_erasure_residue_failed:${response.status}`);
  return Number(await response.json());
}

/**
 * Deliver a BRAND-NEW LINE event for a subject, through the governed RPC.
 *
 * The whole point of the barrier: after erasure this must be absorbed rather than recorded, and it
 * must create no row at all. An event-level tombstone cannot refuse an event id it has never seen,
 * which is why proving redelivery is not the same as proving this.
 */
export async function deliverFreshLineEvent(lineUserId: string): Promise<{ outcome: string }> {
  const subjectHash = createHash("sha256").update(lineUserId).digest("hex");
  const eventId = `por1-post-erasure-${randomUUID()}`;
  const response = await dbRequest("rpc/yorisou_line_event_record", {
    method: "POST",
    body: JSON.stringify({
      p_line_event_id: eventId,
      p_line_subject_hash: subjectHash,
      p_event_type: "message",
      p_line_subject_id: lineUserId,
      p_webhook_event_id: eventId,
      p_message_text: "POR-1 post-erasure",
    }),
  });
  if (!response.ok) throw new Error(`line_event_record_failed:${response.status}`);
  const body = (await response.json()) as { outcome?: string };
  return { outcome: body?.outcome ?? "unknown" };
}

/** Provisioning-saga residue for an account. Counted, never inferred from an absent read. */
export async function readProvisioningResidue(accountId: string): Promise<number> {
  const response = await dbRequest("rpc/yorisou_provisioning_residue", {
    method: "POST",
    body: JSON.stringify({
      p_account_id: accountId,
      p_owner_fingerprint: createHash("sha256").update(accountId).digest("hex"),
    }),
  });
  if (!response.ok) throw new Error(`provisioning_residue_failed:${response.status}`);
  return Number(await response.json());
}
