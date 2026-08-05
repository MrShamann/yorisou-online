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

/** One digest derivation for the fixtures, matching the runtime's object-key derivation exactly. */
function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

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

/**
 * How many rows in `table` still carry this owner. Zero is the proof of erasure.
 *
 * Returns `null` when the table does not exist in THIS database, which PostgREST reports as 404.
 * The isolated Preview database is a deliberate subset of the Production lineage, so some tables
 * named in the erasure plan are legitimately absent here.
 *
 * Deliberately `null` rather than `0`: an absent table proves nothing about erasure, and counting it
 * as zero is how a subset database manufactures a green run. The caller has to decide what the
 * absence means, and say so.
 */
export async function countRowsForOwnerInPreviewDb(
  table: string,
  ownerColumn: string,
  ownerAccountId: string,
): Promise<number | null> {
  const response = await dbRequest(`${table}?${ownerColumn}=eq.${ownerAccountId}&select=${ownerColumn}`, {
    headers: { Prefer: "count=exact" },
  });
  if (response.status === 404) return null;
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

/**
 * POR-1 — the AUTHORITATIVE existence answer, and why a fixed-URL GET is not it.
 *
 * `storeObjectExists` issues `GET /object/{bucket}/{key}`. That is a cacheable method on a fixed
 * URL, and this transport has been measured serving a superseded object for 25–30 seconds with
 * `cf-cache-status: HIT`. An absence sweep built on it is an assertion about a CDN.
 *
 * `POST /object/list/{bucket}` is not a cacheable method. It is answered by the store itself, and it
 * carries `updated_at` — which is the datum that separates the only two explanations for an object
 * that is still there after an erasure:
 *
 *   • `updated_at` BEFORE the revocation  → it was never deleted. A missed ownership scope.
 *   • `updated_at` AFTER the revocation   → it was deleted and something WROTE IT BACK. A stale
 *                                            reader that re-materialised a record it had already
 *                                            read, which is the resurrection shape this package
 *                                            has hit before.
 *
 * Measured on this deployment with the service-role credentials these fixtures use: the fixed GET
 * answers `cf-cache-status: DYNAMIC` and a delete is visible at t=0 in every round. So the fixture's
 * own read is not the cached path — but it is not the AUTHORITATIVE one either, and an acceptance
 * gate should not rest on a property that happens to hold today.
 */
export type StoreObjectEntry = {
  name: string;
  updatedAt: string | null;
  createdAt: string | null;
};

/** Every object under `prefix`, from the authoritative listing. Folders (null id) are excluded. */
export async function listStoreObjects(prefix: string): Promise<StoreObjectEntry[]> {
  const config = previewStore();
  if (!config) throw new Error("preview_store_not_configured");
  const folder = prefix.replace(/\/$/, "");
  const out: StoreObjectEntry[] = [];
  let offset = 0;
  for (;;) {
    const res = await fetch(`${config.base}/object/list/${config.bucket}`, {
      method: "POST",
      headers: storeHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefix: `${folder}/`, limit: 1000, offset }),
    });
    if (!res.ok) throw new Error(`store_list_failed:${res.status}`);
    const entries = (await res.json()) as {
      name: string;
      id: string | null;
      updated_at?: string | null;
      created_at?: string | null;
    }[];
    for (const entry of entries) {
      if (entry.id) {
        out.push({
          name: `${folder}/${entry.name}`,
          updatedAt: entry.updated_at ?? null,
          createdAt: entry.created_at ?? null,
        });
      }
    }
    if (entries.length < 1000) break;
    offset += 1000;
  }
  return out;
}

export type ObjectAbsenceEvidence = {
  /** Bounded synthetic identifier. Never the full key — session ids and email digests live in keys. */
  keyTail: string;
  /** The cacheable fixed-URL read. 200 means the CDN or the store answered with bytes. */
  fixedReadStatus: number;
  cfCacheStatus: string | null;
  age: string | null;
  etag: string | null;
  /** The authoritative answer. This is what an assertion may rest on. */
  authoritativeListed: boolean;
  listedUpdatedAt: string | null;
  listedCreatedAt: string | null;
  /** Set when the two reads disagree — the classification, produced by the run rather than assumed. */
  classification: "agree_absent" | "agree_present" | "cached_read_of_deleted_object" | "listed_but_unreadable";
};

/**
 * Both reads of one key, in lockstep, with the headers that classify a disagreement.
 *
 * Deliberately SINGLE-SHOT. No retry, no waiting: a retry loop against an absence check is how a
 * cache TTL gets waited out and reported as an erasure.
 */
