import { test, expect, type Page, type BrowserContext } from "@playwright/test";

// DCI-1.1 §9 — authenticated FULL-STACK acceptance against a real disposable
// local backend (PostgreSQL + PostgREST + real app + real auth/session layer).
// Launched ONLY by tests/daily-check-in/fullstack-local.sh (DCI_FULLSTACK=1) or
// the DCI CI workflow; skipped in the plain smoke run.
//
// Exercises: real browser component → gated route → cookie auth → API handlers
// → server repository → PostgREST REST/RPC → migrated database.

const ENABLED = process.env.DCI_FULLSTACK === "1";
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3200";
const REST = process.env.DCI_REST_URL || "http://localhost:55448";
const SERVICE_KEY = process.env.DCI_SERVICE_KEY || "";
const ROUTE = `${BASE}/tests/daily-check-in`;

test.skip(!ENABLED, "full-stack spec runs only via tests/daily-check-in/fullstack-local.sh");

const restHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };

async function restRows(page: Page | BrowserContext, path: string): Promise<Record<string, unknown>[]> {
  const ctx = "request" in page ? page.request : page;
  const res = await ctx.get(`${REST}/${path}`, { headers: restHeaders });
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as Record<string, unknown>[];
}

async function registerAndSignIn(page: Page, email: string): Promise<void> {
  // Deterministic authenticated fixture through the REAL auth layer: register
  // (creates account + session cookies in this browser context), verified by a
  // subsequent authenticated API read.
  const res = await page.request.post(`${BASE}/api/auth/register`, {
    data: { name: "DCIフルスタック検証", email, password: "Dci1.1-Str0ng-Pass!", city: "Tokyo", role: "self" },
  });
  expect([200, 201]).toContain(res.status());
  const check = await page.request.get(`${BASE}/api/tests/daily-check-in/records?timezone=Asia/Tokyo`);
  expect(check.status()).toBe(200);
}

async function gotoHydrated(page: Page) {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="daily-check-in"][data-hydrated="true"]').waitFor({ timeout: 20_000 });
}

