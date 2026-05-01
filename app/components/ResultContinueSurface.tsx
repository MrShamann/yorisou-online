import Link from "next/link";
import type { ReactNode } from "react";

import type { YorisouDeepResultLocaleContent } from "@/lib/yorisou/persona-deep-result-content";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  personaId: string;
  content: YorisouDeepResultLocaleContent | null;
  backHref: string;
};

const copy = {
  ja: {
    pageTitle: "さらに深く見る",
    pageSummary: "結果のつづきを、読みやすく開きます。",
    backLabel: "結果に戻る",
    notReady: "このタイプの詳しい読みは準備中です。",
    notReadySummary: "まずは結果ページの要約を受け取り、準備が整ったら続きを開いてください。",
    whyLabel: "なぜこの結果か",
    relationLabel: "人とのかかわり",
    workLabel: "仕事・勉強",
    stressLabel: "しんどい時",
    blindLabel: "見落としやすい点",
    strengthLabel: "強み",
    riskLabel: "注意点",
    adjustLabel: "小さな調整",
    oracleLabel: "余韻の一言",
    oraclePreviewLabel: "読み解きの入口",
    reportTeaserLabel: "深読みの予告",
    lineLabel: "LINEのつづき",
    shareLabel: "共有のひとこと",
    paywallLabel: "つづきを開く理由",
  },
  en: {
    pageTitle: "Read deeper",
    pageSummary: "Open the continuation in a calm, readable flow.",
    backLabel: "Back to result",
    notReady: "The detailed reading for this type is being prepared.",
    notReadySummary: "Please take the summary first, then return when the deeper reading is ready.",
    whyLabel: "Why this result fits",
    relationLabel: "Relationships",
    workLabel: "Work and study",
    stressLabel: "When stressed",
    blindLabel: "Easy-to-miss spot",
    strengthLabel: "Strength",
    riskLabel: "Risk",
    adjustLabel: "Three small adjustments",
    oracleLabel: "Oracle aftertaste",
    oraclePreviewLabel: "Reading preview",
    reportTeaserLabel: "Deep report teaser",
    lineLabel: "LINE follow-up",
    shareLabel: "Share hook",
    paywallLabel: "Why continue",
  },
} as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.35rem] border border-[rgba(36,45,43,0.08)] bg-white/88 p-4 shadow-[0_10px_24px_rgba(36,45,43,0.05)]">
      <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{title}</div>
      <div className="mt-2.5 text-[14px] leading-7 text-[var(--text)]">{children}</div>
    </section>
  );
}

export default function ResultContinueSurface({ locale, personaId, content, backHref }: Props) {
  const t = copy[locale];
  const fallbackMode = !content;
  const personaLabel = content?.official_public_name || personaId;
  const handle = content?.social_handle || "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(12,18,17,0.96)_0%,rgba(24,35,31,0.94)_18%,rgba(244,246,240,1)_70%,rgba(237,242,235,1)_100%)] px-4 py-4 text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_28%,rgba(223,233,227,0.16)_100%)]" />
      <div className="relative mx-auto max-w-md space-y-3">
        <header className="rounded-[1.4rem] border border-[rgba(36,45,43,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,248,243,0.98)_100%)] p-4 shadow-[0_12px_28px_rgba(47,35,33,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={backHref}
              className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(125,141,121,0.16)] bg-white/70 px-3 py-1 text-[12px] font-medium text-[var(--accent-sage-text)]"
            >
              {t.backLabel}
            </Link>
            <div className="rounded-full border border-[rgba(125,141,121,0.16)] bg-white/70 px-3 py-1 text-[10px] tracking-[0.18em] text-[var(--muted)]">
              {t.pageTitle}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-[10px] tracking-[0.22em] text-[var(--muted)]">{t.pageSummary}</div>
            <h1 className="display-serif text-[clamp(2rem,10vw,2.8rem)] leading-[0.98] tracking-[-0.05em] text-[var(--text)]">
              {personaLabel}
            </h1>
            {handle ? <p className="text-[14px] font-medium leading-7 text-[var(--accent-sage-text)]">{handle}</p> : null}
            {content?.functional_subtitle ? <p className="text-[14px] leading-7 text-[var(--text)]">{content.functional_subtitle}</p> : null}
            {content ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-[rgba(125,141,121,0.12)] bg-white/80 px-3 py-1.5 text-[10px] tracking-[0.16em] text-[var(--muted)]">
                  {content.public_sign}
                </span>
                <span className="rounded-full border border-[rgba(125,141,121,0.12)] bg-white/80 px-3 py-1.5 text-[10px] tracking-[0.16em] text-[var(--muted)]">
                  {content.current_mode}
                </span>
              </div>
            ) : null}
          </div>
        </header>

        {fallbackMode ? (
          <section className="rounded-[1.35rem] border border-[rgba(36,45,43,0.08)] bg-white/88 p-4 shadow-[0_10px_24px_rgba(36,45,43,0.05)]">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.notReady}</div>
            <p className="mt-2.5 text-[14px] leading-7 text-[var(--text)]">{t.notReadySummary}</p>
          </section>
        ) : (
          <>
            <Section title={locale === "en" ? "Core read" : "まず受け取る核"}>
              {content?.core_read}
            </Section>

            <Section title={t.whyLabel}>{content?.why_this_result}</Section>

            <Section title={t.relationLabel}>{content?.relationship_pattern}</Section>

            <Section title={t.workLabel}>{content?.work_study_pattern}</Section>

            <Section title={t.stressLabel}>{content?.stress_reaction}</Section>

            <Section title={t.blindLabel}>{content?.blind_spot}</Section>

            <Section title={t.strengthLabel}>
              <p>{content?.strength}</p>
              <div className="mt-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.riskLabel}</div>
              <p className="mt-2.5">{content?.risk}</p>
            </Section>

            <section className="rounded-[1.35rem] border border-[rgba(36,45,43,0.08)] bg-white/88 p-4 shadow-[0_10px_24px_rgba(36,45,43,0.05)]">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.adjustLabel}</div>
              <ul className="mt-3 space-y-2">
                {content?.three_small_adjustments.map((item) => (
                  <li key={item} className="rounded-[1rem] border border-[rgba(125,141,121,0.1)] bg-[rgba(247,250,244,0.9)] px-3 py-2 text-[14px] leading-7 text-[var(--text)]">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <Section title={t.oracleLabel}>
              <div className="rounded-[1rem] border border-[rgba(125,141,121,0.12)] bg-[linear-gradient(180deg,rgba(244,246,240,1)_0%,rgba(255,255,255,1)_100%)] px-3 py-3">
                <p className="text-[14px] leading-7 text-[var(--text)]">{content?.oracle_line}</p>
                <p className="mt-2 text-[12px] leading-6 text-[var(--muted)]">{content?.oracle_interpretation_preview}</p>
              </div>
            </Section>

            <Section title={t.reportTeaserLabel}>{content?.deep_report_teaser}</Section>

            <Section title={t.lineLabel}>
              <div className="space-y-2">
                <p>{content?.line_followup_day1}</p>
                <p>{content?.line_followup_day3}</p>
              </div>
            </Section>

            <Section title={t.shareLabel}>{content?.share_hook}</Section>

            <Section title={t.paywallLabel}>
              <p>{content?.paywall_hook}</p>
            </Section>
          </>
        )}
      </div>
    </main>
  );
}
