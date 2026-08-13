type MiniAppLocale = "ja" | "en";

type MiniAppSearchParams = Record<string, string | string[] | undefined>;
export const LINE_MINI_APP_NAV_VERSION = "20260702-pr61" as const;

/** Where the 120Q いま色テスト actually lives. Named once so no caller re-types the path. */
export const CANONICAL_ASSESSMENT_PATH = "/tests/ima-iro" as const;

/**
 * Every query parameter the Japanese mini-app check-in handoff can emit.
 *
 * This list is the CONTRACT BETWEEN TWO PLACES, which is the whole reason it is a shared constant
 * rather than two hand-written lists:
 *
 *   • `buildMiniAppCheckInHandoffHref` writes them onto a LINE entry URL;
 *   • the legacy `/check-in` route must carry exactly these across its redirect, because the 120Q
 *     runtime reads `entry_source` / `source` / `nav` to decide `isMiniAppEntry`, which changes how
 *     completion navigates — a LINE entry goes straight to `/result`, a web entry goes through
 *     `/report-loading`.
 *
 * A bare `redirect("/tests/ima-iro")` drops the query string, silently demoting every LINE visitor
 * to the web completion path. A test asserts the builder emits nothing outside this list, so the
 * two sides cannot drift apart later.
 */
export const GOVERNED_MINI_APP_HANDOFF_PARAMS = [
  "source",
  "entry_source",
  "nav",
  "v",
  "session_context_flags",
  "line_status",
  "line_error",
  "line_friendship",
] as const;

export type GovernedMiniAppHandoffParam = (typeof GOVERNED_MINI_APP_HANDOFF_PARAMS)[number];

/**
 * Value shapes accepted when carrying a parameter across the legacy redirect.
 *
 * An allowlisted KEY with an unconstrained VALUE is still an open door: these values reach
 * analytics and comparison logic, and one of them being an arbitrary string is not something the
 * legacy route should be the place to discover. The shapes below are deliberately narrower than
 * "any string" and wide enough for everything the governed builder can produce.
 */
const HANDOFF_PARAM_PATTERN: Record<GovernedMiniAppHandoffParam, RegExp> = {
  source: /^[A-Za-z0-9_-]{1,64}$/,
  entry_source: /^[A-Za-z0-9_-]{1,64}$/,
  nav: /^[A-Za-z0-9_-]{1,32}$/,
  v: /^[A-Za-z0-9_.-]{1,64}$/,
  // Flag/status fields are emitted upstream as short delimited tokens.
  session_context_flags: /^[A-Za-z0-9_,.:-]{1,256}$/,
  line_status: /^[A-Za-z0-9_,.:-]{1,128}$/,
  line_error: /^[A-Za-z0-9_,.:-]{1,128}$/,
  line_friendship: /^[A-Za-z0-9_,.:-]{1,128}$/,
};

function safeRedirectPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

function readFirstString(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  return "";
}

/**
 * Carry the governed LINE entry context across a redirect.
 *
 * Allowlist, never passthrough. Unknown keys are dropped rather than forwarded: `/online-check-in`
 * forwards whatever it is given into `/check-in`, so a blanket copy here would turn the legacy
 * route into an open query-parameter relay into the assessment.
 */
export function preserveGovernedHandoffParams(searchParams: MiniAppSearchParams): URLSearchParams {
  const preserved = new URLSearchParams();

  for (const key of GOVERNED_MINI_APP_HANDOFF_PARAMS) {
    const value = readFirstString(searchParams[key]);
    if (!value) continue;
    if (!HANDOFF_PARAM_PATTERN[key].test(value)) continue;
    preserved.set(key, value);
  }

  return preserved;
}

/**
 * Where legacy `/check-in` sends a visitor.
 *
 * Always the canonical 120Q, never back to `/check-in` — the target path is a constant, so no
 * input can turn this into a redirect loop.
 */
export function resolveLegacyCheckInRedirect(searchParams: MiniAppSearchParams): string {
  const preserved = preserveGovernedHandoffParams(searchParams);
  const query = preserved.toString();
  return query ? `${CANONICAL_ASSESSMENT_PATH}?${query}` : CANONICAL_ASSESSMENT_PATH;
}

export function buildMiniAppResultHandoffHref(input: {
  locale: MiniAppLocale;
  searchParams: MiniAppSearchParams;
}) {
  const locale = input.locale;
  const targetPath = locale === "en" ? "/en/result" : "/result";
  const params = new URLSearchParams();

  params.set("source", "line");
  params.set("entry_source", "line-mini-app");
  params.set("nav", "hard");
  params.set("v", LINE_MINI_APP_NAV_VERSION);

  const returnTo = safeRedirectPath(
    readFirstString(input.searchParams.returnTo),
    locale === "en" ? "/en/support" : "/support",
  );
  params.set("returnTo", returnTo);

  const sessionContextFlags = readFirstString(input.searchParams.session_context_flags);
  if (sessionContextFlags) {
    params.set("session_context_flags", sessionContextFlags);
  }

  const lineStatus = readFirstString(input.searchParams.line_status);
  if (lineStatus) {
    params.set("line_status", lineStatus);
  }

  const lineError = readFirstString(input.searchParams.line_error);
  if (lineError) {
    params.set("line_error", lineError);
  }

  const lineFriendship = readFirstString(input.searchParams.line_friendship);
  if (lineFriendship) {
    params.set("line_friendship", lineFriendship);
  }

  const query = params.toString();
  return query ? `${targetPath}?${query}` : targetPath;
}

export function buildMiniAppCheckInHandoffHref(input: {
  locale: MiniAppLocale;
  searchParams: MiniAppSearchParams;
}) {
  const locale = input.locale;
  // PXR-1 route semantics: new Japanese LINE entries go STRAIGHT to the canonical 120Q rather than
  // through the legacy path. `/check-in` still resolves for links already in the wild — see
  // `resolveLegacyCheckInRedirect` — but nothing new should be minted pointing at a redirect.
  //
  // English is left exactly as it was. There is no English light interaction and no approved
  // English copy for one, so re-pointing `/en/check-in` here would be a product decision this
  // remediation has no authority to make. It reaches the same 120Q via `/check-in`, which now
  // preserves the entry context instead of discarding it.
  const targetPath = locale === "en" ? "/en/check-in" : CANONICAL_ASSESSMENT_PATH;
  const params = new URLSearchParams();

  params.set("source", "line");
  params.set("entry_source", "line-mini-app");
  params.set("nav", "hard");
  params.set("v", LINE_MINI_APP_NAV_VERSION);

  const sessionContextFlags = readFirstString(input.searchParams.session_context_flags);
  if (sessionContextFlags) {
    params.set("session_context_flags", sessionContextFlags);
  }

  const lineStatus = readFirstString(input.searchParams.line_status);
  if (lineStatus) {
    params.set("line_status", lineStatus);
  }

  const lineError = readFirstString(input.searchParams.line_error);
  if (lineError) {
    params.set("line_error", lineError);
  }

  const lineFriendship = readFirstString(input.searchParams.line_friendship);
  if (lineFriendship) {
    params.set("line_friendship", lineFriendship);
  }

  const query = params.toString();
  return query ? `${targetPath}?${query}` : targetPath;
}
