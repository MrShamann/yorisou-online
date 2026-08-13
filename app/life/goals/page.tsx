import type { Metadata } from "next";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { listGoals } from "@/lib/server/lifeOs/store";
import GoalsPanel from "./GoalsPanel";
import SignInRequired from "../SignInRequired";

export const metadata: Metadata = {
  title: "向かいたい方向 | Yorisou",
  description: "いま大切にしたいことを、言葉にしておきます。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
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
    </main>
  );
}
