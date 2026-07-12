"use client";

import Link from "next/link";
import { useState } from "react";

import type { AnswerMap, ArchetypeId } from "./data";
import { storePendingRFSave } from "./pendingSave";
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

export function RelationshipFatiguePrivateSave({
  answers,
  archetypeId,
}: {
  answers: AnswerMap;
  archetypeId: ArchetypeId;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "login" | "error">("idle");
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
    try {
      const response = await fetch("/api/tests/relationship-fatigue/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (response.status === 401) {
        storePendingRFSave(answers);
        setState("login");
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
      setState("error");
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
      {/* Private save */}
      <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
        <p className="text-[13px] font-semibold text-[#315F50]">この結果を非公開で残す</p>
        <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
          保存した結果はあなたにだけ表示されます。あとから見返して、変化をゆっくり確かめられます。
        </p>
        {state === "saved" && savedId ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/saved/tests/${savedId}`}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
            >
              保存した結果を見る
            </Link>
          </div>
        ) : state === "login" ? (
          <div className="mt-4 space-y-2.5">
            <p className="text-[12px] leading-6 text-[#7A7068]">
              結果はこの画面に残っています。ログインすると、そのまま自動で保存されます。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={loginHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
              >
                ログインして保存する
              </Link>
              <Link
                href={lineHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
              >
                LINEでログイン
              </Link>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={save}
            disabled={state === "saving"}
            className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {state === "saving" ? "保存しています" : "この結果を保存する"}
          </button>
        )}
        {state === "error" ? (
          <p role="alert" className="mt-3 text-[13px] text-[#9b3a34]">
            保存できませんでした。時間をおいてもう一度お試しください。
          </p>
        ) : null}
      </section>

      {/* One governed recommendation */}
      {state === "saved" ? (
        <section className="rounded-[1.25rem] border border-[rgba(105,151,130,0.18)] bg-[#F7FBF8] px-5 py-5">
          <p className="text-[13px] font-semibold text-[#315F50]">今の状態に近い、小さな選択肢</p>
          {recState === "loading" ? (
            <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">候補を整理しています。</p>
          ) : recState === "loaded" && topItem ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-white px-4 py-4">
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#49615B]">
                  {topItem.object_type === "experience_card"
                    ? "匿名で共有された体験"
                    : topItem.yorisou_resources?.resource_type || "選択肢"}
                </p>
                <p className="mt-1.5 text-[15px] font-semibold leading-7 text-[#2F2A28]">
                  {topItem.yorisou_resources?.title || topItem.yorisou_experience_cards?.state_context || "小さな選択肢"}
                </p>
                <p className="mt-1.5 text-[13px] leading-7 text-[#5F5750]">
                  {topItem.yorisou_resources?.description || topItem.yorisou_experience_cards?.situation}
                </p>
                <p className="mt-2.5 text-[12px] leading-6 text-[#7A7068]">{topItem.reason}</p>
                <p className="mt-1 text-[11px] leading-6 text-[#9A918B]">{topItem.disclosure}</p>
              </div>
              {feedbackDone ? (
                <p className="text-[13px] leading-7 text-[#315F50]">
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
                      className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[12px] leading-6 text-[#9A918B]">
                候補はここまでです。無理に選ぶ必要はありません。
              </p>
            </div>
          ) : (
            <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">
              今は表示できる候補がありませんでした。保存した結果からいつでも見直せます。
            </p>
          )}

          {/* Return reason */}
          <div className="mt-4 border-t border-[rgba(23,59,53,0.08)] pt-4">
            <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">このあとの入口</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {recommendation && !returnPlanned ? (
                <button
                  type="button"
                  onClick={() => planReturn(recommendation.set.id)}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[13px] font-semibold text-[#315F50]"
                >
                  1週間後の変化を記録する
                </button>
              ) : null}
              <Link
                href="/recommendations/graph"
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[13px] font-semibold text-[#315F50]"
              >
                保存した提案を確認する
              </Link>
            </div>
            {returnPlanned ? (
              <p className="mt-2.5 text-[12px] leading-6 text-[#7A7068]">
                1週間後にWebから見返せるように記録しました。通知は送りません。
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
