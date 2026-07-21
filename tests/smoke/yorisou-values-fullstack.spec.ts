import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { YORISOU_VALUES_DEFINITION } from "../../lib/yorisou/methods/yorisou-values/definition.generated";

// YV-1 §17 — authenticated FULL-STACK acceptance against a real disposable local
// backend (PostgreSQL + PostgREST + real app + real cookie auth). Launched ONLY by
// tests/yorisou-values/fullstack-local.sh (YV_FULLSTACK=1); skipped otherwise.

const ENABLED = process.env.YV_FULLSTACK === "1";
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3200";
const REST = process.env.YV_REST_URL || "http://localhost:55448";
const SERVICE_KEY = process.env.YV_SERVICE_KEY || "";
const BANK_HASH = "919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6";

test.skip(!ENABLED, "full-stack spec runs only via tests/yorisou-values/fullstack-local.sh");

const restHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };
async function restRows(page: Page | BrowserContext, path: string): Promise<Record<string, unknown>[]> {
  const ctx = "request" in page ? page.request : page;
  const res = await ctx.get(`${REST}/${path}`, { headers: restHeaders });
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as Record<string, unknown>[];
}
async function registerAndSignIn(page: Page, email: string) {
  const res = await page.request.post(`${BASE}/api/auth/register`, { data: { name: "YV検証", email, password: "Yv1-Str0ng-Pass!", city: "Tokyo", role: "self" } });
  expect([200, 201]).toContain(res.status());
  expect((await page.request.get(`${BASE}/api/tests/yorisou-values/assessments`)).status()).toBe(200);
}
// Build 48 answers that genuinely favor one dimension (select its side wherever
// it appears; otherwise A). Reproduces the contract-test helper so the expected
// result is deterministic.
function answersFavoring(target: string): Record<string, "A" | "B"> {
  const a: Record<string, "A" | "B"> = {};
  for (const item of YORISOU_VALUES_DEFINITION.items) {
    if (item.choiceA.dimension === target) a[item.itemId] = "A";
    else if (item.choiceB.dimension === target) a[item.itemId] = "B";
    else a[item.itemId] = "A";
  }
  return a;
}
const fullAnswers = () => answersFavoring("anshin");
const provenance = { methodVersion: "values-v1.0", bankVersion: "values-bank-v1.0", scoringVersion: "values-scoring-v1.0", resultSchemaVersion: "values-result-v1.0", bankContentHash: BANK_HASH };

