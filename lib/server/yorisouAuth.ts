import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { AuthIdentity, ConsentLog, FoundationLocale, UserProfile } from "@/lib/server/foundation/schema";

import {
  assignSessionConsultationsToUser,
  createSession,
  deleteSession,
  findAccountById,
  findSessionById,
  listConsultationsForViewer,
  upsertAccountRecord,
  touchSession,
  type AccountRecord,
  type LineBindingStatus,
  type SessionPrincipalLanding,
  type SessionRecord,
} from "@/lib/server/yorisouData";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import { getSupportDisplaySnapshot } from "@/lib/server/midBackend/support/supportDisplaySnapshot";

export const SESSION_COOKIE = "yorisou_session";
export const ACCOUNT_COOKIE = "yorisou_account";

type SessionCookiePayload = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  principalLanding?: SessionPrincipalLanding | null;
};

export type ViewerContext = {
  session: SessionRecord | null;
  account: AccountRecord | null;
  legacyAccount: AccountRecord | null;
  principal: ViewerPrincipal | null;
  principalLanding: ViewerPrincipalLandingContext;
};

export type ViewerPrincipalLandingContext = {
  contract: SessionPrincipalLanding | null;
  contractStatus: "absent" | "present" | "invalid" | "conflict_fallback";
  restoreSource: "legacy_user_id" | "contract_legacy_account" | "none";
};

export type SessionPrincipalLandingCoverageStatus =
  | "written_ok"
  | "no_write_by_design"
  | "unresolvable_principal"
  | "invalid_contract"
  | "legacy_fallback"
  | "conflict_fallback";

export type ViewerPrincipalIdentitySummary = {
  authIdentityId: string;
  identityType: AuthIdentity["identityType"];
  identityStatus: AuthIdentity["identityStatus"];
  bindingState: AuthIdentity["bindingState"];
  source: AuthIdentity["source"];
  channel: AuthIdentity["channel"];
  legacyAccountId: string | null;
  emailNormalized: string | null;
  lineUserId: string | null;
};

export type ViewerPrincipal = {
  principalId: string;
  userProfileId: string;
  legacyAccountId: string | null;
  profileStatus: UserProfile["profileStatus"];
  bindingState: UserProfile["bindingState"];
  displayName: string;
  primaryLocale: FoundationLocale | null;
  authSourceSummary: ViewerPrincipalIdentitySummary[];
  stableAccessKey: string;
};

type SessionPrincipalLandingSource = SessionPrincipalLanding["source"];

export type SupportDiagnosticsSource =
  | "canonical"
  | "compatibility_mirror"
  | "legacy_fallback"
  | "unresolved";

export type SupportDiagnosticsViewModel = {
  summaryState:
    | "canonical_healthy"
    | "canonical_with_compatibility_fallback"
    | "fallback_active"
    | "owner_unresolved";
  lineBinding: {
    status: LineBindingStatus;
    source: SupportDiagnosticsSource;
  };
  supportProfile: {
    source: SupportDiagnosticsSource;
  };
  preferences: {
    source: SupportDiagnosticsSource;
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
    source: SupportDiagnosticsSource | "canonical";
  };
};

export type AccessAccountabilityViewModel = {
  auditLogged: boolean;
  accessType: "support_self_view" | "admin_target_view";
  latestConsent: {
    available: boolean;
    consentType: ConsentLog["consentType"] | null;
    timestamp: string | null;
  };
};

export type LineReadinessViewModel = {
  identityState: "bound" | "not_bound" | "unresolved";
  loginReadiness: "available" | "limited" | "unresolved";
  continuityStatus: "ready" | "partial" | "not_ready" | "unresolved";
  source: SupportDiagnosticsSource;
  lineIdentityPresent: boolean;
  principalResolved: boolean;
  compatibilityOrFallbackActive: boolean;
  loginConfigured: boolean;
  messagingConfigured: boolean;
};

