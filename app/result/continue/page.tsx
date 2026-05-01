import type { Metadata } from "next";

import ResultContinueSurface from "@/app/components/ResultContinueSurface";
import { getYorisouDeepResultContent } from "@/lib/yorisou/persona-deep-result-content";

type SearchParams = Promise<{
  persona?: string;
  completionId?: string;
}>;

const copy = {
  ja: {
    title: "結果のつづき | Yorisou",
    description: "P01-P03 の深い読みを、やさしく続けて読めるページです。",
  },
} as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const params = (await searchParams) || {};
  const personaId = typeof params.persona === "string" ? params.persona : "P01";
  const content = getYorisouDeepResultContent(personaId, "ja");
  return {
    title: content ? `${content.official_public_name} | Yorisou` : copy.ja.title,
    description: content ? content.deep_report_teaser : copy.ja.description,
  };
}

export default async function ResultContinuePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const personaId = typeof params.persona === "string" ? params.persona : "P01";
  const content = getYorisouDeepResultContent(personaId, "ja");
  return <ResultContinueSurface locale="ja" personaId={personaId} content={content} backHref={`/result?persona=${encodeURIComponent(personaId)}`} />;
}

