import type { Metadata } from "next";

import Shell from "@/app/_corporate/p5r2/Shell";
import BuildWithUsView from "@/app/_corporate/p5r2/views/BuildWithUsView";
import { getCopy } from "@/app/_corporate/i18n";
import { localeFrom, localeMetadata, type SearchParams } from "@/app/_corporate/p5r2/route-helpers";

/** CORP-v1.2 — YORISOU Foundry corporate route. PREVIEW ONLY; never deployed to Production. */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return localeMetadata(searchParams, "buildWithUs");
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const locale = await localeFrom(searchParams);
  const copy = await getCopy(locale);
  return (
    <Shell copy={copy} locale={locale} path="/build-with-us">
      <BuildWithUsView copy={copy} locale={locale} />
    </Shell>
  );
}
