import { default as assert } from "assert";

import { createAuthIdentityId, getEmailIdentityHint, getLineIdentityHint } from "@/lib/server/midBackend/utils";
import { createFoundationId, createDeterministicPlaceholderEmail, createHashedKey, isPlaceholderEmail, nowIso } from "@/lib/server/foundation/ids";
import type { AuthIdentity, BindingState, Source, UserProfile } from "@/lib/server/foundation/schema";
import { deleteFoundationRecord, listAuthIdentities, listConversations, listMessageEvents, listSupportCases, listUserProfiles, putFoundationRecord } from "@/lib/server/foundation/store";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
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
    const profiles = await listUserProfiles();
    return profiles.find((entry) => entry.userProfileId === userProfileId) || null;
  }

  async getUserProfileByLegacyAccountId(legacyAccountId: string) {
    const profiles = await listUserProfiles();
    return profiles.find((entry) => entry.legacyAccountId === legacyAccountId) || null;
  }

  async getAuthIdentityById(authIdentityId: string) {
    const identities = await listAuthIdentities();
    return identities.find((entry) => entry.authIdentityId === authIdentityId) || null;
  }

  async getAuthIdentityByEmail(email: string) {
    const emailNormalized = normalizeEmail(email);
    const identities = await listAuthIdentities();
    return identities.find((entry) => entry.identityType === "email_password" && entry.emailNormalized === emailNormalized) || null;
  }

  async getAuthIdentityByLineUserId(lineUserId: string) {
    const identities = await listAuthIdentities();
    return identities.find((entry) => entry.identityType === "line" && entry.lineUserId === lineUserId) || null;
  }

  async getAuthIdentitiesByUserProfileId(userProfileId: string) {
    const identities = await listAuthIdentities();
    return identities.filter((entry) => entry.userProfileId === userProfileId);
  }

  async ensureCanonicalUserForAccount(account: AccountRecord, source: Source = "email_password") {
    const profile = buildUserProfileFromAccount(account, source);
    await putFoundationRecord("user-profiles", profile.userProfileId, profile);

    if (account.email) {
      const emailIdentity = buildEmailIdentity(account, source);
      if (isPlaceholderEmail(account.email)) {
        await deleteFoundationRecord("auth-identities", emailIdentity.authIdentityId);
      } else {
        await putFoundationRecord("auth-identities", emailIdentity.authIdentityId, emailIdentity);
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

      await putFoundationRecord("auth-identities", lineIdentity.authIdentityId, lineIdentity);
    }

    return profile;
  }

  async updateCanonicalSupportProfile(input: {
    userProfileId: string;
    patch: Partial<SupportProfile>;
    fallbackAccount?: AccountRecord | null;
  }) {
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

    await putFoundationRecord("user-profiles", updatedProfile.userProfileId, updatedProfile);

    const compatibilityAccount = updatedProfile.legacyAccountId
      ? await updateSupportProfile(updatedProfile.legacyAccountId, buildSupportProfileFromCanonicalProfile(updatedProfile, input.fallbackAccount || null))
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
      await putFoundationRecord("auth-identities", updated.authIdentityId, updated);
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

    await putFoundationRecord("auth-identities", identity.authIdentityId, identity);
    return identity;
  }

  async bindLineIdentityToUserProfile(input: {
    userProfileId: string;
    lineUserId: string;
    lineDisplayName: string;
    linePictureUrl?: string;
    lineIdTokenSubject?: string;
    source: Source;
    actorUserProfileId: string | null;
  }) {
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

    await putFoundationRecord("auth-identities", identity.authIdentityId, identity);
    await this.rebindUnboundActivity(identity.authIdentityId, input.userProfileId);
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

  async resolveOrCreateLinePrimaryUser(input: {
    lineUserId: string;
    lineDisplayName: string;
    linePictureUrl?: string;
    lineIdTokenSubject?: string;
    locale: "ja" | "en";
  }) {
    const existingLegacyAccount = await findAccountByLineUserId(input.lineUserId);

    if (existingLegacyAccount) {
      await this.ensureCanonicalUserForAccount(existingLegacyAccount, "line_login");
      return { account: existingLegacyAccount, created: false as const };
    }

    const existingIdentity = await this.getAuthIdentityByLineUserId(input.lineUserId);

    if (existingIdentity?.userProfileId) {
      const existingAccount = await findAccountById(existingIdentity.userProfileId);

      if (existingAccount) {
        await this.ensureCanonicalUserForAccount(existingAccount, "line_login");
        return { account: existingAccount, created: false as const };
      }
    }

    const newAccount = buildLineOnlyAccount({
      lineUserId: input.lineUserId,
      displayName: input.lineDisplayName,
      pictureUrl: input.linePictureUrl,
      lineIdTokenSubject: input.lineIdTokenSubject,
    });
    await upsertAccountRecord(newAccount);
    await this.ensureCanonicalUserForAccount(newAccount, "line_login");
    const bindResult = await this.bindLineIdentityToUserProfile({
      userProfileId: newAccount.id,
      lineUserId: input.lineUserId,
      lineDisplayName: input.lineDisplayName,
      linePictureUrl: input.linePictureUrl,
      lineIdTokenSubject: input.lineIdTokenSubject,
      source: "line_login",
      actorUserProfileId: newAccount.id,
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
      await putFoundationRecord("auth-identities", updatedIdentity.authIdentityId, updatedIdentity);
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

    await putFoundationRecord("auth-identities", identity.authIdentityId, identity);
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

  async rebindUnboundActivity(authIdentityId: string, userProfileId: string) {
    const [conversations, messageEvents, supportCases] = await Promise.all([
      listConversations(),
      listMessageEvents(),
      listSupportCases(),
    ]);

    await Promise.all(
      conversations
        .filter((entry) => entry.authIdentityId === authIdentityId && !entry.userProfileId)
        .map((entry) =>
          putFoundationRecord("conversations", entry.conversationId, {
            ...entry,
            userProfileId,
            bindingState: "bound" as const,
            updatedAt: nowIso(),
          }),
        ),
    );

    await Promise.all(
      messageEvents
        .filter((entry) => entry.authIdentityId === authIdentityId && !entry.userProfileId)
        .map((entry) =>
          putFoundationRecord("message-events", entry.messageEventId, {
            ...entry,
            userProfileId,
            bindingState: "bound" as const,
            updatedAt: nowIso(),
          }),
        ),
    );

    await Promise.all(
      supportCases
        .filter((entry) => entry.authIdentityId === authIdentityId && !entry.userProfileId)
        .map((entry) =>
          putFoundationRecord("support-cases", entry.supportCaseId, {
            ...entry,
            userProfileId,
            bindingState: "bound" as const,
            updatedAt: nowIso(),
          }),
        ),
    );
  }

  async syncAllLegacyAccounts() {
    const accounts = await listAccounts();
    await Promise.all(accounts.map((account) => this.ensureCanonicalUserForAccount(account, account.lineUserId ? "line_login" : "email_password")));
    return accounts;
  }
}

export const identityFoundationService = new IdentityFoundationService();
