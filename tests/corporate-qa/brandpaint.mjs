/**
 * Asserts the brand system is actually PAINTED, not just declared: the accent squares carry each
 * venture's own colour, the concept venture's square is unfilled, and no pre-logo jade is rendered
 * anywhere on the live corporate surface.
 */
import { chromium } from "playwright";
import { ROUTES, url } from "./routes.mjs";
const EXPECT = { "Mirai Move": "rgb(14, 159, 154)", Kakari: "rgb(166, 62, 45)" };
const JADE = ["rgb(116, 186, 166)", "rgb(47, 107, 94)", "rgb(63, 134, 118)", "rgb(228, 237, 233)"];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const fails = [];
let marks = 0, jadeSeen = 0, pages = 0;

for (const r of ROUTES) for (const l of ["ja", "ar"]) {
  await page.goto(url(r, l), { waitUntil: "networkidle" });
  pages++;
  const found = await page.evaluate(() => {
    const out = { marks: [], jade: [] };
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      for (const prop of ["color", "backgroundColor", "borderTopColor", "fill", "stroke"]) {
        const v = cs[prop];
        if (v && /rgb\(116, 186, 166\)|rgb\(47, 107, 94\)|rgb\(63, 134, 118\)|rgb\(228, 237, 233\)/.test(v)) {
          out.jade.push(`${el.tagName}.${String(el.className).slice(0, 40)} ${prop}=${v}`);
        }
      }
      if (/ventureAccent/.test(String(el.className))) {
        const rect = el.getBoundingClientRect();
        const row = el.closest("[class*=ventureMarkRow],[class*=railNameRow]");
        out.marks.push({
          name: (row?.textContent || "").trim().split("\n")[0].slice(0, 20),
          bg: cs.backgroundColor,
          border: cs.borderTopColor,
          defined: el.getAttribute("data-defined"),
          w: Math.round(rect.width), h: Math.round(rect.height),
        });
      }
    }
    return out;
  });
  jadeSeen += found.jade.length;
  if (found.jade.length) fails.push(`${r} [${l}] pre-logo accent painted: ${found.jade[0]}`);
  for (const m of found.marks) {
    marks++;
    if (m.w < 5 || m.h < 5) fails.push(`${r} [${l}] ${m.name}: mark collapsed to ${m.w}x${m.h}`);
    const expected = EXPECT[m.name];
    if (expected && m.bg !== expected) fails.push(`${r} [${l}] ${m.name}: painted ${m.bg}, expected ${expected}`);
    if (m.name === "Chigamo") {
      if (m.defined !== "no") fails.push(`${r} [${l}] Chigamo mark claims a brand source`);
      if (m.bg !== "rgba(0, 0, 0, 0)") fails.push(`${r} [${l}] Chigamo mark is filled (${m.bg}) — it has no colour to fill it with`);
    }
  }
}
await b.close();
console.log(`brand paint: ${marks} accent marks measured on ${pages} pages, ${jadeSeen} pre-logo colours painted`);
if (fails.length) { console.log([...new Set(fails)].slice(0, 25).join("\n")); process.exit(1); }
