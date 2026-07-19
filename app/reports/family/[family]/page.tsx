import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { APP2_FAMILY_REPORTS, getFamilyReport } from "@/app/data/app2/familyReports";
import FamilyReportView from "./FamilyReportView";

// One static route per retained family — the nine slugs, from the content model.
export function generateStaticParams(): { family: string }[] {
  return APP2_FAMILY_REPORTS.map((report) => ({ family: report.family }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string }>;
}): Promise<Metadata> {
  const { family } = await params;
  const report = getFamilyReport(family);
  if (!report) {
    return { title: "深掘りレポート｜YORISOU" };
  }
  return {
    title: `${report.title}｜YORISOU`,
    description: report.whatWeUnderstand,
  };
}

export default async function FamilyReportPage({
  params,
}: {
  params: Promise<{ family: string }>;
}) {
  const { family } = await params;
  const report = getFamilyReport(family);
  if (!report) {
    notFound();
  }
  return (
    <main className="aix2">
      <div className="container py-10 md:py-16">
        <div className="mx-auto max-w-[44rem]">
          <FamilyReportView report={report} />
        </div>
      </div>
    </main>
  );
}
