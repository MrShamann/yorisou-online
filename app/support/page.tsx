import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";

export const metadata: Metadata = {
  title: "Yorisou | サポートページ",
  description: "相談履歴、ご提案内容、ご家族共有、継続相談、フォローアップをまとめて確認できるYorisouの会員ページです。",
};

export default function SupportPage() {
  return <SupportWorkspace locale="ja" />;
}
