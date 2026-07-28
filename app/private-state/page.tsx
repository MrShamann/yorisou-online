import type { Metadata } from "next";

import PrivateStateHome from "./view";
import CanonicalAssessmentPanel from "./CanonicalAssessmentPanel";
import { loadCanonicalPrivateState } from "@/lib/server/canonicalPrivateState";

export const metadata: Metadata = { title: "わたしの今 | Yorisou" };
export const dynamic = "force-dynamic";

// UX-2R / CPC-1 §3 — canonical assessment truth is the PRIMARY current-state model here.
//
// The legacy private-AI view below it (reflections, saved test artefacts, older recommendation
// rows) remains reachable as a clearly separated compatibility section. It is deliberately second:
// two competing answers to "what is my current state" is exactly the defect that the duplicate
// saved record was, one layer up.
export default async function PrivateStatePage() {
  const entries = await loadCanonicalPrivateState();

  return (
    <>
      {entries ? (
        <section className="container pt-8">
          <div className="mx-auto w-full max-w-[42rem]">
            <CanonicalAssessmentPanel entries={entries} />
          </div>
        </section>
      ) : null}
      {entries && entries.length > 0 ? (
        <section className="container pt-6">
          <div className="mx-auto w-full max-w-[42rem]">
            <p className="text-[12px] leading-6 text-[#7A7068]">
              以下は、以前の形式で保存された記録です。いまの状態は上の内容が最新です。
            </p>
          </div>
        </section>
      ) : null}
      <PrivateStateHome />
    </>
  );
}
