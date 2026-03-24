import Link from "next/link";

import { requireAdminViewer } from "@/lib/server/foundation/access";
import { adminFoundationService } from "@/lib/server/foundation/adminService";
import type { UserProfile } from "@/lib/server/foundation/schema";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requireAdminViewer();
  const params = (await searchParams) || {};
  const q = typeof params.q === "string" ? params.q : "";
  const users = (await adminFoundationService.getUserList(q)).filter((entry): entry is UserProfile => Boolean(entry));

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <Link href="/admin" className="text-sm text-[#6E5D4D] underline underline-offset-4">Back to admin</Link>
          <h1 className="text-3xl font-light">Users</h1>
        </header>

        <form className="rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name, city, email, line id hint, or profile id"
            className="w-full rounded-xl border border-[#D6C3A3]/35 bg-[#FFFCF6] px-4 py-3"
          />
        </form>

        <div className="space-y-3">
          {users.map((user) => (
            <Link key={user.userProfileId} href={`/admin/users/${user.userProfileId}`} className="block rounded-2xl border border-[#D6C3A3]/35 bg-white/82 p-5">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">{user.profile.displayName}</div>
                  <div className="text-sm text-[#6E5D4D]">{user.userProfileId}</div>
                </div>
                <div className="text-sm text-[#6E5D4D]">{user.profile.city || "No city"} / {user.profile.role || "No role"}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
