import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";
import { getSupportWorkspaceData } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | サポートページ",
  description: "相談履歴、ご提案内容、ご家族共有、継続相談、フォローアップをまとめて確認できるYorisouの会員ページです。",
};

export default async function SupportPage() {
  const data = await getSupportWorkspaceData("ja");
  return <SupportWorkspace locale="ja" initialAccount={data.account} initialConsultations={data.consultations} />;
}
