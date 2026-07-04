import OpenTestingControlRoom from "./OpenTestingControlRoom";

import { requireAdminViewer } from "@/lib/server/foundation/access";
import { evaluateOpenTestingFollowUps, getOpenTestingDashboardSnapshot } from "@/lib/server/relationship-intelligence/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Open Testing Dashboard | Yorisou",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OpenTestingDashboardPage() {
  await requireAdminViewer();
  const [dashboard, followUps] = await Promise.all([
    getOpenTestingDashboardSnapshot(),
    evaluateOpenTestingFollowUps(),
  ]);

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10 text-[#3B2F2F]">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold tracking-[0.14em] text-[#6E5D4D]">INTERNAL DASHBOARD</p>
          <h1 className="text-3xl font-light">Open Testing Operations Control Room</h1>
          <p className="max-w-3xl text-sm text-[#6E5D4D]">
            Founder-only view for real-user open-testing funnel health, durable feedback review, relationship inspection, and safe queue-first follow-up operations.
          </p>
        </header>

        <OpenTestingControlRoom dashboard={dashboard} followUps={followUps} />
      </div>
    </main>
  );
}
