import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

import { MvpActionLink, MvpCard, MvpPill } from "@/app/components/MvpSurface";
import { buildPublicResultHref } from "@/app/check-in/resultCompatibility";
import { findPublicArchetypeContentByCode } from "@/lib/yorisou/public-result";
import { PUBLIC_ARCHETYPE_TAXONOMY } from "@/lib/yorisou/public-result/taxonomy";
import {
  buildSelfUnderstandingReportDownloadHref,
  buildSelfUnderstandingReportHref,
  loadSelfUnderstandingPublicReportByCode,
} from "@/lib/yorisou/reports/loader";

export async function generateStaticParams() {
  return PUBLIC_ARCHETYPE_TAXONOMY.map((item) => ({ publicCode: item.publicCode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicCode: string }>;
}): Promise<Metadata> {
  const { publicCode } = await params;

  try {
    const report = loadSelfUnderstandingPublicReportByCode(publicCode, {
      surface: "full-report",
    });

    return {
      title: `${report.metadata.nicknameJa} の詳しいレポート | Yorisou`,
      description: `${report.metadata.currentStateNote ?? "今の動き方"}を、より詳しく読み解く公開テスト中のレポートです。`,
    };
  } catch {
    return {};
  }
}

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mt-6 text-[1.15rem] font-semibold leading-8 text-[#2F2A28] first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 text-[1rem] font-semibold leading-7 text-[#315F50]">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-3 text-[14px] leading-8 text-[#5F5750] first:mt-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 space-y-2 text-[14px] leading-7 text-[#5F5750]">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="ml-5 list-disc">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[#2F2A28]">{children}</strong>,
  em: ({ children }) => <em className="text-[#49615B]">{children}</em>,
};

export default async function SelfUnderstandingReportPage({
  params,
}: {
  params: Promise<{ publicCode: string }>;
}) {
  const { publicCode } = await params;

  let report: ReturnType<typeof loadSelfUnderstandingPublicReportByCode>;

  try {
    report = loadSelfUnderstandingPublicReportByCode(publicCode, {
      surface: "full-report",
    });
  } catch {
    notFound();
  }

  const taxonomy = PUBLIC_ARCHETYPE_TAXONOMY.find((item) => item.publicCode === report.metadata.publicCode) ?? null;
  const publicContent = findPublicArchetypeContentByCode(report.metadata.publicCode);
  const resultHref = buildPublicResultHref("/result", {
    resultId: report.metadata.publicCode,
  });
  const previewHref = buildPublicResultHref("/report-preview", {
    resultId: report.metadata.publicCode,
  });
  const downloadHref = buildSelfUnderstandingReportDownloadHref(report.metadata.publicCode);
  const sectionEntries = [
    { key: "free-preview", label: "公開プレビュー", markdown: report.sections.freePreview },
    { key: "paid-core", label: "本編", markdown: report.sections.paidCore },
    { key: "advanced-extension", label: "拡張", markdown: report.sections.advancedExtension },
  ].filter((entry): entry is { key: string; label: string; markdown: string } => Boolean(entry.markdown));

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F2_0%,#fffdf8_42%,#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[48rem] space-y-6">
          <Link href={resultHref} className="inline-flex items-center gap-1.5 text-[13px] text-[#49615B] hover:underline">
            ← 結果ページへ戻る
          </Link>

          <div className="flex flex-wrap gap-2">
            <MvpPill>自分理解レポート</MvpPill>
            <MvpPill>オープンテスト中</MvpPill>
            <MvpPill>{report.metadata.publicCode}</MvpPill>
          </div>

          <MvpCard className="space-y-4 rounded-[1.5rem] border-[rgba(23,59,53,0.1)] bg-white/95 p-5 shadow-[0_20px_44px_rgba(23,59,53,0.08)] md:p-7">
            <div className="space-y-3 rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-[linear-gradient(135deg,#F4FAF7_0%,#fff_100%)] px-5 py-5">
              <p className="service-kicker">{report.metadata.currentStateNote ?? "120Qから見た、今の動き方"}</p>
              <h1 className="display-serif text-[2rem] leading-[1.14] text-[#2F2A28] md:text-[2.7rem]">
                {report.metadata.nicknameJa}
              </h1>
              <p className="text-[15px] font-semibold leading-7 text-[#4A3E39]">
                {report.metadata.clanEnglish ?? taxonomy?.clanEnglish ?? ""} / {report.metadata.publicCode}
              </p>
              {publicContent ? (
                <p className="text-[14px] leading-7 text-[#6F625C]">{publicContent.recognitionLine}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <MvpActionLink href={downloadHref} label="Markdownを保存" tone="primary" className="rounded-full" />
              <MvpActionLink href={previewHref} label="プレビューを見る" tone="secondary" className="rounded-full border-[rgba(105,151,130,0.18)] bg-[#F4FAF7] !text-[#315F50] shadow-none" />
              <MvpActionLink href={buildSelfUnderstandingReportHref(report.metadata.publicCode)} label="このページを共有" tone="ghost" className="rounded-full !text-[#315F50]" />
            </div>

            <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[rgba(248,250,246,0.82)] px-4 py-3">
              <p className="text-[12px] leading-6 text-[#6F625C]">
                現在はオープンテスト中のため、公開プレビュー・本編・拡張を続けて読めます。内部メモや運用用の注記は含めていません。
              </p>
            </div>
          </MvpCard>

          {sectionEntries.map((section) => (
            <MvpCard key={section.key} className="space-y-4 rounded-[1.35rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_14px_28px_rgba(23,59,53,0.06)] md:p-6">
              <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">{section.label}</p>
              <div className="space-y-3">
                <ReactMarkdown components={markdownComponents}>{section.markdown}</ReactMarkdown>
              </div>
            </MvpCard>
          ))}
        </div>
      </div>
    </main>
  );
}
