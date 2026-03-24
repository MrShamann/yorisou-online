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
    case "not_configured":
      return "LINEログインの設定がまだ完了していません。";
    case "missing_auth":
      return "LINE認証情報が見つかりませんでした。もう一度お試しください。";
    case "session_mismatch":
      return "現在のログイン状態を確認できませんでした。もう一度お試しください。";
    case "cancelled":
      return "LINEログインはキャンセルされました。";
    case "invalid_state":
      return "LINEログインの確認に失敗しました。もう一度お試しください。";
    case "token_exchange":
      return "LINE認証の確認に失敗しました。";
    case "profile_mismatch":
      return "LINEアカウント情報の確認に失敗しました。";
    case "line_not_registered":
      return "このLINEアカウントはまだYorisouに登録されていません。LINEではじめるから続けてください。";
    case "bind_failed":
      return "LINEログインの保存に失敗しました。";
    case "unexpected_error":
      return "LINEログイン中にエラーが発生しました。";
    default:
      return code ? "処理に失敗しました。時間をおいてお試しください。" : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "password_reset":
      return "新しいパスワードを保存しました。ログインしてください。";
    case "line_connected":
      return "LINEログインが完了しました。サポートページへ進めます。";
    default:
      return null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; notice?: string; line_error?: string; line_status?: string }>;
}) {
  const viewer = await getViewerContext();
  const params = (await searchParams) || {};
  return (
    <AccountEntryForm
      mode="login"
      locale="ja"
      initialAccount={viewer.account}
      initialError={getErrorMessage(params.line_error || params.error)}
      initialNotice={getNoticeMessage(params.notice || (params.line_status === "connected" ? "line_connected" : undefined))}
    />
  );
}
