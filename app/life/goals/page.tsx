import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { listGoals } from "@/lib/server/lifeOs/store";
import GoalsPanel from "./GoalsPanel";
import SignInRequired from "../SignInRequired";
import { lifeOsAccess } from "@/lib/life-os/access";

export const metadata: Metadata = {
  title: "向かいたい方向 | Yorisou",
  description: "いま大切にしたいことを、言葉にしておきます。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// 向かいたい方向 — LIFE DIRECTION / INTENTION, not task management.
//
// This surface deliberately offers no due date, no reminder, no progress indicator, no sort control
// and no completion celebration. A person writes what they want to hold in view, and can later say
// they are still with it, have set it down, reached it, or let it go — four equal answers. The
// approved writing rules prohibit goal-setting language that pressures commitment, and every one of
// the affordances left out above is that pressure wearing a UI.

export default async function GoalsPage() {
  // OSF-1 FEATURE GATE. Default CLOSED: production and unknown contexts 404 before any
  // session lookup or database read. Route-concealing, following pilotRouteAccess.
  if (!lifeOsAccess().allowed) notFound();
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/life/goals" purpose="いま大切にしたいことを、書いておく。" />
      </main>
    );
  }
  // An unreachable database means an empty list and a working form, not a 500 — the person can still
  // write, and the failure surfaces where it is actionable (the save response).
  const goals = await listGoals(accountId).catch(() => []);
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <GoalsPanel initialGoals={goals} />
      {/* The way back, in the same words これまで uses — this screen was reached from わたしの記録 and
          had no link returning to it. */}
      <Link
        href="/life"
        className="mt-9 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        わたしの記録へ
      </Link>
    </main>
  );
}
