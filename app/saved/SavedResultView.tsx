"use client";

import { useSyncExternalStore } from "react";

import Link from "next/link";
import { buildPublicResultHref } from "../check-in/resultCompatibility";
import { clearSavedResultRecord, readSavedResultRecord, subscribeSavedResult, type SavedResultRecord } from "../result/saveState";

function formatSavedAt(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "保存時刻はこの端末で確認できます。";
  }
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

function getSavedContextCopy(context?: "public-result" | "private-insight") {
  if (context === "private-insight") {
    return { pill: "自分だけのヒントのあとに保存", note: "自分だけのヒントを見たあとに保存されています。この保存にも、本文や回答内容は含めていません。" };
  }
  if (context === "public-result") {
    return { pill: "結果カードから保存", note: "最初に見た結果カードから保存されています。この保存にも、自分だけのヒントの本文や回答内容は含めていません。" };
  }
  return { pill: "この端末内の簡易保存", note: "この端末内の簡易保存です。アカウント保存やLINE連携ではありません。" };
}

function buildSavedResultHref(record: SavedResultRecord | null, kind: "result" | "continue") {
  if (!record) return kind === "result" ? "/result" : "/result/continue";
  const storedPath = kind === "result" ? record.resultPath : record.continuePath;
  if (storedPath.includes("?")) return storedPath;
  const hasRecoverableContext = Boolean(record.baseResultId || record.overlayId || record.payloadKey);
  if (!hasRecoverableContext) return storedPath || (kind === "result" ? "/result" : "/result/continue");
  const routeContext = { resultId: record.baseResultId ?? null, overlayId: record.overlayId ?? null, confidenceBand: record.confidenceBand ?? null, payloadKey: record.payloadKey ?? null } as const;
  const derivedPath = buildPublicResultHref(kind === "result" ? "/result" : "/result/continue", routeContext);
  if (derivedPath.includes("?")) return derivedPath;
  return storedPath || (kind === "result" ? "/result" : "/result/continue");
}

export default function SavedResultView() {
  const savedRecord = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const contextCopy = getSavedContextCopy(savedRecord?.context);

  const clear = () => {
    if (typeof window !== "undefined" && window.confirm("この端末に保存した結果を削除しますか？（この操作は取り消せません）")) {
      clearSavedResultRecord();
    }
  };

  return (
      <section className="aix2-band aix2-band--tight">
        <div className="container">
          <div className="mx-auto max-w-[46rem]">
            <p className="aix2-eyebrow">残す・戻る · Keep</p>
            <h1 className="aix2-band-title mt-3">残したものを、あなたのペースで。</h1>
            <p className="aix2-lead mt-4">
              保存はこの端末のブラウザ内だけ（デバイスに残る簡易保存）です。ログインやクラウド同期ではなく、別の端末には引き継がれません。いつでも見返し・削除できます。
            </p>

            {savedRecord ? (
              <div className="aix2-glass mt-7 p-6 space-y-5">
                <div className="flex flex-wrap gap-2">
                  <span className="aix3-chip">ブラウザ内の簡易保存</span>
                  <span className="aix3-chip">{contextCopy.pill}</span>
                </div>
                <div>
                  <p className="aix2-eyebrow">保存した結果</p>
                  <h2 className="aix2-serif mt-2 text-[2rem] leading-[1.15] text-[color:var(--tx)]">{savedRecord.resultLabel}</h2>
                  <p className="mt-3 text-[15px] leading-8 aix2-mut">受け取った内容: {savedRecord.resultType}</p>
                  <p className="mt-1 text-[13px] leading-7 aix2-faint">保存日時: {formatSavedAt(savedRecord.savedAt)}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href={buildSavedResultHref(savedRecord, "result")} className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">結果を見返す</Link>
                  <Link href={buildSavedResultHref(savedRecord, "continue")} className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]">自分だけのヒントを見る</Link>
                  <Link href="/check-in" className="aix2-link self-center">またチェックする →</Link>
                </div>
                <p className="text-[12px] leading-7 aix2-faint">{contextCopy.note}</p>
                <button type="button" onClick={clear} className="text-[12.5px] text-[#f2896c] underline">この端末の保存を削除する</button>
              </div>
            ) : (
              <div className="aix2-panel mt-7 p-6 space-y-4">
                <p className="aix2-eyebrow">まだ保存はありません</p>
                <p className="text-[15px] leading-8 text-[color:var(--tx)]">まずは結果ページで保存すると、この端末からあとで見返せるようになります。</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/check-in" className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">チェックをはじめる</Link>
                  <Link href="/methodology" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]">考え方を見る</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
  );
}
