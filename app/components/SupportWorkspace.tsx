"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getPasswordPolicyMessage, PASSWORD_RULES } from "@/lib/passwordPolicy";
import LineBrandIcon from "@/app/components/LineBrandIcon";
import ScenarioSupportAssistant from "@/app/components/ScenarioSupportAssistant";
import type {
  AccountRecord,
  ConsultationRecord,
  LineBindingStatus,
  LineWebhookEventRecord,
  SupportProfile,
} from "@/lib/server/yorisouData";

type Locale = "ja" | "en";
type SupportDiagnostics = {
  summaryState:
    | "canonical_healthy"
    | "canonical_with_compatibility_fallback"
    | "fallback_active"
    | "owner_unresolved";
  lineBinding: {
    status: LineBindingStatus;
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  };
  supportProfile: {
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  };
  preferences: {
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
    activeWriteTarget: "principal_aware_target" | "legacy_account_target";
  };
  ownerResolution: {
    mode: "principal_aware" | "legacy_fallback" | "unresolved";
    principalId: string | null;
    legacyAccountId: string | null;
    activeWriteTargetId: string | null;
  };
  readFallback: {
    active: boolean;
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  };
};
type AccessAccountability = {
  auditLogged: boolean;
  accessType: "support_self_view" | "admin_target_view";
  latestConsent: {
    available: boolean;
    consentType: "account_registration" | "line_identity_binding" | "line_primary_login" | "email_identity_attachment" | null;
    timestamp: string | null;
  };
};
type LineReadiness = {
  identityState: "bound" | "not_bound" | "unresolved";
  loginReadiness: "available" | "limited" | "unresolved";
  continuityStatus: "ready" | "partial" | "not_ready" | "unresolved";
  source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  lineIdentityPresent: boolean;
  principalResolved: boolean;
  compatibilityOrFallbackActive: boolean;
  loginConfigured: boolean;
  messagingConfigured: boolean;
};

const lineStatusLabels: Record<Locale, Record<LineBindingStatus, string>> = {
  ja: {
    not_connected: "未登録",
    registered: "連絡先登録済み",
    connected: "連携済み",
  },
  en: {
    not_connected: "Not connected",
    registered: "Contact saved",
    connected: "Connected",
  },
};

