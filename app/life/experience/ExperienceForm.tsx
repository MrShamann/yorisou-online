"use client";

import Link from "next/link";
import { useState } from "react";
import { EXPERIENCE_PRIVACY } from "@/lib/life-os/privacyCopy";
import { lifeFailureMessage, lifePatch, lifePost, type LifeFailureKind, type LifeResult } from "@/lib/life-os/client";

// OSF-1 — 経験を書く.
//
// Four questions: what happened, what you tried, what came of it, and what you take from it. They
// map onto the EXISTING experience card (lib/server/experienceCards.ts) — situation, action_tried,
// perceived_outcome and the lesson column added by 202608140001 — so this writes to the same table
// the community surface reads. There is no second experience store.
//
// PRIVATE, always, at the moment of writing. Sharing is a separate decision, made later, on a card
// that already exists — never a checkbox at the bottom of a form someone opened to write a note.
// That separation is the point of 書きとめたもの below: the visibility control is somewhere a person
// arrives deliberately, about a specific card, with a preview in front of them.

const FIELDS = [
  { id: "situation", label: "何が起きましたか", rows: 5, max: 3000, required: true },
  { id: "actionTaken", label: "どうしてみましたか", rows: 5, max: 3000, required: true },
  { id: "outcome", label: "その結果、どうなりましたか", rows: 5, max: 3000, required: true },
  { id: "lesson", label: "そこから何を持ち帰りますか（任意）", rows: 4, max: 1000, required: false },
] as const;

type FieldId = (typeof FIELDS)[number]["id"];

type Visibility = "PRIVATE" | "INVITE_ONLY" | "SIMILAR_STATE_ONLY" | "ANONYMOUS_SHARED";

/** What the sharing decision needs to know about a card — not the row. page.tsx does the narrowing. */
export type ExperienceSummary = {
  id: string;
  title: string | null;
  /** null when the stored value is outside VISIBILITIES — this control has no honest label for it. */
  visibility: Visibility | null;
  /** withdrawn_at is set: out of every reader query, whatever the visibility column still says. */
  withdrawn: boolean;
  stateContext: string | null;
  situation: string;
  actionTried: string;
  perceivedOutcome: string;
  limitations: string | null;
  mayFit: string | null;
  mayNotFit: string | null;
};

// NARROW TO WIDE, AND THE ORDER IS LOAD-BEARING. This screen decides whether a change is a widening
// by comparing positions in this list, so it can put the preview in front of someone BEFORE the
// request is sent. The server remains the authority — updateExperience refuses an unconfirmed
// widening through isVisibilityExpansion() — but a refusal after the fact is not a decision someone
// got to make. The words are the ones /experiences already uses; two names for one visibility would
// be two different promises.
const VISIBILITIES = [
  { value: "PRIVATE", label: "非公開（ほかの利用者に表示しない）" },
  { value: "INVITE_ONLY", label: "招待リンクだけ" },
  { value: "SIMILAR_STATE_ONLY", label: "近い関心の人に限定表示" },
  { value: "ANONYMOUS_SHARED", label: "匿名で共有" },
] as const;

// state_context / limitations / may_fit / may_not_fit exist FOR READERS: they are what stops a
// stranger reading someone's account of what worked for them as advice, and yorisou_experience_cards
// requires all four of any card that is visible to anyone else. The four questions at the top of this
// screen do not ask for them, because a private note has no readers to protect. So they are asked
// here, at the one moment they start to matter, and the labels are /experiences' own.
const SHARED_CONTEXT = [
  { id: "stateContext", label: "今の状態や背景", hint: "例: 少し疲れていて、急がず整えたい時期でした。", max: 1200 },
  { id: "limitations", label: "条件や限界", hint: "合わなかった点、分からない点、前提を書きます。", max: 2000 },
  { id: "mayFit", label: "合うかもしれない人・場面", hint: "限定的な可能性として書きます。", max: 1200 },
  { id: "mayNotFit", label: "合わないかもしれない人・場面", hint: "無理に勧めないための境界を書きます。", max: 1200 },
] as const;

type SharedContextId = (typeof SHARED_CONTEXT)[number]["id"];

/** -1 for a visibility this control cannot represent, so every change out of it reads as a widening. */
const rank = (visibility: Visibility | null) => VISIBILITIES.findIndex((option) => option.value === visibility);
const labelOf = (visibility: Visibility) =>
  VISIBILITIES.find((option) => option.value === visibility)?.label ?? "";

/**
 * The bounded refusals this surface can explain. Everything else keeps the shared wording.
 *
 * `kind` is required rather than defaulted, because defaulting it is how this function came to tell
 * someone changing a card's VISIBILITY that 「入力した内容はこの画面に残っています」 — on a press where
 * nothing had been typed, and without saying the one thing a consent surface must say: whether the
 * card is still shared.
 */
