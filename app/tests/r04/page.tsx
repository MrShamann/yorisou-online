import type { Metadata } from "next";

import { NamePairFlow } from "../_components/SpecAssessmentFlow";
import { r04Runtime } from "@/lib/yorisou-tests/r04";

export const metadata: Metadata = {
  title: "名前相性チェック | Yorisou",
  description: "ふたりの呼び名をきっかけに距離感のヒントを軽く受け取る公開チェックです。",
};

export default function R04Page() {
  return <NamePairFlow runtime={r04Runtime} />;
}
