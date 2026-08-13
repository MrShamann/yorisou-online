// LEGACY COMPATIBILITY ROUTE.
//
// `/check-in` has meant two different products over this codebase's life: a short current-state
// interaction, and then the 120-question いま色テスト that lives here today. That drift is the defect
// PXR-1 exists to stop repeating.
//
// A route that returns 200 while showing a different product is still a compatibility break — worse
// than a 404, because nothing signals to the person that what they saved is gone. Every shared link,
// saved link, LINE return and bookmark pointing here was created with the 120Q in mind, so this route
// keeps delivering exactly that.
//
// THE QUERY STRING IS PART OF THE CONTRACT, not decoration. LINE mini-app entries arrive here as
// `/check-in?source=line&entry_source=line-mini-app&nav=hard&v=…`, and the 120Q runtime reads those
// to decide `isMiniAppEntry` — which changes how completion navigates: a LINE entry goes straight to
// `/result`, a web entry goes through `/report-loading`. A bare `redirect("/tests/ima-iro")` dropped
// them, so every in-the-wild LINE link would have been silently demoted to the web path while still
// returning 200. That is the same class of failure as serving a different product at the same URL.
//
// The forwarded set is an ALLOWLIST shared with the builder that emits it, not a passthrough:
// `/online-check-in` relays whatever it is handed into this route, so copying the query wholesale
// would make this an open parameter relay into the assessment.
//
// The new lightweight interaction deliberately does NOT reuse this path. It lives at
// `/today/check-in`. Reclaiming `/check-in` is a later migration decision that needs inbound-link
// evidence, not a rename.
import { redirect } from "next/navigation";

import { resolveLegacyCheckInRedirect } from "@/lib/server/miniAppEntryRouting";

/** Permanent: the 120Q is not coming back to this path. */
export default async function LegacyCheckInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  redirect(resolveLegacyCheckInRedirect(params));
}
