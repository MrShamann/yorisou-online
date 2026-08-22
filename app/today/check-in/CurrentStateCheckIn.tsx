"use client";

import Link from "next/link";
import {
  CHECK_IN_FEEDBACK,
  acknowledgeFeedback,
  checkInResponseFor,
  type CheckInFeedbackId,
} from "@/lib/yorisou/today/checkInResponse";
import { useState } from "react";

import {
  INTENT_OPTIONS,
  STATE_OPTIONS,
  writeCurrentStateCheckIn,
  type IntentOptionId,
  type StateOptionId,
} from "@/lib/yorisou/today/currentStateCheckIn";
import { currentStateTagsFromCheckIn } from "@/lib/life-os/contract";
import { lifePost } from "@/lib/life-os/client";

// 今の気配を見る — two bounded questions, then a reflection of exactly what was chosen.
//
// One question per screen, large targets, no login, no timer, no progress bar with a percentage.
// A person can leave after the first question and has lost nothing.
//
// The result reflects the selections VERBATIM. It does not name a type, score a dimension, or say
// "you are" anything — see the module comment for why that boundary is absolute here.
//
// OSF-1 ADDED SERVER PERSISTENCE, AND CHANGED NOTHING ABOUT THE QUESTIONS.
//
// The device-local record is still written first and still unconditionally: it is what makes the
// flow work with no account, offline, and with the database unreachable — the state this repository
// is in on a laptop, where there is no Supabase at all. The server write is attempted afterwards and
// only for someone signed in.
//
// The completion line then says which of those actually happened. It used to read
// 「この記録はこの端末にだけ保存されます。」 unconditionally, which stops being true the moment a
// signed-in person's check-in reaches their account — and a sentence about where someone's private
// state is kept is the last one that should be approximated.

type Step = "state" | "intent" | "done";
/** Where the finished check-in actually ended up. Never guessed — set from the response. */
type Storage = "device" | "account" | "device_only_failed";

