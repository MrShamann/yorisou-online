"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getPasswordPolicyMessage, PASSWORD_RULES } from "@/lib/passwordPolicy";
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
  const advisorHref = locale === "ja" ? "/ai-advisor" : "/en/ai-advisor";
  const productsHref = locale === "ja" ? "/products" : "/en/products";
  const lineStartHref = locale === "ja" ? "/api/line/auth/start?locale=ja&returnTo=/support" : "/api/line/auth/start?locale=en&returnTo=/en/support";
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
      <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
        <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
          <div className="mx-auto max-w-6xl">
            <div className="shell-card max-w-3xl p-8 md:p-12">
              <h1 className="text-4xl font-light leading-tight md:text-6xl">
                {locale === "ja" ? "ログインしてサポートを開く" : "Log in to open support"}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
                {locale === "ja"
                  ? "相談内容やご提案を、ひとつのアカウントで確認できます。"
                  : "Open your account to review saved consultations and recommendations."}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href={loginHref} className="btn btn-primary">
                  {locale === "ja" ? "ログインする" : "Log in"}
                </Link>
                <Link href={registerHref} className="btn btn-secondary">
                  {locale === "ja" ? "新規登録する" : "Create account"}
                </Link>
              </div>
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
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#D6C3A3]/60 px-6 py-3 text-sm text-[#5A4B3E] transition hover:bg-[#FCFAF6]"
              >
                {locale === "ja" ? "ログアウト" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <StatCard
            label={locale === "ja" ? "相談履歴" : "Consultations"}
            value={String(consultations.length)}
            note={locale === "ja" ? "現在見返せる件数" : "Currently available"}
          />
          <StatCard
            label={locale === "ja" ? "ご提案内容" : "Recommendation"}
            value={latest ? latest.recommendedCategory : locale === "ja" ? "未保存" : "None"}
            note={latest ? formatDate(latest.createdAt, locale) : locale === "ja" ? "最新の相談結果はまだありません" : "No saved recommendation yet"}
          />
          <StatCard
            label={locale === "ja" ? "LINE連携" : "LINE"}
            value={lineStatusLabel}
            note={lineForm.lineNotificationsEnabled ? (locale === "ja" ? "フォローアップ有効" : "Follow-up enabled") : locale === "ja" ? "フォローアップ未設定" : "Follow-up disabled"}
          />
        </div>
      </section>

      <section id="support-data-status" className="bg-[#F7F0E5] px-6 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-[2rem] border border-[#D6C3A3]/28 bg-white/84 p-6 shadow-[0_20px_48px_rgba(59,47,47,0.05)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs tracking-[0.16em] text-[#8A7764]">
                  {locale === "ja" ? "SUPPORT DATA STATUS" : "SUPPORT DATA STATUS"}
                </div>
                <h2 className="mt-2 text-2xl font-light leading-tight text-[#3B2F2F]">
                  {locale === "ja" ? "現在のサポート解決状態" : "Current support resolution"}
                </h2>
              </div>
              <p className="text-sm leading-7 text-[#5A4B3E]">
                {locale === "ja"
                  ? "support の canonical read/write 状態をこの画面で確認できます。"
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
                label={locale === "ja" ? "Support profile source" : "Support profile source"}
                value={sourceLabel(locale, initialSupportDiagnostics.supportProfile.source)}
                tone={sourceTone(initialSupportDiagnostics.supportProfile.source)}
                note={
                  initialSupportDiagnostics.supportProfile.source === "canonical"
                    ? locale === "ja"
                      ? "family/contact/share fields は canonical-first"
                      : "Family/contact/share fields are canonical-first"
                    : locale === "ja"
                      ? "support profile は fallback から復元"
                      : "Support profile is being restored from fallback"
                }
              />
              <StatusTile
                label={locale === "ja" ? "Owner resolution" : "Owner resolution"}
                value={ownerModeLabel(locale, initialSupportDiagnostics.ownerResolution.mode)}
                tone={initialSupportDiagnostics.ownerResolution.mode === "principal_aware" ? "ok" : "warn"}
                note={
                  initialSupportDiagnostics.ownerResolution.principalId
                    ? locale === "ja"
                      ? `principal: ${truncateId(initialSupportDiagnostics.ownerResolution.principalId)}`
                      : `principal: ${truncateId(initialSupportDiagnostics.ownerResolution.principalId)}`
                    : locale === "ja"
                      ? "principal 未解決"
                      : "Principal unresolved"
                }
              />
              <StatusTile
                label={locale === "ja" ? "Preferences storage" : "Preferences storage"}
                value={sourceLabel(locale, initialSupportDiagnostics.preferences.source)}
                tone={sourceTone(initialSupportDiagnostics.preferences.source)}
                note={
                  initialSupportDiagnostics.preferences.activeWriteTarget === "principal_aware_target"
                    ? locale === "ja"
                      ? "active write target: principal-aware"
                      : "active write target: principal-aware"
                    : locale === "ja"
                      ? "active write target: legacy fallback"
                      : "active write target: legacy fallback"
                }
              />
              <StatusTile
                label={locale === "ja" ? "Read fallback" : "Read fallback"}
                value={initialSupportDiagnostics.readFallback.active ? sourceLabel(locale, initialSupportDiagnostics.readFallback.source) : locale === "ja" ? "not active" : "not active"}
                tone={initialSupportDiagnostics.readFallback.active ? "warn" : "ok"}
                note={initialSupportDiagnostics.readFallback.active ? (locale === "ja" ? "fallback 読み取りが稼働中" : "Fallback read is active") : locale === "ja" ? "主要 read は canonical-first" : "Primary read is canonical-first"}
              />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <div className="text-sm text-[#8A7764]">{locale === "ja" ? "Active owner path" : "Active owner path"}</div>
                <div className="mt-3 space-y-2 text-sm leading-7 text-[#5A4B3E]">
                  <p>
                    {locale === "ja" ? "principal id" : "principal id"}:{" "}
                    <span className="font-mono text-[#3B2F2F]">{initialSupportDiagnostics.ownerResolution.principalId || "—"}</span>
                  </p>
                  <p>
                    {locale === "ja" ? "legacy account id" : "legacy account id"}:{" "}
                    <span className="font-mono text-[#3B2F2F]">{initialSupportDiagnostics.ownerResolution.legacyAccountId || "—"}</span>
                  </p>
                  <p>
                    {locale === "ja" ? "active write target id" : "active write target id"}:{" "}
                    <span className="font-mono text-[#3B2F2F]">{initialSupportDiagnostics.ownerResolution.activeWriteTargetId || "—"}</span>
                  </p>
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <div className="text-sm text-[#8A7764]">{locale === "ja" ? "What this means" : "What this means"}</div>
                <div className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                  {initialSupportDiagnostics.summaryState === "canonical_healthy"
                    ? locale === "ja"
                      ? "support は canonical-first で読めており、owner も principal-aware target に解決されています。"
                      : "Support is reading canonical-first, and the owner resolves to a principal-aware target."
                    : initialSupportDiagnostics.summaryState === "canonical_with_compatibility_fallback"
                      ? locale === "ja"
                        ? "主要な support データは canonical ですが、一部 slice は compatibility mirror/fallback を併用しています。"
                        : "Core support data is canonical, while some slices still rely on compatibility mirror or fallback reads."
                      : initialSupportDiagnostics.summaryState === "fallback_active"
                        ? locale === "ja"
                          ? "現在の表示には legacy/compatibility fallback が含まれています。"
                          : "The current view still depends on legacy or compatibility fallback."
                        : locale === "ja"
                          ? "owner が未解決のため canonical read を全面使用できていません。"
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
            <Panel title={locale === "ja" ? "現在のサポート対象" : "Current support target"}>
              <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <div className={`rounded-[1.2rem] border px-4 py-4 ${guardrailTone(initialSupportDiagnostics.summaryState)}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs tracking-[0.14em] opacity-75">
                        {locale === "ja" ? "TARGET INTEGRITY" : "TARGET INTEGRITY"}
                      </div>
                      <div className="mt-1 text-lg font-medium">{summaryLabel(locale, initialSupportDiagnostics.summaryState)}</div>
                      <p className="mt-2 text-sm leading-7">{guardrailMessage(locale, initialSupportDiagnostics.summaryState)}</p>
                    </div>
                    <a href="#support-data-status" className="text-sm underline underline-offset-4">
                      {locale === "ja" ? "診断を見る" : "Review diagnostics"}
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${summaryTone(initialSupportDiagnostics.summaryState)}`}>
                    {summaryLabel(locale, initialSupportDiagnostics.summaryState)}
                  </span>
                  <span className="text-sm leading-7 text-[#5A4B3E]">
                    {locale === "ja"
                      ? "このワークスペースで現在参照している support 対象の解決結果です。"
                      : "This is the current target-truth state for the support context shown in this workspace."}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E] md:col-span-2">
                    <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                      {locale === "ja" ? "ACCOUNTABILITY / PRIVACY" : "ACCOUNTABILITY / PRIVACY"}
                    </div>
                    <div className="mt-2 font-medium text-[#3B2F2F]">
                      {locale === "ja"
                        ? "この support アクセスは監査ログに記録されます。"
                        : "This support access is audit logged."}
                    </div>
                    <div className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                      {initialAccessAccountability.latestConsent.available
                        ? locale === "ja"
                          ? `最新の consent signal: ${consentLabel(locale, initialAccessAccountability.latestConsent.consentType)} / ${formatDate(initialAccessAccountability.latestConsent.timestamp || "", locale)}`
                          : `Latest consent signal: ${consentLabel(locale, initialAccessAccountability.latestConsent.consentType)} / ${formatDate(initialAccessAccountability.latestConsent.timestamp || "", locale)}`
                        : locale === "ja"
                          ? "表示可能な consent 状態はまだモデル化されていないため、現在はアクセス記録のみを表示しています。"
                          : "No stable consent status is modeled for display here yet, so this panel currently shows access accountability only."}
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E] md:col-span-2">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                          {locale === "ja" ? "LINE READINESS" : "LINE READINESS"}
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
                        {locale === "ja" ? "LINE設定を見る" : "Review LINE setup"}
                      </a>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                      <LineReadinessTile
                        label={locale === "ja" ? "LINE identity" : "LINE identity"}
                        value={lineIdentityLabel(locale, initialLineReadiness.identityState)}
                        note={initialLineReadiness.lineIdentityPresent ? (locale === "ja" ? "bound LINE identity present" : "bound LINE identity present") : (locale === "ja" ? "bound LINE identity not present" : "bound LINE identity not present")}
                      />
                      <LineReadinessTile
                        label={locale === "ja" ? "LINE login readiness" : "LINE login readiness"}
                        value={lineLoginReadinessLabel(locale, initialLineReadiness.loginReadiness)}
                        note={initialLineReadiness.loginConfigured ? (locale === "ja" ? "LINE login config available" : "LINE login config available") : (locale === "ja" ? "LINE login config unresolved" : "LINE login config unresolved")}
                      />
                      <LineReadinessTile
                        label={locale === "ja" ? "Support continuity" : "Support continuity"}
                        value={lineContinuityLabel(locale, initialLineReadiness.continuityStatus)}
                        note={initialLineReadiness.principalResolved ? (locale === "ja" ? "principal-resolved LINE linkage" : "principal-resolved LINE linkage") : (locale === "ja" ? "principal linkage not fully resolved" : "principal linkage not fully resolved")}
                      />
                      <LineReadinessTile
                        label={locale === "ja" ? "Source truth" : "Source truth"}
                        value={sourceLabel(locale, initialLineReadiness.source)}
                        note={initialLineReadiness.compatibilityOrFallbackActive ? (locale === "ja" ? "compatibility or fallback still in use" : "compatibility or fallback still in use") : (locale === "ja" ? "canonical source confirmed" : "canonical source confirmed")}
                      />
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                    <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                      {locale === "ja" ? "TARGET OWNER" : "TARGET OWNER"}
                    </div>
                    <div className="mt-2 text-lg font-light text-[#3B2F2F]">
                      {ownerModeLabel(locale, initialSupportDiagnostics.ownerResolution.mode)}
                    </div>
                    <div className="mt-3 space-y-1 font-mono text-xs text-[#3B2F2F]">
                      <div>principal id: {initialSupportDiagnostics.ownerResolution.principalId || "—"}</div>
                      <div>legacy account id: {initialSupportDiagnostics.ownerResolution.legacyAccountId || "—"}</div>
                      <div>active write target id: {initialSupportDiagnostics.ownerResolution.activeWriteTargetId || "—"}</div>
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                    <div className="text-xs tracking-[0.14em] text-[#8A7764]">
                      {locale === "ja" ? "CURRENT LINKAGE" : "CURRENT LINKAGE"}
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        {locale === "ja" ? "LINE binding" : "LINE binding"}:{" "}
                        <span className="font-medium">{sourceLabel(locale, initialSupportDiagnostics.lineBinding.source)}</span>
                      </div>
                      <div>
                        {locale === "ja" ? "support profile" : "support profile"}:{" "}
                        <span className="font-medium">{sourceLabel(locale, initialSupportDiagnostics.supportProfile.source)}</span>
                      </div>
                      <div>
                        {locale === "ja" ? "preferences" : "preferences"}:{" "}
                        <span className="font-medium">{sourceLabel(locale, initialSupportDiagnostics.preferences.source)}</span>
                      </div>
                      <div>
                        {locale === "ja" ? "read fallback" : "read fallback"}:{" "}
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
                <EmptyState locale={locale} textJa="まだ相談履歴はありません。AI相談から始められます。" textEn="No consultation history yet. Start with the advisor." />
              )}
            </Panel>

            <Panel title={locale === "ja" ? "ご提案内容" : "Recommendations"}>
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
            <Panel title={locale === "ja" ? "ご家族共有" : "Family sharing"}>
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
                  {locale === "ja" ? "共有用メモをコピー" : "Copy share note"}
                </button>
                <button type="button" onClick={saveSupportProfile} className="btn btn-secondary" disabled={isSaving}>
                  {locale === "ja" ? "ご家族情報を保存" : "Save family info"}
                </button>
              </div>
              {shareMessage && <p className="mt-4 text-sm text-[#2E5B3C]">{shareMessage}</p>}
            </Panel>

            <Panel title={locale === "ja" ? "継続相談" : "Ongoing consultation"}>
              <p className="text-sm leading-7 text-[#5A4B3E]">
                {locale === "ja"
                  ? "前回の相談を見返しながら、条件を変えてもう一度相談したり、導入後の不安点を追加で送ったりできます。"
                  : "Review the last consultation, then continue with a new advisor run or a direct consultation submission."}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href={advisorHref} className="btn btn-secondary">
                  {locale === "ja" ? "AI相談を続ける" : "Continue with advisor"}
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

            <Panel title={locale === "ja" ? "LINE Connect" : "LINE Connect"} id="line-connect">
              <div className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-[#8A7764]">{locale === "ja" ? "現在の状態" : "Current status"}</div>
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
                          ? "Messaging API の受信準備は有効です。"
                          : "Messaging API receive path is enabled."
                        : locale === "ja"
                          ? "Messaging API の設定はまだ完了していません。"
                          : "Messaging API is not configured yet."}
                    </p>
                  </div>
                  {isLineConnected ? (
                    <div className="rounded-full border border-[#D6C3A3]/60 px-5 py-3 text-sm text-[#5A4B3E]">
                      {locale === "ja" ? "連携済み" : "Connected"}
                    </div>
                  ) : lineAuthReady ? (
                    <Link href={lineStartHref} className="btn btn-secondary">
                      {locale === "ja" ? "LINE Connect" : "LINE Connect"}
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
                  <div className="text-xs tracking-[0.14em] text-[#8A7764]">{locale === "ja" ? "LATEST LINE EVENT" : "LATEST LINE EVENT"}</div>
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
                      ? "LINEでメッセージを送信したあとにこの画面を再読み込みすると、最新イベントと返信結果を確認できます。"
                      : "After sending a LINE message, refresh this page to verify the latest event and reply result."}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#6E5D4D]">
                  {locale === "ja"
                    ? "まだLINEイベントは記録されていません。LINEでフォローまたはメッセージ送信後に再読み込みすると結果を確認できます。"
                    : "No LINE event has been recorded yet. Follow or send a LINE message, then refresh to verify the result."}
                </p>
              )}
            </Panel>

            <Panel title={locale === "ja" ? "フォローアップ" : "Follow-up"}>
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
                    ? `現在のLINE状態: ${lineStatusLabels.ja[lineForm.lineBindingStatus]}。連携後は、このアカウントに保存された状態を表示します。`
                    : `Current LINE status: ${lineStatusLabels.en[lineForm.lineBindingStatus]}. The saved account state is shown after connection.`}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={saveSupportProfile} className="btn btn-secondary" disabled={isSaving}>
                  {locale === "ja" ? "LINE状態を保存" : "Save LINE status"}
                </button>
              </div>
              {followups.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {followups.map((entry) => (
                    <div key={entry.id} className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                      {formatDate(entry.createdAt, locale)}: {entry.recommendedCategory}
                      {locale === "ja" ? " について相談送信済みです。" : " has already been submitted."}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5 text-sm leading-7 text-[#5A4B3E]">
                  {locale === "ja" ? "送信済みのフォローアップはまだありません。" : "No submitted follow-up yet."}
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
    return "canonical";
  }
  if (value === "compatibility_mirror") {
    return locale === "ja" ? "compatibility mirror" : "compatibility mirror";
  }
  if (value === "legacy_fallback") {
    return locale === "ja" ? "legacy fallback" : "legacy fallback";
  }
  return locale === "ja" ? "unresolved" : "unresolved";
}

function ownerModeLabel(locale: Locale, value: SupportDiagnostics["ownerResolution"]["mode"]) {
  if (value === "principal_aware") {
    return "principal-aware";
  }
  if (value === "legacy_fallback") {
    return locale === "ja" ? "legacy fallback" : "legacy fallback";
  }
  return locale === "ja" ? "unresolved" : "unresolved";
}

function summaryLabel(locale: Locale, value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return locale === "ja" ? "Canonical healthy" : "Canonical healthy";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return locale === "ja" ? "Canonical with compatibility fallback" : "Canonical with compatibility fallback";
  }
  if (value === "fallback_active") {
    return locale === "ja" ? "Fallback active" : "Fallback active";
  }
  return locale === "ja" ? "Owner unresolved" : "Owner unresolved";
}

function summaryNote(locale: Locale, value: SupportDiagnostics["summaryState"]) {
  if (value === "canonical_healthy") {
    return locale === "ja"
      ? "support read/write は principal-aware で安定しています。"
      : "Support read/write is stable on the principal-aware path.";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return locale === "ja"
      ? "主経路は canonical ですが、一部 slice は互換レイヤーを併用しています。"
      : "The main path is canonical, but some slices still use compatibility fallback.";
  }
  if (value === "fallback_active") {
    return locale === "ja"
      ? "現在の表示には fallback 経路が入っています。"
      : "The current view is still using fallback paths.";
  }
  return locale === "ja"
    ? "owner 解決が足りないため canonical path が十分に使えていません。"
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
      ? "Canonical target confirmed。現在の support 対象は canonical principal と principal-aware target に解決されています。"
      : "Canonical target confirmed. The current support target resolves to a canonical principal and principal-aware target.";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return locale === "ja"
      ? "Compatibility fallback in use。現在の support 対象は一部 compatibility mirror に依存しています。"
      : "Compatibility fallback in use. The current support target still relies on compatibility mirror data for some slices.";
  }
  if (value === "fallback_active") {
    return locale === "ja"
      ? "Legacy fallback active。現在の support 対象は legacy fallback 解決を含んでいます。"
      : "Legacy fallback active. The current support target is still using legacy fallback resolution.";
  }
  return locale === "ja"
    ? "Owner unresolved。現在の support 対象は完全には解決されていません。診断を確認してから扱ってください。"
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
    return locale === "ja" ? "account registration" : "account registration";
  }
  if (value === "line_identity_binding") {
    return locale === "ja" ? "LINE identity binding" : "LINE identity binding";
  }
  if (value === "line_primary_login") {
    return locale === "ja" ? "LINE primary login" : "LINE primary login";
  }
  if (value === "email_identity_attachment") {
    return locale === "ja" ? "email identity attachment" : "email identity attachment";
  }
  return locale === "ja" ? "not available" : "not available";
}

