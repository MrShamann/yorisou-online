import type { Metadata } from "next";

import PasswordResetRequestForm from "@/app/components/PasswordResetRequestForm";

export const metadata: Metadata = {
  title: "Yorisou | パスワード再設定",
  description: "Yorisouアカウントのパスワード再設定リンクを送信します。",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "invalid_payload":
      return "メールアドレスを確認してください。";
    default:
      return code ? "処理に失敗しました。時間をおいてお試しください。" : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "sent":
      return "メールアドレスが登録されている場合は、再設定リンクを送信しました。";
    default:
      return null;
  }
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; status?: string }>;
}) {
  const params = (await searchParams) || {};
  return (
    <PasswordResetRequestForm
      locale="ja"
      initialError={getErrorMessage(params.error)}
      initialNotice={getNoticeMessage(params.status)}
    />
  );
}
