"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AccountRecord, ConsultationRecord, LineBindingStatus, SupportProfile } from "@/lib/server/yorisouData";

type Locale = "ja" | "en";

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
  initialConsultations,
  lineAuthReady,
  lineNotice,
  lineError,
}: {
  locale: Locale;
  initialAccount: AccountRecord | null;
  initialConsultations: ConsultationRecord[];
  lineAuthReady: boolean;
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

  const latest = consultations[0] || null;
  const followups = useMemo(() => consultations.filter((entry) => entry.leadSubmitted), [consultations]);
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";
  const advisorHref = locale === "ja" ? "/ai-advisor" : "/en/ai-advisor";
  const productsHref = locale === "ja" ? "/products" : "/en/products";
  const lineStartHref = locale === "ja" ? "/api/line/auth/start?locale=ja&returnTo=/support" : "/api/line/auth/start?locale=en&returnTo=/en/support";
  const lineStatusLabel = lineStatusLabels[locale][lineForm.lineBindingStatus];
  const isLineConnected = lineForm.lineBindingStatus === "connected" && Boolean(account?.lineUserId);
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

      const result = (await response.json()) as { success?: boolean; supportProfile?: SupportProfile };

      if (!response.ok || !result.success || !result.supportProfile) {
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

      <section className="bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
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
