"use client";

import { useState } from "react";

import { MEMORY_TYPE_LABELS, type ExplicitMemory } from "@/lib/life-os/contract";
import { lifeDelete, lifeFailureMessage, lifePatch } from "@/lib/life-os/client";

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

export default function MemoryList({ initialMemories }: { initialMemories: ExplicitMemory[] }) {
  const [memories, setMemories] = useState(initialMemories);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // One row at a time. Two open editors would let someone lose a sentence they meant to keep.
  const [edit, setEdit] = useState<Edit | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [editFailure, setEditFailure] = useState<{ id: string; message: string } | null>(null);

  async function remove(memory: ExplicitMemory) {
    setPending(memory.id);
    setFailed(null);
    const result = await lifeDelete(`memories?id=${encodeURIComponent(memory.id)}`);
    setPending(null);
    if (!result.ok) {
      setFailed(memory.id);
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
            <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
              {MEMORY_TYPE_LABELS[memory.memory_type]}
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
                    disabled={saving}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white disabled:opacity-70"
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
                    disabled={pending === memory.id}
                    className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
                  >
                    {pending === memory.id ? "消しています" : "忘れる"}
                  </button>
                </div>
              </>
            )}

            {saved === memory.id && (
              <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                書きかえました。
              </p>
            )}
            {editFailure?.id === memory.id && (
              <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                {editFailure.message}
              </p>
            )}
            {failed === memory.id && (
              <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                消せませんでした。まだ残っています。
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
