import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";

export const metadata: Metadata = {
  title: "Yorisou Support | Yorisou",
  description:
    "This page helps you confirm login status and access permissions. Founder dashboard access requires an admin-authorized email account.",
};

export default async function SupportPageEn({
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SupportWorkspace locale="en" />;
}
