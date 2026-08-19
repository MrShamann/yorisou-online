"use client";

import { useState } from "react";

// SHR-1 — the formal ShareObject flow for the persisted-owner result: mandatory preview, explicit
// publish, revocable deep link. The client sends ONLY {resultRowId} and, on publish, the preview
// digest — never card copy: the server rebuilds everything and refuses a stale digest, so what the
// person previewed is what becomes public, exactly.
//
// Calm by rule: no countdown, no urgency, no score, no social pressure. One action per state.

type PreviewPayload = {
  test_name: string;
  result_code: string;
  display_line: string;
  code_line: string;
  recognition_line: string;
  share_line: string;
  highlights: { label: string; text: string }[];
  hero_chips: string[];
  global_note: string;
};

type Phase =
  | { kind: "idle" }
  | { kind: "previewing"; payload: PreviewPayload; digest: string }
  | { kind: "published"; publicId: string }
  | { kind: "error"; message: string };

const GENERIC_ERROR = "うまく届きませんでした。少しおいて、もう一度お試しください。";

export default function ShareObjectActions({
  resultRowId,
  activePublicId,
}: {
  resultRowId: string;
  activePublicId: string | null;
}) {
  const [phase, setPhase] = useState<Phase>(
    activePublicId ? { kind: "published", publicId: activePublicId } : { kind: "idle" },
  );
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = (publicId: string) =>
    typeof window === "undefined" ? `/share/${publicId}` : new URL(`/share/${publicId}`, window.location.origin).toString();

  async function loadPreview() {
    if (pending) return;
    setPending(true);
    setCopied(false);
    try {
      const response = await fetch("/api/shares/imairo/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultRowId }),
      });
      if (!response.ok) {
        setPhase({ kind: "error", message: GENERIC_ERROR });
        return;
      }
      const data = (await response.json()) as { payload: PreviewPayload; digest: string };
      setPhase({ kind: "previewing", payload: data.payload, digest: data.digest });
    } catch {
      setPhase({ kind: "error", message: GENERIC_ERROR });
    } finally {
      setPending(false);
    }
  }

  async function publish(digest: string) {
    if (pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/shares/imairo/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultRowId, previewDigest: digest }),
      });
      if (!response.ok) {
        setPhase({ kind: "error", message: GENERIC_ERROR });
        return;
      }
      const data = (await response.json()) as { public_id: string };
      setPhase({ kind: "published", publicId: data.public_id });
    } catch {
      setPhase({ kind: "error", message: GENERIC_ERROR });
    } finally {
      setPending(false);
    }
  }

  async function revoke(publicId: string) {
    if (pending) return;
    setPending(true);
    setCopied(false);
    try {
      const response = await fetch(`/api/shares/${publicId}/revoke`, { method: "POST" });
      if (!response.ok) {
        setPhase({ kind: "error", message: GENERIC_ERROR });
        return;
      }
      setPhase({ kind: "idle" });
    } catch {
      setPhase({ kind: "error", message: GENERIC_ERROR });
    } finally {
      setPending(false);
    }
  }

  async function shareLink(publicId: string) {
    const url = shareUrl(publicId);
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ url });
        return;
      }
    } catch {
      // dismissed / unavailable — clipboard fallback below
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // clipboard unavailable: stay quiet rather than erroring a share
    }
  }

  const buttonPrimary =
    "inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-60";
  const buttonSecondary =
    "inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-6 py-3 text-[14px] font-medium text-[var(--pxr-text-primary)] disabled:opacity-60";

  if (phase.kind === "previewing") {
    return (
      <div className="grid gap-3">
        <p className="text-[13px] font-medium text-[var(--pxr-text-muted)]">シェアする内容を確認</p>
        {/* The preview IS the public card: exactly what the digest locks, nothing more. */}
        <div className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] p-4">
          <p className="text-[12px] text-[var(--pxr-text-muted)]">{phase.payload.test_name}</p>
          <p className="mt-1 text-[16px] font-semibold leading-[1.6] text-[var(--pxr-text-primary)]">
            {phase.payload.display_line}
          </p>
          <p className="text-[13px] text-[var(--pxr-text-secondary)]">{phase.payload.code_line}</p>
          <p className="mt-2 text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            {phase.payload.recognition_line}
          </p>
          <p className="mt-2 text-[12px] leading-[1.8] text-[var(--pxr-text-muted)]">{phase.payload.global_note}</p>
        </div>
        <p className="text-[12px] leading-[1.8] text-[var(--pxr-text-muted)]">
          この内容が、リンクを知っている人に公開されます。
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => publish(phase.digest)} disabled={pending} className={buttonPrimary}>
            この内容でシェア
          </button>
          <button type="button" onClick={() => setPhase({ kind: "idle" })} disabled={pending} className={buttonSecondary}>
            やめる
          </button>
        </div>
      </div>
    );
  }

  if (phase.kind === "published") {
    return (
      <div className="grid gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => shareLink(phase.publicId)} disabled={pending} className={buttonPrimary}>
            {copied ? "コピーしました" : "共有リンクをシェア"}
          </button>
          <button type="button" onClick={() => revoke(phase.publicId)} disabled={pending} className={buttonSecondary}>
            共有リンクを無効にする
          </button>
        </div>
        <p className="text-[12px] leading-[1.8] text-[var(--pxr-text-muted)]">
          無効にすると、共有したリンクは開けなくなります。
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <button type="button" onClick={loadPreview} disabled={pending} className={buttonPrimary}>
        シェアする内容を確認
      </button>
      {phase.kind === "error" && (
        <p role="alert" className="text-[12px] leading-[1.8] text-[var(--pxr-text-muted)]">
          {phase.message}
        </p>
      )}
    </div>
  );
}
