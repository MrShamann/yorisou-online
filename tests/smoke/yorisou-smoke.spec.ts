import { test, expect } from "@playwright/test";

// Smoke tests — verify the app loads and key surfaces don't crash.
// Does not test product logic, personas, scoring, or business rules.
// Requires a running dev server: npm run dev

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("Homepage", () => {
  test("loads without error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(BASE);
    await page.waitForLoadState("domcontentloaded");

    expect(errors, `Runtime errors on homepage: ${errors.join(", ")}`).toHaveLength(0);
    await expect(page).toHaveTitle(/.+/);
  });

  test("mobile viewport loads", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    await page.waitForLoadState("domcontentloaded");

    // Page should have visible content
    const body = await page.locator("body").boundingBox();
    expect(body).not.toBeNull();
    expect(body!.height).toBeGreaterThan(0);
  });

  test("main CTA is present and visible", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("domcontentloaded");

    // Look for any prominent anchor or button — CTA structure agnostic
    const cta = page.locator("a[href], button").first();
    await expect(cta).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Public routes", () => {
  const publicRoutes = [
    "/",
    "/about",
    "/methodology",
    "/product",
    "/contact",
  ];

  for (const route of publicRoutes) {
    test(`${route} — does not crash`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });

      // Accept 200 or 404 (route may not exist yet), reject 500
      const status = res?.status() ?? 0;
      expect(status, `${route} returned server error ${status}`).not.toBe(500);
      expect(errors, `Runtime errors on ${route}: ${errors.join(", ")}`).toHaveLength(0);
    });
  }
});

test.describe("API health", () => {
  test("api routes respond (not 500)", async ({ request }) => {
    // Check a safe, read-only-style API route if one exists
    // This is a connectivity check only — not a functional test
    const res = await request.get(`${BASE}/api/auth`, { failOnStatusCode: false });
    // 200, 401, 404, 405 are all acceptable — 500 is not
    expect(res.status()).not.toBe(500);
  });
});
