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
  traitChips?: [string, string, string];
  recognitionLine?: string;
  className?: string;
};

export default function LocalResultSave({
  resultType,
  resultLabel,
  context,
  baseResultId,
  overlayId,
  confidenceBand,
  traitChips,
  recognitionLine,
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
      traitChips,
      recognitionLine,
      source: "local-browser",
      version: "v0.2",
      resultPath: "/result",
      continuePath: "/result/continue",
      context,
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleSave}
          data-save-action="local-browser-save"
          className="inline-flex min-h-[48px] items-center justify-center rounded-[1.1rem] border border-[rgba(201,211,195,0.72)] bg-[rgba(252,250,245,0.9)] px-4 py-3 text-[14px] font-semibold text-[var(--text)] shadow-[0_6px_14px_rgba(47,35,33,0.03)] transition hover:-translate-y-0.5 hover:opacity-95"
        >
          {hasSaved ? "この端末に残しています" : "この端末に残す"}
        </button>
        <Link
          href="/saved"
          className="inline-flex min-h-[48px] items-center justify-center rounded-[1.1rem] border border-transparent bg-transparent px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)] transition hover:-translate-y-0.5 hover:opacity-95"
        >
          あとで見返す
        </Link>
      </div>
      <p className="text-[12px] leading-7 text-[var(--muted)]">
        この保存はブラウザ内の簡易保存です。アカウント保存やLINE連携ではありません。あとで自分のリズムを見返すための小さな記録になります。
      </p>
    </div>
  );
}
