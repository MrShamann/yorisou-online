"use client";

import { useEffect, useRef, useState } from "react";

import { YorisouSymbol } from "@/app/components/YorisouLogo";
import {
  PROCESSING_STEPS,
  SIGNATURE_CHIPS,
  transformEntry,
  type SignatureResult,
} from "../_lib/signatureTransform";

type Phase = "empty" | "processing" | "result" | "saved";

export default function SignaturePrototype() {
  const [phase, setPhase] = useState<Phase>("empty");
  const [entry, setEntry] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<SignatureResult | null>(null);
  const [layer, setLayer] = useState(0); // progressive reveal of the 3 layers

  const [memoDraft, setMemoDraft] = useState("");
  const [shareTitleDraft, setShareTitleDraft] = useState("");
  const [editingMemo, setEditingMemo] = useState(false);
  const [editingShare, setEditingShare] = useState(false);
  const [memoEdited, setMemoEdited] = useState(false);
  const [shareEdited, setShareEdited] = useState(false);
  const [actionState, setActionState] = useState<"open" | "accepted" | "rejected">("open");
  const [savedMode, setSavedMode] = useState<"private" | "share" | null>(null);

  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitted(trimmed);
    setPhase("processing");
    setStep(0);
    const built = transformEntry(trimmed);
    // schedule processing steps (~2.6s total)
    [700, 1400, 2100].forEach((ms, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), ms));
    });
    timers.current.push(
      window.setTimeout(() => {
        setResult(built);
        setMemoDraft(built.privateMemo);
        setShareTitleDraft(built.shareTitle);
        setPhase("result");
        setLayer(0);
      }, 2650),
    );
  }

  // progressive layer reveal in result phase
  useEffect(() => {
    if (phase !== "result") return;
    const ts: number[] = [];
    [200, 700, 1200].forEach((ms, i) => {
      ts.push(window.setTimeout(() => setLayer(i + 1), ms));
    });
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [phase]);

  function reset() {
    timers.current.forEach((t) => window.clearTimeout(t));
    setPhase("empty");
    setEntry("");
    setSubmitted("");
    setResult(null);
    setLayer(0);
    setMemoEdited(false);
    setShareEdited(false);
    setActionState("open");
    setSavedMode(null);
    setEditingMemo(false);
    setEditingShare(false);
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
      {/* corner badge, not center stage */}
      <span className="fixed left-3 top-3 z-50 rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white/85 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)] backdrop-blur">
        INTERACTION PROTOTYPE
      </span>

      <div className="mx-auto min-h-[100dvh] max-w-[560px] px-4 pb-16 pt-14">
        {/* ── STATE 0 / DURING: input capsule ── */}
        {phase === "empty" ? (
          <section className="flex min-h-[74dvh] flex-col justify-center">
            <div className="flex items-center gap-2 text-[var(--yorisou-color-primary-600)]">
              <YorisouSymbol variant="primary" size={22} />
              <span className="text-[12px] font-bold tracking-[0.04em]">YORISOU</span>
            </div>
            <h1 className="mt-4 text-[1.5rem] font-bold leading-[1.4] md:text-[1.75rem]">
              今日、少し引っかかったことは
              <br />
              ありますか？
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-[var(--yorisou-color-neutral-500)]">
              うまく言えなくて大丈夫です。ひとことだけ書いてくれれば、こちらで整理します。
            </p>

            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                submit(entry);
              }}
            >
              <label htmlFor="sig-input" className="sr-only">
                今日の一行
              </label>
              <textarea
                id="sig-input"
                value={entry}
                onChange={(event) => setEntry(event.target.value)}
                rows={3}
                placeholder="例：夜のSNSで疲れて、返信も溜めてしまいました。"
                className="w-full resize-none rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 py-3.5 text-[15px] leading-7 outline-none transition focus:border-[var(--yorisou-color-primary-500)]"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {SIGNATURE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setEntry(chip)}
                    className="inline-flex min-h-[38px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-[var(--yorisou-color-surface-raised)] px-3.5 text-[12px] font-semibold text-[var(--yorisou-color-neutral-800)] transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)]"
                  >
                    {chip.length > 16 ? `${chip.slice(0, 15)}…` : chip}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={!entry.trim()}
                className="mt-4 inline-flex min-h-[50px] w-full items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[15px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[var(--yorisou-color-primary-600)] active:scale-[0.99] disabled:opacity-45"
              >
                整理してもらう
              </button>
            </form>

            <p className="mt-4 flex items-start gap-1.5 text-[11.5px] leading-5 text-[var(--yorisou-color-neutral-500)]">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-0.5 shrink-0">
                <rect x="5" y="10" width="14" height="10" rx="2.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              入力した内容は、保存を選ぶまでこの画面内だけで扱います。
            </p>
          </section>
        ) : null}

        {/* ── STATE 1: processing ── */}
        {phase === "processing" ? (
          <section className="flex min-h-[74dvh] flex-col items-center justify-center text-center" aria-live="assertive">
            {/* context capsule */}
            <p className="mb-8 max-w-[80%] rounded-[var(--yorisou-radius-pill)] bg-white px-4 py-2 text-[12.5px] font-semibold text-[var(--yorisou-color-neutral-500)] shadow-[var(--yorisou-shadow-card)]">
              「{submitted.length > 22 ? `${submitted.slice(0, 21)}…` : submitted}」
            </p>
            <div className="yorisou-orb yorisou-orb-float flex h-[92px] w-[92px] items-center justify-center">
              <YorisouSymbol variant="white" size={42} breathing />
            </div>
            <div className="mt-8 grid gap-2.5">
              {PROCESSING_STEPS.map((label, i) => {
                const done = step > i;
                const active = step === i;
                return (
                  <div key={label} className={`flex items-center gap-2.5 transition-opacity duration-300 ${done || active ? "opacity-100" : "opacity-35"}`}>
                    <span
                      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] ${
                        done ? "bg-[var(--yorisou-color-accent-500)] text-white" : active ? "bg-[var(--yorisou-color-primary-500)] text-white" : "bg-[var(--yorisou-color-neutral-100)]"
                      }`}
                    >
                      {done ? (
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>
                      ) : null}
                    </span>
                    <span className="text-[13.5px] font-semibold">{label}</span>
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={reset} className="mt-8 text-[12px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
              やめる
            </button>
          </section>
        ) : null}

        {/* ── STATE 2/3: three-layer result ── */}
        {(phase === "result" || phase === "saved") && result ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <YorisouSymbol variant="primary" size={20} breathing />
                <span className="text-[11px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)]">整理できました · 3つに分けました</span>
              </div>
              <button type="button" onClick={reset} className="text-[11.5px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
                やり直す
              </button>
            </div>

            {/* Layer A — private memo (quiet neutral) */}
            {layer >= 1 ? (
              <div className="yorisou-reveal rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-200)] bg-[var(--yorisou-color-neutral-100)] p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--yorisou-color-neutral-500)]">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                    私的メモ · 本人だけ
                  </span>
                  {!editingMemo && phase === "result" ? (
                    <button type="button" onClick={() => setEditingMemo(true)} className="text-[11.5px] font-semibold text-[var(--yorisou-color-primary-600)] underline-offset-2 hover:underline">
                      直す
                    </button>
                  ) : null}
                </div>
                {editingMemo ? (
                  <div className="mt-2">
                    <textarea
                      value={memoDraft}
                      onChange={(event) => setMemoDraft(event.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-[var(--yorisou-radius-button)] border border-[var(--yorisou-color-neutral-200)] bg-white px-3 py-2 text-[13.5px] leading-6 outline-none focus:border-[var(--yorisou-color-primary-500)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMemo(false);
                        setMemoEdited(true);
                      }}
                      className="mt-2 inline-flex min-h-[38px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[12.5px] font-bold text-white"
                    >
                      直しました
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mt-1.5 text-[14px] leading-7 text-[var(--yorisou-color-neutral-800)]">{memoDraft}</p>
                    <p className="mt-1.5 text-[11px] text-[var(--yorisou-color-neutral-500)]">
                      あなたの言葉のまま。自動で公開されることはありません。
                      {memoEdited ? <span className="ml-1 font-semibold text-[var(--yorisou-color-accent-600)]">あなたの言葉に直しました</span> : null}
                    </p>
                  </>
                )}
              </div>
            ) : null}

            {/* Layer B — share-safe card (white / editorial) */}
            {layer >= 2 ? (
              <div className="yorisou-reveal overflow-hidden rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-white shadow-[var(--yorisou-shadow-card)]">
                <div className="flex h-[56px] items-end px-5 pb-2.5" style={{ background: "linear-gradient(135deg,#6C4CFF 0%,#8E75FF 100%)" }}>
                  <span className="rounded-[var(--yorisou-radius-pill)] bg-white/92 px-2.5 py-0.5 text-[10.5px] font-bold text-[var(--yorisou-color-primary-700)]">共有できる体験 · 匿名</span>
                </div>
                <div className="p-5">
                  {editingShare ? (
                    <div>
                      <input
                        value={shareTitleDraft}
                        onChange={(event) => setShareTitleDraft(event.target.value)}
                        className="w-full rounded-[var(--yorisou-radius-button)] border border-[var(--yorisou-color-neutral-200)] bg-white px-3 py-2 text-[15px] font-bold outline-none focus:border-[var(--yorisou-color-primary-500)]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditingShare(false);
                          setShareEdited(true);
                        }}
                        className="mt-2 inline-flex min-h-[38px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[12.5px] font-bold text-white"
                      >
                        直しました
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-[15.5px] font-bold leading-7">{shareTitleDraft}</h2>
                      {phase === "result" ? (
                        <button type="button" onClick={() => setEditingShare(true)} className="shrink-0 text-[11.5px] font-semibold text-[var(--yorisou-color-primary-600)] underline-offset-2 hover:underline">
                          直す
                        </button>
                      ) : null}
                    </div>
                  )}
                  <p className="mt-2 text-[13.5px] leading-7 text-[var(--yorisou-color-neutral-500)]">{result.shareBody}</p>
                  {shareEdited ? <p className="mt-1.5 text-[11.5px] font-semibold text-[var(--yorisou-color-accent-600)]">あなたの言葉に直しました</p> : null}

                  <div className="mt-3 grid gap-1.5 rounded-[var(--yorisou-radius-button)] bg-[var(--yorisou-color-primary-50)] px-3.5 py-3">
                    {["名前は含まれません", `個人や場所を特定しやすい表現（${result.removedHints.join("・")}）は外しています`, "まだ公開されていません"].map((line) => (
                      <p key={line} className="flex items-start gap-1.5 text-[11.5px] leading-5 text-[var(--yorisou-color-primary-700)]">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0"><path d="M5 12.5 10 17.5 19 7" /></svg>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Layer C — one action (deep ink action surface) */}
            {layer >= 3 ? (
              <div className="yorisou-reveal rounded-[var(--yorisou-radius-card)] bg-[var(--yorisou-color-deep-900)] p-5 text-white">
                <div className="flex items-center gap-2">
                  <YorisouSymbol variant="white" size={16} />
                  <span className="text-[10.5px] font-bold tracking-[0.1em] text-white/65">今日の小さな一歩</span>
                </div>
                <p className="mt-2.5 text-[16px] font-bold leading-7">{result.action}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-[var(--yorisou-radius-pill)] bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">{result.actionTime}</span>
                  <span className="rounded-[var(--yorisou-radius-pill)] bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">{result.actionDifficulty}</span>
                </div>
                <p className="mt-3 text-[12px] leading-6 text-white/70">{result.actionReason}</p>
                {actionState === "open" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setActionState("accepted")} className="inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] bg-white px-5 text-[13.5px] font-bold text-[var(--yorisou-color-deep-900)] transition active:scale-[0.98]">
                      これをやってみる
                    </button>
                    <button type="button" onClick={() => setActionState("rejected")} className="inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] border border-white/25 px-4 text-[13px] font-semibold text-white/85">
                      今日は合わない
                    </button>
                  </div>
                ) : (
                  <p className="yorisou-success-pop mt-4 text-[13px] font-bold text-[var(--yorisou-color-accent-500)]" aria-live="polite">
                    {actionState === "accepted" ? "受け取りました。明日、そっと聞きますね。" : "受け取りました。別の一歩を用意します。"}
                  </p>
                )}
              </div>
            ) : null}

            {/* Save boundary */}
            {layer >= 3 && phase === "result" ? (
              <div className="yorisou-reveal rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-white p-4 shadow-[var(--yorisou-shadow-card)]">
                <p className="text-[12.5px] font-bold text-[var(--yorisou-color-neutral-800)]">どう残しますか？</p>
                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSavedMode("private");
                      setPhase("saved");
                    }}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[13.5px] font-bold text-white transition hover:bg-[var(--yorisou-color-primary-600)]"
                  >
                    非公開で保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedMode("share");
                      setPhase("saved");
                    }}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-primary-500)] bg-white px-4 text-[13.5px] font-bold text-[var(--yorisou-color-primary-600)]"
                  >
                    匿名共有の準備を見る
                  </button>
                  <button type="button" onClick={reset} className="inline-flex min-h-[42px] items-center justify-center text-[12.5px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
                    保存せず終了
                  </button>
                </div>
              </div>
            ) : null}

            {/* Saved confirmation */}
            {phase === "saved" ? (
              <div className="yorisou-success-pop rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-accent-500)] bg-[var(--yorisou-color-accent-100)] p-4">
                <p className="flex items-center gap-2 text-[13.5px] font-bold text-[var(--yorisou-color-accent-600)]">
                  <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>
                  </span>
                  {savedMode === "private" ? "非公開で保存しました" : "匿名共有の下書きを用意しました"}
                </p>
                <p className="mt-1.5 text-[12px] leading-6 text-[var(--yorisou-color-accent-600)]">
                  {savedMode === "private"
                    ? "あなたにだけ表示されます。いつでも削除できます。"
                    : "公開前に、もう一度あなたの確認が入ります。まだ公開されていません。"}
                </p>
                <button type="button" onClick={reset} className="mt-3 text-[12.5px] font-bold text-[var(--yorisou-color-accent-600)] underline-offset-2 hover:underline">
                  もう一つ書く
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
