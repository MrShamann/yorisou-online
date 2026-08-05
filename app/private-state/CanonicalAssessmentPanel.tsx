"use client";

// UX-2R / CPC-1 §3/§7/§9 — canonical assessment state inside わたしの今.
//
// This is the primary current-state model. The legacy reflections and /saved/tests/<id> artefacts
// are a separate compatibility surface and must not compete with it: two answers to "what is my
// current state" is the same defect the duplicate saved record was.
//
// Erasure lives here, next to the thing it erases, and states exactly what goes — because a
// deletion control whose consequences are described vaguely is not a real right.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RecItem = {
  itemId: string;
  title: string;
  sourceClass: string;
  commercialStatus: string;
  actions: { action: string; createdAt: string }[];
};
type RecSet = {
  setId: string;
  contentVersion: string;
  acceptedResultId: string;
  eligibilityBasis: string;
  generatedAt: string;
  items: RecItem[];
};

export type CanonicalEntry = {
  resultRowId: string;
  originalResultId: string | null;
  acceptedResultId: string | null;
  originalResultName: string | null;
  acceptedResultName: string | null;
  scoringVersion: string | null;
  resultSchemaVersion: string | null;
  methodId: string;
  methodVersion: string;
  status: "confirmed" | "corrected" | "rejected" | "deferred" | "unanswered";
  recommendationUsePermitted: boolean;
  continuityUsePermitted: boolean;
  producedAt: string;
  history: {
    responseId: string;
    responseType: string;
    correctedResultId: string | null;
    correctedResultName: string | null;
    reasonCode: string | null;
    source: string | null;
    supersedesResponseId: string | null;
    sequenceNo: number | null;
    createdAt: string;
  }[];
  recommendations:
    | { outcome: "ok"; sets: RecSet[] }
    | { outcome: "empty" }
    | { outcome: "temporarily_unavailable" };
};

const PROGRESS = ["saved", "try_intent", "tried"];
const FEEDBACK = ["helpful", "not_helpful", "not_relevant"];

const ACTION_JA: Record<string, string> = {
  saved: "保存した",
  try_intent: "試すことにした",
  tried: "試した",
  helpful: "役に立った",
  not_helpful: "あまり合わなかった",
  not_relevant: "今は合わない",
  hidden: "表示しないことにした",
  resource_opened: "開いた",
};

const SOURCE_JA: Record<string, string> = {
  web: "この画面から",
  line: "LINEから",
  import: "取り込み",
};

const REASON_JA: Record<string, string> = {
  not_me_now: "今の自分とは違う",
  partly_true: "半分は合っている",
  changed_recently: "最近変わった",
  wrong_emphasis: "強調のしかたが違う",
  other_bounded: "その他",
};

const STATUS_LABEL: Record<CanonicalEntry["status"], string> = {
  confirmed: "あなたが「合っている」と答えた内容です",
  corrected: "あなたが選び直した内容です",
  rejected: "あなたが「しっくりこない」と答えた内容です",
  deferred: "保留中です",
  unanswered: "まだ答えていません",
};

const RESPONSE_LABEL: Record<string, string> = {
  confirmed: "合っていると答えた",
  corrected: "選び直した",
  rejected: "しっくりこないと答えた",
  deferred: "保留にした",
};

