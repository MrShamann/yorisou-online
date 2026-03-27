import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";
import { composeLineReadinessViewModel, getSupportWorkspaceData } from "@/lib/server/yorisouAuth";
import { getLineMessagingConfigStatus, isLineLoginConfigured } from "@/lib/server/yorisouLine";

export const metadata: Metadata = {
  title: "ひなたに相談する | Yorisou",
  description: "AI相談員 ひなたと一緒に、移動や暮らしのお悩みを整理し、必要な支え方や次のご案内につなげられるYorisouの相談ページです。",
};

export default async function SupportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const data = await getSupportWorkspaceData("ja");
  const lineAuthReady = isLineLoginConfigured();
  const lineMessagingReady = getLineMessagingConfigStatus().messagingConfigured;
  const resolvedSearchParams = (await searchParams) || {};
  const lineStatus = typeof resolvedSearchParams.line_status === "string" ? resolvedSearchParams.line_status : "";
  const lineError = typeof resolvedSearchParams.line_error === "string" ? resolvedSearchParams.line_error : "";
  const lineReadiness = composeLineReadinessViewModel({
    diagnostics: data.supportDiagnostics,
    lineIdentityPresent: Boolean(data.account?.lineUserId),
    loginConfigured: lineAuthReady,
    messagingConfigured: lineMessagingReady,
  });

  return (
    <SupportWorkspace
      locale="ja"
      initialAccount={data.account}
      initialSupportDiagnostics={data.supportDiagnostics}
      initialLineReadiness={lineReadiness}
      initialAccessAccountability={data.accessAccountability}
      initialConsultations={data.consultations}
      initialLatestLineEvent={data.latestLineEvent}
      lineAuthReady={lineAuthReady}
      lineMessagingReady={lineMessagingReady}
      lineNotice={lineStatus}
      lineError={lineError}
    />
  );
}
