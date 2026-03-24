import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";
import { composeLineReadinessViewModel, getSupportWorkspaceData } from "@/lib/server/yorisouAuth";
import { getLineMessagingConfigStatus, isLineLoginConfigured } from "@/lib/server/yorisouLine";

export const metadata: Metadata = {
  title: "Yorisou | サポートページ",
  description: "相談履歴、ご提案内容、ご家族共有、継続相談、フォローアップをまとめて確認できるYorisouの会員ページです。",
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
