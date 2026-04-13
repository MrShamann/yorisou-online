import Link from "next/link";

import type { ReactNode } from "react";

import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  snapshot: ResultLabSnapshot;
  currentPath: string;
};

const copy = {
  ja: {
    label: "RESULT",
    subtitle: "ロック済みの名前・ティーザー・共有文・深い読みの手前までを、ひとつの結果として整えます。",
    lineContinue: "LINEで続ける",
    lineContinueHint: "この結果は、LINE認証が完了していれば同じ流れに戻れます。",
    teaser: "ティーザー",
    shareCard: "共有カード",
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
    lockedNotice: "名前・サブタイトル・次元の意味は変更しません。",
    currentState: "現在の状態",
    readOnly: "読み取り専用",
    lineHint: "LINE続行は、同じ結果に戻るための入口です。",
  },
  en: {
    label: "RESULT",
    subtitle: "This surface keeps the locked name, teaser, share copy, and deep-report boundary in one read-only result view.",
    lineContinue: "Continue in LINE",
    lineContinueHint: "If LINE auth is configured, this result can return to the same flow.",
    teaser: "Teaser",
    shareCard: "Share card",
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
    lockedNotice: "The label, subtitle, and dimension meaning remain locked.",
    currentState: "Current state",
    readOnly: "Read-only",
    lineHint: "LINE continuation returns to the same result context.",
  },
} as const;

function lineContinueHref(locale: Locale, currentPath: string) {
  const params = new URLSearchParams({
    locale,
    intent: "support",
    returnTo: currentPath,
  });
  return `/api/line/auth/start?${params.toString()}`;
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

export default function CanonicalResultSurface({ locale, snapshot, currentPath }: Props) {
  const t = copy[locale];
  const continueHref = lineContinueHref(locale, currentPath);
  const payload = snapshot.payload;
  const renderErrorState = snapshot.renderingState === "invalid_or_missing_payload" || snapshot.renderingState === "version_mismatch_guard";
  const canRenderDeepReport =
    snapshot.renderingState === "deep_report_unlocked" ||
    snapshot.unlockState === "unlock_granted" ||
    snapshot.unlockState === "payment_succeeded" ||
    snapshot.unlockState === "deep_report_available";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(247,244,238,1)_0%,rgba(242,238,229,1)_100%)] px-5 py-8 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-6 py-6 shadow-[0_14px_28px_rgba(47,35,33,0.04)]">
          <div className="service-kicker">{t.label}</div>
          <h1 className="display-serif mt-3 text-[2rem] leading-[1.34] sm:text-[2.5rem]">{payload?.final_locked_label_jp || t.invalidTitle}</h1>
          <p className="mt-3 max-w-4xl text-[15px] leading-8 text-[var(--muted)] sm:text-base">
            {payload?.final_locked_subtitle_jp || (renderErrorState ? t.versionBody : t.subtitle)}
          </p>
          <div className="mt-4 rounded-[1.1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-4 text-sm leading-7 text-[var(--muted)]">
            {t.lockedNotice}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={continueHref}
              className="inline-flex items-center justify-center rounded-[1.2rem] border border-[color:var(--line-sage)] bg-[rgba(255,253,249,0.92)] px-5 py-3 text-sm font-semibold text-[var(--accent-sage-text)] transition hover:bg-white"
            >
              {t.lineContinue}
            </Link>
            <a
              href={locale === "en" ? "/en/support" : "/support"}
              className="inline-flex items-center justify-center rounded-[1.2rem] border border-[color:var(--line-soft)] bg-white/80 px-5 py-3 text-sm text-[var(--muted)] transition hover:bg-white"
            >
              {locale === "en" ? "Back to support" : "相談に戻る"}
            </a>
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--muted)]">{t.lineContinueHint}</p>
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
                  <p className="mt-3 text-sm leading-8 text-[var(--accent-sage-text)]">{payload?.teaser_result.teaser_line_jp || "—"}</p>
                </div>
              )}
            </Panel>

            <Panel title={t.shareCard}>
              <div className="rounded-[1.4rem] border border-[color:var(--line-soft)] bg-white/80 px-5 py-5">
                <p className="text-sm leading-8 text-[var(--muted)]">{payload?.share_card_result.share_card_line_jp || "—"}</p>
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
                  {snapshot.renderingState === "teaser_only" ? t.deepLocked : t.invalidBody}
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