export async function objectAbsenceEvidence(
  key: string,
  listing?: StoreObjectEntry[],
): Promise<ObjectAbsenceEvidence> {
  const config = previewStore();
  if (!config) throw new Error("preview_store_not_configured");

  const res = await fetch(`${config.base}/object/${config.bucket}/${key}`, {
    method: "GET",
    headers: storeHeaders(),
    cache: "no-store",
  });
  // 400 is this store's answer for a key that is not there, alongside 404.
  const readable = res.status !== 404 && res.status !== 400;
  await res.arrayBuffer().catch(() => undefined);

  const prefix = key.slice(0, key.lastIndexOf("/"));
  const entries = listing ?? (await listStoreObjects(prefix));
  const hit = entries.find((entry) => entry.name === key) ?? null;

  const classification: ObjectAbsenceEvidence["classification"] = hit
    ? readable
      ? "agree_present"
      : "listed_but_unreadable"
    : readable
      ? "cached_read_of_deleted_object"
      : "agree_absent";

  return {
    keyTail: key.slice(-14),
    fixedReadStatus: res.status,
    cfCacheStatus: res.headers.get("cf-cache-status"),
    age: res.headers.get("age"),
    etag: res.headers.get("etag"),
    authoritativeListed: Boolean(hit),
    listedUpdatedAt: hit?.updatedAt ?? null,
    listedCreatedAt: hit?.createdAt ?? null,
    classification,
  };
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
/**
 * Bind LINE to a synthetic account, through EVERY store the product writes.
 *
 * FIXTURE-INTEGRITY GATE (contract §9). This fixture writes objects directly, so it can construct
 * states the product cannot — and it did. It used to write the account record and the lookup object
 * and stop there, which meant a hosted run could assert "this account is LINE-bound" while the
 * strongly consistent identity registry knew nothing about it. A fixture that can claim a binding
 * the product would never have produced is a fixture that tests a system nobody ships.
 *
 * So the binding is not complete until all three agree, and this function READS BACK each one before
 * returning. It throws rather than warning: a precondition that reports success over partial state
 * is how the acceptance ran green for a whole session against the legacy LINE model.
 */
export async function bindLineIdentityInPreviewStore(
  accountId: string,
  lineUserId: string,
): Promise<void> {
  const account = await readStoreObject<Record<string, unknown>>(storeKeys.account(accountId));
  if (!account) throw new Error("account_not_found_in_preview_store");
  const now = new Date().toISOString();

  // The canonical link FIRST, in the same order the product's own account writer uses: a link
  // without an object makes a deletion manifest wider, an object without a link makes it narrower,
  // and narrower is the direction that leaves a live login route behind.
  if (previewDbConfigured()) {
    await syncIdentityLinksInPreviewDb(accountId, [
      ...(typeof account.email === "string" && account.email
        ? [{ kind: "email" as const, digest: sha256Hex(String(account.email).trim().toLowerCase()) }]
        : []),
      { kind: "line_subject" as const, digest: sha256Hex(lineUserId) },
    ]);
  }

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

  // READ BACK. Not "we issued three writes" — "three stores now agree".
  //
  // The lookup object is confirmed through `readStoreObjectUntil`, because this transport serves a
  // freshly written key through a cache that can lag by seconds. That wait is about OBSERVING a
  // write that has already happened; it is not a retry-until-visible standing in for the repair,
  // which is exactly why the deletion path no longer reads this store for its scope at all.
  const lookup = await readStoreObjectUntil<{ accountId?: string }>(
    storeKeys.lineLookup(lineUserId),
    (value) => value?.accountId === accountId,
  );
  if (!lookup) throw new Error("line_binding_incomplete:lookup_object");

  if (previewDbConfigured()) {
    const owner = await readIdentityLinkOwnerFromPreviewDb("line_subject", sha256Hex(lineUserId));
    if (owner !== accountId) {
      throw new Error(`line_binding_incomplete:canonical_identity_link:${owner ? "other" : "absent"}`);
    }
  }
}

/**
 * Commit an account's complete identity set through the SAME governed RPC the application calls,
 * with the service-role key this test process already holds.
 *
 * No public route, no admin endpoint, nothing added to the deployment — the same seam
 * `establishLineActivity` uses for canonical LINE events.
 */
export async function syncIdentityLinksInPreviewDb(
  accountId: string,
  links: { kind: string; digest: string }[],
): Promise<void> {
  const response = await dbRequest("rpc/yorisou_identity_links_sync", {
    method: "POST",
    body: JSON.stringify({
      p_owner_account_id: accountId,
      p_owner_fingerprint: sha256Hex(accountId),
      p_links: links,
    }),
  });
  if (!response.ok) {
    throw new Error(`identity_link_sync_failed_${response.status}:${(await response.text()).slice(0, 120)}`);
  }
}

/** Who actively owns this identity, per the registry? The question a LINE login asks. */
export async function readIdentityLinkOwnerFromPreviewDb(
  kind: string,
  digest: string,
): Promise<string | null> {
  const response = await dbRequest("rpc/yorisou_identity_link_owner", {
    method: "POST",
    body: JSON.stringify({ p_link_kind: kind, p_link_digest: digest }),
  });
  if (!response.ok) throw new Error(`identity_link_owner_read_failed_${response.status}`);
  const value = (await response.json()) as string | null;
  return value ?? null;
}

/** Active identity links remaining for an owner. Content-free, and asked by fingerprint. */
export async function readIdentityLinkResidueFromPreviewDb(accountId: string): Promise<number> {
  const response = await dbRequest("rpc/yorisou_identity_links_residue", {
    method: "POST",
    body: JSON.stringify({ p_owner_fingerprint: sha256Hex(accountId) }),
  });
  if (!response.ok) throw new Error(`identity_link_residue_read_failed_${response.status}`);
  return (await response.json()) as number;
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

// ─────────────────────────────────────────────────────────────────────────────
// POR-1 R2 — driving a deletion to a terminal state when the transport may time out.
//
// THE DEFECT THIS EXISTS TO CLOSE.
//
// The confirm route runs the whole saga inline. Under full-suite load the CLIENT hit its own
// timeout, and `page.request.post` THROWS on timeout rather than returning a status — so the retry
// loop, which only ever inspected returned responses, never saw it and the exception escaped the
// whole step. The deletion itself was fine; the harness could not tell.
//
// The fix is not a longer timeout and not a blind repeat. A thrown timeout means THE OUTCOME IS
// UNKNOWN, and the only honest next move is to ask the durable record what actually happened before
// deciding whether another confirm is even legal.
// ─────────────────────────────────────────────────────────────────────────────

/** Transport failures where the request's fate is genuinely unknown, so reconciliation is legal. */
function isReconcilableTransportError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("ETIMEDOUT") ||
    message.includes("ECONNRESET") ||
    message.includes("socket hang up") ||
    message.includes("Request timed out")
  );
}

