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
    label: "AI相談員 ひなた",
    title: "ひなたとそのまま話す",
    subtitle: "入力、音声、ファイルをひとつの会話でそのまま続けられます。",
    localeToggle: "English",
  },
  en: {
    label: "Hinata",
    title: "Talk with Hinata directly",
    subtitle: "Type, speak, or attach a file in one continuous conversation.",
    localeToggle: "日本語",
  },
} as const;

export default function SupportWorkspace({ locale }: SupportWorkspaceProps) {
  const t = copy[locale];
  const alternateHref = locale === "ja" ? "/en/support" : "/support";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6f3ec_0%,#efe8db_100%)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 md:px-6">
        <header className="mb-4 flex items-center justify-between gap-4 rounded-[1.4rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.84)] px-4 py-3 backdrop-blur md:px-5">
          <div className="min-w-0">
            <div className="text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.label}</div>
            <h1 className="mt-1 text-lg text-[var(--text)] md:text-xl">{t.title}</h1>
            <p className="mt-1 hidden text-sm text-[var(--muted)] md:block">{t.subtitle}</p>
          </div>
          <Link
            href={alternateHref}
            className="shrink-0 rounded-full border border-[color:var(--line-soft)] bg-white/80 px-4 py-2 text-sm text-[var(--accent-sage-text)] transition hover:bg-white"
          >
            {t.localeToggle}
          </Link>
        </header>

        <div className="flex flex-1 overflow-hidden rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.86)] shadow-[0_20px_60px_rgba(47,35,33,0.08)] backdrop-blur">
          <ScenarioSupportAssistant locale={locale} />
        </div>
      </div>
    </main>
  );
}
