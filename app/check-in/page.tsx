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
// The new lightweight interaction deliberately does NOT reuse this path. It lives at
// `/today/check-in`. Reclaiming `/check-in` is a later migration decision that needs inbound-link
// evidence, not a rename.
import { redirect } from "next/navigation";

/** Permanent: the 120Q is not coming back to this path. */
export default function LegacyCheckInPage() {
  redirect("/tests/ima-iro");
}
