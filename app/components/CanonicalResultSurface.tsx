import Link from "next/link";

import type { ReactNode } from "react";

import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  snapshot: ResultLabSnapshot;
};

const copy = {
  ja: {
    label: "あなたの結果",
    subtitle: "今の寄り添い方を、ひとつの結果としてわかりやすくまとめます。",
    lineContinue: "もう一度チェックする",
    lineContinueHint: "LINE MINI App の最初に戻って、もう一度はじめられます。",
    teaser: "ティーザー",
    shareCard: "友だちに送りやすい一言",
    deepReport: "深い読み",
    invalidTitle: "結果の受け取りに問題があります",
    invalidBody: "この状態では、結果をそのまま表示できません。payload または version を確認してください。",
    versionTitle: "バージョンが一致しません",
    versionBody: "スコア版または結果版がロックされた仕様と合っていません。古いデータは使いません。",
    teaserOnly: "ティーザーだけを先に表示します",
    deepLocked: "深い読みはまだロック中です",
    deepUnlocked: "深い読みを開いています",
    resultReady: "結果は準備できています",
    shareReady: "共有カードは準備できています",
    lockedNotice: "表示は読み取り専用です。結果はそのまま保存して戻れます。",
    currentState: "現在の状態",
    readOnly: "読み取り専用",
    lineHint: "LINE続行は、同じ流れに戻るための入口です。",
  },
  en: {
    label: "Your result",
    subtitle: "A clear result view that summarizes the support pattern that fits you right now.",
    lineContinue: "Check again",
    lineContinueHint: "Returns to the LINE MINI App start so you can try again.",
    teaser: "Teaser",
    shareCard: "A line to share",
    deepReport: "Deep reading",
    invalidTitle: "There is a problem receiving this result",
    invalidBody: "This state cannot render the result as-is. Check the payload and version.",
    versionTitle: "Version mismatch",
    versionBody: "The score version or result version does not match the locked spec. Old data is ignored.",
    teaserOnly: "Showing teaser only for now",
    deepLocked: "Deep reading is still locked",
    deepUnlocked: "Deep reading is open",
    resultReady: "The result is ready",
    shareReady: "Share card is ready",
    lockedNotice: "This view is read-only. Your result stays the same when you come back.",
    currentState: "Current state",
    readOnly: "Read-only",
    lineHint: "LINE continuation returns to the same flow.",
  },
} as const;

function lineContinueHref(locale: Locale) {
  return locale === "en" ? "/en/line/mini-app" : "/line/mini-app";
}

function renderStateLabel(locale: Locale, snapshot: ResultLabSnapshot) {
  const t = copy[locale];
  if (snapshot.renderingState === "version_mismatch_guard") {
    return t.versionTitle;
  }
  if (snapshot.renderingState === "invalid_or_missing_payload") {
    return t.invalidTitle;
  }
  if (snapshot.renderingState === "teaser_only") {
    return t.teaserOnly;
  }
  if (snapshot.renderingState === "deep_report_locked") {
    return t.deepLocked;
  }
  if (snapshot.renderingState === "deep_report_unlocked") {
    return t.deepUnlocked;
  }
  if (snapshot.renderingState === "share_card_ready") {
    return t.shareReady;
  }
  return t.resultReady;
}

