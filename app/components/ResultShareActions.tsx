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
};

function encodeShareUrl(value: string) {
  return encodeURIComponent(value);
}

function joinShareText(title: string, text: string) {
  return [title, text].filter(Boolean).join("\n");
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
  shareCardUrl,
  completionId = null,
  personaId = null,
  shareSurface = null,
}: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const shareTargetUrl = useMemo(() => shareUrl, [shareUrl]);
  const shareCardTargetUrl = useMemo(() => shareCardUrl || shareUrl, [shareCardUrl, shareUrl]);
  const shareMessage = useMemo(() => joinShareText(shareTitle, shareText), [shareTitle, shareText]);
  const copyLabel = locale === "en" ? "Link copied" : copyState === "copied" ? "リンクをコピーしました" : "リンクをコピー";
  const shareSheetLabel = locale === "en" ? "Share" : "シェアする";

  const openWindow = (url: string) => {
    if (typeof window === "undefined") {
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
    emit("share_clicked", "share", "native");
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: shareTargetUrl,
        });
        emit("share_target_selected", "share_success", "native");
        return;
      } catch {
        // Fall through to copy fallback.
      }
    }

    const copied = await copyText(`${shareMessage}\n${shareTargetUrl}`.trim());
    setCopyState(copied ? "copied" : "error");
    emit("share_target_selected", copied ? "share_fallback_copy" : "share_fallback_failed", "copy");
  };

  const handleCopy = async () => {
    emit("copy_link_clicked", "copy_link", "clipboard");
    const copied = await copyText(shareTargetUrl);
    setCopyState(copied ? "copied" : "error");
  };

  const handleXShare = () => {
    emit("x_share_clicked", "x_share", "x");
    openWindow(`https://x.com/intent/tweet?text=${encodeShareUrl(shareMessage)}&url=${encodeShareUrl(shareTargetUrl)}`);
  };

  const handleLineShare = () => {
    emit("line_share_clicked", "line_share", "line");
    openWindow(`https://social-plugins.line.me/lineit/share?url=${encodeShareUrl(shareTargetUrl)}`);
  };

  const handleFacebookShare = () => {
    emit("share_target_selected", "facebook_share", "facebook");
    openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeShareUrl(shareTargetUrl)}`);
  };

  const handleSaveImage = () => {
    emit("save_image_clicked", "save_image", "share_card");
    openWindow(shareCardTargetUrl);
  };

  return (
    <section className="space-y-3 rounded-[1.45rem] border border-[rgba(125,141,121,0.14)] bg-[rgba(255,252,247,0.84)] p-4">
      <div className="space-y-1">
        <div className="text-[10px] tracking-[0.24em] text-[var(--muted)]">共有</div>
        <div className="text-[15px] font-semibold text-[var(--accent-sage-text)]">
          この結果をそのまま送れるようにする
        </div>
        <p className="text-[12px] leading-6 text-[var(--muted)]">
          SNSやLINEで共有しやすいリンクとカードを、まとめて開けます。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] bg-[var(--accent-sage-text)] px-4 py-3 text-[14px] font-semibold text-white"
        >
          {shareSheetLabel}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/80 px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)]"
        >
          {copyLabel}
        </button>
        <button
          type="button"
          onClick={handleXShare}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/80 px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)]"
        >
          Xで共有
        </button>
        <button
          type="button"
          onClick={handleLineShare}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/80 px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)]"
        >
          LINEで送る
        </button>
        <button
          type="button"
          onClick={handleFacebookShare}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/80 px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)]"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/80 px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)]"
        >
          画像で保存
        </button>
      </div>

      <div className="text-[11px] leading-5 text-[var(--muted)]">
        {copyState === "copied" ? "リンクをコピーしました。画像として保存してSNSでも使えます。" : null}
        {copyState === "error" ? "コピーに失敗しました。上のシェアボタンから再度お試しください。" : null}
      </div>
    </section>
  );
}
