import Link from "next/link";

import { requireAdminViewer } from "@/lib/server/foundation/access";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import type { AuditLog } from "@/lib/server/foundation/schema";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  await requireAdminViewer();
  const auditEntries = (await privacyAuditService.listRecentAuditEntries(100)).filter((entry): entry is AuditLog => Boolean(entry));

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <Link href="/admin" className="text-sm text-[#6E5D4D] underline underline-offset-4">Back to admin</Link>
          <h1 className="text-3xl font-light">Audit</h1>
        </header>

        <div className="space-y-3">
          {auditEntries.map((entry) => (
            <div key={entry.auditLogId} className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-5 text-sm">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="font-medium">{entry.action}</div>
                <div className="text-xs text-[#8A7764]">{entry.createdAt}</div>
              </div>
              <div className="mt-2 text-[#6E5D4D]">{entry.summary}</div>
              <div className="mt-2 text-xs text-[#8A7764]">
                resource={entry.resourceType}:{entry.resourceId || "none"} / sensitive={String(entry.containsSensitiveAccess)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
