import { test, expect } from "@playwright/test";

// RTR-1 regression — private save loop on /result.
// Runs without Supabase credentials: the auth gate (401) fires before any
// store access, so the unauthenticated lifecycle is fully exercisable.
// Requires a running dev server.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const RESULT_URL = `${BASE}/result?resultId=MS-KI`;

test.describe("/result private save (RTR-1)", () => {
  test("save section renders only for a real result", async ({ page }) => {
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("imairo-private-save")).toBeVisible();

    await page.goto(`${BASE}/result`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("imairo-private-save")).toHaveCount(0);
  });

  test("anonymous save is denied by the API and routes to login with the return path", async ({ page }) => {
    // API-level denial: anonymous POST must 401 and leak nothing.
    const apiResponse = await page.request.post(`${BASE}/api/tests/imairo/results`, {
      data: { resultId: "MS-KI" },
    });
    expect(apiResponse.status()).toBe(401);
    const body = await apiResponse.json();
    expect(body).toEqual({ error: "authentication_required" });

    // UI-level: clicking save while anonymous stores the pending context and
    // offers login/LINE, both preserving /result/return.
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "この結果を保存する" }).click();
    const loginLink = page.getByRole("link", { name: "ログインして保存する" });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", /next=%2Fresult%2Freturn/);
    await expect(page.getByRole("link", { name: "LINEでログイン" })).toHaveAttribute(
      "href",
      /returnTo=%2Fresult%2Freturn/,
    );
    const pending = await page.evaluate(() => window.sessionStorage.getItem("yorisou.imairo.pending-save.v1"));
    expect(pending).toContain("MS-KI");
  });

  test("return page without a pending save shows the safe fallback", async ({ page }) => {
    await page.goto(`${BASE}/result/return`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("保存する結果が見つかりませんでした。")).toBeVisible();
    await expect(page.getByRole("link", { name: "結果ページに戻る" })).toHaveAttribute("href", "/result");
  });

  test("return page re-posts a pending save and surfaces the failure state honestly when unauthenticated", async ({ page }) => {
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      window.sessionStorage.setItem(
        "yorisou.imairo.pending-save.v1",
        JSON.stringify({ context: { resultId: "MS-KI", overlayId: null, confidence: "low", payloadKey: null }, createdAt: Date.now() }),
      );
    });
    await page.goto(`${BASE}/result/return`, { waitUntil: "domcontentloaded" });
    // Unauthenticated → the POST fails → the page must say so, not pretend success.
    await expect(page.getByText("結果を保存できませんでした。")).toBeVisible();
    await expect(page.getByRole("link", { name: "結果ページに戻る" })).toHaveAttribute("href", /resultId=MS-KI/);
    // Pending context is consumed (single-shot token semantics).
    const pending = await page.evaluate(() => window.sessionStorage.getItem("yorisou.imairo.pending-save.v1"));
    expect(pending).toBeNull();
  });

  test("public result page and share surface never expose private-state markers", async ({ page }) => {
    for (const url of [RESULT_URL, `${BASE}/result/share?resultId=MS-KI`]) {
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const html = await page.content();
      expect(html).not.toContain("snapshot_context");
      expect(html).not.toContain("owner_account_id");
    }
  });

  test("save section is keyboard-reachable and does not disturb the reveal (YRR-1)", async ({ page }) => {
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });
    const saveButton = page.getByRole("button", { name: "この結果を保存する" });
    await expect(saveButton).toBeVisible();
    await saveButton.focus();
    await expect(saveButton).toBeFocused();
    // The save section must not live inside an aria-hidden or inert stage.
    const isolated = await saveButton.evaluate(
      (el) => el.closest('[aria-hidden="true"]') === null && el.closest("[inert]") === null,
    );
    expect(isolated).toBe(true);
  });
});
