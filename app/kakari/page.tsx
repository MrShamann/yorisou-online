import type { Metadata } from "next";

import Shell from "@/app/_corporate/Shell";
import ProjectView from "@/app/_corporate/ProjectView";

/** CORP-P5 — YORISOU LLC corporate route. PREVIEW ONLY; this branch is never deployed to Production. */
export const metadata: Metadata = {
  title: "Kakari — Yorisou",
  description: "日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート。現在は開発中で、一般には公開していません。",
  openGraph: { title: "Kakari — Yorisou", description: "日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート。現在は開発中で、一般には公開していません。", type: "website", locale: "ja_JP", siteName: "Yorisou" },
};

export default function Page() {
  return (
    <Shell current="/kakari">
      <ProjectView which="kakari" />
    </Shell>
  );
}
