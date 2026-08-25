import type { Metadata } from "next";

import AboutView from "../_views/AboutView";
import { PROTOTYPE_ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "私たちについて — Yorisou",
  description:
    "現場の手順から始め、次の一手が分かるところまでを設計し、境界を明示し、検証できることだけを書く。Yorisouの進め方。",
  robots: { index: false, follow: false },
};

/**
 * Method only. No company history, team size, funding, partners, customers, or founder biography —
 * none of that has a verifiable source, so none of it appears. What we can prove is how we work.
 */

/** Evidence-comparison surface. Same view as the final-route candidate, prototype URLs. */
export default function AboutPage() {
  return <AboutView routes={PROTOTYPE_ROUTES} />;
}
