import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";

export const metadata: Metadata = {
  title: "Talk with Hinata | Yorisou",
  description: "Reflect on your current state, daily rhythm, and Yorisou check results with Hinata. This is a self-reflection support space, not medical, psychological, legal, or professional advice.",
};

export default async function SupportPageEn({
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SupportWorkspace locale="en" />;
}
