import type { Metadata } from "next";

import Shell from "@/app/_corporate/Shell";
import PendingView from "@/app/_corporate/PendingView";

/** CORP-P5 — YORISOU LLC corporate route. PREVIEW ONLY; this branch is never deployed to Production. */
export const metadata: Metadata = {
  title: "お問い合わせ — Yorisou",
  description: "検証済みの法人連絡先が確立するまで、問い合わせ窓口は公開しません。",
  openGraph: { title: "お問い合わせ — Yorisou", description: "検証済みの法人連絡先が確立するまで、問い合わせ窓口は公開しません。", type: "website", locale: "ja_JP", siteName: "Yorisou" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Shell current="/contact">
      <PendingView which="contact" />
    </Shell>
  );
}
