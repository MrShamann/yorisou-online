import type { Metadata } from "next";

import Shell from "@/app/_corporate/p5r2/Shell";
import ProjectView from "@/app/_corporate/p5r2/views/ProjectView";
import { getCopy } from "@/app/_corporate/i18n";
import { localeFrom, localeMetadata, type SearchParams } from "@/app/_corporate/p5r2/route-helpers";

/** CORP-P5R2 — YORISOU LLC corporate route. PREVIEW ONLY; never deployed to Production. */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return localeMetadata(searchParams, "kakari");
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const locale = await localeFrom(searchParams);
  const copy = await getCopy(locale);
  return (
    <Shell copy={copy} locale={locale} path="/kakari">
      <ProjectView copy={copy} locale={locale} which="kakari" />
    </Shell>
  );
}
