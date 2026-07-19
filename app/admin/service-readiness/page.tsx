import type { Metadata } from "next";

import { APP2_FAMILY_REPORTS } from "@/app/data/app2/familyReports";
import {
  getMigrationFunnel,
  getReadinessOverview,
  getReviewQueueSummary,
  isApp2BackendConfigured,
  listOpenIncidents,
  logAdminAccess,
  type MigrationFunnel,
  type ReadinessOverview,
  type ReviewQueueSummaryRow,
  type ServiceIncident,
} from "@/lib/server/app2ServiceBackend";
import { requireAdminViewer } from "@/lib/server/foundation/access";

export const metadata: Metadata = {
  title: "サービス稼働ダッシュボード | YORISOU Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// WS-F — Founder Service Readiness Dashboard. Four sections: Overview, migration
// Funnel, Family-report coverage, Failure monitoring. It renders AGGREGATES ONLY
// (no raw answers, no PII). Every panel has a truthful empty/unconfigured state
// and never fabricates a number. Access is admin-gated and logged (WS-H).

type DashboardData = {
  configured: boolean;
  reachable: boolean;
  overview: ReadinessOverview | null;
  funnel: MigrationFunnel | null;
  queueSummary: ReviewQueueSummaryRow[];
  incidents: ServiceIncident[];
};

async function loadDashboard(): Promise<DashboardData> {
  if (!isApp2BackendConfigured()) {
    return { configured: false, reachable: false, overview: null, funnel: null, queueSummary: [], incidents: [] };
  }
  try {
    const [overview, funnel, queueSummary, incidents] = await Promise.all([
      getReadinessOverview(),
      getMigrationFunnel(),
      getReviewQueueSummary(),
      listOpenIncidents(),
    ]);
    return { configured: true, reachable: true, overview, funnel, queueSummary, incidents };
  } catch {
    // Backend configured but unreachable — say so honestly, invent nothing.
    return { configured: true, reachable: false, overview: null, funnel: null, queueSummary: [], incidents: [] };
  }
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone?: "warn" | "bad" }) {
  const valueColor =
    tone === "bad" ? "text-[#f2896c]" : tone === "warn" ? "text-[color:var(--jade-bright)]" : "text-[color:var(--tx)]";
  return (
    <div className="aix2-panel p-5">
      <p className="text-[12px] leading-6 aix2-faint">{label}</p>
      <p className={`mt-1.5 text-[1.7rem] font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

export default async function ServiceReadinessDashboardPage() {
  const viewer = await requireAdminViewer();
  const actor = viewer.account?.id ?? "unknown";

  const data = await loadDashboard();

  // WS-H: log this sensitive-admin read (best-effort; never blocks the page).
  if (data.configured && data.reachable) {
    try {
      await logAdminAccess({
        actor,
        actorType: "admin",
        scope: "service_readiness",
        action: "read_dashboard",
        route: "/admin/service-readiness",
        allowed: true,
        outcome: "allowed",
      });
    } catch {
      /* logging is best-effort; the dashboard still renders */
    }
  }

  const coverage = APP2_FAMILY_REPORTS.length;

  return (
    <main className="aix2">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[62rem]">
          <p className="aix2-eyebrow">YORISOU Admin · Founder</p>
          <h1 className="aix2-serif mt-3 text-[1.9rem] leading-[1.25] text-[color:var(--tx)]">サービス稼働ダッシュボード</h1>
          <p className="mt-3 text-[13.5px] leading-7 aix2-mut">
            集計値のみを表示します（個人情報・回答内容は含みません）。数値が取得できないときは、その旨を正直に表示します。
          </p>

          {!data.configured ? (
            <div className="aix2-panel mt-8 p-6">
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">バックエンドは未接続です。</p>
              <p className="mt-2 text-[13.5px] leading-7 aix2-mut">
                ローカル／専用Supabaseが設定されると、稼働状況の集計をここに表示します。現在は数値を作らず、未接続として表示しています。
              </p>
            </div>
          ) : !data.reachable ? (
            <div className="aix2-panel mt-8 p-6">
              <p className="text-[15px] leading-8 text-[color:var(--tx)]">バックエンドに接続できませんでした。</p>
              <p className="mt-2 text-[13.5px] leading-7 aix2-mut">
                取得できた数値がないため、推測値は表示していません。接続が回復すると自動的に表示されます。
              </p>
            </div>
          ) : (
            <>
              {/* Overview */}
              <section className="mt-8" aria-labelledby="ov">
                <p id="ov" className="aix2-eyebrow">
                  概況
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="未対応インシデント" value={data.overview?.open_incidents ?? 0} tone={data.overview?.open_incidents ? "warn" : undefined} />
                  <Metric label="高深刻度（未対応）" value={data.overview?.high_severity_open ?? 0} tone={data.overview?.high_severity_open ? "bad" : undefined} />
                  <Metric label="レビュー待ち" value={data.overview?.open_review_items ?? 0} tone={data.overview?.open_review_items ? "warn" : undefined} />
                  <Metric label="失敗した引き継ぎ" value={data.overview?.failed_migrations ?? 0} tone={data.overview?.failed_migrations ? "bad" : undefined} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="拒否されたアクセス記録" value={data.overview?.denied_admin_access_events ?? 0} />
                </div>
              </section>

              {/* Funnel */}
              <section className="mt-9" aria-labelledby="fn">
                <p id="fn" className="aix2-eyebrow">
                  引き継ぎファネル
                </p>
                {data.funnel && data.funnel.total_jobs > 0 ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <Metric label="総ジョブ" value={data.funnel.total_jobs} />
                    <Metric label="成功" value={data.funnel.succeeded} />
                    <Metric label="失敗" value={data.funnel.failed} tone={data.funnel.failed ? "bad" : undefined} />
                    <Metric label="進行中" value={data.funnel.in_progress} />
                    <Metric label="取消/補償" value={data.funnel.cancelled + data.funnel.compensated} />
                    <Metric label="再試行合計" value={data.funnel.total_retries} />
                  </div>
                ) : (
                  <div className="aix2-panel mt-3 p-6">
                    <p className="text-[14px] leading-8 aix2-mut">まだ引き継ぎジョブはありません。</p>
                  </div>
                )}
              </section>

              {/* Family coverage */}
              <section className="mt-9" aria-labelledby="fc">
                <p id="fc" className="aix2-eyebrow">
                  レポート網羅
                </p>
                <div className="aix2-panel mt-3 p-6">
                  <p className="text-[15px] leading-8 text-[color:var(--tx)]">
                    深めるレポート: <span className="font-bold text-[color:var(--jade-bright)]">{coverage} / 9</span> ファミリー
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {APP2_FAMILY_REPORTS.map((r) => (
                      <span
                        key={r.family}
                        className="inline-flex items-center rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] text-[color:var(--jade-bright)]"
                      >
                        {r.testLabel}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Failure monitoring */}
              <section className="mt-9" aria-labelledby="fm">
                <p id="fm" className="aix2-eyebrow">
                  障害モニタリング
                </p>
                {data.incidents.length ? (
                  <ul className="mt-3 space-y-3">
                    {data.incidents.map((i) => (
                      <li key={i.id} className="aix2-panel p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-bold text-[color:var(--tx)]">{i.incident_type}</span>
                          <span className="inline-flex items-center rounded-full border border-[var(--hair-2)] px-2.5 py-1 text-[10.5px] aix2-mut">
                            {i.severity}
                          </span>
                          <span className="text-[11px] aix2-faint">×{i.occurrence_count}</span>
                        </div>
                        <p className="mt-2 text-[13px] leading-7 aix2-mut">{i.safe_summary}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="aix2-panel mt-3 p-6">
                    <p className="text-[14px] leading-8 aix2-mut">未対応のインシデントはありません。</p>
                  </div>
                )}
              </section>

              <p className="mt-8 text-[12px] leading-7 aix2-faint">
                このアクセスは監査ログに記録されています（操作者・範囲・時刻）。
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
