import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "LINEから結果へ | Yorisou",
  description: "LINEから受け取った結果の入口を、Yorisouの canonical result surface に引き継ぎます。",
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

export default async function LineResultEntryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const query = buildQuery(params);
  redirect(query ? `/result?${query}` : "/result");
}
