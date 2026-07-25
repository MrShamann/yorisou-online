// CPV1 — private development flags (thin adapter over deploymentContext).
//
// The rights gate forbids any rights-incomplete method from appearing on a public
// route OR as a public "coming soon" item. A method surface is public ONLY when its
// registry logic is complete AND its rights record passes AND it is not hidden
// behind a dev flag.
//
// R1 11A.4 — there is now ONE flag interpretation. This module delegates every
// context + flag decision to lib/cpv1/deploymentContext.ts (the single source),
// bound to process.env. It does NOT re-implement production detection or flag
// parsing. Dev flags are OFF by default and require an EXACT known flag token in
// YORISOU_CPV1_DEV_FLAGS in a trusted non-production context; there is no UI to flip
// them.

import {
  isDevFlagEnabled,
  anyDevFlagEnabled,
  type Cpv1DevFlag,
} from "./deploymentContext";

export type { Cpv1DevFlag };

// True only when the EXACT known flag is configured in a trusted, non-production,
// non-unknown context. (Delegates — no separate parsing here.)
export function isDevFlagOn(flag: Cpv1DevFlag): boolean {
  return isDevFlagEnabled(flag, process.env);
}

// True when any CPV1 preview surface is enabled at all in a trusted non-production
// context.
export function isDevPreviewContext(): boolean {
  return anyDevFlagEnabled(process.env);
}
