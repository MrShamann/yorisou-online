import { buildSanitizedSelfUnderstandingReportMarkdown } from "@/lib/yorisou/reports/loader";
import { recordReportEvent } from "@/lib/server/relationship-intelligence/service";
import { requireContinuityContext } from "@/lib/server/canonicalResultContext";

// UX-2R / CPC-1 §2 — the download route was a canonical BYPASS.
//
// The report page was cut over to requireContinuityContext and dutifully appended `?result=<row-id>`
// to the download link — and this route ignored the query string entirely, building the file from
// the path public code alone. So the gated page sat directly beside an ungated door to the same
// content, and "private canonical report" was not yet true.
//
// With `?result` present the same continuity rules apply as on the page: ownership, continuity
// permission, and agreement between the path code and the person's EFFECTIVE (accepted) result.
// Without it the route serves only the governed public derivative, exactly as before — a public
// download and a private one are different contracts and stay structurally separate.

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicCode: string }> },
) {
  const { publicCode } = await params;
  const rawRowId = new URL(request.url).searchParams.get("result");

  if (rawRowId) {
    const loaded = await requireContinuityContext(rawRowId);
    // One concealed response for unavailable AND withheld: a download is a raw content transfer,
    // so unlike the page there is nothing to explain here — and a distinguishable refusal would
    // turn this endpoint into an oracle for whether a given row exists and has been accepted.
    if (loaded.outcome !== "ok") return new Response("Not found", { status: 404 });
    if (loaded.context.effectiveResultId !== publicCode) {
      return new Response("Not found", { status: 404 });
    }
  }

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
