import OpenTestingControlRoom from "./OpenTestingControlRoom";

import { getReleaseMarker } from "@/lib/releaseMarker";
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
  const releaseMarker = getReleaseMarker();

  return (
    <main className="min-h-[100dvh] bg-[#F6F3EC] px-4 py-6 text-[#2F2926] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <OpenTestingControlRoom dashboard={dashboard} followUps={followUps} releaseMarker={releaseMarker} />
      </div>
    </main>
  );
}
