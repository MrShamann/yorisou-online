import { expect, test } from "@playwright/test";

// CPC-1 acceptance — BROWSER-LEVEL proof that anonymous /line/mini-app reads nothing private.
//
// Source-level assertions already prove the module does not import or render the private paths.
// They cannot prove what the running page actually requests: a component three levels down, a
// client effect, or a prefetch could still reach a private endpoint. This observes the network.
//
// Runs against the hosted Preview deployment (PLAYWRIGHT_BASE_URL), per the frozen contract's
// "real isolated Preview — not mocks, not local-only".

const FORBIDDEN_PATTERNS = [
  "/api/open-testing/recommendations", // legacy device-local recommendation package
  "/api/recommendations",              // canonical set + mutations
  "/api/assessment/results",           // canonical result context, claim, response, erase
];

test.describe("anonymous LINE entry performs no private read", () => {
  test("issues no request to any canonical or legacy private endpoint", async ({ page }) => {
    // Capture enough to CLASSIFY the request, not merely to fail. A finding that says only
    // "something matched" cannot distinguish a genuine private read from an over-broad pattern,
    // and that distinction decides whether product code or the test changes.
    const observed: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (FORBIDDEN_PATTERNS.some((p) => url.pathname.startsWith(p))) {
        observed.push(
          `${request.method()} ${url.pathname}${url.search} [${request.resourceType()}]`,
        );
      }
    });

    await page.goto("/line/mini-app", { waitUntil: "networkidle" });
    // Client effects and deferred fetches settle after networkidle in practice; give them room
    // rather than asserting on an instant that may simply be too early to be meaningful.
    await page.waitForTimeout(2000);

    expect(observed, `anonymous entry must not read private state: ${observed.join(", ")}`)
      .toEqual([]);
  });

  test("renders no previous-history claim and offers only the check-in entry", async ({ page }) => {
    await page.goto("/line/mini-app", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();

    for (const claim of ["前回の続き", "前回のチェック", "最近の入口", "最近の診断"]) {
      expect(body, `must not claim ${claim}`).not.toContain(claim);
    }
    await expect(page.getByText("120問から始める")).toBeVisible();
  });

  test("a malformed result identity is concealed, never downgraded to anonymous content", async ({ page }) => {
    // Presence of `?result` selects canonical mode exclusively. A malformed value must not fall
    // through to the anonymous surface, which would leak that the parameter was simply ignored.
    await page.goto("/line/mini-app?result=not-a-uuid", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("120問から始める");
  });

  test("a well-formed but unowned result identity is concealed", async ({ page }) => {
    const observed: number[] = [];
    page.on("response", (r) => {
      if (new URL(r.url()).pathname === "/line/mini-app") observed.push(r.status());
    });
    await page.goto("/line/mini-app?result=11111111-2222-4333-8444-555555555555", {
      waitUntil: "domcontentloaded",
    });
    const body = await page.locator("body").innerText();
    // Identical concealed state for missing / erased / unauthorized / cross-owner.
    expect(body).not.toContain("120問から始める");
    expect(body).not.toContain("役に立った");
  });
});