function lineIdentityLabel(locale: Locale, value: LineReadiness["identityState"]) {
  if (value === "bound") {
    return locale === "ja" ? "bound" : "bound";
  }
  if (value === "not_bound") {
    return locale === "ja" ? "not bound" : "not bound";
  }
  return locale === "ja" ? "unresolved" : "unresolved";
}

function lineLoginReadinessLabel(locale: Locale, value: LineReadiness["loginReadiness"]) {
  if (value === "available") {
    return locale === "ja" ? "available" : "available";
  }
  if (value === "limited") {
    return locale === "ja" ? "limited" : "limited";
  }
  return locale === "ja" ? "unresolved" : "unresolved";
}

function lineContinuityLabel(locale: Locale, value: LineReadiness["continuityStatus"]) {
  if (value === "ready") {
    return locale === "ja" ? "Ready" : "Ready";
  }
  if (value === "partial") {
    return locale === "ja" ? "Partial" : "Partial";
  }
  if (value === "not_ready") {
    return locale === "ja" ? "Not ready" : "Not ready";
  }
  return locale === "ja" ? "Unresolved" : "Unresolved";
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
      ? "現在の対象は canonical な LINE linkage に解決されており、継続サポートの準備が整っています。"
      : "The current target resolves to canonical LINE linkage and is ready for support continuity.";
  }
  if (value.continuityStatus === "partial") {
    return locale === "ja"
      ? "LINE は一部利用可能ですが、compatibility/fallback 依存または設定制限が残っています。"
      : "LINE is partially usable, but compatibility or fallback dependency remains.";
  }
  if (value.continuityStatus === "not_ready") {
    return locale === "ja"
      ? "現在の対象は LINE 継続サポートの準備がまだ整っていません。"
      : "The current target is not yet ready for LINE-based support continuity.";
  }
  return locale === "ja"
    ? "LINE readiness を確定するための owner/source 解決がまだ不足しています。"
    : "Owner or source resolution is still incomplete for confirmed LINE readiness.";
}

function lineReplyStatusLabel(locale: Locale, value: "not_attempted" | "sent" | "failed") {
  if (value === "sent") {
    return locale === "ja" ? "sent" : "sent";
  }
  if (value === "failed") {
    return locale === "ja" ? "failed" : "failed";
  }
  return locale === "ja" ? "not attempted" : "not attempted";
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
