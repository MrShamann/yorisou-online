import type { Metadata } from "next";

import { RelationshipPairFlow } from "../_components/SpecAssessmentFlow";
import { r01Runtime } from "@/lib/yorisou-tests/r01";

export const metadata: Metadata = {
  title: "ふたり恋愛相性診断 | Yorisou",
  description: "ふたりの連絡の温度、距離感、話し合い方をやさしく見直す公開チェックです。",
};

export default function R01Page() {
  return <RelationshipPairFlow runtime={r01Runtime} />;
}
