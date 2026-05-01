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
    pageTitle: "さらに深く読む",
    pageSummary: "結果のつづきを、報告書の入口として開きます。",
    backLabel: "結果に戻る",
    notReady: "このタイプの詳しい読みは準備中です。",
    notReadySummary: "まずは結果ページの要約を受け取り、準備が整ったら続きを開いてください。",
    summaryLabel: "あなたの核",
    coreReadLabel: "まず受け取ること",
    whyLabel: "なぜこの結果か",
    relationLabel: "人とのかかわり",
    closeRelationLabel: "近い関係で出やすいこと",
    workLabel: "仕事・勉強",
    stressLabel: "しんどい時",
    blindLabel: "見落としやすい点",
    misunderstandingLabel: "誤解されやすいところ",
    strengthLabel: "強み",
    riskLabel: "注意点",
    adjustLabel: "小さな調整",
    oracleLabel: "余韻の一言",
    oraclePreviewLabel: "読み解きの入口",
    reportPreviewLabel: "深読みの予告",
    lineLabel: "LINEのつづき",
    shareLabel: "共有のひとこと",
    paywallLabel: "つづきを開く理由",
  },
  en: {
    pageTitle: "Read deeper",
    pageSummary: "Open the continuation in a report-like, readable flow.",
    backLabel: "Back to result",
    notReady: "The detailed reading for this type is being prepared.",
    notReadySummary: "Please take the summary first, then return when the deeper reading is ready.",
    summaryLabel: "Your core",
    coreReadLabel: "What you receive first",
    whyLabel: "Why this result fits",
    relationLabel: "Relationships",
    closeRelationLabel: "What shows up in close relationships",
    workLabel: "Work and study",
    stressLabel: "When stressed",
    blindLabel: "Easy-to-miss spot",
    misunderstandingLabel: "What people may misread",
    strengthLabel: "Strength",
    riskLabel: "Risk",
    adjustLabel: "Three small adjustments",
    oracleLabel: "Oracle aftertaste",
    oraclePreviewLabel: "Reading entrance",
    reportPreviewLabel: "Deep report teaser",
    lineLabel: "LINE follow-up",
    shareLabel: "Share hook",
    paywallLabel: "Why continue",
  },
} as const;

function Section({
  title,
  children,
  subtitle,
}: {
  title: string;
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="rounded-[1.4rem] border border-[rgba(36,45,43,0.08)] bg-white/90 p-4 shadow-[0_10px_24px_rgba(36,45,43,0.05)]">
      <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{title}</div>
      {subtitle ? <div className="mt-1 text-[12px] leading-6 text-[var(--muted)]">{subtitle}</div> : null}
      <div className="mt-3 space-y-3 text-[14px] leading-7 text-[var(--text)]">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[1rem] border border-[rgba(125,141,121,0.1)] bg-[rgba(247,250,244,0.9)] px-3 py-2 text-[14px] leading-7 text-[var(--text)]"
        >
          {item}
        </li>
      ))}
    </ul>
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
      <div className="relative mx-auto max-w-[42rem] space-y-3">
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
            <h1 className="display-serif text-[clamp(2rem,10vw,2.9rem)] leading-[0.98] tracking-[-0.05em] text-[var(--text)]">
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
          <section className="rounded-[1.4rem] border border-[rgba(36,45,43,0.08)] bg-white/90 p-4 shadow-[0_10px_24px_rgba(36,45,43,0.05)]">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.notReady}</div>
            <p className="mt-2.5 text-[14px] leading-7 text-[var(--text)]">{t.notReadySummary}</p>
          </section>
        ) : (
          <>
            <section className="rounded-[1.4rem] border border-[rgba(36,45,43,0.08)] bg-white/92 p-4 shadow-[0_10px_24px_rgba(36,45,43,0.05)]">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.summaryLabel}</div>
              <p className="mt-3 text-[15px] leading-7 text-[var(--text)]">{content?.core_identity}</p>
              <div className="mt-4 rounded-[1.1rem] border border-[rgba(125,141,121,0.1)] bg-[rgba(247,250,244,0.9)] p-3">
                <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.coreReadLabel}</div>
                <p className="mt-2 text-[15px] leading-7 text-[var(--text)]">{content?.core_read}</p>
              </div>
            </section>

            <Section title={t.whyLabel}>{content?.why_this_result_fits}</Section>

            <Section title={t.relationLabel}>{content?.relationship_pattern}</Section>

            <Section title={t.closeRelationLabel}>{content?.love_or_close_relationship_pattern}</Section>

            <Section title={t.workLabel}>{content?.work_study_pattern}</Section>

            <Section title={t.stressLabel}>{content?.stress_reaction}</Section>

            <Section title={t.blindLabel}>{content?.blind_spot}</Section>

            <Section title={t.misunderstandingLabel}>{content?.misunderstanding_pattern}</Section>

            <Section title={t.strengthLabel}>
              <p>{content?.strength}</p>
              <div className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">{t.riskLabel}</div>
              <p>{content?.risk}</p>
            </Section>

            <Section title={t.adjustLabel}>
              <BulletList items={content?.three_small_adjustments || []} />
            </Section>

            <Section title={t.oracleLabel} subtitle={t.oraclePreviewLabel}>
              <div className="rounded-[1rem] border border-[rgba(125,141,121,0.12)] bg-[linear-gradient(180deg,rgba(244,246,240,1)_0%,rgba(255,255,255,1)_100%)] px-3 py-3">
                <p className="text-[15px] leading-7 text-[var(--text)]">{content?.oracle_aftertaste}</p>
                <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{content?.oracle_interpretation}</p>
              </div>
            </Section>

            <Section title={t.reportPreviewLabel}>{content?.paid_report_preview}</Section>

            <Section title={t.lineLabel}>
              <div className="space-y-2">
                <p>{content?.line_continuation_hook}</p>
                <p>{content?.line_followup_day1}</p>
                <p>{content?.line_followup_day3}</p>
              </div>
            </Section>

            <Section title={t.shareLabel}>{content?.share_hook}</Section>

            <Section title={t.paywallLabel}>
              <p>{content?.paid_report_preview}</p>
            </Section>
          </>
        )}
      </div>
    </main>
  );
}
