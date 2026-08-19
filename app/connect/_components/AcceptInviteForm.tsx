"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// CPR-1 — the acceptance control. The consent text above it is rendered by the SERVER page; this
// component only performs the action the person already read about.
//
// It sends the invite id and the person's OWN chosen result row id. It never sends an account id,
// and it never receives anything about the inviter — the response is a pair id and nothing else.

type Source = { resultRowId: string; nickname: string; producedAt: string };

export default function AcceptInviteForm({
  publicInviteId,
  sources,
}: {
  publicInviteId: string;
  sources: Source[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(sources[0]?.resultRowId ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    if (!selected || pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/connect/invite/${publicInviteId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultRowId: selected }),
      });
      const data = (await response.json().catch(() => ({}))) as { pair_path?: string; error?: string };
      if (!response.ok || !data.pair_path) {
        setError(
          data.error === "connection_acceptor_source_unavailable"
            ? "選んだ結果はいま使えません。別の結果を選んでみてください。"
            : "この招待はいま受け取れません。相手に確認してみてください。",
        );
        setPending(false);
        return;
      }
      router.push(data.pair_path);
    } catch {
      setError("通信できませんでした。時間をおいて試してみてください。");
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      {sources.length > 1 ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="text-[14px] font-semibold text-[var(--pxr-text-primary)]">
            どの結果を使いますか
          </legend>
          <div className="mt-3 flex flex-col gap-2">
            {sources.map((source) => (
              <label
                key={source.resultRowId}
                className="flex min-h-[48px] items-center gap-3 rounded-xl border border-[var(--yorisou-color-neutral-100)] px-4 py-3 text-[14px] text-[var(--pxr-text-primary)]"
              >
                <input
                  type="radio"
                  name="pair-source"
                  value={source.resultRowId}
                  checked={selected === source.resultRowId}
                  onChange={() => setSelected(source.resultRowId)}
                />
                <span>
                  {source.nickname}
                  <span className="ml-2 text-[12px] text-[var(--pxr-text-muted)]">
                    {new Date(source.producedAt).toLocaleDateString("ja-JP")}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <button
        type="button"
        onClick={accept}
        disabled={pending || !selected}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--yorisou-color-primary-600)] px-6 text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {pending ? "受け取っています…" : "同意して受け取る"}
      </button>

      {error ? (
        <p role="alert" className="mt-4 text-[14px] leading-[1.8] text-[var(--pxr-text-secondary)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
