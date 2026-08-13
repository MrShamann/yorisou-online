"use client";

import { useState } from "react";

import { GOAL_STATUSES, GOAL_STATUS_LABELS, type Goal, type GoalStatus, type MemoryCandidate } from "@/lib/life-os/contract";
import { lifeOsPost } from "@/lib/life-os/client";
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
  const [candidates, setCandidates] = useState<MemoryCandidate[]>([]);

  async function create() {
    if (title.trim().length === 0) return;
    setPhase("saving");
    const result = await lifeOsPost<{ id: string; memoryCandidates: MemoryCandidate[] }>({
      action: "create_goal",
      goal: { title, description },
    });
    if (!result.ok) {
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
    const previous = goals;
    setGoals((current) => current.map((item) => (item.id === goal.id ? { ...item, status } : item)));
    const result = await lifeOsPost({ action: "set_goal_status", id: goal.id, status });
    // Put it back if the server disagreed. Leaving the optimistic value would show someone a state
    // their record does not have.
    if (!result.ok) setGoals(previous);
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
          disabled={title.trim().length === 0 || phase === "saving"}
          className="mt-4 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-7 text-[16px] font-semibold text-white disabled:opacity-60"
        >
          {phase === "saving" ? "保存しています" : "書きとめる"}
        </button>
        {phase === "failed" && (
          <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
            保存できませんでした。もう一度おためしください。
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
                    className="mt-2 min-h-[var(--pxr-touch-target)] rounded-[var(--pxr-radius-sm)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-3 text-[15px] text-[var(--pxr-text-primary)]"
                  >
                    {GOAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {GOAL_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
