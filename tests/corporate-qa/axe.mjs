import { chromium } from "playwright";
import { createRequire } from "node:module";
import { ROUTES, url } from "./routes.mjs";
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const { readFileSync } = await import("node:fs");
const axeSrc = readFileSync(axePath, "utf8");

const LOCALES = ["ja", "en", "ar", "ko", "th"]; // one per script family + RTL
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
let n = 0; const violations = [];
for (const r of ROUTES) for (const l of LOCALES) {
  await page.goto(url(r, l), { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axeSrc });
  const res = await page.evaluate(async () =>
    await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } }));
  n++;
  for (const v of res.violations) violations.push(`${r} [${l}] ${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0]?.target}`);
}
await b.close();
console.log(`axe: ${violations.length} violations across ${n} pages`);
if (violations.length) { console.log([...new Set(violations)].slice(0, 30).join("\n")); process.exit(1); }
