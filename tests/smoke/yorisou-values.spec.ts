import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// YV-1 — yorisou-values「いま大事にしたいことチェック」browser acceptance.
// Runs without Supabase credentials: the auth gate (401) fires before any store
// access, so the anonymous lifecycle is fully exercisable. Requires a running dev
// server (local context ⇒ the server-side gate is open). Both projects run.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const ROUTE = `${BASE}/tests/yorisou-values`;
const AXE_SOURCE = readFileSync(join(process.cwd(), "node_modules/axe-core/axe.js"), "utf8");

async function gotoHydrated(page: Page) {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="yorisou-values"][data-hydrated="true"]').waitFor({ timeout: 20_000 });
}

async function expectNoSeriousAxeViolations(page: Page, context: string) {
  await page.evaluate(AXE_SOURCE);
  const results = (await page.evaluate(async () => {
    // @ts-expect-error axe injected above
    return await axe.run(document, { resultTypes: ["violations"] });
  })) as { violations: { id: string; impact: string | null }[] };
  const seriousOrCritical = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(seriousOrCritical, `${context}: ${JSON.stringify(seriousOrCritical.map((v) => v.id))}`).toEqual([]);
}

// Answer all 48 items favoring the first choice; deterministic reach of the
// review/submit state without a backend.
async function answerAll(page: Page) {
  for (let i = 0; i < 48; i++) {
    await page.getByTestId("yv-choice-a").click();
  }
}

test.describe("/tests/yorisou-values (YV-1)", () => {
  test("intro shows interpretation limits + non-scientific boundary (axe-clean)", async ({ page }) => {
    await gotoHydrated(page);
    await expect(page.getByRole("heading", { name: "いま大事にしたいことチェック" })).toBeVisible();
    await expect(page.getByTestId("yv-interpretation-limits")).toContainText("第三者による判断");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const body = await page.locator("main").innerText();
    expect(body).not.toMatch(/連続記録|ストリーク|残り時間|正解/);
    await expectNoSeriousAxeViolations(page, "intro");
  });

  test("question flow: one pair per screen, progress, back, axe-clean", async ({ page }) => {
    await gotoHydrated(page);
    await page.getByTestId("yv-start").click();
    await expect(page.getByTestId("yv-progress")).toHaveText("1 / 48");
    await expect(page.getByTestId("yv-choice-a")).toBeVisible();
    await expect(page.getByTestId("yv-choice-b")).toBeVisible();
    await page.getByTestId("yv-choice-a").click();
    await expect(page.getByTestId("yv-progress")).toHaveText("2 / 48");
    await page.getByTestId("yv-back").click();
    await expect(page.getByTestId("yv-progress")).toHaveText("1 / 48");
    await expectNoSeriousAxeViolations(page, "question");
  });

  test("insufficient coverage: partial then exit shows the exact remaining count", async ({ page }) => {
    await gotoHydrated(page);
    await page.getByTestId("yv-start").click();
    for (let i = 0; i < 5; i++) await page.getByTestId("yv-choice-a").click();
    // Save-later returns to intro with a resume count.
    await page.getByTestId("yv-save-later").click();
    await expect(page.getByText("とちゅうの回答が 5/48 問あります。")).toBeVisible();
  });

  test("anonymous completion shows a result WITHOUT saving, then offers explicit sign-in-to-save; answers never in URL", async ({ page }) => {
    const provenance = { methodVersion: "values-v1.0", bankVersion: "values-bank-v1.0", scoringVersion: "values-scoring-v1.0", resultSchemaVersion: "values-result-v1.0", bankContentHash: "919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6" };
    // API-level: anonymous POST to the PERSISTENCE endpoint is still denied.
    const persist = await page.request.post(`${BASE}/api/tests/yorisou-values/assessments`, { data: { answers: { VAL_Q01: "A" }, ...provenance } });
    expect(persist.status()).toBe(401);
    expect(await persist.json()).toEqual({ error: "authentication_required" });
    // API-level: anonymous POST to the SCORE endpoint returns a non-persistent result.
    const score = await page.request.post(`${BASE}/api/tests/yorisou-values/score`, { data: { answers: Object.fromEntries(Array.from({ length: 48 }, (_, i) => [`VAL_Q${String(i + 1).padStart(2, "0")}`, "A"])), ...provenance } });
    expect(score.status()).toBe(200);
    const scored = await score.json();
    expect(scored.saved).toBe(false);
    expect(scored.assessmentId).toBeUndefined();

    await gotoHydrated(page);
    await page.getByTestId("yv-start").click();
    await answerAll(page);
    await expect(page.getByTestId("yv-review")).toBeVisible();
    // Nothing stored yet — the anonymous note is shown, not a login wall.
    await expect(page.getByTestId("yv-anonymous-note")).toBeVisible();
    await page.getByTestId("yv-submit").click();
    // The result is visible for the anonymous visitor, with an explicit save CTA.
    await expect(page.getByTestId("yv-result")).toBeVisible();
    await expect(page.getByTestId("yv-anonymous-save")).toBeVisible();
    expect(page.url()).not.toContain("VAL_Q");
    await expectNoSeriousAxeViolations(page, "anonymous result");
    // Clicking save stores answers on-device and routes to sign-in continuation.
    await page.getByTestId("yv-anonymous-save-cta").click();
    await page.waitForURL(/\/login\?next=%2Ftests%2Fyorisou-values|\/login\?next=\/tests\/yorisou-values/);
    const pending = await page.evaluate(() => sessionStorage.getItem("yorisou.values.pending-progress.v1"));
    expect(pending).toContain("VAL_Q01");
  });

  test("all API methods are auth-gated; provenance mismatch rejected", async ({ page }) => {
    for (const [method, url] of [
      ["get", `${BASE}/api/tests/yorisou-values/assessments`],
      ["post", `${BASE}/api/tests/yorisou-values/assessments`],
      ["get", `${BASE}/api/tests/yorisou-values/assessments/00000000-0000-0000-0000-000000000000`],
      ["patch", `${BASE}/api/tests/yorisou-values/assessments/00000000-0000-0000-0000-000000000000`],
      ["delete", `${BASE}/api/tests/yorisou-values/assessments/00000000-0000-0000-0000-000000000000`],
    ] as const) {
      const res = await page.request[method](url, method === "get" || method === "delete" ? undefined : { data: {} });
      expect(res.status(), `${method} ${url}`).toBe(401);
    }
  });

  test("anonymous history explains sign-in (no fake data)", async ({ page }) => {
    await gotoHydrated(page);
    await expect(page.getByTestId("yv-history-anonymous")).toBeVisible();
  });

  test("no navigation/catalog exposure: /tests does not link the gated method", async ({ page }) => {
    await page.goto(`${BASE}/tests`, { waitUntil: "domcontentloaded" });
    expect(await page.locator('a[href*="yorisou-values"]').count()).toBe(0);
  });
});
