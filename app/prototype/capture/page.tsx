"use client";

import { useState } from "react";

import ProtoShell from "../_lib/ProtoShell";
import { YorisouSymbol } from "@/app/components/YorisouLogo";
import { CAPTURE_CHIPS, CAPTURE_FOLLOWUPS } from "../_lib/fixtures";

type Turn = { role: "ai" | "user"; text: string };
type Phase = "q1" | "q2" | "q3" | "preview" | "done";

export default function PrototypeCapture() {
  const [phase, setPhase] = useState<Phase>("q1");
  const [turns, setTurns] = useState<Turn[]>([{ role: "ai", text: "何がありましたか？ひとことで大丈夫です。" }]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [visibility, setVisibility] = useState<"private" | "anonymous" | null>(null);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nextAnswers = [...answers, trimmed];
    setAnswers(nextAnswers);
    setDraft("");

    if (phase === "q1") {
      setTurns((t) => [
        ...t,
        { role: "user", text: trimmed },
        { role: "ai", text: `${CAPTURE_FOLLOWUPS[0].ack} ${CAPTURE_FOLLOWUPS[0].question}` },
      ]);
      setPhase("q2");
    } else if (phase === "q2") {
      setTurns((t) => [
        ...t,
        { role: "user", text: trimmed },
        { role: "ai", text: `${CAPTURE_FOLLOWUPS[1].ack} ${CAPTURE_FOLLOWUPS[1].question}` },
      ]);
      setPhase("q3");
    } else if (phase === "q3") {
      setTurns((t) => [
        ...t,
        { role: "user", text: trimmed },
        { role: "ai", text: "ありがとうございます。カードにまとめました。内容はいつでも直せます。" },
      ]);
      setPhase("preview");
    }
  }

  const chips = phase === "q1" ? CAPTURE_CHIPS : phase === "q2" ? CAPTURE_FOLLOWUPS[0].chips : phase === "q3" ? CAPTURE_FOLLOWUPS[1].chips : [];
  const [situation, action, feeling] = answers;

  return (
    <ProtoShell title="記録する">
      <div className="mx-auto grid max-w-[920px] gap-4 md:grid-cols-[1fr_0.9fr] md:items-start">
        {/* ── Conversation ── */}
        <section className="rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-white p-4 shadow-[var(--yorisou-shadow-card)] md:p-5">
          <div className="flex items-center gap-2">
            <YorisouSymbol variant="primary" size={18} />
            <span className="text-[11px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)]">今日の記録 · 3問だけ</span>
          </div>

          <div className="mt-3 grid gap-2.5" aria-live="polite">
            {turns.map((turn, i) => (
              <div
                key={i}
                className={
                  turn.role === "ai"
                    ? "max-w-[85%] rounded-[16px] rounded-tl-[4px] bg-[var(--yorisou-color-deep-900)] px-4 py-3 text-[13.5px] leading-6 text-white/92"
                    : "ml-auto max-w-[85%] rounded-[16px] rounded-tr-[4px] bg-[var(--yorisou-color-primary-100)] px-4 py-3 text-[13.5px] leading-6 text-[var(--yorisou-color-primary-700)]"
                }
              >
                {turn.text}
              </div>
            ))}
          </div>

          {phase !== "preview" && phase !== "done" ? (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => submit(chip)}
                    className="inline-flex min-h-[38px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-[var(--yorisou-color-surface-raised)] px-3.5 text-[12.5px] font-semibold transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit(draft);
                }}
              >
                <label htmlFor="capture-input" className="sr-only">
                  自分の言葉で書く
                </label>
                <input
                  id="capture-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="自分の言葉で書いても大丈夫"
                  className="min-h-[46px] flex-1 rounded-[var(--yorisou-radius-button)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[14px] outline-none transition focus:border-[var(--yorisou-color-primary-500)]"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[46px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[13px] font-bold text-white transition hover:bg-[var(--yorisou-color-primary-600)] active:scale-[0.98]"
                >
                  送る
                </button>
              </form>
            </div>
          ) : null}
        </section>

        {/* ── Live card preview ── */}
        <section aria-label="カードプレビュー" className="md:sticky md:top-[76px]">
          <p className="text-[11px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)]">できあがるカード</p>
          <div className={`mt-2 overflow-hidden rounded-[var(--yorisou-radius-hero)] border bg-white shadow-[var(--yorisou-shadow-raised)] transition-opacity duration-[var(--yorisou-motion-card)] ${answers.length === 0 ? "border-dashed border-[var(--yorisou-color-neutral-200)] opacity-70" : "border-[var(--yorisou-color-neutral-100)]"}`}>
            <div className="flex h-[72px] items-end px-5 pb-2.5" style={{ background: "linear-gradient(135deg,#6C4CFF 0%,#8E75FF 100%)" }}>
              <span className="rounded-[var(--yorisou-radius-pill)] bg-white/92 px-2.5 py-0.5 text-[10.5px] font-bold text-[var(--yorisou-color-primary-700)]">わたしの体験</span>
            </div>
            <div className="grid gap-3 p-5">
              <PreviewRow label="あったこと" value={situation} placeholder="1問目で入ります" />
              <PreviewRow label="試したこと" value={action} placeholder="2問目で入ります" />
              <PreviewRow label="感じたこと・限界" value={feeling} placeholder="3問目で入ります" />
              <div className="border-t border-[var(--yorisou-color-neutral-100)] pt-3 text-[11.5px] leading-5 text-[var(--yorisou-color-neutral-500)]">
                個人が特定される情報は載りません。共有しても名前は出ません。
              </div>
            </div>
          </div>

          {phase === "preview" ? (
            <div className="yorisou-reveal mt-3 grid gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVisibility("private");
                    setPhase("done");
                  }}
                  className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[13.5px] font-bold text-white transition hover:bg-[var(--yorisou-color-primary-600)]"
                >
                  非公開で保存
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisibility("anonymous");
                    setPhase("done");
                  }}
                  className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-primary-500)] bg-white px-4 text-[13.5px] font-bold text-[var(--yorisou-color-primary-600)]"
                >
                  匿名で共有
                </button>
              </div>
              <button type="button" onClick={() => setPhase("q3")} className="text-[12px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
                直す・やめる
              </button>
            </div>
          ) : null}

          {phase === "done" ? (
            <p className="yorisou-success-pop mt-3 flex items-center gap-1.5 text-[13px] font-bold text-[var(--yorisou-color-accent-600)]" aria-live="polite">
              <span className="inline-flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[var(--yorisou-color-accent-100)]">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>
              </span>
              {visibility === "anonymous" ? "匿名で共有しました。表示前に内容の確認が入ります。" : "非公開で保存しました。「わたし」から見返せます。"}
            </p>
          ) : null}
        </section>
      </div>
    </ProtoShell>
  );
}

function PreviewRow({ label, value, placeholder }: { label: string; value?: string; placeholder: string }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold tracking-[0.06em] text-[var(--yorisou-color-primary-600)]">{label}</p>
      {value ? (
        <p className="yorisou-reveal mt-0.5 text-[13.5px] font-semibold leading-6">{value}</p>
      ) : (
        <p className="mt-0.5 text-[13px] leading-6 text-[var(--yorisou-color-neutral-500)] opacity-60">{placeholder}</p>
      )}
    </div>
  );
}
