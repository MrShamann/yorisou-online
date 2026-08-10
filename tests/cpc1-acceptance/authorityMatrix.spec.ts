import { expect, test } from "@playwright/test";

// CPC-1 acceptance — the frozen AUTHORITY MATRIX, observed in a real browser against Preview.
//
// "invalid / unauthorized / expired / erased stable UUID NEVER falls back to legacy · legacy
//  resultId cannot override · legacy overlay cannot fill a persisted null · legacy confidence
//  cannot change persisted limits · legacy payload cannot change persisted content."
//
// Each case pairs an inaccessible stable UUID with legacy parameters that would, if honoured,
// render a complete result. Rendering anything but the concealed state is a failure.

const INACCESSIBLE = "11111111-2222-4333-8444-555555555555";

const LEGACY_PAIRINGS = [
  { name: "legacy resultId", query: `resultId=MS-KI` },
  { name: "legacy overlay", query: `resultId=MS-KI&overlayId=balancing` },
  { name: "legacy confidence", query: `resultId=MS-KI&confidence=medium` },
  { name: "legacy payload key", query: `resultId=MS-KI&payloadKey=anything` },
];

test.describe("stable identity never falls back to legacy", () => {
  for (const pairing of LEGACY_PAIRINGS) {
    test(`/result conceals when an inaccessible UUID is paired with ${pairing.name}`, async ({ page }) => {
      await page.goto(`/result?result=${INACCESSIBLE}&${pairing.query}`, {
        waitUntil: "domcontentloaded",
      });
      const body = await page.locator("body").innerText();
      // The archetype nickname for MS-KI must never appear: honouring the legacy code here would
      // let anyone pair a guessed UUID with a public code and read a "result".
      expect(body).not.toContain("気配読み");
    });
  }

  test("a malformed stable identity is concealed rather than ignored", async ({ page }) => {
    await page.goto("/result?result=not-a-uuid&resultId=MS-KI", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("気配読み");
  });

  test("legacy-only mode still renders — the fallback is removed, not the legacy path", async ({ page }) => {
    // Guards against over-correction: without `?result`, legacy compatibility must still work.
    await page.goto("/result?resultId=MS-KI&overlayId=balancing", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body).toContain("気配読み");
  });
});

test.describe("recommendation destinations are server-enforced", () => {
  for (const route of ["/recommendations", "/recommendations/graph"]) {
    test(`${route} conceals an inaccessible identity typed directly`, async ({ page }) => {
      // Hiding a link on /result is not authorization; the destination must refuse on its own.
      await page.goto(`${route}?result=${INACCESSIBLE}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      expect(body).not.toContain("保存する");
      expect(body).not.toContain("役に立った");
    });
  }

  test("the private report download refuses an inaccessible identity", async ({ request }) => {
    const path = `/reports/self-understanding/MS-KI/download?result=${INACCESSIBLE}`;
    // maxRedirects: 0 — an automatically-followed redirect must never be mistaken for the route's
    // own answer. A 302 to an SSO page followed to a 200 would otherwise read as "the download
    // succeeded", which is the opposite of the truth.
    const response = await request.get(path, { maxRedirects: 0 });

    const status = response.status();
    const location = response.headers()["location"] ?? "<none>";
    const contentType = response.headers()["content-type"] ?? "<none>";
    const detail = `status=${status} location=${location} content-type=${contentType} url=${response.url()}`;

    // Distinguish the four outcomes explicitly rather than accepting any non-200.
    expect(status, `download redirected instead of refusing — ${detail}`).not.toBe(302);
    expect(status, `download redirected instead of refusing — ${detail}`).not.toBe(307);
    expect(
      contentType.includes("text/markdown"),
      `an inaccessible identity returned a markdown attachment — ${detail}`,
    ).toBe(false);

    // The canonical concealed response, once the deployment identity is confirmed.
    expect(status, `expected a concealed 404 — ${detail}`).toBe(404);
  });
});
