"use client";

import { useState } from "react";

// CPR-1 — the pair invitation control on the Result page.
//
// SEMANTICALLY SEPARATE FROM SHARING, on purpose. A ShareObject makes a card readable by anyone
// holding a public link; a pair invitation asks ONE chosen person to contribute their own result
// so the two can be read side by side. Mixing them into one "share" affordance would blur a
// public act with a mutual one, so this lives in its own block with its own explanation.
//
// Nothing is sent anywhere automatically: the person receives a link and passes it on themselves.
// There is no email, SMS or LINE integration here, and no "invite more friends" prompt.

export default function PairInviteActions({ resultRowId }: { resultRowId: string }) {
  const [stage, setStage] = useState<"idle" | "explaining" | "ready">("idle");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/connect/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultRowId }),
      });
      const data = (await response.json().catch(() => ({}))) as { invite_path?: string; error?: string };
      if (!response.ok || !data.invite_path) {
        setError(
          data.error === "connection_source_not_invitable"
            ? "この結果はいま使えません。"
            : "いま作成できませんでした。時間をおいて試してみてください。",
        );
        setPending(false);
        return;
      }
      setInviteUrl(new URL(data.invite_path, window.location.origin).toString());
      setStage("ready");
    } catch {
      setError("通信できませんでした。時間をおいて試してみてください。");
    }
    setPending(false);
  }

  async function copy() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
    } catch {
      setError("コピーできませんでした。リンクを長押しして選んでください。");
    }
  }

  async function share() {
    if (!inviteUrl || typeof navigator.share !== "function") return;
    try {
      await navigator.share({ title: "ふたりのImairo", url: inviteUrl });
    } catch {
      // A cancelled share sheet is a normal outcome, not an error worth showing.
    }
  }

  if (stage === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStage("explaining")}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--pxr-border-subtle)] px-6 text-[14px] font-semibold text-[var(--pxr-text-primary)]"
      >
        ふたりで見比べる
      </button>
    );
  }

  if (stage === "explaining") {
    return (
      <div>
        <p className="text-[14px] font-semibold text-[var(--pxr-text-primary)]">
          招待リンクを作ると、どうなりますか
        </p>
        <ul className="mt-3 flex list-none flex-col gap-2 p-0 text-[13.5px] leading-[1.85] text-[var(--pxr-text-secondary)]">
          <li>リンクを開いた人が、自分の結果を出して受け取ると、ふたりのページができます。</li>
          <li>あなたの回答やレポート、記録は共有されません。</li>
          <li>受け取る前の相手には、あなたの結果は表示されません。</li>
          <li>どちらからでも、あとでやめられます。</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={create}
            disabled={pending}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--yorisou-color-primary-600)] px-6 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {pending ? "作成しています…" : "招待リンクを作る"}
          </button>
          <button
            type="button"
            onClick={() => setStage("idle")}
            disabled={pending}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-[14px] font-semibold text-[var(--pxr-text-secondary)] disabled:opacity-60"
          >
            もどる
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-[13.5px] leading-[1.8] text-[var(--pxr-text-secondary)]">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-[14px] leading-[1.85] text-[var(--pxr-text-secondary)]">
        リンクができました。渡したい相手にだけ送ってください。
      </p>
      <p className="mt-3 break-all rounded-xl bg-[var(--pxr-surface-muted,rgba(0,0,0,0.03))] px-4 py-3 text-[13px] text-[var(--pxr-text-primary)]">
        {inviteUrl}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--pxr-border-subtle)] px-6 text-[14px] font-semibold text-[var(--pxr-text-primary)]"
        >
          {copied ? "コピーしました" : "リンクをコピー"}
        </button>
        {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
          <button
            type="button"
            onClick={share}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--pxr-border-subtle)] px-6 text-[14px] font-semibold text-[var(--pxr-text-primary)]"
          >
            送る
          </button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-[13.5px] leading-[1.8] text-[var(--pxr-text-secondary)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
