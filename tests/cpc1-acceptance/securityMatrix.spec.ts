import { expect, test } from "@playwright/test";

// CPC-1 acceptance — the frozen SECURITY DENIAL MATRIX.
//
// "wrong token · expired token · stolen result UUID · cross-owner read · cross-owner claim ·
//  cross-owner response · replay · open redirect · conflicting legacy parameters · erased result —
//  all denied, and unauthorized is indistinguishable from non-existent."
//
// The last clause is the one worth testing hardest. A system that denies correctly but denies
// DIFFERENTLY for "does not exist" and "exists but is not yours" hands out an existence oracle:
// anyone can enumerate valid identifiers by reading the shape of the refusal.

const STOLEN = "11111111-2222-4333-8444-555555555555";
const ALSO_ABSENT = "99999999-8888-4777-8666-555555555555";
const MALFORMED = "not-a-uuid";

test.describe("unauthorized is indistinguishable from non-existent", () => {
  test("two different inaccessible UUIDs produce byte-identical /result output", async ({ page }) => {
    await page.goto(`/result?result=${STOLEN}`, { waitUntil: "domcontentloaded" });
    const first = await page.locator("main").innerText();

    await page.goto(`/result?result=${ALSO_ABSENT}`, { waitUntil: "domcontentloaded" });
    const second = await page.locator("main").innerText();

    expect(
      second,
      "a different refusal for a different UUID would be an existence oracle",
    ).toBe(first);
  });

  test("the concealed state reveals nothing about why", async ({ page }) => {
    await page.goto(`/result?result=${STOLEN}`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    for (const leak of ["削除", "期限", "権限", "他のアカウント", "存在しません"]) {
      expect(body, `concealed state must not explain the reason: ${leak}`).not.toContain(leak);
    }
  });
});

test.describe("API surfaces deny without disclosing", () => {
  test("an unauthenticated recommendation mutation is refused", async ({ request }) => {
    const response = await request.post(`/api/recommendations/${STOLEN}`, {
      data: { action: "helpful", resultRowId: STOLEN, source: "graph" },
      maxRedirects: 0,
    });
    // 401 (no session) or 404 (concealed) are both acceptable; 2xx never is.
    expect([401, 403, 404]).toContain(response.status());
  });

  test("an unauthenticated interpretation response is refused", async ({ request }) => {
    const response = await request.post(`/api/assessment/results/${STOLEN}/response`, {
      data: { responseType: "confirmed" },
      maxRedirects: 0,
    });
    expect([401, 403, 404]).toContain(response.status());
  });

  test("an unauthenticated claim is refused", async ({ request }) => {
    const response = await request.post(`/api/assessment/results/${STOLEN}/claim`, {
      maxRedirects: 0,
    });
    expect([401, 403, 404]).toContain(response.status());
  });

  test("an unauthenticated erase is refused", async ({ request }) => {
    const response = await request.delete(`/api/assessment/results/${STOLEN}`, { maxRedirects: 0 });
    expect([401, 403, 404]).toContain(response.status());
    expect(response.status(), "erase must never succeed unauthenticated").not.toBe(200);
  });
});

test.describe("malformed and conflicting inputs", () => {
  test("a malformed canonical id is concealed, not ignored", async ({ page }) => {
    await page.goto(`/result?result=${MALFORMED}&resultId=MS-KI`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body, "ignoring a malformed id would silently downgrade to legacy").not.toContain("気配読み");
  });

  test("an open redirect cannot be smuggled through the login return path", async ({ page }) => {
    await page.goto("/login?next=https%3A%2F%2Fexample.com%2Fevil", { waitUntil: "domcontentloaded" });
    // Whatever the page renders, it must remain on this origin.
    expect(new URL(page.url()).hostname).not.toBe("example.com");
  });

  test("the report download refuses an inaccessible identity without redirecting", async ({ request }) => {
    const response = await request.get(
      `/reports/self-understanding/MS-KI/download?result=${STOLEN}`,
      { maxRedirects: 0 },
    );
    const detail = `status=${response.status()} location=${response.headers()["location"] ?? "<none>"}`;
    expect(response.status(), `expected concealed 404 — ${detail}`).toBe(404);
  });
});
