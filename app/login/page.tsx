import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";

export const metadata: Metadata = {
  title: "Yorisou | ログイン",
  description: "Yorisouのサポートページへログインし、相談履歴やご提案内容を確認できます。",
};

export default function LoginPage() {
  return <AccountEntryForm mode="login" locale="ja" />;
}
