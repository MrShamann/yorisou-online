import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | 新規登録",
  description: "Yorisouに登録すると、相談履歴やご提案内容をご本人・ご家族で確認できます。",
};

export default async function RegisterPage() {
  const viewer = await getViewerContext();
  return <AccountEntryForm mode="register" locale="ja" initialAccount={viewer.account} />;
}
