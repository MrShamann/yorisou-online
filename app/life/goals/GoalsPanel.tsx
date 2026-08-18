"use client";

import { useState } from "react";

import { GOAL_STATUSES, GOAL_STATUS_LABELS, type Goal, type GoalStatus, type MemoryCandidate } from "@/lib/life-os/contract";
import { lifePost, lifePatch, lifeFailureMessage } from "@/lib/life-os/client";
import MemoryConfirmation from "../MemoryConfirmation";

// OSF-1 — 向かいたい方向.
//
// A goal here is a direction someone chose to hold, and the screen is built so it cannot become a
// task list: there is no due date, no progress bar, no completion percentage, no ordering by
// urgency, and no reminder. The approved writing rules prohibit goal-setting language that pressures
// commitment, and every one of those affordances is that pressure wearing a UI.
//
// 「手放した」 sits beside 「届いた」 as an equal outcome. Deciding to stop carrying something is a
// real answer, and a status list that only allowed success would quietly tell people otherwise.

type Props = { initialGoals: Goal[] };

export default function GoalsPanel({ initialGoals }: Props) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<"idle" | "saving" | "failed">("idle");
  const [failure, setFailure] = useState("");
  const [statusFailure, setStatusFailure] = useState<{ id: string; message: string } | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<MemoryCandidate[]>([]);

  async function create() {
    if (title.trim().length === 0 || phase === "saving") return;
    setPhase("saving");
    const result = await lifePost<{ id: string; memoryCandidates: MemoryCandidate[] }>("goals", { title, description });
    if (!result.ok) {
      // THROUGH THE SHARED MESSAGE, not a sentence of its own. This surface used to hardcode
      // 「保存できませんでした。もう一度おためしください。」 — three problems at once: it never said the words
      // were still on screen (they are), it spelled お試し in kana where every other surface uses the
      // kanji, and it answered 「サインインすると保存できます」 and 「いまは保存を受け付けていません」 with the
      // same sentence as a genuine failure. Copy that lives in one place cannot drift from itself.
      setFailure(lifeFailureMessage(result));
      setPhase("failed");
      return;
    }
    const now = new Date().toISOString();
    setGoals((current) => [
      {
        id: result.data.id,
        title: title.trim(),
        description: description.trim() || null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
      ...current,
    ]);
    setCandidates(result.data.memoryCandidates ?? []);
    setTitle("");
    setDescription("");
    setPhase("idle");
  }

  async function changeStatus(goal: Goal, status: GoalStatus) {
    // ONE STATUS CHANGE AT A TIME, and the revert is per-goal rather than a whole-list snapshot.
    //
    // The previous version captured `previous = goals` and restored the entire list on failure. With
    // two changes in flight — active -> 届いた, then immediately -> 手放した — the first request's
    // snapshot still said `active`, so a late failure of the FIRST call reverted the SECOND call's
    // successful change: the screen showed active while the database held 手放した, silently.
    if (pendingStatus) return;
    setPendingStatus(goal.id);
    setStatusFailure(null);
    const before = goal.status;
    setGoals((current) => current.map((item) => (item.id === goal.id ? { ...item, status } : item)));
    const result = await lifePatch("goals", { id: goal.id, status });
    setPendingStatus(null);
    // Put back only THIS goal, to the value it actually had. Leaving the optimistic value would show
    // someone a state their record does not have — and so would restoring a stale snapshot.
    if (!result.ok) {
      setGoals((current) => current.map((item) => (item.id === goal.id ? { ...item, status: before } : item)));
      setStatusFailure({ id: goal.id, message: lifeFailureMessage(result, "change") });
    }
  }

  return (
    <div>
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        向かいたい方向。
      </h1>
      <p className="mt-3 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        達成するためのものではありません。いま大切にしたいことを、言葉にしておくためのものです。
      </p>

      <section className="mt-8">
        <label htmlFor="goal-title" className="block text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          ひとこと
        </label>
        <input
          id="goal-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          className="mt-2 min-h-[var(--pxr-touch-target)] w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 text-[16px] text-[var(--pxr-text-primary)]"
        />

        <label htmlFor="goal-description" className="mt-5 block text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          もう少し書く（任意）
        </label>
        <textarea
          id="goal-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          rows={4}
          className="mt-2 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
        />

        <button
          type="button"
          onClick={() => void create()}
          // `disabled` for "nothing written yet"; in flight is `aria-busy`, so the button the person
          // pressed keeps focus. create() holds the re-entry guard. Same change as ReflectionFlow.
          disabled={title.trim().length === 0}
          aria-busy={phase === "saving"}
          className="mt-4 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-7 text-[16px] font-semibold text-white disabled:opacity-60 aria-[busy=true]:opacity-70"
        >
          {phase === "saving" ? "保存しています" : "書きとめる"}
        </button>
        {phase === "failed" && (
          <p role="alert" className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
            {failure}
          </p>
        )}
      </section>

      <MemoryConfirmation candidates={candidates} />

      {goals.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            いま書いてあるもの
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4"
              >
                <p className="text-[17px] font-medium leading-[1.6] text-[var(--pxr-text-primary)]">{goal.title}</p>
                {goal.description && (
                  <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                    {goal.description}
                  </p>
                )}
                <div className="mt-4">
                  <label
                    htmlFor={`goal-status-${goal.id}`}
                    className="block text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]"
                  >
                    いまの扱い
                  </label>
                  <select
                    id={`goal-status-${goal.id}`}
                    value={goal.status}
                    onChange={(event) => void changeStatus(goal, event.target.value as GoalStatus)}
                    aria-busy={pendingStatus === goal.id}
                    className="mt-2 min-h-[var(--pxr-touch-target)] rounded-[var(--pxr-radius-sm)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-3 text-[15px] text-[var(--pxr-text-primary)]"
                  >
                    {GOAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {GOAL_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  {/* The change had no message at all: a failed status change reverted the select in
                      silence, so someone watched their choice undo itself with no explanation. */}
                  {statusFailure?.id === goal.id && (
                    <p role="alert" className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                      {statusFailure.message}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
