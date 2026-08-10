"use client";

// RTR-1 — completes a pending private save of the IMAIRO-120Q result after
// login (same re-post pattern as the merged C02 / relationship-fatigue
// return pages). Copy reused from the relationship-fatigue return page.

import Link from "next/link";
import { useEffect, useState } from "react";

import { buildPublicResultHref } from "../../check-in/resultCompatibility";
import {
  takePendingImairoSave,
  peekPendingResultClaim,
  clearPendingResultClaim,
  peekPendingInterpretationIntent,
  clearPendingInterpretationIntent,
  type PendingImairoSave,
} from "../pendingSave";

export default function ImairoSaveReturnPage() {
  const [state, setState] = useState<"saving" | "missing" | "error">("saving");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [context, setContext] = useState<PendingImairoSave | null>(null);
  // UX-2R Wave A: in persisted mode the return trip CLAIMS the existing canonical record. It never
  // re-posts result content, so nothing is created twice across the login boundary.
  const [claimedRowId, setClaimedRowId] = useState<string | null>(null);

  useEffect(() => {
    // §1: ACKNOWLEDGEMENT LIFECYCLE — peek, act, and only then clear.
    //
    // The intent used to be deleted the instant this page loaded. That made a browser replay
    // impossible, but it also destroyed the record of what the person had said before anything had
    // actually happened: a crash, a closed tab or a failed claim lost the answer with no way back,
    // and the person had to find and press it again.
    //
    // Duplicate prevention now lives in the database (unique nonce per result+owner), so the
    // browser is free to HOLD the intent until the server confirms. A retry with the same nonce
    // returns the original response instead of appending a second one, which makes resuming safe.
    const intent = peekPendingInterpretationIntent();
    const claim = peekPendingResultClaim();

    if (intent) {
      (async () => {
        try {
          const claimed = await fetch(`/api/assessment/results/${intent.resultRowId}/claim`, {
            method: "POST",
          });
          // Intent deliberately NOT cleared: a reload can retry the whole sequence.
          if (!claimed.ok) throw new Error("claim_failed");

          const responded = await fetch(`/api/assessment/results/${intent.resultRowId}/response`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              intent.responseType === "corrected"
                ? {
                    responseType: intent.responseType,
                    correctedResultId: intent.correctedResultId,
                    intentNonce: intent.nonce,
                  }
                : { responseType: intent.responseType, intentNonce: intent.nonce },
            ),
          });

          if (responded.ok) {
            // Created OR replayed — both mean the answer is recorded exactly once. The claim
            // happened on the way, so a parallel pending-claim record is acknowledged too.
            clearPendingInterpretationIntent();
            clearPendingResultClaim();
          } else if (responded.status >= 400 && responded.status < 500) {
            // Terminal: a validation failure or a genuine conflict can never succeed on retry, so
            // holding the intent would only make every future visit fail the same way.
            clearPendingInterpretationIntent();
            console.warn("pending interpretation rejected", { status: responded.status });
          } else {
            // Server-side or unresolved: keep the intent so a reload can resume with the same nonce.
            console.warn("pending interpretation unresolved", { status: responded.status });
          }
          setClaimedRowId(intent.resultRowId);
        } catch {
          // Network failure of unknown outcome. The intent stays; the nonce makes a retry safe even
          // if the server did commit the response and only the reply was lost.
          setState("error");
        }
      })();
      return;
    }

    // Pure claim — the person pressed 「この結果を自分のものとして保存する」 while anonymous and
    // logged in without answering the interpretation. This branch previously consumed the record
    // and never acted on it, so the promised automatic save silently became 「見つかりませんでした」.
    if (claim) {
      (async () => {
        try {
          const claimed = await fetch(`/api/assessment/results/${claim.resultRowId}/claim`, {
            method: "POST",
          });
          if (claimed.ok) {
            clearPendingResultClaim();
            setClaimedRowId(claim.resultRowId);
          } else if (claimed.status >= 400 && claimed.status < 500) {
            // Terminal: expired, concealed, or missing credential — retrying cannot succeed.
            clearPendingResultClaim();
            setState("error");
          } else {
            // Server-side failure of unknown outcome: keep the record so a reload can resume.
            setState("error");
          }
        } catch {
          setState("error");
        }
      })();
      return;
    }

    const pending = takePendingImairoSave();
    if (!pending) {
      queueMicrotask(() => setState("missing"));
      return;
    }
    queueMicrotask(() => setContext(pending));
    fetch("/api/tests/imairo/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("save_failed");
        const payload = (await response.json()) as { saved: { id: string } };
        setSavedId(payload.saved.id);
      })
      .catch(() => setState("error"));
  }, []);

  const resultHref = claimedRowId
    ? `/result?result=${encodeURIComponent(claimedRowId)}`
    : context
    ? buildPublicResultHref("/result", {
        resultId: context.resultId,
        overlayId: context.overlayId,
        confidenceBand: context.confidence,
        payloadKey: context.payloadKey,
      })
    : "/result";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-12">
        <div className="mx-auto max-w-lg rounded-[1.25rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-6">
          {claimedRowId ? (
            <>
              <p className="text-[15px] leading-8">この結果をあなたのものとして保存しました。</p>
              <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
                新しく結果が作られたのではなく、いま見ていた結果がそのままあなたのアカウントに紐づきました。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={resultHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
                >
                  結果に戻る
                </Link>
                <Link
                  href="/private-state"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
                >
                  わたしの今を開く
                </Link>
              </div>
            </>
          ) : savedId ? (
            <>
              <p className="text-[15px] leading-8">結果を非公開で保存しました。</p>
              <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
                保存した結果はあなたにだけ表示されます。ここから次の入口を選べます。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/saved/tests/${savedId}`}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
                >
                  保存した結果を開く
                </Link>
                <Link
                  href={resultHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
                >
                  結果ページに戻る
                </Link>
              </div>
            </>
          ) : state === "saving" ? (
            <p className="text-[15px] leading-8">結果を非公開で保存しています。</p>
          ) : (
            <>
              <p className="text-[15px] leading-8">
                {state === "missing" ? "保存する結果が見つかりませんでした。" : "結果を保存できませんでした。"}
              </p>
              <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
                結果ページに戻ると、もう一度保存し直せます。
              </p>
              <Link
                href={resultHref}
                className="mt-5 inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
              >
                結果ページに戻る
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
