import type { Metadata } from "next";
import { redirect } from "next/navigation";

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
    case "not_configured":
      return "LINEではじめる設定がまだ完了していません。";
    case "missing_auth":
      return "LINE認証情報が見つかりませんでした。もう一度お試しください。";
    case "session_mismatch":
      return "現在の状態を確認できませんでした。もう一度お試しください。";
    case "cancelled":
      return "LINEではじめる処理はキャンセルされました。";
    case "invalid_state":
      return "LINE認証の確認に失敗しました。もう一度お試しください。";
    case "token_exchange":
      return "LINE認証の確認に失敗しました。";
    case "profile_mismatch":
      return "LINEアカウント情報の確認に失敗しました。";
    case "bind_failed":
      return "LINE登録の保存に失敗しました。";
    case "unexpected_error":
      return "LINE登録中にエラーが発生しました。";
    default:
      return code ? "処理に失敗しました。時間をおいてお試しください。" : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "line_connected":
      return "LINEアカウントで開始しました。サポートページへ進めます。";
    default:
      return null;
  }
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; line_error?: string; line_status?: string }>;
}) {
  const viewer = await getViewerContext();
  if (viewer.session?.userId && viewer.account) {
    redirect("/support");
  }
  const params = (await searchParams) || {};
  return (
    <AccountEntryForm
      mode="register"
      locale="ja"
      initialAccount={viewer.session?.userId ? viewer.account : null}
      initialError={getErrorMessage(params.line_error || params.error)}
      initialNotice={getNoticeMessage(params.line_status === "connected" ? "line_connected" : undefined)}
    />
  );
}
