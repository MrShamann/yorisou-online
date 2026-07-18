// AIX-3 — Centralized public surface / route-family system.
//
// Replaces the ad-hoc `Set(["/", "/tests", "/open-testing"])` dark-shell
// checks that were duplicated across SiteHeader / SiteFooter / AppShell.
// One source of truth maps a pathname to a *surface family* so the whole
// public site can be completed and themed maintainably.
//
//   immersive : dark "Living Intelligence" shell (hero + WebGL depth)
//   editorial : calm branded-light surface for info / trust / legal pages
//               (still uses the nestle BrandLockup, product type + nav)
//   focus     : shell-suppressed flow surfaces (check-in / result / report / line)
//   legacy    : not yet migrated to AIX-3 (old light/card shell) — tracked so
//               the completion contracts and header can treat them honestly.

export type SurfaceFamily = "immersive" | "continuity" | "report" | "editorial" | "focus" | "legacy";

// Exact routes that render the immersive dark shell.
const IMMERSIVE_EXACT = new Set<string>([
  "/",
  "/tests",
  "/open-testing",
  "/recommendations",
  "/recommendations/graph",
  "/partners",
  // AIX-3C — core product domains rendered as immersive dark surfaces.
  "/reports",
  "/experiences",
  "/co-design",
  "/saved",
  "/private-state",
]);

// Keep & Return continuity routes (private state space, saved, LINE return).
const CONTINUITY_EXACT = new Set<string>(["/saved", "/private-state"]);
const CONTINUITY_PREFIXES = ["/saved"];

// Deepen / report routes (report overview + reading surfaces).
const REPORT_EXACT = new Set<string>(["/reports"]);
const REPORT_PREFIXES = ["/reports"];

// Exact routes that use the calm branded editorial surface.
const EDITORIAL_EXACT = new Set<string>([
  "/about",
  "/methodology",
  "/contact",
  "/privacy",
  "/legal",
  "/terms",
  "/support",
]);

// Flow routes where the shared header/footer is suppressed (the page owns its
// full-bleed surface). Kept in sync with AppShell suppression.
const FOCUS_EXACT = new Set<string>([
  "/check-in",
  "/online-check-in",
  "/formal-check",
  "/report-loading",
  "/report-preview",
  "/result",
  "/result/share",
  "/result/continue",
  "/result/return",
]);
const FOCUS_PREFIXES = ["/line", "/reports/self-understanding"];

export function normalizePath(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  // strip the /en locale prefix for family resolution (EN parity is a separate concern)
  const p = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return p.replace(/\/+$/, "") || "/";
}

const startsWithAny = (p: string, prefixes: string[]) =>
  prefixes.some((pre) => p === pre || p.startsWith(`${pre}/`));

export function surfaceFamily(pathname: string | null | undefined): SurfaceFamily {
  const p = normalizePath(pathname);
  // focus takes priority (self-understanding reports + line are reading/flow surfaces)
  if (FOCUS_EXACT.has(p) || startsWithAny(p, FOCUS_PREFIXES)) return "focus";
  if (IMMERSIVE_EXACT.has(p)) return "immersive";
  if (CONTINUITY_EXACT.has(p) || startsWithAny(p, CONTINUITY_PREFIXES)) return "continuity";
  if (REPORT_EXACT.has(p) || startsWithAny(p, REPORT_PREFIXES)) return "report";
  if (EDITORIAL_EXACT.has(p)) return "editorial";
  return "legacy";
}

// Disposition for the AIX-3B route manifest / completion contracts.
export type RouteDisposition = "canonical" | "child" | "redirect" | "internal" | "retire";

export function isImmersive(pathname: string | null | undefined): boolean {
  return surfaceFamily(pathname) === "immersive";
}

export function isEditorial(pathname: string | null | undefined): boolean {
  return surfaceFamily(pathname) === "editorial";
}

// The shared shell renders in the AIX-3 branded tone (dark on immersive, calm
// on editorial) for both immersive and editorial families; it is suppressed on
// focus routes and kept legacy on not-yet-migrated routes.
export function usesBrandedShell(pathname: string | null | undefined): boolean {
  const f = surfaceFamily(pathname);
  return f === "immersive" || f === "editorial";
}

// Header/footer visual tone. Editorial + legacy use the light tone; immersive
// uses the dark tone.
export function shellTone(pathname: string | null | undefined): "dark" | "light" {
  return surfaceFamily(pathname) === "immersive" ? "dark" : "light";
}
