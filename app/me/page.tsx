import type { Metadata } from "next";
import Link from "next/link";

import MyContinuity from "./MyContinuity";
import MeComposition from "./MeComposition";
import AccountContinuity from "./AccountContinuity";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { resolveLifeOsRouteAccess } from "@/lib/server/lifeOs/routeAccess";

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
  // ONE resolution, both uses. The gate and the viewer come from the same authority — resolving
  // them separately is how a page ends up scoping data to a different identity than the one that
  // passed the gate, which is the mistake app/life/page.tsx documents at length.
  const access = await resolveLifeOsRouteAccess();
  const lifeOsOpen = access.allowed;
  const accountId = access.accountId;
  // A SECOND QUESTION, NOT A SECOND GATE. `access` answers "may this person see the Life OS?", and
  // in production the answer is no for an ordinary account. Whether they are SIGNED IN is a
  // different question with a different authority, and the saved-result store has its own. Reading
  // the Life OS identity for account data would deny a signed-in person their own saved result.
  const viewer = await getViewerContext();
  const signedInAccountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-8 md:pt-14">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        わたし
      </h1>
      {/* The old line said this of the WHOLE page, which stopped being true once a result could be
          saved to an account. It now describes the section it actually belongs to. */}
      <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        {signedInAccountId
          ? "この端末に残したものと、アカウントに残したものが並びます。"
          : "保存したものは、この端末のあなたにだけ表示されます。"}
      </p>

      <MyContinuity />

      {/* ARCH-P7 — the five-part composition, for someone who is signed in. A signed-out visitor
          sees exactly what they saw before: the device-local history above and nothing that
          pretends to know them. */}
      {lifeOsOpen && accountId ? <MeComposition accountId={accountId} /> : null}

      {/* What is on the ACCOUNT — the half わたし never mentioned. Independent of the Life OS gate,
          because a saved result is not Life OS data and its store is not that gate's to answer for. */}
      <AccountContinuity accountId={signedInAccountId} />

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