function formatDate(iso: string) {
  // Fixed locale and explicit parts: no ambient locale drift between server and client render.
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function CanonicalAssessmentPanel({ entries }: { entries: CanonicalEntry[] }) {
  const router = useRouter();
  const [confirmingErase, setConfirmingErase] = useState<string | null>(null);
  const [erasing, setErasing] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Presentation-only. The stored data is append-only; this decides what counts as CURRENT.
  const currentFeedbackOf = (actions: { action: string }[]) =>
    actions.find((a) => FEEDBACK.includes(a.action))?.action ?? null;

  async function erase(resultRowId: string) {
    setErasing(resultRowId);
    setFailed(false);
    try {
      const res = await fetch(`/api/assessment/results/${resultRowId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("erase_failed");
      setConfirmingErase(null);
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setErasing(null);
    }
  }

  if (entries.length === 0) {
    return (
      <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
        <p className="text-[13px] font-semibold text-[#315F50]">いまの状態</p>
        <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
          まだ保存された結果はありません。チェックを終えて「自分のものとして保存する」を選ぶと、ここに残ります。
        </p>
        <Link href="/check-in" className="mt-3 inline-flex text-[13px] font-semibold text-[#315F50] underline">
          チェックをはじめる
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <p className="text-[13px] font-semibold text-[#315F50]">いまの状態（保存された結果）</p>
      {entries.map((entry) => (
        <article
          key={entry.resultRowId}
          className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5"
        >
          <p className="text-[12px] text-[#7A7068]">{formatDate(entry.producedAt)}のチェック</p>

          <dl className="mt-2 grid gap-1 text-[13px] leading-7">
            {/* Governed Japanese names lead; raw codes are provenance, not self-description. */}
            <div className="flex gap-2">
              <dt className="shrink-0 text-[#7A7068]">テストの結果</dt>
              <dd className="text-[#2F2A28]">
                {entry.originalResultName ?? (entry.originalResultId ? "（名称を表示できません）" : "—")}
              </dd>
            </div>
            {/* Original and accepted are shown SEPARATELY and always. A correction adds the
                person's answer beside the method's; it never replaces it. */}
            <div className="flex gap-2">
              <dt className="shrink-0 text-[#7A7068]">あなたの答え</dt>
              <dd className="text-[#2F2A28]">
                {entry.acceptedResultName ?? "まだありません"}
              </dd>
            </div>
          </dl>

          <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">{STATUS_LABEL[entry.status]}</p>

          {entry.history.length > 0 ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-[13px] font-semibold text-[#315F50]">
                答えの記録（{entry.history.length}件）
              </summary>
              <ul className="mt-2 grid gap-2 text-[12px] leading-6 text-[#7A7068]">
                {entry.history.map((h) => (
                  <li key={h.responseId}>
                    {formatDate(h.createdAt)}・{RESPONSE_LABEL[h.responseType] ?? h.responseType}
                    {h.correctedResultName ? `（${h.correctedResultName}）` : ""}
                    {h.reasonCode ? `・理由: ${REASON_JA[h.reasonCode] ?? h.reasonCode}` : ""}
                    {h.source ? `・${SOURCE_JA[h.source] ?? h.source}` : ""}
                    {h.supersedesResponseId ? "・前の答えを更新" : ""}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-[12px] leading-6 text-[#7A7068]">
                前の答えは書き換えられません。新しい答えが記録に足されます。
              </p>
            </details>
          ) : null}

          {/* Recommendation history — read-only. Viewing never creates a set. */}
          {entry.recommendations.outcome === "temporarily_unavailable" ? (
            <p role="alert" className="mt-3 text-[12px] leading-6 text-[#9b3a34]">
              ヒントの記録を読み込めませんでした。記録が消えたわけではありません。時間をおいて開いてみてください。
            </p>
          ) : entry.recommendations.outcome === "ok" ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-[13px] font-semibold text-[#315F50]">
                ヒントの記録
              </summary>
              {entry.recommendations.sets.map((set) => (
                <div key={set.setId} className="mt-2 border-l-2 border-[rgba(23,59,53,0.1)] pl-3">
                  <p className="text-[12px] text-[#7A7068]">
                    {formatDate(set.generatedAt)}・{set.contentVersion}・
                    {set.eligibilityBasis === "corrected" ? "選び直した結果から" : "確認した結果から"}
                  </p>
                  <ul className="mt-1 grid gap-1.5 text-[12px] leading-6">
                    {set.items.map((item) => {
                      const current = currentFeedbackOf(item.actions);
                      const progress = item.actions
                        .filter((a) => PROGRESS.includes(a.action))
                        .map((a) => ACTION_JA[a.action]);
                      const isHidden = item.actions.some((a) => a.action === "hidden");
                      return (
                        <li key={item.itemId} className="text-[#5F5750]">
                          <span className="text-[#2F2A28]">{item.title}</span>
                          {isHidden ? "（表示しない）" : ""}
                          {progress.length ? `・${[...new Set(progress)].join("・")}` : ""}
                          {current ? `・いまの答え: ${ACTION_JA[current]}` : ""}
                          {item.actions.length > 1 ? (
                            <span className="block text-[11px] text-[#7A7068]">
                              記録: {item.actions.map((a) => ACTION_JA[a.action] ?? a.action).join(" ← ")}
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </details>
          ) : null}

          <details className="mt-2">
            <summary className="cursor-pointer text-[12px] text-[#7A7068]">記録の詳細</summary>
            <dl className="mt-1 grid gap-0.5 text-[11px] leading-5 text-[#7A7068]">
              <div>方法: {entry.methodId} / {entry.methodVersion}</div>
              {entry.scoringVersion ? <div>採点: {entry.scoringVersion}</div> : null}
              {entry.resultSchemaVersion ? <div>形式: {entry.resultSchemaVersion}</div> : null}
              {entry.originalResultId ? <div>結果コード: {entry.originalResultId}</div> : null}
              <div>おすすめの利用: {entry.recommendationUsePermitted ? "許可されています" : "許可されていません"}</div>
              <div>履歴での利用: {entry.continuityUsePermitted ? "許可されています" : "許可されていません"}</div>
            </dl>
          </details>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/result?result=${encodeURIComponent(entry.resultRowId)}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 text-[13px] font-semibold text-white"
            >
              結果を開く
            </Link>
            {entry.recommendationUsePermitted ? (
              <Link
                href={`/recommendations?result=${encodeURIComponent(entry.resultRowId)}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[13px] font-semibold text-[#315F50]"
              >
                ヒントを見る
              </Link>
            ) : null}
          </div>

          <div className="mt-4 border-t border-[rgba(23,59,53,0.08)] pt-3">
            {confirmingErase === entry.resultRowId ? (
              <div>
                <p className="text-[13px] leading-7 text-[#2F2A28]">
                  この結果を削除すると、次のものが消えます。元に戻すことはできません。
                </p>
                <ul className="mt-1 list-disc pl-5 text-[12px] leading-6 text-[#5F5750]">
                  <li>結果の内容</li>
                  <li>あなたが答えた記録（合っている・選び直した・しっくりこない・保留）</li>
                  <li>この結果に紐づくヒントとその反応</li>
                  <li>アカウントとのつながり</li>
                  <li>チェックの回答そのもの</li>
                </ul>
                <p className="mt-1 text-[12px] leading-6 text-[#7A7068]">
                  削除したあとは、ログインし直しても戻せません。
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => erase(entry.resultRowId)}
                    disabled={erasing !== null}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#9b3a34] bg-[#9b3a34] px-4 text-[13px] font-semibold text-white disabled:opacity-60"
                  >
                    {erasing === entry.resultRowId ? "削除しています" : "完全に削除する"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingErase(null)}
                    disabled={erasing !== null}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[13px] font-semibold text-[#315F50]"
                  >
                    やめる
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingErase(entry.resultRowId)}
                className="text-[13px] font-semibold text-[#9b3a34] underline"
              >
                この結果を削除する
              </button>
            )}
          </div>
        </article>
      ))}
      {failed ? (
        <p role="alert" className="text-[13px] text-[#9b3a34]">
          削除できませんでした。時間をおいてもう一度お試しください。まだ削除されていません。
        </p>
      ) : null}
    </section>
  );
}
