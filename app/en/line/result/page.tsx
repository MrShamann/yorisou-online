import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "LINE to result | Yorisou",
  description: "Continue from LINE into the canonical Yorisou result surface.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function buildQuery(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      query.set(key, value);
    }
  }
  return query.toString();
}

export default async function EnglishLineResultEntryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const query = buildQuery(params);
  redirect(query ? `/en/result?${query}` : "/en/result");
}
