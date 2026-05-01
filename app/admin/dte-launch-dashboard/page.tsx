import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdminViewer } from "@/lib/server/foundation/access";
import { getLineMessagingConfigStatus } from "@/lib/server/yorisouLine";
import { getDteLaunchStoreStatus, listDteLaunchEventRecords } from "@/lib/server/dteLaunchEventStore";
import { listDynamicTestCompletionRecords } from "@/lib/server/dynamicTestCompletionStore";

export const dynamic = "force-dynamic";

function countBy<T>(items: T[], getter: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getter(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1]);
}

function countEvent(items: { payload: { event?: string | null } }[], eventName: string) {
  return items.filter((entry) => entry.payload.event === eventName).length;
}

export default async function DteLaunchDashboardPage() {
  await requireAdminViewer();

  const [completions, launchEvents] = await Promise.all([
    listDynamicTestCompletionRecords("yorisou_dte"),
    listDteLaunchEventRecords(400),
  ]);

  const storeStatus = getDteLaunchStoreStatus();
  const lineConfig = getLineMessagingConfigStatus();
  const runtimeInfo = {
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelUrl: process.env.VERCEL_URL || null,
    vercelCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    vercelBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
    productionDomain: process.env.VERCEL_PROJECT_PRODUCTION_URL || "yorisou.online",
  };
  const storeModeNote =
    storeStatus.mode === "shared_s3"
      ? "production-persistent shared store"
      : "local file fallback; ephemeral on Vercel serverless";

  const shareCounts = countBy(
    launchEvents.filter((entry) =>
      [
        "share_clicked",
        "share_native_opened",
        "share_native_completed",
        "share_native_cancelled",
        "share_native_failed",
        "share_native_fallback",
        "share_image_save_intent",
        "share_copy_text",
        "share_copy_link",
        "share_card_opened",
        "share_page_opened",
        "x_share_clicked",
        "line_share_clicked",
        "facebook_share_clicked",
      ].includes(
        entry.payload.event,
      ),
    ),
    (entry) => entry.payload.action || entry.payload.event || "unknown",
  );
  const miniAppLandingCount = countEvent(launchEvents, "mini_app_landing_rendered");
  const startButtonCount = countEvent(launchEvents, "start_button_tapped");
  const sessionStartCount = countEvent(launchEvents, "session_started");
  const q1ReachedCount = countEvent(launchEvents, "q1_reached");
  const questionProgressCount = countEvent(launchEvents, "question_progress");
  const questionAnswerCount = countEvent(launchEvents, "question_answered");
  const questionCompletedCount = countEvent(launchEvents, "question_completed");
  const testCompletedCount = countEvent(launchEvents, "test_completed");
  const completionSuccessCount = completions.filter((entry) => entry.answeredQuestions >= 33 && entry.totalQuestions >= 33).length;
  const resultRevealCount = countEvent(launchEvents, "result_revealed");
  const resultRenderFailedCount = countEvent(launchEvents, "result_render_failed");
  const shareClickedCount = countEvent(launchEvents, "share_clicked");
  const shareNativeAttemptCount = countEvent(launchEvents, "share_native_opened");
  const shareNativeCompletedCount = countEvent(launchEvents, "share_native_completed");
  const shareNativeCancelledCount = countEvent(launchEvents, "share_native_cancelled");
  const shareNativeFailedCount = countEvent(launchEvents, "share_native_failed");
  const shareNativeFallbackCount = countEvent(launchEvents, "share_native_fallback");
  const shareCopyTextCount = countEvent(launchEvents, "share_copy_text");
  const shareCopyLinkCount = countEvent(launchEvents, "share_copy_link");
  const shareCardOpenCount = countEvent(launchEvents, "share_card_opened");
  const sharePageOpenCount = countEvent(launchEvents, "share_page_opened");
  const fallbackErrorCount = resultRenderFailedCount + shareNativeFailedCount + shareNativeFallbackCount;
  const latestCompletions = completions.slice(0, 8);
  const personaDistribution = countBy(completions, (entry) => entry.personaId).slice(0, 8);
  const latestEvents = launchEvents.slice(0, 20);

  const launchChecks = [
    {
      label: "33問セッション完了",
      status: completionSuccessCount > 0 ? "REAL" : "MANUAL",
      note: completionSuccessCount > 0 ? `完了記録 ${completionSuccessCount} 件` : "完了記録はまだありません。",
    },
    {
      label: "結果ページ表示",
      status: resultRevealCount > 0 ? "REAL" : "MANUAL",
      note: resultRevealCount > 0 ? `result_revealed ${resultRevealCount} 件` : "結果表示イベントはまだありません。",
    },
    {
      label: "共有ページ表示",
      status: sharePageOpenCount > 0 ? "REAL" : "MANUAL",
      note: sharePageOpenCount > 0 ? `share_page_opened ${sharePageOpenCount} 件` : "共有ページ表示イベントはまだありません。",
    },
    {
      label: "公開リークなし",
      status: "MANUAL",
      note: "コードレビューと実機確認で継続確認してください。",
    },
    {
      label: "LINE返信待ち体感",
      status: "MANUAL",
      note: "現時点では返信遅延の定量計測は未実装です。",
    },
    {
      label: "結果ファーストビュー",
      status: "MANUAL",
      note: "実機スクリーンショットでのレビュー対象です。",
    },
    {
      label: "管理画面保護",
      status: "REAL",
      note: "requireAdminViewer を利用しています。",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#6E5D4D]">
            <Link href="/admin" className="underline underline-offset-4">
              Back to admin
            </Link>
            <Link href="/admin/timeline" className="underline underline-offset-4">
              Timeline
            </Link>
          </div>
          <h1 className="text-3xl font-light">DTE Launch Dashboard v0.1</h1>
          <p className="max-w-3xl text-sm leading-6 text-[#6E5D4D]">
            Read-only launch evidence view for LINE-first result completion, share behavior, and currently available funnel signals.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Environment" value={runtimeInfo.vercelEnv || "local"} note={`branch: ${runtimeInfo.vercelBranch || "n/a"}`} />
          <Card title="Commit" value={runtimeInfo.vercelCommit || "n/a"} note={runtimeInfo.vercelUrl || "no vercel url"} />
          <Card title="Production" value={runtimeInfo.productionDomain} note="LINE entry target" />
          <Card title="Store mode" value={storeStatus.mode} note={storeModeNote} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="LINE entry">
            <dl className="grid gap-2 text-sm">
              <Row label="Mini-app rendered">{miniAppLandingCount > 0 ? `REAL · ${miniAppLandingCount}` : "MANUAL"}</Row>
              <Row label="Start tapped">{startButtonCount > 0 ? `REAL · ${startButtonCount}` : "MANUAL"}</Row>
              <Row label="Login configured">{lineConfig.loginConfigured ? "yes" : "no"}</Row>
              <Row label="Messaging configured">{lineConfig.messagingConfigured ? "yes" : "no"}</Row>
              <Row label="Channel secret">{lineConfig.channelSecretPresent ? "present" : "missing"}</Row>
              <Row label="Channel token">{lineConfig.channelAccessTokenPresent ? "present" : "missing"}</Row>
              <Row label="Reply telemetry">{countEvent(launchEvents, "line_entry_reply_sent") > 0 ? `REAL · ${countEvent(launchEvents, "line_entry_reply_sent")}` : "NOT TRACKED"}</Row>
            </dl>
          </Panel>

          <Panel title="Session funnel">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="session_started" value={String(sessionStartCount)} />
              <Stat label="q1_reached" value={String(q1ReachedCount)} />
              <Stat label="question_progress" value={String(questionProgressCount)} />
              <Stat label="question_answered" value={String(questionAnswerCount)} />
              <Stat label="question_completed" value={String(questionCompletedCount)} />
              <Stat label="test_completed" value={String(testCompletedCount)} />
              <Stat label="completion_success" value={String(completionSuccessCount)} />
              <Stat label="result_revealed" value={String(resultRevealCount)} />
              <Stat label="result_render_failed" value={String(resultRenderFailedCount)} />
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Result panel">
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="Latest completions" value={String(latestCompletions.length)} />
                <Stat label="Persona kinds" value={String(personaDistribution.length)} />
              </div>
              <div className="space-y-2">
                {personaDistribution.map(([personaId, count]) => (
                  <div key={personaId} className="flex items-center justify-between rounded-xl bg-[#FCFAF6] px-4 py-3 text-sm">
                    <span>{personaId}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {latestCompletions.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                    <div className="font-medium">{entry.personaId}</div>
                    <div className="text-[#6E5D4D]">{entry.currentModeLabelJa}</div>
                    <div className="text-xs text-[#8A7764]">
                      {entry.answeredQuestions}/{entry.totalQuestions} · {entry.completedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Share / growth">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="share_clicked" value={String(shareClickedCount)} />
              <Stat label="share_native_opened" value={String(shareNativeAttemptCount)} />
              <Stat label="share_native_completed" value={String(shareNativeCompletedCount)} />
              <Stat label="share_native_cancelled" value={String(shareNativeCancelledCount)} />
              <Stat label="share_native_failed" value={String(shareNativeFailedCount)} />
              <Stat label="share_copy_text" value={String(shareCopyTextCount)} />
              <Stat label="share_copy_link" value={String(shareCopyLinkCount)} />
              <Stat label="share_card_opened" value={String(shareCardOpenCount)} />
              <Stat label="fallback/error" value={String(fallbackErrorCount)} />
            </div>
            <div className="mt-4 space-y-2">
              {shareCounts.length ? (
                shareCounts.map(([label, count]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-[#FCFAF6] px-4 py-3 text-sm">
                    <span>{label}</span>
                    <span>{count}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-[#FCFAF6] px-4 py-3 text-sm text-[#6E5D4D]">Share telemetry is not yet populated.</div>
              )}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Latest launch events">
            <div className="space-y-2">
              {latestEvents.length ? (
                latestEvents.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                    <div className="font-medium">{entry.payload.event}</div>
                    <div className="text-[#6E5D4D]">
                      {entry.payload.personaId || "no persona"} · {entry.payload.action || "no action"} · {entry.payload.surface || "no surface"}
                    </div>
                    <div className="text-xs text-[#8A7764]">{entry.recordedAt}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-[#FCFAF6] px-4 py-3 text-sm text-[#6E5D4D]">No launch events stored yet.</div>
              )}
            </div>
          </Panel>

          <Panel title="Launch checklist">
            <div className="space-y-3">
              {launchChecks.map((check) => (
                <div key={check.label} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{check.label}</span>
                    <span className="rounded-full bg-[#F4E7CE] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#6E5D4D]">{check.status}</span>
                  </div>
                  <div className="mt-2 text-[#6E5D4D]">{check.note}</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-5 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
      <div className="text-sm text-[#8A7764]">{title}</div>
      <div className="mt-2 break-all text-2xl font-light">{value}</div>
      <div className="mt-3 text-xs text-[#6E5D4D]">{note}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-6 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
      <h2 className="text-xl font-light">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#FCFAF6] px-4 py-3">
      <div className="text-xs tracking-[0.18em] text-[#8A7764]">{label}</div>
      <div className="mt-2 text-2xl font-light">{value}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#FCFAF6] px-4 py-3">
      <dt className="text-[#8A7764]">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
