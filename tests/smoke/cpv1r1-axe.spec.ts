import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { test, expect } from "@playwright/test";

// CPV1-R1 §11 — FRESH accessibility gate (not inherited from a prior package).
//
// R1 §§7–10 changed only lib/contract modules (understanding / consent / history /
// deploymentContext); no user-facing route markup changed (verified: git diff
// e46ba43^..HEAD touches no app/**/*.tsx). This spec re-proves the core reflective
// surfaces the platform depends on are still clean under a fresh axe run so R1 does
// not regress accessibility. It gates on IMPACT: 0 critical + 0 serious across
// mobile / tablet / desktop, with the full result JSON written to the R1 evidence
// tree for audit. Best-practice rules cover headings (page-has-heading-one),
// landmarks (landmark-one-main / region), link names (link-name) and touch target
// size (target-size); we additionally run once under prefers-reduced-motion.
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const AXE = readFileSync(join(process.cwd(), "node_modules/axe-core/axe.min.js"), "utf8");
const OUT = join(process.cwd(), "docs/cpv1/evidence/r1/axe");
mkdirSync(OUT, { recursive: true });

// §11 named surfaces: /result, /reports, one /reports/family/*, and (there is no
// new private/denial ROUTE in R1 — the preview gate is a server-side lib module)
// so we also fold in a family report already exercised by the APP-2 axe harness.
const SURFACES = ["/result", "/reports", "/reports/family/imairo", "/reports/family/relationship-fatigue"];

const VIEWPORTS: Array<{ name: string; width: number; height: number }> = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

type AxeNode = { target: string[] };
type AxeViolation = { id: string; impact: string | null; help: string; nodes: AxeNode[] };
type AxeResult = { violations: AxeViolation[] };

for (const path of SURFACES) {
  for (const vp of VIEWPORTS) {
    for (const reducedMotion of [false, true] as const) {
      const label = `${path} [${vp.name}${reducedMotion ? " reduced-motion" : ""}]`;
      test(`axe critical+serious==0: ${label}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        if (reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
        // Let client hydration + reveal transitions settle before auditing.
        await page.waitForTimeout(600);
        await page.addScriptTag({ content: AXE });
        const results = (await page.evaluate(async () => {
          // @ts-expect-error injected global
          return await window.axe.run(document, {
            runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
          });
        })) as AxeResult;

        const byImpact = (imp: string) => results.violations.filter((v) => v.impact === imp);
        const critical = byImpact("critical");
        const serious = byImpact("serious");

        // Evidence: full per-surface/per-viewport JSON, regardless of outcome.
        const slug = path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root";
        const fname = `${slug}__${vp.name}${reducedMotion ? "__reduced-motion" : ""}.json`;
        writeFileSync(
          join(OUT, fname),
          JSON.stringify(
            {
              surface: path,
              viewport: vp,
              reducedMotion,
              base: BASE,
              counts: {
                critical: critical.length,
                serious: serious.length,
                moderate: byImpact("moderate").length,
                minor: byImpact("minor").length,
                total: results.violations.length,
              },
              violations: results.violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                help: v.help,
                targets: v.nodes.map((n) => n.target.join(" ")),
              })),
            },
            null,
            2,
          ),
        );

        const blocking = [...critical, ...serious].map((v) => `${v.id}(${v.impact})`);
        expect(blocking.length, `${label} blocking a11y: ${blocking.join(", ")}`).toBe(0);
      });
    }
  }
}
