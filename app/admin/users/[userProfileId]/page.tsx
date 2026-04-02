import Link from "next/link";
import type { ReactNode } from "react";

import { isPlaceholderEmail } from "@/lib/server/foundation/ids";
import { requireAdminViewer } from "@/lib/server/foundation/access";
import { adminFoundationService } from "@/lib/server/foundation/adminService";
import { getSupportDisplaySnapshot } from "@/lib/server/midBackend/support/supportDisplaySnapshot";
import {
  composeAccessAccountabilityViewModel,
  composeLineReadinessViewModel,
  composeSupportDiagnosticsViewModel,
  type SupportDiagnosticsSource,
  type AccessAccountabilityViewModel,
  type LineReadinessViewModel,
  type SupportDiagnosticsViewModel,
} from "@/lib/server/yorisouAuth";
import { getLineMessagingConfigStatus, isLineLoginConfigured } from "@/lib/server/yorisouLine";
import type { AuthIdentity, ConsentLog, MessageEvent, SupportCase, SupportCaseStatus } from "@/lib/server/foundation/schema";
import type { LineBindingStatus } from "@/lib/server/yorisouData";

export const dynamic = "force-dynamic";

const CASE_STATUSES: SupportCaseStatus[] = ["new", "open", "pending", "resolved"];

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userProfileId: string }>;
}) {
  const viewer = await requireAdminViewer();
  const { userProfileId } = await params;
  const detail = await adminFoundationService.getUserDetail(userProfileId, {
    actorUserProfileId: viewer.account?.id || null,
    actorAuthIdentityId: null,
  });
  const identities = detail.identities.filter((entry): entry is AuthIdentity => Boolean(entry));
  const timeline = detail.timeline.filter((entry): entry is MessageEvent => Boolean(entry));
  const supportCases = detail.supportCases.filter((entry): entry is SupportCase => Boolean(entry));
  const recentConsent = detail.recentConsent.filter((entry): entry is ConsentLog => Boolean(entry));
  const boundLineIdentity = identities.find((entry) => entry.identityType === "line" && entry.bindingState === "bound") || null;
  const canonicalPrimary = detail.timelineBundle.source === "canonical";
  const latestTimelineEntry = timeline[timeline.length - 1] || null;
  const latestSupportCase = supportCases[0] || null;

  if (!detail.profile) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-6">User not found.</div>
      </main>
    );
  }

  const supportDisplaySnapshot = await getSupportDisplaySnapshot({
    userProfileId: detail.profile.userProfileId,
    fallbackAccount: detail.legacyAccount || null,
  }).catch(() => ({
    userIdentitySnapshot: null,
    latestLineMessageEventSnapshot: null,
    supportProfile: detail.legacyAccount?.supportProfile || null,
    readModelSource: "fallback_account" as const,
    supportProfileSource: detail.legacyAccount ? ("legacy_fallback" as const) : ("unresolved" as const),
    lineBindingStatusSource: detail.legacyAccount ? ("legacy_fallback" as const) : ("unresolved" as const),
    preferencesStorageSource: detail.legacyAccount ? ("legacy_fallback" as const) : ("unresolved" as const),
    readFallbackActive: true,
    account: detail.legacyAccount || null,
    latestLineEvent: null,
  }));
  const supportDiagnostics = composeSupportDiagnosticsViewModel({
    hasPrincipal: true,
    principalMatched: true,
    principalId: detail.profile.userProfileId,
    legacyAccountId: detail.profile.legacyAccountId || detail.legacyAccount?.id || null,
    activeWriteTargetId: detail.profile.userProfileId,
    lineBindingStatus: supportDisplaySnapshot.supportProfile?.lineBindingStatus || "not_connected",
    lineBindingStatusSource: supportDisplaySnapshot.lineBindingStatusSource,
    supportProfileSource: supportDisplaySnapshot.supportProfileSource,
    preferencesStorageSource: supportDisplaySnapshot.preferencesStorageSource,
    readFallbackActive: supportDisplaySnapshot.readFallbackActive,
  });
  const accessAccountability = composeAccessAccountabilityViewModel({
    accessType: "admin_target_view",
    latestConsent: recentConsent[0] || null,
  });
  const lineReadiness = composeLineReadinessViewModel({
    diagnostics: supportDiagnostics,
    lineIdentityPresent: Boolean(detail.legacyAccount?.lineUserId || identities.some((entry) => Boolean(entry.lineUserId))),
    loginConfigured: isLineLoginConfigured(),
    messagingConfigured: getLineMessagingConfigStatus().messagingConfigured,
  });
  const compatibilityActive = supportDiagnostics.summaryState !== "canonical_healthy";
  const showCompatibilityDiagnostics = compatibilityActive || !canonicalPrimary;
  const showLegacyCompatibility =
    detail.recentLegacyConsultations.length > 0 || detail.recentLegacyLineEvents.length > 0 || (!canonicalPrimary && !timeline.length);
  const operatorSourceValue = canonicalPrimary ? "canonical" : sourceLabel(lineReadiness.source);
  const operatorSourceTone = canonicalPrimary ? "ok" : lineReadiness.source === "canonical" ? "ok" : "warn";
  const operatorContinuityValue =
    canonicalPrimary && boundLineIdentity ? "Ready" : lineContinuityLabel(lineReadiness.continuityStatus);
  const operatorContinuityTone =
    canonicalPrimary && boundLineIdentity ? "ok" : lineReadiness.continuityStatus === "ready" ? "ok" : "warn";

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <Link href="/admin/users" className="text-sm text-[#6E5D4D] underline underline-offset-4">Back to users</Link>
          <h1 className="text-3xl font-light">{detail.profile.profile.displayName}</h1>
          <div className="text-sm text-[#6E5D4D]">{detail.profile.userProfileId}</div>
        </header>

        <section className={`rounded-2xl border px-5 py-4 ${guardrailTone(supportDiagnostics.summaryState)}`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs tracking-[0.14em] opacity-75">TARGET INTEGRITY</div>
              <div className="mt-1 text-lg font-medium">{summaryLabel(supportDiagnostics.summaryState)}</div>
              <p className="mt-2 text-sm">{guardrailMessage(supportDiagnostics.summaryState)}</p>
            </div>
            <a href="#support-canonical-diagnostics" className="text-sm underline underline-offset-4">
              Review target diagnostics
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 px-5 py-4 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs tracking-[0.14em] text-[#8A7764]">ACCOUNTABILITY / PRIVACY</div>
              <div className="mt-1 text-lg font-medium text-[#3B2F2F]">Access to this record is audit logged</div>
              <p className="mt-2 text-sm text-[#6E5D4D]">
                {accessAccountability.latestConsent.available
                  ? `Latest consent signal: ${consentLabel(accessAccountability.latestConsent.consentType)} / ${formatDateTime(accessAccountability.latestConsent.timestamp)}`
                  : "No stable consent status is modeled for display here yet, so this page currently shows accountability logging only."}
              </p>
            </div>
            <a href="#support-canonical-diagnostics" className="text-sm underline underline-offset-4 text-[#6E5D4D]">
              Review target diagnostics
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 px-5 py-4 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs tracking-[0.14em] text-[#8A7764]">LINE READINESS</div>
                <div className="mt-1 text-lg font-medium text-[#3B2F2F]">{lineContinuityLabel(lineReadiness.continuityStatus)}</div>
                <p className="mt-2 text-sm text-[#6E5D4D]">{lineReadinessMessage(lineReadiness)}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${lineReadinessTone(lineReadiness.continuityStatus)}`}>
                {sourceLabel(lineReadiness.source)}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <AdminStatusTile
                label="LINE identity"
                value={lineIdentityLabel(lineReadiness.identityState)}
                source={lineReadiness.lineIdentityPresent ? "bound LINE identity present" : "bound LINE identity not present"}
                tone={lineReadiness.identityState === "bound" ? "ok" : "warn"}
              />
              <AdminStatusTile
                label="LINE login readiness"
                value={lineLoginReadinessLabel(lineReadiness.loginReadiness)}
                source={lineReadiness.loginConfigured ? "LINE login config available" : "LINE login config unresolved"}
                tone={lineReadiness.loginReadiness === "available" ? "ok" : "warn"}
              />
              <AdminStatusTile
                label="Support continuity"
                value={operatorContinuityValue}
                source={canonicalPrimary ? "canonical timeline and support cases available" : lineReadiness.principalResolved ? "principal-resolved LINE linkage" : "principal linkage not fully resolved"}
                tone={operatorContinuityTone}
              />
              <AdminStatusTile
                label="Source truth"
                value={operatorSourceValue}
                source={canonicalPrimary ? "canonical timeline is the operator-facing source of truth" : lineReadiness.compatibilityOrFallbackActive ? "compatibility or fallback still in use" : "canonical source confirmed"}
                tone={operatorSourceTone}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Canonical operator view" id="support-canonical-diagnostics">
            <div className="grid gap-3 md:grid-cols-2">
              <AdminStatusTile
                label="Canonical source"
                value={detail.timelineBundle.source}
                source={canonicalPrimary ? "canonical identities, timeline, and case state are loaded" : "canonical bundle not yet available for this record"}
                tone={canonicalPrimary ? "ok" : "warn"}
              />
              <AdminStatusTile
                label="Bound channels"
                value={boundLineIdentity ? "email + LINE" : identities.some((entry) => entry.identityType === "email_password") ? "email only" : "limited"}
                source={boundLineIdentity ? "bound LINE identity visible in canonical auth-identities" : "LINE identity not yet modeled as bound"}
                tone={boundLineIdentity ? "ok" : "warn"}
              />
              <AdminStatusTile
                label="Timeline coverage"
                value={`${timeline.length} events / ${detail.timelineBundle.conversations.length} conversations`}
                source={latestTimelineEntry ? `${latestTimelineEntry.channel} ${latestTimelineEntry.eventType} at ${formatDateTime(latestTimelineEntry.recordedAt)}` : "no canonical timeline entries yet"}
                tone={timeline.length ? "ok" : "warn"}
              />
              <AdminStatusTile
                label="Support case state"
                value={latestSupportCase ? latestSupportCase.status : "none"}
                source={latestSupportCase ? `${latestSupportCase.title} via ${latestSupportCase.channel}` : "no canonical support case linked yet"}
                tone={latestSupportCase ? "ok" : "warn"}
              />
            </div>
          </Panel>

          {showCompatibilityDiagnostics ? (
            <Panel title="Compatibility diagnostics">
              <AdminDiagnosticsCard diagnostics={supportDiagnostics} />
            </Panel>
          ) : (
            <Panel title="Compatibility diagnostics">
              <div className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-4 text-sm text-[#6E5D4D]">
                Canonical-first read path is healthy for this record. Compatibility diagnostics are currently secondary only.
              </div>
            </Panel>
          )}

          <Panel title="Profile">
            <dl className="grid gap-2 text-sm">
              <Row label="Legacy account">{detail.profile.legacyAccountId || "None"}</Row>
              <Row label="Locale">{detail.profile.profile.primaryLocale || "None"}</Row>
              <Row label="City">{detail.profile.profile.city || "None"}</Row>
              <Row label="Role">{detail.profile.profile.role || "None"}</Row>
              <Row label="Family contact">{detail.profile.sensitiveProfile.familyContactName || "None"}</Row>
              <Row label="Family channel">{detail.profile.sensitiveProfile.familyContactMethod || "None"}</Row>
              <Row label="Family value">{detail.profile.sensitiveProfile.familyContactValue || "None"}</Row>
            </dl>
          </Panel>

          <Panel title="Identities">
            <div className="space-y-3">
              {identities.map((identity) => (
                <div key={identity.authIdentityId} className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-3 text-sm">
                  <div className="font-medium">{identity.identityType}</div>
                  <div>Status: {identity.identityStatus}</div>
                  <div>Binding: {identity.bindingState}</div>
                  <div>Hint: {identity.identityKeyHint || identity.externalIdentityKeyHint || "None"}</div>
                  <div>Email: {isPlaceholderEmail(identity.emailNormalized) ? "LINE primary placeholder (not resettable)" : identity.emailNormalized || "None"}</div>
                  <div>LINE: {identity.lineUserId || "None"}</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Unified interaction history">
            <div className="space-y-3">
              {timeline.map((entry) => (
                <div key={entry.messageEventId} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                  <div className="font-medium">{entry.channel} / {entry.eventType}</div>
                  <div>{entry.contentText || entry.contentPayloadRef || "No content"}</div>
                  <div className="text-xs text-[#8A7764]">
                    {entry.source} / {entry.bindingState} / {entry.recordedAt}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Support cases">
            <div className="space-y-3">
              {supportCases.map((supportCase) => (
                <form
                  key={supportCase.supportCaseId}
                  action={`/api/admin/support-cases/${supportCase.supportCaseId}`}
                  method="post"
                  className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm"
                >
                  <input type="hidden" name="_method" value="PATCH" />
                  <div className="font-medium">{supportCase.title}</div>
                  <div>{supportCase.summary || "No summary"}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      defaultValue={supportCase.status}
                      name="status"
                      className="rounded-lg border border-[#D6C3A3]/35 bg-[#FFFCF6] px-3 py-2"
                    >
                      {CASE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="rounded-full border border-[#D6C3A3]/50 px-3 py-2 text-xs text-[#5A4B3E]">
                      Update
                    </button>
                    <span className="text-xs text-[#8A7764]">{supportCase.latestActivityAt}</span>
                  </div>
                </form>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Recent consent">
            <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs">{JSON.stringify(recentConsent, null, 2)}</pre>
          </Panel>
          <Panel title={showLegacyCompatibility ? "Legacy compatibility appendix" : "Latest canonical summary"}>
            <div className="space-y-4">
              <div className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-4 text-sm">
                <div className="font-medium">Latest canonical activity</div>
                {detail.latestSummary ? (
                  <div className="mt-3 space-y-1 text-[#6E5D4D]">
                    <div>channel: {detail.latestSummary.latestChannel}</div>
                    <div>event: {detail.latestSummary.latestEventType}</div>
                    <div>binding: {detail.latestSummary.latestBindingState}</div>
                    <div>at: {detail.latestSummary.latestActivityAt}</div>
                  </div>
                ) : (
                  <div className="mt-3 text-[#6E5D4D]">No canonical activity summary is available yet.</div>
                )}
              </div>
              {showLegacyCompatibility ? (
                <pre className="overflow-x-auto rounded-xl bg-[#FCFAF6] p-4 text-xs">
                  {JSON.stringify(
                    {
                      recentLegacyConsultations: detail.recentLegacyConsultations,
                      recentLegacyLineEvents: detail.recentLegacyLineEvents,
                    },
                    null,
                    2,
                  )}
                </pre>
              ) : (
                <div className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-4 text-sm text-[#6E5D4D]">
                  Legacy compatibility sections are currently hidden because canonical timeline and case data are already available for this record.
                </div>
              )}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function AdminDiagnosticsCard({ diagnostics }: { diagnostics: SupportDiagnosticsViewModel }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm ${summaryTone(diagnostics.summaryState)}`}>
          {summaryLabel(diagnostics.summaryState)}
        </span>
        <span className="text-sm text-[#6E5D4D]">{summaryNote(diagnostics.summaryState)}</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <AdminStatusTile
          label="LINE binding"
          value={lineStatusLabel(diagnostics.lineBinding.status)}
          source={sourceLabel(diagnostics.lineBinding.source)}
          tone={sourceTone(diagnostics.lineBinding.source)}
        />
        <AdminStatusTile
          label="Support profile"
          value={sourceLabel(diagnostics.supportProfile.source)}
          source={sourceLabel(diagnostics.supportProfile.source)}
          tone={sourceTone(diagnostics.supportProfile.source)}
        />
        <AdminStatusTile
          label="Preferences"
          value={sourceLabel(diagnostics.preferences.source)}
          source={
            diagnostics.preferences.activeWriteTarget === "principal_aware_target"
              ? "active write target: principal-aware"
              : "active write target: legacy fallback"
          }
          tone={sourceTone(diagnostics.preferences.source)}
        />
        <AdminStatusTile
          label="Read fallback"
          value={diagnostics.readFallback.active ? sourceLabel(diagnostics.readFallback.source) : "not active"}
          source={diagnostics.readFallback.active ? "fallback is active" : "primary read is canonical-first"}
          tone={diagnostics.readFallback.active ? "warn" : "ok"}
        />
      </div>

      <div className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-4 text-sm">
        <div className="font-medium">Owner resolution</div>
        <div className="mt-2 text-[#6E5D4D]">
          mode: {ownerModeLabel(diagnostics.ownerResolution.mode)}
        </div>
        <div className="mt-2 space-y-1 font-mono text-xs text-[#3B2F2F]">
          <div>principal id: {diagnostics.ownerResolution.principalId || "—"}</div>
          <div>legacy account id: {diagnostics.ownerResolution.legacyAccountId || "—"}</div>
          <div>active write target id: {diagnostics.ownerResolution.activeWriteTargetId || "—"}</div>
        </div>
      </div>
    </div>
  );
}

