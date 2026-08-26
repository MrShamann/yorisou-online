import type { Metadata } from "next";

import Shell from "@/app/_corporate/Shell";
import ProjectView from "@/app/_corporate/ProjectView";

/** CORP-P5 — YORISOU LLC corporate route. PREVIEW ONLY; this branch is never deployed to Production. */
export const metadata: Metadata = {
  title: "Mirai Move — Yorisou",
  description: "日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム。公開サイト稼働中、プラットフォーム機能は開発中です。",
  openGraph: { title: "Mirai Move — Yorisou", description: "日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム。公開サイト稼働中、プラットフォーム機能は開発中です。", type: "website", locale: "ja_JP", siteName: "Yorisou" },
};

export default function Page() {
  return (
    <Shell current="/mirai-move">
      <ProjectView which="mirai-move" />
    </Shell>
  );
}
