import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "LINE Mini App | Yorisou",
  description: "Yorisouの正式なLINE Mini App entry shellです。チェックイン開始点へ移動します。",
};

export default function MiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  redirect(buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: searchParams || {} }));
}
