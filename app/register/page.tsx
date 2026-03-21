import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | 新規登録",
  description: "Yorisouのアカウントを作成し、相談内容やご提案をまとめて確認できます。",
};

export default async function RegisterPage() {
  const viewer = await getViewerContext();
  return <AccountEntryForm mode="register" locale="ja" initialAccount={viewer.account} />;
}
