import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | ログイン",
  description: "Yorisouのサポートページへログインし、相談履歴やご提案内容を確認できます。",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "invalid_credentials":
      return "メールアドレスかパスワードが一致しません。";
    case "invalid_payload":
      return "入力内容を確認してください。";
    default:
      return code ? "処理に失敗しました。時間をおいてお試しください。" : null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const viewer = await getViewerContext();
  const params = (await searchParams) || {};
  return <AccountEntryForm mode="login" locale="ja" initialAccount={viewer.account} initialError={getErrorMessage(params.error)} />;
}
