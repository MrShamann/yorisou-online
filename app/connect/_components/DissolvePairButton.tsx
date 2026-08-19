"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// CPR-1 — either participant ends the pair. Two-step by design: ending is irreversible for BOTH
// people, so it should not be one stray tap. There is no "are you sure?" modal — the confirm state
// is inline and dismissible, which is calmer and keeps the decision on the page it belongs to.

export default function DissolvePairButton({ pairPublicId }: { pairPublicId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function dissolve() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/connect/pair/${pairPublicId}/dissolve`, { method: "POST" });
      if (!response.ok) {
        setError("いま実行できませんでした。時間をおいて試してみてください。");
        setPending(false);
        return;
      }
      router.push("/connect");
      router.refresh();
    } catch {
      setError("通信できませんでした。時間をおいて試してみてください。");
      setPending(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--yorisou-color-neutral-200)] px-6 text-[14px] font-semibold text-[var(--pxr-text-secondary)]"
      >
        ふたりのページをやめる
      </button>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-[14px] leading-[1.85] text-[var(--pxr-text-primary)]">
        やめると、もとに戻せません。よろしいですか。
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={dissolve}
          disabled={pending}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--yorisou-color-neutral-200)] px-6 text-[14px] font-semibold text-[var(--pxr-text-primary)] disabled:opacity-60"
        >
          {pending ? "やめています…" : "やめる"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-[14px] font-semibold text-[var(--pxr-text-secondary)] disabled:opacity-60"
        >
          もどる
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-[14px] leading-[1.8] text-[var(--pxr-text-secondary)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
