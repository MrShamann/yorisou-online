import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "LINE Mini App result entry | Yorisou",
  description: "Formal LINE Mini App entry shell that hands off into the canonical Yorisou result surface.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EnglishMiniAppResultEntryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  redirect(buildMiniAppCheckInHandoffHref({ locale: "en", searchParams: params }));
}
