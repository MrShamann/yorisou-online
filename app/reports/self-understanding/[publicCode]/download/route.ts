import { buildSanitizedSelfUnderstandingReportMarkdown } from "@/lib/yorisou/reports/loader";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicCode: string }> },
) {
  const { publicCode } = await params;

  try {
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
