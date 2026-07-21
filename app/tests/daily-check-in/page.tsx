import type { Metadata } from "next";
import { notFound } from "next/navigation";
// DCI-1 — daily-check-in「きょうの空模様」route (SERVER-SIDE gated).
// Production: default closed — this page 404s; no nav card, no catalog listing,
// no sitemap entry links here. The gate is enforced here and in every API route
// (client-only hiding is never the gate).

import { resolveDailyCheckInRouteAccess } from "@/lib/cpv1/pilotRouteAccess";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { DailyCheckInFlow } from "./DailyCheckInFlow";

export const metadata: Metadata = {
  title: "きょうの空模様 — 1分のじぶん記録 | YORISOU",
  robots: { index: false, follow: false }, // gated implementation candidate — never indexed
};

export const dynamic = "force-dynamic";

export default async function DailyCheckInPage() {
  const gate = await resolveDailyCheckInRouteAccess();
  if (!gate.allowed) notFound();
  const viewer = gate.viewer ?? (await getViewerContext());
  const authenticated = Boolean(viewer.account?.id || viewer.legacyAccount?.id);
  return <DailyCheckInFlow authenticated={authenticated} />;
}