export function composeSupportDiagnosticsViewModel(input: {
  hasPrincipal: boolean;
  principalMatched: boolean;
  principalId: string | null;
  legacyAccountId: string | null;
  activeWriteTargetId: string | null;
  lineBindingStatus: LineBindingStatus;
  lineBindingStatusSource: SupportDiagnosticsSource;
  supportProfileSource: SupportDiagnosticsSource;
  preferencesStorageSource: SupportDiagnosticsSource;
  readFallbackActive: boolean;
}): SupportDiagnosticsViewModel {
  const ownerMode = !input.hasPrincipal
    ? ("unresolved" as const)
    : input.principalMatched
      ? ("principal_aware" as const)
      : ("legacy_fallback" as const);

  const summaryState =
    ownerMode === "unresolved"
      ? ("owner_unresolved" as const)
      : ownerMode === "legacy_fallback"
        ? ("fallback_active" as const)
        : input.readFallbackActive
          ? ("canonical_with_compatibility_fallback" as const)
          : ("canonical_healthy" as const);

  return {
    summaryState,
    lineBinding: {
      status: input.lineBindingStatus,
      source: input.lineBindingStatusSource,
    },
    supportProfile: {
      source: input.supportProfileSource,
    },
    preferences: {
      source: input.preferencesStorageSource,
      activeWriteTarget: input.principalMatched ? "principal_aware_target" : "legacy_account_target",
    },
    ownerResolution: {
      mode: ownerMode,
      principalId: input.principalId,
      legacyAccountId: input.legacyAccountId,
      activeWriteTargetId: input.activeWriteTargetId,
    },
    readFallback: {
      active: input.readFallbackActive,
      source: input.readFallbackActive ? input.lineBindingStatusSource : "canonical",
    },
  };
}

export function composeAccessAccountabilityViewModel(input: {
  accessType: AccessAccountabilityViewModel["accessType"];
  latestConsent: ConsentLog | null;
}): AccessAccountabilityViewModel {
  return {
    auditLogged: true,
    accessType: input.accessType,
    latestConsent: {
      available: Boolean(input.latestConsent),
      consentType: input.latestConsent?.consentType || null,
      timestamp: input.latestConsent?.timestamp || null,
    },
  };
}

export function composeLineReadinessViewModel(input: {
  diagnostics: SupportDiagnosticsViewModel;
  lineIdentityPresent: boolean;
  loginConfigured: boolean;
  messagingConfigured: boolean;
}): LineReadinessViewModel {
  const principalResolved = input.diagnostics.ownerResolution.mode === "principal_aware";
  const source = input.diagnostics.lineBinding.source;
  const compatibilityOrFallbackActive = source !== "canonical";

  const identityState =
    input.lineIdentityPresent && input.diagnostics.lineBinding.status === "connected"
      ? ("bound" as const)
      : input.diagnostics.lineBinding.status === "not_connected"
        ? ("not_bound" as const)
        : ("unresolved" as const);

  const loginReadiness = input.loginConfigured
    ? principalResolved && identityState === "bound"
      ? ("available" as const)
      : ("limited" as const)
    : ("unresolved" as const);

  const continuityStatus =
    !principalResolved || source === "unresolved"
      ? ("unresolved" as const)
      : input.messagingConfigured && identityState === "bound" && source === "canonical"
        ? ("ready" as const)
        : input.lineIdentityPresent || input.loginConfigured
          ? ("partial" as const)
          : ("not_ready" as const);

  return {
    identityState,
    loginReadiness,
    continuityStatus,
    source,
    lineIdentityPresent: input.lineIdentityPresent,
    principalResolved,
    compatibilityOrFallbackActive,
    loginConfigured: input.loginConfigured,
    messagingConfigured: input.messagingConfigured,
  };
}

const AUTH_COOKIE_SECRET = process.env.YORISOU_AUTH_COOKIE_SECRET || "yorisou-phase1-auth-cookie-secret";
const AUTH_COOKIE_KEY = createHash("sha256").update(AUTH_COOKIE_SECRET).digest();

