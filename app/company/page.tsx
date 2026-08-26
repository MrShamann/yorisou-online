import type { Metadata } from "next";

import Shell from "@/app/_corporate/Shell";
import PendingView from "@/app/_corporate/PendingView";

/** CORP-P5 — YORISOU LLC corporate route. PREVIEW ONLY; this branch is never deployed to Production. */
export const metadata: Metadata = {
  title: "会社情報 — Yorisou",
  description: "商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。",
  openGraph: { title: "会社情報 — Yorisou", description: "商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。", type: "website", locale: "ja_JP", siteName: "Yorisou" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Shell current="/company">
      <PendingView which="company" />
    </Shell>
  );
}
