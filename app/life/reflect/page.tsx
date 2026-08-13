import type { Metadata } from "next";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import ReflectionFlow from "./ReflectionFlow";
import SignInRequired from "../SignInRequired";

export const metadata: Metadata = {
  title: "振り返りを書く | Yorisou",
  description: "起きたことを、七つの問いにそって書き残します。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ReflectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  const params = await searchParams;
  // A reflection can be attached to an experience the person already wrote. The id is validated
  // server-side by the RPC (osf1_experience_not_owned), never here — a check in the page would only
  // move the decision away from the place that enforces it.
  const raw = params.experience;
  const experienceId = typeof raw === "string" && raw.length > 0 ? raw : undefined;

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      {accountId ? (
        <ReflectionFlow experienceId={experienceId} />
      ) : (
        <SignInRequired next="/life/reflect" purpose="起きたことを、書き残しておく。" />
      )}
    </main>
  );
}
