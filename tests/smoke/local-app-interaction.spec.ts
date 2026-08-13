// YORISOU LOCAL APP — interaction acceptance against the INSTALLED local runtime.
//
// Requires a running local app: `open ~/Applications/YORISOU.app` (or `npm run local-app:start`).
// It is deliberately NOT in the default battery — it asserts against a live loopback server on this
// machine, and a test that silently passes when nothing is running would be worse than absent.
//
// Run: npm run local-app:accept
import { test, expect } from "@playwright/test";
const U = "http://127.0.0.1:3211";

test("new user: Today -> light check-in -> outcome -> return to Today with real continuity", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(`${U}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });

  // A brand-new visitor must see NO invented history.
  await expect(page.getByText("最近の気づき")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /今の気分から/ })).toBeVisible();

  await page.getByRole("link", { name: "今の気配を見る" }).click();
  await expect(page.getByText("いま、どんな感じですか。")).toBeVisible();

  await page.getByRole("button", { name: "なんとなく重い" }).click();
  await page.getByRole("button", { name: "少し休みたい" }).click();

  // The outcome reflects the person's own words back, and claims nothing else.
  await expect(page.getByText("少し休みたい、という気持ちがあるようです。")).toBeVisible();

  const stored = await page.evaluate(() =>
    localStorage.getItem("yorisou.pxr1.currentStateCheckIn.v1"));
  expect(stored).toContain('"state":"heavy"');
  expect(stored).toContain('"intent":"rest"');

  // Return to Today: continuity now exists and is the person's own words.
  await page.goto(`${U}/`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("最近の気づき")).toBeVisible();
  await expect(page.getByText("なんとなく重い。少し休みたい。")).toBeVisible();

  // Survives a reload — device-local persistence, not in-memory state.
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByText("なんとなく重い。少し休みたい。")).toBeVisible();

  // No crash loop: Today rendered WITH a record present (the regression that shipped once).
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.reload({ waitUntil: "networkidle" });
  expect(errors.filter((e) => /Maximum update depth/.test(e))).toEqual([]);
});

test("the app serves the local release, not a hosted deployment", async ({ page }) => {
  const res = await page.request.get(`${U}/api/build-identity`);
  const body = await res.json();
  expect(body.environment).toBe("development");
  expect(body.commitSha).toBeNull();
  expect(body.localRelease.sha).toMatch(/^[0-9a-f]{40}$/);
  expect(body.localRelease.path).toContain("/Volumes/AI-Work/Runtimes/yorisou/releases/");
});
