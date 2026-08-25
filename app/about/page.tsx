import type { Metadata } from "next";

import AboutView from "@/app/prototype/corporate/_views/AboutView";
import { FINAL_ROUTES } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — final-route candidate. LOCAL ONLY: this branch is never pushed and never deployed.
 * The page is a thin wrapper: the accepted CORP-P3R1 view is rendered with the final URL set, so
 * there is exactly one corporate implementation and `/prototype/corporate/**` stays available for
 * evidence comparison.
 */
export const metadata: Metadata = {
  title: "私たちについて — Yorisou",
  description: "現場の手順から始め、次の一手が分かるところまでを設計し、境界を明示し、検証できることだけを書く。Yorisouの進め方。",
};

export default function AboutPage() {
  return <AboutView routes={FINAL_ROUTES} />;
}
