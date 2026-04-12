import type { Metadata } from "next";
import { companionCheckResults, type CompanionCheckResultKey } from "@/lib/yorisouCompanionCheck";
import { normalizeCheckInTrafficSource } from "@/lib/checkInAttribution";

import CompanionCheckFlow from "./CompanionCheckFlow";

export const metadata: Metadata = {
  title: "今日の寄り添い方チェック | Yorisou",
  description: "5問で、いまの寄り添い方を軽く確かめて、LINEで次の小さな一歩につなげるチェックです。",
};

export default async function CheckInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const trafficSource = normalizeCheckInTrafficSource(params.source);
  const initialResultKey =
    typeof params.result === "string" && params.result in companionCheckResults
      ? (params.result as CompanionCheckResultKey)
      : null;

  return <CompanionCheckFlow initialResultKey={initialResultKey} trafficSource={trafficSource} />;
}
