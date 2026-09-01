/**
 * CORP-P4AR1 — the single route-policy module.
 *
 * WHY THIS EXISTS. CORP-P4A suppressed the consumer shell with a pathname ALLOWLIST. An allowlist
 * can never match a path that does not exist, so for an unknown route the consumer shell mounted
 * anyway and wrapped the corporate 404 — the page rendered two headers, two footers and the consumer
 * mobile tab bar. The prior claim that the corporate 404 "replaced" the consumer 404 was false.
 *
 * The model is inverted here. Consumer chrome is now rendered ONLY for a route this module
 * recognises as a consumer route. Everything else — corporate routes and, critically, unknown paths
 * — is CORPORATE. The default is safe rather than permissive:
 *
 *     unknown path -> shell CORPORATE_404, sitemap EXCLUDED, crawl BLOCKED
 *
 * The route table below is DERIVED FROM THE APP ROUTER FILESYSTEM, not remembered. A consistency
 * test re-derives it and fails if the two drift, so adding a route cannot silently escape policy.
 *
 * This module is pure: no imports, no I/O, no framework types. It is used by the shell, robots,
 * the sitemap and the tests.
 *
 * CORP-P4AR2R1 CORRECTION: an earlier version of this sentence said those four therefore "cannot
 * disagree". That is false and was one of four claims CORP-P4AR2 itself had to withdraw. One shared
 * module makes the four agree WITH THE MODULE; it cannot detect a defect in what the module
 * produces, and it says nothing about what the RUNTIME does. Both failures are on record: an
 * unanchored `Allow` rule leaked whole subtrees while every test passed, and `shellOwner()` still
 * returns CONSUMER for `/share/<invalid>` on the client, so a hydrated 404 there carries two
 * headers and two footers. Agreement with this module is not correctness.
 */

export type RouteGroup =
  | "CORPORATE_INDEXABLE"
  | "CORPORATE_CRAWL_BLOCKED"
  | "PROTOTYPE_CRAWL_BLOCKED"
  | "LEGACY_PUBLIC_CRAWL_BLOCKED"
  | "PERSONAL_OR_AUTH_CRAWL_BLOCKED"
  | "ADMIN_INTERNAL_CRAWL_BLOCKED"
  | "DEV_INTERNAL_CRAWL_BLOCKED"
  | "API_NON_PAGE"
  | "DYNAMIC_ROUTE_POLICY"
  | "UNKNOWN";

export type ShellOwner = "CORPORATE" | "CONSUMER" | "NONE";

/**
 * The only routes a crawler may fetch.
 *
 * CORP-v1.3 — three corporate pages are added: `/ventures`, `/chigamo` and `/build-with-us`. They
 * were blocked only because they did not exist when this list was written in CORP-P4AR1, and a
 * corporate site whose Ventures index cannot be crawled is not a public company site. Their copy is
 * under the same claim guard as the four already here, so nothing indexable becomes less checked.
 *
 * `/company` and `/contact` stay OUT, and deliberately: `/contact` must not be advertised while its
 * delivery is unverified, and `/company` becoming the crawlable record of the company is a Founder
 * decision, not a routing one. Both are listed in CORPORATE_BLOCKED with their unblock conditions in
 * docs/yorisou/corporate/CORP_V13_PRODUCTION_LAUNCH_GATE.md.
 *
 * Every entry here is rendered into robots.txt ANCHORED with `$`, so each matches exactly one path.
 */
export const CORPORATE_INDEXABLE: readonly string[] = [
  "/",
  "/ventures",
  "/mirai-move",
  "/kakari",
  "/chigamo",
  "/about",
  "/build-with-us",
];

/** Corporate routes blocked while their release blockers remain open. */
export const CORPORATE_BLOCKED: readonly string[] = ["/company", "/contact"];

