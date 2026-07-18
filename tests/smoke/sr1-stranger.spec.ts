import { test, expect, type Page } from "@playwright/test";

// SR-1 — Stranger Acceptance Scenarios (the anonymous / device-local subset that
// is verifiable without provisioning production env). Scenarios that require a
// real backend (guest→account/LINE upgrade E2E, real-backend API failure,
// founder ops with real aggregates) are documented as env-gated in
// docs/sr1/STRANGER_READY_CAPABILITY_AUDIT.md §E and are NOT asserted here.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

async function chooseFirstNeed(page: Page) {
  // Step 1 — ordinary-language needs are real buttons
  await expect(page.getByText("今、どうしたいですか", { exact: false })).toBeVisible();
  await page.locator("button").filter({ hasText: "今の自分を整理したい" }).first().click();
}

test.describe("SR-1 anonymous-first service", () => {
  test("Scenario 1: zero-context visitor understands + routes from an ordinary need (no login)", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    // homepage primary CTA routes through the service router
    const cta = page.getByRole("link", { name: "今の自分から始める" }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/start");
    await page.goto(`${BASE}/start`, { waitUntil: "domcontentloaded" });
    await chooseFirstNeed(page);
    // Step 2 — pace, then a real destination card with a working CTA to a real route.
    // organize-self + quick → the 2分の振り返り guided experience (a real anonymous path).
    await page.locator("button").filter({ hasText: /軽く/ }).first().click();
    const dest = page.locator('a[href="/experiences/guided/grounding-reflection"]').first();
    await expect(dest).toBeVisible();
  });

  test("Scenario 2: a visitor who refuses the full test still gets a completable guided experience", async ({ page }) => {
    await page.goto(`${BASE}/experiences/guided/grounding-reflection`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("これは診断ではありません", { exact: false })).toBeVisible();
    await page.locator("button").filter({ hasText: "はじめる" }).first().click();
    // step through to completion
    for (let i = 0; i < 6; i += 1) {
      const next = page.locator("button").filter({ hasText: /次へ|おえる|終える|完了/ });
      if (await next.first().isVisible().catch(() => false)) {
        await next.first().click();
        await page.waitForTimeout(120);
      } else break;
    }
    // a post-completion control exists (tried / useful) → no dead end
    await expect(page.locator("button").filter({ hasText: /試した|役に立った/ }).first()).toBeVisible();
  });

  test("Scenario 3+5: result → support plan + device-local save → /my-yorisou shows it → clear", async ({ page }) => {
    await page.goto(`${BASE}/result?resultId=MS-KI`, { waitUntil: "domcontentloaded" });
    // support plan sections render
    await expect(page.getByText("いま役立ちそうなこと", { exact: false })).toBeVisible();
    await expect(page.getByText("なぜこれが出たか", { exact: false })).toBeVisible();
    // device-local save
    const saveBtn = page.locator("button").filter({ hasText: "この端末に残す" }).first();
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await expect(page.getByText(/この端末に残しています/)).toBeVisible();
    // return: the saved state surfaces on the personal hub
    await page.goto(`${BASE}/my-yorisou`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("今の状態", { exact: false }).first()).toBeVisible();
    // clear control exists (device-local control)
    await expect(page.locator("button").filter({ hasText: /この端末の記録を削除/ }).first()).toBeVisible();
  });

  test("Scenario 7: /recommendations with no result gives a real first-visit next step (no dead end)", async ({ page }) => {
    await page.goto(`${BASE}/recommendations`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("はじめての方へ", { exact: false })).toBeVisible();
    const start = page.getByRole("link", { name: "今の自分から始める" }).first();
    await expect(start).toBeVisible();
    await expect(start).toHaveAttribute("href", "/start");
  });

  test("Scenario 9: shared-result visitor sees no private markers", async ({ page }) => {
    await page.goto(`${BASE}/result/share?resultId=MS-KI`, { waitUntil: "domcontentloaded" });
    const html = await page.content();
    for (const marker of ["service_role", "payloadKey", "answerCount", "rawAnswers"]) {
      expect(html, `${marker} must not leak on the shared result`).not.toContain(marker);
    }
  });

  test("Scenario 10: /start is keyboard-operable (needs are real buttons)", async ({ page }) => {
    await page.goto(`${BASE}/start`, { waitUntil: "networkidle" });
    const firstNeed = page.locator("button").filter({ hasText: "今の自分を整理したい" }).first();
    await firstNeed.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("button").filter({ hasText: /軽く|しっかり/ }).first()).toBeVisible();
  });

  test("Scenario 12: /start renders needs server-side (no JS / no WebGL)", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/start`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("今の自分を整理したい", { exact: false })).toBeVisible();
    await ctx.close();
  });

  test("truthfulness: /reports/sample has no fabricated locked-content", async ({ page }) => {
    await page.goto(`${BASE}/reports/sample`, { waitUntil: "domcontentloaded" });
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).not.toContain("残り12章");
    expect(text).not.toContain("🔒");
    expect(text).toContain("無料で読めます");
  });
});
