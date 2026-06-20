import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Yorisou",
  description: "Yorisou のチェックインと結果ページへ戻ります。",
};

export default function ReservationMobilitySupportPage() {
  redirect("/");
}
