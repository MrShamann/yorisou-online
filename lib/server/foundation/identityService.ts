import { default as assert } from "assert";

import { createAuthIdentityId, getEmailIdentityHint, getLineIdentityHint } from "@/lib/server/midBackend/utils";
import { createFoundationId, createDeterministicPlaceholderEmail, createHashedKey, isPlaceholderEmail, nowIso } from "@/lib/server/foundation/ids";
import {
  foundationAuthIdentityRepository,
  foundationConversationRepository,
  foundationMessageEventRepository,
  foundationSupportCaseRepository,
  foundationUserProfileRepository,
} from "@/lib/server/foundation/repositories";
import type { AuthIdentity, BindingState, Source, UserProfile } from "@/lib/server/foundation/schema";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import {
  withAccountMutationLease,
  withAccountProvisioningLease,
} from "@/lib/server/accountMutationLease";
import type { AccountWriteContext } from "@/lib/server/accountWriteContext";
import {
  defaultSupportProfile,
  findAccountById,
  findAccountByLineUserId,
  listAccounts,
  type AccountRecord,
  type SupportProfile,
  updateSupportProfile,
  upsertAccountRecord,
} from "@/lib/server/yorisouData";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function makeChannelExternalIdentityKey(input: { channel: "support_web" | "line"; subjectKey: string }) {
  return `${input.channel}:${input.subjectKey}`;
}

