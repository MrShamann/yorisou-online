// CPV1 — private development flags.
//
// The rights gate (§8/§22) forbids any rights-incomplete method from appearing
// on a public route OR as a public "coming soon" item. This module is the single
// enforcement point: a method surface is public ONLY when its registry logic is
// complete AND its rights record passes AND it is not hidden behind a dev flag.
//
// Dev flags are OFF by default and can only be turned on for LOCAL/Preview
// development via an environment variable — never in production, never for an
// anonymous public visitor. There is no UI to flip them.

export type Cpv1DevFlag =
  | "cpv1_method_universe_preview" // show rights-blocked method registry in dev tools only
  | "cpv1_understanding_model_ui" // source-separated understanding surfaces (dev)
  | "cpv1_companion_preview" // Companion architecture preview (dev)
  | "cpv1_community_preview" // community architecture preview (dev)
  | "cpv1_archive_legacy_preview"; // Archive/Legacy architecture preview (dev)

// Never enabled in production. In local/Preview, opt in via YORISOU_CPV1_DEV_FLAGS
// (comma-separated flag names). Absent/empty ⇒ everything gated off.
function enabledFlags(): Set<string> {
  if (process.env.NODE_ENV === "production") return new Set();
  const raw = (process.env.YORISOU_CPV1_DEV_FLAGS || "").trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function isDevFlagOn(flag: Cpv1DevFlag): boolean {
  return enabledFlags().has(flag);
}

// Public visibility is the AND of: caller is not a rights-blocked context, the
// flag (if any) is on, and we are not in production for dev-only surfaces.
export function isDevPreviewContext(): boolean {
  return process.env.NODE_ENV !== "production" && enabledFlags().size > 0;
}
