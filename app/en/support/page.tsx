import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";
import { getSupportWorkspaceData } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | Support",
  description: "Yorisou's support workspace for consultation history, recommendation review, family sharing, ongoing consultation, and follow-up.",
};

export default async function SupportPageEn() {
  const data = await getSupportWorkspaceData("en");
  return <SupportWorkspace locale="en" initialAccount={data.account} initialConsultations={data.consultations} />;
}
