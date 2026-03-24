import Link from "next/link";
import type { ReactNode } from "react";

import { getAdminAccessStatus, getViewerAdminEmailCandidates, requireAdminViewer } from "@/lib/server/foundation/access";
import { adminFoundationService } from "@/lib/server/foundation/adminService";
import { getLineMessagingConfigStatus } from "@/lib/server/yorisouLine";
import type { AuditLog, AuthIdentity, SupportCase, UserProfile } from "@/lib/server/foundation/schema";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const viewer = await requireAdminViewer();
  const summary = await adminFoundationService.getDashboardSummary();
  const latestUsers = summary.latestUsers.filter((entry): entry is UserProfile => Boolean(entry));
  const recentAudit = summary.recentAudit.filter((entry): entry is AuditLog => Boolean(entry));
  const recentCases = summary.recentCases.filter((entry): entry is SupportCase => Boolean(entry));
  const unboundIdentities = summary.unboundIdentities.filter((entry): entry is AuthIdentity => Boolean(entry));
  const lineConfig = getLineMessagingConfigStatus();
  const adminAccess = getAdminAccessStatus();
  const readiness = composeOperationsReadiness({
    configuredAdminEmails: adminAccess.configuredAdminEmails,
    productionRequiresExplicitList: adminAccess.productionRequiresExplicitList,
    adminEmailCandidates: getViewerAdminEmailCandidates(viewer),
    authCookieSecretConfigured: Boolean(process.env.YORISOU_AUTH_COOKIE_SECRET?.trim()),
    lineConfig,
    latestAuditAt: summary.latestSyncStatus.latestAuditAt,
    recentAuditActions: recentAudit.map((entry) => entry.action),
    storeMode: summary.latestSyncStatus.store.mode,
    sharedStoreBucketConfigured: summary.latestSyncStatus.store.sharedStoreBucketConfigured,
    activeUserCount: summary.latestSyncStatus.activeUserCount,
  });

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-light">Admin Console</h1>
          <p className="text-sm text-[#6E5D4D]">Minimal backend/admin foundation view for users, identities, timeline, cases, and audit.</p>
          <div className="flex gap-3">
            <Link href="/admin/users" className="rounded-full bg-[#3B2F2F] px-5 py-2 text-sm text-white">Users</Link>
            <Link href="/admin/audit" className="rounded-full border border-[#D6C3A3]/50 px-5 py-2 text-sm text-[#5A4B3E]">Audit</Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card title="Active users" value={String(summary.latestSyncStatus.activeUserCount)} note={`Store mode: ${summary.latestSyncStatus.store.mode}`} />
          <Card title="Unbound identities" value={String(summary.latestSyncStatus.unboundIdentityCount)} note={summary.latestSyncStatus.latestProfileSyncAt || "No sync yet"} />
          <Card title="Latest audit" value={summary.latestSyncStatus.latestAuditAt || "None"} note={summary.latestSyncStatus.store.foundationPrefix} />
        </section>

        <Panel title="PRODUCTION READINESS">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${readinessTone(readiness.overall.status)}`}>
                {readiness.overall.status}
              </span>
              <span className="text-sm text-[#6E5D4D]">{readiness.overall.note}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {readiness.categories.map((category) => (
                <ReadinessTile
                  key={category.label}
                  label={category.label}
                  status={category.status}
                  note={category.note}
                />
              ))}
            </div>
          </div>
        </Panel>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Recent users">
            <div className="space-y-3">
              {latestUsers.map((user) => (
                <Link key={user.userProfileId} href={`/admin/users/${user.userProfileId}`} className="block rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3">
                  <div className="font-medium">{user.profile.displayName}</div>
                  <div className="text-sm text-[#6E5D4D]">{user.userProfileId}</div>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Recent audit">
            <div className="space-y-3">
              {recentAudit.map((entry) => (
                <div key={entry.auditLogId} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                  <div className="font-medium">{entry.action}</div>
                  <div className="text-[#6E5D4D]">{entry.summary}</div>
                  <div className="text-xs text-[#8A7764]">{entry.createdAt}</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <Panel title="Latest sync status">
          <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs text-[#5A4B3E]">
            {JSON.stringify(
              {
                ...summary.latestSyncStatus,
                recentCaseIds: recentCases.map((entry) => entry.supportCaseId),
                unboundIdentityIds: unboundIdentities.map((entry) => entry.authIdentityId),
              },
              null,
              2,
            )}
          </pre>
        </Panel>
      </div>
    </main>
  );
}

function Card({ title, value, note }: { title: string; value: string; note: string }) {
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

type ReadinessStatus = "Ready" | "Partial" | "Needs attention" | "Unresolved";

function composeOperationsReadiness(input: {
  configuredAdminEmails: number;
  productionRequiresExplicitList: boolean;
  adminEmailCandidates: string[];
  authCookieSecretConfigured: boolean;
  lineConfig: {
    loginConfigured: boolean;
    messagingConfigured: boolean;
    channelSecretPresent: boolean;
    channelAccessTokenPresent: boolean;
  };
  latestAuditAt: string | null;
  recentAuditActions: string[];
  storeMode: "shared_s3" | "local_file";
  sharedStoreBucketConfigured: boolean;
  activeUserCount: number;
}) {
  const authBaseline: { label: string; status: ReadinessStatus; note: string } =
    input.authCookieSecretConfigured && (input.configuredAdminEmails > 0 || !input.productionRequiresExplicitList)
      ? {
          label: "Auth baseline",
          status: "Ready",
          note: `Admin access is configured and auth cookie secret is explicit for ${input.adminEmailCandidates.length || 1} active admin identity candidate(s).`,
        }
      : input.configuredAdminEmails > 0 || input.authCookieSecretConfigured
        ? {
            label: "Auth baseline",
            status: "Partial",
            note: "Some auth/admin config is present, but explicit auth cookie or admin access config still needs attention.",
          }
        : {
            label: "Auth baseline",
            status: "Needs attention",
            note: "Explicit auth cookie secret and admin access configuration are not both confirmed.",
          };

  const auditBaseline: { label: string; status: ReadinessStatus; note: string } =
    input.latestAuditAt && input.recentAuditActions.some((entry) => entry === "support.view_sensitive" || entry === "admin.view_sensitive")
      ? {
          label: "Support/admin audit baseline",
          status: "Ready",
          note: "Sensitive support/admin views are producing audit entries in the current audit stream.",
        }
      : input.latestAuditAt
        ? {
            label: "Support/admin audit baseline",
            status: "Partial",
            note: "Audit logging is active, but recent support/admin view coverage is not clearly visible in the latest sample.",
          }
        : {
            label: "Support/admin audit baseline",
            status: "Needs attention",
            note: "No recent audit activity was found for the current readiness snapshot.",
          };

  const lineBaseline: { label: string; status: ReadinessStatus; note: string } =
    input.lineConfig.loginConfigured && input.lineConfig.messagingConfigured
      ? {
          label: "LINE baseline",
          status: "Ready",
          note: "LINE login and messaging configuration are both present.",
        }
      : input.lineConfig.loginConfigured || input.lineConfig.channelSecretPresent || input.lineConfig.channelAccessTokenPresent
        ? {
            label: "LINE baseline",
            status: "Partial",
            note: "Some LINE configuration is present, but login or messaging readiness is still incomplete.",
          }
        : {
            label: "LINE baseline",
            status: "Needs attention",
            note: "LINE login and messaging configuration are not currently confirmed.",
          };

  const deploymentBaseline: { label: string; status: ReadinessStatus; note: string } =
    input.authCookieSecretConfigured && (input.lineConfig.channelSecretPresent || input.configuredAdminEmails > 0)
      ? {
          label: "Deployment/config baseline",
          status: "Ready",
          note: "Core runtime config is present for auth and internal operations.",
        }
      : {
          label: "Deployment/config baseline",
          status: "Partial",
          note: "Some deployment config is present, but explicit production-safe config is not fully confirmed.",
        };

  const dataStoreBaseline: { label: string; status: ReadinessStatus; note: string } =
    input.storeMode === "shared_s3" && input.sharedStoreBucketConfigured
      ? {
          label: "Data/store baseline",
          status: "Ready",
          note: `Foundation data is running on shared store with ${input.activeUserCount} active user record(s).`,
        }
      : input.storeMode === "local_file"
        ? {
            label: "Data/store baseline",
            status: "Partial",
            note: "Foundation data is available, but still running on local-file mode rather than shared store.",
          }
        : {
            label: "Data/store baseline",
            status: "Unresolved",
            note: "Data/store readiness could not be confirmed from current runtime state.",
          };

  const categories = [authBaseline, auditBaseline, lineBaseline, deploymentBaseline, dataStoreBaseline];
  const overallStatus: ReadinessStatus = categories.some((entry) => entry.status === "Needs attention")
    ? "Needs attention"
    : categories.some((entry) => entry.status === "Unresolved")
      ? "Unresolved"
      : categories.some((entry) => entry.status === "Partial")
        ? "Partial"
        : "Ready";

  const overallNote =
    overallStatus === "Ready"
      ? "Core first-phase operational baselines are present in the current runtime."
      : overallStatus === "Partial"
        ? "Core operational baselines are mostly present, but some categories still rely on partial readiness."
        : overallStatus === "Needs attention"
          ? "At least one critical readiness category still needs attention before treating this deployment as comfortably launch-ready."
          : "Some readiness categories cannot be confirmed from current live signals.";

  return {
    overall: {
      status: overallStatus,
      note: overallNote,
    },
    categories,
  };
}

function readinessTone(status: ReadinessStatus) {
  if (status === "Ready") {
    return "bg-[#E6F4EA] text-[#2E5B3C]";
  }
  if (status === "Partial") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  if (status === "Needs attention") {
    return "bg-[#FCE7E3] text-[#9A3B2F]";
  }
  return "bg-[#F3ECE2] text-[#6E5D4D]";
}

function ReadinessTile({ label, status, note }: { label: string; status: ReadinessStatus; note: string }) {
  return (
    <div className="rounded-2xl border border-[#D6C3A3]/35 bg-[#FCFAF6] p-5">
      <div className="text-sm text-[#8A7764]">{label}</div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${readinessTone(status)}`}>{status}</span>
      </div>
      <div className="mt-3 text-sm leading-7 text-[#6E5D4D]">{note}</div>
    </div>
  );
}
