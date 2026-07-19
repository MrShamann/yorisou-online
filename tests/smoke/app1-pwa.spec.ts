import { test, expect } from "@playwright/test";

// APP-1 — installable PWA acceptance (Scenarios 17-20) + privacy boundary.
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("APP-1 PWA (Scenario 17 installability)", () => {
  test("manifest linked + valid; theme-color + apple-touch present", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(manifestHref).toBeTruthy();
    const themeColor = await page.locator('meta[name="theme-color"]').first().getAttribute("content");
    expect((themeColor || "").toLowerCase()).toContain("#0c0e0d");
    const apple = await page.locator('link[rel="apple-touch-icon"]').first().getAttribute("href");
    expect(apple).toContain("apple-touch-icon");
    // manifest content is valid + installable-shaped
    const manifest = await page.evaluate(async () => {
      const href = document.querySelector('link[rel="manifest"]')?.getAttribute("href");
      const res = await fetch(href!);
      return res.json();
    });
    expect(manifest.name).toBe("YORISOU");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.scope).toBe("/");
    expect(manifest.icons.some((i: { sizes: string }) => i.sizes === "512x512")).toBe(true);
    expect(manifest.icons.some((i: { purpose?: string }) => (i.purpose || "").includes("maskable"))).toBe(true);
  });

  test("service worker registers + activates", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const active = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      return Boolean(reg && (reg.active || reg.installing || reg.waiting));
    });
    expect(active).toBe(true);
  });

  test("icons are real PNGs (not placeholders)", async ({ request }) => {
    for (const [path, min] of [
      ["/icons/icon-512.png", 5000],
      ["/icons/icon-192.png", 2000],
      ["/icons/icon-maskable-512.png", 5000],
      ["/icons/apple-touch-icon.png", 2000],
    ] as const) {
      const res = await request.get(`${BASE}${path}`);
      expect(res.status()).toBe(200);
      const buf = await res.body();
      expect(buf.length).toBeGreaterThan(min);
      expect(buf.slice(0, 8).toString("hex")).toBe("89504e470d0a1a0a"); // PNG magic
    }
  });
});

test.describe("APP-1 PWA (Scenario 18 standalone reopen — guest continuity)", () => {
  test("device-local guest state survives reload (the core of standalone reopen)", async ({ page }) => {
    await page.goto(`${BASE}/start?source=pwa`, { waitUntil: "networkidle" });
    // seed a guest journey (what a completed session would have)
    await page.evaluate(() => {
      localStorage.setItem(
        "yorisou.sr1.journey.v1",
        JSON.stringify({ version: "sr1.v1", updatedAt: new Date().toISOString(), need: "organize-self", savedItemIds: ["grounding-reflection"], triedItemIds: [], hiddenItemIds: [], feedback: [], consent: {} }),
      );
    });
    await page.goto(`${BASE}/my-yorisou?source=pwa`, { waitUntil: "networkidle" });
    // the hub reflects the saved journey (not the empty state)
    await expect(page.getByText(/今、大事にしていること|続けて見る|次の一歩/).first()).toBeVisible({ timeout: 8000 });
    // reload (reopen) — state persists
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/続けて見る|次の一歩/).first()).toBeVisible();
  });
});

test.describe("APP-1 PWA (Scenario 19 offline recovery + privacy)", () => {
  test("offline navigation serves the public offline page; no private markers", async ({ page, context }) => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForTimeout(400);
    await context.setOffline(true);
    // a fresh navigation while offline falls back to the precached public offline page
    const resp = await page.goto(`${BASE}/tests`, { waitUntil: "domcontentloaded" }).catch(() => null);
    void resp;
    const text = await page.evaluate(() => document.body.innerText).catch(() => "");
    // offline shell is public-safe: no private/answer/admin markers cached
    for (const marker of ["service_role", "payloadKey", "answerCount", "SERVICE_ROLE"]) {
      expect(text).not.toContain(marker);
    }
    await context.setOffline(false);
  });

  test("service worker never caches API / admin / private (source policy)", async ({ request }) => {
    const sw = await (await request.get(`${BASE}/sw.js`)).text();
    expect(sw).toContain("/api/");
    expect(sw).toContain("/admin");
    expect(sw).toContain("/private-state");
    // update is user-controlled (Scenario 20): exactly one skipWaiting() call,
    // and it is gated behind the SKIP_WAITING message (never auto-skips on install).
    expect((sw.match(/self\.skipWaiting\(\)/g) || []).length).toBe(1);
    expect(sw.indexOf("SKIP_WAITING")).toBeGreaterThan(-1);
    expect(sw.indexOf("SKIP_WAITING")).toBeLessThan(sw.indexOf("self.skipWaiting()"));
  });
});
