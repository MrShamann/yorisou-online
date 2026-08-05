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
import { useRouter } from "next/navigation";
import Link from "next/link";

import { storePendingInterpretationIntent } from "./pendingSave";

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

export type ArchetypeChoice = { publicCode: string; nickname: string; clanJapanese: string };

export default function InterpretationResponse({
  resultRowId,
  isOwner,
  initial,
  archetypes,
  originalResultId,
}: {
  resultRowId: string;
  isOwner: boolean;
  initial: UnderstandingSnapshot;
  /** Governed taxonomy. A correction may ONLY select from these — never free text. */
  archetypes: ArchetypeChoice[];
  originalResultId: string | null;
}) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<UnderstandingSnapshot>(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [correcting, setCorrecting] = useState(false);

  // §4: a response API call while unauthenticated returns 401. Rather than losing what the person
  // just said, record a bounded intent and carry it through login — /result/return replays it once.
  const [intentParked, setIntentParked] = useState<string | null>(null);
  const returnHref = `/login?next=${encodeURIComponent("/result/return")}`;
  const lineReturnHref = `/api/line/auth/start?locale=ja&intent=login&returnTo=${encodeURIComponent("/result/return")}`;

  // The response API returns the canonical understanding it just derived. We consume THAT rather
  // than recomputing the rule client-side: a second copy of the rule is a second thing that can
  // drift out of agreement with the database.
  async function respond(responseType: string, correctedResultId?: string) {
    setPending(responseType === "corrected" ? `corrected:${correctedResultId}` : responseType);
    setFailed(false);
    try {
      const res = await fetch(`/api/assessment/results/${resultRowId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          responseType === "corrected" ? { responseType, correctedResultId } : { responseType },
        ),
      });
      if (res.status === 401) {
        // Remember the ANSWER, not just the row. The person should never be asked to repeat it.
        storePendingInterpretationIntent({
          resultRowId,
          responseType: responseType as "confirmed" | "corrected" | "rejected" | "deferred",
          correctedResultId: correctedResultId ?? null,
          reasonCode: null,
        });
        setIntentParked(responseType);
        setCorrecting(false);
        return;
      }
      if (!res.ok) throw new Error("response_failed");
      const body = (await res.json()) as { understanding?: UnderstandingSnapshot | null };
      if (body.understanding) setSnapshot(body.understanding);
      setCorrecting(false);

      // The actions around this component (recommendation entry, report entry) are SERVER-rendered
      // from the understanding as it was when the page loaded. Updating only local state left a
      // confirmed result still showing no recommendation entry, and — worse — left a
      // newly-rejected result still showing one. Re-render the server tree so the whole surface
      // agrees, in both directions, without asking the person to reload the page.
      router.refresh();
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
        {isOwner
          ? null
          : "　答えを選ぶと、そのあとログインの案内が出ます。選んだ答えは覚えているので、選び直す必要はありません。"}
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

      {/* CORRECTION — bounded to the governed taxonomy. The API rejects anything else, and this
          surface offers nothing else: no free text, no self-described diagnosis. */}
      <div className="mt-3">
        {correcting ? (
          <div className="rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white px-4 py-3">
            <p className="text-[13px] font-semibold text-[#315F50]">近いものを選び直す</p>
            <p className="mt-1 text-[12px] leading-6 text-[#7A7068]">
              選び直しても、もとの結果は書き換わりません。両方が記録として残ります。
            </p>
            <div className="mt-3 grid max-h-64 gap-1.5 overflow-y-auto">
              {archetypes.map((a) => (
                <button
                  key={a.publicCode}
                  type="button"
                  onClick={() => respond("corrected", a.publicCode)}
                  disabled={pending !== null}
                  className="rounded-[0.75rem] border border-[rgba(23,59,53,0.12)] px-3 py-2 text-left text-[13px] hover:border-[#173B35] disabled:opacity-60"
                >
                  <span className="font-semibold">{a.nickname}</span>
                  <span className="ml-2 text-[12px] text-[#7A7068]">{a.clanJapanese}のタイプ</span>
                  {a.publicCode === originalResultId ? (
                    <span className="ml-2 text-[11px] text-[#7A7068]">（いまの結果）</span>
                  ) : null}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCorrecting(false)}
              className="mt-3 text-[13px] font-semibold text-[#315F50] underline"
            >
              やめる
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCorrecting(true)}
            disabled={pending !== null}
            className="rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white px-4 py-3 text-left text-[14px] font-semibold text-[#2F2A28] hover:border-[#173B35] disabled:opacity-60"
          >
            近いものを自分で選び直す
            <span className="mt-0.5 block text-[12px] font-normal leading-6 text-[#7A7068]">
              決まった選択肢の中から選びます。もとの結果は残ります。
            </span>
          </button>
        )}
      </div>

      {/* Truthful about what an answer changes, and about what it does not. */}
      <p className="mt-3 text-[12px] leading-6 text-[#7A7068]">
        答えはいつでも変えられます。前の答えは書き換えられず、記録として残ります。
      </p>

      {intentParked ? (
        <div className="mt-3 rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-[#F7FBF8] px-4 py-3">
          <p className="text-[13px] leading-7 text-[#2F2A28]">
            答えを覚えています。ログインすると、この結果があなたのものになり、いまの答えがそのまま記録されます。もう一度選び直す必要はありません。
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={returnHref}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
            >
              ログインして続ける
            </Link>
            <Link
              href={lineReturnHref}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
            >
              LINEでログイン
            </Link>
          </div>
        </div>
      ) : null}

      {failed ? (
        <p role="alert" className="mt-3 text-[13px] text-[#9b3a34]">
          送信できませんでした。時間をおいてもう一度お試しください。答えはまだ記録されていません。
        </p>
      ) : null}
    </section>
  );
}
