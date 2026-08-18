"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// DD-1 — the explicit reveal action. Sends NOTHING: the server owns pack, date, timezone and
// selection; the POST body is empty on purpose and the API ignores bodies entirely. On success the
// route re-renders from the day's canonical row — which is also why a double-tap cannot draw twice.
export default function RevealButton({ label }: { label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function reveal() {
    if (pending) return;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/discovery/today", { method: "POST" });
      if (!response.ok) {
        setFailed(true);
        return;
      }
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={reveal}
        disabled={pending}
        className="inline-flex min-h-[var(--pxr-touch-target)] w-full items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-8 py-4 text-[16px] font-semibold text-white disabled:opacity-60 sm:w-auto"
      >
        {label}
      </button>
      {failed && (
        <p role="alert" className="mt-3 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
          うまく届きませんでした。少しおいて、もう一度お試しください。
        </p>
      )}
    </div>
  );
}
