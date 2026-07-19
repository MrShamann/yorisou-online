import { readFileSync } from "node:fs";
import { join } from "node:path";

import { test, expect } from "@playwright/test";

// APP-2 — accessibility (WCAG 2 A + AA) on the NEW public surfaces. Inline
// axe-core injection (matches the prior packages' harness).
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const AXE = readFileSync(join(process.cwd(), "node_modules/axe-core/axe.min.js"), "utf8");

const SURFACES = [
  "/reports/family/imairo",
  "/reports/family/relationship-fatigue",
  "/line/recovery?code=expired",
];

for (const path of SURFACES) {
  test(`axe wcag2a+aa: ${path}`, async ({ page }) => {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    await page.addScriptTag({ content: AXE });
    const results = await page.evaluate(async () => {
      // @ts-expect-error injected global
      return await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa"] });
    });
    const violations = (results as { violations: { id: string; nodes: unknown[] }[] }).violations;
    if (violations.length) {
      console.log(path, JSON.stringify(violations.map((v) => v.id)));
    }
    expect(violations.length, `${path} axe violations: ${violations.map((v) => v.id).join(", ")}`).toBe(0);
  });
}
