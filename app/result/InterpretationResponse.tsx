"use client";

// UX-2R / CPC-1 Wave B — the interpretation loop: the person answers back.
//
// Until now the assessment spoke and the person could only accept it by silence. The RPC and the
// API for confirming, correcting, rejecting and deferring an interpretation already existed and
// were proven against the real Preview database; nothing in the product ever called them.
//
// Three rules this surface must not soften, because the database already enforces them and the UI
// must not describe something different from what is stored:
//   • DEFERRED IS NOT CONSENT. "あとで" withholds recommendation and continuity use exactly as a
//     rejection does. It is offered because pressing someone for an answer is worse, not because
//     it is a soft yes.
//   • REJECTION DOES NOT DELETE. It stops the interpretation being presented as accepted
//     understanding; the record remains, and erasure is a separate, explicit act.
//   • A CORRECTION PRESERVES THE ORIGINAL. `original_result_id` never changes, so the history
//     shows what the method said AND what the person said — not a rewritten past.
//
// Responses are append-only: a later answer supersedes an earlier one and neither is destroyed.

import { useState } from "react";

export type UnderstandingStatus = "confirmed" | "corrected" | "rejected" | "deferred" | "unanswered";

export type UnderstandingSnapshot = {
  status: UnderstandingStatus;
  resolved: boolean;
  recommendationUsePermitted: boolean;
  continuityUsePermitted: boolean;
};

type Choice = {
  type: "confirmed" | "rejected" | "deferred";
  label: string;
  hint: string;
};

const CHOICES: Choice[] = [
  {
    type: "confirmed",
    label: "だいたい合っている",
    hint: "この内容を、いまのあなたの理解として残します。",
  },
  {
    type: "rejected",
    label: "しっくりこない",
    hint: "この内容は、あなたの理解としては残しません。結果自体は消えません。",
  },
  {
    type: "deferred",
    label: "いまは決められない",
    hint: "答えを保留します。保留は「はい」ではないので、この内容が先に進むことはありません。",
  },
];

const STATUS_LINE: Record<UnderstandingStatus, string> = {
  confirmed: "この内容を、いまのあなたの理解として残しました。",
  corrected: "あなたが選び直した内容を、いまの理解として残しました。もとの結果も記録に残っています。",
  rejected:
    "この内容は、あなたの理解としては残していません。結果自体は消えていません。消したいときは、いつでも削除できます。",
  deferred:
    "保留にしました。保留は「はい」ではないので、この内容がおすすめや履歴に使われることはありません。",
  unanswered: "まだ答えていません。答えるまで、この内容が先に進むことはありません。",
};

export default function InterpretationResponse({
  resultRowId,
  isOwner,
  initial,
}: {
  resultRowId: string;
  isOwner: boolean;
  initial: UnderstandingSnapshot;
}) {
  const [snapshot, setSnapshot] = useState<UnderstandingSnapshot>(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Answering is an owner-scoped act. Before the record is claimed there is no one to attribute
  // the answer to, so the surface says that plainly rather than offering a control that would fail.
  if (!isOwner) {
    return (
      <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
        <p className="text-[13px] font-semibold text-[#315F50]">この内容は合っていますか</p>
        <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
          この結果を自分のものとして保存すると、「合っている / しっくりこない」を答えられるようになります。
          答えるまで、この内容がおすすめや履歴に使われることはありません。
        </p>
      </section>
    );
  }

  async function respond(responseType: Choice["type"]) {
    setPending(responseType);
    setFailed(false);
    try {
      const res = await fetch(`/api/assessment/results/${resultRowId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseType }),
      });
      if (!res.ok) throw new Error("response_failed");
      // Mirror exactly what the server stores: only an accepting response permits downstream use.
      const permitted = responseType === "confirmed";
      setSnapshot({
        status: responseType,
        resolved: permitted,
        recommendationUsePermitted: permitted,
        continuityUsePermitted: permitted,
      });
    } catch {
      setFailed(true);
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
      <p className="text-[13px] font-semibold text-[#315F50]">この内容は合っていますか</p>
      <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
        当たっているかどうかを決めるのは、テストではなくあなたです。答えないままでも構いません。
      </p>

      <p className="mt-3 text-[13px] leading-7 text-[#2F2A28]" aria-live="polite">
        {STATUS_LINE[snapshot.status]}
      </p>

      <div className="mt-4 grid gap-2">
        {CHOICES.map((choice) => {
          const isCurrent = snapshot.status === choice.type;
          return (
            <button
              key={choice.type}
              type="button"
              onClick={() => respond(choice.type)}
              disabled={pending !== null}
              aria-pressed={isCurrent}
              className={`rounded-[1rem] border px-4 py-3 text-left transition disabled:opacity-60 ${
                isCurrent
                  ? "border-[#173B35] bg-[#173B35] text-white"
                  : "border-[rgba(23,59,53,0.14)] bg-white text-[#2F2A28] hover:border-[#173B35]"
              }`}
            >
              <span className="block text-[14px] font-semibold">
                {pending === choice.type ? "送信しています" : choice.label}
              </span>
              <span
                className={`mt-0.5 block text-[12px] leading-6 ${
                  isCurrent ? "text-white/80" : "text-[#7A7068]"
                }`}
              >
                {choice.hint}
              </span>
            </button>
          );
        })}
      </div>

      {/* Truthful about what an answer changes, and about what it does not. */}
      <p className="mt-3 text-[12px] leading-6 text-[#7A7068]">
        答えはいつでも変えられます。前の答えは書き換えられず、記録として残ります。
      </p>

      {failed ? (
        <p role="alert" className="mt-3 text-[13px] text-[#9b3a34]">
          送信できませんでした。時間をおいてもう一度お試しください。答えはまだ記録されていません。
        </p>
      ) : null}
    </section>
  );
}
