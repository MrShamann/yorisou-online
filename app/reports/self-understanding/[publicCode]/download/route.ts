import {
  assertValidSelfUnderstandingReportCode,
  buildSanitizedSelfUnderstandingReportMarkdown,
} from "@/lib/yorisou/reports/loader";
import { recordReportEvent } from "@/lib/server/relationship-intelligence/service";
import { requireContinuityContext } from "@/lib/server/canonicalResultContext";
import { canonicalRowIdWhenEnabled } from "@/lib/server/por1RuntimeControls";

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
  const rawRowId = canonicalRowIdWhenEnabled(
    new URL(request.url).searchParams.get("result"),
    "CANONICAL_CORE",
  );

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

  // ── ABSENCE AND FAILURE ARE DIFFERENT ANSWERS ────────────────────────────
  //
  // This whole block used to be one `try { … } catch { 404 }`. Any exception at all — a missing
  // bundle, a parser fault, a telemetry write that failed — was reported to the person as "your
  // report does not exist". That is how a globally broken download stayed invisible: the endpoint
  // answered 404 for EVERY report and 404 is exactly what a legitimately absent one returns.
  //
  // An unknown code is still concealed with the same indistinguishable 404, because a distinguishable
  // refusal would turn this endpoint into an oracle. But a report that EXISTS and could not be
  // produced is an internal failure and says so.
  try {
    assertValidSelfUnderstandingReportCode(publicCode);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  let markdown: string;
  try {
    markdown = buildSanitizedSelfUnderstandingReportMarkdown(publicCode);
  } catch (error) {
    // Bounded and internal-only. No path, no stack, no report content, no identity — the person gets
    // a generic failure and the operator gets a class.
    console.error("report_download_build_failed", {
      publicCode,
      code: error instanceof Error ? error.message.slice(0, 120) : "unknown",
    });
    return new Response("Report temporarily unavailable", { status: 500 });
  }

  // TELEMETRY IS BEST-EFFORT AND CANNOT DECIDE WHETHER A REPORT EXISTS.
  //
  // It used to be awaited FIRST, inside the same catch, so a failed analytics write produced "not
  // found" for a report that was sitting right there. Observability must never gate the deliverable.
  try {
    await recordReportEvent({
      eventType: "downloaded",
      reportType: "self-understanding-v0.2.1",
      route: `/reports/self-understanding/${publicCode}/download`,
      source: "report_download_route",
      entrySource: "download",
      resultId: publicCode,
    });
  } catch (error) {
    console.error("report_download_telemetry_failed", {
      publicCode,
      code: error instanceof Error ? error.message.slice(0, 120) : "unknown",
    });
  }

  const filename = `yorisou_report_${publicCode}_v0.2.1_public.md`;
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