export default function SupportWorkspace({
  locale,
  initialAccount,
  initialSupportDiagnostics,
  initialLineReadiness,
  initialAccessAccountability,
  initialConsultations,
  initialLatestLineEvent,
  lineAuthReady,
  lineMessagingReady,
  lineNotice,
  lineError,
}: {
  locale: Locale;
  initialAccount: AccountRecord | null;
  initialSupportDiagnostics: SupportDiagnostics;
  initialLineReadiness: LineReadiness;
  initialAccessAccountability: AccessAccountability;
  initialConsultations: ConsultationRecord[];
  initialLatestLineEvent: LineWebhookEventRecord | null;
  lineAuthReady: boolean;
  lineMessagingReady: boolean;
  lineNotice: string;
  lineError: string;
}) {
  const [account, setAccount] = useState<AccountRecord | null>(initialAccount);
  const [consultations] = useState<ConsultationRecord[]>(initialConsultations);
  const [shareMessage, setShareMessage] = useState("");
  const [lineForm, setLineForm] = useState<SupportProfile>(
    initialAccount?.supportProfile || {
      lineBindingStatus: "not_connected",
      lineDisplayName: "",
      lineNotificationsEnabled: false,
      familyContactName: "",
      familyContactRelation: "",
      familyContactMethod: "",
      familyContactValue: "",
      familyShareNote: "",
    }
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const latest = consultations[0] || null;
  const followups = useMemo(() => consultations.filter((entry) => entry.leadSubmitted), [consultations]);
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";
  const advisorHref = locale === "ja" ? "/support#scenario-assistant" : "/en/support#scenario-assistant";
  const productsHref = locale === "ja" ? "/products" : "/en/products";
  const lineStartHref =
    locale === "ja"
      ? `/api/line/auth/start?locale=ja&intent=support&returnTo=${encodeURIComponent("/support#line-connect")}`
      : `/api/line/auth/start?locale=en&intent=support&returnTo=${encodeURIComponent("/en/support#line-connect")}`;
  const lineStatusLabel = lineStatusLabels[locale][lineForm.lineBindingStatus];
  const diagnosticsLineStatusLabel = lineStatusLabels[locale][initialSupportDiagnostics.lineBinding.status];
  const isLineConnected = lineForm.lineBindingStatus === "connected" && Boolean(account?.lineUserId);
  const latestLineEventLabel = initialLatestLineEvent
    ? locale === "ja"
      ? `${formatDate(initialLatestLineEvent.receivedAt, locale)} / ${initialLatestLineEvent.eventType}`
      : `${formatDate(initialLatestLineEvent.receivedAt, locale)} / ${initialLatestLineEvent.eventType}`
    : "";
  const lineNoticeMessage =
    lineNotice === "connected"
      ? locale === "ja"
        ? "LINEアカウントを連携しました。"
        : "LINE account connected."
      : "";
  const lineErrorMessage = (() => {
    if (!lineError) {
      return "";
    }
    const messagesJa: Record<string, string> = {
      not_configured: "LINE連携の設定がまだ完了していません。",
      missing_auth: "LINE連携の認証情報が見つかりませんでした。もう一度お試しください。",
      session_mismatch: "ログイン状態を確認できませんでした。ログインし直してからお試しください。",
      cancelled: "LINE連携はキャンセルされました。",
      invalid_state: "LINE連携の確認に失敗しました。もう一度お試しください。",
      token_exchange: "LINE側の認証確認に失敗しました。",
      profile_mismatch: "LINEアカウント情報の確認に失敗しました。",
      bind_failed: "LINE連携の保存に失敗しました。",
      unexpected_error: "LINE連携中にエラーが発生しました。",
    };
    const messagesEn: Record<string, string> = {
      not_configured: "LINE connection is not configured yet.",
      missing_auth: "LINE authorization details were not found. Please try again.",
      session_mismatch: "The current login session could not be confirmed. Please log in again.",
      cancelled: "LINE connection was cancelled.",
      invalid_state: "LINE verification failed. Please try again.",
      token_exchange: "Failed to verify LINE authorization.",
      profile_mismatch: "Failed to confirm the LINE account identity.",
      bind_failed: "Failed to save the LINE connection.",
      unexpected_error: "An unexpected error occurred during LINE connection.",
    };
    return locale === "ja" ? messagesJa[lineError] || messagesJa.unexpected_error : messagesEn[lineError] || messagesEn.unexpected_error;
  })();

  async function copyShareText() {
    if (!latest) {
      return;
    }

    const baseLines = [
      locale === "ja" ? "Yorisou 相談内容メモ" : "Yorisou consultation note",
      `${locale === "ja" ? "おすすめ" : "Recommended"}: ${latest.recommendedCategory}`,
      `${locale === "ja" ? "次点候補" : "Second option"}: ${latest.secondaryRecommendation}`,
      `${locale === "ja" ? "要点" : "Summary"}: ${latest.summary}`,
      `${locale === "ja" ? "次の動き" : "Next step"}: ${latest.suggestedNextAction}`,
    ];
    const text = [...baseLines, lineForm.familyShareNote].filter(Boolean).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setShareMessage(locale === "ja" ? "共有用メモをコピーしました。" : "Share note copied.");
    } catch {
      setShareMessage(locale === "ja" ? "コピーに失敗しました。" : "Failed to copy.");
    }
  }

  async function saveSupportProfile() {
    setIsSaving(true);
    setSaveError("");
    setSaveMessage("");

    try {
      const response = await fetch("/api/support/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lineForm),
      });

      const result = (await response.json()) as {
        success?: boolean;
        supportProfile?: SupportProfile | null;
        error?: string;
      };

      if (!response.ok || !result.success || !result.supportProfile) {
        if (response.status === 401 || result.error === "unauthorized") {
          setSaveError(
            locale === "ja"
              ? "ログイン状態を確認できませんでした。ログインし直してから保存してください。"
              : "Your session could not be confirmed. Please log in again before saving.",
          );
          return;
        }

        setSaveError(locale === "ja" ? "保存に失敗しました。" : "Failed to save.");
        return;
      }

      setLineForm(result.supportProfile);
      setAccount((current) => (current ? { ...current, supportProfile: result.supportProfile! } : current));
      setSaveMessage(locale === "ja" ? "サポート設定を保存しました。" : "Support settings saved.");
    } catch {
      setSaveError(locale === "ja" ? "通信に失敗しました。" : "Request failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function changePassword() {
    setPasswordMessage("");
    setPasswordError("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPasswordError(locale === "ja" ? "すべての項目を入力してください。" : "Fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError(locale === "ja" ? "新しいパスワードが一致しません。" : "New passwords do not match.");
      return;
    }

    if (!PASSWORD_RULES.every((rule) => rule.test(passwordForm.newPassword))) {
      setPasswordError(getPasswordPolicyMessage(locale));
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...passwordForm,
          locale,
        }),
      });

      const result = (await response.json()) as { success?: boolean; error?: string; message?: string };

      if (!response.ok || !result.success) {
        if (response.status === 401 || result.error === "unauthorized") {
          setPasswordError(
            locale === "ja"
              ? "ログイン状態を確認できませんでした。ログインし直してから更新してください。"
              : "Your session could not be confirmed. Please log in again before updating your password.",
          );
          return;
        }
        if (result.error === "invalid_current_password") {
          setPasswordError(locale === "ja" ? "現在のパスワードが正しくありません。" : "Current password is incorrect.");
          return;
        }
        if (result.error === "weak_password") {
          setPasswordError(result.message || getPasswordPolicyMessage(locale));
          return;
        }
        if (result.error === "password_mismatch") {
          setPasswordError(locale === "ja" ? "新しいパスワードが一致しません。" : "New passwords do not match.");
          return;
        }
        setPasswordError(locale === "ja" ? "パスワードの更新に失敗しました。" : "Failed to update password.");
        return;
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordMessage(locale === "ja" ? "パスワードを更新しました。" : "Password updated.");
    } catch {
      setPasswordError(locale === "ja" ? "通信に失敗しました。" : "Request failed.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccount(null);
    window.location.href = loginHref;
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-[#F7F0E5] text-[#312321]">
        <section className="border-b border-[#D8C6B4]/28 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(247,240,229,0.98)_62%)] px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="shell-card max-w-4xl p-8 md:p-12">
              <div className="service-kicker">{locale === "ja" ? "ご相談はこちら" : "Consultation support access"}</div>
              <h1 className="display-serif mt-4 text-4xl leading-[1.18] md:text-6xl">
                {locale === "ja" ? "ご相談のつづきを確認する" : "Continue your estimate or support conversation"}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
                {locale === "ja"
                  ? "LINEでもメールでも、ご相談内容やご案内をやさしく確認できます。"
                  : "Continue quickly with LINE, or use email if you prefer. After sign-in, you can review your recommendations, notes, and support history in one place."}
              </p>
              <div className="mt-8">
                <ScenarioSupportAssistant locale={locale} />
              </div>
              <div className="mt-8 rounded-[2rem] border border-[#C7D7C1] bg-[linear-gradient(180deg,#F4F9F3_0%,#EDF6EB_100%)] px-6 py-6 text-sm leading-7 text-[#314236] shadow-[0_18px_40px_rgba(53,81,61,0.08)]">
                <div className="service-kicker text-[#55705C]">{locale === "ja" ? "LINEでやさしく相談する" : "Continue with LINE"}</div>
                <div className="mt-3 text-2xl font-medium">
                  {locale === "ja" ? "LINEでやさしく相談する" : "Continue with LINE"}
                </div>
                <p className="mt-2 text-[#4D5642]">
                  {locale === "ja"
                    ? "ご高齢の方やご家族でも安心してご利用いただけます"
                    : "If your account is already linked to LINE, you can continue straight into support. If it is your first time, this page will show the next step after return."}
                </p>
                <div className="mt-4">
                  {lineAuthReady ? (
                    <Link href={lineStartHref} className="btn btn-primary bg-[#06C755] shadow-[0_16px_30px_rgba(6,199,85,0.22)]">
                      <LineBrandIcon className="h-5 w-5" />
                      {locale === "ja" ? "LINEでやさしく相談する" : "Continue with LINE"}
                    </Link>
                  ) : (
                    <div className="inline-flex rounded-full border border-[#D6C3A3]/60 px-5 py-3 text-sm text-[#8A7764]">
                      {locale === "ja" ? "現在はLINE連携を準備中です" : "LINE sign-in is not available yet"}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs leading-6 text-[#55705C]">
                  {locale === "ja"
                    ? "ご高齢の方やご家族でも安心してご利用いただけます"
                    : "Your first intake on LINE is guided by AI, then we guide you to the next step."}
                </p>
              </div>
              <div className="mt-6 rounded-[1.8rem] border border-[#E0D2C4] bg-[#FFF9F2] px-5 py-5 text-sm leading-7 text-[#5A4B3E]">
                <div className="font-medium text-[#312321]">{locale === "ja" ? "メールで続ける" : "Continue with email"}</div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <Link href={loginHref} className="btn btn-secondary">
                    {locale === "ja" ? "メールでログイン" : "Log in with email"}
                  </Link>
                  <Link href={registerHref} className="btn btn-secondary">
                    {locale === "ja" ? "メールで新規登録" : "Create account with email"}
                  </Link>
                </div>
              </div>
              {lineNoticeMessage && <p className="mt-6 text-sm text-[#2E5B3C]">{lineNoticeMessage}</p>}
              {lineErrorMessage && <p className="mt-3 text-sm text-[#9A3B2F]">{lineErrorMessage}</p>}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="shell-card max-w-5xl p-8 md:p-12">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-4xl font-light leading-tight md:text-6xl">
                  {locale === "ja" ? `${account.name}さんのサポートページ` : `${account.name}'s support page`}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
                  {locale === "ja"
                    ? "ご相談内容やご案内、LINEでのやり取りをここでまとめて確認できます。必要に応じて、ご家族共有や次のご相談へ進めます。"
                    : "Review your consultation history, recommendation, and LINE follow-up status here, then move to the next support step when needed."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#D6C3A3]/60 px-6 py-3 text-sm text-[#5A4B3E] transition hover:bg-[#FCFAF6]"
              >
                {locale === "ja" ? "ログアウト" : "Log out"}
              </button>
            </div>
            <div className="mt-8">
              <ScenarioSupportAssistant locale={locale} />
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-[1.8rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-6 py-6">
                <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                  {locale === "ja" ? "ご案内" : "NEXT STEP"}
                </div>
                <h2 className="mt-3 text-2xl font-light leading-tight text-[#3B2F2F]">
                  {latest
                    ? locale === "ja"
                      ? "いまの相談状況"
                      : "Your current consultation status"
                    : locale === "ja"
                      ? "まずは最初の相談を始めましょう"
                      : "Start your first consultation"}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4">
                    <div className="text-sm text-[#8A7764]">{locale === "ja" ? "ご相談中の内容" : "Current topic"}</div>
                    <div className="mt-2 text-lg font-light leading-tight text-[#3B2F2F]">
                      {latest
                        ? latest.recommendedCategory
                        : locale === "ja"
                          ? "まだ相談内容は保存されていません"
                          : "No consultation topic saved yet"}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                      {latest
                        ? latest.summary
                        : locale === "ja"
                          ? "最初の相談で、現在の移動状況やご家族の不安を整理できます。"
                          : "Your first consultation helps organize current mobility needs and family concerns."}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4">
                    <div className="text-sm text-[#8A7764]">{locale === "ja" ? "次のご案内" : "Recommended next step"}</div>
                    <div className="mt-2 text-lg font-light leading-tight text-[#3B2F2F]">
                      {latest
                        ? latest.suggestedNextAction
                        : locale === "ja"
                          ? "まずは相談を始める"
                          : "Start consultation"}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                      {isLineConnected
                        ? locale === "ja"
                          ? "LINE連携は完了しています。必要に応じて、このあとLINEでのご案内も確認できます。"
                          : "LINE is connected. You can also review LINE follow-up status after this."
                        : locale === "ja"
                          ? "LINEで続けたい場合も、このあと落ち着いて確認できます。"
                          : "If you want to continue with LINE, you can also review connection status below."}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href={advisorHref} className="btn btn-secondary">
                    {latest
                      ? locale === "ja"
                        ? "相談を続ける"
                        : "Continue consultation"
                      : locale === "ja"
                        ? "相談を始める"
                        : "Start consultation"}
                  </Link>
                  <Link href={productsHref} className="btn btn-secondary">
                    {locale === "ja" ? "製品を見比べる" : "Browse products"}
                  </Link>
                  <a href="#line-connect" className="btn btn-secondary">
                    {isLineConnected
                      ? locale === "ja"
                        ? "LINEの状況を確認する"
                        : "Review LINE status"
                      : locale === "ja"
                        ? "LINE連携を確認する"
                        : "Review LINE connection"}
                  </a>
                </div>
              </div>
              <div className="rounded-[1.8rem] border border-[#C7D7C1] bg-[linear-gradient(180deg,#F4F9F3_0%,#EDF6EB_100%)] px-6 py-6 text-[#314236] shadow-[0_18px_40px_rgba(53,81,61,0.08)]">
                <div className="text-xs tracking-[0.14em] text-[#55705C]">
                  {locale === "ja" ? "LINEのご案内" : "LINE STATUS"}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${isLineConnected ? "bg-[#E6F4EA] text-[#2E5B3C]" : "bg-white/80 text-[#6E5D4D]"}`}>
                    {isLineConnected ? (locale === "ja" ? "LINE連携済み" : "LINE connected") : lineStatusLabel}
                  </span>
                  <span className="text-sm leading-7 text-[#4D5642]">
                    {isLineConnected
                      ? locale === "ja"
                        ? "このアカウントはLINEログイン済みです。Yorisouからのご案内ややり取りは下のLINE欄で確認できます。"
                        : "This account is connected through LINE login. You can review LINE follow-up status in the LINE section below."
                      : locale === "ja"
                        ? "まだLINE連携は完了していません。必要に応じて、このページからやさしく進められます。"
                        : "LINE is not fully connected yet. You can complete connection from this page if needed."}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 text-sm leading-7 text-[#4D5642]">
                  <div className="rounded-[1.2rem] border border-[#C7D7C1] bg-white/75 px-4 py-4">
                    {lineMessagingReady
                      ? locale === "ja"
                        ? "LINEでメッセージを送ったあと、このページでやり取りの内容を確認できます。"
                        : "After sending a LINE message, you can review the latest intake and reply result on this page."
                      : locale === "ja"
                        ? "LINEでのご案内はご利用いただけます。準備状況は下でも確認できます。"
                        : "LINE status is available here, but please also review the Messaging API configuration below."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <StatCard
            label={locale === "ja" ? "相談件数" : "Consultations"}
            value={String(consultations.length)}
            note={locale === "ja" ? "このページで確認できる相談履歴" : "Consultations available in this workspace"}
          />
          <StatCard
            label={locale === "ja" ? "ご相談中の内容" : "Current topic"}
            value={latest ? latest.recommendedCategory : locale === "ja" ? "未保存" : "None"}
            note={latest ? formatDate(latest.createdAt, locale) : locale === "ja" ? "最新の相談結果はまだありません" : "No saved recommendation yet"}
          />
          <StatCard
            label={locale === "ja" ? "LINEの状況" : "LINE status"}
            value={lineStatusLabel}
            note={
              isLineConnected
                ? locale === "ja"
                  ? "LINEで続けられる状態です"
                  : "Ready to continue with LINE"
                : lineForm.lineNotificationsEnabled
                  ? locale === "ja"
                    ? "フォローアップ有効"
                    : "Follow-up enabled"
                  : locale === "ja"
                    ? "フォローアップ未設定"
                    : "Follow-up disabled"
            }
          />
        </div>
      </section>

      <section id="support-data-status" className="bg-[#F7F0E5] px-6 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-[2rem] border border-[#D6C3A3]/28 bg-white/84 p-6 shadow-[0_20px_48px_rgba(59,47,47,0.05)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs tracking-[0.16em] text-[#8A7764]">
                  {locale === "ja" ? "ご利用状況" : "SUPPORT DATA STATUS"}
                </div>
                <h2 className="mt-2 text-2xl font-light leading-tight text-[#3B2F2F]">
                  {locale === "ja" ? "ご利用状況の確認" : "Current support resolution"}
                </h2>
              </div>
              <p className="text-sm leading-7 text-[#5A4B3E]">
                {locale === "ja"
                  ? "ご利用状況や連携状態を、この画面で確認できます。"
                  : "This panel shows the current canonical read/write state for support."}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${summaryTone(initialSupportDiagnostics.summaryState)}`}>
                {summaryLabel(locale, initialSupportDiagnostics.summaryState)}
              </span>
              <span className="text-sm leading-7 text-[#5A4B3E]">
                {summaryNote(locale, initialSupportDiagnostics.summaryState)}
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatusTile
                label={locale === "ja" ? "LINE連携状態" : "LINE binding status"}
                value={diagnosticsLineStatusLabel}
                tone={sourceTone(initialSupportDiagnostics.lineBinding.source)}
                note={sourceLabel(locale, initialSupportDiagnostics.lineBinding.source)}
              />
              <StatusTile
                label={locale === "ja" ? "ご登録内容" : "Support profile source"}
                value={sourceLabel(locale, initialSupportDiagnostics.supportProfile.source)}
                tone={sourceTone(initialSupportDiagnostics.supportProfile.source)}
                note={
                  initialSupportDiagnostics.supportProfile.source === "canonical"
                    ? locale === "ja"
                      ? "ご家族情報や共有内容を確認できます。"
                      : "Family/contact/share fields are canonical-first"
                    : locale === "ja"
                      ? "一部確認しながらご案内しています。"
                      : "Support profile is being restored from fallback"
                }
              />
              <StatusTile
                label={locale === "ja" ? "ご利用者の確認状況" : "Owner resolution"}
                value={ownerModeLabel(locale, initialSupportDiagnostics.ownerResolution.mode)}
                tone={initialSupportDiagnostics.ownerResolution.mode === "principal_aware" ? "ok" : "warn"}
                note={
                  initialSupportDiagnostics.ownerResolution.principalId
                    ? locale === "ja"
                      ? `確認ID: ${truncateId(initialSupportDiagnostics.ownerResolution.principalId)}`
                      : `principal: ${truncateId(initialSupportDiagnostics.ownerResolution.principalId)}`
                    : locale === "ja"
                      ? "確認中です"
                      : "Principal unresolved"
                }
              />
              <StatusTile
                label={locale === "ja" ? "設定内容" : "Preferences storage"}
                value={sourceLabel(locale, initialSupportDiagnostics.preferences.source)}
                tone={sourceTone(initialSupportDiagnostics.preferences.source)}
                note={
                  initialSupportDiagnostics.preferences.activeWriteTarget === "principal_aware_target"
                    ? locale === "ja"
                      ? "現在の設定を確認できます。"
                      : "active write target: principal-aware"
                    : locale === "ja"
                      ? "一部確認しながらご案内しています。"
                      : "active write target: legacy fallback"
                }
              />
              <StatusTile
                label={locale === "ja" ? "確認状況" : "Read fallback"}
                value={initialSupportDiagnostics.readFallback.active ? sourceLabel(locale, initialSupportDiagnostics.readFallback.source) : locale === "ja" ? "not active" : "not active"}
                tone={initialSupportDiagnostics.readFallback.active ? "warn" : "ok"}
                note={initialSupportDiagnostics.readFallback.active ? (locale === "ja" ? "一部確認しながらご案内しています。" : "Fallback read is active") : locale === "ja" ? "落ち着いてご確認いただけます。" : "Primary read is canonical-first"}
              />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <div className="text-sm text-[#8A7764]">{locale === "ja" ? "確認情報" : "Active owner path"}</div>
                <div className="mt-3 space-y-2 text-sm leading-7 text-[#5A4B3E]">
                  <p>
                    {locale === "ja" ? "確認ID" : "principal id"}:{" "}
                    <span className="font-mono text-[#3B2F2F]">{initialSupportDiagnostics.ownerResolution.principalId || "—"}</span>
                  </p>
                  <p>
                    {locale === "ja" ? "アカウントID" : "legacy account id"}:{" "}
                    <span className="font-mono text-[#3B2F2F]">{initialSupportDiagnostics.ownerResolution.legacyAccountId || "—"}</span>
                  </p>
                  <p>
                    {locale === "ja" ? "設定ID" : "active write target id"}:{" "}
                    <span className="font-mono text-[#3B2F2F]">{initialSupportDiagnostics.ownerResolution.activeWriteTargetId || "—"}</span>
                  </p>
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <div className="text-sm text-[#8A7764]">{locale === "ja" ? "ご案内" : "What this means"}</div>
                <div className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                  {initialSupportDiagnostics.summaryState === "canonical_healthy"
                    ? locale === "ja"
                      ? "現在の内容は落ち着いてご確認いただけます。"
                      : "Support is reading canonical-first, and the owner resolves to a principal-aware target."
                    : initialSupportDiagnostics.summaryState === "canonical_with_compatibility_fallback"
                      ? locale === "ja"
                        ? "一部確認しながらのご案内ですが、必要な内容はご確認いただけます。"
                        : "Core support data is canonical, while some slices still rely on compatibility mirror or fallback reads."
                      : initialSupportDiagnostics.summaryState === "fallback_active"
                        ? locale === "ja"
                          ? "確認が必要な内容を含みますが、このままご覧いただけます。"
                          : "The current view still depends on legacy or compatibility fallback."
                        : locale === "ja"
                          ? "一部確認中の内容があるため、見ながらご案内します。"
                          : "Owner resolution is incomplete, so canonical read is not fully active."}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Panel title={locale === "ja" ? "現在の相談状況" : "Current consultation status"}>
              <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <div className={`rounded-[1.2rem] border px-4 py-4 ${guardrailTone(initialSupportDiagnostics.summaryState)}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs tracking-[0.14em] opacity-75">
                        {locale === "ja" ? "確認状況" : "TARGET INTEGRITY"}
                      </div>
                      <div className="mt-1 text-lg font-medium">{summaryLabel(locale, initialSupportDiagnostics.summaryState)}</div>
                      <p className="mt-2 text-sm leading-7">{guardrailMessage(locale, initialSupportDiagnostics.summaryState)}</p>
                    </div>
                    <a href="#support-data-status" className="text-sm underline underline-offset-4">
                      {locale === "ja" ? "詳しく確認する" : "Review diagnostics"}
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${summaryTone(initialSupportDiagnostics.summaryState)}`}>
                    {summaryLabel(locale, initialSupportDiagnostics.summaryState)}
                  </span>
                  <span className="text-sm leading-7 text-[#5A4B3E]">
                    {locale === "ja"
                      ? "現在のご利用状況を確認するための表示です。"
                      : "This is the current target-truth state for the support context shown in this workspace."}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E] md:col-span-2">
                      <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                        {locale === "ja" ? "ご利用記録" : "ACCOUNTABILITY / PRIVACY"}
                      </div>
                    <div className="mt-2 font-medium text-[#3B2F2F]">
                      {locale === "ja"
                        ? "このページの確認履歴は適切に記録されます。"
                        : "This support access is audit logged."}
                    </div>
                    <div className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                      {initialAccessAccountability.latestConsent.available
                        ? locale === "ja"
                          ? `最近の確認記録: ${consentLabel(locale, initialAccessAccountability.latestConsent.consentType)} / ${formatDate(initialAccessAccountability.latestConsent.timestamp || "", locale)}`
                          : `Latest consent signal: ${consentLabel(locale, initialAccessAccountability.latestConsent.consentType)} / ${formatDate(initialAccessAccountability.latestConsent.timestamp || "", locale)}`
                        : locale === "ja"
                          ? "現在は確認履歴のみをご案内しています。"
                          : "No stable consent status is modeled for display here yet, so this panel currently shows access accountability only."}
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E] md:col-span-2">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                          {locale === "ja" ? "LINEの準備状況" : "LINE READINESS"}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${lineReadinessTone(initialLineReadiness.continuityStatus)}`}>
                            {lineContinuityLabel(locale, initialLineReadiness.continuityStatus)}
                          </span>
                          <span className="text-sm leading-7 text-[#5A4B3E]">
                            {lineReadinessMessage(locale, initialLineReadiness)}
                          </span>
                        </div>
                      </div>
                      <a href="#line-connect" className="text-sm underline underline-offset-4">
                        {locale === "ja" ? "LINE設定を確認する" : "Review LINE setup"}
                      </a>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                      <LineReadinessTile
                        label={locale === "ja" ? "LINE連携" : "LINE identity"}
                        value={lineIdentityLabel(locale, initialLineReadiness.identityState)}
                        note={initialLineReadiness.lineIdentityPresent ? (locale === "ja" ? "連携内容を確認できます。" : "bound LINE identity present") : (locale === "ja" ? "これから連携できます。" : "bound LINE identity not present")}
                      />
                      <LineReadinessTile
                        label={locale === "ja" ? "LINEログイン" : "LINE login readiness"}
                        value={lineLoginReadinessLabel(locale, initialLineReadiness.loginReadiness)}
                        note={initialLineReadiness.loginConfigured ? (locale === "ja" ? "ご利用いただけます。" : "LINE login config available") : (locale === "ja" ? "確認中です。" : "LINE login config unresolved")}
                      />
                      <LineReadinessTile
                        label={locale === "ja" ? "継続のご案内" : "Support continuity"}
                        value={lineContinuityLabel(locale, initialLineReadiness.continuityStatus)}
                        note={initialLineReadiness.principalResolved ? (locale === "ja" ? "このまま進められます。" : "principal-resolved LINE linkage") : (locale === "ja" ? "内容を確認しながら進めます。" : "principal linkage not fully resolved")}
                      />
                      <LineReadinessTile
                        label={locale === "ja" ? "確認状況" : "Source truth"}
                        value={sourceLabel(locale, initialLineReadiness.source)}
                        note={initialLineReadiness.compatibilityOrFallbackActive ? (locale === "ja" ? "一部確認しながらご案内しています。" : "compatibility or fallback still in use") : (locale === "ja" ? "安心してご確認いただけます。" : "canonical source confirmed")}
                      />
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                    <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                      {locale === "ja" ? "確認情報" : "TARGET OWNER"}
                    </div>
                    <div className="mt-2 text-lg font-light text-[#3B2F2F]">
                      {ownerModeLabel(locale, initialSupportDiagnostics.ownerResolution.mode)}
                    </div>
                    <div className="mt-3 space-y-1 font-mono text-xs text-[#3B2F2F]">
                      <div>{locale === "ja" ? "確認ID" : "principal id"}: {initialSupportDiagnostics.ownerResolution.principalId || "—"}</div>
                      <div>{locale === "ja" ? "アカウントID" : "legacy account id"}: {initialSupportDiagnostics.ownerResolution.legacyAccountId || "—"}</div>
                      <div>{locale === "ja" ? "設定ID" : "active write target id"}: {initialSupportDiagnostics.ownerResolution.activeWriteTargetId || "—"}</div>
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                    <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                      {locale === "ja" ? "連携状況" : "CURRENT LINKAGE"}
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        {locale === "ja" ? "LINE連携" : "LINE binding"}:{" "}
                        <span className="font-medium">{sourceLabel(locale, initialSupportDiagnostics.lineBinding.source)}</span>
                      </div>
                      <div>
                        {locale === "ja" ? "ご登録内容" : "support profile"}:{" "}
                        <span className="font-medium">{sourceLabel(locale, initialSupportDiagnostics.supportProfile.source)}</span>
                      </div>
                      <div>
                        {locale === "ja" ? "設定内容" : "preferences"}:{" "}
                        <span className="font-medium">{sourceLabel(locale, initialSupportDiagnostics.preferences.source)}</span>
                      </div>
                      <div>
                        {locale === "ja" ? "確認状況" : "read fallback"}:{" "}
                        <span className="font-medium">
                          {initialSupportDiagnostics.readFallback.active
                            ? sourceLabel(locale, initialSupportDiagnostics.readFallback.source)
                            : locale === "ja"
                              ? "not active"
                              : "not active"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title={locale === "ja" ? "相談履歴" : "Consultation history"}>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((entry) => (
                    <article key={entry.id} className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                      <div className="text-xs tracking-[0.12em] text-[#8A7764]">{formatDate(entry.createdAt, locale)}</div>
                      <h3 className="mt-2 text-xl font-light leading-tight text-[#3B2F2F]">{entry.recommendedCategory}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{entry.summary}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState locale={locale} textJa="まだ相談履歴はありません。まずは相談から始められます。" textEn="No consultation history yet. Start with consultation." />
              )}
            </Panel>

            <Panel title={locale === "ja" ? "現在のご提案" : "Current recommendation"}>
              {latest ? (
                <div className="space-y-4">
                  <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                    <div className="text-sm text-[#8A7764]">{locale === "ja" ? "おすすめ" : "Recommended"}</div>
                    <h3 className="mt-2 text-2xl font-light leading-tight text-[#3B2F2F]">{latest.recommendedCategory}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{latest.summary}</p>
                    <div className="mt-4 rounded-[1.1rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#6B5A4A]">
                      {locale === "ja" ? "次の動き" : "Next step"}: {latest.suggestedNextAction}
                    </div>
                  </div>
                  <Link href={advisorHref} className="btn btn-secondary">
                    {locale === "ja" ? "相談を続ける" : "Continue consultation"}
                  </Link>
                </div>
              ) : (
                <EmptyState locale={locale} textJa="ご提案内容はまだありません。まずは相談や製品比較から始められます。" textEn="No recommendation is saved yet." />
              )}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title={locale === "ja" ? "ご家族共有" : "Family sharing"} id="family-share">
              <div className="grid gap-4">
                <Field label={locale === "ja" ? "ご家族のお名前" : "Family contact name"}>
                  <input
                    value={lineForm.familyContactName}
                    onChange={(event) => setLineForm((current) => ({ ...current, familyContactName: event.target.value }))}
                    className={inputClassName}
                  />
                </Field>
                <Field label={locale === "ja" ? "ご関係" : "Relationship"}>
                  <input
                    value={lineForm.familyContactRelation}
                    onChange={(event) => setLineForm((current) => ({ ...current, familyContactRelation: event.target.value }))}
                    className={inputClassName}
                  />
                </Field>
                <Field label={locale === "ja" ? "連絡先" : "Contact"}>
                  <input
                    value={lineForm.familyContactValue}
                    onChange={(event) => setLineForm((current) => ({ ...current, familyContactValue: event.target.value }))}
                    className={inputClassName}
                  />
                </Field>
                <Field label={locale === "ja" ? "連絡方法" : "Contact method"}>
                  <select
                    value={lineForm.familyContactMethod}
                    onChange={(event) => setLineForm((current) => ({ ...current, familyContactMethod: event.target.value }))}
                    className={inputClassName}
                  >
                    <option value="">{locale === "ja" ? "選択してください" : "Select one"}</option>
                    <option value="line">LINE</option>
                    <option value="phone">{locale === "ja" ? "電話" : "Phone"}</option>
                    <option value="email">Email</option>
                  </select>
                </Field>
                <Field label={locale === "ja" ? "共有メモ" : "Shared note"}>
                  <textarea
                    value={lineForm.familyShareNote}
                    onChange={(event) => setLineForm((current) => ({ ...current, familyShareNote: event.target.value }))}
                    className={`${inputClassName} min-h-[120px]`}
                  />
                </Field>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={copyShareText} className="btn btn-secondary">
                  {locale === "ja" ? "共有内容をコピー" : "Copy share note"}
                </button>
                <button type="button" onClick={saveSupportProfile} className="btn btn-secondary" disabled={isSaving}>
                  {locale === "ja" ? "ご家族情報を保存" : "Save family info"}
                </button>
              </div>
              {shareMessage && <p className="mt-4 text-sm text-[#2E5B3C]">{shareMessage}</p>}
            </Panel>

            <Panel title={locale === "ja" ? "次のご案内" : "Next consultation step"}>
              <p className="text-sm leading-7 text-[#5A4B3E]">
                {locale === "ja"
                  ? "前回の相談を見返しながら、条件を変えてもう一度相談したり、導入後の不安点を追加で送ったりできます。"
                  : "Review the last consultation, then continue with another consultation or compare product options."}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href={advisorHref} className="btn btn-secondary">
                  {locale === "ja" ? "相談を続ける" : "Continue consultation"}
                </Link>
                <Link href={productsHref} className="btn btn-secondary">
                  {locale === "ja" ? "製品を見比べる" : "Browse products"}
                </Link>
              </div>
            </Panel>

            <Panel title={locale === "ja" ? "パスワード変更" : "Change password"}>
              <div className="grid gap-4">
                <Field label={locale === "ja" ? "現在のパスワード" : "Current password"}>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                    className={inputClassName}
                    autoComplete="current-password"
                  />
                </Field>
                <Field label={locale === "ja" ? "新しいパスワード" : "New password"}>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                    className={inputClassName}
                    autoComplete="new-password"
                  />
                </Field>
                <Field label={locale === "ja" ? "新しいパスワード（確認）" : "Confirm new password"}>
                  <input
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, confirmNewPassword: event.target.value }))}
                    className={inputClassName}
                    autoComplete="new-password"
                  />
                </Field>
                <p className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  {getPasswordPolicyMessage(locale)}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={changePassword} className="btn btn-secondary" disabled={isChangingPassword}>
                  {isChangingPassword
                    ? locale === "ja"
                      ? "更新中..."
                      : "Updating..."
                    : locale === "ja"
                      ? "パスワードを更新"
                      : "Update password"}
                </button>
              </div>
              {passwordMessage && <p className="mt-4 text-sm text-[#2E5B3C]">{passwordMessage}</p>}
              {passwordError && <p className="mt-4 text-sm text-[#9A3B2F]">{passwordError}</p>}
            </Panel>

            <Panel title={locale === "ja" ? "LINE連携とご案内" : "LINE connection and follow-up"} id="line-connect">
              <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-[#8A7764]">{locale === "ja" ? "現在の状況" : "Current status"}</div>
                    <div className="mt-2 text-xl font-light leading-tight text-[#3B2F2F]">{lineStatusLabel}</div>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                      {locale === "ja"
                        ? isLineConnected
                          ? "このアカウントには、LINEログインで確認した表示名と連携状態を保存しています。"
                          : "ログイン中のYorisouアカウントに、LINEアカウントを連携できます。"
                        : isLineConnected
                          ? "The verified LINE identity is saved on this Yorisou account."
                          : "Connect a LINE account to the currently logged-in Yorisou account."}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                      {lineMessagingReady
                        ? locale === "ja"
                          ? "LINEでのやり取りを受け取れる状態です。"
                          : "Messaging API receive path is enabled."
                        : locale === "ja"
                          ? "LINEでのやり取りは準備中です。"
                          : "Messaging API is not configured yet."}
                    </p>
                  </div>
                  {isLineConnected ? (
                    <div className="rounded-full border border-[#D6C3A3]/60 px-5 py-3 text-sm text-[#5A4B3E]">
                      {locale === "ja" ? "連携済み" : "Connected"}
                    </div>
                  ) : lineAuthReady ? (
                    <Link href={lineStartHref} className="btn btn-secondary">
                      {locale === "ja" ? "LINEを連携する" : "Connect LINE"}
                    </Link>
                  ) : (
                    <div className="rounded-full border border-[#D6C3A3]/60 px-5 py-3 text-sm text-[#8A7764]">
                      {locale === "ja" ? "設定待ち" : "Awaiting configuration"}
                    </div>
                  )}
                </div>
              </div>
              {lineNoticeMessage && <p className="mt-4 text-sm text-[#2E5B3C]">{lineNoticeMessage}</p>}
              {lineErrorMessage && <p className="mt-4 text-sm text-[#9A3B2F]">{lineErrorMessage}</p>}
              {saveMessage && <p className="mt-4 text-sm text-[#2E5B3C]">{saveMessage}</p>}
              {saveError && <p className="mt-4 text-sm text-[#9A3B2F]">{saveError}</p>}
              {latestLineEventLabel ? (
                <div className="mt-4 rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  <div className="text-xs tracking-[0.14em] text-[#8A7764]">{locale === "ja" ? "最新のLINE案内" : "LATEST LINE EVENT"}</div>
                  <p className="mt-2">
                    {locale === "ja" ? `最新のLINE受信: ${latestLineEventLabel}` : `Latest LINE activity: ${latestLineEventLabel}`}
                  </p>
                  <p>
                    {locale === "ja" ? "返信結果" : "Reply result"}:{" "}
                    <span
                      className={
                        initialLatestLineEvent?.replyStatus === "sent"
                          ? "text-[#2E5B3C]"
                          : initialLatestLineEvent?.replyStatus === "failed"
                            ? "text-[#9A3B2F]"
                            : "text-[#6E5D4D]"
                      }
                    >
                      {lineReplyStatusLabel(locale, initialLatestLineEvent?.replyStatus || "not_attempted")}
                    </span>
                    {initialLatestLineEvent?.replyError ? ` (${initialLatestLineEvent.replyError})` : ""}
                  </p>
                  <p className="text-[#6E5D4D]">
                    {locale === "ja"
                      ? "LINEでメッセージを送信したあとにこの画面を再読み込みすると、最新のやり取りを確認できます。"
                      : "After sending a LINE message, refresh this page to verify the latest event and reply result."}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#6E5D4D]">
                  {locale === "ja"
                    ? "まだLINEでのやり取りは記録されていません。メッセージ送信後に再読み込みすると確認できます。"
                    : "No LINE event has been recorded yet. Follow or send a LINE message, then refresh to verify the result."}
                </p>
              )}
            </Panel>

            <Panel title={locale === "ja" ? "その後のご案内" : "Follow-up"}>
              <div className="grid gap-4">
                <Field label={locale === "ja" ? "LINE表示名" : "LINE display name"}>
                  <div className={`${inputClassName} flex items-center`}>
                    {lineForm.lineDisplayName || (locale === "ja" ? "未登録" : "Not connected")}
                  </div>
                </Field>
                <label className="flex items-start gap-3 rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  <input
                    type="checkbox"
                    checked={lineForm.lineNotificationsEnabled}
                    onChange={(event) => setLineForm((current) => ({ ...current, lineNotificationsEnabled: event.target.checked }))}
                    className="mt-1"
                  />
                  <span>{locale === "ja" ? "LINEでのフォローアップ連絡を受け取る" : "Receive follow-up over LINE"}</span>
                </label>
                <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  {locale === "ja"
                    ? `現在のLINE状態: ${lineStatusLabels.ja[lineForm.lineBindingStatus]}。連携後は、このアカウントで落ち着いて確認できます。`
                    : `Current LINE status: ${lineStatusLabels.en[lineForm.lineBindingStatus]}. The saved account state is shown after connection.`}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={saveSupportProfile} className="btn btn-secondary" disabled={isSaving}>
                  {locale === "ja" ? "LINEの設定を保存" : "Save LINE status"}
                </button>
              </div>
              {followups.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {followups.map((entry) => (
                    <div key={entry.id} className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                      {formatDate(entry.createdAt, locale)}: {entry.recommendedCategory}
                      {locale === "ja" ? " についてご相談済みです。" : " has already been submitted."}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5 text-sm leading-7 text-[#5A4B3E]">
                  {locale === "ja" ? "その後のご案内はまだありません。" : "No submitted follow-up yet."}
                </p>
              )}
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}

function Panel({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-[2rem] border border-[#D6C3A3]/28 bg-white/80 p-7 shadow-[0_20px_48px_rgba(59,47,47,0.05)]">
      <h2 className="text-2xl font-light leading-tight text-[#3B2F2F]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#D6C3A3]/24 bg-white/78 px-5 py-5">
      <div className="text-sm text-[#8A7764]">{label}</div>
      <div className="mt-3 text-2xl font-light leading-tight text-[#3B2F2F]">{value}</div>
      <div className="mt-2 text-sm leading-7 text-[#5A4B3E]">{note}</div>
    </div>
  );
}

function StatusTile({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "ok" | "warn";
}) {
  return (
    <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
      <div className="text-sm text-[#8A7764]">{label}</div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone === "ok" ? "bg-[#2E5B3C]" : "bg-[#A2682A]"}`} />
        <div className="text-lg font-light leading-tight text-[#3B2F2F]">{value}</div>
      </div>
      <div className="mt-2 text-sm leading-7 text-[#5A4B3E]">{note}</div>
    </div>
  );
}

function LineReadinessTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1rem] border border-[#D6C3A3]/20 bg-[#FCFAF6] px-4 py-4">
      <div className="text-xs tracking-[0.12em] text-[#8A7764]">{label}</div>
      <div className="mt-2 text-base font-medium leading-tight text-[#3B2F2F]">{value}</div>
      <div className="mt-2 text-sm leading-6 text-[#5A4B3E]">{note}</div>
    </div>
  );
}

function sourceTone(value: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved") {
  return value === "canonical" ? "ok" : "warn";
}

function sourceLabel(
  locale: Locale,
  value: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved",
) {
  if (value === "canonical") {
    return locale === "ja" ? "安定" : "canonical";
  }
  if (value === "compatibility_mirror") {
    return locale === "ja" ? "一部調整中" : "compatibility mirror";
  }
  if (value === "legacy_fallback") {
    return locale === "ja" ? "確認が必要" : "legacy fallback";
  }
  return locale === "ja" ? "未確認" : "unresolved";
}

function ownerModeLabel(locale: Locale, value: SupportDiagnostics["ownerResolution"]["mode"]) {
  if (value === "principal_aware") {
    return locale === "ja" ? "確認済み" : "principal-aware";
  }
  if (value === "legacy_fallback") {
    return locale === "ja" ? "一部確認中" : "legacy fallback";
  }
  return locale === "ja" ? "未確認" : "unresolved";
}

function summaryLabel(locale: Locale, value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return locale === "ja" ? "安定してご利用いただけます" : "Canonical healthy";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return locale === "ja" ? "一部確認しながらご案内しています" : "Canonical with compatibility fallback";
  }
  if (value === "fallback_active") {
    return locale === "ja" ? "確認しながらご案内しています" : "Fallback active";
  }
  return locale === "ja" ? "確認中です" : "Owner unresolved";
}

function summaryNote(locale: Locale, value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return locale === "ja"
      ? "現在のご利用状況は安定して確認できます。"
      : "Support read/write is stable on the principal-aware path.";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return locale === "ja"
      ? "一部確認しながらのご案内ですが、基本的な内容はご確認いただけます。"
      : "The main path is canonical, but some slices still use compatibility fallback.";
  }
  if (value === "fallback_active") {
    return locale === "ja"
      ? "一部確認が必要な内容を含みますが、このままご覧いただけます。"
      : "The current view is still using fallback paths.";
  }
  return locale === "ja"
    ? "一部の確認がまだ完了していないため、内容を見ながらご案内します。"
    : "Owner resolution is incomplete, so the canonical path is not fully active.";
}

function summaryTone(value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return "bg-[#E6F4EA] text-[#2E5B3C]";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  if (value === "fallback_active") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  return "bg-[#FCE7E3] text-[#9A3B2F]";
}

function guardrailTone(value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return "border-[#B8D9C0] bg-[#EAF6EE] text-[#2E5B3C]";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "border-[#E5C07B] bg-[#FFF5E4] text-[#8B5A1B]";
  }
  if (value === "fallback_active") {
    return "border-[#E5C07B] bg-[#FFF5E4] text-[#8B5A1B]";
  }
  return "border-[#E5B7B0] bg-[#FCECE8] text-[#9A3B2F]";
}

function guardrailMessage(locale: Locale, value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return locale === "ja"
      ? "現在のご利用状況は安定しており、このまま安心してご確認いただけます。"
      : "Canonical target confirmed. The current support target resolves to a canonical principal and principal-aware target.";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return locale === "ja"
      ? "一部確認しながらのご案内ですが、必要な内容はこのままご覧いただけます。"
      : "Compatibility fallback in use. The current support target still relies on compatibility mirror data for some slices.";
  }
  if (value === "fallback_active") {
    return locale === "ja"
      ? "確認が必要な項目を含みますが、内容を見ながらご案内できます。"
      : "Legacy fallback active. The current support target is still using legacy fallback resolution.";
  }
  return locale === "ja"
    ? "まだ確認中の項目があります。必要に応じて内容を一緒に確認しながら進めます。"
    : "Owner unresolved. The current support target is not fully resolved. Review diagnostics before relying on this record.";
}

function truncateId(value: string) {
  if (value.length <= 18) {
    return value;
  }
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function consentLabel(locale: Locale, value: AccessAccountability["latestConsent"]["consentType"]) {
  if (value === "account_registration") {
    return locale === "ja" ? "アカウント登録" : "account registration";
  }
  if (value === "line_identity_binding") {
    return locale === "ja" ? "LINE連携" : "LINE identity binding";
  }
  if (value === "line_primary_login") {
    return locale === "ja" ? "LINEログイン" : "LINE primary login";
  }
  if (value === "email_identity_attachment") {
    return locale === "ja" ? "メール連携" : "email identity attachment";
  }
  return locale === "ja" ? "確認中" : "not available";
}

function lineIdentityLabel(locale: Locale, value: LineReadiness["identityState"]) {
  if (value === "bound") {
    return locale === "ja" ? "連携済み" : "bound";
  }
  if (value === "not_bound") {
    return locale === "ja" ? "未連携" : "not bound";
  }
  return locale === "ja" ? "確認中" : "unresolved";
}

function lineLoginReadinessLabel(locale: Locale, value: LineReadiness["loginReadiness"]) {
  if (value === "available") {
    return locale === "ja" ? "ご利用いただけます" : "available";
  }
  if (value === "limited") {
    return locale === "ja" ? "一部ご利用いただけます" : "limited";
  }
  return locale === "ja" ? "確認中" : "unresolved";
}

function lineContinuityLabel(locale: Locale, value: LineReadiness["continuityStatus"]) {
  if (value === "ready") {
    return locale === "ja" ? "準備が整っています" : "Ready";
  }
  if (value === "partial") {
    return locale === "ja" ? "一部ご利用いただけます" : "Partial";
  }
  if (value === "not_ready") {
    return locale === "ja" ? "準備中です" : "Not ready";
  }
  return locale === "ja" ? "確認中です" : "Unresolved";
}

function lineReadinessTone(value: LineReadiness["continuityStatus"]) {
  if (value === "ready") {
    return "bg-[#E6F4EA] text-[#2E5B3C]";
  }
  if (value === "partial") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  if (value === "not_ready") {
    return "bg-[#FCE7E3] text-[#9A3B2F]";
  }
  return "bg-[#F3ECE2] text-[#6E5D4D]";
}

function lineReadinessMessage(locale: Locale, value: LineReadiness) {
  if (value.continuityStatus === "ready") {
    return locale === "ja"
      ? "LINEでのご案内を継続して受けられる状態です。"
      : "The current target resolves to canonical LINE linkage and is ready for support continuity.";
  }
  if (value.continuityStatus === "partial") {
    return locale === "ja"
      ? "LINEは一部ご利用いただけます。必要に応じて確認しながら進めます。"
      : "LINE is partially usable, but compatibility or fallback dependency remains.";
  }
  if (value.continuityStatus === "not_ready") {
    return locale === "ja"
      ? "LINEでのご案内は現在準備中です。"
      : "The current target is not yet ready for LINE-based support continuity.";
  }
  return locale === "ja"
    ? "LINEのご利用状況を確認中です。"
    : "Owner or source resolution is still incomplete for confirmed LINE readiness.";
}

function lineReplyStatusLabel(locale: Locale, value: "not_attempted" | "sent" | "failed") {
  if (value === "sent") {
    return locale === "ja" ? "送信済み" : "sent";
  }
  if (value === "failed") {
    return locale === "ja" ? "未送信" : "failed";
  }
  return locale === "ja" ? "未対応" : "not attempted";
}

function EmptyState({ locale, textJa, textEn }: { locale: Locale; textJa: string; textEn: string }) {
  return <p className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5 text-sm leading-7 text-[#5A4B3E]">{locale === "ja" ? textJa : textEn}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-[#5A4B3E]">
      <span>{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const inputClassName =
  "w-full rounded-[1.25rem] border border-[#D6C3A3]/45 bg-[#FCFAF6] px-4 py-4 text-base text-[#3B2F2F] outline-none transition focus:border-[#6B5A4A]";
