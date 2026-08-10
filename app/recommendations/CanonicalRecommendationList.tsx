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

import { acquireActionNonce, releaseActionNonce } from "./pendingAction";

export type ActionKey =
  | "saved" | "try_intent" | "tried" | "helpful" | "not_helpful" | "not_relevant" | "hidden";

export type ItemView = {
  itemId: string;
  rank: number;
  title: string;
  reason: string;
  reasonIsResultSpecific: boolean;
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

// Actions fall into groups with different semantics, and flattening them into one row of toggles
// was wrong: it let "役に立った" and "今は合わない" both appear selected at once, which describes
// nobody's actual state.
//
//   PROGRESS  saved / try_intent / tried — cumulative; each is a thing that happened.
//   FEEDBACK  helpful / not_helpful / not_relevant — mutually exclusive; only the LATEST is current.
//   REMOVAL   hidden — terminal for this surface; the card leaves the active list.
//
// The underlying data stays append-only. This only changes what is presented as CURRENT.
const PROGRESS: ActionKey[] = ["saved", "try_intent", "tried"];
const FEEDBACK: ActionKey[] = ["helpful", "not_helpful", "not_relevant"];

function currentFeedback(actions: { action: string }[]): ActionKey | null {
  // `actions` arrives newest-first, so the first feedback entry is the current one.
  const latest = actions.find((a) => FEEDBACK.includes(a.action as ActionKey));
  return (latest?.action as ActionKey) ?? null;
}

export default function CanonicalRecommendationList({
  set,
  surface,
}: {
  set: SetView;
  /** Where the action actually happened. Hardcoding "graph" mislabelled every list action. */
  surface: "recommendations" | "graph" | "private_state" | "line";
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // Mirrors what the server accepted. Never set before the server confirms, so the screen cannot
  // claim something the database does not hold.
  const [applied, setApplied] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(set.items.map((i) => [i.itemId, i.actions.map((a) => a.action)])),
  );

  // Newest-first, matching how the server returns history.
  const history = (itemId: string) => (applied[itemId] || []).map((action) => ({ action }));

  async function act(itemId: string, action: ActionKey) {
    setPending(`${itemId}:${action}`);
    setFailed(null);
    // Reused across retries, so a request the server already committed resolves to the SAME row.
    const nonce = acquireActionNonce(set.resultRowId, itemId, action);
    try {
      const res = await fetch(`/api/recommendations/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resultRowId: set.resultRowId,
          source: surface,
          idempotencyKey: nonce,
        }),
      });
      if (res.status === 403) {
        // Terminal: consent was withdrawn. Retrying can never succeed, so the nonce is released.
        releaseActionNonce(set.resultRowId, itemId, action);
        setFailed("この結果への答えが変わったため、いまは記録できません。結果ページで答えを確認してください。");
        router.refresh();
        return;
      }
      if (res.status >= 400 && res.status < 500) {
        releaseActionNonce(set.resultRowId, itemId, action);
        throw new Error("action_rejected");
      }
      // 5xx falls through to catch WITHOUT releasing, so a retry replays the same nonce.
      if (!res.ok) throw new Error("action_failed");
      releaseActionNonce(set.resultRowId, itemId, action);
      // Prepend: newest-first, so "current feedback" reads correctly without re-fetching.
      setApplied((prev) => ({ ...prev, [itemId]: [action, ...(prev[itemId] || [])] }));
    } catch {
      // Deliberately does NOT claim the action was not recorded: an ambiguous network failure may
      // have committed it. Retrying is safe because the nonce is retained and replays.
      setFailed("記録できたかどうか確認できませんでした。もう一度押しても、二重に記録されることはありません。");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[1rem] border border-[rgba(23,59,53,0.12)] bg-[#F7FBF8] px-4 py-3">
        <p className="text-[13px] leading-7 text-[#2F2A28]">
          {set.eligibilityBasis === "corrected"
            ? "あなたが選び直した結果のあとに選べることです。"
            : "あなたが「合っている」と答えた結果のあとに選べることです。"}
        </p>
        <p className="mt-1 text-[12px] leading-6 text-[#7A7068]">
          どれも任意です。あなたに合うと判断したものではなく、負担の少ない選択肢を並べています。合わないと感じたら、選ばなくて構いません。
        </p>
      </div>

      <ul className="grid gap-4">
        {set.items.map((item) => {
          const past = history(item.itemId);
          // A hidden item leaves the ACTIVE list; its history remains in わたしの今.
          if (past.some((a) => a.action === "hidden")) return null;
          const feedback = currentFeedback(past);
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

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2" role="group" aria-label="この候補への行動">
                  {PROGRESS.map((a) => {
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

                {/* Mutually exclusive: only the latest answer is current. */}
                <div className="flex flex-wrap gap-2" role="group" aria-label="この候補はどうでしたか">
                  {FEEDBACK.map((a) => {
                    const isCurrent = feedback === a;
                    const isPending = pending === `${item.itemId}:${a}`;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => act(item.itemId, a)}
                        disabled={pending !== null}
                        aria-pressed={isCurrent}
                        className={`min-h-[40px] rounded-full border px-3 text-[13px] transition disabled:opacity-60 ${
                          isCurrent
                            ? "border-[#173B35] bg-[#173B35] text-white"
                            : "border-[rgba(23,59,53,0.16)] bg-white text-[#2F2A28] hover:border-[#173B35]"
                        }`}
                      >
                        {isPending ? "記録しています" : isCurrent ? ACTION_DONE[a] : ACTION_LABEL[a]}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => act(item.itemId, "hidden")}
                  disabled={pending !== null}
                  className="text-[13px] font-semibold text-[#7A7068] underline disabled:opacity-60"
                >
                  {pending === `${item.itemId}:hidden` ? "記録しています" : "この候補を表示しない"}
                </button>

                {feedback ? (
                  <p className="text-[12px] leading-6 text-[#7A7068]">
                    答えはいつでも変えられます。前の答えも記録として残ります。
                  </p>
                ) : null}
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
