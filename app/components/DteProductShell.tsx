"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  personaId?: string | null;
  children: ReactNode;
};

const copy = {
  ja: {
    tagline: "ひとりの時間に、そっと残る読みもの。",
    resultLabel: "結果",
    continueLabel: "深く読む",
    retakeLabel: "もう一度受ける",
    loginLabel: "ログイン",
    localeCurrent: "JP",
    localeTarget: "EN",
    footerTagline: "ひとりの時間に、そっと残る読みもの。",
  },
  en: {
    tagline: "Quiet readings for the space inside you.",
    resultLabel: "Result",
    continueLabel: "Continue",
    retakeLabel: "Retake",
    loginLabel: "Login",
    localeCurrent: "EN",
    localeTarget: "JP",
    footerTagline: "Quiet readings for the space inside you.",
  },
} as const;

export default function DteProductShell({ locale, personaId = null, children }: Props) {
  const t = copy[locale];
  const safePersonaId = (personaId || "P01").trim() || "P01";
  const resultHref = locale === "en" ? `/en/result?persona=${encodeURIComponent(safePersonaId)}` : `/result?persona=${encodeURIComponent(safePersonaId)}`;
  const continueHref =
    locale === "en"
      ? `/en/result/continue?persona=${encodeURIComponent(safePersonaId)}` 
      : `/result/continue?persona=${encodeURIComponent(safePersonaId)}`;
  const retakeHref = locale === "en" ? "/en/line/mini-app" : "/line/mini-app";
  const loginHref = locale === "en" ? "/en/login" : "/login";
  const localeHref = locale === "en" ? "/" : "/en";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(252,250,245,1)_0%,rgba(246,248,243,1)_44%,rgba(242,246,239,1)_100%)] text-[var(--text)]">
      <header className="border-b border-[rgba(216,207,195,0.58)] bg-[rgba(252,250,245,0.92)] backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <div className="display-serif text-[1.78rem] font-semibold tracking-[0.09em] text-[var(--text)] md:text-[2.12rem]">YORISOU</div>
              <div className="mt-0.5 max-w-2xl text-[0.84rem] leading-7 text-[var(--muted)]">{t.tagline}</div>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              <Link href={resultHref} className="rounded-full border border-[rgba(125,141,121,0.14)] bg-white/72 px-3 py-1.5 text-[12px] font-medium text-[var(--accent-sage-text)]">
                {t.resultLabel}
              </Link>
              <Link href={continueHref} className="rounded-full border border-[rgba(125,141,121,0.14)] bg-white/72 px-3 py-1.5 text-[12px] font-medium text-[var(--accent-sage-text)]">
                {t.continueLabel}
              </Link>
              <Link href={retakeHref} className="rounded-full border border-[rgba(125,141,121,0.14)] bg-white/72 px-3 py-1.5 text-[12px] font-medium text-[var(--accent-sage-text)]">
                {t.retakeLabel}
              </Link>
              <Link href={loginHref} className="rounded-full border border-[rgba(125,141,121,0.14)] bg-white/72 px-3 py-1.5 text-[12px] font-medium text-[var(--accent-sage-text)]">
                {t.loginLabel}
              </Link>
              <Link href={localeHref} className="rounded-full border border-[rgba(125,141,121,0.14)] bg-white/72 px-3 py-1.5 text-[12px] font-medium text-[var(--accent-sage-text)]">
                <span className="mr-1 opacity-70">{t.localeCurrent}</span>
                <span className="opacity-90">{t.localeTarget}</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div>{children}</div>

      <footer className="border-t border-[rgba(216,207,195,0.58)] bg-[rgba(252,250,245,0.92)]">
        <div className="container py-8">
          <div className="display-serif text-[1.3rem] font-semibold tracking-[0.08em] text-[var(--text)]">YORISOU</div>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">{t.footerTagline}</p>
        </div>
      </footer>
    </div>
  );
}