function AdminStatusTile({
  label,
  value,
  source,
  tone,
}: {
  label: string;
  value: string;
  source: string;
  tone: "ok" | "warn";
}) {
  return (
    <div className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-4 text-sm">
      <div className="text-[#8A7764]">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone === "ok" ? "bg-[#2E5B3C]" : "bg-[#A2682A]"}`} />
        <span className="font-medium">{value}</span>
      </div>
      <div className="mt-2 text-[#6E5D4D]">{source}</div>
    </div>
  );
}

function lineStatusLabel(value: LineBindingStatus) {
  if (value === "connected") {
    return "Connected";
  }
  if (value === "registered") {
    return "Registered";
  }
  return "Not connected";
}

function sourceTone(value: SupportDiagnosticsSource | "canonical") {
  return value === "canonical" ? "ok" : "warn";
}

function sourceLabel(value: SupportDiagnosticsSource | "canonical") {
  if (value === "canonical") {
    return "canonical";
  }
  if (value === "compatibility_mirror") {
    return "compatibility mirror";
  }
  if (value === "legacy_fallback") {
    return "legacy fallback";
  }
  return "unresolved";
}

function ownerModeLabel(value: SupportDiagnosticsViewModel["ownerResolution"]["mode"]) {
  if (value === "principal_aware") {
    return "principal-aware";
  }
  if (value === "legacy_fallback") {
    return "legacy fallback";
  }
  return "unresolved";
}

function summaryLabel(value: SupportDiagnosticsViewModel["summaryState"]) {
  if (value === "canonical_healthy") {
    return "Canonical healthy";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "Canonical with compatibility fallback";
  }
  if (value === "fallback_active") {
    return "Fallback active";
  }
  return "Owner unresolved";
}

function summaryNote(value: SupportDiagnosticsViewModel["summaryState"]) {
  if (value === "canonical_healthy") {
    return "This record is reading and targeting canonical-first paths cleanly.";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "The main path is canonical, but some support slices still rely on compatibility fallback.";
  }
  if (value === "fallback_active") {
    return "This record is still depending on fallback or legacy-compatible read state.";
  }
  return "Owner resolution is incomplete, so canonical support state is not fully available.";
}

function summaryTone(value: SupportDiagnosticsViewModel["summaryState"]) {
  if (value === "canonical_healthy") {
    return "bg-[#E6F4EA] text-[#2E5B3C]";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  if (value === "fallback_active") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  return "bg-[#FCE7E3] text-[#9A3B2F]";
}

function guardrailMessage(value: SupportDiagnosticsViewModel["summaryState"]) {
  if (value === "canonical_healthy") {
    return "Canonical target confirmed. This record resolves to a canonical principal and principal-aware target.";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "Compatibility fallback in use. Review diagnostics before treating this record as fully canonical-safe.";
  }
  if (value === "fallback_active") {
    return "Legacy fallback active. Operational review should assume compatibility or legacy dependency is still present.";
  }
  return "Owner unresolved. Inspect diagnostics before relying on this record for operational handling.";
}

function guardrailTone(value: SupportDiagnosticsViewModel["summaryState"]) {
  if (value === "canonical_healthy") {
    return "border-[#B8D9C0] bg-[#EAF6EE] text-[#2E5B3C]";
  }
  if (value === "canonical_with_compatibility_fallback") {
    return "border-[#E5C07B] bg-[#FFF5E4] text-[#8B5A1B]";
  }
  if (value === "fallback_active") {
    return "border-[#E5C07B] bg-[#FFF5E4] text-[#8B5A1B]";
  }
  return "border-[#E5B7B0] bg-[#FCECE8] text-[#9A3B2F]";
}

function consentLabel(value: AccessAccountabilityViewModel["latestConsent"]["consentType"]) {
  if (value === "account_registration") {
    return "account registration";
  }
  if (value === "line_identity_binding") {
    return "LINE identity binding";
  }
  if (value === "line_primary_login") {
    return "LINE primary login";
  }
  if (value === "email_identity_attachment") {
    return "email identity attachment";
  }
  return "not available";
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function lineIdentityLabel(value: LineReadinessViewModel["identityState"]) {
  if (value === "bound") {
    return "bound";
  }
  if (value === "not_bound") {
    return "not bound";
  }
  return "unresolved";
}

function lineLoginReadinessLabel(value: LineReadinessViewModel["loginReadiness"]) {
  if (value === "available") {
    return "available";
  }
  if (value === "limited") {
    return "limited";
  }
  return "unresolved";
}

function lineContinuityLabel(value: LineReadinessViewModel["continuityStatus"]) {
  if (value === "ready") {
    return "Ready";
  }
  if (value === "partial") {
    return "Partial";
  }
  if (value === "not_ready") {
    return "Not ready";
  }
  return "Unresolved";
}

function lineReadinessTone(value: LineReadinessViewModel["continuityStatus"]) {
  if (value === "ready") {
    return "bg-[#E6F4EA] text-[#2E5B3C]";
  }
  if (value === "partial") {
    return "bg-[#FFF1DA] text-[#8B5A1B]";
  }
  if (value === "not_ready") {
    return "bg-[#FCE7E3] text-[#9A3B2F]";
  }
  return "bg-[#F3ECE2] text-[#6E5D4D]";
}

function lineReadinessMessage(value: LineReadinessViewModel) {
  if (value.continuityStatus === "ready") {
    return "This record resolves to canonical LINE linkage and is ready for support continuity.";
  }
  if (value.continuityStatus === "partial") {
    return "LINE is partially usable for this record, but compatibility or fallback dependency remains.";
  }
  if (value.continuityStatus === "not_ready") {
    return "This record is not yet ready for LINE-based support continuity.";
  }
  return "Owner or source resolution is still incomplete for confirmed LINE readiness.";
}

function Panel({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-6 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
      <h2 className="text-xl font-light">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3">
      <dt className="text-[#8A7764]">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
