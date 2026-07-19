"use client";

import { useMemo, useState } from "react";

import {
  resolveShareCard,
  buildShareImagePath,
  buildShareText,
  type ShareCardInput,
  type ShareCardFormat,
} from "@/app/lib/share/shareCard";

// AIX-4 — real result-share actions (Founder Finding B). One shared UI for every
// result surface: generate an image (square / story), share it as a file where
// the browser supports it, otherwise download / copy-link / share-text. Never
// pretends an unavailable system share exists on desktop. Token-driven so it
// renders in the dark Product-Focus result and the light LINE context.

type ShareState = "idle" | "working" | "shared" | "downloaded" | "copied" | "error";

async function fetchImageFile(path: string, filename: string): Promise<File | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  } catch {
    return null;
  }
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ShareResultActions({
  input,
  trackingTestId,
  onShareEvent,
}: {
  input: ShareCardInput;
  trackingTestId?: string;
  onShareEvent?: (action: string) => void;
}) {
  const model = useMemo(() => resolveShareCard(input), [input]);
  const squarePath = buildShareImagePath(model, "square");
  const storyPath = buildShareImagePath(model, "story");
  const shareText = buildShareText(model);
  const [state, setState] = useState<ShareState>("idle");
  const [note, setNote] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  const canFileShare =
    typeof navigator !== "undefined" && typeof navigator.canShare === "function";

  function track(action: string) {
    onShareEvent?.(action);
  }

  async function shareImage(format: ShareCardFormat) {
    setState("working");
    setNote("");
    const path = format === "story" ? storyPath : squarePath;
    const filename = `yorisou-${trackingTestId || "result"}-${format}.png`;
    const file = await fetchImageFile(path, filename);
    if (!file) {
      setState("error");
      setNote("画像を作成できませんでした。時間をおいて再度お試しください。");
      return;
    }
    // Preferred: native file share (mobile / supported browsers).
    if (canFileShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: shareText, url: model.url });
        setState("shared");
        setNote("シェアシートを開きました。");
        track(`share_image_${format}`);
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          setState("idle");
          return;
        }
        // fall through to download
      }
    }
    // Fallback: download the PNG (desktop / unsupported).
    triggerDownload(path, filename);
    setState("downloaded");
    setNote("画像をダウンロードしました。保存先からシェアできます。");
    track(`download_image_${format}`);
  }

  function saveImage() {
    triggerDownload(squarePath, `yorisou-${trackingTestId || "result"}-square.png`);
    setState("downloaded");
    setNote("画像を保存しました。");
    track("save_image_square");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(model.url);
      setState("copied");
      setNote("リンクをコピーしました。");
      track("copy_link");
    } catch {
      setState("error");
      setNote("コピーできませんでした。リンク: " + model.url);
    }
  }

  return (
    <div className="rounded-[18px] border border-[var(--yr-hair)] bg-[var(--yr-panel)] px-5 py-5">
      <p className="text-[12px] font-semibold tracking-[0.1em] text-[color:var(--yr-accent-text)]">結果をシェア</p>
      <p className="mt-1 text-[13px] leading-7 text-[color:var(--yr-text-mut)]">
        画像は公開しても安全な内容だけでできています。回答や非公開のメモは含まれません。
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button type="button" onClick={() => shareImage("square")} disabled={state === "working"} className="yr-btn yr-btn-primary !min-h-[46px] !text-[14px] disabled:opacity-60">
          {state === "working" ? "作成中…" : "画像をシェア"}
        </button>
        <button type="button" onClick={() => shareImage("story")} disabled={state === "working"} className="yr-btn yr-btn-ghost !min-h-[46px] !text-[13px] disabled:opacity-60">
          ストーリー用
        </button>
        <button type="button" onClick={saveImage} className="yr-btn yr-btn-ghost !min-h-[46px] !text-[13px]">
          画像を保存
        </button>
        <button type="button" onClick={copyLink} className="yr-btn yr-btn-ghost !min-h-[46px] !text-[13px]">
          リンクをコピー
        </button>
      </div>

      {note ? (
        <p role="status" className="mt-3 text-[12px] leading-6 text-[color:var(--yr-text-faint)]">
          {note}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setShowPreview((v) => !v)}
        className="mt-3 text-[12px] font-semibold text-[color:var(--yr-accent-text)] underline-offset-4 hover:underline"
        aria-expanded={showPreview}
      >
        {showPreview ? "共有される内容を隠す" : "共有される内容を確認する"}
      </button>
      {showPreview ? (
        <div className="mt-2 rounded-[14px] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-4 py-3.5 text-[12px] leading-7 text-[color:var(--yr-text-mut)]">
          <p><span className="text-[color:var(--yr-text-faint)]">テスト：</span>{model.testLabel}</p>
          <p><span className="text-[color:var(--yr-text-faint)]">結果名：</span>{model.title}</p>
          <p><span className="text-[color:var(--yr-text-faint)]">一言：</span>{model.line}</p>
          {model.traits.length ? (
            <p><span className="text-[color:var(--yr-text-faint)]">特徴：</span>{model.traits.join("・")}</p>
          ) : null}
          <p><span className="text-[color:var(--yr-text-faint)]">リンク：</span>{model.url.replace("https://", "")}</p>
        </div>
      ) : null}
    </div>
  );
}
