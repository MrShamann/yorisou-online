import Link from "next/link";

import { requireAdminViewer } from "@/lib/server/foundation/access";
import { adminFoundationService } from "@/lib/server/foundation/adminService";
import type { AuthIdentity, Conversation, MessageEvent, SupportCase, UserProfile } from "@/lib/server/foundation/schema";

export const dynamic = "force-dynamic";

export default async function AdminTimelinePage({
  searchParams,
}: {
  searchParams?: Promise<{
    userProfileId?: string;
    authIdentityId?: string;
    sessionId?: string;
    lineUserId?: string;
  }>;
}) {
  await requireAdminViewer();
  const params = (await searchParams) || {};
  const userProfileId = typeof params.userProfileId === "string" ? params.userProfileId.trim() : "";
  const authIdentityId = typeof params.authIdentityId === "string" ? params.authIdentityId.trim() : "";
  const sessionId = typeof params.sessionId === "string" ? params.sessionId.trim() : "";
  const lineUserId = typeof params.lineUserId === "string" ? params.lineUserId.trim() : "";

  const detail =
    userProfileId || authIdentityId || sessionId || lineUserId
      ? await adminFoundationService.getTimelineSubjectDetail({
          userProfileId: userProfileId || null,
          authIdentityId: authIdentityId || null,
          sessionId: sessionId || null,
          lineUserId: lineUserId || null,
        })
      : null;

  const profile = (detail?.profile || null) as UserProfile | null;
  const identities = (detail?.identities || []).filter((entry): entry is AuthIdentity => Boolean(entry));
  const conversations = (detail?.timelineBundle.conversations || []).filter((entry): entry is Conversation => Boolean(entry));
  const events = (detail?.timelineBundle.events || []).filter((entry): entry is MessageEvent => Boolean(entry));
  const supportCases = (detail?.timelineBundle.supportCases || []).filter((entry): entry is SupportCase => Boolean(entry));

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <Link href="/admin" className="text-sm text-[#6E5D4D] underline underline-offset-4">Back to admin</Link>
          <h1 className="text-3xl font-light">Timeline Inspector</h1>
          <p className="text-sm text-[#6E5D4D]">Inspect canonical identity, linked channels, unified interaction history, and support-case status.</p>
        </header>

        <form className="grid gap-3 rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-4 md:grid-cols-2 xl:grid-cols-4">
          <input name="userProfileId" defaultValue={userProfileId} placeholder="userProfileId" className="rounded-xl border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3" />
          <input name="authIdentityId" defaultValue={authIdentityId} placeholder="authIdentityId" className="rounded-xl border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3" />
          <input name="sessionId" defaultValue={sessionId} placeholder="support sessionId" className="rounded-xl border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3" />
          <input name="lineUserId" defaultValue={lineUserId} placeholder="lineUserId" className="rounded-xl border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3" />
          <div className="md:col-span-2 xl:col-span-4 flex gap-3">
            <button type="submit" className="rounded-full bg-[#3B2F2F] px-5 py-2 text-sm text-white">Inspect timeline</button>
            <Link href="/admin/timeline" className="rounded-full border border-[#D6C3A3]/50 px-5 py-2 text-sm text-[#5A4B3E]">Clear</Link>
          </div>
        </form>

        {detail ? (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <Card title="Subject type" value={detail.subjectType} note={detail.timelineBundle.source} />
              <Card title="Conversations" value={String(conversations.length)} note="Canonical conversation records" />
              <Card title="Events" value={String(events.length)} note="Unified timeline events" />
              <Card title="Support cases" value={String(supportCases.length)} note="Linked support-case records" />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Panel title="Canonical subject">
                <dl className="grid gap-2 text-sm">
                  <Row label="User profile">{profile?.userProfileId || "None"}</Row>
                  <Row label="Display name">{profile?.profile.displayName || "None"}</Row>
                  <Row label="Legacy account">{profile?.legacyAccountId || "None"}</Row>
                  <Row label="Source">{conversations[0]?.source || identities[0]?.source || "None"}</Row>
                  <Row label="Channels">{[...new Set(events.map((entry) => entry.channel))].join(", ") || "None"}</Row>
                </dl>
              </Panel>

              <Panel title="Linked identities">
                <div className="space-y-3">
                  {identities.length ? identities.map((identity) => (
                    <div key={identity.authIdentityId} className="rounded-xl border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-3 text-sm">
                      <div className="font-medium">{identity.identityType}</div>
                      <div>ID: {identity.authIdentityId}</div>
                      <div>Status: {identity.identityStatus}</div>
                      <div>Binding: {identity.bindingState}</div>
                      <div>Email: {identity.emailNormalized || "None"}</div>
                      <div>LINE: {identity.lineUserId || "None"}</div>
                    </div>
                  )) : <div className="text-sm text-[#6E5D4D]">No linked identities found.</div>}
                </div>
              </Panel>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Panel title="Conversations">
                <div className="space-y-3">
                  {conversations.length ? conversations.map((conversation) => (
                    <div key={conversation.conversationId} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                      <div className="font-medium">{conversation.channel} / {conversation.subject || "No subject"}</div>
                      <div>ID: {conversation.conversationId}</div>
                      <div>External key: {conversation.externalIdentityKey}</div>
                      <div>Case: {conversation.supportCaseId || "None"}</div>
                      <div className="text-xs text-[#8A7764]">{conversation.latestActivityAt}</div>
                    </div>
                  )) : <div className="text-sm text-[#6E5D4D]">No canonical conversations found.</div>}
                </div>
              </Panel>

              <Panel title="Support cases">
                <div className="space-y-3">
                  {supportCases.length ? supportCases.map((supportCase) => (
                    <div key={supportCase.supportCaseId} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                      <div className="font-medium">{supportCase.title}</div>
                      <div>Status: {supportCase.status}</div>
                      <div>Conversation: {supportCase.conversationId || "None"}</div>
                      <div>Latest event: {supportCase.latestMessageEventId || "None"}</div>
                      <div>{supportCase.summary || "No summary"}</div>
                    </div>
                  )) : <div className="text-sm text-[#6E5D4D]">No linked support cases found.</div>}
                </div>
              </Panel>
            </section>

            <Panel title="Unified interaction history">
              <div className="space-y-3">
                {events.length ? events.map((entry) => (
                  <div key={entry.messageEventId} className="rounded-xl border border-[#D6C3A3]/35 bg-white/85 px-4 py-3 text-sm">
                    <div className="font-medium">{entry.channel} / {entry.direction} / {entry.eventType}</div>
                    <div>Conversation: {entry.conversationId || "None"}</div>
                    <div>Case: {entry.supportCaseId || "None"}</div>
                    <div>Identity key: {entry.externalIdentityKey || "None"}</div>
                    <div className="mt-2">{entry.contentText || entry.contentPayloadRef || "No content"}</div>
                    <div className="text-xs text-[#8A7764]">{entry.recordedAt}</div>
                  </div>
                )) : <div className="text-sm text-[#6E5D4D]">No canonical timeline events found.</div>}
              </div>
            </Panel>
          </>
        ) : (
          <section className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-6 text-sm text-[#6E5D4D]">
            Enter a `userProfileId`, `authIdentityId`, `sessionId`, or `lineUserId` to inspect the canonical unified timeline.
          </section>
        )}
      </div>
    </main>
  );
}

function Card({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-5 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
      <div className="text-sm text-[#8A7764]">{title}</div>
      <div className="mt-2 text-2xl font-light">{value}</div>
      <div className="mt-3 text-xs text-[#6E5D4D]">{note}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-6 shadow-[0_20px_56px_rgba(59,47,47,0.06)]">
      <h2 className="text-xl font-light">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#FCFAF6] px-4 py-3">
      <dt className="text-[#8A7764]">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
