"use client";

// RTR-1 — completes a pending private save of the IMAIRO-120Q result after
// login (same re-post pattern as the merged C02 / relationship-fatigue
// return pages). Copy reused from the relationship-fatigue return page.

import Link from "next/link";
import { useEffect, useState } from "react";

import { buildPublicResultHref } from "../../check-in/resultCompatibility";
import {
  takePendingImairoSave,
  takePendingResultClaim,
  takePendingInterpretationIntent,
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
    // §4: an interpretation intent implies a claim. Both are taken (and therefore CONSUMED) up
    // front, so neither can be replayed by reopening this page or retrying the request.
    const intent = takePendingInterpretationIntent();
    const claim = takePendingResultClaim();

    if (intent) {
      (async () => {
        try {
          const claimed = await fetch(`/api/assessment/results/${intent.resultRowId}/claim`, {
            method: "POST",
          });
          if (!claimed.ok) throw new Error("claim_failed");

          // Same-result matching is structural: the response goes to the row we just claimed, and
          // the server independently verifies owner scope. A cross-owner or mismatched intent
          // cannot succeed even if sessionStorage were tampered with.
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
          // The claim is the part that must not be lost. If only the response failed, the person
          // still owns the result and can answer again on the result page — so this is not an error
          // state, and saying "failed" would be untrue.
          //
          // A retry is SAFE now regardless of what happened here: the nonce makes the server return
          // the original response rather than appending a second one, so an ambiguous network
          // outcome (server wrote the row, reply never arrived) can no longer produce a duplicate.
          if (!responded.ok) console.warn("pending interpretation not applied");
          setClaimedRowId(intent.resultRowId);
        } catch {
          setState("error");
        }
      })();
      return;
    }

    if (claim) {
      fetch(`/api/assessment/results/${claim.resultRowId}/claim`, { method: "POST" })
        .then((response) => {
          if (!response.ok) throw new Error("claim_failed");
          setClaimedRowId(claim.resultRowId);
        })
        .catch(() => setState("error"));
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
