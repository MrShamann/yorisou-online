import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Yorisou | サポートへ",
  description:
    "Yorisouのご相談はサポートページからご利用いただけます。",
};

export default function AiAdvisorPage() {
  redirect("/support");
}