function encryptCookieValue(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", AUTH_COOKIE_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function decryptCookieValue(value: string) {
  try {
    const buffer = Buffer.from(value, "base64url");
    if (buffer.length <= 28) {
      return null;
    }

    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", AUTH_COOKIE_KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

function encodeSessionCookie(session: SessionCookiePayload) {
  return encryptCookieValue(JSON.stringify(session));
}

function decodeSessionCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  const decoded = decryptCookieValue(value);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as SessionCookiePayload;
  } catch {
    return null;
  }
}

function encodeAccountCookie(account: AccountRecord) {
  return encryptCookieValue(JSON.stringify(account));
}

function decodeAccountCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  const decoded = decryptCookieValue(value);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as AccountRecord;
  } catch {
    return null;
  }
}

function createSyntheticSession(payload: SessionCookiePayload): SessionRecord {
  return {
    id: payload.id,
    userId: payload.userId,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    principalLanding: payload.principalLanding || null,
  };
}

export function parseSessionPrincipalLanding(value: unknown): SessionPrincipalLanding | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SessionPrincipalLanding>;

  if (candidate.version !== 1 || candidate.kind !== "canonical_principal") {
    return null;
  }

  if (
    typeof candidate.principalId !== "string" ||
    typeof candidate.userProfileId !== "string" ||
    typeof candidate.source !== "string" ||
    typeof candidate.issuedAt !== "string"
  ) {
    return null;
  }

  if (
    candidate.source !== "email_login" &&
    candidate.source !== "register" &&
    candidate.source !== "line_login" &&
    candidate.source !== "line_bind" &&
    candidate.source !== "session_upgrade"
  ) {
    return null;
  }

  if (candidate.legacyAccountId !== null && candidate.legacyAccountId !== undefined && typeof candidate.legacyAccountId !== "string") {
    return null;
  }

  return {
    version: 1,
    kind: "canonical_principal",
    principalId: candidate.principalId,
    userProfileId: candidate.userProfileId,
    legacyAccountId: candidate.legacyAccountId || null,
    source: candidate.source,
    issuedAt: candidate.issuedAt,
  };
}

function getParsedSessionPrincipalLanding(...values: Array<unknown>) {
  for (const value of values) {
    const parsed = parseSessionPrincipalLanding(value);

    if (parsed) {
      return parsed;
    }
  }

  return null;
}

export function resolveSessionPrincipalLandingContext(input: {
  sessionUserId: string | null;
  contractValue: unknown;
}): ViewerPrincipalLandingContext {
  const contract = parseSessionPrincipalLanding(input.contractValue);
  const contractStatus = input.contractValue == null ? "absent" : contract ? "present" : "invalid";

  if (input.sessionUserId) {
    return {
      contract,
      contractStatus,
      restoreSource: "legacy_user_id",
    };
  }

  if (contract?.legacyAccountId) {
    return {
      contract,
      contractStatus: "present",
      restoreSource: "contract_legacy_account",
    };
  }

  return {
    contract,
    contractStatus,
    restoreSource: "none",
  };
}

function toViewerPrincipalIdentitySummary(identity: AuthIdentity): ViewerPrincipalIdentitySummary {
  return {
    authIdentityId: identity.authIdentityId,
    identityType: identity.identityType,
    identityStatus: identity.identityStatus,
    bindingState: identity.bindingState,
    source: identity.source,
    channel: identity.channel,
    legacyAccountId: identity.legacyAccountId,
    emailNormalized: identity.emailNormalized,
    lineUserId: identity.lineUserId,
  };
}

