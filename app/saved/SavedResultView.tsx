"use client";

import { useSyncExternalStore } from "react";

import { MvpActionLink, MvpCard, MvpPill, MvpSection } from "../components/MvpSurface";
import { buildPublicResultHref } from "../check-in/resultCompatibility";
import { readSavedResultRecord, subscribeSavedResult, type SavedResultRecord } from "../result/saveState";

function formatSavedAt(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "保存時刻はこの端末で確認できます。";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSavedContextCopy(context?: "public-result" | "private-insight") {
  if (context === "private-insight") {
    return {
      pill: "自分だけのヒントのあとに保存",
      note: "自分だけのヒントを見たあとに保存されています。この保存にも、本文や回答内容は含めていません。",
    };
  }

  if (context === "public-result") {
    return {
      pill: "結果カードから保存",
      note: "最初に見た結果カードから保存されています。この保存にも、自分だけのヒントの本文や回答内容は含めていません。",
    };
  }

  return {
    pill: "この端末内の簡易保存",
    note: "この端末内の簡易保存です。アカウント保存やLINE連携ではありません。",
  };
}

function buildSavedResultHref(record: SavedResultRecord | null, kind: "result" | "continue") {
  if (!record) {
    return kind === "result" ? "/result" : "/result/continue";
  }

  const storedPath = kind === "result" ? record.resultPath : record.continuePath;
  if (storedPath.includes("?")) {
    return storedPath;
  }

  const hasRecoverableContext = Boolean(record.baseResultId || record.overlayId || record.payloadKey);
  if (!hasRecoverableContext) {
    return storedPath || (kind === "result" ? "/result" : "/result/continue");
  }

  const routeContext = {
    resultId: record.baseResultId ?? null,
    overlayId: record.overlayId ?? null,
    confidenceBand: record.confidenceBand ?? null,
    payloadKey: record.payloadKey ?? null,
  } as const;

  const derivedPath = buildPublicResultHref(kind === "result" ? "/result" : "/result/continue", routeContext);
  if (derivedPath.includes("?")) {
    return derivedPath;
  }

  return storedPath || (kind === "result" ? "/result" : "/result/continue");
}

export default function SavedResultView() {
  const savedRecord = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const contextCopy = getSavedContextCopy(savedRecord?.context);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(247,244,238,0.98)_36%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
      <MvpSection
        eyebrow="保存した結果"
        title="この端末に保存した結果を、あとで見返せます。"
        lead="ブラウザ内だけの簡易保存です。ログインやLINE連携は使わず、この端末から静かに見返せます。"
      >
        {savedRecord ? (
          <MvpCard className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <MvpPill>ブラウザ内の簡易保存</MvpPill>
              <MvpPill>{contextCopy.pill}</MvpPill>
            </div>
            <div>
              <div className="service-kicker">保存した結果</div>
              <h1 className="display-serif mt-3 text-[2rem] leading-[1.15]">{savedRecord.resultLabel}</h1>
              <p className="mt-3 text-[15px] leading-8 text-[var(--muted)]">
                受け取った内容: {savedRecord.resultType}
              </p>
              <p className="mt-2 text-[13px] leading-7 text-[var(--muted)]">
                保存日時: {formatSavedAt(savedRecord.savedAt)}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MvpActionLink href={buildSavedResultHref(savedRecord, "result")} label="結果を見返す" />
              <MvpActionLink href={buildSavedResultHref(savedRecord, "continue")} label="自分だけのヒントを見る" tone="secondary" />
              <MvpActionLink href="/check-in" label="またチェックインする" tone="ghost" />
            </div>
            <p className="text-[12px] leading-7 text-[var(--muted)]">
              {contextCopy.note}
            </p>
          </MvpCard>
        ) : (
          <MvpCard className="space-y-4">
            <div className="service-kicker">まだ保存はありません</div>
            <p className="text-[15px] leading-8 text-[var(--text)]">
              まずは結果ページで保存すると、この端末からあとで見返せるようになります。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <MvpActionLink href="/check-in" label="チェックインをはじめる" />
              <MvpActionLink href="/methodology" label="方法を見る" tone="secondary" />
            </div>
          </MvpCard>
        )}
      </MvpSection>
    </main>
  );
}
