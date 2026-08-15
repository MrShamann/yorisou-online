import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

// Design-alignment a11y check for the two Life OS surfaces this review touched:
// the hub (which gained a second entry point) and the reflection flow in BOTH modes.
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const SURFACES = [
  { name: "/life hub", path: "/life" },
  { name: "/life/reflect light", path: "/life/reflect" },
  { name: "/life/reflect postmortem", path: "/life/reflect?mode=postmortem" },
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
      await page.waitForTimeout(1200);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      for (const v of blocking) console.log(`BLOCKING ${surface.path} ${viewport.label}: ${v.id} — ${v.help} (${v.nodes.length})`);
      for (const v of results.violations.filter((v) => !blocking.includes(v))) console.log(`note ${surface.path}: ${v.impact} ${v.id}`);
      expect(blocking, JSON.stringify(blocking.map((v) => v.id))).toEqual([]);
    });
  }
}
