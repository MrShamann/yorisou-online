import type { Metadata } from "next";

import MiraiMoveView from "../_views/MiraiMoveView";
import { MIRAI_MOVE, PROTOTYPE_ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "Mirai Move — Yorisou",
  description: MIRAI_MOVE.line,
  robots: { index: false, follow: false },
};

/** Every claim here traces to mirai-move/PROJECT_START_HERE.md — see the CORP-P2 claim ledger. */

/** Evidence-comparison surface. Same view as the final-route candidate, prototype URLs. */
export default function MiraiMovePage() {
  return <MiraiMoveView routes={PROTOTYPE_ROUTES} />;
}
