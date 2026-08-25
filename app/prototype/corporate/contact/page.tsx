import type { Metadata } from "next";

import ContactView from "../_views/ContactView";
import { PROTOTYPE_ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "お問い合わせ — Yorisou",
  description: "確認済みの連絡先を用意でき次第、この場所に掲載します。",
  robots: { index: false, follow: false },
};

/**
 * No form, no mailto, no invented address, and nothing that submits data anywhere.
 * A contact route that collects input before a verified channel exists would be worse than no route.
 */

/** Evidence-comparison surface. Same view as the final-route candidate, prototype URLs. */
export default function ContactPage() {
  return <ContactView routes={PROTOTYPE_ROUTES} />;
}
