import { buildSanitizedSelfUnderstandingReportMarkdown } from "@/lib/yorisou/reports/loader";
import { recordReportEvent } from "@/lib/server/relationship-intelligence/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicCode: string }> },
) {
  const { publicCode } = await params;

  try {
    await recordReportEvent({
      eventType: "downloaded",
      reportType: "self-understanding-v0.2.1",
      route: `/reports/self-understanding/${publicCode}/download`,
      source: "report_download_route",
      entrySource: "download",
      resultId: publicCode,
    });
    const markdown = buildSanitizedSelfUnderstandingReportMarkdown(publicCode);
    const filename = `yorisou_report_${publicCode}_v0.2.1_public.md`;

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