/** Every consumer page route present in the App Router filesystem, derived not remembered. */
export const CONSUMER_ROUTES: readonly string[] = [
  "/admin",
  "/admin-entry",
  "/admin/audit",
  "/admin/candidates",
  "/admin/dte-launch-dashboard",
  "/admin/experiences",
  "/admin/timeline",
  "/admin/users",
  "/admin/users/[userProfileId]",
  "/ai-advisor",
  "/business",
  "/check-in",
  "/concept",
  "/connect",
  "/connect/invite/[publicId]",
  "/connect/pair/[pairId]",
  "/dashboard/open-testing",
  "/dev/ai-advisor",
  "/dev/insights",
  "/en",
  "/en/about",
  "/en/ai-advisor",
  "/en/check-in",
  "/en/contact",
  "/en/forgot-password",
  "/en/insights",
  "/en/insights/[slug]",
  "/en/legal",
  "/en/line/mini-app/result",
  "/en/line/result",
  "/en/login",
  "/en/partners",
  "/en/pilot",
  "/en/product",
  "/en/products",
  "/en/progress",
  "/en/register",
  "/en/reservation-mobility-support",
  "/en/reset-password",
  "/en/result",
  "/en/result/continue",
  "/en/services",
  "/en/support",
  "/experiences",
  "/experiences/invite/[token]",
  "/explore",
  "/forgot-password",
  "/formal-check",
  "/insights",
  "/insights/[slug]",
  "/legal",
  "/life",
  "/life/experience",
  "/life/goals",
  "/life/memories",
  "/life/reflect",
  "/life/timeline",
  "/line/mini-app",
  "/line/mini-app/result",
  "/line/result",
  "/login",
  "/me",
  "/methodology",
  "/notice",
  "/online-check-in",
  "/open-testing",
  "/partners",
  "/pilot",
  "/privacy",
  "/private-state",
  "/product",
  "/products",
  "/progress",
  "/recommendations",
  "/recommendations/graph",
  "/register",
  "/report-loading",
  "/report-preview",
  "/reports/love-distance",
  "/reports/relationship-fatigue",
  "/reports/sample",
  "/reports/self",
  "/reports/self-understanding/[publicCode]",
  "/reservation-mobility-support",
  "/reset-password",
  "/result",
  "/result/continue",
  "/result/return",
  "/result/share",
  "/saved",
  "/saved/c02/[id]",
  "/saved/tests/[id]",
  "/services",
  "/share/[publicId]",
  "/support",
  "/terms",
  "/tests",
  "/tests/[testId]/return",
  "/tests/c02",
  "/tests/c02/return",
  "/tests/daily-check-in",
  "/tests/f01",
  "/tests/f02",
  "/tests/ima-iro",
  "/tests/local-life",
  "/tests/love-distance",
  "/tests/name-impression",
  "/tests/r01",
  "/tests/r04",
  "/tests/relationship-fatigue",
  "/tests/relationship-fatigue/return",
  "/tests/s01",
  "/tests/work-rhythm",
  "/tests/yorisou-values",
  /*
   * CORP-v1.3.1 — `/today` itself, not only its children.
   *
   * The consumer Today surface is restored at app/today/page.tsx as part of the corporate apex
   * cutover. `isKnownPageRoute()` tests this list with an EXACT `includes()`, while `classify()`
   * uses the prefix-tolerant NAMESPACES table — so before this entry existed, `/today` classified
   * as a consumer namespace for CRAWL purposes while `shellOwner("/today")` returned CORPORATE.
   * The restored page would have rendered with no AppHeader, no SiteFooter and no MobileBottomNav,
   * and no test would have caught it: both consistency tests only check that nothing classifies
   * UNKNOWN and that no listed route is stale, and `/today` classified fine either way.
   *
   * `consumerShellIntegrity.test.ts` now asserts every consumer page on disk actually resolves to
   * the consumer shell, which closes the general trap rather than just this instance of it.
   */
  "/today",
  "/today/check-in",
  "/today/discovery",
  "/vision",
];

/** Prototype evidence-comparison surface. */
export const PROTOTYPE_ROUTES_LIST: readonly string[] = [
  "/prototype/capture",
  "/prototype/corporate",
  "/prototype/corporate/about",
  "/prototype/corporate/company",
  "/prototype/corporate/contact",
  "/prototype/corporate/kakari",
  "/prototype/corporate/mirai-move",
  "/prototype/discover",
  "/prototype/home",
  "/prototype/hook",
  "/prototype/login",
  "/prototype/signature",
];


const DYNAMIC = new RegExp(
  "(" +
    [
      "^/admin/users/[^/]+$",
      "^/connect/invite/[^/]+$",
      "^/connect/pair/[^/]+$",
      "^/en/insights/[^/]+$",
      "^/experiences/invite/[^/]+$",
      "^/insights/[^/]+$",
      "^/reports/self\-understanding/[^/]+$",
      "^/saved/c02/[^/]+$",
      "^/saved/tests/[^/]+$",
      "^/share/[^/]+$",
      "^/tests/[^/]+/return$",
    ].join("|") +
  ")",
);

