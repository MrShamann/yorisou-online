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
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="border-b border-[color:var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(250,245,238,0.99)_62%)] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.06fr] lg:items-start">
            <div className="px-1 py-2 md:pr-6">
              <div className="service-kicker">{locale === "ja" ? "アカウント" : "Account"}</div>
              <h1 className="display-serif mt-4 max-w-[13.5em] text-[1.7rem] leading-[1.5] md:text-[2.08rem]">
                {mode === "login"
                  ? locale === "ja"
                    ? (
                      <>
                        <span className="block md:whitespace-nowrap">Yorisou アカウントに</span>
                        <span className="block md:whitespace-nowrap">ログインします。</span>
                      </>
                    )
                    : "Log in to your Yorisou account."
                  : locale === "ja"
                    ? (
                      <>
                        <span className="block md:whitespace-nowrap">Yorisou アカウントを</span>
                        <span className="block md:whitespace-nowrap">作成します。</span>
                      </>
                    )
                    : "Create your Yorisou account."}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--muted)] md:text-base">
                {mode === "login"
                  ? locale === "ja"
                    ? "保存したチェック結果や相棒との続き方を見返したいときに使えます。"
                    : "Log in to revisit saved check results and companion continuity."
                  : locale === "ja"
                    ? "チェック結果や相棒との続き方を保存できます。"
                    : "Save your check results and companion continuity in one place."}
              </p>
              <div className="panel-sage mt-6 rounded-[1.5rem] px-5 py-5 text-sm leading-7">
                <div>{locale === "ja" ? "公開テストの続きや、相棒との返り道を落ち着いて残したい方のためのアカウントです。" : "This account keeps your open-testing progress and companion continuity available when you come back."}</div>
                <div className="mt-2">{locale === "ja" ? "メールで登録しておくと、結果や次の入口をあとから見返せます。" : "Email registration makes it easier to revisit your saved results and next-step paths later."}</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <Link href="/open-testing" className="soft-link">
                  {locale === "ja" ? "公開テストに戻る" : "Back to open testing"}
                </Link>
                {mode === "register" ? (
                  <Link href={loginHref} className="soft-link">
                    {locale === "ja" ? "すでにアカウントがある方はログイン" : "Already have an account? Log in"}
                  </Link>
                ) : (
                  <Link href={registerHref} className="soft-link">
                    {locale === "ja" ? "アカウントを作成する" : "Create an account"}
                  </Link>
                )}
              </div>
              {initialAccount && (
                <div className="panel-sage mt-6 rounded-[2rem] px-6 py-6 text-sm leading-7">
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

            <div className="shell-card p-6 md:p-8">
              <div className="mb-5 inline-flex gap-2 rounded-full border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.88)] p-1.5">
                <Link href={loginHref} className={`rounded-full px-5 py-3 text-sm ${mode === "login" ? "bg-[var(--accent)] text-white shadow-[0_8px_18px_rgba(47,35,33,0.14)]" : "text-[var(--muted)]"}`}>
                  {locale === "ja" ? "ログイン" : "Login"}
                </Link>
                <Link href={registerHref} className={`rounded-full px-5 py-3 text-sm ${mode === "register" ? "bg-[var(--accent)] text-white shadow-[0_8px_18px_rgba(47,35,33,0.14)]" : "text-[var(--muted)]"}`}>
                  {locale === "ja" ? "新規登録" : "Register"}
                </Link>
              </div>

              <form className="grid gap-5" action={endpoint} method="post" onSubmit={handleSubmit}>
                <input type="hidden" name="next" value={supportHref} />
                <input type="hidden" name="returnTo" value={mode === "login" ? loginHref : registerHref} />
                {mode === "register" && <input type="hidden" name="role" value="self" />}
                {!initialAccount && (
                  <div className="rounded-[1.3rem] bg-[rgba(255,253,249,0.78)] px-5 py-4 text-sm leading-7 text-[var(--muted)]">
                    <div className="font-medium text-[var(--text)]">{locale === "ja" ? "メールアドレスで続ける" : "Continue with email"}</div>
                    <p className="mt-2">
                      {mode === "login"
                        ? locale === "ja"
                          ? "メールアドレスとパスワードで、保存した結果や続き方を見返せます。"
                          : "Use your email address and password to revisit saved results and continuity."
                        : locale === "ja"
                          ? "メールアドレスで登録して、結果や相棒の続き方を保存できます。"
                          : "Create an account with email to save results and companion continuity."}
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
                      className="absolute inset-y-2 right-2 rounded-full px-3 text-sm text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[#d2c0ab]"
                      aria-label={togglePasswordLabel}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (locale === "ja" ? "隠す" : "Hide") : locale === "ja" ? "表示" : "Show"}
                    </button>
                  </div>
                  {mode === "register" && (
                    <div className="mt-3 rounded-[1.25rem] border border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-4 py-4 text-sm text-[var(--muted)]">
                      <p className="font-medium text-[var(--muted)]">
                        {locale === "ja" ? "パスワードの条件" : "Password requirements"}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {passwordChecks.map((rule) => {
                          const label = locale === "ja" ? rule.ja : rule.en;
                          const tone = rule.ok ? "text-[var(--accent-sage-text)]" : hasPasswordInput ? "text-[#9A3B2F]" : "text-[var(--muted)]";
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
                    <Field label={locale === "ja" ? "地域" : "City / area"}>
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
                  </>
                )}

                {mode === "login" && (
                  <div className="text-sm">
                    <Link href={forgotPasswordHref} className="text-[var(--muted)] underline underline-offset-4 hover:text-[var(--text)]">
                      {locale === "ja" ? "パスワードをお忘れですか？" : "Forgot password?"}
                    </Link>
                  </div>
                )}

                {notice && <p className="text-sm font-medium text-[var(--accent-sage-text)]">{notice}</p>}
                {error && <p className="text-sm font-medium text-[#9A3B2F]">{error}</p>}

                <button type="submit" className="rounded-[1.2rem] bg-[var(--accent)] px-6 py-4 text-sm text-white shadow-[0_16px_30px_rgba(47,35,33,0.15)] transition hover:translate-y-[-1px] hover:opacity-95">
                  {isSubmitting
                    ? locale === "ja"
                      ? "確認中..."
                      : "Submitting..."
                    : mode === "login"
                    ? locale === "ja"
                      ? "ログインする"
                      : "Log in"
                    : locale === "ja"
                      ? "登録する"
                      : "Create account"}
                </button>

                {!initialAccount && (
                  <div className="rounded-[1.2rem] border border-[color:var(--line-soft)] bg-[rgba(243,250,246,0.55)] px-5 py-4 text-sm leading-7 text-[var(--muted)]">
                    <div className="font-medium text-[var(--text)]">{locale === "ja" ? "LINEで続ける場合" : "If you prefer LINE"}</div>
                    <p className="mt-2">
                      {locale === "ja"
                        ? "メール登録の代わりに、LINE連携で続きを開くこともできます。現在のYorisouでは補助的な継続手段です。"
                        : "You can also continue through LINE connection. In the current Yorisou flow, it is an optional continuity path."}
                    </p>
                    <div className="mt-3">
                      <Link href={lineLoginHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-sage-text)] hover:underline">
                        <LineBrandIcon className="h-5 w-5" />
                        {locale === "ja" ? "LINEで続ける" : "Continue with LINE"}
                      </Link>
                    </div>
                  </div>
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
    <label className="block text-sm font-medium text-[#5F514A]">
      <span>{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

const inputClassName =
  "w-full rounded-[1.25rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.94)] px-5 py-4 text-base text-[var(--text)] outline-none transition focus:border-[#8b7462] focus:bg-white";
