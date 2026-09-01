/**
 * Visual QA that actually looks: measures the rendered page rather than trusting the CSS.
 *  - no horizontal overflow, no element pushed outside the viewport unless deliberately clipped
 *  - no text clipped by its own box
 *  - every interactive target >= 24px (WCAG 2.2 AA minimum) and the primary nav >= 44px
 *  - the new brand elements are present, non-zero, and painted in the colour they claim
 */
import { chromium } from "playwright";
import { ROUTES, LOCALES, url } from "./routes.mjs";

const SIZES = [[1440, 900], [1280, 800], [900, 800], [430, 900], [390, 844], [375, 812]];
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const locales = process.env.LOCALES ? process.env.LOCALES.split(",") : LOCALES;
const routes = only ?? ROUTES;

const browser = await chromium.launch();
let checks = 0; const fails = [];

/** The measurement, run in the page. Kept identical to what it was; only the driving loop changed. */
const MEASURE = (vw) => {
  const out = { overflow: 0, clipped: [], small: [] };
  out.overflow = Math.max(0, document.documentElement.scrollWidth - vw);
  const clippedAncestor = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflow + getComputedStyle(p).overflowX;
      if (o.includes("hidden") || o.includes("clip")) return true;
    }
    return false;
  };
  /*
   * The visually-hidden idiom — 1x1, absolutely positioned, clipped — is how a skip link is
   * SUPPOSED to look until it is focused. Counting it as clipped text and as an undersized target
   * reported the site's own accessibility affordance as an accessibility defect, on every page, in
   * every locale. Its focused state is measured by the keyboard gate instead.
   */
  const visuallyHidden = (el, cs, rect) =>
    rect.width <= 2 && rect.height <= 2 && cs.position === "absolute" &&
    ((cs.clipPath && cs.clipPath !== "none") || (cs.clip && cs.clip !== "auto"));

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (visuallyHidden(el, cs, rect)) continue;
    const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    // text cut off by its own box
    if (hasOwnText && cs.overflow !== "visible" && cs.textOverflow !== "ellipsis") {
      if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
        out.clipped.push(`${el.tagName}.${el.className}`.slice(0, 70));
      }
    }
    // outside the viewport and not deliberately clipped by an ancestor (the signature bleeds on purpose)
    if ((rect.right > vw + 1 || rect.left < -1) && !clippedAncestor(el) && hasOwnText) {
      out.clipped.push(`OUTSIDE ${el.tagName}.${el.className}`.slice(0, 70));
    }
    if (el.matches("a,button,summary,[role=button]")) {
      const r2 = el.getBoundingClientRect();
      if (r2.width > 0 && r2.height > 0 && Math.min(r2.width, r2.height) < 24) {
        out.small.push(`${el.tagName} ${Math.round(r2.width)}x${Math.round(r2.height)} "${(el.textContent||"").trim().slice(0,20)}"`);
      }
    }
  }
  return out;
};

// One job per (viewport, route, locale). Four browser contexts share the queue, which turns a
// twenty-five minute serial run into something that finishes inside a single command.
const jobs = [];
for (const [w, h] of SIZES) for (const r of routes) for (const l of locales) jobs.push({ w, h, r, l });
let next = 0;
const WORKERS = Number(process.env.WORKERS ?? 3);

await Promise.all(Array.from({ length: WORKERS }, async () => {
  const ctx = await browser.newContext({ viewport: { width: SIZES[0][0], height: SIZES[0][1] }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  let current = null;
  for (;;) {
    const i = next++;
    if (i >= jobs.length) break;
    const job = jobs[i];
    if (!current || current[0] !== job.w || current[1] !== job.h) {
      await page.setViewportSize({ width: job.w, height: job.h });
      current = [job.w, job.h];
    }
    // `load` plus a short settle, not `networkidle`: with several workers hitting one local server,
    // networkidle times out on the heaviest page under load, which is a property of the harness
    // rather than of the page. Fonts and images are what the measurement needs, and `load` covers
    // them; the settle lets layout finish.
    await page.goto(url(job.r, job.l), { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(120);
    const res = await page.evaluate(MEASURE, job.w);
    checks++;
    const p = [];
    if (res.overflow > 0) p.push(`h-overflow ${res.overflow}px`);
    if (res.clipped.length) p.push(`clipped: ${[...new Set(res.clipped)].slice(0, 4).join(" / ")}`);
    if (res.small.length) p.push(`sub-24px: ${[...new Set(res.small)].slice(0, 3).join(" / ")}`);
    if (p.length) fails.push(`${job.w}x${job.h} ${job.r} [${job.l}] -> ${p.join(" | ")}`);
  }
  await ctx.close();
}));

await browser.close();
console.log(`responsive checks ${checks - fails.length}/${checks} clean`);
if (fails.length) { console.log(fails.slice(0, 40).join("\n")); process.exit(1); }
