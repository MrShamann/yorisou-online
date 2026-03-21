"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AccountRecord } from "@/lib/server/yorisouData";

type Mode = "login" | "register";

export default function AccountEntryForm({
  mode,
  locale,
  initialAccount,
}: {
  mode: Mode;
  locale: "ja" | "en";
  initialAccount: AccountRecord | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<"self" | "family" | "facility">("family");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportHref = locale === "ja" ? "/support" : "/en/support";
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login"
          ? {
              email: email.trim(),
              password,
            }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
              city: city.trim(),
              role,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        if (result.error === "email_exists") {
          setError(locale === "ja" ? "そのメールアドレスはすでに登録されています。" : "That email address is already registered.");
        } else if (result.error === "invalid_credentials") {
          setError(locale === "ja" ? "メールアドレスかパスワードが一致しません。" : "Email or password did not match.");
        } else if (result.error === "invalid_payload") {
          setError(locale === "ja" ? "入力内容を確認してください。" : "Please check the form values.");
        } else {
          setError(locale === "ja" ? "処理に失敗しました。時間をおいてお試しください。" : "Request failed. Please try again.");
        }
        return;
      }

      router.push(supportHref);
      router.refresh();
    } catch {
      setError(locale === "ja" ? "通信に失敗しました。時間をおいてお試しください。" : "Network request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
                    ? "登録すると、この端末で保存した相談結果をサポートページにまとめて見返せます。"
                    : "Registration lets you keep locally saved consultations and review them in the support page."}
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

              <form className="grid gap-5" onSubmit={handleSubmit}>
                {mode === "register" && (
                  <Field label={locale === "ja" ? "お名前" : "Name"}>
                    <input value={name} onChange={(event) => setName(event.target.value)} className={inputClassName} />
                  </Field>
                )}

                <Field label={locale === "ja" ? "メールアドレス" : "Email"}>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClassName} />
                </Field>

                <Field label={locale === "ja" ? "パスワード" : "Password"}>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClassName} />
                </Field>

                {mode === "register" && (
                  <>
                    <Field label={locale === "ja" ? "お住まいの地域" : "City / area"}>
                      <input value={city} onChange={(event) => setCity(event.target.value)} className={inputClassName} />
                    </Field>
                    <Field label={locale === "ja" ? "立場" : "Role"}>
                      <select value={role} onChange={(event) => setRole(event.target.value as "self" | "family" | "facility")} className={inputClassName}>
                        <option value="self">{locale === "ja" ? "ご本人" : "Self"}</option>
                        <option value="family">{locale === "ja" ? "ご家族" : "Family"}</option>
                        <option value="facility">{locale === "ja" ? "施設・事業者" : "Facility / operator"}</option>
                      </select>
                    </Field>
                  </>
                )}

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
