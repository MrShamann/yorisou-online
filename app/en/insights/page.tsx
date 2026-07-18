import { redirect } from "next/navigation";

// AIX-3D-1 (Part D) — English Option B. The stale English "insights" marketing
// surface is consolidated into the English overview. English is an informational
// surface; there is no parallel English content product.
export default function InsightsPageEn() {
  redirect("/en");
}
