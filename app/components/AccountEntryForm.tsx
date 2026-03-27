"use client";

import Link from "next/link";
import { useState } from "react";

import { getPasswordPolicyMessage, PASSWORD_RULES } from "@/lib/passwordPolicy";
import type { AccountRecord } from "@/lib/server/yorisouData";
import LineBrandIcon from "@/app/components/LineBrandIcon";

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
  const lineLoginHref =
    locale === "ja"
      ? `/api/line/auth/start?locale=ja&intent=${mode}`
      : `/api/line/auth/start?locale=en&intent=${mode}`;
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
    <main className="min-h-screen bg-[#F7F0E5] text-[#312321]">
      <section className="border-b border-[#D8C6B4]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(247,240,229,0.98)_62%)] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="shell-card p-8 md:p-12">
              <div className="service-kicker">{locale === "ja" ? "ご相談はこちら" : "Consultation access"}</div>
              <h1 className="display-serif mt-4 text-4xl leading-[1.2] md:text-6xl">
                {mode === "login"
                  ? locale === "ja"
                    ? "ご相談のつづきを確認する"
                    : "Log in to review your support"
                  : locale === "ja"
                    ? "ご相談をはじめる準備をする"
                    : "Create an account for ongoing support"}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#665651] md:text-lg">
                {mode === "login"
                  ? locale === "ja"
                    ? "サポートページでは、ご相談内容やご案内、ご家族への共有メモを落ち着いて確認できます。"
                    : "The support page brings together consultation history, recommendation notes, family sharing, and follow-up status."
                  : locale === "ja"
                    ? "Yorisouのご相談内容やご案内を、ひとつのアカウントでやさしく確認できるようになります。"
                    : "Create one account to keep consultations and recommendations together."}
              </p>
              <div className="mt-8 grid gap-3 rounded-[2rem] border border-[#D8C6B4]/35 bg-[#FFF9F2] px-6 py-6 text-sm leading-7 text-[#665651]">
                <div>{locale === "ja" ? "ご本人やご家族が安心してご利用いただけます。" : "This entry works for older adults and family members."}</div>
                <div>{locale === "ja" ? "わからないことも一緒に整理しながら進められます。" : "Yorisou helps organize next steps in a calm, supportive way."}</div>
              </div>
              {initialAccount && (
                <div className="mt-6 rounded-[2rem] border border-[#C8D0C1] bg-[#F3F0E7] px-6 py-6 text-sm leading-7 text-[#4D5642]">
                  {locale === "ja"
                    ? `${initialAccount.name}さんとしてご利用中です。`
                    : `Already signed in as ${initialAccount.name}.`}
                  <div className="mt-4">
                    <Link href={supportHref} className="btn btn-secondary">
                      {locale === "ja" ? "ご案内を確認する" : "Open support page"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[2.25rem] border border-[#D8C6B4]/40 bg-[rgba(255,251,246,0.92)] p-7 shadow-[0_24px_58px_rgba(47,35,33,0.08)] md:p-10">
              <div className="mb-6 flex gap-3 rounded-full border border-[#E0D2C4] bg-[#F8F0E6] p-2">
                <Link href={loginHref} className={`rounded-full px-5 py-3 text-sm ${mode === "login" ? "bg-[#312321] text-white shadow-[0_10px_24px_rgba(47,35,33,0.18)]" : "text-[#665651]"}`}>
                  {locale === "ja" ? "ログイン" : "Login"}
                </Link>
                <Link href={registerHref} className={`rounded-full px-5 py-3 text-sm ${mode === "register" ? "bg-[#312321] text-white shadow-[0_10px_24px_rgba(47,35,33,0.18)]" : "text-[#665651]"}`}>
                  {locale === "ja" ? "新規登録" : "Register"}
                </Link>
              </div>

              {!initialAccount && (
                <div id="line-entry" className="mb-7 rounded-[2rem] border border-[#C7D7C1] bg-[linear-gradient(180deg,#F4F9F3_0%,#EDF6EB_100%)] px-6 py-6 text-sm leading-7 text-[#314236] shadow-[0_16px_36px_rgba(53,81,61,0.08)]">
                  <div className="service-kicker text-[#55705C]">{locale === "ja" ? "LINEでやさしく相談する" : "Talk with Yorisou on LINE"}</div>
                  <h2 className="display-serif mt-3 text-3xl leading-tight text-[#243329]">
                    {locale === "ja" ? "LINEでやさしく相談する" : "Talk with Yorisou on LINE"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#4D5642]">
                    {locale === "ja"
                      ? "ご高齢の方やご家族でも安心してご利用いただけます"
                      : "A calm and simple way for older adults and families to begin."}
                  </p>
                  <div className="mt-4">
                    <Link href={lineLoginHref} className="inline-flex w-full items-center justify-center rounded-[1.25rem] bg-[#06C755] px-6 py-4 text-center text-sm font-semibold text-white shadow-[0_16px_30px_rgba(6,199,85,0.22)] transition hover:translate-y-[-1px] hover:opacity-95">
                      <LineBrandIcon className="h-5 w-5" />
                      {locale === "ja" ? "LINEでやさしく相談する" : "Talk with Yorisou on LINE"}
                    </Link>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-[#55705C]">
                    {locale === "ja"
                      ? "ご高齢の方やご家族でも安心してご利用いただけます"
                      : "A calm and simple way for older adults and families to begin."}
                  </p>
                </div>
              )}

              <form className="grid gap-5" action={endpoint} method="post" onSubmit={handleSubmit}>
                <input type="hidden" name="next" value={supportHref} />
                <input type="hidden" name="returnTo" value={mode === "login" ? loginHref : registerHref} />
                {!initialAccount && (
                  <div className="rounded-[1.6rem] border border-[#E0D2C4] bg-[#FFF9F2] px-5 py-5 text-sm leading-7 text-[#665651]">
                    <div className="font-medium text-[#312321]">{locale === "ja" ? "メールで続ける" : "Continue with email instead"}</div>
                    <p className="mt-2">
                      {mode === "login"
                        ? locale === "ja"
                          ? "メールアドレスとパスワードでログインしたい場合はこちらを使ってください。"
                          : "Use this if you want to sign in with your email address and password."
                        : locale === "ja"
                          ? "LINEを使わずに始める場合は、こちらからメール登録できます。"
                          : "Use this to create an account with email if you do not want to start with LINE."}
                    </p>
                  </div>
                )}
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

                <button type="submit" className="rounded-[1.2rem] bg-[#312321] px-6 py-4 text-sm text-white shadow-[0_16px_30px_rgba(47,35,33,0.18)] transition hover:translate-y-[-1px] hover:opacity-95">
                  {isSubmitting
                    ? locale === "ja"
                      ? "確認中..."
                      : "Submitting..."
                    : mode === "login"
                    ? locale === "ja"
                      ? "ログインして確認する"
                      : "Log in to support"
                    : locale === "ja"
                      ? "登録して確認する"
                      : "Create account and continue"}
                </button>

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
    <label className="block text-sm font-medium text-[#5F514A]">
      <span>{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

const inputClassName =
  "w-full rounded-[1.25rem] border border-[#DDCFC2] bg-[#FFFCF8] px-5 py-4 text-base text-[#312321] outline-none transition focus:border-[#8B6C55] focus:bg-white";
