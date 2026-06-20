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
    <section className="space-y-2.5 rounded-[1.3rem] border border-[rgba(201,211,195,0.82)] bg-[linear-gradient(180deg,rgba(248,250,245,0.98)_0%,rgba(239,244,237,0.98)_100%)] p-3 text-[var(--text)] shadow-[0_12px_24px_rgba(47,35,33,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex rounded-full border border-[rgba(201,211,195,0.9)] bg-white/70 px-3 py-1 text-[10px] tracking-[0.24em] text-[var(--accent-sage-text)]">
            共有
          </div>
          <div className="text-[14px] font-semibold text-[var(--text)]">
            シェアする
          </div>
          <p className="text-[11px] leading-6 text-[var(--muted)]">
            端末の共有シートが開きます。
          </p>
        </div>
        <a
          href={shareCardTargetUrl}
          onClick={() => emit("share_card_opened", "share_card_opened", "share_card")}
          className="rounded-full border border-[rgba(201,211,195,0.88)] bg-white/76 px-3 py-1.5 text-[10px] font-semibold text-[var(--accent-sage-text)]"
        >
          共有カード
        </a>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[50px] items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(34,48,43,1)_0%,rgba(18,20,19,1)_100%)] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_16px_28px_rgba(4,8,7,0.18)]"
        >
          {shareSheetLabel}
        </button>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={handleSaveImage}
            className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-2.5 py-2 text-[11px] font-medium text-[var(--text)]"
          >
            {imageSaveLabel}
          </button>
          <button
            type="button"
            onClick={handleCopyPost}
            className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-2.5 py-2 text-[11px] font-medium text-[var(--text)]"
          >
            文案コピー
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-2.5 py-2 text-[11px] font-medium text-[var(--text)]"
          >
            リンクコピー
          </button>
        </div>
      </div>

      {showFallback || !hasNativeShare ? (
        <details open className="space-y-2 rounded-[1.05rem] border border-[rgba(201,211,195,0.78)] bg-white/64 p-2.5 text-[var(--text)]">
          <summary className="cursor-pointer list-none text-[11px] font-semibold text-[var(--accent-sage-text)]">
            その他の共有
          </summary>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleXShare}
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-3 py-2 text-[11px] font-medium text-[var(--text)]"
            >
              Xで開く
            </button>
            <button
              type="button"
              onClick={handleLineShare}
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-3 py-2 text-[11px] font-medium text-[var(--text)]"
            >
              LINEで送る
            </button>
            <button
              type="button"
              onClick={handleFacebookShare}
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-3 py-2 text-[11px] font-medium text-[var(--text)]"
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => emit("share_card_opened", "share_card_opened", "share_card")}
              className="inline-flex min-h-[40px] items-center justify-center rounded-[0.9rem] border border-[rgba(201,211,195,0.9)] bg-white/82 px-3 py-2 text-[11px] font-medium text-[var(--text)]"
            >
              {cardLabel}
            </button>
          </div>
        </details>
      ) : null}

      <div className="text-[11px] leading-6 text-[var(--muted)]">
        {copyState === "copied" && copyNote ? `${copyNote}` : null}
        {copyState === "error" ? "コピーに失敗しました。共有メニューから再度お試しください。" : null}
        {copyState === "idle" && !hasNativeShare ? "この端末では共有メニューが使えないため、下の方法をご利用ください。" : null}
      </div>
    </section>
  );
}
