import type { Metadata } from "next";

import MyContinuity from "./MyContinuity";

export const metadata: Metadata = {
  title: "わたし | Yorisou",
  description: "保存した結果と、これまでの気づき。",
};

// わたし — continuity first, settings last.
//
// Deliberately not an account dashboard. What someone returns for is the thread of their own
// history; a profile header and a settings list would put the least personal thing at the top.
//
// The history itself is a client island: it is read from device-local records, and the previous
// version of this page was a static shell that told EVERY visitor 「まだ記録はありません」 —
// including the ones who had a record. An empty state shown to someone who is not empty is not a
// cosmetic problem; it is the product losing their history in front of them.
export default function MyYorisouPage() {
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-8 md:pt-14">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        わたし
      </h1>
      <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        保存したものは、この端末のあなたにだけ表示されます。
      </p>

      <MyContinuity />
    </main>
  );
}
