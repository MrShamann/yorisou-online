import { cookies } from "next/headers";

import {
  assignSessionConsultationsToUser,
  createSession,
  deleteSession,
  findAccountById,
  findSessionById,
  listConsultationsForViewer,
  touchSession,
  type AccountRecord,
  type SessionRecord,
} from "@/lib/server/yorisouData";

export const SESSION_COOKIE = "yorisou_session";

export type ViewerContext = {
  session: SessionRecord | null;
  account: AccountRecord | null;
};

export async function getViewerContext(): Promise<ViewerContext> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return { session: null, account: null };
  }

  const session = await findSessionById(sessionId);

  if (!session) {
    return { session: null, account: null };
  }

  await touchSession(session.id);
  const account = session.userId ? await findAccountById(session.userId) : null;
  return { session, account };
}

export async function ensureViewerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    const session = await findSessionById(sessionId);
    if (session) {
      await touchSession(session.id);
      return session;
    }
  }

  return createSession(null);
}

export async function bindSessionToUser(sessionId: string, userId: string) {
  await touchSession(sessionId, userId);
  await assignSessionConsultationsToUser(sessionId, userId);
}

export async function clearViewerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }
}

export async function getSupportWorkspaceData(locale: "ja" | "en") {
  const viewer = await getViewerContext();
  const consultations = await listConsultationsForViewer({
    userId: viewer.account?.id || null,
    sessionId: viewer.session?.id || null,
    locale,
  });

  return {
    ...viewer,
    consultations,
  };
}

export type SupportWorkspaceData = Awaited<ReturnType<typeof getSupportWorkspaceData>>;
