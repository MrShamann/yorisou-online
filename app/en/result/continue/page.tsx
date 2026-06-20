import type { Metadata } from "next";

import ResultContinueSurface from "@/app/components/ResultContinueSurface";
import { getYorisouDeepResultContent } from "@/lib/yorisou/persona-deep-result-content";

type SearchParams = Promise<{
  persona?: string;
  completionId?: string;
}>;

const copy = {
  en: {
    title: "Result continuation | Yorisou",
    description: "A calm deep-reading page for P01-P03.",
  },
} as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const params = (await searchParams) || {};
  const personaId = typeof params.persona === "string" ? params.persona : "P01";
  const content = getYorisouDeepResultContent(personaId, "en");
  return {
    title: content ? `${content.official_public_name} | Yorisou` : copy.en.title,
    description: content ? content.deep_report_teaser : copy.en.description,
  };
}

export default async function EnglishResultContinuePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const personaId = typeof params.persona === "string" ? params.persona : "P01";
  const content = getYorisouDeepResultContent(personaId, "en");
  return <ResultContinueSurface locale="en" personaId={personaId} content={content} backHref={`/en/result?persona=${encodeURIComponent(personaId)}`} />;
}

