import type { Metadata } from "next";

import PasswordResetForm from "@/app/components/PasswordResetForm";
import { validatePasswordResetToken } from "@/lib/server/yorisouData";

export const metadata: Metadata = {
  title: "Yorisou | 新しいパスワード",
  description: "Yorisouアカウントの新しいパスワードを設定します。",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "expired_token":
      return "この再設定リンクの有効期限が切れています。";
    case "used_token":
      return "この再設定リンクはすでに使用されています。";
    case "weak_password":
      return "パスワードは12文字以上で、大文字・小文字・数字・記号をそれぞれ1文字以上含めてください。";
    default:
      return code ? "この再設定リンクは無効です。" : null;
  }
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string; error?: string }>;
}) {
  const params = (await searchParams) || {};
  const token = params.token || "";
  const validation = token ? await validatePasswordResetToken(token) : { ok: false as const };
  const derivedError = params.error || (token && "reason" in validation ? validation.reason : undefined);

  return (
    <PasswordResetForm
      locale="ja"
      token={token}
      tokenValid={Boolean(token && validation.ok)}
      initialError={getErrorMessage(derivedError)}
    />
  );
}
