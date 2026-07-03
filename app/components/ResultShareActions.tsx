"use client";

import { useMemo, useState } from "react";

import { trackDteEvent } from "./DteEventTracker";

type Props = {
  locale?: "ja" | "en";
  shareUrl: string;
  shareTitle: string;
  shareText: string;
  shareCardUrl?: string | null;
  completionId?: string | null;
  personaId?: string | null;
  shareSurface?: string | null;
  showCopyLink?: boolean;
};

function resolvePublicUrl(value: string) {
  if (!value) {
    return "https://yorisou.online/line/mini-app";
  }

  if (typeof window === "undefined") {
    return value;
  }

  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return value;
  }
}

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

export default function ResultShareActions({
  locale = "ja",
  shareUrl,
  shareTitle,
  shareText,
  completionId = null,
  personaId = null,
  shareSurface = null,
  showCopyLink = true,
}: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [copyNote, setCopyNote] = useState<string | null>(null);
  const shareTargetUrl = useMemo(() => shareUrl, [shareUrl]);
  const shareMessage = useMemo(() => shareText, [shareText]);
  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const shareSheetLabel = locale === "en" ? "Share" : "シェアする";
  const copyLinkLabel = locale === "en" ? "Copy link" : "リンクをコピー";

  const emit = (event: string, action: string, target: string | null = null) => {
    void trackDteEvent({
      event,
      action,
      source: "result",
      surface: "result",
      shareSurface,
      completionId,
      personaId,
      resultKey: personaId,
      triggerKey: target,
      branchId: "yorisou_dte",
      sourceBranchId: "yorisou_dte",
      visibilityPolicy: "public",
      crossBranchAccessPolicy: "explicit_bridge",
    });
  };

  const handleShare = async () => {
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
    emit("share_clicked", "share_click", "primary");
    emit("share_native_opened", "share_native", "native");

    if (hasNativeShare) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: resolvedShareUrl,
        });
        emit("share_native_completed", "share_native_completed", "native");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          emit("share_native_cancelled", "share_native_cancelled", "native");
          return;
        }
        emit("share_native_failed", "share_native_failed", "copy");
      }
    }

    const copied = await copyText(`${shareText}\n${resolvedShareUrl}`.trim());
    setCopyState(copied ? "copied" : "error");
    setCopyNote(copied ? "投稿文をコピーしました" : null);
    emit("share_native_fallback", copied ? "share_native_fallback_copy" : "share_native_fallback_failed", "copy");
  };

  const handleCopy = async () => {
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
    emit("share_copy_link", "copy_link", "clipboard");
    const copied = await copyText(resolvedShareUrl);
    setCopyState(copied ? "copied" : "error");
    setCopyNote(copied ? "リンクをコピーしました" : null);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_28px_rgba(23,59,53,0.24)] transition active:scale-[0.975]"
        style={{ background: "#173B35" }}
      >
        {shareSheetLabel}
      </button>

      {showCopyLink ? (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[1rem] border px-4 py-2.5 text-[13px] font-semibold transition active:scale-[0.975]"
          style={{
            borderColor: "rgba(23,59,53,0.14)",
            background: "rgba(23,59,53,0.04)",
            color: "#315F50",
          }}
        >
          {copyLinkLabel}
        </button>
      ) : null}

      {copyState !== "idle" ? (
        <p className="text-center text-[11px] leading-6 text-[#9A9088]">
          {copyState === "copied" && copyNote ? copyNote : null}
          {copyState === "error" ? "コピーに失敗しました。" : null}
        </p>
      ) : null}
    </div>
  );
}
