"use client";

import { useState } from "react";

import {
  MEMORY_LIFECYCLE_LABELS,
  MEMORY_TYPE_LABELS,
  type ExplicitMemory,
  type MemoryLifecycleState,
} from "@/lib/life-os/contract";
import { lifeDelete, lifeFailureMessage, lifeGet, lifePatch } from "@/lib/life-os/client";

// OSF-1 — 覚えていること.
//
// Everything on this screen was confirmed by the person, one item at a time. There is no "learned"
// section, no inferred section and no confidence score, because nothing here was inferred — the
// table it reads cannot hold an unconfirmed row (`check (user_confirmed = true)`).
//
// Deleting is a hard delete, and the copy says so. "Hidden", "archived" or "deactivated" would be a
// lie about what happens, and the one thing a memory surface has to be is honest about disappearing.
//
// Rewriting takes two steps, and nothing saves on blur. An edit REPLACES the sentence the person
// agreed to, so it asks for the agreement again rather than treating a stored memory as a text field
// that happens to be persisted. Leaving the edit restores what was there; only 「置きかえる」 writes.

type Edit = { id: string; draft: string; stage: "writing" | "confirming" };

export default function MemoryList({
  initialMemories,
  initialCursor = null,
}: {
  initialMemories: ExplicitMemory[];
  initialCursor?: string | null;
}) {
  const [memories, setMemories] = useState(initialMemories);
  // Paged, not capped. `cursor` is null exactly when there is nothing further to load.
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState<{ id: string; message: string } | null>(null);
  // One row at a time. Two open editors would let someone lose a sentence they meant to keep.
  const [edit, setEdit] = useState<Edit | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [editFailure, setEditFailure] = useState<{ id: string; message: string } | null>(null);
  // Revoking asks twice. It cannot be undone, so a single tap is the wrong shape for it.
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  // LIFECYCLE. Three verbs, because Memory Governance v1.0 §3.2 names three separate rights and
  // none of them is an alias for the others. Suppression is reversible; revocation is not, and the
  // confirmation copy says so before it happens rather than after.
  async function changeLifecycle(memory: ExplicitMemory, next: MemoryLifecycleState) {
    // The re-entry guard that `disabled` used to provide on the buttons below.
    //
    // WHY IT MOVED. A disabled button is blurred by the browser, so disabling the control someone
    // just pressed sends their focus to the document body — invisible with a pointer, and with a
    // keyboard it means every failure leaves them at the top of the page with the retry somewhere
    // below. The keyboard smoke found exactly that. The buttons now stay focusable and say
    // `aria-busy`; concurrency is prevented here, where the mutation is.
    //
    // PER ROW, and that word matters. The first version of this guard read `if (pending) return`,
    // which is not what `disabled={pending === memory.id}` did: it made every OTHER row's controls a
    // silent no-op while one row was in flight. Someone suppressing two memories in a row would press
    // the second, get no request, no message and no announcement, and be left believing they had.
    // Widening a guard is not the same as moving it.
    if (pending === memory.id) return;
    // Both failure slots, not one. They render in the same place, so a stale 「記録はそのままです」 from a
    // previous attempt would sit under a row whose state has since changed — asserting the record is
    // unchanged at the moment it changed.
    setFailed(null);
    setEditFailure(null);
    setPending(memory.id);
    const result = await lifePatch(`memories/${memory.id}`, { lifecycle: next, confirmed: true });
    setPending(null);
    if (!result.ok) {
      // A permission change is transactional with its audit row, so a failure means the record is
      // genuinely unchanged — which is what "記録はそのままです" asserts. The button that was pressed is
      // still on screen (pending is already cleared), and that is the retry.
      setEditFailure({ id: memory.id, message: lifeFailureMessage(result, "change") });
      return;
    }
    setMemories((current) =>
      current.map((row) =>
        row.id === memory.id
          ? { ...row, lifecycle_state: next, lifecycle_changed_at: new Date().toISOString() }
          : row,
      ),
    );
    // The retry succeeded, so the failure message must go. Without this, pressing the same button
    // again after a transient 500 left 「変更できませんでした。記録はそのままです。」 on screen beside a row
    // that now shows the new state — and making the pressed button the retry is exactly what makes
    // retry-after-failure the ordinary path.
    setEditFailure(null);
    setFailed(null);
    setConfirmRevoke(null);
  }

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    const result = await lifeGet<{ memories: ExplicitMemory[]; nextCursor: string | null }>(
      `memories?cursor=${encodeURIComponent(cursor)}`,
    );
    setLoadingMore(false);
    if (!result.ok) return;
    // Appended, never replaced: the rows already on screen are the ones the person is reading.
    setMemories((current) => [...current, ...result.data.memories]);
    setCursor(result.data.nextCursor);
  }

  async function remove(memory: ExplicitMemory) {
    // Per row, for the same reason as changeLifecycle — and this one guards a HARD DELETE, so a
    // silently refused press is the worst version of the mistake.
    if (pending === memory.id) return;
    setFailed(null);
    setEditFailure(null);
    setPending(memory.id);
    const result = await lifeDelete(`memories?id=${encodeURIComponent(memory.id)}`);
    setPending(null);
    if (!result.ok) {
      // Deletion is transactional with the receipt event, so a failure means BOTH that the memory is
      // still here and that no receipt was written for a deletion that did not happen. The message
      // carries the reason rather than a fixed sentence: a signed-out session and an unavailable
      // audit table are not the same news.
      setFailed({ id: memory.id, message: lifeFailureMessage(result, "delete") });
      return;
    }
    setMemories((current) => current.filter((item) => item.id !== memory.id));
  }

  function beginEdit(memory: ExplicitMemory) {
    setSaved(null);
    setEditFailure(null);
    setEdit({ id: memory.id, draft: memory.content, stage: "writing" });
  }

  async function save(memory: ExplicitMemory, next: string) {
    if (saving) return;
    setSaving(true);
    setEditFailure(null);
    const result = await lifePatch(`memories/${encodeURIComponent(memory.id)}`, {
      content: next,
      // Sent as its own field, and the route rejects anything that is not exactly `true`. The same
      // rule as creation: no confirmation, no write.
      confirmed: true,
    });
    setSaving(false);
    if (!result.ok) {
      // The sentence stays on screen and the edit stays open — nothing was written, and the message
      // says so, so there is something to try again with.
      setEditFailure({ id: memory.id, message: lifeFailureMessage(result) });
      return;
    }
    setMemories((current) =>
      current.map((item) => (item.id === memory.id ? { ...item, content: next } : item)),
    );
    setEdit(null);
    setSaved(memory.id);
  }

  if (memories.length === 0) {
    return (
      <p className="mt-6 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        まだ何も覚えていません。あなたが確認したものだけが、ここに残ります。
      </p>
    );
  }

  return (
    <ul className="mt-6 flex flex-col gap-3">
      {memories.map((memory) => {
        const editing = edit?.id === memory.id ? edit : null;
        const draft = editing?.draft.trim() ?? "";
        return (
          <li
            key={memory.id}
            className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4"
          >
            {/* THE RECEIPT, in one line rather than a compliance panel: what kind of thing this is,
                where it came from, when it was agreed, and what the product may currently do with
                it. Everything Memory Governance §3.2 asks a person to be able to see. */}
            <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
              {MEMORY_TYPE_LABELS[memory.memory_type]}
              {" · "}
              {memory.source === "user_statement" ? "自分で書いた" : "提案を確かめた"}
              {" · "}
              {new Date(memory.created_at).toLocaleDateString("ja-JP")}
              {memory.lifecycle_state !== "active" && (
                <>
                  {" · "}
                  <span className="text-[var(--pxr-text-secondary)]">
                    {MEMORY_LIFECYCLE_LABELS[memory.lifecycle_state]}
                  </span>
                </>
              )}
            </p>

            {editing?.stage === "writing" ? (
              <>
                <label htmlFor={`memory-edit-${memory.id}`} className="sr-only">
                  覚えていることの文章
                </label>
                <textarea
                  id={`memory-edit-${memory.id}`}
                  value={editing.draft}
                  onChange={(event) =>
                    setEdit({ id: memory.id, draft: event.target.value, stage: "writing" })
                  }
                  maxLength={2000}
                  rows={5}
                  className="mt-2 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
                />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEdit({ id: memory.id, draft: editing.draft, stage: "confirming" })}
                    // An empty sentence is not a memory, and a sentence that did not change would
                    // still record an edit that never happened.
                    disabled={draft.length === 0 || draft === memory.content}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white disabled:opacity-60"
                  >
                    この文章にする
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdit(null)}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
                  >
                    やめる
                  </button>
                </div>
              </>
            ) : editing ? (
              <>
                {/* Verbatim, complete — the sentence that will be stored is the sentence being
                    agreed to, and a truncated one makes the agreement meaningless. */}
                <p className="mt-2 whitespace-pre-wrap text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]">
                  {editing.draft}
                </p>
                <p className="mt-2 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
                  この文章に置きかえます。もとの文章は残りません。
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void save(memory, draft)}
                    aria-busy={saving}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white aria-[busy=true]:opacity-70"
                  >
                    {saving ? "保存しています" : "置きかえる"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdit({ id: memory.id, draft: editing.draft, stage: "writing" })}
                    disabled={saving}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
                  >
                    書き直す
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdit(null)}
                    disabled={saving}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
                  >
                    やめる
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 whitespace-pre-wrap text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]">
                  {memory.content}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => beginEdit(memory)}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                  >
                    書きかえる
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(memory)}
                    aria-busy={pending === memory.id}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                  >
                    {pending === memory.id ? "消しています" : "忘れる"}
                  </button>
                  {/* Suppression is the reversible middle ground: the memory stays, and the product
                      stops using it. Offered before 忘れる so the gentler option is the nearer one. */}
                  {memory.lifecycle_state === "active" && (
                    <button
                      type="button"
                      onClick={() => void changeLifecycle(memory, "suppressed")}
                      aria-busy={pending === memory.id}
                      className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                    >
                      いまは使わない
                    </button>
                  )}
                  {memory.lifecycle_state === "suppressed" && (
                    <button
                      type="button"
                      onClick={() => void changeLifecycle(memory, "active")}
                      aria-busy={pending === memory.id}
                      className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                    >
                      また使う
                    </button>
                  )}
                  {/* Revoking cannot be undone, so it asks twice and says why in between. */}
                  {memory.lifecycle_state !== "revoked" && confirmRevoke !== memory.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmRevoke(memory.id)}
                      aria-busy={pending === memory.id}
                      className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                    >
                      もう使わないことにする
                    </button>
                  )}
                </div>
              </>
            )}

            {confirmRevoke === memory.id && (
              <div className="mt-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] px-4 py-3">
                <p className="text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
                  これ以降、この記録が使われることはありません。あとから戻すことはできません。文章は残るので、
                  消したいときは「忘れる」を選んでください。
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void changeLifecycle(memory, "revoked")}
                    aria-busy={pending === memory.id}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-5 text-[15px] text-[var(--pxr-text-primary)]"
                  >
                    もう使わない
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRevoke(null)}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
                  >
                    やめておく
                  </button>
                </div>
              </div>
            )}

            {memory.lifecycle_state === "revoked" && (
              <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                この記録はもう使われません。消すこともできます。
              </p>
            )}

            {saved === memory.id && (
              <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                書きかえました。
              </p>
            )}
            {/* role="alert" on both: the control that was pressed is above the message, so without an
                announcement a screen-reader user gets silence and no indication that anything
                happened. Focus is not moved — it stays on the button, which is also the retry. */}
            {editFailure?.id === memory.id && (
              <p role="alert" className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                {editFailure.message}
              </p>
            )}
            {failed?.id === memory.id && (
              <p role="alert" className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                {failed.message}
              </p>
            )}
          </li>
        );
      })}
      {cursor && (
        <li className="mt-2 list-none">
          <button
            type="button"
            onClick={() => void loadMore()}
            // loadMore() already refuses to re-enter, so `disabled` would only cost the person their
            // focus at the exact moment the next page arrives underneath them.
            aria-busy={loadingMore}
            className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
          >
            {loadingMore ? "読み込んでいます" : "もっと見る"}
          </button>
        </li>
      )}
    </ul>
  );
}
