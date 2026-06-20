import { redirect } from "next/navigation";

import { buildT6PublicResultSearchParams } from "../../check-in/t6ResultModel";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function ResultContinuePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const routeState = {
    resultId: readParam(params, "resultId"),
    overlayId: readParam(params, "overlayId"),
    confidenceBand:
      readParam(params, "confidence") === "medium"
        ? "medium"
        : readParam(params, "confidence") === "low"
          ? "low"
          : null,
    payloadKey: readParam(params, "payloadKey"),
  } as const;

  const query = buildT6PublicResultSearchParams(routeState);
  if (query) {
    redirect(`/result?${query}`);
  }

  redirect("/saved");
}
