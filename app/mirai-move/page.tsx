import type { Metadata } from "next";

import MiraiMoveView from "@/app/prototype/corporate/_views/MiraiMoveView";
import { FINAL_ROUTES, MIRAI_MOVE } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — final-route candidate. LOCAL ONLY: this branch is never pushed and never deployed.
 * The page is a thin wrapper: the accepted CORP-P3R1 view is rendered with the final URL set, so
 * there is exactly one corporate implementation and `/prototype/corporate/**` stays available for
 * evidence comparison.
 */
export const metadata: Metadata = {
  title: "Mirai Move — Yorisou",
  description: MIRAI_MOVE.line,
};

export default function MiraiMovePage() {
  return <MiraiMoveView routes={FINAL_ROUTES} />;
}
