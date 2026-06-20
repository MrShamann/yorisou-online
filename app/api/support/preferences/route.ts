import { NextResponse } from "next/server";

import { buildSupportProfileFromCanonicalProfile, identityFoundationService } from "@/lib/server/foundation/identityService";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import {
  getViewerContext,
  restoreAccountFromCookie,
  setViewerAccountCookie,
  setViewerSessionCookie,
  withSessionPrincipalLandingShadow,
  type ViewerContext,
} from "@/lib/server/yorisouAuth";
import { updateSupportProfile } from "@/lib/server/yorisouData";

type SupportPreferencesPayload = {
  lineNotificationsEnabled?: boolean;
  familyContactName?: string;
  familyContactRelation?: string;
  familyContactMethod?: string;
  familyContactValue?: string;
  familyShareNote?: string;
};

function getLegacyViewerAccount(viewer: ViewerContext) {
  return viewer.legacyAccount || viewer.account;
}

function resolveSupportPreferencesViewerAuthority(viewer: ViewerContext) {
  const legacyAccount = getLegacyViewerAccount(viewer);

  if (!legacyAccount) {
    return {
      authorized: false,
      effectiveLegacyAccountId: null,
      principalMatched: false,
      legacyMatched: false,
      matchedBy: "none" as const,
    };
  }

  const principalCandidates = [
    viewer.principal?.legacyAccountId || null,
    viewer.principal?.userProfileId || null,
  ].filter((entry): entry is string => Boolean(entry));
  const principalMatched = principalCandidates.includes(legacyAccount.id);

  if (viewer.principal && !principalMatched) {
    console.warn("support preferences viewer authority falling back to legacy account despite principal mismatch", {
      legacyAccountId: legacyAccount.id,
      principalCandidates,
      principalId: viewer.principal.userProfileId,
    });
  }

  return {
    authorized: true,
    effectiveLegacyAccountId: legacyAccount.id,
    principalMatched,
    legacyMatched: true,
    matchedBy: principalMatched ? "principal" : "legacy",
  } as const;
}

async function resolveSupportPreferencesMutationTarget(viewer: ViewerContext) {
  const viewerAuthority = resolveSupportPreferencesViewerAuthority(viewer);

  if (!viewerAuthority.authorized || !viewerAuthority.effectiveLegacyAccountId) {
    return {
      authorized: false,
      effectiveLegacyAccountId: null,
      targetUserProfileId: null,
      switchedToPrincipalTarget: false,
      gate: "unauthorized" as const,
    };
  }

  const principalTargetId =
    viewerAuthority.principalMatched && viewer.principal?.userProfileId ? viewer.principal.userProfileId : null;

  if (!principalTargetId) {
    return {
      authorized: true,
      effectiveLegacyAccountId: viewerAuthority.effectiveLegacyAccountId,
      targetUserProfileId: viewerAuthority.effectiveLegacyAccountId,
      switchedToPrincipalTarget: false,
      gate: "legacy_fallback" as const,
    };
  }

  const profile = await identityFoundationService.getUserProfileById(principalTargetId);

  if (!profile) {
    return {
      authorized: true,
      effectiveLegacyAccountId: viewerAuthority.effectiveLegacyAccountId,
      targetUserProfileId: viewerAuthority.effectiveLegacyAccountId,
      switchedToPrincipalTarget: false,
      gate: "missing_profile_fallback" as const,
    };
  }

  const resolvedLegacyAccountId =
    profile.legacyAccountId ||
    (profile.userProfileId === viewerAuthority.effectiveLegacyAccountId ? viewerAuthority.effectiveLegacyAccountId : null);

  if (!resolvedLegacyAccountId || resolvedLegacyAccountId !== viewerAuthority.effectiveLegacyAccountId) {
    console.warn("support preferences mutation target falling back to legacy account due to target mismatch", {
      effectiveLegacyAccountId: viewerAuthority.effectiveLegacyAccountId,
      principalTargetId,
      resolvedLegacyAccountId,
    });
    return {
      authorized: true,
      effectiveLegacyAccountId: viewerAuthority.effectiveLegacyAccountId,
      targetUserProfileId: viewerAuthority.effectiveLegacyAccountId,
      switchedToPrincipalTarget: false,
      gate: "target_mismatch_fallback" as const,
    };
  }

  return {
    authorized: true,
    effectiveLegacyAccountId: resolvedLegacyAccountId,
    targetUserProfileId: profile.userProfileId,
    switchedToPrincipalTarget: true,
    gate: "principal_target" as const,
  };
}

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();
    const mutationTarget = await resolveSupportPreferencesMutationTarget(viewer);

    if (!mutationTarget.authorized) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const effectiveLegacyAccountId = mutationTarget.effectiveLegacyAccountId;

    if (!effectiveLegacyAccountId) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const legacyAccount = getLegacyViewerAccount(viewer);

    if (legacyAccount) {
      await restoreAccountFromCookie(legacyAccount);
    }

    const payload = (await request.json()) as SupportPreferencesPayload;
    const supportProfilePatch = {
      lineNotificationsEnabled: payload.lineNotificationsEnabled,
      familyContactName: payload.familyContactName?.trim(),
      familyContactRelation: payload.familyContactRelation?.trim(),
      familyContactMethod: payload.familyContactMethod?.trim(),
      familyContactValue: payload.familyContactValue?.trim(),
      familyShareNote: payload.familyShareNote?.trim(),
    } satisfies SupportPreferencesPayload;

    const canonicalWrite =
      mutationTarget.switchedToPrincipalTarget && mutationTarget.targetUserProfileId
        ? await identityFoundationService.updateCanonicalSupportProfile({
            userProfileId: mutationTarget.targetUserProfileId,
            patch: supportProfilePatch,
            fallbackAccount: legacyAccount,
          })
        : null;
    const account =
      canonicalWrite?.ok
        ? canonicalWrite.compatibilityAccount || legacyAccount
        : await updateSupportProfile(effectiveLegacyAccountId, supportProfilePatch);
    const supportProfile =
      canonicalWrite?.ok && canonicalWrite.userProfile
        ? buildSupportProfileFromCanonicalProfile(canonicalWrite.userProfile, account || legacyAccount || null)
        : account?.supportProfile || null;

    const response = NextResponse.json({ success: true, supportProfile });
    if (account) {
      try {
        await privacyAuditService.recordAudit({
          actorType: "user",
          actorUserProfileId: mutationTarget.targetUserProfileId,
          actorAuthIdentityId: null,
          action: "timeline.write",
          resourceType: "user_profile",
          resourceId: mutationTarget.targetUserProfileId,
          channel: "support_web",
          source: "support_workspace",
          bindingState: "bound",
          containsSensitiveAccess: true,
          summary: "Updated support profile preferences",
        });
      } catch (foundationError) {
        console.error("support preferences audit error:", foundationError);
      }
    }
    if (account) {
      setViewerAccountCookie(response, account);
    }
    if (viewer.session) {
      const sessionForCookie = await withSessionPrincipalLandingShadow(
        { ...viewer.session, userId: effectiveLegacyAccountId },
        {
          legacyAccount: account || legacyAccount || null,
          source: "session_upgrade",
        },
      );
      setViewerSessionCookie(response, sessionForCookie);
    }
    return response;
  } catch (error) {
    console.error("support preferences route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
