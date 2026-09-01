/**
 * CORP-v1.3.1 — Production acceptance against the live apex.
 *
 * READ-ONLY BY CONSTRUCTION. Every request is a GET. No form is submitted, no mutation endpoint is
 * called, no external message is sent, and nothing writes to any database. A launch smoke that
 * could change Production state is not a smoke test.
 */
const BASE = process.env.BASE ?? "https://yorisou.online";

const CORPORATE = ["/", "/ventures", "/mirai-move", "/kakari", "/chigamo", "/about", "/build-with-us", "/company", "/contact"];
const CONSUMER = ["/today", "/tests", "/tests/ima-iro", "/result", "/login", "/me", "/line/mini-app", "/en", "/en/about", "/privacy", "/terms", "/legal", "/notice"];
const BRAND = ["/favicon.ico", "/icon.png", "/apple-icon.png", "/opengraph-image.png", "/brand/yorisou-logo.png", "/brand/ventures/mirai-move-mark.png"];

const rows = [];
const fail = [];
const get = async (p, opts = {}) => {
  const res = await fetch(`${BASE}${p}`, { redirect: "follow", ...opts });
  const body = res.headers.get("content-type")?.includes("text/") ? await res.text() : "";
  return { res, body };
};

console.log(`# Production smoke — ${BASE}\n`);

// ── corporate ────────────────────────────────────────────────────────────────────────────────
for (const p of CORPORATE) {
  const { res, body } = await get(p);
  const lang = body.match(/<html[^>]*lang="([^"]*)"/)?.[1];
  const title = body.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const corporateShell = /site-module__[A-Za-z0-9]+__root/.test(body.replace(/self\.__next_f\.push\([\s\S]*?\)<\/script>/g, ""));
  const ok = res.status === 200 && lang === "ja" && corporateShell && title.includes("Yorisou");
  rows.push(`corporate ${p.padEnd(16)} ${res.status} lang=${lang} shell=${corporateShell ? "corporate" : "MISSING"} "${title.slice(0, 38)}"`);
  if (!ok) fail.push(`corporate ${p}: status ${res.status}, lang ${lang}, shell ${corporateShell}`);
}

// ── consumer ─────────────────────────────────────────────────────────────────────────────────
for (const p of CONSUMER) {
  const { res, body } = await get(p);
  const rendered = body.replace(/self\.__next_f\.push\([\s\S]*?\)<\/script>/g, "");
  const corporateShell = /site-module__[A-Za-z0-9]+__root/.test(rendered);
  const ok = res.status === 200 && !corporateShell;
  rows.push(`consumer  ${p.padEnd(16)} ${res.status} corporate-shell=${corporateShell}`);
  if (!ok) fail.push(`consumer ${p}: status ${res.status}, corporate shell leaked: ${corporateShell}`);
}

// ── the Today invariant, live ────────────────────────────────────────────────────────────────
{
  const { body } = await get("/today");
  const order = ["今の気配を見る", "5分でできること"].map((m) => body.indexOf(m));
  const shelled = /今日/.test(body) && /気づく/.test(body);
  rows.push(`today     invariant        hero@${order[0]} actions@${order[1]} tabbar=${shelled}`);
  if (order[0] < 0 || order[1] < 0 || order[0] > order[1]) fail.push("Today composition or order is wrong live");
  if (!shelled) fail.push("Today is missing the consumer tab bar live");
}

// ── branding ─────────────────────────────────────────────────────────────────────────────────
for (const p of BRAND) {
  const res = await fetch(`${BASE}${p}`, { method: "GET" });
  const len = Number(res.headers.get("content-length") ?? 0) || (await res.arrayBuffer()).byteLength;
  rows.push(`asset     ${p.padEnd(38)} ${res.status} ${len}B ${res.headers.get("content-type")}`);
  if (res.status !== 200 || len < 500) fail.push(`asset ${p}: status ${res.status}, ${len} bytes`);
}
{
  const { body } = await get("/");
  const checks = {
    "favicon link": /rel="icon"/.test(body),
    "apple-touch": /rel="apple-touch-icon"/.test(body),
    "og:image": /property="og:image"/.test(body),
    "theme-color": /name="theme-color"/.test(body),
    "header logo": /brand\/yorisou-logo/.test(body),
    "no purple heart": !/6C4CFF|6c4cff/.test(body),
    "Kakari co-mark 係": body.includes("係"),
    "Mirai Move logo": /mirai-move-mark/.test(body),
    "public-set label": body.includes("現在公開している事業"),
    "strapline": body.includes("人と技術が、未来をつくる。"),
  };
  for (const [k, v] of Object.entries(checks)) {
    rows.push(`brand     ${k.padEnd(20)} ${v ? "ok" : "MISSING"}`);
    if (!v) fail.push(`branding: ${k}`);
  }
}

// ── locale ───────────────────────────────────────────────────────────────────────────────────
for (const [q, want] of [["", "ja"], ["?lang=en", "en"]]) {
  const { res, body } = await get(`/${q}`);
  const lang = body.match(/<html[^>]*lang="([^"]*)"/)?.[1];
  rows.push(`locale    /${q.padEnd(15)} ${res.status} lang=${lang}`);
  if (lang !== want) fail.push(`locale /${q}: lang ${lang}, expected ${want}`);
}

// ── safety: contact must not advertise a delivery it cannot perform ──────────────────────────
{
  const { body } = await get("/contact");
  const hasForm = /<form/.test(body);
  rows.push(`safety    contact form     rendered=${hasForm}`);
  if (hasForm) fail.push("contact renders a form while delivery is unverified");
}

// ── 404 ──────────────────────────────────────────────────────────────────────────────────────
{
  const { res, body } = await get("/definitely-not-a-page-xyz");
  const headers = (body.match(/<header/g) ?? []).length;
  rows.push(`404       status ${res.status} headers=${headers} current-strapline=${body.includes("人と技術が、未来をつくる。")}`);
  if (res.status !== 404 || headers !== 1) fail.push(`404: status ${res.status}, ${headers} headers`);
}

console.log(rows.join("\n"));
console.log(`\n${fail.length ? "FAILURES:\n" + fail.join("\n") : "ALL LIVE CHECKS PASS"}`);
if (fail.length) process.exit(1);
