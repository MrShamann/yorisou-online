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
  shareCardUrl,
  completionId = null,
  personaId = null,
  shareSurface = null,
}: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [copyNote, setCopyNote] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const shareTargetUrl = useMemo(() => shareUrl, [shareUrl]);
  const shareCardTargetUrl = useMemo(() => shareCardUrl || shareUrl, [shareCardUrl, shareUrl]);
  const shareMessage = useMemo(() => shareText, [shareText]);
  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const shareSheetLabel = locale === "en" ? "Share" : "シェアする";
  const imageSaveLabel = locale === "en" ? "Save image" : "画像で保存";
  const cardLabel = locale === "en" ? "Open share card" : "共有カードを見る";

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
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
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

    setShowFallback(true);
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

  const handleCopyPost = async () => {
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
    emit("share_copy_text", "copy_text", "clipboard");
    const copied = await copyText(`${shareText}\n${resolvedShareUrl}`.trim());
    setCopyState(copied ? "copied" : "error");
    setCopyNote(copied ? "投稿文をコピーしました" : null);
  };

  const handleXShare = () => {
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
    emit("share_target_selected", "x_share", "x");
    openWindow(`https://x.com/intent/tweet?text=${encodeShareUrl(shareMessage)}&url=${encodeShareUrl(resolvedShareUrl)}`);
  };

  const handleLineShare = () => {
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
    emit("share_target_selected", "line_share", "line");
    openWindow(`https://social-plugins.line.me/lineit/share?url=${encodeShareUrl(resolvedShareUrl)}`);
  };

  const handleFacebookShare = () => {
    const resolvedShareUrl = resolvePublicUrl(shareTargetUrl);
    emit("share_target_selected", "facebook_share", "facebook");
    openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeShareUrl(resolvedShareUrl)}`);
  };

  const handleSaveImage = () => {
    emit("share_image_save_intent", "save_image", "share_card");
    openWindow(shareCardTargetUrl);
    emit("share_card_opened", "share_card_opened", "share_card");
  };

  return (
    <section className="space-y-3 rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,19,18,0.96)_0%,rgba(28,40,36,0.95)_100%)] p-4 text-white shadow-[0_18px_34px_rgba(10,16,14,0.16)]">
      <div className="space-y-1">
        <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] tracking-[0.24em] text-white/84">
          共有
        </div>
        <div className="text-[16px] font-semibold text-white">
          共有メニューを開く
        </div>
        <p className="text-[12px] leading-6 text-white/72">
          端末の共有シートから、LINEやX、メモへそのまま送れます。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[50px] items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(239,244,237,0.96)_100%)] px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)] shadow-[0_16px_28px_rgba(4,8,7,0.18)]"
        >
          {shareSheetLabel}
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/8 px-4 py-3 text-[14px] font-semibold text-white"
        >
          {imageSaveLabel}
        </button>
        <a
          href={shareCardTargetUrl}
          onClick={() => emit("share_card_opened", "share_card_opened", "share_card")}
          className="inline-flex min-h-[46px] items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/8 px-4 py-3 text-[14px] font-semibold text-white"
        >
          {cardLabel}
        </a>
      </div>

      {showFallback || !hasNativeShare ? (
        <details open className="space-y-2 rounded-[1.2rem] border border-white/12 bg-white/8 p-3 text-white">
          <summary className="cursor-pointer list-none text-[12px] font-semibold text-white/84">
            その他の共有
          </summary>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCopyPost}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] border border-white/12 bg-white/10 px-4 py-2 text-[13px] font-medium text-white"
            >
              投稿文をコピー
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] border border-white/12 bg-white/10 px-4 py-2 text-[13px] font-medium text-white"
            >
              リンクをコピー
            </button>
            <button
              type="button"
              onClick={handleXShare}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] border border-white/12 bg-white/10 px-4 py-2 text-[13px] font-medium text-white"
            >
              Xで開く
            </button>
            <button
              type="button"
              onClick={handleLineShare}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] border border-white/12 bg-white/10 px-4 py-2 text-[13px] font-medium text-white"
            >
              LINEで送る
            </button>
            <button
              type="button"
              onClick={handleFacebookShare}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] border border-white/12 bg-white/10 px-4 py-2 text-[13px] font-medium text-white"
            >
              Facebook
            </button>
          </div>
        </details>
      ) : null}

      <div className="text-[11px] leading-5 text-white/68">
        {copyState === "copied" && copyNote ? `${copyNote}` : null}
        {copyState === "error" ? "コピーに失敗しました。共有メニューから再度お試しください。" : null}
        {copyState === "idle" && !hasNativeShare ? "この端末では共有メニューが使えないため、下の方法をご利用ください。" : null}
      </div>
    </section>
  );
}
