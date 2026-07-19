import { redirect } from "next/navigation";

// AIX-3D-2 — /tests/r01 consolidated. The couple-compatibility ("相性診断") flow
// was not part of the canonical Understand catalogue and its compatibility
// framing sits outside the platform's non-divination positioning. Redirect to
// the canonical Understand entry; the underlying engine is preserved in lib/.
export default function R01Page() {
  redirect("/tests");
}