function failureMessage(result: Extract<LifeResult<unknown>, { ok: false }>, kind: LifeFailureKind) {
  if (result.reason !== "failed") return lifeFailureMessage(result, kind);
  if (result.code === "identifying_detail_detected") {
    return "個人が分かる情報が残っているようです。名前や連絡先をはずしてから、もう一度お試しください。";
  }
  if (result.code === "invalid_experience_card") {
    return "共有するには、背景・条件や限界・合う場面・合わない場面がそろっている必要があります。";
  }
  return lifeFailureMessage(result, kind);
}

export default function ExperienceForm({ initialExperiences }: { initialExperiences: ExperienceSummary[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
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
    // The re-entry guard the removed `disabled` used to provide.
    if (phase === "saving") return;
    setPhase("saving");
    // The Life OS route, not /api/experiences: that one is outside the feature gate and writes no
    // Life OS audit event, so a card created there existed with no record of its creation.
    const result = await lifePost<{ experience: { id: string } }>("experiences", {
      title: title.trim(),
      situation: values.situation,
      actionTried: values.actionTaken,
      perceivedOutcome: values.outcome,
      lesson: values.lesson.trim() || null,
    });
    if (!result.ok) {
      setFailure(failureMessage(result, "save"));
      setPhase("failed");
      return;
    }
    setExperiences((current) => [
      {
        id: result.data.experience.id,
        title: title.trim(),
        visibility: "PRIVATE",
        withdrawn: false,
        stateContext: null,
        situation: values.situation.trim(),
        actionTried: values.actionTaken.trim(),
        perceivedOutcome: values.outcome.trim(),
        limitations: null,
        mayFit: null,
        mayNotFit: null,
      },
      ...current,
    ]);
    setSavedId(result.data.experience.id);
    setPhase("saved");
  }

  function replace(card: ExperienceSummary) {
    setExperiences((current) => current.map((item) => (item.id === card.id ? card : item)));
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
        <VisibilitySection experiences={experiences} onUpdated={replace} />
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
        // `disabled` only for an incomplete card; in flight is aria-busy so the pressed button keeps
        // focus. save() holds the re-entry guard. Same reasoning as ReflectionFlow.
        disabled={!complete}
        aria-busy={phase === "saving"}
        className="mt-7 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-7 text-[16px] font-semibold text-white disabled:opacity-60 aria-[busy=true]:opacity-70"
      >
        {phase === "saving" ? "保存しています" : "書きとめる"}
      </button>
      {phase === "failed" && (
        <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{failure}</p>
      )}

      <p className="mt-8 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
        {EXPERIENCE_PRIVACY}
      </p>

      <VisibilitySection experiences={experiences} onUpdated={replace} />
    </div>
  );
}

// 書きとめたもの — the visibility control.
//
// NARROWING SENDS. WIDENING ASKS FIRST. Choosing a narrower range takes nothing away from the person
// and gives nothing to anyone, so it goes straight through. Choosing a wider one opens the preview:
// the exact seven fields a reader would receive, with the four they have not written yet as fields
// they fill in, and a confirmation that names what they are agreeing to. Nothing is sent until then.
//
// The preview is what a READER gets, which is not the whole card — invitedCard and
// discoverExperiences select the seven content fields and neither returns みだし or 持ち帰ること. So
// those two are not shown as about-to-be-visible, and the copy says so rather than leaving someone to
// assume the worst about a title they wrote for themselves.

const EMPTY_DRAFT: Record<SharedContextId, string> = { stateContext: "", limitations: "", mayFit: "", mayNotFit: "" };

function VisibilitySection({
  experiences,
  onUpdated,
}: {
  experiences: ExperienceSummary[];
  onUpdated: (card: ExperienceSummary) => void;
}) {
  const [choices, setChoices] = useState<Record<string, Visibility>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  // Which card the draft above belongs to. One draft serves whichever preview is open, so without this
  // there is no way to tell "these are still this card's paragraphs" from "these are another card's".
  const [draftId, setDraftId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null);
  const [changed, setChanged] = useState<string | null>(null);

  if (experiences.length === 0) return null;

  // THE AGREEMENT IS INVALIDATED. THE WRITING IS NOT. Those are two things, and this used to treat
  // them as one: a different choice closed the preview, and reopening it re-seeded the four boxes from
  // the card — which holds null for every card that has never been shared. Four paragraphs someone had
  // just written about how they want to be read disappeared because they changed their mind about the
  // audience. Consent has to be given again, against the range the preview now names; the paragraphs
  // are the person's own account and survive (see openPreview).
  function choose(card: ExperienceSummary, next: Visibility) {
    setChoices((current) => ({ ...current, [card.id]: next }));
    setFailure(null);
    setChanged(null);
    setAgreed(false);
    // The preview is what a widening is confirmed against, so it only closes when there is no longer a
    // widening to confirm. Otherwise it stays open around the boxes, retitled with the new range.
    if (openId === card.id && rank(next) <= rank(card.visibility)) setOpenId(null);
  }

  function openPreview(card: ExperienceSummary) {
    // Seeded from the card only when the draft is not already this card's — reopening after a change
    // of 公開範囲 must find the paragraphs still there, and another card's must never appear here.
    if (draftId !== card.id) {
      setDraft({
        stateContext: card.stateContext ?? "",
        limitations: card.limitations ?? "",
        mayFit: card.mayFit ?? "",
        mayNotFit: card.mayNotFit ?? "",
      });
      setDraftId(card.id);
    }
    setAgreed(false);
    setFailure(null);
    setChanged(null);
    setOpenId(card.id);
  }

  async function apply(card: ExperienceSummary, next: Visibility, sharing: boolean) {
    // Same guard, PER CARD. `if (pending) return` was wrong in the same way MemoryList's was: the
    // `disabled` it replaced read `pending === card.id`, so a global guard turned every other card's
    // visibility control into a silent no-op while one was in flight. Someone locking down two shared
    // cards would press the second, get no request and no message, and the card would stay shared.
    // On a sharing control that is the worst possible shape for a mistake.
    if (pending === card.id) return;
    setPending(card.id);
    setFailure(null);
    const body: Record<string, unknown> = { visibility: next };
    if (sharing) {
      for (const field of SHARED_CONTEXT) body[field.id] = draft[field.id].trim();
      body.previewConfirmed = true;
    }
    const result = await lifePatch(`experiences/${encodeURIComponent(card.id)}`, body);
    setPending(null);
    if (!result.ok) {
      setFailure({ id: card.id, message: failureMessage(result, "change") });
      return;
    }
    onUpdated(
      sharing
        ? {
            ...card,
            visibility: next,
            stateContext: draft.stateContext.trim(),
            limitations: draft.limitations.trim(),
            mayFit: draft.mayFit.trim(),
            mayNotFit: draft.mayNotFit.trim(),
          }
        : { ...card, visibility: next },
    );
    setChoices((current) => ({ ...current, [card.id]: next }));
    setOpenId(null);
    setAgreed(false);
    setChanged(card.id);
  }

  return (
    <section className="mt-12 border-t border-[var(--pxr-border-subtle)] pt-8">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">書きとめたもの</h2>
      <p className="mt-3 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        はじめはすべて非公開です。ほかの人に見えるようにするかどうかは、一つずつ決められます。
      </p>
      <ul className="mt-5 flex flex-col gap-4">
        {experiences.map((card) => {
          // A CARD NO READER CAN REACH IS NOT A CARD AT ONE OF THESE RANGES.
          //
          // 取り下げ stamps withdrawn_at and leaves the visibility column alone (withdrawExperience),
          // and every reader query filters withdrawn_at is.null — discoverExperiences, invitedCard,
          // sharedCard. So a withdrawn card still reads ANONYMOUS_SHARED in the column while nobody
          // can open it, and nothing in updateExperience clears the stamp: showing 「いまの公開範囲:
          // 匿名で共有」 over that row tells someone their experience is shared when it is not, and
          // offering the select would take a decision, answer 200, and leave the card exactly as
          // unreachable as before. The other case is the column's own vocabulary — its constraint also
          // permits PSEUDONYMOUS_SHARED and PUBLIC_SAFE, which ACTIVE_VISIBILITIES refuses and
          // deferred_visibility_inactive keeps unpublished; page.tsx hands those over as null rather
          // than let a select with no matching option present them as 非公開.
          if (card.withdrawn || card.visibility === null) {
            return (
              <li
                key={card.id}
                className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4"
              >
                <h3 className="text-[17px] font-medium leading-[1.6] text-[var(--pxr-text-primary)]">
                  {card.title ?? card.situation}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                  {card.withdrawn
                    ? "取り下げたため、ほかの人には表示されていません。ここから公開範囲を戻すことはできません。"
                    : "いまは選べない公開範囲のため、ほかの人には表示されていません。"}
                </p>
              </li>
            );
          }
          // Narrowed by the guard above; held in a const so the callbacks below keep the narrowing.
          const visibility = card.visibility;
          const next = choices[card.id] ?? visibility;
          const widening = rank(next) > rank(visibility);
          const open = openId === card.id;
          const ready = SHARED_CONTEXT.every((field) => draft[field.id].trim().length > 0);
          return (
            <li
              key={card.id}
              className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4"
            >
              <h3 className="text-[17px] font-medium leading-[1.6] text-[var(--pxr-text-primary)]">
                {card.title ?? card.situation}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                いまの公開範囲: {labelOf(visibility)}
              </p>

              <label
                htmlFor={`experience-visibility-${card.id}`}
                className="mt-4 block text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]"
              >
                公開範囲
              </label>
              <select
                id={`experience-visibility-${card.id}`}
                value={next}
                onChange={(event) => choose(card, event.target.value as Visibility)}
                className="mt-2 min-h-[var(--pxr-touch-target)] w-full rounded-[var(--pxr-radius-sm)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-3 text-[15px] text-[var(--pxr-text-primary)]"
              >
                {VISIBILITIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {next !== visibility && !open && (
                <button
                  type="button"
                  onClick={() => (widening ? openPreview(card) : void apply(card, next, false))}
                  aria-busy={pending === card.id}
                  className="mt-4 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white aria-[busy=true]:opacity-60"
                >
                  {pending === card.id ? "変更しています" : widening ? "共有前の表示を確認" : "この範囲に変更する"}
                </button>
              )}

              {open && (
                <div className="mt-5 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] px-4 py-4">
                  <p className="text-[15px] font-medium leading-[1.7] text-[var(--pxr-text-primary)]">
                    ここに書かれている内容が、{labelOf(next)}の範囲で見えるようになります。
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
                    みだしと「そこから何を持ち帰りますか」は共有されません。
                  </p>

                  {/* Reader order, not form order: state_context is the heading a reader sees above
                      the account itself (see discoverExperiences and invitedCard), so it comes first
                      here and the other three sharing-context fields follow the passage they qualify.
                      A preview that reordered the fields would not be a preview. */}
                  <div className="mt-5">
                    <label
                      htmlFor={`experience-share-${card.id}-stateContext`}
                      className="block text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]"
                    >
                      {SHARED_CONTEXT[0].label}
                    </label>
                    <p className="mt-1 text-[12px] leading-[1.8] text-[var(--pxr-text-muted)]">{SHARED_CONTEXT[0].hint}</p>
                    <textarea
                      id={`experience-share-${card.id}-stateContext`}
                      value={draft.stateContext}
                      onChange={(event) => setDraft((current) => ({ ...current, stateContext: event.target.value }))}
                      maxLength={SHARED_CONTEXT[0].max}
                      rows={3}
                      className="mt-2 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
                    />
                  </div>

                  {[
                    { label: "何が起きていたか", body: card.situation },
                    { label: "試したこと", body: card.actionTried },
                    { label: "自分にはどう感じられたか", body: card.perceivedOutcome },
                  ].map((entry) => (
                    <div key={entry.label} className="mt-5">
                      <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">{entry.label}</p>
                      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-primary)]">
                        {entry.body}
                      </p>
                    </div>
                  ))}

                  {SHARED_CONTEXT.slice(1).map((field) => (
                    <div key={field.id} className="mt-5">
                      <label
                        htmlFor={`experience-share-${card.id}-${field.id}`}
                        className="block text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]"
                      >
                        {field.label}
                      </label>
                      <p className="mt-1 text-[12px] leading-[1.8] text-[var(--pxr-text-muted)]">{field.hint}</p>
                      <textarea
                        id={`experience-share-${card.id}-${field.id}`}
                        value={draft[field.id]}
                        onChange={(event) => setDraft((current) => ({ ...current, [field.id]: event.target.value }))}
                        maxLength={field.max}
                        rows={3}
                        className="mt-2 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
                      />
                    </div>
                  ))}

                  <label
                    htmlFor={`experience-agree-${card.id}`}
                    className="mt-6 flex min-h-[var(--pxr-touch-target)] items-center gap-3 text-[15px] leading-[1.8] text-[var(--pxr-text-primary)]"
                  >
                    <input
                      id={`experience-agree-${card.id}`}
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="h-5 w-5 shrink-0"
                    />
                    <span>第三者の個人情報を含まず、この範囲で共有することに同意します。</span>
                  </label>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void apply(card, next, true)}
                      // Consent and completeness are "not allowed yet"; the request is aria-busy.
                      disabled={!agreed || !ready}
                      aria-busy={pending === card.id}
                      className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white disabled:opacity-60 aria-[busy=true]:opacity-60"
                    >
                      {pending === card.id ? "変更しています" : "この範囲で共有"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenId(null);
                        setAgreed(false);
                        setChoices((current) => ({ ...current, [card.id]: visibility }));
                      }}
                      className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                    >
                      やめておく
                    </button>
                  </div>
                  {!ready && (
                    <p className="mt-3 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
                      共有するには、上の四つの欄がすべて必要です。
                    </p>
                  )}
                </div>
              )}

              {failure?.id === card.id && (
                <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{failure.message}</p>
              )}
              {changed === card.id && (
                <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
                  公開範囲を変更しました。
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
