import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "LINE Mini App | Yorisou",
  description: "Yorisou formal LINE Mini App entry shell. It routes into the mobile check-in flow.",
};

export default async function EnglishMiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  redirect(buildMiniAppCheckInHandoffHref({ locale: "en", searchParams: resolvedSearchParams }));
}
