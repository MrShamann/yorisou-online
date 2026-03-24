export {};

async function main() {
  process.env.YORISOU_DATA_DIR = "/tmp/yori_shadow_write_readiness_data";
  process.env.YORISOU_SHARED_STORE_BUCKET = "";

  const fs = await import("fs/promises");
  await fs.rm(process.env.YORISOU_DATA_DIR!, { recursive: true, force: true });

  const data = await import("../lib/server/yorisouData");
  const auth = await import("../lib/server/yorisouAuth");
  const { identityFoundationService } = await import("../lib/server/foundation/identityService");

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

  const emailAccount = await createCanonicalEmailAccount("shadow-email@example.com", "Email User");
  const emailSession = await data.createSession(null);
  const emailBound =
    (await auth.bindSessionToUser(emailSession.id, emailAccount.id, {
      legacyAccount: emailAccount,
      source: "email_login",
    })) || { ...emailSession, userId: emailAccount.id };
  const emailLogin = await auth.inspectSessionPrincipalLandingCoverage({ session: emailBound });

  const registerAccount = await createCanonicalEmailAccount("shadow-register@example.com", "Register User");
  const registerSession = await data.createSession(null);
  const registerBound =
    (await auth.bindSessionToUser(registerSession.id, registerAccount.id, {
      legacyAccount: registerAccount,
      source: "session_upgrade",
    })) || { ...registerSession, userId: registerAccount.id };
  const registerShadow = await auth.withSessionPrincipalLandingShadow(registerBound, {
    legacyAccount: registerAccount,
    source: "session_upgrade",
  });
  const registerCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: registerShadow });

  const lineDirect = await identityFoundationService.resolveOrCreateLinePrimaryUser({
    lineUserId: "U-shadow-line-direct",
    lineDisplayName: "Line Direct",
    locale: "ja",
  });
  const lineDirectSession = await data.createSession(null);
  const lineDirectBound =
    (await auth.bindSessionToUser(lineDirectSession.id, lineDirect.account.id, {
      legacyAccount: lineDirect.account,
      source: "line_login",
    })) || { ...lineDirectSession, userId: lineDirect.account.id };
  const lineDirectCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: lineDirectBound });

  const lineBindAccount = await createCanonicalEmailAccount("shadow-bind@example.com", "Bind User");
  await identityFoundationService.bindLineIdentityToUserProfile({
    userProfileId: lineBindAccount.id,
    lineUserId: "U-shadow-line-bind",
    lineDisplayName: "Bind User",
    source: "line_login",
    actorUserProfileId: lineBindAccount.id,
  });
  const lineBindSession = await data.createSession(null);
  const lineBindBound =
    (await auth.bindSessionToUser(lineBindSession.id, lineBindAccount.id, {
      legacyAccount: lineBindAccount,
      source: "line_bind",
    })) || { ...lineBindSession, userId: lineBindAccount.id };
  const lineBindCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: lineBindBound });

  const directBindCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: emailBound });

  const upgradeAccount = await createCanonicalEmailAccount("shadow-upgrade@example.com", "Upgrade User");
  const preUpgradeSession = await data.createSession(upgradeAccount.id);
  const upgradedSession = await auth.ensureSessionPrincipalLandingShadowWrite(preUpgradeSession, {
    legacyAccount: upgradeAccount,
    source: "session_upgrade",
  });
  const ensureSessionUpgradeCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: upgradedSession });

  const lineStartBootstrapSession = await auth.withSessionPrincipalLandingShadow(preUpgradeSession, {
    legacyAccount: upgradeAccount,
    source: "session_upgrade",
  });
  const lineStartBootstrapCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: lineStartBootstrapSession });

  const legacyOnlyCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "legacy-only",
      userId: emailAccount.id,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: null,
    },
  });

  const anonymousSession = await data.createSession(null);
  const anonymousCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: anonymousSession });

  const unresolvedCreated = await data.createAccount({
    name: "Unresolved User",
    email: "shadow-unresolved@example.com",
    password: "Password123!",
    city: "Kyoto",
    role: "family",
  });
  if (!unresolvedCreated.ok) {
    throw new Error("unresolved account create failed");
  }
  const unresolvedSession =
    (await auth.bindSessionToUser((await data.createSession(null)).id, unresolvedCreated.account.id, {
      legacyAccount: unresolvedCreated.account,
      source: "session_upgrade",
    })) || {
      id: "unresolved-fallback",
      userId: unresolvedCreated.account.id,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: null,
    };
  const unresolvedCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: unresolvedSession });

  const malformedCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "malformed",
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
      source: "session_upgrade",
      issuedAt: "2026-03-24T00:00:00.000Z",
    },
  });

  const conflictA = await createCanonicalEmailAccount("shadow-conflict-a@example.com", "Conflict A");
  const conflictB = await createCanonicalEmailAccount("shadow-conflict-b@example.com", "Conflict B");
  const conflictContract = await auth.withSessionPrincipalLandingShadow(
    {
      id: "conflict-contract",
      userId: null,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: null,
    },
    {
      legacyAccount: conflictB,
      source: "email_login",
    },
  );
  const conflictCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "conflict-session",
      userId: conflictA.id,
      createdAt: "2026-03-24T00:00:00.000Z",
      updatedAt: "2026-03-24T00:00:00.000Z",
      principalLanding: conflictContract.principalLanding,
    },
  });

  console.log(
    JSON.stringify(
      {
        emailLoginSuccessLanding: emailLogin,
        registerSuccessLanding: registerCoverage,
        lineDirectLoginSuccessLanding: lineDirectCoverage,
        loggedInLineBindLanding: lineBindCoverage,
        bindSessionToUser: directBindCoverage,
        ensureViewerSessionUpgradePath: ensureSessionUpgradeCoverage,
        lineStartBootstrapCookiePath: lineStartBootstrapCoverage,
        legacyOnlyRestoreControl: legacyOnlyCoverage,
        anonymousNoWriteControl: anonymousCoverage,
        unresolvablePrincipalControl: unresolvedCoverage,
        malformedContractControl: malformedCoverage,
        conflictFallbackControl: conflictCoverage,
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
