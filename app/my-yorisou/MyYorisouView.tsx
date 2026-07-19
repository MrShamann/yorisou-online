"use client";

import { useSyncExternalStore } from "react";

import Link from "next/link";

import { getServiceItem, type ServiceItem } from "@/app/data/sr1/serviceCatalogue";
import {
  clearSavedResultRecord,
  readSavedResultRecord,
  subscribeSavedResult,
  type SavedResultRecord,
} from "@/app/result/saveState";
import {
  clearGuestJourney,
  hideItem,
  PERSISTENCE_SCOPE_LABEL,
  resetAdaptationSignals,
  toggleSavedItem,
  type GuestJourneyState,
} from "@/lib/sr1/guestJourney";
import { useGuestJourney } from "@/lib/sr1/useGuestJourney";
import { routeService, SERVICE_NEEDS } from "@/lib/sr1/serviceRouter";
import { buildSupportPlan, type SupportPlanFamily } from "@/lib/sr1/supportPlan";
import { topAdaptedItems, type AdaptedItem } from "@/lib/app2/adaptation";

// --- device-local helpers (public-safe, no PII, no raw answers) ---------------

// Truthful relative recency. Never fabricates a time; falls back to a soft line
// when the stored timestamp is missing or unparseable.
function relativeRecency(iso?: string): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const diffMs = Date.now() - then;
  if (diffMs < 0) return "さきほど";
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

// Matches hasGuestJourney() semantics, but derived from the reactive snapshot so
// the surface updates live and stays SSR-safe (server snapshot is the empty
// journey, so this is false during SSR and re-evaluates after mount).
function journeyHasContent(j: GuestJourneyState): boolean {
  return Boolean(
    j.updatedAt &&
      (j.need || j.routedTo || j.lastResult || j.savedItemIds.length || j.triedItemIds.length || j.feedback.length),
  );
}

const PACE_LABEL: Record<NonNullable<GuestJourneyState["pace"]>, string> = {
  quick: "軽やかなペースで",
  deep: "じっくりのペースで",
};

// A single, normalized "next step" shape shared by the two truthful sources.
type NextStep = { title: string; why: string; estimatedTime: string; href: string; prototype: boolean };

const chipClass =
  "inline-flex items-center rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] text-[color:var(--jade-bright)]";

const destructiveClass =
  "text-[12.5px] text-[#f2896c] underline underline-offset-4 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2896c]";

