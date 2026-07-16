import { requireAdminViewer } from "@/lib/server/foundation/access";
import CandidateReviewView from "./CandidateReviewView";

// CIF-1 internal candidate review. Server-gated: non-admins are redirected by
// requireAdminViewer(). Not linked from any normal-user navigation.
export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  await requireAdminViewer();
  return <CandidateReviewView />;
}
