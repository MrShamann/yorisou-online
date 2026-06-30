import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Find your support pattern | Yorisou",
  description: "A mobile-first LINE MINI App flow that helps you find the kind of support that fits you right now.",
};

export default async function EnglishCheckInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const entrySource = typeof params.entry_source === "string" ? params.entry_source : typeof params.source === "string" ? params.source : null;
  const query = new URLSearchParams();

  if (entrySource) {
    query.set("entry_source", entrySource);
  }

  redirect(query.size > 0 ? `/check-in?${query.toString()}` : "/check-in");
}
