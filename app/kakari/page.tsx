import type { Metadata } from "next";

import KakariView from "@/app/prototype/corporate/_views/KakariView";
import { FINAL_ROUTES, KAKARI } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — final-route candidate. LOCAL ONLY: this branch is never pushed and never deployed.
 * The page is a thin wrapper: the accepted CORP-P3R1 view is rendered with the final URL set, so
 * there is exactly one corporate implementation and `/prototype/corporate/**` stays available for
 * evidence comparison.
 */
export const metadata: Metadata = {
  title: "Kakari — Yorisou",
  description: KAKARI.line,
};

export default function KakariPage() {
  return <KakariView routes={FINAL_ROUTES} />;
}
