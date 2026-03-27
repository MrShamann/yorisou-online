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
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="border-b border-[color:var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(250,245,238,0.99)_62%)] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="shell-card p-8 md:p-12">
              <div className="service-kicker">{locale === "ja" ? "相談のつづき" : "Continue your consultation"}</div>
              <h1 className="display-serif mt-4 max-w-[12em] text-[2.2rem] leading-[1.38] md:text-[3.3rem]">
                {mode === "login"
                  ? locale === "ja"
                    ? "落ち着いて、相談のつづきを確認できます。"
                    : "Log in to review your support"
                  : locale === "ja"
                    ? "あとから続けやすい形を整えます。"
                    : "Create an account for ongoing support"}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                {mode === "login"
                  ? locale === "ja"
                    ? "ひなたとのご相談内容やご案内を、あとから見返したいときに使えます。"
                    : "The support page brings together consultation history, recommendation notes, family sharing, and follow-up status."
                  : locale === "ja"
                    ? "登録しておくと、ご相談の流れやご案内をひとつの場所でやさしく確認できるようになります。"
                    : "Create one account to keep consultations and recommendations together."}
              </p>
              <div className="mt-7 rounded-[1.6rem] bg-[var(--surface)] px-6 py-6 text-sm leading-7 text-[var(--muted)]">
                <div>{locale === "ja" ? "ご本人でも、ご家族でも、無理のない形で続けられます。" : "This entry works for older adults and family members."}</div>
                <div className="mt-2">{locale === "ja" ? "LINEで受け取りたい方も、メールで見返したい方も、あとから選べます。" : "You can choose LINE or email later, whichever feels easier."}</div>
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

            <div className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.9)] p-7 shadow-[0_16px_32px_rgba(47,35,33,0.05)] md:p-9">
              <div className="mb-6 flex gap-3 rounded-full border border-[color:var(--line-soft)] bg-[var(--surface-soft)] p-2">
                <Link href={loginHref} className={`rounded-full px-5 py-3 text-sm ${mode === "login" ? "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(47,35,33,0.18)]" : "text-[var(--muted)]"}`}>
                  {locale === "ja" ? "ログイン" : "Login"}
                </Link>
                <Link href={registerHref} className={`rounded-full px-5 py-3 text-sm ${mode === "register" ? "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(47,35,33,0.18)]" : "text-[var(--muted)]"}`}>
                  {locale === "ja" ? "新規登録" : "Register"}
                </Link>
              </div>

              {!initialAccount && (
                <div id="line-entry" className="mb-6 rounded-[1.6rem] bg-[rgba(237,242,234,0.72)] px-5 py-5 text-sm leading-7">
                  <div className="service-kicker text-[#64705f]">{locale === "ja" ? "LINEで続ける方へ" : "Continue with LINE"}</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--accent-sage-text)]">
                    {locale === "ja"
                      ? "相談の続きやご案内を、受け取りやすい形でつないでおきたい方に向いています。"
                      : "A calm and simple way for older adults and families to begin."}
                  </p>
                  <div className="mt-4">
                    <Link href={lineLoginHref} className="inline-flex w-full items-center justify-center rounded-[1.25rem] border border-[color:var(--line-sage)] bg-[rgba(255,253,249,0.88)] px-6 py-4 text-center text-sm font-semibold text-[var(--accent-sage-text)] transition hover:translate-y-[-1px] hover:bg-white hover:opacity-95">
                      <LineBrandIcon className="h-5 w-5" />
                      {locale === "ja" ? "LINEでつながる" : "Continue with LINE"}
                    </Link>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-[#64705f]">
                    {locale === "ja"
                      ? "まずは相談を始めて、あとから整えたい方にも使えます。"
                      : "A calm and simple way for older adults and families to begin."}
                  </p>
                </div>
              )}

              <form className="grid gap-5" action={endpoint} method="post" onSubmit={handleSubmit}>
                <input type="hidden" name="next" value={supportHref} />
                <input type="hidden" name="returnTo" value={mode === "login" ? loginHref : registerHref} />
                {!initialAccount && (
                  <div className="rounded-[1.4rem] bg-[var(--surface)] px-5 py-5 text-sm leading-7 text-[var(--muted)]">
                    <div className="font-medium text-[var(--text)]">{locale === "ja" ? "メールで続ける" : "Continue with email instead"}</div>
                    <p className="mt-2">
                      {mode === "login"
                        ? locale === "ja"
                          ? "メールアドレスとパスワードで、ご相談内容を見返したい方はこちらをお使いください。"
                          : "Use this if you want to sign in with your email address and password."
                        : locale === "ja"
                          ? "LINEを使わずに始めたい場合も、こちらから無理なく登録できます。"
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
                      ? "ログインして続きを見る"
                      : "Log in to support"
                    : locale === "ja"
                      ? "登録して続ける"
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
  "w-full rounded-[1.25rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.94)] px-5 py-4 text-base text-[var(--text)] outline-none transition focus:border-[#8b7462] focus:bg-white";
