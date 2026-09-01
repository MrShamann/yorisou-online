import type { Metadata } from "next";

import CompanyView from "../_views/CompanyView";
import { PROTOTYPE_ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "会社情報 — Yorisou",
  description: "正式な会社情報は、確認済みの登録情報に基づき公開します。",
  robots: { index: false, follow: false },
};

/**
 * Deliberately a designed pending state, not an apology or an empty page.
 *
 * No registered name, address, postcode, representative, establishment date, corporate number,
 * capital, or registered business purpose appears here, and the live /company page was NOT used as
 * a source — its values are internally inconsistent and unverified.
 */

/** Evidence-comparison surface. Same view as the final-route candidate, prototype URLs. */
export default function CompanyPage() {
  return <CompanyView routes={PROTOTYPE_ROUTES} />;
}
