import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Yorisou",
  description: "Redirecting to Yorisou English home.",
};

export default function ReservationMobilitySupportPageEn() {
  redirect("/en");
}
