import type { Metadata } from "next";

import CompanyView from "@/app/prototype/corporate/_views/CompanyView";
import { FINAL_ROUTES } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — final-route candidate. LOCAL ONLY: this branch is never pushed and never deployed.
 * The page is a thin wrapper: the accepted CORP-P3R1 view is rendered with the final URL set, so
 * there is exactly one corporate implementation and `/prototype/corporate/**` stays available for
 * evidence comparison.
 */
export const metadata: Metadata = {
  title: "会社情報 — Yorisou",
  description: "正式な会社情報は、確認済みの登録情報に基づき公開します。",
  // CORP-P4A §6 — noindex while COMPANY_REGISTRATION_SOURCE_REQUIRED is open.
  robots: { index: false, follow: true },
};

export default function CompanyPage() {
  return <CompanyView routes={FINAL_ROUTES} />;
}
