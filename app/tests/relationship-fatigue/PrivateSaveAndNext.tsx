"use client";

import Link from "next/link";
import { useState } from "react";

import type { AnswerMap, ArchetypeId } from "./data";
import { storePendingRFSave } from "./pendingSave";
import { classifySaveFailure, RF_SAVE_FAILURE_COPY, type SaveFailureKind } from "@/lib/yorisou-tests/relationshipFatigue";
import { trackOpenTestingEvent } from "@/app/components/OpenTestingTracker";

const RETURN_PATH = "/tests/relationship-fatigue/return";

type RecommendationItem = {
  id: string;
  reason: string;
  disclosure: string;
  object_type: string;
  yorisou_resources?: {
    title: string;
    description: string;
    resource_type: string;
    source_url?: string;
    internal_route?: string;
    commercial_status?: string;
    limitations: string;
  };
  yorisou_experience_cards?: {
    state_context: string;
    situation: string;
    limitations: string;
  };
};

type RecommendationData = { set: { id: string }; items: RecommendationItem[] };

const FEEDBACK_ACTIONS = [
  ["saved", "保存"],
  ["try_intent", "試してみる"],
  ["helpful", "役に立った"],
  ["not_relevant", "今の自分には合わない"],
] as const;

const SAVE_BENEFITS = [
  "あとから見返して、変化を確かめられる",
  "あなたにだけ表示され、公開されない",
  "いつでも削除できる",
] as const;

function commercialLabel(item: RecommendationItem) {
  if (item.object_type === "experience_card") return "匿名の体験";
  switch (item.yorisou_resources?.commercial_status) {
    case "yorisou_owned":
      return "YORISOUの案内";
    case "public_resource":
      return "公的・公開情報";
    default:
      return "外部の公開情報";
  }
}

