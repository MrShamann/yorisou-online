import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Yorisou | Support",
  description:
    "Yorisou support is available from the support page.",
};

export default function AiAdvisorPageEn() {
  redirect("/en/support");
}
