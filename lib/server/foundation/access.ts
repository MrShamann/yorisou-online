import { redirect } from "next/navigation";

import { getViewerContext, type ViewerContext } from "@/lib/server/yorisouAuth";

function getAdminEmails() {
  const configured = (process.env.YORISOU_ADMIN_EMAILS || "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);

  const fallback =
    process.env.NODE_ENV === "production"
      ? ["jy.edward@gmail.com", "shigeru.nagano1111@gmail.com"]
      : [];

  return new Set([...configured, ...fallback]);
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() || null;
}

export function getViewerAdminEmailCandidates(viewer: ViewerContext) {
  const principalEmails =
    viewer.principal?.authSourceSummary
      .map((identity) => normalizeEmail(identity.emailNormalized))
      .filter((entry): entry is string => Boolean(entry)) || [];

  if (principalEmails.length > 0) {
    return [...new Set(principalEmails)];
  }

  const legacyEmails = [
    normalizeEmail(viewer.account?.email),
    normalizeEmail(viewer.legacyAccount?.email),
  ].filter((entry): entry is string => Boolean(entry));

  return [...new Set(legacyEmails)];
}

export function viewerHasAdminAccess(viewer: ViewerContext) {
  const adminEmails = getAdminEmails();
  const emailCandidates = getViewerAdminEmailCandidates(viewer);
  const isDevFallbackAllowed = process.env.NODE_ENV !== "production" && adminEmails.size === 0;

  return {
    allowed:
      isDevFallbackAllowed ||
      emailCandidates.some((candidate) => adminEmails.has(candidate)),
    emailCandidates,
    isDevFallbackAllowed,
  } as const;
}

export async function requireAdminViewer() {
  const viewer = await getViewerContext();

  if (!viewer.account) {
    redirect("/login");
  }

  const access = viewerHasAdminAccess(viewer);

  if (!access.allowed) {
    redirect("/support");
  }

  return viewer;
}

export async function requireAdminRequestViewer() {
  const viewer = await getViewerContext();

  if (!viewer.account) {
    return null;
  }

  const access = viewerHasAdminAccess(viewer);

  if (!access.allowed) {
    return null;
  }

  return viewer;
}

export function getAdminAccessStatus() {
  const adminEmails = getAdminEmails();
  return {
    configuredAdminEmails: adminEmails.size,
    productionRequiresExplicitList: process.env.NODE_ENV === "production",
  };
}
