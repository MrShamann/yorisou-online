import type { ReactNode } from "react";

import { requireAdminViewer } from "@/lib/server/foundation/access";
import { evaluateOpenTestingFollowUps, getOpenTestingDashboardSnapshot } from "@/lib/server/relationship-intelligence/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Open Testing Dashboard | Yorisou",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OpenTestingDashboardPage() {
  await requireAdminViewer();
  const [dashboard, followUps] = await Promise.all([
    getOpenTestingDashboardSnapshot(),
    evaluateOpenTestingFollowUps(),
  ]);

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold tracking-[0.14em] text-[#6E5D4D]">INTERNAL DASHBOARD</p>
          <h1 className="text-3xl font-light">Open Testing Relationship Intelligence</h1>
          <p className="max-w-3xl text-sm text-[#6E5D4D]">
            Public funnel, report interest, feedback, LINE relationship activation, and rule-based follow-up visibility for controlled open testing.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Open-testing views" value={String(dashboard.funnelSummary.open_testing_viewed || 0)} note="From /open-testing and linked public entry flows." />
          <MetricCard title="Test completed" value={String(dashboard.funnelSummary.test_completed || 0)} note="Anonymous session-linked completion events." />
          <MetricCard title="LINE activated" value={String(dashboard.funnelSummary.line_relationship_activated || 0)} note={`Provider mode: ${followUps.providerMode}`} />
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Funnel Summary">
            <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs text-[#5A4B3E]">{JSON.stringify(dashboard.funnelSummary, null, 2)}</pre>
          </Panel>
          <Panel title="Result Distribution">
            <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs text-[#5A4B3E]">{JSON.stringify(dashboard.resultDistribution, null, 2)}</pre>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Report Interest">
            <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs text-[#5A4B3E]">{JSON.stringify(dashboard.reportInterest, null, 2)}</pre>
          </Panel>
          <Panel title="Relationship Panel">
            <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs text-[#5A4B3E]">{JSON.stringify(dashboard.relationshipSummary, null, 2)}</pre>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Feedback Inbox">
            <RecordList>
              {dashboard.feedbackRecent.map((entry) => (
                <RecordItem
                  key={entry.id}
                  title={`${entry.topic} · ${entry.status}`}
                  body={entry.message}
                  meta={`${entry.createdAt}${entry.routeContext ? ` · ${entry.routeContext}` : ""}${entry.resultId ? ` · ${entry.resultId}` : ""}`}
                />
              ))}
            </RecordList>
          </Panel>
          <Panel title="Follow-up Preview">
            <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs text-[#5A4B3E]">{JSON.stringify(followUps, null, 2)}</pre>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Recent Funnel Activity">
            <RecordList>
              {dashboard.recentActivity.funnel.map((entry) => (
                <RecordItem
                  key={entry.id}
                  title={entry.eventName}
                  body={entry.resultId || entry.reportType || entry.source || "—"}
                  meta={`${entry.createdAt}${entry.route ? ` · ${entry.route}` : ""}`}
                />
              ))}
            </RecordList>
          </Panel>
          <Panel title="Recent Message Logs">
            <RecordList>
              {dashboard.recentActivity.messages.map((entry) => (
                <RecordItem
                  key={entry.id}
                  title={`${entry.ruleId} · ${entry.status}`}
                  body={entry.skipReason || entry.templateId}
                  meta={entry.createdAt}
                />
              ))}
            </RecordList>
          </Panel>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-5 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
      <div className="text-sm text-[#8A7764]">{title}</div>
      <div className="mt-2 text-2xl font-light">{value}</div>
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

function RecordList({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function RecordItem({ title, body, meta }: { title: string; body: string; meta: string }) {
  return (
    <div className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
      <div className="font-medium">{title}</div>
      <div className="text-[#6E5D4D]">{body}</div>
      <div className="text-xs text-[#8A7764]">{meta}</div>
    </div>
  );
}
