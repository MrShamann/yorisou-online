export {};

import { NextResponse } from "next/server";

async function main() {
  process.env.YORISOU_DATA_DIR = "/tmp/yori_post_switch_stability_data";
  process.env.YORISOU_SHARED_STORE_BUCKET = "";

  const fs = await import("fs/promises");
  await fs.rm(process.env.YORISOU_DATA_DIR!, { recursive: true, force: true });

  const data = await import("../lib/server/yorisouData");
  const auth = await import("../lib/server/yorisouAuth");
  const { identityFoundationService } = await import("../lib/server/foundation/identityService");
  const { resolveSupportPreferencesMutationTarget } = await import("../app/api/support/preferences/route");
  const { getSupportDisplaySnapshot } = await import("../lib/server/midBackend/support/supportDisplaySnapshot");

  const createCanonicalEmailAccount = async (email: string, name: string) => {
    const created = await data.createAccount({
      name,
      email,
      password: "Password123!",
      city: "Tokyo",
      role: "family",
    });
    if (!created.ok) {
      throw new Error(`account create failed for ${email}`);
    }

    await identityFoundationService.ensureCanonicalUserForAccount(created.account, "email_password");
    await identityFoundationService.attachEmailIdentityToUserProfile({
      userProfileId: created.account.id,
      email: created.account.email,
      passwordHashPresent: Boolean(created.account.passwordHash),
      source: "email_password",
      actorUserProfileId: created.account.id,
    });

    return created.account;
  };

  const createSwitchedEmailLoginState = async (account: Awaited<ReturnType<typeof createCanonicalEmailAccount>>) => {
    const session = await data.createSession(null);
    const bound =
      (await auth.bindSessionToUser(session.id, account.id, {
        legacyAccount: account,
        source: "email_login",
      })) || { ...session, userId: account.id };
    const switched = await auth.switchSessionToPrincipalLandingTruth(bound, {
      legacyAccount: account,
      source: "email_login",
    });
    const directCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: switched });

    const response = NextResponse.json({ ok: true });
    auth.setViewerSessionCookie(response, switched);
    auth.setViewerAccountCookie(response, account);
    const encodedSessionCookie = response.cookies.get(auth.SESSION_COOKIE)?.value;
    const cookieRoundTrip = await auth.inspectEncodedSessionCookieForAudit({
      encodedSessionCookie,
      accountCookie: account,
    });

    return {
      session: switched,
      directCoverage,
      cookieRoundTrip,
    };
  };

  const emailAccount = await createCanonicalEmailAccount("post-switch@example.com", "Post Switch");
  const firstLogin = await createSwitchedEmailLoginState(emailAccount);
  await data.deleteSession(firstLogin.session.id);
  const secondLogin = await createSwitchedEmailLoginState(emailAccount);

  const legacyOnlyCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "legacy-only-control",
      userId: emailAccount.id,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: null,
    },
  });

  const malformedCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "malformed-control",
      userId: null,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: null,
    },
    rawContractValue: {
      version: 1,
      kind: "canonical_principal",
      principalId: "principal-bad",
      userProfileId: 123,
      legacyAccountId: "acct-bad",
      source: "email_login",
      issuedAt: "2026-03-24T00:00:00.000Z",
    },
  });

  const conflictCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "conflict-control",
      userId: emailAccount.id,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: {
        version: 1,
        kind: "canonical_principal",
        principalId: "uprofile_conflict",
        userProfileId: "uprofile_conflict",
        legacyAccountId: "acct_conflict",
        source: "email_login",
        issuedAt: "2026-03-24T00:00:00.000Z",
      },
    },
  });

  const registerAccount = await createCanonicalEmailAccount("post-switch-register@example.com", "Register Control");
  const registerDeterministicPrincipal = await identityFoundationService.ensureDeterministicEmailPrincipalForAccount(registerAccount);
  const registerSession = await data.createSession(null);
  const registerBound =
    (await auth.bindSessionToUser(registerSession.id, registerAccount.id, {
      legacyAccount: registerAccount,
      source: "register",
    })) || { ...registerSession, userId: registerAccount.id };
  const registerSwitched = await auth.switchSessionToPrincipalLandingTruth(registerBound, {
    legacyAccount: registerAccount,
    source: "register",
  });
  const registerCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: registerSwitched });
  const registerResponse = NextResponse.json({ ok: true });
  auth.setViewerSessionCookie(registerResponse, registerSwitched);
  auth.setViewerAccountCookie(registerResponse, registerAccount);
  const registerCookieRoundTrip = await auth.inspectEncodedSessionCookieForAudit({
    encodedSessionCookie: registerResponse.cookies.get(auth.SESSION_COOKIE)?.value,
    accountCookie: registerAccount,
  });

  const linePrimary = await identityFoundationService.resolveDeterministicLinePrimaryUser({
    lineUserId: "U-post-switch-direct-line",
    lineDisplayName: "Direct LINE",
    locale: "ja",
  });
  if (!linePrimary.ok) {
    throw new Error(`direct line login determinism failed: ${linePrimary.reason}`);
  }
  const lineLoginSession = await data.createSession(null);
  const lineLoginBound =
    (await auth.bindSessionToUser(lineLoginSession.id, linePrimary.account.id, {
      legacyAccount: linePrimary.account,
      source: "line_login",
    })) || { ...lineLoginSession, userId: linePrimary.account.id };
  const lineLoginSwitched = await auth.switchSessionToPrincipalLandingTruth(lineLoginBound, {
    legacyAccount: linePrimary.account,
    source: "line_login",
  });
  const lineLoginCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: lineLoginSwitched });
  const lineLoginResponse = NextResponse.json({ ok: true });
  auth.setViewerSessionCookie(lineLoginResponse, lineLoginSwitched);
  auth.setViewerAccountCookie(lineLoginResponse, linePrimary.account);
  const lineLoginCookieRoundTrip = await auth.inspectEncodedSessionCookieForAudit({
    encodedSessionCookie: lineLoginResponse.cookies.get(auth.SESSION_COOKIE)?.value,
    accountCookie: linePrimary.account,
  });

  const lineBindSession = await data.createSession(null);
  const lineBindDeterministicPrincipal = await identityFoundationService.ensureDeterministicPrincipalForLegacyAccount(
    registerAccount,
    "line_login",
  );
  const lineBindBound =
    (await auth.bindSessionToUser(lineBindSession.id, registerAccount.id, {
      legacyAccount: registerAccount,
      source: "line_bind",
    })) || { ...lineBindSession, userId: registerAccount.id };
  const lineBindSwitched = await auth.switchSessionToPrincipalLandingTruth(lineBindBound, {
    legacyAccount: registerAccount,
    source: "line_bind",
  });
  const lineBindCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: lineBindSwitched });
  const lineBindResponse = NextResponse.json({ ok: true });
  auth.setViewerSessionCookie(lineBindResponse, lineBindSwitched);
  auth.setViewerAccountCookie(lineBindResponse, registerAccount);
  const lineBindCookieRoundTrip = await auth.inspectEncodedSessionCookieForAudit({
    encodedSessionCookie: lineBindResponse.cookies.get(auth.SESSION_COOKIE)?.value,
    accountCookie: registerAccount,
  });

  const sharedBindSession = await data.createSession(null);
  const consultationBeforeBind = await data.createConsultation({
    sessionId: sharedBindSession.id,
    userId: null,
    locale: "ja",
    recommendation: {
      recommendedCategory: "Community Micro EV",
      secondaryRecommendation: "Compact Senior Mobility Scooter",
      whyItFits: ["x"],
      cautionPoints: ["y"],
      suggestedNextAction: "Call support",
      summary: "Summary",
      scoreBreakdown: {
        "Community Micro EV": 4,
        "Compact Senior Mobility Scooter": 3,
        "Foldable Lightweight Mobility Scooter": 2,
        "Stable 3-Wheel Utility Mobility": 1,
      },
    },
    answerLabels: {
      mobility: "needs_help",
    },
  });
  const sharedBoundSession =
    (await auth.bindSessionToUser(sharedBindSession.id, registerAccount.id, {
      legacyAccount: registerAccount,
      source: "session_upgrade",
    })) || { ...sharedBindSession, userId: registerAccount.id };
  const sharedBindCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: sharedBoundSession,
  });
  const sharedBindResponse = NextResponse.json({ ok: true });
  auth.setViewerSessionCookie(sharedBindResponse, sharedBoundSession);
  auth.setViewerAccountCookie(sharedBindResponse, registerAccount);
  const sharedBindCookieRoundTrip = await auth.inspectEncodedSessionCookieForAudit({
    encodedSessionCookie: sharedBindResponse.cookies.get(auth.SESSION_COOKIE)?.value,
    accountCookie: registerAccount,
  });
  const reassignedConsultation = await data.findConsultationForViewer({
    consultationId: consultationBeforeBind.id,
    userId: registerAccount.id,
    userIds: [
      registerAccount.id,
      registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    ],
    sessionId: sharedBindSession.id,
  });
  const leadAttachedConsultation = await data.attachLeadToConsultation({
    consultationId: consultationBeforeBind.id,
    userId: registerAccount.id,
    ownerTargetId: registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    ownerIds: [
      registerAccount.id,
      registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    ],
    lead: {
      name: "Test User",
      phone: "0312345678",
      email: "lead@example.com",
      city: "Tokyo",
      preferredContactMethod: "email",
      interestedInTestRide: "no",
      additionalNotes: "",
    },
  });
  const supportLookup = await data.listConsultationsForViewer({
    userId: registerAccount.id,
    userIds: [
      registerAccount.id,
      registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    ],
    sessionId: sharedBindSession.id,
    locale: "ja",
  });
  const legacyOwnedConsultation = await data.createConsultation({
    sessionId: registerSession.id,
    userId: registerAccount.id,
    locale: "ja",
    recommendation: {
      recommendedCategory: "Stable 3-Wheel Utility Mobility",
      secondaryRecommendation: "Community Micro EV",
      whyItFits: ["x"],
      cautionPoints: ["y"],
      suggestedNextAction: "Call support",
      summary: "Legacy owned control",
      scoreBreakdown: {
        "Stable 3-Wheel Utility Mobility": 4,
        "Community Micro EV": 3,
        "Compact Senior Mobility Scooter": 2,
        "Foldable Lightweight Mobility Scooter": 1,
      },
    },
    answerLabels: {
      mobility: "legacy_owned",
    },
  });
  const legacyOwnedLeadAttached = await data.attachLeadToConsultation({
    consultationId: legacyOwnedConsultation.id,
    userId: registerAccount.id,
    ownerTargetId: registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    ownerIds: [
      registerAccount.id,
      registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    ],
    lead: {
      name: "Legacy Owner User",
      phone: "0399999999",
      email: "legacy-owner@example.com",
      city: "Tokyo",
      preferredContactMethod: "phone",
      interestedInTestRide: "yes",
      additionalNotes: "",
    },
  });
  const createAuthorityConsultation = await data.createConsultation({
    sessionId: registerSession.id,
    userId: registerAccount.id,
    ownerTargetId: registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    locale: "ja",
    recommendation: {
      recommendedCategory: "Compact Senior Mobility Scooter",
      secondaryRecommendation: "Community Micro EV",
      whyItFits: ["x"],
      cautionPoints: ["y"],
      suggestedNextAction: "Call support",
      summary: "Create authority summary",
      scoreBreakdown: {
        "Compact Senior Mobility Scooter": 4,
        "Community Micro EV": 3,
        "Foldable Lightweight Mobility Scooter": 2,
        "Stable 3-Wheel Utility Mobility": 1,
      },
    },
    answerLabels: {
      mobility: "needs_help",
    },
  });
  const createAuthorityLookup = await data.listConsultationsForViewer({
    userId: registerAccount.id,
    userIds: [registerAccount.id, registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id],
    sessionId: registerSession.id,
    locale: "ja",
  });
  const anonymousCreateConsultation = await data.createConsultation({
    sessionId: "anon-session-control",
    userId: null,
    ownerTargetId: null,
    locale: "ja",
    recommendation: {
      recommendedCategory: "Foldable Lightweight Mobility Scooter",
      secondaryRecommendation: "Compact Senior Mobility Scooter",
      whyItFits: ["x"],
      cautionPoints: ["y"],
      suggestedNextAction: "Keep browsing",
      summary: "Anonymous create",
      scoreBreakdown: {
        "Foldable Lightweight Mobility Scooter": 4,
        "Compact Senior Mobility Scooter": 3,
        "Community Micro EV": 2,
        "Stable 3-Wheel Utility Mobility": 1,
      },
    },
    answerLabels: {
      mobility: "anonymous",
    },
  });

  const existingSession = await data.createSession(registerAccount.id);
  const sessionUpgrade = await auth.switchSessionToPrincipalLandingTruth(existingSession, {
    legacyAccount: registerAccount,
    source: "session_upgrade",
  });
  const sessionUpgradeCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: sessionUpgrade,
  });
  const sessionUpgradeResponse = NextResponse.json({ ok: true });
  auth.setViewerSessionCookie(sessionUpgradeResponse, sessionUpgrade);
  auth.setViewerAccountCookie(sessionUpgradeResponse, registerAccount);
  const sessionUpgradeCookieRoundTrip = await auth.inspectEncodedSessionCookieForAudit({
    encodedSessionCookie: sessionUpgradeResponse.cookies.get(auth.SESSION_COOKIE)?.value,
    accountCookie: registerAccount,
  });
  const supportPreferencesViewer = {
    session: sessionUpgrade,
    account: registerAccount,
    legacyAccount: registerAccount,
    principal: registerDeterministicPrincipal.ok
      ? {
          principalId: registerDeterministicPrincipal.profile.userProfileId,
          userProfileId: registerDeterministicPrincipal.profile.userProfileId,
          legacyAccountId: registerDeterministicPrincipal.profile.legacyAccountId,
          profileStatus: registerDeterministicPrincipal.profile.profileStatus,
          bindingState: registerDeterministicPrincipal.profile.bindingState,
          displayName: registerDeterministicPrincipal.profile.profile.displayName,
          primaryLocale: registerDeterministicPrincipal.profile.profile.primaryLocale,
          authSourceSummary: [
            {
              authIdentityId: registerDeterministicPrincipal.identity.authIdentityId,
              identityType: registerDeterministicPrincipal.identity.identityType,
              identityStatus: registerDeterministicPrincipal.identity.identityStatus,
              bindingState: registerDeterministicPrincipal.identity.bindingState,
              source: registerDeterministicPrincipal.identity.source,
              channel: registerDeterministicPrincipal.identity.channel,
              legacyAccountId: registerDeterministicPrincipal.identity.legacyAccountId,
              emailNormalized: registerDeterministicPrincipal.identity.emailNormalized,
              lineUserId: registerDeterministicPrincipal.identity.lineUserId,
            },
          ],
          stableAccessKey: registerDeterministicPrincipal.profile.userProfileId,
        }
      : null,
    principalLanding: {
      contract: sessionUpgrade.principalLanding || null,
      contractStatus: sessionUpgradeCoverage.contractStatus,
      restoreSource: sessionUpgradeCoverage.restoreSource,
    },
  };
  const supportPreferencesTarget = await resolveSupportPreferencesMutationTarget(supportPreferencesViewer);
  const updatedCanonicalSupportProfile =
    supportPreferencesTarget.switchedToPrincipalTarget && supportPreferencesTarget.targetUserProfileId
      ? await identityFoundationService.updateCanonicalSupportProfile({
          userProfileId: supportPreferencesTarget.targetUserProfileId,
          patch: {
            lineNotificationsEnabled: true,
            familyShareNote: "principal-aware support save",
          },
          fallbackAccount: registerAccount,
        })
      : null;
  const updatedSupportAccount =
    updatedCanonicalSupportProfile && updatedCanonicalSupportProfile.ok
      ? updatedCanonicalSupportProfile.compatibilityAccount
      : supportPreferencesTarget.effectiveLegacyAccountId
        ? await data.updateSupportProfile(supportPreferencesTarget.effectiveLegacyAccountId, {
            lineNotificationsEnabled: true,
            familyShareNote: "principal-aware support save",
          })
        : null;
  const supportDisplaySnapshot = await getSupportDisplaySnapshot({
    userProfileId: registerDeterministicPrincipal.ok ? registerDeterministicPrincipal.profile.userProfileId : registerAccount.id,
    fallbackAccount: updatedSupportAccount || registerAccount,
  });

  console.log(
    JSON.stringify(
      {
        switchedEmailLogin: {
          firstLogin: {
            sessionUserId: firstLogin.session.userId,
            contractSource: firstLogin.session.principalLanding?.source || null,
            directCoverage: firstLogin.directCoverage,
            cookieRoundTrip: firstLogin.cookieRoundTrip,
          },
          relogin: {
            sessionUserId: secondLogin.session.userId,
            contractSource: secondLogin.session.principalLanding?.source || null,
            directCoverage: secondLogin.directCoverage,
            cookieRoundTrip: secondLogin.cookieRoundTrip,
          },
        },
        controls: {
          legacyOnlyCoverage,
          malformedCoverage,
          conflictCoverage,
        },
        remainingPaths: {
          registerSuccessLanding: {
            deterministicPrincipal: registerDeterministicPrincipal,
            sessionUserId: registerSwitched.userId,
            contractSource: registerSwitched.principalLanding?.source || null,
            coverage: registerCoverage,
            cookieRoundTrip: registerCookieRoundTrip,
          },
          lineDirectLoginSuccessLanding: {
            deterministicPrincipal: {
              ok: true,
              profile: linePrimary.profile,
              identity: linePrimary.identity,
            },
            sessionUserId: lineLoginSwitched.userId,
            contractSource: lineLoginSwitched.principalLanding?.source || null,
            coverage: lineLoginCoverage,
            cookieRoundTrip: lineLoginCookieRoundTrip,
          },
          loggedInLineBindLanding: {
            deterministicPrincipal: lineBindDeterministicPrincipal,
            sessionUserId: lineBindSwitched.userId,
            contractSource: lineBindSwitched.principalLanding?.source || null,
            coverage: lineBindCoverage,
            cookieRoundTrip: lineBindCookieRoundTrip,
          },
          bindSessionToUserSharedWriter: {
            sessionUserId: sharedBoundSession.userId,
            contractSource: sharedBoundSession.principalLanding?.source || null,
            coverage: sharedBindCoverage,
            cookieRoundTrip: sharedBindCookieRoundTrip,
            consultationReassignment: {
              consultationId: consultationBeforeBind.id,
              reassignedUserId: reassignedConsultation?.userId || null,
              leadAttachedUserId: leadAttachedConsultation?.userId || null,
              supportLookupCount: supportLookup.length,
            },
          },
          consultationCreateAuthority: {
            consultationId: createAuthorityConsultation.id,
            createdOwnerUserId: createAuthorityConsultation.userId,
            lookupCount: createAuthorityLookup.length,
            anonymousCreatedOwnerUserId: anonymousCreateConsultation.userId,
          },
          consultationAttachAuthority: {
            consultationId: consultationBeforeBind.id,
            attachedOwnerUserId: leadAttachedConsultation?.userId || null,
            legacyOwnedConsultationId: legacyOwnedConsultation.id,
            legacyOwnedAttachedOwnerUserId: legacyOwnedLeadAttached?.userId || null,
          },
          supportPreferencesAuthority: {
            target: supportPreferencesTarget,
            canonicalWriteOk: updatedCanonicalSupportProfile?.ok || false,
            canonicalStoredProfile:
              updatedCanonicalSupportProfile && updatedCanonicalSupportProfile.ok
                ? {
                    userProfileId: updatedCanonicalSupportProfile.userProfile.userProfileId,
                    lineNotificationsEnabled: updatedCanonicalSupportProfile.userProfile.profile.lineNotificationsEnabled,
                    familyShareNote: updatedCanonicalSupportProfile.userProfile.sensitiveProfile.familyShareNote,
                  }
                : null,
            updatedSupportProfile: updatedSupportAccount?.supportProfile || null,
          },
          supportReadModel: {
            readModelSource: supportDisplaySnapshot.readModelSource,
            supportProfile: supportDisplaySnapshot.supportProfile,
            accountSupportProfile: supportDisplaySnapshot.account?.supportProfile || null,
          },
          ensureViewerSessionSessionUpgradeWriter: {
            sessionUserId: sessionUpgrade.userId,
            contractSource: sessionUpgrade.principalLanding?.source || null,
            coverage: sessionUpgradeCoverage,
            cookieRoundTrip: sessionUpgradeCookieRoundTrip,
          },
          sharedWriterDecision: {
            ensureViewerSession: "shared-entry-switch-completed",
            bindSessionToUser: "bind-switch-completed",
          },
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
