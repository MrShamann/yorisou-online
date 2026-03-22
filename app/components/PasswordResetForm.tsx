"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getPasswordPolicyMessage, PASSWORD_RULES } from "@/lib/passwordPolicy";

export default function PasswordResetForm({
  locale,
  token,
  tokenValid,
  initialError,
}: {
  locale: "ja" | "en";
  token: string;
  tokenValid: boolean;
  initialError?: string | null;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(initialError || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const forgotHref = locale === "ja" ? "/forgot-password" : "/en/forgot-password";
  const returnTo = locale === "ja" ? "/reset-password" : "/en/reset-password";
  const checks = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        ...rule,
        ok: rule.test(password),
      })),
    [password],
  );
  const hasPasswordInput = password.length > 0;
  const hasStrongPassword = checks.every((rule) => rule.ok);
  const togglePasswordLabel =
    locale === "ja"
      ? showPassword
        ? "パスワードを隠す"
        : "パスワードを表示する"
      : showPassword
        ? "Hide password"
        : "Show password";

  if (!tokenValid) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
        <section className="px-6 py-16 md:px-10 md:py-22">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#D6C3A3]/35 bg-white/82 p-8 text-center shadow-[0_20px_56px_rgba(59,47,47,0.06)] md:p-10">
            <h1 className="text-3xl font-light md:text-4xl">{locale === "ja" ? "リンクを確認してください" : "Check your reset link"}</h1>
            <p className="mt-4 text-base leading-8 text-[#5A4B3E]">
              {initialError ||
                (locale === "ja"
                  ? "この再設定リンクは無効、期限切れ、またはすでに使用されています。"
                  : "This reset link is invalid, expired, or has already been used.")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={forgotHref} className="btn btn-secondary">
                {locale === "ja" ? "再設定メールを送り直す" : "Request a new reset link"}
              </Link>
              <Link href={loginHref} className="btn btn-secondary">
                {locale === "ja" ? "ログインへ戻る" : "Back to login"}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="shell-card p-8 md:p-10">
            <h1 className="text-4xl font-light leading-tight md:text-5xl">
              {locale === "ja" ? "新しいパスワードを設定する" : "Set a new password"}
            </h1>
            <p className="mt-6 text-base leading-8 text-[#5A4B3E] md:text-lg">
              {locale === "ja"
                ? "新しいパスワードを設定すると、次回からその内容でログインできます。"
                : "After saving, use the new password for future logins."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/82 p-7 shadow-[0_20px_56px_rgba(59,47,47,0.06)] md:p-9">
            <form
              className="grid gap-5"
              action="/api/auth/reset-password"
              method="post"
              onSubmit={(event) => {
                setError("");
                if (!hasStrongPassword) {
                  event.preventDefault();
                  setError(getPasswordPolicyMessage(locale));
                  return;
                }
                setIsSubmitting(true);
              }}
            >
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="returnTo" value={returnTo} />

              <label className="grid gap-2 text-sm font-medium text-[#5A4B3E]">
                <span>{locale === "ja" ? "新しいパスワード" : "New password"}</span>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      if (error) {
                        setError("");
                      }
                      setPassword(event.target.value);
                    }}
                    className="w-full rounded-[1.25rem] border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3 pr-24 text-base text-[#3B2F2F] outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D7BE]"
                    autoComplete="new-password"
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
              </label>

              <div className="rounded-[1.25rem] border border-[#D6C3A3]/28 bg-[#FCFAF6] px-4 py-4 text-sm text-[#5A4B3E]">
                <p className="font-medium text-[#5A4B3E]">
                  {locale === "ja" ? "パスワードの条件" : "Password requirements"}
                </p>
                <ul className="mt-3 space-y-2">
                  {checks.map((rule) => {
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

              {error && <p className="text-sm font-medium text-[#9A3B2F]">{error}</p>}

              <button type="submit" className="rounded-full bg-[#3B2F2F] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90">
                {isSubmitting
                  ? locale === "ja"
                    ? "更新中..."
                    : "Updating..."
                  : locale === "ja"
                    ? "新しいパスワードを保存"
                    : "Save new password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
