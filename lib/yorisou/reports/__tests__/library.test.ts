import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE } from "@/lib/yorisou/reports/access";
import {
  buildSanitizedSelfUnderstandingReportMarkdown,
  buildSelfUnderstandingPreviewByCode,
  loadParsedSelfUnderstandingReportByCode,
  loadSelfUnderstandingPublicReportByCode,
} from "@/lib/yorisou/reports/loader";
import { parseSelfUnderstandingReportDocument } from "@/lib/yorisou/reports/parser";

export function runSelfUnderstandingReportLibraryValidationTest() {
  const samplePath = path.join(
    process.cwd(),
    "content/yorisou/reports/self-understanding/v0.2.1/EM-AK.md",
  );
  const sampleSource = fs.readFileSync(samplePath, "utf8");

  const parsed = parseSelfUnderstandingReportDocument(sampleSource, samplePath);
  assert.equal(parsed.frontmatter.publicCode, "EM-AK");
  assert.equal(parsed.frontmatter.nicknameJa, "灯起こし");
  assert.equal(parsed.sections.freePreview.includes("このレポートについて"), true);
  assert.equal(parsed.sections.paidCore.includes("人との距離とコミュニケーション"), true);
  assert.equal(parsed.sections.advancedExtension.includes("Limitation Statement"), true);
  assert.equal(parsed.sections.internalNotes.includes("Internal Review Notes"), true);

  assert.throws(
    () =>
      parseSelfUnderstandingReportDocument(
        sampleSource.replace("<!-- PAID_CORE_END -->", ""),
        samplePath,
      ),
    /Malformed report markers/,
  );

  assert.throws(
    () =>
      parseSelfUnderstandingReportDocument(
        sampleSource.replace(
          "<!-- PAID_CORE_START -->",
          "<!-- FREE_PREVIEW_START -->\n<!-- FREE_PREVIEW_END -->\n<!-- PAID_CORE_START -->",
        ),
        samplePath,
      ),
    /Malformed report markers/,
  );

  const loaded = loadParsedSelfUnderstandingReportByCode("EM-AK");
  assert.equal(loaded.frontmatter.publicCode, "EM-AK");
  assert.equal(loaded.frontmatter.nicknameJa, "灯起こし");

  assert.throws(() => loadParsedSelfUnderstandingReportByCode("P05"), /Invalid publicCode/);
  assert.throws(() => loadParsedSelfUnderstandingReportByCode("ZZ-ZZ"), /Invalid publicCode/);

  const publicReport = loadSelfUnderstandingPublicReportByCode("EM-AK", {
    surface: "full-report",
    accessMode: "open-testing",
  });
  const publicPayload = JSON.stringify(publicReport);
  assert.equal(publicReport.sections.freePreview.includes("このレポートについて"), true);
  assert.equal(publicReport.sections.paidCore?.includes("人との距離とコミュニケーション"), true);
  assert.equal(publicReport.sections.advancedExtension?.includes("Limitation Statement"), true);
  assert.equal(publicPayload.includes("Internal Review Notes"), false);
  assert.equal(publicPayload.includes("Internal only:"), false);
  assert.equal(publicPayload.includes("Internal Only"), false);
  assert.equal(publicPayload.includes("ユーザー表示しません"), false);
  assert.equal(publicPayload.includes("実装連携メモ"), false);
  assert.equal(publicPayload.includes("統合メモ"), false);
  assert.equal(publicPayload.includes("purchaseStatus"), false);
  assert.equal(publicPayload.includes("contentStatus"), false);
  assert.equal(publicPayload.includes("codexExecutableNow"), false);

  const preview = buildSelfUnderstandingPreviewByCode("EM-AK");
  assert.equal(preview.markdown.includes("このレポートについて"), true);
  assert.equal(preview.markdown.includes("人との距離とコミュニケーション"), false);
  assert.equal(preview.markdown.includes("Internal Review Notes"), false);
  assert.equal(preview.markdown.includes("Internal only:"), false);
  assert.equal(preview.paragraphs.length > 0, true);

  const sanitizedMarkdown = buildSanitizedSelfUnderstandingReportMarkdown("EM-AK");
  assert.equal(sanitizedMarkdown.includes("purchaseStatus"), false);
  assert.equal(sanitizedMarkdown.includes("contentStatus"), false);
  assert.equal(sanitizedMarkdown.includes("codexExecutableNow"), false);
  assert.equal(sanitizedMarkdown.includes("Internal Review Notes"), false);
  assert.equal(sanitizedMarkdown.includes("Internal only:"), false);
  assert.equal(sanitizedMarkdown.includes("Internal Only"), false);
  assert.equal(sanitizedMarkdown.includes("ユーザー表示しません"), false);
  assert.equal(sanitizedMarkdown.includes("実装連携メモ"), false);
  assert.equal(sanitizedMarkdown.includes("統合メモ"), false);
  assert.equal(sanitizedMarkdown.includes("このレポートについて"), true);
  assert.equal(sanitizedMarkdown.includes("人との距離とコミュニケーション"), true);

  const previewOnlyReport = loadSelfUnderstandingPublicReportByCode("EM-AK", {
    surface: "preview",
    accessMode: "open-testing",
  });
  assert.equal(previewOnlyReport.sections.paidCore, null);
  assert.equal(previewOnlyReport.sections.advancedExtension, null);

  return {
    accessMode: CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE,
    contentFiles: fs.readdirSync(path.join(process.cwd(), "content/yorisou/reports/self-understanding/v0.2.1")).length,
    sampleCode: loaded.frontmatter.publicCode,
    previewParagraphs: preview.paragraphs.length,
  };
}