function toViewerPrincipal(
  userProfile: UserProfile,
  authIdentities: AuthIdentity[],
): ViewerPrincipal {
  return {
    principalId: userProfile.userProfileId,
    userProfileId: userProfile.userProfileId,
    legacyAccountId: userProfile.legacyAccountId,
    profileStatus: userProfile.profileStatus,
    bindingState: userProfile.bindingState,
    displayName: userProfile.profile.displayName,
    primaryLocale: userProfile.profile.primaryLocale,
    authSourceSummary: authIdentities.map(toViewerPrincipalIdentitySummary),
    stableAccessKey: `user_profile:${userProfile.userProfileId}`,
  };
}

async function resolveViewerPrincipal(account: AccountRecord | null): Promise<ViewerPrincipal | null> {
  if (!account) {
    return null;
  }

  try {
    const userProfile =
      (await identityFoundationService.getUserProfileByLegacyAccountId(account.id)) ||
      (await identityFoundationService.getUserProfileById(account.id));

    if (!userProfile) {
      return null;
    }

    const authIdentities = await identityFoundationService.getAuthIdentitiesByUserProfileId(userProfile.userProfileId);
    return toViewerPrincipal(userProfile, authIdentities);
  } catch (error) {
    console.error("viewer principal resolution error:", error);
    return null;
  }
}

async function resolveViewerPrincipalFromLandingContract(
  contract: SessionPrincipalLanding | null,
  effectiveLegacyAccountId: string | null,
): Promise<ViewerPrincipal | null> {
  if (!contract) {
    return null;
  }

  try {
    const userProfile =
      (await identityFoundationService.getUserProfileById(contract.userProfileId)) ||
      (contract.principalId !== contract.userProfileId ? await identityFoundationService.getUserProfileById(contract.principalId) : null);

    if (!userProfile) {
      return null;
    }

    if (
      effectiveLegacyAccountId &&
      userProfile.legacyAccountId &&
      userProfile.legacyAccountId !== effectiveLegacyAccountId &&
      userProfile.userProfileId !== effectiveLegacyAccountId
    ) {
      console.warn("session landing contract falling back to legacy truth because contract conflicts with legacy account", {
        effectiveLegacyAccountId,
        contractLegacyAccountId: contract.legacyAccountId,
        contractUserProfileId: contract.userProfileId,
        resolvedLegacyAccountId: userProfile.legacyAccountId,
      });
      return null;
    }

    const authIdentities = await identityFoundationService.getAuthIdentitiesByUserProfileId(userProfile.userProfileId);
    return toViewerPrincipal(userProfile, authIdentities);
  } catch (error) {
    console.error("viewer principal landing contract resolution error:", error);
    return null;
  }
}

