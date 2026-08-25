import type { Metadata } from "next";

import KakariView from "../_views/KakariView";
import { KAKARI, PROTOTYPE_ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "Kakari — Yorisou",
  description: KAKARI.line,
  robots: { index: false, follow: false },
};

/** Every claim here traces to kakari/PROJECT_START_HERE.md — see the CORP-P2 claim ledger. */

/** Evidence-comparison surface. Same view as the final-route candidate, prototype URLs. */
export default function KakariPage() {
  return <KakariView routes={PROTOTYPE_ROUTES} />;
}
