import type { Metadata } from "next";

import Shell from "@/app/_corporate/Shell";
import AboutView from "@/app/_corporate/AboutView";

/** CORP-P5 — YORISOU LLC corporate route. PREVIEW ONLY; this branch is never deployed to Production. */
export const metadata: Metadata = {
  title: "私たちについて — Yorisou",
  description: "Yorisouのつくり方、事業の順番、記載する事実の基準。確認できないことは書きません。",
  openGraph: { title: "私たちについて — Yorisou", description: "Yorisouのつくり方、事業の順番、記載する事実の基準。確認できないことは書きません。", type: "website", locale: "ja_JP", siteName: "Yorisou" },
};

export default function Page() {
  return (
    <Shell current="/about">
      <AboutView />
    </Shell>
  );
}