export default function CanonicalResultSurface({ locale, snapshot }: Props) {
  const t = copy[locale];
  const continueHref = lineContinueHref(locale);
  const payload = snapshot.payload;
  const renderErrorState = snapshot.renderingState === "invalid_or_missing_payload" || snapshot.renderingState === "version_mismatch_guard";
  const canRenderDeepReport =
    snapshot.renderingState === "deep_report_unlocked" ||
    snapshot.unlockState === "unlock_granted" ||
    snapshot.unlockState === "payment_succeeded" ||
    snapshot.unlockState === "deep_report_available";
  const deepReportFallbackMessage =
    snapshot.renderingState === "version_mismatch_guard"
      ? t.versionBody
      : snapshot.renderingState === "invalid_or_missing_payload"
        ? t.invalidBody
        : snapshot.renderingState === "teaser_only"
          ? t.deepLocked
          : locale === "en"
            ? "Deep reading is locked for this result."
            : "深い読みはこの結果ではロック中です。";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(247,244,238,1)_0%,rgba(242,238,229,1)_100%)] px-5 py-6 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-5 py-6 shadow-[0_14px_28px_rgba(47,35,33,0.04)] sm:px-6">
          <div className="service-kicker">{t.label}</div>
          <h1 className="display-serif mt-3 text-[2rem] leading-[1.34] sm:text-[2.5rem]">
            {payload?.share_card_result.share_card_line_jp || payload?.teaser_result.teaser_line_jp || payload?.final_locked_label_jp || t.invalidTitle}
          </h1>
          <p className="mt-3 max-w-4xl text-[15px] leading-8 text-[var(--muted)] sm:text-base">
            {payload?.final_locked_subtitle_jp || (renderErrorState ? t.versionBody : t.subtitle)}
          </p>
          <div className="mt-4 rounded-[1.4rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.32)] px-4 py-4">
            <div className="service-kicker text-[var(--accent-sage-text)]">{locale === "en" ? "Result name" : "結果名"}</div>
            <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">
              {payload?.final_locked_label_jp || t.invalidTitle}
            </p>
          </div>
          <div className="mt-5 rounded-[1.4rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-4 text-sm leading-7 text-[var(--muted)]">
            {t.lockedNotice}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={continueHref}
              className="inline-flex items-center justify-center rounded-[1.2rem] border border-[color:var(--line-sage)] bg-[rgba(255,253,249,0.92)] px-5 py-3 text-sm font-semibold text-[var(--accent-sage-text)] transition hover:bg-white"
            >
              {t.lineContinue}
            </Link>
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--muted)]">{t.lineContinueHint}</p>
          <a
            href={locale === "en" ? "/en/support" : "/support"}
            className="mt-3 inline-flex text-sm text-[var(--muted)] underline underline-offset-4 transition hover:text-[var(--text)]"
          >
            {locale === "en" ? "Open support page" : "相談ページを見る"}
          </a>
        </header>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-6">
            <Panel title={t.teaser}>
              {renderErrorState ? (
                <div className="rounded-[1.4rem] border border-dashed border-[color:var(--line-soft)] bg-white/60 px-5 py-6 text-sm leading-7 text-[var(--muted)]">
                  {renderStateLabel(locale, snapshot)}
                  <p className="mt-2">{renderErrorState ? t.versionBody : t.invalidBody}</p>
                </div>
              ) : (
                <div className="rounded-[1.4rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.34)] px-5 py-5">
                  <div className="service-kicker text-[var(--accent-sage-text)]">{t.teaser}</div>
                  <p className="mt-3 text-lg leading-8 text-[var(--accent-sage-text)]">{payload?.teaser_result.teaser_line_jp || "—"}</p>
                </div>
              )}
            </Panel>

            <Panel title={t.shareCard}>
              <div className="rounded-[1.4rem] border border-[color:var(--line-soft)] bg-white/80 px-5 py-5">
                <p className="text-lg leading-8 text-[var(--text)]">{payload?.share_card_result.share_card_line_jp || "—"}</p>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                  {snapshot.payload?.share_card_state.status === "share_card_ready" ? t.shareReady : copy[locale].lockedNotice}
                </p>
              </div>
            </Panel>

            <Panel title={t.deepReport}>
              {canRenderDeepReport && payload ? (
                <div className="space-y-3 rounded-[1.4rem] border border-[color:var(--line-soft)] bg-white/80 px-5 py-5 text-sm leading-7 text-[var(--muted)]">
                  <p className="font-semibold text-[var(--text)]">{payload.deep_report_stub.deep_report_title_jp}</p>
                  <p>{payload.deep_report_stub.deep_report_intro_jp}</p>
                  {payload.subobjects.deep_report_payload.deep_report_sections ? (
                    <div className="mt-3 space-y-2">
                      {Object.entries(payload.subobjects.deep_report_payload.deep_report_sections).map(([key, value]) => (
                        <div key={key} className="rounded-[1rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.88)] px-4 py-3">
                          <div className="text-[11px] tracking-[0.18em] text-[var(--muted)]">{key}</div>
                          <div className="mt-1">{value}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-[color:var(--line-soft)] bg-white/60 px-5 py-6 text-sm leading-7 text-[var(--muted)]">
                  {deepReportFallbackMessage}
                </div>
              )}
            </Panel>
          </article>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-6 py-6 shadow-[0_14px_28px_rgba(47,35,33,0.04)]">
      <div className="service-kicker">{title}</div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
