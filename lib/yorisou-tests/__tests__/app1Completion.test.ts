// APP-1 — installable-PWA completion contract (source + asset checks). The
// runtime PWA behaviour (installability, SW register/activate, offline, update)
// is verified by tests/smoke/app1-pwa.spec.ts against the built server.
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));
const size = (p: string) => (has(p) ? statSync(join(root, p)).size : 0);

// ── Web App Manifest ────────────────────────────────────────────────────────
assert.ok(has("public/manifest.webmanifest"), "manifest exists");
const manifest = JSON.parse(read("public/manifest.webmanifest")) as {
  name: string; short_name: string; display: string; start_url: string; scope: string;
  theme_color: string; background_color: string;
  icons: Array<{ src: string; sizes: string; purpose?: string }>;
};
assert.equal(manifest.name, "YORISOU", "manifest name is YORISOU");
assert.ok(manifest.short_name, "manifest has a short_name (JP)");
assert.equal(manifest.display, "standalone", "standalone display mode");
assert.ok(manifest.start_url.startsWith("/"), "start_url is a real path");
assert.equal(manifest.scope, "/", "scope is the whole app");
assert.equal(manifest.theme_color, "#0c0e0d", "theme color matches the app ground");
assert.equal(manifest.background_color, "#0c0e0d", "background color matches");
assert.ok(manifest.icons.some((i) => i.sizes === "192x192"), "192 icon declared");
assert.ok(manifest.icons.some((i) => i.sizes === "512x512"), "512 icon declared");
assert.ok(manifest.icons.some((i) => (i.purpose || "").includes("maskable")), "maskable icon declared");

// ── Real, brand-derived icons (not placeholders) ────────────────────────────
for (const [icon, min] of [
  ["public/icons/icon-192.png", 2000],
  ["public/icons/icon-512.png", 5000],
  ["public/icons/icon-maskable-192.png", 2000],
  ["public/icons/icon-maskable-512.png", 5000],
  ["public/icons/apple-touch-icon.png", 2000],
  ["public/icons/favicon-32.png", 300],
] as const) {
  assert.ok(has(icon), `${icon} exists`);
  assert.ok(size(icon) > min, `${icon} is a real PNG (> ${min} bytes)`);
  // PNG magic
  const head = readFileSync(join(root, icon)).subarray(0, 8).toString("hex");
  assert.equal(head, "89504e470d0a1a0a", `${icon} is a valid PNG`);
}

// ── Service worker — offline-safe + privacy boundary + user-controlled update ─
assert.ok(has("public/sw.js"), "service worker exists");
const sw = read("public/sw.js");
for (const never of ["/api/", "/admin", "/dashboard", "/private-state", "/saved", "/login", "/line/"]) {
  assert.ok(sw.includes(never), `SW privacy list includes ${never} (never cached)`);
}
assert.ok(sw.includes("/offline"), "SW precaches the public offline page");
// exactly one skipWaiting() call, gated behind the SKIP_WAITING message (no auto-skip)
assert.equal((sw.match(/self\.skipWaiting\(\)/g) || []).length, 1, "exactly one skipWaiting() call");
assert.ok(sw.indexOf("SKIP_WAITING") < sw.indexOf("self.skipWaiting()"), "update is user-controlled (gated by SKIP_WAITING message)");
// never caches credentialed/authorized requests
assert.ok(sw.includes("authorization") || sw.includes("cookie"), "SW skips credentialed requests");

// ── Offline recovery page — public-safe (no server data / private markers) ──
assert.ok(has("app/offline/page.tsx"), "offline recovery page exists");
const offline = read("app/offline/page.tsx");
for (const bad of ["fetch(", "await ", "cookies(", "headers(", "getViewerContext", "createClient"]) {
  assert.ok(!offline.includes(bad), `offline page carries no server/private data (${bad})`);
}

// ── Layout wiring — manifest + icons + theme-color + install controller ─────
const layout = read("app/layout.tsx");
assert.ok(layout.includes('manifest: "/manifest.webmanifest"'), "layout links the manifest");
assert.ok(layout.includes("apple-touch-icon"), "layout declares the apple touch icon");
assert.ok(layout.includes("appleWebApp"), "layout declares apple web-app capability");
assert.ok(/themeColor:\s*"#0c0e0d"/.test(layout), "layout sets the theme color via viewport");
assert.ok(layout.includes("PwaController"), "layout renders the PWA install/update controller");

// ── Install/update controller — standalone-aware, non-aggressive, 120Q-safe ──
const controller = read("app/components/pwa/PwaController.tsx");
assert.ok(controller.includes("display-mode: standalone"), "controller detects standalone mode");
assert.ok(controller.includes("beforeinstallprompt"), "controller uses the install prompt");
assert.ok(controller.includes('"/check-in"') && controller.includes("inActiveCheck"), "update is suppressed during an active 120Q");
assert.ok(controller.includes("SKIP_WAITING"), "controller applies the update on user action");

// ── macOS acceptance doc ────────────────────────────────────────────────────
assert.ok(has("docs/app1/MACOS_DESKTOP_INSTALLATION_AND_ACCEPTANCE.md"), "macOS install + acceptance doc present");
const doc = read("docs/app1/MACOS_DESKTOP_INSTALLATION_AND_ACCEPTANCE.md");
assert.ok(doc.includes("Uninstall") && doc.includes("Dock"), "doc covers install/Dock/uninstall");
assert.ok(/not.*(install|native macOS binary|App Store)/i.test(doc), "doc is honest about what is / is not delivered");

console.log("APP-1 completion contract checks passed");
