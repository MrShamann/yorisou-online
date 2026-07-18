// AIX-3 — Centralized public surface / route-family system.
//
// Replaces the ad-hoc `Set(["/", "/tests", "/open-testing"])` dark-shell
// checks that were duplicated across SiteHeader / SiteFooter / AppShell.
// One source of truth maps a pathname to a *surface family* so the whole
// public site can be completed and themed maintainably.
//
//   immersive : dark "Living Intelligence" shell (hero + WebGL depth)
//   understand: calm branded-light product surface for the retained per-test
//               flows under /tests/* (AIX-3D-2). Light (not dark) by design: the
//               flows embed the shared, hardcoded-light recommendation/conversion
//               components (YorisouCompanionCard / RecommendationSlot /
//               ResultConversionCommunity) that also render on the light LINE
//               mini-app, so the whole test-flow surface is one coherent light
//               grammar. The catalogue /tests stays immersive (the dark entry).
//   editorial : calm branded-light surface for info / trust / legal pages
//               (still uses the nestle BrandLockup, product type + nav)
//   focus     : shell-suppressed flow surfaces (check-in / result / report / line)
//   legacy    : not yet migrated to AIX-3 (old light/card shell) — tracked so
//               the completion contracts and header can treat them honestly.

export type SurfaceFamily =
  | "immersive"
  | "understand"
  | "continuity"
  | "report"
  | "editorial"
  | "focus"
  | "legacy";

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

// AIX-3D-1 (Part D) — English Option B informational routes that must resolve to
// the editorial (light) surface *before* the /en prefix is stripped. Without
// this, normalizePath("/en") -> "/" and normalizePath("/en/partners") ->
// "/partners" would inherit the immersive (dark) family and mismatch the light
// English pages. The remaining /en info routes (/en/about, /en/contact,
// /en/privacy, /en/legal, /en/support) already map to editorial after stripping.
const EN_EDITORIAL_EXACT = new Set<string>(["/en", "/en/partners"]);

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

// AIX-3D-2 — retained per-test detail/flow routes under /tests/* render on the
// calm branded-light Understand surface (shared UnderstandShell grammar). The
// catalogue "/tests" itself stays immersive; only its children are "understand".
// Checked as a prefix so every retained /tests/<slug> flow themes consistently
// with the shared light recommendation/conversion components it embeds — an
// approved family, not the legacy shell.
const UNDERSTAND_PREFIXES = ["/tests"];

export function normalizePath(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  // strip the /en locale prefix for family resolution (EN parity is a separate concern)
  const p = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return p.replace(/\/+$/, "") || "/";
}

const startsWithAny = (p: string, prefixes: string[]) =>
  prefixes.some((pre) => p === pre || p.startsWith(`${pre}/`));

export function surfaceFamily(pathname: string | null | undefined): SurfaceFamily {
  // English informational routes are resolved before the /en prefix is stripped.
  const raw = (pathname || "/").replace(/\/+$/, "") || "/";
  if (EN_EDITORIAL_EXACT.has(raw)) return "editorial";
  const p = normalizePath(pathname);
  // focus takes priority (self-understanding reports + line are reading/flow surfaces)
  if (FOCUS_EXACT.has(p) || startsWithAny(p, FOCUS_PREFIXES)) return "focus";
  if (IMMERSIVE_EXACT.has(p)) return "immersive";
  // Children of /tests (the per-test flows) are the dark Understand surface;
  // the exact "/tests" catalogue is caught by IMMERSIVE_EXACT above.
  if (startsWithAny(p, UNDERSTAND_PREFIXES)) return "understand";
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

// AIX-3D-2 — the retained per-test flows are a calm branded-light surface.
export function isUnderstand(pathname: string | null | undefined): boolean {
  return surfaceFamily(pathname) === "understand";
}

// The shared shell renders in the AIX-3 branded tone (dark on immersive, calm
// light on understand + editorial); it is suppressed on focus routes and kept
// legacy on not-yet-migrated routes.
export function usesBrandedShell(pathname: string | null | undefined): boolean {
  const f = surfaceFamily(pathname);
  return f === "immersive" || f === "understand" || f === "editorial";
}

// Header/footer visual tone. AIX-4 — immersive AND understand (the dark
// Product-Focus test flows) use the dark tone so the shared header/footer match
// the flow body; editorial and legacy use the light tone.
export function shellTone(pathname: string | null | undefined): "dark" | "light" {
  const f = surfaceFamily(pathname);
  return f === "immersive" || f === "understand" ? "dark" : "light";
}

// Whether the shared header/footer should render in the dark tone. Immersive +
// understand (Product-Focus) are dark; editorial and legacy are light.
export function isDarkSurface(pathname: string | null | undefined): boolean {
  return shellTone(pathname) === "dark";
}
