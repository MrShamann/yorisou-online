import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildMiniAppResultHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "LINE Mini App | Yorisou",
  description: "Yorisouの正式なLINE Mini App entry shellです。",
};

export default function MiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  redirect(buildMiniAppResultHandoffHref({ locale: "ja", searchParams: searchParams || {} }));
}
