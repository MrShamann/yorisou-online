import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import ExperienceForm from "./ExperienceForm";
import SignInRequired from "../SignInRequired";
import { lifeOsAccess } from "@/lib/life-os/access";

export const metadata: Metadata = {
  title: "経験を書く | Yorisou",
  description: "やってみたことと、その結果を書きとめておきます。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  // OSF-1 FEATURE GATE. Default CLOSED: production and unknown contexts 404 before any
  // session lookup or database read. Route-concealing, following pilotRouteAccess.
  if (!lifeOsAccess().allowed) notFound();
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      {accountId ? (
        <ExperienceForm />
      ) : (
        <SignInRequired next="/life/experience" purpose="やってみたことを、書きとめておく。" />
      )}
    </main>
  );
}
