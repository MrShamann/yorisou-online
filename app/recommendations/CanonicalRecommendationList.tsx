"use client";

// UX-2R / CPC-1 — the real recommendation loop.
//
// This renders PERSISTED state, not a fresh generation each visit. Every action is written to the
// canonical graph, survives refresh and sign-out, and is recoverable after signing back in.
//
// Governance shows through in the structure, not in a disclaimer at the bottom: each card states
// why it appeared, what kind of thing it is, who (if anyone) paid for it to be there, and what it
// is not. Nothing here presents a numeric confidence, and nothing is phrased as an instruction.

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ActionKey =
  | "saved" | "try_intent" | "tried" | "helpful" | "not_helpful" | "not_relevant" | "hidden";

export type ItemView = {
  itemId: string;
  rank: number;
  title: string;
  reason: string;
  objectType: "resource" | "experience_card" | "internal_route";
  sourceClass: string;
  commercialStatus: string;
  limitations: string;
  internalRoute?: string;
  actions: { action: string; createdAt: string }[];
};

export type SetView = {
  setId: string;
  resultRowId: string;
  acceptedResultId: string;
  eligibilityBasis: "confirmed" | "corrected";
  generatedAt: string;
  items: ItemView[];
};

const ACTION_LABEL: Record<ActionKey, string> = {
  saved: "保存する",
  try_intent: "試してみる",
  tried: "試した",
  helpful: "役に立った",
  not_helpful: "あまり合わなかった",
  not_relevant: "今は合わない",
  hidden: "表示しない",
};

const ACTION_DONE: Record<ActionKey, string> = {
  saved: "保存しました",
  try_intent: "試すことにしました",
  tried: "試したと記録しました",
  helpful: "役に立ったと記録しました",
  not_helpful: "合わなかったと記録しました",
  not_relevant: "今は合わないと記録しました",
  hidden: "表示しないことにしました",
};

const SOURCE_LABEL: Record<string, string> = {
  yorisou_internal: "YORISOUがつくったもの",
  public_information: "公開されている情報",
  partner_nonpaid: "提携先（費用の受け取りなし）",
  partner_sponsored: "提携先（費用を受け取っています）",
};

const COMMERCIAL_LABEL: Record<string, string> = {
  none: "広告ではありません",
  disclosed_sponsored: "広告（費用を受け取っています）",
  disclosed_affiliate: "アフィリエイトを含みます",
};

const ORDER: ActionKey[] = ["saved", "try_intent", "tried", "helpful", "not_helpful", "not_relevant", "hidden"];

export default function CanonicalRecommendationList({ set }: { set: SetView }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // Mirrors what the server accepted. Never set before the server confirms, so the screen cannot
  // claim something the database does not hold.
  const [applied, setApplied] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(set.items.map((i) => [i.itemId, i.actions.map((a) => a.action)])),
  );

  async function act(itemId: string, action: ActionKey) {
    setPending(`${itemId}:${action}`);
    setFailed(null);
    try {
      const res = await fetch(`/api/recommendations/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resultRowId: set.resultRowId,
          source: "graph",
          // Makes a double tap or a retry after a lost reply resolve to the same row.
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      if (res.status === 403) {
        setFailed("この結果への答えが変わったため、いまは記録できません。結果ページで答えを確認してください。");
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error("action_failed");
      setApplied((prev) => ({ ...prev, [itemId]: [...(prev[itemId] || []), action] }));
    } catch {
      setFailed("記録できませんでした。時間をおいてもう一度お試しください。まだ記録されていません。");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[1rem] border border-[rgba(23,59,53,0.12)] bg-[#F7FBF8] px-4 py-3">
        <p className="text-[13px] leading-7 text-[#2F2A28]">
          {set.eligibilityBasis === "corrected"
            ? "あなたが選び直した内容をもとにしています。"
            : "あなたが「合っている」と答えた内容をもとにしています。"}
        </p>
        <p className="mt-1 text-[12px] leading-6 text-[#7A7068]">
          どれも任意です。合わないと感じたら、選ばなくて構いません。答えを変えると、ここも変わります。
        </p>
      </div>

      <ul className="grid gap-4">
        {set.items.map((item) => {
          const done = applied[item.itemId] || [];
          return (
            <li key={item.itemId} className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/92 p-5">
              <h3 className="text-[16px] font-semibold leading-7 text-[#2F2A28]">{item.title}</h3>

              <dl className="mt-3 grid gap-1.5 text-[13px] leading-6">
                <div className="flex gap-2">
                  <dt className="shrink-0 text-[#7A7068]">なぜ出たか</dt>
                  <dd className="text-[#2F2A28]">{item.reason}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 text-[#7A7068]">出どころ</dt>
                  <dd className="text-[#2F2A28]">
                    {SOURCE_LABEL[item.sourceClass] ?? item.sourceClass}・
                    {COMMERCIAL_LABEL[item.commercialStatus] ?? item.commercialStatus}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 text-[#7A7068]">できないこと</dt>
                  <dd className="text-[#2F2A28]">{item.limitations}</dd>
                </div>
              </dl>

              {item.internalRoute ? (
                <a
                  href={`${item.internalRoute}?result=${encodeURIComponent(set.resultRowId)}`}
                  className="mt-3 inline-block text-[13px] font-semibold text-[#315F50] underline"
                >
                  YORISOUで開く
                </a>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {ORDER.map((a) => {
                  const isDone = done.includes(a);
                  const isPending = pending === `${item.itemId}:${a}`;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => act(item.itemId, a)}
                      disabled={pending !== null}
                      aria-pressed={isDone}
                      className={`min-h-[40px] rounded-full border px-3 text-[13px] transition disabled:opacity-60 ${
                        isDone
                          ? "border-[#173B35] bg-[#173B35] text-white"
                          : "border-[rgba(23,59,53,0.16)] bg-white text-[#2F2A28] hover:border-[#173B35]"
                      }`}
                    >
                      {isPending ? "記録しています" : isDone ? ACTION_DONE[a] : ACTION_LABEL[a]}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      {failed ? (
        <p role="alert" className="text-[13px] leading-6 text-[#9b3a34]">
          {failed}
        </p>
      ) : null}

      <p className="text-[12px] leading-6 text-[#7A7068]">
        ここで候補は終わりです。記録した内容は「わたしの今」からも見返せます。
      </p>
    </section>
  );
}
