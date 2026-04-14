import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildMiniAppResultHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "LINE Mini App | Yorisou",
  description: "Yorisou formal LINE Mini App entry shell.",
};

export default function EnglishMiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  redirect(buildMiniAppResultHandoffHref({ locale: "en", searchParams: searchParams || {} }));
}