export function RelationshipFatiguePrivateSave({
  answers,
  archetypeId,
}: {
  answers: AnswerMap;
  archetypeId: ArchetypeId;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | SaveFailureKind>("idle");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [recState, setRecState] = useState<"idle" | "loading" | "loaded" | "unavailable">("idle");
  const [feedbackDone, setFeedbackDone] = useState<string | null>(null);
  const [returnPlanned, setReturnPlanned] = useState(false);

  async function loadRecommendation(resultId: string, stateTag: string) {
    setRecState("loading");
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateTags: [stateTag],
          source: "saved_result",
          idempotencyKey: `rf:${resultId}`,
        }),
      });
      if (!response.ok) throw new Error("recommendation_failed");
      const data = (await response.json()) as RecommendationData;
      setRecommendation(data);
      setRecState("loaded");
    } catch {
      setRecState("unavailable");
    }
  }

  async function save() {
    setState("saving");
    let status: number | null = null;
    try {
      const response = await fetch("/api/tests/relationship-fatigue/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      status = response.status;
      if (response.status === 401) {
        storePendingRFSave(answers);
        setState("auth_required");
        return;
      }
      if (!response.ok) throw new Error("save_failed");
      const payload = (await response.json()) as { saved: { id: string }; stateTag: string };
      setSavedId(payload.saved.id);
      setState("saved");
      void trackOpenTestingEvent({
        eventName: "result_viewed",
        route: RETURN_PATH,
        source: "relationship-fatigue-save",
        resultId: archetypeId,
      });
      void loadRecommendation(payload.saved.id, payload.stateTag);
    } catch {
      setState(classifySaveFailure(status === null || status === 0 ? null : status));
    }
  }

  async function sendFeedback(itemId: string, action: string) {
    setFeedbackDone(action);
    try {
      await fetch(`/api/recommendations/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, idempotencyKey: crypto.randomUUID() }),
      });
    } catch {
      // Feedback must never block the flow.
    }
  }

  async function planReturn(setId: string) {
    setReturnPlanned(true);
    try {
      await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "return", setId, when: "week" }),
      });
    } catch {
      // Return planning must never block the flow.
    }
  }

  const loginHref = `/login?next=${encodeURIComponent(RETURN_PATH)}`;
  const lineHref = `/api/line/auth/start?locale=ja&intent=login&returnTo=${encodeURIComponent(RETURN_PATH)}`;
  const topItem = recommendation?.items[0] || null;

  return (
    <div className="space-y-5">
      {/* ── Section 4: Private Save (value conversion point) ── */}
      <section id="rf-save" className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-card)] px-5 py-5 shadow-[var(--yorisou-shadow-card)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-50)] px-2.5 py-1 text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            非公開
          </span>
          <p className="text-[14px] font-bold text-[var(--yorisou-color-neutral-800)]">この結果を残す</p>
        </div>
        <ul className="mt-3 space-y-1.5">
          {SAVE_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-[13px] leading-6 text-[var(--yorisou-color-neutral-500)]">
              <span className="mt-[7px] inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--yorisou-color-accent-500)]" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>

        {state === "saved" && savedId ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/saved/tests/${savedId}`}
              className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14px] font-bold text-white no-underline transition hover:bg-[var(--yorisou-color-primary-600)]"
            >
              保存した結果を見る
            </Link>
            <span className="yorisou-success-pop inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--yorisou-color-accent-600)]">
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--yorisou-color-accent-100)]">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              非公開で保存しました
            </span>
          </div>
        ) : state === "auth_required" ? (
          <div className="mt-4 space-y-3">
            <p className="rounded-[var(--yorisou-radius-button)] bg-[var(--yorisou-color-primary-50)] px-4 py-3 text-[13px] leading-6 text-[var(--yorisou-color-primary-700)]">
              {RF_SAVE_FAILURE_COPY.auth_required}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={loginHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14px] font-bold text-white no-underline transition hover:bg-[var(--yorisou-color-primary-600)]"
              >
                ログインして保存する
              </Link>
              <Link
                href={lineHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-5 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline"
              >
                LINEで続ける
              </Link>
            </div>
          </div>
        ) : state === "network_retryable" ? (
          <div className="mt-4 space-y-3">
            <p role="alert" className="rounded-[var(--yorisou-radius-button)] bg-[#FFF4EE] px-4 py-3 text-[13px] leading-6 text-[#8A4B2E]">
              {RF_SAVE_FAILURE_COPY.network_retryable}
            </p>
            <button
              type="button"
              onClick={save}
              className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14px] font-bold text-white transition hover:bg-[var(--yorisou-color-primary-600)]"
            >
              もう一度保存する
            </button>
          </div>
        ) : state === "service_unavailable" ? (
          <p role="alert" className="mt-4 rounded-[var(--yorisou-radius-button)] bg-[var(--yorisou-color-neutral-100)] px-4 py-3 text-[13px] leading-6 text-[var(--yorisou-color-neutral-800)]">
            {RF_SAVE_FAILURE_COPY.service_unavailable}
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              disabled={state === "saving"}
              className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[var(--yorisou-color-primary-600)] disabled:opacity-60"
            >
              {state === "saving" ? "保存しています…" : "この結果を非公開で保存する"}
            </button>
            <Link
              href={lineHref}
              className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-5 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline"
            >
              LINEで続ける
            </Link>
          </div>
        )}
      </section>

      {/* ── Section 4: Governed Recommendation ── */}
      {state === "saved" ? (
        <section className="yorisou-reveal rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-raised)] px-5 py-5 shadow-[var(--yorisou-shadow-card)]">
          <p className="text-[13px] font-bold text-[var(--yorisou-color-neutral-800)]">今の状態に近い、小さな選択肢</p>
          {recState === "loading" ? (
            <p className="mt-2 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]" aria-live="polite">
              整理しています…
            </p>
          ) : recState === "loaded" && topItem ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-[var(--yorisou-radius-button)] border border-[var(--yorisou-color-neutral-100)] bg-white px-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--yorisou-color-primary-100)] text-[var(--yorisou-color-primary-600)]" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {topItem.object_type === "experience_card" ? (
                        <><circle cx="12" cy="8.5" r="3.2" /><path d="M6 19c1-2.8 3.3-4.2 6-4.2s5 1.4 6 4.2" /></>
                      ) : (
                        <path d="M12 4.5 13.8 9.7 19 11.5 13.8 13.3 12 18.5 10.2 13.3 5 11.5 10.2 9.7 12 4.5Z" />
                      )}
                    </svg>
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-100)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">
                      {topItem.object_type === "experience_card" ? "ユーザー体験" : topItem.yorisou_resources?.resource_type || "選択肢"}
                    </span>
                    <span className="inline-flex rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-neutral-100)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--yorisou-color-neutral-500)]">
                      {commercialLabel(topItem)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[15px] font-bold leading-7 text-[var(--yorisou-color-neutral-800)]">
                  {topItem.yorisou_resources?.title || topItem.yorisou_experience_cards?.state_context || "小さな選択肢"}
                </p>
                <p className="mt-1.5 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">
                  {topItem.yorisou_resources?.description || topItem.yorisou_experience_cards?.situation}
                </p>
                <p className="mt-2.5 text-[12px] leading-6 text-[var(--yorisou-color-neutral-500)]">{topItem.reason}</p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--yorisou-color-neutral-500)] opacity-80">{topItem.disclosure}</p>
                {topItem.yorisou_resources?.source_url ? (
                  <a
                    href={topItem.yorisou_resources.source_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sendFeedback(topItem.id, "resource_opened")}
                    className="mt-3 inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-primary-500)] px-4 text-[13px] font-bold text-[var(--yorisou-color-primary-600)] no-underline"
                  >
                    提供元を開く
                  </a>
                ) : topItem.yorisou_resources?.internal_route ? (
                  <Link
                    href={topItem.yorisou_resources.internal_route}
                    onClick={() => sendFeedback(topItem.id, "resource_opened")}
                    className="mt-3 inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-primary-500)] px-4 text-[13px] font-bold text-[var(--yorisou-color-primary-600)] no-underline"
                  >
                    YORISOUで試す
                  </Link>
                ) : null}
              </div>
              {feedbackDone ? (
                <p className="text-[13px] leading-7 text-[var(--yorisou-color-accent-600)]" aria-live="polite">
                  {feedbackDone === "not_relevant"
                    ? "受け取りました。合わないときは、選ばなくて大丈夫です。"
                    : "受け取りました。あなたのペースで大丈夫です。"}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_ACTIONS.map(([action, label]) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => sendFeedback(topItem.id, action)}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold text-[var(--yorisou-color-neutral-800)] transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)] hover:text-[var(--yorisou-color-primary-600)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[12px] leading-6 text-[var(--yorisou-color-neutral-500)] opacity-80">
                候補はここまでです。無理に選ぶ必要はありません。
              </p>
            </div>
          ) : (
            <p className="mt-2 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">
              今は表示できる候補がありませんでした。保存した結果からいつでも見直せます。
            </p>
          )}

          {/* ── Section 5: Return Path ── */}
          <div className="mt-4 border-t border-[var(--yorisou-color-neutral-100)] pt-4">
            <p className="text-[12px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)]">このあとの入口</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {savedId ? (
                <Link
                  href={`/saved/tests/${savedId}`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline"
                >
                  保存した結果を見る
                </Link>
              ) : null}
              {recommendation && !returnPlanned ? (
                <button
                  type="button"
                  onClick={() => planReturn(recommendation.set.id)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold text-[var(--yorisou-color-neutral-800)]"
                >
                  1週間後の変化を記録する
                </button>
              ) : null}
              <Link
                href="/recommendations/graph"
                className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline"
              >
                保存した提案を確認する
              </Link>
            </div>
            {returnPlanned ? (
              <p className="mt-2.5 text-[12px] leading-6 text-[var(--yorisou-color-neutral-500)]" aria-live="polite">
                1週間後にWebから見返せるように記録しました。通知は送りません。
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
