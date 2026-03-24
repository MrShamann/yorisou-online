"use client";

import Link from "next/link";
import { useState } from "react";

import { getPasswordPolicyMessage, PASSWORD_RULES } from "@/lib/passwordPolicy";
import type { AccountRecord } from "@/lib/server/yorisouData";

type Mode = "login" | "register";

export default function AccountEntryForm({
  mode,
  locale,
  initialAccount,
  initialError,
  initialNotice,
}: {
  mode: Mode;
  locale: "ja" | "en";
  initialAccount: AccountRecord | null;
  initialError?: string | null;
  initialNotice?: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState("");
  const [role, setRole] = useState<"self" | "family" | "facility">("family");
  const [error, setError] = useState(initialError || "");
  const [notice, setNotice] = useState(initialNotice || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportHref = locale === "ja" ? "/support" : "/en/support";
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";
  const forgotPasswordHref = locale === "ja" ? "/forgot-password" : "/en/forgot-password";
  const lineReturnTo = mode === "login" ? loginHref : registerHref;
  const lineLoginHref =
    locale === "ja"
      ? `/api/line/auth/start?locale=ja&returnTo=${encodeURIComponent(`${lineReturnTo}#line-entry`)}`
      : `/api/line/auth/start?locale=en&returnTo=${encodeURIComponent(`${lineReturnTo}#line-entry`)}`;
  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
  const passwordChecks = PASSWORD_RULES.map((rule) => ({
    ...rule,
    ok: rule.test(password),
  }));
  const hasPasswordInput = password.length > 0;
  const hasStrongPassword = passwordChecks.every((rule) => rule.ok);

  function clearError() {
    if (error) {
      setError("");
    }
    if (notice) {
      setNotice("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setError("");

    if (mode === "register" && !hasStrongPassword) {
      event.preventDefault();
      setError(getPasswordPolicyMessage(locale));
      return;
    }

    setIsSubmitting(true);
  }

  const togglePasswordLabel =
    locale === "ja"
      ? showPassword
        ? "パスワードを隠す"
        : "パスワードを表示する"
      : showPassword
        ? "Hide password"
        : "Show password";

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="shell-card p-8 md:p-10">
              <h1 className="text-4xl font-light leading-tight md:text-5xl">
                {mode === "login"
                  ? locale === "ja"
                    ? "ログインして、相談のつづきを確認する"
                    : "Log in to review your support"
                  : locale === "ja"
                    ? "会員登録して、相談内容をまとめる"
                    : "Create an account for ongoing support"}
              </h1>
              <p className="mt-6 text-base leading-8 text-[#5A4B3E] md:text-lg">
                {mode === "login"
                  ? locale === "ja"
                    ? "サポートページでは、相談履歴、ご提案内容、ご家族への共有メモ、フォローアップ状況を確認できます。"
                    : "The support page brings together consultation history, recommendation notes, family sharing, and follow-up status."
                  : locale === "ja"
                    ? "Yorisouの相談内容やご提案を、ひとつのアカウントで確認できるようになります。"
                    : "Create one account to keep consultations and recommendations together."}
              </p>
              <div className="mt-8 rounded-[1.5rem] border border-[#D6C3A3]/28 bg-[#FCFAF6] px-5 py-5 text-sm leading-7 text-[#5A4B3E]">
                {locale === "ja"
                  ? "ご本人、ご家族、施設担当者のどなたでも利用できます。"
                  : "This entry works for the user, family members, or facility operators."}
              </div>
              {initialAccount && (
                <div className="mt-5 rounded-[1.5rem] border border-[#C8D0C1] bg-[#F3F0E7] px-5 py-5 text-sm leading-7 text-[#4D5642]">
                  {locale === "ja"
                    ? `${initialAccount.name}さんとしてログイン済みです。`
                    : `Already signed in as ${initialAccount.name}.`}
                  <div className="mt-4">
                    <Link href={supportHref} className="btn btn-secondary">
                      {locale === "ja" ? "サポートページを見る" : "Open support page"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/82 p-7 shadow-[0_20px_56px_rgba(59,47,47,0.06)] md:p-9">
              <div className="mb-6 flex gap-3">
                <Link href={loginHref} className={`rounded-full px-5 py-3 text-sm ${mode === "login" ? "bg-[#3B2F2F] text-white" : "border border-[#D6C3A3]/50 bg-[#FCFAF6] text-[#5A4B3E]"}`}>
                  {locale === "ja" ? "ログイン" : "Login"}
                </Link>
                <Link href={registerHref} className={`rounded-full px-5 py-3 text-sm ${mode === "register" ? "bg-[#3B2F2F] text-white" : "border border-[#D6C3A3]/50 bg-[#FCFAF6] text-[#5A4B3E]"}`}>
                  {locale === "ja" ? "新規登録" : "Register"}
                </Link>
              </div>

              {!initialAccount && (
                <div id="line-entry" className="mb-6 rounded-[1.5rem] border border-[#C8D0C1] bg-[#F3F7F1] px-5 py-5 text-sm leading-7 text-[#4D5642]">
                  <div className="text-xs tracking-[0.14em] text-[#6C7A67]">{locale === "ja" ? "LINE ENTRY" : "LINE ENTRY"}</div>
                  <div className="mt-2 text-lg font-medium text-[#314236]">
                    {mode === "login"
                      ? locale === "ja"
                        ? "LINEでログイン"
                        : "Log in with LINE"
                      : locale === "ja"
                        ? "LINEではじめる"
                        : "Start with LINE"}
                  </div>
                  <p className="mt-2">
                    {mode === "login"
                      ? locale === "ja"
                        ? "すでにLINE連携済みのアカウントがあれば、そのままサポートページへ入れます。"
                        : "If your account is already linked to LINE, you can enter support directly."
                      : locale === "ja"
                        ? "LINEアカウントから開始して、そのままサポートページへ進めます。"
                        : "Start from your LINE account and continue into support."}
                  </p>
                </div>
              )}

              <form className="grid gap-5" action={endpoint} method="post" onSubmit={handleSubmit}>
                <input type="hidden" name="next" value={supportHref} />
                <input type="hidden" name="returnTo" value={mode === "login" ? loginHref : registerHref} />
                {mode === "register" && (
                  <Field label={locale === "ja" ? "お名前" : "Name"}>
                    <input
                      name="name"
                      value={name}
                      onChange={(event) => {
                        clearError();
                        setName(event.target.value);
                      }}
                      className={inputClassName}
                    />
                  </Field>
                )}

                <Field label={locale === "ja" ? "メールアドレス" : "Email"}>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      clearError();
                      setEmail(event.target.value);
                    }}
                    className={inputClassName}
                  />
                </Field>

                <Field label={locale === "ja" ? "パスワード" : "Password"}>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        clearError();
                        setPassword(event.target.value);
                      }}
                      className={`${inputClassName} pr-24`}
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-2 right-2 rounded-full px-3 text-sm text-[#6E5D4D] transition hover:bg-[#F3E8D6] hover:text-[#3B2F2F] focus:outline-none focus:ring-2 focus:ring-[#D6C3A3]"
                      aria-label={togglePasswordLabel}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (locale === "ja" ? "隠す" : "Hide") : locale === "ja" ? "表示" : "Show"}
                    </button>
                  </div>
                  {mode === "register" && (
                    <div className="mt-3 rounded-[1.25rem] border border-[#D6C3A3]/28 bg-[#FCFAF6] px-4 py-4 text-sm text-[#5A4B3E]">
                      <p className="font-medium text-[#5A4B3E]">
                        {locale === "ja" ? "パスワードの条件" : "Password requirements"}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {passwordChecks.map((rule) => {
                          const label = locale === "ja" ? rule.ja : rule.en;
                          const tone = rule.ok ? "text-[#4D6B45]" : hasPasswordInput ? "text-[#9A3B2F]" : "text-[#6E5D4D]";
                          return (
                            <li key={rule.key} className={`flex items-center gap-2 ${tone}`}>
                              <span aria-hidden="true">{rule.ok ? "✓" : "•"}</span>
                              <span>{label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </Field>

                {mode === "register" && (
                  <>
                    <Field label={locale === "ja" ? "お住まいの地域" : "City / area"}>
                      <input
                        name="city"
                        value={city}
                        onChange={(event) => {
                          clearError();
                          setCity(event.target.value);
                        }}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={locale === "ja" ? "立場" : "Role"}>
                      <select
                        name="role"
                        value={role}
                        onChange={(event) => {
                          clearError();
                          setRole(event.target.value as "self" | "family" | "facility");
                        }}
                        className={inputClassName}
                      >
                        <option value="self">{locale === "ja" ? "ご本人" : "Self"}</option>
                        <option value="family">{locale === "ja" ? "ご家族" : "Family"}</option>
                        <option value="facility">{locale === "ja" ? "施設・事業者" : "Facility / operator"}</option>
                      </select>
                    </Field>
                  </>
                )}

                {mode === "login" && (
                  <div className="text-sm">
                    <Link href={forgotPasswordHref} className="text-[#6E5D4D] underline underline-offset-4 hover:text-[#3B2F2F]">
                      {locale === "ja" ? "パスワードをお忘れですか？" : "Forgot password?"}
                    </Link>
                  </div>
                )}

                {notice && <p className="text-sm font-medium text-[#4D6B45]">{notice}</p>}
                {error && <p className="text-sm font-medium text-[#9A3B2F]">{error}</p>}

                <button type="submit" className="rounded-full bg-[#3B2F2F] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90">
                  {isSubmitting
                    ? locale === "ja"
                      ? "処理中..."
                      : "Submitting..."
                    : mode === "login"
                    ? locale === "ja"
                      ? "ログインしてサポートを見る"
                      : "Log in to support"
                    : locale === "ja"
                      ? "登録してサポートを見る"
                      : "Create account and continue"}
                </button>

                {!initialAccount && (
                  <Link href={lineLoginHref} className="rounded-full border border-[#8EB49B]/55 bg-[#EFF8F1] px-6 py-3 text-center text-sm font-medium text-[#314236] transition hover:bg-[#E4F1E7] hover:text-[#243329]">
                    {mode === "login"
                      ? locale === "ja"
                        ? "LINEでログイン"
                        : "Continue with LINE"
                      : locale === "ja"
                        ? "LINEではじめる"
                        : "Start with LINE"}
                  </Link>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-[#5A4B3E]">
      <span>{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

const inputClassName =
  "w-full rounded-[1.25rem] border border-[#D6C3A3]/45 bg-[#FCFAF6] px-4 py-4 text-base text-[#3B2F2F] outline-none transition focus:border-[#6B5A4A]";
