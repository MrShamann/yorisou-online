import type { Metadata } from "next";
import Link from "next/link";

import MyContinuity from "./MyContinuity";
import { lifeOsVisibleInNavigation } from "@/lib/server/lifeOs/routeAccess";

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
export default async function MyYorisouPage() {
  // The entry point exists only while the Life OS does, and it asks the SAME question the route
  // answers. A navigation check with its own logic is how a link appears for someone the route will
  // then refuse — which both leaks that the feature exists and hands them a dead end.
  const lifeOsOpen = await lifeOsVisibleInNavigation();
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-8 md:pt-14">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        わたし
      </h1>
      <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        保存したものは、この端末のあなたにだけ表示されます。
      </p>

      <MyContinuity />

      {/* OSF-1 — the way through to the account-backed records.
          A link, not an embedded section: this page stays static and device-local (reading the
          account here would make わたし dynamic for every visitor, including the signed-out ones it
          was rebuilt for). The destination says plainly what it is, and says so to signed-out
          visitors too rather than hiding. */}
      {lifeOsOpen && (
      <section className="mt-12">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          アカウントに残す
        </h2>
        <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          振り返りや、向かいたい方向は、サインインすると端末を越えて残せます。
        </p>
        <Link
          href="/life"
          className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          わたしの記録を見る
        </Link>
      </section>
      )}
    </main>
  );
}
