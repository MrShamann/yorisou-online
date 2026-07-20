import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// DCI-1 — daily-check-in「きょうの空模様」browser acceptance.
// Runs without Supabase credentials: the auth gate (401) fires before any store
// access, so the anonymous lifecycle is fully exercisable. Requires a running
// dev server (local context ⇒ the server-side gate is open; the Production-closed
// behavior is covered by the access-gate unit matrix in dailyCheckIn.test.ts).
// Both projects (desktop + Pixel 5 mobile) run every test.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const ROUTE = `${BASE}/tests/daily-check-in`;
const AXE_SOURCE = readFileSync(join(process.cwd(), "node_modules/axe-core/axe.js"), "utf8");

// The flow is a controlled client component: interact only after hydration
// (pre-hydration clicks would fall through to native form behavior).
async function gotoHydrated(page: Page) {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="daily-check-in"][data-hydrated="true"]').waitFor({ timeout: 15_000 });
}

async function expectNoSeriousAxeViolations(page: Page, context: string) {
  await page.evaluate(AXE_SOURCE);
  const results = (await page.evaluate(async () => {
    // @ts-expect-error axe injected above
    return await axe.run(document, { resultTypes: ["violations"] });
  })) as { violations: { id: string; impact: string | null; nodes: unknown[] }[] };
  const seriousOrCritical = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(seriousOrCritical, `${context}: serious/critical axe violations: ${JSON.stringify(seriousOrCritical.map((v) => v.id))}`).toEqual([]);
}

test.describe("/tests/daily-check-in (DCI-1)", () => {
  test("entry screen renders the canonical one-screen flow (axe-clean)", async ({ page }) => {
    await gotoHydrated(page);
    await expect(page.getByTestId("daily-check-in")).toBeVisible();
    await expect(page.getByRole("heading", { name: "きょうの空模様" })).toBeVisible();
    await expect(page.getByText("1分のじぶん記録")).toBeVisible();
    // All five canonical fields, one screen.
    for (const fieldId of ["kokoro_tenki", "karada_juden", "atama_yohaku", "hito_kyori", "kyou_hoshii"]) {
      await expect(page.getByTestId(`daily-field-${fieldId}`)).toBeVisible();
    }
    // Memo is opt-in, default OFF.
    await expect(page.getByTestId("daily-memo-opt-in")).not.toBeChecked();
    await expect(page.getByTestId("daily-memo-input")).toHaveCount(0);
    // No streak/countdown/pressure vocabulary anywhere.
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).not.toMatch(/連続記録|ストリーク|残り時間|今すぐ/);
    // No horizontal overflow.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expectNoSeriousAxeViolations(page, "entry state");
  });

  test("validation: empty submit and memo-only submit are rejected with canonical guidance", async ({ page }) => {
    await gotoHydrated(page);
    await page.getByTestId("daily-submit").click();
    await expect(page.getByTestId("daily-validation")).toBeVisible();
    // Memo-only: opt in + type memo, still no structured field ⇒ rejected.
    await page.getByTestId("daily-memo-opt-in").check();
    await page.getByTestId("daily-memo-input").fill("メモだけ");
    await page.getByTestId("daily-submit").click();
    await expect(page.getByTestId("daily-validation")).toBeVisible();
    await expectNoSeriousAxeViolations(page, "validation state");
  });

  test("completion: one selection produces the deterministic canonical acknowledgement (no score)", async ({ page }) => {
    await gotoHydrated(page);
    await page.getByTestId("daily-field-kokoro_tenki").getByText("あめ", { exact: true }).click();
    await page.getByTestId("daily-submit").click();
    await expect(page.getByTestId("daily-ack")).toBeVisible();
    // Anonymous context treats this as a first entry ⇒ ACK_FIRST canonical copy.
    await expect(page.getByTestId("daily-ack-copy")).toContainText("はじめの一枚");
    const ackText = await page.getByTestId("daily-ack").innerText();
    expect(ackText).not.toMatch(/点数|スコア|診断|タイプは/);
    await expectNoSeriousAxeViolations(page, "acknowledgement state");
  });

  test("anonymous save: API denies with 401; UI stores pending entry and offers sign-in continuation", async ({ page }) => {
    // API-level denial before any store access.
    const api = await page.request.post(`${BASE}/api/tests/daily-check-in/records`, {
      data: { values: { kokoro_tenki: "hare" }, memoOptIn: false, memo: null, producedAt: new Date().toISOString(), entryLocalDate: "2026-07-20", timezone: "Asia/Tokyo" },
    });
    expect(api.status()).toBe(401);
    expect(await api.json()).toEqual({ error: "authentication_required" });

    // UI-level: complete → save → login-needed state with device-local pending entry.
    await gotoHydrated(page);
    await page.getByTestId("daily-field-kyou_hoshii").getByText("やすみ", { exact: true }).click();
    await page.getByTestId("daily-submit").click();
    await page.getByTestId("daily-save").click();
    await expect(page.getByTestId("daily-login-needed")).toBeVisible();
    await expect(page.getByRole("link", { name: "サインインへ進む" })).toHaveAttribute("href", "/login?next=/tests/daily-check-in");
    const pending = await page.evaluate(() => sessionStorage.getItem("yorisou.daily-check-in.pending-save.v1"));
    expect(pending).toContain("yasumi");
    // Privacy: the memo/state never appears in the URL.
    expect(page.url()).not.toContain("yasumi");
    await expectNoSeriousAxeViolations(page, "authentication continuation state");
  });

  test("anonymous history section explains sign-in (no fake data)", async ({ page }) => {
    await gotoHydrated(page);
    await expect(page.getByTestId("daily-history-anonymous")).toBeVisible();
  });

  test("other API methods are equally auth-gated (PATCH/DELETE/GET)", async ({ page }) => {
    const patch = await page.request.patch(`${BASE}/api/tests/daily-check-in/records/2026-07-20`, { data: { values: { kokoro_tenki: "hare" } } });
    expect(patch.status()).toBe(401);
    const del = await page.request.delete(`${BASE}/api/tests/daily-check-in/records/2026-07-20`);
    expect(del.status()).toBe(401);
    const get = await page.request.get(`${BASE}/api/tests/daily-check-in/records`);
    expect(get.status()).toBe(401);
    const badDate = await page.request.delete(`${BASE}/api/tests/daily-check-in/records/not-a-date`);
    expect([400, 401]).toContain(badDate.status()); // auth gate fires first; both are safe denials
  });

  test("keyboard flow: fields and memo reachable and operable by keyboard", async ({ page }) => {
    await gotoHydrated(page);
    const firstRadio = page.getByTestId("daily-field-kokoro_tenki").locator("input[type=radio]").first();
    await firstRadio.focus();
    await page.keyboard.press("Space");
    await expect(firstRadio).toBeChecked();
    // Submit via keyboard.
    await page.getByTestId("daily-submit").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("daily-ack")).toBeVisible();
  });

  test("no navigation/catalog exposure: /tests page does not link the gated method", async ({ page }) => {
    await page.goto(`${BASE}/tests`, { waitUntil: "domcontentloaded" });
    const links = await page.locator('a[href*="daily-check-in"]').count();
    expect(links).toBe(0);
  });
});