export default function MyYorisouView() {
  const journey = useGuestJourney();
  const savedRecord = useSyncExternalStore<SavedResultRecord | null>(
    subscribeSavedResult,
    readSavedResultRecord,
    () => null,
  );

  const hasContent = journeyHasContent(journey);
  const isEmpty = !hasContent && !savedRecord;

  // Section 1 — current state (saved record first, then journey.lastResult).
  const currentState = savedRecord
    ? {
        label: savedRecord.resultLabel,
        recognitionLine: savedRecord.recognitionLine,
        savedAt: savedRecord.savedAt,
        resultPath: savedRecord.resultPath,
      }
    : journey.lastResult
      ? {
          label: journey.lastResult.label,
          recognitionLine: undefined as string | undefined,
          savedAt: journey.lastResult.savedAt,
          resultPath: journey.lastResult.resultPath,
        }
      : null;

  // Section 2 — what matters now (chosen need + pace).
  const need = journey.need ? SERVICE_NEEDS.find((n) => n.id === journey.need) : undefined;

  // Section 3 — exactly one next step. Prefer the result-derived support plan.
  let nextStep: NextStep | null = null;
  if (journey.lastResult) {
    const plan = buildSupportPlan({
      family: journey.lastResult.family as SupportPlanFamily,
      resultLabel: journey.lastResult.label,
      resultPath: journey.lastResult.resultPath,
    });
    const item = plan.whatMayHelpNow;
    nextStep = {
      title: item.title,
      why: item.why,
      estimatedTime: item.estimatedTime,
      href: item.href,
      prototype: item.status === "prototype",
    };
  } else if (journey.need) {
    const primary = routeService({ need: journey.need, pace: journey.pace, returning: true }).primary;
    nextStep = {
      title: primary.title,
      why: primary.why,
      estimatedTime: primary.estimatedTime,
      href: primary.href,
      prototype: primary.status === "prototype",
    };
  }

  // Section 4 — continue browsing, now personally adapted (APP-2 WS-B). The
  // ordering is a pure, deterministic function of this device's own journey
  // signals; every card states WHY it is here and can be hidden or reset.
  const adapted = topAdaptedItems(
    {
      need: journey.need,
      latestResultFamily: journey.lastResult?.family,
      savedItemIds: journey.savedItemIds,
      triedItemIds: journey.triedItemIds,
      hiddenItemIds: journey.hiddenItemIds,
      feedback: journey.feedback,
      pace: journey.pace,
      returning: journey.returning || Boolean(journey.lastResult),
    },
    4,
  );
  const adaptationActive =
    Boolean(journey.need || journey.lastResult) ||
    journey.savedItemIds.length > 0 ||
    journey.triedItemIds.length > 0 ||
    journey.hiddenItemIds.length > 0 ||
    journey.feedback.length > 0;

  // Section 5 — saved / tried resume list.
  const savedTriedIds = Array.from(new Set([...journey.savedItemIds, ...journey.triedItemIds]));
  const savedTried = savedTriedIds
    .map((id) => {
      const item = getServiceItem(id);
      if (!item) return null;
      return { item, saved: journey.savedItemIds.includes(id), tried: journey.triedItemIds.includes(id) };
    })
    .filter((x): x is { item: ServiceItem; saved: boolean; tried: boolean } => Boolean(x));

  const clearEverything = () => {
    if (typeof window === "undefined") return;
    if (window.confirm("この端末に残した記録をすべて削除しますか？（この操作は取り消せません）")) {
      clearGuestJourney();
      clearSavedResultRecord();
    }
  };

  // --- Empty state: brand-new device, never a dead end ------------------------
  if (isEmpty) {
    return (
      <main className="aix2">
        <div className="container py-10 md:py-16">
          <div className="mx-auto max-w-[46rem]">
            <p className="aix2-eyebrow">マイよりそう · Personal Home</p>
            <h1 className="aix2-serif mt-3 text-[2rem] leading-[1.2] text-[color:var(--tx)]">
              あなたの、続けられる場所。
            </h1>
            <div className="aix2-panel mt-7 p-6 space-y-4">
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">
                マイよりそうは、今の状態・次の一歩・保存したものを、あなたのペースで見返せる場所になります。
              </p>
              <p className="text-[14px] leading-8 aix2-mut">
                ログインは要りません。記録はこの端末だけに残り、いつでも削除できます。まずは、今の自分から始めてみませんか。
              </p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Link href="/start" className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">
                  今の自分から始める
                </Link>
                <Link href="/privacy" className="aix2-link self-center">
                  記録の扱いを見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="aix2">
      <div className="container py-10 md:py-16">
        <div className="mx-auto max-w-[46rem]">
          <p className="aix2-eyebrow">マイよりそう · Personal Home</p>
          <h1 className="aix2-serif mt-3 text-[2rem] leading-[1.2] text-[color:var(--tx)]">
            続きから、あなたのペースで。
          </h1>
          <p className="mt-4 text-[14px] leading-8 aix2-mut">
            この端末に残っている範囲だけを表示しています。ログインなしで、いつでも見返し・削除できます。
          </p>

          {/* Section 1 — 今の状態 */}
          <section className="mt-9" aria-labelledby="my-now">
            <p id="my-now" className="aix2-eyebrow">
              今の状態
            </p>
            {currentState ? (
              <div className="aix2-glass mt-3 p-6 space-y-4">
                {currentState.label ? (
                  <h2 className="aix2-serif text-[1.7rem] leading-[1.2] text-[color:var(--tx)]">{currentState.label}</h2>
                ) : (
                  <h2 className="aix2-serif text-[1.5rem] leading-[1.25] text-[color:var(--tx)]">
                    前回の状態が残っています。
                  </h2>
                )}
                {currentState.recognitionLine ? (
                  <p className="text-[15px] leading-8 aix2-mut">{currentState.recognitionLine}</p>
                ) : null}
                {relativeRecency(currentState.savedAt) ? (
                  <p className="text-[13px] leading-7 aix2-faint">最後に見たのは {relativeRecency(currentState.savedAt)}</p>
                ) : null}
                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                  {currentState.resultPath ? (
                    <Link
                      href={currentState.resultPath}
                      className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]"
                    >
                      結果をもう一度みる
                    </Link>
                  ) : null}
                  <Link href="/start" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]">
                    もう一度チェックする
                  </Link>
                </div>
              </div>
            ) : (
              <div className="aix2-panel mt-3 p-6 space-y-3">
                <p className="text-[15px] leading-8 text-[color:var(--tx)]">
                  今はまだ、結果は残っていません。準備ができたら、いつでも今の状態からはじめられます。
                </p>
                <Link href="/start" className="aix2-link">
                  今の状態をチェックする →
                </Link>
              </div>
            )}
          </section>

          {/* Section 2 — 今、大事にしていること */}
          {need ? (
            <section className="mt-9" aria-labelledby="my-need">
              <p id="my-need" className="aix2-eyebrow">
                今、大事にしていること
              </p>
              <div className="aix2-panel mt-3 p-6 space-y-3">
                <p className="text-[16px] font-bold text-[color:var(--tx)]">{need.label}</p>
                <p className="text-[13.5px] leading-7 aix2-mut">{need.helper}</p>
                {journey.pace ? <span className={chipClass}>{PACE_LABEL[journey.pace]}</span> : null}
              </div>
            </section>
          ) : null}

          {/* Section 3 — 次の一歩（ひとつだけ） */}
          {nextStep ? (
            <section className="mt-9" aria-labelledby="my-next">
              <p id="my-next" className="aix2-eyebrow">
                次の一歩
              </p>
              <div className="aix2-panel aix2-panel--now mt-3 p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[color:var(--tx)]">{nextStep.title}</h2>
                  {nextStep.prototype ? <span className={chipClass}>プロトタイプ</span> : null}
                </div>
                <p className="text-[14px] leading-8 aix2-mut">{nextStep.why}</p>
                <p className="text-[12.5px] leading-7 aix2-faint">目安: {nextStep.estimatedTime}</p>
                <div className="pt-1">
                  <Link href={nextStep.href} className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">
                    この一歩を見る
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          {/* Section 4 — 続けて見る（あなたに合わせて並べています / WS-B） */}
          {adapted.length ? (
            <section className="mt-9" aria-labelledby="my-continue">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p id="my-continue" className="aix2-eyebrow">
                  続けて見る
                </p>
                {adaptationActive ? (
                  <button
                    type="button"
                    onClick={() => resetAdaptationSignals()}
                    className="rounded-full border border-[var(--hair-2)] px-3 py-1.5 text-[11.5px] aix2-mut transition-colors hover:border-[var(--hair-jade)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)]"
                  >
                    並び順をリセット
                  </button>
                ) : null}
              </div>
              <p className="mt-2 text-[12.5px] leading-7 aix2-faint">
                {adaptationActive
                  ? "この端末に残った、あなた自身の記録だけをもとに並べています。各項目に理由を表示しています。"
                  : "まずは基本の順に表示しています。使うほど、あなたに合わせて並び替わります。"}
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {adapted.map(({ item, state, primaryReason, reasons }: AdaptedItem) => {
                  const saved = journey.savedItemIds.includes(item.id);
                  return (
                    <div key={item.id} className="aix2-panel p-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15.5px] font-bold text-[color:var(--tx)]">{item.title}</p>
                        {state === "done" ? <span className={chipClass}>試した</span> : null}
                        {item.availability === "prototype" ? <span className={chipClass}>プロトタイプ</span> : null}
                      </div>
                      {/* Explainability: why this card is placed here (WS-B §6.1). */}
                      <p className="text-[12px] leading-6 text-[color:var(--jade-bright)]">
                        なぜ表示: {primaryReason}
                        {reasons.length > 1 ? `（ほか${reasons.length - 1}件）` : ""}
                      </p>
                      <p className="text-[13px] leading-7 aix2-mut">{item.whyMayFit}</p>
                      <p className="text-[12px] leading-6 aix2-faint">目安: {item.estimatedTime}</p>
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <Link href={item.href} className="aix2-link">
                          {state === "done" ? "もう一度見る →" : "見てみる →"}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSavedItem(item.id)}
                          aria-pressed={saved}
                          className="rounded-full border border-[var(--hair-2)] px-3 py-1.5 text-[12px] text-[color:var(--tx)] transition-colors hover:border-[var(--hair-jade)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)]"
                        >
                          {saved ? "保存済み" : "保存"}
                        </button>
                        <button
                          type="button"
                          onClick={() => hideItem(item.id)}
                          className="text-[12px] aix2-faint underline underline-offset-4 rounded-sm transition-colors hover:text-[color:var(--tx)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)]"
                        >
                          今は非表示
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : adaptationActive ? (
            <section className="mt-9" aria-labelledby="my-continue">
              <p id="my-continue" className="aix2-eyebrow">
                続けて見る
              </p>
              <div className="aix2-panel mt-3 p-6 space-y-3">
                <p className="text-[14px] leading-8 aix2-mut">
                  今は表示できる候補がありません。非表示や「今は違う」で絞り込みすぎたときは、並び順をリセットできます。
                </p>
                <button
                  type="button"
                  onClick={() => resetAdaptationSignals()}
                  className="aix2-link text-left"
                >
                  並び順をリセットする →
                </button>
              </div>
            </section>
          ) : null}

          {/* Section 5 — 保存・試したもの */}
          <section className="mt-9" aria-labelledby="my-saved">
            <p id="my-saved" className="aix2-eyebrow">
              保存・試したもの
            </p>
            {savedTried.length ? (
              <ul className="mt-3 space-y-3">
                {savedTried.map(({ item, saved, tried }) => (
                  <li key={item.id} className="aix2-panel p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-bold text-[color:var(--tx)]">{item.title}</p>
                          {saved ? <span className={chipClass}>保存済み</span> : null}
                          {tried ? <span className={chipClass}>試した</span> : null}
                        </div>
                        <p className="text-[12.5px] leading-6 aix2-faint">目安: {item.estimatedTime}</p>
                      </div>
                      <Link href={item.href} className="aix2-link">
                        続きを見る →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="aix2-panel mt-3 p-6">
                <p className="text-[14px] leading-8 aix2-mut">
                  まだ保存・試したものはありません。気になるものが見つかったら、ここに残せます。
                </p>
              </div>
            )}
          </section>

          {/* Section 6 — 続けかたと、コントロール */}
          <section className="mt-9" aria-labelledby="my-controls">
            <p id="my-controls" className="aix2-eyebrow">
              続けかたと、コントロール
            </p>
            <div className="aix2-glass mt-3 p-6 space-y-5">
              <div className="space-y-1.5">
                <p className="text-[15px] font-bold text-[color:var(--tx)]">この端末で続ける</p>
                <p className="text-[13.5px] leading-7 aix2-mut">{PERSISTENCE_SCOPE_LABEL.device}</p>
              </div>
              <p className="text-[13px] leading-7 aix2-faint">
                ログインやLINE連携は任意です。この端末の記録はそのまま残ります。
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link href="/privacy" className="aix2-link">
                  記録の扱いを見る →
                </Link>
                <Link href="/support" className="aix2-link">
                  困ったときは →
                </Link>
              </div>
              <div className="aix2-hair-top pt-4">
                <button type="button" onClick={clearEverything} className={destructiveClass}>
                  この端末の記録を削除する
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
