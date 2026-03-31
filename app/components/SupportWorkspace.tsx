"use client";

import Link from "next/link";

import ScenarioSupportAssistant from "@/app/components/ScenarioSupportAssistant";
import type {
  AccountRecord,
  ConsultationRecord,
  LineBindingStatus,
  LineWebhookEventRecord,
  SupportProfile,
} from "@/lib/server/yorisouData";

type Locale = "ja" | "en";
type SupportDiagnostics = {
  summaryState:
    | "canonical_healthy"
    | "canonical_with_compatibility_fallback"
    | "fallback_active"
    | "owner_unresolved";
  lineBinding: {
    status: LineBindingStatus;
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  };
  supportProfile: {
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  };
  preferences: {
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
    activeWriteTarget: "principal_aware_target" | "legacy_account_target";
  };
  ownerResolution: {
    mode: "principal_aware" | "legacy_fallback" | "unresolved";
    principalId: string | null;
    legacyAccountId: string | null;
    activeWriteTargetId: string | null;
  };
  readFallback: {
    active: boolean;
    source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  };
};
type AccessAccountability = {
  auditLogged: boolean;
  accessType: "support_self_view" | "admin_target_view";
  latestConsent: {
    available: boolean;
    consentType: "account_registration" | "line_identity_binding" | "line_primary_login" | "email_identity_attachment" | null;
    timestamp: string | null;
  };
};
type LineReadiness = {
  identityState: "bound" | "not_bound" | "unresolved";
  loginReadiness: "available" | "limited" | "unresolved";
  continuityStatus: "ready" | "partial" | "not_ready" | "unresolved";
  source: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  lineIdentityPresent: boolean;
  principalResolved: boolean;
  compatibilityOrFallbackActive: boolean;
  loginConfigured: boolean;
  messagingConfigured: boolean;
};

type SupportWorkspaceProps = {
  locale: Locale;
  initialAccount: AccountRecord | null;
  initialSupportDiagnostics: SupportDiagnostics;
  initialLineReadiness: LineReadiness;
  initialAccessAccountability: AccessAccountability;
  initialConsultations: ConsultationRecord[];
  initialLatestLineEvent: LineWebhookEventRecord | null;
  lineAuthReady: boolean;
  lineMessagingReady: boolean;
  lineNotice: string;
  lineError: string;
};

const copy = {
  ja: {
    label: "ひなた",
    localeToggle: "English",
  },
  en: {
    label: "Hinata",
    localeToggle: "日本語",
  },
} as const;

export default function SupportWorkspace({ locale }: SupportWorkspaceProps) {
  const t = copy[locale];
  const alternateHref = locale === "ja" ? "/en/support" : "/support";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#efe8db_100%)] text-[var(--text)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-0 py-0 md:px-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-between px-4 pt-4 md:px-6">
          <div className="pointer-events-auto rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-3 py-1.5 text-[11px] tracking-[0.18em] text-[var(--muted)] shadow-[0_10px_24px_rgba(47,35,33,0.05)] backdrop-blur">
            {t.label}
          </div>
          <Link
            href={alternateHref}
            className="pointer-events-auto rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-4 py-2 text-sm text-[var(--accent-sage-text)] shadow-[0_10px_24px_rgba(47,35,33,0.05)] transition hover:bg-white"
          >
            {t.localeToggle}
          </Link>
        </div>

        <div className="flex min-h-screen flex-1 overflow-hidden bg-transparent">
          <ScenarioSupportAssistant locale={locale} />
        </div>
      </div>
    </main>
  );
}
