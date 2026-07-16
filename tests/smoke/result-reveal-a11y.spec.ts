import { test, expect } from "@playwright/test";

// YRR-1 regression — /result staged reveal must never expose a focusable
// element inside an aria-hidden subtree (axe rule: aria-hidden-focus),
// at any point in the reveal lifecycle. Requires a running dev server.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const RESULT_URL = `${BASE}/result?resultId=MS-KI`;

// Mirrors the axe aria-hidden-focus check: a focusable element is a
// violation when it sits under aria-hidden="true" and no inert ancestor
// removes it from the tab order.
async function ariaHiddenFocusOffenders(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const sel = "a[href], button, input, select, textarea, [tabindex]";
    const offenders: string[] = [];
    for (const hidden of Array.from(document.querySelectorAll('[aria-hidden="true"]'))) {
      for (const node of Array.from(hidden.querySelectorAll(sel))) {
        const el = node as HTMLElement;
        if (el.closest("[inert]") === null && el.tabIndex >= 0) {
          offenders.push(`${el.tagName.toLowerCase()}:${el.getAttribute("href") ?? el.textContent?.slice(0, 30) ?? ""}`);
        }
      }
    }
    return offenders;
  });
}

test.describe("/result staged reveal accessibility (YRR-1)", () => {
  test("no aria-hidden-focus across the reveal lifecycle", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });

    const skip = page.getByRole("button", { name: "すべて表示" });
    const stagingActive = await skip
      .waitFor({ state: "visible", timeout: 8_000 })
      .then(() => true)
      .catch(() => false);

    if (stagingActive) {
      // Sample repeatedly through the reveal window until it completes.
      const deadline = Date.now() + 12_000;
      while (Date.now() < deadline) {
        expect(await ariaHiddenFocusOffenders(page)).toEqual([]);
        if (!(await skip.isVisible().catch(() => false))) break;
        await page.waitForTimeout(200);
      }
    }

    // Steady state: still clean.
    expect(await ariaHiddenFocusOffenders(page)).toEqual([]);
  });

  test("stages become focusable again once revealed", async ({ page }) => {
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });

    // Let the full reveal finish (skip control disappears when done),
    // then the last stage's links must be reachable (inert removed).
    const skip = page.getByRole("button", { name: "すべて表示" });
    await skip.waitFor({ state: "visible", timeout: 8_000 }).catch(() => {});
    await skip.waitFor({ state: "hidden", timeout: 15_000 }).catch(() => {});

    const contactLink = page.locator('a[href*="/contact"]').first();
    await expect(contactLink).toBeVisible();
    const focusable = await contactLink.evaluate(
      (el) => el.closest("[inert]") === null && el.closest('[aria-hidden="true"]') === null,
    );
    expect(focusable).toBe(true);
  });

  test("skip control reveals everything immediately and stays clean", async ({ page }) => {
    await page.goto(RESULT_URL, { waitUntil: "domcontentloaded" });

    const skip = page.getByRole("button", { name: "すべて表示" });
    const stagingActive = await skip
      .waitFor({ state: "visible", timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    test.skip(!stagingActive, "staging inactive in this environment (reduced motion / low power)");

    await skip.click();
    await expect(skip).toBeHidden();
    expect(await ariaHiddenFocusOffenders(page)).toEqual([]);
    const hiddenStageCount = await page
      .locator('[aria-hidden="true"] a[href*="/reports/"], [inert] a[href*="/reports/"]')
      .count();
    expect(hiddenStageCount).toBe(0);
  });
});
