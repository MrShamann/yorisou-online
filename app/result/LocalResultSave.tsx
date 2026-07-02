"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { readSavedResultRecord, saveResultRecord, subscribeSavedResult, type SavedResultRecord } from "./saveState";

type LocalResultSaveProps = {
  resultType: string;
  resultLabel: string;
  context: SavedResultRecord["context"];
  baseResultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  payloadKey?: string;
  traitChips?: [string, string, string];
  recognitionLine?: string;
  resultPath?: string;
  continuePath?: string;
  className?: string;
};

export default function LocalResultSave({
  resultType,
  resultLabel,
  context,
  baseResultId,
  overlayId,
  confidenceBand,
  payloadKey,
  traitChips,
  recognitionLine,
  resultPath = "/result",
  continuePath = "/result/continue",
  className = "",
}: LocalResultSaveProps) {
  const savedRecord = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const hasSaved = Boolean(savedRecord && savedRecord.resultLabel === resultLabel);

  const handleSave = () => {
    saveResultRecord({
      savedAt: new Date().toISOString(),
      resultType,
      resultLabel,
      baseResultId,
      overlayId,
      confidenceBand,
      payloadKey,
      traitChips,
      recognitionLine,
      source: "local-browser",
      version: "v0.2",
      resultPath,
      continuePath,
      context,
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-1.5">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">あとで見返す</p>
        <p className="text-[12px] leading-6 text-[var(--muted)]">
          この端末のブラウザ内にだけ、簡単に残せます。LINEアカウントとの連携ではありません。
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleSave}
          data-save-action="local-browser-save"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[1rem] border border-[rgba(201,211,195,0.64)] bg-[rgba(255,253,249,0.72)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:opacity-95"
        >
          {hasSaved ? "この端末に残しています" : "この端末に残す"}
        </button>
        <Link
          href="/saved"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[1rem] border border-transparent bg-transparent px-4 py-2.5 text-[13px] font-semibold text-[var(--accent-sage-text)] transition hover:-translate-y-0.5 hover:opacity-95"
        >
          保存した結果を見る
        </Link>
      </div>
    </div>
  );
}
