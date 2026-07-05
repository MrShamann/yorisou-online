"use client";

import Link from "next/link";

import ScenarioSupportAssistant from "@/app/components/ScenarioSupportAssistant";

type Locale = "ja" | "en";
type SupportWorkspaceProps = {
  locale: Locale;
};

const copy = {
  ja: {
    label: "ひなた",
    localeToggle: "English",
  },
  en: {
    label: "Hinata",
    localeToggle: "日本語",
  },
} as const;

export default function SupportWorkspace({ locale }: SupportWorkspaceProps) {
  const t = copy[locale];
  const alternateHref = locale === "ja" ? "/en/support" : "/support";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#efe8db_100%)] text-[var(--text)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-0 py-0 md:px-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-between px-4 pt-4 md:px-6">
          <div className="pointer-events-auto rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-3 py-1.5 text-[11px] tracking-[0.18em] text-[var(--muted)] shadow-[0_10px_24px_rgba(47,35,33,0.05)] backdrop-blur">
            {t.label}
          </div>
          <Link
            href={alternateHref}
            className="pointer-events-auto rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-4 py-2 text-sm text-[var(--accent-sage-text)] shadow-[0_10px_24px_rgba(47,35,33,0.05)] transition hover:bg-white"
          >
            {t.localeToggle}
          </Link>
        </div>

        <div className="flex min-h-screen flex-1 overflow-hidden bg-transparent">
          <ScenarioSupportAssistant locale={locale} />
        </div>
      </div>
    </main>
  );
}
