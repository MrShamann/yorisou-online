export type PublicResultConfidenceBand = "low" | "medium";

export type PublicResultRouteContext = {
  resultId?: string | null;
  overlayId?: string | null;
  confidenceBand?: PublicResultConfidenceBand | null;
  payloadKey?: string | null;
};

export type Temporary120QResultCompatibility = {
  resultStatus: "placeholder_ready" | "placeholder_pending";
  resultVersion: "phase-3.5";
  sourceModel: "yorisou-120q";
  taxonomyStatus: "RESULT_TAXONOMY_NOT_APPROVED";
  placeholderText: string;
};

export const RESULT_TAXONOMY_NOT_APPROVED = "RESULT_TAXONOMY_NOT_APPROVED" as const;

export function buildPublicResultSearchParams(context: PublicResultRouteContext) {
  const params = new URLSearchParams();

  if (context.resultId) {
    params.set("resultId", context.resultId);
  }

  if (context.overlayId) {
    params.set("overlayId", context.overlayId);
  }

  if (context.confidenceBand) {
    params.set("confidence", context.confidenceBand);
  }

  if (context.payloadKey) {
    params.set("payloadKey", context.payloadKey);
  }

  return params.toString();
}

export function buildPublicResultHref(pathname: string, context: PublicResultRouteContext) {
  const query = buildPublicResultSearchParams(context);
  return query ? `${pathname}?${query}` : pathname;
}

export function getTemporary120QResultCompatibility(
  context: PublicResultRouteContext,
): Temporary120QResultCompatibility {
  const hasResultContext = Boolean(context.resultId || context.overlayId || context.payloadKey);

  return {
    resultStatus: hasResultContext ? "placeholder_ready" : "placeholder_pending",
    resultVersion: "phase-3.5",
    sourceModel: "yorisou-120q",
    taxonomyStatus: RESULT_TAXONOMY_NOT_APPROVED,
    placeholderText:
      "120問の正式な結果分類は承認待ちです。現在は互換表示のみを行い、分類名や詳細解釈は公開していません。",
  };
}
