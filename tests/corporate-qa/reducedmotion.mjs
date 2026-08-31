/**
 * Reduced motion and keyboard focus. Both are asserted against the RENDERED page, not the CSS:
 * a media query that exists but does not match the elements is the failure mode being checked.
 */
import { chromium } from "playwright";
import { ROUTES, url } from "./routes.mjs";
const b = await chromium.launch();
const fails = [];

// 1. prefers-reduced-motion: nothing may still be animating.
const rm = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const p1 = await rm.newPage();
let checked = 0;
for (const r of ROUTES) {
  await p1.goto(url(r, "ja"), { waitUntil: "networkidle" });
  const running = await p1.evaluate(() =>
    document.getAnimations().filter((a) => a.playState === "running").map((a) => {
      const t = a.effect?.target;
      return `${t?.tagName}.${String(t?.className?.baseVal ?? t?.className).slice(0, 40)}`;
    }));
  checked++;
  if (running.length) fails.push(`${r}: ${running.length} animations still running under reduced motion: ${[...new Set(running)].slice(0,3)}`);
}
await rm.close();

// 2. Focus indicators, measured by REAL Tab traversal.
//
// An earlier version of this called el.focus() from script and read the computed style. That is
// wrong: `:focus-visible` does not reliably match a programmatic focus in Chromium, so the check
// reported five CTAs on /build-with-us as having no focus ring when tabbing to them shows a 2px
// brand-blue outline. Pressing Tab is the only way to measure what a keyboard user actually sees.
const kb = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p2 = await kb.newPage();
let focusChecks = 0;
let stops = 0;
for (const r of ROUTES) {
  await p2.goto(url(r, "ja"), { waitUntil: "networkidle" });
  const seen = new Set();
  const bad = [];
  for (let i = 0; i < 80; i++) {
    await p2.keyboard.press("Tab");
    const info = await p2.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        key: el.tagName + (el.textContent || "").trim().slice(0, 26),
        label: `${el.tagName} "${(el.textContent || "").trim().slice(0, 24)}"`,
        outline: `${cs.outlineStyle} ${cs.outlineWidth}`,
        shadow: cs.boxShadow,
        underline: cs.textDecorationLine,
      };
    });
    if (!info || seen.has(info.key)) continue;
    seen.add(info.key);
    stops++;
    const visible = !info.outline.startsWith("none") || info.shadow !== "none" || info.underline.includes("underline");
    if (!visible) bad.push(info.label);
  }
  focusChecks++;
  if (bad.length) fails.push(`${r}: ${bad.length} tab stops with no visible focus: ${bad.slice(0, 3)}`);
}
await kb.close();
await b.close();
console.log(`reduced motion: ${checked} routes | keyboard: ${stops} real tab stops across ${focusChecks} routes`);
if (fails.length) { console.log(fails.join("\n")); process.exit(1); }
console.log("clean");
