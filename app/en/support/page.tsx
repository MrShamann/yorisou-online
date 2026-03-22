import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";
import { getSupportWorkspaceData } from "@/lib/server/yorisouAuth";
import { isLineLoginConfigured } from "@/lib/server/yorisouLine";

export const metadata: Metadata = {
  title: "Yorisou | Support",
  description: "Yorisou's support workspace for consultation history, recommendation review, family sharing, ongoing consultation, and follow-up.",
};

export default async function SupportPageEn({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const data = await getSupportWorkspaceData("en");
  const resolvedSearchParams = (await searchParams) || {};
  const lineStatus = typeof resolvedSearchParams.line_status === "string" ? resolvedSearchParams.line_status : "";
  const lineError = typeof resolvedSearchParams.line_error === "string" ? resolvedSearchParams.line_error : "";

  return (
    <SupportWorkspace
      locale="en"
      initialAccount={data.account}
      initialConsultations={data.consultations}
      lineAuthReady={isLineLoginConfigured()}
      lineNotice={lineStatus}
      lineError={lineError}
    />
  );
}
