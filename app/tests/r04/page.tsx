import { redirect } from "next/navigation";

// AIX-3D-2 — /tests/r04 consolidated. The name-compatibility ("名前相性") flow
// draws a seeded result from two names — a divination mechanic outside the
// platform's non-divination positioning, and not in the canonical catalogue.
// Redirect to the Understand entry; the engine is preserved in lib/.
export default function R04Page() {
  redirect("/tests");
}