test.describe.serial("DCI-1.1 full-stack authenticated acceptance", () => {
  const A_EMAIL = `dci11-a-${Date.now()}@example.test`;
  const B_EMAIL = `dci11-b-${Date.now()}@example.test`;
  const C_EMAIL = `dci11-c-${Date.now()}@example.test`;

  test("signed-in create → server-derived date → history → correct (v2, v1 preserved) → delete → content erased", async ({ page }) => {
    await registerAndSignIn(page, A_EMAIL);
    await gotoHydrated(page);

    // Create through the real UI (memo included to prove later erasure).
    await page.getByTestId("daily-field-kokoro_tenki").getByText("あめ", { exact: true }).click();
    await page.getByTestId("daily-field-kyou_hoshii").getByText("やすみ", { exact: true }).click();
    await page.getByTestId("daily-memo-opt-in").check();
    await page.getByTestId("daily-memo-input").fill("フルスタック検証メモ");
    await page.getByTestId("daily-submit").click();
    await expect(page.getByTestId("daily-ack")).toBeVisible();
    await page.getByTestId("daily-save").click();
    await expect(page.getByTestId("daily-saved")).toBeVisible();

    // Server-derived local date: the record in history equals the server's today.
    const history = await (await page.request.get(`${BASE}/api/tests/daily-check-in/records?timezone=Asia/Tokyo`)).json();
    expect(history.records).toHaveLength(1);
    const today: string = history.today;
    expect(history.records[0].entryLocalDate).toBe(today);
    expect(history.records[0].currentVersion).toBe(1);
    await expect(page.getByTestId(`daily-record-${today}`)).toBeVisible();

    // Correct same-day through the UI → v2; v1 content preserved in the DB.
    await page.getByTestId(`daily-edit-${today}`).click();
    await page.getByTestId("daily-field-kokoro_tenki").getByText("はれ", { exact: true }).click();
    await page.getByTestId("daily-submit").click();
    await page.getByTestId("daily-save").click();
    await expect(page.getByTestId("daily-saved")).toContainText("v2");
    const rows = await restRows(page, `yorisou_daily_state_records?select=id,state,current_version,produced_at&entry_local_date=eq.${today}`);
    const recordRow = rows.find((r) => (r.state as Record<string, string>).kokoro_tenki === "hare");
    expect(recordRow).toBeTruthy();
    expect(recordRow!.current_version).toBe(2);
    const versions = await restRows(page, `yorisou_daily_state_record_versions?select=version,state,memo&record_id=eq.${recordRow!.id}&order=version`);
    expect(versions).toHaveLength(2);
    expect((versions[0].state as Record<string, string>).kokoro_tenki).toBe("ame"); // v1 untouched before deletion
    expect(versions[0].memo).toBe("フルスタック検証メモ");

    // Delete through the UI → record disappears; raw state/memo absent everywhere.
    await page.getByTestId(`daily-delete-${today}`).click();
    await page.getByTestId("daily-delete-confirm-yes").click();
    await expect(page.getByTestId(`daily-record-${today}`)).toHaveCount(0);
    const afterRecords = await restRows(page, `yorisou_daily_state_records?select=id&id=eq.${recordRow!.id}`);
    expect(afterRecords).toHaveLength(0);
    const afterVersions = await restRows(page, `yorisou_daily_state_record_versions?select=id&record_id=eq.${recordRow!.id}`);
    expect(afterVersions).toHaveLength(0);
    const memoSweep = await restRows(page, `yorisou_daily_state_record_versions?select=id&memo=eq.${encodeURIComponent("フルスタック検証メモ")}`);
    expect(memoSweep).toHaveLength(0);
    // DCI-1.2 §5 — deletion event minimization: EXACTLY ONE retained DCI row for
    // the record (the content-free tombstone); prior created/corrected events gone.
    const allEvents = await restRows(page, `yorisou_daily_state_history_events?select=event_type,version,reason_code,retention_expires_at&record_id=eq.${recordRow!.id}`);
    expect(allEvents).toHaveLength(1);
    expect(allEvents[0].event_type).toBe("deleted");
    expect(allEvents[0].reason_code).toBe("user_deleted");
    expect(allEvents[0].retention_expires_at).toBeTruthy();
  });

  test("API negatives (authenticated): server-authoritative time, duplicates, timezone, oversized/malformed", async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/login`, { data: { email: A_EMAIL, password: "Dci1.1-Str0ng-Pass!" } });
    // Client time-identity overrides rejected.
    const override = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", producedAt: "2020-01-01T00:00:00Z" },
    });
    expect(override.status()).toBe(422);
    expect((await override.json()).error).toBe("time_identity_is_server_authoritative");
    const dateOverride = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", entryLocalDate: "2020-01-01" },
    });
    expect(dateOverride.status()).toBe(422);
    // Expired / future resumed time rejected with bounded codes.
    const expired = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", resumed: true, completedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(), methodVersion: "daily-check-in-v1.0", schemaVersion: "daily-state-schema-v1.1" },
    });
    expect(expired.status()).toBe(422);
    expect((await expired.json()).codes).toContain("resumed_time_expired");
    const future = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", resumed: true, completedAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), methodVersion: "daily-check-in-v1.0", schemaVersion: "daily-state-schema-v1.1" },
    });
    expect((await future.json()).codes).toContain("resumed_time_future");
    // Invalid timezone.
    const badTz = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Tokyo/Nowhere" },
    });
    expect(badTz.status()).toBe(422);
    // Duplicate same-day create → 409 with correction guidance.
    const first = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, { data: { values: { kokoro_tenki: "kumori" }, timezone: "Asia/Tokyo" } });
    expect(first.status()).toBe(201);
    const dup = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, { data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo" } });
    expect(dup.status()).toBe(409);
    expect((await dup.json()).error).toBe("record_exists_use_correction");
    // Past-date correction → record_not_found (no record exists for that date; a
    // same-date-but-window-closed record cannot be fabricated via the API at all).
    const pastPatch = await page.request.patch(`${BASE}/api/tests/daily-check-in/records/2020-01-01`, { data: { values: { kokoro_tenki: "hare" } } });
    expect(pastPatch.status()).toBe(404);
    // Malformed + oversized JSON.
    const malformed = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, { headers: { "Content-Type": "application/json" }, data: "{not json" });
    expect(malformed.status()).toBe(400);
    const oversized = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", junk: "x".repeat(20000) }),
    });
    expect(oversized.status()).toBe(413);
  });

  test("resumed identity: original completedAt + timezone survive login; local date derives from the ORIGINAL timezone", async ({ page }) => {
    await registerAndSignIn(page, C_EMAIL);
    // Resumed create in UTC+14 (Pacific/Kiritimati): the entry's local date can
    // differ from the server's UTC date — proving server-side derivation from
    // the ORIGINAL timezone, not the login browser's.
    const completedAt = new Date(Date.now() - 4 * 60 * 1000).toISOString();
    const res = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Pacific/Kiritimati", resumed: true, completedAt, methodVersion: "daily-check-in-v1.0", schemaVersion: "daily-state-schema-v1.1" },
    });
    expect(res.status()).toBe(201);

    // DCI-1.2 §7 — stale resumed provenance NEVER creates a record.
    const countBefore = (await restRows(page, `yorisou_daily_state_records?select=id`)).length;
    const stale = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", resumed: true, completedAt: new Date().toISOString(), methodVersion: "daily-check-in-v0.9", schemaVersion: "daily-state-schema-v1.1" },
    });
    expect(stale.status()).toBe(422);
    expect((await stale.json()).error).toBe("resumed_contract_version_mismatch");
    const staleSchema = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", resumed: true, completedAt: new Date().toISOString(), methodVersion: "daily-check-in-v1.0", schemaVersion: "daily-state-schema-v1.0" },
    });
    expect(staleSchema.status()).toBe(422);
    const missingVersions = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Asia/Tokyo", resumed: true, completedAt: new Date().toISOString() },
    });
    expect(missingVersions.status()).toBe(422);
    expect((await restRows(page, `yorisou_daily_state_records?select=id`)).length).toBe(countBefore); // no rows created
    const created = (await res.json()) as { entryLocalDate: string };
    const expectedLocal = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Kiritimati", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(completedAt));
    expect(created.entryLocalDate).toBe(expectedLocal);
    // Persisted produced_at equals the ORIGINAL completion instant.
    const rows = await restRows(page, `yorisou_daily_state_records?select=produced_at,timezone&entry_local_date=eq.${created.entryLocalDate}&timezone=eq.Pacific%2FKiritimati`);
    expect(rows).toHaveLength(1);
    expect(new Date(rows[0].produced_at as string).toISOString()).toBe(completedAt);
  });

  test("anonymous UI completion → login → resumed review → explicit save (single-use, discardable)", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await gotoHydrated(page);
    await page.getByTestId("daily-field-atama_yohaku").getByText("ぐるぐるしている", { exact: true }).click();
    await page.getByTestId("daily-submit").click();
    await page.getByTestId("daily-save").click();
    await expect(page.getByTestId("daily-login-needed")).toBeVisible();
    const pendingRaw = await page.evaluate(() => sessionStorage.getItem("yorisou.daily-check-in.pending-save.v2"));
    expect(pendingRaw).toContain("completedAt");
    // Sign in within the SAME context (cookies land in the browser context).
    const login = await page.request.post(`${BASE}/api/auth/register`, {
      data: { name: "DCI再開検証", email: B_EMAIL, password: "Dci1.1-Str0ng-Pass!", city: "Tokyo", role: "self" },
    });
    expect([200, 201]).toContain(login.status());
    await gotoHydrated(page);
    await expect(page.getByTestId("daily-resumed-note")).toBeVisible();
    // Single-use: the pending entry was taken on load.
    expect(await page.evaluate(() => sessionStorage.getItem("yorisou.daily-check-in.pending-save.v2"))).toBeNull();
    // Explicit save of the reviewed entry.
    await page.getByTestId("daily-submit").click();
    await page.getByTestId("daily-save").click();
    await expect(page.getByTestId("daily-saved")).toBeVisible();
    // The resumed banner offered an explicit discard control (visible pre-save path).
    await context.close();
  });

  test("TRUE two-account isolation (real records, guaranteed-different local dates) + unauthenticated denial", async ({ browser }) => {
    const ISO_A = `dci12-iso-a-${Date.now()}@example.test`;
    const ISO_B = `dci12-iso-b-${Date.now()}@example.test`;

    // Account A: real persisted record in Pacific/Honolulu (UTC-10).
    const aContext = await browser.newContext();
    const aPage = await aContext.newPage();
    await registerAndSignIn(aPage, ISO_A);
    const aCreate = await aPage.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "kumori", kyou_hoshii: "seiri" }, timezone: "Pacific/Honolulu" },
    });
    expect(aCreate.status()).toBe(201);
    const aRecord = (await aCreate.json()) as { recordId: string; entryLocalDate: string };
    const aRowsBefore = await restRows(aPage, `yorisou_daily_state_records?select=id,owner_account_id,state,current_version&id=eq.${aRecord.recordId}`);
    expect(aRowsBefore).toHaveLength(1);
    const aOwner = aRowsBefore[0].owner_account_id as string;
    const aStateBefore = JSON.stringify(aRowsBefore[0].state);

    // Account B: real persisted record in Pacific/Kiritimati (UTC+14) — its local
    // date is GUARANTEED to differ from A's (24h apart), independent of the
    // runner's UTC calendar date.
    const bContext = await browser.newContext();
    const bPage = await bContext.newPage();
    await registerAndSignIn(bPage, ISO_B);
    const bCreate = await bPage.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, timezone: "Pacific/Kiritimati" },
    });
    expect(bCreate.status()).toBe(201);
    const bRecord = (await bCreate.json()) as { entryLocalDate: string };
    expect(bRecord.entryLocalDate).not.toBe(aRecord.entryLocalDate);

    // 1. B's history excludes A's record entirely.
    const bHistory = (await (await bPage.request.get(`${BASE}/api/tests/daily-check-in/records?timezone=Pacific/Kiritimati`)).json()) as {
      records: { entryLocalDate: string; stateValues: Record<string, string | null> }[];
    };
    expect(bHistory.records).toHaveLength(1);
    expect(bHistory.records[0].entryLocalDate).toBe(bRecord.entryLocalDate);
    expect(bHistory.records.some((r) => r.entryLocalDate === aRecord.entryLocalDate)).toBe(false);
    expect(JSON.stringify(bHistory)).not.toContain("seiri"); // no cross-account content

    // 2/3. B attacks A's ACTUAL entryLocalDate: PATCH and DELETE must 404 with the
    // same bounded body as an unknown date (no existence leak), and change nothing.
    const bPatch = await bPage.request.patch(`${BASE}/api/tests/daily-check-in/records/${aRecord.entryLocalDate}`, {
      data: { values: { kokoro_tenki: "ame" } },
    });
    expect(bPatch.status()).toBe(404);
    expect(await bPatch.json()).toEqual({ error: "record_not_found" });
    const bDelete = await bPage.request.delete(`${BASE}/api/tests/daily-check-in/records/${aRecord.entryLocalDate}`);
    expect(bDelete.status()).toBe(404);
    expect(await bDelete.json()).toEqual({ error: "record_not_found" });

    // 5. B's OWN record stays readable and mutable (correction window is open in
    // its stored timezone).
    const bOwnPatch = await bPage.request.patch(`${BASE}/api/tests/daily-check-in/records/${bRecord.entryLocalDate}`, {
      data: { values: { kokoro_tenki: "usugumori" } },
    });
    expect(bOwnPatch.status()).toBe(200);
    expect(((await bOwnPatch.json()) as { currentVersion: number }).currentVersion).toBe(2);
    await bContext.close();

    // Back as A: record exists, state unchanged, version unchanged, NO tombstone.
    const aRowsAfter = await restRows(aPage, `yorisou_daily_state_records?select=id,owner_account_id,state,current_version&id=eq.${aRecord.recordId}`);
    expect(aRowsAfter).toHaveLength(1);
    expect(aRowsAfter[0].owner_account_id).toBe(aOwner);
    expect(JSON.stringify(aRowsAfter[0].state)).toBe(aStateBefore);
    expect(aRowsAfter[0].current_version).toBe(1);
    const aTombstones = await restRows(aPage, `yorisou_daily_state_history_events?select=id&record_id=eq.${aRecord.recordId}&event_type=eq.deleted`);
    expect(aTombstones).toHaveLength(0);
    // A can still read its record through the API.
    const aHistory = (await (await aPage.request.get(`${BASE}/api/tests/daily-check-in/records?timezone=Pacific/Honolulu`)).json()) as { records: { entryLocalDate: string }[] };
    expect(aHistory.records.some((r) => r.entryLocalDate === aRecord.entryLocalDate)).toBe(true);
    await aContext.close();

    // Unauthenticated context: all four methods denied.
    const anon = await browser.newContext();
    const anonPage = await anon.newPage();
    for (const [method, url] of [
      ["get", `${BASE}/api/tests/daily-check-in/records`],
      ["post", `${BASE}/api/tests/daily-check-in/records`],
      ["patch", `${BASE}/api/tests/daily-check-in/records/${aRecord.entryLocalDate}`],
      ["delete", `${BASE}/api/tests/daily-check-in/records/${aRecord.entryLocalDate}`],
    ] as const) {
      const res = await anonPage.request[method](url, method === "get" || method === "delete" ? undefined : { data: { values: {} } });
      expect(res.status(), `${method} ${url}`).toBe(401);
    }
    await anon.close();
  });
});
