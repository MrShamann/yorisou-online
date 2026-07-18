import { redirect } from "next/navigation";

// AIX-3D-1 — /insights consolidated. The "Yorisou Notes" themes duplicated the
// understand-your-state entry and linked into per-test flows on the stale
// surface system. Redirect to the canonical Understand entry (理解する) so the
// launch surface exposes one entry, not a parallel stale one.
export default function InsightsPage() {
  redirect("/tests");
}
