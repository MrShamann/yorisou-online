import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

// PXR-1 — accessibility gate for the refounded consumer surfaces.
//
// The bar is serious = 0 and critical = 0 on every rebuilt surface, at the phone width the product
// is designed for and at the desktop width where its layout changes most. Moderate and minor
// findings are reported rather than failed: they are worth reading, but failing on them would make
// the gate noisy enough to be ignored, which is worse than not having it.
//
// Requires a running dev server (PLAYWRIGHT_BASE_URL, default http://localhost:3000).

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

const SURFACES = [
  { name: "今日", path: "/" },
  { name: "気づく", path: "/notice" },
  { name: "探す", path: "/explore" },
  { name: "わたし", path: "/me" },
  { name: "今の気配 (light check-in)", path: "/today/check-in" },
  { name: "いま色テスト entry", path: "/tests/ima-iro" },
  { name: "canonical Result", path: "/result?resultId=MS-KI&confidence=medium" },
] as const;

const WIDTHS = [
  { label: "390", width: 390, height: 844 },
  { label: "1440", width: 1440, height: 900 },
] as const;

for (const surface of SURFACES) {
  for (const viewport of WIDTHS) {
    test(`${surface.name} @ ${viewport.label} has no serious or critical violations`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE}${surface.path}`, { waitUntil: "domcontentloaded" });

      // The Result staggers its sections in. Let the reveal finish so the scan covers the whole
      // page rather than whichever stages happened to be visible when axe ran.
      const skip = page.getByRole("button", { name: "すべて表示" });
      if (await skip.isVisible().catch(() => false)) {
        await skip.click().catch(() => {});
      }
      await page.waitForTimeout(600);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      const advisory = results.violations.filter(
        (v) => v.impact !== "serious" && v.impact !== "critical",
      );

      if (advisory.length > 0) {
        console.log(
          `[a11y] ${surface.name} @ ${viewport.label} advisory: ` +
            advisory.map((v) => `${v.id}(${v.impact}, ${v.nodes.length})`).join(", "),
        );
      }

      expect(
        blocking.map((v) => `${v.id} [${v.impact}] ${v.nodes.length} node(s): ${v.help}`),
      ).toEqual([]);
    });
  }
}