function normalise(pathname: string): string {
  if (!pathname) return "/";
  const p = pathname.split("?")[0].split("#")[0];
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

/** Exact match, or a descendant of a known route. `/tests` and `/tests/c02` share one policy. */
function matches(list: readonly string[], p: string): boolean {
  return list.some((r) => p === r || (r !== "/" && p.startsWith(r + "/")));
}

/**
 * Namespaces whose policy applies to the whole subtree, whether or not a page file exists at the
 * bare path. `/line` has no page of its own — only `/line/mini-app` — but a crawler must still be
 * told about `/line`, and `/line/anything` must not inherit a different policy from `/line`.
 */
const NAMESPACES: readonly [string, RouteGroup][] = [
  ["/api", "API_NON_PAGE"],
  ["/prototype", "PROTOTYPE_CRAWL_BLOCKED"],
  ["/admin", "ADMIN_INTERNAL_CRAWL_BLOCKED"],
  ["/admin-entry", "ADMIN_INTERNAL_CRAWL_BLOCKED"],
  ["/dev", "DEV_INTERNAL_CRAWL_BLOCKED"],
  ["/me", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/life", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/saved", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/private-state", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/dashboard", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/reports", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/login", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/register", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/forgot-password", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/reset-password", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/result", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/share", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/connect", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/progress", "PERSONAL_OR_AUTH_CRAWL_BLOCKED"],
  ["/tests", "LEGACY_PUBLIC_CRAWL_BLOCKED"],
  ["/line", "LEGACY_PUBLIC_CRAWL_BLOCKED"],
  ["/today", "LEGACY_PUBLIC_CRAWL_BLOCKED"],
  ["/en", "LEGACY_PUBLIC_CRAWL_BLOCKED"],
  ["/experiences", "LEGACY_PUBLIC_CRAWL_BLOCKED"],
  ["/recommendations", "LEGACY_PUBLIC_CRAWL_BLOCKED"],
];

function namespaceOf(p: string): RouteGroup | null {
  for (const [prefix, g] of NAMESPACES) {
    if (p === prefix || p.startsWith(prefix + "/")) return g;
  }
  return null;
}

/**
 * CRAWL classification. Namespace-aware on purpose: `/tests` and `/tests/anything` must resolve to
 * the same crawl policy even for paths that do not exist, because a crawler will try them.
 */
export function classify(pathname: string): RouteGroup {
  const p = normalise(pathname);
  if (CORPORATE_INDEXABLE.includes(p)) return "CORPORATE_INDEXABLE";
  if (CORPORATE_BLOCKED.includes(p)) return "CORPORATE_CRAWL_BLOCKED";
  const ns = namespaceOf(p);
  if (ns) return ns;
  if (matches(CONSUMER_ROUTES, p)) return "LEGACY_PUBLIC_CRAWL_BLOCKED";
  if (DYNAMIC.test(p)) return "DYNAMIC_ROUTE_POLICY";
  return "UNKNOWN";
}

/**
 * Does this path LOOK like a route this module knows? CORP-P4AR2: read the verb carefully. This is
 * a pathname guess, not a resolution result, and it is no longer what isolates the 404.
 *
 * CORP-P4AR1 used this to infer that a route had resolved successfully, which is invalid — whether a
 * route resolves is decided by the route handler at request time. `/insights/does-not-exist` matches
 * `/insights/[slug]`, so this returned true, so `shellOwner()` said CONSUMER, and the consumer chrome
 * wrapped the corporate 404: two headers and two footers, measured on the production build.
 *
 * 404 isolation is now structural and lives in `app/global-not-found.tsx`, which renders outside the
 * root layout and therefore outside `AppShell` entirely. No pathname judgement can get it wrong,
 * because no pathname judgement is involved. What remains here is a preference applied only to
 * routes that DID resolve — by the time `AppShell` renders, the request was not a 404.
 */
export function isKnownPageRoute(pathname: string): boolean {
  const p = normalise(pathname);
  if (CORPORATE_INDEXABLE.includes(p) || CORPORATE_BLOCKED.includes(p)) return true;
  if (CONSUMER_ROUTES.includes(p)) return true;
  if (PROTOTYPE_ROUTES_LIST.includes(p)) return true;
  return DYNAMIC.test(p);
}

/**
 * Which shell owns the page.
 *
 * Consumer chrome renders ONLY for a path that (a) resolves to a real consumer page and (b) is
 * classified as consumer. Everything else — corporate routes, API paths, and every unknown path
 * including unknown children of consumer namespaces — belongs to the corporate shell. That is what
 * makes the corporate 404 single-shelled at any depth.
 */
export function shellOwner(pathname: string | null | undefined): ShellOwner {
  if (!pathname) return "CORPORATE";
  const p = normalise(pathname);
  const g = classify(p);
  if (g === "API_NON_PAGE") return "NONE";
  if (!isKnownPageRoute(p)) return "CORPORATE";
  if (
    g === "LEGACY_PUBLIC_CRAWL_BLOCKED" ||
    g === "PERSONAL_OR_AUTH_CRAWL_BLOCKED" ||
    g === "ADMIN_INTERNAL_CRAWL_BLOCKED" ||
    g === "DEV_INTERNAL_CRAWL_BLOCKED" ||
    g === "DYNAMIC_ROUTE_POLICY"
  ) {
    return "CONSUMER";
  }
  return "CORPORATE";
}

/**
 * CORP-P4AR2 — FOUR SEPARATE DISPOSITIONS, AND ONE THIS MODULE CANNOT ANSWER.
 *
 * CORP-P4AR1 named six of this module's groups `*_NOINDEX` and exported `isIndexable()`, then
 * reported that "131 routes are noindex". That was false, and the falsehood was in the vocabulary
 * rather than in any single line of logic. Nothing in this module has ever emitted a `noindex`
 * directive. What it computes is CRAWL policy — which is what robots.txt controls, and robots.txt
 * cannot make a page noindex. The two mechanisms are not merely different, they conflict: a URL
 * blocked from crawling is a URL whose `noindex` a crawler is forbidden to fetch and therefore will
 * never act on, and such a URL can still be indexed from external links alone.
 *
 * The names below now say what they compute, and the four questions are answered separately:
 *
 *   1. CRAWL disposition        — crawlDisposition(). May a crawler fetch this path? Derived from
 *                                 the same source robots.txt renders from.
 *   2. SITEMAP disposition      — sitemapDisposition(). Do we actively submit this path?
 *   3. SHELL ownership          — shellOwner(). Which chrome a RESOLVED route renders in.
 *   4. ROUTE LIFECYCLE          — routeLifecycle(). What the route is FOR, independent of crawling.
 *
 * The fifth question — what index directive a page actually emits in its rendered `<meta name=
 * "robots">` tag or `X-Robots-Tag` response header — IS DELIBERATELY NOT ANSWERED HERE. It cannot be
 * derived from a pathname; it is a property of what the route renders at request time, so it must be
 * MEASURED against a running build. That census lives in
 * docs/yorisou/corporate/CORP_P4AR2_RENDERED_INDEXABILITY_CENSUS.md. Any future function in this
 * file that claims to return it would be reintroducing exactly the defect this rename removes.
 */

export type CrawlDisposition = "CRAWL_ALLOWED" | "CRAWL_BLOCKED";
export type SitemapDisposition = "IN_SITEMAP" | "EXCLUDED_FROM_SITEMAP";
export type RouteLifecycle =
  | "CORPORATE_CANDIDATE"
  | "CORPORATE_BLOCKED_PENDING_SOURCE"
  | "CONSUMER_RETAINED"
  | "PROTOTYPE_EVIDENCE"
  | "INTERNAL_ONLY"
  | "NON_PAGE"
  | "UNRESOLVED";

/**
 * May a crawler fetch this path? This is the ONLY question robots.txt answers, and the only one this
 * function answers. It says nothing about whether the path may be indexed.
 */
export function crawlDisposition(pathname: string): CrawlDisposition {
  return classify(pathname) === "CORPORATE_INDEXABLE" ? "CRAWL_ALLOWED" : "CRAWL_BLOCKED";
}

/** Backwards-compatible boolean form of {@link crawlDisposition}. Crawl, not index. */
export function isCrawlAllowed(pathname: string): boolean {
  return crawlDisposition(pathname) === "CRAWL_ALLOWED";
}

/** Do we actively submit this path in the sitemap? Distinct from whether it may be crawled. */
export function sitemapDisposition(pathname: string): SitemapDisposition {
  return classify(pathname) === "CORPORATE_INDEXABLE" ? "IN_SITEMAP" : "EXCLUDED_FROM_SITEMAP";
}

/** Only the four corporate routes are sitemap-eligible. Everything else, including UNKNOWN. */
export function isSitemapEligible(pathname: string): boolean {
  return sitemapDisposition(pathname) === "IN_SITEMAP";
}

/**
 * What the route is FOR. Independent of crawling: `/tests` is a retained consumer route whether or
 * not a crawler may fetch it, and blocking it in robots.txt does not retire it.
 */
export function routeLifecycle(pathname: string): RouteLifecycle {
  const g = classify(pathname);
  switch (g) {
    case "CORPORATE_INDEXABLE":
      return "CORPORATE_CANDIDATE";
    case "CORPORATE_CRAWL_BLOCKED":
      return "CORPORATE_BLOCKED_PENDING_SOURCE";
    case "PROTOTYPE_CRAWL_BLOCKED":
      return "PROTOTYPE_EVIDENCE";
    case "ADMIN_INTERNAL_CRAWL_BLOCKED":
    case "DEV_INTERNAL_CRAWL_BLOCKED":
      return "INTERNAL_ONLY";
    case "API_NON_PAGE":
      return "NON_PAGE";
    case "UNKNOWN":
      return "UNRESOLVED";
    default:
      return "CONSUMER_RETAINED";
  }
}
