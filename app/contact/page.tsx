import type { Metadata } from "next";

import ContactView from "@/app/prototype/corporate/_views/ContactView";
import { FINAL_ROUTES } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — final-route candidate. LOCAL ONLY: this branch is never pushed and never deployed.
 * The page is a thin wrapper: the accepted CORP-P3R1 view is rendered with the final URL set, so
 * there is exactly one corporate implementation and `/prototype/corporate/**` stays available for
 * evidence comparison.
 */
export const metadata: Metadata = {
  title: "お問い合わせ — Yorisou",
  description: "確認済みの連絡先を用意でき次第、この場所に掲載します。",
  // CORP-P4A §6 — noindex while VERIFIED_CORPORATE_CONTACT_REQUIRED is open.
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return <ContactView routes={FINAL_ROUTES} />;
}
