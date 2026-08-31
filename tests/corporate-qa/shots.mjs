import { chromium } from "playwright";
import { url } from "./routes.mjs";
const S = process.env.OUT ?? ".";
const shots = (process.env.SHOTS ?? "").split(";").filter(Boolean).map((s) => s.split(","));
const b = await chromium.launch();
for (const [name, route, locale, w, h, full] of shots) {
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(url(route, locale), { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${S}/${name}.png`, fullPage: full === "full" });
  await ctx.close();
  console.log("shot", name);
}
await b.close();