async function buildSessionPrincipalLandingContract(input: {
  legacyAccount: AccountRecord | null;
  source: SessionPrincipalLandingSource;
}): Promise<SessionPrincipalLanding | null> {
  if (!input.legacyAccount) {
    return null;
  }

  try {
    const userProfile =
      (await identityFoundationService.getUserProfileByLegacyAccountId(input.legacyAccount.id)) ||
      (await identityFoundationService.getUserProfileById(input.legacyAccount.id));

    if (!userProfile) {
      return null;
    }

    return {
      version: 1,
      kind: "canonical_principal",
      principalId: userProfile.userProfileId,
      userProfileId: userProfile.userProfileId,
      legacyAccountId: input.legacyAccount.id,
      source: input.source,
      issuedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("session principal landing contract build error:", error);
    return null;
  }
}

export async function withSessionPrincipalLandingShadow(
  session: SessionRecord,
  input: {
    legacyAccount: AccountRecord | null;
    source: SessionPrincipalLandingSource;
  },
): Promise<SessionRecord> {
  if (parseSessionPrincipalLanding(session.principalLanding)) {
    return session;
  }

  const contract = await buildSessionPrincipalLandingContract(input);
  if (!contract) {
    return session;
  }

  return {
    ...session,
    principalLanding: contract,
  };
}

export async function ensureSessionPrincipalLandingShadowWrite(
  session: SessionRecord,
  input: {
    legacyAccount: AccountRecord | null;
    source: SessionPrincipalLandingSource;
  },
): Promise<SessionRecord> {
  const sessionWithShadow = await withSessionPrincipalLandingShadow(session, input);

  if (sessionWithShadow.principalLanding === session.principalLanding) {
    return session;
  }

  return (
    (await touchSession(session.id, session.userId, sessionWithShadow.principalLanding || null)) ||
    sessionWithShadow
  );
}

export async function switchSessionToPrincipalLandingTruth(
  session: SessionRecord,
  input: {
    legacyAccount: AccountRecord | null;
    source: SessionPrincipalLandingSource;
  },
): Promise<SessionRecord> {
  const sessionWithShadow = await withSessionPrincipalLandingShadow(session, input);
  const contract = parseSessionPrincipalLanding(sessionWithShadow.principalLanding);

  if (!contract) {
    console.warn("session writer-switch falling back to legacy session truth because principal landing contract is unavailable", {
      sessionId: session.id,
      source: input.source,
      legacyAccountId: input.legacyAccount?.id || null,
    });
    return session;
  }

  return (
    (await touchSession(session.id, null, contract)) || {
      ...sessionWithShadow,
      userId: null,
    }
  );
}

export async function inspectSessionPrincipalLandingCoverage(input: {
  session: SessionRecord;
  accountCookie?: AccountRecord | null;
  rawContractValue?: unknown;
}) {
  const principalLanding = resolveSessionPrincipalLandingContext({
    sessionUserId: input.session.userId,
    contractValue: input.rawContractValue === undefined ? input.session.principalLanding : input.rawContractValue,
  });
  const effectiveLegacyAccountId =
    principalLanding.restoreSource === "legacy_user_id"
      ? input.session.userId
      : principalLanding.restoreSource === "contract_legacy_account"
        ? principalLanding.contract?.legacyAccountId || null
        : null;
  const accountFromStore = effectiveLegacyAccountId ? await findAccountById(effectiveLegacyAccountId) : null;
  const account =
    accountFromStore ||
    (input.accountCookie && effectiveLegacyAccountId && input.accountCookie.id === effectiveLegacyAccountId
      ? input.accountCookie
      : null);
  const principalFromContract = await resolveViewerPrincipalFromLandingContract(principalLanding.contract, effectiveLegacyAccountId);
  const principal = principalFromContract || (await resolveViewerPrincipal(account));
  const contractPresent = Boolean(principalLanding.contract);
  const contractStatus =
    contractPresent && principalLanding.contractStatus === "present" && !principalFromContract
      ? ("conflict_fallback" as const)
      : principalLanding.contractStatus;

  let classification: SessionPrincipalLandingCoverageStatus;
  if (principalLanding.contractStatus === "invalid") {
    classification = "invalid_contract";
  } else if (contractStatus === "conflict_fallback") {
    classification = "conflict_fallback";
  } else if (contractPresent && principalFromContract) {
    classification = "written_ok";
  } else if (!effectiveLegacyAccountId) {
    classification = "no_write_by_design";
  } else if (!principal) {
    classification = "unresolvable_principal";
  } else {
    classification = "legacy_fallback";
  }

  return {
    classification,
    contractStatus,
    restoreSource: principalLanding.restoreSource,
    contract: principalLanding.contract,
    effectiveLegacyAccountId,
    principalResolved: Boolean(principal),
  };
}

export async function inspectEncodedSessionCookieForAudit(input: {
  encodedSessionCookie: string | undefined;
  accountCookie?: AccountRecord | null;
}) {
  const sessionCookie = decodeSessionCookie(input.encodedSessionCookie);

  if (!sessionCookie) {
    return {
      cookieDecoded: false,
      sessionPayload: null,
      coverage: null,
    };
  }

  const syntheticSession = createSyntheticSession(sessionCookie);
  const coverage = await inspectSessionPrincipalLandingCoverage({
    session: syntheticSession,
    accountCookie: input.accountCookie || null,
  });

  return {
    cookieDecoded: true,
    sessionPayload: sessionCookie,
    coverage,
  };
}

export function readAccountCookieFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const accountValue = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${ACCOUNT_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  return decodeAccountCookie(accountValue);
}

export function setViewerSessionCookie(response: NextResponse, session: SessionRecord) {
  response.cookies.set(SESSION_COOKIE, encodeSessionCookie(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export function setViewerAccountCookie(response: NextResponse, account: AccountRecord) {
  response.cookies.set(ACCOUNT_COOKIE, encodeAccountCookie(account), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function getViewerContext(): Promise<ViewerContext> {
  const cookieStore = await cookies();
  const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const sessionCookie = decodeSessionCookie(rawSessionValue);
  const accountCookie = decodeAccountCookie(cookieStore.get(ACCOUNT_COOKIE)?.value);

  if (sessionCookie) {
    const storedSession = await findSessionById(sessionCookie.id);
    const session = storedSession
      ? ((await touchSession(sessionCookie.id, sessionCookie.userId)) || storedSession)
      : createSyntheticSession(sessionCookie);
    const contract = getParsedSessionPrincipalLanding(session.principalLanding, sessionCookie.principalLanding);
    const principalLanding = resolveSessionPrincipalLandingContext({
      sessionUserId: session.userId,
      contractValue: contract,
    });
    const effectiveLegacyAccountId =
      principalLanding.restoreSource === "legacy_user_id"
        ? session.userId
        : principalLanding.restoreSource === "contract_legacy_account"
          ? principalLanding.contract?.legacyAccountId || null
          : null;
    const accountFromStore = effectiveLegacyAccountId ? await findAccountById(effectiveLegacyAccountId) : null;
    const account =
      accountFromStore ||
      (accountCookie && effectiveLegacyAccountId && accountCookie.id === effectiveLegacyAccountId ? accountCookie : null);
    const principalFromContract = await resolveViewerPrincipalFromLandingContract(principalLanding.contract, effectiveLegacyAccountId);
    const principal = principalFromContract || (await resolveViewerPrincipal(account));
    const resolvedPrincipalLanding =
      principalLanding.contract && principalLanding.contractStatus === "present" && !principalFromContract
        ? { ...principalLanding, contractStatus: "conflict_fallback" as const }
        : principalLanding;

    return {
      session,
      account,
      legacyAccount: account,
      principal,
      principalLanding: resolvedPrincipalLanding,
    };
  }

  if (!rawSessionValue) {
    return {
      session: null,
      account: null,
      legacyAccount: null,
      principal: null,
      principalLanding: {
        contract: null,
        contractStatus: "absent",
        restoreSource: "none",
      },
    };
  }

  const session = await findSessionById(rawSessionValue);

  if (!session) {
    return {
      session: null,
      account: null,
      legacyAccount: null,
      principal: null,
      principalLanding: {
        contract: null,
        contractStatus: "absent",
        restoreSource: "none",
      },
    };
  }

  await touchSession(session.id);
  const principalLanding = resolveSessionPrincipalLandingContext({
    sessionUserId: session.userId,
    contractValue: session.principalLanding,
  });
  const effectiveLegacyAccountId =
    principalLanding.restoreSource === "legacy_user_id"
      ? session.userId
      : principalLanding.restoreSource === "contract_legacy_account"
        ? principalLanding.contract?.legacyAccountId || null
        : null;
  const account = effectiveLegacyAccountId ? await findAccountById(effectiveLegacyAccountId) : null;
  const principalFromContract = await resolveViewerPrincipalFromLandingContract(principalLanding.contract, effectiveLegacyAccountId);
  const principal = principalFromContract || (await resolveViewerPrincipal(account));
  const resolvedPrincipalLanding =
    principalLanding.contract && principalLanding.contractStatus === "present" && !principalFromContract
      ? { ...principalLanding, contractStatus: "conflict_fallback" as const }
      : principalLanding;
  return {
    session,
    account,
    legacyAccount: account,
    principal,
    principalLanding: resolvedPrincipalLanding,
  };
}

export async function ensureViewerSession() {
  const cookieStore = await cookies();
  const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const sessionCookie = decodeSessionCookie(rawSessionValue);

  if (sessionCookie) {
    const session = await findSessionById(sessionCookie.id);
    if (session) {
      const touchedSession = (await touchSession(session.id, sessionCookie.userId)) || session;
      if (touchedSession.userId) {
        const account = await findAccountById(touchedSession.userId);
        return switchSessionToPrincipalLandingTruth(touchedSession, {
          legacyAccount: account,
          source: "session_upgrade",
        });
      }
      return touchedSession;
    }
    return createSyntheticSession(sessionCookie);
  }

  if (rawSessionValue) {
    const session = await findSessionById(rawSessionValue);
    if (session) {
      const touchedSession = (await touchSession(session.id)) || session;
      if (touchedSession.userId) {
        const account = await findAccountById(touchedSession.userId);
        return switchSessionToPrincipalLandingTruth(touchedSession, {
          legacyAccount: account,
          source: "session_upgrade",
        });
      }
      return touchedSession;
    }
  }

  return createSession(null);
}

export async function bindSessionToUser(
  sessionId: string,
  userId: string,
  options?: {
    legacyAccount?: AccountRecord | null;
    source?: SessionPrincipalLandingSource;
  },
) {
  const legacyAccount = options?.legacyAccount || (await findAccountById(userId));
  const contract = await buildSessionPrincipalLandingContract({
    legacyAccount,
    source: options?.source || "session_upgrade",
  });
  const session = await touchSession(sessionId, contract ? null : userId, contract || undefined);
  await assignSessionConsultationsToUser(sessionId, userId, {
    ownerTargetId: contract?.userProfileId || userId,
  });
  return session;
}

export async function clearViewerSession() {
  const cookieStore = await cookies();
  const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const sessionCookie = decodeSessionCookie(rawSessionValue);
  const sessionId = sessionCookie?.id || rawSessionValue;
  if (sessionId) {
    await deleteSession(sessionId);
  }
}

export async function restoreAccountFromCookie(account: AccountRecord | null) {
  if (!account) {
    return null;
  }

  await upsertAccountRecord(account);
  return account;
}

function getLegacyViewerAccount(viewer: ViewerContext) {
  return viewer.legacyAccount || viewer.account;
}

export function resolveSupportWorkspaceViewerLookup(viewer: ViewerContext) {
  const legacyAccount = getLegacyViewerAccount(viewer);

  if (!legacyAccount) {
    return {
      effectiveLegacyAccountId: null,
      supportReadTargetUserProfileId: null,
      consultationOwnerIds: [],
      consultationOwnerTargetId: null,
      hasAuthenticatedViewer: false,
      principalMatched: false,
      legacyMatched: false,
      matchedBy: "none" as const,
      fallbackAccount: null,
    };
  }

  const principalCandidates = [
    viewer.principal?.legacyAccountId || null,
    viewer.principal?.userProfileId || null,
  ].filter((entry): entry is string => Boolean(entry));
  const principalMatched = principalCandidates.includes(legacyAccount.id);

  if (viewer.principal && !principalMatched) {
    console.warn("support workspace viewer lookup falling back to legacy account despite principal mismatch", {
      legacyAccountId: legacyAccount.id,
      principalCandidates,
      principalId: viewer.principal.userProfileId,
    });
  }

  return {
    effectiveLegacyAccountId: legacyAccount.id,
    supportReadTargetUserProfileId:
      principalMatched && viewer.principal?.userProfileId ? viewer.principal.userProfileId : legacyAccount.id,
    consultationOwnerIds: Array.from(new Set([legacyAccount.id, viewer.principal?.userProfileId || null].filter((entry): entry is string => Boolean(entry)))),
    consultationOwnerTargetId: viewer.principal?.userProfileId || legacyAccount.id,
    hasAuthenticatedViewer: true,
    principalMatched,
    legacyMatched: true,
    matchedBy: principalMatched ? "principal" : "legacy",
    fallbackAccount: legacyAccount,
  } as const;
}

export async function getSupportWorkspaceData(locale: "ja" | "en") {
  const viewer = await getViewerContext();
  const viewerLookup = resolveSupportWorkspaceViewerLookup(viewer);
  // Consultation display remains on the legacy ConsultationRecord boundary for now.
  // The support workspace consumes the existing record shape directly, and there is
  // no canonical consultation read model yet that can replace it without risking
  // display contract drift or coupling to consultation write semantics.
  const consultations = await listConsultationsForViewer({
    userId: viewerLookup.effectiveLegacyAccountId,
    userIds: viewerLookup.consultationOwnerIds,
    sessionId: viewer.session?.id || null,
    locale,
  });
  const supportDisplaySnapshot = await getSupportDisplaySnapshot({
    userProfileId: viewerLookup.supportReadTargetUserProfileId,
    fallbackAccount: viewerLookup.fallbackAccount,
  });
  const latestConsent = viewer.principal?.userProfileId
    ? (await privacyAuditService.listRecentConsentEntries(20)).find((entry) => entry?.userProfileId === viewer.principal?.userProfileId) || null
    : null;

  if (viewerLookup.hasAuthenticatedViewer) {
    try {
      await privacyAuditService.recordAudit({
        actorType: "user",
        actorUserProfileId: viewer.principal?.userProfileId || null,
        actorAuthIdentityId: null,
        action: "support.view_sensitive",
        resourceType: "user_profile",
        resourceId: viewer.principal?.userProfileId || viewerLookup.effectiveLegacyAccountId,
        channel: "support_web",
        source: "support_workspace",
        bindingState: viewer.principal ? "bound" : "unbound",
        containsSensitiveAccess: true,
        summary: "User viewed support workspace with support profile and consultation context",
        metadata: {
          locale,
          accessType: "support_self_view",
          targetUserProfileId: viewer.principal?.userProfileId || null,
          targetLegacyAccountId: viewerLookup.effectiveLegacyAccountId,
        },
      });
    } catch (foundationError) {
      console.error("support workspace view audit error:", foundationError);
    }
  }

  return {
    ...viewer,
    account: supportDisplaySnapshot.account,
    supportProfile: supportDisplaySnapshot.supportProfile,
    supportReadModelSource: supportDisplaySnapshot.readModelSource,
    supportDiagnostics: composeSupportDiagnosticsViewModel({
      hasPrincipal: viewerLookup.hasAuthenticatedViewer,
      principalMatched: viewerLookup.principalMatched,
      principalId: viewer.principal?.userProfileId || null,
      legacyAccountId: viewerLookup.effectiveLegacyAccountId,
      activeWriteTargetId: viewerLookup.principalMatched
        ? viewer.principal?.userProfileId || null
        : viewerLookup.effectiveLegacyAccountId,
      lineBindingStatus: supportDisplaySnapshot.supportProfile?.lineBindingStatus || "not_connected",
      lineBindingStatusSource: supportDisplaySnapshot.lineBindingStatusSource,
      supportProfileSource: supportDisplaySnapshot.supportProfileSource,
      preferencesStorageSource: supportDisplaySnapshot.preferencesStorageSource,
      readFallbackActive: supportDisplaySnapshot.readFallbackActive,
    }),
    consultations,
    latestLineEvent: supportDisplaySnapshot.latestLineEvent,
    accessAccountability: composeAccessAccountabilityViewModel({
      accessType: "support_self_view",
      latestConsent,
    }),
  };
}

export type SupportWorkspaceData = Awaited<ReturnType<typeof getSupportWorkspaceData>>;
