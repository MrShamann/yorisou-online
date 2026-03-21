import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | 新規登録",
  description: "Yorisouのアカウントを作成し、相談内容やご提案をまとめて確認できます。",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "email_exists":
      return "そのメールアドレスはすでに登録されています。";
    case "weak_password":
      return "パスワードは12文字以上で、大文字・小文字・数字・記号をそれぞれ1文字以上含めてください。";
    case "invalid_payload":
      return "入力内容を確認してください。";
    default:
      return code ? "処理に失敗しました。時間をおいてお試しください。" : null;
  }
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const viewer = await getViewerContext();
  const params = (await searchParams) || {};
  return <AccountEntryForm mode="register" locale="ja" initialAccount={viewer.account} initialError={getErrorMessage(params.error)} />;
}
