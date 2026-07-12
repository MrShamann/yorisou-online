"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ADJUSTED_REVELATION,
  BASE_REVELATION,
  CORRECTION_OPTIONS,
  SCENARIOS,
  type CorrectionId,
  type Revelation,
  type ScenarioId,
} from "../_lib/hookFixture";

type Stage =
  | "hook"
  | "generating"
  | "revelation"
  | "correction"
  | "experiment"
  | "accepted"
  | "return"
  | "complete";

export default function HookPrototype() {
  const [stage, setStage] = useState<Stage>("hook");
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [rev, setRev] = useState<Revelation | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [adjusted, setAdjusted] = useState(false);
  const [returnChoice, setReturnChoice] = useState<"line" | "here" | "off" | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const generate = useCallback(
    (next: Revelation, readjust = false) => {
      clearTimers();
      setRev(next);
      setAdjusted(readjust);
      setVisibleLines(0);
      setStage("generating");
      next.lines.forEach((_, i) => {
        timers.current.push(window.setTimeout(() => setVisibleLines(i + 1), 500 + i * 700));
      });
      timers.current.push(window.setTimeout(() => setStage("revelation"), 500 + next.lines.length * 700 + 300));
    },
    [clearTimers],
  );

  function chooseScenario(id: ScenarioId) {
    setScenario(id);
    generate(BASE_REVELATION[id]);
  }

  function chooseCorrection(id: CorrectionId) {
    generate(ADJUSTED_REVELATION[id], true);
  }

  function reset() {
    clearTimers();
    setStage("hook");
    setScenario(null);
    setRev(null);
    setVisibleLines(0);
    setAdjusted(false);
    setReturnChoice(null);
  }

  const scenarioText = scenario ? SCENARIOS.find((s) => s.id === scenario)?.text : "";

  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
      <span className="pointer-events-none fixed left-3 top-3 z-50 rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white/85 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)] backdrop-blur">
        INTERACTION PROTOTYPE
      </span>

      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col px-5 pb-8 pt-16">
        {/* ── HOOK ── */}
        {stage === "hook" ? (
          <section className="flex flex-1 flex-col justify-center">
            <p className="text-[12px] font-bold tracking-[0.08em] text-[var(--yorisou-color-primary-600)]">YORISOU</p>
            <h1 className="mt-3 text-[1.7rem] font-bold leading-[1.4]">今、いちばん近いのは？</h1>
            <p className="mt-2 text-[13px] leading-6 text-[var(--yorisou-color-neutral-500)]">近いものを、ひとつ選ぶだけ。</p>
            <div className="mt-6 grid gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => chooseScenario(s.id)}
                  className="group rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-200)] bg-white px-5 py-5 text-left text-[15.5px] font-semibold leading-7 transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)] hover:shadow-[var(--yorisou-shadow-card)] active:scale-[0.99]"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>{s.text}</span>
                    <span aria-hidden="true" className="text-[var(--yorisou-color-neutral-200)] transition group-hover:translate-x-0.5 group-hover:text-[var(--yorisou-color-primary-500)]">
                      →
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-[11.5px] leading-5 text-[var(--yorisou-color-neutral-500)]">
              入力は不要です。選んだ内容は、この画面内だけで扱います。
            </p>
          </section>
        ) : null}

        {/* ── GENERATING / REVELATION / CORRECTION: revelation is the hero ── */}
        {stage === "generating" || stage === "revelation" || stage === "correction" ? (
          <section className="flex flex-1 flex-col justify-center" aria-live="polite">
            {scenarioText ? (
              <p className="mb-6 inline-flex w-fit rounded-[var(--yorisou-radius-pill)] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[var(--yorisou-color-neutral-500)] shadow-[var(--yorisou-shadow-card)]">
                {scenarioText}
              </p>
            ) : null}

            <div className="rounded-[var(--yorisou-radius-hero)] bg-[var(--yorisou-color-deep-900)] px-6 py-8 text-white">
              {adjusted ? (
                <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--yorisou-color-accent-500)]">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13-6M20 12a8 8 0 0 1-13 6M17 3v3.5h-3.5M7 21v-3.5h3.5" /></svg>
                  受け取り方を調整しました
                </p>
              ) : null}
              <div className="text-[1.28rem] font-bold leading-[1.7] md:text-[1.4rem]">
                {rev?.lines.map((line, i) => (
                  <span
                    key={i}
                    className={`block transition-all duration-500 ${i < visibleLines ? "opacity-100 blur-0" : "opacity-0 blur-[6px]"}`}
                  >
                    {line}
                  </span>
                ))}
              </div>
              {stage === "generating" ? (
                <span className="mt-4 inline-block h-4 w-1.5 animate-pulse rounded-full bg-white/60" aria-hidden="true" />
              ) : null}
            </div>

            {stage === "revelation" ? (
              <div className="mt-6">
                <p className="text-[12.5px] font-semibold text-[var(--yorisou-color-neutral-500)]">この見方は、あなたに近いですか？</p>
                <div className="mt-3 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStage("experiment")}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14.5px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[var(--yorisou-color-primary-600)] active:scale-[0.98]"
                  >
                    近い
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage("correction")}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-5 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)]"
                  >
                    少し違う
                  </button>
                </div>
              </div>
            ) : null}

            {stage === "correction" ? (
              <div className="mt-6">
                <p className="text-[12.5px] font-semibold text-[var(--yorisou-color-neutral-500)]">どちらが近いですか？</p>
                <div className="mt-3 grid gap-2.5">
                  {CORRECTION_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => chooseCorrection(c.id)}
                      className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-200)] bg-white px-5 py-4 text-left text-[14.5px] font-semibold transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)] active:scale-[0.99]"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ── EXPERIMENT ── */}
        {stage === "experiment" && rev ? (
          <section className="flex flex-1 flex-col justify-center">
            <p className="text-[12px] font-bold tracking-[0.08em] text-[var(--yorisou-color-primary-600)]">今日の小さな実験</p>
            <h2 className="mt-3 text-[1.5rem] font-bold leading-[1.5]">{rev.experiment}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-100)] px-3 py-1 text-[12px] font-bold text-[var(--yorisou-color-primary-700)]">所要時間 {rev.experimentTime}</span>
            </div>
            <p className="mt-4 text-[13.5px] leading-7 text-[var(--yorisou-color-neutral-500)]">{rev.experimentWhy}</p>
            <div className="mt-7 grid gap-2.5">
              <button
                type="button"
                onClick={() => setStage("accepted")}
                className="inline-flex min-h-[52px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-6 text-[15.5px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[var(--yorisou-color-primary-600)] active:scale-[0.98]"
              >
                やってみる
              </button>
              <button type="button" onClick={reset} className="inline-flex min-h-[44px] items-center justify-center text-[13px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
                今日はやめる
              </button>
            </div>
          </section>
        ) : null}

        {/* ── ACCEPTED (completion feel) ── */}
        {stage === "accepted" && rev ? (
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="yorisou-success-pop flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--yorisou-color-accent-100)]">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="var(--yorisou-color-accent-600)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>
            </div>
            <h2 className="mt-5 text-[1.4rem] font-bold leading-[1.5]">決めました。</h2>
            <p className="mt-2 max-w-[20rem] text-[14px] leading-7 text-[var(--yorisou-color-neutral-500)]">
              「{rev.experiment}」。今日はこれだけで十分です。
            </p>
            <button
              type="button"
              onClick={() => setStage("return")}
              className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-6 text-[14.5px] font-bold text-white transition hover:bg-[var(--yorisou-color-primary-600)]"
            >
              次へ
            </button>
          </section>
        ) : null}

        {/* ── RETURN HOOK ── */}
        {stage === "return" && rev ? (
          <section className="flex flex-1 flex-col justify-center">
            <h2 className="text-[1.4rem] font-bold leading-[1.5]">
              明日、{rev.returnCheck}を
              <br />
              10秒だけ確認しますか？
            </h2>
            <p className="mt-2 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">
              あなたが選んだときだけ届きます。自動では送りません。いつでも止められます。
            </p>
            <div className="mt-6 grid gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setReturnChoice("line");
                  setStage("complete");
                }}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[var(--yorisou-radius-pill)] bg-[#06C755] px-5 text-[14.5px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[#05B34C] active:scale-[0.99]"
              >
                <span className="inline-flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white text-[10px] font-black text-[#06C755]" aria-hidden="true">L</span>
                LINEで受け取る
              </button>
              <button
                type="button"
                onClick={() => {
                  setReturnChoice("here");
                  setStage("complete");
                }}
                className="inline-flex min-h-[50px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-primary-500)] bg-white px-5 text-[14px] font-bold text-[var(--yorisou-color-primary-600)]"
              >
                明日ここで見る
              </button>
              <button
                type="button"
                onClick={() => {
                  setReturnChoice("off");
                  setStage("complete");
                }}
                className="inline-flex min-h-[44px] items-center justify-center text-[13px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline"
              >
                今は設定しない
              </button>
            </div>
          </section>
        ) : null}

        {/* ── COMPLETE ── */}
        {stage === "complete" ? (
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-[12px] font-bold tracking-[0.08em] text-[var(--yorisou-color-accent-600)]">また明日</p>
            <h2 className="mt-3 text-[1.35rem] font-bold leading-[1.5]">
              {returnChoice === "line"
                ? "明日、LINEでそっと聞きますね。"
                : returnChoice === "here"
                  ? "明日、ここで待っています。"
                  : "いつでも、戻ってこられます。"}
            </h2>
            <p className="mt-3 max-w-[19rem] text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">
              今日は、ひとつ実験を決められました。それで十分です。
            </p>
            <button type="button" onClick={reset} className="mt-7 text-[13px] font-bold text-[var(--yorisou-color-primary-600)] underline-offset-2 hover:underline">
              もう一度ためす
            </button>
          </section>
        ) : null}
      </div>
    </main>
  );
}
