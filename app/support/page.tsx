import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";
import { getSupportWorkspaceData } from "@/lib/server/yorisouAuth";
import { isLineLoginConfigured } from "@/lib/server/yorisouLine";

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
  const resolvedSearchParams = (await searchParams) || {};
  const lineStatus = typeof resolvedSearchParams.line_status === "string" ? resolvedSearchParams.line_status : "";
  const lineError = typeof resolvedSearchParams.line_error === "string" ? resolvedSearchParams.line_error : "";

  return (
    <SupportWorkspace
      locale="ja"
      initialAccount={data.account}
      initialConsultations={data.consultations}
      lineAuthReady={isLineLoginConfigured()}
      lineNotice={lineStatus}
      lineError={lineError}
    />
  );
}
