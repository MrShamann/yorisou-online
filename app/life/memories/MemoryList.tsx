"use client";

import { useState } from "react";

import { MEMORY_TYPE_LABELS, type ExplicitMemory } from "@/lib/life-os/contract";
import { lifeOsPost } from "@/lib/life-os/client";

// OSF-1 — 覚えていること.
//
// Everything on this screen was confirmed by the person, one item at a time. There is no "learned"
// section, no inferred section and no confidence score, because nothing here was inferred — the
// table it reads cannot hold an unconfirmed row (`check (user_confirmed = true)`).
//
// Deleting is a hard delete, and the copy says so. "Hidden", "archived" or "deactivated" would be a
// lie about what happens, and the one thing a memory surface has to be is honest about disappearing.

export default function MemoryList({ initialMemories }: { initialMemories: ExplicitMemory[] }) {
  const [memories, setMemories] = useState(initialMemories);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  async function remove(memory: ExplicitMemory) {
    setPending(memory.id);
    setFailed(null);
    const result = await lifeOsPost({ action: "delete_memory", id: memory.id });
    setPending(null);
    if (!result.ok) {
      setFailed(memory.id);
      return;
    }
    setMemories((current) => current.filter((item) => item.id !== memory.id));
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
      {memories.map((memory) => (
        <li
          key={memory.id}
          className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4"
        >
          <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            {MEMORY_TYPE_LABELS[memory.memory_type]}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]">
            {memory.content}
          </p>
          <button
            type="button"
            onClick={() => void remove(memory)}
            disabled={pending === memory.id}
            className="mt-4 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)] underline underline-offset-4"
          >
            {pending === memory.id ? "消しています" : "忘れる"}
          </button>
          {failed === memory.id && (
            <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
              消せませんでした。まだ残っています。
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
