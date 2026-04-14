import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "LINE Mini App | Yorisou",
  description: "Yorisouの正式なLINE Mini App entry shellです。",
};

export default function MiniAppEntryPage() {
  redirect("/line/mini-app/result");
}

