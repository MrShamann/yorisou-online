import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import ReflectionFlow from "./ReflectionFlow";
import SignInRequired from "../SignInRequired";
import { lifeOsAccess } from "@/lib/life-os/access";

export const metadata: Metadata = {
  title: "振り返りを書く | Yorisou",
  // Mode-neutral on purpose: metadata is static, and the number of questions depends on which mode
  // was opened (light = 5, postmortem = 7).
  description: "起きたことを、問いにそって書き残します。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ReflectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // OSF-1 FEATURE GATE. Default CLOSED: production and unknown contexts 404 before any
  // session lookup or database read. Route-concealing, following pilotRouteAccess.
  if (!lifeOsAccess().allowed) notFound();
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  const params = await searchParams;
  // A reflection can be attached to an experience the person already wrote. The id is validated
  // server-side by the RPC (osf1_experience_not_owned), never here — a check in the page would only
  // move the decision away from the place that enforces it.
  const raw = params.experience;
  // Two entry points, one flow. Light is the default; the postmortem is reached deliberately.
  const mode = params.mode === "postmortem" ? ("postmortem" as const) : ("light" as const);
  const experienceId = typeof raw === "string" && raw.length > 0 ? raw : undefined;

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      {accountId ? (
        <ReflectionFlow experienceId={experienceId} mode={mode} />
      ) : (
        // The mode has to survive the sign-in round trip, or someone who chose the postmortem comes
        // back to the light flow without being told it changed.
        <SignInRequired
          next={mode === "postmortem" ? "/life/reflect?mode=postmortem" : "/life/reflect"}
          purpose="起きたことを、書き残しておく。"
        />
      )}
    </main>
  );
}
