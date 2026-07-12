"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ProtoShell from "../_lib/ProtoShell";
import { YorisouSymbol } from "@/app/components/YorisouLogo";
import { FEED_ITEMS, FEED_TYPE_META, MOOD_CHOICES, MOOD_RESULTS, type MoodId } from "../_lib/fixtures";

type LoopPhase = "idle" | "listening" | "organizing" | "ready" | "saved";
const STORE_KEY = "yorisou.prototype.today-state.v1";

type StoredState = { mood: MoodId; savedAt: number };

export default function PrototypeHome() {
  const [phase, setPhase] = useState<LoopPhase>("idle");
  const [mood, setMood] = useState<MoodId | null>(null);
  const [revealStep, setRevealStep] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const timers = useRef<number[]>([]);

  // Restore a previously saved Today State (continuity across tabs/returns).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredState;
        queueMicrotask(() => {
          setMood(stored.mood);
          setPhase("saved");
          setRevealStep(3);
        });
      }
    } catch {
      /* fixture only */
    }
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  function startLoop(selected: MoodId) {
    setMood(selected);
    setPhase("listening");
    setRevealStep(0);
    const t1 = window.setTimeout(() => setPhase("organizing"), 650);
    const t2 = window.setTimeout(() => {
      setPhase("ready");
      setRevealStep(1);
    }, 1650);
    const t3 = window.setTimeout(() => setRevealStep(2), 2150);
    const t4 = window.setTimeout(() => setRevealStep(3), 2650);
    timers.current.push(t1, t2, t3, t4);
  }

  function saveState() {
    if (!mood) return;
    setPhase("saved");
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify({ mood, savedAt: Date.now() } satisfies StoredState));
    } catch {
      /* fixture only */
    }
  }

  function resetLoop() {
    try {
      window.sessionStorage.removeItem(STORE_KEY);
    } catch {
      /* fixture only */
    }
    setMood(null);
    setPhase("idle");
    setRevealStep(0);
  }

  const result = mood ? MOOD_RESULTS[mood] : null;
  const feedPreview = FEED_ITEMS.slice(0, 3);

  return (
    <ProtoShell title="YORISOU">
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        {/* ── Today State ── */}
        <section
          aria-live="polite"
          className="yorisou-glow-field rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-white p-5 shadow-[var(--yorisou-shadow-card)]"
        >
          {phase === "idle" ? (
            <>
              <p className="text-[13px] font-bold text-[var(--yorisou-color-neutral-500)]">こんばんは。</p>
              <h1 className="mt-1 text-[1.35rem] font-bold leading-[1.4]">いま、どれに近いですか？</h1>
              <div className="mt-4 grid gap-2.5">
                {MOOD_CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => startLoop(choice.id)}
                    className="flex items-center justify-between rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-raised)] px-4 py-3.5 text-left transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)] active:scale-[0.99]"
                  >
                    <span>
                      <span className="block text-[15px] font-bold">{choice.label}</span>
                      <span className="mt-0.5 block text-[12px] text-[var(--yorisou-color-neutral-500)]">{choice.hint}</span>
                    </span>
                    <span aria-hidden="true" className="text-[var(--yorisou-color-primary-500)]">→</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] text-[var(--yorisou-color-neutral-500)]">
                10秒で終わります。ログインなし・保存するかはあとで選べます。
              </p>
            </>
          ) : phase === "listening" || phase === "organizing" ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 py-6">
              <div className="yorisou-orb flex h-[88px] w-[88px] items-center justify-center">
                <YorisouSymbol variant="white" size={40} breathing />
              </div>
              <p className="text-[14px] font-semibold text-[var(--yorisou-color-primary-700)]" aria-live="assertive">
                {phase === "listening" ? "聞いています…" : "整理しています…"}
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                      (phase === "organizing" ? 2 : 1) > i ? "bg-[var(--yorisou-color-primary-500)]" : "bg-[var(--yorisou-color-neutral-100)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : result ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-100)] px-3 py-1 text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">
                  今のあなた
                  <span className="font-semibold text-[var(--yorisou-color-primary-600)] opacity-80">
                    {phase === "saved" ? "保存済み · さっき" : "たった今"}
                  </span>
                </span>
                <button type="button" onClick={resetLoop} className="text-[11.5px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
                  やり直す
                </button>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="yorisou-orb yorisou-orb-float flex h-[64px] w-[64px] shrink-0 items-center justify-center">
                  <YorisouSymbol variant="white" size={30} />
                </div>
                <div>
                  <h1 className="text-[1.3rem] font-bold leading-[1.35]">{result.stateName}</h1>
                  <p className="mt-0.5 text-[12px] font-semibold text-[var(--yorisou-color-accent-600)]">{result.changeLine}</p>
                </div>
              </div>

              {revealStep >= 1 ? (
                <div className="yorisou-reveal mt-4 rounded-[var(--yorisou-radius-card)] bg-[var(--yorisou-color-deep-900)] p-4 text-white">
                  <div className="flex items-center gap-2">
                    <YorisouSymbol variant="white" size={16} />
                    <span className="text-[10.5px] font-bold tracking-[0.1em] text-white/65">見つかったこと</span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-7 text-white/90">{result.interpretation}</p>
                </div>
              ) : null}

              {revealStep >= 2 ? (
                <div className="yorisou-reveal mt-3 flex items-center justify-between gap-3 rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-primary-100)] bg-[var(--yorisou-color-primary-50)] px-4 py-3.5">
                  <div>
                    <p className="text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">次の一歩 · {result.nextActionTime}</p>
                    <p className="mt-0.5 text-[14px] font-bold leading-6">{result.nextAction}</p>
                  </div>
                </div>
              ) : null}

              {revealStep >= 3 ? (
                phase === "saved" ? (
                  <div className="yorisou-success-pop mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--yorisou-color-accent-600)]">
                      <span className="inline-flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[var(--yorisou-color-accent-100)]">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>
                      </span>
                      非公開で保存しました
                    </span>
                    <span className="rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--yorisou-color-neutral-800)]">
                      明日、30秒だけ見に戻りますか？ · リマインドなし
                    </span>
                  </div>
                ) : (
                  <div className="yorisou-reveal mt-4 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={saveState}
                      className="inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[13.5px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[var(--yorisou-color-primary-600)] active:scale-[0.98]"
                    >
                      この状態を非公開で残す
                    </button>
                    <button
                      type="button"
                      onClick={resetLoop}
                      className="inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold text-[var(--yorisou-color-neutral-800)]"
                    >
                      今日は残さない
                    </button>
                  </div>
                )
              ) : null}
            </>
          ) : null}
        </section>

        {/* ── Right column: companion + resume ── */}
        <div className="grid gap-4">
          <section className="rounded-[var(--yorisou-radius-card)] bg-[var(--yorisou-color-deep-900)] p-4 text-white">
            <div className="flex items-center gap-2">
              <YorisouSymbol variant="white" size={18} breathing />
              <span className="text-[11px] font-bold tracking-[0.08em] text-white/70">YORISOU AI</span>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-white/85">開いたところから、短く続けられます。</p>
            <div className="mt-3 grid gap-2">
              {["昨日の「返さない30分」はどうでしたか？", "今週いちばん重かった予定を整理する", "保存した提案をもう一度見る"].map((prompt) => (
                <Link
                  key={prompt}
                  href="/prototype/capture"
                  className="rounded-[var(--yorisou-radius-button)] border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-[12.5px] font-semibold text-white/90 no-underline transition duration-[var(--yorisou-motion-tap)] hover:bg-white/[0.12]"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-white p-4 shadow-[var(--yorisou-shadow-card)]">
            <p className="text-[12px] font-bold text-[var(--yorisou-color-neutral-500)]">前回のつづき</p>
            <p className="mt-1.5 text-[14px] font-bold leading-6">人間関係の疲れチェック · 途中まで</p>
            <p className="mt-0.5 text-[12px] text-[var(--yorisou-color-neutral-500)]">残り9問 · 約2分</p>
            <Link
              href="/prototype/capture"
              className="mt-3 inline-flex min-h-[40px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-primary-500)] px-4 text-[12.5px] font-bold text-[var(--yorisou-color-primary-600)] no-underline"
            >
              つづきから再開
            </Link>
          </section>
        </div>
      </div>

      {/* ── 3-item feed ── */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold">今のあなたに近いもの</h2>
          <Link href="/prototype/discover" className="text-[12.5px] font-semibold text-[var(--yorisou-color-primary-600)] no-underline">
            すべて見る →
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {feedPreview.map((item) => {
            const meta = FEED_TYPE_META[item.type];
            const done = feedback[item.id];
            return (
              <article key={item.id} className="overflow-hidden rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-white shadow-[var(--yorisou-shadow-card)]">
                <div className="flex h-[64px] items-end px-4 pb-2" style={{ background: meta.tint }}>
                  <span className="rounded-[var(--yorisou-radius-pill)] bg-white/90 px-2.5 py-0.5 text-[10.5px] font-bold text-[var(--yorisou-color-primary-700)]">{meta.label}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-[13.5px] font-bold leading-6">{item.title}</h3>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-[var(--yorisou-color-neutral-500)]">{item.reason}</p>
                  {done ? (
                    <p className="mt-3 text-[12px] font-semibold text-[var(--yorisou-color-accent-600)]" aria-live="polite">
                      {done === "skip" ? "受け取りました。表示を減らします。" : "保存しました"}
                    </p>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => setFeedback((f) => ({ ...f, [item.id]: "save" }))} className="inline-flex min-h-[36px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-3 text-[12px] font-semibold">
                        保存
                      </button>
                      <button type="button" onClick={() => setFeedback((f) => ({ ...f, [item.id]: "skip" }))} className="inline-flex min-h-[36px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-3 text-[12px] font-semibold text-[var(--yorisou-color-neutral-500)]">
                        今は合わない
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </ProtoShell>
  );
}
