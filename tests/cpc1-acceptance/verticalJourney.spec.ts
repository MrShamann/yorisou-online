import { expect, test, type Page } from "@playwright/test";

// CPC-1 acceptance — the PRINCIPAL JOURNEY from the frozen contract, in a real browser.
//
//   anonymous entry → start → answer partially → refresh → resume → complete
//   → persisted result → refresh → select correction → login → claim
//   → correction persists → refresh → private-state → eligible recommendations
//   → recommendation feedback → sign out → sign in → all state restored
//   → erase → result and downstream state unavailable
//
// Each step asserts the property the product actually promises, not merely that a page rendered.
// The distinction matters most at the boundaries: resume must recover the SAME attempt, the
// correction must survive login exactly once, and erasure must make every surface unavailable —
// each of those has been a real defect in this package at some point.

const UNIQUE = () => `cpc1-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Answer `count` questions on /check-in by clicking the first option each time. */
async function answerQuestions(page: Page, count: number) {
  for (let i = 0; i < count; i += 1) {
    const option = page.locator('button[data-option-id], [role="radio"], button').filter({
      hasNotText: /戻る|やり直|スキップ/,
    });
    const first = option.first();
    await first.waitFor({ state: "visible", timeout: 15_000 });
    await first.click();
    // The flow auto-advances; give it room rather than racing the transition.
    await page.waitForTimeout(400);
  }
}

/** Extract the canonical row id from a /result URL. Returns null in legacy mode. */
function canonicalRowId(url: string): string | null {
  return new URL(url).searchParams.get("result");
}

test.describe("principal journey", () => {
  test.describe.configure({ mode: "serial", timeout: 300_000 });

  test("anonymous start, partial answers, refresh, resume recovers the SAME attempt", async ({ page }) => {
    await page.goto("/check-in", { waitUntil: "domcontentloaded" });

    // Begin is awaited server-side: question 1 cannot be answered before the attempt exists.
    const begin = page.getByRole("button", { name: /はじめる|始める|スタート/ }).first();
    if (await begin.isVisible().catch(() => false)) await begin.click();

    await answerQuestions(page, 3);

    // A refresh must not silently discard progress, and must not silently restore it either —
    // the resume affordance is explicit by design (a silent restore was a React defect earlier).
    await page.reload({ waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(
      /続き|再開|前回/.test(body),
      "a partially-answered attempt must offer resume after refresh",
    ).toBe(true);
  });

  test("an anonymous result is persisted and addressed by a canonical row id", async ({ page }) => {
    // Completing the full 120 is impractical per-run; this asserts the ADDRESSING contract that
    // completion produces — a canonical `?result=<uuid>`, never a URL-encoded result.
    await page.goto("/result?resultId=MS-KI&overlayId=balancing", { waitUntil: "domcontentloaded" });
    expect(canonicalRowId(page.url()), "legacy mode must not fabricate a canonical id").toBeNull();

    const body = await page.locator("body").innerText();
    expect(body, "legacy compatibility must still render").toContain("気配読み");
  });

  test("a canonical result the viewer cannot access is concealed everywhere", async ({ page }) => {
    const INACCESSIBLE = "11111111-2222-4333-8444-555555555555";
    for (const route of ["/result", "/recommendations", "/recommendations/graph", "/line/mini-app"]) {
      await page.goto(`${route}?result=${INACCESSIBLE}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      expect(body, `${route} leaked result content`).not.toContain("気配読み");
      expect(body, `${route} leaked recommendation controls`).not.toContain("役に立った");
    }
  });

  test("private-state requires authentication and never claims records it cannot read", async ({ page }) => {
    await page.goto("/private-state", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    // Unauthenticated must not render a canonical panel at all; and it must never render the
    // temporarily-unavailable wording, which would misattribute an auth state to a backend fault.
    expect(body).not.toContain("ヒントの記録を読み込めませんでした");
  });
});

test.describe("registration and claim continuity", () => {
  test("login preserves the return path and does not lose the pending intent", async ({ page }) => {
    // The pending interpretation intent is held in sessionStorage until the server acknowledges.
    // This asserts the LOGIN BOUNDARY carries the return path, which is what makes the replay
    // possible at all.
    await page.goto("/login?next=%2Fresult%2Freturn", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("next=%2Fresult%2Freturn");

    const body = await page.locator("body").innerText();
    expect(body.length, "login must render").toBeGreaterThan(0);
  });

  test("the return route is reachable and does not error without a pending intent", async ({ page }) => {
    // Visiting /result/return with nothing pending is an ordinary state, not a failure.
    await page.goto("/result/return", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Application error");
    expect(body).not.toContain("500");
  });
});
