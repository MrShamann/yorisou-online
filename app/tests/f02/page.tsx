import type { Metadata } from "next";

import { RuleBasedTestFlow } from "../_components/SpecAssessmentFlow";
import { f02Runtime } from "@/lib/yorisou-tests/f02";

export const metadata: Metadata = {
  title: "職場環境フィット診断 | Yorisou",
  description: "音や空間、距離感、裁量の相性から合いやすい職場環境の方向を見る公開診断です。",
};

export default function F02Page() {
  return <RuleBasedTestFlow runtime={f02Runtime} />;
}
