"use client";

import Link from "next/link";
import { useState } from "react";

export default function PasswordResetRequestForm({
  locale,
  initialError,
  initialNotice,
}: {
  locale: "ja" | "en";
  initialError?: string | null;
  initialNotice?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(initialError || "");
  const [notice] = useState(initialNotice || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const requestHref = locale === "ja" ? "/forgot-password" : "/en/forgot-password";

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="shell-card p-8 md:p-10">
            <h1 className="text-4xl font-light leading-tight md:text-5xl">
              {locale === "ja" ? "パスワードを再設定する" : "Reset your password"}
            </h1>
            <p className="mt-6 text-base leading-8 text-[#5A4B3E] md:text-lg">
              {locale === "ja"
                ? "登録済みメールアドレスを入力すると、再設定リンクを送信します。"
                : "Enter your account email and we will send a reset link."}
            </p>
            <div className="mt-8">
              <Link href={loginHref} className="btn btn-secondary">
                {locale === "ja" ? "ログインへ戻る" : "Back to login"}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/82 p-7 shadow-[0_20px_56px_rgba(59,47,47,0.06)] md:p-9">
            <form
              className="grid gap-5"
              action="/api/auth/forgot-password"
              method="post"
              onSubmit={() => {
                setError("");
                setIsSubmitting(true);
              }}
            >
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="returnTo" value={requestHref} />
              <label className="grid gap-2 text-sm font-medium text-[#5A4B3E]">
                <span>{locale === "ja" ? "メールアドレス" : "Email"}</span>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    if (error) {
                      setError("");
                    }
                    setEmail(event.target.value);
                  }}
                  className="w-full rounded-[1.25rem] border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3 text-base text-[#3B2F2F] outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D7BE]"
                  autoComplete="email"
                />
              </label>

              {notice && <p className="text-sm font-medium leading-7 text-[#4D6B45]">{notice}</p>}
              {error && <p className="text-sm font-medium leading-7 text-[#9A3B2F]">{error}</p>}

              <button type="submit" className="rounded-full bg-[#3B2F2F] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90">
                {isSubmitting
                  ? locale === "ja"
                    ? "送信中..."
                    : "Sending..."
                  : locale === "ja"
                    ? "再設定リンクを送る"
                    : "Send reset link"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