export type DeletionDriveResult = {
  outcome: "completed" | "denied" | "failed_retryable" | "failed_terminal" | "authority_unavailable";
  attempts: number;
  timeouts: number;
  lastState: string | null;
};

/**
 * Drive a deletion to a terminal state, reconciling every unknown against the durable record.
 *
 * Bounded in BOTH dimensions — attempts and wall clock — so a stuck deployment fails the property
 * rather than hanging it. A genuinely failed deletion still fails: `failed_terminal` stops
 * immediately, and exhausting the budget on `failed_retryable` is reported as such rather than
 * retried into a pass.
 */
export async function driveDeletionToTerminal(
  page: Page,
  credentials: { password: string },
  options: { maxAttempts?: number; budgetMs?: number } = {},
): Promise<DeletionDriveResult> {
  const maxAttempts = options.maxAttempts ?? 40;
  const budgetMs = options.budgetMs ?? 600_000;
  const startedAt = Date.now();
  let timeouts = 0;
  let lastState: string | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (Date.now() - startedAt > budgetMs) break;

    // THE DURABLE RECORD FIRST, ALWAYS. After a timeout this is the only thing that knows whether
    // the erasure ran, and asking it before re-confirming is what stops a second destructive
    // execution being launched over one that already succeeded.
    let statusCode: number;
    let state: string | null = null;
    try {
      const status = await page.request.get("/api/account/deletion-status", { timeout: 60_000 });
      statusCode = status.status();
      if (statusCode === 200) {
        state = ((await status.json()) as { state: string | null }).state;
        lastState = state;
      }
    } catch (error) {
      if (!isReconcilableTransportError(error)) throw error;
      timeouts += 1;
      await page.waitForTimeout(3_000);
      continue;
    }

    // 401 is the erased identity refusing its own former session — the terminal success signal for
    // a browser whose account no longer exists.
    if (statusCode === 401) return { outcome: "denied", attempts: attempt + 1, timeouts, lastState };
    if (state === "completed") return { outcome: "completed", attempts: attempt + 1, timeouts, lastState };
    if (state === "failed_terminal") {
      return { outcome: "failed_terminal", attempts: attempt + 1, timeouts, lastState };
    }

    // Mid-erasure states belong to the executor that owns the job. Polling is correct; a second
    // confirm here would be contending with a run that is progressing perfectly well.
    if (state && ["database_erasure", "storage_erasure", "identity_erasure", "verifying"].includes(state)) {
      await page.waitForTimeout(3_000);
      continue;
    }

    // Only a job that is stalled — requested, verified, held, or retryable — may be pushed on.
    try {
      const retry = await page.request.post("/api/account/deletion-confirm", {
        data: { password: credentials.password, confirmation: "削除します" },
        timeout: 180_000,
      });
      if (retry.status() === 401) {
        return { outcome: "denied", attempts: attempt + 1, timeouts, lastState };
      }
      const body = (await retry.json().catch(() => ({}))) as { state?: string };
      if (body.state === "completed") {
        return { outcome: "completed", attempts: attempt + 1, timeouts, lastState };
      }
      lastState = body.state ?? lastState;
    } catch (error) {
      // A thrown confirm is exactly the case that used to escape. It is NOT retried blindly — the
      // loop returns to the durable read at the top, which is the only thing that can say whether
      // this attempt actually did the work.
      if (!isReconcilableTransportError(error)) throw error;
      timeouts += 1;
    }

    await page.waitForTimeout(3_000);
  }

  return {
    outcome: lastState === "failed_retryable" ? "failed_retryable" : "authority_unavailable",
    attempts: maxAttempts,
    timeouts,
    lastState,
  };
}
