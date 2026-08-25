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
 *     unknown path -> shell CORPORATE_404, sitemap EXCLUDED, indexability NOINDEX
 *
 * The route table below is DERIVED FROM THE APP ROUTER FILESYSTEM, not remembered. A consistency
 * test re-derives it and fails if the two drift, so adding a route cannot silently escape policy.
 *
 * This module is pure: no imports, no I/O, no framework types. It is used by the shell, robots,
 * the sitemap and the tests, so those four cannot disagree.
 */

export type RouteGroup =
  | "CORPORATE_INDEXABLE"
  | "CORPORATE_BLOCKED_NOINDEX"
  | "PROTOTYPE_NOINDEX"
  | "LEGACY_PUBLIC_NOINDEX"
  | "PERSONAL_OR_AUTH_NOINDEX"
  | "ADMIN_INTERNAL_NOINDEX"
  | "DEV_INTERNAL_NOINDEX"
  | "API_NON_PAGE"
  | "DYNAMIC_ROUTE_POLICY"
  | "UNKNOWN";

export type ShellOwner = "CORPORATE" | "CONSUMER" | "NONE";

/** The only routes that may be indexed in the local corporate candidate. */
export const CORPORATE_INDEXABLE: readonly string[] = ["/", "/mirai-move", "/kakari", "/about"];

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
  ["/prototype", "PROTOTYPE_NOINDEX"],
  ["/admin", "ADMIN_INTERNAL_NOINDEX"],
  ["/admin-entry", "ADMIN_INTERNAL_NOINDEX"],
  ["/dev", "DEV_INTERNAL_NOINDEX"],
  ["/me", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/life", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/saved", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/private-state", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/dashboard", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/reports", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/login", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/register", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/forgot-password", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/reset-password", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/result", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/share", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/connect", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/progress", "PERSONAL_OR_AUTH_NOINDEX"],
  ["/tests", "LEGACY_PUBLIC_NOINDEX"],
  ["/line", "LEGACY_PUBLIC_NOINDEX"],
  ["/today", "LEGACY_PUBLIC_NOINDEX"],
  ["/en", "LEGACY_PUBLIC_NOINDEX"],
  ["/experiences", "LEGACY_PUBLIC_NOINDEX"],
  ["/recommendations", "LEGACY_PUBLIC_NOINDEX"],
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
  if (CORPORATE_BLOCKED.includes(p)) return "CORPORATE_BLOCKED_NOINDEX";
  const ns = namespaceOf(p);
  if (ns) return ns;
  if (matches(CONSUMER_ROUTES, p)) return "LEGACY_PUBLIC_NOINDEX";
  if (DYNAMIC.test(p)) return "DYNAMIC_ROUTE_POLICY";
  return "UNKNOWN";
}

/**
 * Does a real page exist at this exact path? SHELL ownership must use this rather than the crawl
 * namespace: `/tests/c02` is a real page and keeps consumer chrome, but `/tests/nonexistent` is a
 * 404 and must NOT — otherwise the consumer shell wraps the corporate 404 again, one namespace
 * deeper. Crawl policy and shell ownership answer different questions and must not share a rule.
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
    g === "LEGACY_PUBLIC_NOINDEX" ||
    g === "PERSONAL_OR_AUTH_NOINDEX" ||
    g === "ADMIN_INTERNAL_NOINDEX" ||
    g === "DEV_INTERNAL_NOINDEX" ||
    g === "DYNAMIC_ROUTE_POLICY"
  ) {
    return "CONSUMER";
  }
  return "CORPORATE";
}

/** Only the four corporate routes are sitemap-eligible. Everything else, including UNKNOWN. */
export function isSitemapEligible(pathname: string): boolean {
  return classify(pathname) === "CORPORATE_INDEXABLE";
}

/** Indexable iff explicitly corporate-indexable. Fails closed for anything unrecognised. */
export function isIndexable(pathname: string): boolean {
  return classify(pathname) === "CORPORATE_INDEXABLE";
}
