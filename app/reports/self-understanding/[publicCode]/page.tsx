import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

import { OpenTestingReportTracker } from "@/app/components/OpenTestingTracker";
import { buildPublicResultHref } from "@/app/check-in/resultCompatibility";
import { findPublicArchetypeContentByCode } from "@/lib/yorisou/public-result";
import { PUBLIC_ARCHETYPE_TAXONOMY } from "@/lib/yorisou/public-result/taxonomy";
import {
  buildSelfUnderstandingReportDownloadHref,
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
    <h2 className="mt-6 text-[1.15rem] font-semibold leading-8 text-[color:var(--tx)] first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 text-[1rem] font-semibold leading-7 text-[color:var(--jade-bright)]">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-3 text-[14px] leading-8 aix2-mut first:mt-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 space-y-2 text-[14px] leading-7 aix2-mut">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="ml-5 list-disc">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[color:var(--tx)]">{children}</strong>,
  em: ({ children }) => <em className="aix2-faint">{children}</em>,
};

function sanitizeReportMarkdownForDisplay(markdown: string, publicCode: string, clanEnglish?: string) {
  const identityPattern = clanEnglish ? `${clanEnglish} / ${publicCode}` : publicCode;

  return markdown
    .split(/\n\s*\n/)
    .filter((block) => {
      const normalized = block.trim();
      if (!normalized) return false;
      if (normalized.includes(identityPattern)) return false;
      if (/^Secondary badge:/im.test(normalized)) return false;
      return true;
    })
    .join("\n\n");
}

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
  const downloadHref = buildSelfUnderstandingReportDownloadHref(report.metadata.publicCode);
  const publicTypeLabel = `${report.metadata.clanJapanese ?? taxonomy?.clanJapanese ?? ""}のタイプ`;
  const sectionEntries = [
    { key: "free-preview", label: "公開プレビュー", markdown: report.sections.freePreview },
    { key: "paid-core", label: "本編", markdown: report.sections.paidCore },
    { key: "advanced-extension", label: "拡張", markdown: report.sections.advancedExtension },
  ]
    .filter((entry): entry is { key: string; label: string; markdown: string } => Boolean(entry.markdown))
    .map((entry) => ({
      ...entry,
      markdown: sanitizeReportMarkdownForDisplay(
        entry.markdown,
        report.metadata.publicCode,
        report.metadata.clanEnglish ?? taxonomy?.clanEnglish,
      ),
    }));

  return (
    <main className="aix2">
      <OpenTestingReportTracker
        eventType="full_viewed"
        reportType="self-understanding-v0.2.1"
        route={`/reports/self-understanding/${report.metadata.publicCode}`}
        source="full_report_page"
        entrySource="full-report"
        resultId={report.metadata.publicCode}
      />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[46rem] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href={resultHref} className="inline-flex items-center gap-1.5 text-[13px] aix2-link">← 結果ページへ戻る</Link>
            <Link href="/reports" className="text-[12px] aix2-faint hover:underline">深める（レポート一覧）</Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="aix3-chip">自己理解レポート</span>
            <span className="aix3-status aix3-status--testing">試験中</span>
          </div>

          <div className="aix2-glass p-6 space-y-4">
            <div className="rounded-[14px] border border-[var(--hair-jade)] bg-[rgba(47,197,150,0.06)] px-5 py-5">
              <p className="aix2-eyebrow">{report.metadata.currentStateNote ?? "120Qから見た、今の動き方"}</p>
              <h1 className="aix2-serif mt-2 text-[2rem] leading-[1.08] text-[color:var(--tx)] md:text-[2.4rem]">{report.metadata.nicknameJa}</h1>
              <p className="mt-2 text-[14px] font-semibold leading-6 text-[color:var(--jade-bright)]">{publicTypeLabel}</p>
              {publicContent ? <p className="mt-2 text-[14px] leading-7 aix2-mut">{publicContent.recognitionLine}</p> : null}
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link href={downloadHref} className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">レポートを保存</Link>
            </div>
            <p className="text-[12px] leading-6 aix2-faint">
              現在は公開テスト中のため、プレビュー・本編・拡張を続けて読めます。公開してよい内容だけを表示し、内部メモや運用用の注記は含めていません。
            </p>
          </div>

          <div className="aix2-panel p-5">
            <p className="text-[13px] leading-7 aix2-mut">
              このレポートは公開テスト中の全文表示です。読みにくかった箇所や不具合があれば、そのまま感想として送ってください。
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/contact?topic=open-testing" className="aix2-link">レポートの感想を送る →</Link>
              <Link href={downloadHref} className="aix2-link">レポートを保存 →</Link>
            </div>
          </div>

          {sectionEntries.map((section) => (
            <article key={section.key} className="aix2-glass p-6 md:p-7">
              <p className="aix2-eyebrow">{section.label}</p>
              <div className="mt-3">
                <ReactMarkdown components={markdownComponents}>{section.markdown}</ReactMarkdown>
              </div>
            </article>
          ))}

          <div className="pt-2">
            <Link href="/saved" className="aix2-link text-[13px]">この結果を残す・戻る →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