test.describe.serial("YV-1 full-stack authenticated acceptance", () => {
  const A = `yv-a-${Date.now()}@example.test`;
  const B = `yv-b-${Date.now()}@example.test`;

  test("authenticated create → server scoring → read result → correct (v2) → retake (distinct) → delete (erased, one tombstone)", async ({ page }) => {
    await registerAndSignIn(page, A);
    const create = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance } });
    expect(create.status()).toBe(201);
    const created = (await create.json()) as { assessmentId: string; resultId: string };
    expect(created.resultId).toBe("VAL_R_ANSHIN"); // all-A favors anshin

    // Read the recomputed result (server-side; no internal numerics).
    const detail = await page.request.get(`${BASE}/api/tests/yorisou-values/assessments/${created.assessmentId}`);
    expect(detail.status()).toBe(200);
    const result = (await detail.json()) as Record<string, unknown>;
    expect(result.resultId).toBe("VAL_R_ANSHIN");
    expect(JSON.stringify(result)).not.toMatch(/winRate|"wins"/i);

    // Correct answers → new version, recomputed.
    const corrected = fullAnswers();
    for (let i = 1; i <= 48; i++) corrected[`VAL_Q${String(i).padStart(2, "0")}`] = "B";
    const patch = await page.request.patch(`${BASE}/api/tests/yorisou-values/assessments/${created.assessmentId}`, { data: { answers: corrected } });
    expect(patch.status()).toBe(200);
    expect(((await patch.json()) as { currentVersion: number }).currentVersion).toBe(2);
    const versions = await restRows(page, `yorisou_values_assessment_versions?select=version&assessment_id=eq.${created.assessmentId}&order=version`);
    expect(versions).toHaveLength(2);

    // Retake → a distinct record.
    const retake = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance } });
    expect(retake.status()).toBe(201);
    const history = (await (await page.request.get(`${BASE}/api/tests/yorisou-values/assessments`)).json()) as { assessments: unknown[] };
    expect(history.assessments).toHaveLength(2);

    // Delete the first → content erased, exactly one tombstone remains for it.
    const del = await page.request.delete(`${BASE}/api/tests/yorisou-values/assessments/${created.assessmentId}`);
    expect(del.status()).toBe(200);
    expect(await restRows(page, `yorisou_values_assessments?select=id&id=eq.${created.assessmentId}`)).toHaveLength(0);
    expect(await restRows(page, `yorisou_values_assessment_versions?select=id&assessment_id=eq.${created.assessmentId}`)).toHaveLength(0);
    const events = await restRows(page, `yorisou_values_assessment_events?select=event_type,reason_code,retention_expires_at&assessment_id=eq.${created.assessmentId}`);
    expect(events).toHaveLength(1);
    expect(events[0].event_type).toBe("deleted");
    expect(events[0].retention_expires_at).toBeTruthy();
  });

  test("provenance mismatch rejected before persistence; malformed/oversized bounded", async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/login`, { data: { email: A, password: "Yv1-Str0ng-Pass!" } });
    const before = (await restRows(page, `yorisou_values_assessments?select=id`)).length;
    const stale = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance, bankVersion: "values-bank-v0.9" } });
    expect(stale.status()).toBe(422);
    expect((await stale.json()).error).toBe("values_contract_version_mismatch");
    const hashStale = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance, bankContentHash: "deadbeef" } });
    expect(hashStale.status()).toBe(422);
    const insufficient = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: { VAL_Q01: "A" }, ...provenance } });
    expect(insufficient.status()).toBe(422);
    expect((await insufficient.json()).error).toBe("insufficient_coverage");
    const malformed = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { headers: { "Content-Type": "application/json" }, data: "{bad" });
    expect(malformed.status()).toBe(400);
    const oversized = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { headers: { "Content-Type": "application/json" }, data: JSON.stringify({ answers: fullAnswers(), ...provenance, junk: "x".repeat(40000) }) });
    expect(oversized.status()).toBe(413);
    expect((await restRows(page, `yorisou_values_assessments?select=id`)).length).toBe(before); // no rows from rejected requests
  });

  test("TRUE two-account isolation: B cannot read, correct or delete A's real record", async ({ browser }) => {
    const aCtx = await browser.newContext();
    const aPage = await aCtx.newPage();
    await registerAndSignIn(aPage, `${A}.iso`);
    const aCreate = await aPage.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance } });
    expect(aCreate.status()).toBe(201);
    const aId = ((await aCreate.json()) as { assessmentId: string }).assessmentId;
    const aRowsBefore = await restRows(aPage, `yorisou_values_assessments?select=id,result_id,current_version&id=eq.${aId}`);
    expect(aRowsBefore).toHaveLength(1);

    const bCtx = await browser.newContext();
    const bPage = await bCtx.newPage();
    await registerAndSignIn(bPage, B);
    // B's history excludes A.
    const bHistory = (await (await bPage.request.get(`${BASE}/api/tests/yorisou-values/assessments`)).json()) as { assessments: { id: string }[] };
    expect(bHistory.assessments.some((r) => r.id === aId)).toBe(false);
    // B attacks A's real id → bounded 404, no leak.
    const bGet = await bPage.request.get(`${BASE}/api/tests/yorisou-values/assessments/${aId}`);
    expect(bGet.status()).toBe(404);
    expect(await bGet.json()).toEqual({ error: "record_not_found" });
    const bPatch = await bPage.request.patch(`${BASE}/api/tests/yorisou-values/assessments/${aId}`, { data: { confirmation: "confirmed" } });
    expect(bPatch.status()).toBe(404);
    const bDelete = await bPage.request.delete(`${BASE}/api/tests/yorisou-values/assessments/${aId}`);
    expect(bDelete.status()).toBe(404);
    await bCtx.close();

    // A's record unchanged, no tombstone.
    const aRowsAfter = await restRows(aPage, `yorisou_values_assessments?select=id,result_id,current_version&id=eq.${aId}`);
    expect(aRowsAfter).toEqual(aRowsBefore);
    expect(await restRows(aPage, `yorisou_values_assessment_events?select=id&assessment_id=eq.${aId}&event_type=eq.deleted`)).toHaveLength(0);
    await aCtx.close();

    // Unauthenticated denial of all methods.
    const anon = await browser.newContext();
    const anonPage = await anon.newPage();
    for (const [method, url] of [
      ["get", `${BASE}/api/tests/yorisou-values/assessments`],
      ["post", `${BASE}/api/tests/yorisou-values/assessments`],
      ["patch", `${BASE}/api/tests/yorisou-values/assessments/${aId}`],
      ["delete", `${BASE}/api/tests/yorisou-values/assessments/${aId}`],
    ] as const) {
      const res = await anonPage.request[method](url, method === "get" || method === "delete" ? undefined : { data: {} });
      expect(res.status(), `${method} ${url}`).toBe(401);
    }
    await anon.close();
  });

  test("YV-C1 confirmation is a distinct op (no version bump); YV-C4 strict PATCH contract", async ({ page }) => {
    await registerAndSignIn(page, `yv-c1-${Date.now()}@example.test`);
    const create = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance } });
    expect(create.status()).toBe(201);
    const id = ((await create.json()) as { assessmentId: string }).assessmentId;
    const url = `${BASE}/api/tests/yorisou-values/assessments/${id}`;

    // Confirmation-only PATCH → 200, current version stays 1, exactly one
    // confirmation_changed event, and NO new version row.
    const conf = await page.request.patch(url, { data: { confirmation: "confirmed" } });
    expect(conf.status()).toBe(200);
    expect(((await conf.json()) as { currentVersion: number }).currentVersion).toBe(1);
    const events = await restRows(page, `yorisou_values_assessment_events?select=event_type,reason_code&assessment_id=eq.${id}&event_type=eq.confirmation_changed`);
    expect(events).toHaveLength(1);
    expect(events[0].reason_code).toBe("user_confirmed");
    expect(await restRows(page, `yorisou_values_assessment_versions?select=version&assessment_id=eq.${id}`)).toHaveLength(1);

    // Strict/ambiguous/empty rejections (YV-C4/YV-C1).
    expect((await page.request.patch(url, { data: {} })).status()).toBe(400); // empty update
    expect((await page.request.patch(url, { data: { answers: fullAnswers(), confirmation: "confirmed" } })).status()).toBe(400); // ambiguous (answers XOR confirmation)
    expect((await page.request.patch(url, { data: { junk: 1 } })).status()).toBe(400); // unknown field
    // Byte-equivalent answer correction is a no-op → 409, not a silent new version.
    const noop = await page.request.patch(url, { data: { answers: fullAnswers() } });
    expect(noop.status()).toBe(409);
    expect((await noop.json()).error).toBe("values_no_answer_change");
    expect(await restRows(page, `yorisou_values_assessment_versions?select=version&assessment_id=eq.${id}`)).toHaveLength(1); // still one version
  });

  test("YV-C3 anonymous non-persistent scoring returns a result WITHOUT storing; YV-C4 strict score/create fields", async ({ browser }) => {
    const scoreUrl = `${BASE}/api/tests/yorisou-values/score`;
    const anon = await browser.newContext();
    const anonPage = await anon.newPage();
    // No auth cookie: the score endpoint still works.
    const before = (await restRows(anonPage, `yorisou_values_assessments?select=id`)).length;
    const scored = await anonPage.request.post(scoreUrl, { data: { answers: fullAnswers(), ...provenance } });
    expect(scored.status()).toBe(200);
    const body = (await scored.json()) as Record<string, unknown>;
    expect(body.saved).toBe(false);
    expect(body.resultId).toBe("VAL_R_ANSHIN");
    expect(body.assessmentId).toBeUndefined();
    expect(JSON.stringify(body)).not.toMatch(/winRate|"wins"/i); // no internal numerics
    // NOTHING persisted by an anonymous score.
    expect((await restRows(anonPage, `yorisou_values_assessments?select=id`)).length).toBe(before);
    // Stale provenance and insufficient coverage are bounded 422.
    expect((await anonPage.request.post(scoreUrl, { data: { answers: fullAnswers(), ...provenance, bankVersion: "values-bank-v0.9" } })).status()).toBe(422);
    expect((await anonPage.request.post(scoreUrl, { data: { answers: { VAL_Q01: "A" }, ...provenance } })).status()).toBe(422);
    // score omits confirmation from its allowlist → unknown field → 400.
    expect((await anonPage.request.post(scoreUrl, { data: { answers: fullAnswers(), ...provenance, confirmation: "confirmed" } })).status()).toBe(400);
    await anon.close();

    // create also rejects unknown top-level fields (YV-C4).
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await registerAndSignIn(p, `yv-c4-${Date.now()}@example.test`);
    const bad = await p.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: fullAnswers(), ...provenance, junk: "x" } });
    expect(bad.status()).toBe(400);
    await ctx.close();
  });
});
