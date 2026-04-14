import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "LINE Mini App | Yorisou",
  description: "Yorisou formal LINE Mini App entry shell.",
};

export default function EnglishMiniAppEntryPage() {
  redirect("/en/line/mini-app/result");
}

