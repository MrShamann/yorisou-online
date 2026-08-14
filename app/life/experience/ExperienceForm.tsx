"use client";

import Link from "next/link";
import { useState } from "react";
import { EXPERIENCE_PRIVACY } from "@/lib/life-os/privacyCopy";

// OSF-1 — 経験を書く.
//
// Four questions: what happened, what you tried, what came of it, and what you take from it. They
// map onto the EXISTING experience card (lib/server/experienceCards.ts) — situation, action_tried,
// perceived_outcome and the lesson column added by 202608140001 — so this writes to the same table
// the community surface reads. There is no second experience store.
//
// PRIVATE, always, from here. The sharing controls (誰に合う / 合わない / 限界, the preview
// confirmation, the de-identification scan) live on /experiences and are a separate decision a
// person makes deliberately. Offering "share this publicly" as a checkbox at the bottom of a form
// someone opened to write a private note is how private things get published by accident.

const FIELDS = [
  { id: "situation", label: "何が起きましたか", rows: 5, max: 3000, required: true },
  { id: "actionTaken", label: "どうしてみましたか", rows: 5, max: 3000, required: true },
  { id: "outcome", label: "その結果、どうなりましたか", rows: 5, max: 3000, required: true },
  { id: "lesson", label: "そこから何を持ち帰りますか（任意）", rows: 4, max: 1000, required: false },
] as const;

type FieldId = (typeof FIELDS)[number]["id"];

export default function ExperienceForm() {
  const [title, setTitle] = useState("");
  const [values, setValues] = useState<Record<FieldId, string>>({
    situation: "",
    actionTaken: "",
    outcome: "",
    lesson: "",
  });
  const [phase, setPhase] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [failure, setFailure] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const complete =
    title.trim().length > 0 &&
    FIELDS.filter((field) => field.required).every((field) => values[field.id].trim().length > 0);

  async function save() {
    setPhase("saving");
    let response: Response;
    try {
      response = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          situation: values.situation,
          actionTried: values.actionTaken,
          perceivedOutcome: values.outcome,
          lesson: values.lesson.trim() || null,
          visibility: "PRIVATE",
        }),
      });
    } catch {
      setFailure("保存できませんでした。書いた内容はこの画面に残っています。");
      setPhase("failed");
      return;
    }
    if (response.status === 401) {
      setFailure("サインインすると保存できます。");
      setPhase("failed");
      return;
    }
    const payload = (await response.json().catch(() => null)) as { experience?: { id: string }; error?: string } | null;
    if (!response.ok || !payload?.experience) {
      setFailure("保存できませんでした。書いた内容はこの画面に残っています。");
      setPhase("failed");
      return;
    }
    setSavedId(payload.experience.id);
    setPhase("saved");
  }

  if (phase === "saved") {
    return (
      <div>
        <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">経験</p>
        <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
          書きとめました。
        </h1>
        <p className="mt-4 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          この経験が{EXPERIENCE_PRIVACY}共有するかどうかは、あとから決められます。
        </p>
        <Link
          href={`/life/reflect?experience=${encodeURIComponent(savedId ?? "")}`}
          className="mt-7 inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-7 text-[16px] font-semibold text-white"
        >
          この経験を振り返る
        </Link>
        <Link
          href="/life"
          className="mt-4 flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          わたしの記録へ
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">経験</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        やってみたことを、
        <br />
        書きとめておく。
      </h1>
      <p className="mt-3 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        うまくいったかどうかは問いません。あとから見返せるようにしておくためのものです。
      </p>

      <div className="mt-8">
        <label htmlFor="experience-title" className="block text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          みだし
        </label>
        <input
          id="experience-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          className="mt-2 min-h-[var(--pxr-touch-target)] w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 text-[16px] text-[var(--pxr-text-primary)]"
        />
      </div>

      {FIELDS.map((field) => (
        <div key={field.id} className="mt-6">
          <label htmlFor={`experience-${field.id}`} className="block text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            {field.label}
          </label>
          <textarea
            id={`experience-${field.id}`}
            value={values[field.id]}
            onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
            maxLength={field.max}
            rows={field.rows}
            className="mt-2 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => void save()}
        disabled={!complete || phase === "saving"}
        className="mt-7 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-7 text-[16px] font-semibold text-white disabled:opacity-60"
      >
        {phase === "saving" ? "保存しています" : "書きとめる"}
      </button>
      {phase === "failed" && (
        <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{failure}</p>
      )}

      <p className="mt-8 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
        {EXPERIENCE_PRIVACY}
      </p>
    </div>
  );
}
