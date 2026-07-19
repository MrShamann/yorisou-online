/* YORISOU — APP-1 service worker.
 *
 * Offline-safe PUBLIC application shell only. Privacy-first by construction:
 * it NEVER caches API responses, admin/founder pages, auth pages, private
 * state, saved account data, LINE callbacks, tokens, or any request carrying
 * credentials/answers. Only public-safe static assets + a public offline page
 * are precached. Device-local user state stays in the app's governed
 * localStorage model — it is never duplicated into a Cache Storage entry.
 *
 * Update lifecycle is USER-CONTROLLED: a new worker waits (never auto-
 * skipWaiting) so an in-progress 120Q is not interrupted; the app posts
 * SKIP_WAITING when the user accepts the update.
 */
const VERSION = "yorisou-app1-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

// Public-safe precache: the offline page + brand icons. (Next build hashes its
// own static assets, cached lazily below.)
const PRECACHE = ["/offline", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

// Never touch these — always go to network, never cache (privacy boundary §13).
const NEVER = [
  "/api/", "/admin", "/dashboard", "/login", "/register", "/reset-password",
  "/forgot-password", "/private-state", "/saved", "/line/", "/result/return",
];

function isNeverCache(url) {
  return NEVER.some((p) => url.pathname === p.replace(/\/$/, "") || url.pathname.startsWith(p));
}

// Public-safe, immutable static assets — safe to cache-first.
function isStaticAsset(url) {
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (url.pathname.startsWith("/icons/") || url.pathname.startsWith("/assets/") || url.pathname.startsWith("/images/")) return true;
  return /\.(?:css|js|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => undefined)),
  );
  // Do NOT skipWaiting here — wait for the user to accept the update.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never cache non-GET
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // same-origin only
  if (request.headers.get("authorization") || request.headers.get("cookie")?.includes("session")) return;
  if (isNeverCache(url)) return; // privacy boundary — always network, never cache

  // Static assets: cache-first (public-safe, immutable).
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        try {
          const res = await fetch(request);
          if (res && res.ok && res.type === "basic") cache.put(request, res.clone());
          return res;
        } catch {
          return hit || Response.error();
        }
      }),
    );
    return;
  }

  // Navigations (HTML): network-first; on failure, the PUBLIC offline page.
  // Navigation HTML is never cached (it could carry per-visit / private data).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(SHELL_CACHE);
        return (await cache.match("/offline")) || new Response("offline", { status: 503 });
      }),
    );
    return;
  }
  // everything else: pass through to network (no caching)
});