function buildUserProfileFromAccount(account: AccountRecord, source: Source): UserProfile {
  return {
    userProfileId: account.id,
    legacyAccountId: account.id,
    profileStatus: "active",
    bindingState: "bound",
    source,
    channel: account.lineUserId ? "line" : "email",
    profile: {
      displayName: account.name,
      primaryLocale: null,
      city: account.city,
      role: account.role,
      lineDisplayName: account.supportProfile.lineDisplayName || "",
      lineNotificationsEnabled: account.supportProfile.lineNotificationsEnabled,
    },
    sensitiveProfile: {
      familyContactName: account.supportProfile.familyContactName || "",
      familyContactRelation: account.supportProfile.familyContactRelation || "",
      familyContactMethod: account.supportProfile.familyContactMethod || "",
      familyContactValue: account.supportProfile.familyContactValue || "",
      familyShareNote: account.supportProfile.familyShareNote || "",
    },
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export function buildSupportProfileFromCanonicalProfile(
  profile: UserProfile,
  fallbackAccount: AccountRecord | null,
): SupportProfile {
  return {
    ...(fallbackAccount?.supportProfile || defaultSupportProfile()),
    lineDisplayName: profile.profile.lineDisplayName,
    lineNotificationsEnabled: profile.profile.lineNotificationsEnabled,
    familyContactName: profile.sensitiveProfile.familyContactName,
    familyContactRelation: profile.sensitiveProfile.familyContactRelation,
    familyContactMethod: profile.sensitiveProfile.familyContactMethod,
    familyContactValue: profile.sensitiveProfile.familyContactValue,
    familyShareNote: profile.sensitiveProfile.familyShareNote,
  };
}

function buildEmailIdentity(account: AccountRecord, source: Source): AuthIdentity {
  const emailNormalized = normalizeEmail(account.email);

  return {
    authIdentityId: createAuthIdentityId("email_password", emailNormalized),
    identityType: "email_password",
    identityStatus: "active",
    bindingState: "bound",
    userProfileId: account.id,
    legacyAccountId: account.id,
    identityKeyHash: createHashedKey(`email_password:${emailNormalized}`),
    identityKeyHint: getEmailIdentityHint(emailNormalized),
    externalIdentityKey: `email:${emailNormalized}`,
    externalIdentityKeyHint: getEmailIdentityHint(emailNormalized),
    emailNormalized,
    passwordHashPresent: Boolean(account.passwordHash),
    lineUserId: null,
    lineIdTokenSubject: null,
    linePictureUrl: null,
    lineConnectedAt: null,
    firstSeenAt: account.createdAt,
    lastSeenAt: account.updatedAt,
    lastBoundAt: account.createdAt,
    source,
    channel: "email",
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

function buildLineIdentity(input: {
  userProfileId: string | null;
  legacyAccountId: string | null;
  lineUserId: string;
  lineDisplayName: string;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
  source: Source;
  bindingState: BindingState;
  createdAt?: string;
  identityStatus?: AuthIdentity["identityStatus"];
}) {
  const timestamp = input.createdAt || nowIso();

  return {
    authIdentityId: createAuthIdentityId("line", input.lineUserId),
    identityType: "line" as const,
    identityStatus: input.identityStatus || (input.userProfileId ? "active" : "unbound"),
    bindingState: input.bindingState,
    userProfileId: input.userProfileId,
    legacyAccountId: input.legacyAccountId,
    identityKeyHash: createHashedKey(`line:${input.lineUserId}`),
    identityKeyHint: getLineIdentityHint(input.lineUserId),
    externalIdentityKey: `line:${input.lineUserId}`,
    externalIdentityKeyHint: getLineIdentityHint(input.lineUserId),
    emailNormalized: null,
    passwordHashPresent: false,
    lineUserId: input.lineUserId,
    lineIdTokenSubject: input.lineIdTokenSubject || input.lineUserId,
    linePictureUrl: input.linePictureUrl || null,
    lineConnectedAt: input.userProfileId ? timestamp : null,
    firstSeenAt: timestamp,
    lastSeenAt: timestamp,
    lastBoundAt: input.userProfileId ? timestamp : null,
    source: input.source,
    channel: "line",
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies AuthIdentity;
}

function updateIdentityBoundFields(identity: AuthIdentity, input: {
  userProfileId: string | null;
  legacyAccountId: string | null;
  source: Source;
  bindingState: BindingState;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
}) {
  const updatedAt = nowIso();
  return {
    ...identity,
    userProfileId: input.userProfileId,
    legacyAccountId: input.legacyAccountId,
    identityStatus: input.userProfileId ? "active" : "unbound",
    bindingState: input.bindingState,
    linePictureUrl: input.linePictureUrl || identity.linePictureUrl,
    lineIdTokenSubject: input.lineIdTokenSubject || identity.lineIdTokenSubject,
    lineConnectedAt: input.userProfileId ? identity.lineConnectedAt || updatedAt : identity.lineConnectedAt,
    lastSeenAt: updatedAt,
    lastBoundAt: input.userProfileId ? updatedAt : identity.lastBoundAt,
    source: input.source,
    updatedAt,
  } satisfies AuthIdentity;
}

function buildLineOnlyAccount(input: {
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  lineIdTokenSubject?: string;
}) {
  const createdAt = nowIso();
  const accountId = createFoundationId("uprofile");
  return {
    id: accountId,
    name: input.displayName || "LINE user",
    email: createDeterministicPlaceholderEmail(input.lineUserId),
    passwordHash: "",
    city: "",
    role: "family" as const,
    createdAt,
    updatedAt: createdAt,
    lineUserId: input.lineUserId,
    lineConnectedAt: createdAt,
    linePictureUrl: input.pictureUrl || "",
    lineIdTokenSubject: input.lineIdTokenSubject || input.lineUserId,
    supportProfile: {
      ...defaultSupportProfile(),
      lineBindingStatus: "connected",
      lineDisplayName: input.displayName || "",
    },
  } satisfies AccountRecord;
}

export class IdentityFoundationService {
  async getUserProfileById(userProfileId: string) {
    return foundationUserProfileRepository.getById(userProfileId);
  }

  async getUserProfileByLegacyAccountId(legacyAccountId: string) {
    return foundationUserProfileRepository.getByLegacyAccountId(legacyAccountId);
  }

  async getAuthIdentityById(authIdentityId: string) {
    return foundationAuthIdentityRepository.getById(authIdentityId);
  }

  async getAuthIdentityByEmail(email: string) {
    return foundationAuthIdentityRepository.getByEmail(normalizeEmail(email));
  }

  async getAuthIdentityByLineUserId(lineUserId: string) {
    return foundationAuthIdentityRepository.getByLineUserId(lineUserId);
  }

  async getAuthIdentitiesByUserProfileId(userProfileId: string) {
    return foundationAuthIdentityRepository.listByUserProfileId(userProfileId);
  }

  async getUserByEmailIdentity(email: string) {
    const identity = await this.getAuthIdentityByEmail(email);
    const userProfile = identity?.userProfileId ? await this.getUserProfileById(identity.userProfileId) : null;

    return {
      identity,
      userProfile,
      bindingState: identity?.userProfileId ? "bound" : "unbound",
    } as const;
  }

  async getUserByLineProviderSubject(lineUserId: string) {
    const identity = await this.getAuthIdentityByLineUserId(lineUserId);
    const userProfile = identity?.userProfileId ? await this.getUserProfileById(identity.userProfileId) : null;

    return {
      identity,
      userProfile,
      bindingState: identity?.userProfileId ? "bound" : "unbound",
    } as const;
  }

  async getUnboundLineSubject(lineUserId: string) {
    const identity = await this.getAuthIdentityByLineUserId(lineUserId);

    if (!identity || identity.userProfileId) {
      return null;
    }

    const [conversations, events, supportCases] = await Promise.all([
      foundationConversationRepository.listByAuthIdentityId(identity.authIdentityId),
      foundationMessageEventRepository.listByAuthIdentityId(identity.authIdentityId),
      foundationSupportCaseRepository.listUnboundByAuthIdentityId(identity.authIdentityId),
    ]);

    return {
      identity,
      conversations,
      events,
      supportCases,
    } as const;
  }

  async getUnboundSupportSubject(sessionId: string) {
    const externalIdentityKey = makeChannelExternalIdentityKey({
      channel: "support_web",
      subjectKey: `session:${sessionId}`,
    });
    const [conversations, events] = await Promise.all([
      foundationConversationRepository.listUnboundByExternalIdentityKey(externalIdentityKey),
      foundationMessageEventRepository.listUnboundByExternalIdentityKey(externalIdentityKey),
    ]);
    const conversationIds = new Set(conversations.map((entry) => entry.conversationId));
    const allCases = await foundationSupportCaseRepository.list();
    const supportCases = allCases.filter((entry) => entry.conversationId && conversationIds.has(entry.conversationId));

    if (!conversations.length && !events.length && !supportCases.length) {
      return null;
    }

    return {
      externalIdentityKey,
      conversations,
      events,
      supportCases,
    } as const;
  }

  /**
   * POR-1 — the canonical identity mirror, written as ONE fenced window.
   *
   * This writes the UserProfile and BOTH AuthIdentities, which together are the email and LINE login
   * routes. Previously it took no lease at all, so a request that had read an account before a
   * deletion started could re-create the person's entire canonical identity after erasure — the
   * account record would be gone and they could still log in.
   *
   * `context` is optional so a caller already inside a window (LINE primary provisioning, the support
   * profile update) extends its own lease across this rather than opening a second one. Two nested
   * leases would both be drained correctly, but the window would be two windows, and the gap between
   * them is exactly what the fence is for.
   */
  async ensureCanonicalUserForAccount(
    account: AccountRecord,
    source: Source = "email_password",
    context?: AccountWriteContext,
  ) {
    const run = (ctx: AccountWriteContext) => this.ensureCanonicalUserUnderContext(ctx, account, source);
    if (context) return run(context);
    return withAccountMutationLease({
      accountId: account.id,
      operation: "foundation_identity_binding",
      execute: run,
    });
  }

  private async ensureCanonicalUserUnderContext(
    context: AccountWriteContext,
    account: AccountRecord,
    source: Source,
  ) {
    const profile = buildUserProfileFromAccount(account, source);
    await foundationUserProfileRepository.save(context, profile);

    if (account.email) {
      const emailIdentity = buildEmailIdentity(account, source);
      if (isPlaceholderEmail(account.email)) {
        await foundationAuthIdentityRepository.delete(emailIdentity.authIdentityId);
      } else {
        await foundationAuthIdentityRepository.save(context, emailIdentity);
      }
    }

    if (account.lineUserId) {
      const existingLineIdentity = await this.getAuthIdentityByLineUserId(account.lineUserId);
      const lineIdentity = existingLineIdentity
        ? updateIdentityBoundFields(existingLineIdentity, {
            userProfileId: account.id,
            legacyAccountId: account.id,
            source: "line_login",
            bindingState: "bound",
            linePictureUrl: account.linePictureUrl,
            lineIdTokenSubject: account.lineIdTokenSubject,
          })
        : buildLineIdentity({
            userProfileId: account.id,
            legacyAccountId: account.id,
            lineUserId: account.lineUserId,
            lineDisplayName: account.supportProfile.lineDisplayName || account.name,
            linePictureUrl: account.linePictureUrl,
            lineIdTokenSubject: account.lineIdTokenSubject,
            source: "line_login",
            bindingState: "bound",
            createdAt: account.lineConnectedAt || account.createdAt,
          });

      await foundationAuthIdentityRepository.save(context, lineIdentity);
    }

    return profile;
  }

  /**
   * POR-1 — the support-profile update, as ONE window.
   *
   * This was the clearest example of a lease that did not span its own write: the foundation save
   * happened first, unfenced, and only the legacy compatibility update took a lease. So a deletion
   * could land between them and the foundation half would be written back afterwards — one lease,
   * two windows, and the gap is where the stale write goes.
   *
   * The lease is now taken BEFORE the read and held across both writes.
   */
  async updateCanonicalSupportProfile(input: {
    userProfileId: string;
    patch: Partial<SupportProfile>;
    fallbackAccount?: AccountRecord | null;
  }) {
    // Resolve the account the window belongs to before opening it: a lease is taken on an account id,
    // and for a canonical profile that is the legacy account it mirrors.
    const preview = await this.getUserProfileById(input.userProfileId);
    if (!preview) {
      return { ok: false as const, reason: "profile_not_found" as const };
    }
    const leaseAccountId = preview.legacyAccountId || input.userProfileId;

    return withAccountMutationLease({
      accountId: leaseAccountId,
      operation: "foundation_profile_update",
      execute: (context) => this.updateCanonicalSupportProfileUnderContext(context, input),
    });
  }

  private async updateCanonicalSupportProfileUnderContext(
    context: AccountWriteContext,
    input: {
      userProfileId: string;
      patch: Partial<SupportProfile>;
      fallbackAccount?: AccountRecord | null;
    },
  ) {
    // Re-read INSIDE the window. The preview read above happened before the lease existed, so acting
    // on it would reintroduce the very read-before-fence this window exists to eliminate.
    const profile = await this.getUserProfileById(input.userProfileId);

    if (!profile) {
      return { ok: false as const, reason: "profile_not_found" as const };
    }

    const updatedProfile: UserProfile = {
      ...profile,
      profile: {
        ...profile.profile,
        lineNotificationsEnabled:
          input.patch.lineNotificationsEnabled === undefined
            ? profile.profile.lineNotificationsEnabled
            : input.patch.lineNotificationsEnabled,
      },
      sensitiveProfile: {
        ...profile.sensitiveProfile,
        familyContactName:
          input.patch.familyContactName === undefined
            ? profile.sensitiveProfile.familyContactName
            : input.patch.familyContactName || "",
        familyContactRelation:
          input.patch.familyContactRelation === undefined
            ? profile.sensitiveProfile.familyContactRelation
            : input.patch.familyContactRelation || "",
        familyContactMethod:
          input.patch.familyContactMethod === undefined
            ? profile.sensitiveProfile.familyContactMethod
            : input.patch.familyContactMethod || "",
        familyContactValue:
          input.patch.familyContactValue === undefined
            ? profile.sensitiveProfile.familyContactValue
            : input.patch.familyContactValue || "",
        familyShareNote:
          input.patch.familyShareNote === undefined ? profile.sensitiveProfile.familyShareNote : input.patch.familyShareNote || "",
      },
      updatedAt: nowIso(),
    };

    await foundationUserProfileRepository.save(context, updatedProfile);

    const compatibilityAccount = updatedProfile.legacyAccountId
      ? await updateSupportProfile(
          updatedProfile.legacyAccountId,
          buildSupportProfileFromCanonicalProfile(updatedProfile, input.fallbackAccount || null),
          context,
        )
      : null;

    return {
      ok: true as const,
      userProfile: updatedProfile,
      compatibilityAccount,
      supportProfile: buildSupportProfileFromCanonicalProfile(updatedProfile, compatibilityAccount || input.fallbackAccount || null),
    };
  }

  async ensureUnboundLineIdentity(input: {
    lineUserId: string;
    lineDisplayName?: string;
    linePictureUrl?: string;
    lineIdTokenSubject?: string;
    source?: Source;
  }) {
    const existing = await this.getAuthIdentityByLineUserId(input.lineUserId);

    if (existing) {
      const updated = {
        ...existing,
        linePictureUrl: input.linePictureUrl || existing.linePictureUrl,
        lineIdTokenSubject: input.lineIdTokenSubject || existing.lineIdTokenSubject,
        lastSeenAt: nowIso(),
        updatedAt: nowIso(),
      } satisfies AuthIdentity;
      // Unbound: this identity names no account, so there is no account for a deletion to race with.
      await foundationAuthIdentityRepository.save(null, updated);
      return updated;
    }

    const identity = buildLineIdentity({
      userProfileId: null,
      legacyAccountId: null,
      lineUserId: input.lineUserId,
      lineDisplayName: input.lineDisplayName || "",
      linePictureUrl: input.linePictureUrl,
      lineIdTokenSubject: input.lineIdTokenSubject,
      source: input.source || "line_webhook",
      bindingState: "unbound",
    });

    await foundationAuthIdentityRepository.save(null, identity);
    return identity;
  }

  /**
   * POR-1 — LINE binding, as one fenced window.
   *
   * The window has to cover the ACTIVITY REBIND as well as the identity save. A rebind that landed
   * after an erasure would re-point conversations and events at a profile that no longer exists, and
   * an account-linked activity rebind is an account-linked write however far down the call it sits.
   */
  async bindLineIdentityToUserProfile(
    input: {
      userProfileId: string;
      lineUserId: string;
      lineDisplayName: string;
      linePictureUrl?: string;
      lineIdTokenSubject?: string;
      source: Source;
      actorUserProfileId: string | null;
    },
    context?: AccountWriteContext,
  ) {
    const preview = await this.getUserProfileById(input.userProfileId);
    if (!preview) {
      return { ok: false as const, reason: "missing_user_profile" as const };
    }
    const run = (ctx: AccountWriteContext) => this.bindLineIdentityUnderContext(ctx, input);
    if (context) return run(context);
    return withAccountMutationLease({
      accountId: preview.legacyAccountId || input.userProfileId,
      operation: "foundation_identity_binding",
      execute: run,
    });
  }

  private async bindLineIdentityUnderContext(
    context: AccountWriteContext,
    input: {
      userProfileId: string;
      lineUserId: string;
      lineDisplayName: string;
      linePictureUrl?: string;
      lineIdTokenSubject?: string;
      source: Source;
      actorUserProfileId: string | null;
    },
  ) {
    // Re-read inside the window; the resolution read above predates the lease.
    const userProfile = await this.getUserProfileById(input.userProfileId);

    if (!userProfile) {
      return { ok: false as const, reason: "missing_user_profile" as const };
    }

    const existing = await this.getAuthIdentityByLineUserId(input.lineUserId);

    if (existing?.userProfileId && existing.userProfileId !== input.userProfileId) {
      return { ok: false as const, reason: "identity_conflict" as const };
    }

    const otherActiveLineIdentity = (await this.getAuthIdentitiesByUserProfileId(input.userProfileId)).find(
      (entry) => entry.identityType === "line" && entry.lineUserId && entry.lineUserId !== input.lineUserId && entry.identityStatus === "active",
    );

    if (otherActiveLineIdentity) {
      return { ok: false as const, reason: "line_already_bound_elsewhere" as const };
    }

    const legacyAccountId = userProfile.legacyAccountId || input.userProfileId;
    const identity = existing
      ? updateIdentityBoundFields(existing, {
          userProfileId: input.userProfileId,
          legacyAccountId,
          source: input.source,
          bindingState: "bound",
          linePictureUrl: input.linePictureUrl,
          lineIdTokenSubject: input.lineIdTokenSubject,
        })
      : buildLineIdentity({
          userProfileId: input.userProfileId,
          legacyAccountId,
          lineUserId: input.lineUserId,
          lineDisplayName: input.lineDisplayName,
          linePictureUrl: input.linePictureUrl,
          lineIdTokenSubject: input.lineIdTokenSubject,
          source: input.source,
          bindingState: "bound",
    });

    await foundationAuthIdentityRepository.save(context, identity);
    await this.rebindUnboundActivity({
      authIdentityId: identity.authIdentityId,
      userProfileId: input.userProfileId,
      actorUserProfileId: input.actorUserProfileId,
      actorAuthIdentityId: identity.authIdentityId,
      source: input.source,
      channel: "line",
      preserveExternalIdentityKey: true,
      summary: "Bound LINE identity and reattached prior unbound activity",
    });
    await privacyAuditService.recordConsent({
      userProfileId: input.userProfileId,
      authIdentityId: identity.authIdentityId,
      consentType: "line_identity_binding",
      channel: "line",
      source: input.source,
      bindingState: "bound",
      metadata: {
        lineUserIdHint: getLineIdentityHint(input.lineUserId),
      },
    });
    await privacyAuditService.recordAudit({
      actorType: input.actorUserProfileId ? "user" : "system",
      actorUserProfileId: input.actorUserProfileId,
      actorAuthIdentityId: identity.authIdentityId,
      action: "identity.bind",
      resourceType: "auth_identity",
      resourceId: identity.authIdentityId,
      channel: "line",
      source: input.source,
      bindingState: "bound",
      summary: "Bound LINE identity to user profile",
      metadata: {
        userProfileId: input.userProfileId,
      },
    });

    return { ok: true as const, identity };
  }

  /**
   * POR-1 — LINE primary provisioning, as one fenced window per branch.
   *
   * Three outcomes, and all three write. Two of them RESOLVE an existing account and re-assert its
   * canonical mirror, so they are ordinary mutations on that account. The third CREATES one, so it is
   * provisioning. Each branch opens its own window on the id it is actually writing — a single
   * up-front lease is impossible here, because in the creating branch the id does not exist until the
   * account is built.
   */
  async resolveOrCreateLinePrimaryUser(input: {
    lineUserId: string;
    lineDisplayName: string;
    linePictureUrl?: string;
    lineIdTokenSubject?: string;
    locale: "ja" | "en";
  }) {
    const existingLegacyAccount = await findAccountByLineUserId(input.lineUserId);

    if (existingLegacyAccount) {
      await withAccountMutationLease({
        accountId: existingLegacyAccount.id,
        operation: "line_primary_provisioning",
        execute: (context) =>
          this.ensureCanonicalUserForAccount(existingLegacyAccount, "line_login", context),
      });
      return { account: existingLegacyAccount, created: false as const };
    }

    const existingIdentity = await this.getAuthIdentityByLineUserId(input.lineUserId);

    if (existingIdentity?.userProfileId) {
      const existingAccount = await findAccountById(existingIdentity.userProfileId);

      if (existingAccount) {
        await withAccountMutationLease({
          accountId: existingAccount.id,
          operation: "line_primary_provisioning",
          execute: (context) =>
            this.ensureCanonicalUserForAccount(existingAccount, "line_login", context),
        });
        return { account: existingAccount, created: false as const };
      }
    }

    const newAccount = buildLineOnlyAccount({
      lineUserId: input.lineUserId,
      displayName: input.lineDisplayName,
      pictureUrl: input.linePictureUrl,
      lineIdTokenSubject: input.lineIdTokenSubject,
    });
    const bindResult = await withAccountProvisioningLease({
      accountId: newAccount.id,
      operation: "line_primary_provisioning",
      execute: async (context) => {
        // One window: the account record, the canonical mirror and the LINE binding. Split across
        // three, a deletion landing between them would leave a half-built identity that can log in.
        await upsertAccountRecord(context, newAccount);
        await this.ensureCanonicalUserForAccount(newAccount, "line_login", context);
        return this.bindLineIdentityToUserProfile(
          {
            userProfileId: newAccount.id,
            lineUserId: input.lineUserId,
            lineDisplayName: input.lineDisplayName,
            linePictureUrl: input.linePictureUrl,
            lineIdTokenSubject: input.lineIdTokenSubject,
            source: "line_login",
            actorUserProfileId: newAccount.id,
          },
          context,
        );
      },
    });

    assert(bindResult.ok, "line primary user bind should succeed");
    await privacyAuditService.recordConsent({
      userProfileId: newAccount.id,
      authIdentityId: bindResult.identity.authIdentityId,
      consentType: "line_primary_login",
      channel: "line",
      source: "line_login",
      bindingState: "bound",
      metadata: {
        locale: input.locale,
      },
    });
    await privacyAuditService.recordAudit({
      actorType: "user",
      actorUserProfileId: newAccount.id,
      actorAuthIdentityId: bindResult.identity.authIdentityId,
      action: "identity.line_primary_login",
      resourceType: "user_profile",
      resourceId: newAccount.id,
      channel: "line",
      source: "line_login",
      bindingState: "bound",
      summary: "Created line-primary user profile",
      metadata: {
        locale: input.locale,
      },
    });

    return { account: newAccount, created: true as const };
  }

  async resolveDeterministicLinePrimaryUser(input: {
    lineUserId: string;
    lineDisplayName: string;
    linePictureUrl?: string;
    lineIdTokenSubject?: string;
    locale: "ja" | "en";
  }) {
    const resolved = await this.resolveOrCreateLinePrimaryUser(input);
    const [profile, identity] = await Promise.all([
      this.getUserProfileByLegacyAccountId(resolved.account.id),
      this.getAuthIdentityByLineUserId(input.lineUserId),
    ]);

    if (!profile) {
      return {
        ok: false as const,
        reason: "missing_user_profile" as const,
      };
    }

    if (!identity || identity.userProfileId !== profile.userProfileId || identity.legacyAccountId !== resolved.account.id) {
      return {
        ok: false as const,
        reason: "missing_line_identity" as const,
      };
    }

    return {
      ok: true as const,
      account: resolved.account,
      created: resolved.created,
      profile,
      identity,
    };
  }

  async attachEmailIdentityToUserProfile(input: {
    userProfileId: string;
    email: string;
    passwordHashPresent: boolean;
    source: Source;
    actorUserProfileId: string | null;
  }) {
    const emailNormalized = normalizeEmail(input.email);
    const existingEmail = await this.getAuthIdentityByEmail(emailNormalized);

    if (existingEmail?.userProfileId && existingEmail.userProfileId !== input.userProfileId) {
      return { ok: false as const, reason: "identity_conflict" as const };
    }

    const userProfile = await this.getUserProfileById(input.userProfileId);

    if (!userProfile) {
      return { ok: false as const, reason: "missing_user_profile" as const };
    }

    if (
      existingEmail &&
      existingEmail.userProfileId === input.userProfileId &&
      existingEmail.passwordHashPresent === input.passwordHashPresent &&
      existingEmail.identityStatus === "active"
    ) {
      const updatedIdentity = {
        ...existingEmail,
        lastSeenAt: nowIso(),
        updatedAt: nowIso(),
      } satisfies AuthIdentity;
      await withAccountMutationLease({
        accountId: updatedIdentity.legacyAccountId || updatedIdentity.userProfileId || input.userProfileId,
        operation: "foundation_identity_binding",
        execute: (context) => foundationAuthIdentityRepository.save(context, updatedIdentity),
      });
      return { ok: true as const, identity: updatedIdentity };
    }

    const identity: AuthIdentity = {
      authIdentityId: createAuthIdentityId("email_password", emailNormalized),
      identityType: "email_password",
      identityStatus: "active",
      bindingState: "bound",
      userProfileId: input.userProfileId,
      legacyAccountId: userProfile.legacyAccountId,
      identityKeyHash: createHashedKey(`email_password:${emailNormalized}`),
      identityKeyHint: getEmailIdentityHint(emailNormalized),
      externalIdentityKey: `email:${emailNormalized}`,
      externalIdentityKeyHint: getEmailIdentityHint(emailNormalized),
      emailNormalized,
      passwordHashPresent: input.passwordHashPresent,
      lineUserId: null,
      lineIdTokenSubject: null,
      linePictureUrl: null,
      lineConnectedAt: null,
      firstSeenAt: existingEmail?.firstSeenAt || nowIso(),
      lastSeenAt: nowIso(),
      lastBoundAt: nowIso(),
      source: input.source,
      channel: "email",
      createdAt: existingEmail?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };

    // The email identity IS the email login route, and the rebind re-points prior activity at this
    // profile. Both belong inside one window for the same reason the LINE bind does.
    await withAccountMutationLease({
      accountId: identity.legacyAccountId || input.userProfileId,
      operation: "foundation_identity_binding",
      execute: async (context) => {
        await foundationAuthIdentityRepository.save(context, identity);
        await this.rebindUnboundActivity({
          authIdentityId: identity.authIdentityId,
          userProfileId: input.userProfileId,
          actorUserProfileId: input.actorUserProfileId,
          actorAuthIdentityId: identity.authIdentityId,
          source: input.source,
          channel: "email",
          preserveExternalIdentityKey: true,
          summary: "Attached email identity and reattached prior unbound activity",
        });
      },
    });
    // Consent and audit records are append-only and name no login route, so they sit outside the
    // window: holding a lease across them would widen it for no protection.
    await privacyAuditService.recordConsent({
      userProfileId: input.userProfileId,
      authIdentityId: identity.authIdentityId,
      consentType: "email_identity_attachment",
      channel: "email",
      source: input.source,
      bindingState: "bound",
      metadata: {
        emailHint: getEmailIdentityHint(emailNormalized),
      },
    });
    await privacyAuditService.recordAudit({
      actorType: input.actorUserProfileId ? "user" : "system",
      actorUserProfileId: input.actorUserProfileId,
      actorAuthIdentityId: identity.authIdentityId,
      action: "identity.email_attach",
      resourceType: "auth_identity",
      resourceId: identity.authIdentityId,
      channel: "email",
      source: input.source,
      bindingState: "bound",
      summary: "Attached email identity to user profile",
      metadata: {
        userProfileId: input.userProfileId,
      },
    });

    return { ok: true as const, identity };
  }

  async ensureEmailIdentityForLogin(account: AccountRecord) {
    const profile = await this.ensureCanonicalUserForAccount(account, "email_password");
    const identity = await this.attachEmailIdentityToUserProfile({
      userProfileId: profile.userProfileId,
      email: account.email,
      passwordHashPresent: Boolean(account.passwordHash),
      source: "email_password",
      actorUserProfileId: account.id,
    });

    return { profile, identity };
  }

  async ensureDeterministicEmailPrincipalForAccount(account: AccountRecord) {
    const ensured = await this.ensureEmailIdentityForLogin(account);

    if (!ensured.identity.ok) {
      return {
        ok: false as const,
        reason: ensured.identity.reason,
      };
    }

    const [resolvedProfile, resolvedIdentity] = await Promise.all([
      this.getUserProfileByLegacyAccountId(account.id),
      this.getAuthIdentityByEmail(account.email),
    ]);

    if (!resolvedProfile) {
      return {
        ok: false as const,
        reason: "missing_user_profile" as const,
      };
    }

    if (!resolvedIdentity || resolvedIdentity.userProfileId !== resolvedProfile.userProfileId) {
      return {
        ok: false as const,
        reason: "missing_email_identity" as const,
      };
    }

    return {
      ok: true as const,
      profile: resolvedProfile,
      identity: resolvedIdentity,
    };
  }

  async ensureDeterministicPrincipalForLegacyAccount(account: AccountRecord, source: Source = "system") {
    const profile = await this.ensureCanonicalUserForAccount(account, source);
    const resolvedProfile = await this.getUserProfileByLegacyAccountId(account.id);

    if (!resolvedProfile || resolvedProfile.userProfileId !== profile.userProfileId) {
      return {
        ok: false as const,
        reason: "missing_user_profile" as const,
      };
    }

    return {
      ok: true as const,
      profile: resolvedProfile,
    };
  }

  async attachSupportSessionToUserProfile(input: {
    sessionId: string;
    userProfileId: string;
    authIdentityId: string | null;
    actorUserProfileId: string | null;
    actorAuthIdentityId: string | null;
    source: Source;
  }) {
    return this.rebindUnboundActivity({
      externalIdentityKey: makeChannelExternalIdentityKey({
        channel: "support_web",
        subjectKey: `session:${input.sessionId}`,
      }),
      nextExternalIdentityKey: makeChannelExternalIdentityKey({
        channel: "support_web",
        subjectKey: `user:${input.userProfileId}`,
      }),
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      actorUserProfileId: input.actorUserProfileId,
      actorAuthIdentityId: input.actorAuthIdentityId,
      source: input.source,
      channel: "support_web",
      preserveExternalIdentityKey: false,
      summary: "Attached support-web session activity to canonical user profile",
    });
  }

  async rebindUnboundActivity(input: {
    authIdentityId?: string | null;
    externalIdentityKey?: string | null;
    nextExternalIdentityKey?: string | null;
    userProfileId: string;
    actorUserProfileId: string | null;
    actorAuthIdentityId: string | null;
    source: Source;
    channel: "email" | "line" | "support_web";
    preserveExternalIdentityKey: boolean;
    summary: string;
  }) {
    const [conversations, messageEvents, supportCases] = await Promise.all([
      foundationConversationRepository.list(),
      foundationMessageEventRepository.list(),
      foundationSupportCaseRepository.list(),
    ]);
    const matchedConversations = conversations.filter(
      (entry) =>
        (!entry.userProfileId || entry.bindingState === "unbound") &&
        ((input.authIdentityId && entry.authIdentityId === input.authIdentityId) ||
          (input.externalIdentityKey && entry.externalIdentityKey === input.externalIdentityKey)),
    );
    const matchedConversationIds = new Set(matchedConversations.map((entry) => entry.conversationId));
    const matchedMessageEvents = messageEvents.filter(
      (entry) =>
        (!entry.userProfileId || entry.bindingState === "unbound") &&
        ((input.authIdentityId && entry.authIdentityId === input.authIdentityId) ||
          (input.externalIdentityKey && entry.externalIdentityKey === input.externalIdentityKey) ||
          (entry.conversationId ? matchedConversationIds.has(entry.conversationId) : false)),
    );
    const matchedSupportCases = supportCases.filter(
      (entry) =>
        (!entry.userProfileId || entry.bindingState === "unbound") &&
        ((input.authIdentityId && entry.authIdentityId === input.authIdentityId) ||
          (entry.conversationId ? matchedConversationIds.has(entry.conversationId) : false)),
    );
    const externalIdentityKey =
      input.preserveExternalIdentityKey || !input.nextExternalIdentityKey
        ? input.externalIdentityKey || null
        : input.nextExternalIdentityKey;

    await Promise.all(
      matchedConversations.map((entry) =>
          foundationConversationRepository.save({
            ...entry,
            userProfileId: input.userProfileId,
            authIdentityId: input.authIdentityId ?? entry.authIdentityId,
            externalIdentityKey: externalIdentityKey || entry.externalIdentityKey,
            bindingState: "bound" as const,
            updatedAt: nowIso(),
          }),
        ),
    );

    await Promise.all(
      matchedMessageEvents.map((entry) =>
          foundationMessageEventRepository.save({
            ...entry,
            userProfileId: input.userProfileId,
            authIdentityId: input.authIdentityId ?? entry.authIdentityId,
            externalIdentityKey: externalIdentityKey || entry.externalIdentityKey,
            bindingState: "bound" as const,
            updatedAt: nowIso(),
          }),
        ),
    );

    await Promise.all(
      matchedSupportCases.map((entry) =>
          foundationSupportCaseRepository.save({
            ...entry,
            userProfileId: input.userProfileId,
            authIdentityId: input.authIdentityId ?? entry.authIdentityId,
            bindingState: "bound" as const,
            updatedAt: nowIso(),
          }),
        ),
    );

    if (matchedConversations.length || matchedMessageEvents.length || matchedSupportCases.length) {
      await privacyAuditService.recordAudit({
        actorType: input.actorUserProfileId ? "user" : "system",
        actorUserProfileId: input.actorUserProfileId,
        actorAuthIdentityId: input.actorAuthIdentityId,
        action: "identity.merge",
        resourceType: "user_profile",
        resourceId: input.userProfileId,
        channel: input.channel,
        source: input.source,
        bindingState: "bound",
        summary: input.summary,
        metadata: {
          authIdentityId: input.authIdentityId || null,
          externalIdentityKey: input.externalIdentityKey || null,
          nextExternalIdentityKey: input.nextExternalIdentityKey || null,
          conversationCount: String(matchedConversations.length),
          messageEventCount: String(matchedMessageEvents.length),
          supportCaseCount: String(matchedSupportCases.length),
        },
      });
    }

    return {
      conversationCount: matchedConversations.length,
      messageEventCount: matchedMessageEvents.length,
      supportCaseCount: matchedSupportCases.length,
    } as const;
  }

  async syncAllLegacyAccounts() {
    const accounts = await listAccounts();
    await Promise.all(accounts.map((account) => this.ensureCanonicalUserForAccount(account, account.lineUserId ? "line_login" : "email_password")));
    return accounts;
  }
}

export const identityFoundationService = new IdentityFoundationService();
