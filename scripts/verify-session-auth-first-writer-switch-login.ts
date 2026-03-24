export {};

async function main() {
  process.env.YORISOU_DATA_DIR = "/tmp/yori_first_writer_switch_login_data";
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

  const loginAccount = await createCanonicalEmailAccount("switch-email@example.com", "Switch Email");
  const loginSession = await data.createSession(null);
  const loginBound =
    (await auth.bindSessionToUser(loginSession.id, loginAccount.id, {
      legacyAccount: loginAccount,
      source: "email_login",
    })) || { ...loginSession, userId: loginAccount.id };
  const loginSwitched = await auth.switchSessionToPrincipalLandingTruth(loginBound, {
    legacyAccount: loginAccount,
    source: "email_login",
  });
  const loginCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: loginSwitched });

  const registerAccount = await createCanonicalEmailAccount("switch-register@example.com", "Switch Register");
  const registerSession = await data.createSession(null);
  const registerBound =
    (await auth.bindSessionToUser(registerSession.id, registerAccount.id, {
      legacyAccount: registerAccount,
      source: "session_upgrade",
    })) || { ...registerSession, userId: registerAccount.id };
  const registerCoverage = await auth.inspectSessionPrincipalLandingCoverage({ session: registerBound });

  const legacyOnlyCoverage = await auth.inspectSessionPrincipalLandingCoverage({
    session: {
      id: "legacy-only-control",
      userId: loginAccount.id,
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

  console.log(
    JSON.stringify(
      {
        emailLoginWriterSwitch: {
          sessionUserId: loginSwitched.userId,
          contractSource: loginSwitched.principalLanding?.source || null,
          coverage: loginCoverage,
        },
        registerPathStillUnswitched: {
          sessionUserId: registerBound.userId,
          contractSource: registerBound.principalLanding?.source || null,
          coverage: registerCoverage,
        },
        legacyFallbackStillWorks: legacyOnlyCoverage,
        malformedContractStillSafe: malformedCoverage,
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