export default function CurrentStateCheckIn() {
  const [step, setStep] = useState<Step>("state");
  const [state, setState] = useState<StateOptionId | null>(null);
  const [intent, setIntent] = useState<IntentOptionId | null>(null);
  const [storage, setStorage] = useState<Storage>("device");
  const [recordId, setRecordId] = useState<string | null>(null);

  const [noteOpen, setNoteOpen] = useState(false);
  // Their answer to the reading. Local to the screen: a correction is not a durable claim about
  // the person, and recording one would be the opposite of what「少し違う」means.
  const [feedback, setFeedback] = useState<CheckInFeedbackId | null>(null);
  const [note, setNote] = useState("");
  const [noteState, setNoteState] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  function chooseState(id: StateOptionId) {
    setState(id);
    setStep("intent");
  }

  async function chooseIntent(id: IntentOptionId) {
    setIntent(id);
    writeCurrentStateCheckIn(state as StateOptionId, id);
    setStep("done");

    const result = await lifePost<{ id: string }>("state", {
      record: {
        stateTags: currentStateTagsFromCheckIn(state as StateOptionId, id),
        source: "today_check_in",
      },
    });
    if (result.ok) {
      setRecordId(result.data.id);
      setStorage("account");
    } else if (result.reason === "unauthenticated") {
      setStorage("device");
    } else {
      setStorage("device_only_failed");
    }
  }

  async function saveNote() {
    if (!recordId || note.trim().length === 0) return;
    setNoteState("saving");
    const result = await lifePost("state", { id: recordId, reflection: note });
    setNoteState(result.ok ? "saved" : "failed");
  }

  if (step === "done" && state && intent) {
    // V2 — the response is keyed on the COMBINATION, which is the one thing the person did not say.
    // The old screen printed their two labels back and then a sentence keyed on intent alone; the
    // state was decoration. Twenty-five inputs produced five paraphrases, and the interaction
    // returned nothing the person had not just supplied.
    const answer = checkInResponseFor(state, intent);
    const next = answer.step;
    return (
      <div>
        <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          今の気配
        </p>
        {/* THE READING, not an echo. A hypothesis about what the two choices together might mean —
            which the person can recognise or reject, and which they did not tell us. */}
        <h1 className="mt-3 text-[20px] font-semibold leading-[1.75] tracking-[-0.005em] text-[var(--pxr-text-primary)]">
          {answer.reading}
        </h1>

        {/* AND THEY GET TO ANSWER IT. Without this the reading would be a verdict, and P7 is
            explicit that an inference never becomes truth about someone unless they say so.
            「少し違う」 is a real answer: it withdraws the reading rather than thanking them for it. */}
        <div className="mt-6">
          {feedback === null ? (
            <>
              <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                どうでしょうか。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CHECK_IN_FEEDBACK.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFeedback(option.id)}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-5 text-[15px] font-medium text-[var(--pxr-text-primary)]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p
              role="status"
              className="text-[14px] leading-[1.85] text-[var(--pxr-text-secondary)]"
            >
              {acknowledgeFeedback(feedback)}
            </p>
          )}
        </div>

        <p className="mt-8 text-[13px] leading-[1.85] text-[var(--pxr-text-muted)]">
          {answer.because}
        </p>

        {/* The optional note. Offered, never asked: the two questions above stay bounded, and this
            appears only if someone reaches for it. Signed-in only, because there is nowhere to put
            it otherwise — the device-local record holds no free text by design. */}
        {storage === "account" && recordId && noteState !== "saved" && (
          <section className="mt-8">
            {!noteOpen ? (
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
              >
                書き残しておく（任意）
              </button>
            ) : (
              <>
                <label
                  htmlFor="current-state-note"
                  className="block text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]"
                >
                  書き残しておく
                </label>
                <textarea
                  id="current-state-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="mt-3 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
                  placeholder="思ったことを、そのまま。"
                />
                <button
                  type="button"
                  onClick={saveNote}
                  disabled={note.trim().length === 0 || noteState === "saving"}
                  className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-6 text-[15px] font-medium text-[var(--pxr-text-primary)] disabled:text-[var(--pxr-text-muted)]"
                >
                  {noteState === "saving" ? "保存しています" : "残す"}
                </button>
                {noteState === "failed" && (
                  <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                    保存できませんでした。もう一度おためしください。
                  </p>
                )}
              </>
            )}
          </section>
        )}
        {noteState === "saved" && (
          <p className="mt-8 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            書き残しました。
          </p>
        )}

        <section className="mt-9">
          <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            今できること
          </h2>
          <Link
            href={next.href}
            className="mt-3 flex min-h-[var(--pxr-touch-target)] w-full items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 py-4 text-[16px] font-semibold text-white"
          >
            {next.label}
          </Link>
        </section>

        {/* The Deep Dive is an option here, never the default completion action. */}
        <section className="mt-9">
          <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            もう少し深く見る
          </h2>
          <Link
            href="/tests/ima-iro"
            className="mt-3 flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
          >
            いま色テストを見る（120問）
          </Link>
        </section>

        <p className="mt-10 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
          {storage === "account"
            ? "この記録は、この端末とあなたのアカウントに保存されます。"
            : storage === "device_only_failed"
              ? "この記録はこの端末に保存されました。アカウントへの保存はできませんでした。"
              : "この記録はこの端末にだけ保存されます。"}
        </p>
      </div>
    );
  }

  const isState = step === "state";
  const options = isState ? STATE_OPTIONS : INTENT_OPTIONS;

  return (
    <div>
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {isState ? "1 / 2" : "2 / 2"}
      </p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        {isState ? "いま、どんな感じですか。" : "どうなるとよさそうですか。"}
      </h1>

      <ul className="mt-7 flex flex-col gap-2.5">
        {options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() =>
                isState
                  ? chooseState(option.id as StateOptionId)
                  : void chooseIntent(option.id as IntentOptionId)
              }
              className="flex min-h-[var(--pxr-touch-target)] w-full items-center rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4 text-left text-[16px] leading-[1.6] text-[var(--pxr-text-primary)]"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>

      {!isState && (
        <button
          type="button"
          onClick={() => setStep("state")}
          className="mt-6 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[14px] text-[var(--pxr-text-muted)]"
        >
          ひとつ戻る
        </button>
      )}
    </div>
  );
}
