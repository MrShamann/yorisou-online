import type { Metadata } from "next";
import { notFound } from "next/navigation";
// YV-1 — yorisou-values「いま大事にしたいことチェック」route (SERVER-SIDE gated).
// Production: default closed — this page 404s; no nav card, no catalog listing,
// no sitemap link. The gate is enforced here and in every API route.

import { yorisouValuesAccess } from "@/lib/yorisou/methods/yorisou-values/access";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { YorisouValuesFlow } from "./YorisouValuesFlow";

export const metadata: Metadata = {
  title: "いま大事にしたいことチェック | YORISOU",
  robots: { index: false, follow: false }, // gated implementation candidate — never indexed
};

export const dynamic = "force-dynamic";

export default async function YorisouValuesPage() {
  const access = yorisouValuesAccess();
  if (!access.allowed) notFound();
  const viewer = await getViewerContext();
  const authenticated = Boolean(viewer.account?.id || viewer.legacyAccount?.id);
  return <YorisouValuesFlow authenticated={authenticated} />;
}
