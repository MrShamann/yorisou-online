import type { Metadata } from "next";

import PrivateStateHome from "./view";
import CanonicalAssessmentPanel from "./CanonicalAssessmentPanel";
import AccountDeletionPanel from "./AccountDeletionPanel";
import SignOutControl from "./SignOutControl";
import { loadCanonicalPrivateState } from "@/lib/server/canonicalPrivateState";
import { isPor1CapabilityEnabled } from "@/lib/server/por1RuntimeControls";

export const metadata: Metadata = { title: "わたしの今 | Yorisou" };
export const dynamic = "force-dynamic";

// UX-2R / CPC-1 §3 — canonical assessment truth is the PRIMARY current-state model here.
//
// The legacy private-AI view below it (reflections, saved test artefacts, older recommendation
// rows) remains reachable as a clearly separated compatibility section. It is deliberately second:
// two competing answers to "what is my current state" is exactly the defect that the duplicate
// saved record was, one layer up.
export default async function PrivateStatePage() {
  const canonicalCore = isPor1CapabilityEnabled("CANONICAL_CORE");
  const load = await loadCanonicalPrivateState();

  return (
    <>
      {canonicalCore && load.outcome === "temporarily_unavailable" ? (
        <section className="container pt-8">
          <div
            role="alert"
            className="mx-auto w-full max-w-[42rem] rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5"
          >
            <p className="text-[13px] font-semibold text-[#315F50]">いまの状態</p>
            <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
              保存された結果を読み込めませんでした。記録が消えたわけではありません。
              少し時間をおいて、もう一度開いてみてください。
            </p>
          </div>
        </section>
      ) : null}
      {/* WS6: with CANONICAL_CORE off this panel is absent entirely, leaving the legacy private
          view below as the only answer — the baseline shape, not an empty new container. */}
      {canonicalCore && (load.outcome === "ok" || load.outcome === "empty") ? (
        <section className="container pt-8">
          <div className="mx-auto w-full max-w-[42rem]">
            <CanonicalAssessmentPanel entries={load.outcome === "ok" ? load.entries : []} />
          </div>
        </section>
      ) : null}
      {/* Every AUTHENTICATED outcome — including a read failure. Ending the session must never
          depend on the results read succeeding; an anonymous visitor has no session to end. */}
      {load.outcome !== "unauthenticated" ? (
        <section className="container pt-4">
          <div className="mx-auto w-full max-w-[42rem]">
            <SignOutControl />
          </div>
        </section>
      ) : null}
      {canonicalCore && load.outcome === "ok" ? (
        <section className="container pt-6">
          <div className="mx-auto w-full max-w-[42rem]">
            <p className="text-[12px] leading-6 text-[#7A7068]">
              以下は、以前の形式で保存された記録です。いまの状態は上の内容が最新です。
            </p>
          </div>
        </section>
      ) : null}
      <PrivateStateHome />

      {/* Account deletion lives with the person's own records, not buried in a support page.
          Last on the page: it is the end of the relationship, not a step in it. */}
      {load.outcome !== "unauthenticated" ? (
        <section className="container py-8">
          <div className="mx-auto w-full max-w-[42rem]">
            <AccountDeletionPanel />
          </div>
        </section>
      ) : null}
    </>
  );
}
