/**
 * Asserts the brand system is actually PAINTED, not just declared: the accent squares carry each
 * venture's own colour, the concept venture's square is unfilled, and no pre-logo jade is rendered
 * anywhere on the live corporate surface.
 */
import { chromium } from "playwright";
import { ROUTES, url } from "./routes.mjs";
/*
 * CORP-v1.3.1 — this now measures MARKS, not colour squares.
 *
 * v1.3 checked that each venture's 9px accent square painted the right colour. All three ventures
 * now render their own mark instead, so that check would measure an element that no longer exists
 * and would report clean while verifying nothing.
 *
 * One subtlety worth keeping: the venture NAME must be read from the wordmark element, not from the
 * row's textContent. Kakari's co-mark contains a 係 inside an <svg><text>, so row.textContent is
 * "係Kakari" — a lookup keyed on that would silently miss every venture and go green.
 */
const EXPECTED_MARKS = {
  "Mirai Move": { kind: "img", src: "mirai-move-mark" },
  Kakari: { kind: "svg", glyph: "係" },
  Chigamo: { kind: "svg", glyph: "" },
};
const DEAD_COLOURS = ["rgb(116, 186, 166)", "rgb(47, 107, 94)", "rgb(63, 134, 118)", "rgb(228, 237, 233)"];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const fails = [];
let marks = 0, deadSeen = 0, pages = 0;
const seenVentures = new Set();

for (const r of ROUTES) for (const l of ["ja", "ar"]) {
  await page.goto(url(r, l), { waitUntil: "load" });
  await page.waitForTimeout(120);
  pages++;
  const found = await page.evaluate(() => {
    const out = { marks: [], dead: [] };
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      for (const prop of ["color", "backgroundColor", "borderTopColor", "fill", "stroke"]) {
        const v = cs[prop];
        if (v && /rgb\(116, 186, 166\)|rgb\(47, 107, 94\)|rgb\(63, 134, 118\)|rgb\(228, 237, 233\)/.test(v)) {
          out.dead.push(`${el.tagName}.${String(el.className).slice(0, 40)} ${prop}=${v}`);
        }
      }
      // EXACTLY the mark element. `ventureMarkRow`, `ventureMarkHero` and `ventureMarkCompact` all
      // contain "ventureMark", so a substring match selects the row and the wordmark as well and
      // then reports them as the wrong element type. CSS-module classes are `<hash>__ventureMark`.
      const classes = String(el.getAttribute("class") ?? "").split(/\s+/);
      if (!classes.some((c) => /(^|__)ventureMark$/.test(c))) continue;
      const row = el.closest("[class*=ventureMarkRow],[class*=railNameRow]");
      // The WORDMARK element, never the row's text: the co-mark's 係 lives inside this row too.
      const wordmark = row?.querySelector(
        "[class*=projectName],[class*=ventureMarkHero],[class*=ventureMarkCompact],[class*=railName]",
      );
      const rect = el.getBoundingClientRect();
      /*
       * Monochrome is a property of the DRAWN CHILDREN, not of the <svg> root. `getComputedStyle`
       * on the root returns fill "rgb(0, 0, 0)" — the CSS initial value — for every inline SVG,
       * whatever the children do, so checking the root reported a false failure on every page.
       * What matters is that each painted child resolves to the inherited text colour.
       */
      const painted = [...el.querySelectorAll("text,path,rect,circle,line,polyline")].map((c) => {
        const ccs = getComputedStyle(c);
        return { fill: ccs.fill, stroke: ccs.stroke, colour: ccs.color };
      });
      out.marks.push({
        name: (wordmark?.textContent || "").trim().slice(0, 20),
        tag: el.tagName,
        src: el.getAttribute("src") || "",
        glyph: (el.textContent || "").trim(),
        colour: cs.color,
        painted,
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      });
    }
    return out;
  });
  deadSeen += found.dead.length;
  if (found.dead.length) fails.push(`${r} [${l}] pre-logo accent painted: ${found.dead[0]}`);
  for (const m of found.marks) {
    marks++;
    const want = EXPECTED_MARKS[m.name];
    if (!want) { fails.push(`${r} [${l}] mark for an unknown venture "${m.name}"`); continue; }
    seenVentures.add(m.name);
    if (m.w < 10 || m.h < 10) fails.push(`${r} [${l}] ${m.name}: mark collapsed to ${m.w}x${m.h}`);
    if (want.kind === "img") {
      if (m.tag !== "IMG") fails.push(`${r} [${l}] ${m.name}: expected the official logo image, got <${m.tag}>`);
      else if (!m.src.includes(want.src)) fails.push(`${r} [${l}] ${m.name}: wrong image ${m.src}`);
    } else {
      if (m.tag !== "svg") fails.push(`${r} [${l}] ${m.name}: expected an inline svg, got <${m.tag}>`);
      if (want.glyph && !m.glyph.includes(want.glyph)) fails.push(`${r} [${l}] ${m.name}: co-mark glyph missing`);
      // Monochrome: every painted child must resolve to the inherited text colour.
      if (!m.painted.length) fails.push(`${r} [${l}] ${m.name}: the mark draws nothing`);
      for (const c of m.painted) {
        const used = [c.fill, c.stroke].filter((v) => v && v !== "none");
        for (const v of used) {
          if (v !== m.colour) {
            fails.push(`${r} [${l}] ${m.name}: mark paints ${v} instead of the text colour ${m.colour}`);
          }
        }
      }
    }
  }
}
await b.close();
console.log(`brand paint: ${marks} venture marks measured on ${pages} pages; ventures seen: ${[...seenVentures].sort().join(", ")}; ${deadSeen} pre-logo colours painted`);
for (const v of Object.keys(EXPECTED_MARKS)) {
  if (!seenVentures.has(v)) fails.push(`${v} never rendered a mark on any page — the scan is blind to it`);
}
if (fails.length) { console.log([...new Set(fails)].slice(0, 25).join("\n")); process.exit(1); }
