// Route sweep: status, html lang/dir, title, and that no internal token leaked.
import { ROUTES, LOCALES, url } from "./routes.mjs";
const FORBIDDEN = ["CORP-v1", "CORP-P5", "PREVIEW ONLY", "BLOCKED_BY_", "TODO", "FIXME", "undefined</", "NaN"];
/*
 * Private-address check, by SHAPE rather than by value.
 *
 * Naming the Founder's private mailbox here would have put a fragment of it into a public
 * repository — the exact thing the check exists to prevent. Any personal-mailbox-shaped address is
 * caught instead, which is also stronger: it would catch a different private address too. The one
 * public identity the site may carry is allowed by name.
 */
const PUBLIC_ADDRESS = "contact@yorisou.online";
const PRIVATE_MAILBOX = /[a-z0-9._%+-]+@(?:gmail|googlemail|outlook|hotmail|icloud|yahoo|proton(?:mail)?)\.[a-z.]{2,}/i;
let ok = 0, bad = [];
for (const r of ROUTES) for (const l of LOCALES) {
  const u = url(r, l);
  const res = await fetch(u, { redirect: "follow" });
  const html = await res.text();
  const lang = html.match(/<html[^>]*lang="([^"]*)"/)?.[1];
  const dir = html.match(/<html[^>]*dir="([^"]*)"/)?.[1];
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const leaks = FORBIDDEN.filter((f) => html.includes(f));
  const privateAddress = PRIVATE_MAILBOX.exec(html.split(PUBLIC_ADDRESS).join(""));
  if (privateAddress) leaks.push("private mailbox shape");
  const expectDir = l === "ar" ? "rtl" : "ltr";
  const problems = [];
  if (res.status !== 200) problems.push(`status ${res.status}`);
  if (lang !== l) problems.push(`lang ${lang}`);
  if (dir !== expectDir) problems.push(`dir ${dir}`);
  if (!title.trim()) problems.push("empty title");
  if (leaks.length) problems.push(`leak ${leaks.join(",")}`);
  if (problems.length) bad.push(`${u} -> ${problems.join(" | ")}`); else ok++;
}
console.log(`routes ok ${ok}/${ROUTES.length * LOCALES.length}`);
if (bad.length) { console.log(bad.slice(0, 40).join("\n")); process.exit(1); }
