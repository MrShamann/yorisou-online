"use client";

import { useState } from "react";

import { buildShareText } from "@/packs/yorisou/daily-symbols/pack";

// DD-1 — sharing-lite: an explicit user action that hands the OS share sheet (or the clipboard)
// an allowlist-BUILT text derivative — pack display name, symbol name, one recognition line,
// generic attribution. Nothing persists, no URL exists, no recipient is recorded, and nothing
// personal (id, timestamp, history, state) can appear because the builder never receives it.
export default function ShareButton({
  symbolName,
  recognition,
  label,
}: {
  symbolName: string;
  recognition: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = buildShareText({ name: symbolName, recognition });
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ text });
        return;
      }
    } catch {
      // Dismissed or unavailable: fall through to the clipboard fallback.
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard unavailable too: keep quiet rather than erroring a share.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-8 py-3 text-[15px] font-medium text-[var(--pxr-text-primary)]"
    >
      {copied ? "コピーしました" : label}
    </button>
  );
}
