"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { GuidedExperience } from "@/app/data/sr1/guidedExperiences";
import {
  markTriedItem,
  recordFeedback,
  toggleSavedItem,
  type GuestFeedbackSignal,
} from "@/lib/sr1/guestJourney";
import { useGuestJourney } from "@/lib/sr1/useGuestJourney";

type Phase = "intro" | "steps" | "done";

const feedbackChipClass =
  "rounded-full border border-[var(--hair-2)] px-4 py-2 text-[13px] font-semibold text-[color:var(--tx)] transition-colors hover:border-[var(--hair-jade)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)] aria-pressed:border-[var(--hair-jade)] aria-pressed:bg-[rgba(126,224,182,0.10)] aria-pressed:text-[color:var(--jade-bright)]";

export default function GuidedExperienceRunner({ experience }: { experience: GuidedExperience }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  // Free-text stays in component state ONLY and is NEVER persisted — the
  // device-local journey stores no free text (public-safe by construction).
  const [note, setNote] = useState("");

  const journey = useGuestJourney();
  const saved = journey.savedItemIds.includes(experience.slug);
  const tried = journey.triedItemIds.includes(experience.slug);

  const total = experience.steps.length;
  const step = experience.steps[stepIndex];

  // Move keyboard focus to the heading of the newly shown phase/step so screen
  // reader and keyboard users follow along without relying on motion.
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [phase, stepIndex]);

  function hasFeedback(signal: GuestFeedbackSignal): boolean {
    return journey.feedback.some((f) => f.itemId === experience.slug && f.signal === signal);
  }

  function giveFeedback(signal: Exclude<GuestFeedbackSignal, "saved" | "hide">) {
    if (!hasFeedback(signal)) recordFeedback({ itemId: experience.slug, signal });
  }

  function onTried() {
    if (!tried) markTriedItem(experience.slug);
    giveFeedback("tried");
  }

  function begin() {
    setStepIndex(0);
    setPhase("steps");
  }

  function goNext() {
    if (stepIndex >= total - 1) {
      setPhase("done");
    } else {
      setStepIndex((i) => Math.min(i + 1, total - 1));
    }
  }

  function goBack() {
    if (stepIndex <= 0) {
      setPhase("intro");
    } else {
      setStepIndex((i) => Math.max(i - 1, 0));
    }
  }

  return (
    <main className="aix2">
      <div className="container py-10 md:py-16 max-w-[42rem] mx-auto">
        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="aix2-eyebrow">ガイド体験 · 振り返り</p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="aix2-serif text-[2rem] leading-[1.2] text-[color:var(--tx)] outline-none md:text-[2.4rem]"
              >
                {experience.title}
              </h1>
              <p className="text-[15px] leading-8 aix2-mut">{experience.purpose}</p>
            </div>

            <div className="aix2-panel p-6 space-y-4">
              <div className="space-y-1.5">
                <p className="aix2-eyebrow">こんなときに</p>
                <p className="text-[14px] leading-8 text-[color:var(--tx)]">{experience.whoItHelps}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold tracking-[0.08em] aix2-faint">目安の時間</p>
                  <p className="text-[14px] text-[color:var(--tx)]">{experience.estimatedTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold tracking-[0.08em] aix2-faint">はじめる前に</p>
                  <p className="text-[14px] leading-7 text-[color:var(--tx)]">{experience.preparation}</p>
                </div>
              </div>
            </div>

            <div className="aix2-glass p-6">
              <p className="text-[13px] leading-7 aix2-faint">{experience.boundary}</p>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <button type="button" onClick={begin} className="aix2-btn aix2-btn-primary !min-h-[50px] !text-[15px]">
                はじめる
              </button>
              <Link href="/start" className="aix2-link self-center">
                他の入口を見る →
              </Link>
            </div>
          </div>
        )}

        {/* ── STEPS ── */}
        {phase === "steps" && step && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <p className="aix2-eyebrow">{experience.title}</p>
              <p className="text-[13px] font-semibold aix2-faint" aria-live="polite">
                {stepIndex + 1} / {total}
              </p>
            </div>

            <div className="aix2-panel aix2-panel--now p-6 space-y-4 md:p-7">
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="aix2-serif text-[1.5rem] leading-[1.3] text-[color:var(--tx)] outline-none md:text-[1.85rem]"
              >
                {step.prompt}
              </h2>
              <p className="text-[14.5px] leading-8 aix2-mut">{step.guidance}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="aix2-btn aix2-btn-ghost !min-h-[48px] !text-[14px]"
              >
                戻る
              </button>
              <button
                type="button"
                onClick={goNext}
                className="aix2-btn aix2-btn-primary flex-1 !min-h-[48px] !text-[15px]"
              >
                {stepIndex >= total - 1 ? "おえる" : "次へ"}
              </button>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {phase === "done" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="aix2-eyebrow">おつかれさまでした</p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="aix2-serif text-[1.9rem] leading-[1.24] text-[color:var(--tx)] outline-none md:text-[2.2rem]"
              >
                {experience.completion}
              </h1>
            </div>

            <div className="aix2-glass p-6 space-y-3">
              <p className="aix2-eyebrow">ふりかえり</p>
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">{experience.reflection}</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="思ったことを、自由に書いてみても構いません。"
                className="mt-1 w-full rounded-[14px] border border-[var(--hair-2)] bg-[rgba(20,24,22,0.4)] px-4 py-3 text-[14px] leading-7 text-[color:var(--tx)] placeholder:text-[color:var(--tx-faint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)]"
              />
              <p className="text-[12px] leading-6 aix2-faint">
                このメモは自分用です。この端末にも保存されず、画面を離れると消えます。
              </p>
            </div>

            {/* Feedback — coarse signals only, no free text is ever stored */}
            <div className="aix2-panel p-6 space-y-4">
              <p className="aix2-eyebrow">この体験は、どうでしたか</p>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={onTried} aria-pressed={tried} className={feedbackChipClass}>
                  {tried ? "試した ✓" : "試した"}
                </button>
                <button
                  type="button"
                  onClick={() => giveFeedback("useful")}
                  aria-pressed={hasFeedback("useful")}
                  className={feedbackChipClass}
                >
                  {hasFeedback("useful") ? "役に立った ✓" : "役に立った"}
                </button>
                <button
                  type="button"
                  onClick={() => giveFeedback("not_now")}
                  aria-pressed={hasFeedback("not_now")}
                  className={feedbackChipClass}
                >
                  {hasFeedback("not_now") ? "今は違う ✓" : "今は違う"}
                </button>
              </div>

              <div className="aix2-hair-top pt-4 space-y-2">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={saved}
                    onChange={() => toggleSavedItem(experience.slug)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--jade-bright)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--jade-bright)]"
                  />
                  <span className="space-y-0.5">
                    <span className="block text-[14px] font-semibold text-[color:var(--tx)]">
                      {saved ? "この端末に残しています" : "この端末に残す"}
                    </span>
                    <span className="block text-[12.5px] leading-6 aix2-faint">
                      この端末にのみ保存されます。いつでも外せます。
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/my-yorisou" className="aix2-btn aix2-btn-primary !min-h-[48px] !text-[14px]">
                マイよりそうへ
              </Link>
              <button
                type="button"
                onClick={begin}
                className="aix2-btn aix2-btn-ghost !min-h-[48px] !text-[14px]"
              >
                もう一度やってみる
              </button>
              <Link href="/start" className="aix2-link self-center">
                他の入口を見る →
              </Link>
            </div>

            <div className="aix2-glass p-6">
              <p className="text-[13px] leading-7 aix2-faint">{experience.boundary}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
