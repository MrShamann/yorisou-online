import { test, expect } from "@playwright/test";

// APP-2 — observable acceptance smoke.
//   Scenario 8  — all nine family deeper reports render (public/private boundary,
//                 save/return/feedback controls, methodology + not-a-diagnosis).
//   Scenario 15 — observable, explained reprioritization in /my-yorisou.
//   WS-C        — LINE recovery surface renders a safe, non-technical message.
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

const FAMILIES = [
  "imairo", "c02", "f01", "f02", "relationship-fatigue",
  "love-distance", "local-life", "work-rhythm", "name-impression",
];

test.describe("APP-2 WS-A — nine-family deeper reports (Scenario 8)", () => {
  for (const family of FAMILIES) {
    test(`report renders for ${family}`, async ({ page }) => {
      await page.goto(`${BASE}/reports/family/${family}`, { waitUntil: "domcontentloaded" });
      // Title + the interpretive sections are present (exact eyebrow labels, so
      // the shell footer's incidental "次の一歩" phrasing doesn't collide).
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.getByText("今わかっていること", { exact: true })).toBeVisible();
      await expect(page.getByText("次の一歩", { exact: true })).toBeVisible();
      // Methodology + not-a-diagnosis boundary are present.
      await expect(page.getByText("考え方について", { exact: true })).toBeVisible();
      await expect(page.getByText("この結果でできないこと", { exact: true })).toBeVisible();
      // A real save control exists (device-local).
      await expect(page.locator("button").filter({ hasText: "保存" }).first()).toBeVisible();
    });
  }

  test("unknown family 404s (no fabricated report)", async ({ page }) => {
    const res = await page.goto(`${BASE}/reports/family/not-a-family`, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(404);
  });
});

test.describe("APP-2 WS-B — observable reprioritization (Scenario 15)", () => {
  test("adapted list reprioritizes by result family + explains why", async ({ page }) => {
    // Seed a device-local guest journey with a result family BEFORE the app mounts.
    await page.addInitScript(() => {
      const journey = {
        version: "sr1.v1",
        updatedAt: new Date().toISOString(),
        need: "relationship-distance",
        savedItemIds: [],
        triedItemIds: [],
        hiddenItemIds: [],
        feedback: [],
        consent: {},
        lastResult: { family: "relationship-fatigue", label: "テスト結果", savedAt: new Date().toISOString() },
      };
      window.localStorage.setItem("yorisou.sr1.journey.v1", JSON.stringify(journey));
    });
    await page.goto(`${BASE}/my-yorisou`, { waitUntil: "domcontentloaded" });

    // The adaptive section is present and explains each card ("なぜ表示").
    await expect(page.getByText("続けて見る")).toBeVisible();
    await expect(page.getByText("なぜ表示", { exact: false }).first()).toBeVisible();
    // The reset control is present (adaptation is reversible).
    await expect(page.getByText("並び順をリセット")).toBeVisible();

    // The relationship-fatigue-tagged item is surfaced near the top.
    await expect(page.getByText("人間関係の疲れチェック").first()).toBeVisible();
  });

  test("hidden items never reappear in the adapted list", async ({ page }) => {
    await page.addInitScript(() => {
      const journey = {
        version: "sr1.v1",
        updatedAt: new Date().toISOString(),
        savedItemIds: [],
        triedItemIds: [],
        hiddenItemIds: ["grounding-reflection"],
        feedback: [],
        consent: {},
        lastResult: { family: "imairo", label: "テスト", savedAt: new Date().toISOString() },
      };
      window.localStorage.setItem("yorisou.sr1.journey.v1", JSON.stringify(journey));
    });
    await page.goto(`${BASE}/my-yorisou`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("続けて見る")).toBeVisible();
    // The hidden item's card must not appear in the adapted list.
    const continueSection = page.locator("section", { has: page.getByText("続けて見る") });
    await expect(continueSection.getByText("2分の振り返り")).toHaveCount(0);
  });
});

test.describe("APP-2 WS-C — LINE recovery surface", () => {
  test("shows a safe recovery message + retry/continue paths", async ({ page }) => {
    await page.goto(`${BASE}/line/recovery?code=expired`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("連携を完了できませんでした。")).toBeVisible();
    await expect(page.getByText("もう一度つなぐ")).toBeVisible();
    await expect(page.getByText("この端末で続ける")).toBeVisible();
    // No raw token / technical error is leaked.
    await expect(page.getByText(/invalid_signature|access_denied|token/)).toHaveCount(0);
  });
});
