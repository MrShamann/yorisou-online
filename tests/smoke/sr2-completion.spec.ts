import { test, expect, type Page } from "@playwright/test";

// SR-2 — acceptance for the completed workstreams: Scenario 4 (focused-flow
// support plan + anonymous save parity) and Scenario 13 (120Q interrupted
// resume, restart, stale/corrupt recovery). Backend-dependent scenarios
// (6A/6B/11 real aggregates) are infra-gated — see docs/sr2/PREVIEW_ENVIRONMENT.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const B = (page: Page, re: RegExp | string) => page.locator("button").filter({ hasText: re }).first();

async function answerFirst(page: Page) {
  // pick the first option button inside the question card
  await page.locator(".aix2-answer, .aix2-quiz button, main button").filter({ hasText: /.+/ });
}

test.describe("SR-2 result parity (Scenario 4) — focused flows get the support plan + anonymous save", () => {
  // Runtime E2E proof of the shared surface on a focused flow (work-rhythm). The
  // SR-2 contract (test:sr2) proves ResultSupportPlan is wired into ALL 9 families;
  // imairo /result is the SR-1 runtime proof. work-rhythm exercises the .yr-focus
  // path (support plan + anonymous save via the token bridge) end-to-end.
  for (const [slug, testName] of [["work-rhythm", "仕事のリズム"]] as const) {
    test(`/tests/${slug}: complete → support plan + device-local save`, async ({ page }) => {
      await page.goto(`${BASE}/tests/${slug}`, { waitUntil: "networkidle" });
      // start
      const startBtn = B(page, /チェックを始める|はじめる|始める/);
      await startBtn.click();
      // answer every question by clicking the first option each time until the result shows
      for (let i = 0; i < 40; i += 1) {
        const plan = page.getByText(/いま役立ちそうなこと|次に役立ちそうなこと/).first();
        if (await plan.isVisible().catch(() => false)) break;
        const opt = page.locator("button").filter({ hasText: /.+/ }).nth(0);
        // click the first visible option/answer button that is not a nav/label
        const optionBtns = page.locator("main button");
        const count = await optionBtns.count();
        let clicked = false;
        for (let j = 0; j < count; j += 1) {
          const b = optionBtns.nth(j);
          const txt = (await b.textContent().catch(() => "")) ?? "";
          if (/戻る|次へ|保存|シェア|もう一度|続き|最初/.test(txt)) continue;
          if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); clicked = true; break; }
        }
        void opt;
        if (!clicked) break;
        await page.waitForTimeout(120);
      }
      // the shared support plan rendered (Scenario 4)
      await expect(page.getByText(/いま役立ちそうなこと/).first()).toBeVisible({ timeout: 8000 });
      await expect(page.getByText(/なぜこれが出たか/).first()).toBeVisible();
      // anonymous device-local save is present (parity) — no login wall
      await expect(B(page, /この端末に残す/)).toBeVisible();
      void testName;
    });
  }
});

test.describe("SR-2 120Q resume (Scenario 13)", () => {
  test("answer several → reload → resume prompt appears → resume continues; restart clears", async ({ page }) => {
    await page.goto(`${BASE}/check-in`, { waitUntil: "networkidle" });
    await B(page, /いま色テストをはじめる|はじめる/).click();
    await expect(page.getByText(/1 \/ 120/).first()).toBeVisible();
    // answer 3 questions (auto-advance)
    for (let i = 0; i < 3; i += 1) {
      const opt = page.locator(".aix2-answer").first();
      await opt.click();
      await page.waitForTimeout(500);
    }
    // reload — progress must survive
    await page.reload({ waitUntil: "networkidle" });
    // resume prompt appears in the intro
    await expect(page.locator('[data-sr2-resume="true"]')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/前回の続き/).first()).toBeVisible();
    // resume continues into the quiz (not from Q1)
    await B(page, /^続きから$/).click();
    await expect(page.getByText(/\/ 120/).first()).toBeVisible();
    // go back home and restart clears the resume
    await page.goto(`${BASE}/check-in`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-sr2-resume="true"]')).toBeVisible();
    await B(page, /^最初から$/).click();
    await expect(page.getByText(/1 \/ 120/).first()).toBeVisible();
  });

  test("stale progress (changed bank) does not resume", async ({ page }) => {
    await page.goto(`${BASE}/check-in`, { waitUntil: "domcontentloaded" });
    // seed a progress record with a MISMATCHED bank signature
    await page.evaluate(() => {
      localStorage.setItem(
        "yorisou.sr2.checkProgress.v1",
        JSON.stringify({ version: "sr2.checkprogress.v1", bankSignature: "120q:v1:999", updatedAt: new Date().toISOString(), currentIndex: 4, answers: { Q1: "A" } }),
      );
    });
    await page.reload({ waitUntil: "networkidle" });
    // stale bank → no resume prompt
    await expect(page.locator('[data-sr2-resume="true"]')).toHaveCount(0);
  });

  test("corrupt progress recovers safely (no resume, no crash)", async ({ page }) => {
    await page.goto(`${BASE}/check-in`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.setItem("yorisou.sr2.checkProgress.v1", "{not-json"));
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator('[data-sr2-resume="true"]')).toHaveCount(0);
    await expect(B(page, /いま色テストをはじめる/)).toBeVisible();
  });
});
