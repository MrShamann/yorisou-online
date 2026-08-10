"use client";

// UX-2R / CPC-1 Wave A — an HONEST transition.
//
// What this page used to claim, and why it was withdrawn:
//   • four timed steps ("今の状態を整理中", "人との距離感を確認中", …) implied that analysis was
//     running here. Nothing was running. Scoring completed server-side at attempt completion,
//     before this page was ever reached.
//   • a 3.9s artificial delay plus a 4.4s hard-redirect fallback existed only to let the fake
//     steps play out.
//   • the outbound link was rebuilt from `resultId`/`overlayId`/`payloadKey`, so a persisted
//     result arriving here lost its stable identity and /result fell back to URL-encoded values.
//
// What it does now: it carries the identity it was given straight through to /result. The only
// honest thing to say during that handoff is that the result is being opened.

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MvpCard, MvpPill } from "../components/MvpSurface";
import {
  buildPrivateContinuityHref,
  legacyIdentity,
  persistedIdentity,
  PERSISTED_RESULT_QUERY_KEY,
} from "../result/resultIdentityRoutes";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ReportLoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resultHref = useMemo(() => {
    const rowId = searchParams.get(PERSISTED_RESULT_QUERY_KEY);
    const legacy = {
      resultId: searchParams.get("resultId"),
      overlayId: searchParams.get("overlayId"),
      confidenceBand: searchParams.get("confidence") === "medium" ? ("medium" as const) : ("low" as const),
      payloadKey: searchParams.get("payloadKey"),
    };

    // A persisted identity wins outright and travels alone — no legacy parameters ride along,
    // so /result can never prefer a URL-encoded result over the stored record.
    if (rowId && UUID_RE.test(rowId)) {
      return buildPrivateContinuityHref("/result", persistedIdentity(rowId, legacy));
    }
    if (rowId) return null; // malformed identity: never silently downgrade to legacy
    if (!legacy.resultId && !legacy.payloadKey) return null;
    return buildPrivateContinuityHref("/result", legacyIdentity(legacy));
  }, [searchParams]);

  useEffect(() => {
    if (!resultHref) return;
    router.replace(resultHref);
  }, [resultHref, router]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.99),_rgba(247,244,238,0.98)_42%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
      <section className="container flex min-h-screen items-center py-8 md:py-12">
        <div className="mx-auto w-full max-w-[34rem] space-y-5">
          <MvpCard className="space-y-5 p-5 sm:p-6">
            {resultHref ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <MvpPill>結果を開いています</MvpPill>
                </div>
                <div className="space-y-3">
                  <p className="service-kicker">いま色テスト by よりそう</p>
                  <h1 className="display-serif text-[2.1rem] leading-[1.16] md:text-[2.8rem]">
                    結果ページに移動します
                  </h1>
                  {/* Truthful: the result already exists. This page only opens it. */}
                  <p className="text-[14px] leading-7 text-[var(--muted)]" aria-live="polite">
                    結果はすでに作成されています。このページで新しく計算しているわけではありません。自動で移動しない場合は、下のボタンから開いてください。
                  </p>
                </div>
                <a
                  href={resultHref}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-4 py-3 text-[15px] font-extrabold text-white"
                >
                  結果ページを開く
                </a>
              </>
            ) : (
              // Identical concealed state for missing and malformed identity: this page must not
              // reveal whether a particular result exists.
              <>
                <div className="flex flex-wrap gap-2">
                  <MvpPill>結果を開けませんでした</MvpPill>
                </div>
                <div className="space-y-3">
                  <p className="service-kicker">いま色テスト by よりそう</p>
                  <h1 className="display-serif text-[2.1rem] leading-[1.16] md:text-[2.8rem]">
                    結果を開けませんでした
                  </h1>
                  <p className="text-[14px] leading-7 text-[var(--muted)]">
                    リンクの有効期限が切れているか、この端末からは開けない結果です。もう一度チェックから始めることができます。
                  </p>
                </div>
                <a
                  href="/check-in"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-4 py-3 text-[15px] font-extrabold text-white"
                >
                  チェックをはじめる
                </a>
              </>
            )}
          </MvpCard>
        </div>
      </section>
    </main>
  );
}
