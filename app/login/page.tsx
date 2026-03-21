import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | ログイン",
  description: "Yorisouのサポートページへログインし、相談履歴やご提案内容を確認できます。",
};

export default async function LoginPage() {
  const viewer = await getViewerContext();
  return <AccountEntryForm mode="login" locale="ja" initialAccount={viewer.account} />;
}
