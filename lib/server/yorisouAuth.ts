import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import {
  assignSessionConsultationsToUser,
  createSession,
  deleteSession,
  findAccountById,
  findSessionById,
  getLatestLineWebhookEventForAccount,
  listConsultationsForViewer,
  touchSession,
  upsertAccountRecord,
  type AccountRecord,
  type LineBindingStatus,
  type SessionPrincipalLanding,
  type SessionRecord,
} from "@/lib/server/yorisouData";
import { sessionMayActAsAccount, type ViewerSurface } from "@/lib/server/accountDeletionLock";
import { decideCookieRestoredAccount } from "@/lib/server/accountDeletionAuthority";
import { withAccountMutationLease } from "@/lib/server/accountMutationLease";

export const SESSION_COOKIE = "yorisou_session";
export const ACCOUNT_COOKIE = "yorisou_account";

type SessionCookiePayload = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  principalLanding?: SessionPrincipalLanding | null;
};

export type ViewerPrincipalIdentitySummary = {
  emailNormalized: string | null;
};

export type ViewerPrincipal = {
  principalId: string;
  userProfileId: string;
  legacyAccountId: string | null;
  authSourceSummary: ViewerPrincipalIdentitySummary[];
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

export type ViewerContext = {
  session: SessionRecord | null;
  account: AccountRecord | null;
  legacyAccount: AccountRecord | null;
  principal: ViewerPrincipal | null;
  principalLanding: ViewerPrincipalLandingContext;
};

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
    consentType: "account_registration" | "line_identity_binding" | "line_primary_login" | "email_identity_attachment" | null;
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
  latestConsent:
    | {
        consentType?: AccessAccountabilityViewModel["latestConsent"]["consentType"];
        timestamp?: string | null;
      }
    | null;
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

const DEVELOPMENT_AUTH_COOKIE_SECRET =
  process.env.NODE_ENV === "production" ? null : randomBytes(32).toString("hex");

let cachedAuthCookieKey: Buffer | null | undefined;

function getConfiguredAuthCookieSecret() {
  return process.env.YORISOU_AUTH_COOKIE_SECRET || DEVELOPMENT_AUTH_COOKIE_SECRET;
}

function getAuthCookieKey() {
  if (cachedAuthCookieKey !== undefined) {
    return cachedAuthCookieKey;
  }

  const secret = getConfiguredAuthCookieSecret();
  cachedAuthCookieKey = secret ? createHash("sha256").update(secret).digest() : null;
  return cachedAuthCookieKey;
}

function requireAuthCookieKey() {
  const authCookieKey = getAuthCookieKey();

  if (!authCookieKey) {
    throw new Error("YORISOU_AUTH_COOKIE_SECRET is required in production");
  }

  return authCookieKey;
}

function encryptCookieValue(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", requireAuthCookieKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function decryptCookieValue(value: string) {
  try {
    const authCookieKey = getAuthCookieKey();
    if (!authCookieKey) {
      return null;
    }

    const buffer = Buffer.from(value, "base64url");
    if (buffer.length <= 28) {
      return null;
    }

    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", authCookieKey, iv);
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

/**
 * POR-1 WS5 — a held account is resolved as absent.
 *
 * The session cookie is self-contained, so revoking stored session objects does not by itself end a
 * session. This is where a revoked session actually stops being able to act: the account record it
 * resolves to carries the hold, and a held record yields no account and no principal.
 */
function accountUnlessDeletionLocked(
  account: AccountRecord | null,
  includeHeldAccount: boolean,
): AccountRecord | null {
  if (includeHeldAccount) return account;
  if (account && !sessionMayActAsAccount(account.deletionLockedAt)) return null;
  return account;
}

/**
 * POR-1 — resolve the account a request is acting as, with the cookie demoted to a lookup hint.
 *
 * The order is the whole point. The STORE decides whenever it can: a found record carries the real
 * `deletionLockedAt` and needs no help. Only when the record is missing does the cookie get a say,
 * and then only if the durable deletion record agrees the name still means something.
 *
 * That ordering is also why this costs nothing. The extra reads happen exclusively on the store-miss
 * path — never on the hot path, and never for an anonymous viewer.
 */
async function resolveAccountForViewer(input: {
  accountId: string | null;
  /** The decrypted `yorisou_account` cookie, or null on paths that deliberately have no fallback. */
  accountCookie: AccountRecord | null;
  surface: ViewerSurface;
  includeHeldAccount: boolean;
}): Promise<AccountRecord | null> {
  if (!input.accountId) return null;

  const stored = await findAccountById(input.accountId);
  if (stored) return accountUnlessDeletionLocked(stored, input.includeHeldAccount);

  const candidate = input.accountCookie?.id === input.accountId ? input.accountCookie : null;
  if (!candidate) return null;

  const decision = await decideCookieRestoredAccount({
    accountId: input.accountId,
    deletionLockedAt: candidate.deletionLockedAt,
    surface: input.surface,
  });
  if (!decision.resolves) return null;

  return accountUnlessDeletionLocked(candidate, input.includeHeldAccount);
}

function toViewerPrincipal(account: AccountRecord | null): ViewerPrincipal | null {
  if (!account) {
    return null;
  }

  return {
    principalId: account.id,
    userProfileId: account.id,
    legacyAccountId: account.id,
    authSourceSummary: [{ emailNormalized: account.email.toLowerCase() }],
  };
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
      contractStatus,
      restoreSource: "contract_legacy_account",
    };
  }

  return {
    contract,
    contractStatus,
    restoreSource: "none",
  };
}

async function buildSessionPrincipalLandingContract(input: {
  legacyAccount: AccountRecord | null;
  source: SessionPrincipalLanding["source"];
}): Promise<SessionPrincipalLanding | null> {
  if (!input.legacyAccount) {
    return null;
  }

  return {
    version: 1,
    kind: "canonical_principal",
    principalId: input.legacyAccount.id,
    userProfileId: input.legacyAccount.id,
    legacyAccountId: input.legacyAccount.id,
    source: input.source,
    issuedAt: new Date().toISOString(),
  };
}

export async function withSessionPrincipalLandingShadow(
  session: SessionRecord,
  input: {
    legacyAccount: AccountRecord | null;
    source: SessionPrincipalLanding["source"];
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
    source: SessionPrincipalLanding["source"];
  },
): Promise<SessionRecord> {
  const sessionWithShadow = await withSessionPrincipalLandingShadow(session, input);
  if (sessionWithShadow.principalLanding === session.principalLanding) {
    return session;
  }

  // POR-1 — this binds an account to a session, so it is an account-linked write and holds a lease
  // across the whole window. An anonymous session has nothing to fence and takes the plain path.
  const accountId = session.userId || input.legacyAccount?.id || null;
  if (!accountId) {
    return (await touchSession(null, session.id, session.userId, sessionWithShadow.principalLanding || null)) || sessionWithShadow;
  }
  return (
    (await withAccountMutationLease({
      accountId,
      operation: "session_identity_upgrade",
      execute: (context) =>
        touchSession(context, session.id, session.userId, sessionWithShadow.principalLanding || null),
    })) || sessionWithShadow
  );
}

/**
 * POR-1 R2b — the same switch, but it SAYS whether the write landed.
 *
 * `switchSessionToPrincipalLandingTruth` returns `touchSession(...) || fallback`, and the fallback is
 * shaped exactly like a successful result. So a caller that needs to know whether the contract was
 * actually persisted could not ask — it had to re-read the object and look.
 *
 * That re-read is a cacheable GET on the key that was just written, and this transport serves
 * superseded versions of a key it has recently seen. Registration's `bindAndProve` therefore read
 * back the copy written moments earlier by `insertSessionRecordIfAbsent` — the one WITHOUT the
 * landing — and refused the registration with `session_landing_missing`. Truthfully, by its own
 * contract: it could not prove the identity, so it would not return 200. But the write had
 * succeeded, and the person was told to try again for nothing.
 *
 * `persisted` comes from the write itself. `touchSession` is update-only and returns the record it
 * wrote, or null when there was no row to update — which is precisely the in-memory-fallback case
 * the read-back was invented to catch.
 */
export async function switchSessionToPrincipalLandingTruthWithProof(
  session: SessionRecord,
  input: {
    legacyAccount: AccountRecord | null;
    source: SessionPrincipalLanding["source"];
  },
): Promise<{ session: SessionRecord; persisted: boolean; contractApplied: boolean }> {
  const sessionWithShadow = await withSessionPrincipalLandingShadow(session, input);
  const contract = parseSessionPrincipalLanding(sessionWithShadow.principalLanding);

  if (!contract) {
    return { session, persisted: false, contractApplied: false };
  }

  // The contract still names the account even though `userId` becomes null, so this is account-linked
  // and leased. Fencing only the `userId` form would leave the migration path — the one that produced
  // the session the erasure probe found still live — outside the fence.
  const accountId = contract.legacyAccountId || session.userId || input.legacyAccount?.id || null;
  const fallback = { ...sessionWithShadow, userId: null };

  const written = accountId
    ? await withAccountMutationLease({
        accountId,
        operation: "session_identity_upgrade",
        execute: (context) => touchSession(context, session.id, null, contract),
      })
    : await touchSession(null, session.id, null, contract);

  return {
    session: written || fallback,
    persisted: Boolean(written),
    contractApplied: true,
  };
}

export async function switchSessionToPrincipalLandingTruth(
  session: SessionRecord,
  input: {
    legacyAccount: AccountRecord | null;
    source: SessionPrincipalLanding["source"];
  },
): Promise<SessionRecord> {
  const result = await switchSessionToPrincipalLandingTruthWithProof(session, input);
  return result.session;
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
  const account =
    (effectiveLegacyAccountId ? await findAccountById(effectiveLegacyAccountId) : null) ||
    (input.accountCookie && effectiveLegacyAccountId === input.accountCookie.id ? input.accountCookie : null);
  const principal = toViewerPrincipal(account);

  let classification: SessionPrincipalLandingCoverageStatus;
  if (principalLanding.contractStatus === "invalid") {
    classification = "invalid_contract";
  } else if (principalLanding.contractStatus === "present") {
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
    contractStatus: principalLanding.contractStatus,
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
  response.cookies.set(
    SESSION_COOKIE,
    encodeSessionCookie({
      id: session.id,
      userId: session.userId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      principalLanding: session.principalLanding || null,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  );
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

export async function getViewerContext(
  /**
   * POR-1 WS5 — escape hatch for the deletion surfaces ONLY; use
   * `getDeletionSurfaceViewerContext()` rather than passing this by hand. A held account must still
   * be able to read the status of, and cancel, the deletion it asked for. Blinding someone to their
   * own in-flight deletion is not a safety property.
   */
  options?: { includeHeldAccount?: boolean },
): Promise<ViewerContext> {
  const includeHeldAccount = options?.includeHeldAccount === true;
  // `includeHeldAccount` is only ever true for the deletion surfaces, so the two travel together
  // rather than being passed independently and drifting apart.
  const surface: ViewerSurface = includeHeldAccount ? "deletion_surface" : "ordinary";
  try {
    const cookieStore = await cookies();
    const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
    const sessionCookie = decodeSessionCookie(rawSessionValue);
    const accountCookie = decodeAccountCookie(cookieStore.get(ACCOUNT_COOKIE)?.value);

    if (sessionCookie) {
      // POR-1 — READING A SESSION NO LONGER WRITES ONE.
      //
      // This used to `touchSession` on every authenticated request, folding the COOKIE's `userId`
      // and principal-landing contract back into the stored record. That is a write-on-read, and it
      // is the cleanest resurrection path in the product: a browser holding a stale cookie would
      // re-assert the identity of a person whose session had just been revoked, on nothing more than
      // a page view — and it would do so on a path far too hot to take a lease on.
      //
      // The merge still happens, in memory, so a viewer whose cookie carries a contract the record
      // has not caught up with is unaffected. What no longer happens is persisting it. Every path
      // that genuinely needs the record updated — login, binding, the principal-landing switch —
      // does so deliberately, under a lease, and is unchanged.
      const storedSession = await findSessionById(sessionCookie.id);
      const session = storedSession
        ? {
            ...storedSession,
            userId: sessionCookie.userId === undefined ? storedSession.userId : sessionCookie.userId,
            principalLanding:
              sessionCookie.principalLanding === undefined
                ? storedSession.principalLanding || null
                : sessionCookie.principalLanding || null,
          }
        : createSyntheticSession(sessionCookie);
      const principalLanding = resolveSessionPrincipalLandingContext({
        sessionUserId: session.userId,
        contractValue: session.principalLanding || sessionCookie.principalLanding || null,
      });
      const accountId =
        session.userId ||
        sessionCookie.userId ||
        (principalLanding.restoreSource === "contract_legacy_account" ? principalLanding.contract?.legacyAccountId || null : null);
      const account = await resolveAccountForViewer({
        accountId,
        accountCookie: accountCookie || null,
        surface,
        includeHeldAccount,
      });
      return {
        session,
        account,
        legacyAccount: account,
        principal: toViewerPrincipal(account),
        principalLanding,
      };
    }

    if (rawSessionValue) {
      const session = await findSessionById(rawSessionValue);
      if (session) {
        // Same rule on the legacy raw-cookie path: reading a session must not rewrite it.
        const touchedSession = session;
        // `accountCookie: null` on purpose — this legacy path has never had a cookie fallback, and
        // adding one here would widen the very surface the rest of this change narrows.
        const account = await resolveAccountForViewer({
          accountId: touchedSession.userId,
          accountCookie: null,
          surface,
          includeHeldAccount,
        });
        return {
          session: touchedSession,
          account,
          legacyAccount: account,
          principal: toViewerPrincipal(account),
          principalLanding: resolveSessionPrincipalLandingContext({
            sessionUserId: touchedSession.userId,
            contractValue: touchedSession.principalLanding,
          }),
        };
      }
    }

    // NO SESSION AT ALL — the account cookie alone. This path used to return the decrypted cookie
    // as the viewer's account without ever asking the store whether that account still existed, so
    // an erased identity kept authenticating here for as long as the 180-day cookie lived.
    const unlockedAccountCookie = await resolveAccountForViewer({
      accountId: accountCookie?.id || null,
      accountCookie: accountCookie || null,
      surface,
      includeHeldAccount,
    });
    return {
      session: null,
      account: unlockedAccountCookie,
      legacyAccount: unlockedAccountCookie,
      principal: toViewerPrincipal(unlockedAccountCookie),
      principalLanding: {
        contract: null,
        contractStatus: "absent",
        restoreSource: "none",
      },
    };
  } catch (error) {
    console.error("viewer context resolution error:", error);
    // Fail closed to an anonymous viewer if cookie/session lookup or store reads fail.
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
}

/**
 * POR-1 WS5 — viewer resolution for the account-deletion surfaces.
 *
 * Differs from `getViewerContext()` in exactly two ways, both narrow and both deliberate:
 *
 *   • a HELD account still resolves, so a person can inspect and cancel the deletion they asked for;
 *   • while the job is genuinely in flight, the cookie may name an account whose record has ALREADY
 *     been erased — the `identity_erasure`/`verifying` window, where the durable job is the only
 *     thing left that can speak for the person.
 *
 * Neither concession outlives the job. The moment it completes, the durable record says so — by
 * fingerprint, about an account it no longer names — and this resolver returns nothing, on this
 * surface and every other. Nothing but the deletion request, confirm, status and cancel paths may
 * use it: everywhere else, a hold means the session cannot act.
 */
export async function getDeletionSurfaceViewerContext(): Promise<ViewerContext> {
  return getViewerContext({ includeHeldAccount: true });
}

export async function ensureViewerSession() {
  const viewer = await getViewerContext();
  if (viewer.session) {
    return viewer.session;
  }
  const accountId = viewer.account?.id || null;
  if (!accountId) return createSession(null, null);
  return withAccountMutationLease({
    accountId,
    operation: "session_account_binding",
    execute: (context) => createSession(context, accountId),
  });
}

export async function bindSessionToUser(
  sessionId: string,
  userId: string,
  options?: {
    legacyAccount?: AccountRecord | null;
    source?: SessionPrincipalLanding["source"];
  },
) {
  const contract = await buildSessionPrincipalLandingContract({
    legacyAccount: options?.legacyAccount || (await findAccountById(userId)),
    source: options?.source || "session_upgrade",
  });
  // The whole read-transform-write window, including the consultation rebind: an account-linked
  // activity rebind that landed after an erasure would re-point erased rows at a deleted person.
  const session = await withAccountMutationLease({
    accountId: userId,
    operation: "session_account_binding",
    execute: async (context) => {
      const bound = await touchSession(context, sessionId, userId, contract || undefined);
      await assignSessionConsultationsToUser(sessionId, userId);
      return bound;
    },
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

  // POR-1 — the cookie-restore path writes the account record, so it takes a lease like any other
  // ordinary mutation. Without one it is a ready-made resurrection: a browser holding a stale
  // account cookie could write it back after an erasure.
  await withAccountMutationLease({
    accountId: account.id,
    operation: "identity_mirror_sync",
    execute: (context) => upsertAccountRecord(context, account),
  });
  return account;
}

export function resolveSupportWorkspaceViewerLookup(viewer: ViewerContext) {
  const legacyAccount = viewer.legacyAccount || viewer.account;

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
    } as const;
  }

  const principalCandidates = [
    viewer.principal?.legacyAccountId || null,
    viewer.principal?.userProfileId || null,
  ].filter((entry): entry is string => Boolean(entry));
  const principalMatched = principalCandidates.includes(legacyAccount.id);

  return {
    effectiveLegacyAccountId: legacyAccount.id,
    supportReadTargetUserProfileId: principalMatched && viewer.principal?.userProfileId ? viewer.principal.userProfileId : legacyAccount.id,
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
  const authenticatedViewer =
    viewer.session && (viewer.account || viewer.legacyAccount)
      ? {
          ...viewer,
          account: viewer.account,
          legacyAccount: viewer.legacyAccount || viewer.account,
        }
      : {
          ...viewer,
          account: null,
          legacyAccount: null,
          principal: null,
        };
  const viewerLookup = resolveSupportWorkspaceViewerLookup(authenticatedViewer);
  const account =
    authenticatedViewer.account &&
    authenticatedViewer.account.lineUserId &&
    authenticatedViewer.account.supportProfile.lineBindingStatus !== "connected"
      ? {
          ...authenticatedViewer.account,
          supportProfile: {
            ...authenticatedViewer.account.supportProfile,
            lineBindingStatus: "connected" as const,
          },
        }
      : authenticatedViewer.account;
  const consultations = await listConsultationsForViewer({
    userId: viewerLookup.effectiveLegacyAccountId,
    sessionId: authenticatedViewer.session?.id || null,
    locale,
  });
  const latestLineEvent = account ? await getLatestLineWebhookEventForAccount(account.id) : null;
  const supportSource = account ? "compatibility_mirror" : "unresolved";

  return {
    ...authenticatedViewer,
    supportProfile: account?.supportProfile || null,
    supportReadModelSource: supportSource,
    supportDiagnostics: composeSupportDiagnosticsViewModel({
      hasPrincipal: viewerLookup.hasAuthenticatedViewer,
      principalMatched: viewerLookup.principalMatched,
      principalId: authenticatedViewer.principal?.userProfileId || null,
      legacyAccountId: viewerLookup.effectiveLegacyAccountId,
      activeWriteTargetId: viewerLookup.principalMatched
        ? authenticatedViewer.principal?.userProfileId || null
        : viewerLookup.effectiveLegacyAccountId,
      lineBindingStatus: account?.supportProfile.lineBindingStatus || "not_connected",
      lineBindingStatusSource: supportSource,
      supportProfileSource: supportSource,
      preferencesStorageSource: supportSource,
      readFallbackActive: Boolean(account),
    }),
    consultations,
    latestLineEvent,
    accessAccountability: composeAccessAccountabilityViewModel({
      accessType: "support_self_view",
      latestConsent: null,
    }),
  };
}

export type SupportWorkspaceData = Awaited<ReturnType<typeof getSupportWorkspaceData>>;
